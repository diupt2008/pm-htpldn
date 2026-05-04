# Seed Checklist — DE_KIEM_TRA Tier 2 (T2.A5d phần 2)

**Phase:** P2 Block A Ngày 5 • **Plan ref:** [todo.md](../../../../tasks/todo.md) §P2 T2.A5d • **Date:** 2026-04-25 17:08
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — SCR-III-04 tab "Đề kiểm tra" `[+ Tạo đề kiểm tra]` (verify only)
**Entry state target:** `DU_THAO` (default per SRS Section 3.4.3.22 + FR-III-NEW-01 §Processing Bước 4 "Tạo DE_KIEM_TRA (NHAP)")
**Input:** [seed-fixture.yaml > de_kiem_tra_variants[1..3]](../../../../input/data/seed-fixture.yaml#L1096)
**SRS ref:** `FR-III-NEW-01: Tạo đề kiểm tra` + `Entity DE_KIEM_TRA 3.4.3.22`

---

## Verdict: 🚫 **BLOCKED 0/3 — KHOA_HOC = 0 record (upstream T2.A5b chưa run)**

3 fixture ĐKT phụ thuộc `khoa_hoc_id` (FK → KHOA_HOC, NOT NULL per fixture comment + SRS FR-III-NEW-01 Postconditions). Hôm nay 25/04 KHOA_HOC list rỗng (`Không có khóa học nào phù hợp`) — T2.A5b chưa chạy trong P2 Block A. ĐKT cannot be seeded mà không bind KHOA_HOC, do đó MARK BLOCKED, defer sau T2.A5b PASS.

### BLOCKED matrix — 3 fixture defer

| # | Tên đề | Khóa học fixture | Cách tạo | Phụ thuộc | Defer sau |
|---|--------|------------------|----------|-----------|-----------|
| 1 | Đề kiểm tra - Pháp luật DN căn bản | `khoa_hoc_variants[1]` | NGAU_NHIEN (DE:1/TB:1/KHO:1) | KH#1 + NHCH pool 7 (đủ 3 mức độ) | T2.A5b unblock |
| 2 | Đề kiểm tra - Luật thuế GTGT | `khoa_hoc_variants[2]` | THU_CONG ids [3,5] | KH#2 + NHCH#3 (THUE KHO) + #5 (HOP_DONG/KDTM DE) | T2.A5b unblock |
| 3 | Đề kiểm tra - Luật đất đai 2024 | `khoa_hoc_variants[6]` | THU_CONG ids [6,7] | KH#6 + NHCH#6 (DAT_DAI TB TU_LUAN) + NHCH#7 (DAT_DAI DE TRAC_NGHIEM_MOT) | T2.A5b unblock |

**Total:** **0 seeded / 3 BLOCKED** — defer T2.A5b PASS rồi resume.

Evidence:
- [screenshots/dekt-t2a5d-form-noKH-blocked.png](../screenshots/dekt-t2a5d-form-noKH-blocked.png) — form `Tạo đề kiểm tra` mở sau click `[+ Tạo đề kiểm tra]` ở tab Đề kiểm tra; hiện thị 4 field: Tên đề, Cách tạo, Thời gian làm bài, Điểm đạt + (sau chọn NGAU_NHIEN) thêm "Cấu hình lấy câu hỏi ngẫu nhiên" / "Thêm quy tắc". **Không có field "Khóa học" trong form** — xem Obs O1.
- Khóa học list rỗng đã verify từ T2.A5d phần 1 step 1 (Đào tạo Dashboard "Đào tạo đang diễn ra: 0 khóa học") + nav `/dao-tao/khoa-hoc/danh-sach` (`Không có khóa học nào phù hợp`).

---

## Observations ngoài SRS (không log bug)

| # | Observation | Fixture affected | Workaround | SRS gap |
|---|-------------|------------------|-----------|---------|
| O1 | **Form `Tạo đề kiểm tra` KHÔNG hiển thị field `Khóa học`** trong UI — kể cả sau chọn `Cách tạo = Ngẫu nhiên`. SRS FR-III-NEW-01 §Inputs (chưa quote line cụ thể về khoa_hoc_id required) + Postconditions không list khoa_hoc_id explicit. Fixture comment line 1094 nói "khoa_hoc_id bắt buộc (FK → KHOA_HOC)" — nhưng SRS section Inputs **chỉ list** `ten_de`, `cach_tao`, `thoi_gian_lam_bai`, `diem_dat`, `cau_hoi_ids` (THU_CONG) hoặc `random_config` (NGAU_NHIEN). KHÔNG có row khoa_hoc_id. → SRS thiếu clause khoa_hoc_id mandatory; UI form follow đúng SRS. **Fixture comment có thể sai** vs SRS hiện tại. | All 3 ĐKT | Cần BA confirm: ĐKT có thực sự bắt buộc bind KHOA_HOC không, hay là bind option. Nếu option → có thể seed standalone (không cần T2.A5b). Nếu mandatory → SRS cần bổ sung row khoa_hoc_id. Defer T2.A5b để chắc. | BA bổ sung clause `khoa_hoc_id` vào FR-III-NEW-01 Inputs nếu thực sự mandatory; hoặc cập nhật fixture comment cho khớp SRS |
| O2 | List ĐKT rỗng (`Không có đề kiểm tra nào phù hợp`) — đúng empty state hợp lệ vì 0 record. KHÔNG phải bug per `CLAUDE.md §Quy trình phân loại tab trống` (text chuẩn `Không có`). | — | — | — |
| O3 | Form Tạo ĐKT spinbutton `Thời gian làm bài` value default = 0 (valuemin=1, valuemax=480) — nếu user submit ngay sẽ vi phạm valuemin. SRS FR-III-NEW-01 §Inputs không list thoi_gian_lam_bai constraint cụ thể (chỉ row trong Inputs nếu có). Default=0 nhưng valuemin=1 → potential FE validation gap nhưng cần verify với SRS row exact trước khi log. | — | Defer test functional | T4.6 / functional Khóa học |
| O4 | Form Tạo ĐKT spinbutton `Điểm đạt` default=0, valuemin=0 — fixture đặt diem_dat=5/5/6. Behavior OK. | — | — | — |

Observations không log bug per memory `feedback_bug_must_have_srs_ref.md` (O1 là SRS-fixture mismatch — cần BA, không vi phạm SRS hiện tại; O2-O4 là behavior đúng / chưa quote SRS đủ).

---

## Linkage check (downstream)

| # | Downstream task | Status |
|---|-----------------|:------:|
| L1 | T2.A5b KHOA_HOC seed (M6.1, 6 record `DU_THAO` gắn CTĐT) | 🚫 BLOCKED — phụ thuộc T2.A5a CTĐT seed (M6.1-parent, 4 record DU_THAO) chưa run |
| L2 | T2.A5a CTĐT seed (M6.1-parent) | ⏳ Pending — không phụ thuộc upstream nào, có thể run song song NHCH (đã run xong) |
| L3 | NHCH 7 record (T2.A5d phần 1) đã seed làm pool cho ĐKT khi unblock | ✅ Sample IDs giữ nguyên cho downstream resume |

**Cascade chain:** T2.A5a (CTĐT 4 DU_THAO) → CB_PD approve CTĐT → T2.A5b (KHOA_HOC 6 DU_THAO gắn CTĐT) → T2.A5d phần 2 (ĐKT 3 record gắn KHOA_HOC + NHCH).

---

## T2.A5d phần 2 (ĐKT) Gate Decision

**Status:** 🚫 **BLOCKED 0/3** — defer sau T2.A5b PASS, không phải bug/regression. ĐKT entry-prereq KHOA_HOC ≥1 (per fixture comment + suy luận SRS) hoặc BA confirm khoa_hoc_id optional → seed standalone.

**Todo status:** `[~]` block — phần 2 ĐKT defer. Phần 1 NHCH ✅ done clean.

**Recommend (rank top 1):**
1. ✅ **Defer ĐKT đến sau T2.A5a CTĐT seed + dev/CB_PD push 1 CTĐT → DA_DUYET (workaround memory `qa_htpldn_khoahoc_flow_round2`) + T2.A5b KHOA_HOC seed + retry T2.A5d phần 2.** Lý do: tránh tạo data sai khoa_hoc_id (NULL hoặc orphan) khi SRS không rõ.
2. Alt — BA confirm trong 24h liệu khoa_hoc_id có thực sự mandatory không. Nếu OPTIONAL → seed ngay 3 ĐKT standalone (chỉ với cau_hoi_ids THU_CONG cho #2,#3 và random_config cho #1). Risk: nếu sau BA confirm là MANDATORY, phải xóa + re-seed.

**Quantified tradeoff:**
- Option 1: time +1-2 ngày, 0% data risk, đúng cascade chain plan
- Option 2: time 0 ngày, 50% data risk (5050 BA verdict), đòi 1 lần xóa nếu sai

→ **Khuyến nghị Option 1** — defer ĐKT (memory `feedback_recommend_best_option`).

**Next action:**
- T2.A5d phần 2 BLOCKED note → log vào tổng todo Round 4 + bug-report-seed-tier2-5d (nếu cần). Không log SRS-ref bug vì obs O1 cần BA confirm trước (per `feedback_bug_must_have_srs_ref`).
- Update `tasks/todo.md` T2.A5d ⏳ → ⚠️ partial (NHCH PASS, ĐKT BLOCKED).
- Resume khi T2.A5b PASS.

---

*Verify-only run: 2026-04-25 17:08 | **BLOCKED 0/3** (upstream KHOA_HOC=0)*
*QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block A T2.A5d phần 2*
