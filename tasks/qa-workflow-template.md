# QA Workflow Template — Áp dụng cho mọi dự án Enterprise CMS

> **Mục đích:** Workflow step-by-step có **prompt copy-paste**, **skill cụ thể**, **tool cụ thể**, **output cụ thể** cho mỗi bước. Tái sử dụng cho dự án QA enterprise CMS có ≥10 module + state machine + multi-role permission.
>
> **Nguồn:** Đúc kết từ dự án QA PM HTPLDN (Round 1 → Round 5, 2026-04-15 → 2026-04-28). Đã verify với 16 module × 11 vai trò × 3 cấp + tích hợp 18 API ngoài.
>
> **Cách dùng:** Copy file này vào `tasks/` của dự án mới → đổi `[TÊN DỰ ÁN]` `[URL]` `[path]` → chạy theo thứ tự Phase 0 → Phase 7.

---

## 📋 PRE-REQUISITES (setup máy 1 lần)

```bash
# 1. Chrome DevTools MCP (primary tool)
# Edit ~/.claude.json → mcpServers.chrome-devtools = npx -y chrome-devtools-mcp@latest

# 2. Gstack browse (fallback tool) — có sẵn ở ~/.claude/skills/gstack/

# 3. NotebookLM MCP (cross-check SRS semantic)
nlm login

# 4. Verify skills installed
# Mở Claude Code → check available skills list (qa, qa-only, design-review, investigate, autoplan, ...)
```

---

## 🗺️ TRỤC THỜI GIAN TỔNG (5-7 tuần)

```
[D0]──[P0]──[P1]──[P2]──[P3]──[P4]──[P5]──[P6]──[P7]──[Round Permission]
Setup Env  Disc Plan  Smoke 5Trụ  ĐầuRa Func TổngKết PhânQuyền
0.5d  0.5d 2d   1d    5d    5d    5d    5d   5d      1.5w
```

---

# PHASE 0 — KICK-OFF & ENV VERIFY (0.5 ngày)

**Mục tiêu:** Verify môi trường + tài khoản + tool sẵn sàng trước khi đầu tư đọc SRS.

## Step 0.1 — Verify môi trường

**Prompt:**
```
Verify môi trường dự án [TÊN DỰ ÁN]:
- App URL: [URL]
- DB endpoint: [nếu có]
- 3rd party: [list LGSP/Cổng PLQG/MailHog/...]
- Tài khoản test: [path file CSV/JSON]

Hãy curl từng endpoint, login thử 3 vai trò chính (admin + 1 CB NV + 1 CB PD), report PASS/FAIL từng cái.
Output ghi vào tasks/_prep-log.md.
```

**Skill:** không cần · **Tool:** `Bash` (curl) + `mcp__chrome-devtools__new_page` + `fill_form`

**Output:** `tasks/_prep-log.md`

---

## Step 0.2 — Tạo skeleton folder

**Prompt:**
```
Tạo cấu trúc folder QA cho dự án:
- output/qa-reports/round1-{ngày}/
  - smoke-test/ · seed/ · workflow/ · functional/ · bug-reports/ · screenshots/
- tasks/ (plan.md + todo.md sẽ tạo sau)
- input/ (SRS + fixture + accounts)

Tạo README ngắn ở mỗi folder.
```

**Skill:** không cần · **Tool:** `Bash` mkdir + `Write`

**Output:** Cấu trúc folder + READMEs

**Gate C0:** auto-pass nếu ≥10/11 role login OK + 1 tool primary work.

---

# PHASE 1 — DISCOVERY (2 ngày)

**Mục tiêu:** Hiểu sản phẩm đủ để KHÔNG ngộ nhận khi viết plan. **Cấm viết test case.**

## Step 1.1 — Đọc SRS song song

**Prompt:**
```
Tôi cần hiểu hệ thống [TÊN] đầy đủ trước khi viết test plan.
Spawn 4 agent Explore song song đọc SRS folder input/srs/:
- Agent 1: extract list module + actor + use case (~16 module)
- Agent 2: extract state machine từng module (states + transitions + triggers)
- Agent 3: extract business rules (BR-XX) + error codes (ERR-XXX)
- Agent 4: extract permission matrix (role × module × CRUD)

Mỗi agent report ngắn <500 từ, chỉ liệt kê, KHÔNG viết test case.
```

**Skill:** `agent-skills:context-engineering` · **Tool:** `Agent` (subagent_type=Explore) × 4 song song

**Output:** 4 báo cáo trong context

---

## Step 1.2 — Cross-check SRS bằng NotebookLM

**Prompt:**
```
Upload toàn bộ file SRS vào notebook NotebookLM mới tên "[DỰ ÁN]-SRS".
Sau đó query 5 câu để verify hiểu của tôi:
1. Có bao nhiêu module và quan hệ phụ thuộc giữa các module?
2. Liệt kê 5 luồng nghiệp vụ end-to-end chính (user → kết quả).
3. Module nào user thao tác trực tiếp, module nào auto-trigger?
4. Có những BR công thức tính toán nào (rate %, threshold, deadline)?
5. Phân quyền có cấp nào, scope filter ra sao?
```

**Skill:** không cần · **Tool:** `mcp__notebooklm-mcp__notebook_create` + `source_add` + `notebook_query`

**Output:** Notebook NotebookLM dùng cross-check trong suốt dự án

---

## Step 1.3 — Tạo system-overview.md

**Prompt:**
```
Tổng hợp output 4 agent + NotebookLM thành tasks/system-overview.md:
§1. Sản phẩm làm gì (3 câu)
§2. Vai trò × cấp (table)
§3. 5 LỚP DATA (Nền → Master → Lõi → Phái sinh → Tổng hợp)
§4. Bản đồ N module + sub-menu (table dài)
§5. ⭐ Bảng nguồn 30+ dropdown (lấy từ đâu, filter gì)
§6. Quy ước thuật ngữ (8-10 thuật ngữ key)
§7. ⚠️ Mâu thuẫn SRS cần BA xác nhận (≥3-5)
§8. Module nhập tay vs auto-trigger
§9. Bản đồ tab cần data nào
§10. Khi gặp tab rỗng — phân loại

Mỗi section ngắn gọn, dùng table > prose.
```

**Skill:** `bmad-document-project` · **Tool:** `Write`

**Output:** `tasks/system-overview.md`

---

## Step 1.4 — Vẽ luồng E2E nghiệp vụ chính

**Prompt:**
```
Dựa vào system-overview.md, vẽ 3 luồng end-to-end chính bằng Mermaid (state diagram):
- LUỒNG A: [tên luồng nhanh] (vd: Hỏi đáp 6 state)
- LUỒNG B: [tên luồng phức tạp] (vd: Vụ việc 8 state + nhánh phái sinh Hợp đồng/Chi trả/Đánh giá)
- LUỒNG C: [tên luồng đặc biệt] (vd: TV chuyên sâu)

Mỗi luồng phải có: trigger từ user → state CB xử lý → state phê duyệt → state cuối + auto-transition rule.
Output: input/quy-trinh-nghiep-vu/01-tong-quan-nghiep-vu.md
```

**Skill:** `bmad-create-architecture` · **Tool:** `Write`

**Output:** `01-tong-quan-nghiep-vu.md`

---

## Step 1.5 — Map dependency graph A→B→C ⭐ TRÁI TIM PLAN

**Prompt:**
```
Đây là TRÁI TIM của test plan. Đừng skip.

Phân tích system-overview.md + luồng E2E + N module → tạo bảng:
1. Ràng buộc CỨNG (vi phạm = block dù code đúng): A trước → B sau → C lý do
2. Ràng buộc MỀM (nên tuân thủ nhưng có thể bypass)
3. Module ĐỘC LẬP (chạy được ngay sau Tầng 1)

⚠️ Format BẮT BUỘC mỗi ràng buộc cứng — STATE-explicit, KHÔNG task-id-only:
  ✅ Đúng: "Cần ≥N <entity> state <X> (verify GET /api?state=X → ≥N)"
  ❌ Sai:  "Cần task T1.B3 ✅" (icon task không nói state nào)

Cột bắt buộc: Trước (entity+state+count) | Sau (consumer module) | Verify query | Lý do.
Thêm cột "Cascade fallback": nếu A block thì B/C có path thay thế nào?
Ít nhất 15 ràng buộc cứng cho dự án ≥10 module.
Output: input/data/entity-map.md + bảng nhúng vào plan.md §2
```

**Skill:** `bmad-create-architecture` · **Tool:** `Write`

**Output:** `input/data/entity-map.md`

---

## Step 1.6 — Liệt kê mâu thuẫn SRS

**Prompt:**
```
Scan toàn bộ file SRS tìm mâu thuẫn cần BA confirm:
- Field/state ở §Inputs khác §3.4.3.x
- Enum khác giữa SRS v3.0 và v3.1
- Workflow N-state spec vs M-state UI thực
- Error code không có handler

Mỗi mâu thuẫn: quote nguyên văn 2 nơi + đánh giá impact (Critical/Major/Minor).
Output: output/srs-conflicts-need-ba.md → gửi BA trước khi go P2.
```

**Skill:** `bmad-advanced-elicitation` · **Tool:** `Bash` grep + `Read` + `Write`

**Output:** `srs-conflicts-need-ba.md`

---

## Step 1.7 — Phân tích cấp/scope (skip nếu single-cấp)

**Prompt:**
```
Hệ thống có ≥2 cấp tổ chức (vd TW/ĐP/BN)? Nếu CÓ → tạo bảng:
| Cấp | Module có scope filter | Account login | Read scope | Write scope |

Output: input/data/scope-matrix.md.
```

**Skill:** `bmad-create-architecture` · **Tool:** `Write` · **Output:** `scope-matrix.md`

---

# PHASE 2 — STRATEGY + PLAN + TODO (1 ngày)

**Mục tiêu:** 1 file Plan A→Z + 1 file Todo execution-ready + CLAUDE.md.

## Step 2.1 — Định nghĩa fixture pool

**Prompt:**
```
⚠️ TRƯỚC KHI VIẾT FIXTURE: mở entity-map.md cột "Đọc tại" liệt kê mọi
   downstream consumer + filter họ dùng (loại / state / lĩnh vực / cấp).
   Fixture phải cover từng filter, KHÔNG cover theo tổng count.

Acceptance fixture — FILTER-BASED, không count-based:
  ✅ Đúng: "≥3 record cho mỗi filter downstream (loại × state × LV × cấp)"
  ❌ Sai:  "6 variant chính + N edge" (tổng đủ nhưng filter có thể = 0)

Cho mỗi entity:
- Liệt kê filter downstream (loại × state × LV × cấp nếu multi-cấp)
- Fixture cover ≥1 record/cell + gắn field `cap`/`donVi` nếu multi-cấp
- Variant edge: BVA, reject path, soft-delete, cross-cấp visibility
- ≥3 chiều combinatorial → split sub-fixture

Format YAML, ID convention: {ENTITY}-{LOC}-{SEQ} hoặc {ENTITY}-{YYYYMMDD}-SEQ.
Output: input/data/seed-fixture.yaml v1.0 + ma trận filter coverage cuối file.
```

**Skill:** `bmad-testarch-test-design` · **Tool:** `Write`

**Output:** `seed-fixture.yaml`

---

## Step 2.2 — Viết Plan A→Z

**Prompt:**
```
Dùng template tasks/plan.md viết kế hoạch QA dự án [TÊN]:

§1 Mục tiêu G1-G9 (mỗi mục có ngưỡng định lượng)
§2 ⭐ Bảng ràng buộc dữ liệu A→B→C (copy từ entity-map.md)
§3 Quy trình 6 phase (P0 setup → P5 tổng kết)
§4 Hiện trạng (✅/⏳/🚫)
§5 Tài khoản test + fallback rule _01→_02→_03
§6 Tool primary + fallback + verification per task
§7 Quy trình log bug (SRS-ref bắt buộc + screenshot inline base64)
§8 Risk register 10 risk
§9 Cấu trúc output folder
§10 Quy ước viết report

Plan này là source of truth — todo.md sinh từ plan.md.
```

**Skill:** `agent-skills:plan` · **Tool:** `Write`

**Output:** `tasks/plan.md`

---

## Step 2.3 — Viết Todo execution-ready

**Prompt:**
```
Dựa plan.md, viết tasks/todo.md theo format:

| Cột | Nội dung |
|---|---|
| ID | T0.1 / T1.A1 / A1 / B1 / P3.1 / T4.1 |
| Icon | ✅ xong · 🟢 sẵn sàng · 🔵 đang làm · ⏳ chờ dep · ⚠️ partial · 🚫 block |
| TK | role cụ thể |
| Cần có sẵn | **STATE-explicit** — `[need: ≥N <entity> state <X> (verify <query>)]`. KHÔNG ghi task-id-only |
| Acceptance | **Per-filter query** — vd `?loaiX=A→≥1 ∧ ?loaiX=B→≥1 ∧ ?state=S1→≥1`. KHÔNG count tổng |
| State output | entity nào sang state nào sau khi task ✅ (cho downstream verify) |
| Pool | variant fixture cover filter |
| Output | file path đích |
| Kết quả | 1 dòng PASS/FAIL + bug ref + copy số đếm per-filter thực tế |

Trên đầu file: bảng "Tiến độ tổng" 7 cột (Phase | Window | Tổng | ✅ | 🟢 | 🔵 | ⚠️ | 🚫 | ⏳).
Cuối file: bảng "Module bị block" + "Bug đã đóng".
```

**Skill:** `agent-skills:plan` · **Tool:** `Write`

**Output:** `tasks/todo.md`

---

## Step 2.4 — Viết CLAUDE.md

**Prompt:**
```
Tạo CLAUDE.md ở root project chứa:
1. Quick reference: App URL + endpoints + path key files
2. Tool primary: Chrome DevTools MCP với 7 MCP-Rule
3. Tool fallback: gstack $B với 11 Rule (atomic chain / cleanup / OTP bypass / selector library / phân loại lỗi)
4. Account fallback rule: _01→_02→_03 cùng role+cấp
5. Bug log rule: SRS-ref bắt buộc + screenshot inline base64
6. Selector library 20+ entry verified
7. App-side quirks (drawer not modal, button label thực tế, etc.)

File này = source of truth cho mọi session sau.
```

**Skill:** `update-config` · **Tool:** `Write`

**Output:** `CLAUDE.md`

---

## Step 2.5 — Plan review chéo 4 góc nhìn

**Prompt:**
```
/autoplan
```

**Skill:** `autoplan` (chạy `plan-ceo-review` + `plan-eng-review` + `plan-design-review` + `plan-devex-review` tuần tự) · **Tool:** `Agent`

**Output:** issue list cần fix trước khi go P3

---

# PHASE 3 — SMOKE + SEED NỀN TẢNG (Tuần 1)

**Mục tiêu:** Verify N/N module render + tạo data Tầng 1+2.

## Step 3.1 — Smoke N module × 5 vai trò

**Prompt:**
```
/qa-only

Smoke test N module với 5 vai trò chính (admin / qtht_01 / cb_nv_tw_01 / cb_pd_tw_01 / cb_nv_dp_01).

Cho mỗi (module × role):
1. Login bằng MCP (template trong CLAUDE.md)
2. Click sidebar tới module
3. take_screenshot
4. take_snapshot → verify list/empty render
5. Ghi PASS/FAIL/RENDER-ONLY/PERMISSION-DENIED

Output bảng N×5 + screenshots vào output/qa-reports/round1-{ngày}/smoke-test/.
KHÔNG fix bug trong smoke. Chỉ report.
```

**Skill:** `qa-only` · **Tool:** `mcp__chrome-devtools__*` toàn bộ

**Output:** `smoke-test-report.md`

---

## Step 3.2 — Seed Block B (Tầng 1+2 master) song song

**⚠️ Quy tắc actor entity: BẮT BUỘC tách 3 sub-task** (entity nào có dropdown ở module khác đọc state cuối lifecycle):

| Sub-task | Mục đích | Acceptance |
|---|---|---|
| `<entity>-create` | Tạo entity profile | Per-filter coverage (loại/LV/**cấp**) |
| `<entity>-advance-state` | Đẩy sang state consumer cần (vd ACTIVE/APPROVED) | Verify query downstream filter trả ≥N |
| `<entity>-account-fk-link` | Tạo account login + link FK với entity | Login OK + role đúng + entity visible qua role |

**⚠️ Multi-cấp** (nếu scope-matrix.md có ≥2 cấp): seed ≥1 record/cấp/filter chính. Entity actor login: ≥1 account/cấp/role. Entity nội bộ cấp cao nhất: skip cấp khác.

**Prompt:**
```
Seed master data theo todo.md song song. Mỗi entity actor split 3 sub-task
(create / advance-state / account-fk-link) — KHÔNG gộp.

Theo fixture seed-fixture.yaml. Mỗi sub-task:
1. Đọc cột "Cần có sẵn" trong todo — verify dep state-explicit
2. Login + navigate
3. fill_form theo fixture (cover từng filter, không count tổng)
4. Verify per-filter query downstream → copy kết quả vào dòng "Kết quả"
5. Update todo: ⏳ → ✅ (chỉ khi tất cả filter ≥ngưỡng)
6. Nếu 1 filter thiếu → split sub-task ngay, KHÔNG đóng task gốc
7. Output seed-checklist-{module}.md có ma trận filter coverage
```

**Skill:** `agent-skills:incremental-implementation` · **Tool:** MCP `fill_form` + `click` + `wait_for` + `evaluate_script`

**Output:** N `seed-checklist-{module}.md` + `_seed-coverage-matrix.md`

---

## Step 3.3 — Pre-seed Block C (entry state Tầng 3)

**Prompt:**
```
Pre-seed entity entry state làm input cho Trụ A:
- T1.C1 Hỏi đáp entry MOI ≥6
- T1.C2 Vụ việc entry DA_TIEP_NHAN ≥6 (BE inject hoặc UI bypass 2 state đầu)
- T1.C3 TVCS entry TIEP_NHAN ≥6
- T1.C4 HSPL entry HIEU_LUC ≥6 trong DN-001

Pattern giống Block B (per-filter, không count). Output N seed-checklist + cập nhật todo.md.

Soft gate:
- C1a: Block B PASS → unblock workflow A độc lập
- C1b: Block C PASS → unblock workflow phụ thuộc state Tầng 3
```

---

## Step 3.4 — Pre-check seed prerequisites trước Phase 4 ⭐ GATE BẮT BUỘC

**Prompt:**
```
TRƯỚC khi go Phase 4, verify mọi entity sắp tiêu thụ đã đủ data per-filter.

Cho mỗi workflow task ở Phase 4:
1. Đọc cột "Cần có sẵn" — list dep state-explicit
2. Chạy verify query thật (curl GET /api hoặc evaluate_script count)
3. So sánh với ngưỡng trong todo
4. Đủ → flip ⏳ → 🟢 (sẵn sàng). Thiếu → giữ ⏳ + ghi rõ filter nào thiếu.

Output: _phase4-readiness-check.md với bảng:
| Workflow | Dep state | Verify query | Actual | Pass? |
KHÔNG go Phase 4 nếu >30% workflow chưa 🟢.
```

**Skill:** không cần · **Tool:** `Bash` curl + MCP `evaluate_script`

**Output:** `_phase4-readiness-check.md`

**Gate C1.5:** ≥70% workflow Phase 4 ở trạng thái 🟢 (state-verified, không phải task-icon-derived).

**Skill:** `agent-skills:test` · **Tool:** MCP toàn bộ

**Output:** 4 `seed-checklist-{module}.md`

---

# PHASE 4 — 5 TRỤ SONG SONG (Tuần 2) ⭐ TRỌNG TÂM

**Mindset:** Mỗi trụ = "tạo data + chạy flow + verify state cuối". Trụ độc lập → song song.

## Step 4.1 — Trụ A: TVV → PC → VV → HD → TVCS

**Prompt:**
```
/qa

Run Trụ A workflow theo plan.md:
- A1 Workflow TVV 5 bước → ≥6 TVV DANG_HOAT_DONG
- A2 QTHT thêm PC Đợt 2 ≥6 row
- A3 Workflow VV 8 bước → ≥6 VV HOAN_THANH
- A4 Workflow HD 6 bước → ≥6 HD DA_DUYET
- A5 Workflow TVCS 5 bước → ≥6 TVCS DA_DUYET

Tuân thủ thứ tự A1 → A2 → A3/A4/A5. Nếu A1 fail:
1. Capture diagnostic NGAY (screenshot + console + network)
2. Phân loại 8 loại lỗi
3. Log bug có SRS-ref + screenshot inline base64
4. Switch sang Trụ B+C song song, KHÔNG retry quá 1 lần

Cuối Trụ A: gộp 5 workflow report → _pillar-A-result.md.
```

**Skill:** `qa` (test+fix iterative) · **Tool:** MCP toàn bộ + `evaluate_script`

**Output:** 5 `workflow-test-report-{module}.md` + `_pillar-A-result.md`

---

## Step 4.2 — Trụ B: Đào tạo (song song A)

**Prompt:**
```
/qa

Run Trụ B Đào tạo song song với Trụ A:
- B1 4 CTĐT DU_THAO
- B2 push CTĐT → DA_DUYET
- B3 6 KH gắn CTĐT DA_DUYET
- B4 6 BG KICH_HOAT (song song B1-B3)
- B5 NHCH ≥10 NHAP + ĐKT 5 variant
- B5b publish 5 NHCH → CONG_KHAI + re-run ĐKT NGAU_NHIEN
- B6 6 GV DANG_HOAT_DONG (song song B1-B5)
- B7 Workflow KH 10 bước → 6 KH HOAN_THANH

Apply MCP-Rule 4 (sidebar expand) + workaround JWT revoke nếu gặp.
Output _pillar-B-result.md.
```

**Skill:** `qa` · **Tool:** MCP + `list_console_messages`

**Output:** `_pillar-B-result.md`

---

## Step 4.3 — Trụ C: Biểu mẫu (30 phút, song song)

**Prompt:**
```
/qa

C1: Workflow Biểu mẫu NHAP → CONG_KHAI → AN. ≥1 BM CONG_KHAI.
Verify GET /api/v1/bieu-mau?la_cong_khai=1 chỉ trả BM CONG_KHAI.

Output _pillar-C-result.md.
```

**Skill:** `qa` · **Tool:** MCP + `Bash` curl

**Output:** `_pillar-C-result.md`

---

## Step 4.4 — Trụ D: Đánh giá HQ + Kho QA (sau A xong)

**Prompt:**
```
/qa

Run Trụ D sau khi Trụ A xong:
- D1 1 kỳ ĐG + tiêu chí Σ=100% (depend ≥6 VV HOAN_THANH từ A3)
- D2 Workflow ĐG HQ 7 bước → kỳ HOAN_THANH + báo cáo TT17 auto
- D3 6 QA THU_CONG + verify auto-feed TU_DONG ≥3 từ HD DA_DUYET (A4)

Lưu ý double-state ĐG HQ: UI hiện LAP_KE_HOACH, DB lưu NHAP — assert cả 2.
Output _pillar-D-result.md.
```

**Skill:** `qa` · **Tool:** MCP + `evaluate_script`

**Output:** `_pillar-D-result.md`

---

## Step 4.5 — Trụ E: Daily monitor module ngoại

**Prompt:**
```
/loop 1d

Daily monitor 4 module phụ thuộc tích hợp ngoài:
- E1 HĐ TV: curl GET /api/v1/hop-dong-tu-vans + verify sidebar
- E2 CT HTPLDN GĐ1: MCP click thử nút Tạo CT
- E3 Chi trả: verify list count
- E4 Phiên TV nhanh: verify list

Mỗi sáng ghi 1 dòng vào _pillar-E-status.md.
Hết tuần T3 module nào chưa unblock → cascade-block downstream, dời round sau.
```

**Skill:** `loop` · **Tool:** `Bash` curl + MCP

**Output:** `_pillar-E-status.md`

**Gate C2:** 4 file `_pillar-{A,B,C,D}` + `_pillar-E-status.md`. Multi-cấp scope test gộp vào Step 6.1 functional + Round Permission, không tách trụ riêng (tránh lặp).

---

# PHASE 5 — ĐẦU RA TẦNG 4-5 (Tuần 3)

## Step 5.1 — Workflow Chi trả + TV nhanh + CT HTPLDN

**Prompt:**
```
/qa

Run P3.1 → P3.4 sau khi Trụ E unblock:
- P3.1 Chi trả 7 state (BR-CALC-01: SiêuNhỏ 100% / Nhỏ 30% / Vừa 10% + over-cap + annual reset + immutability)
- P3.2 TV nhanh 5 state (auto HET_HAN 30 ngày + full-text BR-DATA-08)
- P3.3 CT HTPLDN GĐ1 5 state (TW/BN/ĐP)
- P3.4 CT HTPLDN GĐ2 Đợt BC (auto-transition kép + BR-FLOW-08)

Mỗi workflow: happy + edge + verify công thức tính bằng evaluate_script. 
Output 4 workflow-test-report-{module}.md.
```

**Skill:** `qa` + `agent-skills:test` · **Tool:** MCP + `evaluate_script`

**Output:** 4 `workflow-test-report-{module}.md`

**Gate C3:** 4 workflow report

---

# PHASE 6 — FUNCTIONAL N MODULE (Tuần 4)

## Step 6.1 — Sinh TC negative + edge

**Prompt:**
```
/bmad-testarch-test-design

Sinh TC functional cho N module, KHÔNG happy path (đã cover P3-P5):
- TC negative (lỗi UI + validation + permission deny)
- TC nhánh phụ (alternative flow)
- TC edge (boundary + concurrent + soft-delete + pagination)
- 40 TC phân quyền/module (positive + negative + URL direct)
- **TC scope cấp** (nếu multi-cấp): filter cấp đúng, API cross-cấp → 403, aggregation cấp cao tổng hợp đúng

~30-40 TC/module. Output mỗi module 1 file output/funtion/{module}.md.
```

**Skill:** `bmad-testarch-test-design` · **Tool:** `Agent`

**Output:** N file `output/funtion/{module}.md`

---

## Step 6.2 — Run functional theo daily schedule

**Prompt:**
```
/qa

Run functional theo daily schedule (todo.md T4.1 → T4.17):
- Ngày 1: HD + CG/TVV + VV
- Ngày 2: DN + TVCS + KH
- Ngày 3: Dashboard + QTHT + ĐG HQ
- Ngày 4: BM + TV nhanh + Chi trả
- Ngày 5: BC + HĐ TV + CT HTPLDN + API + Edge BR-EC

Mỗi module: P0 100% + P1 ≥90% + 0 Blocker.
Output functional-test-report-{module}.md + bug-report-{module}.md.
```

**Skill:** `qa` · **Tool:** MCP toàn bộ

**Output:** N functional-test-report + bug-report

---

## Step 6.3 — Edge case sâu (security + performance)

**Prompt:**
```
/cso

Edge case T4.17 BR-EC-01..23:
- Optimistic lock (concurrent edit 2 tab)
- CSRF basic
- Session limit + timeout
- Pagination guard (≥21 record)
- XSS basic (inject vào textarea + URL)

Output edge-report.md + nonfunc-report.md.
```

**Skill:** `cso` + `agent-skills:security-and-hardening` · **Tool:** MCP `evaluate_script` (inject payload) + `Bash` curl concurrent

**Output:** `edge-report.md` + `nonfunc-report.md`

**Gate C4:** N functional report + edge report

---

# PHASE 7 — TỔNG KẾT (Tuần 5)

## Step 7.1 — TC chi tiết field-level 6 module ưu tiên

**Prompt:**
```
/bmad-testarch-test-design

TC chi tiết BVA/EP/XSS cho 6 module ưu tiên:
- BVA: boundary từng field
- EP: equivalence partitioning
- XSS: payload list 10 mẫu

≥30 TC/module. Output tc-{module}-chitiet.md.
```

**Skill:** `bmad-testarch-test-design` + `agent-skills:test-driven-development`

**Output:** 6 `tc-{module}-chitiet.md`

---

## Step 7.2 — UI design review N module

**Prompt:**
```
/design-review

Compare UI N module với prototype [URL prototype]:
- Spacing/hierarchy/typography
- Visual inconsistency cross-module
- AI slop pattern (lorem ipsum / placeholder leak)
- Slow interaction

Output N design-review-report-{module}.md.
```

**Skill:** `design-review` · **Tool:** MCP `take_screenshot` side-by-side

**Output:** N `design-review-report-{module}.md`

---

## Step 7.3 — Regression bug round trước

**Prompt:**
```
/qa

Re-test tất cả Major/Critical bug từ round trước. Kỳ vọng ≥80% closed-verified.
Output regression-roundN-report.md.
```

**Skill:** `qa` · **Tool:** MCP

**Output:** `regression-roundN-report.md`

---

## Step 7.4 — Cross-module 6 luồng chéo

**Prompt:**
```
/qa

Test 6 luồng chéo:
1. DN ↔ VV (xóa DN khi có VV active → behavior?)
2. TVV ↔ VV (deactivate TVV đang xử lý VV → behavior?)
3. HD ↔ Phê duyệt cross-cấp
4. HD → KhoQA auto-feed nguồn TU_DONG
5. DN ↔ VV ↔ HSPL (cascade verify)
6. VV ↔ Chi trả (Chi trả chỉ tạo từ VV HOAN_THANH)

Output cross-module-report.md.
```

**Skill:** `qa` · **Tool:** MCP cross-record

**Output:** `cross-module-report.md`

---

## Step 7.5 — Phi chức năng

**Prompt:**
```
/benchmark

Đo:
- Page load <3s/module (N trang chính)
- Auto-refresh dashboard 60s
- XSS basic 10 payload
- CSRF basic
- Session timeout

Output nonfunc-report.md với baseline.
```

**Skill:** `benchmark` + `agent-skills:performance-optimization` · **Tool:** `mcp__chrome-devtools__performance_*`

**Output:** `nonfunc-report.md`

---

## Step 7.6 — Tổng kết round

**Prompt:**
```
/retro

Tổng kết Round N:
- Pass rate G1-G9 (% PASS từng tiêu chí)
- Bug by severity (Blocker/Critical/Major/Minor/Trivial)
- Closed-verified vs Open
- Cascade-block registry
- Recommendation: GO / NO-GO release / fix lại / dời round

Output test-summary-roundN.md (file đỉnh, cho stakeholder đọc).
```

**Skill:** `retro` + `bmad-retrospective` · **Tool:** `Write`

**Output:** `test-summary-roundN.md` ⭐ FINAL

**Gate C5:** user duyệt → kết thúc round → kick off Round Permission

---

# ROUND PERMISSION (sau C5 PASS, +1.5 tuần)

## Step P.1 — Generate permission matrix TC

**Prompt:**
```
/bmad-testarch-test-design

Generate permission TC: 11 vai trò × N module × CRUD = ~528 TC core + DI-01..09 deep test data isolation.
Format matrix table + URL direct test cases.
Output plan-round-permission.md + todo-permission.md.
```

**Skill:** `bmad-testarch-test-design` · **Tool:** `Agent`

**Output:** `plan-round-permission.md` + `todo-permission.md`

---

## Step P.2 — Run permission test

**Prompt:**
```
/qa-only

Run permission test theo todo-permission.md:
- Mỗi role: login → click button → verify visible/hidden
- URL direct: navigate /quan-tri/danh-muc với role không phép → verify 403 hoặc kick /login
- API direct: curl với JWT của role khác → verify 403/422

Capture button visibility bằng evaluate_script.
Output permission-test-report.md.
```

**Skill:** `qa-only` · **Tool:** MCP `evaluate_script` + `list_network_requests` + `Bash` curl

**Output:** `permission-test-report.md`

---

# 🔁 EXECUTION LOOP — 8 BƯỚC LẶP CHO MỖI TASK

| Bước | Hành động | Skill | Tool |
|---|---|---|---|
| 1 | Verify dep — chạy query thật, KHÔNG suy từ icon ✅ upstream | — | `Bash` curl + MCP `evaluate_script` count |
| 2 | Pre-flight (env up + account login fallback) | — | `Bash` curl + `mcp__chrome-devtools__new_page` |
| 3 | Execute (tool primary + capture diagnostic) | `qa` hoặc `agent-skills:test` | MCP toàn bộ |
| **3b** | **Self-seed nếu fail vì thiếu data** — tự walk workflow / POST API / tạo file dummy / tạo account → retry. **CẤM mark PARTIAL "thiếu data"** | `agent-skills:incremental-implementation` | MCP `fill_form` / `Bash` curl POST |
| 4 | Phân loại fail (loại trừ 3b) | `investigate` + `agent-skills:debugging-and-error-recovery` | MCP diagnostic + `Bash` grep |
| 5 | Log bug có spec-ref + screenshot inline base64 | `agent-skills:test` | `Write` template + `Bash` base64 |
| 6 | Update todo — flip icon + ghi state output thực tế (entity nào sang state nào, count per-filter) | — | `Edit` todo.md |
| 7 | Save memory nếu pattern mới (chỉ khi user yêu cầu) | — | `Write` memory file |

**Trust state, not task icon.** Bước 1 phải verify query thật. Task ID upstream ✅ không có nghĩa state cần thiết đã có.

**Auto re-evaluate ⚠️/🚫:** mỗi session + mỗi task ✅ PASS → scan task `⚠️/🚫` → nếu dep state đã đủ thì trigger active, tự chạy lại không hỏi user.

---

# 🛡️ CHECKPOINT GIỮA PHASE (mỗi cuối phase chạy 1 lần)

```bash
/checkpoint    # Lưu state + git commit
/health        # Code health score
/learn         # Track learnings cross-session
```

---

# 📚 CHEAT SHEET — PROMPT NGẮN GỌN THEO LOẠI TASK

| Loại task | Prompt mở | Skill |
|---|---|---|
| Hiểu hệ thống mới | `Spawn 4 agent Explore song song đọc SRS folder...` | Explore |
| Verify SRS | `Query NotebookLM 5 câu để verify hiểu của tôi` | notebooklm-mcp |
| Vẽ luồng E2E | `Vẽ 3 luồng E2E bằng Mermaid state diagram` | bmad-create-architecture |
| Map dependency | `Tạo bảng ràng buộc A→B→C, ít nhất 15 ràng buộc cứng` | bmad-create-architecture |
| Plan A→Z | `Dùng template plan.md viết kế hoạch QA dự án...` | agent-skills:plan |
| Sinh TC | `Sinh TC negative + edge + permission cho module X` | bmad-testarch-test-design |
| Smoke | `/qa-only smoke N module × 5 vai trò` | qa-only |
| Seed master | `Seed task T1.B1 → T1.B4 song song theo fixture` | agent-skills:incremental-implementation |
| Workflow | `/qa run Trụ A workflow theo plan.md` | qa |
| Debug fail | `/investigate phân loại 8 loại lỗi` | investigate |
| UI review | `/design-review compare N module với prototype` | design-review |
| Performance | `/benchmark đo page load + XSS + CSRF` | benchmark |
| Security | `/cso edge case BR-EC-01..23` | cso |
| Tổng kết | `/retro tổng kết Round N` | retro |
| Daily monitor | `/loop 1d daily monitor 4 module ngoại` | loop |
| Save state | `/checkpoint lưu state cuối phase` | checkpoint |

---

# 🎯 NGUYÊN TẮC ÁP DỤNG CHO DỰ ÁN MỚI

1. **KHÔNG bỏ Phase 1 Discovery** — đầu tư hiểu sản phẩm trước, không phải gõ test case ngay
2. **Bảng ràng buộc A→B→C là TRÁI TIM** — STATE-explicit, không task-id-only
3. **Seed acceptance theo FILTER, không theo COUNT** — tổng đủ ≠ filter đủ
4. **Actor entity tách 3 sub-task** (create / advance-state / account-fk-link) — không gộp
5. **Pre-check Step 3.4 trước Phase 4** — verify query thật, không suy từ icon ✅
6. **Self-seed khi block do thiếu data** — tự seed walk workflow / POST API, cấm mark PARTIAL
6b. **Multi-cấp**: nếu ≥2 cấp, seed ≥1 record/cấp + scope test gộp vào functional/permission. Không seed cấp cao nhất only.
7. **Trust state, not task icon** — Bước 1 execution loop chạy verify query thật
8. **Tách Seed/Workflow/Functional** — không trộn
9. **Soft gate 2 mức** thay gate cứng — unblock module độc lập song song
10. **Bug bắt buộc spec ref** — không có ref → Observations
11. **Verify bug 2 nguồn** (semantic search + grep local exact)
12. **Phản biện 2 chiều** — sycophancy với user và dev đều là failure mode
13. **Memory > Documentation** — feedback rule lưu persistent
14. **Phân loại lỗi trước retry** — retry mù = đốt thời gian
15. **Embed screenshot inline base64** cho bug Open
16. **Auto re-evaluate ⚠️/🚫** mỗi khi dep unblock
17. **Tool primary + fallback** ngay từ Phase 0
18. **Account fallback `_01→_02→_03`** trong cùng role+cấp
19. **Daily monitor module ngoại** không gate, có cascade registry
20. **/autoplan** review chéo 4 góc nhìn (CEO/Eng/Design/DX) trước khi go P3

---

# 📦 DELIVERABLES (Final state khi kết thúc)

```
tasks/
├── plan.md (v2.x — source of truth)
├── todo.md (execution checklist sync với plan)
├── system-overview.md (kiến thức hệ thống)
└── plan-round-permission.md

input/
├── srs/ (file SRS)
├── data/
│   ├── seed-fixture.yaml (6+N variant/entity)
│   └── entity-map.md (dependency graph)
├── quy-trinh-nghiep-vu/
│   ├── 01-tong-quan-nghiep-vu.md (3 luồng E2E)
│   └── 02-thu-tu-module.md (5 tầng module)
├── flow-module.md (SM + Hub Tier + Phụ lục)
├── users.csv (TK test + fallback _01/_02/_03)
└── prototype.md

output/qa-reports/round{N}-{ngày}/
├── _prep-log.md
├── _checkpoint-P{1..5}.md
├── _pillar-{A..E}-result.md
├── smoke-test/
├── seed/ (8 seed-checklist)
├── workflow/ (10 workflow-test-report)
├── functional/ (N module)
├── chi-tiet/ (6 module ưu tiên)
├── design-review/ (N module)
├── regression/
├── bug-reports/
├── edge-report.md
├── nonfunc-report.md
└── test-summary-round{N}.md ⭐ FINAL
```

---

**Tóm 1 dòng:** `Phase 0 Env → Phase 1 Discovery → Phase 2 Plan/Todo/CLAUDE.md → Phase 3 Smoke+Seed (3 sub-task/actor + Step 3.4 pre-check) → Phase 4 Workflow song song → Phase 5 Đầu ra → Phase 6 Functional → Phase 7 Tổng kết → Round Permission`. Mỗi step có **prompt copy-paste-được**, **skill cụ thể**, **tool cụ thể**, **output file cụ thể**. Áp dụng cho mọi dự án enterprise CMS có ≥10 module + state machine + multi-role permission.

**4 anti-pattern khiến seed task lặp** (đã fix trong template này):
1. Acceptance fixture count-based (tổng đủ nhưng filter trống) → Step 2.1 + Step 3.2 đã đổi sang **filter-based**
2. Gộp create/advance-state/account-link vào 1 task → Step 3.2 đã **split 3 sub-task**
3. Dep chain task-id-only, suy state từ icon ✅ → Step 1.5 + Step 2.3 + Loop Bước 1 đã yêu cầu **state-explicit + verify query thật**
4. Seed chỉ cấp cao nhất, bỏ qua cấp dưới → Step 1.7 + 2.1 + 3.2 yêu cầu **≥1 record/cấp + scope test gộp functional**
