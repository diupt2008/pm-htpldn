# Bug Report — Workflow CTĐT (FR-III-01)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code) |
| **Ngày** | 2026-05-02 |
| **Loại test** | Workflow E2E |
| **Round** | R6 R11 |
| **Tài liệu tham chiếu** | [SRS FR-III-01](../../../../input/srs-v3/srs-fr-03-dao-tao.md), [02-thu-tu-module §⑨ FR-03](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md), [todo.md R6.4.B2](../../../../tasks/todo.md) |

---

## Tổng hợp

Phát hiện **1** bug Critical chặn toàn bộ workflow R6.4.B2 (CTĐT `DU_THAO → CHO_DUYET → DA_DUYET`).

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 1        | 0     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-FUNC-CTDT-001 | Critical | P0 | Workflow | R6.4.B2 | `FR-III-01 §Error Handling` (4 ERR-CTDT-01..04, không có ERR-BIZ-III-01-04) + `Phụ lục C.2 SM-KHOAHOC` (guard `DU_THAO → CHO_DUYET` chỉ là "Đủ thông tin bắt buộc") | BE chặn `POST /chuong-trinh-dao-taos/{id}/submit` với `ERR-BIZ-III-01-04 "Không thể gửi phê duyệt chương trình chưa có khóa học nào"` — guard ngoài SRS | Open |

---

## BUG-FUNC-CTDT-001 — BE chặn submit CTĐT khi chưa có khóa học (guard ngoài SRS)

### Mô tả

CB NV TW (`cb_nv_tw_01`) mở chi tiết CTĐT đang ở trạng thái `DU_THAO`, click `[Gửi phê duyệt]` → modal confirm hiện → click `[Gửi phê duyệt]` trong modal. BE trả `422 ERR-BIZ-III-01-04 "Không thể gửi phê duyệt chương trình chưa có khóa học nào"`. CTĐT không chuyển sang `CHO_DUYET`. Áp dụng cho cả 6/6 CTĐT seed `CTDT-BTP-TW-2026-0001..0006` ở phase 3 (R6.3.5) — đều "Chưa có khóa học nào trong chương trình này" theo design phase 3 (entry state CTĐT, KH seed phase 4 R6.4.B2.5).

### Các bước tái hiện

1. Login `cb_nv_tw_01 / Secret@123 / OTP 666666`.
2. Sidebar → Quản lý đào tạo, tập huấn → Chương trình đào tạo. URL `/dao-tao/chuong-trinh/danh-sach`.
3. Tab "Tất cả" — thấy 6 CTĐT trạng thái "Dự thảo" (`CTDT-BTP-TW-2026-0001..0006`).
4. Click "Xem" hàng `CTDT-BTP-TW-2026-0001 — CTĐT 2026 - Pháp luật cho DN nhỏ`.
5. Trang chi tiết (`/dao-tao/chuong-trinh/6f9a8f18-b5ba-4cc1-82c4-e33b8144f4aa`) hiển thị form đầy đủ thông tin + bảng "Khóa học thuộc chương trình" rỗng ("Chưa có khóa học nào trong chương trình này"). 3 nút: `[Lưu nháp]` `[Gửi phê duyệt]` `[Hủy chương trình]`.
6. Click `[Gửi phê duyệt]` → modal `Gửi phê duyệt? — Chương trình sẽ được gửi cho lãnh đạo phê duyệt.` hiện.
7. Click `[Gửi phê duyệt]` (nút focused trong modal).
8. Quan sát: modal đóng, không có toast success, CTĐT vẫn "Dự thảo".

### Kết quả mong đợi

- Theo `SRS FR-III-01 §Error Handling` (4 mã lỗi: ERR-CTDT-01 tên rỗng, ERR-CTDT-02 ngày KT ≤ BĐ, ERR-CTDT-03 xóa CTĐT có KH, ERR-CTDT-04 sửa CTĐT đã duyệt): **không có error code nào yêu cầu CTĐT phải có khóa học để gửi phê duyệt**.
- Theo `Phụ lục C.2 SM-KHOAHOC` bảng transition `DU_THAO → CHO_DUYET`: Guard duy nhất là **"Đủ thông tin bắt buộc"** — không yêu cầu khóa học liên kết.
- Theo `FR-III-01 Inputs CTDT`: trường `so_luong_khoa` ràng buộc `≥ 0` → SRS chấp nhận CTĐT có 0 khóa học.
- → CTĐT trống phải được phép gửi phê duyệt: `DU_THAO → CHO_DUYET`, return 200, audit log ghi.

### Kết quả thực tế

- BE trả `HTTP 422` với code `ERR-BIZ-III-01-04` (không có trong SRS) + message `"Không thể gửi phê duyệt chương trình chưa có khóa học nào"`.
- CTĐT giữ nguyên trạng thái `DU_THAO` (verify qua `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=20` sau action — 6/6 CTĐT vẫn "Dự thảo").
- Workflow chặn: 6/6 CTĐT seed R6.3.5 không thể chuyển sang `CHO_DUYET` → không thể `DA_DUYET` → block toàn bộ R6.4.B2 + downstream R6.4.B2.5 (KH cần CTĐT cha `DA_DUYET` theo dropdown filter SCR-III-02 Tab Thông tin) + R6.4.B7.

### Bằng chứng

**1. Ảnh chụp** *(form CTĐT-0001 sau khi click confirm modal "Gửi phê duyệt", CTĐT giữ nguyên "Dự thảo", không có toast success/error)*:

![BUG-FUNC-CTDT-001 — Modal confirm + form chi tiết CTDT-0001 không có khóa học, sau click confirm vẫn ở Dự thảo](image/bug-flow-ctdt-001-422-no-khoa-hoc.png)

**2. API response** *(network request reqid=600, log từ Chrome DevTools MCP)*:

```text
POST http://103.172.236.130:3000/api/v1/chuong-trinh-dao-taos/6f9a8f18-b5ba-4cc1-82c4-e33b8144f4aa/submit
Status: 422
Request body: {"version":1}
Response body:
```

```json
{
  "success": false,
  "error": {
    "code": "ERR-BIZ-III-01-04",
    "message": "Không thể gửi phê duyệt chương trình chưa có khóa học nào",
    "timestamp": "2026-05-02T09:21:50.911Z",
    "requestId": "5a75c01f-a4bf-4f21-8bd9-b1b630b59dbd"
  }
}
```

**3. SRS verify 2-source (NotebookLM HTPLDN id `e3a2681b-fdd6-4a24-917c-9ed636e8a110` + grep SRS local)** *(consistent — cả 2 nguồn đều confirm SRS không spec guard "≥1 khóa học")*:

- NotebookLM trả lời (citation 1: SM-KHOAHOC table, citation 2: FR-III-01 Inputs row 6 `so_luong_khoa ≥ 0`, citation 3: FR-III-01 Error Handling table 4 row): "ERR-BIZ-III-01-04 không tồn tại trong SRS. CB NV hoàn toàn có thể trình phê duyệt một CTĐT trống."
- Grep local `srs-fr-03-dao-tao.md` line 179-186 Error Handling: 4 mã ERR-CTDT-01..04, không có ERR-BIZ-III-01-04.
- Grep local `02-thu-tu-module.md` không tìm thấy SM table riêng cho CTĐT — apply chung SM-KHOAHOC, guard `DU_THAO → CHO_DUYET` là "Đủ thông tin bắt buộc".

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass mode dev) |
| MailHog (OTP inbox) | http://103.172.236.130:8025/ |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT Bearer (header `authorization`) |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-02 R11 | QA Automation via Claude Code*
