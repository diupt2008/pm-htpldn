# QA Execution Plan — Round 5 Permission Matrix & Data Isolation PM HTPLDN

**Ngày lập:** 2026-04-24 (v1.0)
**Based on:** [output/test-strategy.md](../../../output/test-strategy.md) §5 + §7.17 + [output/permission-matrix.md](../../../output/permission-matrix.md) + [input/users.csv](../../../input/users.csv)
**Scope:** Full ma trận phân quyền 11 role × 16 module × entity × CRUD + Data Isolation DI-01..DI-09 deep test
**Timeline:** 1.5 tuần (7-10 working days) — kick off sau Round 4 C4 sign-off
**Dependency:** Round 4 complete (C4 accepted) → Round 5 start. Có thể **song song với dev hotfix Round 4 bugs**.
**Executor:** 1 QA AI agent (MCP Chrome DevTools primary, gstack `$B` fallback)
**Output root:** `output/qa-reports/round5-{YYYY-MM-DD}/`

---

## 1. Lý do tách Round 5 (v1.2 2026-04-24)

| # | Lý do | Trade-off |
|---|-------|-----------|
| 1 | Auth test là cross-cutting concern — pattern "role-walkthrough" khác mindset functional | Tester focus sạch, không lẫn bug functional vs auth |
| 2 | ~1.000 TC = 1 tuần riêng → gộp vào Round 4 P4 nén functional 10 module < 4 ngày | Rút Round 4 xuống 4 tuần, release candidate nhanh hơn |
| 3 | Idempotent — dễ re-run sau dev hotfix | Run lại Round 5 rẻ, không cần re-seed |
| 4 | Phụ thuộc ngược — auth test noisy khi functional còn bug (vd button Sửa mất vì bug UI ≠ auth deny) | Chạy SAU Round 4 stabilize = signal sạch |
| 5 | Song song với dev hotfix Round 4 bugs → không block release timeline | Dev có gap 1.5 tuần fix bug; QA không idle |

**Risk:** Nếu Round 5 phát hiện auth bug Critical (vd BN thấy data TW, Portal role vào được CMS) → có thể delay release. Mitigation: smoke-level auth 40 TC/module đã chạy ở Round 4 bắt ~80% auth bug phổ biến; Round 5 catch edge cases (row-level, cross-module permission, entity-level CUD deny).

---

## 2. Mục tiêu & Exit criteria

| # | Tiêu chí | Ngưỡng | Nguồn |
|---|---------|--------|-------|
| G4-full | Authorization matrix 100% cells | Mỗi ô `entity × role × op (C/R/U/D)` trong `permission-matrix.md` có ≥1 positive + ≥1 negative test PASS | §5.1 test-strategy |
| G6-full | Data isolation DI-01..DI-09 | 9 scenario × 3 cấp TW/BN/DP × ≥3 module sample = 81 TC PASS | §5.2 test-strategy |
| G10 | Portal role CMS block | `cg_01`, `dn_01`, `nht_01`, `tvv_01` truy cập CMS URL trực tiếp → 403/redirect. Chỉ `dn_01` dùng API endpoint được | DI-09 + BR-AUTH-01 |
| G11 | Row-level security | CB PD ≠ cấp khác không duyệt được; người tạo ≠ đơn vị khác không sửa được | BR-AUTH-05/06 |

Không đạt G4-full → **FAIL**, redelivery Round 5. G6-full / G10 / G11 partial → **PASS with caveats**.

---

## 3. Phương pháp test (theo §5 test-strategy)

### 3.1 Test Pattern per cell

```
Cell = (entity, role, operation)
  1. Positive: login role có quyền → thực hiện op → thành công
  2. Negative: login role không quyền → thực hiện op → bị chặn (button ẩn / 403 / validation)
  3. URL direct: login role không quyền → truy cập URL trực tiếp → redirect/403
```

### 3.2 Batch strategy — role-walkthrough

11 batch, mỗi batch 1 role đi walk 16 module:

| Batch | Role | Account | Scope ~ TC |
|-------|------|---------|-----------|
| B1 | QTHT | qtht_01 | 16 module × (entity × R/CUD for non-business) ~80 |
| B2 | admin | admin | 16 module × full audit ~80 |
| B3 | CB_NV_TW | cb_nv_tw_01 | 16 module × CRUD business + R QTHT ~150 |
| B4 | CB_PD_TW | cb_pd_tw_01 | 16 module × R+Approve business ~100 |
| B5 | CB_NV_BN | cb_nv_bn_01 (BKH) | 16 module × CRUD scope BN ~120 |
| B6 | CB_PD_BN | cb_pd_bn_01 (BKH) | 16 module × R+Approve scope BN ~80 |
| B7 | CB_NV_DP | cb_nv_dp_01 (AG) | 16 module × CRUD scope DP ~120 |
| B8 | CB_PD_DP | cb_pd_dp_01 (AG) | 16 module × R+Approve scope DP ~80 |
| B9 | Portal DN | dn_01 | API-only test (18 API outbound) + CMS block ~50 |
| B10 | Portal TVV | tvv_01 | CMS login → chỉ HO_SO_VV + KET_QUA_VV (BR-AUTH-09) + CMS block khác ~40 |
| B11 | Portal CG + NHT | cg_01, nht_01 | CG: TV Chuyên sâu only. NHT: chỉ VV phân công (DI-06). ~60 |
| **Total** | | | **~1.000 TC** |

### 3.3 Data Isolation (DI-01..DI-09) — deep test

Chạy CUỐI Round 5 sau 11 batch auth matrix. Input: Round 4 seed + bổ sung vài record cross-unit:
- Seed thêm 3 VV cho `cb_nv_bn_02` (BTC) để test DI-04 (BN1 không thấy BN2).
- Seed thêm 2 VV cho `cb_nv_dp_02` (BG) để test DI-05 (DP1 không thấy DP2).

| DI | Scenario | Login | Expected | Module sample (≥3) |
|----|----------|-------|----------|--------------------|
| DI-01 | TW xem all | cb_nv_tw_01 | Thấy TW+BN+DP | HOI_DAP, VU_VIEC, CT_HTPLDN |
| DI-02 | BN chỉ BN | cb_nv_bn_01 (BKH) | Chỉ BKH data | HOI_DAP, VU_VIEC, CTDT |
| DI-03 | DP chỉ DP | cb_nv_dp_01 (AG) | Chỉ AG data | HOI_DAP, VU_VIEC, CTDT |
| DI-04 | BN ≠ BN | cb_nv_bn_01 (BKH) | KHÔNG thấy BTC/BCT | VU_VIEC, HDTV, DANHGIA |
| DI-05 | DP ≠ DP | cb_nv_dp_01 (AG) | KHÔNG thấy BG/BNI | VU_VIEC, HDTV, DANHGIA |
| DI-06 | NHT chỉ VV được phân công | nht_01 | Only assigned VV | VU_VIEC (scope double-filter) |
| DI-06b | TVV không thấy VU_VIEC | tvv_01 | Chỉ HO_SO_VV + KET_QUA_VV | VU_VIEC |
| DI-07 | CB PD cùng cấp duyệt | cb_pd_bn_01 (BKH) | Duyệt BKH, không BTC | HOI_DAP, VUVIEC, TVCS, KHOAHOC (4 workflow có phê duyệt) |
| DI-08 | QTHT Read business | qtht_01 | List OK, không nút C/U/D | HOI_DAP, VUVIEC, CHITRA, DN |
| DI-09 | DN không CMS | dn_01 | Login CMS → redirect/block; chỉ API | CMS login test |

---

## 4. Phase & Task

### P0 — Prep (0.5 ngày)

**T0.1 Round 5 prep**
- Verify Round 4 outputs complete (test-summary-round4.md exists + C4 sign-off).
- Verify `output/permission-matrix.md` hiện diện (49 entity × 11 role source-of-truth).
- Verify 11 role login OK (fallback `_01 → _02 → _03`).
- Seed bổ sung cross-unit data cho DI-04/05 (xem §3.3): 3 VV BKH, 3 VV BTC, 2 VV BCT (cb_nv_bn_02, cb_nv_bn_03); 2 VV AG, 2 VV BG, 2 VV BNI (cb_nv_dp_02, cb_nv_dp_03).
- Output: `_prep-log.md` + seed delta report.

### P1 — Role-walkthrough 11 batch (Tuần 1 ≈ 5 ngày)

Mỗi batch là 1 task. Acceptance: mỗi cell ≥1 pos + ≥1 neg PASS, evidence `evaluate_script` check button visibility + screenshot.

**T1.B1** Batch QTHT (qtht_01) — 16 module × Read + targeted CUD → `permission-matrix-B1-QTHT.md`
**T1.B2** Batch admin — 16 module × full audit → `permission-matrix-B2-admin.md`
**T1.B3** Batch CB_NV_TW (cb_nv_tw_01) — 16 module × CRUD business scope TW → `permission-matrix-B3-CBNVTW.md`
**T1.B4** Batch CB_PD_TW (cb_pd_tw_01) — 16 module × R+Approve → `permission-matrix-B4-CBPDTW.md`
**T1.B5** Batch CB_NV_BN (cb_nv_bn_01) — 16 module × CRUD scope BN → `permission-matrix-B5-CBNVBN.md`
**T1.B6** Batch CB_PD_BN (cb_pd_bn_01) — 16 module × R+Approve BN → `permission-matrix-B6-CBPDBN.md`
**T1.B7** Batch CB_NV_DP (cb_nv_dp_01) — 16 module × CRUD scope DP → `permission-matrix-B7-CBNVDP.md`
**T1.B8** Batch CB_PD_DP (cb_pd_dp_01) — 16 module × R+Approve DP → `permission-matrix-B8-CBPDDP.md`
**T1.B9** Batch Portal DN (dn_01) — API-only + CMS block → `permission-matrix-B9-DN.md`
**T1.B10** Batch Portal TVV (tvv_01) — CMS scope + block khác → `permission-matrix-B10-TVV.md`
**T1.B11** Batch Portal CG+NHT (cg_01, nht_01) → `permission-matrix-B11-CGNHT.md`

**Time budget:** ~0.5 ngày/batch cho B1-B2 (QTHT/admin read-heavy), ~0.7 ngày/batch cho B3-B8 (CRUD business), ~0.3 ngày/batch cho B9-B11 (Portal restricted).

**C-P1 Gate (end Tuần 1):**
- Evidence: 11 batch report + bug-report-permission.md.
- Summary: `cells verified / total cells`, bugs Major/Critical.
- **Human review** → go P2 / hold redelivery batch fail.

### P2 — Data Isolation deep test + Summary (Tuần 2 ≈ 3 ngày)

**T2.1 DI-01..DI-09 execution** → `data-isolation-report.md`
- 9 scenario × sampling ≥3 module/scenario = 27 TC minimum.
- Assertion format: `GIVEN role=X, WHEN truy cập module Y, THEN thấy/không thấy record Z`.

**T2.2 Edge auth — URL direct access + session tampering**
- Thử truy cập `/quan-tri/...` với role không phải QTHT → 403.
- Thử edit record của đơn vị khác qua URL `/vu-viec/{id}/edit` → 403.
- Thử API call với JWT role=DN nhưng endpoint restricted → 401/403.
- Output: `auth-edge-report.md`.

**T2.3 Round 5 Summary Report**
- Consolidate: G4-full / G6-full / G10 / G11 status, bug count by severity, cells matrix completeness.
- Output: `test-summary-round5.md`.

**C-P2 Gate (end Tuần 2):**
- Release authorization sign-off.
- **Human sign-off** → close Round 5 / redelivery.

---

## 5. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|-----------|--------|-----------|
| R1 | Dev fix auth bug trong gap Round 4 → 5 làm stale expected behavior | Medium | Medium | Đầu mỗi batch: check dev changelog + re-verify `permission-matrix.md` nếu có update |
| R2 | Permission matrix spec ambiguity (cell ?) | Medium | Medium | Ambiguity → tra SRS trực tiếp + escalate BA; nếu không resolve → mark cell `AMBIGUOUS` trong report, không log bug |
| R3 | Account BN/DP _01 lock | Low | Medium | Fallback `_02 → _03`; Nếu BN/DP cũng cần khác đơn vị → dùng `cb_nv_bn_02 (BTC)` thay `cb_nv_bn_01 (BKH)` nhưng log rõ scope change |
| R4 | 1.000 TC vượt budget 1 tuần | High | Medium | Parallel batch B1-B2 (admin-like) + B9-B11 (Portal nhanh) trong 2 ngày → dồn thời gian cho B3-B8 core |
| R5 | Portal role login fail (cg/dn/nht/tvv không có flow login chuẩn) | Medium | High | Investigate login flow trước T1.B9-B11; nếu Portal không có UI login → test via API only + mark |

---

## 6. Output structure

```
output/qa-reports/round5-{YYYY-MM-DD}/
├── _prep-log.md
├── seed-delta-crossunit.md
├── permission-matrix/
│   ├── permission-matrix-B1-QTHT.md
│   ├── permission-matrix-B2-admin.md
│   ├── permission-matrix-B3-CBNVTW.md
│   ├── permission-matrix-B4-CBPDTW.md
│   ├── permission-matrix-B5-CBNVBN.md
│   ├── permission-matrix-B6-CBPDBN.md
│   ├── permission-matrix-B7-CBNVDP.md
│   ├── permission-matrix-B8-CBPDDP.md
│   ├── permission-matrix-B9-DN.md
│   ├── permission-matrix-B10-TVV.md
│   └── permission-matrix-B11-CGNHT.md
├── data-isolation-report.md
├── auth-edge-report.md
├── bug-report-permission.md
├── screenshots/
└── test-summary-round5.md
```

---

## 7. Todo (detailed)

Xem [todo.md](todo.md).
