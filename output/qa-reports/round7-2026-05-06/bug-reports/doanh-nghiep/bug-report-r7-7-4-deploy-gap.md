# Bug Report — Quản lý Doanh nghiệp (R7.7.4 — Deploy gap v3.5)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-05-08 09:55:00 |
| **Loại test** | Functional pre-flight (deploy gap audit) |
| **Round** | Round 7 |
| **Tài liệu tham chiếu** | [`srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md`](../../../../../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md) v3.5 thay đổi #9 + #10 · [7.7-quan-ly-doanh-nghiep.md](../../../../../output/funtion/7.7-quan-ly-doanh-nghiep.md) DN-022/DN-023 |

---

## Tổng hợp

Phát hiện **3** lỗi deploy gap v3.5 chặn DN-022 (multi-select Lĩnh vực KD) + DN-023 (TINH_THANH entity) khi pre-flight audit cho R7.7.4 functional test 17 TC.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 3    | 0        | 2     | 0      | 1     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FR07-DEPLOY-001 | Major | P0 | Data | DN-022 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` Thay đổi #9 (FR-V.III-01 Inputs row 26) | DM `LINH_VUC_KINH_DOANH` rỗng (0 record) + entity DOANH_NGHIEP_LINH_VUC M-N chưa migrate | Open |
| BUG-FR07-DEPLOY-002 | Major | P0 | UI/UX | DN-022 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` Thay đổi #9 + SCR-V.III-02 row 26 | UI Lĩnh vực KD ở form Sửa + filter danh sách vẫn là textbox đơn (chưa multi-select) | Open |
| BUG-FR07-DEPLOY-003 | Minor | P2 | Data | DN-023 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` Thay đổi #10 + FR-VIII-30 NEW + Q9 BA 2026-05-07 | TINH_THANH chưa migrate sang entity E32 riêng — vẫn lookup từ `DANH_MUC.tree?loaiDanhMuc=TINH_THANH` | Open |

---

## BUG-FR07-DEPLOY-001 — DM `LINH_VUC_KINH_DOANH` rỗng (0 record) + entity DOANH_NGHIEP_LINH_VUC M-N chưa migrate

### Mô tả

Khi pre-flight audit form Sửa DN qua MCP, BE trả `/api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_KINH_DOANH` HTTP 200 nhưng `data: []` (0 record). Đồng thời API GET `/api/v1/doanh-nghieps/{id}` trả field `linhVucKinhDoanh: null` ở 23/23 record dạng **string đơn**, KHÔNG phải mảng `linhVucIds[]` theo schema v3.5 #9. Suy ra entity bridge M-N `DOANH_NGHIEP_LINH_VUC` chưa migrate sang BE.

### Các bước tái hiện

1. Login `cb_nv_tw_02` qua MCP, navigate `/doanh-nghiep/danh-sach` → click eye/edit DN bất kỳ (vd `DN-BCT-001`).
2. Trong DevTools tab Network mở, đếm request `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_KINH_DOANH`.
3. Quan sát Response: `{success:true, data:[]}` — 0 record.
4. Mở DN profile API `GET /api/v1/doanh-nghieps/e0000000-0000-4000-8001-000000000003` → kiểm field `linhVucKinhDoanh`.
5. Quan sát: field tồn tại nhưng giá trị `null` (string scalar), KHÔNG có field `linhVucIds[]` hoặc `linhVucs[]` array.

### Kết quả mong đợi

- `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_KINH_DOANH` trả ≥5 record (theo SRS v3.5 #9 + DN-022 spec dropdown nguồn).
- DN response trả field `linhVucIds: [uuid1, uuid2, ...]` (mảng) thay cho `linhVucKinhDoanh: null` (string đơn).
- BE có entity bridge `DOANH_NGHIEP_LINH_VUC` (DN_id, linh_vuc_id) với UNIQUE constraint.

### Kết quả thực tế

- DM `LINH_VUC_KINH_DOANH` rỗng (0 record) — verified qua MCP `evaluate_script` fetch.
- DN response giữ field cũ `linhVucKinhDoanh` (string đơn, null toàn bộ 23/23 DN).
- KHÔNG thấy field `linhVucIds[]`.
- Filter trên trang danh sách DN (`/doanh-nghiep/danh-sach`) hiện textbox tự do (uid `4_20`) — không có dropdown nguồn.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FR07-DEPLOY-001 — Form Sửa DN field Lĩnh vực KD textbox + DN-BCT-001 detail](r7-7-4-edit-form-fields.png)

**2. API response (qua MCP `evaluate_script` 2026-05-08):**

```json
// GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_KINH_DOANH
{"status":200, "success":true, "count":0, "sample":[]}

// GET /api/v1/doanh-nghieps/e0000000-0000-4000-8001-000000000003
{"data":{
  "maDoanhNghiep":"DN-BCT-001",
  "linhVucKinhDoanh": null,         // ← field cũ string đơn
  "tongNguonVon": null,
  ...
  // KHÔNG có field linhVucIds[]
}}
```

So sánh: `LOAI_DOANH_NGHIEP` tree trả 5 record (TNHH/CP/DNTN/HKD/CTHD_TEST). `TINH_THANH` tree trả 63 record. Chỉ riêng `LINH_VUC_KINH_DOANH` rỗng.

---

## BUG-FR07-DEPLOY-002 — UI Lĩnh vực KD trên form Sửa + filter danh sách vẫn là textbox (chưa multi-select)

### Mô tả

UI form Sửa DN (`/doanh-nghiep/{id}/chinh-sua`) field "Lĩnh vực kinh doanh" render là `<input type="text">` đơn (uid `8_69`). UI filter danh sách (`/doanh-nghiep/danh-sach`) cũng render textbox (uid `4_20`). Cả 2 vị trí đáng lẽ phải là multi-select theo SRS v3.5 #9 (FR-V.III-01 Inputs row 26 + SCR-V.III-02 row 26 + SCR-V.III-01 row 10).

### Các bước tái hiện

1. Login `cb_nv_tw_02` qua MCP, navigate `/doanh-nghiep/danh-sach`.
2. Quan sát filter "Lĩnh vực KD" trên header → hiện textbox (uid `4_20`), không phải combobox/dropdown multi-select.
3. Click eye icon DN bất kỳ → vào form Sửa.
4. Cuộn xuống section "Thông tin chung" → field "Lĩnh vực kinh doanh" (uid `8_69`) → hiện textbox đơn `<input>`, không có dropdown multi-select.
5. So sánh với field "Loại doanh nghiệp" (uid `8_55`), "Quy mô" (uid `8_60`), "Ngành nghề" (uid `8_65`), "Tỉnh/Thành phố" (uid `8_82`) → tất cả là combobox `haspopup="listbox"`.

### Kết quả mong đợi

- Form Sửa: field "Lĩnh vực kinh doanh" là multi-select (chip/tag UI cho phép chọn ≥2 lĩnh vực) — theo SRS v3.5 #9.
- Filter danh sách: filter "Lĩnh vực KD" cũng là multi-select dropdown.
- Lưu form: tạo bản ghi `DOANH_NGHIEP_LINH_VUC` (DN_id, linh_vuc_id) với UNIQUE constraint chặn trùng.

### Kết quả thực tế

- Cả 2 vị trí đều là textbox đơn (single-line text input).
- Người dùng chỉ nhập được 1 chuỗi text tự do, không có UI multi-select.
- Submit textbox → BE nhận string vào field `linhVucKinhDoanh` legacy (string đơn).

### Bằng chứng

**1. Ảnh chụp:**

![BUG-FR07-DEPLOY-002 — Form Sửa DN-BCT-001: Lĩnh vực kinh doanh là textbox uid 8_69](r7-7-4-edit-form-fields.png)

![BUG-FR07-DEPLOY-002 — Filter danh sách DN: Lĩnh vực KD là textbox uid 4_20](r7-7-4-baseline-list.png)

**2. Snapshot a11y (extract):**

```text
// Form Sửa (line 8_68-69):
uid=8_68 StaticText "Lĩnh vực kinh doanh"
uid=8_69 textbox "Lĩnh vực kinh doanh"        ← textbox đơn

// So sánh với field multi-source khác:
uid=8_53 StaticText "Loại doanh nghiệp"
uid=8_55 combobox haspopup="listbox"          ← combobox dropdown

// Filter danh sách (line 4_19-20):
uid=4_19 StaticText "Lĩnh vực KD"
uid=4_20 textbox "Lĩnh vực KD"                 ← textbox đơn
```

---

## BUG-FR07-DEPLOY-003 — TINH_THANH chưa migrate sang entity E32 riêng (vẫn ở DANH_MUC tree)

### Mô tả

SRS v3.5 #10 + Q9 BA 2026-05-07 chốt entity TINH_THANH là entity riêng E32 (FR-VIII-30) với schema `{ma, ten, vungMien, trangThai}`, KHÔNG phải `DANH_MUC` loại='TINH_THANH'. Hiện FE form Sửa DN load data từ `/api/v1/danh-muc/tree?loaiDanhMuc=TINH_THANH` → BE chưa migrate sang entity riêng. Endpoint `/api/v1/tinh-thanhs` hoặc `/api/v1/tinh-thanh` 404.

### Các bước tái hiện

1. Login `cb_nv_tw_02`, navigate form Sửa DN bất kỳ.
2. DevTools Network filter URL chứa `tinh-thanh` hoặc `TINH_THANH`.
3. Click dropdown "Tỉnh/Thành phố" trên form.
4. Quan sát request: `GET /api/v1/danh-muc/tree?loaiDanhMuc=TINH_THANH` → 200 (63 tỉnh).
5. Probe endpoint v3.5 mong đợi: `GET /api/v1/tinh-thanhs?pageSize=5` → 404 ERR-SYS-00-04-01 ("Cannot GET /api/v1/tinh-thanhs").

### Kết quả mong đợi

- Có endpoint `/api/v1/tinh-thanhs` riêng (FR-VIII-30 NEW Q9 2026-05-07).
- Schema response chứa field `vungMien` ngoài `ma/ten/trangThai`.
- FE form Sửa DN + filter danh sách + Tab 14 SCR-VIII-01 đều dùng entity riêng này.

### Kết quả thực tế

- Endpoint `/api/v1/tinh-thanhs` HTTP 404.
- FE vẫn dùng `/api/v1/danh-muc/tree?loaiDanhMuc=TINH_THANH` cho dropdown.
- DM tree response không có `vungMien` (chỉ `ma/ten/moTa/thuTu/trangThai/danhMucChaId/duLieuMoRong/version/children`).
- Functional UI: 63 tỉnh render đầy đủ (Hà Nội/HCM/Hải Phòng…) → user-facing OK, nhưng DN-023 verify entity source FAIL.

### Bằng chứng

**1. API probe:**

```json
// MCP evaluate_script 2026-05-08:
{
  "TINH_THANH(via DM tree)": {"status":200, "count":63, "sample":[
    {"ma":"HNI","ten":"Hà Nội"},
    {"ma":"HCM","ten":"TP. Hồ Chí Minh"},
    {"ma":"HPG","ten":"Hải Phòng"}
  ], "keys":["id","ma","ten","moTa","thuTu","trangThai","danhMucChaId","duLieuMoRong","version","children"]}
}

// curl /api/v1/tinh-thanhs:
{"success":false, "error":{"code":"ERR-SYS-00-04-01", "message":"Cannot GET /api/v1/tinh-thanhs"}}
```

**2. Ảnh chụp form Sửa DN (dropdown Tỉnh/Thành):**

![BUG-FR07-DEPLOY-003 — Form Sửa DN: dropdown Tỉnh/Thành dùng DANH_MUC tree](r7-7-4-edit-form-fields.png)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` bypass |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP |
| Tool test | Chrome DevTools MCP (`mcp__chrome-devtools__*`) |
| Account dùng | `cb_nv_tw_02` (CB_NV_TW HOAT_DONG) |
| DN dùng làm sample | `DN-BCT-001` (DNTN Đông Dương BCT, Hà Nội, Siêu nhỏ, CN&XD) |

---

## Phụ lục — Findings KHÔNG log bug

Quá trình audit phát hiện 2 quan sát ban đầu nghi là bug nhưng sau verify KHÔNG phải bug:

1. **HSPL endpoint** — `/api/v1/ho-so-phap-lys` 404 (sai tên), endpoint thực `/api/v1/ho-so-phap-ly-dns?doanhNghiepId=...` 200 OK. Tab "Hồ sơ pháp lý" trên DN profile load data đúng (rỗng do chưa seed → R7.3.4 data gap, KHÔNG phải deploy gap).
2. **VV link DN counter mismatch** — DN-BCT-001 cache `tongSoVuViec=3`. API `GET /vu-viecs?pageSize=5` (no filter) trả 0/5 VV có `doanhNghiepId` ở response shape. Nhưng API `GET /vu-viecs?doanhNghiepId={id}` filter trả đúng 3 record. Nguyên do: BE filter chạy đúng FK internal, response shape không expose field `doanhNghiepId` mà chỉ expose `tenDoanhNghiep` text. Tab "Lịch sử hỗ trợ" KPI hiển thị đúng. KHÔNG phải bug.

---

*Bug report generated: 2026-05-08 09:55:00 | QA Automation via Claude Code (Chrome DevTools MCP)*
