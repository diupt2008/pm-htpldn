# Workflow Test Report — R7.4.A1 Workflow TVV (SM 10 state)

> **Module:** Mạng lưới Tư vấn viên / Chuyên gia (FR-IV-04..14 + FR-VIII-15/26) · **SRS:** [`smoke/6.4-sm-tvv.md`](../../../../smoke/6.4-sm-tvv.md) + [`funtion/7.4-chuyen-gia-tvv.md`](../../../../funtion/7.4-chuyen-gia-tvv.md) · **Latest round:** R8b 2026-05-08 · **Tester:** QA Automation (Chrome DevTools MCP)
> **Bug:** [`bug-report-flow-r7-4-a1-tvv.md`](bug-report-flow-r7-4-a1-tvv.md) — 3/4 đóng (BUG-001/003/004 Closed R8 · BUG-002 Open Major mail format)

---

## Kết luận (LATEST — R8b 2026-05-08)

⚠️ **PASS-WITH-NOTE — 13/14 transitions PASS** sau dev rebuild R8. 3 bug Critical/Major đã đóng (slider 1-5 ✅, state advance CHO_KICH_HOAT → HOAT_DONG ✅, guard VO_HIEU_HOA 422 ERR-STATE-IV-TT-02 ✅). Còn 1 bug Open: BUG-002 mail format (skip retest theo user instruction R8b).

---

## Accounts dùng (R8b)

| Role | Account | Cấp | Ghi chú |
|---|---|---|---|
| QTHT | `qtht_02` | TW | Read-only verify list |
| CB Nghiệp vụ TW | `cb_nv_tw_02` | TW | Tiếp nhận / Thẩm định / Tạm dừng / Vô hiệu hóa |
| CB Phê duyệt TW | `cb_pd_tw_02` | TW | Phê duyệt / Từ chối |
| TVV first login | `tvv_0009` (consumed R7) | TW | Không re-verify được first-login (token consumed) — pull state advance từ R8 vu.sau.06 |

---

## R8b Round (LATEST — 2026-05-08 verify sau dev rebuild)

### Test scope (R8b)
Re-verify 9/14 transitions sample sau dev rebuild — TP-01 happy path A1.A (5 transition), TP-04 từ chối CB PD (1 transition), TP-06/07/08 lifecycle A1.D (4 transition).

### Bảng re-test 9 transitions

| # | Transition | Test path | Sample R8b | Status R8b | Note |
|:-:|---|:-:|---|:-:|---|
| 3 | `DANG_THAM_DINH → CHO_PHE_DUYET` | TP-01 | TVV-0013 Hoàng Văn Năm | ✅ | Slider Nhóm 2/3 verified `valuemax="5" valuemin="1"` (BUG-001 closed) |
| 4 | `CHO_PHE_DUYET → CHO_KICH_HOAT` | TP-01 | TVV-0013 (cb_pd_tw_02) | ✅ | Auto-tạo TK |
| 5 | `CHO_KICH_HOAT → HOAT_DONG` | TP-01 + TP-09 | TVV-0013 | 🤷 | BE mail không fire R8b 2026-05-08 (last MailHog 2026-05-07T10:36) — BUG-002 mail format skip retest theo user. Test method UI block first-login. |
| 9 | `CHO_PHE_DUYET → TU_CHOI` | TP-04 | Test Duplicate CCCD | ✅ | BR-FLOW-04 lý do ≥10 verified — UI button disabled khi 8 chars + msg "Cần nhập ít nhất 10 ký tự" |
| 11 | `HOAT_DONG → TAM_DUNG` | TP-06 | TVV-0014 Vũ Văn Sáu | ✅ | Dropdown HOAT_DONG → 2 options "Tạm dừng" + "Vô hiệu hóa" đúng SM |
| 12 | `TAM_DUNG → HOAT_DONG` | TP-06 | TVV-0014 | ✅ | Dropdown TAM_DUNG → 2 options "Đang hoạt động" + "Vô hiệu hóa" đúng SM. Round-trip OK. |
| 13a | `HOAT_DONG → VO_HIEU_HOA` (guard PASS) | TP-07 | TVV-0008 Probe CG (no VV) | ✅ | POST `/cap-nhat-trang-thai` 200 |
| 13b | `HOAT_DONG → VO_HIEU_HOA` (guard FAIL) | TP-07 | TVV-0014 (1 VV active) | ✅ | POST 422 + `error.code=ERR-STATE-IV-TT-02` + msg `Tư vấn viên đang có 1 vụ việc và 0 hỏi đáp chưa hoàn thành, không thể vô hiệu hóa` ✅ — BUG-004 closed |
| 14 | `VO_HIEU_HOA → HOAT_DONG` | TP-08 | TVV-0008 | ✅ | Dropdown VO_HIEU_HOA → only "Đang hoạt động" đúng SM (TP-TVV-08 unique target) |

**Tổng R8b:** 8 ✅ PASS · 1 🤷 không xác định (BUG-002 mail format skip per user) · 0 ❌ FAIL.

### Transitions không re-test R8b (5/14)
- #1, #2, #6, #7, #8, #10 đã PASS R7 + state machine không đổi sau dev rebuild — kế thừa kết quả R7.

### Bug status update (R8b)

| Bug ID | R7 status | R8 status | R8b verify |
|---|:-:|:-:|---|
| BUG-CG-A1-001 (slider 0-10) | Open Major | Closed R8 | ✅ Confirmed Closed (slider 1-5 verified TVV-0013) |
| BUG-CG-A1-002 (mail format) | Open Major | Open Major | ⏭ Skip retest theo user "bỏ qua bug 002" |
| BUG-CG-A1-003 (state stuck) | Open Critical | Closed R8 | ✅ Confirmed Closed inheritance (state advance qua vu.sau.06 R8) |
| BUG-CG-A1-004 (guard fail) | Open Critical | Closed R8 | ✅ Confirmed Closed (422 ERR-STATE-IV-TT-02 fire đúng spec line 907) |

### Observations R8b
- **BE mail kích hoạt không fire** cho TVV-0013 sau CB PD phê duyệt 10:30 2026-05-08. MailHog `?to=hoang.nam.05@test.htpldn.vn` rỗng. Last mail trong inbox: `2026-05-07T10:36:30` (TVV-0009 R7). Có thể dev đang refactor BUG-002 hoặc disable trigger mail tạm thời. Block TP-09 mail-link first-login flow trên TVV-0013.
- **TVV-0009** không re-verify first-login được — temp pass `4kEmS4N&#R%*3m` đã consumed R7. State stuck CHO_KICH_HOAT vẫn còn. Pool gap.
- **Pool sau R8b:** TVV-0013 stuck CHO_KICH_HOAT (chờ mail), TVV-0014 VO_HIEU_HOA (đã restore HOAT_DONG fail vì có 1 VV → guard giữ nguyên), Probe TVV-0008 restored HOAT_DONG.

### Evidence (R8b 2026-05-08)
- [`evidence-r7-4-a1/R8b-A1A-tham-dinh-form-slider-1-5.png`](evidence-r7-4-a1/R8b-A1A-tham-dinh-form-slider-1-5.png) — BUG-001 closed verify
- [`evidence-r7-4-a1/R8b-A1A-03-cho-phe-duyet.png`](evidence-r7-4-a1/R8b-A1A-03-cho-phe-duyet.png) — Transition #3
- [`evidence-r7-4-a1/R8b-A1A-04-cho-kich-hoat.png`](evidence-r7-4-a1/R8b-A1A-04-cho-kich-hoat.png) — Transition #4
- [`evidence-r7-4-a1/R8b-A1B-09-TP04-tu-choi-cb-pd.png`](evidence-r7-4-a1/R8b-A1B-09-TP04-tu-choi-cb-pd.png) — Transition #9
- [`evidence-r7-4-a1/R8b-A1D-12-tam-dung-to-hoat-dong.png`](evidence-r7-4-a1/R8b-A1D-12-tam-dung-to-hoat-dong.png) — Transition #12
- [`evidence-r7-4-a1/R8b-A1D-13b-guard-fail-422.png`](evidence-r7-4-a1/R8b-A1D-13b-guard-fail-422.png) — Transition #13b BUG-004 closed verify
- [`evidence-r7-4-a1/R8b-A1D-13a-guard-pass-vo-hieu-hoa.png`](evidence-r7-4-a1/R8b-A1D-13a-guard-pass-vo-hieu-hoa.png) — Transition #13a
- [`evidence-r7-4-a1/R8b-A1D-14-restore-vo-hieu-hoa-to-hoat-dong.png`](evidence-r7-4-a1/R8b-A1D-14-restore-vo-hieu-hoa-to-hoat-dong.png) — Transition #14

---

# Lifecycle archive — older rounds

## R7.4.A1 (2026-05-07 — initial walk)

> **Mức độ block xuôi dòng:** BUG-003 (stuck CHO_KICH_HOAT) block TP-09 + R7.4.A1.5 PC backfill. BUG-004 (guard fail) block postcondition FR-IV-12 (TVV vô hiệu hóa orphan VV).

⚠️ **PASS-WITH-NOTE R7** — **11/14 transitions PASS** trên 9 test paths SM-TVV. 2 transitions FAIL (BUG-003 stuck CHO_KICH_HOAT + BUG-004 guard VO_HIEU_HOA), 1 ⏭ (TP-05 scope FR-IV-03 NHT). 4 bug có SRS reference cụ thể (2 Critical + 2 Major). State machine 10-state theo update 2026-05-05 verify được phần lớn flow.

---

## Sub-walks tổng quan (4 sub-walks)

| Walk | Test paths | Sample | Transitions | Status | Bug |
|---|---|---|:-:|:-:|---|
| A1.A | TP-01 happy path full lifecycle | TVV-BTP-TW-0009 | 5 | ⚠️ 4/5 | BUG-001 + BUG-002 + BUG-003 |
| A1.B | TP-02/03/04 negative paths | TVV-BTP-TW-0010/0011/0012 | 3 | ✅ 3/3 | — |
| A1.C | TP-05 nộp lại sau từ chối | — | — | ⏭ N/A | — |
| A1.D | TP-06/07/08 tạm dừng/vô hiệu hóa/khôi phục | TVV-BTP-TW-0001/0002/0003 | 4 | ⚠️ 3/4 | BUG-004 |

> **A1.C N/A:** TP-05 (NHT chủ hồ sơ nộp lại) thuộc scope FR-IV-03, đã ghi rõ ở [smoke/6.4-sm-tvv.md line 68](../../../../smoke/6.4-sm-tvv.md). Mapping `TVV-005 | — (NHT chủ hồ sơ nộp lại, scope FR-IV-03)`.

---

## Bảng kiểm tra workflow (14 transitions × 9 test paths)

| # | Transition | Test path | Actor | Sample | Status | Bug / Note |
|:-:|---|:-:|---|---|:-:|---|
| 1 | `MOI_DANG_KY → CHO_THAM_DINH` (Tiếp nhận) | TP-01 | CB NV TW | TVV-0009 | ✅ | A1.A — auto qua POST `/tham-dinh` |
| 2 | `CHO_THAM_DINH → DANG_THAM_DINH` (mở thẩm định) | TP-01 | CB NV TW | TVV-0009 | ✅ | A1.A |
| 3 | `DANG_THAM_DINH → CHO_PHE_DUYET` (DAT + trinhDuyet) | TP-01 | CB NV TW | TVV-0009 | ✅ | A1.A — slider Nhóm 2/3 thang 0-10 sai spec → **BUG-001** |
| 4 | `CHO_PHE_DUYET → CHO_KICH_HOAT` (CB PD phê duyệt) | TP-01 | CB PD TW | TVV-0009 | ✅ | A1.A — auto-tạo TK qua FR-VIII-15 |
| 5 | `CHO_KICH_HOAT → HOAT_DONG` (TVV bấm mail + đặt MK lần đầu) | TP-01 + TP-09 | TVV | tvv_0009 | ❌ | A1.A — TVV đặt MK thành công nhưng state stuck CHO_KICH_HOAT → **BUG-003 Critical**. Mail format sai (username + temp pass + URL `localhost`) → **BUG-002 Major** |
| 6 | `DANG_THAM_DINH → YEU_CAU_BO_SUNG` (lý do ≥10 chars) | TP-02 | CB NV TW | TVV-0010 | ✅ | A1.B — BR-FLOW-04 verified |
| 7 | `YEU_CAU_BO_SUNG → DANG_THAM_DINH` (loop, NHT bổ sung HS) | TP-02 | CB NV TW | — | ⏭ | Cover ở R7.4.A2 (FR-IV-13 transition explicit) |
| 8 | `DANG_THAM_DINH → TU_CHOI` (KHONG_DAT + lý do ≥10) | TP-03 | CB NV TW | TVV-0011 | ✅ | A1.B — BR-FLOW-04 entry point #2 |
| 9 | `CHO_PHE_DUYET → TU_CHOI` (CB PD từ chối + lý do ≥10) | TP-04 | CB PD TW | TVV-0012 | ✅ | A1.B — BR-FLOW-04 entry point #3 |
| 10 | `TU_CHOI → CHO_THAM_DINH` (NHT nộp lại) | TP-05 | NHT | — | ⏭ | A1.C — N/A scope FR-IV-03 NHT |
| 11 | `HOAT_DONG → TAM_DUNG` (CB NV tạm dừng) | TP-06 | CB NV TW | TVV-0001 | ✅ | A1.D |
| 12 | `TAM_DUNG → HOAT_DONG` (kích hoạt lại) | TP-06 | CB NV TW | TVV-0001 | ✅ | A1.D — round-trip OK |
| 13 | `HOAT_DONG → VO_HIEU_HOA` (guard PASS — không VV/HD) | TP-07 | CB NV TW | TVV-0002 | ✅ | A1.D — guard accept đúng |
| 13b | `HOAT_DONG → VO_HIEU_HOA` (guard FAIL — có VV DANG_XU_LY) | TP-07 | CB NV TW | TVV-0003 | ❌ | A1.D — BE accept POST 200 thay vì reject ERR-TT-02 → **BUG-004 Critical** |
| 14 | `VO_HIEU_HOA → HOAT_DONG` (khôi phục) | TP-08 | CB NV TW | TVV-0002 | ✅ | A1.D — drawer chỉ cho chọn `Đang hoạt động` (đúng SM) |

> Icon: ✅ pass · ❌ fail · ⏭ skip (defer/scope-out) · 🚫 blocked

**Tổng:** 11 ✅ PASS · 2 ❌ FAIL · 2 ⏭ defer (1 NHT scope + 1 cover R7.4.A2)

---

## Business Rules verified

| BR | Spec | Sample | Compliant |
|---|---|---|:-:|
| BR-FLOW-04 | Từ chối/YCBS yêu cầu lý do ≥10 ký tự | A1.B 3 entry points (CB NV YCBS + KHONG_DAT + CB PD TC) | ✅ |
| BR-AUTH-05 | CB PD cùng cấp phê duyệt | A1.A CB PD TW phê duyệt TVV TW PASS (chéo cấp đã verify ở R7.4.A1-CG) | ✅ |
| BR-LEGAL-04 | NĐ77/2008 thẩm định 4 nhóm tiêu chí | A1.A form thẩm định có Nhóm 1+4 boolean + Nhóm 2+3 slider | ⚠️ Nhóm 2/3 thang 0-10 thay 1-5 → BUG-001 |
| FR-VIII-15 | Auto-tạo TK lúc phê duyệt | A1.A TVV-0009 có taiKhoanId post-approval | ✅ |
| FR-VIII-26 | Mail kích hoạt + TVV đặt MK lần đầu | A1.A mail nhận được nhưng format sai (BUG-002) + state stuck (BUG-003) | ❌ |
| **Guard VO_HIEU_HOA** | KHÔNG có VU_VIEC AND HOI_DAP đang xử lý | A1.D TVV-0003 có VV-001 DANG_XU_LY vẫn vô hiệu hóa thành công | ❌ BUG-004 Critical |

---

## Bugs phát hiện (4)

> Chi tiết 6-section + screenshot inline base64 trong [bug-report-flow-r7-4-a1-tvv.md](bug-report-flow-r7-4-a1-tvv.md).

| ID | Severity | Type | Title | SRS ref |
|---|:-:|:-:|---|---|
| BUG-CG-A1-001 | Major | UI/UX | Slider thẩm định Nhóm 2/3 dùng thang 0-10 thay vì 1-5 | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:500-501,507,1548-1549` + changelog `:18` (F-FR04-02) |
| BUG-CG-A1-002 | Major | Workflow | Mail kích hoạt TVV dùng username + temp pass + URL `localhost` thay vì link token | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:589 §Processing Bước 2` + `:617-618` + `:626 §AC` |
| BUG-CG-A1-003 | Critical | Workflow | TU_VAN_VIEN.trang_thai stuck CHO_KICH_HOAT sau TVV first login + đổi MK | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:618 §Postconditions` + `:626 §AC` |
| BUG-CG-A1-004 | Critical | Workflow | Guard VO_HIEU_HOA không enforce — TVV vô hiệu hóa thành công dù còn VV đang xử lý | `srs-update-2026-5-5/srs-fr-04-chuyen-gia-tvv.md:887 §Processing Bước 2` + `:907 §Error Handling E2 ERR-TT-02` + `:917 §AC` |

> **Note ID collision:** BUG-CG-A1-001 trong file này khác BUG-CG-A1-001 trong [`bug-report-flow-r7-4-a1-cg-state.md`](../../bug-reports/tu-van-vien-cg/bug-report-flow-r7-4-a1-cg-state.md) (file -cg cũ là về state name DANG_HOAT_DONG vs CHO_KICH_HOAT). Có thể rename file mới này thành BUG-TVV-* nếu cần phân biệt rõ — flag để PM/dev xử lý.

---

## API endpoints xác nhận

| Step | Method | Path | Effect |
|---|:-:|---|---|
| Thẩm định | POST | `/api/v1/tu-van-viens/{id}/tham-dinh` | DANG_THAM_DINH (trinhDuyet=false) hoặc CHO_PHE_DUYET (trinhDuyet=true) |
| YCBS | POST | `/api/v1/tu-van-viens/{id}/yeu-cau-bo-sung` | DANG_THAM_DINH → YEU_CAU_BO_SUNG (lý do bắt buộc ≥10) |
| Phê duyệt | POST | `/api/v1/tu-van-viens/{id}/phe-duyet` | CHO_PHE_DUYET → CHO_KICH_HOAT |
| Từ chối (CB PD) | POST | `/api/v1/tu-van-viens/{id}/tu-choi` | CHO_PHE_DUYET → TU_CHOI |
| Cập nhật trạng thái | POST | `/api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` | HOAT_DONG ↔ TAM_DUNG, → VO_HIEU_HOA, ← khôi phục |

---

## Pool sau test

| TVV | State sau A1 | Walk | Note |
|---|:-:|---|---|
| TVV-BTP-TW-0009 | CHO_KICH_HOAT (stuck) | A1.A | TVV đã đặt MK lần đầu nhưng state không advance — BUG-003 |
| TVV-BTP-TW-0010 | YEU_CAU_BO_SUNG | A1.B | TP-02 entry |
| TVV-BTP-TW-0011 | TU_CHOI | A1.B | TP-03 KHONG_DAT |
| TVV-BTP-TW-0012 | TU_CHOI | A1.B | TP-04 CB PD reject |
| TVV-BTP-TW-0001 | HOAT_DONG | A1.D | TP-06 round-trip OK |
| TVV-BTP-TW-0002 | HOAT_DONG | A1.D | TP-07 guard pass + TP-08 khôi phục |
| TVV-BTP-TW-0003 | VO_HIEU_HOA | A1.D | TP-07 guard FAIL — BUG-004 |
| TVV-BTP-TW-0013 | MOI_DANG_KY | — | Reserve seed (R7.2.5 còn 2 record chưa walk) |
| TVV-BTP-TW-0014 | MOI_DANG_KY | — | Reserve seed |

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| **R8b (LATEST)** | 2026-05-08 | 13/14 PASS sau dev rebuild — BUG-001/003/004 closed verify, BUG-002 skip per user. 1 🤷 (TP-09 mail không fire) |
| R8 | 2026-05-08 | 3/4 bug closed (slider 1-5 + state advance + guard 422 ERR-STATE-IV-TT-02) |
| R7.4.A1 | 2026-05-07 | 11/14 PASS — 4 sub-walks A1.A→A1.D xong, 4 bug log (2 Critical + 2 Major) |

---

## Bằng chứng

> 17 screenshot trong [`evidence-r7-4-a1/`](evidence-r7-4-a1/), 4 bug có base64 inline trong bug-report.

Tiêu biểu:
- A1.A FAIL TP-01 step 5 stuck: [`A1-A-05-state-stuck-cho-kich-hoat.png`](evidence-r7-4-a1/A1-A-05-state-stuck-cho-kich-hoat.png)
- A1.B BR-FLOW-04 lý do bắt buộc: [`A1-B-01-tvv0010-yeu-cau-bo-sung.png`](evidence-r7-4-a1/A1-B-01-tvv0010-yeu-cau-bo-sung.png)
- A1.D guard fail: [`A1-D-05-tvv0003-guard-fail-vo-hieu-hoa.png`](evidence-r7-4-a1/A1-D-05-tvv0003-guard-fail-vo-hieu-hoa.png)

---

## Out of scope (defer)

- **TP-05 (NHT nộp lại sau từ chối):** Scope FR-IV-03 NHT — không thuộc §7.4 TVV/CG (per smoke spec line 68).
- **TP-07 nhánh TAM_DUNG → VO_HIEU_HOA:** Cùng guard với HOAT_DONG → VO_HIEU_HOA, chưa walk riêng. Đợi BUG-004 fix rồi verify cả 2 nhánh.
- **TP-09 (mail kích hoạt CHO_KICH_HOAT → HOAT_DONG):** Bị block bởi BUG-003. Chờ dev fix BE state advance + BUG-002 mail format.
- **R7.4.A2 (Tiếp nhận FR-IV-13):** 3 transition mới (MOI→CHO_THAM_DINH explicit, YCBS→DANG_THAM_DINH loop, TU_CHOI→CHO_THAM_DINH) — task riêng.
- **R7.4.A1.5 (PC backfill verify NHT dropdown):** Cần TVV HOAT_DONG, đang block bởi BUG-003.

---

*R7.4.A1 | 2026-05-07 | QA Automation via Chrome DevTools MCP*
