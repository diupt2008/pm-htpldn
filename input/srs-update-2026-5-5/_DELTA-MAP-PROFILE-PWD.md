# Delta Map — Profile + Đổi mật khẩu (Hồ sơ cá nhân)

> **Mục đích:** Tóm tắt scope file `srs-update-2026-5-5/ho-so-doi-mat-khau.md` (26 dòng) — module mới user clarify 2026-05-05 (item 5 dev list).
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude

---

## 1. Scope

### Module: Hồ sơ cá nhân `/profile`

2 tab:
- **Tab "Thông tin cá nhân"** — 5 trường: username (R), email (R), hoTen (RW), dienThoai (RW), vaiTro (R)
- **Tab "Bảo mật"** — 3 trường form đổi mật khẩu: currentPassword (Y), newPassword (Y), newPasswordConfirm (Y)

### Field rule

| Field | Editable | Validate |
|---|---|---|
| `username` | Read-only | — |
| `email` | Read-only | VNeID account đồng bộ tự động |
| `hoTen` | Editable | Y, max 200 ký tự |
| `dienThoai` | Editable | Optional, format `0[3-9]xxxxxxxx` 10 số |
| `vaiTro` | Read-only | Do QTHT cấp |
| `currentPassword` | Y | Xác thực trước khi đổi |
| `newPassword` | Y | Tối thiểu 8 ký tự, gồm chữ hoa + chữ thường + số |
| `newPasswordConfirm` | Y | Phải khớp `newPassword` |

### Behavior

- **Sau đổi MK thành công:** auto đăng xuất các phiên đăng nhập trên thiết bị khác.
- **VNeID account:** KHÔNG đổi MK ở đây — đổi trên hệ thống VNeID.

---

## 2. Findings critical — INCONSISTENCY với FR-VIII-26

### Mâu thuẫn 1: Password rule

| Source | Rule |
|---|---|
| `ho-so-doi-mat-khau.md` line 22 | "Tối thiểu 8 ký tự + chữ hoa + chữ thường + số" |
| `srs-fr-10-quan-tri.md` FR-VIII-26 line 1264 | "Tối thiểu 8 ký tự + chữ hoa + chữ thường + số **+ ký tự đặc biệt**" |

→ **Profile đổi MK YẾU HƠN reset MK qua link mail.** Cần BA quyết: thống nhất 1 rule hay giữ 2 rule khác nhau (self-service yếu hơn admin-reset).

### Mâu thuẫn 2: Use case scope

| Use case | Source | Auth |
|---|---|---|
| Đổi MK self-service (user đang login) | `ho-so-doi-mat-khau.md` | Cần `currentPassword` |
| Reset MK (quên + click link mail) | `srs-fr-10-quan-tri.md` FR-VIII-26 | Token URL (không cần currentPassword) |
| Kích hoạt TK lần đầu (TVV/NHT mới) | `srs-fr-10-quan-tri.md` FR-VIII-26 | Token vĩnh viễn |

→ **3 use case khác nhau, dùng 2 entry point**: profile page (self-service) + login page Forgot Password link (reset/kích hoạt). FR-VIII-26 cover 2 use case sau, profile cover use case đầu. **2 file SRS update bù trừ nhau, không trùng lặp.**

### Mâu thuẫn 3: Spec thiếu sót trong file profile

File `ho-so-doi-mat-khau.md` chỉ 26 dòng, **THIẾU**:
- ❌ Acceptance Criteria (Given/When/Then)
- ❌ Error Handling (mã lỗi ERR-* + message)
- ❌ BR ref (BR-AUTH, BR-DATA-05 audit log)
- ❌ Permission matrix (role nào được sửa hoTen/dienThoai? CB nội bộ + DN/TVV/NHT đều được?)
- ❌ Postcondition (audit log entry, notification)

→ **File này KHÔNG đủ làm spec test.** Cần BA cấp version đầy đủ template SRS hoặc QA tự draft test plan dựa trên FR-VIII-15 (Quản lý TK) làm baseline.

---

## 3. Module bị ảnh hưởng

| File SRS | Liên quan | Note |
|---|---|---|
| `srs-fr-10-quan-tri.md` FR-VIII-15 | Quản lý TK | Profile module subset của FR-VIII-15 (tab "Thông tin cá nhân" của user đang login). Verify scope không trùng QTHT quản lý TK. |
| `srs-fr-10-quan-tri.md` FR-VIII-26 | Đổi MK | 2 use case khác (self-service vs reset). KHÔNG mâu thuẫn về workflow nhưng password rule không nhất quán. |

**Không impact module khác** (UI tab profile self-contained).

---

## 4. File QA cần update

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | Verify role mapping cho Profile — CB/DN/TVV/NHT đều có quyền sửa hoTen/dienThoai (own scope) |
| `output/funtion/` | Tạo file mới `7.10b-Profile-DoiMatKhau.md` (subset của FR-10) — hoặc gộp vào 7.10 chính |
| `tasks/todo.md` R7 | Thêm task R7.2.5 "Test Profile + đổi MK self-service" — phụ thuộc R7.2.2 (FR-VIII-26 reset workflow đã PASS để compare) |

---

## 5. Open issues — cần BA confirm

1. **Password rule** — Profile đổi MK 8 ký tự + chữ hoa + chữ thường + số (KHÔNG có ký tự đặc biệt như FR-VIII-26). Nhất quán hay giữ 2 rule?
2. **Permission scope** — DN/TVV/NHT đều được sửa hoTen/dienThoai own scope? Có giới hạn nào không (vd CB nội bộ phải QTHT đổi)?
3. **Audit log** — đổi MK + sửa hoTen ghi vào AUDIT_LOG action gì? `PROFILE_UPDATE` / `PASSWORD_CHANGE`?
4. **VNeID account** không đổi MK ở profile — vậy tab "Bảo mật" có ẩn hoàn toàn cho VNeID user, hay hiển thị disabled với message redirect?
5. **Multi-device session invalidate** — đăng xuất session khác sau đổi MK — implement bằng cách nào (revoke JWT, đổi password version trong DB)?
