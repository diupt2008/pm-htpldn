# TODO — QTHT — Quản trị hệ thống

> File module của [`todo.md`](todo.md) master. Tổng **15 task**.
>
> **Tham chiếu shared:** [`state-snapshot.md`](state-snapshot.md) · [`dep-map.md`](dep-map.md) · [`lessons-learned.md`](lessons-learned.md)
>
> **Trạng thái icon:** 🟢 sẵn sàng · 🔵 đang làm · ✅ xong · ⚠️ partial · 🚫 block · ⏳ chờ upstream
>
> **Task IDs:** R7.1.1, R7.1.2, R7.1.3, R7.1.4, R7.1.5, R7.1.6, R7.2.1, R7.2.9, R7.5.5, R7.7.8, R7.7.8a, R7.7.8b, R7.7.8c, R7.7.8d, R7.7.8e

---

## Tasks

- ✅ **R7.1.1** 🔄 DM LINH_VUC_PL (6 LV) <a id="r7-1-1"></a>
  - **Kết quả:** PASS 12/6+ pre-existing cover 6 LV fixture. [seed-checklist-r7-1-1-linh-vuc-pl.md](../output/qa-reports/round7-2026-05-06/seed/qtht-danh-muc/seed-checklist-r7-1-1-linh-vuc-pl.md)

- ✅ **R7.1.2** 🔄 DM LOAI_DN (TNHH/CP/DNTN/HKD) <a id="r7-1-2"></a>
  - **Kết quả:** PASS 4/4 fixture record + POST CTHD_TEST → 201 (re-test 2026-05-07 sau dev fix). [seed-checklist-r7-1-2-loai-dn.md](../output/qa-reports/round7-2026-05-06/seed/qtht-danh-muc/seed-checklist-r7-1-2-loai-dn.md)
  - **Bug:** [bug-report-seed-r7-1-2-loai-dn.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-seed-r7-1-2-loai-dn.md) — 1/1 đóng (BUG-LOAI-DN-002 Closed-verified)

- ✅ **R7.1.3** 🔄 DON_VI 7 đơn vị (TW + 3 BN + AG/BG/BNI) <a id="r7-1-3"></a>
  - **Kết quả:** PASS 7/7 pre-existing (BTP-TW + BKH/BTC/BCT + STP-AG/BG/BNI). [seed-checklist-r7-1-3-don-vi.md](../output/qa-reports/round7-2026-05-06/seed/qtht-danh-muc/seed-checklist-r7-1-3-don-vi.md)

- ✅ **R7.1.4** 🔄 SLA 4 loại (HOI_DAP 10d, VV 10d, HSHT 15d, HSTT 10d, hệ số 2.0) <a id="r7-1-4"></a>
  - **Kết quả:** PASS 4/4 pre-existing match spec, hệ số 2.0, cảnh báo 50/90%. [seed-checklist-r7-1-4-sla.md](../output/qa-reports/round7-2026-05-06/seed/qtht-cau-hinh-ht/seed-checklist-r7-1-4-sla.md)

- ⚠️ **R7.1.5** 🆕 Seed 5 ngày lễ 2026 qua UI Tab Ngày lễ SCR-VIII-06 (FR-VIII-29) `[~80% — 5/5 data, FE submit silent block UI]` <a id="r7-1-5"></a>
  - **Cần:** account `qtht_02`
  - **Kết quả:** 5/5 (4 pre-existing + Tết NĐ qua API workaround do FE submit silent). [r7-1-5-tab-ngay-le-5-record-final.png](../output/qa-reports/round7-2026-05-06/seed/qtht-cau-hinh-ht/r7-1-5-tab-ngay-le-5-record-final.png)
  - **Bug:** [bug-report-seed-r7-1-5-ngay-le.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-cau-hinh-ht/bug-report-seed-r7-1-5-ngay-le.md) — 0/1 đóng (BUG-NGAY-LE-001 Major FE submit silent — R8 verify 2026-05-07 16:42 vẫn open sau dev claim fix lần 3; BUG-NGAY-LE-002 dropped)

- ✅ **R7.1.6** 🆕 Seed 9 DM còn lại qua UI SCR-VIII-01 (account qtht_02) <a id="r7-1-6"></a>
  - **Kết quả:** PASS 9/9 — DM2 CHUONG_TRINH_HT unblocked sau dev fix routing + form 3 trường (re-test 2026-05-07). [seed-checklist-r7-1-6-9-dm-con-lai.md](../output/qa-reports/round7-2026-05-06/seed/qtht-danh-muc/seed-checklist-r7-1-6-9-dm-con-lai.md)
  - **Bug:** [bug-report-seed-r7-1-6-dm-cthttp.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-seed-r7-1-6-dm-cthttp.md) — 2/2 đóng (BUG-DM-CTHT-001 + 002 Closed-verified)

- 🚫 **R7.2.1** 🔄 Seed 12 mẫu phản hồi (cover 6 LV × 2 mẫu/LV) `[block: R7.1.1 DM LV mismatch SRS — BUG-DM-LVPL-001]` <a id="r7-2-1"></a>
  - **Cần:** R7.1.1 ✅ (DM LV đủ 10 SRS)
  - **Kết quả:** 🚫 BLOCK 0/12 — modal MPH dropdown LV thiếu DOANH_NGHIEP/THUONG_MAI → 3 variants không seed được. Fixture đã v2.7.2.
  - **Bug:** [bug-report-seed-r7-1-1-dm-linh-vuc-pl.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-danh-muc/bug-report-seed-r7-1-1-dm-linh-vuc-pl.md) — 0/1 đóng (cùng bug R7.1.1 — R8 partial fix: thêm DOANH_NGHIEP+DAU_TU, vẫn thiếu THUONG_MAI)

- ✅ **R7.2.9** ✏️ Verify 9 TK CG/NHT click mail kích hoạt → đặt MK → HOAT_DONG (FR-VIII-26) — happy path <a id="r7-2-9"></a>
  - **Kết quả:** PASS 9/9 đặt MK Secret@123 + TK HOAT_DONG. [workflow-test-report-r7-2-9-mail-kich-hoat.md](../output/qa-reports/round7-2026-05-06/workflow/qtht-tai-khoan/workflow-test-report-r7-2-9-mail-kich-hoat.md)
  - **Scope:** ⚠️ HAPPY PATH — chưa cover link expired / token reuse / validation MK. Full FR-VIII-26 ở R7.7.8c.

- 🟢 **R7.5.5** 🔄 Audit log ≥100 entry qua Nhật ký HT (FR-VIII-28) `[~0% — ready, accumulate qua Phase 4]` <a id="r7-5-5"></a>

- ⚠️ **R7.7.8** ✏️ QTHT 14 DM CRUD functional (DM-only scope; FR-VIII-01..09/11/12/13/18/19/29) `[~96% — 24/25 PASS, 1 BLOCK CREATE NGAY_LE]` <a id="r7-7-8"></a>
  - **Kết quả:** ⚠️ 24/25 TC PASS + 1 BLOCK CREATE NGAY_LE (BUG-NGAY-LE-001 Major Open). [functional-test-report-QTHT-14DM.md](../output/qa-reports/round7-2026-05-06/functional/qtht-danh-muc/functional-test-report-QTHT-14DM.md)
  - **Bug:** Không có bug mới R7.7.8. 1 bug đã log từ trước (BUG-NGAY-LE-001 Major) Open chờ dev fix; 3 bug khác (CTHT-001/002, LOAI-DN-002) đã Closed-verified 2026-05-07.

- ✅ **R7.7.8a** 🆕 TAI_KHOAN SM 5 states (TP-TK-01..11) <a id="r7-7-8a"></a>
  - **Kết quả:** PASS 6/6 — TK-SM-003 tab Vô hiệu hóa fix (re-test 2026-05-07). [functional-test-report-FR-VIII-15-tk-sm.md](../output/qa-reports/round7-2026-05-06/functional/qtht-tai-khoan/functional-test-report-FR-VIII-15-tk-sm.md)
  - **Bug:** [bug-report-function-r7-7-8a-tk-sm.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-function-r7-7-8a-tk-sm.md) — 2/2 đóng (TK-SM-002 + 003 Closed-verified 2026-05-07).

- ⚠️ **R7.7.8b** 🆕 FR-VIII-22 Self-reg DN E2E `[~88% — 7/8 PASS, 1 defer]` <a id="r7-7-8b"></a>
  - **Kết quả:** ⚠️ 7/8 PASS + 1 defer (re-test 2026-05-07 FR22-002 + 001a Closed). [functional-test-report-FR-VIII-22-self-reg-dn.md](../output/qa-reports/round7-2026-05-06/functional/qtht-tai-khoan/functional-test-report-FR-VIII-22-self-reg-dn.md)
  - **Bug:** [bug-report-function-r7-7-8b-self-reg-dn.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-function-r7-7-8b-self-reg-dn.md) — 2/5 đóng (FR22-002 + 001a Closed; FR22-004 đợi BA; 003/005 defer Minor)

- ✅ **R7.7.8c** 🆕 FR-VIII-26 reset MK + kích hoạt lần đầu <a id="r7-7-8c"></a>
  - **Kết quả:** PASS 6/7 + 1 Minor defer. 2 Critical FE Closed. [functional-test-report-FR-VIII-26-reset-mk.md](../output/qa-reports/round7-2026-05-06/functional/qtht-tai-khoan/functional-test-report-FR-VIII-26-reset-mk.md)
  - **Bug:** [bug-report-function-r7-7-8c-reset-mk.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-tai-khoan/bug-report-function-r7-7-8c-reset-mk.md) — 2/3 đóng (FR26-FE-01/02 Closed; FR26-001 Minor defer Open).

- ✅ **R7.7.8d** 🆕 FR-VIII-28 Audit log functional <a id="r7-7-8d"></a>
  - **Kết quả:** PASS 7/7 sau dev fix (90-day + Export + page 50 + filter Người dùng + cột Đơn vị + dropdown Tiếng Việt). [functional-test-report-FR-VIII-28-audit-log.md](../output/qa-reports/round7-2026-05-06/functional/qtht-nhat-ky/functional-test-report-FR-VIII-28-audit-log.md)
  - **Bug:** [bug-report-function-r7-7-8d-audit-log.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-nhat-ky/bug-report-function-r7-7-8d-audit-log.md) — 6/6 đóng (re-test 2026-05-07 ALL Closed-verified)

- ✅ **R7.7.8e** 🆕 FR-VIII-14 Vai trò CRUD (VAI_TRO entity, SCR-VIII-02) <a id="r7-7-8e"></a>
  - **Kết quả:** PASS 11/11 + 1 Minor defer. 6 bug Closed re-test 2026-05-07. [functional-test-report-FR-VIII-14-vai-tro.md](../output/qa-reports/round7-2026-05-06/functional/qtht-vai-tro/functional-test-report-FR-VIII-14-vai-tro.md)
  - **Bug:** [bug-report-function-r7-7-8e-vai-tro.md](../output/qa-reports/round7-2026-05-06/bug-reports/qtht-vai-tro/bug-report-function-r7-7-8e-vai-tro.md) — 6/7 đóng (VT-001/003/004/005/006/009 Closed; VT-008 Minor defer Open).
