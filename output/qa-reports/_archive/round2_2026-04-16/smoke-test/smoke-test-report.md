# Smoke Test Report — Round 2
**Ngay:** 2026-04-16
**Moi truong:** http://103.172.236.130:3000/
**MailHog (OTP):** http://103.172.236.130:8025
**Account test:** canbo_tw / Test@1234 (Can bo TW, cap TW)

---

## Tong hop Smoke Test

| Module | URL | Pass OK? | Ghi chu loi (neu co) | Screenshot |
|--------|-----|----------|----------------------|------------|
| Login Page | /login | PASS | Trang load OK, form day du, HTTP 200 | 00-login-page.png |
| Login API + OTP | POST /api/v1/auth/login + verify-otp | PASS | Login thanh cong, OTP gui qua MailHog, verify OK | -- |
| Dashboard (Tong quan) | / | FAIL (403) | canbo_tw truy cap / bi redirect sang /403. Sidebar menu hien thi day du | 03-page403-sidebar.png |
| Quan ly Hoi dap PL | /hoi-dap | PASS | Trang load, co content, khong 404/403, khong trang trang | -- |
| Quan ly Chuyen gia/TVV | /chuyen-gia-tvv/danh-sach | PASS | Co bang (ant-table) + tabs (ant-tabs), load OK | -- |
| Quan ly Vu viec HTPL | /vu-viec/danh-sach | PASS | Co bang + tabs, load OK | -- |
| Quan ly Chi tra Chi phi | /chi-tra/danh-sach | PASS (co warning) | Co bang + tabs, nhung detect error element tren trang (co the la thong bao loi nhe) | -- |
| Quan ly Doanh nghiep | /doanh-nghiep/danh-sach | PASS | Co bang, load OK | -- |
| Quan tri He thong | /quan-tri/danh-muc | PASS | Hien thi title "Quan tri he thong", load OK | 06-quantri-ht.png |

**Ket qua: 7/8 PASS, 1 FAIL (Dashboard 403 cho role CB_TW)**

---

## Chi tiet kiem tra

### 1. Login Flow
- **B1:** POST /api/v1/auth/login voi username/password -> tra ve `otpToken` + `maskedEmail`
- **B2:** He thong gui OTP 6 so qua email (MailHog)
- **B3:** POST /api/v1/auth/verify-otp voi otpToken + otpCode -> tra ve accessToken (JWT)
- **Thoi gian:** ~5 giay toan bo flow
- **OTP TTL:** 300 giay (5 phut)

### 2. Sidebar Menu (sau khi dang nhap voi canbo_tw)
Menu hien thi day du 13 muc:
1. Tong quan
2. Quan ly hoi dap phap ly
3. Quan ly dao tao, tap huan (co sub-menu)
4. Quan ly chuyen gia / tu van vien
5. Quan ly vu viec ho tro phap ly
6. Quan ly chi tra chi phi
7. Quan ly doanh nghiep duoc ho tro
8. Danh gia hieu qua ho tro phap ly
9. Quan ly thu vien bieu mau
10. Quan ly tu van (co sub-menu)
11. Quan ly chuong trinh HTPL doanh nghiep
12. Bao cao thong ke
13. Quan tri he thong (co sub-menu)

User info: "Can bo TW / CB_TW" hien thi dung goc tren phai.

### 3. Module Details

| Module | Actual URL | Table? | Tabs? | Title | Redirect? |
|--------|-----------|--------|-------|-------|-----------|
| Hoi dap PL | /hoi-dap | No | No | -- | Ko redirect, co content |
| Chuyen gia/TVV | /chuyen-gia-tvv/danh-sach | Yes | Yes | -- | Auto-redirect to /danh-sach |
| Vu viec HTPL | /vu-viec/danh-sach | Yes | Yes | -- | Auto-redirect to /danh-sach |
| Chi tra | /chi-tra/danh-sach | Yes | Yes | -- | Auto-redirect to /danh-sach |
| Doanh nghiep | /doanh-nghiep/danh-sach | Yes | No | -- | Auto-redirect to /danh-sach |
| Quan tri HT | /quan-tri/danh-muc | No | No | Quan tri he thong | Load danh muc UI |

### 4. Bugs phat hien

| # | Severity | Mo ta | Module |
|---|----------|-------|--------|
| BUG-R2-001 | Minor | Login button ket o "Dang xu ly..." khi password sai, khong hien thong bao loi, khong reset button | Login |
| BUG-R2-002 | Trivial | antd Spin dung prop `tip` (deprecated), nen chuyen sang `description` | Login |
| BUG-R2-003 | Major | Dashboard (/) tra ve 403 cho role CB_TW. CB_TW theo SRS co quyen truy cap Tong quan | Dashboard |
| BUG-R2-004 | Minor | Module Chi tra co error element hien thi tren trang danh sach (can kiem tra them) | Chi tra |

### 5. Phat hien ky thuat

- **Auth flow:** 2-factor (password + OTP email). Token luu trong Zustand memory (khong persist), XSS-safe
- **Route auto-redirect:** Cac module tu dong redirect ve /danh-sach (CG/TVV, Vu viec, Chi tra, DN)
- **Hoi dap:** Khong auto-redirect, render truc tiep tai /hoi-dap
- **CASL permissions:** Dung @casl/ability de quan ly phan quyen client-side
- **Console:** Chi co 1 deprecation warning (antd Spin), khong co JS error nghiem trong

---

## Screenshots

| File | Mo ta |
|------|-------|
| 00-login-page.png | Trang login truoc khi nhap |
| 01-after-login.png | Sau khi click Dang nhap (password sai, dang xu ly) |
| 02-otp-or-result.png | Trang thai login bi treo |
| 03-page403-sidebar.png | Trang 403 voi sidebar menu day du |
| 06-quantri-ht.png | Trang Quan tri He thong (module cuoi) |
