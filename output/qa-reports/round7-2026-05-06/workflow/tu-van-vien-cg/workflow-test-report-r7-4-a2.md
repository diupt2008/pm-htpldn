# Workflow test report — R7.4.A2 Tiếp nhận TVV (3 transition entry/loop)

**Ngày chạy:** 2026-05-07 R7
**Account:** `cb_nv_tw_02` (Secret@123, OTP 666666)
**SRS ref:** SM-TVV v3.5 line 2304-2319 ([smoke/6.4-sm-tvv.md](../../../../smoke/6.4-sm-tvv.md)) · FR-IV-06 line 483-551 (Thẩm định) · FR-IV-04 (TVV chủ hồ sơ bổ sung) · FR-IV-03 (TVV chủ hồ sơ nộp lại sau từ chối)
**Scope:** 3 transition entry hoặc loop ngược về CHO_THAM_DINH/DANG_THAM_DINH
- A2.1 — `MOI_DANG_KY → CHO_THAM_DINH` (CB NV vào tab Thẩm định bắt đầu chấm, ngầm transition)
- A2.2 — `YEU_CAU_BO_SUNG → DANG_THAM_DINH` (TVV chủ hồ sơ bổ sung xong qua FR-IV-04)
- A2.3 — `TU_CHOI → CHO_THAM_DINH` (TVV chủ hồ sơ nộp lại qua FR-IV-03, không cooldown)

## Verdict

⚠️ **MỘT PHẦN** — 1/3 transition ✅ Đạt (A2.1), 2/3 🚫 Không test được (A2.2 + A2.3) vì TVV ứng viên không login được + pool TU_CHOI rỗng.

> **R7.4.A2 verify pass 2 (2026-05-07 23:30):** retry case A2.1 ⚠️ Sai spec qua NotebookLM HTPLDN + grep SRS local.
> - **A2.1** đổi ⚠️ Sai spec → ✅ Đạt: NotebookLM xác nhận SCR-IV-03 line "Bắt đầu thẩm định" hành vi: "Click → ngầm chuyển trạng thái Mới đăng ký/Chờ thẩm định → Đang thẩm định + chuyển sang tab Thẩm định". `srs-fr-04-chuyen-gia-tvv.md` line 66 cũng nói rõ: "KHÔNG yêu cầu thao tác 'Tiếp nhận hồ sơ' riêng — CB NV vào tab Thẩm định bắt đầu chấm = ngầm chuyển trạng thái". → BE skip CHO_THAM_DINH đi thẳng MOI_DANG_KY → DANG_THAM_DINH là **đúng spec**, không phải deviation.

KHÔNG log bug mới — gaps đã track qua BUG-CG-A1-003 (mail kích hoạt hỏng → TVV stuck CHO_KICH_HOAT → không đặt được mật khẩu → không login portal ứng viên).

## Ý nghĩa cột Status

| Ký hiệu | Nghĩa |
|---|---|
| ✅ Đạt | Test xong, kết quả khớp spec |
| ⚠️ Sai spec | UI/BE làm khác spec nhưng chưa rõ là bug hay spec ambiguous → defer chờ BA |
| 🚫 Không test được | Thiếu điều kiện đầu vào (portal/data/account) — không thể chạy lúc này |

## Pool sau test

| Mã | Tên | State trước | State sau | Note |
|---|---|---|---|---|
| TVV-BTP-TW-0013 | (auto-tạo qua A2.1) | MOI_DANG_KY | DANG_THAM_DINH | A2.1 ✅ Đạt — BE skip CHO_THAM_DINH đúng spec "ngầm chuyển trạng thái" |
| TVV-BTP-TW-0010 | NHT 04 (legacy YEU_CAU_BO_SUNG) | YEU_CAU_BO_SUNG | YEU_CAU_BO_SUNG | A2.2 NOT TESTABLE — CB NV "Sửa hồ sơ" không trigger transition |
| TU_CHOI pool | — | — | — | A2.3 NOT TESTABLE — `GET ?trangThai=TU_CHOI&loaiTvv=TVV/CG` trả `total=0` |

## Test Case Matrix

| TC ID | Transition | Loại | P | Status | Evidence |
|---|---|:-:|:-:|:-:|---|
| **TC-A2-01** | `MOI_DANG_KY → CHO_THAM_DINH` (ngầm khi CB NV bắt đầu thẩm định) | Workflow | P0 | ✅ Đạt | **Verify pass 2 2026-05-07 (NotebookLM + grep SRS):** SRS line 66 + SCR-IV-03 nút "Bắt đầu thẩm định" định nghĩa rõ: "ngầm chuyển trạng thái MOI_DANG_KY/CHO_THAM_DINH → DANG_THAM_DINH" + "KHÔNG yêu cầu thao tác Tiếp nhận hồ sơ riêng". → BE skip CHO_THAM_DINH = **đúng spec**. POST `/tham-dinh` body 4 nhóm → 200, `version:2, trangThai:DANG_THAM_DINH`. [A2-01-tvv0013-moi-dang-ky-skip-to-dang-tham-dinh.png](evidence-r7-4-a2/A2-01-tvv0013-moi-dang-ky-skip-to-dang-tham-dinh.png) |
| **TC-A2-02** | `YEU_CAU_BO_SUNG → DANG_THAM_DINH` (TVV chủ hồ sơ bổ sung xong) | Workflow | P0 | 🚫 Không test được | Spec yêu cầu TVV chủ hồ sơ tự bổ sung qua FR-IV-04 portal — TVV ứng viên không login được (BUG-CG-A1-003 mail kích hoạt hỏng). Test thử CB NV "Sửa hồ sơ" TVV-0010 → state vẫn YEU_CAU_BO_SUNG (đây là FR-IV-01 update hồ sơ, không phải FR-IV-04). POST `/tham-dinh` lại từ YEU_CAU_BO_SUNG → 409 ERR-STATE-IV-TD-01 đúng. [A2-02-tvv0010-yeu-cau-bo-sung-stays-after-sua-ho-so.png](evidence-r7-4-a2/A2-02-tvv0010-yeu-cau-bo-sung-stays-after-sua-ho-so.png) |
| **TC-A2-03** | `TU_CHOI → CHO_THAM_DINH` (TVV chủ hồ sơ nộp lại) | Workflow | P0 | 🚫 Không test được | Pool TU_CHOI = 0 record (`GET /api/v1/tu-van-viens?trangThai=TU_CHOI` trả `totalElements=0`). Spec FR-IV-03 yêu cầu TVV chủ hồ sơ tự nộp lại — TVV ứng viên không login được (BUG-CG-A1-003). [A2-03-tu-choi-pool-empty.png](evidence-r7-4-a2/A2-03-tu-choi-pool-empty.png) |

## Spec compliance summary

| Rule | Spec line | Observed | Compliant |
|---|---|---|:-:|
| MOI_DANG_KY → CHO_THAM_DINH ngầm | line 2305 + line 66 + SCR-IV-03 nút "Bắt đầu thẩm định" | BE skip CHO_THAM_DINH → đi thẳng DANG_THAM_DINH | ✅ Đúng spec — line 66 + SCR-IV-03 spec rõ "ngầm chuyển trạng thái MOI_DANG_KY/CHO_THAM_DINH → DANG_THAM_DINH" |
| YEU_CAU_BO_SUNG → DANG_THAM_DINH via FR-IV-04 | line 2308 | Portal TVV chủ hồ sơ chưa build, CB NV không có cách trigger | ❌ Not implementable |
| TU_CHOI → CHO_THAM_DINH (no cooldown) via FR-IV-03 | line 2314 | Portal TVV chủ hồ sơ chưa build + pool TU_CHOI rỗng | ❌ Not implementable |
| Optimistic lock | FR-IV-06 | TVV-0013 version 1→2 sau POST | ✅ |
| Validation state | FR-IV-06 ERR-STATE-IV-TD-01 | TVV-0010 YEU_CAU_BO_SUNG re-tham-dinh → 409 đúng | ✅ |

## Bugs phát hiện

KHÔNG log bug mới ở R7.4.A2 — A2.2 + A2.3 🚫 Không test được do thiếu portal TVV chủ hồ sơ. Gaps đã cover qua BUG-CG-A1-003 ở [bug-report-flow-r7-4-a1-tvv.md](bug-report-flow-r7-4-a1-tvv.md).

A2.1 ✅ Đạt sau verify pass 2 — không phải deviation, BE behavior khớp SCR-IV-03 + SM-TVV section "ngầm chuyển trạng thái".

## Tóm tắt: case không test được vì sao?

| Case | Lý do | Cần làm gì để test? |
|---|---|---|
| A2.2 (YCBS → DTD) | TVV ứng viên không login được portal `chuyên trang TVV` (BUG-CG-A1-003 mail kích hoạt hỏng) | Dev fix BUG-CG-A1-003 — sau đó TVV login → click Bổ sung tài liệu → state chuyển DANG_THAM_DINH |
| A2.3 (TU_CHOI → CTD) | (1) Pool TU_CHOI rỗng (chưa từng có TVV bị từ chối), (2) TVV ứng viên không login được | (1) CB PD từ chối ≥1 TVV để có data, (2) đợi BUG-CG-A1-003 fix để TVV login portal nộp lại |

## Defer (chờ BA)

Không còn case nào defer sau verify pass 2 — A2.1 đã chốt ✅ Đạt theo SCR-IV-03 + line 66 SRS.
