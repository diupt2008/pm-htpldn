# Round 6 — Re-seed sau dev reset DB (2026-05-01)

> **Lý do tồn tại:** Dev reset toàn DB ngày 1/5 → toàn bộ data R1-R10 (thuộc Round 5) mất. Round 6 = re-seed từ A→Z + chạy test workflow + workflow đầu ra hậu kỳ + functional 17 module.
> **Round 5 cũ:** [`../round5-2026-04-26/`](../round5-2026-04-26/) — frozen, chỉ làm reference (lịch sử bug 5 tuần dev fix iterate).
> **Plan tổng:** [`../../../tasks/plan.md`](../../../tasks/plan.md) v2.5 · **Todo:** [`../../../tasks/todo.md`](../../../tasks/todo.md) · **Fixture:** [`../../../input/data/seed-fixture.yaml`](../../../input/data/seed-fixture.yaml) v2.6.2
> **Scope update 2026-05-02:** Phase 6 (Workflow đầu ra hậu kỳ — mapping R5 P3) + Phase 7 (Functional 17 module — mapping R5 T4) bổ sung sau khi user phát hiện R6 ban đầu cắt scope so với R5.

---

## 0. Tiền điều kiện (verify trước khi bắt đầu)

| # | Check | Cách verify | Pass khi |
|:-:|---|---|---|
| 1 | App + BE up | `curl http://103.172.236.130:3000/` | HTTP 200 |
| 2 | MailHog up | `curl http://103.172.236.130:8025/` | HTTP 200 |
| 3 | Admin/QTHT login OK | UI login `qtht_01 / Secret@123 / OTP 666666` | Vào dashboard, không 401 |
| 4 | QTHT có quyền tạo TK | qtht_01 → SCR-VIII-02 → button [Thêm mới] visible | — |

🚫 **Nếu #3 fail** → STOP, escalate dev reset password QTHT trước. Không chạy phase nào.

---

## Phase 1 — Tier 0 prerequisites (~30 phút) · qtht_01

| Bước | Việc | Module UI | Số record | Spec fixture |
|:-:|---|---|:-:|---|
| 1.1 | Seed 6 lĩnh vực PL | QTHT → DM → LINH_VUC_PL | 6 | `tier_0_prerequisite.linh_vuc_pl` |
| 1.2 | Seed 4 loại DN | QTHT → DM → LOAI_DN | 4 | `tier_0_prerequisite.loai_dn` |
| 1.3 | Seed 5 đơn vị (1 TW + 4 ĐP) | QTHT → Cơ cấu tổ chức | 5 | `tier_0_prerequisite.don_vi` |
| 1.4 | Seed cấu hình SLA | QTHT → Cấu hình HT → SLA | 1 | `tier_0_prerequisite.cau_hinh_sla` |
| 1.5 | Seed 6 mẫu phản hồi TW khung (cover 6 LV) | **CB_NV_TW** → MPH (`pham_vi=TW_QUOC_GIA`) | 6 | `mau_phan_hoi_variants` |
| 1.6 | Seed 12 lý do từ chối/bổ sung | QTHT → DM → LY_DO_TU_CHOI/BO_SUNG | 12 | `danh_muc_ly_do_variants` |

**Verify gate:** `GET /api/v1/danh-muc/tree` trả ≥6 LV + `GET /api/v1/don-vi` trả 5 row. Tick checkbox `seed/seed-checklist-QTHT.md` (lazy create khi seed).

---

## Phase 2 — Tier 1 actor (~45 phút)

### 2A — Doanh nghiệp (12 chính + 3 ĐP extension)

| Bước | Việc | Account | Số record |
|:-:|---|---|:-:|
| 2A.1 | 6 DN cấp TW (1 mỗi LV) | cb_nv_tw_01 | 6 |
| 2A.2 | 6 DN cấp ĐP (DN/HN/HP) | cb_nv_dp_01..04 | 6 |
| 2A.3 | 3 DN cấp ĐP-AG/BG/BNI (NEW v2.6.2) | cb_nv_dp_01..03 | 3 |

**Spec:** `dn_variants[1..12]` + `dn_variants_dp_extension[13..15]`.

### 2B — TVV/CG/NHT profile (21 variant)

| Bước | Việc | Account | Số record |
|:-:|---|---|:-:|
| 2B.1 | 6 TVV TW (TVV-BTP-TW-0001..0006) | cb_nv_tw_01 → cb_pd_tw_01 | 6 |
| 2B.2 | 6 CG TW (TVV-BTP-TW-0021..0026) `loai_tvv=CG, la_cong_khai=true` | cb_nv_tw_01 → cb_pd_tw_01 | 6 |
| 2B.3 | 3 NHT ĐP (TVV-AG/DN/HP-0001) `loai_tvv=NHT` | cb_nv_dp_01..03 → cb_pd_dp_01..03 | 3 |

**Spec:** `tvv_variants[1..21]`.

### 2C — Account login mới CG TW + NHT ĐP (CRITICAL — fix gap A5/A3)

| Bước | Việc | Account | Số record |
|:-:|---|---|:-:|
| 2C.1 | QTHT tạo 9 account login | qtht_01 → SCR-VIII-02 [Thêm mới] | 9 |
| 2C.2 | Update FK `TU_VAN_VIEN.tai_khoan_id` cho 9 profile (link username với `link_tvv_variant`) | qtht_01 → CG/TVV → Sửa | 9 |

**Spec:** `cap_tai_khoan_cg_nht_r5` trong fixture (6 CG `cg_tw_01..06` + 3 NHT `nht_ag_01`/`nht_dn_01`/`nht_hp_01`).

**Verify gate Phase 2:** Login `cg_tw_01` → module Tư vấn chuyên sâu → inbox loaded OK (chưa có TVCS — Phase 3 sẽ tạo).

### 2D — Cấu hình phân công (CAU_HINH_PHAN_CONG)

| Bước | Việc | Account | Số record |
|:-:|---|---|:-:|
| 2D.1 | 6 cấu hình phân công TW (mỗi LV → cb_nv_tw_01 ưu tiên 1) | qtht_01 → SCR-VIII-06 | 6 |
| 2D.2 | 6 cấu hình phân công ĐP (mỗi LV → nht ĐP) | qtht_01 | 6 |

---

## Phase 3 — Tier 2 transactional entry state (~60 phút) · cb_nv_tw_01

Tạo entity workflow ở entry state, KHÔNG advance state ở phase này.

| Bước | Entity | Account | Entry state | Số record |
|:-:|---|---|---|:-:|
| 3.1 | Hỏi đáp | cb_nv_tw_01 | `MOI` | 6 |
| 3.2 | Vụ việc | cb_nv_tw_01 | `DA_TIEP_NHAN` | 8 |
| 3.3 | TVCS | cb_nv_tw_01 | `TIEP_NHAN` | 6 |
| 3.4 | HSPL DN | cb_nv_tw_01 | `Hiệu lực` | 6 |
| 3.5 | CTĐT | cb_nv_tw_01 | `Dự thảo` | 6 |
| 3.6 | Khóa học | cb_nv_tw_01 | `Dự thảo` | 8 |
| 3.7 | 4 thư mục + 7 biểu mẫu | cb_nv_tw_01 | `Nháp` | 11 |
| 3.8 | 10 NHCH + 5 ĐKT | cb_nv_tw_01 | `Nháp` | 15 |
| 3.9 | Bài giảng | cb_nv_tw_01 | `Kích hoạt` | 8 |
| 3.10 | Giảng viên | cb_nv_tw_01 | `Đang hoạt động` | 8 |

**Verify gate Phase 3:** GET list mỗi entity trả đúng số record. Tick checkbox `seed/seed-checklist-{module}.md` (lazy create).

---

## Phase 4 — Workflow E2E (~3 giờ) · multi-role

| Trụ | Module | Workflow | Account | Coverage |
|:-:|---|---|---|:-:|
| A | TVV (M3) | A1: Mới ĐK → ĐHĐ → Công khai | cb_nv → cb_pd | 12/12 |
| A | VV (M5) | A3: ĐTN → KT → PC NHT → XL → PD → HT | cb_nv → nht ĐP → cb_pd | 18/18 |
| A | HD (M2) | A4: M → TN → PC → TL → PD → CK → Đóng | cb_nv → cb_pd | 12/12 |
| A | TVCS (M10B) | A5: TN → PC CG → CG CN → HT → PD | cb_nv → cg_tw → cb_pd | 13/13 |
| B | CTĐT/KH (M6) | B2+B7: DT → ĐD → Active → ĐK | cb_nv → cb_pd → giảng viên | 10/10 |
| C | BM (M7) | C1: Nháp → CK → Ẩn | cb_nv | 4/4 |
| D | ĐG HQ (M12) | D2: LKH → PD → PC → Chấm → TH | cb_nv → cb_pd → tvv | 11/11 |
| P3 | TV nhanh (M10A) | P3.2 | cb_nv | 5/5 |
| P3 | Chi trả (M8) | P3.1 | cb_nv → cb_pd → kế toán | 13/13 |
| P3 | CT HTPLDN (M11) | P3.3+P3.4 GĐ1+GĐ2 BC | cb_nv → cb_pd | 18/18 |

**Output:** Mỗi module ≥1 record đến state cuối. Tạo `workflow/workflow-test-report-{MODULE}.md` per template (lazy create).

---

## Phase 5 — Verification (~30 phút)

| Check | Cách verify | Pass khi |
|---|---|---|
| 5.1 | Dashboard KPI counter | Login mỗi role chính | KPI > 0 cho HD/VV/TVCS/CT |
| 5.2 | Cross-module link DN | Detail DN → Tab #2 HSPL + Tab #3 KPI + Tab #4 Chi trả | ≥1 record/tab |
| 5.3 | SLA cảnh báo | Trigger HD/VV quá hạn | Banner cảnh báo hiện |
| 5.4 | BC04 export | Module Báo cáo → BC04 Excel | File có data |
| 5.5 | Audit log | QTHT → Nhật ký HT | ≥100 entry |

---

## Phase 6 — Workflow đầu ra hậu kỳ (~1 tuần) · multi-role

> Mapping R5 P3 — chạy sau Phase 4 + Trụ E unblock. Cascade-block khi upstream chưa state cuối.

| Bước | Workflow | Bước nghiệp vụ | Account | Dep |
|:-:|---|:-:|---|---|
| 6.1 | Chi trả (P3.1) | 13 | cb_nv → cb_pd → kế toán | ≥6 VV HOAN_THANH (A3) + R6.E3 LGSP đẩy record |
| 6.2 | TV nhanh nhập tay (P3.2) | 5 trạng thái | cb_nv | D3 auto-feed TU_DONG ≥3 hoặc QA THU_CONG ≥3 |
| 6.3 | TV nhanh PUBLIC (DN gửi qua Cổng PLQG) | 1 | DN | Defer T4.16 API + R6.E4 unblock |
| 6.4 | CT HTPLDN GĐ1 nhập tay (P3.3) | 11 | cb_nv → cb_pd | R6.E2 BE seed module |
| 6.5 | CT HTPLDN GĐ2 Đợt BC (P3.4) | 7 | cb_nv → cb_pd → TW | 6.4 + 6.1 + ≥6 VV HOAN_THANH |

**Output:** Mỗi workflow ≥1 record state cuối. Tạo `workflow/workflow-test-report-{MODULE}.md` per template.

---

## Phase 7 — Functional 17 module (~1 tuần) · multi-role

> Mapping R5 P4 (T4.1-T4.17). Bỏ happy path (đã cover Phase 4 + 6). Test negative + nhánh phụ + edge + 40 TC phân quyền/module. Per-module dependency.

| Ngày | TC ID | Module | TC count | Dep state | Trạng thái sau Phase 4 |
|:-:|---|---|:-:|---|---|
| 1 | 7.1 | Hỏi đáp | 35 | A4 ✅ + ≥6 HD state cuối | 🟢 sẵn sàng |
| 1 | 7.2 | CG/TVV | 31 | TVV/CG/NHT pool ≥9 ✅ | 🟢 sẵn sàng |
| 1 | 7.3 | Vụ việc | 35 | A3 ✅ + ≥8 VV ✅ | 🟢 sẵn sàng |
| 2 | 7.4 | Doanh nghiệp | 18 | DN seed ≥12 ✅ | 🟢 sẵn sàng |
| 2 | 7.5 | TV chuyên sâu | 44 | A5 PASS đủ 11 bước | 🚫 cascade A5 ⚠️ |
| 2 | 7.6 | Khóa học | 40 | B7 + B2 + B2.5 ✅ | 🚫 cascade B2 spec contradict |
| 3 | 7.7 | Dashboard | 34 | ≥3 record state cuối/module | ⏳ accumulate Phase 4-6 |
| 3 | 7.8 | Quản trị HT | 32 | env + QTHT seed ✅ | 🟢 sẵn sàng |
| 3 | 7.9 | Đánh giá HQ | 40 | D2 unblock R6.4.D1 ✅ | 🟢 sẵn sàng |
| 4 | 7.10 | Biểu mẫu | 38 | C1 ✅ + 7 BM ✅ | 🟢 sẵn sàng |
| 4 | 7.11 | TV nhanh | 39 | 6.2 + D3 ⚠️ | 🚫 cascade |
| 4 | 7.12 | Chi trả | 30 | 6.1 ✅ | 🚫 cascade R6.E3 |
| 5 | 7.13 | Báo cáo | 38 | data state cuối Phase 4-6 | ⏳ accumulate |
| 5 | 7.14 | HĐ tư vấn | 29 | R6.E1 BE seed module | 🚫 cascade R6.E1 |
| 5 | 7.15 | CT HTPLDN | 42 | 6.4 + 6.5 ✅ | 🚫 cascade |
| 5 | 7.16 | API kết nối | 42 | data upstream + 8 API inbound mock | ⏳ accumulate |
| 5 | 7.17 | Edge BR-EC-01..23 | 23 | env + sample data ≥1/module ✅ | 🟢 sẵn sàng |

**Output:** Mỗi module → 1 file `functional/functional-test-report-{MODULE}.md` + `bug-reports/bug-report-functional-{MODULE}.md` nếu có bug. Edge → `edge/edge-test-report-BR-EC.md`.

---

## Account map (verify với users.csv)

| Role | Account | Cấp | Phase |
|---|---|:-:|:-:|
| Admin | `admin` | — | 0 verify |
| QTHT | `qtht_01` | TW | 1, 2C, 2D |
| CB NV TW | `cb_nv_tw_01` | TW | 2A, 2B, 3, 4 |
| CB PD TW | `cb_pd_tw_01` | TW | 2B duyệt, 4 phê duyệt |
| CB NV BN | `cb_nv_bn_01` | BN | 4 (workflow BN nếu có) |
| CB PD BN | `cb_pd_bn_01` | BN | 4 phê duyệt BN |
| CB NV ĐP | `cb_nv_dp_01..04` | ĐP | 2A.2, 2B.3, 4 |
| CB PD ĐP | `cb_pd_dp_01..04` | ĐP | 2B.3 duyệt, 4 phê duyệt |
| **CG TW (mới)** | `cg_tw_01..06` | TW | **4 A5 (CG Chấp nhận TVCS), B7 (CG giảng)** — Phase 2C tạo |
| **NHT ĐP (mới)** | `nht_ag_01`, `nht_dn_01`, `nht_hp_01` | ĐP | **4 A3 (NHT phân công VV)** — Phase 2C tạo |
| TVV (csv cũ) | `tvv_01..03` | ĐP | 4 phân công VV scope ĐP |
| DN | `dn_01..03` | ĐP | 4 (DN gửi HD/VV public form — defer T4.16 API) |

**KHÔNG dùng:** account legacy có suffix `_tw_2/_tw_3/_tw_4/_tw_5` — đã đổi convention sang `_01/_02/_03` (memory `qa_htpldn_accounts_convention`).

---

## File trong Round 6 (lazy create)

Folder structure đã sẵn (`seed/`, `workflow/`, `functional/`, `bug-reports/`, `edge/`, `regression/`, `chi-tiet/`, `smoke-test/`, `nonfunc/`, `design-review/`, `evidence/`, `screenshots/`).

File chỉ tạo khi tester thực sự bắt đầu seed/test module đó. Template tham chiếu:
- Seed checklist template: [`../../template/seed-checklist-template.md`](../../template/seed-checklist-template.md)
- Workflow report template: [`../../template/workflow-test-report-template.md`](../../template/workflow-test-report-template.md)
- Bug report template: [`../../template/bug-report-template.md`](../../template/bug-report-template.md)

---

## Quy ước Round 6

- **R6 phase 1-3 = Re-seed** — tester tick checkbox seed-checklist sau khi seed mỗi module.
- **R6 phase 4 = Workflow E2E** — log bug app nếu phát hiện. Bug ID format: `BUG-FLOW-{MODULE}-NN`.
- **R6 phase 5 = Verify** — cross-check toàn hệ thống.
- Round 5 bug đã closed → KHÔNG copy sang R6 trừ khi re-confirm bug Open vẫn còn (phải re-test sau seed).

---

*Round 6 README created: 2026-05-01 sau dev reset DB | QA Automation via Claude Code*
