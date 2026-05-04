# Workflow Test Report — Chương trình đào tạo (B2 — CTĐT push DA_DUYET) — Trụ B

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Phase:** P2 Workflow • **Plan ref:** [`tasks/todo.md` §P2 Trụ B B2](../../../tasks/todo.md) • **Date:** 2026-04-27
> **Tester:** QA Automation via Claude Code (Chrome DevTools MCP)
> **Round:** Round 5
> **State Machine:** Stepper FE 5 state (`Dự thảo → Chờ duyệt → Đã duyệt → Đang thực hiện → Hoàn thành`) trên CTĐT
> **Input flow:** [`input/flow-module.md §6 SM-KHOAHOC`](../../../input/flow-module.md) (CTĐT entity cha — bước Gửi/Phê duyệt CTĐT trước khi tạo Khóa học)
> **SRS ref:** [`input/srs-v3/srs-fr-03-dao-tao.md` FR-III-01 (UC20)](../../../input/srs-v3/srs-fr-03-dao-tao.md)
> **Seed precondition:** [`seed-checklist-CTDT.md`](../seed/seed-checklist-CTDT.md) — 6 CTĐT `Dự thảo`

---

## Verdict

✅ **PASS** — Toàn bộ 6/6 CTĐT đã chuyển `Dự thảo → Chờ duyệt → Đã duyệt`. Combobox CTĐT trong form Tạo Khóa học (B3) lọc đúng 6/6.

| Metric | Giá trị |
|--------|---------|
| Happy path Dự thảo → Chờ duyệt | 6/6 PASS (CTDT-0001..0006, cb_nv_tw_01) |
| Happy path Chờ duyệt → Đã duyệt | 6/6 PASS (CTDT-0001..0006, cb_pd_tw_01) |
| Verify list cột Trạng thái | 6/6 hiển thị "Đã duyệt" |
| Verify combobox B3 (FE filter `trangThai=DA_DUYET`) | 6/6 PASS (đủ 6 CTĐT hiển thị) |
| Bug mới (SRS-ref) | 0 |
| Observation (out-of-SRS) | 1 — Detail page hiển thị nút `Phê duyệt`/`Từ chối` cho CB NV |
| **Gate cho B3 (Tạo Khóa học)** | ☑ PASS (6 CTĐT `Đã duyệt` sẵn sàng cho fixture v2.5 8 variant) |

---

## Accounts dùng

| Role | Username | Cấp | Ghi chú |
|------|----------|-----|---------|
| CB NV TW | `cb_nv_tw_01` | TW | Bước 1 — Gửi phê duyệt |
| CB PD TW | `cb_pd_tw_01` | TW | Bước 2 — Phê duyệt |

Cấp TW (BTP-TW) đồng cấp giữa 2 acc — đáp ứng guard BR-AUTH-05.

---

## 1. Happy Path — Dự thảo → Chờ duyệt → Đã duyệt (6/6 CTĐT)

| Bước | State chuyển | Tác nhân | Thao tác | API endpoint | Result |
|:----:|--------------|----------|----------|--------------|:------:|
| **1** | (seed) `Dự thảo` | — | 6 CTĐT từ B1 (CTDT-BTP-TW-2026-0001..0006) | (seed POST đã có) | ☑ PASS |
| **2** | `Dự thảo → Chờ duyệt` (×6) | CB NV (`cb_nv_tw_01`) | Mở từng CTDT → click `[Gửi phê duyệt]` → confirm modal "Gửi phê duyệt?" | `POST /api/v1/chuong-trinh-dao-taos/{id}/submit` [200] × 6 | ☑ PASS 6/6 |
| **3** | `Chờ duyệt → Đã duyệt` (×6) | CB PD (`cb_pd_tw_01`) | Mở từng CTDT → click `[Phê duyệt]` → confirm modal "Xác nhận phê duyệt?" | `POST /api/v1/chuong-trinh-dao-taos/{id}/approve` [200] × 6 | ☑ PASS 6/6 |
| **4** | (verify) | CB NV | Reload list `/dao-tao/chuong-trinh/danh-sach` → cột Trạng thái 6/6 = `Đã duyệt` | `GET /chuong-trinh-dao-taos?page=1&pageSize=20` [200] | ☑ PASS |

### Lịch sử phê duyệt (FE render)
Mỗi CTĐT có audit entry `GUI_DUYET (Dự thảo → Chờ duyệt) — CB Nghiệp vụ TW 01` + entry `PHE_DUYET (Chờ duyệt → Đã duyệt) — CB Phê duyệt TW 01`.

### Danh sách CTĐT đã DA_DUYET

| # | Mã | Tên | Lĩnh vực | id |
|---|----|-----|----------|----|
| 1 | CTDT-BTP-TW-2026-0001 | CTĐT 2026 - Pháp luật cho DN nhỏ | Kinh doanh thương mại | `b1bd1b93-9f33-455b-9385-6490daa39c1d` |
| 2 | CTDT-BTP-TW-2026-0002 | CTĐT 2026 - ATLĐ ngành xây dựng | Lao động | `769eeffc-8851-4119-8d04-c72d6f35de63` |
| 3 | CTDT-BTP-TW-2026-0003 | CTĐT 2026 - SHTT cho startup | Sở hữu trí tuệ | `048a9b54-b15e-4cdf-b422-d950b02e7117` |
| 4 | CTDT-BTP-TW-2026-0004 | CTĐT 2025 - Luật đất đai | Đất đai | `60277aa0-b7e7-48f5-af32-3d0684f5c7ad` |
| 5 | CTDT-BTP-TW-2026-0005 | CTĐT 2026 - Luật thuế DN xuất khẩu | Dân sự *(B1 retry chưa save Thuế)* | `8bec442f-41f4-4241-9152-6bc2579fe395` |
| 6 | CTDT-BTP-TW-2026-0006 | CTĐT 2026 - HĐ thương mại khu vực ĐP-DN | Kinh doanh thương mại *(fallback HOP_DONG)* | `9ed8ddc1-c130-4bd9-911c-ac711fd1f8ef` |

---

## 2. Verify gate cho B3 — combobox CTĐT trong form Tạo Khóa học

Path: `/dao-tao/khoa-hoc/tao-moi` → click combobox "Chương trình đào tạo".

| Tiêu chí | Kỳ vọng | Thực tế | Result |
|----------|---------|---------|:------:|
| Helper text combobox | "Chỉ hiển thị các chương trình đã được phê duyệt" | "Chỉ hiển thị các chương trình đã được phê duyệt" | ☑ PASS |
| Số lựa chọn hiển thị | 6 (tất cả CTĐT `Đã duyệt`) | 6 (`CTDT-BTP-TW-2026-0001..0006`) | ☑ PASS |
| Sort dropdown | Mới nhất trước (DESC) | CTDT-0006 → CTDT-0001 | ☑ PASS |

→ B3 (Khóa học CREATE) đã unblock với 6 CTĐT `Đã duyệt` đa lĩnh vực (Kinh doanh thương mại × 2 + Lao động + Sở hữu trí tuệ + Đất đai + Dân sự) — đủ scope cho fixture v2.5 8 variant. Đây là gap đã từng block cross-round 3 lần (memory `qa_htpldn_khoahoc_seed_round4`, `qa_htpldn_khoahoc_cr_round1`, `qa_htpldn_khoahoc_cr_round2`).

---

## 3. Bug mới (SRS-ref)

Không có bug SRS-ref mới.

---

## 4. Quan sát ngoài SRS (không log bug)

- **O1 — Detail page CTĐT hiển thị nút `Phê duyệt`/`Từ chối` cho CB NV (acc `cb_nv_tw_01`).** Sau khi cb_nv_tw_01 click `Gửi phê duyệt` (Bước 2 → state Chờ duyệt), detail page render 2 nút workflow `[Phê duyệt]` + `[Từ chối]` cho chính tài khoản CB NV vừa gửi. Theo BR-AUTH-05 (CB PD cùng cấp duyệt) chỉ CB PD mới được thấy. Chưa kiểm chứng BE accept/reject — nếu BE 403 thì là **FE leak only** (cần FE hide nút theo role); nếu BE accept thì là **Critical authz bug** (CB NV tự duyệt sản phẩm của chính mình, vi phạm separation of duty BR-FLOW-03). SRS FR-III-01 không spec rõ ai thấy nút trên detail nên không log SRS-ref bug — đã raise quan sát để BA + dev xác nhận.
- **O2 — Stepper detail page có 5 state** (Dự thảo / Chờ duyệt / Đã duyệt / Đang thực hiện / Hoàn thành) — list filter có 7 tab (5 state đầu + Hoàn thành + Hủy). State `Đang thực hiện` + `Hoàn thành` xuất hiện trên CTĐT chứ không chỉ Khóa học → CTĐT có lifecycle riêng đầy đủ, **mâu thuẫn với `flow-module.md` line 153** ("CTĐT là CRUD thường — không có workflow phê duyệt"). Đề nghị BA cập nhật flow-module thêm SM-CTDT (3+ state) hoặc clarify CTĐT chỉ có 3 state đầu (DU_THAO/CHO_DUYET/DA_DUYET) còn `Đang thực hiện`/`Hoàn thành` là derived từ state Khóa học con.

---

## 5. API verify

| Action | Method + Endpoint | Status | Số lần |
|--------|-------------------|--------|--------|
| Gửi phê duyệt | `POST /api/v1/chuong-trinh-dao-taos/{id}/submit` | 200 | 6 |
| Phê duyệt | `POST /api/v1/chuong-trinh-dao-taos/{id}/approve` | 200 | 6 |
| Reload detail (verify state) | `GET /api/v1/chuong-trinh-dao-taos/{id}` | 200 | 12 |
| Lịch sử phê duyệt | `GET /api/v1/chuong-trinh-dao-taos/{id}/lich-su-phe-duyet` | 200 | 12 |
| List sau approve | `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=20` | 200 | 6/6 trangThai=DA_DUYET |

---

## 6. Ảnh chụp

- [Bước 2 — sau khi `cb_nv_tw_01` Gửi phê duyệt CTDT-0001 (state Chờ duyệt + lộ nút Phê duyệt/Từ chối — O1)](../screenshots/ctdt-b2-cbnv-after-submit-CHO_DUYET.png)
- [Bước 3 — sau khi `cb_pd_tw_01` Phê duyệt CTDT-0001 (state Đã duyệt + lịch sử GUI_DUYET)](../screenshots/ctdt-b2-cbpd-after-approve-DA_DUYET.png)
- [Verify list 6/6 CTĐT cột Trạng thái = "Đã duyệt"](../screenshots/ctdt-b2-list-6of6-DA_DUYET.png)
- [Verify combobox CTĐT trong form Tạo Khóa học (6/6 hiển thị)](../screenshots/ctdt-b2-verify-dropdown-khoahoc-6of6.png)
- [Verify combobox lần đầu (snapshot 1/6 — chỉ CTDT-0001 sau pass đầu)](../screenshots/ctdt-b2-verify-dropdown-khoahoc-1of6.png)

---

## 7. Cascade impact

- **B3** (Khóa học CREATE 8 fixture variant) UNBLOCK — đủ 6 CTĐT đa lĩnh vực trong dropdown cho test scope.
- **B7** (Workflow Khóa học đầy đủ 10 bước) UNBLOCK chuỗi seed (cần B3+B4+B5+B6 PASS trước).
- **Bulk approve KHÔNG có** trên màn list — phải lặp 12 lần (6 submit + 6 approve, 2 vòng login). Tổng thời gian: ~10 phút (gồm 2 lần login OTP).

---

*2026-04-27 10:25 — QA chạy bằng Chrome DevTools MCP, accounts `cb_nv_tw_01` + `cb_pd_tw_01` (isolated context cho mỗi role). Run-1 09:35-09:38 push CTDT-0001 (1/6). Run-2 10:21-10:25 push 5 CTĐT còn lại (0002-0006) sau user feedback yêu cầu xử lý đầy đủ 6/6.*
