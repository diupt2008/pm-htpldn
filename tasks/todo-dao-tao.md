# TODO — Đào tạo (KH năm / CTĐT / Khóa học / NHCH / ĐKT / Bài giảng / Giảng viên / Học viên / Lịch học)

> File module của [`todo.md`](todo.md) master. Tổng **17 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.3.5, R7.3.6, R7.3.8, R7.3.9, R7.3.10, R7.3.11, R7.3.12, R7.3.13, R7.3.15, R7.4.B0, R7.4.B1, R7.4.B5b, R7.4.B7, R7.4.B10, R7.4.B11, R7.4.B12, R7.7.6

---

## Tasks

- ✅ **R7.3.5** 🆕 Seed Kế hoạch ĐT năm (KE_HOACH_DAO_TAO — Mô hình A 3 cấp) <a id="r7-3-5"></a>
  - **Kết quả:** R8 re-seed PASS 3/3 NHAP cover TW + BN + DP. BE total 4 (3 NHAP R8 + 1 CHO_DUYET R7). [seed-checklist R8](../output/qa-reports/round8-2026-05-08/seed/dao-tao/seed-checklist-r7-3-5-kh-nam.md)
  - **Bug:** [bug-report R8](../output/qa-reports/round8-2026-05-08/bug-reports/dao-tao/bug-report-seed-r7-3-5-kh-nam.md) — 0/3 đóng (Major BR-AUTH-08 leak BE re-confirm + Major UI thiếu Xoá + Medium date off-by-one BE)

- 🚫 **R7.3.6** ✏️ Seed 6 CTĐT entry DU_THAO `[block: bug R7.4.B0 JWT revoke <1 phút ngăn workflow advance KH năm]` <a id="r7-3-6"></a>
  - **Cần:** R7.3.5 ✅ (3 NHAP R8) · ≥1 KH năm DA_DUYET/DA_CONG_KHAI mỗi cấp (✗ 0/3 — không advance được)
  - **R8 attempt 2026-05-08 19:14–19:21:** Probe (B) confirm FE filter strict `trangThai=DA_DUYET,DA_CONG_KHAI` → dropdown rỗng đúng spec. Path A1 advance fail 6 lần — bug R7.4.B0 reproduce 100%, escalated to Critical-Blocker P0. Đợi dev fix JWT TTL.
  - **Bug:** [bug-report-seed-r7-3-6-ctdt.md](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-seed-r7-3-6-ctdt.md) — 1/1 đóng (BUG-CTDT-FE-01 Closed-verified 2026-05-07 — form has keHoachId field)

- ✅ **R7.3.8** 🔄 Seed NHCH KICH_HOAT (R8 re-seed sau drift) <a id="r7-3-8"></a>
  - **Kết quả:** R8 PASS 6/6 KICH_HOAT cover 5 LV (Hành chính + Lao động + Đất đai + SHTT + Thuế) + 3 mức độ + 3 loại. PATCH 5 cũ + POST 1 mới. [seed-checklist R8](../output/qa-reports/round8-2026-05-08/seed/dao-tao/seed-checklist-r7-3-8-nhch-kich-hoat.md) · [list final](../output/qa-reports/round8-2026-05-08/seed/dao-tao/r7-3-8-nhch-list-6-kich-hoat-final.png)

- ✅ **R7.3.9** 🔄 Seed 5 ĐKT entry NHAP cover 5 LV <a id="r7-3-9"></a>
  - **Kết quả:** R8 PASS 5/5 NHAP THU_CONG mode cover 5 LV (Hành chính + Lao động + Đất đai + SHTT + Thuế). 1 NHCH/đề. Unblock R7.4.B10 + R7.7.6. [seed-checklist R8](../output/qa-reports/round8-2026-05-08/seed/dao-tao/seed-checklist-r7-3-9-dkt.md) · [list final](../output/qa-reports/round8-2026-05-08/seed/dao-tao/r7-3-9-dkt-list-5-nhap-final.png)
  - **Spec:** FR-III-NEW-01 line 1324
  - **Bug:** [bug-report-seed-r7-3-9-dkt-nhch.md](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-seed-r7-3-9-dkt-nhch.md) — 2/2 đóng FE (DKT-FE-01 + NHCH-STATE-01 Closed).

- ✅ **R7.3.10** 🔄 Seed 8 bài giảng (R8 hoàn tất Slide/PDF) <a id="r7-3-10"></a>
  - **Kết quả:** R8 PASS 8/8 — 5 VIDEO (R7) + 1 SLIDE Hành chính + 2 PDF (Dân sự + Doanh nghiệp). Cover 3 loại + 7 LV. Direct API JSON body (BE schema dùng `fileUrl + dungLuong` flat thay vì SRS field `file_bai_giang` nested). [seed-checklist R8](../output/qa-reports/round8-2026-05-08/seed/dao-tao/seed-checklist-r7-3-10-bai-giang.md) · [list final](../output/qa-reports/round8-2026-05-08/seed/dao-tao/r7-3-10-bai-giang-list-8-final.png)
  - **Bug:** [bug-report-bai-giang-r7-3-10.md](../output/qa-reports/round8-2026-05-08/bug-reports/dao-tao/bug-report-bai-giang-r7-3-10.md) — 0/1 đóng (Major BUG-BG-001 BE missing validation `fileBaiGiang/urlYoutube` theo `loaiTaiLieu` — vi phạm SRS FR-III-07 Inputs row 4 + Error E2)
  - **Spec drift note:** BG entity KHÔNG có state machine `KICH_HOAT/VO_HIEU_HOA` như task title cũ giả định — chỉ có `congKhai` boolean. SRS FR-III-07 Inputs cũng không định nghĩa field `trang_thai`.

- ✅ **R7.3.11** ✏️ Seed 8 giảng viên entry HOAT_DONG (verify FR-III-11 refactor) <a id="r7-3-11"></a>
  - **Kết quả:** PASS 8/8 cover 6 LV (Dân sự/Lao động/Thuế/SHTT/KDTM/Đất đai/Hành chính/KDQT). [r7-3-11-giang-vien-list.png](../output/qa-reports/round7-2026-05-06/seed/dao-tao/r7-3-11-giang-vien-list.png)

- 🚫 **R7.3.12** 🆕 Seed 8 Học viên (HOC_VIEN entity mới — Mô hình A) `[block: dev fix entity 404 /api/v1/hoc-viens]` <a id="r7-3-12"></a>

- 🚫 **R7.3.13** 🆕 Seed Lịch học (LICH_HOC — FR-III-22) `[block: chưa rõ endpoint deploy]` <a id="r7-3-13"></a>

- 🚫 **R7.3.15** 🆕 Seed 8 Khóa học entry DU_THAO `[block: BE strict FK ctdtId, không bypass được; chờ R7.3.6 unblock]` <a id="r7-3-15"></a>
  - **Cần:** R7.3.6 ⏳ CTĐT DU_THAO (chuỗi block JWT bug R7.4.B0)
  - **R8 probe 2026-05-08 19:55:** POST `/khoa-hocs` 4 shape test (null/omitted/random UUID/alt field name) → tất cả reject 422/404. `ctdtId` required + FK enforced (404 `ERR-VAL-III-01-06: Chương trình đào tạo không tồn tại` cho random UUID). Field `chuongTrinhDaoTaoId` không được FE/BE chấp nhận (chỉ `ctdtId`).
  - **Note:** Bypass B7 workflow OK (state DU_THAO seed direct được) nhưng KHÔNG bypass FK CTDT được.

- 🚫 **R7.4.B0** 🆕 Workflow KH năm (SM-KH-DAO-TAO refinement TU_CHOI→CHO_DUYET) `[~10% — 1/10 transitions, JWT revoke escalated P0 emergency 2026-05-08 R8]` <a id="r7-4-b0"></a>
  - **Cần:** R7.3.5 ✅
  - **Kết quả:** ⚠️ 1/10 transitions (KH-0001 R7 advance NHAP→CHO_DUYET success, sau đó block). R8 reproduce 6/6 attempts fail — block 5+ downstream task.
  - **Bug:** [bug-report-r7-4-b0-jwt-revoke.md](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-r7-4-b0-jwt-revoke.md) — 0/2 đóng (Critical JWT escalated **P0 emergency** sau R8 reproduce + Major OTP)

- ⏳ **R7.4.B1** ✏️ Workflow CTĐT SM-CTDT mới (DU_THAO→CHO_DUYET→DA_DUYET) `[need: R7.3.6]` <a id="r7-4-b1"></a>
  - **Cần:** R7.3.6 ⏳
  - **Note:** UNBLOCKED — SRS update giải quyết spec contradiction R6.4.B2

- ✅ **R7.4.B5b** 🔄 ~~Publish NHCH NHAP→CONG_KHAI~~ — **CLOSED N/A do spec drift** <a id="r7-4-b5b"></a>
  - **Kết quả:** N/A — workflow này KHÔNG TỒN TẠI trong impl. Task description dựa trên `FR-III-09 Inputs row 7` quy định 3 state `NHAP/CONG_KHAI/AN` nhưng `Entity §3.4.3.21 row 9` (authoritative) chỉ có 2 state `KICH_HOAT/VO_HIEU_HOA`. State machine thực = toggle 2 state (verified R7.3.8 R8 PATCH 5/5 OK).
  - **Bug:** Đã cover bởi [BUG-SRS-NHCH-STATE-01](../output/qa-reports/round7-2026-05-06/bug-reports/dao-tao/bug-report-seed-r7-3-9-dkt-nhch.md) — Closed FE side 2026-05-07 (form default KICH_HOAT đúng). **SRS doc-side chưa fix** — `FR-III-09 line 783` vẫn ghi `NHAP/CONG_KHAI/AN` (typo copy-paste từ SM-BIEUMAU C.9), cần BA cập nhật sync về Entity §3.4.3.21.
  - **Replacement workflow:** Toggle KICH_HOAT/VO_HIEU_HOA qua `PATCH /api/v1/ngan-hang-cau-hois/{id}` body `{trangThai, version}` — đã verify R7.3.8 R8 ([seed-checklist R8](../output/qa-reports/round8-2026-05-08/seed/dao-tao/seed-checklist-r7-3-8-nhch-kich-hoat.md)).

- ⏳ **R7.4.B7** ✏️ Workflow KH SM-KHOAHOC 11 state (thêm TU_CHOI + TU_CHOI_KQ) — 12 bước `[need: R7.4.B1]` <a id="r7-4-b7"></a>
  - **Cần:** R7.4.B1 ⏳ DA_DUYET
  - **Note:** UNBLOCKED

- ⚠️ **R7.4.B10** 🆕 Workflow Đề kiểm tra (FR-III-NEW-01/02/03) `[~75% — FR-01/02 PASS 6/6, FR-03 endpoint verified + cascade block 0 KH]` <a id="r7-4-b10"></a>
  - **Kết quả:** R8 PASS-WITH-NOTE 6/8 — FR-III-NEW-01 tạo (5 đề R7.3.9), FR-III-NEW-02 CRUD GET/PATCH/DELETE all PASS, FR-III-NEW-03 endpoint `/distribute` verified working (404 ERR-DKT-KHOA-HOC-NOT-FOUND đúng spec). Walkthrough phân phối thực tế block do 0 KH (cascade R7.4.B0). Final 4 NHAP cover 4 LV (xóa 1 SHTT). [workflow-test-report R8](../output/qa-reports/round8-2026-05-08/workflow/dao-tao/workflow-test-report-r7-4-b10-dkt.md) · [list final](../output/qa-reports/round8-2026-05-08/workflow/dao-tao/r7-4-b10-dkt-after-crud-4-records.png)
  - **Spec ambiguity note:** FR-III-NEW-02 line 1354 "xóa khi chưa sử dụng" chưa định nghĩa rõ — cần BA xác nhận.

- ⏳ **R7.4.B11** 🆕 Phê duyệt khóa học (FR-III-21) `[need: R7.4.B7]` <a id="r7-4-b11"></a>
  - **Cần:** R7.4.B7 ≥1 KH `DA_KET_THUC`

- ⏳ **R7.4.B12** 🆕 Quản lý lịch học (FR-III-22) `[need: R7.3.13]` <a id="r7-4-b12"></a>
  - **Cần:** R7.3.13 🚫

- ⏳ **R7.7.6** ✏️ Khóa học 40 TC + FR-III mới (B10/B11/B12 + Đề KT + Lịch học) `[need: KH DA_KET_THUC, ĐKT, Lịch học endpoint]` <a id="r7-7-6"></a>
  - **Cần:** ≥1 KH `DA_KET_THUC` (✗0) · ≥1 ĐKT (✗0) · Lịch học endpoint deploy (✗404)
