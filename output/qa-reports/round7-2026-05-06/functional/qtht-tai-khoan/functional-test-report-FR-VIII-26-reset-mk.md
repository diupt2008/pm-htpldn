# Functional Test Report — R7.7.8c FR-VIII-26 Quên MK / Kích hoạt lần đầu

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000/auth/forgot-password + /reset-password |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 2026-05-07 |
| **Loại test** | Functional FR-VIII-26 |
| **Round** | Round 7 — R7.7.8c |
| **Tool** | Chrome DevTools MCP + MailHog |
| **Account** | test.r778b@example.com (DN tạo từ R7.7.8b) |
| **SRS** | FR-VIII-26 line 1248-1318 |
| **2-source verify** | ✅ NotebookLM + grep SRS local |

---

## Tổng hợp

**Verdict:** ⚠️ **PASS 6/7 + 1 defer + 2 Critical FE missing pages** — BE endpoints đầy đủ và work đúng, nhưng FE pages Quên MK / Reset MK chưa implement → user KHÔNG thể tự reset MK qua UI.

### Test result

| TC | Path | Verdict |
|---|---|---|
| **TC01** | Activate kích hoạt lần đầu (DN qua link mail) | ✅ PASS — POST /verify-email 200, TK CHO_KICH_HOAT → HOAT_DONG, login OK |
| **TC02** | Quên MK 30p HOAT_DONG (BE happy) | ✅ PASS — POST /forgot-password 200 + /reset-password 200 |
| **TC03** | Token expired (30p TTL reset) | 🚫 DEFER — cần SQL backdate `token_het_han` (P2) |
| **TC04** | Token reuse → ERR-PWD-04 | ✅ PASS — BE 400 reject |
| **TC05** | Neutral message email không tồn tại | ✅ PASS — BE returns "Nếu email tồn tại..." anti-enumerate |
| **TC06** | MK yếu → ERR-PWD-05 | ✅ PASS — BE 422 message strength |
| **TC07** | MK confirm khác → ERR-PWD-06 | ✅ PASS — BE 422 "Mật khẩu xác nhận không khớp" |

---

## TC01 — Activate kích hoạt lần đầu DN

**Setup:** DN từ R7.7.8b (TK `fd10f07c-...` CHO_KICH_HOAT).

**Action:** Click link kích hoạt từ MailHog: `http://localhost:3000/auth/verify-email?token=c850063d-329a-4f76-bba9-43fa98ec2a5c`.

**Result BE:**
```
POST /api/v1/auth/verify-email
Status: 200
Response: {"trangThai":"HOAT_DONG","message":"Tài khoản đã được kích hoạt..."}
```

**Verify login:**
- Username = MST `1234567893`
- Password = `Test@123!` (đã đặt khi register)
- Login → 200 + OTP step → dashboard render với role "DN"

→ ✅ PASS. SM-TAIKHOAN: CHO_KICH_HOAT → HOAT_DONG đúng SRS line 2118.

**Note:** SRS FR-VIII-26 quote workflow đặt MK lần đầu qua link reset; nhưng FR-VIII-22 self-reg DN đã set MK ngay tại form register → FE chỉ cần verify-email confirm. Hai workflow merge OK.

---

## TC02 — Quên MK happy path (BE)

**Action 1 — Request reset:**
```
POST /api/v1/auth/forgot-password
Body: {"email":"test.r778b@example.com"}
Status: 200
Response: {"message":"Nếu email tồn tại, link đặt lại mật khẩu đã được gửi."}
```

**MailHog verify:** Mail "Đặt lại mật khẩu" gửi với link `/reset-password?token=f67e2618-...`.

**Action 2 — Submit new MK:**
```
POST /api/v1/auth/reset-password
Body: {"token":"f67e2618-...", "newPassword":"NewPwd@2026", "newPasswordConfirm":"NewPwd@2026"}
Status: 200
Response: {"message":"Mật khẩu đã được đặt lại thành công"}
```

→ ✅ PASS BE happy. Token vĩnh viễn / 30p chưa verify (TC03 defer).

**🚨 BUT FE BLOCKED:**
- Click link "Quên mật khẩu?" trên /login → redirect /login (không mở form)
- Navigate trực tiếp `/auth/forgot-password` → redirect /login
- Click link reset MK trong mail `/reset-password?token=X` → redirect /login

→ FE pages Quên MK + Reset MK CHƯA implement. Logged 2 Critical bugs.

---

## TC03 — Token expired (30p)

**Status:** 🚫 DEFER P2.

**Reason:** Cần SQL `UPDATE TAI_KHOAN SET token_het_han = NOW() - INTERVAL '31 minutes' WHERE email = 'test.r778b@example.com'` để backdate token, sau đó test reset → expect ERR-PWD-03 "Link đã hết hạn".

UI test không khả thi (chờ 30 phút real-time không hiệu quả).

---

## TC04 — Token reuse → ERR-PWD-04

**Setup:** Sau TC02 đã dùng token f67e2618 để reset MK → 200.

**Action:** Probe lại với cùng token + MK khác:
```
POST /api/v1/auth/reset-password
Body: {"token":"f67e2618-...", "newPassword":"AnotherPwd@99"}
Status: 400
Response: {"code":"ERR-AUTH-RESET-01","message":"Link đặt lại mật khẩu không hợp lệ"}
```

**Findings:**
- ✅ Reuse rejected (token chỉ dùng 1 lần per SRS line 1287)
- ⚠️ errCode `ERR-AUTH-RESET-01` ≠ SRS `ERR-PWD-04`
- ⚠️ Message "Link không hợp lệ" — SRS quote "Link đặt mật khẩu đã được sử dụng. Vui lòng yêu cầu link mới" rõ hơn về ngữ cảnh

→ Logged BUG-FR26-001 (Minor errCode + message mismatch).

---

## TC05 — Neutral message anti-enumerate

**Action:** Probe forgot-password với email không tồn tại:
```
POST /api/v1/auth/forgot-password
Body: {"email":"nonexistent@nowhere.test"}
Status: 200
Response: {"message":"Nếu email tồn tại, link đặt lại mật khẩu đã được gửi."}
```

→ ✅ PASS. Match SRS line 1297 quote ERR-PWD-01 INFO "Nếu email đã đăng ký, link đặt mật khẩu sẽ được gửi đến hộp thư của bạn" (intent — message slightly khác chữ).

---

## TC06 — MK yếu → ERR-PWD-05

**Action:**
```
POST /api/v1/auth/reset-password
Body: {"token":"3be943c4-...", "newPassword":"weak123"}
Status: 422
Response: {"message":"Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 chữ số và 1 ký tự đặc biệt"}
```

→ ✅ PASS. Match SRS line 1271 quote MK strength rule. errCode `ERR-VAL-SYS-00-01` ≠ SRS `ERR-PWD-05` (logged BUG-FR26-001).

---

## TC07 — MK confirm khác → ERR-PWD-06

**Action:**
```
POST /api/v1/auth/reset-password
Body: {"token":"3be943c4-...", "newPassword":"NewPwd@2026", "newPasswordConfirm":"Different@99"}
Status: 422
Response: {"code":"ERR-VAL-VIII-CP-04","message":"Mật khẩu xác nhận không khớp"}
```

→ ✅ PASS message khớp SRS ERR-PWD-06. errCode mismatch.

---

## Bug Summary Table

| Bug ID | Severity | SRS Ref | Title | Status |
|---|---|---|---|---|
| BUG-FR26-FE-01 | **Critical** | FR-VIII-26 line 1278 + AC | FE chưa implement page Quên mật khẩu — `/auth/forgot-password` redirect /login. User KHÔNG tự reset MK qua UI được, chỉ qua API direct | Open |
| BUG-FR26-FE-02 | **Critical** | FR-VIII-26 line 1282-1284 + AC | FE chưa implement page Reset mật khẩu — `/reset-password?token=X` redirect /login. User click link mail không vào được form đặt MK | Open |
| BUG-FR26-001 | Minor | FR-VIII-26 §Error Handling line 1295-1303 | errCode mismatch — BE `ERR-AUTH-RESET-01` ≠ SRS `ERR-PWD-04`; BE `ERR-VAL-SYS-00-01` ≠ SRS `ERR-PWD-05/06`; BE `ERR-VAL-VIII-CP-04` ≠ SRS `ERR-PWD-06` | Open |

**Bug file riêng:** [bug-report-function-r7-7-8c-reset-mk.md](../../bug-reports/qtht-tai-khoan/bug-report-function-r7-7-8c-reset-mk.md)

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|---|---|
| URL FE | `/auth/forgot-password` (404/redirect) · `/reset-password?token=X` (redirect) |
| URL BE | `/api/v1/auth/forgot-password` (POST 200) · `/api/v1/auth/reset-password` (POST 200) · `/api/v1/auth/verify-email` (POST 200) |
| MailHog | http://103.172.236.130:8025 |
| TK test | DN MST `1234567893` HOAT_DONG sau TC01 |
| Tokens used | `c850063d-...` (verify-email TC01) · `f67e2618-...` (reset TC02 used) · `3be943c4-...` (reset TC06/07 unused) |

---

*Functional test report generated: 2026-05-07 | QA Automation via Claude Code | 2-source verify NotebookLM + SRS local*
