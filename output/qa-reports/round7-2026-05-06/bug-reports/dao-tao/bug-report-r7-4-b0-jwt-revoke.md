# Bug Report — Workflow KH năm (R7.4.B0) — JWT revoke aggressive blocking workflow walk

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA Automation (huongttt via Claude Code) |
| **Ngày** | 2026-05-08 10:08–10:18 |
| **Loại test** | Workflow E2E — SM-KH-DAO-TAO (FR-III-14/15/16) |
| **Round** | R7 |
| **Tài liệu tham chiếu** | [todo R7.4.B0](../../../../tasks/todo.md#r7-4-b0) · [SRS FR-III-14](../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-14) |

---

## Tổng hợp

Phát hiện **2** lỗi env-level block walk workflow KH năm — 1 Critical (JWT/auth-state revoke aggressive), 1 Major (OTP bypass `666666` ngắt sau N lần login đồng tài khoản).

> **Rule log bug (feedback 2026-04-23):** 2 bug đều thuộc env-level, có dấu hiệu cụ thể (HTTP code + memory match) → log đầy đủ. Memory `qa_htpldn_jwt_revoke_aggressive` cần update timing từ "~2 phút" thành "~30s-1 phút sau 1-2 nav events".

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 1        | 1     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| BUG-AUTH-JWT-01 | Critical | P0 | Permission | R7.4.B0 | `FR-VIII-09 §Auth session` (impl) — không có FR cụ thể, infer từ SRS chung | JWT/auth-state revoke <1 phút sau 1-2 nav events block multi-step workflow | Open |
| BUG-AUTH-OTP-02 | Major | P1 | Negative | R7.4.B0 | `FR-VIII-09 §OTP bypass dev-only` (impl) | OTP bypass `666666` reject sau N login đồng tài khoản trong 5 phút (rate-limit ngầm) | Open |

> **Chú thích Type/Severity/Priority:** xem [bug-report-template.md](../../../../template/bug-report-template.md).

---

## BUG-AUTH-JWT-01 — JWT/auth-state revoke <1 phút block multi-step workflow

### Mô tả

Sau login OTP success → reach dashboard, **chỉ cần 1-2 nav events (click sidebar parent + click submenu)** là `auth-store.userInfo` bị clear → next API call trả 401 → FE redirect `/login`. Walk workflow đa-bước (NHAP → CHO_DUYET → DA_DUYET → DA_CONG_KHAI) cần ≥6 click/snapshot/wait per transition × 10 transitions = **không thể hoàn thành 1 transition trọn vẹn**.

### Các bước tái hiện

1. Navigate `http://103.172.236.130:3000/login`, login `cb_nv_tw_02 / Secret@123`, OTP `666666`.
2. Reach dashboard `Tổng quan hệ thống` (URL `/dashboard`) — confirmed OK lần 1.
3. Click sidebar "Quản lý đào tạo, tập huấn" → submenu expand OK.
4. Click submenu "Kế hoạch đào tạo" → wait list `KH-20260508-0001` xuất hiện.
5. **Quan sát:** Sau 1-2 phút từ login (hoặc 3-4 nav clicks), `GET /api/v1/auth/me` trả 401 → FE redirect `/login`. List rỗng (URL = `/login`).
6. Re-login lại đúng tài khoản → cùng pattern: dashboard OK, click 1-2 menu → redirect.

### Kết quả mong đợi

- JWT/refresh token cấp khi login phải có hiệu lực ≥15 phút (theo `exp` claim chuẩn) hoặc ≥thời gian đủ hoàn tất 1 workflow đa-bước (≥10 phút).
- Sau login OTP success, user phải duyệt được toàn bộ module mà không bị logout giữa chừng do BE revoke.

### Kết quả thực tế

- Session dead trong **<1 phút** sau login đối với tài khoản test cùng cấp TW (lặp 4 lần liên tiếp).
- Notif count tăng 51 → 53 → 55 → 60 sau mỗi login → có thể action click trước (ví dụ "Trình duyệt") gửi API success nhưng FE redirect trước khi verify state mới.
- Memory `qa_htpldn_jwt_revoke_aggressive` (R5 T1.B4) ghi nhận "~2 phút" — **timing hiện tại tệ hơn 2-4 lần** so với baseline R5.

### Bằng chứng

**1. Network capture sau Login 1 (`auth/me` trả 401):**

```
reqid=338 GET http://103.172.236.130:3000/api/v1/auth/me [401]
```

**2. Auth state sau redirect:**

```js
// localStorage.getItem('auth-store')
{"state":{"userInfo":null},"version":0}

// sessionStorage = {} (empty)
// document.cookie = "" (httpOnly cookies invisible to JS)
```

**3. Trace timeline:**

| Lần | Thời gian | Action | Kết quả |
|----|----------|--------|---------|
| 1 | 10:08 | Login + Trình duyệt KH-0001 + Confirm dialog | Notif 51→55, redirect /login |
| 2 | 10:10 | Login → click sidebar → click KH submenu | Redirect /login |
| 3 | 10:11 | Login → click sidebar → click submenu | Redirect /login |
| 4 | 10:15 | Login → click sidebar → click submenu | Redirect /login |

### So sánh — *N/A* (không phải bug phân quyền)

---

## BUG-AUTH-OTP-02 — OTP bypass `666666` reject sau N login đồng tài khoản trong 5 phút

### Mô tả

OTP bypass dev-only `666666` đã hoạt động OK trong R7.3.5 seed (10:08 login đầu). Sau **4-5 lần login lại cùng tài khoản `cb_nv_tw_02` trong 5-7 phút** (do BUG-AUTH-JWT-01 buộc relogin), `POST /api/v1/auth/verify-otp` trả **400** dù vẫn nhập `666666`. Có dấu hiệu rate-limit ngầm hoặc bypass auto-disable per-account.

### Các bước tái hiện

1. Login `cb_nv_tw_02` lần đầu (10:08) → OTP `666666` → 200 OK.
2. Sau 4-5 lần login lại trong 5 phút (do session redirect liên tục) → mỗi lần OTP `666666` → vẫn 200 OK lần 2-4.
3. Login lần thứ 5 (10:16) → OTP `666666` → **`POST /api/v1/auth/verify-otp` trả 400** (2 lần liên tiếp).
4. Check MailHog inbox `cb_nv_tw_02@htpldn.test` → **0 email mới** trong khung giờ 10:08-10:16 → email bypass mode hoạt động, không gửi OTP thật. Bypass `666666` lẽ ra vẫn nhận.

### Kết quả mong đợi

- OTP bypass dev-only `666666` áp dụng đồng đều cho mọi lần login cùng tài khoản, không có rate-limit ngầm.
- Hoặc nếu bypass có rate-limit, phải có thông báo rõ tới user (không trả 400 silent).
- Hoặc nếu bypass tắt → MailHog phải có email OTP thật để fallback.

### Kết quả thực tế

- OTP `666666` reject silent với HTTP 400, không có toast/notification giải thích lý do.
- MailHog inbox **không có email mới** → fallback OTP thật không khả dụng.
- Tài khoản `cb_nv_tw_02` **không thể login** trong session sau lần thứ 5.

### Bằng chứng

**1. Network capture login attempt thứ 5 (10:16):**

```
reqid=1033 GET http://103.172.236.130:3000/api/v1/auth/me [401]
reqid=1034 POST http://103.172.236.130:3000/api/v1/auth/login [200]
reqid=1035 POST http://103.172.236.130:3000/api/v1/auth/verify-otp [400]
reqid=1036 POST http://103.172.236.130:3000/api/v1/auth/verify-otp [400]
```

**2. MailHog inbox check:**

```bash
$ curl -s "http://103.172.236.130:8025/api/v2/search?kind=containing&query=cb_nv_tw_02@htpldn.test&limit=5"
{"total":0,"items":[]}
```

Tổng MailHog 32 message, latest từ `2026-05-07 10:36` (hôm trước). Hôm nay (2026-05-08) **không có email nào** sent từ login attempts của cb_nv_tw_02.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000 |
| OTP login | `666666` bypass tạm — fail sau N login |
| MailHog (OTP inbox) | http://103.172.236.130:8025 — không có OTP fallback hôm nay |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT httpOnly cookies + auth-store localStorage `userInfo` |
| Tool test | Chrome DevTools MCP |

---

## Liên quan

- **Memory** `qa_htpldn_jwt_revoke_aggressive` — đã ghi nhận pattern từ R5 T1.B4 (timing "~2 phút"). Bug này confirms pattern + timing tệ hơn 2-4 lần.
- **Task block:** R7.4.B0 ⚠️ partial (1 click "Trình duyệt" KH-0001 chưa verify được state cuối) → R7.3.6 ⏳ chưa unblock được vì cần ≥1 KH năm DA_DUYET/DA_CONG_KHAI mỗi cấp (gate state).
- **Cascade impact:** mọi workflow E2E đa-bước R7.4.A4 / R7.4.A5 / R7.4.B1 / R7.4.B7 / ... đều bị block tương tự. Cần dev fix JWT trước khi tiếp tục Phase 4 Trụ A/B/C/D.

---

*Bug report generated: 2026-05-08 10:18 | QA Automation via Claude Code*
