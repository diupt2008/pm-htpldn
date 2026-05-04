# Round 5 — QA PM HTPLDN (start 2026-04-26)

**Plan:** [tasks/plan.md](../../../tasks/plan.md) · **Todo:** [tasks/todo.md](../../../tasks/todo.md)

## Cấu trúc folder

| Folder | Nội dung | Phase |
|---|---|---|
| `smoke-test/` | Smoke 16 module × 5 vai trò chính | P1 (T1.A1) |
| `seed/` | 9 seed-checklist (QTHT/DN/TVV/BIEUMAU/HOIDAP/VUVIEC/TVCS/HSPL + Đào tạo + Kho QA + ĐG) | P1-P2 (T1.B*, T1.C*, B1-B6, D1, D3) |
| `workflow/` | 9 workflow report (TVV/VV/HD/TVCS/Khóa học/Biểu mẫu/ĐG/Chi trả/TVNhanh/CTHTPLDN GĐ1+GĐ2) | P2-P3 |
| `functional/` | 16 functional report module (T4.1..T4.16) + edge BR-EC (T4.17) | P4 |
| `chi-tiet/` | TC chi tiết field-level (BVA/EP/XSS) ≥6 module ưu tiên | P5 (T5.1) |
| `design-review/` | UI review compare prototype × 16 module | P5 (T5.2) |
| `edge/` | TC chi tiết edge BR-EC-01..23 | P4-P5 |
| `regression/` | Regression bug round trước (R1-R4 closed verify) | P5 (T5.3) |
| `nonfunc/` | Phi chức năng (perf, security, session) | P5 (T5.5) |
| `evidence/` | Curl payload, network HAR, JSON API capture | All |
| `screenshots/` | PNG, GIF, snapshot | All |
| `bug-reports/` | 1 file/phase (Open + Closed-verified) | All |

## Checkpoint files

- `_prep-log.md` — T0.1 prep verify env + 11 vai trò ✅ DONE
- `_checkpoint-P1.md` — sau C1 gate (cuối T1)
- `_pillar-A-result.md` … `_pillar-E-status.md` — sau C2 gate (cuối T2, gộp 5 trụ)
- `_checkpoint-P3.md` — sau C3 gate (cuối T3)
- `_checkpoint-P4.md` — sau C4 gate (cuối T4)
- `test-summary-round5.md` — tổng kết R5 (T5.6, sau C5 gate)

## Quy ước file naming

- Seed: `seed-checklist-{ENTITY}.md` (vd `seed-checklist-DN.md`, `seed-checklist-QTHT.md`)
- Workflow: `workflow-test-report-{ENTITY}.md`
- Functional: `functional-report-{module}.md` (vd `functional-report-hoi-dap.md`)
- Cross-module/Cross-entity: `cross-module-report.md`
- Bug Open: 1 file/phase trong `bug-reports/`, embed screenshot inline base64

## Acceptance Round 5 (theo plan)

- ≥6 record state cuối/entity (chuẩn bị cho LỚP 4 báo cáo + dashboard)
- 11 vai trò × 16 module phân quyền verified (deferred sang [Round 5 Permission](../../../tasks/_archive/round5/plan.md))
- Cross-module 6 luồng (DN↔VV / TVV↔VV / HD↔PD / HD→KhoQA / DN↔VV↔HSPL / VV↔Chi trả) PASS
- Pass rate ≥75% functional + ≥80% regression close R1-R4 bug
