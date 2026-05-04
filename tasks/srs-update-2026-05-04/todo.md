# TODO — SRS update 2026-05-04 (v2 — workflow A→Z + 11 module impact)

**Plan:** [plan.md](plan.md) v2 · **Round:** R7 (sau khi R6 đóng)

> File này thay thế [v1 todo](../_archive/srs-update-2026-05-04-v1/todo.md). Bổ sung 11 module impact + 10 câu hỏi BA + 4 checkpoint dừng.

**Icon:** ✅ xong · 🟢 sẵn sàng · 🔵 đang làm · 🟣 chờ BA · ⏳ chờ data · ⚠️ partial · 🚫 block

---

## Tổng quan tiến độ

| Bước | Tên | Tổng task | Time |
|------|-----|:-:|---|
| 1 | Nhận SRS + đếm scope | 2 | 1 ngày |
| 2 | Đọc hiểu + tóm tắt cho BA | 3 | 1 ngày |
| 3 | Diff cũ-mới + impact cross-module | 3 | 2 ngày |
| 4 | Chốt 10 câu hỏi với BA | 2 | 3-5 ngày |
| **4.5** | **Sync tài liệu nội bộ với SRS chốt (mới)** | **7** | **1-2 ngày** |
| 5 | Seed data 4 tầng (5a:3 + 5b:2 + 5c:2 + 5d:2 + 5e:1 + 5f:4) | 14 | 2 tuần |
| 6A | **Nhóm A — FULL retest** 3 module (FR-02:4 + FR-03:5 + FR-04:4) | 13 | 3 tuần |
| 6B | **Nhóm B — DELTA+IMPACT** 4 module bị refactor lan | 4 | 1 tuần |
| 6C | **Nhóm C — IMPACT only** 7 module sample | 7 | 3 ngày |
| 6D | **Nhóm D — SKIP** 2 module smoke nhanh | 2 | 0.5 ngày |
| 7 | Sửa bug + retest | xen kẽ | xen kẽ |
| 8 | Đóng test + handoff | 3 | 3 ngày |
| **Tổng** | | **60** | **~5 tuần + 1-2 ngày** |

> **Nguyên tắc Bước 6:** Module thay đổi nhiều → test lại HẾT (Nhóm A). Thay đổi ít → test phần thay đổi + impact (Nhóm B/C). Không liên quan → smoke (Nhóm D). Chi tiết phân loại xem [plan.md §3](plan.md#3-bản-đồ-ảnh-hưởng--chiến-lược-test-theo-từng-module).

---

## Bước 1 — Nhận SRS thay đổi

- ✅ **B1.1** Lưu SRS update vào `input/srs-update-2026-5-4/` (3 file: FR-02, FR-03, FR-04)
  - **Kết quả:** Folder đã có sẵn 3 file BA gửi.

- ✅ **B1.2** Đếm scope: số dòng cũ/mới + tóm tắt 1 dòng/file
  - **Kết quả:** FR-02 +23%, FR-03 +133%, FR-04 +94%, tổng +81% so với SRS cũ. [Tóm tắt cho BA](summary-for-BA.md)

---

## Bước 2 — Đọc hiểu

- ✅ **B2.1** Đọc full 3 file SRS update + Lịch sử thay đổi
  - **Kết quả:** Đã đọc, ghi chú phần khó hiểu. 3 module thay đổi: FR-02 (3 UC mới + SLA refactor), FR-03 (cấu trúc 3 cấp + 6 UC mới + 60 mã quyền), FR-04 (TCTV mới + NHT tách entity + TVV refactor)

- ✅ **B2.2** Verify căn cứ pháp lý (đính chính cite): NĐ55 Đ.8K1 (HD), Đ.10K2 (Đào tạo), Đ.9 (TVV), NĐ77/2008 Đ.13/19, NĐ121/2025 Đ.39-40
  - **Kết quả:** 5 cite đã sửa đúng theo verify NotebookLM

- ✅ **B2.3** Viết tóm tắt cho BA bằng tiếng Việt thuần (không jargon)
  - **Kết quả:** Đã viết xong file [`summary-for-BA.md`](summary-for-BA.md).

---

## Bước 3 — Diff cũ-mới + impact cross-module

- ✅ **B3.1** Lớp A — Verify nội dung 3 file SRS update
  - **Kết quả:** 20/21 claim đúng. 1 sai: 3 entity KHDT/LICH_HOC/HOC_VIEN không mới hoàn toàn — SRS cũ đã có, mới chỉ refactor.

- ✅ **B3.2** Lớp B — Impact cross-module
  - **Kết quả:** 11/13 module bị ảnh hưởng. 4 Critical (FR-16, FR-10, FR-05, FR-13). 7 Major (FR-01/06/08/11/12/14/15).

- ✅ **B3.3** Tổng hợp 5 câu hỏi BA bổ sung từ impact analysis (G6-G10)
  - **Kết quả:** Đã thêm G6-G10 vào file. Tổng 10 câu hỏi gửi BA. [questions-for-BA.md](questions-for-BA.md)

---

## Bước 4 — Chốt BA — **CHECKPOINT 1**

- 🟢 **B4.1** Gửi BA 2 file tóm tắt + câu hỏi, chờ BA reply `[~0% — sẵn sàng gửi BA]`
  - **Phạm vi:** Gửi BA `summary-for-BA.md` + `questions-for-BA.md`. BA reply OK/NOK kèm lý do cho 10 câu G1-G10.
  - **Cách kiểm tra xong:** Có file `tasks/decisions/srs-update-2026-05-04-ba-signoff.md` chứa BA reply đầy đủ 10 câu.

- 🟣 **B4.2** Sau khi BA chốt, khóa scope test cuối + báo PM
  - **Cần có sẵn:** B4.1 ✅
  - **Phạm vi:** Tổng hợp BA reply thành scope test cuối. Báo PM duyệt. Dev confirm sẵn sàng implement scope đã chốt.
  - **Cách kiểm tra xong:** Section "Scope cuối" trong signoff doc viết xong, không còn chỗ ambiguous. Dev reply OK.

> **🛑 CP1 — Dừng tại đây cho đến khi BA + PM ký duyệt scope**

---

## Bước 4.5 — Sync tài liệu nội bộ với SRS đã chốt (1-2 ngày)

> **Mục đích:** Doc nội bộ là input của Bước 5 seed. Sync TRƯỚC khi seed để seed task không ref doc cũ.
>
> **Thứ tự bắt buộc:** B4.5.1 → B4.5.2 → B4.5.3 → B4.5.4 → B4.5.5 → B4.5.6 → B4.5.7. Mỗi step cần step trước done.
>
> **Chi tiết phương án:** xem [plan.md §1 Bước 4.5](plan.md#bước-45--sync-tài-liệu-nội-bộ-với-srs-đã-chốt-1-2-ngày)

- ⏳ **B4.5.1** Backup 3 file SRS cũ vào archive `[need: B4.2 ✅ BA signoff]`
  - **Phạm vi:** Tạo folder `input/srs-v3/_archive/2026-05-04-pre-update/`. Chuyển 3 file SRS cũ (FR-02, FR-03, FR-04) từ `input/srs-v3/` sang folder archive vừa tạo.
  - **Cách kiểm tra xong:** Mở folder `srs-v3/`, đếm còn 13 file SRS (giảm từ 16). Mở folder archive, thấy đủ 3 file FR-02/03/04 cũ.

- ⏳ **B4.5.2** Copy 3 file SRS mới sang `srs-v3/` `[need: B4.5.1 ✅ đã archive file cũ]`
  - **Phạm vi:** Copy 3 file SRS mới (FR-02, FR-03, FR-04) từ `input/srs-update-2026-5-4/` sang `input/srs-v3/`.
  - **Cách kiểm tra xong:** Mở folder `srs-v3/`, đếm có lại 16 file SRS. Kiểm tra ngày sửa của 3 file FR-02/03/04 là 3-4/5/2026 (file mới).

- ⏳ **B4.5.3** Cập nhật `entity-map.md` — thêm 5 entity mới `[need: B4.5.2 ✅ file SRS mới đã ở srs-v3]`
  - **Phạm vi:** Thêm 5 dòng entity vào bảng:
    - `TCTV` (Tổ chức Tư vấn) — Tier 1, tạo ở M-IV/SCR-IV-NEW-01, đọc ở TVV (FK), HĐ tư vấn
    - `NGUOI_HO_TRO` — Tier 1, tạo ở M-IV-NHT, đọc ở VV phân công, HD phân công
    - `KH_DAO_TAO_NAM` — Tier 1, tạo ở M-III/SCR-III-KH, đọc ở CTDT
    - `LICH_HOC` — Tier 2, tạo ở M-III, đọc ở Khóa học
    - `HOC_VIEN` — Tier 2, tạo ở M-III, đọc ở Lịch học, KQ đào tạo
  - **Cách kiểm tra xong:** Mở file `entity-map.md`, đếm bảng có 28 dòng entity (tăng từ 23). Tìm thấy 5 entity mới có đủ cột "Tạo tại", "Đọc tại", "Notes".

- ⏳ **B4.5.4** Cập nhật `flow-module.md` — thêm/sửa sơ đồ trạng thái `[need: B4.5.2 ✅ file SRS mới đã ở srs-v3]`
  - **Phạm vi:**
    - Thêm SM-TCTV (6 trạng thái: Mới đăng ký → Chờ phê duyệt → Hoạt động → Tạm dừng → Vô hiệu hóa)
    - Thêm SM-NGUOI_HO_TRO (theo SRS FR-IV BA chốt)
    - Sửa SM-TVV (9 trạng thái — thêm "Chờ thẩm định" và "Đang thẩm định")
    - Sửa SM-CTDT (3 cấp: Khóa năm → CTDT → Khóa học)
    - Sửa SM-KH-DAO-TAO-NAM (thêm path "Từ chối" khi gửi duyệt)
  - **Cách kiểm tra xong:** Mở file `flow-module.md`, đếm thấy đủ 5 sơ đồ trạng thái mới/sửa. Mỗi sơ đồ có hình vẽ trạng thái và bảng chuyển trạng thái đi kèm.

- ⏳ **B4.5.5** Cập nhật `02-thu-tu-module.md` — thêm dependency cho TCTV `[need: B4.5.4 ✅ flow-module có SM mới]`
  - **Phạm vi:** Thêm TCTV vào Lớp 1 (đứng trước TVV vì TVV cần FK TCTV). Cập nhật bảng SM transition cho 5 module thay đổi (TCTV/NHT/TVV/CTDT/KH-DAO-TAO-NAM).
  - **Cách kiểm tra xong:** Mở file `02-thu-tu-module.md`, tìm thấy TCTV ở Lớp 1. Bảng SM có hàng cho TCTV/NHT/TVV/CTDT/KH-DAO-TAO-NAM mới.

- ⏳ **B4.5.6** Cập nhật `permission-matrix.md` — Phase 1 chỉ thêm schema `[need: B4.5.3 ✅ entity-map có entity mới]`
  - **Phạm vi:**
    - Thêm 5 dòng entity mới (TCTV, NGUOI_HO_TRO, KH_DAO_TAO_NAM, LICH_HOC, HOC_VIEN) vào ma trận
    - Mỗi dòng có ô CRUD/❌ cho 11 vai trò, theo SRS BA chốt
    - Note rõ "Phase 1 — chưa verify behavior thực tế, sẽ verify ở B8.2 sau test"
  - **Cách kiểm tra xong:** Mở file `permission-matrix.md`, đếm thấy 5 dòng entity mới. Mỗi dòng có 11 ô tương ứng 11 vai trò.

- ⏳ **B4.5.7** Cập nhật `seed-fixture.yaml` — thêm fixture mới + sửa fixture cũ `[need: B4.5.3 ✅ + B4.5.4 ✅ schema entity + state đã chốt]`
  - **Phạm vi:**
    - Thêm `tctv_variants` (≥6 mẫu: 2 TW × Văn phòng LS, 2 BN × Trung tâm TVPL, 2 ĐP × Văn phòng LS)
    - Thêm `nguoi_ho_tro_variants` (≥3 mẫu cho 3 cấp TW/BN/ĐP)
    - Thêm `kh_dao_tao_nam_variants`, `lich_hoc_variants`, `hoc_vien_variants` (mỗi loại ≥3 mẫu)
    - Sửa `tvv_variants`: đổi thang điểm 0-10 → 1-5, bỏ trường `dia_ban_ids`, thêm trường `tctv_id`
  - **Cách kiểm tra xong:** Mở file `seed-fixture.yaml`, đếm có 33 nhóm `_variants` (28 cũ + 5 mới). Tìm `tvv_variants`, không còn dòng `dia_ban_ids`, có dòng `tctv_id`.

> **🛑 CP1.5 — Dừng sau B4.5.7. Báo PM verify 5 file doc đã sync với SRS chốt + folder archive có 3 file SRS cũ. Sẵn sàng vào Bước 5 seed.**

> **❌ KHÔNG làm trong Bước 4.5:**
> - `input/users.csv` — chờ BA reply câu G1 (chiến lược migration NHT). Nếu BA chốt cần TK NHT mới → tách task riêng sau B4.1.
> - `permission-matrix.md` Phase 2 (verify CRUD behavior từ test) — để B8.2 sau test xong.

---

## Bước 5 — Seed data

> **⚠️ Toàn bộ Bước 5 implicit depend on Bước 4.5 hoàn tất:**
> - B4.5.3 ✅ (`entity-map.md` có 5 entity mới — seed task biết tạo entity ở module nào)
> - B4.5.4 ✅ (`flow-module.md` có SM mới/sửa — seed task biết đẩy state đúng)
> - B4.5.7 ✅ (`seed-fixture.yaml` có fixture entity mới — seed task có giá trị cụ thể để nhập)
>
> Nếu Bước 4.5 chưa xong → KHÔNG bắt đầu Bước 5, sẽ seed sai data.
>
> **Guard bổ sung trước mỗi task seed Bước 5:** dev confirm endpoint cho entity mới đã sẵn sàng. Nếu backend 404/422 → block, không retry.

### 5a. Tầng 0 — Danh mục gốc

- ⏳ **B5a.1** Seed DM mức độ phức tạp Hỏi đáp + cấu hình SLA 2 mức `[need: B4.2 ✅ + B4.5.7 ✅ fixture sẵn sàng]`
  - **Phạm vi:** Tạo 2 mức độ phức tạp (THUONG / PHUC_TAP). Cấu hình SLA 2 dòng cho Hỏi đáp: THUONG = 15 ngày làm việc, PHUC_TAP = 30 ngày làm việc.
  - **Cách kiểm tra xong:** Mở form thêm Hỏi đáp, thấy radio "Mức độ phức tạp" với 2 lựa chọn. Tạo 1 HD test, hệ thống tự tính deadline đúng theo mức đã chọn.

- ⏳ **B5a.2** Seed Mẫu phản hồi 3 phạm vi (TW / BN / ĐP riêng) `[need: B4.2 ✅ + B4.5.7 ✅ fixture sẵn sàng]`
  - **Phạm vi:** Hệ thống tự điền phạm vi theo cấp đơn vị user: CB TW → TW_QUOC_GIA, CB BN → BN_RIENG, CB ĐP → DP_RIENG. Sau khi tạo xong, trường này khóa không sửa được.
  - **Cách kiểm tra xong:** Login lần lượt 3 vai trò TW/BN/ĐP, mở form Mẫu phản hồi → phạm vi tự điền đúng 3 giá trị khác nhau.

- ⏳ **B5a.3** Seed DM loại Tổ chức tư vấn `[need: B4.2 ✅ + B4.5.3 ✅ entity TCTV trong entity-map]`
  - **Phạm vi:** Tạo ≥3 loại TCTV theo NĐ77/2008: Văn phòng Luật sư, Trung tâm TVPL, Khác.
  - **Cách kiểm tra xong:** Mở form thêm TCTV, dropdown "Loại tổ chức" render ít nhất 3 option.

### 5b. Tầng 1 — Tổ chức Tư vấn (TCTV) — module mới

- ⏳ **B5b.1** Tạo 6 TCTV trạng thái "Mới đăng ký" — cover 3 cấp × 2 loại `[need: B5a.3 ✅ DM loại TCTV đã có]`
  - **Phạm vi:** Tạo 6 TCTV: 2 ở cấp TW (loại Văn phòng LS), 2 ở cấp BN (loại Trung tâm TVPL), 2 ở cấp ĐP (loại Văn phòng LS). Tất cả đều ở trạng thái "Mới đăng ký".
  - **Cách kiểm tra xong:** Mở tab "Mới đăng ký" ở màn hình TCTV, đếm thấy ≥6 dòng. Mỗi cấp TW/BN/ĐP có ít nhất 1 TCTV.

- ⏳ **B5b.2** Đẩy 3 TCTV (mỗi cấp 1 cái) sang trạng thái "Hoạt động" `[need: B5b.1 ✅ có 6 TCTV Mới đăng ký]`
  - **Phạm vi:** Walk lifecycle "Mới đăng ký" → "Chờ phê duyệt" → "Hoạt động" cho ít nhất 3 TCTV (mỗi cấp TW/BN/ĐP có 1).
  - **Cách kiểm tra xong:** Mỗi cấp TW/BN/ĐP có ít nhất 1 TCTV "Hoạt động". Mở form TVV, dropdown "Tổ chức tư vấn liên kết" có ≥1 lựa chọn.

### 5c. Tầng 1 — NHT migration (rủi ro cao — break R6)

- ⏳ **B5c.1** Chuyển NHT cũ R6 từ enum `loai_tvv` sang entity NGUOI_HO_TRO mới `[need: B4.2 ✅ BA chốt G1+G8 chiến lược migration]`
  - **Phạm vi:** Mọi TK NHT R6 (đang là `loai_tvv=NHT`) tạo entity NGUOI_HO_TRO 1:1, có ghi audit log thời điểm migrate. Phải đảm bảo workflow R6 cũ phân công NHT vẫn chạy được sau migrate (regression).
  - **Cách kiểm tra xong:** Mọi TK NHT R6 có 1 entity NGUOI_HO_TRO tương ứng. Chạy lại 1 workflow R6 mẫu (VV phân công nht_ag_01) → PASS.

- ⏳ **B5c.2** Gán lĩnh vực phụ trách cho NHT (junction NHT × lĩnh vực) `[need: B5c.1 ✅ NHT đã migrate sang entity riêng]`
  - **Phạm vi:** Mỗi NHT có ít nhất 1 lĩnh vực được gán. Mỗi lĩnh vực × cấp có ít nhất 1 NHT phụ trách.
  - **Cách kiểm tra xong:** Mở modal phân công Vụ việc, chọn 1 lĩnh vực bất kỳ → dropdown NHT có ít nhất 1 option khớp lĩnh vực đó.

### 5d. Tầng 1 — TVV refactor

- ⏳ **B5d.1** Kiểm tra TVV cũ R6 không bị vỡ sau khi migrate NHT (regression) `[need: B5c.1 ✅ NHT đã migrate xong]`
  - **Phạm vi:** TVV cũ R6 (12 record) phải giữ nguyên trạng thái "Hoạt động". Các workflow R6 phân công TVV (Hỏi đáp / Vụ việc / Tư vấn chuyên sâu) phải chạy được như cũ.
  - **Cách kiểm tra xong:** Mở list TVV → đếm 12 record đang "Hoạt động". Chạy lại 1 workflow R6 mẫu phân công TVV → PASS không lỗi.

- ⏳ **B5d.2** Seed TVV mới theo schema mới (thang 1-5, bỏ địa bàn) `[need: B5d.1 ✅ + B5b.2 ✅ TCTV "Hoạt động" sẵn để link]`
  - **Phạm vi:** Seed ít nhất 3 TVV mới cho mỗi tổ hợp (loại × cấp × lĩnh vực). TVV mới phải dùng thang điểm 1-5 (không phải 0-10), không còn trường địa bàn, có liên kết với 1 TCTV "Hoạt động".
  - **Cách kiểm tra xong:** Mở chi tiết TVV mới, thấy thang điểm 1-5 + có TCTV liên kết + không hiển thị trường địa bàn. Filter list TVV theo loại CG cấp TW thấy ≥1 TVV.

> **🛑 CP2 — Dừng tại đây sau B5d.2 — Đối tượng đã sẵn sàng. Báo PM verify trước khi seed giao dịch**

### 5e. Tầng 2 — Hỏi đáp với mức độ phức tạp

- ⏳ **B5e.1** Seed Hỏi đáp 2 mức độ phức tạp `[need: B5a.1 ✅ DM mức độ + cấu hình SLA đã có]`
  - **Phạm vi:** Seed ít nhất 3 Hỏi đáp mức THUONG (deadline +15 ngày làm việc) và ít nhất 3 Hỏi đáp mức PHUC_TAP (deadline +30 ngày làm việc). Deadline phải tính chỉ ngày làm việc, bỏ thứ 7, chủ nhật và ngày lễ.
  - **Cách kiểm tra xong:** Mở 1 HD mức THUONG, deadline = ngày tiếp nhận + 15 ngày làm việc. Mở 1 HD mức PHUC_TAP, deadline = +30 ngày làm việc.

### 5f. Tầng 2 — Đào tạo 3 cấp (KH năm → CTDT → Khóa học → Lịch học → Học viên)

- ⏳ **B5f.1** Seed Kế hoạch đào tạo năm trạng thái "Nháp" `[need: B4.2 ✅ + B4.5.7 ✅ fixture KH năm sẵn sàng]`
  - **Phạm vi:** Seed ít nhất 1 KH đào tạo năm cho mỗi cấp (TW/BN/ĐP). Tất cả ở trạng thái "Nháp".
  - **Cách kiểm tra xong:** Mở form thêm KH năm, thấy đầy đủ field "Năm" + "Tiêu đề" + "Đơn vị" (đơn vị tự điền theo user). Mỗi cấp TW/BN/ĐP có ≥1 KH "Nháp".

- ⏳ **B5f.2** Đẩy KH năm sang trạng thái "Đã duyệt" `[need: B5f.1 ✅ có KH năm Nháp ở 3 cấp]`
  - **Phạm vi:** Walk lifecycle "Nháp" → "Chờ duyệt" → "Đã duyệt" cho ít nhất 1 KH năm mỗi cấp (TW/BN/ĐP). Cần có KH năm "Đã duyệt" để tạo CTDT con ở bước sau.
  - **Cách kiểm tra xong:** Mỗi cấp TW/BN/ĐP có ít nhất 1 KH năm trạng thái "Đã duyệt".

- ⏳ **B5f.3** Seed Chương trình đào tạo (CTDT) "Nháp" gắn KH năm cha "Đã duyệt" `[need: B5f.2 ✅ có KH năm Đã duyệt ở 3 cấp]`
  - **Phạm vi:** Seed ít nhất 1 CTDT mỗi cấp, gắn vào KH năm cha "Đã duyệt". Test guard: nếu thử tạo CTDT khi KH năm cha còn "Nháp" → hệ thống chặn không cho tạo.
  - **Cách kiểm tra xong:** Mỗi cấp có ít nhất 1 CTDT "Nháp" gắn KH năm cha. Test thử tạo CTDT từ KH năm "Nháp" → bị từ chối với thông báo lỗi.

- ⏳ **B5f.4** Hoàn thiện chuỗi CTDT → Khóa học → Lịch học → Học viên `[need: B5f.3 ✅ có CTDT Nháp]`
  - **Phạm vi:**
    - Đẩy CTDT từ "Nháp" sang "Đã duyệt"
    - Seed Khóa học gắn CTDT cha "Đã duyệt"
    - Seed Lịch học: ít nhất 3 buổi/khóa
    - Seed Học viên: ít nhất 3 học viên/khóa, mỗi học viên có liên kết tài khoản
  - **Cách kiểm tra xong:** Test gửi phê duyệt Khóa học khi chưa có giảng viên → hệ thống chặn với thông báo lỗi. Khóa học có ≥3 buổi lịch + ≥3 học viên.

---

## Bước 6 — Test theo 4 nhóm phân loại — **CHECKPOINT 3**

> **Nguyên tắc:** Module thay đổi nhiều → test full. Thay đổi ít → test sample. Xem chi tiết phân nhóm tại [plan.md §3](plan.md#3-bản-đồ-ảnh-hưởng--chiến-lược-test-theo-từng-module).

---

### 🔴 Bước 6A — Nhóm A: TEST FULL 3 module SRS update (3 tuần)

**Cách làm:** Test toàn bộ workflow + functional + permission như chưa từng test.

#### 6A.1 — FR-02 Hỏi đáp (test full)

- ⏳ **B6A.1.1** Workflow Hỏi đáp đủ 8 trạng thái + 4 mức cảnh báo SLA `[need: B5e.1 ✅ + BA chốt câu 1+2 (Hủy công khai + Đóng hồ sơ)]`
  - **Phạm vi:** Walk full lifecycle Hỏi đáp: Mới → Tiếp nhận → Đang xử lý → Đã trả lời → Chờ duyệt → Đã duyệt → Công khai → Hoàn thành. Verify cron 30 phút tự động chuyển mức cảnh báo SLA + gửi email cảnh báo.
  - **Cách kiểm tra xong:** Đi hết 8 trạng thái không lỗi. Vào MailHog thấy email "[Cảnh báo SLA]". Mở audit log, có ghi đủ các bước chuyển trạng thái.

- ⏳ **B6A.1.2** Test 13 chức năng FR-02 (10 UC cũ + 3 UC mới) `[need: B6A.1.1 ✅ workflow Hỏi đáp PASS]`
  - **Phạm vi:** Test các UC10-19 (10 chức năng cũ) + 3 chức năng mới (NEW-01/02 + CROSS-01). Mỗi chức năng test 1 happy path + 2 case sai input.
  - **Cách kiểm tra xong:** 13 chức năng đều PASS happy path. Mỗi chức năng có 2 case sai trả thông báo lỗi đúng theo SRS.

- ⏳ **B6A.1.3** Test phân quyền Mẫu phản hồi 3 cấp `[need: B5a.2 ✅ Mẫu phản hồi 3 phạm vi đã seed + B6A.1.2 ✅]`
  - **Phạm vi:** Test 3 ca phân quyền: (1) CB cấp TW tạo Mẫu TW_QUOC_GIA → cả 63 đơn vị ĐP đọc được. (2) CB cấp BN tạo Mẫu BN_RIENG → chỉ chính BN đó đọc được. (3) CB cấp ĐP cố gắng tạo Mẫu TW_QUOC_GIA → bị từ chối.
  - **Cách kiểm tra xong:** 3 ca trên đều PASS đúng hành vi mong đợi. Ca (3) trả lỗi 403 hoặc form ẩn lựa chọn TW_QUOC_GIA.

- ⏳ **B6A.1.4** Test edge case + bảo mật FR-02 `[need: B6A.1.2 ✅ functional FR-02 PASS]`
  - **Phạm vi:**
    - Optimistic locking khi 2 user cùng sửa 1 phản hồi
    - Auto-save mã hóa AES-256
    - Lọc nội dung XSS với 7 payload OWASP cho Mẫu phản hồi
    - Batch locking khi nhiều user duyệt cùng lúc
    - Kiểm tra nhãn aria-label (chuẩn WCAG cho người khiếm thị)
  - **Cách kiểm tra xong:** Tất cả 5 hạng mục trên đều PASS, không phát hiện lỗ hổng bảo mật hay lỗi hỗ trợ tiếp cận.

#### 6A.2 — FR-03 Đào tạo (module phức tạp nhất)

- ⏳ **B6A.2.1** Workflow Đào tạo 3 cấp (KH năm → CTDT → Khóa học) `[need: B5f.4 ✅ + BA chốt câu 4 (6 GAP-III)]`
  - **Phạm vi:** Walk full lifecycle 3 cấp Đào tạo. Test guard quan trọng: khi Khóa học con được công khai, CTDT cha tự động chuyển trạng thái "Đang thực hiện".
  - **Cách kiểm tra xong:** Đi hết 3 cấp KH năm → CTDT → Khóa học không lỗi. Khi công khai Khóa học, mở CTDT cha thấy trạng thái đã đổi sang "Đang thực hiện".

- ⏳ **B6A.2.2** Workflow Khóa học đủ 11 trạng thái + 2 đường từ chối `[need: B6A.2.1 ✅ workflow 3 cấp PASS]`
  - **Phạm vi:** Walk full 11 trạng thái Khóa học. Test 2 đường từ chối: (1) Từ chối khóa khi gửi duyệt → quay về "Chờ duyệt" trực tiếp (không qua "Nháp"). (2) Từ chối kết quả → tương tự.
  - **Cách kiểm tra xong:** Đi đủ 11 trạng thái không lỗi. Sau khi bị từ chối, sửa lại và gửi duyệt lại → quay về "Chờ duyệt" trực tiếp (skip "Nháp").

- ⏳ **B6A.2.3** Workflow Lịch học + điểm danh + công bố kết quả `[need: B6A.2.2 ✅ + BA chốt câu 5+6 (thang điểm 1-5 + ngưỡng đạt)]`
  - **Phạm vi:**
    - CRUD lịch học (tạo/sửa/xóa buổi)
    - Điểm danh 3 mức: Có mặt / Vắng có phép / Vắng không phép
    - Công bố kết quả về tài khoản học viên (Hướng B — KHÔNG cấp chứng nhận PDF)
  - **Cách kiểm tra xong:** Tạo lịch + điểm danh đủ 3 mức cho ít nhất 1 buổi. Công bố kết quả xong, học viên login thấy KQ trong TK của mình.

- ⏳ **B6A.2.4** Test 22 chức năng FR-03 (19 UC cũ + 3 UC mới) `[need: B6A.2.3 ✅ workflow Lịch học PASS]`
  - **Phạm vi:** Test các chức năng FR-III-01 đến FR-III-19 (cũ) + 3 chức năng mới (NEW-01/02/03). Mỗi chức năng test 1 happy path + 1 case sai input.
  - **Cách kiểm tra xong:** 22 chức năng đều PASS happy path. Mỗi chức năng có case sai trả lỗi đúng theo SRS.

- ⏳ **B6A.2.5** Test 60 mã quyền Đào tạo × 11 vai trò (sample wave) `[need: B6A.2.4 ✅ functional FR-03 PASS]`
  - **Phạm vi:** Test 60 mã quyền chia 6 nhóm:
    - KHDT (10 mã), CTDT (10 mã), Khóa học (16 mã)
    - Lịch học (4 mã), Đăng ký (5 mã)
    - GV/BG/NHCH/DKT/DXDT (15 mã)
    - Mỗi mã test ít nhất 3 vai trò có quyền (ALLOW) + 3 vai trò không có quyền (DENY)
  - **Cách kiểm tra xong:** Vai trò có quyền thực hiện được hành động. Vai trò không có quyền bị chặn (403 hoặc ẩn nút). Đủ 60 mã được cover.

#### 6A.3 — FR-04 TVV/Mạng lưới

- ⏳ **B6A.3.1** Workflow Tổ chức Tư vấn (mới) — 5 trạng thái `[need: B5b.2 ✅ TCTV "Hoạt động" sẵn sàng]`
  - **Phạm vi:** Walk full lifecycle TCTV: Mới đăng ký → Chờ phê duyệt → Hoạt động → Tạm dừng → Vô hiệu hóa. Test guard quan trọng: nếu thử vô hiệu hóa TCTV mà vẫn còn TVV liên kết → hệ thống chặn với thông báo lỗi.
  - **Cách kiểm tra xong:** Đi đủ 5 trạng thái không lỗi. Test guard: tạo 1 TCTV "Hoạt động" có TVV liên kết, thử "Vô hiệu hóa" → bị chặn.

- ⏳ **B6A.3.2** Workflow TVV refactor — 9 trạng thái (thêm 2 trạng thái thẩm định) `[need: B5d.2 ✅ TVV mới đã seed]`
  - **Phạm vi:** Walk full lifecycle TVV mới: Mới đăng ký → **Chờ thẩm định (mới)** → **Đang thẩm định (mới)** → Chờ phê duyệt → Hoạt động. Test đường Từ chối: từ "Đang thẩm định" → từ chối → quay về "Chờ thẩm định".
  - **Cách kiểm tra xong:** Đi đủ 9 trạng thái không lỗi. Test từ chối → quay về "Chờ thẩm định" đúng theo SRS.

- ⏳ **B6A.3.3** Workflow Người hỗ trợ pháp lý (NHT) — entity mới `[need: B5c.2 ✅ NHT có lĩnh vực + BA chốt câu 9 (migration NHT)]`
  - **Phạm vi:** Test các thao tác NHT: tạo mới, sửa, xóa, tìm kiếm để phân công vụ việc, xem hồ sơ chi tiết.
  - **Cách kiểm tra xong:** 4 thao tác (tạo/sửa/xóa/tìm) đều PASS. Mở hồ sơ NHT thấy đủ thông tin theo SRS FR-IV.

- ⏳ **B6A.3.4** Test 19 chức năng FR-04 (13 UC cũ + 3 UC mới + 3 UC NHT) `[need: B6A.3.3 ✅ + BA chốt câu 7 (logic thẩm định 4 nhóm) + câu 8 (luồng đăng ký)]`
  - **Phạm vi:** Test FR-IV-01 đến FR-IV-13 (cũ) + 3 chức năng mới (NEW-01/02/04) + 3 chức năng NHT (NHT-01/02/03). Mỗi chức năng test 1 happy + 1 negative.
  - **Cách kiểm tra xong:** 19 chức năng đều PASS happy path. Negative case trả lỗi đúng theo SRS.

> **🛑 Sau 6A.1/6A.2/6A.3 — báo BA mỗi module 1 lần để confirm trước khi sang 6B**

---

### 🟠 Bước 6B — Nhóm B: TEST DELTA+IMPACT 4 module (1 tuần)

**Cách làm:** Test phần thay đổi đầy đủ + chạy sample workflow happy path để chắc không break luồng cũ.

- ⏳ **B6B.1** FR-05 Vụ việc — phân công NHT mới `[need: B5c.2 ✅ NHT có lĩnh vực + B6A.3.3 ✅ NHT entity OK]`
  - **Phạm vi (test đầy đủ phần thay đổi):**
    - Modal phân công tách thành 2 dropdown (TVV/CG riêng, NHT riêng)
    - FK Người hỗ trợ trỏ về entity NGUOI_HO_TRO mới
    - Bỏ filter theo địa bàn trong modal phân công
  - **Phạm vi (test sample để chắc không vỡ):** 1 workflow VV happy path: tạo → phân công → xử lý → hoàn thành
  - **KHÔNG test:** 19 chức năng Vụ việc khác (giả định không bị ảnh hưởng)
  - **Cách kiểm tra xong:** Modal phân công render đúng 2 dropdown riêng. Workflow VV mẫu đi hết không lỗi.

- ⏳ **B6B.2** FR-10 QTHT — seed 60 mã quyền + flow đăng ký TK NHT `[need: B6A.2.5 ✅ permission FR-03 PASS]`
  - **Phạm vi (test đầy đủ phần thay đổi):**
    - Seed 60 mã quyền Đào tạo trong QTHT + ma trận 11 vai trò
    - Tạo tài khoản loại NHT mới (loại tài khoản mới)
    - Cấu hình phân công mặc định: bỏ trường địa bàn
  - **Phạm vi (test sample):** 1 workflow QTHT happy: login → thêm 1 user → cấu hình 1 phân công
  - **KHÔNG test:** 25 chức năng QTHT khác
  - **Cách kiểm tra xong:** Vào QTHT thấy đủ 60 mã quyền. Tạo TK NHT thành công. Workflow QTHT mẫu đi hết không lỗi.

- ⏳ **B6B.3** FR-13 Tư vấn nhanh — Escalate sang Hỏi đáp `[need: B6A.1.1 ✅ workflow HD PASS + dev confirm nút Escalate đã có]`
  - **Phạm vi (test đầy đủ phần thay đổi):** Click nút "Escalate" trên phiên TV nhanh → hệ thống tạo Hỏi đáp với kênh TVN_BRIDGE. Mở list Hỏi đáp thấy badge "Từ Tư vấn nhanh".
  - **Phạm vi (test sample):** 1 phiên TVN bình thường (không escalate) — kiểm tra luồng cũ không vỡ.
  - **KHÔNG test:** 5 chức năng TVN khác.
  - **Cách kiểm tra xong:** Click Escalate → có HD mới được tạo + badge hiển thị đúng. Phiên TVN thường vẫn chạy được.

- ⏳ **B6B.4** FR-16 API Cổng PLQG — 3 endpoint thay đổi `[need: BA chốt câu 9+10 + đã thông báo Cổng PLQG schema mới]`
  - **Phạm vi (test đầy đủ phần thay đổi):**
    - Endpoint TVV: bỏ trường `dia_ban` ở cả request param và response
    - Endpoint Khóa học: schema mới theo cấu trúc 3 cấp
    - Endpoint loại tài khoản: bỏ NHT khỏi enum `loai`
  - **Phạm vi (test sample):** Contract test 3 endpoint đổi với Cổng PLQG (môi trường staging hoặc request giả).
  - **KHÔNG test:** 18 endpoint outbound khác.
  - **Cách kiểm tra xong:** 3 endpoint thay đổi trả response đúng schema mới. Cổng PLQG nhận được response không lỗi.

> **🛑 Sau 6B — báo BA: 4 module B đã PASS phần thay đổi + happy path không break**

---

### 🟡 Bước 6C — Nhóm C: TEST IMPACT only 7 module (3 ngày)

**Cách làm:** Test sample 2-3 màn hình đại diện. KHÔNG test full.

- ⏳ **B6C.1** FR-01 Dashboard — kiểm tra 2 KPI bị ảnh hưởng `[need: B5c.2 ✅ NHT có lĩnh vực + B5d.2 ✅ TVV mới đã seed]`
  - **Phạm vi:** Test 2 KPI: (1) KPI mạng lưới TVV phải đếm gộp cả TVV + NHT. (2) KPI Hỏi đáp phải thể hiện đúng 4 mức cảnh báo SLA.
  - **KHÔNG test:** 9 KPI Dashboard khác.
  - **Cách kiểm tra xong:** Mở Dashboard, thấy 2 KPI hiển thị đúng số liệu. KPI mạng lưới = số TVV + số NHT.

- ⏳ **B6C.2** FR-06 Chi trả — sample chi trả TVV thuộc nhiều TCTV `[need: B5b.2 ✅ TCTV "Hoạt động" + B5d.2 ✅ TVV mới]`
  - **Phạm vi:** Tạo 1 TVV liên kết với 2 TCTV. Mở form chi trả → kiểm tra hiển thị đúng TCTV của TVV đó. Verify NHT không hiện trong dropdown chọn TVV chi trả.
  - **KHÔNG test:** Workflow chi trả đầy đủ.
  - **Cách kiểm tra xong:** Form chi trả hiển thị đúng TCTV. Dropdown TVV không có NHT.

- ⏳ **B6C.3** FR-08 Đánh giá hiệu quả — sample form chấm điểm `[need: B5d.2 ✅ TVV mới đã seed]`
  - **Phạm vi:** Mở form chấm điểm đánh giá. Verify thang điểm là 1-5 (không còn 0-10). Verify NHT không xuất hiện trong list TVV được chấm.
  - **KHÔNG test:** 9 chức năng đánh giá khác.
  - **Cách kiểm tra xong:** Form thang điểm 1-5 đúng. Dropdown TVV không có NHT.

- ⏳ **B6C.4** FR-11 Báo cáo TT17 — 2 báo cáo bị ảnh hưởng `[need: B5d.2 ✅ TVV mới + B6A.2.4 ✅ FR-03 functional PASS]`
  - **Phạm vi:** Test 2 báo cáo: (1) BC04 Mạng lưới TVV — bỏ dimension địa bàn khỏi pivot. (2) BC Đào tạo — query đúng cấu trúc 3 cấp.
  - **KHÔNG test:** 21 báo cáo khác.
  - **Cách kiểm tra xong:** Xuất 2 báo cáo trên, mở file Excel/PDF thấy không có cột địa bàn (BC04). BC Đào tạo có 3 cấp dữ liệu.

- ⏳ **B6C.5** FR-12 Tư vấn chuyên sâu — sample dropdown CG `[need: B5d.2 ✅ TVV mới đã seed]`
  - **Phạm vi:** Mở form/modal cần chọn Chuyên gia (CG). Verify dropdown chỉ hiển thị CG ở trạng thái "Hoạt động", KHÔNG hiển thị CG ở trạng thái "Chờ thẩm định" hay "Đang thẩm định" (2 trạng thái mới).
  - **KHÔNG test:** 7 chức năng TV chuyên sâu khác.
  - **Cách kiểm tra xong:** Dropdown CG render đúng — chỉ có CG "Hoạt động", không có CG ở trạng thái thẩm định.

- ⏳ **B6C.6** FR-14 Hợp đồng tư vấn — sample form HĐ `[need: B5d.2 ✅ TVV mới đã seed]`
  - **Phạm vi:** Mở form Hợp đồng tư vấn. Verify dropdown "Bên B" không có NHT (theo NĐ55 thì NHT không ký HĐ tư vấn).
  - **KHÔNG test:** Workflow HĐ tư vấn đầy đủ.
  - **Cách kiểm tra xong:** Dropdown Bên B chỉ chứa TVV/CG, không có NHT.

- ⏳ **B6C.7** FR-15 CT HTPLDN GĐ2 — sample đợt báo cáo GĐ2 `[need: B6A.2.4 ✅ FR-03 functional PASS]`
  - **Phạm vi:** Tạo 1 đợt báo cáo GĐ2 với data Đào tạo theo cấu trúc 3 cấp. Verify hệ thống không cấp chứng nhận PDF (theo Hướng B).
  - **KHÔNG test:** 11 chức năng CT HTPLDN khác.
  - **Cách kiểm tra xong:** Đợt báo cáo GĐ2 tạo thành công, đọc được data Đào tạo 3 cấp. Không có file chứng nhận PDF được sinh ra.

> **🛑 Sau 6C — báo BA: 7 module C đã PASS sample, không phát hiện regression**

---

### ⚪ Bước 6D — Nhóm D: SMOKE 2 module không liên quan (0.5 ngày)

**Cách làm:** Smoke 5 phút mỗi module — verify hệ thống còn login + render được.

- ⏳ **B6D.1** FR-07 Doanh nghiệp — smoke 5 phút `[need: B6A ✅ + B6B ✅ tất cả Nhóm A+B đã PASS]`
  - **Phạm vi:** Login portal Doanh nghiệp → mở 1 màn hình DN bất kỳ → kiểm tra hệ thống còn render được.
  - **KHÔNG test:** CRUD DN, workflow đầy đủ.
  - **Cách kiểm tra xong:** Login OK, màn hình DN render không lỗi console, không trắng trang.

- ⏳ **B6D.2** FR-09 Biểu mẫu — smoke 5 phút `[need: B6A ✅ + B6B ✅ tất cả Nhóm A+B đã PASS]`
  - **Phạm vi:** Login QTHT → mở list biểu mẫu → kiểm tra hệ thống còn render được.
  - **KHÔNG test:** CRUD biểu mẫu, workflow đầy đủ.
  - **Cách kiểm tra xong:** Login OK, list biểu mẫu render không lỗi console, không trắng trang.

> **🛑 CP3 — Dừng sau khi 6A + 6B + 6C + 6D PASS. Báo BA + PM tổng kết Bước 6**

---

## Bước 7 — Sửa bug + retest (xen kẽ 6)

> Không phải task cứng — chạy xen kẽ khi phát hiện bug. Quy trình:

1. Log bug theo template 6 sections (Mô tả / Bước / KQ mong đợi / KQ thực tế / Bằng chứng / So sánh)
2. Verify 2 nguồn: NotebookLM + grep SRS local
3. Gửi dev → fix → retest
4. Pass → đóng; Fail → log lý do

**Tools hỗ trợ:**
- `investigate` skill khi bug khó tìm root cause
- `cso` skill audit XSS/locking/AES
- `codex challenge` adversarial review
- `bmad-tea` Test Architect khi bug strategy cần review

---

## Bước 8 — Đóng test — **CHECKPOINT 4**

- ⏳ **B8.1** Tổng kết kết quả test R7 `[need: tất cả task Bước 6 đã đóng — PASS/FAIL/BLOCKED rõ ràng]`
  - **Phạm vi:** Tổng hợp số task PASS/FAIL/BLOCKED. Tổng hợp bug Open/Closed/Deferred theo severity. Tính % coverage SRS đã test được.
  - **Cách kiểm tra xong:** Có file `output/qa-reports/round7/R7-final-summary.md`. 100% UC mới có happy path PASS. Không còn bug Critical hoặc Blocker đang Open.

- ⏳ **B8.2** Phase 2 — verify hành vi thực tế của permission-matrix sau test `[need: B6A.2.5 ✅ + B6B.2 ✅ permission test đã chạy]`
  - **Phạm vi:**
    - Đối chiếu kết quả permission test thực tế với permission-matrix đã update Phase 1 (ở B4.5.6)
    - Sửa lại các ô CRUD/❌ nếu app implement khác SRS — ghi rõ lý do (bug app hay SRS sai)
    - Kiểm tra lại 4 file doc đã update ở B4.5 (entity-map, flow-module, 02-thu-tu, fixture) có cần sửa thêm không
  - **Cách kiểm tra xong:** permission-matrix Phase 2 reflect đúng hành vi app. Có note rõ những ô app khác SRS kèm lý do.

- ⏳ **B8.3** Handoff doc cho stakeholder + xin BA/PM ký duyệt báo cáo cuối `[need: B8.1 ✅ + B8.2 ✅]`
  - **Phạm vi:** Gửi báo cáo cuối cho stakeholder + BA + PM. Trình bày kết quả test, bug, coverage. BA/PM ký duyệt và đóng R7.
  - **Cách kiểm tra xong:** Có chữ ký duyệt của BA và PM trên báo cáo cuối. R7 chính thức đóng.

> **🛑 CP4 — Final sign-off**

---

## Tham chiếu

- [plan.md](plan.md) — chiến lược chi tiết (v2)
- [summary-for-BA.md](summary-for-BA.md) — file gửi BA
- [v1 todo](../_archive/srs-update-2026-05-04-v1/todo.md) — task list cũ (giữ làm reference)
- [tasks/plan.md](../plan.md) v2.5.1 — R6 active (KHÔNG ghi đè)
- [tasks/lessons-learned.md](../lessons-learned.md) — bài học A5 + UI auto-chain

---

> **⚠️ Trước khi flip ⏳ → 🟢:** chạy verify query thật, copy kết quả vào dòng kết quả. Trust state, not task icon.
>
> **⚠️ Bug log:** strict 6 sections theo `bug-report-template.md`. Hook enforce.
>
> **⚠️ Mọi seed task:** acceptance theo per-filter, KHÔNG theo total count (bài học A5).
