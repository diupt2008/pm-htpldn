# Câu hỏi cần BA chốt — SRS FR-06 v3.5 (Chi trả Chi phí Tư vấn)

| Mục | Giá trị |
|-----|---------|
| **Người hỏi** | QA Team (huongttt) |
| **Người trả lời** | BA |
| **Ngày gửi** | 2026-05-06 |
| **SRS reference** | [`input/srs-update-2026-5-5/srs-fr-06-chi-tra.md`](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md) (v3.5, 1.414 dòng) |
| **CHANGELOG** | [`CHANGELOG-v3-to-v3.5.md §srs-fr-06 line 714-866`](../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) |
| **Delta map** | [`_DELTA-MAP-FR06.md`](../../../../input/srs-update-2026-5-5/_DELTA-MAP-FR06.md) |
| **Tổng số câu** | 2 (cả 2 đều liên quan technical debt v3.5 do BA đã chốt OUT Thay đổi 5 + 8) |
| **Mức độ ảnh hưởng** | Q1 chặn TC CT-006 (test lần 4 bổ sung); Q2 chặn TC SLA (CT-021 + #16 SCR-V.II-01 + #3 SCR-V.II-02). Cả 2 không chặn deploy nhưng QA cần biết để viết test plan đúng. |

> **Bối cảnh:** QA đã deep review SRS FR-06 v3.5 + CHANGELOG. Trong 4 câu hỏi cần confirm trước khi viết test plan, **2 câu đã có answer rõ trong SRS** (FR-V.II-14 chuyên trang DN; auto-từ-chối quá hạn) và **2 câu dưới đây không có trong SRS — chỉ BA mới có thẩm quyền chốt** vì liên quan đến hành vi BE/UI ở technical debt mà v3.5 cố ý không định nghĩa.
>
> Mỗi câu có: **Vấn đề** (mô tả gap quote SRS line) + **Tác động test** (TC nào bị chặn) + **Đề xuất phương án** (A/B/C để BA tick).

---

## Q1 — Lần 4 yêu cầu bổ sung: BE response code và behavior

**Vấn đề:**

Sau khi BA chốt OUT **Thay đổi 5** (FR-V.II-CROSS-01 + BR-EC-15/16 — auto từ chối lần 4 bổ sung) tại CHANGELOG line 855, v3.5 chỉ giữ:
- HO_SO_CHI_TRA `bo_sung_count` CHECK BETWEEN 0 AND 3 ([line 1184](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L1184))
- UI counter "Lần bổ sung: {n}/3" + highlight đỏ khi n ≥ 2 ([SCR-V.II-02 #11 line 978](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L978))
- Quy tắc tương tác ([line 1030](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L1030)): "đối chiếu giới hạn nghiệp vụ tối đa 3 lần"

**SRS KHÔNG có:**
- Error code formal cho "request bổ sung lần 4" (không nằm trong ERR-CT-KT-01/02 ở FR-V.II-03 — [line 290-291](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L290))
- Hành vi UI khi n=3: nút "Yêu cầu bổ sung" có disabled không?
- Khi `bo_sung_count = 3` mà CB NV vẫn cố click "Yêu cầu bổ sung" → hệ thống làm gì?

**Tác động test:**
- **CT-006** "Bổ sung lần 4 → tự động từ chối (BR-EC-15)" — TC hiện tại sai, cần redesign.
- Block test edge case `bo_sung_count = 3`.
- DELTA-MAP FR-06 §6 Technical debt #2 đã ghi rõ: "`bo_sung_count` ≥ 3 không auto-TU_CHOI — UI hiển thị {n}/3 + highlight đỏ ≥ 2 nhưng FR không có hành động auto khi n=3. CB NV thủ công."

**Đề xuất BA chốt 1 phương án:**

- ☐ **(A) UI disable nút "Yêu cầu bổ sung" khi n=3** + tooltip "Đã đạt giới hạn 3 lần". CB NV phải chọn "Không đạt" → TU_CHOI thủ công. Test: verify disabled state + tooltip text.
- ☐ **(B) BE chặn ở API layer** — nếu CB NV cố submit kết quả "CAN_BO_SUNG" khi `bo_sung_count = 3` → BE trả HTTP 4xx (mã lỗi mới `ERR-CT-KT-03`?). UI vẫn cho click nhưng modal show error. Test: verify HTTP code + error message.
- ☐ **(C) Auto chuyển TU_CHOI khi n=3** (đảo lại Thay đổi 5 — re-introduce BR-EC-15 nhẹ hơn): khi CB NV click lần 4 → confirm modal "Đã 3 lần bổ sung, hệ thống sẽ chuyển sang Từ chối" → chuyển TU_CHOI với `ly_do_tu_choi = "QUA_3_LAN_BO_SUNG"`. Test: verify modal + state transition.
- ☐ **(D) Phương án khác:** _________________

**Recommend QA:** Phương án **A** (đơn giản nhất, không phá scope v3.5, đồng nhất với UI counter highlight đỏ ≥ 2 đã có). Nếu chọn A, QA sẽ rewrite CT-006 thành "test n=3 → nút disabled → CB NV chọn 'Không đạt' → TU_CHOI thủ công".

---

## Q2 — SLA: 4 mức cảnh báo cụ thể là gì?

**Vấn đề:**

Sau khi BA chốt OUT **Thay đổi 8** (SLA dynamic "Còn N ngày" + BR-SLA-02) tại CHANGELOG line 856, v3.5 giữ V3 baseline "4 mức cảnh báo":
- SCR-V.II-01 #16 SLA column ([line 926](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L926)): "C07 — 4 mức cảnh báo (80px)"
- SCR-V.II-02 #3 Header info ([line 970](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L970)): "SLA (C07 — 4 mức cảnh báo)"
- BR-CALC-03 ([line 1370](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L1370)): "Deadline = ngày tiếp nhận + N ngày làm việc. N lấy từ CAU_HINH_SLA"

**SRS KHÔNG có:**
- Định nghĩa cụ thể 4 mức là gì (vd: <50% / 50-80% / 80-100% / >100% deadline?)
- Màu sắc tương ứng từng mức
- HO_SO_CHI_TRA KHÔNG có 2 field `deadline` + `muc_do_canh_bao` (cascading bỏ do Thay đổi 8 OUT — CHANGELOG line 856)
- "C07" cite UX-Spec ngoài (`dac-ta-man-hinh-chuc-nang-v2.md`) — file này chưa có trong scope SRS apply

**Tác động test:**
- **CT-018, CT-021** SLA tracking — không biết test ngưỡng nào.
- Block verify visual rendering ô cột SLA ở SCR-V.II-01.
- Block verify badge SLA ở header SCR-V.II-02.

**Đề xuất BA chốt 1 phương án:**

- ☐ **(A) Provide UX-Spec C07 hoặc define 4 mức trong SRS:** ngưỡng % deadline + màu (vd: <50% xanh / 50-80% vàng / 80-100% cam / >100% đỏ). QA sẽ test theo ngưỡng đó.
- ☐ **(B) Tạm hoãn test SLA** — đánh dấu CT-018/CT-021 là "Chờ UX-Spec C07" + skip ở round này. Khi UX-Spec available → reactivate.
- ☐ **(C) Phương án khác:** _________________

**Recommend QA:** Phương án **A** với ngưỡng default `<50% xanh / 50-80% vàng / 80-100% cam / >100% đỏ` (chuẩn cảnh báo hành chính phổ biến). Nếu BA cung cấp UX-Spec C07 thì QA sẽ test theo spec.

---

## Phụ lục — 2 câu QA tự trả lời được (không cần BA confirm)

### Q3 — FR-V.II-14: DN bổ sung qua DVC hay Cổng PLQG?

**Đã có answer trong SRS:** cả 3 kênh đều hợp lệ.

- [Line 837](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L837): "Cổng DVC / Cổng PLQG (giao diện DN) hoặc SCR-V.II-02 (CB NV thao tác thủ công)"
- [Line 841](../../../../input/srs-update-2026-5-5/srs-fr-06-chi-tra.md#L841): "Tác nhân: Doanh nghiệp (qua DVC/Cổng PLQG) hoặc CB NV (thủ công)"

**Test plan:**
- Kênh DN qua DVC + DN qua Cổng PLQG: external integration → BLOCKED (cùng pattern §10 flow-module.md).
- Kênh CB NV thủ công thay DN tại SCR-V.II-02: testable ngay → cover trong CT mới.

### Q4 — Auto từ chối quá hạn 15 ngày làm việc?

**Đã có answer trong SRS:** v3.5 KHÔNG có auto-từ-chối quá hạn.

- BA chốt OUT Thay đổi 5 (CHANGELOG line 855) — bỏ FR-V.II-CROSS-01 + BR-EC-16.
- DELTA-MAP FR-06 §6 Technical debt #1: "State YEU_CAU_BO_SUNG không có auto-từ-chối quá hạn — DN không gửi trong 5 ngày → HS treo vĩnh viễn. Phiên bản sau bổ sung."
- BR-CALC-03 chỉ tính deadline, KHÔNG có rule auto reject khi quá hạn.

**Test plan:**
- KHÔNG có TC test auto chuyển TU_CHOI khi quá 15 ngày làm việc.
- Nếu BE thực tế auto chuyển → log bug "BE behavior khác SRS v3.5" với SRS ref Thay đổi 5 OUT.

---

## Lưu ý

2 câu Q1 + Q2 đều liên quan đến **trade-off BA đã quyết** (OUT Thay đổi 5 + 8) → có rủi ro re-open scope. QA chỉ cần BA tick A/B/C để viết test plan đúng, KHÔNG đề xuất BA reverse decision.

Khi BA trả lời, QA sẽ:
1. Update [output/funtion/7.6-chi-tra-chi-phi.md](../../../../output/funtion/7.6-chi-tra-chi-phi.md) (CT-006, CT-018, CT-021) theo phương án chốt.
2. Update [output/smoke/6.6-sm-chitra.md](../../../../output/smoke/6.6-sm-chitra.md) (TP-CT-02 wording).
3. Note SRS reference + phương án chốt vào file này (mark `RESOLVED YYYY-MM-DD`).
