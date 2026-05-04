# Final Verdict QA — BUG-FLOW-TVV-002 (3-way deep review)

**Reviewer:** QA (Claude Code via Chrome DevTools MCP + NotebookLM `HTPLDN` + grep SRS local).
**Ngày:** 2026-04-27 ~20:30.
**3 file đối chiếu:**
- QA bug log: [`bug-report-flow-TVV.md` BUG-FLOW-TVV-002](../../qa-reports/round5-2026-04-26/bug-reports/bug-report-flow-TVV.md)
- BA response: [`bug-002-response-sm02-scope.md`](./bug-002-response-sm02-scope.md)
- Dev response: [`bug-002-verification-vs-srs.md`](../../dev-report/bug-002-verification-vs-srs.md)

---

## ⬛ KẾT LUẬN (đọc trước)

> **BUG-FLOW-TVV-002 LÀ BUG THẬT — nhưng đúng theo cách dev nói, không phải cách BA nói.** SRS có 2 layer mâu thuẫn nhau (descriptive vs operational). Dev đã follow operational layer (FR-IV-06 + SCR-IV-03 — spec dev phải implement). BA quote descriptive layer (Phụ lục C.3 + §3.2.0.7.5 SM-02) + bịa 2 evidence để củng cố verdict. Bug thật duy nhất là thiếu 2 audit fields `ngay_tiep_nhan` / `nguoi_tiep_nhan` (Medium) — fix gọn 1 commit, KHÔNG cần button "Tiếp nhận" hay endpoint mới.

| Hạng mục | QA log | BA verdict | Dev verdict | **QA final** |
|----------|:------:|:----------:|:-----------:|:------------:|
| Severity | Major | Major (giữ) | Medium (downgrade) | ⚠️ **Medium** (đồng ý dev) |
| BUG có thật không? | có | có | có (audit gap) | ✅ có |
| Workflow break? | có | có | không | ❌ KHÔNG break (operational layer cho phép skip) |
| Cần button "Tiếp nhận hồ sơ" mới | có | có | không | ❌ KHÔNG cần |
| FR-IV-13 tồn tại | n/a | có | không | ❌ KHÔNG tồn tại |
| `ngay_tiep_nhan` / `nguoi_tiep_nhan` bắt buộc | n/a | có | có | ✅ CÓ — bug thật |
| Cần BA confirm | có | không | có (CR clarify SRS) | ✅ **CÓ** — escalate resolve SRS contradiction |

**1 dòng:** Bug log của QA có SRS ref yếu (sai FR-IV-01 → đúng phải FR-IV-06). BA bịa 2 evidence + verdict workflow break sai. Dev đúng verdict + đúng cơ chế nhưng underestimate cần BA resolve SRS contradiction. Final: **Medium audit gap + escalate BA**.

---

## 1. Bug log QA — SRS ref bị weak/sai

User hỏi đúng: bug log không thấy SRS ref đầy đủ. QA tự kiểm tra:

**File:** [`bug-report-flow-TVV.md` line 35 + 102](../../qa-reports/round5-2026-04-26/bug-reports/bug-report-flow-TVV.md):
```
SRS ref: flow-module.md §2 dòng 52 (CB NV nhấn [Tiếp nhận])
       + srs-fr-04-chuyen-gia-tvv.md FR-IV-01 §Processing Bước 2
```

**Verify:**

| Ref BA dùng | Status |
|-------------|:------:|
| `flow-module.md` | ⚠️ Đây là spec QA-internal trong `input/flow-module.md`, KHÔNG phải SRS chính. Dùng làm phụ trợ OK nhưng không thay thế SRS authoritative |
| `FR-IV-01 §Processing Bước 2` | ❌ **SAI** — FR-IV-01 = "Quản lý tư vấn viên (UC39)" CRUD entity, không phải Thẩm định. Đúng ra phải là **FR-IV-06** (UC44 Thẩm định hồ sơ TVV) |
| Phụ lục C.3 SM-TVV transition table | ❌ Bug log KHÔNG cite — đây mới là evidence chính cho descriptive layer |
| §3.2.0.7.5 SM-02 (gộp 1 cặp) | ❌ Bug log KHÔNG cite — đây là evidence direct nhất |

→ **Bug log QA cần fix SRS ref** trước khi tranh luận với BA/dev. Cite đúng phải là:
- Phụ lục C.3 SM-TVV transition table (line 4229-4230 srs-v3.md)
- §3.2.0.7.5 SM-02 (line 748 srs-v3.md)
- Mâu thuẫn với FR-IV-06 Preconditions + Processing Bước 1 + SCR-IV-03 Quy tắc tương tác (operational layer)

---

## 2. SRS thực tế — phát hiện 2 LAYER MÂU THUẪN

NotebookLM xác nhận sau khi quote nguyên văn 3 sources: *"Chính xác là SRS đang tồn tại 2 layer mâu thuẫn nhau."*

### Layer A — Descriptive (state machine spec)

| Source | Quote nguyên văn | Hệ quả |
|--------|------------------|--------|
| `srs-v3.md:748` §3.2.0.7.5 SM-02 | "SM-02 \| SM-TVV \| `CHO_THAM_DINH` → `DANG_THAM_DINH` \| Gộp thành **`DANG_THAM_DINH`**" | Chỉ gộp 1 pair. Không gộp `MOI_DANG_KY → CHO_THAM_DINH` |
| `srs-v3.md:4229` Phụ lục C.3 transition table | "MOI_DANG_KY \| CHO_THAM_DINH \| CB NV tiếp nhận \| Hồ sơ đủ giấy tờ \| — \| FR-IV-06 \| —" | Transition manual, FR-IV-06, Action "—", BR Ref "—" |

→ **Theo layer này:** workflow phải qua 5 state (sau gộp còn 4-state vẫn còn manual `MOI_DANG_KY → CHO_THAM_DINH`). BA đúng ở đây.

### Layer B — Operational (FR + SCR — spec dev phải implement)

| Source | Quote nguyên văn | Hệ quả |
|--------|------------------|--------|
| `srs-fr-04:421` FR-IV-06 Preconditions | "TVV ở trạng thái **MOI_DANG_KY hoặc DANG_THAM_DINH**." | Cho phép TVV vào form thẩm định trực tiếp khi còn MOI_DANG_KY |
| `srs-fr-04:438` FR-IV-06 Processing Bước 1 | "Chuyển trạng thái TVV sang **DANG_THAM_DINH (nếu chưa)** \| SM-TVV" | Auto-transition trong service operation, skip CHO_THAM_DINH |
| `srs-fr-04:921` SCR-IV-03 Quy tắc tương tác | "Tham dinh: **MOI_DANG_KY → DANG_THAM_DINH (lan dau)**" | EXPLICIT skip CHO_THAM_DINH lần đầu |
| `srs-fr-04:892-899` SCR-IV-03 header buttons | 8 rows, không có nút "Tiếp nhận hồ sơ" | UI không thiết kế thao tác Tiếp nhận thủ công |

→ **Theo layer này:** workflow cho phép `MOI_DANG_KY → DANG_THAM_DINH` lần đầu (skip cả CHO_THAM_DINH). Dev đúng ở đây.

### Mâu thuẫn cốt lõi

| Câu hỏi | Layer A (descriptive) | Layer B (operational) |
|---------|:--------------------:|:--------------------:|
| Có cần thao tác "Tiếp nhận" thủ công? | CÓ | KHÔNG |
| State `CHO_THAM_DINH` có achievable lần đầu? | CÓ | KHÔNG |
| FR ref cho transition `MOI_DANG_KY → CHO_THAM_DINH` | FR-IV-06 | n/a (skip transition này) |
| Action ghi `ngay_tiep_nhan` | "—" (không ghi) | n/a |

**Đây là SRS internal contradiction REAL** — cả 2 layer đều có evidence trong cùng SRS bộ. Cần BA chính thức decide.

---

## 3. Đánh giá 3 bên

### 3.1. QA bug log (BUG-FLOW-TVV-002)

| Điểm | Đánh giá |
|------|----------|
| Phát hiện gap UI thật | ✅ Đúng — SCR-IV-03 không có nút "Tiếp nhận" trong khi state machine spec yêu cầu manual |
| SRS ref | ❌ Sai 1 ref (FR-IV-01 thay vì FR-IV-06) + thiếu cite Phụ lục C.3 + §3.2.0.7.5 |
| Severity Major | ⚠️ Đặt theo descriptive layer, chưa cân nhắc operational layer |
| Verdict PARTIAL pending BA confirm | ✅ Đúng định hướng — escalate BA |

### 3.2. BA response

| Điểm | Đánh giá |
|------|----------|
| Verdict CORE "SM-02 chỉ gộp 1 cặp" | ✅ Đúng theo descriptive layer |
| Quote §3.2.0.7.5 + §3.2.0.7.1 + Common Approval Fields header | ✅ Quote đúng nguyên văn |
| BC 3 quote Phụ lục C.3 transition table | ❌ **BỊA** — Action thực tế "—", FR-IV-06 (không phải FR-IV-13), BR Ref "—" (không phải BR-AUTH-08) |
| BC 4 quote SCR-IV-03 row 5 nút "Tiếp nhận hồ sơ" | ❌ **BỊA** — row 5 thực tế = "Nut Cap nhat TT"; không có nút Tiếp nhận trong SCR-IV-03; FR-IV-13 không tồn tại |
| Lập luận guard BR-AUTH-08 cho click Tiếp nhận | ❌ Mis-apply — BR-AUTH-08 là rule phân quyền data scope theo `don_vi_id`, không phải guard click |
| Verdict "không cần BA confirm" | ❌ **SAI** — bỏ qua hoàn toàn operational layer (FR-IV-06 + SCR-IV-03) |
| Severity giữ Major | ⚠️ Cơ sở 4 hệ quả Major có 3/4 dựa trên BC bịa |
| Line numbers cite | ❌ Lệch 60-280 dòng so với file thật (BA có thể đọc bản SRS khác hoặc fabricate) |

### 3.3. Dev response

| Điểm | Đánh giá |
|------|----------|
| Phát hiện BA fabrication | ✅ Đúng — verify được FR-IV-13 không tồn tại + row 5 thực tế khác |
| Quote FR-IV-06 Preconditions + Processing Bước 1 + SCR-IV-03 Quy tắc tương tác | ✅ Verify đúng nguyên văn (NotebookLM cross-check confirm) |
| Verdict "Dev đúng theo FR-IV-06 + SCR-IV-03" | ✅ Đúng theo operational layer |
| Bug thật duy nhất = thiếu `ngay_tiep_nhan`/`nguoi_tiep_nhan` | ✅ Đúng — vi phạm §3.2.0.8 Common Approval Fields header rule |
| Severity Medium | ✅ Hợp lý — chỉ thiếu audit fields, workflow không break |
| Verdict "không cần button Tiếp nhận hồ sơ" | ✅ Đúng theo SCR-IV-03 (UI spec authoritative) |
| Verdict "không cần endpoint `/tiep-nhan`" | ✅ Đúng — auto-fill trong `thamDinh()` service đủ |
| Hiểu rõ SRS có 2 layer | ⚠️ Có nhận thức ("SRS có 1 nhập nhằng") + đề xuất CR clarify §6.5 — đúng định hướng |
| Yêu cầu BA chứng minh nguồn fabrication | ✅ Đúng quy trình review BA |
| Khuyến nghị BA hỏi có nhầm module khác không (Hỏi đáp/Vụ việc có UC Tiếp nhận) | ✅ Insight tốt — BA có thể đã copy-paste từ pattern module khác |

---

## 4. Verdict QA cuối cho BUG-FLOW-TVV-002

### 4.1. Bug có thật không? **CÓ — nhưng severity Medium, scope khác cả 3 bên ban đầu mô tả**

Bug thật: thiếu 2 cột audit `ngay_tiep_nhan` + `nguoi_tiep_nhan` trong entity `TU_VAN_VIEN` + service `thamDinh()` không auto-fill 2 field này khi auto-transition `MOI_DANG_KY → DANG_THAM_DINH` lần đầu. Vi phạm §3.2.0.8 Common Approval Fields header rule (mặc dù bảng "Áp dụng từng nhóm" không liệt kê 2 field cho TVV — đây là SRS ambiguity thứ 3 cần BA resolve).

### 4.2. Severity: **Medium** (đồng ý dev)

- Workflow KHÔNG break (operational layer FR-IV-06 + SCR-IV-03 cho phép skip CHO_THAM_DINH lần đầu).
- Bug ảnh hưởng audit trail + compliance (`ngay_tiep_nhan`/`nguoi_tiep_nhan` null) chứ không block task A1 acceptance.
- KHÔNG cần button "Tiếp nhận hồ sơ" hay endpoint riêng.

### 4.3. SRS escalate BA — 3 câu hỏi BẮT BUỘC

1. **Layer authoritative cho SM-TVV transition `MOI_DANG_KY → CHO_THAM_DINH`:** descriptive (Phụ lục C.3 + §3.2.0.7.5) hay operational (FR-IV-06 + SCR-IV-03)?
2. **Action column transition `MOI_DANG_KY → CHO_THAM_DINH`** trong Phụ lục C.3 = "—". Có cần update để ghi `ngay_tiep_nhan`/`nguoi_tiep_nhan` không?
3. **Bảng "Áp dụng cho từng nhóm" §3.2.0.8 cho IV. CG/TVV** chỉ liệt kê 6 field, không có `ngay_tiep_nhan`/`nguoi_tiep_nhan`. Header rule "áp cho mọi entity có quy trình phê duyệt" override hay bảng từng nhóm override?

### 4.4. Hành động fix (theo dev recommend, đã verified)

| # | Hành động | SRS ref | Vị trí code (theo dev report) |
|---|-----------|---------|-------------------------------|
| 1 | Migration: thêm 2 cột `ngay_tiep_nhan` (datetime, nullable) + `nguoi_tiep_nhan` (FK→TAI_KHOAN, nullable) vào `tu_van_vien` | §3.2.0.8 | Migration mới |
| 2 | Entity: thêm 2 field tương ứng | §3.2.0.8 | `entities/tu-van-vien.entity.ts` |
| 3 | Service: trong `thamDinh()`, khi auto-transition `MOI_DANG_KY → DANG_THAM_DINH` lần đầu, auto-fill `tvv.ngayTiepNhan = NOW()` + `tvv.nguoiTiepNhan = currentUser.id` | §3.2.0.8 + FR-IV-06 Processing Bước 1 | `tu-van-vien.service.ts:803-806` |
| 4 | (Optional) Gửi notification NHT khi state chuyển sang DANG_THAM_DINH lần đầu — UX cải thiện, không bắt buộc | Spec không bắt buộc | `tu-van-vien.service.ts` |
| 5 | **CR đề xuất gửi BA:** Resolve 3 ambiguities trên (§4.3) — clarify SRS một trong 2 hướng (a) update Phụ lục C.3 align operational layer, hoặc (b) update FR-IV-06 + SCR-IV-03 align descriptive layer | §3.2.0.7.5 + Phụ lục C.3 + FR-IV-06 + SCR-IV-03 | Spec change |

### 4.5. Update QA bug log (action item ngay)

QA cần update [`bug-report-flow-TVV.md` BUG-002](../../qa-reports/round5-2026-04-26/bug-reports/bug-report-flow-TVV.md):
- Sửa SRS ref: `FR-IV-01 §Processing Bước 2` → `FR-IV-06 Preconditions + Processing Bước 1 + Phụ lục C.3 transition table + §3.2.0.7.5 SM-02 + SCR-IV-03 Quy tắc tương tác`.
- Sửa severity: Major → **Medium**.
- Sửa scope: từ "UI bỏ qua Bước 2 [Tiếp nhận]" → "thiếu 2 audit fields `ngay_tiep_nhan`/`nguoi_tiep_nhan` per §3.2.0.8 + SRS có 2 layer mâu thuẫn cần BA resolve".
- Verdict status: PARTIAL pending BA confirm 3 ambiguities (giữ).

---

## 5. So sánh 3 bên — bảng tổng kết

| # | Câu hỏi | QA log | BA | Dev | **QA final** |
|:-:|---------|:------:|:--:|:---:|:------:|
| 1 | SM-02 chỉ gộp 1 pair? | ✓ | ✓ | ⚠️ phớt lờ | ✓ (descriptive) |
| 2 | Operational layer cho phép skip CHO_THAM_DINH? | ❌ bỏ sót | ❌ phớt lờ | ✓ | ✓ |
| 3 | FR-IV-13 tồn tại? | n/a | ❌ bịa | ✓ không tồn tại | ✓ không tồn tại |
| 4 | Nút "Tiếp nhận hồ sơ" trong SCR-IV-03? | ✓ phát hiện thiếu | ❌ bịa row 5 | ✓ không có (đúng theo spec) | ✓ không có |
| 5 | Cần button mới? | ✓ recommend | ✓ recommend | ✗ | ✗ |
| 6 | Cần endpoint mới? | n/a | ✓ recommend | ✗ | ✗ |
| 7 | Cần audit fields? | n/a | ✓ recommend (đúng) | ✓ recommend (đúng) | ✓ |
| 8 | Severity | Major | Major | Medium | **Medium** |
| 9 | SRS có ambiguity? | ngầm hiểu | ❌ phủ nhận | ✓ ghi nhận | ✓ |
| 10 | Cần BA confirm? | ✓ | ❌ | ⚠️ qua CR | ✓ qua 3 câu hỏi cụ thể |

**Score:**
- QA log: 4/10 đúng — phát hiện gap nhưng SRS ref weak + bỏ sót operational layer.
- BA: 3/10 đúng — bịa 2 evidence + bỏ qua operational layer + verdict "không cần BA" sai.
- **Dev: 9/10 đúng** — verify chính xác BA fabrication + đúng cơ chế operational + bug thật + severity Medium hợp lý.

---

## 6. Khuyến nghị

| # | Hành động | Người làm | Deadline |
|---|-----------|-----------|----------|
| 1 | QA update bug log BUG-002 (SRS ref + severity + scope) | QA | ngay |
| 2 | BA refactor file `bug-002-response-sm02-scope.md` — loại 2 BC bịa, ghi nhận operational layer | BA | trước khi escalate dev |
| 3 | Escalate BA 3 câu hỏi resolve SRS ambiguity (§4.3) | QA → BA | trước khi merge fix |
| 4 | Dev implement 4 hành động fix (§4.4 step 1-4) | Dev | sau BA confirm Q3 (§4.3) — vì có thể ảnh hưởng schema decision |
| 5 | BA submit CR clarify SRS — chọn 1 trong 2 layer authoritative | BA | trước Round 6 |
| 6 | Re-test acceptance: TVV thẩm định lần đầu → state DANG_THAM_DINH + ghi `ngay_tiep_nhan` + `nguoi_tiep_nhan` không null | QA | sau dev fix |

---

## 7. 1 câu chốt

> **BUG-002 thật là Medium audit gap (thiếu 2 cột `ngay_tiep_nhan`/`nguoi_tiep_nhan`), không phải Major workflow break. Dev đúng. BA bịa 2 evidence để bảo vệ verdict Major. QA log có SRS ref yếu cần fix. Trước khi dev fix, BA phải resolve 3 SRS ambiguities (descriptive vs operational layer + Action column + Common Approval Fields scope).**

---

## 8. Verification trail

| Source | Method | Confirmed |
|--------|--------|-----------|
| `srs-v3.md` line 706-754 | sed | §3.2.0.7.1 không SM-TVV + §3.2.0.7.5 SM-02 chỉ 1 pair |
| `srs-v3.md` line 4203-4232 | sed | Phụ lục C.3 mermaid + transition table — Action "—", FR-IV-06, BR Ref "—" |
| `srs-v3.md` line 755-797 | sed | §3.2.0.8 header rule + bảng "Áp dụng từng nhóm" mismatch |
| `srs-fr-04-chuyen-gia-tvv.md` line 411-470 | sed | FR-IV-06 Preconditions + Processing Bước 1 |
| `srs-fr-04-chuyen-gia-tvv.md` line 880-916 | sed | SCR-IV-03 row 5 = "Cap nhat TT" + 8 buttons không có "Tiếp nhận" |
| `srs-fr-04-chuyen-gia-tvv.md` line 921 | sed | Quy tắc tương tác "MOI_DANG_KY → DANG_THAM_DINH (lan dau)" |
| `grep -rn "FR-IV-13" input/srs-v3/` | grep | 0 matches — FR không tồn tại |
| NotebookLM HTPLDN id `e3a2681b...` | 2 queries | Confirm 100% — SRS có 2 layer mâu thuẫn |

*Final verdict 3-way deep review: 2026-04-27 ~20:30 | QA via Claude Code (NotebookLM + SRS local cross-verify per memory rule `feedback_bug_verify_notebooklm_local`)*
