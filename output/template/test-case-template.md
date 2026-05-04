 # Test Cases — [UC_CODE]: [Tên Use Case] ([Mã FR])

> **SRS Ref**: [Mã FR], [Mã SCR], Entity [TÊN_BẢNG]  
> **Nguồn**: {{SOURCE MODE — LOCAL: `srs-fr-XX.md` / NOTEBOOKLM: `notebook_id`, session `session_id`}}  
> **Ngày tạo**: [YYYY-MM-DD]

---

| ID | TraceID (Mã SRS) | Tên Test Case | Pre-conditions (Tiền đề) | Test Data (Dữ liệu) | Các bước thực hiện | Kết quả mong đợi | Type (Happy/Negative/Edge) |
|----|-------------------|--------------|---------------------------|----------------------|-------------------|------------------|---------------------------|
| | | | | | | | |

<!-- 
==========================================================
  ⚠️ BẮT BUỘC: SECTION UI FIELD VERIFICATION
==========================================================

  MỖI file test case PHẢI CÓ section "## A. UI FIELD VERIFICATION" ĐẦU TIÊN.
  Section này chứa ít nhất 1 TC per SCR (màn hình) trong scope.
  
  MỤC ĐÍCH: Verify UI hiển thị đầy đủ fields, buttons, columns, input types 
  đúng với SRS §SCR specification — TRƯỚC KHI chạy các TC chức năng.
  
  TEMPLATE TC UI FIELD VERIFICATION:
  ┌──────────────────────────────────────────────────────────┐
  │ ID: TC-[PREFIX]-UI-01                                     │
  │ TraceID: [Mã FR] / [Mã SCR] / UI                        │
  │ Tên: Verify trường thông tin [SCR-X]: N components       │
  │ Steps:                                                    │
  │   1. Mở màn hình tương ứng                               │
  │   2. Kiểm tra TỪNG component so SRS SCR row-by-row       │
  │ Expected (3 nhóm):                                        │
  │   ▸ LAYOUT: breadcrumb, toolbar buttons + điều kiện       │
  │   ▸ FIELDS: tên field, kiểu input, required *, readonly   │
  │   ▸ TABLE: tên cột, thứ tự, kiểu dữ liệu, sort default  │
  │   ▸ NEGATIVE: "Phần tử KHÔNG có" (VD: không có nút Xóa)  │
  │ Type: Happy 🔴                                            │
  └──────────────────────────────────────────────────────────┘
  
  VÍ DỤ THỰC TẾ (module Doanh nghiệp):
  | TC-DN-UI-01 | FR-V.III-01 / SCR-V.III-01 / UI | Verify SCR Danh sách: 
  |   24 components — breadcrumb, toolbar 4 nút, filter 6 ô, table 9 cột, 
  |   pagination 20/page. Phần tử KHÔNG có: nút Xóa hàng loạt.

  LƯU Ý:
  • Luôn đặt Section A. UI FIELD VERIFICATION TRƯỚC các section chức năng
  • Mỗi SCR riêng biệt = 1 TC UI riêng (VD: SCR list ≠ SCR form ≠ SCR wizard)
  • Sub-tab cũng cần TC UI riêng nếu có layout/column khác nhau
  • TC UI luôn là Priority 🔴 Critical — phải pass trước khi test chức năng
  • Khi SRS thiếu SCR chi tiết → ghi "SRS Gap: chưa có SCR cho màn hình X"

==========================================================
  HƯỚNG DẪN SỬ DỤNG
==========================================================

▸ COPY bảng trên để tạo test case. Nhóm các TC theo section:
  ## A. UI FIELD VERIFICATION  ← BẮT BUỘC, luôn là section đầu tiên
  ## B. READ / LIST
  ## C. CREATE
  ## D. UPDATE
  ## E. DELETE
  ... tùy UC.

▸ ID: TC-[PREFIX]-001  (VD: TC-VT-001, TC-TK-001)
▸ TraceID: Ánh xạ 1-1 SRS — KHÔNG tự chế mã (VD: FR-VIII-14 / BR-AUTH-01)
▸ Kết quả mong đợi: BẮT BUỘC verifiable theo SRS — KHÔNG viết chung chung, KHÔNG tự bịa message.

   ────────────────────────────────────────────────────────────
   QUY TẮC CHUNG (áp dụng mọi action)
   ────────────────────────────────────────────────────────────
   Mỗi expected result gồm 3 lớp verify, cite SRS row khi có:

   (1) STATE — Thay đổi DB/backend (entity nào, field nào, giá trị gì, trạng thái nào)
   (2) UI    — Toast/notification/banner: nội dung NGUYÊN VĂN từ SRS §Messages hoặc §Error codes
              (KHÔNG paraphrase. Nếu SRS không ghi rõ → mark "SRS Gap: chưa định nghĩa message")
   (3) PERSIST — Reload/refetch → dữ liệu hiển thị đúng ở list, detail, hoặc nơi tham chiếu (FK)
              + side effects: AUDIT_LOG entry, notification gửi user khác, SLA tính lại, ...

   ────────────────────────────────────────────────────────────
   MẪU THEO LOẠI ACTION
   ────────────────────────────────────────────────────────────

   ▸ CREATE (Thêm mới)
     (1) {Entity} mới lưu DB với {ma/id}=X, các field nhập = đúng input, trạng thái mặc định theo SRS
         (VD: doanh_nghiep.trang_thai = HOAT_DONG theo FR-V.III-01)
     (2) Toast: "<nguyên văn SRS>" (VD: "Thêm doanh nghiệp '{ten}' thành công")
     (3) List reload → record hiện đúng vị trí sort + đủ các cột theo SRS §Outputs;
         AUDIT_LOG: action=CREATE, entity, user, timestamp

   ▸ UPDATE (Sửa)
     (1) Field thay đổi lưu DB đúng giá trị mới; field KHÔNG sửa giữ nguyên;
         updated_at, updated_by cập nhật
     (2) Toast: "<nguyên văn SRS>" (VD: "Cập nhật {entity} thành công")
     (3) Detail/List reload → giá trị mới hiển thị; AUDIT_LOG: action=UPDATE, diff old→new

   ▸ DELETE (Xóa / Vô hiệu hóa)
     - Soft delete: (1) trang_thai=NGUNG_HOAT_DONG hoặc deleted_at set;
                    (2) Toast nguyên văn; (3) Record ẩn khỏi list mặc định, vẫn truy được qua filter "Đã xóa"
     - Hard delete: (1) Record removed; (2) Toast; (3) List không còn record + FK references xử lý theo SRS (cascade/restrict)
     ⚠️ Verify đúng theo loại SRS yêu cầu — KHÔNG tự assume soft hay hard.

   ▸ READ / SEARCH / FILTER
     (1) Query backend đúng param (verify network request)
     (2) Không có toast (read action)
     (3) Kết quả hiển thị: số dòng đúng, sort theo SRS default, filter chỉ trả record match,
         pagination đúng (total, page size theo SRS §Outputs)

   ▸ APPROVE / REJECT / WORKFLOW (chuyển trạng thái)
     (1) trang_thai chuyển đúng state SRS state-machine quy định (VD: DU_THAO → DA_DUYET);
         field người duyệt + ngày duyệt set; SLA tính lại nếu BR-CALC áp dụng
     (2) Toast nguyên văn SRS (VD: "Phê duyệt thành công")
     (3) - Stepper/badge UI cập nhật state mới
         - Record biến mất khỏi queue "Chờ duyệt", xuất hiện ở "Đã duyệt"
         - Notification gửi đến role tiếp theo (nếu SRS quy định)
         - AUDIT_LOG action=APPROVE/REJECT + lý do (nếu reject)

   ▸ UPLOAD / DOWNLOAD / EXPORT
     - Upload: (1) File lưu storage + DB record link; (2) Toast; (3) File hiển thị ở detail, download lại match checksum
     - Export: (1) File generated đúng format (xlsx/pdf); (2) File download mở được;
              (3) Nội dung file: header + rows match data filter hiện tại + đúng cột SRS §Outputs

   ▸ NEGATIVE (validation / authorization / business rule)
     (1) DB KHÔNG thay đổi (verify count trước/sau bằng nhau)
     (2) Error message: NGUYÊN VĂN SRS §Error codes (VD: "ERR-VT-01: Mã vai trò '{ma}' đã tồn tại")
         + mã lỗi hiển thị (nếu SRS quy định)
     (3) UI giữ nguyên trạng thái form (không close modal, không reset field), focus về field lỗi nếu spec yêu cầu

   ▸ EDGE (boundary, concurrent, special char, ...)
     - Nếu SRS có clause → cite + verify đúng (VD: "FR-X-Y row Z: max 255 chars")
     - Nếu SRS KHÔNG có clause → ghi "SRS Gap: <mô tả>" + đề xuất hỏi BA, KHÔNG tự assume behavior

   ────────────────────────────────────────────────────────────
   IRON RULES — TUYỆT ĐỐI KHÔNG
   ────────────────────────────────────────────────────────────
   ❌ "Thêm mới thành công" / "Hiển thị đúng" / "Hoạt động bình thường" — quá generic, không verify được
   ❌ Tự bịa nội dung toast/error message khi SRS không ghi → phải mark "SRS Gap"
   ❌ Bỏ qua AUDIT_LOG / notification side effect khi SRS có quy định
   ❌ Viết "verify dữ liệu đúng" mà không liệt kê field cụ thể cần check
   ❌ Assume soft-delete / hard-delete / cascade khi SRS không nói rõ

▸ File naming: [XX]-TC-[ten-use-case].md (VD: 01-TC-quan-ly-vai-tro.md)
▸ Luôn đi kèm 00-test-plan-overview.md (Business Rules, Error Codes, Gaps)
▸ Edge Case Hunter bổ sung → thêm section cuối file với emoji: 🔴 Critical | 🟡 High | 🟢 Medium
-->
