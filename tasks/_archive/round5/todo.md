# TODO — Round 5 Permission Matrix & Data Isolation Checklist

**Plan ref:** [plan.md](plan.md) • **Start:** sau Round 4 C4 sign-off • **Target:** 1.5 tuần (7-10 ngày)
**Dependency:** Round 4 complete + accepted. Có thể song song dev hotfix Round 4 bugs.
**Output root:** `output/qa-reports/round5-{YYYY-MM-DD}/`

Status legend: `[ ]` todo • `[~]` in-progress • `[x]` done • `[!]` blocked • `[a]` ambiguous spec • `[s]` skipped

---

## P0 — Prep (0.5 ngày)

- [ ] **T0.1** Verify Round 4 C4 sign-off + `test-summary-round4.md` exists
- [ ] **T0.2** Verify `output/permission-matrix.md` (49 entity × 11 role) latest version; pull dev-changelog nếu có update sau Round 4
- [ ] **T0.3** Login smoke 11 role _01, fallback `_02 → _03` chain
- [ ] **T0.4** Seed cross-unit delta cho DI-04/05: 3 VV BKH (cb_nv_bn_01), 3 VV BTC (cb_nv_bn_02), 3 VV BCT (cb_nv_bn_03); 2 VV AG (cb_nv_dp_01), 2 VV BG (cb_nv_dp_02), 2 VV BNI (cb_nv_dp_03) → `seed-delta-crossunit.md`
- [ ] **C-P0** gate tự động OK → go P1

## P1 — 11 Batch role-walkthrough (5 ngày, 2 batch/ngày avg)

### Ngày 1 (batch nhanh — admin-like)

- [ ] **T1.B1** QTHT (qtht_01) × 16 module Read + CUD QTHT-owned → `permission-matrix-B1-QTHT.md`
- [ ] **T1.B2** admin × 16 module full audit → `permission-matrix-B2-admin.md`

### Ngày 2-3 (batch CB NV business — core)

- [ ] **T1.B3** CB_NV_TW (cb_nv_tw_01) × 16 module CRUD scope TW → `permission-matrix-B3-CBNVTW.md`
- [ ] **T1.B5** CB_NV_BN (cb_nv_bn_01 BKH) × 16 module CRUD scope BN → `permission-matrix-B5-CBNVBN.md`
- [ ] **T1.B7** CB_NV_DP (cb_nv_dp_01 AG) × 16 module CRUD scope DP → `permission-matrix-B7-CBNVDP.md`

### Ngày 3-4 (batch CB PD)

- [ ] **T1.B4** CB_PD_TW (cb_pd_tw_01) × 16 module R+Approve → `permission-matrix-B4-CBPDTW.md`
- [ ] **T1.B6** CB_PD_BN (cb_pd_bn_01 BKH) × 16 module R+Approve → `permission-matrix-B6-CBPDBN.md`
- [ ] **T1.B8** CB_PD_DP (cb_pd_dp_01 AG) × 16 module R+Approve → `permission-matrix-B8-CBPDDP.md`

### Ngày 5 (batch Portal)

- [ ] **T1.B9** Portal DN (dn_01) — API outbound 18 API + CMS block verify → `permission-matrix-B9-DN.md`
- [ ] **T1.B10** Portal TVV (tvv_01) — HO_SO_VV + KET_QUA_VV scope, CMS block khác → `permission-matrix-B10-TVV.md`
- [ ] **T1.B11** Portal CG (cg_01) + NHT (nht_01) — TVCS / VV phân công → `permission-matrix-B11-CGNHT.md`

- [ ] **C-P1 human-review** → 11 batch report + bug count → user **go/hold**

## P2 — Data Isolation deep + Edge auth (3 ngày)

### Ngày 6-7

- [ ] **T2.1** DI-01..DI-09 execution (9 scenario × ≥3 module sample = 27 TC min) → `data-isolation-report.md`
  - [ ] DI-01 TW xem all (cb_nv_tw_01): HOI_DAP + VU_VIEC + CT_HTPLDN
  - [ ] DI-02 BN chỉ BN (cb_nv_bn_01 BKH): HOI_DAP + VU_VIEC + CTDT
  - [ ] DI-03 DP chỉ DP (cb_nv_dp_01 AG): HOI_DAP + VU_VIEC + CTDT
  - [ ] DI-04 BN ≠ BN (BKH không thấy BTC/BCT): VU_VIEC + HDTV + DANHGIA
  - [ ] DI-05 DP ≠ DP (AG không thấy BG/BNI): VU_VIEC + HDTV + DANHGIA
  - [ ] DI-06 NHT chỉ VV phân công (nht_01): VU_VIEC double-filter
  - [ ] DI-06b TVV ❌ VU_VIEC (tvv_01): chỉ HO_SO_VV + KET_QUA_VV
  - [ ] DI-07 CB PD cùng cấp duyệt (cb_pd_bn_01 BKH duyệt BKH, không BTC): 4 SM (HOIDAP, VUVIEC, TVCS, KHOAHOC)
  - [ ] DI-08 QTHT Read business (qtht_01): HOI_DAP + VUVIEC + CHITRA + DN không có C/U/D
  - [ ] DI-09 DN không CMS (dn_01 login CMS → redirect)

### Ngày 7-8

- [ ] **T2.2** Edge auth — URL direct + session tampering → `auth-edge-report.md`
  - [ ] Non-QTHT truy cập `/quan-tri/*` → 403
  - [ ] Role khác đơn vị edit record URL direct → 403
  - [ ] JWT role=DN hit endpoint restricted → 401/403
  - [ ] Expired session auto-logout → verify

### Ngày 8-9

- [ ] **T2.3** Round 5 Summary Report → `test-summary-round5.md`
  - G4-full cells verified / total, G6-full DI PASS, G10 Portal CMS block, G11 row-level security
  - Bugs Major/Critical list
  - Release authorization sign-off recommendation

- [ ] **C-P2 human-signoff** → close Round 5 / redelivery

---

## Ambiguity log (populate khi gặp cell không rõ spec)

| Cell (entity × role × op) | Expected in permission-matrix.md | Actual behavior | Escalate BA |
|--------------------------|----------------------------------|-----------------|-------------|
| (empty) | | | |

## Cell coverage tracker

| Batch | Total cells | Verified pos+neg | Ambiguous | Pass | Fail |
|-------|-------------|------------------|-----------|------|------|
| B1 QTHT | — | — | — | — | — |
| B2 admin | — | — | — | — | — |
| B3 CB_NV_TW | — | — | — | — | — |
| B4 CB_PD_TW | — | — | — | — | — |
| B5 CB_NV_BN | — | — | — | — | — |
| B6 CB_PD_BN | — | — | — | — | — |
| B7 CB_NV_DP | — | — | — | — | — |
| B8 CB_PD_DP | — | — | — | — | — |
| B9 DN | — | — | — | — | — |
| B10 TVV | — | — | — | — | — |
| B11 CG+NHT | — | — | — | — | — |
| **Total** | **~1.000** | — | — | — | — |
