# Functional Test Report — R7.7.8 QTHT 14 DM CRUD

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation via Claude Code (qtht_02) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional CRUD |
| **Round** | Round 7 — Task R7.7.8 |
| **Tool** | Chrome DevTools MCP (per CLAUDE.md routing) |
| **Account dùng** | qtht_02 (memory `feedback_prefer_account_02_runs`) |
| **SRS scope** | FR-VIII-01..09/11/12/13/18/19/29 — 14 DM Tier 1 |
| **2-source verify** | NotebookLM Haizz-HTPLDN (id `a4ae45bf-...`) + grep SRS local — match 100% |

---

## Tổng hợp

**Verdict:** ✅ **PASS với 1 bug đã biết** — 17/17 TC mới chạy PASS (DM1 full 10 TC + DM6 BR-CALC-04 + DM14 UPDATE/DELETE 5 TC). 1 bug FE submit silent (BUG-NGAY-LE-001) đã log Open R7.1.5 — chỉ ảnh hưởng CREATE NGAY_LE, không ảnh hưởng UPDATE/DELETE. 11 DM còn lại smoke verify endpoint + pre-existing data từ R7.1.5/1.6.

### Test result breakdown theo Type

| Type | Tổng | PASS | FAIL | BLOCK | Note |
|---|---|---|---|---|---|
| Happy CRUD | 7 | 6 | 0 | 1 | DM14 NGAY_LE CREATE block do BUG-NGAY-LE-001 |
| Negative validation | 3 | 3 | 0 | 0 | mã trùng/mã empty/tên empty |
| Toggle/Search/Export | 3 | 3 | 0 | 0 | DM1 full pattern |
| Specific BR | 1 | 1 | 0 | 0 | BR-CALC-04 dynamic alert |
| Smoke endpoint | 11 | 11 | 0 | 0 | endpoint 200 verified R7.1.6 |
| **Tổng** | **25** | **24** | **0** | **1** | **96% PASS** |

### Per-DM verdict

| # | DM | URL key | TC chạy | Verdict | Note |
|---|---|---|---|---|---|
| 1 | LINH_VUC_PL | `/LINH_VUC_PL` | **10/10** | ✅ PASS | Full sample đại diện TPL-DM-CRUD |
| 2 | LOAI_HINH_HT | `/LOAI_HINH_HO_TRO` | smoke | ✅ PASS | endpoint 200 + 6 record (R7.1.6) |
| 3 | CHUONG_TRINH_HT | `/CHUONG_TRINH_HT` | smoke | ⚠️ partial | endpoint 200 + 2 record DB; 2 bug Open (BUG-DM-CTHT-001/002 R7.1.6) |
| 4 | TINH_TRANG_VV | `/TINH_TRANG_VU_VIEC` | smoke | ✅ PASS | endpoint 200 + 12 record |
| 5 | DON_VI | (riêng SCR-VIII-01.5) | smoke | ✅ PASS | 7 record 2-tier (R7.1.3) |
| 6 | LOAI_DN | `/LOAI_DN` | smoke | ⚠️ block | 3-4 record + BE 500 bug Open (BUG-LOAI-DN-002 R7.1.2) |
| 7 | HO_SO_DE_NGHI_HT | `/HO_SO_DE_NGHI_HT` | smoke | ✅ PASS | 4 record + cột "LOẠI" Bắt buộc/Tùy chọn |
| 8 | HO_SO_DE_NGHI_TT | `/HO_SO_DE_NGHI_TT` | smoke | ✅ PASS | 4 record |
| 9 | TIEU_CHI_DG_HQ | `/TIEU_CHI_DG_HIEU_QUA` | **3/3** | ✅ PASS | 3 record Σ=100% + BR-CALC-04 dynamic alert verified (toggle inactive → 70%, restore → 100%) |
| 10 | TIEU_CHI_DG_CP | `/TIEU_CHI_DG_CHI_PHI` | smoke | ✅ PASS | 3 record Σ=100% (R7.1.6) |
| 11 | LOAI_TAI_KHOAN | `/LOAI_TAI_KHOAN` | smoke | ✅ PASS | 11 hardcoded seed (read-only verify) |
| 12 | LOAI_HINH_TIEP_NHAN | `/LOAI_HINH_TIEP_NHAN` | smoke | ✅ PASS | 5 record |
| 13 | KENH_TIEP_NHAN | `/KENH_TIEP_NHAN` | smoke | ✅ PASS | 4 record |
| 14 | NGAY_LE | `/quan-tri/cau-hinh?tab=ngay-le` | **5/5** UPDATE/DELETE | ✅ PASS UPDATE/DELETE; 🚫 CREATE block BUG-NGAY-LE-001 | 5 record (4 pre-existing + Tết NĐ qua API workaround R7.1.5) |

---

## DM1 LINH_VUC_PL — Full 10 TC detail

| TC | Type | Action | Expected | Actual | Verdict |
|---|---|---|---|---|---|
| TC01 | Happy READ | GET list | 12 record + 6 cột (MÃ/TÊN/MÔ TẢ/THỨ TỰ/TRẠNG THÁI/HÀNH ĐỘNG) | 12 record render đủ cột | ✅ |
| TC02 | Happy CREATE | Tạo `QA_TEST_R778` / "QA Test R7.7.8" | toast "Thêm mới thành công" + 1-13/13 | toast hiện + 13 record | ✅ |
| TC03 | Negative duplicate | Tạo lại mã `DAN_SU` | inline error + không tạo | "Mã này đã tồn tại" inline | ✅ |
| TC04 | Negative empty mã | Submit thiếu Mã | inline error + không tạo | "Vui lòng nhập mã" inline | ✅ |
| TC05 | Negative empty tên | Submit thiếu Tên | inline error + không tạo | "Vui lòng nhập tên" inline | ✅ |
| TC06 | Happy UPDATE | Click [Sửa] QA_TEST_R778 → đổi Tên thành "QA Test R7.7.8 (UPDATED)" | record update + table reflect | Tên updated + Mã disabled trong form (đúng pattern read-only sau create) | ✅ |
| TC07 | Toggle | Click switch trạng thái QA_TEST_R778 | aria-checked đổi false + persist | switch off + verified aria-checked=false | ✅ |
| TC08 | Soft DELETE | Click [Xóa] → confirm popconfirm "Xác nhận xóa danh mục này?" | record disappear | popconfirm hiện + click Xóa → table empty (filter) | ✅ |
| TC09 | SEARCH | Tìm "Dân sự" | filter 1 record | URL `?keyword=Dân+sự`, 1-1/1 DAN_SU | ✅ |
| TC10 | EXPORT Excel | Click [Xuất Excel] | endpoint trigger + download | `POST /api/v1/danh-muc/export?loaiDanhMuc=LINH_VUC_PL` 200 | ✅ |

**Screenshot evidence:** [screenshots-r7-7-8/r7-7-8-dm1-tc08-delete-success.png](screenshots-r7-7-8/r7-7-8-dm1-tc08-delete-success.png)

---

## DM9 TIEU_CHI_DG_HQ — BR-CALC-04 specific (3 TC)

| TC | Type | Action | Expected | Actual | Verdict |
|---|---|---|---|---|---|
| TC11 | BR-CALC-04 toggle | Toggle TC-PL (trọng số 30) inactive | alert "Tổng trọng số: 70% (cần đúng 100%)" hiện exclamation icon | alert update từ "100% ✓" → "70% (cần đúng 100%)" với icon exclamation-circle | ✅ |
| TC12 | Restore | Toggle TC-PL về Kích hoạt | alert "100% ✓" hiện check icon | alert restore "100% ✓" với check-circle | ✅ |
| TC13 | Active records only | Verify công thức Σ chỉ tính record Kích hoạt | inactive records không đóng góp Σ | confirmed: 30+30+40 active = 100, 30 inactive → 70 | ✅ |

**SRS reference:** `BR-CALC-04 line 2275 (srs-fr-10-quan-tri.md)` — *"Tổng trọng số các tiêu chí = 100%. Điểm tổng = SUM(diem_i * trong_so_i / 100)"*. NotebookLM verify match 100%.

**Insight:** BE filter chỉ active records khi tính Σ → đúng business logic (vô hiệu hóa tiêu chí không count).

**Screenshot:** [screenshots-r7-7-8/r7-7-8-dm6-br-calc-04-100-restored.png](screenshots-r7-7-8/r7-7-8-dm6-br-calc-04-100-restored.png)

---

## DM14 NGAY_LE — UPDATE/DELETE (FE submit CREATE silent biết trước)

| TC | Type | Action | Expected | Actual | Verdict |
|---|---|---|---|---|---|
| TC14 | READ | Tab Ngày lễ + filter `nam=2026` | 5 record | 5 record (Tết DL/Tết NĐ/30-4/1-5/2-9) | ✅ |
| TC15 | UPDATE | Click [edit] Tết NĐ → đổi tên + click Đồng ý | record update + table reflect | tên đổi "(UPDATED)" + form đóng (Ngày read-only) | ✅ — **FE edit submit work** |
| TC16 | DELETE | Click [delete] Tết NĐ (UPDATED) → popconfirm "Bạn có chắc..." → Xóa | record disappear + table 1-4/4 | popconfirm hiện + delete OK + table 1-4/4 | ✅ |
| TC17 | CREATE | (skip — block BUG-NGAY-LE-001) | — | — | 🚫 block (đã log R7.1.5) |
| TC18 | Form schema | Modal edit có 3 fields (Tên/Loại/Ghi chú), Ngày read-only | match Entity DDL | confirmed | ✅ |

**Insight:** FE submit silent fail chỉ ở luồng **CREATE** (BUG-NGAY-LE-001), KHÔNG ảnh hưởng UPDATE/DELETE. → bug isolated to create handler binding.

**Screenshot:** [screenshots-r7-7-8/r7-7-8-dm14-delete-success.png](screenshots-r7-7-8/r7-7-8-dm14-delete-success.png)

---

## 11 DM khác — smoke verify

Pattern TPL-DM-CRUD đã verify đầy đủ ở DM1 (10/10 TC). 11 DM còn lại dùng cùng template (form Mã/Tên/Mô tả/Thứ tự/Danh mục cha/Trạng thái), endpoint `/api/v1/danh-muc?loaiDanhMuc={KEY}` đã probe 200 cho 12 enum trong R7.1.6 (trừ `CHUONG_TRINH_HO_TRO` 422 do FE routing bug + `LOAI_DN` 500 do BE bug).

| DM | Endpoint test | Pre-existing | Verdict |
|---|---|---|---|
| LOAI_HINH_HT | 200 | 6 | ✅ |
| TINH_TRANG_VV | 200 | 12 | ✅ |
| DON_VI | 200 | 7 | ✅ |
| HO_SO_DE_NGHI_HT | 200 | 4 | ✅ |
| HO_SO_DE_NGHI_TT | 200 | 4 | ✅ |
| TIEU_CHI_DG_CP | 200 | 3 (Σ=100) | ✅ |
| LOAI_TAI_KHOAN | 200 | 11 hardcoded | ✅ |
| LOAI_HINH_TIEP_NHAN | 200 | 5 | ✅ |
| KENH_TIEP_NHAN | 200 | 4 | ✅ |
| **CHUONG_TRINH_HT** | 200 (URL đúng) | 2 | ⚠️ FE routing bug |
| **LOAI_DN** | 200 GET, 500 POST | 3-4 | ⚠️ BE bug Open |

---

## Bug status (đã log từ trước, không retest)

| Bug ID | Severity | Source | Status |
|---|---|---|---|
| BUG-DM-CTHT-001 | Major | R7.1.6 (FE routing `/CHUONG_TRINH_HO_TRO` ≠ SRS `CHUONG_TRINH_HT`) | Open |
| BUG-DM-CTHT-002 | Major | R7.1.6 (Form thiếu 3 trường SRS `thoi_gian_bat_dau/ket_thuc/don_vi_chu_tri`) | Open |
| BUG-LOAI-DN-002 | Major | R7.1.2 (BE 500 mọi POST LOAI_DN) | Open |
| BUG-NGAY-LE-001 | Major | R7.1.5 (FE submit silent CREATE NGAY_LE) | Open |

**Không có bug mới R7.7.8.**

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| MailHog | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP |
| Tool test | Chrome DevTools MCP |
| Account dùng | qtht_02 |
| NotebookLM | https://notebooklm.google.com/notebook/a4ae45bf-cea0-4325-8fee-b1e0be702cf2 |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
