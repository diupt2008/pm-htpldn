# Workflow Test Report — Vụ việc HTPL (SM-VUVIEC)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Module:** Vụ việc TGPL (FR-05) · **SRS:** [`02-thu-tu-module.md §⑥`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L352-L416) · **Round:** R9 · **Date:** 2026-05-01 · **Tester:** QA Automation
> **Bug:** [`bug-report-flow-VUVIEC.md`](../bug-reports/bug-report-flow-VUVIEC.md)

---

## Kết luận

❌ **FAIL** — **1/18 bước PASS** (chỉ seed). Workflow CB NV nhập tay block toàn bộ. Fail tại: **Bước 5 trở đi** — UI Detail VV không có nút workflow + BE thiếu 7/9 endpoint POST (404). Bug: BUG-FLOW-VUVIEC-001 Critical (Open lần 5).

---

## Bảng kiểm tra workflow

| # | Bước (transition) | Actor | Sample test | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → MOI_TAO` (DN qua DVC, API inbound) | DN | — | ⏭ | Defer T4.16 API test |
| 2 | `— → CHO_TIEP_NHAN` (Hệ thống khác, API nhận) | DN | — | ⏭ | Defer T4.16 API test |
| 3 | `— → DA_TIEP_NHAN` (CB NV thêm tay UC54) | CB NV | VV-001..008 | ✅ | Seed R1 |
| 4 | `CHO_TIEP_NHAN → DA_TIEP_NHAN` ([Tiếp nhận]) | CB NV | — | 🚫 | Cascade #2 |
| 5 | `DA_TIEP_NHAN → DANG_KIEM_TRA` ([Bắt đầu kiểm tra]) | CB NV | VV-001 | ❌ | UI 0 nút + BE 404 `bat-dau-kiem-tra` (BUG-001) |
| 6 | `DANG_KIEM_TRA → DA_PHAN_CONG` ([Phân công TVV/NHT]) | CB NV | — | 🚫 | Cascade #5; BE route exists (401) nhưng UI 0 trigger |
| 7 | `DANG_KIEM_TRA → YEU_CAU_BO_SUNG` (Thiếu HS) | CB NV | — | ❌ | BE 404 `yeu-cau-bo-sung` (BUG-001) |
| 8 | `DANG_KIEM_TRA → TU_CHOI` (Không đạt) | CB NV | — | ❌ | BE 404 `tu-choi` (BUG-001) |
| 9 | `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` (DN bổ sung) | DN | — | 🚫 | Cascade #7 |
| 10 | `YEU_CAU_BO_SUNG → TU_CHOI` (Auto BR-EC-16, >3 lần) | System | — | 🚫 | Cascade #7 + cron |
| 11 | `DA_PHAN_CONG → DANG_XU_LY` (TVV xác nhận) | TVV/NHT | — | 🚫 | Cascade #6 |
| 12 | `DA_PHAN_CONG → DA_TIEP_NHAN` (TVV từ chối) | TVV/NHT | — | 🚫 | Cascade #6 |
| 13 | `DANG_XU_LY → CHO_PHE_DUYET` ([Trình duyệt]) | CB NV | — | ❌ | BE 404 `trinh-duyet` (BUG-001) |
| 14 | `CHO_PHE_DUYET → DA_DUYET` (CB PD [Duyệt]) | CB PD | — | 🚫 | Cascade #13; BE route exists (401) nhưng UI 0 trigger |
| 15 | `CHO_PHE_DUYET → DANG_XU_LY` (CB PD [Từ chối]) | CB PD | — | 🚫 | Cascade #13 |
| 16 | `DA_DUYET → HOAN_THANH` ([Đóng hồ sơ]) | CB NV | — | ❌ | BE 404 `dong-ho-so` + `cap-nhat-kq` (BUG-001) |
| 17 | `HOAN_THANH → DA_DANH_GIA` (Chấm điểm UC67) | CB NV | — | 🚫 | Cascade #16 |
| 18 | `TU_CHOI → DA_TIEP_NHAN` (Admin override / DN khiếu nại) | QTHT/CB NV | — | 🚫 | Cascade #8 |

> Icon: ✅ pass · ❌ fail · ⏭ skip · 🚫 blocked · — chưa test

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| R1 | 26/04 | Seed 8 VV state `Đã tiếp nhận` PASS. |
| R2 | 27/04 | FAIL — UI 0 nút workflow. Log BUG-FLOW-VUVIEC-001. |
| R3 | 28/04 | FAIL identical R2 + verify 7/9 BE endpoint POST 404. |
| R6 | 29/04 01:30 | FAIL identical R3 sau dev claim "fix all Trụ A". |
| R8 | 29/04 15:06 | STILL OPEN lần 4 sau dev claim "đã fix" — identical R3/R6. |
| R9 | 01/05 12:50 | STILL OPEN lần 5 sau dev claim fix lần 4. UI thêm 9 collapsible section + state machine progress bar nhưng vẫn 0 nút action. 7/9 endpoint vẫn 404. |

---

## Bằng chứng (R9)

![BUG-FLOW-VUVIEC-001 R9 — VV-001 detail có 9 section nhưng 0 nút workflow](../bug-reports/image/r9-bug-vuviec-001-still-open-no-action-buttons.png)

```text
2026-05-01 — login cb_nv_tw_01:
POST /api/v1/vu-viecs/{id}/bat-dau-kiem-tra     → 404
POST /api/v1/vu-viecs/{id}/kiem-tra-ho-so       → 404
POST /api/v1/vu-viecs/{id}/yeu-cau-bo-sung      → 404
POST /api/v1/vu-viecs/{id}/tu-choi              → 404
POST /api/v1/vu-viecs/{id}/trinh-duyet          → 404
POST /api/v1/vu-viecs/{id}/dong-ho-so           → 404
POST /api/v1/vu-viecs/{id}/cap-nhat-kq          → 404
POST /api/v1/vu-viecs/{id}/phan-cong            → 401 (route exists, UI thiếu trigger)
POST /api/v1/vu-viecs/{id}/phe-duyet            → 401 (route exists, UI thiếu trigger)
```

---

*R9 | QA Automation via Claude Code*
