# Round 7 — Apply SRS update 2026-05-05 + partial reset DB (2026-05-06)

> **Lý do tồn tại:** Dev deploy 5 SRS update batch 2026-05-05 (FR-03 đào tạo, FR-04 CG/TVV/NHT/TC TV, FR-07 DN, FR-10 quản trị, FR-12 TVCS) + partial reset DB. Round 7 = re-seed Tier 0/1/2 cho actor mới + workflow E2E + functional 17 module + 2 NEW (NHT, TC TV) + cross-cutting + permission.
> **Round 6 frozen:** [`../round6-2026-05-01-postreset/`](../round6-2026-05-01-postreset/) — frozen, làm history reference.
> **Plan trigger:** [`../../../tasks/plan-r7-trigger.md`](../../../tasks/plan-r7-trigger.md) · **Todo:** [`../../../tasks/todo.md`](../../../tasks/todo.md) · **Delta map:** [`../../../input/srs-update-2026-5-5/_DELTA-MAP-*.md`](../../../input/srs-update-2026-5-5/) · **Fixture:** v2.7.1

---

## 0. Tiền điều kiện (verify trước khi bắt đầu)

Đã verify 2026-05-06 — ghi log: [`bug-reports/bug-report-deploy-gap.md`](bug-reports/bug-report-deploy-gap.md).

| # | Check | Status | Note |
|:-:|---|---|---|
| 1 | App + BE up | ✅ | http://103.172.236.130:3000 |
| 2 | MailHog up | ✅ | http://103.172.236.130:8025 |
| 3 | qtht_01 login | ✅ | OTP 666666 bypass |
| 4 | cb_nv_tw_01 login | ✅ | OTP 666666 bypass |
| 5 | Sub-menu TC TV + NHT visible với CB_NV_TW | ✅ | Verified MCP 2026-05-06 |
| 6 | 8/18 deploy gap | ⚠️ 6 bug Major/Medium/Minor + 2 false positive drop | xem bug-report |

> **🚫 Block test:** Phase 4/5/6/7 phụ thuộc DEPLOY-001 (NHT 404) + DEPLOY-002 (HOC_VIEN 404) — chờ dev fix.

---

## Folder structure

```
round7-2026-05-06/
├── README.md                       (file này)
├── bug-reports/                    (bug-report-*.md per module)
│   └── bug-report-deploy-gap.md   (R7.0.2 — 6 bug verified)
├── seed/                           (seed-checklist-*.md per actor)
├── workflow/                       (workflow-test-report-*.md per Trụ A/B/C/D)
├── functional/                     (functional-test-report-*.md per module)
├── evidence/                       (output verify cross-module + KPI)
├── screenshots/                    (PNG evidence — relative path `../screenshots/...` từ bug file)
└── image/                          (image embed cho bug-reports — base64 hoặc relative)
```

---

## Phase plan tổng quan

| Phase | Việc | Status |
|:-:|---|---|
| 0 | Pre-test (deploy verify + bug gap + fixture + UI audit) | 🟢 in progress |
| 1 | Re-seed Tier 0 (DM/đơn vị/SLA/MPH/ngày lễ) | 🟢 ready |
| 2 | Re-seed Tier 1 (TC TV/DN/TVV/CG/NHT/account/PC) | ⏳ partial — chờ NHT entity |
| 3 | Re-seed Tier 2 (transactional state) | ⏳ partial — chờ HOC_VIEN entity |
| 4 | Workflow E2E (Trụ A/B/C/D) | ⏳ chờ Phase 1-3 |
| 5 | Verification (KPI/cross/SLA/audit) | ⏳ chờ Phase 4 |
| 6 | Workflow đầu ra hậu kỳ (Chi trả/TVN/CT) | ⏳ chờ Phase 4 |
| 7 | Functional 17 module + 2 NEW (NHT/TC TV) | ⏳ chờ Phase 1-3 |
| 8 | Cross-cutting + Profile + Permission | 🟢 ready song song |

Chi tiết task: [`../../../tasks/todo.md` §Round 7](../../../tasks/todo.md).

---

## Bài học rút ra (cập nhật khi gặp sai)

- **2026-05-06:** Verify "UI element thiếu" phải dùng đúng role permission per SCR — không default QTHT all-access. False positive 2/8 bug deploy gap. [`tasks/lessons-learned.md` 2026-05-06](../../../tasks/lessons-learned.md). Memory: [`feedback_verify_ui_gap_role_permission.md`](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_verify_ui_gap_role_permission.md).
