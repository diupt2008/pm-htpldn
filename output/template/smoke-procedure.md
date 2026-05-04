# Smoke Test Procedure — Template (4 Bước)

> **Đây là TEMPLATE MẪU.** Dùng khi add module mới vào smoke test.
>
> **Cách dùng:**
> 1. Copy file này → lưu vào `output/smoke-specs/<N>-smoke-<module>.md` (số N khớp thứ tự `funtion/7.N-<module>.md` và `input/srs-v3/srs-fr-N-<module>.md` — ví dụ module Hỏi đáp ở srs-fr-02 + funtion/7.2 → file smoke là `6.2-smoke-hoidap.md`)
> 2. Fill metadata module vào bảng Metadata
> 3. Điền ghi chú đặc thù (nếu có)
> 4. Xóa block hướng dẫn này (dòng từ `> **Đây là TEMPLATE MẪU**` đến hết `---` tiếp theo)
>
> **Lưu ý:** File module sau khi copy là **self-contained** — chứa đầy đủ 4 bước bên trong. Khi test chỉ cần đọc 1 file đó.
>
> Khi procedure chung thay đổi → cập nhật template này + sync lại các file smoke hiện có.

---

# [N] Smoke Test — Module [MODULE_NAME]

> Self-contained spec. Đọc file này là đủ để chạy smoke cho module `[MODULE_NAME]`.

---

## Metadata

| Field | Value |
|-------|-------|
| **Module** | `[MODULE_NAME]` ([X.Y]) |
| **Account smoke** | `<USERNAME>` / `<PASSWORD>` (OTP bypass: `666666`) |
| **Menu label sidebar** | `<MENU_LABEL>` |
| **Submenu đích** | `<SUBMENU_LABEL>` *(hoặc `—` nếu menu click trực tiếp ra list)* |
| **Route URL expect** | `<ROUTE_URL>` *(hoặc `(xác nhận khi test lần đầu)` nếu chưa biết)* |
| **Expected tabs/elements (Bước 2b)** | `<LIST_EXPECTED_ELEMENTS>` |
| **SRS Reference** | [`<FILE>`](../../input/srs-v3/<FILE>) |

## Ghi chú đặc thù module
- *(Điền các bẫy đặc thù nếu có: permission đặc biệt, known bug, precondition data, ...)*
- *(Xóa section này nếu không có)*

---

## Pre-check (trước khi mở browse)

- [ ] **Server up:**
  ```bash
  curl -o /dev/null -w "%{http_code}" http://103.172.236.130:3000/
  ```
  Kỳ vọng: `200`. Không thì **STOP**, báo DevOps.

- [ ] **Account chưa bị khóa** — test qua API login:
  ```bash
  curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"<USER>","password":"<PASS>"}'
  ```

  | Response chứa | Ý nghĩa | Action |
  |---------------|---------|--------|
  | `"otpToken"` | Account OK | → Bước 1 |
  | `"tạm khóa"` | Account bị lock 25' | **STOP**, đổi account (xem [test-accounts.csv](../../input/test-accounts.csv)) |
  | `"Invalid credentials"` | Sai password | **STOP**, verify lại |

---

## Bước 1: LOGIN

1. Mở browser → `http://103.172.236.130:3000/`
2. Nhập username + password (theo Metadata)
3. Submit → đợi OTP page → nhập `666666` (dev bypass)
4. Đợi dashboard render (< 5s)
5. Chụp ảnh dashboard → lưu `<module>-login-dashboard.png`

| Kết quả | Action |
|---------|--------|
| ✅ Dashboard load, sidebar menu xuất hiện | → Bước 2 |
| ❌ Toast **"Tài khoản tạm khóa"** | **STOP toàn bộ smoke**. Mark BLOCKED. Báo user đổi account |
| ❌ Toast **"Tên đăng nhập hoặc mật khẩu không đúng"** | **STOP**. Verify password tại `input/test-accounts.csv`. Sai >5 lần → khóa 25' |
| ❌ Page trắng / server 500 | **STOP**. Báo DevOps server down |

---

## Bước 2: VÀO MODULE

### 2a. Verify menu + submenu có trong sidebar

1. Snapshot sidebar (`$B snapshot -i`)
2. Grep xem có label `<MENU_LABEL>` (từ Metadata) trong output không
3. Nếu module có submenu: click `<MENU_LABEL>` → đợi expand → snapshot lại → grep `<SUBMENU_LABEL>`

| Kết quả | Action |
|---------|--------|
| ✅ Menu visible (và submenu visible nếu có) | → 2b |
| ❌ Menu không xuất hiện | Có thể permission chưa cấp cho account — verify role. Nếu role đúng mà vẫn thiếu → **FAIL**, báo FE |
| ❌ Menu có, submenu không hiện khi click | Retry click 1 lần. Vẫn không → **FAIL**, báo FE lỗi expand menu state |

### 2b. Navigate vào module

1. Click submenu đích (hoặc `$B goto <ROUTE_URL>` trực tiếp nếu đã biết URL — stable hơn)
2. Đợi page render (< 5s)
3. Verify URL khớp `<ROUTE_URL>` expect
4. Verify các element expected xuất hiện (tabs / buttons / filter / table header — theo Metadata)
5. Chụp ảnh page → lưu `<module>-page.png`

| Kết quả | Action |
|---------|--------|
| ✅ URL khớp, page render đủ element | → Bước 3 |
| ❌ Click redirect về `/login` | Session hỏng / route guard lỗi → **FAIL**, báo dev |
| ❌ Page trắng / spinner kéo dài >10s | **FAIL**, báo BE (API chậm hoặc 500) |
| ❌ Element expected thiếu nhiều | **FAIL**, note chi tiết vào report |

---

## Bước 3: KIỂM TRA LỖI NGẦM

Tại trang module vừa vào, kiểm tra 3 nguồn:

1. **Console errors** — `$B console --errors`
2. **Network 4xx/5xx** — `$B network` + grep status code 4xx / 5xx
3. **UI toast/banner đỏ** — `$B snapshot` + grep patterns:
   - `"Lỗi"`
   - `"Validation failed"`
   - `"Không thành công"`
   - `"Có lỗi xảy ra"`
   - `"undefined"` (trong field value)

| Kết quả | Verdict |
|---------|---------|
| Tất cả sạch | ✅ PASS |
| Chỉ có warning deprecation hoặc 401 single (auth timing) | ⚠️ WARN — note vào report, không block |
| Console có `TypeError`/`undefined`, hoặc Network ≥1 lỗi 5xx, hoặc UI toast đỏ rõ ràng | ❌ FAIL — ghi log đầy đủ vào bug report |

---

## Bước 4: GHI KẾT QUẢ

1. Copy template report:
   ```bash
   cp output/template/smoke-test-report-template.md \
      output/qa-reports/round{N}/smoke-test/<module>/smoke-test-report.md
   mkdir -p output/qa-reports/round{N}/smoke-test/<module>/screenshots
   ```
2. Điền vào report:
   - Verdict tổng: **PASS / WARN / FAIL / BLOCKED**
   - 2 screenshot (Bước 1 dashboard + Bước 2 page)
   - Log console/network nếu FAIL
3. Nếu FAIL → append bug vào `bug-report-smoke-test.md` (repro + console log + screenshots)

---

## Crash / Retry Rule

Nếu browse bị crash trong bất kỳ bước nào (dấu hiệu: URL về `about:blank`, error `Target page, context or browser has been closed`, hoặc `[browse] The operation timed out` — chi tiết xem [CLAUDE.md Rule 7](../../CLAUDE.md)):

- **Crash lần 1:** cleanup (`$B stop` + pkill playwright/chromium) + retry đúng 1 lần
- **Crash lần 2:** **STOP ngay**, mark BLOCKED, báo user với log + step cuối cùng đã PASS. **KHÔNG retry lần 3, KHÔNG tự chờ 20-30 phút.**

---

## Verdict tổng

| Verdict | Điều kiện | Unlock next phase? |
|---------|-----------|---------------------|
| ✅ **PASS** | 4/4 bước PASS, 0 console error 5xx | Yes — chạy functional/regression |
| ⚠️ **WARN** | 4/4 PASS nhưng có render chậm hoặc warning | Yes — note cải thiện |
| ❌ **FAIL** | ≥1 bước FAIL | No — báo dev, chờ fix, retest |
| 🔒 **BLOCKED** | Browse crash 2 lần / account lock / server down | Skip module round này, escalate |

---

*Template v2.0 | 2026-04-18 | Self-contained — copy cho mỗi module mới*
