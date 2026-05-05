# Hồ sơ cá nhân & Đổi mật khẩu

Tổng hợp các trường thông tin trong trang **Hồ sơ cá nhân** (`/profile`) — gồm tab **Thông tin cá nhân** và form **Đổi mật khẩu** (trong tab **Bảo mật**).

## 1. Hồ sơ cá nhân (Tab "Thông tin cá nhân")

| STT | Tên trường | Ý nghĩa |
|-----|------------|---------|
| 1 | Tên đăng nhập (`username`) | Định danh tài khoản dùng để đăng nhập hệ thống. Chỉ hiển thị, không thể chỉnh sửa. |
| 2 | Email (`email`) | Địa chỉ email của người dùng. Chỉ hiển thị. Với tài khoản VNeID, email được đồng bộ tự động từ VNeID. |
| 3 | Họ tên (`hoTen`) | Họ và tên đầy đủ của người dùng. Bắt buộc nhập, tối đa 200 ký tự. Có thể chỉnh sửa. |
| 4 | Điện thoại (`dienThoai`) | Số điện thoại liên hệ. Không bắt buộc; nếu nhập phải đúng định dạng số di động Việt Nam (`0[3-9]xxxxxxxx`, 10 chữ số). Để trống để xoá. |
| 5 | Vai trò (`vaiTro`) | Danh sách vai trò được gán cho tài khoản. Chỉ hiển thị; do quản trị viên cấp. |

## 2. Đổi mật khẩu (Tab "Bảo mật")

> Áp dụng cho tài khoản đăng nhập nội bộ (`LOCAL`). Tài khoản VNeID không dùng mật khẩu nội bộ — việc đổi mật khẩu thực hiện trên hệ thống VNeID.

| STT | Tên trường | Ý nghĩa |
|-----|------------|---------|
| 1 | Mật khẩu hiện tại (`currentPassword`) | Mật khẩu đang sử dụng, dùng để xác thực trước khi cho phép đổi. Bắt buộc nhập. |
| 2 | Mật khẩu mới (`newPassword`) | Mật khẩu mới muốn đặt. Bắt buộc nhập; tối thiểu 8 ký tự; phải gồm đồng thời chữ hoa, chữ thường và chữ số. |
| 3 | Nhập lại mật khẩu mới (`newPasswordConfirm`) | Xác nhận lại mật khẩu mới. Bắt buộc nhập và phải khớp với "Mật khẩu mới". |

> Sau khi đổi mật khẩu thành công, hệ thống sẽ tự động đăng xuất các phiên đăng nhập trên thiết bị khác.
