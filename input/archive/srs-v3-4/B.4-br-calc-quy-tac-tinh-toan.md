# B.4 BR-CALC: Quy tắc Tính toán

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|-----------|---------|------------|
| BR-CALC-01 | **Mức hỗ trợ chi phí theo quy mô DN (NĐ18/2026):** DN siêu nhỏ = 100% (trần 3 triệu/năm), DN nhỏ = tối đa 30% (trần 5 triệu/năm), DN vừa = tối đa 10% (trần 10 triệu/năm) | NĐ18/2026, PRD FR-V.II-05 | FR-V.II-05, FR-VIII-12 | Địa phương (UBND tỉnh) có thể quyết định mức phí trần riêng | Test calculation per quy_mo_dn |

> **Phương án dự phòng:** Nếu NĐ18/2026 không ban hành hoặc ban hành với mức khác, hệ thống fallback về NĐ55/2019 (Điều 4 khoản 3): mức hỗ trợ do UBND cấp tỉnh quyết định. Entity CAU_HINH_SLA + DANH_MUC (loại = 'DINH_MUC_CHI_PHI') cho phép QTHT cập nhật mức hỗ trợ mà KHÔNG cần sửa code. FR-VIII-12 seed data sẽ được điều chỉnh theo văn bản chính thức.
| BR-CALC-02 | **Số tiền được duyệt = MIN(so_tien_de_nghi, phi_tu_van * muc_ho_tro_%, tran_ho_tro_nam - da_chi_trong_nam)** | NĐ18/2026, NĐ55/2019 | FR-V.II-05 | — | Test edge cases (vượt trần) |
| BR-CALC-03 | **Deadline = ngày tiếp nhận + N ngày làm việc.** N lấy từ CAU_HINH_SLA. Ngày làm việc: Thứ 2-6, trừ ngày lễ (cấu hình) | FR-VIII-10, NĐ55 Điều 9 | FR-V.I-01, FR-II-CROSS-01 | — | Test deadline tính đúng ngày LV |
| BR-CALC-04 | **Tiêu chí đánh giá: tổng trọng số các tiêu chí = 100%.** Điểm tổng = SUM(diem_i * trong_so_i / 100) | FR-VIII-11 | FR-VI-06 | — | Test SUM(trong_so) = 100 |
| BR-CALC-05 | **Ưu tiên phân công (NĐ55 Điều 4):** (1) DN phụ nữ làm chủ, (2) DN nhiều LĐ nữ, (3) DN ≥30% LĐ khuyết tật, (4) FIFO (nộp trước ưu tiên) | NĐ55/2019 Điều 4 | FR-V.I-09 | CB NV có quyền override gợi ý | Test priority sorting |
| BR-CALC-06 | **`diem_danh_gia_tb = AVG(diem_trung_binh)` từ tất cả `DANH_GIA_SAU_VU_VIEC`** (nguồn đánh giá từ DN sau vụ việc — phản ánh chất lượng thực tế). Thang **1–5**, làm tròn **1 chữ số thập phân** (round-half-up). Nếu chưa có đánh giá → `NULL`, hiển thị "—/5" (không hiển thị "0"). Điểm thẩm định nội bộ (DANH_GIA_TU_VAN_VIEN) **KHÔNG** dùng để tính `diem_danh_gia_tb`. | FR-IV-09, review 2026-04-19 | FR-IV-09, FR-IV-CROSS-01 | — | Test AVG(diem_trung_binh) từ DANH_GIA_SAU_VU_VIEC, thang 1–5, round-half-up |

**Trạng thái:** 🟡 Đề xuất — BR-CALC-01/02 chờ CĐT xác nhận NĐ18/2026
