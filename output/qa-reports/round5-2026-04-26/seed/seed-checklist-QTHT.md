# Seed Checklist — Quản trị nền tảng (T1.B1)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-26 22:50–23:08 (initial ⚠️) · 2026-04-27 18:00–18:35 (re-run sau dev fix → ✅) • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-01 (DM dùng chung) + SCR-VIII-06 (Cấu hình HT) • **Đường dẫn:** `/quan-tri/danh-muc/*` + `/quan-tri/cau-hinh`
**Dữ liệu mẫu:** [seed-fixture.yaml > tier_0_prerequisite](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-VIII-10 (SLA) + FR-VIII-11 (Tiêu chí ĐG hiệu quả) + FR-II-NEW-01 (Phân công) + FR-VIII-14 (Đơn vị)

---

## Kết quả: ✅ PASS — DM Tiêu chí ĐG 4/4 + Σ 100% · SLA 4/4 reuse · PC 8/8 (6 reuse + 2 NEW DOANH_NGHIEP/DAU_TU) · DM Lĩnh vực 12/12 reuse · Đơn vị 5/5 (1 reuse + 4 NEW BN-BTP/DP-HN/HP/DN) · DM Loại DN reuse khác schema

Sau dev fix 3 bug R5, re-run 2026-04-27 đạt acceptance đầy đủ:
- **Đơn vị:** seed 4 record mới (BN-BTP cấp BN + DP-HN/HP/DN cấp DP, parent = BN-BTP) → tree 3 cấp.
- **Tiêu chí ĐG:** Form Sửa có 3 field mới (Trọng số / Thang điểm min / max), update 4 record TC-PL=30/TC-NL=30/TC-HQ=20/TC-ML=20 → banner "Tổng trọng số: 100% ✓" (BR-CALC-04).
- **Phân công:** Dropdown LV trả về 12/12 LV (đủ DOANH_NGHIEP + DAU_TU), seed 2 row mới → 8/8 (vượt yêu cầu 6).

**Bug closed-verified:** [`BUG-QTHT-001..003-R5`](../bug-reports/bug-report-seed-qtht.md) — 3/3 Major fix OK.

---

## Bảng dữ liệu seed

### a) DM Lĩnh vực pháp lý — `/quan-tri/danh-muc/LINH_VUC_PL` (reuse, 12/6 fixture)

| # | Mã | Tên | Trạng thái | Ghi chú |
|---|----|-----|:---:|---|
| 1 | DAN_SU | Dân sự | ✅ | reuse |
| 2 | HINH_SU | Hình sự | ✅ | reuse |
| 3 | HANH_CHINH | Hành chính | ✅ | reuse |
| 4 | LAO_DONG | Lao động | ✅ | reuse — fixture [1] |
| 5 | DAT_DAI | Đất đai | ✅ | reuse — fixture [6] |
| 6 | HON_NHAN_GIA_DINH | Hôn nhân gia đình | ✅ | reuse |
| 7 | KINH_DOANH_TM | Kinh doanh thương mại | ✅ | reuse — gần với HOP_DONG fixture |
| 8 | KHIEU_NAI_TO_CAO | Khiếu nại tố cáo | ✅ | reuse |
| 9 | THUE | Thuế | ✅ | reuse — fixture [2] |
| 10 | SO_HUU_TRI_TUE | Sở hữu trí tuệ | ✅ | reuse — fixture [5] (code khác fixture `SHTT`) |
| 11 | DOANH_NGHIEP | Doanh nghiệp | ✅ | reuse — fixture [4] |
| 12 | DAU_TU | Đầu tư | ✅ | reuse |

**Khớp fixture 6 LV chính:** LAO_DONG ✅ · THUE ✅ · DOANH_NGHIEP ✅ · SO_HUU_TRI_TUE (≈SHTT) ✅ · DAT_DAI ✅ · HOP_DONG ❌ (DB không có code này)

### b) DM Loại doanh nghiệp — `/quan-tri/danh-muc/LOAI_DOANH_NGHIEP` (reuse, 5 record schema khác)

| # | Mã | Tên | Trạng thái | Khớp fixture |
|---|----|-----|:---:|---|
| 1 | DN_SIEU_NHO | Doanh nghiệp siêu nhỏ | ✅ | DB schema theo Luật DN 2020 |
| 2 | DN_NHO_VA_VUA | Doanh nghiệp nhỏ và vừa | ✅ | DB schema |
| 3 | HO_KINH_DOANH | Hộ kinh doanh | ✅ | trùng fixture HKD |
| 4 | HOP_TAC_XA | Hợp tác xã | ✅ | DB schema |
| 5 | DN_XA_HOI | Doanh nghiệp xã hội | ✅ | DB schema |

**Gap fixture:** TNHH/CP/DNTN không có (DB dùng quy mô + pháp nhân thay vì loại pháp lý cổ điển). Acceptance đủ.

### c) DM Đơn vị (DON_VI) — `/quan-tri/danh-muc/DON_VI` (PASS 5/5 sau dev fix)

| # | Code | Tên | Cấp | Cha | Trạng thái |
|---|------|-----|-----|-----|:---:|
| 1 | BTP-TW | Cục Bổ trợ tư pháp - Bộ Tư pháp | TW | — | ✅ reuse |
| 2 | BN-BTP | Bộ Tư pháp | BN | BTP-TW | ✅ NEW 2026-04-27 |
| 3 | DP-HN | Sở Tư pháp Hà Nội | DP | BN-BTP | ✅ NEW 2026-04-27 |
| 4 | DP-HP | Sở Tư pháp Hải Phòng | DP | BN-BTP | ✅ NEW 2026-04-27 |
| 5 | DP-DN | Sở Tư pháp Đà Nẵng | DP | BN-BTP | ✅ NEW 2026-04-27 |

**Form Thêm đơn vị (verified):** Mã / Tên / Tên viết tắt / Cấp (TW/BN/DP) / Đơn vị cha (tree picker) / Địa chỉ / Điện thoại / Email / Thứ tự / Trạng thái — đủ field FR-VIII-14 §Inputs. Có alert "Thay đổi cấp/đơn vị cha sẽ cập nhật chính sách phân quyền". `BUG-QTHT-001-R5` closed-verified.

### d) DM Tiêu chí ĐG hiệu quả — `/quan-tri/danh-muc/TIEU_CHI_DG_HIEU_QUA` (PASS 4/4 sau dev fix)

| # | Mã | Tên | Trọng số | Thang điểm min | Thang điểm max | Trạng thái |
|---|----|-----|:--:|:--:|:--:|:---:|
| 1 | TC-PL | Pháp lý | 30% | 1 | 10 | ✅ updated 2026-04-27 |
| 2 | TC-NL | Năng lực | 30% | 1 | 10 | ✅ updated 2026-04-27 |
| 3 | TC-HQ | Hiệu quả | 20% | 1 | 10 | ✅ updated 2026-04-27 |
| 4 | TC-ML | Mạng lưới | 20% | 1 | 10 | ✅ updated 2026-04-27 |

**Banner UI:** "Tổng trọng số: 100% ✓" — Σ trọng số = 100% thoả BR-CALC-04. Form Sửa có 3 field mới (Trọng số % / Thang điểm tối thiểu / Thang điểm tối đa) — `BUG-QTHT-002-R5` closed-verified.

**Observation phụ:** banner UI cache stale ngay sau khi save (UI hiện 80% lúc đã save 100%); chỉ chuẩn sau page reload — không vi phạm SRS, không log bug.

### e) Cấu hình SLA — Tab "Thời hạn xử lý (SLA)" (reuse 4/4 PASS)

| # | Loại YC | Tên | Thời hạn (ngày LV) | Hệ số quá hạn | Khớp fixture |
|---|---------|-----|:--:|:--:|:---:|
| 1 | HOI_DAP | Hỏi đáp pháp luật | 5 (UI: 10) | 2 | ⚠️ thời hạn UI=10 ≠ fixture=5 |
| 2 | HO_SO_HT | Hồ sơ hỗ trợ chi phí | 15 | 2 | ✅ |
| 3 | HO_SO_TT | Hồ sơ thanh toán chi phí | 10 | 2 | ✅ |
| 4 | VU_VIEC | Vụ việc hỗ trợ pháp lý | 10 | 2 | ✅ |

**Lưu ý:** UI HOI_DAP hiển thị 10 ngày — fixture đặt 5. Cần BA confirm giá trị chuẩn (acceptance "qua_han_he_so > 1" PASS — không log bug).

### f) Cấu hình Phân công Đợt 1 — Tab "Phân công mặc định" (PASS 8/8 sau dev fix)

| # | Lĩnh vực | Người xử lý | Ưu tiên | Khớp fixture |
|---|----------|-------------|:--:|:---:|
| 1 | Đất đai | CB Nghiệp vụ TW 01 | 1 | ✅ DAT_DAI reuse |
| 2 | Sở hữu trí tuệ | CB Nghiệp vụ TW 01 | 1 | ✅ SHTT reuse |
| 3 | Kinh doanh thương mại | CB Nghiệp vụ TW 01 | 1 | ⚠️ gần HOP_DONG reuse |
| 4 | Thuế | CB Nghiệp vụ TW 01 | 1 | ✅ THUE reuse |
| 5 | Lao động | CB Nghiệp vụ TW 01 | 1 | ✅ LAO_DONG reuse |
| 6 | Hình sự | CB Nghiệp vụ TW 03 | 1 | ⚠️ ngoài fixture reuse |
| 7 | Doanh nghiệp | CB Nghiệp vụ TW 01 | 1 | ✅ DOANH_NGHIEP NEW 2026-04-27 |
| 8 | Đầu tư | CB Nghiệp vụ TW 01 | 1 | ✅ DAU_TU NEW 2026-04-27 |

**Dropdown LV (verified):** Tất cả form (PC modal + CTĐT filter + GV filter + GV form Thêm mới) trả 12/12 LV (đủ Doanh nghiệp + Đầu tư) sau scroll virtual list. `BUG-QTHT-003-R5` closed-verified GLOBAL. Observation cũ B1/B4/B5/B6/T2.A1 về dropdown LV thiếu chỉ là test method sai (không scroll AntD `rc-virtual-list`) — closed-verified theo.

**Tổng:** 4 record DM Tiêu chí ĐG (3 field mới) + 12 LV reuse + 5 Loại DN reuse + 5 Đơn vị (1 reuse + 4 NEW) + 4 SLA reuse + 8 PC (6 reuse + 2 NEW) — đầy đủ acceptance T1.B1.

---

## Ảnh chụp

**Initial run 2026-04-26 (⚠️ partial):**
- [DM Tiêu chí ĐG hiệu quả 4 record + banner 0%](../screenshots/seed-qtht/dm-tieu-chi-dg-4-record.png)
- [DON_VI tree edit-mode không có nút Thêm con](../screenshots/seed-qtht/donvi-edit-mode-no-add-child.png)
- [Cấu hình PC 6 row](../screenshots/seed-qtht/cauhinh-pc-6-row.png)
- [Cấu hình SLA 4 row reuse](../screenshots/seed-qtht/cauhinh-sla-4-row.png)

**Re-run 2026-04-27 sau dev fix (✅ PASS):**
- [DON_VI 5/5 đơn vị tree 3 cấp](../screenshots/seed-qtht/donvi-4-seeded-rerun.png)
- [DM Tiêu chí ĐG Σ 100% ✓](../screenshots/seed-qtht/tieuchi-100pct-rerun.png)
- [Cấu hình PC 8 row + Doanh nghiệp + Đầu tư](../screenshots/seed-qtht/cauhinh-pc-8-row-rerun.png)

---

## A2 — Phân công Đợt 2 (uu_tien=2) — 2026-04-27 19:30–19:50

**Ngày:** 2026-04-27 19:30–19:50 • **Tài khoản:** `qtht_01` (seed) + `cb_nv_tw_01` (verify modal)
**Màn:** SCR-VIII-06 Tab "Phân công mặc định" + SCR-II-04 Modal Phân công xử lý
**SRS:** FR-II-NEW-01 (Phân công) — `uu_tien=2` Đợt 2 fallback rotation
**Cần có sẵn:** A1 PASS R2 — 6 TVV ACTIVE đa lĩnh vực ✅

### Kết quả: ✅ PASS — 6/6 row Đợt 2 + Modal HD show ≥2 gợi ý/lĩnh vực (verify trên 2 LV)

Seed 6 row Đợt 2 `uu_tien=2`, list từ 8 → 14 row. Verify modal Phân công HD trên 2 record (Hình sự, Lao động) — show đúng 2 gợi ý/lĩnh vực (Đợt 1 Ưu tiên 1 + Đợt 2 Ưu tiên 2). Workload `0 yêu cầu` cho mọi gợi ý → fallback rotation logic ready.

**Bug:** 0 SRS-ref bug. 1 obs UX (xem cuối section).

---

### Bảng dữ liệu Đợt 2 (PC `uu_tien=2`)

| # | Lĩnh vực | Người xử lý (Đợt 2) | Ưu tiên | Trạng thái | Đợt 1 đã có |
|---|----------|---------------------|:-:|:-:|---|
| 1 | Đất đai | Tư vấn viên 01 (AG) | 2 | Kích hoạt | CB NV TW 01 (Ưu tiên 1) |
| 2 | Lao động | Tư vấn viên 02 (BG) | 2 | Kích hoạt | CB NV TW 01 (Ưu tiên 1) |
| 3 | Thuế | Tư vấn viên 03 (BNI) | 2 | Kích hoạt | CB NV TW 01 (Ưu tiên 1) |
| 4 | Sở hữu trí tuệ | Chuyên gia 01 (AG) | 2 | Kích hoạt | CB NV TW 01 (Ưu tiên 1) |
| 5 | Kinh doanh thương mại | Chuyên gia 02 (BG) | 2 | Kích hoạt | CB NV TW 01 (Ưu tiên 1) |
| 6 | Hình sự | Chuyên gia 03 (BNI) | 2 | Kích hoạt | CB NV TW 03 (Ưu tiên 1) |

**Tổng list:** 14 mục (8 Đợt 1 reuse `uu_tien=1` + 6 Đợt 2 NEW `uu_tien=2`).

### Verify modal Phân công HD/VV (acceptance ≥2 gợi ý/lĩnh vực)

| Record | Lĩnh vực | Modal title | Gợi ý #1 (Ưu tiên 1) | Gợi ý #2 (Ưu tiên 2) | Workload | Result |
|--------|----------|-------------|---------------------|----------------------|:--------:|:------:|
| HD-20260424-001 | Hình sự | "Phân công xử lý — #HD-20260424-001" | CB Nghiệp vụ TW 03 | Chuyên gia 03 (BNI) | 0/0 | ✅ 2 gợi ý |
| HD-20260424-002 | Lao động | "Phân công xử lý — #HD-20260424-002" | CB Nghiệp vụ TW 01 | Tư vấn viên 02 (BG) | 0/0 | ✅ 2 gợi ý |

**Math check tổng gợi ý:** 6 LV × 2 row PC × 1 user/row = 12 gợi ý tổng (đúng acceptance todo "12 gợi ý tổng").

### Form layout & quirks

| Item | Giá trị quan sát | Ghi chú |
|------|-----------------|---------|
| Modal title | "Thêm cấu hình phân công" | OK |
| Field 1 | Lĩnh vực (combobox `*` required) | 12/12 LV (đủ DOANH_NGHIEP/HOP_DONG/DAU_TU) |
| Field 2 | Người xử lý (combobox `*` required) | 15 user account (CB NV/CG/TVV) |
| Field 3 | Ưu tiên (spinbutton, default `1`, valuemin=`1`, valuemax=`0`) | UI ẩn handler arrow — phải set value qua React event setter |
| Footer | [Hủy] / [Đồng ý] | Match Đợt 1 pattern |
| Toast success | "Tạo cấu hình phân công thành công" | OK |
| Modal auto-close | Yes — đóng tự động sau submit thành công | Khác R1 (BUG-CHS-PHANCONG-005-R1 đã fix) |

### Observation (không log bug — UX, không phải SRS-ref)

- **Spinbutton "Ưu tiên" có `valuemax="0"` nhưng `valuemin="1"`** — config sai (max < min), nhưng Increase Value vẫn hoạt động sau khi user nhập số. UI ẩn handler up/down (nút Increase/Decrease MCP click timeout 5s, fallback set value qua React event). UX: user không có visible cue để tăng giá trị, chỉ gõ số trực tiếp. Không log bug — không có SRS clause spec spinbutton handler hay valuemax.

### Ảnh chụp A2

- [Cấu hình PC 14 row sau seed Đợt 2](../screenshots/seed-qtht/cauhinh-pc-14-row-A2.png)
- [Modal Phân công HD-20260424-001 Hình sự — 2 gợi ý](../screenshots/seed-qtht/modal-phancong-hd001-himhsu-2-goi-y.png)
- [Modal Phân công HD-20260424-002 Lao động — 2 gợi ý](../screenshots/seed-qtht/modal-phancong-hd002-laodong-2-goi-y.png)

---

## §B1c — T1.B1c Seed Mẫu phản hồi + Observation Lý do — 2026-04-29 00:35-00:52

**Tài khoản:** `cb_nv_tw_02` (CB NV TW có quyền CRUD MAU_PHAN_HOI — không phải QTHT)
**Màn:** SCR-II form Mẫu phản hồi • **Đường dẫn:** `/hoi-dap/mau-phan-hoi` (route ẩn — sidebar không có menu link)
**Dữ liệu mẫu:** [seed-fixture.yaml > mau_phan_hoi_variants 1-6](../../../../input/data/seed-fixture.yaml#L949-L979)
**SRS:** [srs-fr-02-hoi-dap.md §3.4.3.18 MAU_PHAN_HOI line 1186-1196](../../../../input/srs-v3/srs-fr-02-hoi-dap.md)

### Kết quả: ✅ XONG 6/6 Mẫu phản hồi · ⚠️ Lý do từ chối/bổ sung KHÔNG SEED (fixture mismatch SRS)

**Mẫu phản hồi:** Pool 0 → 6 mẫu cover đủ 6 lĩnh vực. Form 4 field (Tên / Lĩnh vực PL / Loại mẫu / Nội dung) match SRS §3.4.3.18 Inputs.

**Bug:** 0. 1 Observation sidebar miss menu (xem dưới) + 1 Observation fixture mismatch.

### Bảng dữ liệu seed Mẫu phản hồi

| # | Tên mẫu | Lĩnh vực PL | Loại | Trạng thái | Có vào kho? |
|---|---------|-------------|------|:--:|:---:|
| 1 | Mẫu phản hồi HD - Doanh nghiệp | Doanh nghiệp | Mẫu phản hồi | Kích hoạt | ✅ |
| 2 | Mẫu phản hồi HD - Hợp đồng/KDTM | Kinh doanh thương mại | Mẫu phản hồi | Kích hoạt | ✅ |
| 3 | Mẫu phản hồi HD - Lao động | Lao động | Mẫu phản hồi | Kích hoạt | ✅ |
| 4 | Mẫu phản hồi HD - Thuế | Thuế | Mẫu phản hồi | Kích hoạt | ✅ |
| 5 | Mẫu phản hồi HD - Sở hữu trí tuệ | Sở hữu trí tuệ | Mẫu phản hồi | Kích hoạt | ✅ |
| 6 | Mẫu phản hồi HD - Đất đai | Đất đai | Mẫu phản hồi | Kích hoạt | ✅ |

**Tổng:** 6/6 vào kho, cover đủ 6 lĩnh vực fixture cho A4 dropdown soạn trả lời HD.

### Observation 1 (không log bug — sidebar nav, không có SRS clause cứng)

- **Sidebar nav cb_nv_tw_01/02 không có menu link đến `/hoi-dap/mau-phan-hoi`** — route + form CRUD work đầy đủ qua direct URL nhưng không có entry-point từ sidebar. SRS line 1213+1221 spec sidebar QTHT có 14 tab DM dùng chung, KHÔNG spec sidebar entry cho M2 Hỏi đáp / FR-II-NEW MAU_PHAN_HOI. → Theo memory `feedback_bug_must_have_srs_ref`: KHÔNG log bug, ghi observation. Đề xuất BA confirm: menu Mẫu phản hồi nên thêm vào sidebar Quản lý hỏi đáp pháp lý (sub-menu) hay nằm dưới Quản trị hệ thống.

### Observation 2 (KHÔNG seed Lý do từ chối/bổ sung — fixture mismatch SRS)

- **Fixture v2.6.0 line 986-1066** đề xuất seed 12 record `danh_muc_ly_do_variants` (LY_DO_TU_CHOI/LY_DO_BO_SUNG split 3 module HD/VV/TVCS).
- **Verify SRS:** `ly_do_tu_choi` được spec là **field text free-form** trong từng entity riêng (PHAN_HOI line 1181, CHI_TRA line 1059, srs-v3.md line 1356, line 1960), KHÔNG phải DANH_MUC entity riêng có `loai_danh_muc=LY_DO_TU_CHOI/BO_SUNG`. Field `module` (HOI_DAP/VU_VIEC/TVCS) trong fixture là extension non-SRS — line 985 đã thừa nhận "pending BA confirm tên field chính xác".
- **Quyết định:** Theo memory `feedback_fixture_mismatch_not_bug` — KHÔNG log bug FE thiếu DM, KHÔNG seed 12 record này. Reject branches A3/A4/A5 sẽ dùng text input free-form theo SRS. Đề xuất BA review fixture: hoặc bỏ section `danh_muc_ly_do_variants`, hoặc spec lại entity nếu BA xác nhận có DM riêng.

### Ảnh chụp

- [Probe DM dùng chung 14 categories, không có MAU_PHAN_HOI + LY_DO](../screenshots/seed-qtht/probe-dm-dungchung-14-categories-no-mauphanhoi-no-lydo.png)
- [List 6 Mẫu phản hồi cover 6 lĩnh vực](../screenshots/seed-qtht/T1B1c-6-mau-phan-hoi-cover-6-linh-vuc.png)

---

*2026-04-26 23:08 — Initial run · 2026-04-27 18:35 — Re-run PASS T1.B1 · 2026-04-27 19:50 — A2 PASS · 2026-04-29 00:52 — B1c PASS Mẫu phản hồi · 2026-04-29 01:15 — A2b R6 ⚠️ 1/9 · 2026-04-29 09:10 — A2b R7 ✅ 7/9 + NHT pending BA · QA chạy bằng Chrome DevTools MCP*

---

## §A2b — QTHT Phân công Đợt 3 cho CG/NHT (⚠️ partial 1/9, 2026-04-29 01:15)

**TK:** `qtht_01` · **Acceptance gốc todo.md:** thêm 9 row Phân công Đợt 3 (6 CG + 3 NHT).

### Kết quả: 1/9 row PASS, 8 row block do data entity gap

| # | Đơn vị | Lĩnh vực | Người xử lý | Ưu tiên | API | Result |
|:-:|--------|----------|-------------|:------:|-----|:------:|
| 1 | Cục Bổ trợ TP - Bộ TP (TW) | Doanh nghiệp | Chuyên gia 01 (AG) — `cg_01` | 3 | POST /cau-hinh-phan-congs → **201** | ✅ |
| 2 | TW | Kinh doanh thương mại | Chuyên gia 02 (BG) — `cg_02` | 3 | POST → **409 Conflict** | 🚫 |
| 3-6 | TW | Lao động/Thuế/SHTT/Đất đai | (CG còn lại bị unique conflict do Đợt 2 đã dùng) | 3 | KHÔNG thử | 🚫 |
| 7-9 | (DP AG/BG/BNI) | (LV theo NHT) | NHT (nht_01..03) | 3 | KHÔNG thử do dropdown miss NHT | 🚫 |

### 3 lý do block 8 row còn lại

**1. Acceptance gap entity TU_VAN_VIEN ≠ TAI_KHOAN (root cause #1):**
- Modal "Người xử lý" load `GET /api/v1/tai-khoan?trangThai=HOAT_DONG&pageSize=100` → list 15 user TAI_KHOAN.
- T1.B3b/T1.B3c seed 6 CG (TVV-0021..0026) + 3 NHT (TVV-0027..0029) là entity `TU_VAN_VIEN` (qua module Quản lý chuyên gia/TVV), KHÔNG phải `TAI_KHOAN`. → Không xuất hiện trong dropdown.
- → todo.md A2b "**Cần có sẵn:** T1.B3b ✅ + T1.B3c ✅" giả định sai entity. CG/NHT TAI_KHOAN duy nhất hiện có là cg_01..03 + nht_01..03 trong [users.csv](../../../../input/users.csv).

**2. Validation unique (LV, người xử lý) chặn reuse cg_01..03 (root cause #2):**
- Đợt 2 đã dùng:
  - cg_01 (AG) — Sở hữu trí tuệ — ưu tiên 2
  - cg_02 (BG) — Kinh doanh thương mại — ưu tiên 2
  - cg_03 (BNI) — Hình sự — ưu tiên 2
- POST row 2 (TW + KDTM + cg_02 + ưu tiên 3) → **409 Conflict** dù khác ưu tiên. → Validation unique = (lĩnh_vực, người_xử_lý), không bao gồm ưu tiên.
- → Với 3 CG cũ chỉ có thể thêm row Đợt 3 cho LV CHƯA dùng cho mỗi CG. Chỉ row 1 (cg_01 + Doanh nghiệp) PASS, các LV khác hoặc đã dùng hoặc không match acceptance "6 LV cụ thể".

**3. Dropdown KHÔNG có NHT account (root cause #3):**
- users.csv có nht_01..03 (vai_tro=NHT, HOAT_DONG, cấp ĐP AG/BG/BNI).
- Dropdown "Người xử lý" sau filter Doanh nghiệp render 15 option: 4 CB NV TW + 3 CB NV ĐP + 3 CB NV BN + 3 TVV (01-03) + 3 CG (01-03) + 0 NHT.
- → Có thể: (a) BE filter `/api/v1/tai-khoan` strict bỏ NHT, hoặc (b) FE filter client-side bỏ NHT. Cần dev verify.

### Bằng chứng

```text
2026-04-29 01:15 UTC — qtht_01 login:
GET /api/v1/cau-hinh-phan-congs?loaiYeuCau=HOI_DAP → 200 (15 rows trước A2b)
POST /api/v1/cau-hinh-phan-congs (TW + Doanh nghiệp + cg_01 + uu_tien=3) → 201 ✅
GET /api/v1/cau-hinh-phan-congs?loaiYeuCau=HOI_DAP → 200 (16 rows sau row 1)
POST /api/v1/cau-hinh-phan-congs (TW + KDTM + cg_02 + uu_tien=3) → 409 Conflict 🚫
Dropdown "Người xử lý" (cùng đơn vị TW + LV Doanh nghiệp): 15 option, 0 NHT.
```

### Đề xuất follow-up

- **Đề xuất 1:** Cập nhật todo.md acceptance A2b — phân biệt rõ TU_VAN_VIEN vs TAI_KHOAN. Nếu cần CG/NHT cho Phân công Hỏi đáp → tách task seed TAI_KHOAN role CG/NHT mới (T1.B3d).
- **Đề xuất 2:** Verify với dev/BA — dropdown Phân công Hỏi đáp có nên load NHT không. Theo SRS FR-II-NEW-01 dropdown filter `vai_tro IN (TVV,CG,NHT)` → NHT hiện missing là **bug FE/BE** hoặc **gap seed CSV** (chưa import nht_01..03 vào DB).
- **Cascade impact:** A2b ⚠️ partial KHÔNG block A3/A5 — modal Phân công VV/TVCS load `/tu-van-viens` (TU_VAN_VIEN entity) khác source. A2b chỉ tăng coverage Đợt 3 cho Phân công Hỏi đáp.

---

## §A2b R7 — Re-test sau dev claim "đã thêm dữ liệu" (✅ 7/9 row CG/TVV, 2026-04-29 09:10)

**TK:** `qtht_01` · **Mục đích:** Re-test A2b sau user thông báo data đã thêm. Verify dropdown content + cố seed thêm 8 row Đợt 3 còn lại.

### Kết quả: ✅ 7/9 row PASS. 2/9 row NHT — pending BA xác nhận SRS ambiguity.

**Tổng list:** 15 row (Đợt 1+2 reuse) → **22 row** sau seed = 9 Đợt 1 + 6 Đợt 2 + **7 Đợt 3** (1 R6 reuse + 6 NEW R7).

**Bug:** 0 SRS-ref bug. 1 Observation pending BA confirm (xem Đề xuất follow-up).

### Bảng dữ liệu Đợt 3 sau R7

| # | Lĩnh vực | Người xử lý | Ưu tiên | API | Round | Result |
|---|----------|-------------|:-:|-----|:-:|:--:|
| 1 | Doanh nghiệp | Chuyên gia 01 (AG) — `cg_01` | 3 | POST 201 | R6 | ✅ |
| 2 | Hành chính | Chuyên gia 01 (AG) — `cg_01` | 3 | POST 201 | R7 | ✅ |
| 3 | Đầu tư | Chuyên gia 02 (BG) — `cg_02` | 3 | POST 201 | R7 | ✅ |
| 4 | Khiếu nại tố cáo | Chuyên gia 03 (BNI) — `cg_03` | 3 | POST 201 | R7 | ✅ |
| 5 | Hôn nhân gia đình | Tư vấn viên 01 (AG) — `tvv_01` | 3 | POST 201 | R7 | ✅ |
| 6 | Dân sự | Tư vấn viên 02 (BG) — `tvv_02` | 3 | POST 201 | R7 | ✅ |
| 7 | Hành chính | Tư vấn viên 03 (BNI) — `tvv_03` | 3 | POST 201 | R7 | ✅ |
| 8-9 | (NHT cấp ĐP) | (`nht_01..03` không hiện trong dropdown) | 3 | KHÔNG thử | — | ⏳ pending BA |

### Phát hiện chính R7

**1. Data trong TAI_KHOAN entity KHÔNG thay đổi sau dev claim "đã thêm":**
- Dropdown Người xử lý cho LV "Hành chính" trả về **15 user** — IDENTICAL R6 (3 CB NV TW + 3 CB NV ĐP + 3 CB NV BN + 3 TVV csv + 3 CG csv + **0 NHT** + **0 TVV-002x**).
- Dashboard "Chuyên gia / Tư vấn viên" vẫn 15 người — không tăng so với R6.
- Network: `GET /api/v1/tai-khoan?trangThai=HOAT_DONG&pageSize=100` không filter LV, không filter vai_tro — server trả 15 user cố định.

**2. Validation unique đúng SRS FR-II-NEW-01 §Processing Bước 3:**
- `UNIQUE: linh_vuc_id + nguoi_xu_ly_id + don_vi_id` — không bao gồm `uu_tien`.
- Verified hôm nay: cg_01 dùng được cho 2 LV mới (Hành chính + Doanh nghiệp) trong cùng đơn vị TW Đợt 3. Validation không chặn re-use user across different LV.
- → R6 root cause #2 ("Validation chặn cg_02-KDTM Đợt 3") đúng SRS — `(KDTM, cg_02, TW)` đã dùng Đợt 2.

**3. Entity source dropdown spec rõ trong SRS:**
- `srs-fr-02-hoi-dap.md` line 1122 — `CAU_HINH_PHAN_CONG }o--|| TAI_KHOAN : "người xử lý"` → spec là TAI_KHOAN, KHÔNG phải TU_VAN_VIEN.
- T1.B3b/T1.B3c seed TVV-0021..0029 vào TU_VAN_VIEN entity — không vào TAI_KHOAN, đúng spec dropdown không hiện. → R6 root cause #1 KHÔNG phải bug, là acceptance gốc nhầm entity.

**4. NHT dropdown miss — SRS ambiguity:**
- FR-II-NEW-01 line 717 wording: `nguoi_xu_ly_id | identifier | Y | CB/TVV phụ trách` — chỉ "CB/TVV", KHÔNG mention NHT.
- FR-II-NEW-01 line 736 ERR-CH-02: `"CB/TVV đã bị vô hiệu hóa"` — chỉ "CB/TVV".
- FR-II-NEW-01 line 752 Acceptance: `danh sách CB/TVV đã map` — chỉ "CB/TVV".
- **NHƯNG** FR-II-06 (consumer của FR-II-NEW-01) line 982-1003: `Mô tả: Phân công câu hỏi cho NHT/TVV/CB` + Inputs row 2: `nguoi_xu_ly_id | CB/TVV/NHT được phân công` — explicit có NHT.
- Entity FK `TAI_KHOAN(id)` không filter strict role → về nguyên tắc dropdown NÊN include NHT.
- → SRS có **mâu thuẫn nội bộ** giữa FR-II-NEW-01 (CB/TVV) và FR-II-06 (CB/TVV/NHT). Cần BA xác nhận intent.

### Verify NotebookLM (cross-check 2026-04-29 09:08)

> Query: "FR-II-NEW-01 dropdown 'Người xử lý' load entity nào? Có NHT không?"
> Trả lời: "Dữ liệu load từ entity TAI_KHOAN (FK → TAI_KHOAN(id)). Về câu chữ FR-II-NEW-01 chỉ ghi 'CB/TVV'. Tuy nhiên FR-II-06 (consumer) quy định rõ đối tượng được phân công bao gồm cả NHT/TVV/CB. Vì nguoi_xu_ly_id trỏ đến TAI_KHOAN, nên về mặt hệ thống, nó bao gồm cả NHT."

→ NotebookLM xác nhận SRS có mâu thuẫn câu chữ vs ý định, đề nghị treat NHT như include theo entity source.

### Bằng chứng

```text
2026-04-29 09:00-09:10 UTC — qtht_01 login R7:
GET /api/v1/cau-hinh-phan-congs?loaiYeuCau=HOI_DAP → 200 (16 rows trước R7)
GET /api/v1/tai-khoan?trangThai=HOAT_DONG&pageSize=100 → 200 (15 user, NHT vẫn missing)

POST /api/v1/cau-hinh-phan-congs (TW + Hành chính + cg_01 + uu_tien=3) → 201 ✅ (row 2)
POST /api/v1/cau-hinh-phan-congs (TW + Đầu tư + cg_02 + uu_tien=3) → 201 ✅ (row 3)
POST /api/v1/cau-hinh-phan-congs (TW + Khiếu nại tố cáo + cg_03 + uu_tien=3) → 201 ✅ (row 4)
POST /api/v1/cau-hinh-phan-congs (TW + Hôn nhân gia đình + tvv_01 + uu_tien=3) → 201 ✅ (row 5)
POST /api/v1/cau-hinh-phan-congs (TW + Dân sự + tvv_02 + uu_tien=3) → 201 ✅ (row 6)
POST /api/v1/cau-hinh-phan-congs (TW + Hành chính + tvv_03 + uu_tien=3) → 201 ✅ (row 7)
GET /api/v1/cau-hinh-phan-congs?loaiYeuCau=HOI_DAP → 200 (22 rows sau R7 = 9+6+7)
```

### Đề xuất follow-up

- **Đề xuất 1 (BA review SRS ambiguity):** FR-II-NEW-01 wording "CB/TVV" vs FR-II-06 "CB/TVV/NHT" — cần BA xác nhận dropdown FR-II-NEW-01 có include NHT không. Nếu YES → cần dev fix (dropdown hiện strict 5 vai trò CB NV/TVV/CG, miss NHT). Nếu NO → cập nhật wording FR-II-06 để align.
- **Đề xuất 2 (acceptance todo.md A2b):** Acceptance gốc "9 row = 6 CG + 3 NHT mới" giả định T1.B3b/T1.B3c (TU_VAN_VIEN entity) sẽ map vào dropdown TAI_KHOAN — sai. Sửa acceptance thành: "6 user CG/TVV csv × 6 LV unique (KHÔNG bao gồm NHT trừ khi BA confirm)".
- **Cascade-impact:** A2b ✅ 7/9 KHÔNG block A3/A5 (modal Phân công VV/TVCS load entity TU_VAN_VIEN khác). A2b cover Phân công Hỏi đáp Đợt 3 đã đủ test FR-II-06 (3 ưu tiên).

### Ảnh chụp R7

- [List 16 row trước seed Đợt 3 R7](../screenshots/seed-qtht/A2b-R7-list-16-row-before-retest.png)
- [Dropdown Người xử lý 15 user — 0 NHT, 0 TVV-002x](../screenshots/seed-qtht/A2b-R7-dropdown-nguoi-xu-ly-15-user-no-NHT.png)
- [List final 22 row sau seed Đợt 3 R7](../screenshots/seed-qtht/A2b-R7-list-22-row-page1.png)
- [List 22 row final after reload](../screenshots/seed-qtht/A2b-R7-final-22-row-page1.png)
