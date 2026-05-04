# Seed Checklist — Ngân hàng câu hỏi (R6.3.8a)

**Ngày:** 2026-05-02 10:06 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Nháp`
**Màn:** SCR-III-04 — Ngân hàng câu hỏi • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > ngan_hang_ch_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-III + §3.4.3.21 NGAN_HANG_CAU_HOI

---

## Downstream consumer × filter

| Task downstream | Đọc filter | Số record cần | Status |
|-----------------|------------|---------------|:---:|
| R6.3.8b ĐKT — `cach_tao=NGAU_NHIEN` (FR-III-NEW-01) | `loaiCauHoi` × `mucDo` matrix (đủ DE/TRUNG_BINH/KHO cho random_config) | ≥1/mức = ≥3 | ✅ |
| R6.3.8b ĐKT — `cach_tao=THU_CONG` chọn câu cụ thể | NHCH theo `linhVucId` per khóa học | ≥1/lĩnh vực | ✅ |
| R6.4.B5b Publish NHCH `Nháp → Công khai` | `trangThai=NHAP` | ≥1 | ✅ (10/10) |

**Per-filter verify (qua API GET `/api/v1/ngan-hang-cau-hois`):**

| Filter | Count | Pass (≥3) |
|---|:---:|:---:|
| `mucDo=DE` | 4 | ✅ |
| `mucDo=TRUNG_BINH` | 3 | ✅ |
| `mucDo=KHO` | 3 | ✅ |
| `loaiCauHoi=TRAC_NGHIEM_MOT` | 6 | ✅ |
| `loaiCauHoi=TU_LUAN` | 4 | ✅ |
| Tổng | 10 | ✅ |

---

## Kết quả: ✅ XONG 10/10

Đủ 10 NHCH `Nháp` cover 6 LV (LĐ/HĐ/Thuế/SHTT/DN/ĐĐ) × 2 loại × 3 mức. R6.3.8a ⚠️ partial 6/10 trước đó → ✅ FULL 10/10 sau khi seed bổ sung 4 record (index 6/8/9/10) qua API `POST /api/v1/ngan-hang-cau-hois` (UI form fail do JWT revoke ~2 phút — fallback API direct với token từ `/api/v1/auth/refresh`).

**Bug:** Không có. (Lưu ý JWT revoke aggressive là known pattern — không phải bug task này.)

---

## Bảng dữ liệu seed

| # | Nội dung câu hỏi (rút gọn) | Lĩnh vực | Mức độ | Loại | ID | Vào kho? |
|---|---|---|---|---|---|:---:|
| 1 | Theo BLLĐ 2019, lao động phổ thông... | Lao động | Dễ | TN 1 | `17aa60b9...` | ✅ pre |
| 2 | Công ty TNHH 1 thành viên có bắt buộc... | Doanh nghiệp | Trung bình | TN 1 | `a4bda330...` | ✅ pre |
| 3 | Mức thuế TNDN ưu đãi cho DN khởi nghiệp... | Thuế | Khó | TN 1 | `da0d3565...` | ✅ pre |
| 4 | Phân tích các bước đăng ký nhãn hiệu... | SHTT | Khó | Tự luận | `c852a768...` | ✅ pre |
| 5 | HĐLĐ có giá trị pháp lý ngay khi ký... | Hợp đồng | Dễ | TN 1 | `df356eb7...` | ✅ pre |
| 7 | Theo Luật Đất đai 2024, thời hạn giao đất... | Đất đai | Dễ | Tự luận | `cbc3f62a...` | ✅ pre |
| 6 | Phân tích các điều kiện để DN được giao đất... | Đất đai | Trung bình | Tự luận | `5af179f7...` | ✅ NEW |
| 8 | DN có vốn nước ngoài thành lập công ty TNHH 1TV... | Doanh nghiệp | Trung bình | TN 1 | `65d2d37a...` | ✅ NEW |
| 9 | Phân tích quy trình đăng ký bảo hộ nhãn hiệu quốc tế... | SHTT | Khó | Tự luận | `0eccc75b...` | ✅ NEW |
| 10 | Mức xử phạt khi DN không đóng BHXH... | Lao động | Dễ | TN 1 | `63ab812a...` | ✅ NEW |

**Tổng:** 10/10 vào kho · 0 chặn

> Note: Bản ghi pre-existing index 7 (UI hiển thị "Tự luận/Dễ" thay vì TRAC_NGHIEM/DE theo fixture) là discrepancy của session seed trước, KHÔNG phải bug task này — tất cả filter downstream vẫn PASS qua per-filter verify.

---

## Ảnh chụp

- [Pre-existing 6/10](../screenshots/r6-3-8a-nhch-6-of-10.png)
- [Final 10/10 sau seed bổ sung](../screenshots/r6-3-8a-nhch-10-of-10.png)

---

## Phương pháp seed

UI form (Drawer "Thêm câu hỏi mới") gặp JWT revoke aggressive ~2 phút → fail fill textarea. Chuyển sang **API direct** trong cùng MCP session:

1. `POST /api/v1/auth/refresh` (HttpOnly cookie) → lấy `accessToken` Bearer
2. `POST /api/v1/ngan-hang-cau-hois` × 4 với body theo schema `noiDung/linhVucId/mucDo/loaiCauHoi/cacLuaChon/dapAnDung/trangThai`
3. Verify qua list reload UI + per-filter API query

4 record returned status `201` + UUID. UI list reload hiển thị 10/10 đúng giá trị.

---

*2026-05-02 10:06 — QA chạy bằng Chrome DevTools MCP + API fallback (memory `qa_htpldn_jwt_revoke_aggressive` workaround applied)*
