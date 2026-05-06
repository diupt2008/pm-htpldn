# CLAUDE.md — QA Project: PM HTPLDN

Project này chứa tài liệu QA cho Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM HTPLDN).

## 🔴 Tool routing — BẮT BUỘC (enforced từ 2026-05-05)

**Mọi QA test / browse / smoke / functional / workflow / regression trên project này PHẢI dùng Chrome DevTools MCP làm tool MẶC ĐỊNH.**

| Trigger từ user | Tool dùng | Cấm dùng |
|---|---|---|
| `/qa`, `/qa-only`, `/gstack-qa-only`, `/gstack-qa`, `/browse`, `/investigate` | **Chrome DevTools MCP** (`mcp__chrome-devtools__*`) | gstack `$B` / browse-server / Playwright direct |
| "test [module/page]", "QA [feature]", "kiểm thử...", "chạy smoke...", "verify..." | **Chrome DevTools MCP** | gstack `$B` |
| Auth flow (login + OTP) | MCP-Template login (xem section "Chrome DevTools MCP — PATTERNS BẮT BUỘC" §Template login) | gstack atomic chain |

**Lý do:** Smoke test 2026-04-21 chứng minh MCP 3/3 PASS, gstack crash rate 50%→20% chỉ sau 3 fix R3.1. MCP có `list_network_requests` + `list_console_messages` native, gstack không có. 1 lần login/session vs gstack re-login mỗi bash do `$PPID` reset.

**Khi nào fallback gstack `$B`:**
1. MCP server crash thật + restart không recover (hiếm).
2. User explicit yêu cầu `--use-gstack` hoặc "dùng gstack" / "dùng `$B`".
3. CSS-selector-exact-match cần Playwright low-level (vd verify class custom). Vẫn ưu tiên `evaluate_script` của MCP trước.

**Khi skill template (vd `/gstack-qa-only`) yêu cầu `$B`:** ADAPT — giữ workflow Phase 1-6, thay command theo bảng map ở section "MCP-Rule 6: Phân loại lỗi" trong file này. Output report theo template project ([output/template/](output/template/)), KHÔNG dùng `.gstack/qa-reports/`.

**Khi nào hỏi user trước khi chạy:**
- Skill workflow generic conflict với task cụ thể trong [tasks/todo.md](tasks/todo.md) → confirm scope task ID.
- User chưa nói rõ module/account → hỏi 1 lần rồi chạy.

## Quick reference

- **App URL:** http://103.172.236.130:3000/
- **MailHog (OTP inbox):** http://103.172.236.130:8025
- **Test strategy:** [output/test-strategy.md](output/test-strategy.md)
- **Permission matrix:** [output/permission-matrix.md](output/permission-matrix.md) (49 entity × 11 role)
- **Test accounts:** [input/users.csv](input/users.csv) · **Permission test usage guide:** [input/test-accounts-isolation.csv](input/test-accounts-isolation.csv)
- **SRS docs:** [input/srs-v3/](input/srs-v3/)
- **Báo cáo QA:** [output/qa-reports/](output/qa-reports/)

### Seed data references (new 2026-04-23)
- **Flow + hub tier + troubleshooting:** [input/flow-module.md](input/flow-module.md) — state machine 14 module + Hub Tier + Seed Presets (Phụ lục 2) + Troubleshooting (Phụ lục 3)
- **Cross-module map:** [input/data/entity-map.md](input/data/entity-map.md) — 18 entity × "Tạo tại / Đọc tại" ma trận
- **Seed fixture (giá trị nhập):** [input/data/seed-fixture.yaml](input/data/seed-fixture.yaml) — 6 variants/entity theo tier Y
- **Công thức seed:** YAML cho giá trị + flow-module.md cho state machine + account switch. Không cần file riêng cho step-by-step.

## Quy tắc seed task — BẮT BUỘC tránh gãy như A5 (2026-04-29)

**Mỗi seed task entity có ≥2 chiều combinatorial (entity × state × loại × LV × cấp):**

1. **Acceptance theo filter, KHÔNG theo số lượng tổng.**
   - ❌ Sai: "Seed 12 variant"
   - ✅ Đúng: "Seed ≥3 record cho mỗi filter downstream (loại × state × LV)"

2. **Verify per-filter trước khi đóng task.**
   - ❌ Sai: `total = 12 → ✅ pass`
   - ✅ Đúng: `?loaiTvv=CG → ≥1, ?loaiTvv=NHT → ≥1, ?loaiTvv=TVV → ≥1 → ✅ pass`

3. **Mở `entity-map.md` cột "Đọc tại" trước khi viết acceptance.** List downstream → quote SRS filter → fill section "Downstream consumer × filter" trong [seed-checklist-template.md](output/template/seed-checklist-template.md).

4. **Nếu thiếu filter → split sub-task ngay** (vd T1.B3b/B3c). Không dồn vào task gốc.

**Pattern đã gãy:** A5 R5/R6/R7 vì T1.B3 acceptance "12 variant TVV" gộp loại → 0 CG / 12 TVV → block 4 round.

**Reference đầy đủ:** [`tasks/lessons-learned.md`](tasks/lessons-learned.md) entry "2026-04-28 → 2026-04-29 — A5 TVCS FAIL".

## Quy tắc viết todo.md (enforced bằng hook `.claude/hooks/check-todo-concise.py`)

**Template cứng cho mỗi task:**

```
- <icon> **<ID>** <Tên task ngắn>
  - **Kết quả:** <PASS N/N | FAIL | ⚠️ N/M | 🚫 block do X> — <≤15 từ>. [report-link]
  - **Bug:** [bug-report-link] — <closed>/<total> đóng     ← chỉ khi có bug
  - **Cần có sẵn:** <ref task ✅/❌>                        ← chỉ khi task ⏳/🚫
  - **Output:** [report-link]                                ← optional
```

**Hook chặn:** dòng `**Kết quả:**` >25 từ → block Edit/Write. Hook trigger trên mọi file kết thúc `/todo.md`.

**Cấm trong todo.md** (chuyển sang bug-report / workflow-report):
- Pool count, endpoint path, enum value, network response, dev claim, 2-source verify
- Multi-round narrative ("R6 sau dev claim fix...", "identical R3 28/4...")
- Cascade impact reasoning (đặt ở section "Module bị block")

**DO (≤15 từ, đúng template):**
```
- ✅ **A1** Workflow TVV — luồng nhập tay
  - **Kết quả:** PASS 12/12 bước. R6 advance thêm 9 record. [workflow-test-report-TVV.md]
  - **Bug:** [bug-report-flow-TVV.md] — 3/4 đóng
```

**DON'T (35+ từ, nhồi chi tiết):**
```
- **Kết quả R7 29/4 09:36:** FAIL — modal Phân công CG TVCS-0001 dropdown Trống.
  Pool thực có 8 CG DANG_HOAT_DONG cover 6 LV; Doanh nghiệp có 2 CG khớp
  (TVV-0019 + TVV-0021). FE truyền trangThai=HOAT_DONG cho endpoint TU_VAN_VIEN
  → mismatch enum, BE trả 0. 2-source SRS local + NotebookLM ERD match.
```

**Note nhật ký** (`> Note 2026-04-29 ...`) tách riêng đầu file, không phải dòng Kết quả — vẫn được phép dài để daily handoff.

---

## Khi viết test plan mới cho module

- Theo quy trình [output/scaling-test-strategy.md §4.1 Bước 3](output/scaling-test-strategy.md): grep BR từ SRS Phụ lục B + sibling-check ≥2 module + BA sign-off trước Bước 4
- Copy template: [output/template/test-plan-overview-template.md](output/template/test-plan-overview-template.md)
- BR có "Áp dụng: Toàn bộ..." trong SRS = default áp dụng. Ngoại lệ phải QUOTE line SRS, không tự suy luận.

## Khi log bug — BẮT BUỘC

1. **Read [output/template/bug-report-template.md](output/template/bug-report-template.md) trước khi Write/Edit bug entry.** Bug entry chỉ có 6 sections: Mô tả / Bước tái hiện / KQ mong đợi / KQ thực tế / Bằng chứng / So sánh (optional permission). KHÔNG thêm Tác động / Đề xuất fix / SRS verification / Phân biệt module.
2. **2-source SRS verify:** query NotebookLM HTPLDN (id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`) + grep SRS local — mọi log/đóng/đổi severity.
3. **Workaround = bug candidate.** Gặp 4xx/5xx → log, không skip vì "tự fix được".

## Chrome DevTools MCP — PATTERNS BẮT BUỘC (primary tool từ 2026-04-21)

**Quyết định 2026-04-21:** Smoke test 3/3 gates PASS (OTP bypass, auth persist, table render 15 rows) → chuyển MCP làm **primary tool** cho QA HTPLDN. Gstack `$B` giữ làm fallback (xem section dưới).

**Lý do:** 0% crash qua smoke (vs 20-50% gstack), 1 lần login/session (vs re-login mỗi bash do `$PPID` reset), native `list_network_requests` + `list_console_messages` inspection.

**Config:** `~/.claude.json` → `mcpServers.chrome-devtools` với `npx -y chrome-devtools-mcp@latest`. Chrome window hiện (headless=false mặc định). Tool prefix: `mcp__chrome-devtools__*`.

### MCP-Rule 1: `wait_for(text)` trước mọi `fill`/`click` — signal-based

```
mcp__chrome-devtools__wait_for({text: ["Nhập tên đăng nhập"], timeout: 15000})
```

MCP `wait_for` nhận **array text**, match bất kỳ text visible nào xuất hiện trên page (label, placeholder, heading). Robust hơn CSS selector — không break khi app đổi class. Timeout mặc định 5s, app HTPLDN render chậm → luôn set ≥10000ms.

### MCP-Rule 2: `take_snapshot` lấy `uid` FRESH — không reuse cross-navigation

`fill`/`click`/`fill_form` MCP yêu cầu `uid` từ a11y snapshot. `uid` chỉ valid tại snapshot đó. Sau mỗi navigate / modal open / dynamic render → **phải `take_snapshot` lại** để lấy uid mới.

```
1. take_snapshot → uid list (vd uid=1_6, 1_14)
2. fill_form([{uid: "1_6", value: "qtht_01"}, ...])
3. click({uid: "1_14"})
4. [sau navigate dashboard] → take_snapshot LẠI → uid đổi thành 3_x, 8_x...
5. click({uid: new_uid})
```

**Gotcha:** a11y tree **ẩn element `display:none` / 0×0 pixel** → submenu collapsed không xuất hiện. Dùng `evaluate_script` để inspect DOM trực tiếp khi nghi ngờ:

```js
evaluate_script(() => {
  const el = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Danh mục dùng chung');
  const r = el?.getBoundingClientRect();
  return { found: !!el, visible: r && r.width > 0 && r.height > 0 };
})
```

### MCP-Rule 3: `click` sidebar, KHÔNG dùng `navigate_page` sau login

**App auth lưu trong `sessionStorage` key `auth-store`** (verified 2026-04-21, không cookie HttpOnly). `navigate_page` URL = full reload = app re-init check BE session → redirect `/login` nếu backend không chấp nhận.

- ❌ `navigate_page({url: "/quan-tri/danh-muc"})` sau login → kick về `/login`
- ✅ `click({uid: sidebar_button_uid})` → React Router internal navigate, giữ app state

**Chỉ dùng `navigate_page` cho:** lần đầu session (goto `/login`), hoặc khi cần force reload (logout test).

### MCP-Rule 4: Expand sidebar trước submenu lần đầu session

Sidebar default class `app-sidebar collapsed` (width 64px, chỉ icon) trên MCP viewport. Submenu render `display:none` → không xuất hiện trong snapshot. **Phải click button "Thu gọn menu"** (toggle) để expand width 260px trước.

```
1. wait_for(["Quản trị hệ thống"])   → sidebar render xong
2. take_snapshot                     → tìm uid "Thu gọn menu" (banner area)
3. click({uid: thu_gon_uid})         → sidebar expand 260px
4. take_snapshot                     → uid submenu mới xuất hiện
5. click({uid: qtht_uid})            → expand submenu group "Quản trị hệ thống"
6. take_snapshot                     → lấy uid 4 submenu items
7. click({uid: dm_dungchung_uid})    → navigate
8. wait_for(["Tìm theo mã", "Danh sách"])
```

### MCP-Rule 5: Không áp dụng cleanup/retry/atomic-chain của gstack

MCP tool call tuần tự native, single browser process, `sessionStorage` persist cross-call → **KHÔNG cần Rule 6 cleanup, Rule 7 retry, Rule 8 session reset, Rule 10 fix chain, Rule 11 mega-chain**. Nếu MCP server crash thật sự (hiếm), restart Claude Code → MCP tự reconnect.

### MCP-Rule 6: Phân loại lỗi TRƯỚC khi react (adapt từ Rule 9)

Logic Rule 9 phân loại vẫn đúng — khi fail, capture diagnostic rồi phân loại. Mapping tool gstack → MCP equivalent:

| Action | Gstack | MCP |
|--------|--------|-----|
| Get URL | `$B url` | `evaluate_script(() => window.location.href)` |
| Screenshot | `$B screenshot` | `take_screenshot({filePath: "/tmp/..."})` |
| Console errors | `$B console --errors` | `list_console_messages({types: ["error","warn"]})` |
| Network | `$B network` | `list_network_requests({resourceTypes: ["xhr","fetch"]})` |
| DOM inspect | `$B html body \| grep` | `evaluate_script(() => document.body.innerHTML)` |

Bảng phân loại Rule 9 vẫn áp dụng, trừ:
- ~~"Session reset giữa bash invocations"~~ → **KHÔNG xảy ra với MCP**
- ~~"CHAIN QUÁ DÀI"~~ → **KHÔNG có chain concept**
- Giữ: SELECTOR OUTDATED, APP/BE BUG, APP/FE BUG, ACCOUNT ISSUE, ENV DOWN, REAL CRASH.

### MCP-Rule 7: Selector library MCP equivalent (dùng trong `evaluate_script`)

Khi cần match CSS selector (click element ẩn, count elements, check class), dùng `evaluate_script`. Selector library ở Rule 11 (gstack section bên dưới) vẫn dùng được — copy selector vào `document.querySelector(...)` trong JS function.

```js
// Đếm table rows
evaluate_script(() => document.querySelectorAll('.ant-table-tbody tr.ant-table-row').length)

// Click button "Đồng ý" trong drawer (button label khác spec)
evaluate_script(() => {
  const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Đồng ý');
  btn?.click();
  return !!btn;
})

// Check validation error message
evaluate_script(() => Array.from(document.querySelectorAll('.ant-form-item-explain-error')).map(e => e.textContent.trim()))
```

### Template login MCP — verified 2026-04-21 với `qtht_01` (old `qtht_tw_3`)

```
1.  new_page({url: "http://103.172.236.130:3000/login"})
2.  wait_for({text: ["Nhập tên đăng nhập"], timeout: 15000})
3.  take_snapshot                                          → uid form (vd 1_6, 1_9, 1_14)
4.  fill_form({elements: [
       {uid: "<username_uid>", value: "qtht_01"},
       {uid: "<password_uid>", value: "Secret@123"}
    ]})
5.  click({uid: "<submit_uid>"})
6.  wait_for({text: ["Nhập mã xác thực"], timeout: 15000}) → OTP page render
7.  type_text({text: "666666"})                            → OTP bypass (auto-focus ô đầu)
8.  wait_for({text: ["Tổng quan hệ thống"], timeout: 15000}) → dashboard render
9.  take_snapshot                                          → uid sidebar + "Thu gọn menu"
10. click({uid: "<thu_gon_menu_uid>"})                     → expand sidebar (MCP-Rule 4)
11. take_snapshot                                          → uid submenu now visible
12. click({uid: "<sidebar_parent_uid>"})                   → expand submenu group
13. take_snapshot                                          → uid submenu items
14. click({uid: "<target_submenu_uid>"})                   → navigate module
15. wait_for({text: ["<module-specific heading>"], timeout: 15000})
```

**Role CB_TW landing `/403` sau login = PASS** (role không có dashboard default), sidebar vẫn render đầy đủ — cùng behavior như gstack. Dùng `wait_for(["Quản trị hệ thống"])` làm signal thay vì text dashboard.

---

## Gstack browse (`$B`) — LEGACY / FALLBACK (archived 2026-04-21)

**Status:** Gstack giữ làm fallback tool khi MCP unavailable hoặc cần CSS-selector-exact-match. Patterns dưới đây **vẫn valid cho gstack** — archived nhưng giữ nguyên để tham khảo khi cần fallback.

**Shared rules (áp dụng cả MCP và gstack):** Rule 1, 2, 3, 4, Rule 7 account-lock-fallback, Rule 9, Rule 11 selector library + app-side quirks.

**Archived rules (gstack-only, wrap trong `<details>`):** Rule 5 atomic chain, Rule 6 cleanup, Rule 7 crash retry, Rule 8 session reset, Rule 10 R3.1 fixes, Rule 11 mega-chain pattern.

App HTPLDN dùng Ant Design + SSR chậm. Browse server (Playwright) sẽ crash liên tục nếu không follow patterns này. **Đã verify ngày 2026-04-18: không follow = 0/33 TC hoàn thành trong 50 phút.**

### Rule 1: `wait` trước mọi `fill`/`click`
```bash
$B goto http://103.172.236.130:3000/login
$B wait 'input[placeholder="Nhập tên đăng nhập"]'   # BẮT BUỘC
$B fill 'input[placeholder="Nhập tên đăng nhập"]' "canbo_tw"
```

Lý do: App render mất 2-3s, Playwright fill timeout hardcoded 5s → fail khi render chậm.

### Rule 2: Snapshot NGAY trước khi dùng `@e*` ref
```bash
$B snapshot 2>&1 | grep "Sửa"    # lấy ref fresh
$B click @e42                     # trong cùng bash block
```

Refs `@e*` chỉ sống trong 1 browse server session. Bash invocation mới = server mới = refs expired.

### Rule 3: OTP custom CSS module — dev đã bypass với OTP cố định `666666`

**Cập nhật 2026-04-19:** 6 ô OTP **KHÔNG phải Antd** — dùng custom CSS module với class `_otpInput_*`. Selector đúng: `input[inputmode="numeric"][maxlength="1"]` (selector cũ `.ant-otp input[maxlength="1"]` đã outdated, không match).

React controlled state — Playwright `fill`/`click`/`press`/`js setter` đều fail, nhưng `$B type "666666"` work vì component auto-focus ô đầu khi render và dispatch char events đúng cách.

**Hiện tại:** Dev đã bật OTP bypass — **mọi tài khoản nhập `666666` đều qua**. Dùng để automation/tester login nhanh.

```bash
# Trong atomic chain (xem Rule 5):
["js","new Promise(r=>setTimeout(r,3500))"],   # chờ OTP page render ~3s
["type","666666"],                              # auto-focus ô đầu, qua bypass
["js","new Promise(r=>setTimeout(r,8000))"]    # chờ verify-otp API + navigate
```

<!-- Khi bypass bị tắt: lấy OTP thật từ MailHog (http://103.172.236.130:8025) và type "$OTP" — xem memory qa_htpldn_otp_bypass.md -->

Đề xuất dev (giữ lại cho tham khảo):
```js
if (process.env.TEST_OTP_BYPASS === 'true' && otp === '666666') {
  return { success: true };
}
```

### Rule 4: Selector đặc hiệu, tránh multi-match
- ❌ `button.ant-btn-primary` — match hàng chục
- ✅ `.ant-modal-content button:has-text("Xác nhận")`
- ✅ `[data-row-key="${id}"] button[aria-label="Sửa"]`
- ✅ `.ant-select-dropdown:visible .ant-select-item[title="TW"]`

<details>
<summary>📦 <strong>Rule 5 (gstack-only, archived 2026-04-21)</strong>: Login flow — atomic <code>$B chain</code>. Dùng MCP-Template login thay. Click để mở khi cần fallback gstack.</summary>

### Rule 5: Login flow — BẮT BUỘC dùng atomic `$B chain` với JSON file

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

</details>

<details>
<summary>📦 <strong>Rule 6 (gstack-only, archived 2026-04-21)</strong>: Cleanup zombie process. MCP không có zombie — bỏ qua, chỉ dùng khi fallback gstack.</summary>

### Rule 6: Recovery khi server crash (FULL cleanup — chặn zombie leak)

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

</details>

<details>
<summary>📦 <strong>Rule 7 phần crash-retry (gstack-only, archived 2026-04-21)</strong>: Retry logic khi browse crash. MCP không có pattern crash này — bỏ qua. <strong>Phần "Account lock fallback" dưới VẪN ÁP DỤNG cho MCP</strong>.</summary>

### Rule 7: Browse crash trong QA test — CHỈ retry sau khi phân loại (Rule 9)

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

</details>

### Rule 7 (phần Account lock — SHARED, áp dụng cả MCP và gstack)

**Account lock / login failed — Auto-fallback trong cùng role+cấp group, hết mới STOP báo user:**

Nếu login fail (toast `Tài khoản tạm khóa` / `Invalid credentials` / HTTP 401 từ `POST /api/v1/auth/login` / URL stuck ở `/login` sau submit):

**Step 1 — Capture evidence NGAY khi phát hiện fail:**
- Screenshot login page
- `$B console --errors`
- Toast text DOM: `.ant-message, .ant-notification, [role="alert"], .ant-form-item-explain-error`
- Với curl backend: response JSON (thường có `error.code` như `ERR-AUTH-LOCKED-01`)

**Step 2 — Auto-fallback 1 lượt trong SAME `Vai trò` + `Cấp` group:**
1. Đọc `input/users.csv`, filter rows cùng `vai_tro` + `don_vi_ma` (đồng cấp) với primary (loại trừ chính primary).
2. Thử login từng sibling theo thứ tự suffix `_02` → `_03`. Convention mới: `_01` primary, `_02` fallback, `_03` permission test dedicated (vd: primary `cb_nv_tw_01` lock → thử `cb_nv_tw_02` trước → rồi `cb_nv_tw_03`).
3. Sibling đầu tiên login OK → dùng luôn cho round test. **BẮT BUỘC log rõ account thực tế dùng** trong test-case-execution-report:
   ```
   ⚠️ Primary `cb_nv_tw_01` locked (ERR-AUTH-LOCKED-01) → fallback `cb_nv_tw_02` OK.
   Tất cả TC chạy với `cb_nv_tw_02` (Vai trò/Cấp tương đương `cb_nv_tw_01`).
   ```
4. **Constraint bắt buộc:** CHỈ fallback trong SAME `vai_tro` + `don_vi_ma` group. TUYỆT ĐỐI KHÔNG đổi role / cấp (vd `cb_nv_tw_01` lock → dùng `cb_nv_dp_01` là SAI, vì cấp TW ≠ ĐP → data scope khác → test result không còn valid). Riêng BN/DP cần giữ cùng đơn vị (vd `cb_nv_bn_01` BKH lock → fallback là `cb_nv_bn_02` BTC ≠ SAME đơn vị → chỉ dùng được nếu test không phụ thuộc data scope đơn vị cụ thể; ngược lại STOP).

**Step 3 — Nếu ALL siblings cùng role+cấp cũng fail → STOP, mark BLOCKED, báo user:**
```
🚫 BLOCKED — Toàn bộ account role "<vai trò>" cấp "<cấp>" đều lock
Tried: <primary>, <sibling_1>, <sibling_2>, ...
Symptom: <toast / HTTP / error code>
Evidence: <screenshot path>
Options:
  (a) Bạn unlock account và báo tôi retry
  (b) Dùng account khác (khác role/cấp — có thể ảnh hưởng scope test)
  (c) Abort round này
Bạn chọn (a/b/c)?
```

**Ngoại lệ:**
- `admin` (root, không có sibling _3/_5 theo CSV) → KHÔNG fallback, STOP ngay báo user.
- Nếu test case yêu cầu đúng username cụ thể (vd test authorization theo user cụ thể, không phải theo role) → KHÔNG fallback, STOP ngay.

**KHÔNG được:**
- Chờ unlock (25 phút hay bất kỳ thời gian nào) để retry cùng account.
- Retry cùng account nhiều lần (≥3 lần sẽ trigger thêm lock).
- Fallback qua role/cấp khác mà không hỏi user.

<details>
<summary>📦 <strong>Rule 8 (gstack-only, archived 2026-04-21)</strong>: Session reset giữa bash invocations. MCP single session — KHÔNG xảy ra. Chỉ áp dụng khi fallback gstack.</summary>

### Rule 8: Session reset giữa các bash invocations — KHÔNG phải crash

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

</details>

### Rule 9: Phân loại lỗi TRƯỚC khi react — bắt buộc cho mọi timeout/crash

**SHARED — áp dụng cả MCP và gstack** (xem MCP-Rule 6 ở section trên để map tool gstack → MCP equivalent).

**Áp dụng trước Rule 6 (cleanup) / Rule 7 (retry) / Rule 8 (session reset).** Mục đích: tránh retry mù với lỗi không phải crash, tránh đốt thời gian vô ích, đảm bảo diagnostic rõ ràng khi báo user.

#### Step 1 — Capture diagnostic BẮT BUỘC khi fail

Ngay sau khi phát hiện fail (wait timeout / URL lạ / toast lỗi), chạy **1 chain capture** trước khi quyết định action:

```bash
# Nối vào chain đang fail hoặc chạy chain mới ngay sau đó
[
  ["url"],
  ["screenshot","/tmp/fail-<step-name>.png"],
  ["console","--errors"],
  ["network"],
  ["html","body"]
]
```

Không capture = không phân loại được = chỉ còn đường mark BLOCKED bừa → lặp lại sai lầm 2026-04-19.

#### Step 2 — Phân loại theo bảng

| Dấu hiệu quan sát | Phân loại | Action |
|-------------------|-----------|--------|
| URL `about:blank` giữa 2 bash invocations (có `[browse] Starting server...` lặp) | **HARNESS — session reset** | Fix theo Rule 8 (atomic chain). **KHÔNG** cleanup, **KHÔNG** retry theo Rule 7 |
| URL `about:blank` giữa 2 step liên tiếp TRONG cùng chain | **REAL CRASH** | Áp dụng Rule 6 cleanup + Rule 7 retry 1 lần |
| `wait <selector>` timeout + `html body` grep thấy element tương tự nhưng class khác | **SELECTOR OUTDATED** | Update selector trong CLAUDE.md/spec, re-run. **KHÔNG** retry với selector cũ |
| `wait` timeout + `console --errors` sạch + `network` có request `pending >10s` | **APP/BE BUG** | **STOP**, escalate user + BE team. **KHÔNG** retry (retry = chờ cùng bug) |
| `wait` timeout + `console --errors` có TypeError/500 toast | **APP/FE BUG** | **STOP**, log console + screenshot, escalate FE team |
| `[browse] The operation timed out` sau chain có >15 step | **CHAIN QUÁ DÀI** | Split chain, bridge cookies (`$B cookies` / `$B cookie-import`) |
| Error `Target page, context or browser has been closed` | **REAL CRASH** | Áp dụng Rule 6 cleanup + Rule 7 retry 1 lần |
| Toast `Tài khoản tạm khóa` / `Invalid credentials` | **ACCOUNT ISSUE** | STOP theo Rule 7 account lock, đổi account |
| `curl` pre-flight server → ≠ 200 / auth endpoint timeout | **ENV DOWN** | STOP, escalate infra, không chạy smoke |

#### Step 3 — Escalate với phân loại rõ ràng

Khi báo user BLOCKED, **phải nêu rõ phân loại** từ bảng trên (xem format trong Rule 7). User cần biết lỗi là harness/app/env/crash để quyết định đúng.

#### Anti-pattern — TUYỆT ĐỐI KHÔNG

- ❌ Tăng timeout + retry nhiều lần khi chưa phân loại → không fix được selector sai / session reset / app bug
- ❌ Mark BLOCKED ngay khi thấy timeout đầu tiên → chưa có diagnostic, user không biết lỗi gì
- ❌ Cleanup + retry ngay khi thấy `about:blank` → nếu là Rule 8 session reset, cleanup không giúp
- ❌ Bỏ qua Step 1 capture diagnostic → mất bằng chứng để user debug

#### Ví dụ đúng (verified 2026-04-19)

```
Observation: $B wait '.ant-otp input[maxlength="1"]' timeout 15s
→ Step 1 capture: html body → tìm thấy '<input class="_otpInput_1y5cx_206" inputmode="numeric" maxlength="1">'
→ Step 2 phân loại: SELECTOR OUTDATED (class custom CSS module, không phải .ant-otp)
→ Step 3 action: update selector thành 'input[inputmode="numeric"][maxlength="1"]', update CLAUDE.md Rule 3, retry 1 lần → PASS
```

<details>
<summary>📦 <strong>Rule 10 (gstack-only, archived 2026-04-21)</strong>: Pattern stable hóa R3.1 (3 fix: không cleanup giữa chain, wait thay sleep, signal-based selector). MCP đã bao gồm các nguyên tắc này natively. Click để mở khi fallback gstack.</summary>

### Rule 10: Pattern stable hóa từ session 2026-04-20 R3.1 — 3 fix browse measured

**Source:** Validation session 2026-04-20 trên 4 role (old qtht_dp_4/canbo_tinh_4/lanhdao_bn_4/lanhdao_dp_4 → new qtht_02/cb_nv_dp_02/cb_pd_bn_02/cb_pd_dp_02). Đo kết quả trước/sau:

| Metric | Trước (R3.0) | Sau (R3.1) | Δ |
|--------|-------------|-----------|---|
| **Crash rate** | ~50% (chain crash + timeout) | **~20%** (chỉ app bug residual) | ⬇️ 60% |
| **Time/role** | ~10-15 phút (incl retry) | **~22s** | ⬇️ ~30x |
| **Coverage** | 44/99 ô | 64/99 ô | +20 ô |

#### Fix #1 (universal — áp dụng MỌI project dùng gstack browse)
**Quy tắc:** Trong 1 `Bash` tool call, multiple `$B chain` calls share server alive. **KHÔNG cleanup** (`$B stop`/`pkill`) giữa các chain trong cùng bash. Chỉ cleanup giữa các Bash tool call (vì $PPID đổi → server bị kill anyway) hoặc khi REAL CRASH (Rule 6).

```bash
# Đúng pattern — 2 chain trong 1 bash, server alive
cat /tmp/chain-A.json | $B chain
cat /tmp/chain-B.json | $B chain   # KHÔNG cleanup giữa
```

#### Fix #2 (HTPLDN-specific — bump OTP wait + signal-based)
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

#### Fix #3 (universal pattern, project-specific selector)
**Quy tắc:** Sau click sidebar/button trigger navigation, dùng `wait <selector đặc trưng của trang đích>` thay sleep cố định.

**Selector reference cho HTPLDN:** xem bảng trong Rule 5.

```diff
  ["click","aside button:has-text(\"Danh mục dùng chung\")"],
- ["js","new Promise(r=>setTimeout(r,4000))"],   # may not be enough on slow render
+ ["wait",".ant-table-row, .ant-empty"],         # exact ready signal
```

#### Crash residual ~20% — root cause không phải harness
Sau apply 3 fix, crash còn lại là **app-side bug** (vd "4th sidebar click destabilize page" trên app HTPLDN). Pattern tracker:
- Click sidebar `Quản trị hệ thống` → click `Danh mục dùng chung` → click `Tài khoản & phân quyền` → click `Cấu hình hệ thống` → click `Nhật ký hệ thống` (4th click) thường crash trang.
- **Workaround:** Cap chain ở ~3 click sidebar / 1 chain. Nếu cần 4 entity, chia thành Chain A (2 entity) + Chain B (2 entity) trong cùng 1 bash invocation.
- **Long-term:** Escalate dev (memory leak / event listener accumulation trong React component sidebar).

> **⚠️ App-side bug quan trọng — VẪN áp dụng với MCP:** Pattern "4th sidebar click destabilize page" là app bug. Với MCP cũng có thể gặp — cap 3 navigation/session rồi reload `/login` làm fresh start nếu cần.

</details>

<details>
<summary>📦 <strong>Rule 11 phần MEGA-CHAIN (gstack-only, archived 2026-04-21)</strong>: Pattern mega-chain gộp nhiều TC / 1 bash call để giảm re-login overhead. MCP không có re-login overhead → không cần. <strong>Phần "Selector library" + "App-side quirks" dưới VẪN ÁP DỤNG cho MCP</strong> (dùng trong <code>evaluate_script</code>).</summary>

### Rule 11: MEGA-CHAIN pattern cho test batch — tránh re-login overhead

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

</details>

### Rule 11 (phần Selector library + App quirks — SHARED, áp dụng cả MCP và gstack)

**Selector library đã verify (HTPLDN app, session 2026-04-20/21):**

| Mục đích | Selector |
|----------|----------|
| Login input | `input[placeholder="Nhập tên đăng nhập"]` |
| Password input | `input[placeholder="Nhập mật khẩu"]` |
| OTP input (6 ô) | `input[inputmode="numeric"][maxlength="1"]` (KHÔNG dùng `.ant-otp`) |
| Sidebar main nav | `aside button:has-text("<label>")` |
| Sub-tab bên trái Danh mục | `ul.side-tabs li.tab-item:has-text("<label>")` |
| Table row | `.ant-table-tbody tr.ant-table-row` |
| Empty state | `.ant-empty, .ant-empty-description` |
| Pagination text | `.ant-pagination-total-text` |
| Search input DM | `input[placeholder="Tìm theo mã hoặc tên..."]` |
| Search button | `button:has-text("Tìm kiếm")` |
| Add new button | `button:has-text("Thêm mới")` |
| Row action Sửa/Xóa | `tr.ant-table-row:has-text("<ma>") a:has-text("Sửa")` ← **`<a>` chứ không phải `<button>`** |
| Form input Mã DM | `input[placeholder="Nhập mã danh mục"]` |
| Form input Tên DM | `input[placeholder="Nhập tên danh mục"]` |
| Form textarea Mô tả | `textarea[placeholder="Nhập mô tả (tùy chọn)"]` |
| Drawer form submit | `button:has-text("Đồng ý")` ← **NOT [Lưu] như spec** |
| Drawer cancel | `button:has-text("Hủy")` |
| Form validation error | `.ant-form-item-explain-error, .ant-form-item-explain` |
| Success toast | `.ant-message-success` |
| Error toast | `.ant-message-error, .ant-notification-error` |
| Delete confirm popup | `.ant-popconfirm` hoặc `.ant-popover` |
| User display top-right | `.user-name` (text role), `.user-role` (code) |
| Column headers | `.ant-table-thead th` |

**App-side quirks cần biết:**
- UI thực tế dùng **Drawer** (right panel) cho form CRUD, KHÔNG phải Modal dialog (spec nói modal)
- Button submit label **[Đồng ý]** thay vì **[Lưu]** theo spec
- Row action **Sửa/Xóa là `<a>` tag** chứ không phải `<button>`
- Trạng thái trong form là **radio button** ("Kích hoạt"/"Vô hiệu hóa") thay vì toggle ("Hoạt động"/"Không hoạt động") theo spec
- Navigation giữa categories: click `li.tab-item` trong `ul.side-tabs`, HOẶC goto URL `/quan-tri/danh-muc/{LOAI_DM}` (goto mất auth nếu cross chain — Rule 8)

**Preventive cleanup — đo được:**
- Sau ~8-10 chain/session, server bắt đầu báo "Starting server... timed out"
- **Pattern phòng ngừa:** cleanup + long sleep mỗi 5 TC hoặc khi thấy 1 chain đầu tiên crash
- Long sleep 25-30s là CẦN để chromium zombies cleanup hết — sleep 15s thường không đủ

## Known app bugs

| ID | Severity | Title |
|----|----------|-------|
| BUG-UI-01 | Minor | Login trang render 2-3s loading spinner trước khi form hiện |
| BUG-ENV-01 | Minor | Form login persist username/password giữa các lần navigate (dù không check "Ghi nhớ đăng nhập") |

## Quy trình phân loại tab trống / empty state khi QA

Khi thấy tab/màn hình rỗng hoặc placeholder, phân loại TRƯỚC khi log bug hoặc seed data (tránh log sai loại + tránh seed data khi thực chất là bug dev):

| Dấu hiệu quan sát | Phân loại | Xử lý |
|---|---|---|
| Text **"Chức năng đang phát triển"** + image "Trống" / placeholder SVG | **BUG — UI chưa build** (miss feature, vi phạm spec + AC) | Log Critical/Major, screenshot, cite SRS line + AC line. **KHÔNG** seed data — seed xong vẫn rỗng. |
| Text chuẩn: `"Chưa có dữ liệu"`, `"Không tìm thấy..."`, `"Chưa có vụ việc hỗ trợ"`, `.ant-empty` | **Empty state hợp lệ** — thiếu seed data | Seed đúng preset trong [`input/flow-module.md` §Phụ lục 2](input/flow-module.md) + fixture [`input/data/seed-fixture.yaml`](input/data/seed-fixture.yaml) → retest. |
| Table có data nhưng KPI=0, count sai, record mong đợi không hiện | **FE filter bug** hoặc **BE missing join** | MCP `list_network_requests` verify response payload. API trả data=[] → BE bug / wrong scope filter. API trả data nhưng UI không render → FE bug. |
| Text lạ / English leak / `null` / `undefined` / JSON dump | **BUG UI copy hoặc serialization** | Log Minor/Medium, screenshot. |
| Dropdown/list rỗng dù network 200 có bytes | **API double-wrap** (xem memory `qa_htpldn_api_wrap_bug`) | curl verify response shape, check BE envelope wrap 2 lần. |

**Iron rules:**
- KHÔNG log "empty state" thành bug khi chưa seed đủ upstream data theo preset ([Entity Map](input/data/entity-map.md) để trace).
- KHÔNG kết luận BE bug khi chưa check `list_network_requests` response payload.
- "Chức năng đang phát triển" = bug, không phải data gap — log ngay, đừng phí thời gian seed.

## Testing approach

- **Functional tests:** [output/funtion/](output/funtion/) — test cases per module (`7.X-<module>.md`)
- **Smoke specs:** [output/smoke-specs/](output/smoke-specs/) — smoke test 4 bước self-contained (`6.X-smoke-<module>.md`, số khớp funtion/)
- **State Machine specs:** [output/smoke/](output/smoke/) — states + test paths + BR (`6.X-sm-<module>.md`)
- **Template bug/report:** [output/template/](output/template/)
- **QA skills to use:** `/qa-only` (report-only), `/qa` (test + fix), `/browse` (manual exploration)

## Fetch OTP helper

```bash
curl -s "http://103.172.236.130:8025/api/v2/messages?limit=1" | python3 -c "
import sys, json, re
d = json.loads(sys.stdin.read())
msg = d['items'][0]
print('To:', msg['To'][0]['Mailbox'] + '@' + msg['To'][0]['Domain'])
print('OTP:', re.search(r'\b(\d{6})\b', msg['Content']['Body']).group(1))
"
```
