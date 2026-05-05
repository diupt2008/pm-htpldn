# Đề xuất UX — DN-007: Bổ sung toast khi chặn xóa DN có vụ việc đang xử lý

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Doanh nghiệp (Module 7.7) |
| **Test case liên quan** | DN-007 — Xóa DN có VV → bị chặn |
| **SRS Reference** | BR-GUARD-02, [`srs-fr-07-doanh-nghiep.md`](../../../../input/srs-v3/srs-fr-07-doanh-nghiep.md) |
| **Báo cáo gốc** | [`functional-test-report-DoanhNghiep.md` §4.2](functional-test-report-DoanhNghiep.md) |
| **Môi trường tái hiện** | http://103.172.236.130:3000/ |
| **Tài khoản test** | `cb_nv_tw_01 / Secret@123` |
| **Mức độ** | UX improvement (không phải bug — guard hoạt động đúng spec) |
| **Người gửi** | QA Automation via Claude Code |
| **Ngày** | 2026-05-05 |

---

## 1. Tóm tắt

Guard BR-GUARD-02 (chặn xóa DN có vụ việc đang xử lý) đang hoạt động đúng ở backend — DN không bị xóa khi có VV. Tuy nhiên **UI không hiển thị thông báo nào** sau khi user click "Xóa" → user không biết tại sao thao tác không có hiệu lực, dễ click lặp lại.

**Đề xuất:** thêm toast/notification kiểu error sau khi BE từ chối xóa, nội dung gợi ý:

> **"Không thể xóa doanh nghiệp đang có vụ việc hỗ trợ pháp lý."**

---

## 2. Hiện trạng quan sát

| Hạng mục | Thực tế |
|---------|---------|
| BE chặn delete | ✅ Đúng — DN000028 (Số lần HT=2) vẫn còn nguyên sau confirm xóa |
| Network log | ❌ **KHÔNG thấy** request `DELETE /api/v1/doanh-nghieps/{id}` (BE block silent hoặc FE chặn trước khi gọi) |
| Toast/notification | ❌ **KHÔNG hiển thị** — dialog đóng xong list refresh, không có feedback |
| Console error | (chưa observed — cần dev kiểm tra log BE) |

→ **User experience gap:** user không biết hệ thống đã từ chối, có thể nghĩ thao tác bị treo và click lại nhiều lần.

---

## 3. Thao tác tái hiện (step-by-step)

### Pre-conditions
- App URL: http://103.172.236.130:3000/
- Login với `cb_nv_tw_01 / Secret@123` (OTP bypass `666666`)
- Đã có ít nhất 1 DN với cột "Số lần HT" > 0 (vd `DN000028` Số lần HT=2 trên môi trường hiện tại)

### Các bước

| Bước | Thao tác | Quan sát hiện tại |
|------|---------|-------------------|
| 1 | Sau khi login, vào sidebar → click menu **"Doanh nghiệp"** → **"Danh sách doanh nghiệp"** | Trang `/doanh-nghiep/danh-sach` mở, render bảng 50 DN |
| 2 | Trong bảng, tìm dòng `DN000028` (cột "Mã doanh nghiệp"). Cột "Số lần HT" hiện giá trị **2** | OK — đây là DN có vụ việc đang xử lý |
| 3 | Trên dòng `DN000028`, click icon **"Xóa"** (icon thùng rác ở cột thao tác cuối) | Dialog confirm hiện: *"Xóa doanh nghiệp? Bạn có chắc muốn xóa doanh nghiệp này không?"* với 2 nút **Hủy** / **Xóa** |
| 4 | Click nút **"Xóa"** trong dialog confirm | Dialog đóng. List refresh. **DN000028 vẫn còn nguyên** trong danh sách (Số lần HT=2 không đổi) |
| 5 | Quan sát góc trên/dưới màn hình trong 5 giây | ❌ **KHÔNG có toast/notification nào hiện** |
| 6 | Mở DevTools → Network tab → filter `doanh-nghiep` → re-test bước 3-4 | ❌ **KHÔNG thấy request `DELETE /api/v1/doanh-nghieps/{id}`** trong network log |

---

## 4. Hành vi mong đợi sau khi fix

| Bước | Thao tác | Hành vi mong đợi |
|------|---------|------------------|
| 4 | Click "Xóa" trong dialog confirm | (a) FE gọi `DELETE /api/v1/doanh-nghieps/{id}` → BE trả lỗi (vd HTTP 409 Conflict + error code `ERR-DN-DELETE-HAS-VV`)<br>(b) Dialog đóng |
| 5 | Sau khi BE trả lỗi | ✅ Toast error xuất hiện ~3-4 giây với nội dung: *"Không thể xóa doanh nghiệp đang có vụ việc hỗ trợ pháp lý."* |
| 6 | Network tab | ✅ Có request `DELETE /api/v1/doanh-nghieps/{id}` với response error JSON rõ ràng |

---

## 5. Đề xuất triển khai

### Phương án A — BE trả error rõ, FE render toast (khuyến nghị)

1. **BE:** endpoint `DELETE /api/v1/doanh-nghieps/{id}` check pre-condition: nếu DN có ≥1 VV state ≠ `KET_THUC` → trả `409 Conflict` với body:
   ```json
   {
     "error": {
       "code": "ERR-DN-DELETE-HAS-VV",
       "message": "Không thể xóa doanh nghiệp đang có vụ việc hỗ trợ pháp lý.",
       "details": { "soVuViecDangXuLy": 2 }
     }
   }
   ```
2. **FE:** ở handler delete, catch response 4xx → render `message.error(response.data.error.message)` (AntD `message` API).

### Phương án B — FE check trước, không gọi BE

Nếu cột "Số lần HT" đã có sẵn ở list response, FE có thể check trước khi mở confirm dialog → disable nút "Xóa" hoặc đổi confirm dialog thành thông báo "Không thể xóa". Tuy nhiên **A vẫn được khuyến nghị** vì:
- Authoritative check ở BE tránh stale data (FE thấy 0 VV nhưng vừa có VV mới insert).
- Pattern nhất quán với các guard khác trong app.

---

## 6. Acceptance criteria cho dev

- [ ] Click "Xóa" trên DN có VV → toast error hiển thị với text rõ ràng (tiếng Việt, không leak code).
- [ ] Toast tự đóng sau 3-4 giây HOẶC user có thể đóng thủ công.
- [ ] DN không bị xóa khỏi list (giữ nguyên hành vi guard hiện tại).
- [ ] Network log có DELETE request + response 4xx có error code (nếu chọn phương án A).
- [ ] Test lại với DN không có VV (Số lần HT=0) → vẫn xóa được bình thường, có toast success "Xóa doanh nghiệp thành công".

---

## 7. Tham khảo

- SRS: [`srs-fr-07-doanh-nghiep.md`](../../../../input/srs-v3/srs-fr-07-doanh-nghiep.md) — BR-GUARD-02
- Test report: [`functional-test-report-DoanhNghiep.md` §4.2 DN-007](functional-test-report-DoanhNghiep.md)
- Pattern toast tham khảo: các module khác đã có toast error rõ ràng cho guard tương tự (vd HoiDap, VuViec) — có thể reuse style/component.

---

*Document generated: 2026-05-05 | QA Automation via Claude Code*
