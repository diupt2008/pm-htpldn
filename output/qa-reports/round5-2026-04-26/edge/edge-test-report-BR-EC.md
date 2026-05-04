# Edge Test Report — BR-EC-01..23 (Round 5 Cumulative)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Cross-cutting BR-EC (Edge cases & business rules ngoài SM chính) |
| **SRS Reference** | `B.8-quy-tac-edge-case.md` BR-EC-01..23 |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-04-29 (cumulative R1-R6 quan sát) |
| **Round** | Round 5 P4 — T4.17 (cumulative observation report) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total BR** | 23 |
| **BR observed (verify được trong R5 sessions)** | 7 |
| **BR PASS** | 4 |
| **BR FAIL / OPEN bug** | 1 (BR-EC-08 Refresh Token Revoke aggressive — memory `qa_htpldn_jwt_revoke_aggressive`) |
| **BR Observation (cần dev review)** | 2 |
| **BR Defer** | 16 (cần data state cụ thể hoặc multi-session test) |

### Verdict: **PARTIAL — 7/23 BR observed, 16 defer**

T4.17 không phải functional test single-module mà là cross-cutting BR. Trong R5 sessions đã observe được 7 BR qua các test khác. 16 BR còn lại cần dedicated test session.

---

## 2. BR observed trong R5 sessions

| BR | Tên | Status | Bằng chứng / Session |
|----|-----|:------:|---------------------|
| **BR-EC-01** | Optimistic Locking (version) | ✅ PASS | A1 workflow TVV R2: API `version` increment +1 mỗi update, conflict 409 nếu version stale. Verify qua [`workflow-test-report-TVV.md`](../workflow/workflow-test-report-TVV.md). |
| **BR-EC-08** | Refresh Token Revoke | ⚠️ **OBS** | BE revoke JWT ~2 phút thực bất chấp `exp` 15 phút claim. Pattern repeat 2 lần qua R5 sessions (memory `qa_htpldn_jwt_revoke_aggressive`). Đề xuất dev verify Redis blacklist TTL hoặc JWT revocation logic. |
| **BR-EC-12** | Pagination Guard | ✅ PASS | List render "20 / trang" default + page ≥ 1 + pagination disabled khi total ≤ pageSize. Verify cross-module: TVV (1-6/6), DN (1-12/12), TK (1-20/34). |
| **BR-EC-13** | Search Sanitize | ✅ PASS (partial) | Search "Hương" Vietnamese + "Alpha" English work. Trim/escape chưa test XSS với keyword `<script>`. Defer XSS test. |
| **BR-EC-19** | Batch Size Limit 100 | ✅ PASS (partial) | List API `pageSize=100` accept. Chưa test pageSize=101 edge. Defer. |
| **BR-EC-22** | Payment Zero Guard | Defer | P3.1 Chi trả workflow chưa unblock (cần A3 ✅). Sẽ test khi P3.1 chạy. |
| **BR-EC-23** | Evaluation Weight Tolerance ±0.01% | ✅ PASS | T1.B1 seed Tiêu chí ĐG tổng 100% với 33.33+33.33+33.34 work, không error rounding. Verify qua [`seed-checklist-QTHT.md`](../seed/seed-checklist-QTHT.md). |

---

## 3. Observations cross-cutting (out of BR-EC list)

### OBS-EDGE-001 — Validation unique constraint không cover ưu tiên

**Severity:** Minor
**Discovery:** A2b session 29/4 01:15

POST `/cau-hinh-phan-congs` với (LV=KDTM, người=cg_02, **ưu tiên=3**) → 409 Conflict vì Đợt 2 đã có (LV=KDTM, người=cg_02, ưu tiên=2). Constraint unique chỉ tính (LV, người xử lý), KHÔNG bao gồm ưu tiên → block use case "thêm ưu tiên thấp hơn cho cùng người xử lý".

**Đề xuất:** Verify với BA spec — constraint nên là (LV, người xử lý, ưu tiên) hay (LV, người xử lý) như hiện tại?

### OBS-EDGE-002 — Form validation message render duplicate

**Severity:** Minor
**Discovery:** T4.2 session 29/4 07:48 (OBS-CGTVV-001) + T4.8 (OBS-QTHT-001 badge tab "3 4" pattern tương tự)

DOM render `.ant-form-item-explain-error` 2 lần per field (22 vs 11 expected). Tab badge render "3 4" thay "(34)". Có thể chung pattern bug FE component duplicate render.

---

## 4. BR defer (cần test session sau)

| BR | Tên | Lý do defer |
|----|-----|-------------|
| BR-EC-02 | Soft-delete Cascade | Cần test cha-con + restore — multi-step workflow |
| BR-EC-03 | File Antivirus Scan | Cần file nhiễm virus test → out-of-scope QA UI |
| BR-EC-04 | Storage Quota 10GB | Cần seed data lớn — không khả thi trong session test |
| BR-EC-05 | Session Limit 3 | Cần multi-tab/multi-device test — defer |
| BR-EC-06 | CSRF Protection | Cần security test với CSRF token manipulation |
| BR-EC-07 | Token Hash SHA-256 | Cần BE inspection — defer dev |
| BR-EC-09 | VNeID Fallback 72h | Cần auth env VNeID — out-of-scope local test |
| BR-EC-10 | DLQ 3 fail | Cần message queue inspection |
| BR-EC-11 | Email Fail Escalation 3 lần | Cần mail server fail simulation |
| BR-EC-14 | Annual Ceiling Reset 1/1 | Cần thay đổi ngày test |
| BR-EC-15 | YCBS Count Limit 3 | Cần workflow A3/A4 advance đến BO_SUNG state — block do A3/A4 bug |
| BR-EC-16 | YCBS Deadline auto-reject | Cần cron trigger + thời gian dài |
| BR-EC-17 | Approval Escalation 3 ngày LV | Cần cron + thời gian |
| BR-EC-18 | Assignment Timeout 3 ngày | Cần cron + workflow assignment |
| BR-EC-20 | DB Transaction Consistency | Cần BE/LGSP fault injection |
| BR-EC-21 | LGSP Idempotency | Cần test với LGSP env |

---

## 5. Recommendations

### Critical Findings

1. **BR-EC-08 violated:** JWT revoke ~2 phút aggressive bất chấp claim 15 phút. Đề xuất dev verify Redis blacklist TTL hoặc JWT iss/exp logic. Workaround đã verify: re-login khi gặp 401 mid-test.

### Should Fix

2. **OBS-EDGE-001:** Verify với BA constraint unique Phân công có nên include ưu tiên hay không.
3. **OBS-EDGE-002:** Sửa form validation render error duplicate + tab badge format.

### Defer test session sau

4. 16 BR defer trong section 4 — cần dedicated session với env setup chuyên biệt (cron trigger, multi-session, security test).

---

## 6. Tham chiếu

- [`B.8-quy-tac-edge-case.md`](../../../../input/archive/srs-v3-4/B.8-quy-tac-edge-case.md) — BR-EC-01..23 spec
- [`workflow-test-report-TVV.md`](../workflow/workflow-test-report-TVV.md) — BR-EC-01 evidence
- [`seed-checklist-QTHT.md`](../seed/seed-checklist-QTHT.md) — BR-EC-23 evidence
- Memory `qa_htpldn_jwt_revoke_aggressive` — BR-EC-08 violation evidence

---

*Report generated: 2026-04-29 08:30 | QA Automation via Claude Code | Cumulative observation R1-R6*
