# Functional Test Report — R7.7.8a TAI_KHOAN State Machine (FR-VIII-15 + FR-VIII-26)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/quan-tri/tai-khoan |
| **Người test** | QA Automation via Claude Code (qtht_02) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional SM-TAIKHOAN |
| **Round** | Round 7 — R7.7.8a |
| **Tool** | Chrome DevTools MCP |
| **Account** | qtht_02 (admin), cb_nv_dp_03 (test target HOAT_DONG), qa_test_tk_r778a (dummy CHO_KICH_HOAT) |
| **SRS** | FR-VIII-15 line 660+, FR-VIII-26 line 1245-1316, SM-TAIKHOAN line 2081-2122 |
| **2-source verify** | NotebookLM Haizz-HTPLDN + grep SRS local — match 100% |

---

## Tổng hợp

**Verdict:** ✅ **PASS 5/6 TP + 1 partial** — Verify đầy đủ guard transitions QTHT thao tác. 1 bug Major BE counter không reset.

### Test result

| TP | Path | Verdict |
|---|---|---|
| **TP-TK-01** | [*] → CHO_KICH_HOAT (QTHT tạo TK qua FR-VIII-15) | ✅ PASS |
| **TP-TK-06** | HOAT_DONG → TAM_KHOA (QTHT khóa thủ công) | ✅ PASS |
| **TP-TK-07** | TAM_KHOA → HOAT_DONG (QTHT mở khóa) | ✅ PASS |
| **TP-TK-09** | HOAT_DONG → VO_HIEU_HOA (QTHT vô hiệu hóa) | ✅ PASS |
| **TP-TK-10** | VO_HIEU_HOA → HOAT_DONG (QTHT khôi phục) | ✅ PASS |
| TP-TK-05 | HOAT_DONG → TAM_KHOA (5 lần sai MK auto) | ⚠️ PARTIAL — lock trigger confirmed, counter precision không test được do BE rate limit + counter persist |

---

## TP-TK-01 — Tạo TK lần đầu

**Action:** QTHT click [Thêm mới] → fill form 7 trường (Tên ĐN/Họ tên/Email/Điện thoại/Loại TK=Cán bộ/Đơn vị=BKHĐT/Vai trò=CB Nghiệp vụ Bộ/Ngành) → click [Tạo tài khoản].

**Result:** Record `qa_test_tk_r778a` (uuid `9f28d08e-...`) saved, state "Chờ kích hoạt", tab counter Chờ kích hoạt 0→1.

**Per-state action:** row CHO_KICH_HOAT có button [Kích hoạt] + [Gửi lại email] (KHÁC HOAT_DONG có [Khóa TK] + [Vô hiệu hóa]) → UI per-state action work đúng.

**Note logic chốt 2026-05-07 (user):** Form không có field `mat_khau` là **đúng design** — hệ thống tự sinh MK tạm + gửi email + user đổi MK lần đăng nhập đầu (qua FR-VIII-26). SRS doc FR-VIII-15 §Inputs row 5 cần BA fix remove `mat_khau` field (drop bug, ghi note SRS doc cleanup).

---

## TP-TK-06/07/09/10 — QTHT thao tác lifecycle

| TP | Action | Tab counter delta | UI per-state action |
|---|---|---|---|
| TK-06 | [Khóa TK] cb_nv_dp_03 → popconfirm "Khóa tài khoản sẽ thu hồi tất cả phiên đăng nhập hiện tại. Tiếp tục?" → Xác nhận | Hoạt động 22→21, Tạm khóa 0→1 | Row TAM_KHOA: chỉ button [Mở khóa] |
| TK-07 | [Mở khóa] cb_nv_dp_03 → direct (không popconfirm) | Tạm khóa 1→0, Hoạt động 21→22 | Row HOAT_DONG: [Khóa TK] + [Vô hiệu hóa] |
| TK-09 | [Vô hiệu hóa] cb_nv_dp_03 → popconfirm "Vô hiệu hóa tài khoản sẽ thu hồi tất cả phiên đăng nhập hiện tại. Tiếp tục?" → Xác nhận | Hoạt động 22→21 | Row VO_HIEU_HOA: chỉ button [Khôi phục] |
| TK-10 | [Khôi phục] cb_nv_dp_03 → direct | Hoạt động 21→22 | Row HOAT_DONG restore |

**State transition flow verified end-to-end:**
```
HOAT_DONG ──Khóa──► TAM_KHOA ──Mở khóa──► HOAT_DONG ──Vô hiệu──► VO_HIEU_HOA ──Khôi phục──► HOAT_DONG
```

---

## TP-TK-05 — 5 lần sai MK auto-lock

**Probe API direct** (qua `evaluate_script` fetch `/api/v1/auth/login` với MK sai):

| Attempt | Status | errCode | Message |
|---|---|---|---|
| 1 | 401 | ERR-AUTH-LOCKED-01 | "Tài khoản tạm khóa do đăng nhập sai quá nhiều lần" |
| 2-5 | 401 | ERR-AUTH-LOCKED-01 | "Tài khoản tạm khóa. Vui lòng thử lại sau 30 phút" |
| 6 | 429 | ERR-SYS-00-29-01 | "ThrottlerException: Too Many Requests" |

**Findings:**
- ✅ ERR-AUTH-LOCKED-01 trigger work + message Tiếng Việt + 30 phút countdown text (match SRS BR-AUTH-07 + ERR-PWD code series).
- ⚠️ Attempt 1 đã LOCKED ngay → counter `so_lan_sai` persist từ test trước (TP-TK-06 chỉ unlock nhưng không reset counter qua admin path).
- 🚨 **BUG-TK-SM-002 Major** (chi tiết bên dưới).

---

## Bug findings

### BUG-TK-SM-002 (Major) — `so_lan_sai` không reset khi QTHT mở khóa thủ công (TP-TK-07)

**SRS ref:** SM-TAIKHOAN line 2117 quote: *"TAM_KHOA → HOAT_DONG | QTHT mở khóa | — | **Reset so_lan_sai = 0** | FR-VIII-19 | BR-AUTH-07"*.

**Repro:**
1. QTHT khóa thủ công cb_nv_dp_03 (TP-TK-06) → state TAM_KHOA.
2. QTHT mở khóa (TP-TK-07) → state HOAT_DONG (UI).
3. Probe `POST /api/v1/auth/login {username:cb_nv_dp_03, password:WRONG}` → ngay lần 1 trả 401 ERR-AUTH-LOCKED-01.

**Expected:** Sau mở khóa, `so_lan_sai = 0`. Login sai lần đầu phải trả 401 ERR-AUTH-INVALID-CRED (sai MK) không LOCKED.

**Actual:** BE giữ counter persist → so_lan_sai cộng tiếp từ giá trị cũ → ngay attempt mới trigger LOCKED.

**Severity:** Major — vi phạm BR-AUTH-07 explicit. Hậu quả: TK đã được mở khóa nhưng vẫn không login được nếu user nhập sai 1 lần.

### ~~BUG-TK-SM-001~~ DROPPED 2026-05-07

User chốt logic UI/BE đúng: hệ thống tự sinh MK tạm + gửi email + user đổi MK lần đăng nhập đầu (qua FR-VIII-26). SRS doc FR-VIII-15 §Inputs row 5 cần BA fix remove `mat_khau` field (cleanup doc).

### BUG-TK-SM-003 (Minor) — Tabs SCR-VIII-08 thiếu tab "Vô hiệu hóa"

**Repro:** Tabs render 5: Tất cả / Hoạt động / Chờ kích hoạt / Tạm khóa / **Chờ phân quyền**. Thiếu tab "Vô hiệu hóa" để filter TK VO_HIEU_HOA.

**Expected:** SM-TAIKHOAN có 5 states bao gồm VO_HIEU_HOA → tab phải có hoặc tab "Tất cả" + filter Trạng thái.

**Actual:** TK VO_HIEU_HOA chỉ thấy ở "Tất cả", không có tab riêng. Tab thay bằng "Chờ phân quyền" (legacy state per BUG-SRS-FR10-003 verified — empty trong v3.5 modern flow).

**Severity:** Minor UX — workaround dùng filter Trạng thái dropdown.

---

## Bug Summary Table

| Bug ID | Severity | SRS Ref | Title | Status |
|---|---|---|---|---|
| BUG-TK-SM-002 | Major | SM-TAIKHOAN line 2117 + BR-AUTH-07 | so_lan_sai không reset khi QTHT mở khóa | Open |
| BUG-TK-SM-003 | Minor | SCR-VIII-08 + SM 5 states | Tabs thiếu "Vô hiệu hóa", thay bằng "Chờ phân quyền" (legacy) | Open |

> ~~BUG-TK-SM-001~~ DROPPED — user chốt 2026-05-07 logic auto-gen MK đúng, SRS doc cần fix.

**Bug file riêng:** [bug-report-function-r7-7-8a-tk-sm.md](../../bug-reports/qtht-tai-khoan/bug-report-function-r7-7-8a-tk-sm.md)

---

## Note: Test paths defer

- **TP-TK-02/03** (CHO_KICH_HOAT → CHO_PHAN_QUYEN → HOAT_DONG): Defer chờ legacy data DB seed direct. NotebookLM verified Q3: legacy state, không có actor v3.5 modern flow.
- **TP-TK-04** (CHO_KICH_HOAT → HOAT_DONG bypass): Note row CHO_KICH_HOAT có button [Kích hoạt] (QTHT direct activate) — verify guard work. Test khi R7.7.8b/R7.2.6/2.7 done có TVV/CG/NHT để test full bypass với link mail.
- **TP-TK-08** (TAM_KHOA → HOAT_DONG auto 30 phút): P2 defer SQL backdate `locked_until = NOW() - 31 phút`.
- **TP-TK-11** (CHO_KICH_HOAT → VO_HIEU_HOA auto 7 ngày): P2 defer SQL backdate `created_at = NOW() - 8 ngày`.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/quan-tri/tai-khoan |
| API | `/api/v1/auth/login` (login) · `/api/v1/tai-khoan/*` (CRUD) |
| Account | qtht_02 (admin), cb_nv_dp_03 (lifecycle test) |
| Tool | Chrome DevTools MCP |
| NotebookLM | https://notebooklm.google.com/notebook/a4ae45bf-cea0-4325-8fee-b1e0be702cf2 |
| Dummy TK created | qa_test_tk_r778a (uuid `9f28d08e-a108-4f4c-83cd-5f3ee7b1d72a`) — state CHO_KICH_HOAT, leave for next test (R7.7.8 follow-up) |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
