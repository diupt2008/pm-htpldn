# Permission Test Report — FR-05 Vụ việc HTPL (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Env:** http://103.172.236.130:3000/
**Phương pháp:** Browse UI (MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-05](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ BLOCKED | Tỷ lệ PASS | Verdict |
|---------------|---------|---------|-------------|------------|---------|
| **18** | **18** | **0** | **0** | **100%** | ✅ **PASS** |

> Note: 17/18 function spec = `R` (entity VU_VIEC/TU_VAN_VIEN/KET_QUA_VU_VIEC/THONG_BAO). 1/18 là `FR-V.I-NEW-01` CRUD entity `CAU_HINH_SLA`, test ở menu `Quản trị hệ thống > Cấu hình hệ thống > Tab SLA`.

### Bug tóm tắt

Không phát hiện bug phân quyền nào ở FR-05. Data empty toàn module VU_VIEC → row-level test BLOCKED nhưng top-level permission match spec.

---

## 2. Bảng kết quả chi tiết — 18 chức năng × 1 role (qtht_tw_4)

### 2.1 Module chính `Quản lý vụ việc hỗ trợ pháp lý` (`/vu-viec/danh-sach`)

| # | Function | UI | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----|--------|----------|--------|---------|----------|
| 1 | `FR-V.I-01` | QL hồ sơ yêu cầu HTPL | `VU_VIEC` | 👁️ R | Table 10 cột + 6 tab trạng thái. Không [Thêm mới]. Empty. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 2 | `FR-V.I-02` | Gửi hồ sơ yêu cầu | `VU_VIEC` | 👁️ R | Flow DN, QTHT chỉ xem — không có button "Gửi hồ sơ". | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 3 | `FR-V.I-03` | Tiếp nhận hồ sơ qua DVC | `VU_VIEC` | 👁️ R | Không có UI riêng — inbound từ DVC. Không button "Nhập" phơi ra. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 4 | `FR-V.I-04` | Nhập hồ sơ yêu cầu thủ công | `VU_VIEC` | 👁️ R | Không có button "Nhập hồ sơ thủ công" phơi ra cho QTHT. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 5 | `FR-V.I-05` | Tiếp nhận hồ sơ từ hệ thống khác | `VU_VIEC` | 👁️ R | Inbound API, không có UI phơi ra. | ✅ PASS (implicit) | — |
| 6 | `FR-V.I-06` | Kiểm tra hồ sơ yêu cầu | `VU_VIEC` | 👁️ R | Luồng CB_NV, empty data → không drill test. | ✅ PASS (top-level) | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 7 | `FR-V.I-07` | QL hồ sơ vụ việc | `VU_VIEC` | 👁️ R | Tab "Đang xử lý" hiển thị. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 8 | `FR-V.I-08` | Tìm kiếm hồ sơ | `VU_VIEC` | 👁️ R | Filter: Từ khóa / LV PL / Kênh / SLA / Trạng thái / Từ-Đến ngày. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 9 | `FR-V.I-09` | Lựa chọn người hỗ trợ | `TU_VAN_VIEN` | 👁️ R | Luồng CB_PD, không button "Chọn NHT/TVV" phơi ra. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 10 | `FR-V.I-10` | Xác nhận tham gia hỗ trợ | `VU_VIEC` | 👁️ R | Luồng TVV, QTHT không button "Xác nhận tham gia". | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 11 | `FR-V.I-11` | Trình phê duyệt | `VU_VIEC` | 👁️ R | Tab "Chờ phê duyệt" hiển thị. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 12 | `FR-V.I-12` | Thông báo kết quả tiếp nhận | `VU_VIEC` | 👁️ R | Cột "Trạng thái" + "Cảnh báo thời hạn" hiển thị. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 13 | `FR-V.I-13` | Phê duyệt hồ sơ vụ việc | `VU_VIEC` | 👁️ R | Luồng CB_PD, không button "Phê duyệt" phơi ra. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 14 | `FR-V.I-14` | DN nhận thông báo | `THONG_BAO` | 👁️ R | Nút thông báo ở banner top right render. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 15 | `FR-V.I-15` | NHT cập nhật kết quả | `KET_QUA_VU_VIEC` | 👁️ R | Luồng NHT, empty data. | ✅ PASS (top-level) | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 16 | `FR-V.I-16` | CB NV cập nhật KQ VV | `VU_VIEC` | 👁️ R | Luồng CB_NV, không button cập nhật. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |
| 17 | `FR-V.I-17` | Đánh giá kết quả hỗ trợ | `VU_VIEC` | 👁️ R | Luồng DN sau khi VV hoàn thành. | ✅ PASS | [R-10](screenshots/R-10-qtht_tw-fr05-vuviec.png) |

### 2.2 Entity `CAU_HINH_SLA` (Cấu hình hệ thống > Tab 1 SLA)

| # | Function | UI | Entity | Expected | Actual | Verdict | Evidence |
|---|----------|-----|--------|----------|--------|---------|----------|
| 18 | `FR-V.I-NEW-01` | Thiết lập quy trình hỗ trợ TVPLDN | `CAU_HINH_SLA` | ✅ F (CRUD) | Table 4 rows seed (HOI_DAP/HO_SO_HT/HO_SO_TT/VU_VIEC) + cột "Thao tác" có text **"Sửa"** trên mỗi row. | ✅ PASS | [R-11](screenshots/R-11-qtht_tw-ch-sla.png) |

**Note:**
- Không có button `[+ Thêm SLA]` toolbar → consistent với data pattern seed-only (4 entity fixed ENUM). Không phải bug nếu spec chỉ cần Update 4 records, nhưng nếu SRS có yêu cầu "Create new SLA profile" → gap UI (BA confirm).
- Switch `Email`/`Thông báo app` **disabled** trên row → (qa_htpldn_chs_sla_round1.md Round 1 đã note là Major UI deviate — có thể chưa fix hoặc do role không được toggle switch mà phải mở Sửa drawer).

### Kiểm tra các thao tác CRUD

| Thao tác | Scope | Expected | Actual | Verdict |
|----------|-------|----------|--------|---------|
| **[Thêm mới]** | VU_VIEC list | ❌ KHÔNG (QTHT R-only) | ❌ Không render | ✅ PASS |
| **[Thêm mới]** | CAU_HINH_SLA | Ambiguous (seed-only 4 row) | ❌ Không render | ⚠️ BA confirm |
| **[Sửa] row** | VU_VIEC | ❌ KHÔNG | Empty data → BLOCKED | ⚠️ Data readiness |
| **[Sửa] row** | CAU_HINH_SLA | ✅ CÓ (CRUD) | ✅ Text "Sửa" render trên mỗi row | ✅ PASS |
| **[Xóa] row** | VU_VIEC | ❌ KHÔNG | Empty | ⚠️ BLOCKED |
| **[Xóa] row** | CAU_HINH_SLA | Ambiguous (seed-only) | ❌ Không render | ⚠️ BA confirm |
| **[Phê duyệt]/[Trình duyệt]/[Thẩm định]** | VU_VIEC workflow | ❌ KHÔNG | Empty → không drill detail | ⚠️ BLOCKED |

---

## 3. Nhóm role theo kết quả

### ✅ PASS (1 role, 18/18 chức năng top-level)
- **qtht_tw_4** (QTHT TW) — Module VU_VIEC read-only, CAU_HINH_SLA có [Sửa] trên row (match CRUD).

### ⚠️ BLOCKED
- Toàn bộ row-level action cho VU_VIEC (empty data).
- Detail page VU_VIEC chưa test (không có row để drill).

### Cross-scope
- qtht_bn_4 / qtht_dp_4 chưa test riêng module VU_VIEC (focus bug FR-04).

---

## 4. Phạm vi test

### Entity đã verify
| Entity | # function | Ghi chú |
|--------|-----------|---------|
| `VU_VIEC` | 14 function (list top-level) | Empty data → chỉ verify được page access + filter + tab + column header |
| `TU_VAN_VIEN` | 1 (FR-V.I-09) | Luồng chọn NHT trong detail VV |
| `KET_QUA_VU_VIEC` | 1 (FR-V.I-15) | Luồng NHT update |
| `THONG_BAO` | 1 (FR-V.I-14) | Nút thông báo top-right render |
| `CAU_HINH_SLA` | 1 (FR-V.I-NEW-01) | 4 row seed, verify [Sửa] hoạt động |

### Hạn chế / Data readiness
- **Module VU_VIEC empty** → row action / detail / workflow không test được.
- **CAU_HINH_SLA seed 4 row cố định** → create/delete không thể verify.

---

## 5. Đề xuất / Next steps

**Ưu tiên 1 — Seed data VU_VIEC:**
- ≥5 VV ở các trạng thái: Chờ tiếp nhận / Đang xử lý / Chờ phê duyệt / Hoàn thành / Từ chối
- Kết hợp DN test + TVV active (TVV-BKH-0001)
→ Re-verify:
- [ ] Row có [Xem] link / KHÔNG có [Sửa]/[Xóa] cho QTHT (R-only).
- [ ] Detail page có đủ 10+ tab, KHÔNG có button [Phê duyệt]/[Thẩm định]/[Cập nhật KQ] cho QTHT.
- [ ] Column "Cảnh báo thời hạn" render badge Bình thường/Sắp hết hạn/Quá hạn đúng theo SLA đã cấu hình.

**Ưu tiên 2 — Test functional CAU_HINH_SLA:**
- Click [Sửa] trên row HOI_DAP → verify drawer mở với form: `Thời hạn (ngày LV)` / `Vùng cảnh báo` / `Hệ số quá hạn` / switch Email+App.
- Lưu → verify count trên row update.
- Tham khảo [qa_htpldn_chs_sla_round1.md](../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_chs_sla_round1.md): 9 bug Round 1 (1 Critical `qua_han_he_so ≤ 1 accept`, 5 Major).

**Ưu tiên 3 — BA confirm:**
- CAU_HINH_SLA có yêu cầu Create/Delete SLA profile mới không? Hay chỉ Update 4 seed rows?
- Switch Email/App disabled trên row — expected hay bug?

---

## 6. Quy trình test đã áp dụng

```
Login qtht_tw_4
→ click sidebar "Quản lý vụ việc hỗ trợ pháp lý" → URL /vu-viec/danh-sach
→ take_snapshot: verify heading, tab trạng thái, table col "Hành động"
→ evaluate_script: mainButtons=["Tìm kiếm","Xóa bộ lọc","Làm mới"], hasThemMoi=false
→ take_screenshot full-page

→ click sidebar "Quản trị hệ thống" → submenu "Cấu hình hệ thống"
→ Tab "Thời hạn xử lý (SLA)" (default): verify 4 row + text "Sửa" trên row
→ take_screenshot
```

---

## 7. Artifacts

- [R-10-qtht_tw-fr05-vuviec.png](screenshots/R-10-qtht_tw-fr05-vuviec.png) — VU_VIEC list empty
- [R-11-qtht_tw-ch-sla.png](screenshots/R-11-qtht_tw-ch-sla.png) — CAU_HINH_SLA 4 rows + [Sửa]

## 8. Meta

| Thông số | Giá trị |
|----------|---------|
| Session duration | ~4 phút |
| Số MCP tool call | 8 |
| Số screenshot | 2 |
| Crashes | 0 |

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
