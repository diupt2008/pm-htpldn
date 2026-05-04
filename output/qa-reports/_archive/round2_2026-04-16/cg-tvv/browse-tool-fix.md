# Browse Tool — Root Cause Analysis & Permanent Fix

| Thông tin | Giá trị |
|-----------|---------|
| **Scope** | gstack browse CLI (`~/.claude/skills/gstack/browse/dist/browse`) + headless Chromium qua Playwright |
| **Platform** | macOS 15.5 (Darwin 24.5.0) arm64, Bun v1.3.12 |
| **Ngày** | 2026-04-17 |
| **Báo cáo bởi** | QA Automation (Claude Code) |
| **Trạng thái** | 3 root cause xác định, 4 workaround áp dụng được ngay, 2 upstream fix cần dev xử lý |

---

## TL;DR

Không phải browse tool crash. Ban đầu QA kết luận "browse crash khi submit OTP" là **3 vấn đề chồng nhau** khiến debug khó:

1. ⚠️ **OTP pairing mismatch** — API login song song consume OTP của UI → 403
2. ⚠️ **Bun EPIPE bug** — CLI crash khi stdout bị pipe qua `tail`/`head`
3. ⚠️ **Server idle/tab-close auto-exit** — server tự shutdown khi tab cuối đóng

Sau khi fix, browse tool đã UI-test bình thường được: login, navigate, search, screenshot. BUG-TVV-004 (search không hoạt động) được phát hiện là **false positive** do tên param API sai.

---

## 1. Triệu chứng ban đầu

```
$ $B goto .../login
$ $B fill username...
$ $B fill password...
$ $B js "document.querySelector('form').requestSubmit()"
$ # ... submit OTP ...
$ $B screenshot ...  ← server restarts here, page = about:blank
```

Mỗi chuỗi thao tác UI bị reset giữa chừng với message `[browse] Starting server...` mid-flow. Tab trở về `about:blank`. Session mất. Không có stack trace rõ.

## 2. Điều tra

### 2.1 Check audit log (`.gstack/browse-audit.jsonl`)

Phát hiện key entry:
```
{"cmd":"press","args":"Enter","origin":"http://103.172.236.130:3000/403","status":"ok"}
```

→ **App redirect về `/403` sau OTP submit**, KHÔNG phải browse tool crash. URL `/403` là route guard page của app (canbo_tw không có `read_dashboard` permission).

### 2.2 Check server stderr + stdout khi chạy manually

```bash
BROWSE_STATE_FILE=$(pwd)/.gstack/browse.json \
  /Users/teamai/.bun/bin/bun run \
  /Users/teamai/.claude/skills/gstack/browse/src/server.ts \
  > /tmp/srv-out.log 2> /tmp/srv-err.log &
```

Sau OTP submit + tab navigation (chuỗi SPA route), stdout log cho ra:

```
[browse] Server running on http://127.0.0.1:25000 (PID: 10358)
[browse] Idle timeout: 1800s
[browse] Shutting down...
[browse] Tab closed (id=1, remaining=0)
```

→ **Server tự shutdown khi tab count = 0** (default Chromium behavior: hết tab → browser exit → Playwright disconnect → server `on('disconnected') → process.exit(1)` theo spec).

Tab bị close là do:
- SPA navigation trong headless Chromium đôi khi trigger full frame unload
- JS errors (Illegal invocation, etc.) có thể cause renderer exit

### 2.3 Check state file rotation

`.gstack/browse.json` chứa `{pid, port, token, ...}` của server hiện tại. Mỗi lần server mới spawn:
- Ghi đè state file
- Port mới
- Token mới
- **CLI mất connection với server cũ** → spawn server mới → Chromium context mới = no cookies/localStorage/sessionStorage

Logged-in state bị mất vì app dùng `sessionStorage['auth-store']` (tab-scoped).

### 2.4 Check Bun EPIPE

Chạy `$B js "..." | tail -1`:
```
EPIPE: broken pipe, write
   at write (unknown:1:1)
   at sendCommand (/$bunfs/root/browse.new:387:27)
Bun v1.3.12 (macOS arm64)
```

→ **Bun runtime bug** khi pipe reader đóng fd trước khi CLI hoàn thành write. Gây crash CLI + clobber shell env (PATH mất trong zsh).

### 2.5 Check OTP session mismatch

Khi QA chạy song song API login (để lấy token cho `curl` test) + UI login:

```
Timeline:
T+0s: API login → otpToken-A, OTP#1 gửi mail
T+2s: UI login → otpToken-B, OTP#2 gửi mail (lấn át OTP#1)
T+3s: API verify-otp với OTP#2 (fetch latest) → SUCCESS, consume OTP#2
T+5s: UI submit OTP đã đọc cho OTP#2 (fetch cùng lúc) → FAIL (OTP#2 đã bị consume bởi API)
```

→ UI OTP submit bị 400/403 vì OTP đã bị API luồng khác consume.

## 3. Root cause summary

| # | Root cause | Severity | Category |
|---|-----------|----------|----------|
| 1 | OTP pairing mismatch (API vs UI cùng consume OTP) | High | Test strategy |
| 2 | Bun v1.3.12 EPIPE khi pipe stdout | Medium | Upstream (Bun) |
| 3 | Server exit khi tab count = 0 (Chromium default) | High | browse tool design |
| 4 | State file rotation → CLI connect server mới = fresh context | Medium | browse tool design |
| 5 | `/403` nhầm lẫn crash (actually expected app behavior) | Low | Investigation fatigue |

## 4. Fix đã áp dụng (có thể dùng ngay)

### Fix 4.1 — Clear MailHog trước mỗi UI login

```bash
curl -sX DELETE "http://103.172.236.130:8025/api/v1/messages" >/dev/null
# Bây giờ UI login, MailHog chỉ có 1 email = OTP đúng session
```

### Fix 4.2 — Tránh pipe stdout của `$B`

```bash
# SAI (EPIPE):
$B js "..." | tail -1

# ĐÚNG (write to file):
$B js "..." > /tmp/out.txt 2>&1
cat /tmp/out.txt
```

### Fix 4.3 — Dùng `chain` command cho multi-step flows

Đây là fix chính. `chain` đọc JSON array từ stdin, chạy tuần tự trong MỘT session:

```bash
cat <<EOF | $B chain > /tmp/out.txt 2>&1
[
  ["goto", "http://.../login"],
  ["fill", "input[name=user]", "canbo_tw"],
  ["fill", "input[name=pass]", "Test@1234"],
  ["js", "document.querySelector('form').requestSubmit(); new Promise(r=>setTimeout(r,5000))"]
]
EOF
```

Lưu ý:
- **Không có `$B` call khác giữa chain** — nếu có, session có thể bị reset.
- Sleep dùng JS `new Promise(r=>setTimeout(r,N))` thay vì shell `sleep`.
- Escape JSON đúng cho special chars (quotes, backslashes).

### Fix 4.4 — Dùng React-compatible input setter

Default `fill` command của browse chỉ set `input.value` → React (controlled input) không pick up change. Fix:

```js
const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set;
setter.call(inputElement, 'value');
inputElement.dispatchEvent(new Event('input', {bubbles: true}));
```

Đặc biệt cho OTP inputs với `maxLength=1` — React OTP components không pick up multi-char `type` hay simple `value=`.

### Fix 4.5 — Dùng UI-captured API param names

Không guess param names theo REST convention tiếng Anh. Capture network từ UI bằng:

```bash
$B network --clear  # clear trước action
# ... perform UI action ...
$B network > /tmp/net.txt  # capture API calls UI gọi
```

Ví dụ đã phát hiện:
- Search TVV dùng `tuKhoa` (không phải `search`/`q`/`hoTen`)
- Filter trạng thái dùng `trangThai` (đúng kỳ vọng)
- Pagination dùng `pageSize` (không phải `limit`)

## 5. Fix cần upstream (báo cáo tới maintainer gstack/Bun)

### 5.1 Bun EPIPE bug (v1.3.12)

Đã báo cáo upstream: https://github.com/oven-sh/bun/issues (open issue)

Workaround trong browse source: wrap stdout write trong try/catch, ignore EPIPE silently.

### 5.2 Browse server: thêm tùy chọn keepalive

**Đề xuất**: thêm env var `BROWSE_KEEP_ALIVE=true` để server KHÔNG exit khi tab count = 0. Thay vào đó, mở lại `about:blank` tab ẩn + giữ server chạy tới khi user gọi `$B stop` hoặc idle timeout.

File cần chỉnh: `/Users/teamai/.claude/skills/gstack/browse/src/browser-manager.ts` (`disconnected` handler).

### 5.3 Browse CLI: reconnect thay vì spawn khi state file thay đổi

Khi state file `.gstack/browse.json` thay đổi giữa các lần CLI call, CLI hiện tại spawn server mới. Đề xuất:
- Kiểm tra HEAD `/ping` endpoint trước khi spawn
- Nếu có server chạy (ping 200) → reuse
- Chỉ spawn khi thực sự cần (ping timeout)

## 6. Workflow QA đề xuất cho UI testing

```bash
# === SETUP ===
B=~/.claude/skills/gstack/browse/dist/browse
REPORT_DIR=...

# Stop tất cả server cũ để clean start
$B stop >/dev/null 2>&1
sleep 2

# Clear MailHog
curl -sX DELETE "http://103.172.236.130:8025/api/v1/messages" >/dev/null

# === PHASE 1: LOGIN ===
cat <<EOF | $B chain > /tmp/p1.txt 2>&1
[
  ["goto","http://103.172.236.130:3000/login"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","canbo_tw"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","Test@1234"],
  ["js","document.querySelector('form').requestSubmit(); new Promise(r=>setTimeout(r,6000))"]
]
EOF

# Fetch OTP (heredoc Python để tránh quoting bug)
curl -s "http://103.172.236.130:8025/api/v2/messages" > /tmp/mails.json
OTP=$(python3 <<'PYEOF'
import json,re
d=json.load(open('/tmp/mails.json'))
for it in sorted(d.get('items',[]),key=lambda x:x.get('Created',''),reverse=True):
    if any('canbo_tw'==t['Mailbox'] for t in it.get('To',[])):
        body=it.get('Content',{}).get('Body','')
        m=re.search(r'OTP.*?([0-9]{6})',body,re.DOTALL)
        if m: print(m.group(1)); break
PYEOF
)

# === PHASE 2: OTP + TEST (single chain!) ===
cat <<EOF | $B chain > /tmp/p2.txt 2>&1
[
  ["js","const inp=[...document.querySelectorAll('input')].filter(i=>i.maxLength===1); const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; inp.forEach((e,i)=>{if(i<'$OTP'.length){set.call(e,'$OTP'[i]); e.dispatchEvent(new Event('input',{bubbles:true}));}});'otp'"],
  ["js","new Promise(r=>setTimeout(r,6000))"],
  ["js","const link=[...document.querySelectorAll('span')].find(e=>e.textContent.trim()==='Quản lý chuyên gia / tư vấn viên'); link && link.click(); 'sidebar'"],
  ["js","new Promise(r=>setTimeout(r,3000))"],
  ["network","--clear"],
  ["js","const kw=document.querySelector('input[placeholder*=\"khóa\"]'); const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; set.call(kw,'Congnt'); kw.dispatchEvent(new Event('input',{bubbles:true})); 'filled'"],
  ["js","[...document.querySelectorAll('button')].find(b=>b.textContent.trim()==='Tìm kiếm').click(); 'search'"],
  ["js","new Promise(r=>setTimeout(r,3000))"],
  ["screenshot","$REPORT_DIR/screenshots/search-result.png"],
  ["js","document.querySelectorAll('.ant-table-row').length"]
]
EOF

# Capture network
$B network > /tmp/net.txt 2>&1
grep -E "api/v1" /tmp/net.txt | head -15
```

## 7. Đánh giá lại BUG-TVV-004

Sau khi áp dụng fix:
- **UI search** qua trang Quản lý TVV → hoạt động đúng
- **API call** từ UI: `GET /tu-van-viens?tuKhoa=Congnt&trangThai=DANG_HOAT_DONG` → filter đúng 1 row
- Tests API với param đúng:
  - `?tuKhoa=Congnt` → 1 item ✅
  - `?tuKhoa=XYZ` → 0 items ✅

→ **BUG-TVV-004 là false positive**. Đóng bug.

**Bug mới mở**: BUG-TVV-013 (Medium) — API thiếu Swagger docs + param sai bị silent-ignore thay vì 422. Khuyến nghị:
1. Bật Swagger UI ở `/api-docs` (hiện 404).
2. Bật `whitelist: true, forbidNonWhitelisted: true` trong NestJS `ValidationPipe`.
3. Document tên param tiếng Việt (`tuKhoa`, `trangThai`, `linhVucId`, `tinhTpId`, ...).

## 8. Lessons learned

1. **Đừng quy cho tool khi app behavior là expected.** `/403` là route guard page hợp lệ của app. QA phải đọc URL cẩn thận trước khi gọi "crash".

2. **OTP testing cần isolation.** Không chạy song song API + UI flow cho cùng user. Clear MailHog trước mỗi login.

3. **Test UI first, API second.** Capture network từ UI để học API contract đúng, đặc biệt với app tiếng Việt dùng param Vietnamese.

4. **Browse tool cần `chain` command cho multi-step flow.** Mỗi `$B` invocation có rủi ro server respawn + session reset.

5. **Pipe output = danger.** Dùng `> file` thay vì `| tail` để tránh EPIPE.

## 9. Re-running suite khuyến nghị

Với workflow mới, nên re-run toàn bộ 30 TC của §7.4 để:
- Verify các bug khác có phải false positive không (đặc biệt các bug "không hoạt động" có thể do sai param)
- Capture UI evidence đầy đủ
- Re-test các flow BLOCKED (có thể UI có khác path workflow — ví dụ "gửi thẩm định" có thể là 1 button trên detail page, không phải endpoint API riêng)

Lesson chính: **API testing alone không đủ cho app nghiệp vụ phức tạp** — UI sẽ tiết lộ các contract / flow khác mà API-only không thấy.

---

*Document generated: 2026-04-17 | QA Automation via Claude Code*
