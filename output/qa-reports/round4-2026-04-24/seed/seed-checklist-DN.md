# Seed Checklist — DOANH_NGHIEP Tier 1 (T1.B2)

**Phase:** P1 Block B Ngày 3-4 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P1 T1.B2 • **Date:** 2026-04-24
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01, Cục BTTP)
**Method:** MCP Chrome DevTools — 6 variant pure-seed via SCR-V.III-02 `[+ Thêm mới]`
**Entry state:** HOAT_DONG (M1 không có state machine, CRUD thuần)
**Input:** [seed-fixture.yaml > dn_variants[0..5]](../../../../input/data/seed-fixture.yaml)

---

## Tier dependencies (kiểm tra trước)

| Dependency | Entity | Status |
|-----------|--------|:------:|
| Tier 0 prereq | DANH_MUC `linh_vuc_phap_ly`, `loai_dn` | ✅ (T1.B1) |
| Tier 0 prereq | DON_VI (BTP-TW, 18 BN, 64 DP) | ✅ (T1.B1) |
| Tier 0 prereq | TAI_KHOAN `cb_nv_tw_01` | ✅ (P0) |

---

## Seed result — 6/6 PASS ✅

| # | Variant | Fixture Tên DN | MST | Tỉnh | Quy mô | Fixture `loai_dn` | UI `Loại DN` chọn | Sample ID | Status |
|---|---------|----------------|-----|------|--------|-------------------|--------------------|-----------|:------:|
| 1 | Alpha | Công ty TNHH Kiểm thử Alpha | 0100100101 | Hà Nội | Nhỏ | TNHH | `Doanh nghiệp nhỏ và vừa` | **`DN-HNI-0001`** | ✅ |
| 2 | Beta | Công ty Cổ phần Beta | 0100100102 | Hà Nội | Siêu nhỏ | CP | `Doanh nghiệp siêu nhỏ` | **`DN-HNI-0002`** | ✅ |
| 3 | Gamma | Công ty TNHH Gamma Sản xuất | 0200200203 | Hải Phòng | Vừa | TNHH | `Doanh nghiệp nhỏ và vừa` | **`DN-HPG-0001`** | ✅ |
| 4 | Delta | Doanh nghiệp Tư nhân Delta | 0200200204 | Hải Phòng | Nhỏ | DNTN | `Hộ kinh doanh` | **`DN-HPG-0002`** | ✅ |
| 5 | Epsilon | Công ty Cổ phần Epsilon IT | 0300300305 | Đà Nẵng | Vừa | CP | `Doanh nghiệp nhỏ và vừa` | **`DN-DNG-0001`** | ✅ |
| 6 | Zeta | Công ty TNHH Zeta Giáo dục | 0300300306 | Đà Nẵng | Siêu nhỏ | TNHH | `Doanh nghiệp siêu nhỏ` | **`DN-DNG-0002`** | ✅ |

### Kết quả tổng

| Metric | Giá trị |
|--------|---------|
| Total variants | 6 |
| Seeded OK (Y) | **6** |
| Skipped (đã tồn tại) | 0 |
| BLOCKED | 0 |

**→ T1.B2 PASS 100%** — 6 DN records ready cho downstream seed T2 Tier 2-4 (VV, CHITRA, DGHQ, CTDT, ...).

---

## 1. Mã auto-gen check — BR-DATA-04 ✅

Pattern: `DN-{TINH_PREFIX}-{SEQ}` với `{SEQ}` 4 chữ số:
- **HNI (Hà Nội):** DN-HNI-0001, DN-HNI-0002 (2 record)
- **HPG (Hải Phòng):** DN-HPG-0001, DN-HPG-0002 (2 record)
- **DNG (Đà Nẵng):** DN-DNG-0001, DN-DNG-0002 (2 record)

Counter độc lập per tỉnh — đúng spec. Database đã được reset so với Round 1 (counter restart từ 0001; R1 đã seed tới 0010/0002/0003).

---

## 2. Fixture ↔ UI field mapping (record cho Round 5)

### Field 1:1 (textbox — seed nhập trực tiếp)
- `ten_doanh_nghiep` → form "Tên doanh nghiệp" (required *)
- `ma_so_thue` → "Mã số thuế" (required *)
- `giay_cndk` → "Giấy CN ĐKKD"
- `linh_vuc_kinh_doanh` → "Lĩnh vực kinh doanh"
- `nguoi_dai_dien` → "Người đại diện" (required *)
- `chuc_vu_dd` → "Chức vụ đại diện"
- `dia_chi` → "Địa chỉ" (required *)
- `so_dien_thoai` → "Điện thoại"
- `email` → "Email"
- `ghi_chu` → "Ghi chú" (multiline)

### Field số (spinbutton — seed via native setter)
- `so_lao_dong` → "Số lao động"
- `doanh_thu_nam` → "Doanh thu (VNĐ)"
- `tong_nguon_von` → "Tổng nguồn vốn (VNĐ)"

### Field dropdown (combobox — map fixture → UI enum)

| Fixture field | Fixture values | UI values (enum thực tế) | Mapping quyết định |
|---------------|----------------|--------------------------|---------------------|
| `loai_doanh_nghiep_id` | TNHH, CP, DNTN, HKD | `Doanh nghiệp siêu nhỏ`, `Doanh nghiệp nhỏ và vừa`, `Hộ kinh doanh`, `Hợp tác xã`, `Doanh nghiệp xã hội` | **Semantic mismatch — xem §4 seed-checklist-QTHT.md.** Map theo `quy_mo`: SIEU_NHO→siêu nhỏ, NHO/VUA→nhỏ và vừa (trừ DN4 DNTN→Hộ kinh doanh vì gần nhất với DNTN) |
| `quy_mo` | SIEU_NHO, NHO, VUA | `Siêu nhỏ`, `Nhỏ`, `Vừa` | 1:1 mapping ✅ |
| `nganh_nghe` | NONG_LAM, CONG_NGHIEP, THUONG_MAI | `Nông nghiệp`, `Công nghiệp`, `Thương mại`, `Dịch vụ`, `Xây dựng`, `Giáo dục`, `Y tế`, `Công nghệ`, `Khác` | THUONG_MAI→`Thương mại`, CONG_NGHIEP→`Công nghiệp`; DN6 Zeta fixture `THUONG_MAI` nhưng mục đích là "đào tạo/giáo dục" → dùng `Giáo dục` sát hơn |
| `tinh_thanh_id` | DP-HN, DP-HP, DP-DN | `Hà Nội`, `Hải Phòng`, `Đà Nẵng` (dropdown Tỉnh/TP theo tên VN chuẩn) | 1:1 mapping theo tên ✅ |

### Field không có trong form (SRS nhưng UI miss) — từ R1 `qa_htpldn_qldn_fr01_r1`:
- ❌ `ngay_cap_dkkd` — BUG-DN-005 Round 1 Major, **regression chưa fix** (seed skip field này)
- ❌ `fax` — BUG-DN-005 Round 1 Major, regression
- ❌ `file_dinh_kem` — BUG-DN-005 Round 1 Major, regression (fixture value `null` nên không cần seed)

### Field ngoài SRS (UI có, fixture không):
- "Tên viết tắt", "Số lao động nữ", "Số lao động khuyết tật", "Nữ làm chủ" (switch) — để default (empty/0/off)

---

## 3. Observations (note — KHÔNG log bug round 4, đã được log R1)

### Regressions từ Round 1 (chưa dev fix — verify khi P4 T4.4 Functional DN)

| ID | Severity | Title | Round 1 memory |
|----|----------|-------|----------------|
| BUG-DN-004 | Major | Auto-suggest quy mô NĐ39 không implement FE (nhập LĐ + DT không gợi ý quy mô) — QA phải chọn tay | `qa_htpldn_qldn_fr01_r1` |
| BUG-DN-005 | Medium | Form thiếu 3 field: ngay_cap_dkkd, fax, file_dinh_kem | `qa_htpldn_qldn_fr01_r1` + `qa_htpldn_qldn_ui_round1` |

### Observation mới (từ seed session này)

1. **Float32 precision loss ≥ 50 tỷ** (reproduced R1):
   - DN3 Gamma: Tổng vốn input 90_000_000_000 → stored `89999998976` (display OK "90.000.000.000" nhưng backend giá trị lệch 1024 VNĐ)
   - DN5 Epsilon: Doanh thu input 50_000_000_000 → stored `49999998976`
   - DN5 Epsilon: Tổng vốn input 60_000_000_000 → stored `60000002048`
   - Pattern: số > 2^32-1 bị cast float32 loss precision. **BE có thể dùng `float` thay vì `bigint/decimal` cho cột money.** → Observation, cần BA confirm SRS có constraint precision cho money field không. Chưa log bug.

2. **Loại DN dropdown semantic mismatch (reproduced R1)**: UI stores quy mô NĐ39 (DN_SIEU_NHO/DN_NHO_VA_VUA/HO_KINH_DOANH/HOP_TAC_XA/DN_XA_HOI) thay vì legal form (TNHH/CP/DNTN/HKD). Đã note §4 seed-checklist-QTHT.md.

3. **Round 1 BUG-DN-001 (BE quy mô calculation sai khi 100+LĐ + 50+tỷ → NHO thay VUA)** — trong seed này, khi user **chọn tay** quy mô="Vừa" cho DN5 Epsilon (100 LĐ + 50 tỷ), value persist đúng "Vừa" ở detail view. **Không trigger được R1 bug vì chỉ trigger khi user dựa vào auto-suggest** (mà auto-suggest đã broken per BUG-DN-004). Defer verify R1 BUG-DN-001 cho P4 T4.4 (simulate: tester quên chọn + submit with/without confirm modal).

4. **Click [Thêm mới] button đôi khi cần re-take snapshot** — MCP uid_refs stale sau navigate. Expected, không phải bug.

---

## 4. Dependency downstream

Sample IDs này sẽ dùng cho downstream T2.A2-A4 (VV, TVCS, HSPL) + T2.C1 (CT HTPLDN):

| Downstream task | Sample IDs cần | Action mapping |
|-----------------|----------------|----------------|
| T2.A2 Seed VU_VIEC 6 variants | 6 DN sample IDs | VV link DN qua `doanh_nghiep_id` FK (dropdown) — map vv_variants[i] ↔ dn-{HNI/HPG/DNG}-000{i} by index |
| T2.A4 Seed HSPL (HO_SO_PHAP_LY_DN) | 6 DN sample IDs | HSPL 1:N per DN |
| T2.A3 Seed TVCS (TV_CHUYEN_SAU_YC) | Subset DN sample | TVCS link DN qua `doanh_nghiep_id` |
| T2.B4 Verify Chi trả BE-sync | 0 record upstream (cascade-block `BLOCKED-UPSTREAM-SYNC-MISSING`) | Chi trả sync từ DVC → liên kết VV chứ không DN trực tiếp |

---

## 5. Time + efficiency

- **Time/DN:** ~2 phút (fill 10 textbox + 4 combobox dropdown + 3 spinbutton native setter + 1 submit)
- **Tổng 6 DN:** ~15 phút
- **MCP stability:** 0 crash qua 6 seed session (xác nhận CLAUDE.md MCP-Rule correct)

---

## 6. Next step

**T1.B3 Seed TVV 6 variants** — cùng account `cb_nv_tw_01`, screen SCR-IV-02. Known R1 blocker: `qa_htpldn_tvv_cr_round1` Critical FE ProForm DatePicker gửi "Invalid Date". Check nếu dev đã fix.
