# Kế Hoạch Kiểm Thử — SRS-FR-IV: Quản lý Chuyên gia / Tư vấn viên (FR-IV-01 → FR-IV-12 + CROSS-01)

> **Phiên bản**: 1.0
> **Ngày tạo**: 2026-05-01
> **Nguồn dữ liệu**: NotebookLM (notebook `2160bfb1-2020-4199-90a6-d607b298bb42`), conversation `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
> **SRS Reference**: Nhóm FR-IV (UC39 → UC50 + FR-IV-CROSS-01), SCR-IV-01/02/03, Entity TU_VAN_VIEN + HO_SO_TU_VAN_VIEN + TVV_TO_CHUC + DANH_GIA_TU_VAN_VIEN + LICH_SU_HO_TRO_TVV

> **SOURCE MODE: NOTEBOOKLM** — Mọi SRS content lấy 100% từ NotebookLM. KHÔNG đọc local `input/srs-v3/`. Cite format: `NLM cite [N]` với N là citation number trong source `fe352d68-6b3a-4fe8-acfa-bd95047e6e71` (chính) và `1c462e23-b9b1-4f09-9817-dc750ea04769` (overview FR-IV).

> **Phase**: Full coverage (Happy + Negative + Edge + Auth + Cross-module) — theo user clarification 2026-05-01.

---

## 1. Phạm Vi Kiểm Thử

### 1.1 Chức năng được kiểm thử
- **12 Use Case** thuộc nhóm FR-IV (UC39 → UC50) + **1 cross-cutting** FR-IV-CROSS-01
- Cover **3 loại entity**: TVV (Tư vấn viên), CG (Chuyên gia), NHT (Người hỗ trợ)
- 3 màn hình chính: SCR-IV-01 (Danh sách), SCR-IV-02 (Form CRUD), SCR-IV-03 (Chi tiết + workflow)
- State machine **SM-TVV** với 9 trạng thái + 14 chuyển đổi
- Cover cả **Internal app** (CB NV/CB PD CRUD) và **Cổng PLQG** (NHT tự đăng ký, TVV tự cập nhật năng lực)
- Bảng dữ liệu chính: `TU_VAN_VIEN`, `HO_SO_TU_VAN_VIEN`, `TVV_TO_CHUC`, `DANH_GIA_TU_VAN_VIEN`, `LICH_SU_HO_TRO_TVV`

### 1.2 Danh sách FR / UC

| # | Mã FR | UC | Tên chức năng | SCR | Entity | File Test Case |
|---|--------|-----|--------------|------|--------|----------------|
| 1 | FR-IV-01 | UC39 | Quản lý TVV (CRUD) | SCR-IV-01, SCR-IV-02 | TU_VAN_VIEN | `01-TC-FR-IV-01-quan-ly-tvv.md` |
| 2 | FR-IV-02 | UC40 | Tìm kiếm TVV | SCR-IV-01 | TU_VAN_VIEN | `02-TC-FR-IV-02-tim-kiem-tvv.md` |
| 3 | FR-IV-03 | UC41 | Đăng ký tham gia mạng lưới (NHT) | SCR-IV-02 (chuyên trang) | TU_VAN_VIEN, HO_SO_TVV | `03-TC-FR-IV-03-dang-ky-mang-luoi.md` |
| 4 | FR-IV-04 | UC42 | Cập nhật năng lực | SCR-IV-03 (Tab Năng lực) | HO_SO_TVV | `04-TC-FR-IV-04-cap-nhat-nang-luc.md` |
| 5 | FR-IV-05 | UC43 | Xem chi tiết TVV | SCR-IV-03 | TU_VAN_VIEN | `05-TC-FR-IV-05-xem-chi-tiet-tvv.md` |
| 6 | FR-IV-06 | UC44 | Thẩm định hồ sơ TVV | SCR-IV-03 (Tab Thẩm định) | HO_SO_TVV, THAM_DINH_TVV | `06-TC-FR-IV-06-tham-dinh-ho-so.md` |
| 7 | FR-IV-07 | UC45 | Phê duyệt TVV | SCR-IV-03 (action button) | TU_VAN_VIEN | `07-TC-FR-IV-07-phe-duyet-tvv.md` |
| 8 | FR-IV-08 | UC46 | Công khai mạng lưới TVV | SCR-IV-01 (batch), SCR-IV-03 | TU_VAN_VIEN | `08-TC-FR-IV-08-cong-khai-mang-luoi.md` |
| 9 | FR-IV-09 | UC47 | Đánh giá TVV | SCR-IV-03 (Tab Đánh giá) | DANH_GIA_TU_VAN_VIEN | `09-TC-FR-IV-09-danh-gia-tvv.md` |
| 10 | FR-IV-10 | UC48 | Xem lịch sử hỗ trợ | SCR-IV-03 (Tab Lịch sử) | LICH_SU_HO_TRO_TVV | `10-TC-FR-IV-10-xem-lich-su-ho-tro.md` |
| 11 | FR-IV-11 | UC49 | NHT cập nhật hồ sơ | SCR-IV-02 (chuyên trang) | TU_VAN_VIEN | `11-TC-FR-IV-11-nht-cap-nhat-ho-so.md` |
| 12 | FR-IV-12 | UC50 | Cập nhật trạng thái TVV (SM transition) | SCR-IV-03 (modal) | TU_VAN_VIEN | `12-TC-FR-IV-12-cap-nhat-trang-thai-tvv.md` |
| 13 | FR-IV-CROSS-01 | — | Tổng hợp điểm đánh giá TVV (background) | — | TU_VAN_VIEN.diem_danh_gia_tb | `13-TC-FR-IV-CROSS-01-tong-hop-diem.md` |
| 14 | (review) | — | Edge Case Hunter Review — 57 edge bổ sung structured per-file | — | — | `14-REVIEW-edge-case-hunter.md` |
| 15 | BR-EC-04/05/08/15-20/23 | — | Cross-cutting BR-EC (storage quota, session, batch, transactional, escalation) | — | TU_VAN_VIEN + cross | `15-TC-cross-cutting-BR-EC.md` |

### 1.3 Tài khoản & role liên quan

| Role | Cấp | Username (users.csv) | Dùng cho TC loại |
|------|-----|-----------------------|-------------------|
| QTHT | — | qtht_01 | Read-only TU_VAN_VIEN/HO_SO_TVV (per Permission Matrix) |
| CB_NV_TW | TW | cb_nv_tw_01 | CRUD TVV scope TW + Thẩm định (UC44) + Cập nhật TT (UC50) + Công khai (UC46) |
| CB_NV_BN | BN | cb_nv_bn_01 | CRUD scope BN |
| CB_NV_DP | ĐP | cb_nv_dp_01 | CRUD scope ĐP |
| CB_PD_TW | TW | cb_pd_tw_01 | Phê duyệt TVV cùng cấp TW (UC45) |
| CB_PD_BN | BN | cb_pd_bn_01 | Phê duyệt cùng cấp BN |
| CB_PD_DP | ĐP | cb_pd_dp_01 | Phê duyệt cùng cấp ĐP |
| TVV | — | tvv_01 | Self-view + self-update năng lực (UC42) qua Cổng PLQG |
| CG | — | cg_01 | Self-view + self-update năng lực (UC42) qua Cổng PLQG |
| NHT | — | nht_01 | Đăng ký mạng lưới (UC41) + Self-update (UC49) qua Cổng PLQG |
| DN | — | dn_01 | Đánh giá TVV (UC47) sau vụ việc hoàn thành |

> Reference: [input/users.csv](../../../input/users.csv), [input/test-accounts-isolation.csv](../../../input/test-accounts-isolation.csv), [output/permission-matrix.md](../../permission-matrix.md)

---

## 2. Quy Tắc Nghiệp Vụ Trích Xuất Từ SRS (NotebookLM-cited)

### 2.1 Business Rules (BR)

| Mã | Quy tắc | Nguồn (NLM cite) | Áp dụng module này? | Ngoại lệ SRS-quoted | TC áp dụng |
|----|---------|------------------|---------------------|---------------------|-----------|
| BR-AUTH-01 | Mọi user phải xác thực trước khi truy cập | NLM cite [16] | ✅ Yes | — | Precondition mọi TC |
| BR-AUTH-05 | Phê duyệt cùng cấp (CB NV trình → CB PD cùng cấp duyệt) | NLM cite [16] | ✅ Yes | — | UC45 ERR-PD-02 |
| BR-AUTH-08 | Phân quyền dữ liệu theo `don_vi_id` | NLM cite [15] | ✅ Yes | — | UC39/40/45 cross-unit isolation |
| BR-AUTH-10 | Lọc kép, NHT/TVV/CG chỉ thấy yêu cầu phân công đích danh mình | NLM cite [17] | ✅ Yes | — | UC42 Cổng PLQG self-only |
| BR-DATA-01 | Mọi thao tác xóa là soft delete (`is_deleted = 1`) | NLM cite [18] | ✅ Yes | — | UC39 DELETE TC |
| BR-DATA-03 | 7 trường common fields dùng chung | NLM cite [15] | ✅ Yes | — | Verify created_at/updated_at... mọi UC CUD |
| BR-DATA-05 | Ghi nhận Audit trail không được xóa/sửa | NLM cite [18] | ✅ Yes | — | Mọi TC CUD verify AUDIT_LOG |
| BR-DATA-06 | Export Excel max 10k rows | NLM (WRN-TVV-01 cite [11]) | ✅ Yes | "Xuất Excel: max 10.000 dòng (WRN-TVV-01)" | UC40 export boundary |
| BR-DATA-07 | Pagination default 20, max 100 | NLM cite [15] | ✅ Yes | — | UC39/40 pagination |
| BR-FLOW-03 | Không sửa/xóa sau phê duyệt (bản ghi Đã duyệt/Hoàn thành) | NLM cite [19] | ✅ Yes | — | UC39 UPDATE/DELETE khi DANG_HOAT_DONG |
| BR-FLOW-04 | Mọi hành động "Từ chối" bắt buộc nhập lý do | NLM cite [19] | ✅ Yes | — | UC45 (ERR-PD-03), UC50 (lý do bắt buộc) |
| BR-LEGAL-04 | Áp dụng NĐ77/2008 (1 TVV có thể thuộc nhiều tổ chức) | NLM cite [20] | ✅ Yes | — | UC39 multi-tổ chức (TVV_TO_CHUC) |
| BR-CALC-06 | Điểm đánh giá trung bình TVV = AVG(diem) | NLM cite [20] | ✅ Yes | — | CROSS-01, UC47 |
| BR-EC-01 | Optimistic Locking | (cross-cutting) | ✅ Yes | — | UC39 UPDATE/DELETE conflict |
| BR-EC-03 | Quét virus ClamAV cho mọi file upload | NLM cite [21] | ✅ Yes | — | UC39/41/42 file upload |
| BR-EC-13 | Search Sanitize (chống injection, max 200 ký tự) | NLM cite [21] | ✅ Yes | — | UC40 search SQL/XSS |
| BR-EC-04 | Storage quota 10GB/đơn vị, 90% cảnh báo, 100% từ chối ERR-FILE-01 | NLM cite [5] (Phụ lục B) | ✅ Yes | — | TC-CG-CC-05 cross-cutting + TC-CG-213 + TC-CG-312 |
| BR-EC-05 | Session limit 3 phiên đồng thời/user; phiên thứ 4 hủy phiên cũ nhất; QTHT: 1 phiên | NLM cite [5] | ✅ Yes | — | TC-CG-CC-09 + TC-CG-1118 |
| BR-EC-08 | Logout/Lock/Disable → blacklist refresh token Redis ngay lập tức | NLM cite [5] | ✅ Yes | — | TC-CG-CC-08 + TC-CG-1115 |
| BR-EC-12 | Pagination guard: page_size ∈ [1,100], page ≥ 1, ngoài phạm vi → ERR-PARAM-01 | NLM cite [5] | ✅ Yes | — | TC-CG-119 |
| BR-EC-15 | YEU_CAU_BO_SUNG max 3 lần; sau lần 3 không đạt → auto TU_CHOI | NLM cite [5] | ✅ Yes | — | TC-CG-CC-01 + TC-CG-514 |
| BR-EC-16 | YEU_CAU_BO_SUNG quá N ngày LV (CAU_HINH_SLA) → auto TU_CHOI + thông báo | NLM cite [5] | ✅ Yes | — | TC-CG-CC-02 + TC-CG-515 |
| BR-EC-17 | CHO_PHE_DUYET quá N ngày LV (default 3) → auto-escalate CB PD cấp trên + nhắc nhở | NLM cite [5] | ✅ Yes | — | TC-CG-CC-03 + TC-CG-612 |
| BR-EC-18 | NHT/CG không phản hồi phân công 3 ngày LV → auto hoàn về + alert CB NV | NLM cite [5] | ✅ Yes | — | TC-CG-CC-04 |
| BR-EC-19 | Batch operations max 100 record/request | NLM cite [5] | ✅ Yes | — | TC-CG-CC-06 + TC-CG-613 + TC-CG-713 |
| BR-EC-20 | Transactional consistency — KHÔNG set trạng thái mới trước khi LGSP/Portal API thành công | NLM cite [5] / cite [19] | ✅ Yes | — | TC-CG-CC-07 + TC-CG-712 + TC-CG-716 |
| BR-EC-23 | Evaluation weight tolerance ±0.01% cho điểm tổng hợp | NLM cite [5] | ✅ Yes | — | TC-CG-CC-10 |

**Module-specific BR (suy ra từ SCR-IV-01/02/03 + processing logic):**

| Mã | Quy tắc | Nguồn (NLM cite) | TC áp dụng |
|----|---------|------------------|-----------|
| BR-TVV-01 | `ma_tvv` auto-gen format `TVV-{DON_VI_CODE}-{SEQ}`, UNIQUE | NLM cite [10], [21] | UC39 CREATE verify ma format |
| BR-TVV-02 | `loai_tvv` CHECK IN ('TVV','CG','NHT') | NLM cite [10] | UC39 CREATE verify enum |
| BR-TVV-03 | `cmnd_cccd` UNIQUE toàn hệ thống (per UI form, ERR-TVV-02) — **DB schema = optional, UI = bắt buộc** ⚠️ SPEC-CLARIFY-CG-01 | NLM cite [14] (UI), [10] (DB) | UC39 ERR-TVV-02 |
| BR-TVV-04 | `to_chuc_chinh_id` bắt buộc (FK TO_CHUC_TU_VAN, ERR-TVV-04) | NLM cite [14] | UC39 ERR-TVV-04 |
| BR-TVV-05 | Lĩnh vực PL ≥ 1 (multi-select bắt buộc) | NLM cite [14] | UC39 validation |
| BR-TVV-06 | Xóa mềm: chặn nếu TVV đang có VV chưa hoàn thành (ERR-TVV-05) | NLM cite [11] | UC39 DELETE chặn |
| BR-TVV-07 | Sửa hồ sơ: chặn khi VO_HIEU_HOA (nút Sửa ẩn) | NLM cite [3] (cited_table row 4) | UC39 UPDATE chặn VO_HIEU_HOA |
| BR-TVV-08 | Vô hiệu hóa: chặn nếu có VV/Hỏi đáp đang xử lý (ERR-TVV-VH-01 / ERR-TT-02) | NLM cite [3], [28] | UC50 → VO_HIEU_HOA |
| BR-TVV-09 | Vô hiệu hóa → auto gỡ khỏi Cổng PLQG | NLM cite [3] | UC50 + UC46 verify la_cong_khai=0 |
| BR-TD-01 | Thẩm định: kết luận DAT chỉ khi nhóm Pháp lý (Nhóm 1) = Đạt (ERR-TD-02) | NLM cite [4], [6] | UC44 ERR-TD-02 |
| BR-TD-02 | Trình duyệt chỉ khi kết luận = DAT (ERR-TD-04) | NLM cite [6] | UC44 ERR-TD-04 |
| BR-TD-03 | Lý do yêu cầu bổ sung bắt buộc khi ket_luan = YEU_CAU_BO_SUNG (ERR-TD-03) | NLM cite [6] | UC44 ERR-TD-03 |
| BR-CK-01 | Chỉ TVV trạng thái DANG_HOAT_DONG được công khai (ERR-CK-01) | NLM cite [9], [11] | UC46 ERR-CK-01 |
| BR-CK-02 | Công khai gọi API Cổng PLQG outbound, retry 3 lần khi lỗi (WRN-CK-01) | NLM cite [11] | UC46 WRN-CK-01 |
| BR-DG-01 | Điểm đánh giá 0-10 cho 3 tiêu chí (Chuyên môn, Thái độ, Đúng hạn) | NLM cite [18] | UC47 ERR-DG-01 |
| BR-DG-02 | Điểm tổng = AVG(3 điểm thành phần) — auto-calc | NLM cite [18] | UC47 verify diem_tong |
| BR-CROSS-01 | Sau INSERT DANH_GIA_TVV → trigger update `diem_danh_gia_tb` realtime | NLM cite [17] | CROSS-01 |
| BR-SM-TVV | State machine TVV: 9 trạng thái + 14 chuyển đổi (xem §2.5) | NLM cite [10], [2] | UC50 + cross UC44/45/46 |
| BR-FILE-01 | Ảnh chân dung max 5MB, .jpg/.png | NLM cite [21] | UC39 file validation |
| BR-FILE-02 | Bằng cấp (file_bang_cap) PDF, max 10MB/file, **tổng 50MB**, multi-file | NLM cite [14] | UC39/41 file validation |
| BR-FILE-03 | Thẻ hành nghề PDF, max 10MB | NLM cite [12] | UC39/41 file validation |

### 2.2 Error Codes (NLM-cited)

| Mã lỗi | Điều kiện trigger | Message (SRS-quoted) | Severity | NLM cite |
|--------|-------------------|----------------------|----------|----------|
| ERR-TVV-01 | Họ tên trống | "Họ tên là bắt buộc" | ERROR | [22] |
| ERR-TVV-02 | CMND/CCCD trùng | "Số CMND/CCCD đã tồn tại" | ERROR | [22] |
| ERR-TVV-03 | Email sai format | "Email không hợp lệ" | ERROR | [22] |
| ERR-TVV-04 | Tổ chức tư vấn không tồn tại | "Tổ chức tư vấn không tồn tại" | ERROR | [22] |
| ERR-TVV-05 | TVV còn vụ việc chưa hoàn thành | "TVV đang có vụ việc chưa hoàn thành" | ERROR | [22] |
| ERR-TVV-VH-01 | Vô hiệu hóa khi có VV/Hỏi đáp đang xử lý | (chưa có message nguyên văn — SRS Gap) ⚠️ SPEC-CLARIFY-CG-04 | ERROR | [3] |
| INF-TVV-01 | Không tìm thấy TVV phù hợp | "Không tìm thấy TVV phù hợp" | INFO | [13] |
| WRN-TVV-01 | Export Excel > 10.000 dòng | (Cảnh báo > 10k rows) ⚠️ SPEC-CLARIFY-CG-05 | WARNING | [11] |
| ERR-DK-01 | NHT đã có hồ sơ chờ xử lý | "Bạn đã có hồ sơ đang chờ xử lý" | ERROR | [12] |
| ERR-DK-02 | File upload > 10MB | "File tải lên tối đa 10MB" | ERROR | [12] |
| ERR-DK-03 | NHT đăng ký không có file bằng cấp | "Bằng cấp/chứng chỉ là bắt buộc" | ERROR | [12] |
| ERR-NL-01 | Cập nhật năng lực không phải hồ sơ của mình | "Bạn không có quyền cập nhật hồ sơ này" | ERROR | [23] |
| ERR-NL-02 | File năng lực > 10MB | "File tải lên tối đa 10MB" | ERROR | [23] |
| ERR-HS-01 | Hồ sơ TVV không tồn tại | "Hồ sơ TVV không tồn tại" | ERROR | [14] |
| ERR-TD-02 | Kết luận ĐẠT khi nhóm Pháp lý chưa đạt | "Không thể kết luận ĐẠT khi nhóm Pháp lý chưa đạt" | ERROR | [24], [6] |
| ERR-TD-03 | Thiếu lý do yêu cầu bổ sung | "Lý do yêu cầu bổ sung là bắt buộc" | ERROR | [24], [6] |
| ERR-TD-04 | Trình duyệt khi kết luận ≠ DAT | "Chỉ trình duyệt khi kết luận ĐẠT" | ERROR | [24], [6] |
| ERR-PD-02 | CB PD khác cấp phê duyệt | "Chỉ phê duyệt hồ sơ cùng cấp" | ERROR | [25], [8] |
| ERR-PD-03 | Lý do từ chối < 10 ký tự | "Lý do từ chối là bắt buộc (>=10 ký tự)" | ERROR | [25] |
| ERR-CK-01 | Công khai TVV không ở DANG_HOAT_DONG | "Chỉ TVV đang hoạt động mới được công khai" | ERROR | [25] |
| WRN-CK-01 | API Cổng PLQG lỗi (auto retry 3 lần) | "Cập nhật Cổng thất bại, sẽ thử lại" | WARNING | [25] |
| ERR-DG-01 | Điểm ngoài khoảng 0-10 | "Điểm đánh giá phải từ 0 đến 10" | ERROR | [25] |
| ERR-DG-02 | Đánh giá TVV không tồn tại | "TVV không tồn tại" | ERROR | [25] |
| ERR-LS-01 | Xem lịch sử TVV không tồn tại | "TVV không tồn tại" | ERROR | [26] |
| ERR-CN-01 | NHT cập nhật email sai format | "Định dạng email không hợp lệ" | ERROR | [27] |
| ERR-CN-02 | NHT cập nhật hồ sơ không phải mình | "Bạn không có quyền cập nhật hồ sơ này" | ERROR | [27] |
| ERR-TT-01 | Chuyển trạng thái không hợp lệ SM-TVV | "Không thể chuyển từ {old} sang {new}" | ERROR | [28] |
| ERR-TT-02 | Vô hiệu hóa khi còn VV chưa hoàn thành | "TVV đang có {N} VV chưa hoàn thành" | ERROR | [28] |
| ERR-TT-03 | Lý do thay đổi trạng thái trống | "Lý do thay đổi là bắt buộc" | ERROR | [28] |

### 2.3 Permission Matrix (NGUYÊN VĂN cite [23] — bảng 3.4.2 SRS, FIXED 2026-05-01)

> **Ký hiệu**: C=Create, R=Read (toàn bộ), R*=Read scoped (chỉ đơn vị mình), U=Update, D=Delete (soft), —=No access, †=Conditional (sau VV hoàn thành)
> Reference: [output/permission-matrix.md](../../permission-matrix.md).

| Entity | QTHT | CB_NV_TW | CB_NV_BN | CB_NV_DP | CB_PD_TW | CB_PD_BN | CB_PD_DP | DN | NHT | TVV | CG |
|--------|:----:|:--------:|:--------:|:--------:|:--------:|:--------:|:--------:|:--:|:---:|:---:|:---:|
| TU_VAN_VIEN | R | CRUD* | CRUD* | CRUD* | RU* | RU* | RU* | — | **—** ⚠️ | R* | R* |
| HO_SO_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | R* | R* | R* | — | **CRU*** | R* | R* |
| DANH_GIA_TU_VAN_VIEN | R | CRU* | CRU* | CRU* | CRU* | CRU* | CRU* | **C†R*** | **—** | **—** | **—** |
| AUDIT_LOG | R | R* | R* | R* | R* | R* | R* | — | — | — | — |
| THONG_BAO | R | R* | R* | R* | R* | R* | R* | R* | R* | R* | R* |
| DANH_MUC | CRUD | R | R | R | R | R | R | R | R | R | R |
| DON_VI | CRUD | R | R | R | R | R | R | R | R | R | R |

> ⚠️ **CRITICAL — SPEC-CLARIFY-CG-54**: Permission Matrix cite [23] ghi NHT cho `TU_VAN_VIEN = —` (no access) NHƯNG UC41 (FR-IV-03) cite [3] cho phép NHT INSERT TU_VAN_VIEN khi đăng ký mạng lưới. → **Conflict trong SRS**. BA cần confirm: NHT đăng ký qua UC41 thực tế tạo entity nào? (Trực tiếp TU_VAN_VIEN, hay chỉ HO_SO_TU_VAN_VIEN với `CRU*`?). Default test với assumption UC41 = NHT proxy create qua flow hệ thống.

> ⚠️ **DANH_GIA_TVV**: TVV/CG/NHT đều `—` (KHÔNG có quyền R). Chỉ DN có `C†R*`. Tab "Đánh giá" trên SCR-IV-03 hiển thị aggregated data từ `diem_danh_gia_tb` (Output FR-IV-01) chứ không từ DANH_GIA_TVV records → SPEC-CLARIFY-CG-59 verify cách hiển thị tab Đánh giá khi user là TVV/CG/NHT chính chủ.

> ⚠️ **Anti-pattern**: KHÔNG dùng tab "absence" để khẳng định role không có permission — đối chiếu với SRS Permission Matrix nguyên văn cite [23].

### 2.4 UI Layout (SCR-IV-01 / SCR-IV-02 / SCR-IV-03)

> ⚠️ Đây là visual spec components từ NLM cite [1] (SCR-IV-01), [14] (SCR-IV-02), [3] + [4] (SCR-IV-03). KHÔNG dùng absence để khẳng định "không có feature X".

**SCR-IV-01 — Danh sách TVV (5 tab + batch action):**
- **Toolbar**: Breadcrumb "Trang chủ > Chuyên gia/TVV > Quản lý tư vấn viên" + [+ Thêm TVV] + [Xuất Excel]
- **5 Tab trạng thái** (NLM cite [1]):
  | Tab | Filter |
  |-----|--------|
  | "Đang hoạt động" (default active) | `trang_thai = 'DANG_HOAT_DONG'` |
  | "Tạm dừng" | `trang_thai = 'TAM_DUNG'` |
  | "Mới đăng ký" (badge đỏ nếu >0) | `trang_thai IN ('MOI_DANG_KY','YEU_CAU_BO_SUNG')` |
  | "Chờ thẩm định" | `trang_thai = 'DANG_THAM_DINH'` |
  | "Chờ phê duyệt" (CB PD batch approve) | `trang_thai = 'CHO_PHE_DUYET'` |

  > ⚠️ Trạng thái `CHO_THAM_DINH`, `TU_CHOI`, `VO_HIEU_HOA` **KHÔNG có tab riêng** — chỉ truy cập qua filter dropdown "Trạng thái". (UI Field Verify TC riêng)

- **Filter-bar**: Từ khóa (LIKE ho_ten/ma_tvv/cmnd_cccd), Lĩnh vực (multi), Địa bàn, Tổ chức, Trạng thái dropdown, Ngày công nhận từ/đến, [Tìm kiếm] / [Xóa bộ lọc]
- **Table** (26 components): Checkbox, Ảnh (40x40), Mã TVV, Họ tên (link), Loại (badge: TVV=xanh dương / CG=tím / NHT=xanh lá), Lĩnh vực (max 3 tag + "+N"), Tổ chức (cắt 30 ký), Điểm DG (số + sao, "—" nếu chưa), Trạng thái (badge 9 màu khác nhau), Ngày công nhận, Hành động (Xem/Sửa/Xóa)
- **Batch action**: Chỉ tab "Đang hoạt động" có nút [Công khai lên Cổng PLQG] và [Hủy công khai]
- **Pagination**: 20 mục/trang, hiển thị tổng mỗi tab

**SCR-IV-02 — Form Thêm/Sửa TVV (Accordion 5 mục, NLM cite [14]):**
- **Accordion 1 — Thông tin cá nhân**: Mã TVV (readonly auto-gen edit), Ảnh chân dung (5MB jpg/png, preview 120x160), Họ tên * (max 200, ERR-TVV-01), Ngày sinh * (≤today), Giới tính * (NAM/NU), CMND/CCCD * (max 12, UNIQUE, ERR-TVV-02), Email * (RFC 5322, ERR-TVV-03), SĐT * (10-11 số), Địa chỉ *
- **Accordion 2 — Nghề nghiệp**: Trình độ * (Cử nhân/Thạc sĩ/Tiến sĩ/Khác), Chứng chỉ, Số thẻ, Kinh nghiệm (max 5000 ký)
- **Accordion 3 — Tổ chức & Mạng lưới**: Tổ chức chính * (searchable, FK TO_CHUC_TU_VAN, ERR-TVV-04), Tổ chức đối tác (multi N:N qua TVV_TO_CHUC), Lĩnh vực PL * (multi, ≥1), Địa bàn * (multi DON_VI tỉnh/TP)
- **Accordion 4 — File đính kèm**: Bằng cấp/Chứng chỉ * khi UC41 (multi-file PDF max 10MB/file, tổng 50MB, ERR-DK-02/03), Thẻ hành nghề (PDF max 10MB)
- **Accordion 5 — Ghi chú**: max 5000 ký, không bắt buộc
- **Action-bar**: [Hủy] (confirm nếu unsaved) / [Lưu] (CREATE → SET MOI_DANG_KY + AUDIT_LOG)

**SCR-IV-03 — Hồ sơ chi tiết TVV (5 tab + action buttons, NLM cite [3], [4]):**
- **Header**: Breadcrumb "... > [Tên TVV]", [← Quay lại danh sách], Card header (ảnh 80x100, tên bold 20px, mã, badge trạng thái lớn, điểm DG sao, ngày công nhận)
- **Action buttons** (conditional render):
  - [Sửa hồ sơ] → SCR-IV-02 (ẩn nếu VO_HIEU_HOA)
  - [Cập nhật trạng thái] → modal UC50 (chỉ CB NV)
  - [Phê duyệt] → SET DANG_HOAT_DONG (chỉ khi CHO_PHE_DUYET, CB PD cùng cấp)
  - [Từ chối] → modal lý do ≥10 ký tự (chỉ CHO_PHE_DUYET, CB PD)
  - [Công khai lên Cổng PLQG] → API call (chỉ DANG_HOAT_DONG AND la_cong_khai=0)
- **5 Tab**:
  - Tab Hồ sơ: 5 accordion read-only
  - Tab Thẩm định: Form chấm 4 nhóm tiêu chí (chỉ DANG_THAM_DINH/CHO_PHE_DUYET)
  - Tab Năng lực (UC42): Bằng cấp + Chứng chỉ + Kinh nghiệm + nút [Cập nhật năng lực] (chỉ NHT sở hữu hoặc CB NV)
  - Tab Lịch sử hỗ trợ (UC48): Filter + bảng VV + Timeline
  - Tab Đánh giá (UC47): Điểm tổng + 3 progress bar + danh sách + form đánh giá mới (form cho ai có quyền)

**Cross-cutting features MẶC ĐỊNH có (theo BR global):**
- ☑ Nút [Xuất Excel] trên SCR-IV-01 (BR-DATA-06, max 10k rows + WRN-TVV-01)
- ☑ Pagination 20/page default (BR-DATA-07)
- ☑ Search sanitize max 200 chars (BR-EC-13)
- ☑ Audit log mọi CUD (BR-DATA-05)
- ☑ Optimistic lock mọi UPDATE/DELETE (BR-EC-01)
- ☑ Quét virus ClamAV mọi file upload (BR-EC-03)

**Feature module KHÔNG có (cần QUOTE SRS line hoặc SPEC-CLARIFY):**
- URL sync filter (BR-UX-01) — SRS không quote rõ → SPEC-CLARIFY-CG-06

### 2.5 State Machine SM-TVV (NLM cite [30], [10])

**9 trạng thái:**

| State | Code | Ý nghĩa | Tab SCR-IV-01 |
|-------|------|---------|---------------|
| 1 | `MOI_DANG_KY` | NHT vừa đăng ký mạng lưới | "Mới đăng ký" |
| 2 | `CHO_THAM_DINH` | Hồ sơ đủ giấy tờ, chờ CB NV tiếp nhận | (không có tab — filter only) |
| 3 | `DANG_THAM_DINH` | CB NV bắt đầu thẩm định 4 nhóm tiêu chí | "Chờ thẩm định" |
| 4 | `YEU_CAU_BO_SUNG` | CB NV xác nhận hồ sơ thiếu | "Mới đăng ký" (gộp) |
| 5 | `CHO_PHE_DUYET` | CB NV trình duyệt sau ket_luan = DAT | "Chờ phê duyệt" |
| 6 | `TU_CHOI` | CB PD từ chối duyệt (có lý do) | (không có tab) |
| 7 | `DANG_HOAT_DONG` | CB PD phê duyệt, TVV chính thức hoạt động | "Đang hoạt động" |
| 8 | `TAM_DUNG` | CB NV tạm dừng hoạt động | "Tạm dừng" |
| 9 | `VO_HIEU_HOA` | Bị vô hiệu hóa (yêu cầu không còn VV/Hỏi đáp) | (không có tab) |

**14 chuyển đổi (transitions, NGUYÊN VĂN cite [20] — FIXED 2026-05-01):**

| # | Từ | Đến | Trigger | Guard | Action | FR Ref | BR Ref |
|--:|----|-----|---------|-------|--------|--------|--------|
| 1 | `[*]` | `MOI_DANG_KY` | NHT đăng ký MLTV | — | Tạo hồ sơ TVV | FR-IV-03 | — |
| 2 | `MOI_DANG_KY` | `CHO_THAM_DINH` | CB NV tiếp nhận | Hồ sơ đủ giấy tờ | — | FR-IV-06 | — |
| 3 | `CHO_THAM_DINH` | `DANG_THAM_DINH` | CB NV bắt đầu thẩm định | — | Ghi thời điểm bắt đầu | FR-IV-06 | — |
| 4 | `DANG_THAM_DINH` | `YEU_CAU_BO_SUNG` | Hồ sơ chưa đầy đủ | CB NV xác nhận thiếu | **Thông báo NHT** | FR-IV-06 | — |
| 5 | `YEU_CAU_BO_SUNG` | `DANG_THAM_DINH` | NHT bổ sung xong | Có tài liệu bổ sung | — | FR-IV-06 | — |
| 6 | `DANG_THAM_DINH` | `CHO_PHE_DUYET` | Thẩm định đạt | 4 nhóm tiêu chí đạt | Ghi kết quả thẩm định | FR-IV-06 | BR-LEGAL-04 |
| 7 | `CHO_PHE_DUYET` | `DANG_HOAT_DONG` | CB PD duyệt | Cùng cấp | Audit, ngay_cong_nhan | FR-IV-07 | BR-AUTH-05 |
| 8 | `CHO_PHE_DUYET` | `TU_CHOI` | CB PD từ chối | Có lý do | **Thông báo CB NV + NHT** | FR-IV-07 | BR-FLOW-04 |
| 9 | `TU_CHOI` | `CHO_THAM_DINH` | Nộp lại hồ sơ | NHT cập nhật hồ sơ | Reset thẩm định | FR-IV-06 | — |
| 10 | `DANG_HOAT_DONG` | `TAM_DUNG` | CB NV quyết định | Không theo điều kiện tự động | **Audit log** (KHÔNG notify) | FR-IV-12 | — |
| 11 | `TAM_DUNG` | `DANG_HOAT_DONG` | CB NV kích hoạt lại | — | **Audit log** (KHÔNG notify) | FR-IV-12 | — |
| 12 | `DANG_HOAT_DONG` | `VO_HIEU_HOA` | CB NV vô hiệu hóa | Không có VV đang xử lý | **Gỡ khỏi Cổng, audit** | FR-IV-12 | — |
| 13 | `TAM_DUNG` | `VO_HIEU_HOA` | CB NV vô hiệu hóa | Không có VV đang xử lý | **Gỡ khỏi Cổng, audit** | FR-IV-12 | — |
| 14 | `VO_HIEU_HOA` | `DANG_HOAT_DONG` | CB NV khôi phục | Quyết định từng trường hợp | **Audit log** (KHÔNG notify) | FR-IV-12 | — |

**Compact transition list (legacy view):**

```
[*]                  → MOI_DANG_KY                         (UC41 NHT đăng ký)
MOI_DANG_KY          → CHO_THAM_DINH                       (CB NV xác nhận đủ giấy tờ)
CHO_THAM_DINH        → DANG_THAM_DINH                      (CB NV bắt đầu thẩm định)
DANG_THAM_DINH       → YEU_CAU_BO_SUNG                     (UC44 ket_luan = YEU_CAU_BO_SUNG)
YEU_CAU_BO_SUNG      → DANG_THAM_DINH                      (NHT bổ sung xong, CB NV tiếp tục)
DANG_THAM_DINH       → CHO_PHE_DUYET                       (UC44 ket_luan = DAT, trình duyệt)
CHO_PHE_DUYET        → DANG_HOAT_DONG                      (UC45 PHE_DUYET)
CHO_PHE_DUYET        → TU_CHOI                             (UC45 TU_CHOI, lý do ≥10 ký)
TU_CHOI              → CHO_THAM_DINH                       (CB NV mở lại thẩm định)
DANG_HOAT_DONG       ↔ TAM_DUNG                            (UC50, lý do ≥10 ký)
DANG_HOAT_DONG/TAM_DUNG → VO_HIEU_HOA                      (UC50, chặn nếu còn VV chưa HT)
VO_HIEU_HOA          → DANG_HOAT_DONG                      (UC50 khôi phục)
```

> ⚠️ **Mọi transition KHÔNG nằm trong 12 chuyển đổi trên** sẽ trigger **ERR-TT-01**: "Không thể chuyển từ {old} sang {new}".

### 2.6 Data dependencies & Seed input

| Phase | Input file | Section dùng |
|-------|-----------|--------------|
| **GĐ 1 Seed (pure entry state)** | [`input/data/seed-fixture.yaml`](../../../input/data/seed-fixture.yaml) | `tu_van_vien_variants[1..6]` (đảm bảo cover 3 loại TVV/CG/NHT × ≥3 trạng thái) |
| **GĐ 2 Workflow** | [`input/flow-module.md`](../../../input/flow-module.md) | §FR-IV (NHT đăng ký → thẩm định → phê duyệt → công khai → đánh giá) |
| **Cross-module map** | [`input/data/entity-map.md`](../../../input/data/entity-map.md) | TU_VAN_VIEN → đọc tại VU_VIEC, HOI_DAP (downstream) |

**Upstream dependencies (Tier check):**

| Entity của module | Tier | Phụ thuộc entity nào (upstream) | Seed trước tại module |
|-------------------|:----:|----------------------------------|-----------------------|
| TU_VAN_VIEN | 2 | DON_VI (cấp tỉnh/TP), TO_CHUC_TU_VAN, DANH_MUC (Lĩnh vực PL), TAI_KHOAN | QTHT (Tài khoản), DM dùng chung (Lĩnh vực, Tổ chức) |
| HO_SO_TU_VAN_VIEN | 2 | TU_VAN_VIEN (1:1) | (cùng module) |
| DANH_GIA_TU_VAN_VIEN | 3 | TU_VAN_VIEN, VU_VIEC | Doanh nghiệp (DN), Vụ việc |
| LICH_SU_HO_TRO_TVV | 3 | TU_VAN_VIEN, VU_VIEC | Vụ việc, Hỏi đáp |

**Acceptance per-filter (theo CLAUDE.md rule, tránh gãy như A5):**

| Filter | Acceptance ≥N record per |
|--------|--------------------------|
| `loai_tvv` | ≥3 record cho **mỗi** giá trị TVV/CG/NHT (= 9 record min) |
| `trang_thai` | ≥1 record cho **mỗi** trong 9 trạng thái (= 9 record min) |
| `don_vi_id × loai_tvv` | ≥1 record cho mỗi cấp TW/BN/ĐP × mỗi loại (= 9 record min) |

> Acceptance **theo filter, không theo tổng số**. Verify per-filter query trước khi đóng task seed.

---

## 3. Cấu Trúc File Test Case

```
output/test-cases/CG-TVV/
├── 00-test-plan-overview.md                              ← File này
├── 01-TC-FR-IV-01-quan-ly-tvv.md                         ← UC39 CRUD
├── 02-TC-FR-IV-02-tim-kiem-tvv.md                        ← UC40 Search
├── 03-TC-FR-IV-03-dang-ky-mang-luoi.md                   ← UC41 NHT register (Cổng PLQG)
├── 04-TC-FR-IV-04-cap-nhat-nang-luc.md                   ← UC42 (NHT/CB NV)
├── 05-TC-FR-IV-05-xem-chi-tiet-tvv.md                    ← UC43 Detail view
├── 06-TC-FR-IV-06-tham-dinh-ho-so.md                     ← UC44 Thẩm định 4 nhóm
├── 07-TC-FR-IV-07-phe-duyet-tvv.md                       ← UC45 Approve/Reject
├── 08-TC-FR-IV-08-cong-khai-mang-luoi.md                 ← UC46 Public toggle + batch
├── 09-TC-FR-IV-09-danh-gia-tvv.md                        ← UC47 Rating
├── 10-TC-FR-IV-10-xem-lich-su-ho-tro.md                  ← UC48 History
├── 11-TC-FR-IV-11-nht-cap-nhat-ho-so.md                  ← UC49 NHT self-update
├── 12-TC-FR-IV-12-cap-nhat-trang-thai-tvv.md             ← UC50 SM transitions
└── 13-TC-FR-IV-CROSS-01-tong-hop-diem.md                 ← Background trigger
```

---

## 4. Tổng Quan Số Lượng Test Cases (sau Test Quality Review 2026-05-01 — verified count)

| File | TC Count | Note |
|------|---------:|------|
| 01 — Quản lý TVV (CRUD) | **42** | 2 UI Verify + 40 functional (Happy/Neg/Edge) |
| 02 — Tìm kiếm TVV | **23** | 1 UI + 22 functional |
| 03 — Đăng ký mạng lưới (NHT) | **19** | 1 UI + 18 functional |
| 04 — Cập nhật năng lực | **16** | 1 UI + 15 functional |
| 05 — Xem chi tiết TVV | **13** | 1 UI + 12 functional |
| 06 — Thẩm định hồ sơ | **22** | 1 UI + 21 functional |
| 07 — Phê duyệt TVV | **19** | 1 UI + 18 functional |
| 08 — Công khai mạng lưới | **19** | 1 UI + 18 functional |
| 09 — Đánh giá TVV | **21** | 1 UI + 20 functional |
| 10 — Xem lịch sử hỗ trợ | **12** | 1 UI + 11 functional |
| 11 — NHT cập nhật hồ sơ | **14** | 1 UI + 13 functional |
| 12 — Cập nhật trạng thái (SM) | **23** | 1 UI + 22 functional |
| 13 — CROSS-01 Tổng hợp điểm | **9** | No UI verify (background trigger) + 9 functional |
| 15 — Cross-cutting BR-EC | **10** | 10 functional |
| **TỔNG functional + UI verify** | **262** | |
| 14 — Edge Case Hunter Review | reference | 65 review entries (đã merge vào file 01-13 rồi) |
| 16 — Test Quality Review | reference | 5 P0 fix + 18 P1 add + 12 P2 enh + 7 SPEC-CLARIFY |

**Phân bổ Happy/Negative/Edge/UI per axis (estimate sau FIX-02 reclassify):**

| Type | Count | % |
|------|------:|--:|
| 🟢 UI Verify | 13 | 5% |
| 🟢 Happy path | ~58 | 22% |
| 🔴 Negative | ~55 | 21% |
| 🟡 Edge (gốc + bổ sung) | ~136 | 52% |
| **TỔNG** | **262** | 100% |

**Phân bổ priority (sau Test Quality Review):**

| Priority | Số TC | % | Nguyên tắc |
|----------|------:|--:|------------|
| 🔴 P0 (bắt buộc, blocker) | ~70 | 27% | UI Verify + Happy path core CRUD/workflow + Auth violations + 5 critical fix |
| 🟡 P1 (quan trọng) | ~120 | 46% | Negative validation + Edge SM transitions + Permission cross-cấp + 21 ADD mới |
| 🟢 P2 (nên có) | ~72 | 27% | Optimistic locking + File quirks + Boundary number + 12 ENH |

**Phân bổ priority:**

| Priority | Số TC | % | Nguyên tắc |
|----------|------:|--:|------------|
| 🔴 P0 (bắt buộc, blocker) | ~50 | 33% | Mọi UI Verify + Happy path core CRUD/workflow + Auth violations |
| 🟡 P1 (quan trọng) | ~70 | 46% | Negative validation + Edge SM transitions + Permission cross-cấp |
| 🟢 P2 (nên có) | ~32 | 21% | Optimistic locking + File quirks + Boundary number |

---

## 5. SRS Gaps & SPEC-CLARIFY tickets

| ID | Mô tả gap | Đề xuất |
|----|-----------|---------|
| SPEC-CLARIFY-CG-01 | CMND/CCCD: DB schema = optional, UI form = bắt buộc → 2 nguồn xung đột | BA xác nhận: trust UI hay trust DB. Test cả 2 cho đến khi BA confirm. |
| SPEC-CLARIFY-CG-02 | URL/cách truy cập "Cổng PLQG" / "chuyên trang" cho NHT/TVV/CG self-service — chưa rõ là route khác app hay module riêng | BA cung cấp URL Cổng PLQG + role/route mapping. |
| SPEC-CLARIFY-CG-03 | Auto-gen `ma_tvv` format `TVV-{DON_VI_CODE}-{SEQ}` — có áp dụng prefix khác cho loại CG/NHT (vd `CG-XX-001`, `NHT-XX-001`) hay tất cả dùng `TVV-` | BA confirm prefix per loai_tvv. Default test với `TVV-` prefix; nếu khác → log bug FE. |
| SPEC-CLARIFY-CG-04 | Mã lỗi `ERR-TVV-VH-01` được mention trong UI spec nhưng không có message nguyên văn trong Error Codes | BA cung cấp message hoặc map sang ERR-TT-02. |
| SPEC-CLARIFY-CG-05 | `WRN-TVV-01` (export Excel > 10k rows) — chưa có message nguyên văn | BA cung cấp message warning. |
| SPEC-CLARIFY-CG-06 | URL sync filter (BR-UX-01) — SRS không quote rõ áp dụng module này không | BA confirm. Default skip URL sync test. |
| SPEC-CLARIFY-CG-07 | UC44 "Nhóm 2 — Năng lực" và "Nhóm 3 — Hiệu quả" thang 0-100 nhưng UC47 đánh giá thang 0-10 → khác scale, khác mục đích → cần verify không nhầm UI | BA xác nhận 2 scoring scale là intentional khác nhau. |
| SPEC-CLARIFY-CG-08 | UC47 Đánh giá: SRS không cấm 1 user (DN) đánh giá 1 TVV nhiều lần — có cần unique constraint per (vu_viec_id, tvv_id, nguoi_dg_id)? | BA confirm logic chống trùng đánh giá. |
| SPEC-CLARIFY-CG-34 | `diem_danh_gia_tb` CHECK constraint conflict: ERD cite [6] = 0-5 vs Outputs cite [10] = 0-10. | BA confirm scale chính thức. |
| SPEC-CLARIFY-CG-35 | CROSS-01 trigger phạm vi conflict: cite [16] chỉ INSERT vs cite [6] INSERT/UPDATE/DELETE. | BA confirm rule recalc khi UPDATE/DELETE. |
| SPEC-CLARIFY-CG-36 | UC44 scoring scale Nhóm 2/3 conflict: Inputs cite [11] = 0-100 vs UI cite [12] = 0-10. | BA confirm. |
| SPEC-CLARIFY-CG-37 | Auto-gen `ma_tvv` — SRS quote duy nhất `TVV-{DON_VI_CODE}-{SEQ}` cho cả 3 loại (TVV/CG/NHT). Override SPEC-CLARIFY-CG-03. | Confirmed via NLM cite [7][8][10]. |
| SPEC-CLARIFY-CG-38 | Filter date range invalid (từ > đến): SRS không quote validation. | BA confirm hành vi. |
| SPEC-CLARIFY-CG-39 | File upload size minimum (0 bytes): SRS chỉ quote max, không quote min. | BA confirm reject 0 bytes. |
| SPEC-CLARIFY-CG-40 | UC42 update `linh_vuc_ids = []` (xóa hết): SRS không quote constraint ≥1 cho update. | BA confirm. |
| SPEC-CLARIFY-CG-41 | SCR-IV-03 nút [Hủy công khai] cho single — SRS không quote (chỉ batch ở SCR-IV-01). | BA confirm UI có nút này không. |
| SPEC-CLARIFY-CG-42 | UC46 race condition User A publish vs User B unpublish cùng record: SRS không quote rule. | BA confirm last-write-wins hoặc lock. |
| SPEC-CLARIFY-CG-43 | UC46 idempotency: cố [Công khai] khi la_cong_khai=1 (qua API direct). | BA confirm 200 OK hay reject. |
| SPEC-CLARIFY-CG-44 | UC50 Vô hiệu hóa: API gỡ portal fail → rollback hay force VO_HIEU_HOA + queue retry? | BA confirm. |
| SPEC-CLARIFY-CG-45 | UC47 schema mismatch: form 3 tiêu chí (Chuyên môn/Thái độ/Đúng hạn) cite [12] vs DB cite [14]/[15] 4 cột (Pháp lý/Năng lực/Hiệu quả/Mạng lưới). | BA confirm field mapping. |
| SPEC-CLARIFY-CG-46 | UC48 cột "Vai trò" trong bảng lịch sử chỉ có 2 giá trị (NHT/TVV) — VV có thể assign CG không? | BA confirm. |
| SPEC-CLARIFY-CG-47 | UC49 ho_ten charset: Unicode + emoji có accept không? | BA confirm. |
| SPEC-CLARIFY-CG-48 | UC50 VO_HIEU_HOA precondition conflict: cite [4] processing chỉ check VU_VIEC vs cite [3] UI check cả VU_VIEC + HOI_DAP. | BA confirm. |
| SPEC-CLARIFY-CG-49 | CROSS-01 sau xóa hết đánh giá: diem_danh_gia_tb = NULL hay 0? | BA confirm. |
| SPEC-CLARIFY-CG-50 | BR-EC-15 counter `so_lan_yeu_cau_bo_sung` không có trong ERD entity TU_VAN_VIEN. | BA confirm storage location. |
| SPEC-CLARIFY-CG-51 | BR-EC-16 `CAU_HINH_SLA` config table chưa được mô tả nguyên văn cho FR-IV. Default N=? | BA confirm. |
| SPEC-CLARIFY-CG-52 | BR-EC-17 escalation: CB PD cấp trên là cấp nào (TW → ai? BN → ?, ĐP → ?). | BA confirm hierarchy. |
| SPEC-CLARIFY-CG-53 | BR-EC-23 floating-point precision cho diem_danh_gia_tb (decimal places). | BA confirm. |
| SPEC-CLARIFY-CG-54 | Permission Matrix cite [23] ghi NHT cho `TU_VAN_VIEN = —` (no access) NHƯNG UC41 cite [3] cho phép NHT INSERT TU_VAN_VIEN. | BA confirm: NHT đăng ký qua UC41 thực tế tạo entity nào? Trực tiếp TU_VAN_VIEN, hay chỉ HO_SO_TVV với `CRU*`? |
| SPEC-CLARIFY-CG-55 | UC50 (FR-IV-12): SM cite [20] trans 10-14 + AC cite [12] đều KHÔNG quote notification. | BA confirm có notify TVV/NHT khi đổi trạng thái (TAM_DUNG/khôi phục/VO_HIEU_HOA) không? |
| SPEC-CLARIFY-CG-56 | AC FR-IV-01 cite [1]: "3 tab trạng thái" vs SCR-IV-01 cite [8]: 5 tab. | BA confirm số tab thực tế. AC viết tắt hay SCR mới hơn? |
| SPEC-CLARIFY-CG-57 | AC FR-IV-05 cite [5]: "4 tab" + Mô tả "Hồ sơ, Năng lực, Lịch sử, Đánh giá" vs SCR-IV-03 cite [16]: 5 tab có thêm "Thẩm định". | BA confirm tab Thẩm định thuộc UC43 hay tách riêng UC44 với access role khác? |
| SPEC-CLARIFY-CG-58 | SM cite [20] trans 9 (TU_CHOI → CHO_THAM_DINH) ghi `FR Ref: FR-IV-06` (UC44) — nhưng UI hành động chuyển trạng thái thường thuộc UC50 (FR-IV-12). | BA confirm owner thực tế của transition này. |
| SPEC-CLARIFY-CG-59 | DANH_GIA_TVV: TVV/CG/NHT đều `—` (no Read access) nhưng tab "Đánh giá" trên SCR-IV-03 hiển thị aggregated. | BA confirm cách hiển thị tab Đánh giá khi user là TVV/CG/NHT chính chủ — ẩn tab hay show aggregated only? |
| SPEC-CLARIFY-CG-60 | UC44 Lưu nháp thẩm định: nháp scope per-user hay per-TVV? Khi 2 CB NV cùng đơn vị mở thẩm định cùng TVV, có thấy nháp của nhau không? | BA confirm scope rule (verify TC-CG-521). |

---

## 6. Tiêu chí đạt/không đạt

> Reference: [output/test-strategy.md §10](../../test-strategy.md)

- ✅ **PASS:** 100% P0 + 90% P1 pass + tất cả UI Verify TC pass
- ❌ **FAIL:** Bất kỳ P0 nào FAIL, hoặc P1 pass rate < 90%, hoặc UI Verify fail (sai layout = không thể trust functional test)
- ⚠️ **CONDITIONAL PASS:** TC liên quan SPEC-CLARIFY ticket → đánh dấu BLOCKED, không tính vào pass rate cho đến khi BA respond.

---

## 7. Tham chiếu

- NotebookLM notebook: `2160bfb1-2020-4199-90a6-d607b298bb42`
- Conversation ID (round 1+2): `7bd60e00-de72-4a98-a2a8-5dcd994d2095`
- Sources used:
  - `fe352d68-6b3a-4fe8-acfa-bd95047e6e71` (chi tiết FR-IV-01..12 + SCR-IV-01/02/03)
  - `1c462e23-b9b1-4f09-9817-dc750ea04769` (overview procedure + acceptance per FR)
- [output/test-strategy.md](../../test-strategy.md) — chiến lược tổng thể
- [output/scaling-test-strategy.md](../../scaling-test-strategy.md) — quy trình 7 bước
- [output/permission-matrix.md](../../permission-matrix.md) — ma trận phân quyền 49 entity × 11 role
- [output/template/test-case-template.md](../../template/test-case-template.md)
- [output/template/test-plan-overview-template.md](../../template/test-plan-overview-template.md)
- [output/template/bug-report-template.md](../../template/bug-report-template.md)

---

*Tạo bởi /bmad-testarch-test-design (Epic-Level Mode), 2026-05-01. NotebookLM-only. KHÔNG dùng local SRS files.*
