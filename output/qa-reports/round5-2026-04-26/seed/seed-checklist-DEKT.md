# Seed Checklist — Đề kiểm tra (B5 phần 2)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 13:25-13:32 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Nháp` (`NHAP`)
**Màn:** SCR-III-04 tab "Đề kiểm tra" • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach?tab=de-kiem-tra`
**Dữ liệu mẫu:** [seed-fixture.yaml > de_kiem_tra_variants[1..5]](../../../../input/data/seed-fixture.yaml#L1728)
**SRS:** [FR-III-NEW-01 — Tạo đề kiểm tra](../../../../input/srs-v3/srs-fr-03-dao-tao.md)
**Precondition:** [seed-checklist-NHCH](seed-checklist-NHCH.md) ✅ → 10 NHCH `Nháp` (UUIDs đã có).

---

## Kết quả: ✅ XONG 5/5 (sau B5b 2026-04-27 21:30-21:35)

**Tóm tắt 1 dòng:** 5/5 ĐKT `Nháp` — 3 THU_CONG (variants 2/3/5) PASS từ R1 + 2 NGAU_NHIEN (variants 1/4) PASS sau B5b publish 5 NHCH → CONG_KHAI cover DE/TB/KHO. Pool BE filter trangThai=CONG_KHAI xác nhận từ behavior trước/sau publish.

**Lịch sử:** R1 (2026-04-27 13:32) — ⚠️ MỘT PHẦN 3/5, 2 NGAU_NHIEN BE 422 `ERR-BIZ-III-NEW01-01`. B5b (2026-04-27 21:30-21:35) — re-run 2 variants sau publish NHCH → ✅ 5/5.

---

## Bảng dữ liệu seed

| # | Tên đề | Cách tạo | Khóa học | Số câu | Thời gian | Điểm đạt | Trạng thái | Có vào kho? |
|---|--------|----------|----------|--------|-----------|----------|:----------:|:-----------:|
| 1 | Đề kiểm tra - Pháp luật DN căn bản | Ngẫu nhiên (LĐ/Dễ/1 + KDTM/TB/1 + Thuế/Khó/1) | Chưa phân phối | 3 | 30' | 5 | Nháp | ✅ (B5b 2026-04-27 21:29) |
| 2 | Đề kiểm tra - Luật thuế GTGT | Thủ công (NHCH-3 + NHCH-5) | Chưa phân phối | 2 | 20' | 5 | Nháp | ✅ (R1 13:30) |
| 3 | Đề kiểm tra - Luật đất đai 2024 | Thủ công (NHCH-6 + NHCH-7) | Chưa phân phối | 2 | 45' | 6 | Nháp | ✅ (R1 13:31) |
| 4 | Đề kiểm tra - SHTT cho startup | Ngẫu nhiên (LĐ/Dễ/1 + ĐĐ/Dễ/1 + KDTM/TB/1 + ĐĐ/TB/1 + Thuế/Khó/1) | Chưa phân phối | 5 | 60' | 7 | Nháp | ✅ (B5b 2026-04-27 21:32) |
| 5 | Đề kiểm tra - HĐ thương mại nội địa | Thủ công (NHCH-5 + NHCH-8) | Chưa phân phối | 2 | 30' | 5 | Nháp | ✅ (R1 13:32) |

**Tổng:** 5 vào kho / 0 bị chặn. List paginate "1-5 / 5 mục", entry state `Nháp`/`NHAP` cho cả 5.

**Note variant 1 + 4 substitution lĩnh vực:** Fixture R1 ghi `random_config: { DE: 1, TB: 1, KHO: 1 }` (chỉ mức độ, không lĩnh vực). Form thực tế bắt buộc cả 3 field per rule (xem O5 dưới). B5b chọn lĩnh vực theo pool CONG_KHAI có sẵn (NHCH publish): Lao động/Đất đai/KDTM/Thuế. Variant 4 fixture comment "SHTT" — không khớp pool publish (NHCH-4/9 SHTT/Khó vẫn `Nháp`) → thay bằng Thuế/Khó (NHCH-3 đã publish).

**Note column "Khóa học = Chưa phân phối":** đây là cell value text trong list, không phải FK. Form Tạo ĐKT KHÔNG có field `khoa_hoc_id` → align SRS `khoa_hoc_id (N)` (row 1129 FR-III-NEW-01 §Inputs). Variant 5 fixture comment "DA_PHAN_PHOI scenario — workflow advance" pending FR-III-NEW-03 workflow (action [Phân phối] không có trên list/detail page UI verified).

---

## Bug SRS-ref

*Không log bug — BE rule `ERR-BIZ-III-NEW01-01` là behavior hợp lý theo spec (pool NHCH cho NGAU_NHIEN cần state CONG_KHAI). Xem Quan sát O1 dưới đây.*

---

## Quan sát ngoài SRS (không log bug)

- **O1 — BE 422 `ERR-BIZ-III-NEW01-01` khi submit ĐKT NGAU_NHIEN.** Quan sát thực tế: POST `/api/v1/de-kiem-tras` cách tạo `NGAU_NHIEN` (3 rule LAO_DONG/DE/1 + KDTM/TB/1 + SHTT/KHO/1) trả 422 với `error.code: "ERR-BIZ-III-NEW01-01"`, message "Ngân hàng không đủ câu hỏi thỏa điều kiện". 10 NHCH hiện đều `trangThai=NHAP` (verify qua GET `/api/v1/ngan-hang-cau-hois`). **Nguyên nhân chính xác chưa quote được SRS** — SRS FR-III-NEW-01 §Processing chỉ ghi "Ngẫu nhiên: random từ ngân hàng" không nói rõ filter trangThai. Giả thuyết suy luận (KHÔNG SRS-ref): BE có thể filter pool theo `trangThai=CONG_KHAI` hoặc theo điều kiện khác (đếm số câu? loại câu hỏi?). Cần BA/dev xác nhận điều kiện filter trước khi log bug hoặc kết luận workaround.
  - **Network evidence:** reqid=218 POST `/api/v1/de-kiem-tras` 422, body `{"success":false,"error":{"code":"ERR-BIZ-III-NEW01-01","message":"Ngân hàng không đủ câu hỏi thỏa điều kiện","timestamp":"2026-04-27T06:28:21.683Z","requestId":"d8227ffd-7fb5-432e-9b36-d18fa499a475"}}`
  - **NHCH state evidence:** reqid=205 GET `/api/v1/ngan-hang-cau-hois?page=1&pageSize=20` trả `"trangThai":"NHAP"` cho cả 10 record.
- **O2 — Form Tạo ĐKT KHÔNG có field "Khóa học"** (`khoa_hoc_id`). Align SRS FR-III-NEW-01 §Inputs row 1 chỉ định `khoa_hoc_id (N — không bắt buộc)`. Fixture comment R4 ghi "Prereq: khoa_hoc_id bắt buộc" sai — fixture thừa scope so với SRS, KHÔNG log bug FE per `feedback_fixture_mismatch_not_bug.md`. Cột Khóa học trong list hiển thị "Chưa phân phối" cho 3 ĐKT — đây là display label cho ĐKT chưa qua FR-III-NEW-03 phân phối, không phải FK rỗng.
- **O3 — Form Tạo ĐKT THU_CONG yêu cầu nhập UUID raw** (placeholder "UUID câu hỏi"). Không có dropdown picker câu hỏi từ NHCH. UX kém nhưng không vi phạm SRS (FR-III-NEW-01 §Inputs row 5 `cau_hoi_ids identifier[] Cond`). Đề nghị FE thêm dropdown picker theo lĩnh vực + mức độ trong tương lai.
- **O4 — Spinbutton "Số lượng" rule NGAU_NHIEN quirk** `valuemax="0"` `valuemin="1"` (nghịch lý). MCP `Increase Value` button disabled. Workaround: `fill` trực tiếp = "1". Cùng obs với NHCH form O2.
- **O5 — Mỗi rule random yêu cầu Lĩnh vực + Mức độ + Số lượng** (3 field per rule, BE accept array `randomConfig[{linhVucId, mucDo, soLuong}]`). Granular hơn fixture comment `random_config: { DE: 1, TB: 1, KHO: 1 }` (chỉ mức độ). Form đúng SRS, fixture chưa đủ chi tiết — đề nghị BA cập nhật fixture v2.5+ thêm `linh_vuc_id` per rule.
- **O6 — Detail page ĐKT (`/dao-tao/de-kiem-tra/{id}`) hiển thị data trống "0", "—"** dù list count = 2/3 câu. Có thể là FE bug trên detail, ngoài scope B5 — không log bug do chưa map clause SRS cụ thể về detail render.

---

## Cascade impact

- **T3.5 Workflow Khóa học (10 bước)** — pool ĐKT THU_CONG đủ 3 record để gắn workflow. NGAU_NHIEN scenario block đến khi điều kiện filter pool được satisfy.
- **T4.6 Functional Khóa học 40 TC** — pool 3 ĐKT cho test CRUD/edit/delete. NGAU_NHIEN test scenario defer.
- **DA_PHAN_PHOI scenario (variant 5)** — sau workflow FR-III-NEW-03 [Phân phối] khả dụng. Hiện list/detail page không có nút action visible.

---

## Pending re-run — variants 1 + 4 NGAU_NHIEN — ✅ ĐÃ HOÀN THÀNH B5b

**Trạng thái cuối:** ✅ DONE 2026-04-27 21:30-21:35 — Trigger T2 active (publish 5 NHCH cover 3 mức độ trong B5b workflow). Variant 1 + 4 PASS sau re-submit cùng payload structure.

**Trigger thỏa:** T2 — `seed-checklist-NHCH §Publish workflow` (B5b) đã publish 5 NHCH `Nháp` → `Công khai` (2 DE: NHCH-7+10, 2 TB: NHCH-6+8, 1 KHO: NHCH-3). GET list filter `trangThai=CONG_KHAI` = `1-5 / 5 mục` xác nhận pool đầy đủ.

**Re-run checklist (DONE):**
1. ✅ ~~BA/dev confirm điều kiện filter pool (T1)~~ — không cần (T2 thỏa trước).
2. ✅ Pre-flight verify list filter `trangThai=CONG_KHAI` = 5/5 cover 3 mức độ ([screenshot](../screenshots/nhch-b5b-list-filter-CONG_KHAI-5of5.png)).
3. ✅ POST `/api/v1/de-kiem-tras` variant 1 (cachTao=NGAU_NHIEN, 3 rule LĐ/Dễ + KDTM/TB + Thuế/Khó) → 201 + ĐKT entry `Nháp` `Số câu hỏi=3`.
4. ✅ POST variant 4 (5 rule LĐ/Dễ + ĐĐ/Dễ + KDTM/TB + ĐĐ/TB + Thuế/Khó, thoiGianLamBai=60, diemDat=7) → 201 + ĐKT entry `Nháp` `Số câu hỏi=5`.
5. ✅ Verify list ĐKT `1-5 / 5 mục` ([screenshot](../screenshots/dekt-b5b-list-5of5-after-rerun.png)).
6. ✅ Update Kết quả `⚠️ MỘT PHẦN 3/5` → `✅ XONG 5/5` + bảng dữ liệu seed (rows 1+4 từ 🚫 → ✅).
7. ⏳ Update [tasks/todo.md](../../../../tasks/todo.md) B5 ⚠️ → ✅ + B5b ✅ (làm tiếp sau khi seed-checklist xong).
8. ⏳ Append memory entry (làm sau).

**Workflow report đầy đủ:** [`workflow-test-report-NHCH-PUBLISH.md`](../workflow/workflow-test-report-NHCH-PUBLISH.md).

---

*2026-04-27 13:32 — Seed 3/5 (THU_CONG PASS, NGAU_NHIEN BE 422). **2026-04-27 21:35 (B5b)** — Re-run 2/2 NGAU_NHIEN PASS sau publish NHCH → ✅ 5/5. QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01`.*
