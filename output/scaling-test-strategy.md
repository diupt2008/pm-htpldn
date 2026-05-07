# Chiến lược Mở rộng Kiểm thử khi Thêm Module

## PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp

**Ngày lập:** 2026-04-16 (cập nhật cho test-strategy v3.0: 2026-04-23)
**Phiên bản:** 1.1
**Bổ sung cho:** [test-strategy.md](test-strategy.md) v3.0
**Bối cảnh:** Hiện tại đã test 6/16 module (86/188 FR). Khi các module còn lại được triển khai, cần chiến lược mở rộng có hệ thống.

> **v1.1 change (2026-04-23):** Align với test-strategy v3.0 — Bước 5 "Chuẩn bị data" tách thành **Seed fixture (pure, entry state)** + **Workflow test (full SM)** riêng biệt. §6 Data Management reference `seed-fixture.yaml` thay vì self-describe 4 tier.

---

## Mục lục

| Section | Nội dung |
|---------|---------|
| §1 | [Bức tranh toàn cảnh — 16 module](#1-bức-tranh-toàn-cảnh--16-module) |
| §2 | [Nguyên tắc mở rộng](#2-nguyên-tắc-mở-rộng) |
| §3 | [Phân nhóm module theo độ phức tạp & phụ thuộc](#3-phân-nhóm-module-theo-độ-phức-tạp--phụ-thuộc) |
| §4 | [Quy trình onboard module mới](#4-quy-trình-onboard-module-mới--module-onboarding-checklist) |
| §5 | [Chiến lược Regression khi thêm module](#5-chiến-lược-regression-khi-thêm-module) |
| §6 | [Quản lý dữ liệu test ở quy mô lớn](#6-quản-lý-dữ-liệu-test-ở-quy-mô-lớn) |
| §7 | [Chiến lược phân quyền mở rộng](#7-chiến-lược-phân-quyền-mở-rộng) |
| §8 | [Risk-Based Testing — Ưu tiên khi tài nguyên hạn chế](#8-risk-based-testing--ưu-tiên-khi-tài-nguyên-hạn-chế) |
| §9 | [Chiến lược tự động hóa tiệm tiến](#9-chiến-lược-tự-động-hóa-tiệm-tiến) |
| §10 | [Timeline mở rộng — Lộ trình 10 module còn lại](#10-timeline-mở-rộng--lộ-trình-10-module-còn-lại) |
| §11 | [Metrics & Dashboard theo dõi chất lượng](#11-metrics--dashboard-theo-dõi-chất-lượng) |
| §12 | [Template — Module Test Sheet](#12-template--module-test-sheet) |

---

## 1. Bức tranh toàn cảnh — 16 module

### 1.1 Inventory toàn bộ module

| # | Module | SRS File | UC Range | Số FR ước | Trạng thái | Đợt test |
|---|--------|----------|----------|-----------|------------|----------|
| 1 | Quản trị Hệ thống | srs-fr-10 | UC 99-119, 191-194 | 25 | **DA TEST** | Đợt 1 |
| 2 | Hỏi đáp Pháp lý | srs-fr-02 | UC 10-19 | 13 | **DA TEST** | Đợt 1 |
| 3 | Chuyên gia/TVV | srs-fr-04 | UC 39-50 | 13 | **DA TEST** | Đợt 1 |
| 4 | Vụ việc HTPL | srs-fr-05 | UC 51-67 | 19 | **DA TEST** | Đợt 1 |
| 5 | Chi trả Chi phí ✏️ v3.5 | srs-fr-06 | UC 68-80 + GAP | 14 | **DA TEST + PREP v3.5 DONE** (35 TC, 11 paths SM, +2 entity owned, BLOCKED LGSP) | Đợt 1 |
| 6 | Doanh nghiệp | srs-fr-07 | UC 81-82 | 3 | **DA TEST** | Đợt 1 |
| 7 | Dashboard | srs-fr-01 | UC 1-9 | ~9 | Chờ triển khai | Đợt 2 |
| 8 | Đào tạo, Tập huấn | srs-fr-03 | UC 20-38 | ~19 | Chờ triển khai | Đợt 2 |
| 9 | Đánh giá Hiệu quả | srs-fr-08 | UC 83-90 | ~8 | Chờ triển khai | Đợt 3 |
| 10 | Biểu mẫu, Hợp đồng | srs-fr-09 | UC 91-98 | ~8 | Chờ triển khai | Đợt 2 |
| 11 | Báo cáo Thống kê | srs-fr-11 | UC 124-145 | ~22 | Chờ triển khai | Đợt 3 |
| 12 | TV Chuyên sâu | srs-fr-12 | UC 146-160 | ~15 | Chờ triển khai | Đợt 3 |
| 13 | TV Nhanh | srs-fr-13 | UC 161-170 | ~10 | Chờ triển khai | Đợt 2 |
| 14 | Hợp đồng TV | srs-fr-14 | UC 171-180 | ~10 | Chờ triển khai | Đợt 3 |
| 15 | CT HTPLDN | srs-fr-15 | UC 181-190 | ~10 | Chờ triển khai | Đợt 3 |
| 16 | API Kết nối | srs-fr-16 | (integration) | ~13 | Chờ hạ tầng | Đợt 4 |
| **Tổng** | | | **188 UC** | **~188 FR** | | |

### 1.2 Tỷ lệ coverage hiện tại vs. mục tiêu

```
Hiện tại (Đợt 1):        ████████░░░░░░░░  6/16 module  |  86/188 FR  |  182 TC
Mục tiêu (Full):         ████████████████  16/16 module |  188/188 FR |  ~550+ TC
Phân quyền hiện tại:     ████░░░░░░░░░░░░  ~550/~1500 TC ước
```

---

## 2. Nguyên tắc mở rộng

### 2.1 Năm nguyên tắc cốt lõi

```
┌──────────────────────────────────────────────────────────────────┐
│                  5 NGUYÊN TẮC MỞ RỘNG TEST                      │
│                                                                   │
│  1. INCREMENTAL, NOT BIG-BANG                                    │
│     Thêm từng module, không chờ tất cả xong mới test.            │
│     Mỗi module mới = 1 test cycle hoàn chỉnh.                   │
│                                                                   │
│  2. REGRESSION FIRST                                              │
│     Mỗi khi thêm module → chạy regression 6 module cũ TRƯỚC.    │
│     Module mới có thể phá module cũ (shared DB, shared API).     │
│                                                                   │
│  3. DEPENDENCY-AWARE                                              │
│     Không test module con khi module cha chưa stable.             │
│     Ví dụ: Báo cáo phụ thuộc data từ VV + Chi trả + DN.         │
│                                                                   │
│  4. RISK-BASED PRIORITIZATION                                     │
│     Không phải mọi module đều cần test depth như nhau.            │
│     Module có workflow phức tạp → test sâu hơn module CRUD.      │
│                                                                   │
│  5. AUTOMATE THE STABLE, MANUAL THE NEW                           │
│     Module cũ đã stable → automate regression.                    │
│     Module mới → manual exploration trước, automate sau.          │
└──────────────────────────────────────────────────────────────────┘
```

### 2.2 Công thức ước lượng TC cho module mới

Dựa trên pattern đã quan sát từ 6 module đợt 1:

| Loại module | Avg TC/FR | Ví dụ | Công thức ước |
|-------------|-----------|-------|---------------|
| CRUD đơn giản | ~5-6 TC/FR | Doanh nghiệp (18 TC / 3 FR) | FR × 6 |
| Workflow trung bình | ~2.5-3 TC/FR | Hỏi đáp (36 TC / 13 FR) | FR × 3 |
| Workflow phức tạp | ~1.8-2 TC/FR | Vụ việc (35 TC / 19 FR) | FR × 2 + SM paths |
| Read-only / Báo cáo | ~2 TC/FR | Dashboard, Báo cáo | FR × 2 |
| API / Integration | ~3 TC/FR | API Kết nối | FR × 3 (+ contract tests) |

**Ước lượng tổng:** ~550-600 TC functional + ~1500 TC phân quyền khi full 16 module.

---

## 3. Phân nhóm module theo độ phức tạp & phụ thuộc

### 3.1 Dependency Graph — Module nào phụ thuộc module nào

```
Layer 0: Foundation (ĐÃ TEST)
├── Quản trị HT (auth, danh mục, tài khoản)
└── Doanh nghiệp (master data)

Layer 1: Core Business (ĐÃ TEST)
├── Hỏi đáp PL ←── Quản trị HT
├── CG/TVV ←── Quản trị HT + DN
└── Vụ việc ←── DN + TVV

Layer 2: Financial (ĐÃ TEST)
└── Chi trả ←── Vụ việc + DN

Layer 3: Extended Business (CHƯA TEST)
├── Đào tạo, Tập huấn ←── Quản trị HT + DN (+ có thể TVV)
├── Biểu mẫu, Hợp đồng ←── Quản trị HT (standalone)
├── TV Nhanh ←── Quản trị HT + DN + TVV
└── Dashboard ←── ALL modules (aggregate data)

Layer 4: Advanced Workflows (CHƯA TEST)
├── TV Chuyên sâu ←── TVV + DN + Vụ việc
├── Hợp đồng TV ←── TVV + DN
├── CT HTPLDN ←── DN + Vụ việc + Chi trả
└── Đánh giá Hiệu quả ←── Vụ việc + Chi trả + TVV

Layer 5: Reporting & Integration (CHƯA TEST)
├── Báo cáo Thống kê ←── ALL modules (read-only aggregation)
└── API Kết nối ←── ALL modules (external interface)
```

### 3.2 Ma trận phức tạp — Phân loại module mới

| Module mới | Complexity | Có SM? | Cross-module deps | Ước TC | Risk |
|------------|-----------|--------|-------------------|--------|------|
| Dashboard | Thấp | Không | Cao (đọc từ tất cả) | ~18 | Trung bình |
| Đào tạo | Trung bình | Có thể | Trung bình | ~57 | Trung bình |
| Biểu mẫu | Thấp | Không | Thấp (standalone) | ~16 | Thấp |
| TV Nhanh | Trung bình | Có thể | Trung bình | ~30 | Trung bình |
| TV Chuyên sâu | Cao | Có | Cao | ~45 | Cao |
| Hợp đồng TV | Cao | Có | Cao | ~30 | Cao |
| CT HTPLDN | Cao | Có | Rất cao | ~30 | Cao |
| Đánh giá | Trung bình | Không | Cao | ~24 | Trung bình |
| Báo cáo | Trung bình | Không | Rất cao (read-all) | ~44 | Trung bình |
| API Kết nối | Cao | Không | Rất cao (gateway) | ~39 | Rất cao |
| **Tổng ước** | | | | **~333** | |

---

## 4. Quy trình Onboard Module mới — Module Onboarding Checklist

### 4.1 Quy trình 7 bước cho mỗi module mới

Khi một module mới được triển khai lên môi trường test, thực hiện tuần tự:

```
┌──────────────────────────────────────────────────────────────────────┐
│          QUY TRÌNH ONBOARD MODULE MỚI (7 BƯỚC)                      │
│                                                                       │
│  Bước 1: ĐÁNH GIÁ SẴN SÀNG (1 ngày)                                │
│  ├── [ ] Module đã deploy lên test env?                              │
│  ├── [ ] Đọc SRS file tương ứng (srs-fr-XX.md)                      │
│  ├── [ ] Xác định UC range + số FR                                   │
│  ├── [ ] Xác định dependencies → module cha đã stable?               │
│  ├── [ ] Xác định State Machine (nếu có)                             │
│  └── [ ] Xác định roles liên quan (từ permission-matrix.md)          │
│                                                                       │
│  Bước 2: REGRESSION CÁC MODULE CŨ (1 ngày)                          │
│  ├── [ ] Chạy Smoke Test 6+ module đã test → tất cả PASS?           │
│  ├── [ ] Nếu có FAIL → fix trước khi test module mới                 │
│  └── [ ] Ghi nhận: regression-round-X.md                             │
│                                                                       │
│  Bước 3: PHÂN TÍCH MODULE MỚI (1 ngày)                              │
│  ├── [ ] Tạo Module Test Sheet (dùng Template §12)                   │
│  ├── [ ] Vẽ State Machine diagram (nếu có workflow)                  │
│  ├── [ ] Liệt kê BR liên quan (grep SRS Phụ lục B + ≥2 sibling)     │
│  ├── [ ] Map entities → roles (từ permission-matrix.md)              │
│  ├── [ ] Xác định cross-module integration points                    │
│  └── [ ] BA/PO sign-off test plan trước khi sang Bước 4              │
│                                                                       │
│  Bước 4: VIẾT TEST CASES (1-2 ngày)                                 │
│  ├── [ ] Viết TC theo cấu trúc đã chuẩn hóa (§4.2)                 │
│  ├── [ ] Đảm bảo coverage: Happy + Negative + Workflow + Auth        │
│  ├── [ ] Assign P0/P1/P2 theo risk                                   │
│  └── [ ] Review TC → đảm bảo không thiếu edge case                  │
│                                                                       │
│  Bước 5a: PURE SEED (0.5 ngày) — GĐ 1 per test-strategy v3.0       │
│  ├── [ ] Check Tier dependencies (entity-map.md + seed-fixture.yaml)│
│  ├── [ ] Chạy 6 variant từ seed-fixture.yaml (entry state only)     │
│  ├── [ ] KHÔNG advance workflow, KHÔNG switch account              │
│  └── [ ] Output: seed-checklist-{module}.md (3 cột Variant/Y/ID)    │
│                                                                       │
│  Bước 5b: WORKFLOW TEST (0.5-1 ngày) — GĐ 2 per test-strategy v3.0 │
│  ├── [ ] Chạy bảng flow-module.md Bước 1→N (happy path)             │
│  ├── [ ] Test reject branches + auto-transition + timeout            │
│  ├── [ ] 4 preset E2E P1/P2/P3/P4 khi cần phủ tab downstream        │
│  └── [ ] Output: workflow-test-report-{module}.md                    │
│                                                                       │
│  Bước 6: FUNCTIONAL + AUTH + EDGE (1-2 ngày) — GĐ 3                │
│  ├── [ ] Functional negative + edge (happy SKIP — đã cover B5b)     │
│  ├── [ ] Authorization (role × entity per permission-matrix.md)      │
│  ├── [ ] Cross-module integration                                    │
│  ├── [ ] UI/UX /design-review so Prototype                           │
│  └── [ ] Ghi nhận: functional-test-report-{module}.md               │
│                                                                       │
│  Bước 7: BÁO CÁO & CẬP NHẬT (0.5 ngày)                            │
│  ├── [ ] Tổng hợp Pass/Fail + evidence (screenshots)                │
│  ├── [ ] Bug report với severity classification                      │
│  ├── [ ] Cập nhật test-strategy.md (thêm module vào §7)             │
│  ├── [ ] Cập nhật permission-matrix.md (nếu có entity mới)          │
│  └── [ ] Cập nhật dependency graph (§3.1)                            │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2 Cấu trúc chuẩn hóa Test Cases cho module mới

Mỗi module mới **BẮT BUỘC** có đủ 5 nhóm TC:

| # | Nhóm TC | Naming Pattern | Phase | Mô tả | % coverage tối thiểu |
|---|---------|---------------|-------|-------|---------------------|
| 1 | Happy Path | `TP-{SM}-XX` (từ flow-module.md) | **GĐ 2 Workflow** | Luồng chính thành công — bảng flow Bước 1→N | 100% FR có workflow phải có happy path |
| 2 | Workflow branches | `TP-{SM}-XX` (reject/auto/timeout) | **GĐ 2 Workflow** | State transitions branches (reject, auto-transition, timeout) | 100% transitions + 100% reject points |
| 3 | Negative | `{MOD}-0XX` | GĐ 3 Functional | Input sai, vi phạm ràng buộc | ≥1 negative per FR có input |
| 4 | Edge | `{MOD}-0XX` (Edge) | GĐ 3 Functional | BVA, XSS, optimistic lock, concurrent | 100% BR-EC-* áp dụng module |
| 5 | Authorization | `{MOD}-0XX` (Auth) | GĐ 3 Auth | Role × Entity per module | ≥1 positive + 1 negative per role |
| 6 | Cross-module | `{MOD}-0XX` (Cross) | GĐ 3 Cross | Liên kết với module khác | Mỗi integration point ≥1 TC |

> **v3.0 change:** Happy Path + Workflow gộp vào GĐ 2 (workflow-test-report, input = `flow-module.md`). GĐ 3 Functional chỉ còn negative + edge + auth + cross. `funtion/7.X-*.md` per-module file chứa TC chi tiết field-level cho GĐ 3.

**TC ID convention mở rộng:**

| Module | Prefix | Ví dụ |
|--------|--------|-------|
| Dashboard | `DB-` | DB-001, DB-002 |
| Đào tạo | `DT-` | DT-001, DT-002 |
| Biểu mẫu | `BM-` | BM-001, BM-002 |
| Báo cáo | `BC-` | BC-001, BC-002 |
| TV Chuyên sâu | `TVCS-` | TVCS-001 |
| TV Nhanh | `TVN-` | TVN-001 |
| Hợp đồng TV | `HDTV-` | HDTV-001 |
| CT HTPLDN | `CTHT-` | CTHT-001 |
| Đánh giá | `DG-` | DG-001 |
| API Kết nối | `API-` | API-001 |

---

## 5. Chiến lược Regression khi thêm module

### 5.1 Regression Pyramid

```
                    ┌───────────────┐
                    │  FULL SUITE   │  Chạy: Trước release, cuối sprint
                    │  (~550+ TC)   │  Thời gian: 5-7 ngày
                    │  Manual/Auto  │
                    ├───────────────┤
                  ┌─┤ SMOKE + P0   ├─┐  Chạy: Mỗi khi thêm module mới
                  │ │  (~64+ TC)    │ │  Thời gian: 1 ngày
                  │ │  Auto first   │ │
                  ├─┼───────────────┼─┤
                ┌─┤ │CORE WORKFLOW │ ├─┐  Chạy: Hàng tuần
                │ │ │  (5+ SM ×    │ │ │  Thời gian: 0.5 ngày
                │ │ │  happy path) │ │ │
                ├─┼─┼──────────────┼─┼─┤
              ┌─┤ │ │  HEALTH     │ │ ├─┐  Chạy: Hàng ngày (auto)
              │ │ │ │  CHECK      │ │ │ │  Thời gian: 15 phút
              │ │ │ │  (login +   │ │ │ │
              │ │ │ │  6 modules  │ │ │ │
              │ │ │ │  load)      │ │ │ │
              └─┴─┴─┴─────────────┴─┴─┴─┘
```

### 5.2 Regression Trigger Matrix

| Sự kiện | Health Check | Smoke+P0 | Core Workflow | Full Suite |
|---------|:-----------:|:--------:|:-------------:|:----------:|
| Deploy module mới | **V** | **V** | **V** | |
| Hotfix module cũ | **V** | **V** | | |
| Hàng ngày (auto) | **V** | | | |
| Hàng tuần | **V** | **V** | **V** | |
| Trước release | **V** | **V** | **V** | **V** |
| Sau DB migration | **V** | **V** | **V** | |
| Thay đổi phân quyền | **V** | | | Chỉ Auth TC |

### 5.3 Impact Analysis — Module mới ảnh hưởng module cũ

Khi thêm module mới, xác định **blast radius** trước:

```
Module mới: Báo cáo Thống kê
├── Đọc data từ: VV, Chi trả, DN, Hỏi đáp, TVV → Regression 5 module
├── Shared components: Danh mục, Pagination, Export Excel
├── Shared DB tables: có thể thêm view/index → check performance
└── Regression scope: Smoke Test 5 module + P0 Workflow tests
```

**Template đánh giá blast radius:**

| Tiêu chí | Check | Nếu YES → Regression scope |
|-----------|:-----:|---------------------------|
| Module mới đọc data module cũ? | [ ] | Smoke + data integrity module cũ |
| Module mới share DB table? | [ ] | Full P0 module cũ liên quan |
| Module mới thêm API endpoint? | [ ] | Auth + Security regression |
| Module mới thay đổi shared component? | [ ] | UI regression tất cả module |
| Module mới thêm role/permission? | [ ] | Full Auth matrix regression |

---

## 6. Quản lý dữ liệu test ở quy mô lớn

### 6.1 Vấn đề data ở scale 16 module

Khi từ 6 → 16 module, data test phức tạp hơn rất nhiều:

| Vấn đề | Mô tả | Giải pháp |
|--------|-------|-----------|
| Data collision | Nhiều module dùng chung DN, TVV → test module A phá data module B | Prefix naming: `TEST_{MODULE}_{ID}` |
| State dependency chain dài | VV cần DN + TVV + Danh mục + ... | Seed data script / data snapshot |
| Data rot | Data cũ bị outdated sau nhiều lần test | Reset schedule hàng tuần |
| Orphan data | Xóa DN nhưng VV vẫn reference | Test integrity constraints |

### 6.2 Data Management Strategy (v3.0)

**Single source of truth (2026-04-23):** [`input/data/seed-fixture.yaml`](../input/data/seed-fixture.yaml) — 6 variants/entity × 18 entity, Tier 0 → 4, field values khớp SRS Inputs. Không còn 4 tầng tự quản lý.

```
┌─────────────────────────────────────────────────────────────────┐
│          DATA SOURCE PRIORITY (v3.0)                            │
│                                                                   │
│  1. input/data/seed-fixture.yaml      ← Pure seed (GĐ 1)        │
│     ├── Tier 0 prereq: DANH_MUC + DON_VI + TAI_KHOAN            │
│     ├── Tier 1: DN + TVV                                         │
│     ├── Tier 2: VV + Hỏi đáp + TVCS + Khóa học                  │
│     ├── Tier 3: HĐ TV + Đánh giá + Kho Q&A                      │
│     └── Tier 4: CT HTPLDN + Báo cáo + Dashboard                 │
│                                                                   │
│  2. input/flow-module.md Phụ lục 2    ← Workflow preset (GĐ 2)  │
│     ├── P1 — DN detail đầy đủ 3 tab                             │
│     ├── P2 — TVV detail Lịch sử hỗ trợ                          │
│     ├── P3 — Chi trả E2E (BLOCKED chờ LGSP)                     │
│     └── P4 — Đánh giá HQ đủ mẫu                                 │
│                                                                   │
│  3. input/data/entity-map.md          ← Cross-map (Tạo/Đọc)     │
│                                                                   │
│  4. test data file đính kèm           ← Non-workflow             │
│     ├── File Excel import DN (3 file: hợp lệ / format / MST)   │
│     └── File đính kèm PDF/DOCX (test upload)                    │
└─────────────────────────────────────────────────────────────────┘
```

> **Migration note:** 4-tier self-described model cũ (Seed Baseline / Module-specific / Edge / Cross-module) đã deprecated. Mọi logic phân loại đã gộp vào fixture + flow-module. Edge case data (DN gần trần chi trả, TVV nhiều VV) — tạo ad-hoc ở GĐ 3 Functional, không quản lý ở data layer.

### 6.3 Data Snapshot & Restore

Khi đã có >10 module, chuẩn bị data tốn nhiều thời gian. Giải pháp:

| Phương pháp | Khi nào dùng | Cách thực hiện |
|-------------|-------------|----------------|
| **DB Snapshot** | Trước mỗi test cycle lớn | Export DB → restore khi cần clean slate |
| **API Seed Script** | Automated regression | Script tạo data qua API → idempotent |
| **Manual Walkthrough** | Module mới lần đầu | Walk workflow theo SM (như §7.0 hiện tại) |
| **Data Factory** | Khi có >12 module | Script generate data theo template |

---

## 7. Chiến lược phân quyền mở rộng

### 7.1 Quy mô phân quyền ở 16 module

| Metric | 6 module (hiện tại) | 16 module (mục tiêu) | Tăng |
|--------|:-------------------:|:--------------------:|:----:|
| Entity in-scope | 27 | ~49 | 1.8× |
| Roles | 11 | 11 (không đổi) | — |
| Permission cells | ~550 | ~1500 | 2.7× |
| Data isolation TCs | 9 | ~25 | 2.8× |

### 7.2 Phương pháp test phân quyền tiệm tiến

**KHÔNG test 1500 TC phân quyền một lần.** Chia thành 3 tầng:

```
Tầng 1: SMOKE AUTH (chạy cùng functional test — mỗi module)
├── Mỗi module: 3-5 TC auth cơ bản
├── Positive: role chính → thấy menu + CRUD
├── Negative: role không liên quan → ẩn menu
└── Coverage: ~35-50 TC cho 16 module

Tầng 2: MATRIX AUTH (chạy sau functional — per module batch)
├── Entity × Role matrix per module
├── Test CRUD per cell: Create/Read/Update/Delete
├── Data scope: TW/BN/DP filter
└── Coverage: ~1500 TC chia theo batches

Tầng 3: CROSS-MODULE AUTH (chạy cuối — integration)
├── User A tạo ở module X → User B xử lý ở module Y
├── Data isolation ngang cấp (DI-01 → DI-09 mở rộng)
├── URL direct access cross-module
└── Coverage: ~50 TC
```

### 7.3 Kỹ thuật tối ưu test phân quyền ở scale

| Kỹ thuật | Mô tả | Tiết kiệm |
|----------|-------|-----------|
| **Equivalence Partitioning** | TW/BN/ĐP cùng behavior → test 1 đại diện + 1 boundary | ~40% TC |
| **Pairwise Testing** | 11 role × 49 entity = 539 cell, pairwise → ~120 cell | ~78% TC |
| **Risk-based Sampling** | Chỉ full test entity có permission phức tạp (mixed CRUD) | ~50% TC |
| **Automated Matrix Check** | Script login mỗi role → check menu visibility | Regression 15min |

---

## 8. Risk-Based Testing — Ưu tiên khi tài nguyên hạn chế

### 8.1 Risk Scoring Framework

Mỗi module được chấm điểm risk (1-5) trên 4 tiêu chí:

| Tiêu chí | Trọng số | Giải thích |
|-----------|---------|------------|
| **Business Impact** | 40% | Lỗi ở module này ảnh hưởng nghiệp vụ đến đâu? |
| **Complexity** | 25% | Có bao nhiêu SM, BR, cross-module deps? |
| **User Frequency** | 20% | Bao nhiêu user dùng module này hàng ngày? |
| **Change Frequency** | 15% | Module này thay đổi code thường xuyên không? |

### 8.2 Risk Score cho 10 module mới

| Module | Business Impact | Complexity | User Freq | Change Freq | **Risk Score** | **Test Depth** |
|--------|:-:|:-:|:-:|:-:|:-:|---|
| Dashboard | 2 | 2 | 5 | 3 | **2.75** | Shallow |
| Đào tạo | 3 | 3 | 3 | 3 | **3.00** | Medium |
| Biểu mẫu | 2 | 1 | 3 | 2 | **2.05** | Shallow |
| TV Nhanh | 4 | 3 | 4 | 3 | **3.65** | Medium-Deep |
| TV Chuyên sâu | 5 | 5 | 3 | 3 | **4.30** | Deep |
| Hợp đồng TV | 5 | 4 | 3 | 2 | **3.95** | Deep |
| CT HTPLDN | 5 | 4 | 2 | 2 | **3.70** | Deep |
| Đánh giá | 3 | 2 | 3 | 2 | **2.65** | Shallow-Medium |
| Báo cáo | 4 | 3 | 4 | 3 | **3.60** | Medium-Deep |
| API Kết nối | 5 | 5 | 2 | 4 | **4.30** | Deep |

### 8.3 Test Depth theo Risk Score

| Risk Score | Test Depth | Mô tả | % TC chạy |
|:----------:|-----------|-------|:---------:|
| 1.0 - 2.5 | **Shallow** | Smoke + Happy path + P0 auth | ~40% TC |
| 2.5 - 3.5 | **Medium** | + Negative + Workflow + P1 auth | ~70% TC |
| 3.5 - 4.0 | **Medium-Deep** | + Edge case + Cross-module + Full SM | ~85% TC |
| 4.0 - 5.0 | **Deep** | + Full auth matrix + Security + Performance | ~100% TC |

**Khi tài nguyên hạn chế:** Chỉ chạy **Deep** cho Risk >= 4.0, **Medium** cho 3.0-3.9, **Shallow** cho <3.0. Tiết kiệm ~40% effort mà vẫn cover >90% risk.

---

## 9. Chiến lược tự động hóa tiệm tiến

### 9.1 Automation Roadmap

```
Phase 1: HIỆN TẠI (6 module) — Manual + Claude Code
├── /browse: Smoke test hàng ngày
├── /qa-only: Functional test per module
└── Manual: Auth + Cross-module

Phase 2: 10 MODULE — Semi-automated
├── Automated: Health check script (login + menu check 10 module)
├── Automated: Auth matrix script (login 11 role → check visibility)
├── /browse + /qa: Functional test module mới
└── Manual: Complex workflow + edge case

Phase 3: 14 MODULE — Hybrid
├── Playwright/Cypress: Regression suite P0 (64+ TC → automated)
├── Playwright/Cypress: Core workflow happy paths (5+ SM)
├── Postman/Bruno: API module full automation
├── /browse + /qa: Module mới + exploratory
└── Manual: Đánh giá chủ quan (UX, flow hợp lý?)

Phase 4: 16 MODULE (FULL) — Automation-first
├── CI/CD: Smoke + P0 chạy mỗi deploy
├── Nightly: Full regression suite
├── Manual: Exploratory testing + edge cases
└── /browse: Quick verification + bug repro
```

### 9.2 ROI Analysis — Nên automate TC nào?

| Tiêu chí | Nên automate | Giữ manual |
|-----------|:---:|:---:|
| Chạy lặp >3 lần/tuần | **V** | |
| Stable, ít thay đổi | **V** | |
| Data-driven (nhiều input combo) | **V** | |
| Mới deploy, đang thay đổi | | **V** |
| Cần đánh giá UX/visual | | **V** |
| Workflow phức tạp, nhiều bước | **V** (sau khi stable) | **V** (ban đầu) |
| Auth matrix (login × check) | **V** | |

### 9.3 Automation Priority Queue

| Ưu tiên | Nhóm TC | Số TC ước | ROI | Effort |
|:-------:|---------|:---------:|:---:|:------:|
| 1 | Health check (login + load 16 module) | 16 | Rất cao | Thấp |
| 2 | Auth matrix (11 role × menu visibility) | ~160 | Rất cao | Trung bình |
| 3 | Core SM happy paths (5+ SM × 1 path) | ~25 | Cao | Trung bình |
| 4 | P0 functional regression | ~64 | Cao | Cao |
| 5 | API contract tests | ~40 | Cao | Trung bình |
| 6 | Data validation (input boundary) | ~80 | Trung bình | Cao |

---

## 10. Timeline mở rộng — Lộ trình 10 module còn lại

### 10.1 Đợt triển khai đề xuất

```
Đợt 2 (Tuần 6-9): Extended Business — 4 module đơn giản/trung bình
├── Tuần 6: Dashboard (DB) + Biểu mẫu (BM)
│   ├── 2 module ít dependency, test nhanh
│   ├── Dashboard cần data từ 6 module cũ → regression trước
│   └── Ước: ~34 TC, 3 ngày test
│
├── Tuần 7: Đào tạo Tập huấn (DT)
│   ├── Module trung bình, có thể có workflow
│   ├── Dependency: Quản trị HT + DN
│   └── Ước: ~57 TC, 4 ngày test
│
├── Tuần 8: TV Nhanh (TVN)
│   ├── Module trung bình, có workflow tư vấn
│   ├── Dependency: TVV + DN
│   └── Ước: ~30 TC, 3 ngày test
│
└── Tuần 9: Regression đợt 2 + Bug fix
    ├── Regression: Smoke + P0 cho 10 module
    └── Fix bugs found in Đợt 2

Đợt 3 (Tuần 10-14): Advanced Workflows — 5 module phức tạp
├── Tuần 10: TV Chuyên sâu (TVCS)
│   ├── Risk cao, workflow phức tạp
│   ├── Dependency: TVV + DN + VV
│   └── Ước: ~45 TC, 4 ngày test
│
├── Tuần 11: Hợp đồng TV (HDTV) + CT HTPLDN (CTHT)
│   ├── 2 module liên quan chặt chẽ
│   ├── Dependency: TVV + DN + VV + Chi trả
│   └── Ước: ~60 TC, 5 ngày test
│
├── Tuần 12: Đánh giá Hiệu quả (DG) + Báo cáo (BC)
│   ├── Read-heavy, phụ thuộc data từ nhiều module
│   ├── Test data aggregation accuracy
│   └── Ước: ~68 TC, 5 ngày test
│
├── Tuần 13: Full Auth Matrix 16 module
│   ├── ~1500 TC phân quyền (pairwise → ~400 TC)
│   └── 3-4 ngày nếu semi-automated
│
└── Tuần 14: Regression đợt 3 + Bug fix

Đợt 4 (Tuần 15-17): Integration & API
├── Tuần 15: API Kết nối (API-016)
│   ├── Risk rất cao, cần hạ tầng LGSP/NDXP/VNeID
│   ├── Test contract, auth, rate limit, error handling
│   └── Ước: ~39 TC, 4 ngày test
│
├── Tuần 16: Full Integration Test (16 module)
│   ├── Cross-module flows end-to-end
│   ├── Data integrity across modules
│   └── Ước: ~50 TC, 3 ngày test
│
└── Tuần 17: Final Regression + Performance + Security
    ├── Full suite regression (~550+ TC)
    ├── Performance baseline (response < 3s)
    ├── Security scan (OWASP ZAP)
    └── Final report
```

### 10.2 Tổng hợp effort ước lượng

| Đợt | Modules | TC ước | Ngày test | Ngày regression | Tổng |
|:---:|---------|:------:|:---------:|:---------------:|:----:|
| 1 (đã xong) | 6 | 182 | 15 | 5 | 20 ngày |
| 2 | 4 | ~121 | 13 | 5 | 18 ngày |
| 3 | 5 + Full Auth | ~173 + ~400 | 14 + 4 | 5 | 23 ngày |
| 4 | 1 + Integration | ~89 | 7 | 5 | 12 ngày |
| **Tổng** | **16** | **~965** | **53** | **20** | **~73 ngày** |

---

## 11. Metrics & Dashboard theo dõi chất lượng

### 11.1 KPIs theo dõi

| # | Metric | Công thức | Target | Đo khi nào |
|---|--------|----------|--------|------------|
| 1 | **Module Coverage** | Modules tested / Total modules | 100% khi full | Mỗi đợt |
| 2 | **FR Coverage** | FRs tested / Total FRs | 100% | Mỗi đợt |
| 3 | **TC Pass Rate (P0)** | P0 PASS / Total P0 | 100% | Mỗi cycle |
| 4 | **TC Pass Rate (P1)** | P1 PASS / Total P1 | ≥90% | Mỗi cycle |
| 5 | **Regression Pass Rate** | Regression PASS / Total regression | ≥98% | Mỗi regression |
| 6 | **Bug Escape Rate** | Bugs found post-release / Total bugs | <5% | Post-release |
| 7 | **Auth Matrix Coverage** | Cells tested / Total cells | ≥80% (pairwise) | Mỗi đợt |
| 8 | **SM Path Coverage** | Paths tested / Total SM paths | 100% happy, ≥80% alt | Mỗi cycle |
| 9 | **Avg Bugs/Module** | Total bugs / Modules tested | Tracking trend | Mỗi đợt |
| 10 | **Bug Fix Turnaround** | Avg days to fix Critical+ | <3 ngày | Liên tục |

### 11.2 Dashboard Template

```
╔══════════════════════════════════════════════════════════════════╗
║              PM HTPLDN — QA DASHBOARD                            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  MODULE COVERAGE:  ██████████░░░░░░  10/16 (62.5%)              ║
║  FR COVERAGE:      ████████████░░░░  143/188 (76.1%)            ║
║  TC TOTAL:         ████████████████  515 TCs defined             ║
║                                                                   ║
║  PASS RATES:                                                      ║
║  ├── P0: ████████████████████  98% (63/64)                       ║
║  ├── P1: ██████████████████░░  91% (87/95)                       ║
║  └── P2: ████████████████░░░░  78% (18/23)                       ║
║                                                                   ║
║  BUGS:                                                            ║
║  ├── Blocker: 0 ✅   Critical: 2 🔴   Major: 8 🟡              ║
║  ├── Minor: 15 🔵    Trivial: 5 ⚪                               ║
║  └── Fix Rate: 85% (25/30)                                       ║
║                                                                   ║
║  REGRESSION:                                                      ║
║  └── Last run: 2026-05-10 → 98.2% pass (161/164)                ║
║                                                                   ║
║  NEXT: Đợt 3 — TV Chuyên sâu + Hợp đồng TV (Tuần 10)          ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 12. Template — Module Test Sheet

Dùng template này cho MỖI module mới khi onboard:

```markdown
# Module Test Sheet: {TÊN MODULE}

## Thông tin chung
| Thuộc tính | Giá trị |
|-----------|---------|
| SRS File | srs-fr-{XX}.md |
| UC Range | UC {start}-{end} |
| Số FR | {N} |
| Ước TC | {N} |
| Risk Score | {X.XX} |
| Test Depth | Shallow / Medium / Deep |
| Đợt test | {N} |

## Dependencies
| Module phụ thuộc | Loại | Status |
|-----------------|------|--------|
| {module} | Data / Workflow / Auth | Stable / Unstable |

## State Machine (nếu có)
- SM name: SM-{TEN}
- Số trạng thái: {N}
- Test paths: {N} paths (xem chi tiết bên dưới)

## Roles liên quan
| Role | Permission | Data Scope |
|------|-----------|------------|
| {role} | CRUD / R / RU* | TW / BN / ĐP / Scoped |

## Test Cases
| TC ID | UC | Test Case | Loại | Ưu tiên |
|-------|-----|-----------|------|---------|
| {MOD}-001 | UC{XX} | ... | Happy | P0 |

## Checklist trước khi test
- [ ] Module đã deploy
- [ ] Dependencies stable
- [ ] Data đã chuẩn bị
- [ ] Regression module cũ PASS

## Kết quả
| Metric | Giá trị |
|--------|---------|
| Total TC | {N} |
| Pass | {N} ({%}) |
| Fail | {N} |
| Blocked | {N} |
| Bugs found | {N} (B:{N} C:{N} Ma:{N} Mi:{N}) |
```

---

## Tổng kết — Checklist chiến lược mở rộng

| # | Chiến lược | Mục đích | Áp dụng khi |
|---|-----------|---------|-------------|
| 1 | Module Onboarding 7 bước (§4) | Đảm bảo không bỏ sót bước khi thêm module | Mỗi module mới |
| 2 | Regression Pyramid (§5) | Phát hiện sớm module mới phá module cũ | Mỗi lần deploy |
| 3 | Data Management 4 tầng (§6) | Không bị BLOCKED vì thiếu data | Mỗi test cycle |
| 4 | Auth tiệm tiến 3 tầng (§7) | Test phân quyền hiệu quả ở scale lớn | Mỗi đợt test |
| 5 | Risk-Based Scoring (§8) | Tập trung effort vào module rủi ro cao | Khi tài nguyên hạn chế |
| 6 | Automation Roadmap (§9) | Giảm effort regression theo thời gian | Liên tục |
| 7 | Đợt triển khai 4 phases (§10) | Lộ trình rõ ràng, không big-bang | Toàn dự án |
| 8 | KPI Dashboard (§11) | Theo dõi chất lượng xuyên suốt | Hàng tuần |
| 9 | Module Test Sheet Template (§12) | Chuẩn hóa output cho mỗi module | Mỗi module mới |
