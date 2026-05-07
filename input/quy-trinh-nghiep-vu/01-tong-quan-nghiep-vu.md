---
title: Quy trình nghiệp vụ PM HTPLDN — Tổng quan dễ hiểu
source: NotebookLM gstack-HTPLDN (33 SRS sources) + SRS update v3.5 (2026-05-05/06)
created: 2026-04-24
updated: 2026-05-07 — bổ sung §6 ghi chú thay đổi v3.5 (4 luồng mới + rename module FR-08/FR-12)
---

# PM HTPLDN — Tổng quan nghiệp vụ dễ hiểu

## 1. Hệ thống làm gì?

PM HTPLDN (Phần mềm Hỗ trợ Pháp lý Doanh nghiệp) là hệ thống **Backend CMS + 18 API** phục vụ Cục BLDS&KT (Bộ Tư pháp) và các Sở Tư pháp, giúp **số hóa 100% nghiệp vụ hỗ trợ pháp lý** cho doanh nghiệp nhỏ và vừa (DNNVV) theo:
- Luật Hỗ trợ DNNVV 2017
- NĐ55/2019/NĐ-CP
- NĐ18/2026/NĐ-CP

**Mục tiêu số:**
- Số hóa 100% nghiệp vụ HTPL.
- Giảm ≥ 30% thời gian xử lý hồ sơ.
- Đồng bộ real-time với **Cổng Pháp luật Quốc gia (Cổng PLQG)** qua 18 API.

**Doanh nghiệp KHÔNG đăng nhập CMS** — họ tương tác gián tiếp qua chuyên trang trên Cổng PLQG. CMS phục vụ **cán bộ nhà nước** xử lý nghiệp vụ.

---

## 2. Ai dùng hệ thống? (11 vai trò người thật + 3 hệ thống ngoài)

### Nhóm A — Quản trị (scope toàn hệ thống)
| Vai trò | Viết tắt | Làm gì |
|---------|----------|--------|
| Quản trị hệ thống | **QTHT** | Thấy toàn bộ. Tạo tài khoản, phân quyền, cấu hình SLA, danh mục dùng chung. Là "người dọn đường" — chạy TRƯỚC mọi nghiệp vụ. |

### Nhóm B — Cán bộ Nghiệp vụ (xử lý hồ sơ, 3 cấp)
Quy tắc scope: **TW thấy tất cả; BN thấy BN mình; ĐP thấy ĐP mình. Ngang cấp không thấy nhau.**

| Vai trò | Viết tắt | Scope | Làm gì |
|---------|----------|-------|--------|
| Cán bộ Nghiệp vụ TW | **CB NV TW** | Toàn quốc (Cục BLDS&KT) | Tiếp nhận hồ sơ cấp TW, điều phối toàn hệ thống |
| Cán bộ Nghiệp vụ BN | **CB NV BN** | 1 Bộ/Ngành | Xử lý hồ sơ nội bộ Bộ/Ngành |
| Cán bộ Nghiệp vụ ĐP | **CB NV ĐP** | 1 Sở Tư pháp | Xử lý hồ sơ cấp tỉnh, trực tiếp làm việc với DN/TVV |

### Nhóm C — Cán bộ Phê duyệt (3 cấp — chỉ duyệt cùng cấp)
| Vai trò | Viết tắt | Nhiệm vụ |
|---------|----------|----------|
| CB Phê duyệt TW | **CB PD TW** | Duyệt kết quả do CB NV TW trình |
| CB Phê duyệt BN | **CB PD BN** | Duyệt kết quả do CB NV BN trình |
| CB Phê duyệt ĐP | **CB PD ĐP** | Duyệt kết quả do CB NV ĐP trình |

**Luật bất biến (BR-AUTH-05):** Duyệt CHỈ trong cùng cấp. TW duyệt TW, không duyệt xuyên cấp xuống BN/ĐP.

### Nhóm D — Đối tượng chuyên môn (cấp ĐP, lọc kép theo BR-AUTH-10)
| Vai trò | Viết tắt | Thấy gì |
|---------|----------|---------|
| Tư vấn viên | **TVV** | Chỉ vụ việc được phân công đích danh |
| Người hỗ trợ | **NHT** | Chỉ vụ việc được phân công đích danh |
| Chuyên gia | **CG** | Chỉ yêu cầu TV chuyên sâu được phân công đích danh |

### Nhóm E — Doanh nghiệp & Hệ thống ngoài
| Đối tượng | Cách tương tác |
|-----------|----------------|
| **Doanh nghiệp (DN)** | KHÔNG đăng nhập CMS. Gửi hồ sơ/câu hỏi qua **Cổng PLQG** hoặc **HT TTHC BTP (DVC)**. Lọc API: chỉ thấy hồ sơ của chính mình (BR-AUTH-11). |
| **Cổng PLQG** | Gọi 18 API REST JSON (không qua LGSP) |
| **HT TTHC BTP** | Gửi hồ sơ TTHC qua LGSP event-driven |

---

## 3. Ba kịch bản nghiệp vụ End-to-End chính

Trong đời thực, một DN gặp vấn đề pháp lý sẽ đi theo **1 trong 3 luồng** tùy mức độ phức tạp:

### LUỒNG A — Hỏi đáp nhanh (FR-02 → FR-13)
> "Doanh nghiệp có câu hỏi ngắn, cần câu trả lời trong 3 ngày."

```
DN ─(Cổng PLQG)─▶ Hỏi đáp MOI
                      │ (CB NV tiếp nhận)
                      ▼
                  TIEP_NHAN (tự tính SLA)
                      │ (CB NV phân công TVV/NHT)
                      ▼
                  DANG_XU_LY
                      │ (TVV soạn phản hồi + tích "Đã trả lời")
                      ▼
                  CHO_PHE_DUYET  ◀── auto-transition (BR-FLOW-01)
                      │ (CB PD duyệt cùng cấp)
                      ▼
                  DA_DUYET ────────▶ Tự động tạo bản ghi
                      │              trong Kho Câu hỏi FR-13
                      │ (CB NV nhấn "Công khai")
                      ▼
                  CONG_KHAI ──▶ API đẩy lên Cổng PLQG
                      │
                      ▼
                  HOAN_THANH
```

**Điểm nối tự động:** Khi Hỏi đáp chuyển `DA_DUYET`, hệ thống **auto tạo** bản ghi trong Kho Q&A Tư vấn Nhanh (FR-13) với `nguon=TU_DONG`, phục vụ tìm kiếm full-text trên Cổng PLQG.

### LUỒNG B — Vụ việc TGPL (FR-05 → FR-14 → FR-06 → FR-08)
> "Doanh nghiệp cần tư vấn sâu, có TVV xử lý, nhà nước chi trả chi phí."

```
DN ─(DVC/trực tiếp)─▶ Vụ việc CHO_TIEP_NHAN
                            │ (CB NV tiếp nhận)
                            ▼
                       DA_TIEP_NHAN
                            │ (CB NV kiểm tra checklist UC106:
                            │  6 hạng mục — Mẫu 01, ĐKKD, quy mô DN,
                            │  hợp đồng TV, văn bản TV đầy đủ & loại BMKD)
                            ▼
                       DANG_KIEM_TRA
                       │  │  │
                       │  │  └─▶ TU_CHOI (không đạt)
                       │  └────▶ YEU_CAU_BO_SUNG (thiếu HS, tối đa 3 lần BR-EC-15)
                       │ (đạt + chọn TVV)
                       ▼
                   DA_PHAN_CONG
                            │ (TVV xác nhận tham gia)
                            ▼
                       DANG_XU_LY
                            │ (TVV làm việc, cập nhật KQ; CB NV trình)
                            ▼
                       CHO_PHE_DUYET
                            │ (CB PD duyệt cùng cấp)
                            ▼
                       DA_DUYET
                            │ (CB NV cập nhật KQ cuối, đóng hồ sơ)
                            ▼
                       HOAN_THANH
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
  [FR-14 Hợp đồng TV]  [FR-06 Chi trả]  [FR-08 Đánh giá định kỳ]
  CB NV lập HĐ         DN nộp Mẫu 01 NĐ55:  CB NV lập đợt,
  với TVV/Tổ chức      tiếp nhận → đánh giá  chọn VV đã HOAN_THANH,
  → điền số HĐ vào     mức HT theo quy mô    chấm điểm TT17,
  hồ sơ Chi trả        (Siêu nhỏ 100% /      sinh báo cáo,
                       Nhỏ 30% / Vừa 10%)    CB PD duyệt
                       → thẩm định chứng từ
                       → CB PD duyệt
                       → DA_THANH_TOAN
```

**Quy tắc tính chi trả quan trọng (BR-CALC-01):**
- DN Siêu nhỏ: nhà nước trả **100%** phí TV
- DN Nhỏ: **30%**
- DN Vừa: **10%**
- Có **trần năm** — tổng HT trong năm không vượt mức quy định → công thức: `MIN(phí × mức%, trần_năm − đã_HT)`

### LUỒNG C — Tư vấn chuyên sâu (FR-12)
> "Doanh nghiệp có vấn đề phức tạp, cần Chuyên gia cấp cao, không phải TVV thông thường."

```
DN ─(Cổng PLQG API inbound)─▶ YC TV Chuyên sâu TIEP_NHAN
                                    │ (CB NV phân công CG)
                                    ▼
                              PHAN_CONG
                                    │ (CG xác nhận tham gia)
                                    ▼
                              DANG_TU_VAN
                                    │ (CG làm phiên TV, có VB TVPL, tích "Hoàn thành")
                                    ▼
                              HOAN_THANH ──▶ auto ──▶ CHO_PHE_DUYET
                                    │ (CB PD cùng cấp duyệt)
                                    ▼
                              DA_DUYET ──▶ Gửi KQ cho DN + TB đánh giá
                                    │
                                    ▼
                        Metadata đẩy API FR-XII-13
                        (chỉ metadata, KHÔNG có nội dung VB chi tiết)
```

**Điểm đặc biệt (BR-FLOW-07):** Tư liệu pháp lý đính kèm YC TV chuyên sâu có thể **công khai ngay** không cần phê duyệt thêm — CB NV chủ động chọn.

---

## 4. Các nguyên tắc xuyên suốt

### SLA & deadline
- Hỏi đáp: theo cấu hình `cau_hinh_sla` (QTHT set ở FR-10)
- Vụ việc TGPL: **10 ngày LV** (NĐ55 Đ9)
- Mỗi bản ghi có trường `muc_do_canh_bao`: `BINH_THUONG / SAP_HET / QUA_HAN / QUA_HAN_NGHIEM_TRONG`

### Audit log (BR-DATA-05)
Mọi thao tác CRUD, chuyển trạng thái, duyệt/từ chối đều **ghi AUDIT_LOG** — không xóa vật lý.

### Từ chối phê duyệt (BR-FLOW-04)
CB PD từ chối **BẮT BUỘC** nhập lý do ≥ 10 ký tự. Lý do lưu audit + gửi thông báo ngược lại CB NV.

### Công khai lên Cổng PLQG (BR-FLOW-05)
- Hỏi đáp `DA_DUYET` → nhấn "Công khai" → gọi API push lên Cổng.
- Có thể "Hủy công khai" → gỡ khỏi Cổng, trạng thái quay về `DA_DUYET`.

### Phân quyền lọc kép (BR-AUTH-10)
TVV/NHT/CG đi qua **2 lớp lọc**:
1. Lớp 1 — data scope theo Sở Tư pháp (giống CB NV ĐP).
2. Lớp 2 — application layer: chỉ thấy bản ghi được phân công đích danh.

---

## 5. Bản đồ quan hệ 16 module

Xem chi tiết ở file [02-thu-tu-module.md](./02-thu-tu-module.md).

Tóm tắt 5 tầng:
1. **Tầng NỀN** — FR-10 Quản trị HT (QTHT chạy đầu tiên)
2. **Tầng MASTER DATA** — FR-07 DN, FR-04 CG/TVV/NHT/TC TV, FR-09 Biểu mẫu, FR-15 CT HTPLDN
3. **Tầng GIAO DỊCH LÕI** — FR-05 Vụ việc, FR-02 Hỏi đáp, FR-12 Tư vấn pháp luật chuyên sâu, FR-03 Đào tạo
4. **Tầng GIAO DỊCH PHÁI SINH** — FR-14 Hợp đồng, FR-06 Chi trả, FR-13 TV Nhanh, FR-08 Theo dõi Đánh giá Hiệu quả HTPL
5. **Tầng TỔNG HỢP** — FR-11 Báo cáo, FR-01 Dashboard, FR-16 API

---

## 6. Ghi chú thay đổi v3.5 (cherry-pick 2026-05-05/06)

> **Nguồn:** [`../srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md`](../srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) + [`srs-v3.5.md`](../srs-update-2026-5-5/srs-v3.5.md) consolidated. File này giữ nguyên 5 section trên; bổ sung 4 luồng mới + 2 rename module để khớp v3.5.

### 6.1 Rename module
- **FR-12 Tư vấn chuyên sâu → "Tư vấn pháp luật chuyên sâu"** (CHANGELOG §srs-fr-12 Thay đổi 1).
- **FR-08 Kế hoạch đánh giá → "Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý"** + entity `DOT_DANH_GIA / DANH_GIA_HQ` → `KE_HOACH_DANH_GIA` (CHANGELOG §srs-fr-08 Thay đổi 1+6).

### 6.2 Bốn luồng nghiệp vụ MỚI
1. **TC TV approval (FR-IV-NEW-01/02/04 — CB NV/PD ĐP):** TC tư vấn nâng từ DM lên entity riêng `TO_CHUC_TU_VAN`. Vòng đời: `MOI_DANG_KY` → CB NV trình → CB PD công bố vào MLTV (NĐ 55/2019 Đ.9, BR-AUTH-05) → `HOAT_DONG`. Cite: `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md`.
2. **NHT lifecycle (FR-IV-NHT-01/02/03 — QTHT/CB NV + NHT cá nhân):** NHT tách entity riêng `NGUOI_HO_TRO` (NĐ 55/2019 Đ.7), `loai_tvv` enum chỉ còn `('TVV','CG')`. Tạo NHT → tạo TAI_KHOAN gán role NHT `CHO_KICH_HOAT` → NHT bấm link mail kích hoạt (FR-VIII-26) → `HOAT_DONG`. NHT có quyền `📝 RU*` trên hồ sơ NHT của chính mình + HSPL_DN của VV được phân công.
3. **DN bổ sung HSCT (FR-V.II-14 — DN qua DVC/Cổng PLQG):** Khi HSCT ở `YEU_CAU_BO_SUNG`, DN có ≤5 ngày LV để bổ sung file qua Cổng PLQG hoặc CB NV bổ sung thủ công. Tối đa 3 lần (`bo_sung_count` CHECK 0-3). Sau bổ sung → `DANG_KIEM_TRA` quay lại quy trình thẩm định/duyệt. Cite: `srs-update-2026-5-5/srs-fr-06-chi-tra.md`.
4. **FR-VI-10 Nhận kết quả ĐG (CB NV cơ quan được ĐG — read-only):** Khi đợt ĐG ở `HOAN_THANH`, CB NV thuộc `co_quan_duoc_danh_gia_id` (cơ quan được ĐG, có thể KHÁC `don_vi_id` cơ quan thực hiện ĐG) được 👁️ R\* trên KE_HOACH_DANH_GIA + KET_QUA_DANH_GIA + BAO_CAO_DANH_GIA. Cite: GAP-VI-04.

### 6.3 Thay đổi xuyên suốt (cross-cutting)
- **C1 Hard-delete:** bỏ trạng thái `DA_XOA` toàn dự án — DELETE soft → DELETE thật + AUDIT_LOG ghi.
- **C3 Lưu nháp HẸP:** bỏ button [Lưu nháp] ở các form không có entry state `DU_THAO`.
- **2-tier permission (BR-AUTH-08):** `BN không có ĐP trực thuộc` (FR-V.I refactor v3.5).
- **5 trường công khai chuẩn (CR-01):** áp HOI_DAP/PHAN_HOI/VU_VIEC/BIEU_MAU/TU_VAN_CHUYEN_SAU/TU_LIEU_PHAP_LY_VV — `cong_khai`/`anh_dai_dien`/`thoi_gian_dang_tai`/`mo_ta_cong_khai`/`file_dinh_kem_cong_khai`.
- **UC renumber +4 offset FR-11:** UC120-142 → UC124-146 (FR-VIII-22..25 chiếm UC120-123).
- **9 entity mới:** NGUOI_HO_TRO, TO_CHUC_TU_VAN, NGAY_LE, PHAN_CONG_VU_VIEC, DANH_GIA_VU_VIEC, LICH_SU_VU_VIEC, HO_SO_PHAP_LY_DN, TU_LIEU_PHAP_LY_VV, DANH_GIA_CHAT_LUONG_TV, THAM_DINH_HO_SO, PHE_DUYET_CHI_TRA, DOT_BAO_CAO (chính thức 3.4.3.10a), DOANH_NGHIEP_LINH_VUC, DANH_GIA_SAU_VU_VIEC.
