# Seed Checklist — Doanh nghiệp self-registration (R7.2.4)

**Ngày:** 2026-05-06 16:55 • **Tài khoản:** Public flow (DN tự đăng ký, không login) + verify bằng `cb_nv_tw_01` • **Trạng thái mong đợi:** TAI_KHOAN `CHO_KICH_HOAT` + DOANH_NGHIEP active
**Màn:** SCR-VIII-08 — Đăng ký tài khoản DN • **Đường dẫn:** `/register/doanh-nghiep`
**Dữ liệu mẫu:** [seed-fixture.yaml > dn_variants + dn_variants_dp_extension](../../../../input/data/seed-fixture.yaml) (v2.7.2 — đã fix HOP_DONG → THUONG_MAI)
**SRS:** [FR-VIII-22 UC120 Self-registration DN](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md) line 1005-1089

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> 30 DN dev pre-seeded (DN000001..030) đã cover phần lớn baseline. Fixture v2.7.2 thêm 15 variant edge case cho 4 nhóm test downstream.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query (curl/UI) | Status |
|-----------------|------------------------|---------------|----------------------|------------------------|:---:|
| R7.3.4 Seed 10 HSPL DN — cover 5 DN khác nhau | `doanhNghiepId` | ≥5 DN active TW/BN/ĐP scope | DOANH_NGHIEP HOAT_DONG | UI: `/doanh-nghiep/danh-sach` ≥5 DN | ✅ 36 DN (30 dev + 6 mới) |
| R7.4.A3 Workflow VV — cần DN gắn vụ việc | `doanhNghiepId` | ≥1 DN/đơn vị TW + DP-AG/BG/BNI | DOANH_NGHIEP HOAT_DONG | UI: filter Tỉnh × có ≥1 DN | ⚠️ DP-AG ✅ · DP-BG ❌ · DP-BNI ❌ block |
| R7.7.4 Functional DN 8 TC | full CRUD test on test DN | ≥3 DN test isolated | active | UI manage DN | ✅ 6 fixture DN test |
| FR-VIII-22 BVA cận biên NĐ39 — verify quy mô auto-suggest | `quy_mo` boundary | DN cận biên VUA (199 LĐ/99 tỷ) | active | DN-HNI-0003 Theta | ✅ |
| NĐ55 Nữ làm chủ — phân biệt ưu tiên | `phu_nu_lam_chu=true` | ≥1 DN nữ làm chủ | active | DN-HPG-0002 Kappa | ✅ |

**Acceptance pass khi:** ≥1 DN/scope critical + ≥1 BVA + ≥1 nữ làm chủ. **Đạt 4/5 row** (DP-BG/BNI block — không critical cho R7 P3 vì có DP-AG cover ĐP scope).

**🚫 RULE BẮT BUỘC (2026-05-02 R11):** Acceptance task seed-create chỉ đóng ✅ KHI verify query downstream PASS. R7.2.4 đóng ⚠️ partial vì DP-BG + DP-BNI block do throttle, không phải FE/BE bug.

---

## Kết quả: ⚠️ MỘT PHẦN 6/15 + 30 dev pre-seed = 36 DN tổng trong DB

Seed thành công 6 DN qua **FR-VIII-22 self-reg public flow** (button "Đăng ký tài khoản doanh nghiệp" trên login page). 9 variants còn lại không seed được vì BE throttle aggressive (3 req/window + cooldown ≥3-15 phút sau mỗi 429). Cover 4/5 nhóm critical edge case cho downstream R7. Skip variants TW/HP/HN duplicate scope (DN4-7, 9, 11, 12) vì 30 dev pre-seed đã cover scope tương đương.

**Bug:** [`bug-report-r7-2-4-throttle-self-reg.md`](../bug-reports/bug-report-r7-2-4-throttle-self-reg.md) — BUG-THROTTLE-001 Major (block DN14/15)

---

## Bảng dữ liệu seed

### Variants đã seed PASS POST 201 (6 DN)

| # | Tên bản ghi | Mã DN (auto) | MST | Loại | Tỉnh | Quy mô | Ngành | Đặc biệt | Có vào kho? |
|---|---|---|---|---|---|---|---|---|:-:|
| 1 | Công ty TNHH Kiểm thử Alpha | DN-HNI-0001 | `5100000010` | Doanh nghiệp nhỏ | Hà Nội | Nhỏ | THUONG_MAI | Baseline TW | ✅ |
| 2 | Công ty Cổ phần Beta | DN-HNI-0002 | `5985648737` | Doanh nghiệp siêu nhỏ | Hà Nội | Siêu nhỏ | CONG_NGHIEP | CP form | ✅ |
| 3 | Công ty TNHH Gamma Sản xuất | DN-HPG-0001 | `5902760128` | Doanh nghiệp vừa | Hải Phòng | Vừa | CONG_NGHIEP | Cấp BN scope | ✅ |
| 8 | Công ty TNHH Theta Logistics | DN-HNI-0003 | `5446693030` | Doanh nghiệp vừa | Hà Nội | Vừa | CONG_NGHIEP | **BVA cận biên VUA** (199 LĐ/99 tỷ DT/110 tỷ vốn) | ✅ |
| 10 | DNTN Kappa Nông sản | DN-HPG-0002 | `5677210963` | Doanh nghiệp siêu nhỏ | Hải Phòng | Siêu nhỏ | NONG_LAM | **Nữ làm chủ=true (NĐ55)** | ✅ |
| 13 | Công ty TNHH An Giang Test | DN-AGG-0001 | `5842912084` | Doanh nghiệp nhỏ | An Giang | Nhỏ | THUONG_MAI | **DP-AG ext** | ✅ |

### Variants không seed được (block bởi throttle hoặc skip-by-design)

| # | Tên | MST fixture | Status | Lý do |
|---|---|---|---|---|
| 4 | DNTN Delta | `5527686305` | 🚫 BLOCKED | Hit 429 đầu tiên — throttle reset cooldown clock |
| 5 | CP Epsilon IT | `5334842741` | ⏭️ SKIP | Scope DP-DN duplicate với 30 dev seed; option C |
| 6 | TNHH Zeta Giáo dục | `5461852492` | ⏭️ SKIP | Scope DP-DN duplicate; option C |
| 7 | HKD Eta Bún chả | `5845236645` | ⏭️ SKIP | HKD form chưa cần test cấp; option C |
| 9 | CP Iota Y tế | `5377295719` | ⏭️ SKIP | Scope DP-HP duplicate; option C |
| 11 | TNHH Lambda Du lịch | `5670272569` | ⏭️ SKIP | Scope DP-DN duplicate; option C |
| 12 | CP Mu Tài chính | `5754501712` | ⏭️ SKIP | BVA above-bound — duplicate ý đồ với #8; option C |
| 14 | CP Bắc Giang Test | `5549953434` | 🚫 BLOCKED | Throttle 429 — wait 5+ phút silent vẫn fail |
| 15 | DNTN Bắc Ninh Test | `5923696762` | 🚫 BLOCKED | Cascade DN14 — không thử (sẽ cùng pattern) |

**Tổng:** 6 vào kho mới + 30 dev pre-seed = **36 DN** trong DB · 9 không seed (3 BLOCKED + 6 SKIP-by-design option C)

### Pre-existing dev seed (30 DN — verified 2026-05-06)

DN000001..030 — pattern auto-generated, MST 1000000xxx (10-digit checksum-valid). Cover scope toàn quốc (Hà Nội/HCM/HP/...) × loại hình (TNHH/CP/DNTN/HKD/HTX) × quy mô (Siêu nhỏ/Nhỏ/Vừa). Theo verified 2026-05-06 qua MCP UI list page DN management.

---

## Adapt vs fixture spec gốc

| Field | Fixture v2.7.2 spec | Actual khi seed | Lý do adapt |
|---|---|---|---|
| `ma_so_thue` | DN1: `0100100101` (10-digit format `0xxxxxxxxx`) | DN1: `5100000010` · DN2-15: dùng MST từ R6 actual seed (`5677600794` group) | BE checksum NĐ Việt Nam reject `01001..04004` prefix. R6 verified prefix `5*` checksum-valid. |
| `loai_doanh_nghiep_id` | TNHH/CP/DNTN/HKD (entity DM) | "Doanh nghiệp nhỏ/Siêu nhỏ/Vừa" (3 quy mô) | DM `LOAI_DOANH_NGHIEP` BE seeded sai = quy mô (BUG-DM-LOAI-DN-001 R6 vẫn Open). Adapt theo dropdown app actual. |
| `so_dien_thoai` | DN1: `0241000001` (landline regex) | DN1: `0901000001` (mobile 09xx) | FE validate `Số điện thoại không hợp lệ (VD: 0901234567)` — bắt buộc mobile 09xx. |
| `linh_vuc_kinh_doanh` | text fixture | giữ nguyên text fixture | OK — không phải FK DM. |

---

## Ảnh chụp

- [DN1 Alpha submitted thành công](screenshots/r7-2-4-dn-01-alpha-submitted.png)
- [DN list — 36 records trong DB sau seed](screenshots/r7-2-4-dn-list-36-records.png)
- [DN4 throttle 429 evidence](screenshots/r7-2-4-dn-04-rate-limit-429.png)

---

## Verify queries (UI Quản lý DN)

```
GET /doanh-nghiep/danh-sach (logged in cb_nv_tw_01)
→ Table render 36 mục
→ Filter MST = 5100000010 → 1 result Alpha ✅
→ Filter MST = 5985648737 → 1 result Beta ✅
→ Filter MST = 5902760128 → 1 result Gamma ✅
→ Filter MST = 5446693030 → 1 result Theta ✅
→ Filter MST = 5677210963 → 1 result Kappa ✅
→ Filter MST = 5842912084 → 1 result An Giang ✅
```

Mã DN auto-generated theo pattern `DN-{MaTinh}-{4digit}` (ví dụ DN-AGG-0001, DN-HNI-0001, DN-HPG-0002, DN-DNG-0001 — note `AGG` cho An Giang, `HNI` Hà Nội, `HPG` Hải Phòng).

---

## Adapt fixture v2.7.2 (đã commit trong session này)

Trong session R7.2.1 trigger, đã bump fixture `2.7.1 → 2.7.2`:
1. Tier 0 `linh_vuc_phap_ly` từ 6 LV → **10 LV per SRS line 204** (THUE/LAO_DONG/DAT_DAI/DAN_SU/THUONG_MAI/HINH_SU/HANH_CHINH/SHTT/DOANH_NGHIEP/DAU_TU)
2. Bulk replace `linh_vuc_id*: "HOP_DONG"` → `"THUONG_MAI"` ở mọi entity downstream (~30 occurrences)
3. Giữ nguyên `loai_ho_so: "HOP_DONG"` (HSPL enum SRS FR-X.1-04 — KHÁC LV)

App DM hiện vẫn không khớp SRS — chi tiết: [bug-report-r7-1-1-dm-linh-vuc-pl-mismatch.md](../bug-reports/bug-report-r7-1-1-dm-linh-vuc-pl-mismatch.md)

---

*2026-05-06 16:55 — QA chạy bằng Chrome DevTools MCP*
