# Lessons Learned — Round 5 PM HTPLDN

File ghi lại vấn đề thực tế gặp khi chạy QA + bài học áp dụng cho task sau. Không phải rule cứng — chỉ note để tránh lặp.

---

## 2026-05-07 — FR-02 v3.5 typo SRS sao chép nhầm template state `DA_PHAN_CONG` từ FR-V.I-09 VU_VIEC sang HOI_DAP (KHÔNG phải mâu thuẫn nội bộ)

**Vấn đề:**
- Khi rà soát SRS [`srs-update-2026-5-5/srs-fr-02-hoi-dap.md`](../input/srs-update-2026-5-5/srs-fr-02-hoi-dap.md) v3.5, phát hiện state `DA_PHAN_CONG` xuất hiện 7 vị trí trong FR-II-04/05/06: filter cứng (line 317/385/400/404), Preconditions (line 448), Processing/Output/Postcondition/AC (line 474/498/502/509/511).
- Nhưng **CHECK constraint** entity HOI_DAP (line 1341) + **SM-HOIDAP diagram** (line 1488-1500) + **transition table** (line 1521) đều canonical 9 state KHÔNG có DA_PHAN_CONG.
- **Lỗi ban đầu của tôi (turn trước):** Tôi log như "mâu thuẫn nội bộ SRS v3.5 — chờ BA chốt giữ/bỏ" và đặt vào `srs-conflicts-need-ba.md` với 2 option (a) bổ sung DA_PHAN_CONG + (b) xóa khỏi 7 vị trí. Đặt làm gate block test plan FR-02.
- **User push back:** "deep review kỹ tài liệu cũng không có câu trả lời hả, bạn review kỹ lại". Re-verify với 4 nguồn ngoài srs-fr-02 → phát hiện root cause thực.

**Root cause (deep review 4 nguồn — verify kỹ thay vì 2):**
- Master [`srs-v3.md`](../input/srs-update-2026-5-5/srs-v3.md) line **1367** CHECK constraint: `DA_PHAN_CONG` thuộc entity **VU_VIEC** (12 state) — KHÔNG phải HOI_DAP.
- Master [`srs-v3.md:4985-5011`](../input/srs-update-2026-5-5/srs-v3.md) SM-VUVIEC: transition `DANG_KIEM_TRA → DA_PHAN_CONG → DANG_XU_LY/DA_TIEP_NHAN` cho FR-V.I-09/10 phân công NHT/TVV vụ việc.
- [`02-thu-tu-module.md:421/426/427/487`](../input/quy-trinh-nghiep-vu/02-thu-tu-module.md): bảng SM-VUVIEC dùng DA_PHAN_CONG. Đặc biệt line 487 đã có cảnh báo từ trước: *"Master SRS §C.1 enum có 9 state nhưng KHÔNG có DA_PHAN_CONG; tuy nhiên srs-fr-02 UC15 (FR-II-06) lại set trang_thai='DA_PHAN_CONG'. Đây là conflict trong SRS — cần CĐT thống nhất. Bảng dưới bám Master."* → người viết 02-thu-tu-module.md đã spot từ trước và quyết định bám Master.
- [`flow-module.md:184`](../input/quy-trinh-nghiep-vu/flow-module.md): SM-VUVIEC 12 state có DA_PHAN_CONG (cho VU_VIEC, không HOI_DAP).

**→ Đây là TYPO cherry-pick template:** BA copy template Processing từ FR-V.I-09 (Phân công VU_VIEC) sang FR-II-06 (Phân công HOI_DAP) v3.5 nhưng quên đổi state name. Cùng pattern "Phân công" nên 2 FR có template gần giống nhau. Master truth canonical đã có (HOI_DAP 9 state, không có DA_PHAN_CONG). Không phải feature ambiguous chờ BA chốt.

**Bài học (META — về cách verify SRS conflict trước khi log BA pending):**
1. **Khi spot inconsistency state machine, BẮT BUỘC verify 4+ nguồn ngoài file FR đang đọc** — không dừng ở "FR section dùng X nhưng CHECK constraint trong cùng file không có X". Phải mở Master `srs-v3.md` + `02-thu-tu-module.md` + `flow-module.md` xem state đó có thuộc entity khác không. Memory rule cross-project [`feedback_test_plan_check_sm_table.md`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_test_plan_check_sm_table.md) đã yêu cầu mở `02-thu-tu-module.md` trước khi viết test plan — nhưng tôi đã không apply lúc deep review conflict.
2. **Khi 02-thu-tu-module.md đã có cảnh báo từ trước** (vd line 487 "bám Master"), đó là đáp án của project — không cần tạo BA question mới, chỉ cần cite cảnh báo có sẵn + update test plan theo Master.
3. **"Mâu thuẫn nội bộ trong file FR" có 2 loại:** (a) feature ambiguous thực sự cần BA chốt, (b) typo cherry-pick template từ FR khác. Phân biệt bằng cách grep state name xuyên dự án — nếu state đó là canonical của module khác → typo, không phải (a).
4. **User push back là tín hiệu sớm.** Memory rule [`feedback_dev_pushback_critical_thinking`](../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_dev_pushback_critical_thinking.md) áp với dev push back. Logic tương tự với user push back trên review kết quả: phải verify lại 2 lần thay vì confirm rule cũ.

**Áp dụng (UNIVERSAL — mọi SRS state machine inconsistency):**
- **Step 1:** Spot state X dùng trong FR section nhưng không trong CHECK constraint cùng file → KHÔNG vội log BA pending.
- **Step 2:** Grep state X trong Master `srs-v3.md` (file root cùng folder v3.5) — nếu thuộc entity khác → typo template, log dưới dạng "BA fix typo SRS, không block test".
- **Step 3:** Grep state X trong `02-thu-tu-module.md` + `flow-module.md` — verify đó có phải canonical state của module khác không + có cảnh báo từ trước không.
- **Step 4:** Nếu Master + 2 file canonical đều cho state X thuộc module khác → kết luận TYPO. Test plan bám Master truth. Báo BA fix typo cosmetic.
- **Step 5:** Nếu Master + 2 file đều không có state X → đó là feature mới chưa chốt → log BA question với 2 option giữ/bỏ.

**Anti-pattern phải tránh:**
- ❌ Spot inconsistency trong 1 file → log BA pending → đặt làm gate block test mà không verify Master + 02-thu-tu-module.md trước.
- ❌ Cho rằng "BA cherry-pick chưa hoàn thiện" → assume feature mới → tạo gate block. Đa số trường hợp là typo template.
- ❌ Skip cảnh báo có sẵn trong 02-thu-tu-module.md (như line 487 đã spot từ trước "bám Master") → tự log lại như issue mới.

**Cost:** ~15 phút verify SRS lần đầu (chỉ check srs-fr-02) → log sai gate → 30 phút deep review cross-check 4 nguồn sau user push back → 20 phút sửa lại srs-conflicts-need-ba.md + todo.md + plan.md + lessons-learned.md. **Tổng cost lỗi: ~50 phút** vs ~10 phút nếu deep review từ đầu. Lesson: verify Master trước khi log BA pending là ROI cao nhất.

---

## 2026-05-06 — FR-02 v3.5 spec internal contradiction `DA_PHAN_CONG` (LEGACY — đã refine ở entry 2026-05-07)

> Entry này log lần đầu khi nhầm là "mâu thuẫn nội bộ chờ BA chốt". Sau push back của user, deep review xác định là typo template (xem entry 2026-05-07 trên). Giữ entry này làm reference về quá trình học.

**Vấn đề (đã refine):** State `DA_PHAN_CONG` ở 7 vị trí FR-II-04/05/06 nhưng không trong CHECK constraint HOI_DAP + SM diagram. Tôi nhầm là "BA pending giữ/bỏ" — thực ra là typo cherry-pick từ FR-V.I-09 VU_VIEC sang FR-II-06 HOI_DAP. Master `srs-v3.md` line 1367 + 4985-5011 + 02-thu-tu-module.md line 487 + flow-module.md line 184 đều canonical = DA_PHAN_CONG thuộc VU_VIEC, HOI_DAP 9 state KHÔNG có.

**Root cause refine:** Tôi không apply rule "mở 02-thu-tu-module.md + flow-module.md trước khi log conflict" — chỉ check 1 file srs-fr-02 nội bộ.

---

## 2026-05-06 — SRS v3.5 partial release: 12/16 file FR slice + master fallback cho 4 file thiếu

**Vấn đề:**
- BA phát hành SRS v3.5 ngày 2026-05-06 (CHANGELOG-v3-to-v3.5.md). Folder `input/srs-update-2026-5-5/` chỉ có **12/16 file FR slice**: fr-01 đến fr-10 + fr-12 + fr-13. Thiếu **fr-11 (Báo cáo) / fr-14 (HĐ TV) / fr-15 (CT HTPLDN) / fr-16 (API)**.
- Đã verify qua NotebookLM (notebook `a4ae45bf-cea0-4325-8fee-b1e0be702cf2`) — kết quả khẳng định: "phần chi tiết FR của Nhóm IX, X.3, XI, XII thuộc các file `srs-fr-11/14/15/16` không xuất hiện trong phạm vi tài liệu hiện tại". Đây là **chủ ý của BA**, không phải drift bug — 4 file này còn đợi Pha 3 reconcile.
- **Hệ quả:** mọi reference owner FR-14 / FR-16 trong các file v3.5 (vd FR-09 §4 stub redirect HOP_DONG_TU_VAN → `srs-fr-14-hop-dong-tv.md`) đang trỏ về file **không tồn tại** trong v3.5 folder.
- Master `srs-v3.md` v3.5 (cùng folder) vẫn giữ entity HOP_DONG_TU_VAN block đầy đủ (line 1853) với `Tham chiếu FR: FR-X.3-01` — đây là **source-of-truth tạm** cho FR-14 đến khi có file riêng.
- Tương tự, FR-16 changes (rename `la_cong_khai` → `cong_khai` trong API filter) chỉ ghi trong CHANGELOG, không có file slice riêng để verify.

**Root cause:**
1. **Cherry-pick không đồng đều.** BA cherry-pick từ v4 sang v3.5 nhưng dừng ở 12 file đã review xong. 4 file còn lại để Pha 3.
2. **Naming convention mâu thuẫn.** File slice trong v3.5 ghi ngày apply 2026-05-06 ở header → tester nhầm tưởng "tất cả file đã apply". Thực tế chỉ 12 file.
3. **Cross-reference broken.** Stub redirect trong fr-09 trỏ về fr-14 → tester click không thấy file → nghi vấn drift bug.

**Bài học:**
1. **Trước khi viết test plan/task cho 1 module, verify file slice TỒN TẠI trong v3.5 folder.** Nếu thiếu → đọc spec từ master `srs-v3.md` (search §3.4.3 cho entity, §3.2 cho FR, Phụ lục B cho BR, Phụ lục C cho SM).
2. **Cross-reference NotebookLM khi nghi ngờ drift.** Notebook `a4ae45bf-cea0-4325-8fee-b1e0be702cf2` (project HTPLDN v3.5) có metadata 16 file FR — query để xác nhận file nào real, file nào pending.
3. **Slice drift trong file reference (chỉ "referenced" không "owned") KHÔNG phải bug nghiệp vụ.** Vd `srs-fr-13-tv-nhanh.md` line 750 còn `la_cong_khai` cho HOI_DAP — owner FR-02 đã rename đúng `cong_khai`. Đây là drift slice, source-of-truth FR-02 đúng → flag minor không block.

**Áp dụng (UNIVERSAL — mọi SRS update batch có file slice + master file):**
- **Step 1:** Mở `ls input/srs-update-*/` đếm số file FR slice. Compare với mục lục §3.2.1 trong master.
- **Step 2:** Với module có file slice → đọc slice. Với module thiếu file slice → đọc master section §3.2.<X> + §3.4.3.<Y> + Phụ lục B/C.
- **Step 3:** Với entity owned bởi module thiếu file slice (vd HOP_DONG_TU_VAN owned bởi FR-14) → master là source-of-truth. Tag rõ trong test plan: `_(spec từ srs-v3.md line N — file slice fr-XX chưa release)_`.
- **Step 4:** CHANGELOG-v3-to-v3.5.md có changes của FR-XX nhưng không có file slice → ghi rõ "Pha 3 pending" trong todo. Không tạo task QA chạy cho phần này cho đến khi file slice release.

**Anti-pattern phải tránh:**
- ❌ Cho rằng "v3.5 folder = tất cả module v3.5 ready" → tạo task R8 cho FR-14/16 dựa trên CHANGELOG → khi chạy thấy file slice không có → block phải hỏi BA.
- ❌ Log bug "stub redirect trỏ file không tồn tại" → đây là pattern intentional của partial release.
- ❌ Update test artifact 7.14 / 7.16 dựa trên CHANGELOG (high-level summary) thay vì master srs-v3.md (low-level spec).

**Cost:** 30 phút deep verify 3 ambiguity (master HOP_DONG_TU_VAN refs / v3.5 thiếu file / fr-13 line 750 drift) — nếu bỏ qua sẽ tốn ~1 round QA chạy bằng spec sai.

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

