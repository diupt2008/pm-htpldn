# Delta Map — FR-06 update (Chi trả Chi phí Tư vấn)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-06-chi-tra.md` (1.414 dòng) so với `srs-v3/srs-fr-06-chi-tra.md` (1.244 dòng, Δ +170 dòng / +14%) — apply 9 thay đổi B1, BA chốt OUT 4 thay đổi (5, 8, 12, 13).
> **Ngày tạo:** 2026-05-06 | **Tác giả:** QA + Claude
> **Source:** CHANGELOG-v3-to-v3.5.md line 584-727.

---

## 1. Có gì mới / đổi / xoá

### FR mới (1 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-V.II-14 | DN bổ sung hồ sơ chi trả khi nhận yêu cầu bổ sung | DN qua DVC/Cổng PLQG hoặc CB NV; PRE-01 = `YEU_CAU_BO_SUNG`; PRE-02 ≤ 5 ngày LV; Inputs `file_bo_sung[]` + `ghi_chu`; 6 bước Processing; 3 errors BS-01/02/03; cite NĐ 55/2019 Đ.9 |

### Entity mới / đổi

| Entity | Trạng thái | Note |
|---|---|---|
| `THAM_DINH_HO_SO` | **Mới owned** | 9 fields, 1:1 với HO_SO_CHI_TRA, Volume ~3,000/năm |
| `PHE_DUYET_CHI_TRA` | **Mới owned** | 9 fields, N:1 với HO_SO_CHI_TRA (cho phép nhiều lần CB PD trả về rồi CB NV trình lại), Volume ~3,500/năm |
| `THONG_BAO` | Referenced | Polymorphic global — mới reference từ FR-06 |
| `HO_SO_CHI_TRA` | Refactor | +9 fields lifecycle (`ngay_tiep_nhan`, `nguoi_tiep_nhan_id`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id`, `ly_do_huy`, `bo_sung_count` CHECK 0-3 default 0, `ngay_yeu_cau_bo_sung`); UNIQUE constraint `ma_ho_so_dvc` |

### State Machine — SM-CHITRA chuẩn hoá

**10 trạng thái cuối cùng** (đồng bộ enum CHECK constraint):
`CHO_TIEP_NHAN` / `DANG_KIEM_TRA` / `DANG_DANH_GIA` / `DANG_THAM_DINH` / `CHO_PHE_DUYET` / `DA_DUYET` / `DA_THANH_TOAN` / `TU_CHOI` / `YEU_CAU_BO_SUNG` / `HUY`

**BỎ:** `MOI` / `DA_TIEP_NHAN` / `CHO_THAM_DINH` / `DA_THAM_DINH` / `TU_CHOI_THAM_DINH` / `TU_CHOI_THANH_TOAN` (đã có trong v3 nhưng không nằm trong CHECK constraint).

**14 transition** đồng bộ với 13 dòng bảng chuyển trạng thái mới. Bỏ V3 row "Auto: quá N ngày LV (BR-EC-16)" do dangling ref (Thay đổi 5 OUT).

### Quy tắc nghiệp vụ đổi

| Quy tắc | Cũ | Mới |
|---|---|---|
| CB PD "Từ chối" | `CHO_PHE_DUYET → TU_CHOI` (đóng HS, từ chối cuối) | **`CHO_PHE_DUYET → DANG_THAM_DINH`** (trả về CB NV điều chỉnh, KHÔNG đóng HS) |
| Lý do CB PD trả về | Optional | **Bắt buộc ≥ 10 ký tự** (BR-AUTH-05 cùng đơn vị) |
| FR-V.II-09 thẩm định KHÔNG ĐẠT | `→ TU_CHOI_THAM_DINH` | **`→ TU_CHOI`** với prefix `THAM_DINH:` trong `ly_do_tu_choi` |
| FR-V.II-12 từ chối thanh toán | `→ TU_CHOI_THANH_TOAN` | **`→ TU_CHOI`** với prefix `THANH_TOAN:` |
| FR-V.II-02 | Chỉ chuyển trạng thái | **+ Tiếp nhận hồ sơ (sub-flow 5 bước, GAP-V.II-02)** + **+ DN rút hồ sơ (sub-flow 5 bước, GAP-V.II-03)** |
| Số lần bổ sung | Unlimited | **Tối đa 3 lần** (`bo_sung_count` 0-3, highlight đỏ khi n ≥ 2). Lưu ý: Thay đổi 5 OUT nên KHÔNG có auto-từ-chối khi n=3 |
| DON_VI cấu trúc | "3 tầng" | **2 tầng: TW → {BN, ĐP}** ngang cấp (đồng bộ memory `project_auth_scope_2tier`) |
| Nhãn UI Việt thuần | Lẫn raw enum | **Tiếng Việt thuần** + giá trị nội bộ trong ngoặc (badge, filter, accordion, stepper) |

### Số FR

- v3: 13 FR → v3.5: **14 FR** (thêm FR-V.II-14).

### BA chốt OUT (KHÔNG áp v3.5)

| Thay đổi | Lý do |
|---|---|
| Thay đổi 5 — FR-V.II-CROSS-01 + BR-EC-15/16 (auto từ chối quá hạn / 3 lần bổ sung) | BA OUT 2026-05-06 |
| Thay đổi 8 — SLA dynamic "Còn N ngày" + BR-SLA-02 | BA OUT — giữ V3 "4 mức cảnh báo" |
| Thay đổi 12 — BR-FLOW-04 mở rộng applied + ngưỡng ≥ 10 ký tự cho mọi từ chối | BA OUT — chỉ giữ ngưỡng ≥ 10 ký tự cho FR-V.II-12 trả về |
| Thay đổi 13 — Section "Lịch sử thay đổi" inline trong file FR | BA OUT |

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Phụ thuộc | Nhóm | Test scope |
|---|---|---|---|
| `srs-fr-06-chi-tra.md` (self) | — | **A FULL** | SM-CHITRA 10 enum + FR-V.II-14 + 2 entity owned + 9 lifecycle fields + CB PD trả về |
| `srs-v3.md` (master) | ERD + BR catalog | **A FULL** | Sync 2 entity owned mới + 10 enum SM-CHITRA + DON_VI 2 tầng |
| `srs-fr-04-chuyen-gia-tvv.md` | TU_VAN_VIEN ref Mô tả vẫn ghi "TVV/CG/NHT" cũ ở line 1252 | **B DELTA** | Chờ Pha 3 reconcile — đồng bộ với srs-fr-04 v3.5 |
| `srs-fr-05-vu-viec.md` | Entity referenced (VU_VIEC, TU_VAN_VIEN, TAI_KHOAN, DON_VI) | **B DELTA** | Verify ERD owner đồng bộ |
| `srs-fr-07-doanh-nghiep.md` | DOANH_NGHIEP owner | **B DELTA** | Pha 3 verify |
| `srs-fr-10-quan-tri.md` | DON_VI 2 tầng + BR-AUTH-05 | **B DELTA** | Đồng bộ source of truth |
| `srs-fr-11-bao-cao.md` | Báo cáo nhóm V (BC chi trả) | **C IMPACT** | Verify entity name + field |
| FR-02/08/09/13/14/15/16 | Mức nhẹ — DON_VI 2 tầng | **C/D** | Smoke 5 phút |

---

## 3. Findings critical (ưu tiên test)

1. **CB PD "Từ chối" → trả về DANG_THAM_DINH** — test case cũ verify `trang_thai = TU_CHOI` sau từ chối → INVALID. Cần redesign + verify thông báo CB NV cả 2 nhánh DUYET/TU_CHOI.
2. **2 entity owned mới (THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA)** — schema migration. Test verify INSERT bản ghi mỗi lần thẩm định / phê duyệt.
3. **FR-V.II-14 DN bổ sung HS qua DVC** — luồng test mới, cần test edge case: ngoài 5 ngày LV (E3 ERR-CT-BS-02), file vượt size, file invalid type.
4. **`bo_sung_count` 0-3 + highlight đỏ ≥ 2** — UI test scenario. Lưu ý Thay đổi 5 OUT → KHÔNG có auto-từ-chối khi n=3, CB NV phải thủ công.
5. **10 enum trạng thái SM-CHITRA** — toàn bộ test case cũ dùng `MOI`/`DA_TIEP_NHAN`/`CHO_THAM_DINH`/`DA_THAM_DINH`/`TU_CHOI_THAM_DINH`/`TU_CHOI_THANH_TOAN` → INVALID. Phải migrate sang enum mới.
6. **Tiếp nhận HS + DN rút HS (FR-V.II-02 sub-flow)** — luồng mới chưa có test case. Test sequence: CB NV [Tiếp nhận] → ghi `ngay_tiep_nhan`; DN [Rút HS] → `ly_do_huy = 'DN_RUT_HO_SO'`.
7. **UNIQUE constraint `ma_ho_so_dvc`** — idempotent key cho ERR-CT-02. Test trùng mã → reject.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/funtion/7.6-chi-tra-chi-phi.md` | Refactor scope — thêm FR-V.II-14 (DN bổ sung HS); đổi test CB PD từ chối → DANG_THAM_DINH; thêm test 2 sub-flow Tiếp nhận + Rút HS; thêm test 2 entity owned mới (verify INSERT) |
| `output/smoke-specs/6.6-smoke-chitra.md` | Thêm smoke test FR-V.II-14 + CB PD trả về |
| `output/smoke/6.6-sm-chitra.md` | SM-CHITRA: 10 trạng thái + 14 transition mới (đầy đủ Mermaid + bảng); thêm transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (FR-V.II-14) + `CHO_TIEP_NHAN → DANG_KIEM_TRA` (Tiếp nhận) + `CHO_TIEP_NHAN → HUY` (DN rút) |
| `input/data/entity-map.md` | Thêm 2 entity owned mới (THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA); update HO_SO_CHI_TRA (+9 lifecycle fields, +UNIQUE ma_ho_so_dvc) |
| `input/data/seed-fixture.yaml` | Thêm `tham_dinh_ho_so_variants` + `phe_duyet_chi_tra_variants`; update `ho_so_chi_tra_variants` (+lifecycle fields, +bo_sung_count) |
| `input/quy-trinh-nghiep-vu/flow-module.md` | §8 Chi trả: SM-CHITRA 10 trạng thái + 14 transition mới |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Bảng SM transition module Chi trả: refresh 14 row đồng bộ Mermaid |
| `output/permission-matrix-by-fr.md` + `by-role.md` | Thêm 2 entity (THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA); verify scope CB NV/CB PD theo BR-AUTH-05 cùng đơn vị |
| `tasks/todo.md` R7 | Thêm task R7.X: workflow chi trả với CB PD trả về + DN bổ sung HS + Tiếp nhận/Rút HS |
| `output/test-strategy.md` | Note: SRS update FR-06 — 9 changes IN, 4 OUT, scope mở rộng FR-V.II-14 + 2 entity owned mới |

**KHÔNG động:**
- `srs-v3/srs-fr-06-chi-tra.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-06-chi-tra.md` — file delta source.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-06 (chi trả)** → cite `srs-update-2026-5-5/srs-fr-06-chi-tra.md:line N`.
- **Test/log bug FR-V.II-14 (DN bổ sung HS)** → cite line 833-892.
- **Test/log bug CB PD từ chối** → cite line 729-749 + Thay đổi 2 (mới `DANG_THAM_DINH`, KHÔNG TU_CHOI).
- **Test/log bug 10 trạng thái** → cite Thay đổi 1 (1.1-1.11). Bỏ ref `MOI`/`DA_TIEP_NHAN` cũ.
- **Mâu thuẫn TVV ref Mô tả "NHT"** ở line 1252 — log thành **bug SRS contradiction**, hỏi BA, đồng bộ với memory `project_tu_van_vien_entity_covers_nht`.

---

## 6. Open issues — defer kiểm tra khi test

- **Cite "5 ngày LV" theo NĐ 55/2019 Đ.9** (FR-V.II-14 PRE-02): chưa verify số "5 ngày LV" cụ thể trong memory `legal-citations-verification.md`. Defer khi test.
- **Phụ thuộc FR-04 line 1252** (TU_VAN_VIEN ref "NHT"): chờ BA quyết IN/OUT — Pha 3 reconcile.
- **Phụ thuộc FR-07 (DOANH_NGHIEP owner)**: FR-07 v3.5 chưa apply hết. Pha 3 verify.
- **UC77 actor lệch CSV** (FR-V.II-10): SRS giữ "Hệ thống auto trigger sau UC76", CSV ghi "CB NV chủ động chọn HS". BA D.2 chờ trả lời.
- **Đối tác TT CNTT mục 07** (Upload PDF/Word ở form Thêm mới): KHÔNG áp được vì SCR-V.II-01 ghi "Nguồn duy nhất: DVC qua LGSP — CB NV KHÔNG nhập tay HS chi trả". BA D.4 chờ.
- **NĐ 18/2026 + TT 64/2021/TT-BTC** (mức trần chi phí): cite từ V3 baseline, chưa verify.

### Technical debt v3.5+ (do BỎ Thay đổi 5/8/12)

1. **State YEU_CAU_BO_SUNG không có auto-từ-chối quá hạn** — DN không gửi trong 5 ngày → HS treo vĩnh viễn. Phiên bản sau bổ sung.
2. **`bo_sung_count` ≥ 3 không auto-TU_CHOI** — UI hiển thị `{n}/3` + highlight đỏ ≥ 2 nhưng FR không có hành động auto khi n=3. CB NV thủ công.
3. **SLA giữ "4 mức cảnh báo"** thay vì dynamic "Còn N ngày" — HO_SO_CHI_TRA chưa có 2 field `deadline` + `muc_do_canh_bao`.
4. **BR-FLOW-04 chỉ ref FR-V.II-12** — các từ chối ở FR-V.II-03/09/13 không có ràng buộc "lý do ≥ 10 ký tự" formal trong BR.
