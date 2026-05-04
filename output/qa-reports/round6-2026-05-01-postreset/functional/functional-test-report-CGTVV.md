# Functional Test Report — Module Chuyên gia / Tư vấn viên (CG/TVV)

> **Module:** CG/TVV (Chuyên gia / Tư vấn viên — FR-04) · **SRS:** [`02-thu-tu-module.md §III` Module 4](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · **Test plan:** [`7.4-chuyen-gia-tvv.md`](../../../funtion/7.4-chuyen-gia-tvv.md) · **Round:** R15 retest · **Date:** 2026-05-04 · **Tester:** QA Automation
> **Bug:** [`bug-report-functional-cgtvv.md`](bug-report-functional-cgtvv.md)
> **Phase 7 scope:** Bỏ happy path (đã cover Phase 4). Test negative + edge + permission. Mapping R5 T4.4.

---

## Kết luận R15 (LATEST — retest sau dev claim fix)

❌ **FAIL — cả 2 bug Open chưa fix.** Dev claim fix nhưng probe API vẫn lệch matrix:
- **BUG-CGTVV-001 (Critical):** QTHT PATCH 200 / POST 422 (auth pass) / DELETE 204 — vẫn bypass permission gate. FE đã ẩn nút "Sửa" cho QTHT (cải tiến nhỏ) nhưng nút "Xóa" vẫn enable + BE chưa fix.
- **BUG-CGTVV-002 (Major):** CG GET list 403 / GET detail 403 — vẫn không cho CG xem scoped.

**Pool impact R15:** Pool 67 → 66 do DELETE TVV-BTP-TW-0015 trong probe Bug-001. DANG_HOAT_DONG vẫn 11 (TVV-0015 ở MOI_DANG_KY trước khi xóa). Cần reseed nếu muốn parity với pre-test.

---

## Kết luận R14

⚠️ **PASS-WITH-NOTE — 4/4 functional + permission gate critical bug** — TVV-001/002/004/005 PASS qua API + UI smoke. TVV-023 (QTHT permission) **FAIL Critical** (BUG-CGTVV-001 — DELETE/PATCH/POST đều pass cho QTHT). TVV-025 (CG read scoped) **FAIL Major** (BUG-CGTVV-002 — 403 thay vì 200). 4 TC khác (021, 022, 015, 024/026/027/029/030) chưa test do dependency data hoặc thuộc nhóm permission đã đại diện bằng probe API cross-role.

> **Pool impact:** Trong quá trình probe TVV-023, QTHT DELETE thành công làm pool giảm 67→66. Đã reseed `TVV-BTP-TW-0015` (Nguyễn Thị Thuế reseed) qua UI bằng `cb_nv_tw_01` → pool restore về 67. Tuy nhiên record reseed đang state `MOI_DANG_KY` (không phải DANG_HOAT_DONG như TVV-0014 ban đầu). DANG_HOAT_DONG count: 12→11 — vẫn ≥9 threshold, không block downstream.

---

## R14 — 2026-05-02 (LATEST)

### Accounts dùng

| Role | Account | Mục đích |
|------|---------|----------|
| QTHT | `qtht_01` | Test TVV-023 — verify QTHT 👁️ R-only |
| CB_NV_TW | `cb_nv_tw_01` | Baseline CRUD* + reseed TVV-0015 |
| CB_PD_TW | `cb_pd_tw_01` | Test TVV-028 — verify CB_PD 📝 RU* |
| CG | `cg_tw_01` | Test TVV-025 — verify CG 👁️ R* |
| TVV (NHT type) | `tvv_tw_01` | Test TVV-024 — verify TVV scope |

### Bảng kiểm tra TC

| TC ID | Tên TC | Loại | Status | Bug / Note |
|---|---|---|:-:|---|
| TVV-001 | Xem danh sách TVV → phân trang, lọc | Happy/Smoke | ✅ | List render 12 record (QTHT) / 11 (cb_nv_tw_01). Pagination "1-12 / 12 mục" hoạt động. |
| TVV-002 | Filter UI present | Happy/Smoke | ✅ | 7 filter visible: Từ khóa / Lĩnh vực / Địa bàn / Tổ chức / Trạng thái / Ngày từ–đến |
| TVV-003 | Đăng ký TVV (Tạo TVV-0015 reseed) | Happy | ✅ | Create thành công qua UI cb_nv_tw_01. Auto-gen `TVV-BTP-TW-0015`. State default `MOI_DANG_KY`. |
| TVV-004 | Đăng ký → CMND/CCCD trùng → unique | Negative | ✅ | POST với `cccd=001085999020` (vừa tạo) → HTTP **409** + `ERR-VAL-IV-03-02 "CCCD đã tồn tại trong hệ thống"` |
| TVV-005 | Đăng ký → thiếu lĩnh vực (≥1 bắt buộc) | Negative | ✅ | POST với `linhVucIds=[]` → HTTP **422** + `ERR-VAL-SYS-00-01 "linhVucIds must contain at least 1 elements"` |
| TVV-006 | Cập nhật năng lực TVV | Happy | — | Skip (Phase 4 đã cover qua workflow R6.4.A1) |
| TVV-007 | Xem chi tiết TVV | Happy | ✅ | Detail page TVV-0015 render đầy đủ 4 nhóm: Thông tin cá nhân / Nghề nghiệp / Tổ chức / Ghi chú |
| TVV-008..013 | Workflow thẩm định/duyệt/công khai | Workflow | — | Skip (Phase 4 đã cover R6.4.A1-CG) |
| TVV-014 | Đánh giá TVV — nhập điểm | Happy | — | Skip (Phase 4 cover; cần ≥3 đánh giá để test TVV-015) |
| TVV-015 | AVG điểm TB TVV (BR-CALC-06) | Calculation | ⏭ | Defer — cần seed ≥3 KET_QUA_DANH_GIA. Đẩy sang R6.7.13 Báo cáo (cần data accumulated) |
| TVV-016 | Xem lịch sử hỗ trợ TVV | Happy | — | Skip (Phase 4 cover) |
| TVV-017 | NHT tự cập nhật hồ sơ | Happy | — | Defer (cần test bằng nht_01 — không trong scope Phase 7 negative+edge+perm) |
| TVV-018..020 | Lifecycle Tạm dừng/Kích hoạt/Vô hiệu | Workflow | — | Skip (Phase 4 cover qua R6.4.A1-CG) |
| TVV-021 | Guard vô hiệu hóa TVV có VV đang xử lý (BR-GUARD-01) | Guard | ⏭ | Defer — pool VV (20 record) hiện `nguoiTiepNhanId=null`, chưa có VV link với TVV. Cần cross-module setup → đẩy sang R6.7.3 Vụ việc (test plan tự setup VV-TVV link) |
| TVV-022 | Không xóa TVV đang có VV | Guard | ⏭ | Defer — same dependency với TVV-021 |
| **TVV-023** | **QTHT 👁️ R-only trên TU_VAN_VIEN** | **Permission** | **❌ FAIL** | **BUG-CGTVV-001 Critical** — QTHT DELETE/PATCH/POST đều pass thay vì 403. Pool 67→66 do delete thật. |
| TVV-024 | TVV xem hồ sơ TVV của mình (R*) | Permission | ⏭ | Ambiguity — `tvv_tw_01` JWT `vaiTro=NHT` không phải TVV. Cần BA xác nhận matrix §10.TVV mapping role nào trong implementation |
| **TVV-025** | **CG xem danh sách TVV (R* scoped)** | **Permission** | **❌ FAIL** | **BUG-CGTVV-002 Major** — `cg_tw_01` (vaiTro=CG) GET `/tu-van-viens` trả 403 thay vì 200 scoped |
| TVV-026 | NHT cập nhật HO_SO_TU_VAN_VIEN | Permission | — | Defer — entity HO_SO_TU_VAN_VIEN ngoài scope test plan 7.4 (focus TU_VAN_VIEN) |
| TVV-027 | TVV/CG xem HO_SO_TU_VAN_VIEN (R*) | Permission | — | Defer — same với TVV-026 |
| TVV-028 | CB_PD phê duyệt TVV (RU*) | Permission | ⚠️ | `cb_pd_tw_01` GET 200 ✅, PATCH `hoTen` → 403 ❓ (có thể đúng nếu RU* chỉ cho phép update field approve như `trangThai`/`nguoiDuyetId`, không phải hoTen). Cần BA verify field-level scope. |
| TVV-029 | DN đánh giá TVV qua API (C†R*) | Permission | — | Defer — entity DANH_GIA_TU_VAN_VIEN ngoài scope test plan 7.4 |
| TVV-030 | DN không thấy TU_VAN_VIEN (❌) | Permission | — | Defer (DN account không trong probe set) |

> Icon: ✅ pass · ❌ fail · ⚠️ pass-with-note · ⏭ defer (data dependency / cross-module) · — skip (Phase 4 cover hoặc out-of-scope Phase 7)

### Permission cross-role probe — 4 role × 4 hành động trên `/tu-van-viens`

| Role (JWT vaiTro) | Matrix expected | GET list | GET detail | PATCH | POST | DELETE |
|-------------------|-----------------|----------|------------|-------|------|--------|
| QTHT (`qtht_01`) | 👁️ R only | 200 ✅ | 200 ✅ | **200 ❌** | **422 ❌ (auth pass)** | **204 ❌** |
| CB_NV_TW (`cb_nv_tw_01`) | ✅ CRUD* | 200 ✅ | 200 ✅ | 200 ✅ | 422 (validation) ✅ | (not tested) |
| CB_PD_TW (`cb_pd_tw_01`) | 📝 RU* | 200 ✅ | 200 ✅ | 403 ⚠️ (field scope ambiguity) | 403 ✅ | (not tested) |
| CG (`cg_tw_01`) | 👁️ R* | **403 ❌** | **403 ❌** | 403 ✅ | 403 ✅ | 403 ✅ |
| TVV-account (`tvv_tw_01` vaiTro=NHT) | ❌ (NHT not in matrix for TU_VAN_VIEN) | 403 ✅ | 403 ✅ | 403 ✅ | 403 ✅ | 403 ✅ |

### Pool impact + reseed log

| Step | Action | Pool total | DANG_HOAT_DONG count |
|------|--------|------------|----------------------|
| Pre-test | Initial state | 67 | 12 (R6.4.A1-CG complete) |
| Bug probe | QTHT DELETE TVV-BTP-TW-0014 | 66 | 11 |
| Reseed | `cb_nv_tw_01` create TVV-BTP-TW-0015 (Nguyễn Thị Thuế reseed) qua UI | 67 | 11 (entity new ở MOI_DANG_KY) |

> **Reseed gap:** Mới tạo TVV-0015 ở `MOI_DANG_KY`. Để khôi phục 12 DANG_HOAT_DONG (parity với pre-test state), cần advance qua workflow: MOI_DANG_KY → DANG_THAM_DINH → DA_DUYET → DANG_HOAT_DONG. Đẩy việc này thành sub-task R6.4.A1-CG-reseed (nếu cần) hoặc bỏ qua vì 11 DANG_HOAT_DONG vẫn ≥9 threshold downstream.

### Bằng chứng

![Role QTHT view list TU_VAN_VIEN — 12 nút Xóa enable (vi phạm matrix R-only) + nút Sửa ẨN ở UI nhưng BE pass PATCH (FE leak hint vs BE leak thật)](image/r14-cgtvv-list-qtht.png)

```text
=== Critical: DELETE /api/v1/tu-van-viens/a0c6199e-... với QTHT token ===
HTTP_CODE: 204
(empty body)

=== Verify: GET sau delete ===
{ "success":false, "error":{"code":"ERR-VAL-VII-02-01", "message":"Bản ghi không tồn tại"}}
HTTP_CODE: 404

=== Pool delta ===
Total BEFORE: 67  →  AFTER: 66  →  AFTER reseed: 67
DANG_HOAT_DONG: 12 → 11 → 11 (reseed ở MOI_DANG_KY)
```

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R15 | 04/05 | ❌ Retest sau dev claim fix — 2 bug giữ Open. QTHT vẫn PATCH 200 / DELETE 204 (Critical chưa fix). CG vẫn GET 403 (Major chưa fix). FE ẩn nút Sửa cho QTHT nhưng "Xóa" vẫn enable. Pool 67→66 do probe DELETE. |
| R14 W1 | 02/05 | PASS 5/5 functional (TVV-001/002/003/004/005). FAIL Permission TVV-023 (Critical) + TVV-025 (Major). Defer 6 TC dependency. |

---

## Module bị block / phụ thuộc

- **R6.7.7 Dashboard** — ảnh hưởng count "Chuyên gia / Tư vấn viên: 11 người" (giảm từ 12). Verify đã giảm đúng.
- **TVV-021/022 Guard** — phụ thuộc seed VV-TVV link. Đẩy sang R6.7.3 Vụ việc (test plan có thể tự setup link).
- **TVV-015 AVG** — phụ thuộc seed KET_QUA_DANH_GIA ≥3. Đẩy sang R6.7.13 Báo cáo (cần accumulated data).
- **TVV-024/026/027/029/030 Permission** — defer R6.7.17 Edge BR-EC (đã có 8 role permission ma trận tổng) hoặc round permission riêng.

---

*R15 retest | QA Automation | 2026-05-04*
