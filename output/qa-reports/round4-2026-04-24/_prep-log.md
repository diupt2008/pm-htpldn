# P0 Prep Log — Round 4 (2026-04-24)

**Phase:** P0 Prep (0.5 ngày) • **Plan ref:** [plan.md](../../../tasks/plan.md) §P0 • **Executor:** QA AI (MCP Chrome DevTools primary)
**Start:** 2026-04-24 10:20 • **End:** 2026-04-24 10:35 • **Result:** PASS → C0 auto-gate OK → auto-continue P1

---

## T0.1 — Env + MCP + 11 vai trò login verification

### 1. Environment health

| Target | URL | Check | Kết quả |
|--------|-----|-------|--------|
| App CMS | http://103.172.236.130:3000/ | `curl -sSf` | **HTTP 200** (0.21s) |
| MailHog OTP inbox | http://103.172.236.130:8025/ | `curl -sSf` | **HTTP 200** |
| App (giữa session) | http://103.172.236.130:3000/ | transient down 1 phút | Self-recovered < 30s — không block. Log note: lần 1 curl sau login qtht_01 → `ERR_CONNECTION_REFUSED`, retry 1× sau 15s → 200. |

**Ghi chú:** Env có 1 transient down ~15s giữa session (không phải down kéo dài, không block). Theo Risk R1 (plan §5), sẽ tiếp tục monitor trong P1.

### 2. MCP Chrome DevTools tool verification

Tool prefix `mcp__chrome-devtools__*` verified qua login qtht_01 (CLAUDE.md MCP-Template):

| Tool | Verification | Status |
|------|--------------|--------|
| `new_page` / `navigate_page` | Open /login + re-navigate giữa role | **OK** |
| `wait_for` | Signal-based wait ("Nhập tên đăng nhập", "Nhập mã xác thực", landing text) | **OK** |
| `take_snapshot` | Lấy uid a11y tree form login + dashboard sidebar | **OK** |
| `fill_form` | Fill username + password batch | **OK** |
| `click` | Click nút [Đăng nhập] (1 TC cần click 2 lần — vẫn PASS, không block) | **OK** |
| `type_text` | Nhập OTP `666666` bypass | **OK** |
| `evaluate_script` | `sessionStorage.clear()` + `localStorage.clear()` giữa role | **OK** |
| `wait_for` (post-OTP) | Match `"Tổng quan hệ thống"` / `"403"` tùy role | **OK** |

**Kết luận:** MCP primary tool healthy. Gstack `$B` fallback không cần invoke. 0 MCP crash trong 11 login attempts.

### 3. 11 vai trò login verification (primary `_01` accounts)

Convention: `users.csv` v2 — 1 primary `_01` mỗi vai trò, fallback `_02 → _03` per Rule 7.

| # | Vai trò | Account | Landing URL | User hiển thị | Sidebar scope | Kết quả |
|---|---------|---------|-------------|---------------|---------------|---------|
| 1 | **QTHT** | `qtht_01` | `/dashboard` | QTHT Test 01 | 13 module (full) | ✅ **PASS** |
| 2 | **CB_NV_TW** | `cb_nv_tw_01` | `/dashboard` | CB Nghiệp vụ TW 01 | 13 module (full) | ✅ **PASS** |
| 3 | **CB_PD_TW** | `cb_pd_tw_01` | `/dashboard` | CB Phê duyệt TW 01 | 13 module (full) | ✅ **PASS** |
| 4 | **CB_NV_BN** | `cb_nv_bn_01` (BKH) | `/dashboard` | CB NV BN 01 (BKH) | 13 module, dashboard filter KHÔNG có "Đơn vị" dropdown (scope lock) | ✅ **PASS** |
| 5 | **CB_PD_BN** | `cb_pd_bn_01` (BKH) | `/dashboard` | CB PD BN 01 (BKH) | 13 module, scope lock BKH | ✅ **PASS** |
| 6 | **CB_NV_DP** | `cb_nv_dp_01` (AG) | `/dashboard` | CB NV DP 01 (AG) | 13 module, scope lock STP-AG | ✅ **PASS** |
| 7 | **CB_PD_DP** | `cb_pd_dp_01` (AG) | `/dashboard` | CB PD DP 01 (AG) | 13 module, scope lock STP-AG | ✅ **PASS** |
| 8 | **CG** | `cg_01` (AG) | `/403` | Chuyên gia 01 (AG) | 2 module: Đào tạo + Tư vấn | ✅ **PASS** (/403 expected per role-scope) |
| 9 | **NHT** | `nht_01` (AG) | `/403` | Người hỗ trợ 01 (AG) | 4 module: Đào tạo, Vụ việc, DN, Tư vấn | ✅ **PASS** (/403 expected) |
| 10 | **TVV** | `tvv_01` (AG) | `/403` | Tư vấn viên 01 (AG) | 4 module: Đào tạo, CG/TVV, Vụ việc, Tư vấn | ✅ **PASS** (/403 expected) |
| 11 | **DN** | `dn_01` (AG) | `/login` (stuck) | — | Không vào CMS | ⚠️ **EXPECTED-BLOCK** — toast: *"Tài khoản Doanh nghiệp tương tác qua API chuyên trang, không đăng nhập CMS. Vui lòng sử dụng Cổng PLQG."* — **auth policy đúng design**, DN dùng external API / Cổng PLQG, không có CMS seat |

**Tóm tắt:** 10/11 login PASS CMS + 1/11 EXPECTED-BLOCK (DN by design, không phải bug). Auth + role-scope + sidebar filter đều enforce đúng.

**Note cho Round 5 Permission Matrix:** Bảng trên đã sơ bộ cho thấy:
- 4 role "CB" cấp TW/BN/DP landing `/dashboard`, CG/NHT/TVV landing `/403` (tức không có dashboard role).
- Sidebar count: CB/QTHT = 13 module, CG = 2, NHT = 4, TVV = 4.
- Dashboard filter "Đơn vị" chỉ hiển thị cho QTHT + CB_NV_TW + CB_PD_TW (scope cấp TW); BN/DP scope lock → không render filter. → Ghi nhận cho BR-AUTH-08 validation ở Round 5.
- DN role không tham gia matrix CMS; test API coverage theo module M14 (API chia sẻ) ở P4 T4.16.

### 4. Templates readiness

`output/template/` có **11 file** (≥10 yêu cầu):
```
bug-report-template.md
functional-test-report-template.md
permission-matrix-test-report-template.md
seed-checklist-template.md
smoke-procedure.md
smoke-test-report-template.md
test-case-execution-report-template.md
test-case-template.md
test-plan-overview-template.md
workflow-test-report-template.md
README.md
```

### 5. Known issues / observations

1. **Click [Đăng nhập] đôi khi cần 2 lần click**: 1 lần trong 11 attempts (cb_nv_tw_01) cần click lại sau khi lần 1 không fire submit. Không block — retry 1× là workaround. Sẽ track pattern trong P1 smoke.
2. **Env transient down ~15s** giữa session (sau role 3 → role 4). Self-recovered, không block. Nếu tái diễn ≥3 lần/session → escalate theo Risk R1.
3. **DN auth policy**: CMS reject DN login với toast rõ ràng — policy đúng design, không log bug. Đưa vào note Round 5 Permission Matrix.
4. **Dashboard filter asymmetry**: BN/DP role không có "Đơn vị" dropdown trong dashboard filter — có thể là scope-lock đúng BR-AUTH-08, nhưng cần verify formal ở Round 5 test `qa_htpldn_qtht_fr01_05_round3` BUG-002 regression (Dashboard TVV count=0 cho QTHT_DP).

### 6. Tool strategy confirmed cho Round 4

- **Primary:** Chrome DevTools MCP (verified 11 login, 0 crash)
- **Fallback:** Gstack `$B chain` (chưa cần invoke)
- **MCP-Template login pattern** (CLAUDE.md MCP-Rule 1-4) hoạt động đúng với user convention mới `_01/_02/_03`.

---

## T0.2 — Archive round 3 + create round 4 skeleton

### Archive status

| Folder | Status |
|--------|--------|
| `output/qa-reports/round1_2026-04-16` | Đã ở `_archive/` ✅ |
| `output/qa-reports/round2_2026-04-16` | Đã ở `_archive/` ✅ |
| `output/qa-reports/round3-2026-04-20` | Đã ở `_archive/` ✅ |

Không có round3 orphan ở top-level → archive đã done trước phiên này.

### Round 4 skeleton

Path: `output/qa-reports/round4-2026-04-24/` — **đã có sẵn 11 subfolder** theo plan §9:

```
round4-2026-04-24/
├── _prep-log.md            ← file này (mới tạo)
├── chi-tiet/               (P5 T5.1)
├── design-review/          (P5 T5.2)
├── edge/                   (P4 T4.17)
├── evidence/               (cross-phase)
├── functional/             (P4 T4.1-T4.16)
├── nonfunc/                (P5 T5.5)
├── regression/             (P5 T5.3, T5.4)
├── screenshots/            (cross-phase)
├── seed/                   (P1 T1.B + P2)
├── smoke-test/             (P1 T1.A1)
└── workflow/               (P3 T3.1-T3.8)
```

Verdict: skeleton complete. Không cần tạo folder mới.

---

## C0 auto-gate decision

| Criteria | Result |
|----------|--------|
| Env (App + MailHog) HTTP 200 | ✅ |
| 11 vai trò login verified | ✅ 10 PASS CMS + 1 EXPECTED-BLOCK (DN by design) |
| MCP tool healthy | ✅ 0 crash |
| Templates ≥10 | ✅ 11 file |
| Archive + skeleton ready | ✅ |

**→ C0 PASS → auto-continue P1 (Smoke + Seed Tier 0-1).**

Next session: **T1.A1 Smoke 16 module × 5 role major** (admin/qtht_01, cb_nv_tw_01, cb_pd_tw_01, cb_nv_bn_01, cb_nv_dp_01) per plan §P1 Block A.
