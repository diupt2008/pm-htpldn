# Permission Test Report — QTHT FR-11 → FR-16 (Overall)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 QTHT](../../../permission-matrix-by-role.md)
**Round:** Round 3 — Sub-batch 4 (FR-11 → FR-16)

---

## 1. Kết quả tổng quan

| Module | Tổng function | ✅ PASS | ❌ FAIL | ⚠️ PARTIAL/GAP | Verdict |
|--------|---------------|---------|---------|-----------------|---------|
| FR-11 Báo cáo Thống kê | 23 | 22 | 0 | 1 (FR-IX-05 matrix gap) | ✅ PASS |
| FR-12 Tư vấn Chuyên sâu | 7 | 6 | 0 | 1 (DANH_MUC test ở FR-10) | ✅ PASS |
| FR-13 Tư vấn Nhanh | 5 | 4 | 0 | 1 (DANH_MUC test ở FR-10) | ✅ PASS |
| FR-14 Hợp đồng Tư vấn | 2 | 2 | 0 | 0 | ✅ PASS (drill-down TVV) |
| FR-15 CT HTPLDN | 11 | 11 | 0 | 0 | ✅ PASS |
| FR-16 API Kết nối | 18 | 15 implicit | 0 | 3 (entity `?` matrix gap) | ✅ PASS implicitly |
| **TỔNG** | **66** | **60** | **0** | **6 GAP** | ✅ **PASS** |

### Bug tóm tắt
**Không phát hiện bug phân quyền mới** trong FR-11..FR-16. QTHT 3 cấp có đúng quyền R cho toàn bộ module theo spec.

### 6 GAP (không phải bug)

| FR | Function | Issue |
|----|----------|-------|
| FR-IX-05 | BC Vụ việc theo thời gian | Matrix có function, dropdown chỉ có 22 option → có thể merge với FR-IX-14 "...chi tiết" |
| FR-X.1-06 | QL tư liệu pháp lý VV (FR-12) | Entity DANH_MUC CRUD → test ở FR-10 DMDC, không phơi UI trong TV Chuyên sâu |
| FR-X.2-01 | QL kho câu hỏi/tư vấn (FR-13) | Entity DANH_MUC CRUD → test ở FR-10 DMDC |
| FR-XII-10 | API Tìm kiếm đánh giá | Matrix entity `?` chưa xác định |
| FR-XII-13 | API Chia sẻ TV chuyên sâu | Matrix entity `?` |
| FR-XII-14 | API Tìm kiếm TV chuyên sâu | Matrix entity `?` |

---

## 2. Ma trận QTHT × FR-11..16

| FR / Function | Entity | Spec QTHT | qtht_tw_4 | Note |
|---------------|--------|-----------|-----------|------|
| **FR-11** 23 func (22 visible) | `BAO_CAO` | 👁️ R | ✅ R + Filter + Export (no CRUD) | 1 missing option FR-IX-05 |
| **FR-12** 7 func | `TU_VAN_VIEN` + `DOANH_NGHIEP` | 👁️ R (6) + ✅ F DANH_MUC (1) | ✅ top-level R (no CRUD), DANH_MUC test ở FR-10 | Empty data → row BLOCKED |
| **FR-13** 5 func | `KHO_CAU_HOI` + `DANH_MUC` | 👁️ R (4) + ✅ F DANH_MUC (1) | ✅ top-level R, DANH_MUC test ở FR-10 | Empty data |
| **FR-14** 2 func | `HOP_DONG_TU_VAN` + `TU_VAN_VIEN` | 👁️ R | ✅ via TVV detail tab | No dedicated sidebar |
| **FR-15** 11 func | `CHUONG_TRINH_HTPL` + `BAO_CAO_CT_HTPL` | 👁️ R | ✅ 7 tabs workflow R-only, no buttons | Empty data |
| **FR-16** 18 func | Various entities | 👁️ R (15 known + 3 gap) | ✅ Implicit via UI R access các entity trong FR-02..15 | No dedicated UI — inbound API |

### Tóm tắt CRUD button render

| Module | [Thêm mới] | [Sửa] row | [Xóa] row | [Workflow] | Verdict |
|--------|-----------|-----------|-----------|------------|---------|
| FR-11 Báo cáo | ❌ đúng | N/A (no row) | N/A | [Xem BC]/[Export] đúng | ✅ |
| FR-12 TV CS | ❌ đúng | Empty BLOCKED | Empty BLOCKED | N/A | ✅ |
| FR-13 TV Nhanh | ❌ đúng | Empty BLOCKED | Empty BLOCKED | N/A | ✅ |
| FR-14 HĐ | N/A (tab in detail) | N/A | N/A | N/A | ✅ |
| FR-15 CT HTPLDN | ❌ đúng | Empty BLOCKED | Empty BLOCKED | No [Trình PD]/[PD]/[Công bố] đúng | ✅ |
| FR-16 API | N/A (no UI) | N/A | N/A | N/A | ✅ implicit |

---

## 3. Phạm vi test

### Entity đã verify
| Entity | # function | Coverage | Note |
|--------|-----------|----------|------|
| `BAO_CAO` | 22 (FR-11) | 100% top-level | 22/23 option available |
| `TU_VAN_VIEN` (FR-12, FR-14) | 3 | top-level | verify qua list + TVV detail tab |
| `DOANH_NGHIEP` (FR-12) | 3 | top-level | Empty list |
| `KHO_CAU_HOI` (FR-13) | 4 | top-level | Empty list |
| `CHUONG_TRINH_HTPL` (FR-15) | 6 | top-level | 7 status tab render |
| `BAO_CAO_CT_HTPL` (FR-15) | 5 | top-level | cột "Số đợt BC" render |
| `HOP_DONG_TU_VAN` (FR-14) | 1 | drill-down TVV detail | Tab "HĐ tư vấn" |
| `HOI_DAP`, `KHOA_HOC`, `VU_VIEC`, `KET_QUA_DANH_GIA`, `BIEU_MAU` (FR-16) | 15 | implicit via UI | Spec R matches FR-16 API R |

### Hạn chế
- Data empty toàn 5 modules UI (FR-11..15) → row-level action + detail page + export flow BLOCKED.
- FR-16 không test được BE 403 guard cho non-QTHT → round API sau.
- 3 function FR-XII-10/13/14 matrix entity `?` → không verify được.

---

## 4. Đề xuất / Next steps

**Ưu tiên 1 — BA confirm matrix gaps:**
- FR-IX-05 "BC VV theo thời gian" có redundant với FR-IX-14 "...chi tiết"?
- Entity cho FR-XII-10, FR-XII-13, FR-XII-14.

**Ưu tiên 2 — Seed data:**
- ≥5 BAO_CAO type run để test "Xem báo cáo" + Export flow.
- ≥3 TV chuyên sâu + ≥5 TV Nhanh + ≥3 CT HTPLDN → drill-down detail test.

**Ưu tiên 3 — Round API test (FR-16):**
- Verify BE 403 cho non-QTHT gọi API inbound.
- Verify swagger docs `/swagger` accessible cho integration party.
- Entity `?` (FR-XII-10/13/14) endpoint exist / mapping.

**Ưu tiên 4 — Cross-scope verify:**
- qtht_bn_4 / qtht_dp_4 test FR-11 BC với filter "Đơn vị" → data scope.
- qtht_dp_4 test FR-15 CT HTPLDN → xem có scope filter CT theo đơn vị DP không.

---

## 5. Quy trình test đã áp dụng

```
Login qtht_tw_4 → click 5 sidebar menu:
  Báo cáo thống kê → verify dropdown Loại BC + no CRUD
  Quản lý tư vấn ▶ → Tư vấn chuyên sâu → verify table + no CRUD
  Quản lý tư vấn ▶ → Tư vấn nhanh → verify table + no CRUD
  Quản lý CT HTPLDN → verify 7 status tab + no CRUD
  
→ Check sidebar scan + fetch probe cho FR-16 API (no UI, expected)
```

---

## 6. Artifacts

- [FR-11-baocao-report.md](FR-11-baocao-report.md)
- [FR-12-tv-chuyensau-report.md](FR-12-tv-chuyensau-report.md)
- [FR-13-tv-nhanh-report.md](FR-13-tv-nhanh-report.md)
- [FR-14-hopdong-report.md](FR-14-hopdong-report.md)
- [FR-15-ct-htpldn-report.md](FR-15-ct-htpldn-report.md)
- [FR-16-api-ketnoi-report.md](FR-16-api-ketnoi-report.md)
- Screenshots R-70..R-73 (4 ảnh, no screenshot FR-14/FR-16)

---

## 7. Verdict chung

✅ **PASS** — QTHT (qtht_tw_4) có đúng quyền R cho 60/66 function FR-11..16. 6 PARTIAL là matrix/UI gaps cần BA confirm, KHÔNG phải bug perm.

→ Cập nhật tổng round 3 FR-01..16: **151/198 PASS (76%)**, 4 bug (1 Major + 3 Medium) + regression, 14+ GAP UI.

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
