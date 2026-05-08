# Workflow Test Report — R7.4.A1 Workflow TVV (SM 10 state)

> **Module:** Mạng lưới Tư vấn viên / Chuyên gia (FR-IV-04..14 + FR-VIII-15/26) · **SRS:** [`smoke/6.4-sm-tvv.md`](../../../../smoke/6.4-sm-tvv.md) + [`funtion/7.4-chuyen-gia-tvv.md`](../../../../funtion/7.4-chuyen-gia-tvv.md) · **Round:** R7.4.A1 · **Date:** 2026-05-07 · **Tester:** QA Automation (Chrome DevTools MCP)
> **Bug:** [`bug-report-flow-r7-4-a1-tvv.md`](bug-report-flow-r7-4-a1-tvv.md) — 4 bug Open (2 Critical + 2 Major)

---

## Kết luận

⚠️ **PASS-WITH-NOTE** — **11/14 transitions PASS** trên 9 test paths SM-TVV. 2 transitions FAIL (BUG-003 stuck CHO_KICH_HOAT + BUG-004 guard VO_HIEU_HOA), 1 ⏭ (TP-05 scope FR-IV-03 NHT). 4 bug có SRS reference cụ thể (2 Critical + 2 Major). State machine 10-state theo update 2026-05-05 verify được phần lớn flow.

> **Mức độ block xuôi dòng:** BUG-003 (stuck CHO_KICH_HOAT) block TP-09 + R7.4.A1.5 PC backfill. BUG-004 (guard fail) block postcondition FR-IV-12 (TVV vô hiệu hóa orphan VV).

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
