# Session Handoff — R6 Phase 2 (cb_nv_tw_01) → tiếp R6.2.7 + 2.9a

**Ngày tạo:** 2026-05-01 18:00
**Người tạo:** QA Automation (Claude Code)
**Mục đích:** Input cho session mới để tiếp tục Phase 2 theo phương án (b): pivot R6.2.7 (account login) + R6.2.9a (cấu hình PC Đợt 1) → smoke test workflow A1/A4 với pool 8 actor hiện có. Sau verify pipeline OK mới seed bổ sung 4 CG + 3 NHT.

---

## 1. Trạng thái env + login

| Item | Giá trị |
|---|---|
| App | http://103.172.236.130:3000/ — HTTP 200 |
| MailHog | http://103.172.236.130:8025/ — HTTP 200 |
| OTP bypass | `666666` (mọi account) |
| QTHT | `qtht_01 / Secret@123` — login OK (dev đã reset password sau R10) |
| CB NV TW | `cb_nv_tw_01 / Secret@123` — login OK |
| CB PD TW | `cb_pd_tw_01 / Secret@123` — chưa verify session này |

**MCP isolatedContext đã dùng:** `cb-nv-tw-01` (cho Phase 2B seed TVV/CG). Cần mở context mới `qtht-01-r6` cho R6.2.7 (tạo account) và `cb-nv-tw-01` cho R6.2.9a (cấu hình PC). Cũng có thể switch lại context QTHT cũ nếu còn alive.

---

## 2. Đã hoàn thành Phase 0 + 1 + 2 (partial)

### Phase 0 — 4/4 ✅
- R6.0.1 App + BE up
- R6.0.2 MailHog up
- R6.0.3 QTHT login OK
- R6.0.4 SCR-VIII-02 button [Thêm mới] visible

### Phase 1 — 4 ✅ + 1 ⚠️ + 1 removed
- R6.1.1 LINH_VUC_PL ✅ — 13 records (seeded HOP_DONG)
- R6.1.2 LOAI_DN ✅ — 7 records (seeded TNHH/CP/DNTN/HKD)
- R6.1.3 DON_VI ✅ — 7 đơn vị pre-existing
- R6.1.4 SLA ✅ — 4 record pre-existing match fixture
- R6.1.5 MAU_PHAN_HOI ⚠️ — UI thiếu nút [Thêm mới], log `BUG-FUNC-MPH-001` Major
- ~~R6.1.6 LY_DO~~ — REMOVED (fixture extension non-SRS, app dùng textarea inline)

### Phase 2 — partial
- R6.2.1-2.3 DN ✅ — 50 DN pre-existing (vượt fixture 15)
- R6.2.4 TVV TW ✅ — 6/6 saved cover 6 LV (LAO_DONG, THUE, HOP_DONG, KDTM, DAT_DAI, HMR-GĐ)
- R6.2.5 CG TW ⚠️ partial — 2/6 saved (CG-0021/0022)
- R6.2.6 NHT ĐP — chưa làm
- R6.2.7 Account login 9 cg/nht — chưa làm (NEXT)
- R6.2.8 FK link — ⏳ chờ 2.5+2.6+2.7 PASS
- R6.2.9a Cấu hình PC Đợt 1 — chưa làm (NEXT)
- R6.2.9b Cấu hình PC Đợt 2 — ⏳ chờ TVV advance state

---

## 3. Pool 15 actor đã seed (tham chiếu cho Phase 4)

Tất cả ở state **Mới đăng ký** (cần advance qua workflow A1 sau).

### TVV TW (6 record, loai_tvv=TVV)

| Mã | UUID | Họ tên | LV | Địa bàn | Trình độ |
|---|---|---|---|---|---|
| TVV-BTP-TW-0001 | `1e7b8dfb-0fa5-4028-9e70-3309433ab977` | Nguyễn Văn Tư Vấn | Lao động + Hợp đồng | Hà Nội | Cử nhân |
| TVV-BTP-TW-0002 | `6c74fa50-04ac-43d5-9f4c-5ee6cbd0710a` | Trần Thị Tư Vấn | KDTM + Thuế | Hà Nội | Cử nhân |
| TVV-BTP-TW-0003 | `326efcc8-cec5-46c5-8593-75a80726e19a` | Lê Chuyên Gia | Hợp đồng + Hôn nhân GĐ | Hà Nội | Thạc sĩ |
| TVV-BTP-TW-0004 | `854bdbcb-6759-414e-8a1b-a0b46e3939cb` | Phạm Đại Tá | Đất đai + KDTM | Đà Nẵng | Cử nhân |
| TVV-BTP-TW-0005 | `58a18edb-033d-4a0c-a5ec-17547beef6f6` | Hoàng Năm Sao | Hôn nhân GĐ | Hà Nội | Tiến sĩ |
| TVV-BTP-TW-0006 | `1256445f-fb92-430e-b9ab-f48df78b78e4` | Vũ Sáu Long | Lao động + Đất đai | Hà Nội | Cử nhân |

### CG TW (2/6 record, loai_tvv=CG)

| Mã | UUID | Họ tên | LV | Địa bàn |
|---|---|---|---|---|
| TVV-BTP-TW-0007 | `39c610b2-01f6-4e3f-a082-a373a839bdce` | Trần Văn Hai Mốt | Lao động | Hà Nội |
| TVV-BTP-TW-0008 | `9b93d0ed-bee0-41f2-99d4-b92e74c9b308` | Lê Hai Hai | Thuế | Hà Nội |

**Note:** App sequence chung TVV+CG+NHT theo `TVV-BTP-TW-XXXX` thay vì split range theo loại như fixture spec (0001-0006 TVV, 0021-0026 CG). Adapt fixture downstream theo UUID thay maTvv.

### DN pre-existing (50 record, không cần seed)

50 DN code DN000001..DN000050, MST 1000000019..1000000202, đủ 3 quy mô (Siêu nhỏ/Nhỏ/Vừa) × 3 ngành nghề × nhiều tỉnh (verified DN000002 ở Bắc Giang).

### Account pre-existing (34 record)

QTHT đã có sẵn 34 TK (verified ở R6.0.4) gồm cb_nv_tw_01..03, cb_pd_tw_01..03, cb_nv_bn_01..03, cb_pd_bn_01..03, cb_nv_dp_01..04, cb_pd_dp_01..04, cg_01..02 (chỉ 2 CG account), qtht_01..03, admin.

---

## 4. Bug đã log

### BUG-FUNC-MPH-001 (Major P1)
- File: [bug-report-seed-qtht.md](bug-reports/bug-report-seed-qtht.md)
- Tóm tắt: Tab "Mẫu phản hồi" (`/quan-tri/cau-hinh?tab=mau-phan-hoi`) thiếu nút [Thêm mới]
- Tác động: chỉ chặn Phase 4 HD response Bước 5 (chọn template), B1-B4 + B6-B12 vẫn chạy được
- Status: Open, đợi dev fix

### BUG-FUNC-TVV-001 (Major P1)
- File: [bug-report-seed-tvv.md](bug-reports/bug-report-seed-tvv.md)
- Tóm tắt: Multi-select Lĩnh vực pháp luật mất option giữa khi click ≥2 option liên tiếp trong cùng phiên dropdown mở
- Workaround verified: close (Escape) → reopen dropdown → click option tiếp
- Tác động: tăng cost seed +30s/TVV nhưng KHÔNG block

### BUG-FUNC-TVV-002 (Major P1, downgrade từ Critical)
- File: cùng [bug-report-seed-tvv.md](bug-reports/bug-report-seed-tvv.md)
- Tóm tắt: Dropdown LV pháp luật cap 10/13 LV — miss Doanh nghiệp, SHTT, Đầu tư
- Verify: BE trả đủ 13 LV (`GET /api/v1/danh-muc?loaiDanhMuc=LINH_VUC_PL` `meta.total=13`); FE virtual list `rc-virtual-list-holder` height 256px scroll bị stuck
- Tác động: KHÔNG block luồng test E2E vì DN/VV cũng dùng cùng dropdown FE bug → cb_nv chỉ tạo được VV với LV trong 10 visible → TVV cover 10 LV visible đủ phân công. Chỉ ảnh hưởng UX user thật khi cần gán TVV với 3 LV miss.
- Status: Open, không gate Phase 2-4

---

## 5. Adapt fixture v2.6.3 (do BUG-FUNC-TVV-002)

Đã update note ở `seed-fixture.yaml` line 491-495 (block `tvv_variants`):

**6 LV adapted dùng cho R6:** LAO_DONG, THUE, HOP_DONG, KINH_DOANH_TM (thay DOANH_NGHIEP), DAT_DAI, HON_NHAN_GIA_DINH (thay SHTT). Sau dev fix BUG-002 → revert fixture v2.7.

Đã xóa block `danh_muc_ly_do_variants` (R6.1.6 removed).

---

## 6. Pattern MCP đã verify (HTPLDN form Thêm TVV/CG)

Form CG-TVV/Tạo mới có 12 field bắt buộc:
- Loại (combobox: TVV/CG/NHT) — default TVV, chọn CG cho R6.2.5
- Họ tên, CCCD, Email, SĐT, Địa chỉ — textbox bình thường
- Ngày sinh — datepicker, format `dd/MM/yyyy` (verified 15/05/1985 OK)
- Giới tính — combobox (Nam/Nữ/Khác)
- Trình độ học vấn — combobox (Cử nhân/Thạc sĩ/Tiến sĩ/Khác)
- Tổ chức hành nghề chính — combobox (3 options: Trung tâm/Chi nhánh/Tổ chức tham gia trợ giúp pháp lý)
- Lĩnh vực pháp luật — multi-select bug (chỉ 10/13 LV, mất option giữa)
- Địa bàn hoạt động — combobox 63 tỉnh (Hà Nội đầu list)

**Workaround multi-select LV (verified):** mỗi click 1 option phải Escape → click combobox lại → click option tiếp. Cost +30s/record.

**Click option dropdown:** dùng `evaluate_script` với `.ant-select-item-option` filter visible (bounding rect > 0). StaticText trong snapshot không clickable trực tiếp.

**API auth:** sessionStorage `auth-store` chỉ chứa `userInfo`, KHÔNG có accessToken. Token nằm cookie HttpOnly hoặc memory state Zustand → fetch từ evaluate_script không gọi API trực tiếp được. Verify data qua DOM hoặc mở network panel `mcp__chrome-devtools__get_network_request` reqid của FE đã gọi.

---

## 7. Phương án (b) cho session mới — pivot R6.2.7 + 2.9a + smoke A1/A4

### Bước 1 — R6.2.7 Tạo 9 account login (qtht_01)

Path: SCR-VIII-02 → `/quan-tri/tai-khoan` → button [+ Thêm mới]

Cần tạo 9 account theo `cap_tai_khoan_cg_nht_r5` trong fixture:
- 6 CG TW: `cg_tw_01` → `cg_tw_06`, password `Secret@123`, vai trò `CG`
- 3 NHT ĐP: `nht_ag_01`, `nht_dn_01`, `nht_hp_01`, password `Secret@123`, vai trò `NHT`

**Lưu ý:** App đã có 34 TK pre-existing nhưng chỉ có `cg_01`, `cg_02` (2 CG). Cần tạo thêm 6 CG mới (`cg_tw_03..06` hoặc `cg_tw_01..06` nếu cg_01/02 không có scope TW).

### Bước 2 — R6.2.9a Cấu hình PC Đợt 1 (qtht_01 hoặc cb_nv_tw_01)

Path: `/quan-tri/cau-hinh?tab=phan-cong-mac-dinh` (verified ở session này tab "Phân công mặc định" tồn tại trong Cấu hình HT)

Seed 6 row CB-only theo fixture `cau_hinh_phan_cong_variants.dot_1_cb_only`:
- LAO_DONG → cb_nv_tw_01, ưu tiên 1, đơn vị TW-CUC
- THUE → cb_nv_tw_01
- HOP_DONG → cb_nv_tw_01
- KDTM (thay DOANH_NGHIEP) → cb_nv_tw_01
- DAT_DAI → cb_nv_tw_01
- HMR-GĐ (thay SHTT) → cb_nv_tw_01

**Note adapt:** fixture original gốc dùng DOANH_NGHIEP + SHTT, R6 adapt sang KINH_DOANH_TM + HON_NHAN_GIA_DINH theo BUG-FUNC-TVV-002.

### Bước 3 — Smoke workflow A1 (TVV) với 1 TVV pool hiện có

Mục tiêu: verify workflow advance state Mới đăng ký → Đang hoạt động qua 12 bước SM-TVV.

- Login `cb_nv_tw_01` → module Quản lý CG/TVV → tab "Mới đăng ký" → click TVV-BTP-TW-0001
- Click [Trình thẩm định] / advance theo SM-TVV
- Switch context `cb_pd_tw_01` (nếu memory `qa_htpldn_round5_t01` đúng — cookie sticky → cần isolatedContext mới)
- Duyệt → state DANG_HOAT_DONG
- Verify trên list "Đang hoạt động" có TVV-0001

Nếu A1 PASS → confident seed thêm 4 CG + 3 NHT (R6.2.5 + 2.6).

### Bước 4 — Smoke workflow A4 (Hỏi đáp) với DN pre-existing + 1 HD entry

- Login `cb_nv_tw_01` → tạo 1 HD entry (chọn DN từ 50 pre-existing)
- Advance qua A4 12 transition: Tiếp nhận → Phân công CB → Soạn phản hồi (skip B5 chọn template do BUG-MPH-001) → Phê duyệt → Công khai → Đóng
- Verify HD ở state cuối CONG_KHAI/DA_DONG

Nếu A4 PASS với pool hiện tại → kết thúc smoke, mark milestone Phase 4 unblock.

### Bước 5 — Quyết định seed bổ sung dựa trên smoke result

| Smoke A1+A4 | Action |
|---|---|
| Cả 2 PASS | Seed nốt 4 CG + 3 NHT (R6.2.5 + 2.6) → đầy đủ pool cho Phase 4 full |
| 1 fail | Log bug pipeline, đợi dev, không lãng phí seed thêm |
| Cả 2 fail | STOP toàn Phase 4, escalate dev |

---

## 8. File output đã tạo trong session này

- [seed-checklist-QTHT.md](seed/seed-checklist-QTHT.md) — Phase 0+1
- [bug-report-seed-qtht.md](bug-reports/bug-report-seed-qtht.md) — BUG-FUNC-MPH-001
- [bug-report-seed-tvv.md](bug-reports/bug-report-seed-tvv.md) — BUG-FUNC-TVV-001 + 002
- 3 screenshots evidence trong `screenshots/`

**Cần tạo trong session mới:**
- `seed/seed-checklist-TVV.md` (R6.2.4 + 2.5 partial + 2.6) sau khi tiếp seed
- `seed/seed-checklist-account.md` (R6.2.7)
- `seed/seed-checklist-cau-hinh-PC.md` (R6.2.9a)
- `workflow/workflow-test-report-TVV.md` (A1 smoke)
- `workflow/workflow-test-report-HoiDap.md` (A4 smoke)

---

## 9. Quick start cho session mới

```
1. Đọc file này + tasks/todo.md (state R6 hiện tại) + bug-report-seed-tvv.md
2. Mở MCP isolatedContext "qtht-01-r6" → login qtht_01/Secret@123/OTP 666666
3. SCR-VIII-02 → tạo 6 CG account (cg_tw_01..06) + 3 NHT account (nht_ag/dn/hp_01)
4. Mở context "cb-nv-tw-01-r6" → login cb_nv_tw_01 → Cấu hình HT § Phân công mặc định
5. Seed 6 row Đợt 1 CB-only
6. Smoke A1: cb_nv_tw_01 trình duyệt TVV-0001 → cb_pd_tw_01 duyệt → state Đang HĐ
7. Smoke A4: tạo HD với DN000001 → advance đầy đủ workflow (skip B5 template)
8. Update todo.md realtime sau mỗi task; nếu A1+A4 PASS → tiếp R6.2.5 (4 CG) + R6.2.6 (3 NHT)
```

---

*Handoff generated 2026-05-01 18:00 | Phase 2 partial → Phase 4 smoke gate*
