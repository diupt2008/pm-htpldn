# Bug Report — Chương trình HTPLDN Giai đoạn 1 (FR-XI Workflow)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code via Chrome DevTools MCP) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Workflow E2E (SM-CHUONG_TRINH_HTPL) |
| **Round** | R7.6.4 |
| **Tài liệu tham chiếu** | [`02-thu-tu-module.md §⑤`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · [`srs-fr-15-ct-htpldn.md`](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) · [`workflow-test-report-r7-6-4-cthtpldn-gd1.md`](../../workflow/workflow-test-report-r7-6-4-cthtpldn-gd1.md) |

---

## Tổng hợp

Phát hiện **1** lỗi có SRS reference cụ thể trong quá trình test workflow CT HTPLDN GĐ1. Lỗi block 4/11 transitions (B7-B10) cascade — CT không vào được trạng thái `DANG_THUC_HIEN`, dừng vĩnh viễn ở `DA_DUYET` mặc dù đã đủ điều kiện theo spec.

> **Rule log bug:** Bug log đúng có SRS reference cụ thể (`srs-fr-15-ct-htpldn.md` line 903 + spec FR-XI-01 column "Trường tạo mới").

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 1    | 0        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-CTHTPLDN-B7-001 | Major | P1 | Workflow | R7.6.4 B7 | `srs-fr-15-ct-htpldn.md` row 903 (action-bar Kích hoạt) + `srs-fr-15-ct-htpldn.md` rows 887-898 (form Tab Thông tin) | BE validation `ERR-VAL-XI-06-11` yêu cầu trường không có trong form/spec → block transition `DA_DUYET → DANG_THUC_HIEN` | Open |

---

## BUG-CTHTPLDN-B7-001 — BE chặn activate CT do thiếu `kế hoạch chi tiết` + `đơn vị thực hiện` (trường không có trong spec/form)

### Mô tả

CB NV TW click `[Bắt đầu thực hiện]` trên CT ở trạng thái `DA_DUYET`, BE trả 409 với code `ERR-VAL-XI-06-11` message "Chỉ có thể kích hoạt khi có kế hoạch chi tiết và đơn vị thực hiện". Tuy nhiên SRS FR-XI-01 (rows 887-898 file `srs-fr-15-ct-htpldn.md`) định nghĩa form CT chỉ có 8 trường chính (Mã CT / Tên CT / Mục tiêu / Thời gian bắt đầu / kết thúc / Ngân sách / Đối tượng / File đính kèm / Ghi chú) + Đơn vị auto từ user — **KHÔNG có trường `ke_hoach_chi_tiet` cũng như không có `don_vi_thuc_hien` riêng biệt**. Spec line 903 chỉ điều kiện hiển thị nút Kích hoạt là "khi DA_DUYET hoac DA_CONG_BO", không có pre-condition về 2 trường đó. UI silent (không toast/banner) khi nhận 409 → người dùng không biết lý do.

### Các bước tái hiện

1. Login `cb_nv_tw_01` / `Secret@123` (OTP `666666`) → vào module Quản lý Chương trình HTPLDN.
2. Tạo CT mới với 4 trường bắt buộc (Tên CT / Mục tiêu / Đối tượng / Thời gian bắt đầu) → state `DU_THAO`.
3. Click `[Gửi phê duyệt]` → state `CHO_PHE_DUYET`.
4. Login phụ `cb_pd_tw_01` (cùng cấp TW) → click `[Phê duyệt]` → modal "Phê duyệt chương trình?" → Đồng ý → state `DA_DUYET`. Toast "Phê duyệt thành công".
5. Quay lại `cb_nv_tw_01`, mở CT vừa duyệt → click button `[Bắt đầu thực hiện]`.
6. Modal "Bắt đầu thực hiện? Sau đó có thể tạo đợt báo cáo." hiện → click `[Đồng ý]`.
7. **Quan sát:** Modal đóng. UI **không có toast / banner / message lỗi**. State CT giữ nguyên `DA_DUYET`. DevTools Network cho thấy `POST /api/v1/chuong-trinh-htpls/{id}/activate` trả 409 với body lỗi `ERR-VAL-XI-06-11`. Reproduced 2 lần (reqid=776 lần 1 + reqid=940 lần 2 sau reload F5).

### Kết quả mong đợi

- Theo SRS `srs-fr-15-ct-htpldn.md` line 903 (action-bar row 24): `[DA_DUYET/DA_CONG_BO] Kich hoat ... -> SET DANG_THUC_HIEN | click -> activate | khi DA_DUYET hoac DA_CONG_BO`. Nghĩa là chỉ cần CT ở `DA_DUYET` hoặc `DA_CONG_BO` là đủ điều kiện click → BE phải `SET DANG_THUC_HIEN`.
- Stepper bước 4 "Thực hiện" phải active, button thay đổi sang `[Tạm dừng]` + `[Hoàn thành]`.
- Nếu thực sự cần thêm trường `ke_hoach_chi_tiet` + `don_vi_thuc_hien` thì SRS FR-XI-01 form Tab Thông tin (rows 887-898) phải bổ sung 2 trường đó + thông báo BA + cập nhật MH-CT-01.

### Kết quả thực tế

- BE trả 409 với code `ERR-VAL-XI-06-11`, message "Chi co the kich hoat khi co ke hoach chi tiet va don vi thuc hien".
- FE không hiển thị toast/banner thông báo lỗi → người dùng tưởng modal đã đóng thành công.
- State CT giữ nguyên `DA_DUYET` (verify trên Danh sách CT cột Trạng thái).
- Cascade: B8 (TAM_DUNG), B9 (DANG_THUC_HIEN từ TAM_DUNG), B10 (HOAN_THANH) đều block do không vào được DANG_THUC_HIEN. R7.6.5 (Đợt báo cáo) cũng tiếp tục bị block.

### Bằng chứng

**1. Ảnh chụp:**

![BUG-CTHTPLDN-B7-001 — CT-20260507-0001 stuck DA_DUYET sau click Bắt đầu thực hiện, không toast](../image/r7-6-4-ct1-b7-bug-409-no-toast.png)

![BUG-CTHTPLDN-B7-001 — Danh sách 3 CT cuối round, CT1 vẫn ở Đã duyệt](../image/r7-6-4-list-final-3CT.png)

**2. API request / response:**

```
POST /api/v1/chuong-trinh-htpls/95d2a599-8b3c-458b-b542-ed160ce4c529/activate
Request body: {"version":5}
Response 409:
{
  "success": false,
  "error": {
    "code": "ERR-VAL-XI-06-11",
    "message": "Chi co the kich hoat khi co ke hoach chi tiet va don vi thuc hien",
    "timestamp": "2026-05-07T09:16:02.742Z",
    "requestId": "f806fe93-93f1-47be-a0e9-213c82b2a4cc"
  }
}
```

**Console message:**

```
[error] Failed to load resource: the server responded with a status of 409 (Conflict) [2 times]
```

**SRS verification (2 source):**

- Local SRS `srs-fr-15-ct-htpldn.md`:
  - Line 903 row 24: `[DA_DUYET/DA_CONG_BO] Kich hoat (gop tu MH-15.4) | button + modal | "Bat dau thuc hien" -> modal: "Chuyen sang thuc hien? Sau do co the tao dot BC." -> SET DANG_THUC_HIEN | click -> activate | **khi DA_DUYET hoac DA_CONG_BO**`
  - Lines 887-898 (Trường tạo mới Tab Thông tin): chỉ có 8 trường — KHÔNG có `ke_hoach_chi_tiet` cũng như không tách `don_vi_thuc_hien`. Trường `Don vi` (row 17) là "Auto tu don vi user", read-only.
- Process map `02-thu-tu-module.md` §⑤ line 354: `DA_DUYET / DA_CONG_BO → DANG_THUC_HIEN | cb_nv_<cap>_01 | [Bắt đầu thực hiện] | Xác nhận — sau đó có thể tạo đợt BC | — | SCR-XI-01`. Cũng chỉ có 1 điều kiện guard "Xác nhận", không nhắc 2 trường BE đang yêu cầu.

→ 2-source xác nhận BE tự thêm validation ngoài spec.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | `/api/v1/chuong-trinh-htpls` (số nhiều) |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT (cookie `access_token`) + OTP |
| Tool test | Chrome DevTools MCP |

---

*Bug report generated: 2026-05-07 | QA Automation via Claude Code (Chrome DevTools MCP)*
