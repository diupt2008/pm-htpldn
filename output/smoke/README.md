# Folder smoke/ — State Machine Specs

Folder này chứa **State Machine Specs** (trạng thái + Test Paths + Business Rules + Data Readiness).

> **Smoke Test Specs (self-contained 4 bước)** nằm ở folder khác: [../smoke-specs/](../smoke-specs/).

---

## Nguồn gốc

Tách từ [test-strategy.md §6](../test-strategy.md#6-test-theo-state-machine). Mỗi file là một State Machine độc lập với danh sách trạng thái, Test Paths, Business Rules, Data Readiness và mapping sang Test Cases.

> **Thứ tự số khớp [../../input/srs-v3/](../../input/srs-v3/)** — `6.N-sm-<module>.md` tương ứng với `srs-fr-N-<module>.md` và `funtion/7.N-<module>.md`. Các số skip (6.1, 6.3, 6.7, 6.8, 6.9, 6.11–6.16) là phân hệ không có State Machine riêng hoặc chưa có module test.

## Danh sách State Machines

| # | State Machine | File | Trạng thái | Test Paths | Module liên quan |
|---|---------------|------|------------|------------|------------------|
| 6.2 | SM-HOIDAP (Hỏi đáp Pháp luật) ✏️ v3.5 | [6.2-sm-hoidap.md](6.2-sm-hoidap.md) | 9 | 11 | [§7.2](../funtion/7.2-hoi-dap-phap-ly.md) |
| 6.4 | SM-TVV (Tư vấn viên) | [6.4-sm-tvv.md](6.4-sm-tvv.md) | 9 | 8 | [§7.4](../funtion/7.4-chuyen-gia-tvv.md) |
| 6.5 | SM-VUVIEC (Vụ việc) | [6.5-sm-vuviec.md](6.5-sm-vuviec.md) | 12 | 9 | [§7.5](../funtion/7.5-vu-viec-htpl.md) |
| 6.6 | SM-CHITRA (Chi trả) ✏️ v3.5 | [6.6-sm-chitra.md](6.6-sm-chitra.md) | 10 | 11 | [§7.6](../funtion/7.6-chi-tra-chi-phi.md) |
| 6.10 | SM-TAIKHOAN (Tài khoản) | [6.10-sm-taikhoan.md](6.10-sm-taikhoan.md) | 4 | 7 | [§7.10](../funtion/7.10-quan-tri-he-thong.md) |
| | **Tổng** | | **44** | **44** | |

*Module 6.3 (Đào tạo), 6.7 (Doanh nghiệp), 6.8 (Đánh giá), 6.9 (Biểu mẫu), 6.12 (TVCS), 6.13 (TV Nhanh) có SM spec nằm trong file functional `output/funtion/7.X-*.md` — không tách file SM riêng. Entity Doanh nghiệp (6.7) không có state machine.*

---

## Cách dùng State Machine khi test

1. **Xác định state cần test** — Mỗi Test Path yêu cầu bản ghi ở state khởi đầu cụ thể.
2. **Smoke test trước** — Xem [../smoke-specs/](../smoke-specs/) để verify module chạy được → sau đó đếm rows từng tab trạng thái → tab trống = cần tạo data.
3. **Walk workflow** — Nếu thiếu state, dùng path happy để đẩy bản ghi tới state cần.
4. **Verify transition** — Test mỗi transition: precondition → action → postcondition (state mới + side effects như SLA, notification, audit log).

## Nguyên tắc test State Machine

- **Coverage đầy đủ:** Mỗi transition hợp lệ ≥1 TC.
- **Negative path:** Cố thực hiện transition không hợp lệ → verify bị chặn.
- **Guard conditions:** TVV vô hiệu hóa khi có VV, DN xóa khi có VV, CB PD cùng cấp mới duyệt được.
- **Auto-transition:** Verify cả điều kiện trigger lẫn state chuyển đổi đúng.
- **Immutability:** Sau một số state (DA_DUYET), bản ghi không được sửa/xóa (BR-FLOW-03).
- **Rollback:** Một số state cho phép quay lại (reject → về lại state trước).

## Business Rules cross-cutting

| BR | Áp dụng ở State Machine |
|----|-------------------------|
| BR-EC-15 | SM-VUVIEC (TP-VV-02), SM-CHITRA (TP-CT-02) — bổ sung lần 4 auto TU_CHOI |
| BR-FLOW-01 | SM-HOIDAP (TP-HD-04) — auto-transition "Đã trả lời" |
| BR-FLOW-03 | SM-HOIDAP, SM-VUVIEC, SM-CHITRA — immutability sau DA_DUYET |
| BR-FLOW-04 | Tất cả SM có reject path — bắt buộc nhập lý do |
| BR-SLA-01, BR-SLA-02 | SM-HOIDAP, SM-VUVIEC |
| BR-AUTH-07, BR-EC-05 | SM-TAIKHOAN — khóa tài khoản, session limit |

---

## Tham chiếu

- [test-strategy.md](../test-strategy.md) — tài liệu chiến lược tổng
- [§3 Chiến lược kiểm thử](../test-strategy.md#3-chiến-lược-kiểm-thử)
- [§4 Phương pháp kiểm thử](../test-strategy.md#4-phương-pháp-kiểm-thử)
- [§7.0 Data Readiness](../test-strategy.md#70-data-readiness--phương-pháp-chuẩn-bị-dữ-liệu-test) — cách dùng State Machine để chuẩn bị data
- [funtion/README.md](../funtion/README.md) — index module Test Case Matrix
- [../smoke-specs/README.md](../smoke-specs/README.md) — **Smoke Test Specs (11 module)**
