# Gstack browse (`$B`) — Legacy fallback patterns

**Status:** Archived 2026-04-21. Primary tool là Chrome DevTools MCP — xem [../../CLAUDE.md](../../CLAUDE.md) §Chrome DevTools MCP.

**Khi nào dùng gstack fallback:**
1. MCP server crash thật + restart không recover (hiếm).
2. User explicit yêu cầu `--use-gstack` hoặc "dùng gstack" / "dùng `$B`".
3. CSS-selector-exact-match cần Playwright low-level (vd verify class custom). Vẫn ưu tiên `evaluate_script` của MCP trước.

**SHARED rules đã promote về CLAUDE.md (không nhân bản ở file này):**
- Rule 7 phần Account lock fallback → [../../CLAUDE.md](../../CLAUDE.md) §Shared rules
- Rule 9 Phân loại lỗi diagnostic → [../../CLAUDE.md](../../CLAUDE.md) §Shared rules
- Rule 11 phần Selector library + App quirks → [../../CLAUDE.md](../../CLAUDE.md) §Shared rules

App HTPLDN dùng Ant Design + SSR chậm. Browse server (Playwright) sẽ crash liên tục nếu không follow patterns này. **Đã verify ngày 2026-04-18: không follow = 0/33 TC hoàn thành trong 50 phút.**

---

## Rule 1: `wait` trước mọi `fill`/`click`

```bash
$B goto http://103.172.236.130:3000/login
$B wait 'input[placeholder="Nhập tên đăng nhập"]'   # BẮT BUỘC
$B fill 'input[placeholder="Nhập tên đăng nhập"]' "canbo_tw"
```

Lý do: App render mất 2-3s, Playwright fill timeout hardcoded 5s → fail khi render chậm.

## Rule 2: Snapshot NGAY trước khi dùng `@e*` ref

```bash
$B snapshot 2>&1 | grep "Sửa"    # lấy ref fresh
$B click @e42                     # trong cùng bash block
```

Refs `@e*` chỉ sống trong 1 browse server session. Bash invocation mới = server mới = refs expired.

## Rule 3: OTP custom CSS module — dev đã bypass với OTP cố định `666666`

**Cập nhật 2026-04-19:** 6 ô OTP **KHÔNG phải Antd** — dùng custom CSS module với class `_otpInput_*`. Selector đúng: `input[inputmode="numeric"][maxlength="1"]` (selector cũ `.ant-otp input[maxlength="1"]` đã outdated, không match).

React controlled state — Playwright `fill`/`click`/`press`/`js setter` đều fail, nhưng `$B type "666666"` work vì component auto-focus ô đầu khi render và dispatch char events đúng cách.

**Hiện tại:** Dev đã bật OTP bypass — **mọi tài khoản nhập `666666` đều qua**. Dùng để automation/tester login nhanh.

```bash
# Trong atomic chain (xem Rule 5):
["js","new Promise(r=>setTimeout(r,3500))"],   # chờ OTP page render ~3s
["type","666666"],                              # auto-focus ô đầu, qua bypass
["js","new Promise(r=>setTimeout(r,8000))"]    # chờ verify-otp API + navigate
```

Đề xuất dev (giữ lại cho tham khảo):

```js
if (process.env.TEST_OTP_BYPASS === 'true' && otp === '666666') {
  return { success: true };
}
```

## Rule 4: Selector đặc hiệu, tránh multi-match

- ❌ `button.ant-btn-primary` — match hàng chục
- ✅ `.ant-modal-content button:has-text("Xác nhận")`
- ✅ `[data-row-key="${id}"] button[aria-label="Sửa"]`
- ✅ `.ant-select-dropdown:visible .ant-select-item[title="TW"]`

## Rule 5: Login flow — BẮT BUỘC dùng atomic `$B chain` với JSON file

**Cập nhật 2026-04-20 (R3.1):** Template tối ưu sau validation 3 fix browse — crash rate 50%→20%, time/role 15min→22s.

**Thay đổi vs version cũ:**
- ❌ `["js","new Promise(r=>setTimeout(r,3500))"]` sau click submit → ✅ **`["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"]`** (signal-based, chờ OTP input render xong thay vì sleep blind)
- ❌ `["js","new Promise(r=>setTimeout(r,8000))"]` sau type OTP → ✅ **`["wait","aside button:has-text(\"<menu sidebar label>\")"]`** (chờ sidebar render thay sleep — cũng nhanh hơn nếu app load nhanh)
- ❌ `["js","new Promise(r=>setTimeout(r,5000))"]` sau click submenu → ✅ **`["wait",".ant-table-row, .ant-empty"]`** (chờ data table hoặc empty state)

```bash
# Template R3.1 — verified 2026-04-20 với 4 role (old qtht_dp_4/canbo_tinh_4/lanhdao_bn_4/lanhdao_dp_4 → new qtht_02/cb_nv_dp_02/cb_pd_bn_02/cb_pd_dp_02)
B=~/.claude/skills/gstack/browse/dist/browse
cat > /tmp/login-and-navigate.json <<'EOF'
[
  ["goto","http://103.172.236.130:3000/login"],
  ["wait","input[placeholder=\"Nhập tên đăng nhập\"]"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","<user>"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","<pass>"],
  ["click","button[type=\"submit\"]"],
  ["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"],
  ["type","666666"],
  ["wait","aside button:has-text(\"Quản trị hệ thống\")"],
  ["url"],
  ["click","aside button:has-text(\"<menu sidebar label>\")"],
  ["js","new Promise(r=>setTimeout(r,1500))"],
  ["click","aside button:has-text(\"<submenu label>\")"],
  ["wait",".ant-table-row, .ant-empty"],
  ["screenshot","/tmp/result.png"],
  ["console","--errors"]
]
EOF
cat /tmp/login-and-navigate.json | $B chain
```

**Lưu ý critical:**
- **Wait selectors thay sleep blind** — nhanh hơn (không phải đợi đủ N giây) + ổn định hơn (không miss render slow case).
- **`wait "aside button:has-text(...)"`** dùng để verify sidebar đã render sau OTP — proxy cho "auth thành công + dashboard ready".
- **`wait ".ant-table-row, .ant-empty"`** sau click navigate vào module có table — cover cả case có data + empty state.
- Navigate bằng **click sidebar** thay `goto` (goto giữa chain có thể mất auth cookie → AuthGuard redirect /login).
- Nếu chain bị timeout vì quá dài (>18 step), chia thành 2 chain trong **CÙNG bash invocation** (server alive — xem Rule 6 update). KHÔNG split sang 2 Bash tool call.

**Role CB_TW landing `/403` sau login = PASS** (role không có dashboard default), sidebar vẫn đầy đủ. Không nhầm với auth failure.

**Selector signal đặc trưng cho HTPLDN** (dùng làm `wait` thay sleep):

| Trang đích sau click | Selector wait |
|---------------------|---------------|
| OTP page sau click "Đăng nhập" | `input[inputmode="numeric"][maxlength="1"]` |
| Dashboard hoặc /403 sau OTP | `aside button:has-text("Quản trị hệ thống")` (sidebar render xong) |
| Trang Danh mục / Tài khoản / Audit log | `.ant-table-row, .ant-empty` |
| Trang Cấu hình HT | `.ant-tabs-tab` (4 tabs render) |
| Modal Thêm tài khoản mới | `.ant-modal input[placeholder="Ví dụ: nguyen_van_a"]` |
| Dropdown đã mở | `.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option` |

## Rule 6: Recovery khi server crash (FULL cleanup — chặn zombie leak)

**Cập nhật 2026-04-20 (R3.1) — KHI NÀO cleanup:**

| Tình huống | Cleanup? | Lý do |
|-----------|---------|-------|
| Đầu session test mới (sau gap dài) | ✅ Cleanup | Dọn zombie từ session trước |
| Sau Rule 9 phân loại = REAL CRASH | ✅ Cleanup | Browser destabilize, cần fresh state |
| Đổi role test (login user khác) | ✅ Cleanup | Tránh session/cookie carry sang role mới |
| **Giữa 2 chain trong CÙNG 1 bash invocation** | ❌ **KHÔNG cleanup** | Server alive, chain B liền chain A không cần re-login. Cleanup = giết server vô ích → bash sau cold-start 30-60s |
| Sau mỗi chain default (preventive) | ❌ KHÔNG cleanup | Lãng phí — server tự chết khi bash exit |

**Limitation harness (verified R3.1):** Browse server tied to bash `$PPID`. Mỗi `Bash` tool call = bash subshell mới = `$PPID` mới = server bị kill khi bash trước exit. Không workaround được trừ khi chạy server với `nohup` detach (chưa support).

**→ Hệ quả:** Multi-chain phải gộp vào 1 `Bash` tool call. Split sang 2 tool call = server reset = phải re-login.

**Cleanup snippet (full Rule 6):**

```bash
$B stop 2>/dev/null || true
sleep 2
pkill -f "browse-server" 2>/dev/null || true
pkill -f "ms-playwright-go.*run-driver" 2>/dev/null || true   # critical: driver không tự chết theo browse-server
pkill -f "chromium.*--remote-debugging" 2>/dev/null || true   # critical: chromium child của playwright
rm -f ~/.gstack/chromium-profile/Singleton*
sleep 2
$B connect     # hoặc $B goto <url>
```

**Kiểm tra leak định kỳ** (chạy sau mỗi buổi QA hoặc khi máy chậm):

```bash
# Đếm process browse đang chạy — >0 sau khi $B stop = leak
ps -axo pid,rss,command | grep -E "playwright-go.*run-driver|chromium.*remote-debugging" | grep -v grep
# Tổng RAM browse đang giữ
ps -axo rss,command | grep -E "playwright|chromium" | grep -v grep | awk '{s+=$1} END {print s/1024" MB"}'
```

Nếu tổng >500MB mà bạn không đang chạy test → dọn bằng snippet trên.

**Đã chứng minh ngày 2026-04-18:** 10 playwright-go driver orphan + 4 MCP orphan tích tụ chiếm ~2.4GB RAM → macOS jetsam kill Claude Code (SIGKILL) → session file `3d8a84ee-...` không flush kịp → lỗi "No conversation found" khi resume.

## Rule 7 (phần crash-retry): Browse crash trong QA test — CHỈ retry sau khi phân loại (Rule 9)

> **Account lock fallback** — phần SHARED của Rule 7 đã promote về [../../CLAUDE.md](../../CLAUDE.md) §Shared rules.

**Áp dụng cho MỌI skill dùng browse** (`/browse`, `/qa`, `/qa-only`, `/investigate`, ...).

**BẮT BUỘC: Đi qua Rule 9 phân loại lỗi TRƯỚC khi quyết định retry/STOP.** Retry mù = đốt thời gian user + không fix root cause. Ngày 2026-04-19 đã xảy ra: mark CRASH vội khi `$B url` trả `about:blank` giữa 2 bash invocation → thực ra là session reset (Rule 8), không phải crash. User push back → phát hiện root cause là selector outdated + harness pattern, không phải browser chết.

**Chỉ áp dụng retry khi Rule 9 phân loại là REAL CRASH:**
- **Crash lần 1:** Full cleanup theo Rule 6 + re-login qua atomic chain (Rule 5) + retry bước đang fail **đúng 1 lần**
- **Crash lần 2 (cùng session test):** **STOP NGAY**, mark BLOCKED. **KHÔNG retry lần 3.** **KHÔNG** tự chờ 20-30 phút.

**Nếu Rule 9 phân loại khác REAL CRASH → KHÔNG retry theo Rule 7**, mà xử lý theo loại lỗi tương ứng (harness fix / selector update / app bug escalate).

**Lý do giữ retry max 1 lần khi thực sự crash:** Crash browse trên app HTPLDN (React + Vite dev) có pattern repeatable, không phải flaky random network. Retry >1 lần = đốt thời gian + cũng không recover.

**Format báo user khi BLOCKED (sau khi đã phân loại đúng):**

```
❌ BLOCKED — <phân loại theo Rule 9> tại step <X>
Phân loại: [REAL CRASH / APP BUG / SELECTOR OUTDATED / ENV DOWN]
Đã complete: <liệt kê step đã PASS>
Pending: <liệt kê step chưa chạy>
Diagnostic: <1-2 dòng từ capture bắt buộc của Rule 9 — console error / network pending / URL state>
Options:
  (a) Thử headed mode (`$B connect`) — stable hơn headless ~2x
  (b) Skip module này, qua module tiếp theo
  (c) Abort toàn bộ smoke round này
Bạn chọn (a/b/c)?
```

## Rule 8: Session reset giữa các bash invocations — KHÔNG phải crash

**Hiện tượng (verified 2026-04-19):** Mỗi bash invocation riêng spawn context mới → browse state (cookies, URL, auth token) bị reset giữa các `$B` call. Đây là behavior của harness, KHÔNG phải app/browse bug.

**Dấu hiệu:**
- `$B goto /login` → URL = /login ✅
- Sleep ở bash, rồi `$B url` → `about:blank` ❌
- Sau login OK ở chain 1, `$B goto /module-url` ở chain 2 → redirect `/login` (AuthGuard kick)
- `[browse] Starting server...` xuất hiện lặp lại đầu mỗi bash invocation

**Fix:**
1. **Gộp TẤT CẢ operations vào 1 atomic `$B chain`** với JSON file (xem Rule 5). Không split thành nhiều bash call.
2. **Sleep trong chain** dùng `["js","new Promise(r=>setTimeout(r,Nms))"]`, không dùng `sleep` ở bash.
3. **Navigate bằng click sidebar** thay `goto` (goto có thể mất cookie).
4. Nếu thực sự cần chia chain: `$B cookies > /tmp/s.json` ở chain 1 rồi `$B cookie-import /tmp/s.json` ở đầu chain 2.

**Phân biệt với Rule 7 (crash thực sự):**
- URL về `about:blank` **giữa 2 bash invocations** → session reset (Rule 8), fix bằng atomic chain.
- URL về `about:blank` **trong cùng 1 chain** (giữa 2 step liên tiếp của chain) → crash thực sự (Rule 7), fix bằng cleanup.

**Nếu nhầm Rule 8 thành crash → tốn 2 retry vô ích → STOP sai → user push back.** Luôn loại trừ Rule 8 trước khi áp dụng Rule 7.

## Rule 10: Pattern stable hóa từ session 2026-04-20 R3.1 — 3 fix browse measured

**Source:** Validation session 2026-04-20 trên 4 role (old qtht_dp_4/canbo_tinh_4/lanhdao_bn_4/lanhdao_dp_4 → new qtht_02/cb_nv_dp_02/cb_pd_bn_02/cb_pd_dp_02). Đo kết quả trước/sau:

| Metric | Trước (R3.0) | Sau (R3.1) | Δ |
|--------|-------------|-----------|---|
| **Crash rate** | ~50% (chain crash + timeout) | **~20%** (chỉ app bug residual) | ⬇️ 60% |
| **Time/role** | ~10-15 phút (incl retry) | **~22s** | ⬇️ ~30x |
| **Coverage** | 44/99 ô | 64/99 ô | +20 ô |

### Fix #1 (universal — áp dụng MỌI project dùng gstack browse)

**Quy tắc:** Trong 1 `Bash` tool call, multiple `$B chain` calls share server alive. **KHÔNG cleanup** (`$B stop`/`pkill`) giữa các chain trong cùng bash. Chỉ cleanup giữa các Bash tool call (vì $PPID đổi → server bị kill anyway) hoặc khi REAL CRASH (Rule 6).

```bash
# Đúng pattern — 2 chain trong 1 bash, server alive
cat /tmp/chain-A.json | $B chain
cat /tmp/chain-B.json | $B chain   # KHÔNG cleanup giữa
```

### Fix #2 (HTPLDN-specific — bump OTP wait + signal-based)

**Quy tắc:** Sau click "Đăng nhập", dùng `wait` cho OTP input thay sleep blind. Sau type OTP, dùng `wait` cho sidebar element thay sleep 8000ms.

```diff
- ["js","new Promise(r=>setTimeout(r,3500))"],   # blind sleep — fragile
- ["type","666666"],
- ["js","new Promise(r=>setTimeout(r,8000))"],
+ ["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"],   # signal-based
+ ["type","666666"],
+ ["wait","aside button:has-text(\"Quản trị hệ thống\")"],
```

**Hiệu quả đo:** R3.0 từng có 2 crash sau OTP type. R3.1 với fix này = 0 crash sau OTP.

### Fix #3 (universal pattern, project-specific selector)

**Quy tắc:** Sau click sidebar/button trigger navigation, dùng `wait <selector đặc trưng của trang đích>` thay sleep cố định.

**Selector reference cho HTPLDN:** xem bảng trong Rule 5.

```diff
  ["click","aside button:has-text(\"Danh mục dùng chung\")"],
- ["js","new Promise(r=>setTimeout(r,4000))"],   # may not be enough on slow render
+ ["wait",".ant-table-row, .ant-empty"],         # exact ready signal
```

### Crash residual ~20% — root cause không phải harness

Sau apply 3 fix, crash còn lại là **app-side bug** (vd "4th sidebar click destabilize page" trên app HTPLDN). Pattern tracker:
- Click sidebar `Quản trị hệ thống` → click `Danh mục dùng chung` → click `Tài khoản & phân quyền` → click `Cấu hình hệ thống` → click `Nhật ký hệ thống` (4th click) thường crash trang.
- **Workaround:** Cap chain ở ~3 click sidebar / 1 chain. Nếu cần 4 entity, chia thành Chain A (2 entity) + Chain B (2 entity) trong cùng 1 bash invocation.
- **Long-term:** Escalate dev (memory leak / event listener accumulation trong React component sidebar).

> **⚠️ App-side bug quan trọng — VẪN áp dụng với MCP:** Pattern "4th sidebar click destabilize page" là app bug. Với MCP cũng có thể gặp — cap 3 navigation/session rồi reload `/login` làm fresh start nếu cần.

## Rule 11 (phần MEGA-CHAIN): Pattern test batch — tránh re-login overhead

> **Selector library + App quirks** — phần SHARED của Rule 11 đã promote về [../../CLAUDE.md](../../CLAUDE.md) §Shared rules.

**Cập nhật 2026-04-21 (từ session QA QTHT/DM-dùng-chung):** Đã đo 185 phút cho 47 TC với pattern 1 TC = 1 Bash call. Root cause: mỗi Bash call = server restart 20-30s + re-login 30-40s = **~70s overhead/TC**. Nếu gộp nhiều TC vào 1 Bash call + 1 atomic chain, overhead giảm xuống 5-10s/TC (chỉ nav giữa các TC).

**Math:** N TC × 70s overhead vs 1 × 40s + N × 5s = **~10x speedup** cho batch lớn.

**Pattern mega-chain (verified 2026-04-21):**

```bash
B=~/.claude/skills/gstack/browse/dist/browse
DIR=<output>
# Cleanup mỗi 5 TC HOẶC đầu session (preventive — tránh server degrade sau 8-10 chain)
for pid in $(ps -ax | grep -E "chromium|playwright|chrome-headless-shell|browse-server" | grep -v grep | awk '{print $1}'); do
  kill -9 $pid 2>/dev/null
done
sleep 25-30  # long wait cho chromium fully die

# MEGA chain: 1 login + N test actions. Cap ~12-15 step/chain (Rule 5 timeout limit).
# Nếu >15 step, split thành 2 chain trong CÙNG 1 Bash call (server alive giữa chains).
cat > /tmp/mega-TCxxx.json <<EOF
[
  # ===== LOGIN BLOCK (8 steps) =====
  ["goto","http://103.172.236.130:3000/login"],
  ["wait","input[placeholder=\"Nhập tên đăng nhập\"]"],
  ["fill","input[placeholder=\"Nhập tên đăng nhập\"]","qtht_01"],
  ["fill","input[placeholder=\"Nhập mật khẩu\"]","Secret@123"],
  ["click","button[type=\"submit\"]"],
  ["wait","input[inputmode=\"numeric\"][maxlength=\"1\"]"],
  ["type","666666"],
  ["wait","aside button:has-text(\"Quản trị hệ thống\")"],
  # ===== NAVIGATE TO MODULE (3 steps) =====
  ["click","aside button:has-text(\"Quản trị hệ thống\")"],
  ["js","new Promise(r=>setTimeout(r,1500))"],
  ["click","aside button:has-text(\"Danh mục dùng chung\")"],
  ["wait",".ant-table-row, .ant-empty"],
  # ===== TEST ACTION (2-4 step/TC) =====
  ["screenshot","$DIR/TC-xxx.png"],
  ["js","JSON.stringify({tc:'TC-xxx', <assertions>})"]
]
EOF
cat /tmp/mega-TCxxx.json | $B chain 2>&1 | tail -20
```

**Khi cần >1 test case trong 1 session login:**

Chain 1 (login + setup) + Chain 2 (test set A) + Chain 3 (test set B) — tất cả trong **cùng 1 Bash call**. Server stays alive giữa chains (Rule 10 Fix #1).

```bash
B=~/.claude/skills/gstack/browse/dist/browse
# Cleanup
for pid in ...; do kill -9 $pid; done; sleep 25

# Chain 1: Login + navigate — prepare state
cat /tmp/chain-login.json | $B chain 2>&1 | tail -5

# Chain 2: Test batch A (TC-001 → TC-008, search tests)
cat /tmp/chain-batch-A.json | $B chain 2>&1 | tail -10

# Chain 3: Test batch B (TC-009 → TC-016, CREATE tests) — cùng session
cat /tmp/chain-batch-B.json | $B chain 2>&1 | tail -10
```

**Batch size optimal = 5-7 TC/chain:** Dưới 15 step Playwright nhưng cover đủ test action. Nếu chain ≤3 TC lãng phí overhead, ≥10 TC dễ timeout.

**Preventive cleanup — đo được:**
- Sau ~8-10 chain/session, server bắt đầu báo "Starting server... timed out"
- **Pattern phòng ngừa:** cleanup + long sleep mỗi 5 TC hoặc khi thấy 1 chain đầu tiên crash
- Long sleep 25-30s là CẦN để chromium zombies cleanup hết — sleep 15s thường không đủ
