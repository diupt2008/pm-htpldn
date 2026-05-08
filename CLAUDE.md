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
2. **2-source SRS verify:** query NotebookLM HTPLDN (id `a4ae45bf-cea0-4325-8fee-b1e0be702cf2`) + grep SRS local — mọi log/đóng/đổi severity.
3. **Workaround = bug candidate.** Gặp 4xx/5xx → log, không skip vì "tự fix được".

## Chrome DevTools MCP — PATTERNS BẮT BUỘC (primary tool từ 2026-04-21)

**Lý do MCP > gstack:** 0% crash qua smoke (vs 20-50% gstack), 1 lần login/session (vs re-login mỗi bash do `$PPID` reset), native `list_network_requests` + `list_console_messages` inspection.

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

**App auth lưu trong `localStorage` key `auth-store`** (verified 2026-05-08 R7.4.A3-PUBLIC, app dùng cả `localStorage` cho user state lẫn HttpOnly refresh-token cookie). `navigate_page` URL = full reload = app re-init check BE session → redirect `/login` nếu backend không chấp nhận.

- ❌ `navigate_page({url: "/quan-tri/danh-muc"})` sau login → kick về `/login`
- ✅ `click({uid: sidebar_button_uid})` → React Router internal navigate, giữ app state

**Chỉ dùng `navigate_page` cho:** lần đầu session (goto `/login`), hoặc khi cần force reload (logout test).

**Logout đúng cách (verified 2026-05-08):** Chỉ `localStorage.clear()` thì navigate `/login` vẫn bounce về `/dashboard` vì BE còn refresh-token cookie HttpOnly. Phải gọi đủ:

```js
await fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' });
localStorage.clear(); sessionStorage.clear();
// rồi navigate_page('/login')
```

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

MCP tool call tuần tự native, single browser process, `sessionStorage` persist cross-call → **KHÔNG cần Rule 6 cleanup, Rule 7 retry, Rule 8 session reset, Rule 10 fix chain, Rule 11 mega-chain** (xem [docs/legacy/gstack-fallback-rules.md](docs/legacy/gstack-fallback-rules.md)). Nếu MCP server crash thật sự (hiếm), restart Claude Code → MCP tự reconnect.

### MCP-Rule 6: Phân loại lỗi TRƯỚC khi react

Logic Rule 9 phân loại (xem §Shared rules dưới) áp dụng cho cả MCP. Mapping tool gstack → MCP equivalent khi capture diagnostic:

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

### MCP-Rule 7: CSS selector qua `evaluate_script`

Khi cần match CSS selector (click element ẩn, count elements, check class), dùng `evaluate_script`. Selector library + app-side quirks ở §Shared rules dưới (Rule 11) — copy selector vào `document.querySelector(...)` trong JS function.

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

### Template login MCP — verified 2026-04-21 với `qtht_01`

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

**Role CB_TW landing `/403` sau login = PASS** (role không có dashboard default), sidebar vẫn render đầy đủ. Dùng `wait_for(["Quản trị hệ thống"])` làm signal thay vì text dashboard.

---

## Shared rules — áp dụng cả MCP và gstack

### Rule 7 (Account lock fallback)

**Account lock / login failed — Auto-fallback trong cùng role+cấp group, hết mới STOP báo user:**

Nếu login fail (toast `Tài khoản tạm khóa` / `Invalid credentials` / HTTP 401 từ `POST /api/v1/auth/login` / URL stuck ở `/login` sau submit):

**Step 1 — Capture evidence NGAY khi phát hiện fail:**
- Screenshot login page (MCP: `take_screenshot` / gstack: `$B screenshot`)
- Console errors (MCP: `list_console_messages({types:["error"]})` / gstack: `$B console --errors`)
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

### Rule 9 (Phân loại lỗi diagnostic)

**Áp dụng trước Rule 6 cleanup / Rule 7 retry / Rule 8 session reset (gstack-only — xem [docs/legacy/gstack-fallback-rules.md](docs/legacy/gstack-fallback-rules.md)).** Mục đích: tránh retry mù với lỗi không phải crash, tránh đốt thời gian vô ích, đảm bảo diagnostic rõ ràng khi báo user.

#### Step 1 — Capture diagnostic BẮT BUỘC khi fail

Ngay sau khi phát hiện fail (wait timeout / URL lạ / toast lỗi), capture **trước khi quyết định action**. Tool mapping ở MCP-Rule 6 — dùng MCP `take_screenshot` + `list_console_messages` + `list_network_requests` + `evaluate_script` (gstack equivalent: `$B screenshot/console/network/html`).

Không capture = không phân loại được = chỉ còn đường mark BLOCKED bừa → lặp lại sai lầm 2026-04-19.

#### Step 2 — Phân loại theo bảng

| Dấu hiệu quan sát | Phân loại | Action |
|-------------------|-----------|--------|
| URL `about:blank` giữa 2 bash invocations (có `[browse] Starting server...` lặp) | **HARNESS — session reset** (gstack-only) | Fix theo Rule 8 (atomic chain). **KHÔNG** cleanup, **KHÔNG** retry |
| URL `about:blank` giữa 2 step liên tiếp TRONG cùng chain | **REAL CRASH** | Áp dụng Rule 6 cleanup + Rule 7 retry 1 lần (gstack) / restart MCP |
| `wait <selector>` timeout + DOM grep thấy element tương tự nhưng class khác | **SELECTOR OUTDATED** | Update selector trong CLAUDE.md/spec, re-run. **KHÔNG** retry với selector cũ |
| `wait` timeout + console errors sạch + network có request `pending >10s` | **APP/BE BUG** | **STOP**, escalate user + BE team. **KHÔNG** retry (retry = chờ cùng bug) |
| `wait` timeout + console errors có TypeError/500 toast | **APP/FE BUG** | **STOP**, log console + screenshot, escalate FE team |
| `[browse] The operation timed out` sau chain có >15 step | **CHAIN QUÁ DÀI** (gstack-only) | Split chain, bridge cookies (`$B cookies` / `$B cookie-import`) |
| Error `Target page, context or browser has been closed` | **REAL CRASH** | Áp dụng Rule 6 cleanup + Rule 7 retry 1 lần (gstack) / restart MCP |
| Toast `Tài khoản tạm khóa` / `Invalid credentials` | **ACCOUNT ISSUE** | STOP theo Rule 7 account lock, đổi account |
| `curl` pre-flight server → ≠ 200 / auth endpoint timeout | **ENV DOWN** | STOP, escalate infra, không chạy smoke |

#### Step 3 — Escalate với phân loại rõ ràng

Khi báo user BLOCKED, **phải nêu rõ phân loại** từ bảng trên (xem format trong Rule 7). User cần biết lỗi là harness/app/env/crash để quyết định đúng.

#### Anti-pattern — TUYỆT ĐỐI KHÔNG

- ❌ Tăng timeout + retry nhiều lần khi chưa phân loại → không fix được selector sai / session reset / app bug
- ❌ Mark BLOCKED ngay khi thấy timeout đầu tiên → chưa có diagnostic, user không biết lỗi gì
- ❌ Cleanup + retry ngay khi thấy `about:blank` → nếu là session reset, cleanup không giúp
- ❌ Bỏ qua Step 1 capture diagnostic → mất bằng chứng để user debug

#### Ví dụ đúng (verified 2026-04-19)

```
Observation: wait '.ant-otp input[maxlength="1"]' timeout 15s
→ Step 1 capture: html body → tìm thấy '<input class="_otpInput_1y5cx_206" inputmode="numeric" maxlength="1">'
→ Step 2 phân loại: SELECTOR OUTDATED (class custom CSS module, không phải .ant-otp)
→ Step 3 action: update selector thành 'input[inputmode="numeric"][maxlength="1"]', update CLAUDE.md, retry 1 lần → PASS
```

### Rule 11 (Selector library + App-side quirks)

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
- Navigation giữa categories: click `li.tab-item` trong `ul.side-tabs`, HOẶC goto URL `/quan-tri/danh-muc/{LOAI_DM}` (goto có thể mất auth nếu cross chain — gstack Rule 8)

> **⚠️ App-side bug — VẪN áp dụng với MCP:** Pattern "4th sidebar click destabilize page" (click `Quản trị hệ thống` → `Danh mục dùng chung` → `Tài khoản & phân quyền` → `Cấu hình hệ thống` thường crash). Workaround: cap 3 navigation/session, reload `/login` làm fresh start nếu cần. Long-term: escalate dev (memory leak / event listener accumulation trong React component sidebar).

---

## Gstack browse (`$B`) — LEGACY / FALLBACK (archived 2026-04-21)

**Status:** Gstack giữ làm fallback khi MCP unavailable hoặc cần CSS-selector-exact-match. **Chi tiết patterns:** [docs/legacy/gstack-fallback-rules.md](docs/legacy/gstack-fallback-rules.md).

**Reference compatibility — old "Rule N" → location:**

| Rule cũ (gstack) | Status | Location |
|---|---|---|
| Rule 1 (`wait` trước fill/click) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-1-wait-trước-mọi-fillclick) |
| Rule 2 (snapshot ref `@e*`) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-2-snapshot-ngay-trước-khi-dùng-e-ref) |
| Rule 3 (OTP custom CSS) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-3-otp-custom-css-module--dev-đã-bypass-với-otp-cố-định-666666) |
| Rule 4 (selector đặc hiệu) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-4-selector-đặc-hiệu-tránh-multi-match) |
| Rule 5 (atomic login chain) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-5-login-flow--bắt-buộc-dùng-atomic-b-chain-với-json-file) |
| Rule 6 (cleanup zombie) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-6-recovery-khi-server-crash-full-cleanup--chặn-zombie-leak) |
| Rule 7 (Account lock fallback) | **SHARED** | §Shared rules ở trên |
| Rule 7 (crash retry) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-7-phần-crash-retry-browse-crash-trong-qa-test--chỉ-retry-sau-khi-phân-loại-rule-9) |
| Rule 8 (session reset) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-8-session-reset-giữa-các-bash-invocations--không-phải-crash) |
| Rule 9 (Phân loại lỗi) | **SHARED** | §Shared rules ở trên |
| Rule 10 (R3.1 fixes) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-10-pattern-stable-hóa-từ-session-2026-04-20-r31--3-fix-browse-measured) |
| Rule 11 (selector library + quirks) | **SHARED** | §Shared rules ở trên |
| Rule 11 (mega-chain) | gstack-only | [legacy](docs/legacy/gstack-fallback-rules.md#rule-11-phần-mega-chain-pattern-test-batch--tránh-re-login-overhead) |

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
