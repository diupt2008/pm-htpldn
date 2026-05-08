# Seed checklist — R7.2.7 Seed 3 NHT (FR-IV-NHT-01)

**Ngày chạy:** 2026-05-06 (R7)
**Account:** `qtht_02` (CB NV TW không có quyền tạo NHT cho ĐP — fixture instruction line 1150)
**Endpoint:** `POST /api/v1/nguoi-ho-tro` (singular, đã verify deploy R7.0.6)
**Fixture:** [seed-fixture.yaml v2.7.3 §nht_variants](../../../../input/data/seed-fixture.yaml) line 1143-1146
**SRS ref:** FR-IV-NHT-01 (entity NGUOI_HO_TRO mới R7) + FR-VIII-15 (auto-tạo TK)

## Kết quả

✅ **3/3 PASS** — pool NHT: `total=3`, `byState={CHO_KICH_HOAT:3}`, mỗi record có `taiKhoanId` ≠ null.

## Pool sau seed

| Mã NHT | Họ tên | Username | Đơn vị | Lĩnh vực | TK auto-tạo (state) |
|---|---|---|---|---|---|
| NHT-STP-AG-0001 | Phùng Thị NHT An Giang | nht_01 | STP-AG | DOANH_NGHIEP, LAO_DONG | a7641452... (CHO_KICH_HOAT) |
| NHT-STP-DN-0001 | Lương Văn NHT Đà Nẵng | nht_02 | STP-DN | THUONG_MAI→KINH_DOANH_TM, THUE | 0e4c38fd... (CHO_KICH_HOAT) |
| NHT-STP-HP-0001 | Đào Thị NHT Hải Phòng | nht_03 | STP-HP | SHTT→SO_HUU_TRI_TUE, DAT_DAI | 28bba7ce... (CHO_KICH_HOAT) |

## Permission finding

- `cb_nv_tw_02` (CB_NV_TW) → **403 ERR-NHT-02** "Bạn không có quyền tạo NHT cho đơn vị này" khi POST cho STP-AG/DN/HP.
- `qtht_02` (QTHT) → 201 cả 3 → tạo OK cross-cấp DP. Khớp fixture line 1150 ("QTHT hoặc CB NV cùng cấp").

## State machine note

NHT entity **không có workflow advance riêng** như TVV/CG. Seed → state target `CHO_KICH_HOAT` ngay + auto-tạo TAI_KHOAN role NHT cùng state `CHO_KICH_HOAT` qua FR-VIII-15. Đợi NHT click link mail kích hoạt → `HOAT_DONG` (FR-VIII-26).

## Per-filter verify

- `?size=100` → 3 records ✅
- `?trangThai=CHO_KICH_HOAT` → 3 records ✅
- 3 đơn vị distinct (STP-AG / STP-DN / STP-HP) ✅
- 6 lĩnh vực coverage (DN/LĐ/TM/Thuế/SHTT/Đất đai) ✅

## Downstream

- ⏳ T6 (R7.2.9): Click 3 link mail kích hoạt MailHog (cộng 6 từ CG sau T5) → đặt MK lần đầu → TK `HOAT_DONG`.

---

# R8 expand attempt — 2026-05-08 (qtht_02)

**Ngày chạy:** 2026-05-08 R8
**Account:** `qtht_02` (QTHT Test 02 — Cục Bổ trợ tư pháp - Bộ Tư pháp)
**Mục tiêu:** seed +5 NHT đệm cover TW (BTP) + BN (BKH/BTC) + ĐP (STP-BG/STP-CT) cho buffer R7.7.4.5 functional 10 TC.
**Route đã thử:** UI `Quản trị hệ thống → Tài khoản & phân quyền → Thêm mới` (chọn role `Người hỗ trợ`).
**Lý do chọn route:** SCR-IV-NHT-01/02/03 NHT screens chưa build (per [todo.md](../../../../tasks/todo.md) status), không có UI dedicated tạo NGUOI_HO_TRO entity.

## Kết quả

⚠️ **5/5 PASS tạo TAI_KHOAN role NHT — nhưng 0/5 NGUOI_HO_TRO entity record được auto-tạo.**

Pool NGUOI_HO_TRO entity sau R8: **total=4 (KHÔNG đổi so với R7 R1).**

## TAI_KHOAN role NHT đã tạo

| Username | Họ tên | Đơn vị | TK ID | TK State |
|---|---|---|---|---|
| nht_btp_tw_02 | NHT R8 Bộ Tư pháp 02 | Cục Bổ trợ tư pháp - Bộ Tư pháp | 5a59c3c6-975b-49e2-b88c-d798e3d3257f | CHO_KICH_HOAT |
| nht_bkh_bn_02 | NHT R8 Bộ Kế hoạch 02 | Bộ Kế hoạch và Đầu tư | a62e2abc-ee64-4235-bd1c-d1b33006e249 | CHO_KICH_HOAT |
| nht_btc_bn_02 | NHT R8 Bộ Tài chính 02 | Bộ Tài chính | be8cd7a0-60e5-46de-96bb-b039fa8b7dab | CHO_KICH_HOAT |
| nht_bg_dp_02 | NHT R8 STP Bắc Giang 02 | Sở Tư pháp Bắc Giang | 53fe34f6-0f95-4f45-a3b7-60f6988b3f3b | CHO_KICH_HOAT |
| nht_ct_dp_02 | NHT R8 STP Cần Thơ 02 | Sở Tư pháp Cần Thơ | 062210ec-be68-4a70-9564-8905d80c46ec | CHO_KICH_HOAT |

Bằng chứng: [evidence-r7-2-7-r8/r8-5-nht-pool-success.png](evidence-r7-2-7-r8/r8-5-nht-pool-success.png) — bảng tài khoản 1-20/45 mục, 5 record `Chờ kích hoạt` Người hỗ trợ ở đầu list.

## Pool NGUOI_HO_TRO entity (verify `GET /api/v1/nguoi-ho-tro?size=100`)

`meta = { total: 4, page: 1, pageSize: 20, totalPages: 1 }` — KHÔNG có 5 R8 records.

| maNht | hoTen | donViId | trangThai | taiKhoanId | Nguồn |
|---|---|---|---|---|---|
| NHT-BTP-TW-0001 | NHT UI Test 04 | (BTP TW) | CHO_KICH_HOAT | 9970fd31-... (nht_04_ui) | pre-existing test |
| NHT-STP-HP-0001 | Đào Thị NHT Hải Phòng | (STP-HP) | HOAT_DONG | 28bba7ce-... (nht_03) | R7 R1 + activated |
| NHT-STP-DN-0001 | Lương Văn NHT Đà Nẵng | (STP-DN) | HOAT_DONG | 0e4c38fd-... (nht_02) | R7 R1 + activated |
| NHT-STP-AG-0001 | Phùng Thị NHT An Giang | (STP-AG) | HOAT_DONG | a7641452-... (nht_01) | R7 R1 + activated |

## Phát hiện root cause

API asymmetry — POST tài khoản với role `Người hỗ trợ` qua endpoint `/api/v1/admin/tai-khoans` (form Tài khoản & phân quyền) **chỉ tạo TAI_KHOAN row + role mapping**, KHÔNG trigger NGUOI_HO_TRO profile auto-create.

FR-VIII-15 chỉ định nghĩa chiều ngược lại: tạo NHT (qua POST `/api/v1/nguoi-ho-tro`) → auto-tạo TAI_KHOAN. Không có spec cho chiều TAI_KHOAN role NHT → NGUOI_HO_TRO profile.

→ Để expand pool NGUOI_HO_TRO entity bắt buộc phải dùng POST `/api/v1/nguoi-ho-tro` (như R1) hoặc đợi SCR-IV-NHT-01 (form `Thêm NHT`) deploy.

## Tác động downstream

- **R7.7.4.5 NHT functional 10 TC** dep `≥1 NHT HOAT_DONG (✓3)` — vẫn thoả từ R7 R1 (3 NHT HOAT_DONG nht_01/02/03). KHÔNG block.
- 5 R8 TAI_KHOAN role NHT **vẫn dùng được cho test auth/permission/login flow của role NHT** (sau khi click mail kích hoạt). Không dùng được cho test NGUOI_HO_TRO entity CRUD/list/filter.
- Pool NGUOI_HO_TRO entity giữ nguyên 4 records — đủ cho R7.4.A3 workflow VV (cần ≥3 HOAT_DONG ✓3).

## Đề xuất cho user

Nếu cần expand pool NGUOI_HO_TRO entity ≥5 cho R7.7.4.5:
- (a) Cho phép API exception: dùng POST `/api/v1/nguoi-ho-tro` qua qtht_02 như R7 R1 đã làm.
- (b) Đợi dev build SCR-IV-NHT-01 form `Thêm NHT` rồi seed lại UI.
- (c) Giữ 4 NHT entity hiện tại + 5 TAI_KHOAN R8 — đủ test auth flow + dùng entity cũ cho list/filter test.

---

# R8 retry — 2026-05-08 (đúng route SCR-IV-NHT-01)

**Lý do retry:** User correction "phải dùng đúng tài khoản được phân quyền" → phát hiện route đúng `/nguoi-ho-tro` (sidebar `Mạng lưới Tư vấn viên → Người hỗ trợ pháp lý`) chỉ visible cho role CB_NV_TW/BN/DP, KHÔNG visible cho QTHT. R8 attempt #1 (qtht_02 → Tài khoản & phân quyền) chỉ chạm Form Tài khoản generic → tạo TAI_KHOAN không tạo entity.

**Accounts dùng:**

| Cấp | Account | Đơn vị | Mã NHT seed | LV |
|---|---|---|---|---|
| TW | cb_nv_tw_02 | Cục Bổ trợ tư pháp - BTP | NHT-BTP-TW-0002 | (default) |
| BN | cb_nv_bn_01 | Bộ Kế hoạch và Đầu tư | NHT-BKH-0001 | Doanh nghiệp |
| BN | cb_nv_bn_02 | Bộ Tài chính | NHT-BTC-0001 | Thuế |
| ĐP | cb_nv_dp_02 | Sở Tư pháp Bắc Giang | NHT-STP-BG-0001 | Lao động |
| ĐP | cb_nv_dp_03 | Sở Tư pháp Bắc Ninh | NHT-STP-BNI-0001 | SHTT |

## Kết quả

✅ **5/5 PASS — POST `/api/v1/nguoi-ho-tro` [201] cho cả 5 record.** Pool NGUOI_HO_TRO entity: **4 → 11** (auto-collect 2 record `NHT-BTP-TW-0003/0004` "hương 1/2" do user tạo manual).

## Pool global sau R8 retry (verify qua dashboard QTHT)

`total=11, byState={CHO_KICH_HOAT:8, HOAT_DONG:3}`

| Mã NHT | Họ tên | Trạng thái | Nguồn |
|---|---|---|---|
| NHT-STP-AG-0001 | Phùng Thị NHT An Giang | HOAT_DONG | R7 R1 |
| NHT-STP-DN-0001 | Lương Văn NHT Đà Nẵng | HOAT_DONG | R7 R1 |
| NHT-STP-HP-0001 | Đào Thị NHT Hải Phòng | HOAT_DONG | R7 R1 |
| NHT-BTP-TW-0001 | NHT UI Test 04 | CHO_KICH_HOAT | pre-existing |
| NHT-BTP-TW-0002 | NHT R8 BTP TW 05 | CHO_KICH_HOAT | **R8 retry** |
| NHT-BTP-TW-0003 | hương 1 | CHO_KICH_HOAT | user manual |
| NHT-BTP-TW-0004 | hương 2 | CHO_KICH_HOAT | user manual |
| NHT-BKH-0001 | NHT R8 BKH BN 05 | CHO_KICH_HOAT | **R8 retry** |
| NHT-BTC-0001 | NHT R8 BTC BN 05 | CHO_KICH_HOAT | **R8 retry** |
| NHT-STP-BG-0001 | NHT R8 STP BG DP 05 | CHO_KICH_HOAT | **R8 retry** |
| NHT-STP-BNI-0001 | NHT R8 STP BNI DP 05 | CHO_KICH_HOAT | **R8 retry** |

## Workflow đã verify (lessons)

1. `new_page` với `isolatedContext` riêng per role → tránh sticky cookie httpOnly
2. Login chuẩn (username + password + OTP 666666)
3. `navigate_page` direct URL `/nguoi-ho-tro` (skip sidebar dance — tránh 4th-click crash + BE JWT revoke ~2 phút)
4. Click `Thêm mới` → modal `Thêm người hỗ trợ pháp lý` (4 field: Họ tên / Email / Tên đăng nhập / Lĩnh vực chuyên môn)
5. `fill_form` 3 textbox + click LV combobox + `type_text "<LV>" + Enter` (AntD listbox quirk — JS click trên option không trigger React state)
6. JS `document.querySelector('.ant-modal-body')?.click()` để close dropdown trước khi submit
7. JS find button `Tạo` by text + click → POST `/api/v1/nguoi-ho-tro` [201] confirmed via `list_network_requests`

**App-side quirk:** AntD multi-select combobox `Lĩnh vực chuyên môn` chỉ accept input qua native input event. `take_snapshot uid` của options listbox stale ngay sau khi listbox render → phải dùng type+Enter làm fallback.

## Permission finding R8

| Account | Sidebar item `Người hỗ trợ pháp lý` | POST permission |
|---|---|---|
| qtht_02 (QTHT) | KHÔNG visible | N/A (route chỉ accessible cho CB_NV_*) |
| cb_nv_tw_02 (CB_NV_TW) | Visible | OK — tạo NHT cho BTP TW |
| cb_nv_bn_01/02 (CB_NV_BN) | Visible | OK — tạo NHT cho đúng đơn vị BN của mình |
| cb_nv_dp_02/03 (CB_NV_DP) | Visible | OK — tạo NHT cho đúng đơn vị ĐP của mình |

→ Khớp fixture line 1150 ("QTHT hoặc CB NV cùng cấp") nhưng UI **chỉ expose route cho CB_NV_***. QTHT phải fallback API hoặc form Tài khoản (chỉ tạo TK không entity).

## Bằng chứng

- [evidence-r7-2-7-r8/r8-nht1-btp-tw-success.png](evidence-r7-2-7-r8/r8-nht1-btp-tw-success.png) — NHT #1 BTP TW
- [evidence-r7-2-7-r8/r8-nht2-bkh-bn-success.png](evidence-r7-2-7-r8/r8-nht2-bkh-bn-success.png) — NHT #2 BKH BN
- [evidence-r7-2-7-r8/r8-nht3-btc-bn-success.png](evidence-r7-2-7-r8/r8-nht3-btc-bn-success.png) — NHT #3 BTC BN
- [evidence-r7-2-7-r8/r8-nht4-bg-dp-success.png](evidence-r7-2-7-r8/r8-nht4-bg-dp-success.png) — NHT #4 STP BG ĐP
- [evidence-r7-2-7-r8/r8-nht5-bni-dp-success.png](evidence-r7-2-7-r8/r8-nht5-bni-dp-success.png) — NHT #5 STP BNI ĐP

## Downstream impact

- **R7.7.4.5 NHT functional 10 TC** dep `≥1 NHT HOAT_DONG (✓3)` — vẫn đủ. Pool tăng 4→11 cải thiện coverage CRUD/list/filter test.
- 5 R8 NHT mới state `CHO_KICH_HOAT` + auto-tạo TAI_KHOAN. Đợi click mail kích hoạt MailHog → `HOAT_DONG` (FR-VIII-26) nếu cần.
- 5 LV/cấp coverage mới: TW (default) + BN (DN/Thuế) + ĐP (LĐ/SHTT) — đủ filter `?donViId` per cấp + `?linhVucIds` per LV.
