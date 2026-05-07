# Workflow test report — R7 UI Supplement (Plan B redo)

**Ngày chạy:** 2026-05-07 R7
**Account:** `cb_nv_tw_02` (CB_NV_TW)
**Tool:** Chrome DevTools MCP, **UI click chain primary** (no API direct fetch)
**Scope:** Re-verify 4 task R7.2.2/2.3/2.6/2.7 (seed/phê duyệt/CG/NHT) qua UI form sau khi user push back rằng prior session dùng API direct. Sample UI: seed +1 record/task để chứng minh UI flow works end-to-end.

## Verdict

⚠️ **DONE_WITH_CONCERNS** — 1/4 PASS UI E2E, 3/4 BLOCKED bởi 2 FE bug Major mới phát hiện.

| Task | Outcome | Bug |
|---|:-:|---|
| R7.2.2-UI Seed TC TV via UI | ❌ BLOCKED | BUG-TCTV-FE-001 (FE LV dropdown empty) |
| R7.2.3-UI Trình + phê duyệt TC mới | ❌ SKIP (upstream) | — |
| R7.2.6-UI Seed CG TW via UI | ❌ BLOCKED | BUG-TVV-FE-002 (FE TC combobox sai source) |
| R7.2.7-UI Seed NHT via UI | ✅ **PASS** — NHT-BTP-TW-0001 created | — |

## Pool sau test

- **TC TV:** 5 records (TC-BTP-TW-0001..0005) — không thay đổi (R7.2.2-UI BLOCKED).
- **TVV/CG:** 8 records (TVV-BTP-TW-0001..0008) — không thay đổi (R7.2.6-UI BLOCKED).
- **NHT:** **4 records (3 cũ HOAT_DONG + 1 NEW NHT-BTP-TW-0001 CHO_KICH_HOAT)** ✅.

## R7.2.2-UI — TC TV form blocker

**UI flow thực hiện:**
1. Login `cb_nv_tw_02 / Secret@123` + OTP `666666` ✅
2. Navigate sidebar Mạng lưới Tư vấn viên → Tổ chức tư vấn ✅
3. Click "+ Thêm tổ chức tư vấn" ✅ (opens `/to-chuc/tao-moi`)
4. Fill text fields (Tên Lambda UI Test, Loại hình Công ty Luật, Người ĐD, Số ĐKHĐ, Ngày cấp 06/05/2026, Địa chỉ, Điện thoại, Email, Ghi chú) ✅
5. Click Loại hình combobox + type "Công ty Luật" + Enter ✅
6. Click Lĩnh vực pháp lý combobox → **dropdown rỗng "Trống — Chưa có dữ liệu"** ❌
7. Type "Doanh nghiệp" + ArrowDown + Enter → vẫn rỗng
8. Click Tạo mới → form block "Chọn ít nhất 1 lĩnh vực"

**Root cause:** FE gửi `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PHAP_LY` (suffix khác). BE chỉ có DM seeded code `LINH_VUC_PL` (12 records). Response: `{success:true, data:[]}`.

**Bug logged:** [bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md](../../bug-reports/to-chuc-tu-van/bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md) — BUG-TCTV-FE-001 Major Open

## R7.2.6-UI — TVV form blocker

**UI flow thực hiện:**
1. Login `cb_nv_tw_02` ✅
2. Navigate `/chuyen-gia-tvv/danh-sach` → click "+ Thêm TVV" ✅ (opens `/tao-moi`)
3. Fill 5 sections (Thông tin cá nhân + Nghề nghiệp + Tổ chức + File + Ghi chú) ✅
4. Loại = Chuyên gia (CG) ✅
5. Giới tính = Nam ✅
6. Trình độ = Cử nhân ✅
7. **Tổ chức hành nghề chính** combobox: search "Epsilon" → **rỗng**. Workaround pick "Trung tâm trợ giúp pháp lý" từ DM legacy ⚠️
8. LV pháp luật = Sở hữu trí tuệ ✅
9. Click Lưu → BE 400 `ERR-TVV-DV-NOT-FOUND "Tổ chức tư vấn không tồn tại"` ❌

**Root cause:** FE TVV form combobox query `/api/v1/danh-muc?loaiDanhMuc=TO_CHUC_TU_VAN` → trả 3 enum loại hình DM legacy (Trung tâm TGPL / Chi nhánh TGPL / Tổ chức tham gia TGPL). BE entity TVV.toChucChinhId yêu cầu UUID của entity TO_CHUC_TU_VAN (5 records HOAT_DONG: TC-BTP-TW-0001..0005). User pick combobox → FE gửi DM UUID → BE lookup entity table → 400 NOT_FOUND.

**Bug logged:** [bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md](../../bug-reports/tu-van-vien-cg/bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md) — BUG-TVV-FE-002 Major Open

## R7.2.7-UI — NHT form ✅ E2E SUCCESS

**UI flow thực hiện:**
1. Login `cb_nv_tw_02` (token có `create_nguoi_ho_tro` permission) ✅
2. Navigate sidebar Mạng lưới Tư vấn viên → Người hỗ trợ pháp lý → list 3 NHT cũ ✅
3. Click "+ Thêm mới" → Modal dialog 4 fields ✅
4. Fill: Họ tên = "NHT UI Test 04", Email = `nht_04_ui@htpldn.test`, Tên đăng nhập = `nht_04_ui` ✅
5. Click Lĩnh vực chuyên môn combobox → 10 LV pháp lý loaded ✅ (UI form NHT dùng loaiDanhMuc=LINH_VUC_PL **đúng**)
6. Type "Doanh nghiệp" + ArrowDown + Enter → "Doanh nghiệp ×" picked ✅
7. Press Escape close dropdown ✅
8. Click "Tạo" → BE 201 Created ✅
9. Modal đóng, list refresh → **NHT-BTP-TW-0001 "NHT UI Test 04"** xuất hiện top of list, trạng thái `Chờ kích hoạt` ✅

**Pool xác nhận sau:** 4 NHT (1 NEW CHO_KICH_HOAT + 3 cũ HOAT_DONG), pagination "1-4 trên 4 mặt hàng".

**Note:** Mã NHT auto-prefix theo cấp account (`cb_nv_tw_02` → BTP-TW), không phải theo đơn vị nhập tay (form không có field đơn vị). BE assign donVi từ JWT.donViId.

## Phát hiện 2 FE bug Major mới

| Bug ID | Title | Affected | Severity | Status |
|---|---|---|:-:|:-:|
| **BUG-TCTV-FE-001** | TC TV form Lĩnh vực dropdown rỗng (FE query sai loaiDanhMuc) | R7.2.2-UI | Major | Open |
| **BUG-TVV-FE-002** | TVV form Tổ chức hành nghề chính combobox query DM legacy thay vì entity TO_CHUC_TU_VAN | R7.2.6-UI | Major | Open |

**Pattern chung:** Cả 2 bug do FE/BE **misalignment sau migration FR-04 v3.5** (TO_CHUC_TU_VAN tách entity riêng, DM `LINH_VUC_PHAP_LY` rename `LINH_VUC_PL`). Likely FE chưa cập nhật theo SRS update 2026-05-05.

**Tác động:**
- **R7.2.2-UI / R7.2.6-UI HARD BLOCKED qua UI flow** — user thực tế (CB NV) KHÔNG thể tạo TC TV / TVV-CG qua UI đến khi dev fix FE.
- API direct (đã verify trong session trước) vẫn work → seed data nghiệp vụ vẫn unblocked, nhưng UI test/training flow không khả dụng.
- **R7.4.A4 + R7.7.1 functional Hỏi đáp downstream** không bị block (data đã có), nhưng test plan UI/UX cho TC TV + TVV/CG sẽ FAIL.

## Validation API direct (cho 3 task BLOCKED) vẫn còn

Pool data từ session API trước (workaround unblock downstream):
- 5 TC TV `HOAT_DONG` ✅ (đã verify công bố qua R7.2.3 cb_pd_tw_02)
- 8 CG TW (loai_tvv=CG) `DANG_HOAT_DONG` ✅
- 4 NHT (3 từ API trước + 1 từ UI mới)

→ Downstream R7.7.1 Hỏi đáp functional vẫn chạy được (FK satisfied).

## Recommend

1. **Escalate BUG-TCTV-FE-001 + BUG-TVV-FE-002 cho dev FE team** — P0 vì block UI seed flow chính.
2. Sau khi dev fix:
   - R7.2.2-UI re-test: Tạo TC TV qua UI form Lambda 2.
   - R7.2.6-UI re-test: Tạo CG qua UI form với TC TV entity từ pool.
   - R7.2.3-UI re-test: trình + phê duyệt qua UI button.
3. **Memory rule cập nhật:** Lưu preference UI-first cho /qa-only HTPLDN — see session memory note.

## Files / Evidence

- [bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md](../../bug-reports/to-chuc-tu-van/bug-report-r7-2-2-ui-tctv-lv-dropdown-empty.md) — BUG-TCTV-FE-001 + screenshot
- [bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md](../../bug-reports/tu-van-vien-cg/bug-report-r7-2-6-ui-tvv-tochuc-wrong-source.md) — BUG-TVV-FE-002 + 2 screenshots
- Screenshots in `seed/screenshots/r7-2-2-ui-*`, `r7-2-6-ui-*`, `r7-2-7-ui-*`
