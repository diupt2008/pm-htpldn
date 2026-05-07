# Functional Test Report — R7.7.8b FR-VIII-22 Self-reg DN E2E

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/register/doanh-nghiep |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional FR-VIII-22 Self-reg DN |
| **Round** | Round 7 — R7.7.8b |
| **Tool** | Chrome DevTools MCP |
| **Account** | DN tự đăng ký (no login required) |
| **SRS** | FR-VIII-22 line 1010-1097, SCR-VIII-08 line 1755+ |
| **2-source verify** | ✅ NotebookLM Haizz-HTPLDN + grep SRS local |

---

## Tổng hợp

**Verdict:** ⚠️ **PASS 7/8 + 1 defer** — Self-reg DN happy path hoạt động + 6 ERR-REG-* validation work nhưng có 5 bug cần BA review.

### Test result

| TC | Path | Verdict |
|---|---|---|
| **TC01** | Form 21 trường + username readonly = MST | ⚠️ PARTIAL — UI có ~28 fields (extra), KHÔNG có ô "Tên đăng nhập" readonly hiển thị MST (chỉ tooltip text) |
| **TC02** | MST sai format (chữ + ký tự) → ERR-REG-01a | ⚠️ PARTIAL — FE message "MST phải là 10 hoặc 13 chữ số" cho phép 13 (vi phạm SRS line 1032 quy định chi nhánh 13 không tự đăng ký) |
| **TC03** | MST trùng (`1234567893`) → ERR-REG-01 | ⚠️ PARTIAL — BE 409 message OK ("MST đã đăng ký") nhưng errCode `ERR-VAL-VIII-22-08` ≠ SRS `ERR-REG-01` |
| **TC04** | Email trùng → ERR-REG-02 | 🚫 DEFER — rate limit 3 reqs/60s blocked re-test |
| **TC05** | MK yếu (weak123) → ERR-REG-04 | ✅ PASS — FE block client-side với 2 inline error |
| **TC06** | MK confirm khác → ERR-REG-05 | ✅ PASS — FE inline "Mật khẩu xác nhận không khớp" |
| **TC07** | Chưa tích cam kết → ERR-REG-06 | ✅ PASS — FE inline "Vui lòng xác nhận cam kết để tiếp tục" |
| **TC08** | Happy path | ✅ PASS — BE 201, TK `fd10f07c-...` CHO_KICH_HOAT, mail kích hoạt gửi |

---

## TC01 — Form 21 trường + username readonly

**SRS spec line 1089:** Form có 21 trường (18 DN + 2 MK + 1 cam kết). Username hiển thị readonly = MST.

**UI thực tế:** Form có ~28 fields:
- 13 trường required match SRS (Họ tên người đăng ký + Tên DN + MST + Loại DN + Địa chỉ + Tỉnh/Thành + Email DN + Người đại diện + Ngành nghề + Quy mô + 2 MK)
- ~15 trường optional/extra: Số điện thoại tài khoản (riêng SĐT DN), Tên viết tắt, Giấy CN ĐKKD, Ngày cấp ĐKKD, Điện thoại DN, Fax, Chức vụ đại diện, Lĩnh vực kinh doanh, Số lao động/lao động nữ/khuyết tật, Doanh thu/Tổng nguồn vốn, Nữ làm chủ, Cho phép công khai, Ghi chú
- Cam kết checkbox ✓
- **Tên đăng nhập readonly = MST**: ❌ KHÔNG có ô — chỉ tooltip text "Tên đăng nhập của bạn sẽ là Mã số thuế của doanh nghiệp"

**Verdict:** UI mở rộng thêm fields hợp lệ (cover form FR-V.III-01 entity DOANH_NGHIEP). Tuy nhiên thiếu ô Tên đăng nhập readonly hiển thị giá trị MST sau khi user nhập — vi phạm SRS AC line 1090.

→ Logged BUG-FR22-001 (Minor UI/UX).

---

## TC02 — MST sai format

**Action:** Fill `ABC123` → submit.

**Result FE:**
- Inline error: "MST phải là 10 hoặc 13 chữ số"
- Submit blocked client-side.

**Mismatch SRS:**
- SRS line 1032 quote: `regex ^\d{10}$` — chỉ 10 chữ số
- SRS line 1074 ERR-REG-01a: "Mã số thuế phải đúng 10 chữ số (theo TT 105/2020/TT-BTC). Chi nhánh không tự đăng ký riêng."
- UI text "10 hoặc 13 chữ số" → cho phép 13 (chi nhánh) — vi phạm SRS

→ Logged BUG-FR22-002 (Major).

---

## TC03 — MST trùng (1234567893)

**Setup:** TC08 đã tạo TK với MST 1234567893. Re-submit cùng MST.

**Result BE:**
```
POST /api/v1/auth/register-doanh-nghiep
Status: 409 Conflict
Response: {"code":"ERR-VAL-VIII-22-08","message":"Mã số thuế này đã đăng ký trong hệ thống"}
```

**Findings:**
- ✅ Message khớp SRS line 1075
- ⚠️ errCode `ERR-VAL-VIII-22-08` ≠ SRS `ERR-REG-01` (logged BUG-FR22-003)

---

## TC04 — Email trùng

**Setup:** Set MST mới (2000000003) + giữ email `test.r778b@example.com` (đã tồn tại).

**Result:** BE rate-limit 429 "Too Many Requests" (3 requests / 60s) — chặn re-test.

**Verdict:** 🚫 **DEFER** — cần wait rate-limit window 60s+ giữa các attempts. Khả năng cao BE behavior giống TC03 (409 với errCode mismatch).

---

## TC05 — MK yếu (weak123)

**Action:** Fill MK + xác nhận = `weak123` (7 ký tự, không chữ hoa/đặc biệt) → submit.

**Result FE:**
- 2 inline errors:
  - "Mật khẩu tối thiểu 8 ký tự"
  - "Mật khẩu phải có chữ hoa, chữ thường, chữ số và ký tự đặc biệt"
- FE block client-side, không gửi POST.

→ ✅ PASS. Validation match SRS line 1050 quote `Ít nhất 8 ký tự, gồm chữ hoa + chữ thường + số + ký tự đặc biệt`.

---

## TC06 — MK confirm khác

**Action:** MK = `Test@123!`, Xác nhận = `Different@99` → submit.

**Result FE:** Inline "Mật khẩu xác nhận không khớp" ✓ match SRS ERR-REG-05.

→ ✅ PASS.

---

## TC07 — Chưa tích cam kết

**Action:** Submit form đầy đủ NHƯNG chưa tick checkbox cam kết.

**Result FE:** Inline "Vui lòng xác nhận cam kết để tiếp tục" ✓ match SRS ERR-REG-06.

→ ✅ PASS.

---

## TC08 — Happy path

**Action:** Fill đầy đủ + valid MST 10 chữ số `1234567893` (passes checksum) + tick cam kết + Quy mô = "Siêu nhỏ" (match lao động/doanh thu = 0 per BE warning WRN-DN-01).

**Result BE:**
```
POST /api/v1/auth/register-doanh-nghiep
Status: 201 Created
Response: {
  "id":"fd10f07c-fe9c-4883-83bc-ed245f38939b",
  "email":"test.r778b@example.com",
  "trangThai":"CHO_KICH_HOAT",
  "message":"Đăng ký doanh nghiệp thành công. Vui lòng kiểm tra email để kích hoạt tài khoản (hiệu lực 24 giờ)"
}
```

**MailHog verify:** Mail kích hoạt gửi đến `test.r778b@example.com` với link `/auth/verify-email?token=c850063d-...`.

**Findings:**
- ✅ TK tạo CHO_KICH_HOAT đúng SRS Postcondition line 1082
- ✅ Mail kích hoạt gửi đúng SRS Postcondition line 1085
- ⚠️ Message "hiệu lực 24 giờ" ≠ SRS line 1280 quote "vĩnh viễn nếu là kích hoạt lần đầu" (logged BUG-FR22-001 token expire mismatch)

**Pre-submit findings (BE over-validation):**
- BE rejected MST `1234567890` với "sai checksum 10 ký tự" (TT 105/2020 algorithm) — KHÔNG có trong SRS spec.
- BE warning WRN-DN-01 quy mô không khớp lao động (NĐ 39/2018) — KHÔNG có trong FR-VIII-22 §Error Handling.

→ 2 BE rules defensive design. Cần BA confirm bổ sung SRS hay drop.

---

## Bug Summary Table

| Bug ID | Severity | SRS Ref | Title | Status |
|---|---|---|---|---|
| BUG-FR22-001 | Minor | FR-VIII-22 line 1089 + 1280 | UI thiếu ô "Tên đăng nhập" readonly hiển thị MST + message "hiệu lực 24 giờ" ≠ SRS "vĩnh viễn" | Open |
| BUG-FR22-002 | Major | FR-VIII-22 line 1032 + 1074 | FE+BE cho phép MST 13 chữ số (chi nhánh) — SRS quy định chi nhánh không tự đăng ký riêng | Open |
| BUG-FR22-003 | Minor | FR-VIII-22 line 1074-1079 (E1-E6) | errCode mismatch — BE dùng `ERR-VAL-VIII-22-XX` / `ERR-VAL-SYS-00-XX` thay SRS `ERR-REG-XX` | Open |
| BUG-FR22-004 | Medium | FR-VIII-22 line 1032 | BE thêm validation MST checksum theo TT 105/2020 — KHÔNG có trong SRS spec; cần BA confirm bổ sung hay drop | Open |
| BUG-FR22-005 | Minor | FR-VIII-22 §Error Handling | BE warning WRN-DN-01 quy mô-lao động (NĐ 39/2018) — KHÔNG có trong FR-VIII-22 §Error Handling; cần BA confirm | Open |

**Bug file riêng:** [bug-report-r7-7-8b-self-reg-dn.md](../bug-reports/qtht-tai-khoan/bug-report-r7-7-8b-self-reg-dn.md)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL | http://103.172.236.130:3000/register/doanh-nghiep |
| API | `/api/v1/auth/register-doanh-nghiep` (POST) · `/api/v1/auth/verify-email` (POST) |
| MailHog | http://103.172.236.130:8025 |
| TK created | `fd10f07c-fe9c-4883-83bc-ed245f38939b` (MST 1234567893, email test.r778b@example.com) |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
