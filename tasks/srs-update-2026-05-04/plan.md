# Kế hoạch test SRS update 2026-05-04 (v2 — viết lại đơn giản)

> **Mục đích:** Mô tả từ A→Z: **nhận SRS thay đổi → hiểu → chốt với BA → seed data → test → sửa bug → đóng**.
> Viết lại sau khi phát hiện scope ảnh hưởng **11/13 module** chứ không chỉ 3 module trong file SRS update.
>
> **File này thay thế:** [`v1`](../_archive/srs-update-2026-05-04-v1/plan.md) (v1 chỉ verify trong 3 file SRS, miss impact cross-module).
>
> **Ngày viết:** 2026-05-04 · **Phiên bản:** v2 đơn giản · **Tác giả:** QA team

---

## 📌 Tóm tắt 1 dòng

BA gửi 3 file SRS sửa đổi → kiểm tra cẩn thận → phát hiện ảnh hưởng 11/13 module → chốt 10 câu hỏi với BA → test theo 8 bước → đóng.

---

## Mục lục

| § | Nội dung |
|---|----------|
| 1 | [Quy trình 9 bước từ A→Z](#1-quy-trình-9-bước-từ-az) |
| 2 | [Skill nào dùng cho bước nào](#2-skill-nào-dùng-cho-bước-nào) |
| 3 | [Bản đồ ảnh hưởng — 11 module bị tác động](#3-bản-đồ-ảnh-hưởng--11-module-bị-tác-động) |
| 4 | [10 câu hỏi cần BA chốt](#4-10-câu-hỏi-cần-ba-chốt) |
| 5 | [Thứ tự làm — phụ thuộc nhau như thế nào](#5-thứ-tự-làm--phụ-thuộc-nhau-như-thế-nào) |
| 6 | [Checkpoint — 4 điểm dừng để báo cáo](#6-checkpoint--4-điểm-dừng-để-báo-cáo) |
| 7 | [Rủi ro + cách phòng](#7-rủi-ro--cách-phòng) |
| 8 | [Lịch + thời gian](#8-lịch--thời-gian) |

---

## 1. Quy trình 9 bước từ A→Z

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Bước 1.   Bước 2.  Bước 3.       Bước 4.    Bước 4.5.    Bước 5.  Bước 6.  │
│  Nhận SRS → Đọc  → Diff cũ-mới → Chốt BA → Sync doc nội → Seed → Test       │
│             hiểu    + impact                bộ với SRS     data   workflow  │
│                                                                              │
│                                                            Bước 7.  Bước 8. │
│                                                          → Sửa bug → Đóng   │
│                                                            + retest  test    │
└──────────────────────────────────────────────────────────────────────────────┘
```

> **Bước 4.5 mới (2026-05-04 v2.1):** Tách riêng vì doc nội bộ (entity-map / flow-module / fixture / permission-matrix schema) là **input** của Bước 5 seed. Phải sync với SRS đã chốt TRƯỚC khi seed, nếu không seed task sẽ ref doc cũ → seed sai data.

### Bước 1 — Nhận SRS thay đổi (1 ngày)

**Việc làm:**
- BA gửi folder SRS update → lưu vào `input/srs-update-YYYY-MM-DD/`
- Đếm số file thay đổi, độ lớn (số dòng), so sánh với SRS hiện tại
- Đọc Lịch sử thay đổi (header table) trong từng file → tóm tắt nhanh

**Đầu ra:**
- Bảng tổng quan: file nào đổi, đổi bao nhiêu %, tóm tắt 1 dòng/file

**Ví dụ batch 2026-05-04:**

| File | Cũ | Mới | Δ | Tóm tắt 1 dòng |
|------|---|---|---|---|
| FR-02 Hỏi đáp | 1.420 | 1.745 | +23% | Thêm Mẫu phản hồi 3 cấp + Cảnh báo SLA tự động |
| FR-03 Đào tạo | 1.267 | 2.954 | +133% | Cấu trúc 3 cấp + 6 chức năng mới + 60 mã quyền |
| FR-04 TVV | 1.303 | 2.528 | +94% | Module TCTV mới + tách NHT entity + bỏ địa bàn |

---

### Bước 2 — Đọc hiểu (1 ngày)

**Việc làm:**
- Đọc full 3 file SRS update (đọc kỹ, ghi chú phần khó hiểu)
- Liệt kê **chính xác** thay đổi: bao nhiêu UC mới, bao nhiêu màn hình mới, bao nhiêu state machine sửa, bao nhiêu entity mới
- Verify căn cứ pháp lý đã đính chính chưa (NĐ55, NĐ77, NĐ121)

**Đầu ra:**
- File tóm tắt cho BA xem (dùng tiếng Việt thuần, không jargon kỹ thuật)
- Ví dụ batch này: [`summary-for-BA.md`](summary-for-BA.md)

**⚠️ Lưu ý:** Bước này chỉ đọc, **chưa đánh giá ảnh hưởng** — đó là bước 3.

---

### Bước 3 — Diff cũ ↔ mới + đánh giá ảnh hưởng (2 ngày) — **QUAN TRỌNG NHẤT**

**Việc làm chia 2 lớp:**

#### Lớp A — Verify nội dung 3 file SRS update (skill mức Trung bình)

Spawn `Explore` agent với prompt:
```
Đọc file [cũ] + file [mới], verify các claim sau:
1. Có UC mới X không?
2. State machine có thêm trạng thái Y không?
3. Entity Z có thực sự mới hay chỉ refactor?
...
Báo cáo: ✅ ĐÚNG / ❌ SAI / ⚠️ MỘT PHẦN — kèm line number.
```

**Kết quả batch 2026-05-04:** 20/21 claim đúng, 1 claim sai (3 entity KHDT/LICH_HOC/HOC_VIEN không phải mới hoàn toàn — đã có ở SRS cũ, chỉ refactor).

#### Lớp B — Tìm ảnh hưởng sang module khác (skill mức Sâu) — **BẮT BUỘC**

Spawn `general-purpose` agent với prompt:
```
Phân tích impact cross-module của 3 file SRS update đến các module KHÁC.
Đọc tất cả file SRS module còn lại (FR-01, FR-05, FR-06, FR-08, FR-10, FR-11, FR-12, FR-13, FR-14, FR-15, FR-16) + entity-map.md.
Grep keyword: TU_VAN_VIEN, NHT, TCTV, KHOA_HOC, MAU_PHAN_HOI, HOI_DAP, dia_ban, loai_tvv, escalate, TVN_BRIDGE.
Báo cáo: bảng module bị ảnh hưởng × loại impact × severity × hành động test cần thêm.
```

**Kết quả batch 2026-05-04:** 11/13 module bị ảnh hưởng (xem §3).

**⚠️ Bài học:** Plan v1 chỉ làm Lớp A → miss 11 module. **Phải làm cả Lớp B với mọi update SRS có scope >20% hoặc động vào entity dùng cross-module.**

---

### Bước 4 — Chốt câu hỏi với BA (3-5 ngày, depend on BA)

**Việc làm:**
- Tổng hợp tất cả giả định + chỗ chưa rõ thành **danh sách câu hỏi** gửi BA
- Mỗi câu hỏi có: (a) bối cảnh, (b) đề xuất QA, (c) ô để BA chốt OK/NOK
- BA reply → lưu vào `tasks/decisions/srs-update-YYYY-MM-DD-ba-signoff.md`
- Nếu BA reply có thay đổi scope → **quay lại bước 2** để đọc lại

**⚠️ KHÔNG làm bước 5 trở đi nếu chưa có BA sign-off** — tránh test sai scope.

**Ví dụ batch này:** 10 câu hỏi (xem §4).

---

### Bước 4.5 — Sync tài liệu nội bộ với SRS đã chốt (1-2 ngày)

**Mục đích:** Doc nội bộ (entity-map, flow-module, 02-thu-tu-module, fixture, permission-matrix) là **input của Bước 5 seed**. Phải sync với SRS đã BA chốt **TRƯỚC khi seed**.

**Việc làm — 7 sub-task theo dependency:**

| # | File | Việc làm | Lý do |
|---|------|---------|-------|
| 1 | `input/srs-v3/_archive/YYYY-MM-DD-pre-update/` | Tạo folder + move 3 file SRS cũ vào | Giữ bản cũ để diff sau, không mất history |
| 2 | `input/srs-v3/srs-fr-XX-*.md` | Copy 3 file SRS mới từ `input/srs-update-YYYY-MM-DD/` đè lên | `srs-v3/` = bản working canonical |
| 3 | `input/data/entity-map.md` | Thêm row entity mới (TCTV, NGUOI_HO_TRO, KHDT, LICH_HOC, HOC_VIEN) — cột "Tạo tại / Đọc tại" | Seed task cần biết entity tạo ở module nào |
| 4 | `input/quy-trinh-nghiep-vu/flow-module.md` | Thêm SM mới (SM-TCTV, SM-NHT) + sửa SM cũ (SM-TVV thêm trạng thái Chờ thẩm định, SM-CTDT 3 cấp) | Seed task cần state machine để đẩy state đúng |
| 5 | `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Thêm TCTV vào Lớp 1 + cập nhật bảng SM transition | Dependency chain seed |
| 6 | `output/permission-matrix.md` (Phase 1 — schema) | Thêm row entity mới + cell ❌/CRUD theo SRS chốt | Seed task chọn account theo quyền |
| 7 | `input/data/seed-fixture.yaml` | Thêm `tctv_variants`, `nguoi_ho_tro_variants`, `kh_dao_tao_nam_variants`, `lich_hoc_variants`, `hoc_vien_variants` + sửa `tvv_variants` thang điểm 0-10 → 1-5, bỏ `dia_ban_ids` | Fixture là input giá trị seed |

**Thứ tự bắt buộc:** 1 → 2 → 3 → 4 → 5 → 6 → 7. (Mỗi bước cần bước trước done.)

**KHÔNG làm trong Bước 4.5:**
- `input/users.csv` — chờ BA reply câu G1 (chiến lược migration NHT). Nếu BA chốt role NHT cần TK riêng → tách task riêng sau B4.1.
- `permission-matrix.md` Phase 2 (verify CRUD behavior thực tế) — để Bước 8 sau test, vì cần đối chiếu với app implement.

**⚠️ Risk + mitigation:**
- **Risk:** Update doc trước khi dev implement → seed task Bước 5 fail vì backend 404.
- **Mitigation:** Mỗi seed task ở Bước 5 phải có guard `[need: dev confirm endpoint sẵn sàng]` trước khi chạy.

**Đầu ra Bước 4.5:**
- 5 file doc nội bộ đã sync với SRS mới (commit riêng, có message rõ "sync after BA signoff 2026-05-04")
- Folder archive SRS cũ tạo xong, có 3 file gốc

---

### Bước 5 — Seed data (1-2 tuần)

**Việc làm — chia 4 tầng từ thấp lên cao:**

```
Tầng 0: Danh mục (DM) gốc      ← Tạo trước
   ↓
Tầng 1: Tài khoản + đơn vị     ← Cần DM
   ↓
Tầng 2: Đối tượng nghiệp vụ    ← Cần TK + đơn vị
       (TVV, TCTV, NHT, DN)
   ↓
Tầng 3: Giao dịch              ← Cần đối tượng
       (Hỏi đáp, Khóa học, VV)
```

**Quy tắc seed (rút từ bài học A5):**
- ❌ **Sai:** "Seed 12 tư vấn viên" → có thể 12 cùng loại, không cover được test
- ✅ **Đúng:** "Seed ≥3 TVV cho mỗi (loại × cấp × trạng thái) — verify per-filter"
- Mỗi đối tượng có dropdown ở module khác → **tách 2 task**: (1) tạo, (2) đẩy đến trạng thái mà module khác đọc được

**Đầu ra:** seed-checklist-*.md cho từng tầng + screenshot UI verify.

---

### Bước 6 — Test workflow (1-2 tuần)

**Test theo 5 luồng trạng thái mới/sửa:**

| # | Luồng trạng thái | Test gì |
|---|------------------|---------|
| 1 | Hỏi đáp + 4 mức cảnh báo SLA | Câu hỏi từ Mới → Tiếp nhận → Đang xử lý → Đã trả lời → Chờ duyệt → Đã duyệt → Công khai. Verify cron tự động chuyển mức cảnh báo |
| 2 | Kế hoạch đào tạo năm | KH năm Nháp → Chờ duyệt → Đã duyệt. Test refinement: bị Từ chối → sửa → gửi lại (không qua Nháp) |
| 3 | Chương trình đào tạo (mới) | CTDT Nháp → Chờ duyệt → Đã duyệt → tự chuyển Đang thực hiện khi có Khóa học con công khai |
| 4 | Khóa học (11 trạng thái) | Khóa Nháp → ... → Hoàn thành. Test 2 path từ chối: từ chối khóa, từ chối kết quả |
| 5 | Tổ chức Tư vấn (mới) | TCTV Mới đăng ký → Chờ phê duyệt → Hoạt động → Tạm dừng → Vô hiệu hóa. Verify guard: vô hiệu hóa khi không còn TVV active |
| 6 | TVV refactor | TVV Mới đăng ký → Chờ thẩm định (mới) → Đang thẩm định → Chờ phê duyệt → Hoạt động |

Mỗi luồng có **happy path** + **2 negative case** (sai trạng thái, sai input).

---

### Bước 7 — Sửa bug + retest (xen kẽ bước 6)

**Quy trình:**
1. Phát hiện bug khi test → log theo template 6 sections (Mô tả / Bước tái hiện / KQ mong đợi / KQ thực tế / Bằng chứng / So sánh) — **CẤM** "Tác động" hay "Đề xuất fix"
2. Verify bug 2 nguồn: NotebookLM HTPLDN + grep SRS local
3. Gửi dev → dev fix → retest
4. Pass → đóng bug; Fail → log lý do, gửi lại

**Lưu ý đặc biệt:**
- Bug cũ R6 đã đóng nhưng **có thể reopen** sau migrate NHT/TVV (regression)
- Khi dev push back "không bug, đã align SRS §X" → phải verify 4 bước (đọc full section, cross-check 3 nguồn, tìm dev over-extend, escalate BA nếu ambiguous)

---

### Bước 8 — Đóng test (3 ngày)

**Việc làm:**
- Tổng kết: bao nhiêu task PASS / FAIL / BLOCKED
- Bug status: bao nhiêu Open / Closed / Deferred
- Coverage: % SRS đã test được
- Handoff doc cho stakeholder
- **Permission matrix Phase 2 — verify behavior:** Đối chiếu kết quả permission test với matrix đã update schema ở B4.5.6. Sửa lại nếu app implement khác SRS (ghi chú lý do).
- **Verify lại 4 doc nội bộ B4.5 đã update** (entity-map, flow-module, 02-thu-tu, fixture) có cần sửa thêm không sau khi test phát hiện differ với SRS.

> **Phân biệt với Bước 4.5:** B4.5 update **schema** (entity nào, role nào, state nào theo SRS). B8 verify **behavior** (CRUD thực tế của app khớp matrix không). 2 việc khác nhau, không trùng.

**Tiêu chí đóng test:**
- 100% UC mới có happy path PASS
- 0 bug Critical/Blocker còn open
- BA + PM ký duyệt báo cáo cuối

---

## 2. Skill nào dùng cho bước nào

| Bước | Skill chính | Khi nào | Ghi chú |
|------|-------------|---------|---------|
| 1. Nhận SRS | `diff` shell | Đếm số dòng, kiểm tra file mới | Free, nhanh |
| 2. Đọc hiểu | (đọc thủ công) + `Read` tool | Đọc kỹ Lịch sử thay đổi + UC mới | — |
| 3a. Diff cũ-mới (Lớp A) | **`Explore` agent** | Verify từng claim cụ thể | Hiệu quả khi delta >20% |
| 3b. Impact cross-module (Lớp B) | **`general-purpose` agent** | Tìm ảnh hưởng sang 13 module khác | **BẮT BUỘC** với scope lớn |
| 4. Chốt BA | `bmad-checkpoint-preview` | Human review gate | Lưu signoff vào `tasks/decisions/` |
| **4.5. Sync doc nội bộ** | `Read` + `Edit` tool — sửa từng file thủ công theo SRS đã chốt | Sau BA signoff, trước seed | 7 file: SRS archive/copy + entity-map + flow-module + 02-thu-tu + permission-matrix schema + fixture |
| 5. Seed data | `qa` (test+fix) hoặc `qa-only` (report) + MCP Chrome DevTools | Seed UI + verify per-filter | Theo CLAUDE.md MCP-Rule |
| 6. Test workflow | `qa` skill + MCP Chrome | Walk full state machine | Atomic chain login template |
| 7. Sửa bug + retest | `investigate` (root cause khó) + `cso` (security audit) + `codex challenge` (adversarial) | Bug khó hoặc complex security | — |
| 8. Đóng test | `bmad-checkpoint-preview` + `document-release` | Final summary + update docs | — |

**Tools hỗ trợ chung:**
- **NotebookLM HTPLDN** (id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`) — verify SRS
- **MailHog** (http://103.172.236.130:8025) — fallback OTP
- **Hooks tự động:** `check-todo-concise.py` (chặn dòng kết quả >25 từ), `check-bug-template-sections.py` (chặn forbidden sections)

---

## 3. Bản đồ ảnh hưởng + Chiến lược test theo từng module

> **Nguyên tắc cốt lõi:** Module nào thay đổi nhiều → **test lại HẾT**. Module nào thay đổi ít → **chỉ test phần thay đổi + chỗ bị ảnh hưởng**. Module không liên quan → **bỏ qua**.

### 3.1 Phân 13 module thành 4 nhóm

| Nhóm | Mức thay đổi | Cách test | Số module |
|:-:|---|---|:-:|
| **A** | Thay đổi nhiều (>50%) — có file SRS update | Test lại **toàn bộ** module như chưa từng test | 3 |
| **B** | Thay đổi vừa (~15-30%) — bị refactor cấu trúc data/API lan từ nhóm A | Test **phần thay đổi đầy đủ** + chạy **sample workflow** để chắc không vỡ luồng cũ | 4 |
| **C** | Thay đổi ít (~5-12%) — chỉ đọc dữ liệu thay đổi (KPI, báo cáo, dropdown) | Test **sample 2-3 màn hình** đại diện. Không test full | 6 |
| **D** | Không bị ảnh hưởng | **Smoke 5 phút** verify còn login + render được | 2 |

### 3.2 Bảng phân loại 15 module chi tiết

| Module | Δ | Nhóm | Vì sao | Phạm vi test |
|--------|:-:|:-:|------|--------------|
| **FR-02 Hỏi đáp** | +23% nội bộ | 🔴 **A** | File SRS update, 3 chức năng mới + đổi cách tính SLA | **Test 100%** UC10-19 + 3 UC mới + workflow + 4 mức cảnh báo SLA |
| **FR-03 Đào tạo** | +133% nội bộ | 🔴 **A** | File SRS update, refactor lớn nhất — cấu trúc 3 cấp + 6 UC mới + 60 mã quyền | **Test 100%** toàn bộ FR-III + state machine 11 trạng thái + permission |
| **FR-04 TVV** | +94% nội bộ | 🔴 **A** | File SRS update, module Tổ chức tư vấn mới + tách Người hỗ trợ + refactor TVV | **Test 100%** toàn bộ FR-IV + 3 SCR mới TCTV + 3 SCR mới NHT |
| **FR-05 Vụ việc** | ~30% impact | 🟠 **B** | FK Người hỗ trợ đổi entity + modal phân công tách 2 dropdown + bỏ địa bàn | (1) Phân công VV cho NHT mới — **đầy đủ**<br>(2) Workflow VV happy path — **sample**<br>(3) Filter địa bàn ẩn — **verify** |
| **FR-10 Quản trị HT** | ~25% impact | 🟠 **B** | Phải seed 60 mã quyền Đào tạo + flow đăng ký TK NHT mới + bỏ địa bàn | (1) Seed 60 quyền + matrix 11 vai trò — **đầy đủ**<br>(2) Đăng ký TK NHT loại mới — **đầy đủ**<br>(3) Cấu hình phân công bỏ địa bàn — **verify** |
| **FR-16 API Cổng PLQG** | ~30% (BREAKING) | 🟠 **B** | Bỏ địa bàn khỏi 1 endpoint TVV + đổi schema endpoint Khóa học sang 3 cấp | (1) 3 endpoint thay đổi — **đầy đủ**<br>(2) Cổng PLQG nhận schema mới được không — **sample contract**<br>**KHÔNG** retest 18 endpoint khác |
| **FR-13 TV nhanh** | ~15% impact | 🟠 **B** | Thêm nút "Escalate sang Hỏi đáp" mới | (1) Luồng escalate đầy đủ — **đầy đủ**<br>(2) Workflow TV nhanh khác — **sample** |
| **FR-01 Dashboard** | ~10% impact | 🟡 **C** | KPI đếm TVV phải gộp với NHT + KPI Hỏi đáp thiếu chiều cảnh báo | Test **sample 2 KPI**: KPI mạng lưới TVV + KPI Hỏi đáp 4 mức cảnh báo. **Không** retest 9 KPI khác |
| **FR-06 Chi trả** | ~8% impact | 🟡 **C** | Lookup TVV phải gọi sang Tổ chức + bỏ NHT khỏi danh sách | Test **sample**: chi trả TVV thuộc nhiều TCTV + verify NHT không hiện. **Không** retest workflow chi trả |
| **FR-08 Đánh giá HQ** | ~10% impact | 🟡 **C** | Tách NHT khỏi TVV + thang điểm 1-5 | Test **sample form chấm điểm** thang 1-5 + verify NHT không hiện trong list. **Không** retest 9 UC |
| **FR-11 Báo cáo TT17** | ~12% impact | 🟡 **C** | Báo cáo BC04 bỏ địa bàn + báo cáo Đào tạo cấu trúc 3 cấp | Test **sample 2 báo cáo** (BC04 + BC Đào tạo). **Không** retest 21 báo cáo khác |
| **FR-12 TV chuyên sâu** | ~5% impact | 🟡 **C** | Pool chuyên gia có thể đổi do trạng thái "Chờ thẩm định" mới | Test **sample dropdown chọn CG** (chỉ hiện CG đang hoạt động). **Không** retest 7 UC |
| **FR-14 HĐ tư vấn** | ~8% impact | 🟡 **C** | NHT không được ký HĐ + JOIN bảng Tổ chức TV | Test **sample form HĐ** + verify NHT không hiện trong dropdown. **Không** retest workflow HĐ |
| **FR-15 CT HTPLDN GĐ2** | ~10% impact | 🟡 **C** | Báo cáo Đào tạo phải đọc 3 cấp + bỏ chứng nhận PDF | Test **sample đợt báo cáo GĐ2** với data 3 cấp. **Không** retest 11 UC |
| **FR-07 Doanh nghiệp** | 0% | ⚪ **D** | Không liên quan | **Smoke 5 phút** — login DN, mở 1 màn hình |
| **FR-09 Biểu mẫu** | 0% | ⚪ **D** | Không liên quan | **Smoke 5 phút** — login QTHT, list biểu mẫu |

### 3.3 Tổng quy mô test theo 4 nhóm

| Nhóm | Module | Số TC ước | Time | Tỷ lệ TC |
|:-:|---|:-:|---|:-:|
| 🔴 A FULL | FR-02 + FR-03 + FR-04 (3 module) | ~600 | 3 tuần | 74% |
| 🟠 B DELTA+IMPACT | FR-05 + FR-10 + FR-13 + FR-16 (4 module) | ~150 | 1 tuần | 19% |
| 🟡 C IMPACT only | FR-01 + FR-06 + FR-08 + FR-11 + FR-12 + FR-14 + FR-15 (7 module) | ~50 | 3 ngày | 6% |
| ⚪ D SKIP | FR-07 + FR-09 (2 module) | ~10 (smoke) | 0.5 ngày | 1% |
| **Tổng** | **15 module** | **~810 TC** | **~5 tuần** | **100%** |

> **So sánh với cách "test lại hết tất cả":** Nếu 15 module × 150 TC/module = ~2.250 TC → mất ~10 tuần. **Cách phân loại này tiết kiệm ~64% công sức** mà vẫn cover risk hợp lý.

### 3.4 Vì sao phân nhóm theo nguyên tắc này

| Nhóm | Lý do |
|:-:|------|
| **A** | SRS sửa nhiều → khả năng dev viết bug cao → phải retest đầy đủ workflow + functional + permission |
| **B** | Cấu trúc dữ liệu/API đổi → có thể break luồng đang chạy → test phần đổi đầy đủ + sample workflow happy path để bắt regression |
| **C** | Chỉ đọc dữ liệu (báo cáo, KPI, dropdown) → bug nếu có chỉ là "hiển thị sai" → sample 2-3 màn hình đại diện đủ phát hiện. Test full lãng phí |
| **D** | Không động vào → không có khả năng có bug → smoke 5 phút verify hệ thống còn chạy là OK |

### 3.5 Cập nhật tài liệu nội bộ — chi tiết ở Bước 4.5

Đây là **input của Bước 5 seed**. Bắt buộc làm sau BA signoff (CP1) và trước khi seed data. 7 sub-task chi tiết xem **§1 Bước 4.5**:

| # | File | Phạm vi update |
|---|------|---------------|
| 1 | `input/srs-v3/_archive/YYYY-MM-DD-pre-update/` | Archive 3 file SRS cũ |
| 2 | `input/srs-v3/srs-fr-XX-*.md` | Copy 3 file SRS mới đè lên |
| 3 | `input/data/entity-map.md` | +5 entity mới (TCTV, NGUOI_HO_TRO, KHDT, LICH_HOC, HOC_VIEN) |
| 4 | `input/quy-trinh-nghiep-vu/flow-module.md` | +SM-TCTV, SM-NHT; sửa SM-TVV (9 trạng thái), SM-CTDT (3 cấp) |
| 5 | `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | TCTV vào Lớp 1 + bảng SM transition |
| 6 | `output/permission-matrix.md` (Phase 1) | +row entity mới, +60 mã quyền §7 FR-03 schema (chưa verify behavior) |
| 7 | `input/data/seed-fixture.yaml` | +5 fixture entity mới + sửa `tvv_variants` thang 1-5, bỏ địa bàn |

**KHÔNG bao gồm trong Bước 4.5:**
- `users.csv` — chờ BA reply câu G1
- `permission-matrix.md` Phase 2 (verify CRUD behavior từ test result) — để Bước 8

---

## 4. 10 câu hỏi cần BA chốt

> Tổng hợp 5 câu hỏi gốc + 5 câu hỏi mới phát hiện qua impact analysis.

| # | Câu hỏi | Bối cảnh | Đề xuất QA |
|---|---------|----------|------------|
| 1 | NHT migration có break R6 cũ không? | Vụ việc/Hỏi đáp R6 đang phân công cho NHT | Migrate in-place + giữ tương thích 1 round |
| 2 | Khóa học R6 cũ chưa có Chương trình cha — giữ orphan hay backfill? | R6 tạo flat, R7 yêu cầu 3 cấp | Giữ orphan, R7 mới bắt buộc có cha |
| 3 | Bộ ngành có đọc Mẫu phản hồi TW không? | SRS strict: TW dùng cho 63 tỉnh, Bộ chỉ thấy của Bộ | Theo SRS strict |
| 4 | TVV cũ thang 0-10 — migrate sang 1-5 hay giữ song song? | R6 đã đánh giá thang 0-10 | R6 giữ, R7 dùng 1-5 |
| 5 | Kênh `TVN_BRIDGE` — dev đã thêm chưa? | Cần biết để test FR-13 | Hỏi dev confirm |
| **6** | **Bỏ địa bàn TVV** ảnh hưởng API Cổng PLQG — bên Cổng có chấp nhận schema mới? | FR-16 query param + response field | **Phải báo bên Cổng trước khi merge** |
| **7** | NHT có **ký HĐ tư vấn** không? | FR-14 enum `loai_tvv` còn check NHT | Theo NĐ55: chỉ TVV/CG ký → bỏ NHT |
| **8** | Migration `loai_tvv='NHT'` cũ — auto hay manual? | Có rollback không nếu lỗi? | Auto + có rollback plan |
| **9** | API `/khoa-hoc` outbound 3 cấp — bên Cổng có adapter giữ contract cũ? | FR-16 schema breaking change | Cần adapter backward compat |
| **10** | TVN_BRIDGE escalate — phiên TVN đã có đánh giá DN, khi tạo HOI_DAP có copy không? `muc_do_phuc_tap` mặc định? | Logic chưa rõ trong SRS | BA chốt: copy đánh giá + mặc định = phức tạp |

---

## 5. Thứ tự làm — phụ thuộc nhau như thế nào

```
                    ┌─────────────────────────┐
                    │  Bước 1-4: Chuẩn bị      │
                    │  (BA sign-off bắt buộc)  │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────────┐
                    │ Bước 4.5: Sync doc nội bộ   │
                    │ (SRS archive+copy → entity- │
                    │  map → flow-module → 02-    │
                    │  thu-tu → permission schema │
                    │  → seed-fixture)            │
                    └────────────┬────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │ Bước 5a: DM gốc         │
                    │ (mức độ HD, SLA 2-tier, │
                    │  loại TCTV)             │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │ Bước 5b:     │     │ Bước 5c:     │     │ Bước 5d:     │
    │ TCTV mới     │     │ NHT migrate  │     │ TVV refactor │
    │ (3 SCR mới)  │     │ entity riêng │     │ (bỏ địa bàn) │
    └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
           │                    │                    │
           └────────────────────┼────────────────────┘
                                ▼
            ┌───────────────────┴───────────────────┐
            ▼                                       ▼
    ┌──────────────┐                       ┌──────────────────────┐
    │ Bước 5e:     │                       │ Bước 5f:             │
    │ Hỏi đáp với  │                       │ KH năm → CTDT →      │
    │ phức tạp     │                       │ Khóa học → Lịch học  │
    └──────┬───────┘                       └──────────┬───────────┘
           │                                          │
           └────────────────┬─────────────────────────┘
                            ▼
                  ┌─────────────────────┐
                  │ Bước 6: Test 6 luồng │
                  │ trạng thái            │
                  └──────────┬──────────┘
                             │
            ┌────────────────┼────────────────┐
            ▼                ▼                ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Permission   │ │ Edge case    │ │ Test 11      │
    │ 60 mã quyền  │ │ + bảo mật    │ │ module       │
    │              │ │ (XSS, AES,   │ │ regression   │
    │              │ │  locking)    │ │              │
    └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
           │                │                │
           └────────────────┼────────────────┘
                            ▼
                  ┌─────────────────────┐
                  │ Bước 7-8:            │
                  │ Sửa bug + đóng test  │
                  └─────────────────────┘
```

---

## 6. Checkpoint — 4 điểm dừng để báo cáo

Tại mỗi checkpoint, dừng test, gửi báo cáo cho BA + PM, chờ OK rồi tiếp.

| # | Sau bước | Báo cáo gì | Người duyệt |
|---|----------|------------|-------------|
| **CP1** | Sau bước 4 | BA sign-off 10 câu hỏi + scope test cuối cùng | BA + PM |
| **CP1.5** | Sau bước 4.5 (sync doc) | 5 file doc nội bộ đã sync với SRS chốt + folder archive SRS cũ | PM (light review — verify diff doc khớp BA signoff) |
| **CP2** | Sau seed Tầng 2 (đối tượng) | Đối tượng đã sẵn sàng, dropdown render OK, ko break R6 cũ | PM |
| **CP3** | Sau test 6 luồng (bước 6 happy path) | 6 workflow PASS happy + sample negative | BA + PM |
| **CP4** | Sau bước 8 | Tổng kết coverage + bug status + handoff + permission matrix Phase 2 verify | BA + PM + stakeholder |

---

## 7. Rủi ro + cách phòng

| # | Rủi ro | Khả năng | Tác động | Cách phòng |
|---|--------|---------|---------|-----------|
| 1 | Dev chưa làm xong 15 chức năng mới → block test | Cao | Critical | Bước 4 hỏi dev confirm scope sẵn sàng. Test theo wave khi dev ready từng phần |
| 2 | Migration NHT phá R6 (HD/VV phân công NHT cũ) | Vừa | Critical | Câu hỏi BA #1 + #8 — yêu cầu dev có rollback plan. Regression test R6 NHT trước khi đóng bước 5c |
| 3 | API Cổng PLQG breaking, bên Cổng chưa biết | Cao | Critical | Câu hỏi BA #6 + #9 — ưu tiên báo bên Cổng trước khi merge production |
| 4 | 60 mã quyền chưa seed → test phân quyền block | Cao | Major | Bước 5a + 5b ưu tiên seed quyền trước khi test workflow |
| 5 | State machine 11 trạng thái Khóa học bug nhiều | Cao | Critical | Bước 6 split 1 SM = 1 task riêng. Walk full transition + audit log mỗi transition. `investigate` skill khi block ≥2 transition |
| 6 | Lỗi optimistic locking PHAN_HOI khó reproduce | Vừa | Major | Dùng 2 MCP isolatedContext + script timing để force race |
| 7 | XSS sanitize chưa đủ vector | Vừa | Major | `cso` skill audit + payload OWASP XSS-1..XSS-7 |
| 8 | Acceptance theo total count → false PASS như A5 | Vừa | Critical | Mọi seed task acceptance theo per-filter query (memory `feedback_seed_acceptance_strict_split`) |
| 9 | JWT BE revoke aggressive ~2 phút → workflow dài fail | Vừa | Vừa | Re-login trong workflow >2 phút. Atomic chain login template |
| 10 | API double-wrap bug ở entity mới (TCTV/NHT) | Thấp | Vừa | curl verify response shape khi seed entity mới |
| 11 | Bước 4.5 update doc trước khi dev implement → seed Bước 5 fail vì backend 404 | Vừa | Major | Mỗi seed task Bước 5 thêm guard `[need: dev confirm endpoint sẵn sàng]`. Nếu dev chưa xong → block seed task, không retry mù |
| 12 | Quên archive SRS cũ ở B4.5.1 → mất bản gốc để diff sau (nếu BA reply lại có thay đổi) | Thấp | Critical | B4.5.1 là task ĐẦU TIÊN trong Bước 4.5. Verify folder archive có đủ 3 file trước khi làm B4.5.2 |
| 13 | Update fixture B4.5.7 sai schema → seed task fail hàng loạt | Vừa | Major | B4.5.7 phải sau B4.5.3 (entity-map) + B4.5.4 (flow-module) — đảm bảo schema đã chốt |

---

## 8. Lịch + thời gian

> **Giả định:** R6 đang chạy → đóng R6 trước → mở R7 cho SRS update này. Dev sẵn sàng 100% scope khi mở R7.

| Tuần | Bước | Task chính | Deliverable |
|------|------|------------|-------------|
| **T0 (3-5 ngày)** | 1-4 | Nhận + đọc + diff + chốt BA 10 câu hỏi | BA signoff doc |
| **T0+ (1-2 ngày)** | 4.5 | Archive SRS cũ + sync 5 file doc nội bộ (entity-map, flow-module, 02-thu-tu, permission schema, fixture) | 5 file doc updated + folder archive |
| **T1 tuần 1** | 5a-5d | Seed DM gốc + 3 đối tượng (TCTV, NHT migrate, TVV refactor) | seed-checklist (3 file) + regression report R6 NHT |
| **T1 tuần 2** | 5e-5f | Seed giao dịch (HD, KH năm, CTDT, Khóa học, Lịch học, Học viên) | seed-checklist transactional |
| **T2 tuần 1** | 6 | Test 6 luồng trạng thái happy path | workflow-test-report (6 file) |
| **T2 tuần 2** | 6 + 7 | Test 60 mã quyền + edge case + 11 module regression + sửa bug | permission-test-report + nfr-edge-report + regression report |
| **T3 (3 ngày)** | 8 | Đóng test + handoff + update tài liệu | R7 final summary |

**Tổng:** **~5 tuần + 1-2 ngày Bước 4.5** — depend on dev + BA reply.

---

## 9. Output files — checklist

Khi xong, sẽ có các file sau:

- ✅ [`summary-for-BA.md`](summary-for-BA.md) — đã có
- ✅ [`plan.md`](plan.md) — file này (v2)
- 🟢 [`todo.md`](todo.md) — task list chi tiết (v2)
- ⏳ `tasks/decisions/srs-update-2026-05-04-ba-signoff.md` — BA chốt 10 câu hỏi
- ⏳ `output/qa-reports/round7/seed/seed-checklist-*.md` (5 file)
- ⏳ `output/qa-reports/round7/workflow/workflow-test-report-*.md` (6 file)
- ⏳ `output/qa-reports/round7/permission/permission-test-report-*.md` (6 file)
- ⏳ `output/qa-reports/round7/nfr/nfr-*.md` (7 file)
- ⏳ `output/qa-reports/round7/regression/r6-regression-after-migrate.md`
- ⏳ `output/qa-reports/round7/R7-final-summary.md`

---

## 10. Bài học rút ra (cho lần sau)

1. **Luôn dùng skill mức Sâu (`general-purpose` agent) với SRS update có scope >20%.** Skill mức Trung bình (`Explore`) chỉ verify nội dung file, không tìm impact cross-module.
2. **Đếm số module bị ảnh hưởng trước khi lên test plan.** Nếu >50% module bị ảnh hưởng → đây là refactor lớn, cần 1 round test riêng.
3. **Chốt BA trước, test sau.** Đừng bao giờ test khi giả định chưa rõ — sẽ phải làm lại.
4. **Update tài liệu nội bộ trước khi seed.** entity-map.md / permission-matrix.md / flow-module.md sai → seed sai → test sai.
5. **Dùng tiếng Việt thuần khi giao tiếp với BA.** Bỏ jargon "BR / SM / FR / SCR / endpoint / payload" — BA không phải dev.

---

## Tham chiếu

- [`v1 plan`](../_archive/srs-update-2026-05-04-v1/plan.md) — giữ làm reference, có chi tiết kỹ thuật
- [`summary-for-BA.md`](summary-for-BA.md) — file gửi BA
- [`tasks/plan.md`](../plan.md) v2.5.1 — R6 active (KHÔNG ghi đè)
- [`tasks/lessons-learned.md`](../lessons-learned.md) — bài học A5 + LGSP + UI auto-chain
- [`output/test-strategy.md`](../../output/test-strategy.md) v3.0 — chiến lược tổng
- [`output/scaling-test-strategy.md`](../../output/scaling-test-strategy.md) v1.1 — pattern scaling khi thêm module
