# Lessons Learned — Round 5 PM HTPLDN

File ghi lại vấn đề thực tế gặp khi chạy QA + bài học áp dụng cho task sau. Không phải rule cứng — chỉ note để tránh lặp.

---

## 2026-05-06 R7.0.2 — False positive 2/8 bug deploy gap do verify bằng QTHT (sai role)

**Vấn đề:**
- Plan-r7-trigger.md ngày 2026-05-06 list 8 bug deploy gap (DEPLOY-001..008). Trong đó:
  - DEPLOY-002 "Sub-menu UI 'Người hỗ trợ pháp lý' chưa thêm vào sidebar Mạng lưới TVV"
  - DEPLOY-003 "Sub-menu UI 'Tổ chức tư vấn' chưa thêm (BE đã có endpoint)"
- User push back "mình vào web vẫn thấy Tổ chức tư vấn mà". Retest qua MCP với `qtht_01` → confirm chỉ thấy 1 sub-menu "Tư vấn viên / Chuyên gia". User push back tiếp "QTHT có quyền không?".
- Login lại bằng `cb_nv_tw_01` (CB Nghiệp vụ TW) → sub-menu "Mạng lưới Tư vấn viên" hiện đầy đủ 3 sub-menu: Tư vấn viên / Chuyên gia + **Tổ chức tư vấn** + **Người hỗ trợ pháp lý**.
- SCR-IV-01 SRS line 1474-1477 spec "Quyền truy cập" chỉ Cán bộ Nghiệp vụ + Cán bộ Phê duyệt + TVV/CG — KHÔNG có QTHT. Đây là feature đúng spec, không phải bug.

**Root cause:**
1. **Default mental model "QTHT all-access".** QA verify deploy mặc định login qtht_01 vì là role admin — assume QTHT thấy mọi UI element. Sai cho menu/submenu/tab có gating per-permission.
2. **Plan-r7-trigger không ghi rõ test bằng role nào.** Khi verify "sidebar Mạng lưới TVV chỉ 1 sub-menu" — không note login bằng account nào → reproducer thiếu, dễ miss.
3. **Bug bị rơi vào confirmation bias.** Verify deploy chạy tuần tự `qtht_01` → kết luận "thiếu" cho tất cả menu/submenu — không retest với role khác trước khi log.

**Bài học:**
1. **Verify "UI element thiếu" BẮT BUỘC test bằng role có permission per SCR.** Memory cross-project: [`feedback_verify_ui_gap_role_permission.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_verify_ui_gap_role_permission.md).
2. **Pre-test UI surface audit** cần task riêng với checklist `[Spec ref / UI element / Required role / Verify status / Bug ID nếu thiếu]` extract từ SRS update.
3. **Bug report "missing UI element" phải quote line SRS role permission + role đã test.** Nếu thiếu, dev/PM đọc bug không reproduce được.

**Findings phụ kèm verify lại 8 bug:**
- DEPLOY-001 (NHT BE 404) + DEPLOY-004 (HOC_VIEN BE 404): vẫn cần curl re-verify hôm nay
- DEPLOY-002 + DEPLOY-003: ❌ FALSE POSITIVE — drop khỏi list
- DEPLOY-005 (4 sub-menu Đào tạo): ✅ CONFIRMED với cb_nv_tw_01 — chỉ thấy 5 sub-menu cũ
- DEPLOY-006 (Tab Ngày lễ Cấu hình HT): ✅ CONFIRMED với qtht_01 — Cấu hình HT 4 tab cố định + Danh mục dùng chung 14 mục đều không có Ngày lễ
- DEPLOY-007 (Filter Địa bàn): ⚠️ SAI MÔ TẢ — SRS không bỏ filter, chỉ rename label "Địa bàn" → "Đơn vị quản lý". Bug đúng = label sai (Minor UI copy)
- DEPLOY-008 (Tab Chờ kích hoạt): ⚠️ SAI TÊN TAB — web có 6 tab, SRS quy định 7 tab. Tab thiếu thực sự = "Chờ thẩm định" (CHO_THAM_DINH state), KHÔNG phải "Chờ kích hoạt"

**Áp dụng:**
- Trước khi log "UI element missing" → grep section "Quyền truy cập" SCR + login đúng role.
- Mỗi SRS update batch → tạo pre-test UI surface audit task với checklist per-role.
- Bug report "missing UI" entry phải quote role permission line + role tested.

---

## 2026-05-02 R11 — A5 TVCS BLOCK lần 4 (Round 11) do seed actor không advance state + bug template vi phạm cũ chưa cleanup

**Vấn đề:**
- R6.4.A5 todo gốc đánh giá `[full 100% — R6.3.3 ✅ + CG account ✅ + FK link ✅. KHÔNG cần A1.5]` → flip 🟢 sai. Khi chạy thực tế: dropdown FR-12 phân công CG trống vì 5 CG seed R6.2.5 stuck `MOI_DANG_KY/YEU_CAU_BO_SUNG`, dropdown filter `trangThai=DANG_HOAT_DONG ∧ loaiTvv=CG` trả 0 record.
- 6 active TVV (state DANG_HOAT_DONG) đều `loaiTvv=TVV` → không match filter `loaiTvv=CG`.
- R6.4.A1 (TVV) ngẫu nhiên advance 6 TVV state → tester/planner nhầm tưởng "advance state là phần test workflow" áp dụng luôn cho CG → R6.2.5 dừng ở "saved 6/6", không advance.
- Bug report flow-tvcs.md mới + flow-hoidap.md mới có section "Tác động" / "Đề xuất fix" — vi phạm rule có sẵn từ 2026-04-23 (CLAUDE.md line 73). User đã nhắc lần 2.
- TVV-0008 missing trong UI (R6.2.5 claim 6 CG, UI thấy 5 = 0007 + 0009-0012). Acceptance "PASS 6/6" không cross-check UI count.

**Root cause (3 lớp):**
1. **Plan acceptance dừng ở "đã tạo" — không đến "consumer dùng được".** R6.2.5 acceptance theo count + LV coverage, không có verify query downstream.
2. **Không phân biệt 2 loại state machine cùng entity.** TVV/CG có profile state (`MOI_DANG_KY → DANG_HOAT_DONG`) khác workflow state (`MOI → TIEP_NHAN → ...`). Workflow test ngẫu nhiên advance profile state → tạo cảm giác "advance state là phụ" → R6.2.5 (CG) lặp lại sai lầm.
3. **Rule có sẵn không enforce bằng hook.** Memory `feedback_seed_acceptance_strict_split` (2026-04-29) đã ghi rule, CLAUDE.md đã quote, nhưng chỉ enforce todo line ngắn + count sync, không enforce semantic dependency chain.

**Bài học (3 rule mới — saved cross-project memory):**
1. **Mỗi entity actor (TVV/CG/NHT/GV/CB/học viên) BẮT BUỘC 2 task tách:** `seed-create` (state default) + `advance-state` (state đáp ứng filter consumer). Không gộp. Memory: [`feedback_seed_actor_state_gap.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_seed_actor_state_gap.md).
2. **Dependency tag `[need: ...]` phải nêu STATE + verify query, KHÔNG nêu chỉ task ID.** ❌ `[need: R6.3.3 ✅ + CG account ✅]` ✅ `[need: ≥1 CG mỗi LV ở DANG_HOAT_DONG (verify GET /tu-van-viens?trangThai=DANG_HOAT_DONG&loaiTvv=CG&linhVucIds=<id>)]`. Memory: [`feedback_dependency_chain_state_explicit.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_dependency_chain_state_explicit.md).
3. **Bug detail strict 6 sections.** Cấm Tác động/Đề xuất fix/SRS verification/Phân biệt module. Hook enforce. Memory: [`feedback_bug_report_template_strict.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_bug_report_template_strict.md).

**Áp dụng (UNIVERSAL — mọi entity actor có downstream consumer khác module):**
- Trigger: entity có dropdown ở module khác + có state machine (profile state).
- Step 1: trước khi viết task seed entity actor, mở `input/data/entity-map.md` (cột "Đọc tại") + grep SRS filter từng consumer.
- Step 2: nếu filter consumer yêu cầu state ≠ default → tách task `<entity>-advance-state` riêng. Acceptance `[need: ≥N record state X (verify <query>)]`.
- Step 3: task `seed-create` đóng ✅ chỉ khi verify query downstream PASS, không chỉ "saved N/N".
- Step 4: dependency chain phải nêu state + verify query, không nêu task ID.
- Step 5: bug report mới — strict 6 sections; cleanup bug report cũ trước khi viết mới (tránh copy pattern cũ).

**Anti-pattern (toàn project):**
- Acceptance "PASS N/N saved" — chỉ chứng minh seeder, không downstream.
- Dependency `[need: <task-id> ✅]` hoặc `[full 100%]` không có state verify.
- Gộp "advance state" vào "test workflow" — workflow test có thể không cover hết entity.
- Trust icon ✅ task upstream — task icon là intent, state là reality. Verify reality.

**Cost của lesson này:**
- 1 round QA test wasted (R6.4.A5 R11) ~30 phút setup + 20 phút discover root cause.
- 30 phút plan re-baseline (thêm task R6.4.A1-CG, update todo bảng tổng).
- Pattern lặp lại từ R5/R6/R7 (memory `feedback_seed_acceptance_strict_split` 2026-04-29) — thực tế 4 lần fail liên tiếp cùng pattern. Lesson này phải khóa cứng bằng hook + template, không bằng memory đơn thuần.

**Liên quan:** R6.3.10 GV (giảng viên) sẽ gặp pattern tương tự — entity GV cũng có profile state + dropdown consumer khác module (FR-III). Khi BA confirm SRS contradiction (chi tiết: [`tasks/decisions/giangvien-srs-contradiction-2026-04-27.md`](decisions/giangvien-srs-contradiction-2026-04-27.md)), apply ngay 3 rule mới cho R6.3.10.

---

## 2026-04-28 → 2026-04-29 — A5 TVCS FAIL do seed acceptance gộp scope (R5/R6/R7)

**Vấn đề:**
- Acceptance T1.B3 viết "12 variant TVV" — không split `loai_tvv` (TVV/CG/NHT).
- Acceptance A5 viết "6 CG/TVV ACTIVE" — gộp CG+TVV trong khi SRS strict "Chỉ CG".
- Kết quả R5: seed 12 TVV / 0 CG vẫn pass gate. R6/R7: split T1.B3b (6 CG) + T1.B3c (3 NHT) lấp gap, nhưng FE TVCS bug enum lệch nên dropdown vẫn empty (BUG-FLOW-TVCS-003).

**Bài học:**
1. Acceptance seed entity nhiều loại phải **split combinatorial**: entity × state × flag × lĩnh vực × downstream consumer. Không gộp.
2. **Pass acceptance theo số lượng ≠ đủ data downstream.** "Seed 12 record" pass nhưng filter `loaiTvv=CG ∧ DANG_HOAT_DONG ∧ la_cong_khai=true` có thể trả 0. Phải verify bằng query thực tế cho từng filter downstream.
3. Sau khi seed actor mới (TVV/CG/NHT), kiểm tra Phân công mặc định (QTHT) có cần row mapping không — dropdown có data nhưng gợi ý vẫn rỗng nếu thiếu mapping (xem A2b R7).
4. **Entity-map phải có TRƯỚC khi viết acceptance seed**, không phải sau. Đảo lại thứ tự: entity-map → đọc downstream consumer → split acceptance.
5. Khi FE bug + seed gap đồng thời, không gộp 2 vấn đề. R4 từng nhầm root cause "BE filter strict đơn vị" → phí 1 round. R5 mới ra root cause FE enum lệch.

**Áp dụng (UNIVERSAL — mọi seed task entity có ≥2 chiều combinatorial trong toàn dự án, không chỉ TVV):**
- Trigger: entity có CHECK constraint enum / loại / cấp / flag / lĩnh vực ≥2 chiều (TU_VAN_VIEN, DOANH_NGHIEP, HO_SO_PHAP_LY, BIEU_MAU, MAU_PHAN_HOI, TAI_KHOAN, KHOA_HOC, DANH_MUC, NHCH, ĐKT, CTDT, BAI_GIANG, ...).
- Step 1: mở [`input/data/entity-map.md`](../input/data/entity-map.md) đọc cột "Đọc tại" → liệt kê tất cả downstream task.
- Step 2: cho mỗi downstream, quote nguyên văn SRS filter (`srs-fr-X line N` + `02-thu-tu-module §`).
- Step 3: acceptance split combinatorial: entity × state × flag × LV × cấp × downstream. Không gộp 2 chiều.
- Step 4: pass acceptance bằng verify query thực tế per filter downstream (không chỉ đếm tổng).
- Step 5: section "Downstream consumer × filter" trong [`output/template/seed-checklist-template.md`](../output/template/seed-checklist-template.md) là blocker — mọi seed task mới phải fill section này trước khi seed.
- Step 6 (sibling-check): per memory `feedback_test_plan_check_sm_table`, mở SM table 02-thu-tu-module + check ≥2 module sibling đọc entity này trước khi viết acceptance.
- Pair task seed actor + task QTHT phân công khi cần (vd A2 cho TVV → A2b cho CG/NHT).

**Anti-pattern phải tránh (toàn project):**
- "Seed N variant" mà không split chiều.
- Pass acceptance theo COUNT(record) thay vì verify per-filter query.
- Viết acceptance khi chưa đọc entity-map.
- Gộp 2 loại entity (CG+TVV, TW+ĐP, siêu nhỏ+nhỏ) trong 1 acceptance.

**Liên quan:** R4 cũng từng có pattern tương tự với GIANG_VIEN (SRS contradiction §Inputs vs §3.4.3.x).

---

## 2026-04-28 — LGSP / Cổng PLQG sync hay lỗi

**Vấn đề:** 2 bug Critical cùng pattern phát hiện cross-module:
- BUG-FLOW-BIEUMAU-001 (R5 trụ C1): "Lỗi đồng bộ" Cổng PLQG khi advance Biểu mẫu CONG_KHAI.
- BUG-FLOW-CTHTPLDN-001 (R5 P3.3 pilot TW): `POST /publish` → HTTP 502 khi công bố CT.

**Bài học:**
- Module có sync ra Cổng PLQG: BIEU_MAU · CT_HTPLDN · TVV (Công khai) · HOI_DAP (Công khai) · KHOA_HOC (DA_CONG_KHAI).
- Khi test các module này → expect LGSP có thể down. Workaround: dùng path alt skip công bố nếu SM cho phép (vd CT HTPLDN: `DA_DUYET → DANG_THUC_HIEN` skip `DA_CONG_BO`).
- Bug log nhóm theo pattern, link nhau cross-reference.
- Escalate dev/infra config LGSP credentials + retry + graceful fallback.

---

## 2026-04-28 — UI auto-chain nhiều transition vào 1 click

**Vấn đề:** 2 case UI gộp 3 transition thành 1 click:
- TVV: "Gửi KQ" tab Thẩm định → auto-chain `MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH → YEU_CAU_BO_SUNG` (3 transition). UI thiếu nút [Tiếp nhận] + [Bắt đầu thẩm định].
- CT HTPLDN: stepper auto-tick "Công bố" dù skip path #7a (DA_DUYET → DANG_THUC_HIEN bỏ qua DA_CONG_BO).

**Bài học:**
- Khi UI advance state nhanh hơn SM define → log finding "UI auto-chain", pending BA confirm:
  (a) Design choice OK → SRS update simplify
  (b) UI thiếu nút intermediate → build thêm
  (c) Verify BE audit log có ghi từng transition không
- Stepper UI có thể tick step không thực sự đi qua → cosmetic finding, không block test nhưng note.

---

