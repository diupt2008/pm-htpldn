# Seed Checklist — R7.1.6: 9 DM còn lại qua UI SCR-VIII-01

| Thông tin | Giá trị |
|-----------|---------|
| **Task** | R7.1.6 (Phase 1 — Tier 0 seed) |
| **Ngày** | 2026-05-06 |
| **Account** | `qtht_02` / Secret@123 / OTP 666666 (theo user chốt 2026-05-06) |
| **Tool** | Chrome DevTools MCP (per CLAUDE.md routing) |
| **URL** | http://103.172.236.130:3000/quan-tri/danh-muc/{LOAI_DM} |
| **SRS ref** | FR-VIII-02/03/04/08/09/11/12/18/19 |

## Verdict

**⚠️ Partial 8/9 DM PASS** — 8 DM đạt acceptance ≥3 record cover dropdown downstream. 1 DM (CHUONG_TRINH_HO_TRO) BLOCK do BE 422 enum unsupported + UI thiếu 3 trường SRS.

## Per-DM result table

| # | DM | URL key | Acceptance | Records | Status | Note |
|---|---|---|---|---|---|---|
| 1 | LOAI_HINH_HT | `LOAI_HINH_HO_TRO` | ≥3 | **6 pre-existing** | ✅ PASS | TU_VAN/TO_TUNG/DAI_DIEN_NGOAI_TT/HOA_GIAI/DAO_TAO/TRO_GIUP_KHAC. Match SRS Seed Data. |
| 2 | CHUONG_TRINH_HT | `CHUONG_TRINH_HT` (đúng SRS) | ≥3 | **2 pre-existing** | ⚠️ | URL đúng `/CHUONG_TRINH_HT` có 2 record (`CT_NGUOI_NGHEO`/`CT_DTTS`); FE sub-tab routing sai gửi `/CHUONG_TRINH_HO_TRO` BE 422. Form thiếu 3 trường SRS row 3-5. 2-source verify: ✅ NotebookLM + SRS local match. **Bug:** [bug-report-seed-r7-1-6-dm-cthttp.md](../../bug-reports/qtht-danh-muc/bug-report-seed-r7-1-6-dm-cthttp.md). |
| 3 | TINH_TRANG_VV | `TINH_TRANG_VU_VIEC` | ≥3 | **12 pre-existing** | ✅ PASS | 12 SM state VV (MOI_TAO/CHO_TIEP_NHAN/.../TU_CHOI). |
| 4 | HO_SO_DE_NGHI_HT | `HO_SO_DE_NGHI_HT` | ≥3 | **4 pre-existing** | ✅ PASS | DON_DE_NGHI_HT/CMND_CCCD/GCNDK_KD/HS_CHUNG_MINH_DK + cột "LOẠI" Bắt buộc/Tùy chọn. |
| 5 | HO_SO_DE_NGHI_TT | `HO_SO_DE_NGHI_TT` | ≥3 | **4 pre-existing** | ✅ PASS | BANG_KE_CHI_PHI/BIEN_LAI_THU_PHI/HOP_DONG_DV_TV/BIEN_BAN_NGHIEM_THU. |
| 6 | TIEU_CHI_DG_HQ | `TIEU_CHI_DG_HIEU_QUA` | ≥3 + Σ=100 | **3 seed** | ✅ PASS | TC-PL/TC-NL/TC-HQ trọng số 30/30/40, Σ=100% ✓ (BR-CALC-04). Form có Trọng số/Min/Max. |
| 7 | TIEU_CHI_DG_CP | `TIEU_CHI_DG_CHI_PHI` | ≥3 + Σ=100 | **3 seed** | ✅ PASS ⚠️ | TC-CP-NL/TC-CP-DL/TC-CP-VP trọng số 40/30/30, Σ=100% ✓. **Note:** Form same DM6 (Trọng số/Min/Max) — nếu SRS yêu cầu `quy_mo_dn`/`muc_ho_tro` riêng → cần BA verify. |
| 8 | LOAI_HINH_TIEP_NHAN | `LOAI_HINH_TIEP_NHAN` | ≥3 | **5 pre-existing** | ✅ PASS | TRUC_TUYEN/TRUC_TIEP/BUU_CHINH/DIEN_THOAI/HE_THONG_KHAC. |
| 9 | KENH_TIEP_NHAN | `KENH_TIEP_NHAN` | ≥3 | **4 pre-existing** | ✅ PASS ⚠️ | CONG_DVC/THU_DIEN_TU/FAX/BO_PHAN_MOT_CUA. **Note:** fixture YAML `seed-fixture.yaml` enum (DVC/CONG_PLQG/TRUC_TIEP/HE_THONG_KHAC) khác DB — fixture cần update, KHÔNG phải bug FE per memory `feedback_fixture_mismatch_not_bug`. |

## Records seed mới R7.1.6

| DM | Mã | Tên | Trọng số | Min | Max |
|---|---|---|---|---|---|
| DM6 TIEU_CHI_DG_HIEU_QUA | TC-PL | Tính pháp lý | 30 | 1 | 5 |
| DM6 TIEU_CHI_DG_HIEU_QUA | TC-NL | Năng lực | 30 | 1 | 5 |
| DM6 TIEU_CHI_DG_HIEU_QUA | TC-HQ | Hiệu quả | 40 | 1 | 5 |
| DM7 TIEU_CHI_DG_CHI_PHI | TC-CP-NL | Chi phí nhân lực | 40 | 1 | 5 |
| DM7 TIEU_CHI_DG_CHI_PHI | TC-CP-DL | Chi phí đi lại | 30 | 1 | 5 |
| DM7 TIEU_CHI_DG_CHI_PHI | TC-CP-VP | Chi phí văn phòng + pháp lý | 30 | 1 | 5 |

Tổng seed mới: 6 record. Tổng record DM khác: 47 pre-existing (DM1: 6 + DM3: 12 + DM4: 4 + DM5: 4 + DM8: 5 + DM9: 4 + DM6 seed: 3 + DM7 seed: 3 + DM2: 0). Acceptance per-filter ≥3 đạt cho 8/9 DM.

## Screenshots

- [r7-1-6-dm1-loai-hinh-ht.png](r7-1-6-dm1-loai-hinh-ht.png)
- [r7-1-6-dm2-be-422-empty.png](r7-1-6-dm2-be-422-empty.png) (BUG evidence)
- [r7-1-6-dm2-form-thieu-truong.png](r7-1-6-dm2-form-thieu-truong.png) (BUG evidence)
- [r7-1-6-dm3-tinh-trang-vv.png](r7-1-6-dm3-tinh-trang-vv.png)
- [r7-1-6-dm4-ho-so-de-nghi-ht.png](r7-1-6-dm4-ho-so-de-nghi-ht.png)
- [r7-1-6-dm5-ho-so-de-nghi-tt.png](r7-1-6-dm5-ho-so-de-nghi-tt.png)
- [r7-1-6-dm6-tieu-chi-dg-hq.png](r7-1-6-dm6-tieu-chi-dg-hq.png)
- [r7-1-6-dm7-tieu-chi-dg-cp.png](r7-1-6-dm7-tieu-chi-dg-cp.png)
- [r7-1-6-dm8-loai-hinh-tiep-nhan.png](r7-1-6-dm8-loai-hinh-tiep-nhan.png)
- [r7-1-6-dm9-kenh-tiep-nhan.png](r7-1-6-dm9-kenh-tiep-nhan.png)

## Cascade impact

- **R7.7.8** QTHT 14 DM CRUD functional: 8/9 DM seed đủ → unblock cho 8 DM. DM2 CHUONG_TRINH_HT block 1/27 FR (FR-VIII-03) cho đến khi dev fix BE enum + UI form.
- **DM6/7 BR-CALC-04**: Σ trọng số = 100% verified — alert UI bật badge ✓.

*Generated: 2026-05-06 | QA Automation via Claude Code | account: qtht_02*
