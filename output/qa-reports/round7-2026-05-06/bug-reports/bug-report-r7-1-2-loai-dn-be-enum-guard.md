# Bug Report — DM Loại Doanh nghiệp (R7.1.2)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (huongttt) |
| **Ngày** | 2026-05-06 |
| **Loại test** | Seed / Functional |
| **Round** | Round 7 |
| **Tài liệu tham chiếu** | [todo R7.1.2](../../../../tasks/todo.md) · [seed-checklist-r7-1-2-loai-dn](../seed/seed-checklist-r7-1-2-loai-dn.md) · [SRS FR-VII-01 §Inputs row 7-8](../../../../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md) |

---

## Tổng hợp

Phát hiện **1** lỗi BE chặn seed 4 record loại hình DN (TNHH/CP/DNTN/HKD) cho danh mục `LOAI_DOANH_NGHIEP`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 0        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-LOAI-DN-002 | Major | P1 | Data | R7.1.2 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` §Inputs row 7 (`loai_doanh_nghiep_id` FK → DANH_MUC) + row 8 (`quy_mo` enum SIEU_NHO/NHO/VUA) | BE enum guard nhầm scope `quy_mo` sang DM `LOAI_DOANH_NGHIEP` — chặn seed 4 loại hình pháp lý | Open |

---

## BUG-LOAI-DN-002 — BE chặn 4 loại hình DN (TNHH/CP/DNTN/HKD) cho DM Loại doanh nghiệp

### Mô tả

QTHT (`qtht_01`) thêm record `TNHH/Công ty TNHH` qua UI modal "Thêm mới danh mục" tại tab "Loại doanh nghiệp" (`/quan-tri/danh-muc/LOAI_DOANH_NGHIEP`). Hệ thống trả lỗi toast "Dữ liệu không hợp lệ", tương ứng API `POST /api/v1/danh-muc` trả 422 với message `Mã 'TNHH' không hợp lệ cho loại danh mục 'LOAI_DOANH_NGHIEP'. Chỉ chấp nhận: DN_SIEU_NHO, DN_NHO, DN_VUA.` Lặp lại với `CP/DNTN/HKD` cùng kết quả. BE đã hardcode validator gắn enum `quy_mo` (SRS row 8) vào DM `LOAI_DOANH_NGHIEP` (SRS row 7) — 2 field độc lập theo spec.

### Các bước tái hiện

1. Login `qtht_01` / `Secret@123` → OTP `666666`.
2. Navigate sidebar `Quản trị hệ thống` > `Danh mục dùng chung` > tab "Loại doanh nghiệp".
3. Click `[+ Thêm mới]` → modal "Thêm mới danh mục" hiện.
4. Nhập `Mã = TNHH`, `Tên = Công ty TNHH`, giữ Trạng thái `Kích hoạt`.
5. Click `[Đồng ý]`.
6. Quan sát: toast đỏ "Dữ liệu không hợp lệ" + record không được tạo (table vẫn 1-3/3 mục).

### Kết quả mong đợi

- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` line 103-104:
  - row 7 `loai_doanh_nghiep_id` (identifier) FK → DANH_MUC — không enum hardcode trong SRS, mã hợp lệ theo nghiệp vụ pháp lý VN: TNHH/CP/DNTN/HKD.
  - row 8 `quy_mo` (text) enum hardcode `SIEU_NHO/NHO/VUA` — đây mới là field gắn với DN_SIEU_NHO/DN_NHO/DN_VUA.
- BE phải chấp nhận record DM có `ma=TNHH/CP/DNTN/HKD` cho `loaiDanhMuc=LOAI_DOANH_NGHIEP`.
- Acceptance Criteria FR-VIII-01 §Outputs: thêm thành công → record xuất hiện trong list.

### Kết quả thực tế

- UI: toast đỏ `Dữ liệu không hợp lệ` (sau click Đồng ý).
- API: `POST /api/v1/danh-muc` body `{loaiDanhMuc:"LOAI_DOANH_NGHIEP", ma:"TNHH", ten:"Công ty TNHH", thuTu:4, trangThai:"KICH_HOAT"}` → status 422:

```json
{
  "success": false,
  "error": {
    "code": "ERR-VAL-SYS-00-00",
    "message": "Mã 'TNHH' không hợp lệ cho loại danh mục 'LOAI_DOANH_NGHIEP'. Chỉ chấp nhận: DN_SIEU_NHO, DN_NHO, DN_VUA."
  }
}
```

- Lặp với `CP/DNTN/HKD`: cùng status 422 + message tương tự (chỉ đổi tên mã input).
- Hệ quả: `dn_variants[].loai_doanh_nghiep_id` của fixture v2.7.1 không match được DM → R7.2.4 seed 15 DN sẽ FAIL FK validation downstream.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-LOAI-DN-002 — Modal Thêm TNHH bị toast "Dữ liệu không hợp lệ"](image/bug-loai-dn-002-tnhh-rejected-toast.png)

![BUG-LOAI-DN-002 — Table chỉ 3 record (DN_SIEU_NHO/DN_NHO/DN_VUA), thiếu 4 loại hình](../seed/screenshots/r7-1-2-loai-dn-3-of-7-only.png)

**2. API response:**

```json
POST /api/v1/danh-muc
Request body: {"loaiDanhMuc":"LOAI_DOANH_NGHIEP","ma":"TNHH","ten":"Công ty TNHH","thuTu":4,"trangThai":"KICH_HOAT"}

Response (422):
{"success":false,"error":{"code":"ERR-VAL-SYS-00-00","message":"Mã 'TNHH' không hợp lệ cho loại danh mục 'LOAI_DOANH_NGHIEP'. Chỉ chấp nhận: DN_SIEU_NHO, DN_NHO, DN_VUA.","timestamp":"2026-05-06T07:11:24Z"}}
```

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass dev) |
| MailHog | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT Bearer + OTP |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-06 | QA Automation via Claude Code (huongttt)*
