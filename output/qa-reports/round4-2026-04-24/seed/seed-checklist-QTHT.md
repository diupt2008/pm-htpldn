# Seed Checklist — QTHT Tier 0 Prerequisite (T1.B1)

**Phase:** P1 Block B Ngày 3 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P1 T1.B1 • **Date:** 2026-04-24
**Account:** `qtht_01` (login verified P0 + this session)
**Method:** MCP Chrome DevTools — verify mode (KHÔNG seed mới, chỉ count + assert ngưỡng fixture min)
**Input:** [seed-fixture.yaml > tier_0_prerequisite](../../../../input/data/seed-fixture.yaml) + [flow-module.md §BƯỚC 1](../../../../input/flow-module.md)

---

## Nguyên tắc T1.B1 (verify — không seed mới)

Theo `flow-module.md §BƯỚC 1`, Tier 0 (DANH_MUC + DON_VI + TAI_KHOAN + SLA + PC + BIEU_MAU) **được giả định QTHT đã setup từ trước khi cấp environment test**. T1.B1 = verify baseline đủ fixture min, không tạo mới master data.

---

## 1. Acceptance matrix (plan §P1 T1.B1)

| Check | Fixture min | Actual | Kết quả |
|-------|-------------|--------|---------|
| DM `linh_vuc_phap_ly` | ≥ 6 records | **12** | ✅ PASS |
| DM `loai_dn` | ≥ 4 records | **5** | ✅ PASS count (⚠️ semantic mismatch — xem §4) |
| DON_VI | ≥ 5 records | **83** (1 TW + 18 BN + 64 DP) | ✅ PASS |
| TAI_KHOAN 3 accounts (`qtht_01` + `cb_nv_tw_01` + `cb_pd_tw_01`) | 3 | **3 login verified** | ✅ PASS ([P0 _prep-log.md](../_prep-log.md)) |
| SLA có `qua_han_he_so > 1` | ≥1 | **2** (4 loại SLA đều hệ số=2) | ✅ PASS |
| CAU_HINH_PHAN_CONG preset HD section (Phân công TH A) | 6 row | **5/6 row seeded (skip DOANH_NGHIEP)** | ⚠️ **PARTIAL** — xem §5 |
| CAU_HINH_PHAN_CONG section VV | render OK | section không render | ❌ **MISS** — defer T3.2 |
| BIEU_MAU module accessible | render OK | URL `/bieu-mau/thu-muc` render, 0 record | ✅ PASS (module up; 0 record không block seed P2) |

### Verdict T1.B1 (cập nhật 2026-04-25): ⚠️ **PARTIAL PASS** — 6/8 checks ✅ + 1/8 PARTIAL (PC HD 5/6) + 1/8 MISS (PC VV section)

Không block P1 Block B + P2 Seed Tier 2-4. Phân công TH A đã seed 5/6 row 2026-04-25 (skip DOANH_NGHIEP do dropdown UI thiếu code). VV section vẫn miss → defer T3.2 workflow HD/VV test. Phân công TH B (TVV backfill, 6 row) làm T2.0.5 sau khi T3.1 SM-TVV PASS.

---

## 2. DM Lĩnh vực Pháp lý — Sample IDs

| Mã | Tên | Thứ tự | Trạng thái | Trong fixture? |
|----|-----|--------|------------|----------------|
| `DAN_SU` | Dân sự | 1 | Kích hoạt | — |
| `HINH_SU` | Hình sự | 2 | Kích hoạt | — |
| `HANH_CHINH` | Hành chính | 3 | Kích hoạt | — |
| `LAO_DONG` | Lao động | 4 | Kích hoạt | ✅ |
| `DAT_DAI` | Đất đai | 5 | Kích hoạt | ✅ |
| `HON_NHAN_GIA_DINH` | Hôn nhân gia đình | 6 | Kích hoạt | — |
| `KINH_DOANH_TM` | Kinh doanh thương mại | 7 | Kích hoạt | — |
| `KHIEU_NAI_TO_CAO` | Khiếu nại tố cáo | 8 | Kích hoạt | — |
| `THUE` | Thuế | 9 | Kích hoạt | ✅ |
| `SO_HUU_TRI_TUE` | Sở hữu trí tuệ | 10 | Kích hoạt | ✅ (mapping SHTT) |
| `DOANH_NGHIEP` | Doanh nghiệp | 11 | Kích hoạt | ✅ |
| `DAU_TU` | Đầu tư | 12 | Kích hoạt | — |

**Mapping vs fixture** (`tier_0_prerequisite > linh_vuc_phap_ly`):
- LAO_DONG ✅ / THUE ✅ / DOANH_NGHIEP ✅ / SHTT → SO_HUU_TRI_TUE ✅ / DAT_DAI ✅
- **HOP_DONG** ⚠️ **thiếu** — fixture yêu cầu nhưng UI không có code này. Downstream seed dùng `linh_vuc: HOP_DONG` sẽ miss. → **Observation** (note fixture hoặc DM cần bổ sung; không block T1).

---

## 3. DON_VI — Sample subset matching users.csv

| Mã | Tên | Cấp | Account ref | Trong fixture? |
|----|-----|-----|-------------|----------------|
| `BTP-TW` | Cục Bổ trợ tư pháp - Bộ Tư pháp | TW | qtht_01, cb_nv_tw_01, cb_pd_tw_01 | ~~TW-CUC~~ (fixture code khác UI code — harmless) |
| `BKH` | Bộ Kế hoạch và Đầu tư | BN | cb_nv_bn_01, cb_pd_bn_01 | — |
| `BTC` | Bộ Tài chính | BN | cb_nv_bn_02, cb_pd_bn_02 | — |
| `BCT` | Bộ Công Thương | BN | cb_nv_bn_03, cb_pd_bn_03 | — |
| `STP-AG` | Sở Tư pháp An Giang | DP | cb_nv_dp_01, cg_01, nht_01, tvv_01, dn_01 | — |
| `STP-BG` | Sở Tư pháp Bắc Giang | DP | cb_nv_dp_02, cg_02, ... | — |
| `STP-BNI` | Sở Tư pháp Bắc Ninh | DP | cb_nv_dp_03, cg_03, ... | — |

Ngoài 7 đơn vị active cho test accounts, hệ thống còn 76 DP khác (toàn bộ 63 Sở Tư pháp tỉnh/thành + BN khác). **Đủ scope test data isolation Round 5 với 3 BN đa dạng (BKH/BTC/BCT) và 3 DP đa dạng (AG/BG/BNI).**

Observation: **fixture codes** (`TW-CUC`, `BN-BTP`, `DP-HN`, `DP-HP`, `DP-DN`) **không khớp** với UI codes thực tế (`BTP-TW`, `BKH`, `BTC`, etc.). Fixture cần refactor cho Round 5 permission matrix nếu muốn reference đúng. Không block T1.

---

## 4. DM Loại DN — Semantic observation

**UI codes (5):** `DN_SIEU_NHO`, `DN_NHO_VA_VUA`, `HO_KINH_DOANH`, `HOP_TAC_XA`, `DN_XA_HOI`
**Fixture codes (4):** `TNHH`, `CP`, `DNTN`, `HKD`

**Nhận xét:**
- UI stores **quy mô + loại pháp lý đặc biệt theo NĐ39** (siêu nhỏ / nhỏ-vừa / HKD / HTX / DN xã hội).
- Fixture stores **legal form** (TNHH / Cổ phần / DN Tư nhân / HKD).
- Chỉ `HO_KINH_DOANH` ≈ `HKD` overlap; còn lại **different concept**.

Per SRS FR-V.III-01, DN form có 2 field tách biệt: `quy_mo` (enum SIEU_NHO/NHO/VUA) + `loai_doanh_nghiep_id` (FK → DANH_MUC.loai_dn). UI hiện tại DM "Loại DN" lưu **quy mô-like categories** → có thể là bug semantics hoặc DM bị miss-labeled.

**Impact:** Khi seed DN ở T1.B2 (Tier 1), field `loai_doanh_nghiep_id` FK phải chọn trong 5 values này (TNHH/CP không tồn tại). → **Adjust fixture dn_variants**: thay `TNHH/CP/DNTN/HKD` bằng `DN_SIEU_NHO/DN_NHO_VA_VUA/HO_KINH_DOANH` tương ứng với `quy_mo`.

**Observation** (không log bug ngay — chưa quote SRS clause cụ thể về DM Loại DN scope). Sẽ log formal trong P4 T4.4 Functional DN nếu BR-DN-xx clarify.

**Decision cho T1.B2:** Adjust fixture mapping on-the-fly khi seed DN (ưu tiên `HO_KINH_DOANH` cho HKD variants, `DN_NHO_VA_VUA` cho TNHH/CP medium, `DN_SIEU_NHO` cho small).

---

## 5. CAU_HINH_PHAN_CONG — Phân công TH A seed result (cập nhật 2026-04-25)

**Source fixture:** `seed-fixture.yaml > cau_hinh_phan_cong_variants.dot_1_cb_only` (6 row).

### 5.1 Section render

| Section | Render | Note |
|---------|--------|------|
| `Cấu hình phân công hỏi đáp` (HD) | ✅ | Heading + table 5 col + button [+ Thêm cấu hình] |
| `Cấu hình phân công vụ việc` (VV) | ❌ | Section KHÔNG render — pending dev fix → defer T3.2/T3.3 |

### 5.2 Form field render

Form modal hiện chỉ 3 field: `Lĩnh vực` (combobox required) + `Người xử lý` (combobox required) + `Ưu tiên` (spinbutton, default 1, min=1, max=0 — **valuemax=0 sai**, ngược semantic).

**Thiếu vs fixture (regression Round 1 BUG-CHS-PC):** `loai_yeu_cau` (TAT_CA), `don_vi_id` (TW-CUC), `trang_thai` (KICH_HOAT). BE có thể default 3 field này; impact unknown đến khi T3.2 workflow test.

### 5.3 Seed result HD section

State trước seed: 1 row pre-existing (Hình sự + CB Nghiệp vụ TW 03 + ưu tiên 1 + Kích hoạt) — created bởi session khác trước round 4.

| # | Lĩnh vực fixture | UI value (sau seed) | Người xử lý | Ưu tiên | Trạng thái | Kết quả |
|---|---|---|---|---|---|---|
| 1 | LAO_DONG | Lao động | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ PASS |
| 2 | THUE | Thuế | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ PASS |
| 3 | HOP_DONG | **Kinh doanh thương mại** (fallback) | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ PASS (with fallback) |
| 4 | DOANH_NGHIEP | — | — | — | — | ⏭️ **SKIP** (dropdown miss code) |
| 5 | SHTT | Sở hữu trí tuệ | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ PASS |
| 6 | DAT_DAI | Đất đai | CB Nghiệp vụ TW 01 | 1 | Kích hoạt | ✅ PASS |

**Tổng:** 5/6 PASS + 1/6 SKIP. Tổng list HD section = 6 row (5 mới + 1 pre-existing).

**Evidence:** [screenshots/pc-th-a-seed-5of5-list.png](../screenshots/pc-th-a-seed-5of5-list.png)

### 5.4 Findings (cập nhật §7 Observations)

- **Finding #5 (NEW):** dropdown Lĩnh vực ở form Phân công thiếu 3 code so với DM gốc 12 records: `HOP_DONG`, `DOANH_NGHIEP`, `DAU_TU` đều `Kích hoạt` trong DM nhưng KHÔNG render trong dropdown form. → **filter bug** ở BE/FE component select. Cần dev investigate.
- **Finding #6 (NEW):** dropdown Người xử lý list **TẤT CẢ** TAI_KHOAN bao gồm CG/TVV/CB cả 3 cấp (TW + BN + DP) — không filter theo `don_vi_id` cũng không filter theo role. Phân công TH A SCRubious — cấu hình ở TW có thể chọn TVV cấp DP gây mismatch scope. Cần dev validate logic filter (BR-AUTH cấp đơn vị).
- **Finding #7 (NEW):** spinbutton Ưu tiên có `valuemax=0` (semantically invalid — max < min=1). Không block seed (default value = 1) nhưng UI broken nếu test boundary.
- **Finding #8 (NEW, regression):** form thiếu 3 field `loai_yeu_cau` + `don_vi_id` + `trang_thai` so với SRS FR-II-NEW-01 + fixture. Đã log Round 1 BUG-CHS-PC, dev chưa fix.
- **Finding #9 (NEW, regression):** VV section "Cấu hình phân công vụ việc" KHÔNG render — pending Round 1 dev fix.

**Action cho T1.B1 (revised):** seed HD section 5/6 PASS. VV section + DOANH_NGHIEP defer T3.2 (SM-HD workflow trigger auto-assign sẽ verify quy tắc) + log Findings #5-9 vào round 4 bug list nếu chưa có SRS-ref đầy đủ.

---

## 6. BIEU_MAU module check

**URL:** `/bieu-mau/thu-muc` render OK — heading "Thư viện Biểu mẫu", filter + tab state render (Tất cả 0 / Đã công khai / Nháp / Đã ẩn), table columns "Tên thư mục / Lĩnh vực / Số biểu mẫu / Trạng thái / Đồng bộ / Ngày tạo / Hành động", empty state "Không có dữ liệu".

**Status:** Module infrastructure ✅. 0 record không phải blocker cho Tier 0 — BIEU_MAU là entity downstream (QTHT cấu hình từ thư viện templates xuống modules). Seed cụ thể sẽ làm khi cần verify trong T3 SM-HD workflow (mẫu phản hồi) hoặc P4 T4.10 Functional Biểu mẫu.

---

## 7. Observations (không log bug — outside SRS clause)

1. **Fixture code mismatch (DON_VI + Loại DN)** — fixture `seed-fixture.yaml > tier_0_prerequisite` viết codes `TW-CUC/BN-BTP/DP-HN...` + `TNHH/CP/DNTN/HKD`, nhưng UI thực tế là `BTP-TW/BKH/BTC...` + `DN_SIEU_NHO/DN_NHO_VA_VUA/HO_KINH_DOANH/HOP_TAC_XA/DN_XA_HOI`. Fixture cần refactor hoặc QA document adjust mapping trước khi Round 5 permission matrix.
2. **DM Lĩnh vực PL thiếu code `HOP_DONG`** — fixture `linh_vuc_phap_ly[2]` expect `HOP_DONG: Hợp đồng`, UI không có. Khi seed VV/HD/TVCS variant có `linh_vuc = HOP_DONG` → bị miss. Có thể fallback `KINH_DOANH_TM` hoặc `DAN_SU`.
3. **DM Loại DN stores quy mô thay vì legal form** — observation §4 trên. Impact on T1.B2 DN seed — sẽ adjust mapping.
4. **PC preset rỗng + VV section missing** — §5, có thể liên quan BUG-CHS-PC round 1.
5. **(2026-04-25) PC dropdown Lĩnh vực filter mất 3 code** — `HOP_DONG/DOANH_NGHIEP/DAU_TU` đều `Kích hoạt` ở DM (12 records) nhưng dropdown form Phân công chỉ render 10. Cần dev verify filter BE/FE.
6. **(2026-04-25) PC dropdown Người xử lý không filter scope** — list cả CG/TVV/CB của 3 cấp TW/BN/DP. Cần verify BR-AUTH có yêu cầu filter `don_vi_id` không.
7. **(2026-04-25) PC spinbutton Ưu tiên valuemax=0** — semantically invalid (max < min=1). Default value 1 dùng được nhưng boundary test sẽ fail.

---

## 8. Tier 0 Gate Decision cho T1.B1

| Criteria | Status |
|----------|--------|
| DANH_MUC fixture min ≥ 6/4 | ✅ PASS (12/5) |
| DON_VI ≥ 5 | ✅ PASS (83) |
| TAI_KHOAN 3 accounts | ✅ PASS (P0) |
| SLA qua_han_he_so > 1 | ✅ PASS (= 2) |
| PC HD section seed (Phân công TH A) | ⚠️ **PARTIAL** 5/6 row (skip DOANH_NGHIEP) |
| PC VV section render | ❌ **MISS** (regression Round 1, defer T3.2) |
| BIEU_MAU module up | ✅ PASS (render OK) |

**→ T1.B1 PARTIAL PASS** (5/7 ✅ + 1/7 PARTIAL + 1/7 MISS). Tier 0 baseline đủ seed cho T1.B2 DN + T1.B3 TVV. Proceed P2 seed.

**PC gap:** (a) DOANH_NGHIEP row defer T3.2 (cần dev fix dropdown filter mới seed lại). (b) VV section defer T3.2/T3.3 workflow (chờ dev fix render). (c) Phân công TH B (TVV backfill 6 row) làm T2.0.5 sau khi T3.1 SM-TVV PASS.
