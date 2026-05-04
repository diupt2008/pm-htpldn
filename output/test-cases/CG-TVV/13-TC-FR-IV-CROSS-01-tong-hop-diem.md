# Test Cases — FR-IV-CROSS-01: Tổng hợp điểm đánh giá TVV (Background Trigger)

> **SRS Ref**: FR-IV-CROSS-01, Entity TU_VAN_VIEN.diem_danh_gia_tb (UPDATE) sau INSERT DANH_GIA_TU_VAN_VIEN
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **Ngày tạo**: 2026-05-01
> **Note**: Đây là **Cross-cutting trigger** (không có UI riêng). Test verify auto-update `diem_danh_gia_tb` realtime sau mỗi INSERT DANH_GIA_TVV (NLM cite [17]).

---

## A. UI VERIFICATION CONTEXT

UC này không có UI riêng. UI verify nằm trong:
- TC-CG-UI-10 (UC47 Tab Đánh giá): điểm tổng hợp + 3 progress bar update
- TC-CG-UI-01 (SCR-IV-01): cột "Điểm DG" cập nhật

---

## B. TRIGGER HAPPY (Realtime)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1201 | FR-IV-CROSS-01 / BR-CALC-06 | INSERT đánh giá đầu tiên → diem_danh_gia_tb = điểm đó | DN. TVV "TVV-TW-200" chưa có DANH_GIA_TVV. | DANH_GIA_TVV: diem_tong=8.0 | 1. DN submit 1 đánh giá (diem_chuyen_mon=8, thai_do=8, thoi_gian=8 → tổng 8.0). 2. Query DB: SELECT diem_danh_gia_tb FROM TU_VAN_VIEN WHERE id=200. | **STATE**: Trigger fire (NLM cite [17] step 1 "Trigger sau khi tạo DANH_GIA_TVV mới"). UPDATE TU_VAN_VIEN.diem_danh_gia_tb=8.0 (AVG của 1 record = 8.0, NLM cite [17] step 2). **UI**: SCR-IV-01 cột Điểm DG cho TVV-200 hiển thị "8.0" + 4 sao. SCR-IV-03 header sao update. Tab Đánh giá điểm tổng hợp = "8.0/10". **PERSIST**: F5 reload → 8.0. | Happy 🔴 |
| TC-CG-1202 | FR-IV-CROSS-01 / BR-CALC-06 | INSERT đánh giá thứ 2 → AVG được tính lại | DN_other. TVV "TVV-TW-200" đã có 1 đánh giá điểm tổng=8.0. | DANH_GIA_TVV mới: diem_tong=10.0 | 1. DN khác submit đánh giá thứ 2 (diem_tong=10.0). 2. Query DB. | **STATE**: AVG recalc = (8 + 10)/2 = 9.0. UPDATE diem_danh_gia_tb=9.0. **UI**: SCR-IV-01 cột Điểm DG = "9.0". Tab Đánh giá điểm tổng = "9.0/10 (2 đánh giá)". 3 progress bar update: chuyên môn avg ((8+10)/2)/10=90%; thái độ avg=...; đúng hạn avg=... **PERSIST**: F5 → 9.0. | Happy 🔴 |

---

## C. NEGATIVE / EDGE EDGE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1203 | FR-IV-CROSS-01 | DELETE đánh giá → diem_danh_gia_tb có recalc không? | DN. TVV "TVV-TW-200" có 2 đánh giá (8.0, 10.0). diem_danh_gia_tb=9.0. | DELETE DANH_GIA_TVV record với điểm 10.0 | 1. Admin/QTHT xóa 1 record DANH_GIA_TVV (nếu chức năng có). | **STATE**: Per SRS — NLM cite [17] chỉ nói "Trigger sau khi **tạo**" (INSERT). Không quote rõ DELETE/UPDATE có trigger không → SPEC-CLARIFY-CG-33. Nếu có trigger → AVG recalc = 8.0. Nếu không → diem_danh_gia_tb stale = 9.0. **UI**: Tùy SRS. **PERSIST**: Verify behavior thực tế. | Edge 🟡 |
| TC-CG-1204 | FR-IV-CROSS-01 | TVV chưa có đánh giá → diem_danh_gia_tb = NULL | CB_NV_TW. TVV "TVV-TW-201" mới tạo. | — | 1. Query DB. 2. Verify SCR-IV-01 cột Điểm DG. | **STATE**: diem_danh_gia_tb=NULL (default per NLM cite [10] field "không bắt buộc"). **UI**: SCR-IV-01 cột Điểm DG = "—" (NLM cite [1] row 22 "Nếu chưa đánh giá → '—'"). Tab Đánh giá: "Chưa có đánh giá". **PERSIST**: — | Edge |
| TC-CG-1205 | FR-IV-CROSS-01 / BR-CALC-06 | INSERT 100 đánh giá đồng thời → integrity AVG | DN team. TVV "TVV-TW-202". | 100 INSERT đánh giá song song với điểm khác nhau | 1. Concurrent INSERT 100 records (load test). 2. Query final diem_danh_gia_tb. | **STATE**: Trigger fire 100 lần. Final AVG đúng = SUM(diem_tong) / 100. Không có race condition (BE phải lock row TU_VAN_VIEN khi UPDATE). **UI**: Eventually consistent. **PERSIST**: Math check chính xác. | Edge 🟡 |
| TC-CG-1206 | FR-IV-CROSS-01 | UPDATE đánh giá (sửa điểm) → diem_danh_gia_tb có recalc? | DN cố sửa đánh giá đã gửi. | UPDATE DANH_GIA_TVV.diem_tong | 1. Admin/QTHT update 1 record DANH_GIA_TVV (nếu UI cho sửa). | **STATE**: SRS Gap (NLM cite [17] không quote UPDATE có trigger không) → SPEC-CLARIFY-CG-33 reuse. **UI**: — **PERSIST**: — | Edge 🟡 |

---

## D. EDGE BỔ SUNG (Edge Case Hunter Review 2026-05-01)

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-1207 | FR-IV-CROSS-01 / SPEC-CLARIFY-CG-35 / NLM cite [16] vs cite [6] | Verify trigger CHẠY khi DELETE/UPDATE DANH_GIA_TVV (theo cite [6]) hoặc CHỈ INSERT (theo cite [16]) | DN. TVV với 2 đánh giá. diem_danh_gia_tb=8.5. | DELETE 1 record DANH_GIA_TVV | 1. Admin xóa 1 record (qua API hoặc DB direct). 2. Verify diem_danh_gia_tb. | **STATE**: SRS conflict — cite [16] processing chỉ "Trigger sau khi tạo"; cite [6] DB note "INSERT/UPDATE/DELETE". → Test thực tế xác định behavior. Nếu trigger DELETE → AVG recalc; nếu không → stale. **UI**: SCR-IV-01 cột Điểm DG có thể stale. **PERSIST**: SPEC-CLARIFY-CG-35 verify lại. | Edge 🔴 |
| TC-CG-1208 | FR-IV-CROSS-01 / NLM cite [6] | diem_danh_gia_tb sau CROSS-01 = NULL khi xóa hết đánh giá (boundary 0 record) | DN. TVV-TW-200 có 1 đánh giá duy nhất. | DELETE record duy nhất | 1. Xóa đánh giá. 2. Verify TU_VAN_VIEN.diem_danh_gia_tb. | **STATE**: Nếu trigger DELETE chạy (per cite [6]) → AVG of empty = NULL hoặc 0. SRS Gap nguyên văn. → Mark SPEC-CLARIFY-CG-49. **UI**: SCR-IV-01 cột Điểm DG: "—" (cite [8] row 22 "Nếu chưa đánh giá → '—'"). **PERSIST**: — | Edge 🟡 |
| TC-CG-1209 | FR-IV-CROSS-01 / SPEC-CLARIFY-CG-34 / NLM cite [6] | CHECK constraint `diem_danh_gia_tb BETWEEN 0 AND 5` (cite [6] ERD) — verify boundary | DN. TVV. | Submit đánh giá điểm tổng=10 (out of [0,5] per ERD constraint) | 1. INSERT đánh giá điểm 10. 2. CROSS-01 trigger UPDATE diem_danh_gia_tb. | **STATE**: SRS conflict — cite [6] ERD: "CHECK (diem_danh_gia_tb BETWEEN **0 AND 5** OR IS NULL)" vs cite [10] Outputs FR-IV-01: "0-10". → Nếu DB constraint enforce 0-5 → UPDATE FAIL → trigger throw error → CROSS-01 fail → đánh giá vẫn được lưu nhưng diem_danh_gia_tb không update. **UI**: Tùy. **PERSIST**: SPEC-CLARIFY-CG-34 verify. | Edge 🔴 |
