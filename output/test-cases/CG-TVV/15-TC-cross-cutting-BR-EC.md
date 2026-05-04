# Test Cases — Cross-cutting BR-EC (FR-IV)

> **SRS Ref**: BR-EC-04, BR-EC-05, BR-EC-08, BR-EC-15, BR-EC-16, BR-EC-17, BR-EC-18, BR-EC-19, BR-EC-20, BR-EC-23 — apply across multiple UC trong nhóm FR-IV
> **Nguồn**: NotebookLM `2160bfb1-2020-4199-90a6-d607b298bb42`, conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`, source `64c9d5bf-0886-42e5-a621-6c5a8aa6e87a` (Phụ lục B Edge Case Rules) cite [5]
> **Ngày tạo**: 2026-05-01
> **Note**: File này tạo từ Edge Case Hunter Review 2026-05-01. Cover các BR-EC cross-cutting ảnh hưởng nhiều UC nhưng không thuộc file UC riêng nào. Tất cả TraceID + nguyên văn đã verify với NotebookLM cite [5].

---

## A. UI VERIFICATION CONTEXT

File này không có SCR riêng. UI verification embedded trong từng TC (vd: cảnh báo storage 90%, batch limit 100 record, escalation notification).

---

## B. TIMEOUT & WORKFLOW AUTO-TRANSITION

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-CC-01 | BR-EC-15 / NLM cite [5] | YEU_CAU_BO_SUNG max 3 lần — lần 4 auto-TU_CHOI | CB_NV_TW. TVV đã 3 lần YEU_CAU_BO_SUNG (counter=3). | Lần 4 ket_luan=YEU_CAU_BO_SUNG | 1. CB_NV_TW thẩm định lần 4. 2. ket_luan=YEU_CAU_BO_SUNG. 3. [Gửi KQ]. | **STATE**: BE counter check (cite [5] BR-EC-15 nguyên văn: "**Tối đa 3 lần bổ sung. Sau lần 3 nếu vẫn không đạt → tự động TU_CHOI**"). UPDATE TU_VAN_VIEN.trang_thai='TU_CHOI' AUTO (system-driven, không phải CB PD). AUDIT_LOG hanh_dong='AUTO_REJECT', nguoi_thuc_hien=SYSTEM. **UI**: Toast cho CB NV: "Hồ sơ tự động bị từ chối do quá 3 lần yêu cầu bổ sung" (message **SRS Gap** nguyên văn). NHT nhận notification. **PERSIST**: SCR-IV-01: record sang TU_CHOI, biến mất khỏi tab "Mới đăng ký" (gộp YEU_CAU_BO_SUNG). | Edge 🔴 |
| TC-CG-CC-02 | BR-EC-16 / NLM cite [5] | YEU_CAU_BO_SUNG quá deadline N ngày LV → auto TU_CHOI | CB_NV_TW. TVV YEU_CAU_BO_SUNG đã N ngày làm việc (cấu hình CAU_HINH_SLA). | — | 1. Background scheduler cron chạy daily. 2. Verify TVV state sau N ngày. | **STATE**: BE scheduler (cite [5] BR-EC-16 nguyên văn: "**Nếu trạng thái YEU_CAU_BO_SUNG quá N ngày LV (cấu hình qua CAU_HINH_SLA) → tự động TU_CHOI + thông báo**"). UPDATE trang_thai='TU_CHOI'. **UI**: NHT nhận notification "Hồ sơ đã bị từ chối tự động do quá hạn bổ sung" (**SRS Gap** message). CB NV nhận notification. **PERSIST**: SCR-IV-01 record sang TU_CHOI. AUDIT_LOG ghi nguoi_thuc_hien=SYSTEM, ly_do=SLA timeout. | Edge 🟡 |
| TC-CG-CC-03 | BR-EC-17 / NLM cite [5] | CHO_PHE_DUYET quá 3 ngày LV → escalate CB PD cấp trên | CB_PD_TW. TVV CHO_PHE_DUYET đã 4 ngày làm việc (>3 default). | — | 1. Scheduler cron daily. 2. Verify notification. | **STATE**: BE scheduler (cite [5] BR-EC-17 nguyên văn: "**Nếu CHO_PHE_DUYET quá N ngày LV (mặc định 3) → auto-escalate CB PD cấp trên + nhắc nhở**"). KHÔNG đổi trạng thái TVV. **UI**: CB PD cấp trên nhận notification + lý do. CB PD gốc nhận reminder (message **SRS Gap**). **PERSIST**: AUDIT_LOG ghi action=ESCALATE, escalated_to=cb_pd_cap_tren_id. | Edge 🟡 |
| TC-CG-CC-04 | BR-EC-18 / NLM cite [5] | NHT/CG không phản hồi phân công vụ việc trong 3 ngày LV → auto hoàn về | NHT/CG được phân công VV. Quá 3 ngày làm việc không phản hồi. | — | 1. Scheduler. 2. Verify state. | **STATE**: cite [5] BR-EC-18 nguyên văn: "**NHT/CG không phản hồi phân công trong 3 ngày LV → tự động hoàn về trạng thái trước + alert CB NV**". → UPDATE phân công VV về trạng thái trước. **UI**: CB NV nhận alert. NHT/CG có thể nhận notification deadline. **PERSIST**: VU_VIEC quay lại trạng thái CHO_PHAN_CONG hoặc tương tự. **Note**: Cross-module với FR Vụ việc, không thuộc UC FR-IV cụ thể nhưng ảnh hưởng TVV/CG/NHT workflow. | Edge 🟡 |

---

## C. STORAGE & BATCH LIMIT

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-CC-05 | BR-EC-04 / NLM cite [5] | Storage quota 10GB/đơn vị — boundary 90% (cảnh báo) và 100% (reject) | Đơn vị TW01: dùng 9GB/10GB (90%) → upload thêm 200MB lên 92%. Đơn vị TW02: dùng 10GB/10GB (100%). | (a) NHT đơn vị TW01 upload 200MB; (b) NHT đơn vị TW02 upload 5MB | 1. Test (a): upload 200MB. 2. Test (b): upload 5MB. | **STATE**: cite [5] BR-EC-04 nguyên văn: "Mỗi đơn vị có hạn mức lưu trữ (mặc định 10GB). **90% → cảnh báo**. **100% → từ chối ERR-FILE-01**". (a): upload OK với toast warning "Đơn vị đã sử dụng 92% dung lượng" (**SRS Gap** message). (b): upload reject, error code **ERR-FILE-01** (**SRS Gap** message nguyên văn). **UI**: (a) Toast warning, file lưu. (b) Toast error, file không lưu. **PERSIST**: (a) Storage tăng. (b) Storage không đổi. | Edge 🟡 |
| TC-CG-CC-06 | BR-EC-19 / NLM cite [5] | Batch operation > 100 record → reject (UC45 batch approve + UC46 batch công khai + UC46 batch hủy công khai) | (a) CB_PD_TW: 101 TVV CHO_PHE_DUYET. (b) CB_NV_TW: 101 TVV DANG_HOAT_DONG la_cong_khai=0. | (a) batch approve 101; (b) batch công khai 101 | 1. Test (a) batch approve. 2. Test (b) batch công khai. | **STATE**: cite [5] BR-EC-19 nguyên văn: "Batch approve/batch operations: **tối đa 100 bản ghi/request**". Cả 2 case reject ở 101. **UI**: Error "Tối đa 100 bản ghi mỗi lần" (**SRS Gap** message). Nút batch có thể disable khi tick > 100. **PERSIST**: 0 record bị thay đổi state cho cả 2 test. | Edge 🟡 |
| TC-CG-CC-07 | BR-EC-20 / NLM cite [5] / NLM cite [19] (overview SCR-VV) | Transactional consistency — KHÔNG set trạng thái mới trước khi LGSP/Portal API thành công (apply UC46 công khai) | CB_NV_TW. TVV DANG_HOAT_DONG, la_cong_khai=0. Mock API portal lỗi 500 trên cả 3 retry. | — | 1. Click [Công khai]. 2. Mock API fail. 3. Verify DB. | **STATE**: cite [5] BR-EC-20 nguyên văn: "Khi commit local thành công nhưng LGSP API fail → **rollback hoặc queue compensating call. KHÔNG set trạng thái mới trước khi API thành công**". Bổ sung cite [19] cho SCR công khai: "**KHONG set CONG_KHAI truoc khi API Cong PLQG thanh cong (EC-04, BR-EC-20)**". → la_cong_khai vẫn = 0 sau 3 retry fail. **UI**: Toast WRN-CK-01 mỗi retry, toast cuối "Công khai thất bại" (**SRS Gap** message). **PERSIST**: F5 → la_cong_khai=0. AUDIT_LOG ghi attempt + fail, KHÔNG ghi PUBLISH success. Portal không có record. | Edge 🔴 |

---

## D. SECURITY & SESSION

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-CC-08 | BR-EC-08 / NLM cite [5] | UC50 Vô hiệu hóa TVV → blacklist refresh token Redis | CB_NV_TW. TVV DANG_HOAT_DONG có account TVV đang đăng nhập (refresh_token=XYZ active). | trang_thai_moi=VO_HIEU_HOA | 1. CB_NV_TW vô hiệu hóa TVV. 2. TVV cố call API bằng refresh_token=XYZ. | **STATE**: cite [5] BR-EC-08 nguyên văn: "**Logout/Lock/Disable → thêm tất cả refresh token vào blacklist Redis ngay lập tức**". → BE add XYZ vào Redis blacklist. **UI**: TVV next request → 401 Unauthorized, redirect login page. **PERSIST**: Redis blacklist contain XYZ. AUDIT_LOG ghi DISABLE + token revoke event. | Edge 🔴 |
| TC-CG-CC-09 | BR-EC-05 / NLM cite [5] | Session limit — phiên thứ 4 đăng nhập → kill phiên cũ nhất | CB_NV_TW (non-QTHT) đăng nhập 3 device active (3 phiên). | Đăng nhập device 4 | 1. Đăng nhập trên device 4. 2. Verify phiên 1 còn active không. | **STATE**: cite [5] BR-EC-05 nguyên văn: "Tối đa 3 phiên đồng thời/user. **Phiên thứ 4 hủy phiên cũ nhất**. QTHT: 1 phiên". → Phiên 1 invalidate trong Redis. **UI**: Device 1 next request → 401, redirect login với message "Phiên đăng nhập đã bị thay thế bởi đăng nhập từ thiết bị khác" (**SRS Gap** message). **PERSIST**: Redis chỉ giữ 3 phiên gần nhất. **Edge case bổ sung**: Test riêng cho QTHT — đăng nhập device 2 → kill device 1 (limit 1 phiên). | Edge 🟢 |

---

## E. NUMERIC TOLERANCE

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions | Test Data | Các bước | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|----------|------------------|------|
| TC-CG-CC-10 | BR-EC-23 / NLM cite [5] | Evaluation weight tolerance ±0.01% (CROSS-01 + UC47) | DN. TVV-TW-200 có 3 đánh giá: diem_tong=8.0, 8.5, 9.0. AVG = 8.5 chính xác. | (a) AVG case không chia hết: 3 record diem_tong=8.0, 8.0, 8.5 → AVG=8.166666... | 1. INSERT 3 record case (a). 2. CROSS-01 trigger. 3. Query DB diem_danh_gia_tb. | **STATE**: cite [5] BR-EC-23 nguyên văn: "Tổng trọng số tiêu chí: **cho phép ±0.01% sai số do làm tròn (33.33+33.33+33.34=100.00)**". → AVG (8+8+8.5)/3 = 8.16666... → BE phải làm tròn cho phép sai số ±0.01%. Verify diem_danh_gia_tb = 8.17 hoặc 8.166 (tùy precision). **UI**: SCR-IV-01 cột Điểm DG: "8.17" hoặc "8.2" (UI rounding). **PERSIST**: F5 reload không có drift. **Note**: Verify cách app handle floating-point precision. | Edge 🟢 |

---

## SPEC-CLARIFY tickets bổ sung (file này)

| ID | Mô tả |
|----|-------|
| SPEC-CLARIFY-CG-50 | BR-EC-15 (max 3 lần YEU_CAU_BO_SUNG) — counter store ở field nào? `so_lan_yeu_cau_bo_sung` trong TU_VAN_VIEN không có trong NLM cite [10] entity ERD. SRS Gap. |
| SPEC-CLARIFY-CG-51 | BR-EC-16 deadline N ngày — `CAU_HINH_SLA` config table chưa được mô tả nguyên văn cho FR-IV. Default N=? |
| SPEC-CLARIFY-CG-52 | BR-EC-17 escalation: CB PD cấp trên là cấp nào (TW → ai? BN → ?, ĐP → ?). SRS Gap. |
| SPEC-CLARIFY-CG-53 | BR-EC-23 floating-point rounding: SRS quote ±0.01% nhưng không ghi precision (decimal places) cho `diem_danh_gia_tb`. |
