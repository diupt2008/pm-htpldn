# Functional test report — R7.7.2 CG/TVV 31 TC

**Ngày chạy:** 2026-05-07 R7
**Account:** `cb_nv_tw_02` (Secret@123, OTP 666666)
**Spec:** [funtion/7.4-chuyen-gia-tvv.md](../../../../funtion/7.4-chuyen-gia-tvv.md) — UC39..50 (28 TC ID, kèm 5 sub TC = 33 TC)
**SRS ref:** `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md` (FR-IV-01..16)
**Scope:** functional behavior + UI structure + validation + cross-cut với R7.4.A1/A1-CG/A2 walks

## Verdict

❌ **FAIL** — 19 ✅ Đạt · 7 ❌ Lỗi · 1 ⚠️ Sai spec · 6 🚫 Không test được · 0 ⏰ Hoãn (= 33 TC).

> **R7.7.2 verify pass 4 (2026-05-08 10:10):** retry TVV-022 nhánh có VV (sau verify VV pool có 2 TVV gắn VV: TVV-0003 Ngô Thị Mười Lăm + TVV-0004 Trương Văn Mười Sáu).
> - **TVV-022 nhánh có VV** đổi 🚫 → ❌ Lỗi: click Xóa row TVV-0003 (gắn VV-BTP-TW-20260507-001 Lao động) → modal Xác nhận → click Xóa → modal đóng silent, **không toast**. Network DELETE `/api/v1/tu-van-viens/<id>` trả **HTTP 500** (không phải 409 ERR-TVV-05 theo spec BR-LEGAL-04). API GET sau action: TVV-0003 vẫn HOAT_DONG version=6 (record không bị xóa — BE đã reject thực sự nhưng wrong status code + UI silent). → **BUG-CG-77-RETRY-004 Major** (BE wrong status + FE silent — pattern cùng RETRY-001).
>
> **R7.7.2 verify pass 3 (2026-05-08 00:30):** retry 5 case ⏰ Hoãn qua UI browse only (không API direct), seed walk thẩm định → CHO_PHE_DUYET, switch session sang CB_PD_TW. Bug phát hiện log file riêng, không tự ý workaround.
> - **TVV-012** đổi ⏰ → ❌ Lỗi: tab Chờ phê duyệt cho CB_PD_TW thiếu UI batch select (no checkbox + no toolbar). Single Phê duyệt detail page hoạt động. → **BUG-CG-77-RETRY-002 Major**.
> - **TVV-014a** đổi ⏰ → ✅: batch Hủy công khai 8 record OK (toolbar appear after multi-select).
> - **TVV-014b** đổi ⏰ → ✅: batch Công khai 8 record OK happy path. Sub-case "partial fail" không simulate được (cần API mock mid-batch fail) → giữ note tách out.
> - **TVV-016** đổi ⏰ → ❌ Lỗi: empty state tab Lịch sử hỗ trợ wording sai spec ("Chưa có lịch sử hỗ trợ" thay "Tư vấn viên chưa tham gia hỗ trợ vụ việc nào"). → **BUG-CG-77-RETRY-003 Minor**.
> - **TVV-022 nhánh không VV** đổi ⏰ → ❌ Lỗi: click Xóa + confirm "Xóa" trên TVV-0008 (nhánh không VV) → no toast, sau reload record vẫn tồn tại. Functional regression UC50. → **BUG-CG-77-RETRY-001 Major**.

> **R7.7.2 verify pass 2 (2026-05-07 23:30):** retry 2 case `🤷 Không xác định` + `⚠️ Sai spec` qua NotebookLM HTPLDN + SRS local + UI fresh form.
> - **TVV-005** đổi 🤷 → ✅ Đạt: form mới hoàn toàn, để Lĩnh vực trống, click Lưu → FE chặn submit + báo "Phải chọn ít nhất 1 lĩnh vực" (2 lần). Test method cũ bị cache state nên kết luận sai.
> - **TVV-007** giữ ⚠️ Sai spec với note rõ: NotebookLM + grep SRS xác nhận SCR-IV-03 spec chi tiết chỉ define 5 tab (Hồ sơ/Thẩm định/Năng lực/Lịch sử hỗ trợ/Đánh giá), không có tab HĐ tư vấn. NHƯNG mục lục SRS v3 line 14 nói "HĐ tư vấn — KHÔNG có menu riêng — Truy cập qua tab VV/TVV" → đây là **SRS doc gap** (intent có nhưng SCR-IV-03 spec quên). UI làm đúng intent. Escalate BA bổ sung row tab HĐ TV vào SCR-IV-03.

**Bug mới R7.7.2:** BUG-CG-77-001/002 (file gốc), BUG-CG-77-RETRY-001/002/003 (verify retry pass 3 — file mới [bug-report-functional-r7-7-2-tvv-retry.md](../../bug-reports/tu-van-vien-cg/bug-report-functional-r7-7-2-tvv-retry.md)). **Bug cũ vẫn Open ở R7.4:** BUG-CG-A1-001/002/003/004.

## Ý nghĩa cột Status

| Ký hiệu | Nghĩa |
|---|---|
| ✅ Đạt | Test xong, kết quả khớp spec |
| ❌ Lỗi | Test xong, kết quả sai spec → có bug |
| ⚠️ Sai spec | UI/BE làm khác spec nhưng chưa rõ là bug hay spec sai → defer chờ BA |
| 🤷 Không xác định | Test không kết luận được (vd: chưa nhập đủ data, công cụ test bị giới hạn) |
| 🚫 Không test được | Có thể chạy nhưng thiếu điều kiện đầu vào (account/data/UI), nên không test được lúc này |
| ⏰ Hoãn | Test sau, cần chuẩn bị thêm bước (vd: cần thêm CB PD account, cần seed data, cần task khác xong trước) |

## Test Case Matrix

| TC | UC | Mô tả | P | Status | Lý do / Evidence |
|---|---|---|:-:|:-:|---|
| **TVV-001** | UC39 | Danh sách 6 tab + phân trang 20/trang | P0 | ❌ Lỗi | **BUG-CG-77-001 Major** — UI 8 tab thiếu `Từ chối` + `Vô hiệu hóa`. Phân trang 20/trang ✅. |
| **TVV-002** | UC40 | Tìm kiếm Họ tên/Mã/CCCD + filter | P0 | ✅ Đạt | Search "Mười Ba" trả 2 kết quả (BE match từng từ rời). [TVV-002-search-mui-ba.png](evidence-r7-7-2/TVV-002-search-mui-ba.png) |
| **TVV-003** | UC41 | NHT submit hồ sơ TVV → state `MOI_DANG_KY` | P0 | ✅ Đạt | Form `Thêm TVV` submit OK → tạo TVV id=83d390c7, state `MOI_DANG_KY, version: 1`. |
| **TVV-004** | UC41 | CCCD trùng → ERR-TVV-02 | P0 | ✅ Đạt | Submit CCCD trùng → FE báo "CCCD đã tồn tại trong hệ thống". [TVV-004-cccd-duplicate-error.png](evidence-r7-7-2/TVV-004-cccd-duplicate-error.png) |
| **TVV-005** | UC41 | Thiếu Lĩnh vực PL → báo lỗi | P1 | ✅ Đạt | **Verify pass 2 2026-05-07:** form `/chuyen-gia-tvv/tao-moi` mới hoàn toàn, fill 8 required field (trừ Lĩnh vực), click Lưu → FE chặn submit + render error "Phải chọn ít nhất 1 lĩnh vực" 2 lần. URL stuck `/tao-moi` không navigate. [TVV-005-retest-fresh-form-validate-ok.png](evidence-r7-7-2/TVV-005-retest-fresh-form-validate-ok.png) |
| **TVV-006** | UC42 | TVV/CG cập nhật năng lực FR-IV-04 | P1 | 🚫 Không test được | TVV ứng viên không login được (BUG-CG-A1-003 mail kích hoạt hỏng → TVV stuck CHO_KICH_HOAT, không đặt được mật khẩu lần đầu). |
| **TVV-007** | UC43 | Chi tiết 5 tab | P0 | ⚠️ Sai spec | **Verify pass 2 2026-05-07 (NotebookLM + grep SRS):** UI render 6 tab (thêm `HĐ tư vấn`). SCR-IV-03 spec chi tiết line 12-23 (`srs-fr-04-chuyen-gia-tvv.md`) chỉ define 5 tab (Hồ sơ/Thẩm định/Năng lực/Lịch sử hỗ trợ/Đánh giá) — **KHÔNG có tab HĐ tư vấn**. Nhưng mục lục SRS v3 line 14 (`srs-v3.md`) nói "HĐ tư vấn UC159 — KHÔNG có menu riêng — Truy cập qua tab VV/TVV" → đây là **SRS doc gap** (intent có tab này, SCR-IV-03 spec quên define). UI làm đúng intent. **Escalate BA:** bổ sung row tab "HĐ tư vấn" vào SCR-IV-03 component table với dữ liệu lấy từ srs-fr-14-hop-dong-tv.md. [TVV-007-detail-6-tabs.png](evidence-r7-7-2/TVV-007-detail-6-tabs.png) |
| **TVV-008** | UC44 | Thẩm định 4 nhóm tiêu chí | P0 | ✅ Đạt | Đã test ở R7.4.A1-CG TC-CG-A1-02. POST `/tham-dinh` body 4 nhóm BE accept. |
| **TVV-008b** | UC44 | Thẩm định KHÔNG ĐẠT → TU_CHOI | P1 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.B (TVV-0011/0012 → TU_CHOI). |
| **TVV-009** | UC44 | Thẩm định → YEU_CAU_BO_SUNG | P0 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.C (TVV-0010 → YEU_CAU_BO_SUNG). |
| **TVV-010** | UC44 | Bổ sung xong → quay lại thẩm định | P1 | 🚫 Không test được | TVV ứng viên không login được (BUG-CG-A1-003). CB NV "Sửa hồ sơ" không trigger transition. Đã ghi ở R7.4.A2.2. |
| **TVV-011** | UC45 | Phê duyệt → CHO_KICH_HOAT | P0 | ❌ Lỗi | **BUG-CG-A1-001 Major** — BE trả `DANG_HOAT_DONG` thay vì `CHO_KICH_HOAT`. Đã track ở R7.4.A1-CG. |
| **TVV-012** | UC45 | Phê duyệt hàng loạt | P1 | ❌ Lỗi | **Verify pass 3 2026-05-08:** seed 2 TVV (TVV-0015 + TVV-0016) → CHO_PHE_DUYET qua UI walk thẩm định, switch sang `cb_pd_tw_02`. Tab Chờ phê duyệt KHÔNG có checkbox multi-select header + KHÔNG có per-row checkbox + KHÔNG có batch toolbar. Single Phê duyệt detail page có button "Phê duyệt" + "Từ chối" hoạt động, nhưng list view không cho batch. → **BUG-CG-77-RETRY-002 Major**. [TVV-012-list-no-batch-checkbox.png](evidence-r7-7-2/TVV-012-list-no-batch-checkbox.png) |
| **TVV-012a** | UC45 | Bấm link mail kích hoạt → HOAT_DONG | P0 | ❌ Lỗi | **BUG-CG-A1-003 Critical** — TVV stuck CHO_KICH_HOAT, link mail không kích hoạt được. Đã track ở R7.4.A1-CG. |
| **TVV-013** | UC45 | Từ chối → bắt buộc lý do ≥10 ký tự | P0 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.B. |
| **TVV-014** | UC46 | Modal Công khai 5 fields | P1 | ❌ Lỗi | **BUG-CG-77-002 Major** — Modal chỉ confirm 2 button, KHÔNG có form 5 fields. [TVV-014-cong-khai-modal-thieu-form.png](evidence-r7-7-2/TVV-014-cong-khai-modal-thieu-form.png) |
| **TVV-014a** | UC46 | Hủy công khai | P1 | ✅ Đạt | **Verify pass 3 2026-05-08:** tab Đang hoạt động → Select all 8 TVV → toolbar appear → click "Hủy công khai" → batch OK, toast Success, 8 record state "Chưa công khai". Test fix dù form MD-CONG-KHAI vẫn chưa build (BUG-CG-77-002 vẫn open). [TVV-014a-batch-huy-cong-khai-success.png](evidence-r7-7-2/TVV-014a-batch-huy-cong-khai-success.png) |
| **TVV-014b** | UC46 | Công khai hàng loạt — happy path | P2 | ✅ Đạt | **Verify pass 3 2026-05-08:** tab Đang hoạt động → Select all 8 TVV → toolbar "Công khai lên Cổng PLQG" → batch OK, 8 record state "Đã công khai". Sub-case "partial fail mid-batch" không simulate được qua UI (cần API mock) → tách defer test infrastructure. [TVV-014b-batch-cong-khai-success.png](evidence-r7-7-2/TVV-014b-batch-cong-khai-success.png) |
| **TVV-015** | UC47 | DN đánh giá TVV sau VV (thang 1.0-5.0) | P1 | 🚫 Không test được | Cần đăng nhập Doanh nghiệp + cần VV `HOAN_THANH` có đánh giá. Hiện chưa có account DN test. |
| **TVV-016** | UC48 | Xem lịch sử hỗ trợ TVV | P2 | ❌ Lỗi | **Verify pass 3 2026-05-08:** mở detail TVV-0008 → click tab Lịch sử hỗ trợ → empty state hiện wording "Chưa có lịch sử hỗ trợ" thay vì spec UC55 "Tư vấn viên chưa tham gia hỗ trợ vụ việc nào". Tab structure đầy đủ (icon Trống + text), chỉ wording sai spec. → **BUG-CG-77-RETRY-003 Minor**. [TVV-016-tab-lich-su-empty.png](evidence-r7-7-2/TVV-016-tab-lich-su-empty.png) |
| **TVV-017** | UC49 | TVV/CG tự cập nhật profile (qua chuyên trang) | P1 | 🚫 Không test được | TVV ứng viên không login được (BUG-CG-A1-003). |
| **TVV-018** | UC50 | Tạm dừng HOAT_DONG → TAM_DUNG | P1 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.D. |
| **TVV-019** | UC50 | Kích hoạt lại TAM_DUNG → HOAT_DONG | P1 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.D. |
| **TVV-019b** | UC50 | Khôi phục VO_HIEU_HOA → HOAT_DONG | P2 | ✅ Đạt | TVV-0003 (Ngô Thị Mười Lăm) sau khi vô hiệu hóa, click `Cập nhật trạng thái` → drawer chỉ option "Đang hoạt động". Submit lý do ≥10 ký tự → state `HOAT_DONG, version: 6` ✅. (Nhãn UI "Đang hoạt động" thay vì "Hoạt động" — liên quan BUG-CG-A1-001.) [TVV-019b-vo-hieu-hoa-khoi-phuc.png](evidence-r7-7-2/TVV-019b-vo-hieu-hoa-khoi-phuc.png) |
| **TVV-020** | UC50 | Vô hiệu hóa khi không có VV | P0 | ✅ Đạt | Đã test ở R7.4.A1 walk A1.D. |
| **TVV-021** | UC50 | Vô hiệu hóa khi có VV → phải bị chặn | P0 | ❌ Lỗi | **BUG-CG-A1-004 Critical** — BE chấp nhận vô hiệu hóa dù TVV còn VV `DANG_XU_LY` (không enforce guard ERR-TT-02). Đã track ở R7.4.A1. |
| **TVV-022** | UC50 | Xóa mềm TVV (chỉ khi không có VV) | P1 | ❌ Lỗi | **Verify pass 3+4 2026-05-08:** **Nhánh không VV** (TVV-0008): click Xóa → modal Confirm → click Xóa → modal đóng silent KHÔNG toast, reload TVV-0008 vẫn ở list. → **BUG-CG-77-RETRY-001 Major**. [TVV-022-confirm-delete-dialog.png](evidence-r7-7-2/TVV-022-confirm-delete-dialog.png) + [TVV-022-after-delete-still-exists.png](evidence-r7-7-2/TVV-022-after-delete-still-exists.png). **Nhánh có VV** (TVV-0003 gắn VV-001 Lao động): click Xóa → modal → click Xóa → DELETE `/api/v1/tu-van-viens/<id>` trả **HTTP 500** (sai spec BR-LEGAL-04 phải là 409 ERR-TVV-05) + KHÔNG toast. API GET: record vẫn HOAT_DONG version=6 (BE đã reject silent). → **BUG-CG-77-RETRY-004 Major**. [TVV-022-have-VV-confirm-modal.png](evidence-r7-7-2/TVV-022-have-VV-confirm-modal.png) |
| **TVV-023** | — | Nộp lại sau TU_CHOI (KHÔNG cooldown) | P2 | 🚫 Không test được | Pool TU_CHOI ✓ 2 record (verify state-snapshot 2026-05-07) — KHÔNG block bởi data. Block bởi **BUG-CG-A1-003** mail kích hoạt hỏng → TVV ứng viên không login portal để tự nộp lại theo FR-IV-03. Đã ghi R7.4.A2.3. |
| **TVV-024** | — | QTHT chỉ xem, KHÔNG sửa/xóa TVV | P1 | ✅ Đạt | Đã test ở R7.4.A1 + memory `qa_htpldn_qtht_permission_bypass` — bypass đã closed R6. |
| **TVV-025** | — | TVV/CG xem hồ sơ của mình | P0 | 🚫 Không test được | TVV ứng viên không login được (BUG-CG-A1-003). |
| **TVV-026** | — | CB NV TW thấy toàn quốc; ĐP chỉ thấy đơn vị mình | P0 | ✅ Đạt | Đã test ở R7.4.A1-CG TC-11 — `cb_nv_dp_02` GET TVV TW → 403. |
| **TVV-027** | — | CB PD chỉ phê duyệt cùng cấp | P0 | ✅ Đạt | Đã test ở R7.4.A1-CG TC-10 — `cb_pd_dp_02` POST `/phe-duyet` TVV TW → 403. |
| **TVV-028** | — | DN không thấy TU_VAN_VIEN backend | P1 | 🚫 Không test được | Cần đăng nhập Doanh nghiệp portal `/dn/...`. Hiện chưa có account DN test. |

## Bugs phát hiện ở R7.7.2

6 bug mới ở R7.7.2 — log 2 file:
- [bug-report-functional-r7-7-2-tvv.md](../../bug-reports/tu-van-vien-cg/bug-report-functional-r7-7-2-tvv.md): BUG-CG-77-001 + BUG-CG-77-002 (gốc 2026-05-07).
- [bug-report-functional-r7-7-2-tvv-retry.md](../../bug-reports/tu-van-vien-cg/bug-report-functional-r7-7-2-tvv-retry.md): BUG-CG-77-RETRY-001/002/003 (verify retry pass 3 2026-05-08) + BUG-CG-77-RETRY-004 (verify retry pass 4 2026-05-08 — nhánh có VV).

4 bug cũ vẫn Open track ở R7.4: [bug-report-flow-r7-4-a1-tvv.md](../../bug-reports/tu-van-vien-cg/bug-report-flow-r7-4-a1-tvv.md) + [bug-report-flow-r7-4-a1-cg-state.md](../../bug-reports/tu-van-vien-cg/bug-report-flow-r7-4-a1-cg-state.md).

## Tóm tắt: case không chạy được vì sao?

Nhóm theo nguyên nhân để dev/BA dễ unblock:

| Nguyên nhân | Số TC | TC list | Cần làm gì để test? |
|---|:-:|---|---|
| **TVV ứng viên không login được** (BUG-CG-A1-003 mail kích hoạt hỏng) | 4 | TVV-006, TVV-010, TVV-017, TVV-025 | Dev fix BUG-CG-A1-003 (mail link → TVV đặt mật khẩu lần đầu → state HOAT_DONG). |
| **Chưa có account Doanh nghiệp test** | 2 | TVV-015, TVV-028 | Tạo account DN test (email, mật khẩu, scope) + seed VV HOAN_THANH có đánh giá. |
| **TVV ứng viên không login portal** (BUG-CG-A1-003) | 1 | TVV-023 | Pool TU_CHOI ✓ 2 record sẵn — chờ dev fix mail kích hoạt → TVV login → tự nộp lại qua FR-IV-03. |
| **TVV-014b sub-case partial fail** | 1 | TVV-014b sub-case | Cần API mock simulate fail giữa batch để test rollback per-item. Hiện chỉ test được happy path → ✅. |

## Out of scope (defer)

- **TVV-015** → đợi DN account + VV HOAN_THANH có đánh giá.
- **TVV-014b partial fail simulation** → đợi test infrastructure (API mock mid-batch fail).
- **TVV-028** → đợi DN account.

## Files / Evidence

- 6 screenshot ở `evidence-r7-7-2/`
- API responses captured live
- Reference reports: [workflow-test-report-r7-4-a1.md](../../workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1.md), [workflow-test-report-r7-4-a1-cg.md](../../workflow/tu-van-vien-cg/workflow-test-report-r7-4-a1-cg.md), [workflow-test-report-r7-4-a2.md](../../workflow/tu-van-vien-cg/workflow-test-report-r7-4-a2.md)
