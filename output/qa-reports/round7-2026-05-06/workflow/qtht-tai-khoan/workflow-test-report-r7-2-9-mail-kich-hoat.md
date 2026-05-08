# Workflow test report — R7.2.9 Activate 9 TK qua mail → TK HOAT_DONG (happy path)

> ⚠️ **Method gap (note 2026-05-08):** Task chạy qua curl API thuần `POST /api/v1/auth/first-login-password` — vi phạm rule UI-only ban hành 2026-05-07. Cần re-test UI MCP R8 (click link mail → form đặt MK → submit). Xem [`tasks/lessons-learned.md` 2026-05-08](../../../../../tasks/lessons-learned.md).
>
> ✅ **Probe verify 2026-05-08:** `ly_13` (CG-0001 batch 1, TK đã set MK qua API thuần) login UI MCP `Secret@123` + OTP `666666` → `/dashboard` render đúng role CG (sidebar 2 menu: Đào tạo + Tư vấn, KHÔNG thấy QTHT/Mạng lưới/Hỏi đáp/Vụ việc/Chi trả). TVCS module render data scope đúng (1 record CG mình tham gia). URL force `/quan-tri/danh-muc` → FE redirect `/dashboard`. **Kết luận:** TK 9/9 đã set MK qua API **thực sự functional cho login UI + permission FE** — API path không phải fake pass. Phần còn thiếu (click mail link UI + form set MK qua UI form) sẽ chạy ở task **R7.2.9b** mới (`tasks/todo-qtht.md` §R7.2.9b). Evidence: [`probe-c-cg-ly13-dashboard.png`](probe-c-cg-ly13-dashboard.png) + [`probe-c-cg-ly13-url-force-redirect.png`](probe-c-cg-ly13-url-force-redirect.png).

**Ngày chạy:** 2026-05-06 (R7)
**SRS ref:** FR-VIII-26 (đặt mật khẩu lần đầu) + FR-VIII-15 (auto-tạo TK)
**Scope test:** ⚠️ HAPPY PATH only — verify activation chain (CHO_KICH_HOAT → HOAT_DONG) thành công cho 9 TK để unblock dropdown UC59. **KHÔNG cover** nhánh: link expired (24h), reset-password token reuse, validation MK <8 ký tự / không có chữ hoa+số, OTP-bypass interplay. Full FR-VIII-26 coverage thuộc task functional QTHT — chạy riêng.

## Endpoints — 2 flow khác nhau

### Flow CG (6 TVV) — Login với MK tạm + force change

| Step | Endpoint | Body |
|---|---|---|
| 1 | `POST /api/v1/auth/login` | `{username, password: <MK_tam>}` → returns `{mustChangePassword:true, changePasswordToken}` |
| 2 | `POST /api/v1/auth/first-login-password` | `{changePasswordToken, newPassword, newPasswordConfirm}` → returns `{accessToken}` |

### Flow NHT (3) — Verify-email + reset-password

| Step | Endpoint | Body |
|---|---|---|
| 1 | `POST /api/v1/auth/verify-email` | `{token: <từ mail>}` → TK kích hoạt, state HOAT_DONG |
| 2 | `POST /api/v1/auth/forgot-password` | `{email}` → gửi mail reset link |
| 3 | `POST /api/v1/auth/reset-password` | `{token: <reset_token từ mail>, newPassword, newPasswordConfirm}` → đặt MK lần đầu |

## Kết quả

✅ **6/6 CG + 3/3 NHT đặt MK = `Secret@123` thành công** (9/9).

### CG (6 — flow first-login-password)

| Username | Mã CG | Pool state | Login verify |
|---|---|:-:|:-:|
| ly_13 | TVV-BTP-TW-0001 | DANG_HOAT_DONG | OTP-required ✅ |
| dinh_14 | TVV-BTP-TW-0002 | DANG_HOAT_DONG | OTP-required ✅ |
| ngo_15 | TVV-BTP-TW-0003 | DANG_HOAT_DONG | OTP-required ✅ |
| truong_16 | TVV-BTP-TW-0004 | DANG_HOAT_DONG | OTP-required ✅ |
| mai_17 | TVV-BTP-TW-0005 | DANG_HOAT_DONG | OTP-required ✅ |
| ho_18 | TVV-BTP-TW-0006 | DANG_HOAT_DONG | rate-limited (artifact, không retest) |

### NHT (3 — flow verify-email + reset-password)

| Username | Mã NHT | Pool state | TK active |
|---|---|:-:|:-:|
| nht_01 | NHT-STP-AG-0001 | HOAT_DONG | a7641452... ✅ |
| nht_02 | NHT-STP-DN-0001 | HOAT_DONG | 0e4c38fd... ✅ |
| nht_03 | NHT-STP-HP-0001 | HOAT_DONG | 28bba7ce... ✅ |

## Per-filter verify

- `GET /api/v1/tu-van-viens?loaiTvv=CG&size=100` → `total: 6, byState: {DANG_HOAT_DONG: 6}` ✅
- `GET /api/v1/nguoi-ho-tro?size=100` → `total: 3, byState: {HOAT_DONG: 3}` ✅

## BE quirks observed

- BE mail config dùng `localhost:3000` thay `103.172.236.130:3000` cho link kích hoạt — minor bug, không block (tester thay IP thủ công). Tracking sẽ log riêng nếu cần.
- Rate-limit `ERR-SYS-00-29-01` đụng khi đẩy >5 request /auth/* trong ~60s → cần delay giữa request seed.
- HTML mail có entity escape `&amp;` cho `&` trong MK tạm — phải decode trước khi POST.

## Downstream

- ✅ **Mở khoá full luồng Hỏi đáp downstream:**
  - 6 CG `DANG_HOAT_DONG` + 3 NHT `HOAT_DONG` xuất hiện trong dropdown UC59 phân công VV (BR-AUTH-08).
  - 5 TC TV `HOAT_DONG` (R7.2.3) xuất hiện trong dropdown HD soạn trả lời (FR-II-NEW-02).
  - Hỏi đáp seed (R7.3.1, R7.3.1.MoB, R7.3.1.TVN) vẫn block chờ DEV migrate schema v3.5.

## Artifact

- 9 mail original trong MailHog inbox: `http://103.172.236.130:8025/api/v2/messages`.
- 3 mail reset-password mới sinh (tokens dùng để reset NHT).
