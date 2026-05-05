# Chiến lược & Phương pháp Kiểm thử

## Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (PM HTPLDN)

**Ngày lập:** 2026-04-15 (refactor 2026-04-17, A1-A5 patch 2026-04-20, Dashboard 7.1 2026-04-20, **v3.0 seed-workflow-functional 2026-04-23**, **v3.1 SRS update 2026-05-05**)
**Phiên bản:** 3.1
**Dựa trên:** SRS v3.1 (2026-04-03) + **3 SRS update từ srs-update-2026-5-5/** (FR-04/FR-07/FR-10) + flow-module.md + seed-fixture.yaml **v2.7.0**

> **Breaking change v3.0 (2026-04-23):** Đảo thứ tự phase test — tách **Seed fixture** (pure, entry state only) khỏi **Workflow test** (walk full lifecycle). Thứ tự mới: **Smoke → Seed → Workflow → Functional → Auth → Edge**. Xóa công thức Min count A1 + schema Data Readiness 8-cột (A2/A3) — không còn cần vì seed dùng 6 variant cố định/entity trong `input/data/seed-fixture.yaml`.

> **Update v3.1 (2026-05-05) — apply 3 SRS update:**
> - **Scope mở rộng từ 46 → 49 entity:** thêm NGUOI_HO_TRO (FR-04), TO_CHUC_TU_VAN (FR-04), NGAY_LE (FR-10).
> - **3 FR mới (FR-10):** FR-VIII-26 (Quên MK / Kích hoạt TK lần đầu), FR-VIII-28 (Nhật ký HT), FR-VIII-29 (Quản lý ngày lễ).
> - **7 FR mới (FR-04):** FR-IV-13 (Tiếp nhận TVV), FR-IV-NEW-01/02/04 (TC TV CRUD + State + Phê duyệt), FR-IV-NHT-01/02/03 (NHT CRUD + Tìm kiếm + Xem hồ sơ).
> - **1 FR bỏ (FR-07):** FR-V.III-NEW-01 Import DN từ Excel — DN tự đăng ký TK-first qua FR-VIII-22.
> - **Run order test thay đổi:** FR-10 (TK + kích hoạt) test TRƯỚC FR-04 (NHT/TVV/TCTV) + FR-07 (DN self-reg) — vì self-reg + kích hoạt là nền tảng.
> - **Tham chiếu chi tiết:** [`../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md), [`_DELTA-MAP-FR07.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md), [`_DELTA-MAP-FR10.md`](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md).

---

## Mục lục

| Section | Nội dung |
|---------|---------|
| §1 | [Tổng quan sản phẩm](#1-tổng-quan-sản-phẩm) — Scope, modules, tài khoản test |
| §2 | [Phạm vi kiểm thử](#2-phạm-vi-kiểm-thử) — In-scope / Out-of-scope |
| §3 | [Chiến lược kiểm thử](#3-chiến-lược-kiểm-thử) — 7 layer + thứ tự ưu tiên |
| §4 | [Phương pháp kiểm thử](#4-phương-pháp-kiểm-thử) — Functional, SM, Auth, BR |
| §5 | [Ma trận phân quyền](#5-ma-trận-phân-quyền-cần-test) — Permission matrix + Data Isolation |
| §6 | [State Machine](#6-test-theo-state-machine) — 5 SM + paths |
| §7 | [Test Cases](#7-test-case-matrix--16-module-đang-hoạt-động) — 568 TC cho 16 module |
| §8 | [Tools, Skills & Prompt Templates](#8-tools-skills--prompt-templates) |
| §9 | [Môi trường](#9-môi-trường-kiểm-thử) — URL, credentials |
| §10 | [Tiêu chí đạt/không đạt](#10-tiêu-chí-đạtkhông-đạt) |
| §11 | [Rủi ro](#11-rủi-ro--giảm-thiểu) |
| §12 | [Kế hoạch](#12-kế-hoạch-thực-hiện) |

**Tài liệu liên quan:**
- **Seed + Workflow input (v3.1 — update 2026-05-05):**
  - [input/quy-trinh-nghiep-vu/flow-module.md](../input/quy-trinh-nghiep-vu/flow-module.md) — State machine 14 module + Hub Tier + §2a SM-NHT + §2b SM-TCTV (NEW 2026-05-05) + Phụ lục 2 seed presets + Phụ lục 3 troubleshooting
  - [input/data/seed-fixture.yaml](../input/data/seed-fixture.yaml) — v2.7.0 — 6 variants/entity × 21 entity (pure seed, entry state). NEW 2026-05-05: ngay_le_variants, to_chuc_tu_van_variants, nht_variants
  - [input/data/entity-map.md](../input/data/entity-map.md) — 26 entity (23 cũ + 3 mới: E24 NGUOI_HO_TRO, E25 TO_CHUC_TU_VAN, E26 NGAY_LE) × "Tạo tại / Đọc tại" cross-map
  - [input/srs-update-2026-5-5/_DELTA-MAP-FR04.md](../input/srs-update-2026-5-5/_DELTA-MAP-FR04.md) — Delta map FR-04 (CG/TVV/NHT/TCTV)
  - [input/srs-update-2026-5-5/_DELTA-MAP-FR07.md](../input/srs-update-2026-5-5/_DELTA-MAP-FR07.md) — Delta map FR-07 (DN self-reg)
  - [input/srs-update-2026-5-5/_DELTA-MAP-FR10.md](../input/srs-update-2026-5-5/_DELTA-MAP-FR10.md) — Delta map FR-10 (Self-reg + Quên MK + Ngày lễ)
- [permission-matrix.md](permission-matrix.md) — Ma trận phân quyền CRUD chi tiết (Tầng 2) — **49 entity** (cập nhật 2026-05-05)
- [scaling-test-strategy.md](scaling-test-strategy.md) — Chiến lược mở rộng khi thêm module
- [funtion/](funtion/) — Test case chi tiết từng module
- [smoke/](smoke/) — State Machine paths từng module
- [smoke-specs/](smoke-specs/) — Smoke test specs 4 bước từng module (số khớp funtion/)

---

## 1. Tổng quan sản phẩm

| Thuộc tính | Giá trị |
|-----------|---------|
| Tên sản phẩm | PM HTPLDN — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp |
| Loại | Backend CMS + API (web desktop, Chrome/Edge) |
| URL test | http://103.172.236.130:3000/ |
| OTP bypass | **666666** (fixed OTP — tạm thời để test nhanh) <!-- MailHog inbox: http://103.172.236.130:8025 (giữ lại để fallback nếu bypass bị tắt) --> |
| Tổng UC theo SRS | 188 UC, 16 nhóm chức năng, 15 tác nhân |
| Phân quyền | 3 cấp: TW / BN / ĐP + Portal users |
| Chuẩn pháp lý | NĐ55/2019, NĐ18/2026, Luật DNNVV 2017, NĐ39/2018, NĐ77/2008 |

### 1.1 Các tính năng đang hoạt động (In-Scope cho đợt test này)

| # | Module | SRS File | UC Range | Số FR |
|---|--------|----------|----------|-------|
| 1 | Dashboard (Tổng quan hệ thống) | srs-fr-01-dashboard.md | UC 1-9 | 11 |
| 2 | Quản trị Hệ thống | srs-fr-10-quan-tri.md | UC 99-119, 191-194 | 25 |
| 3 | Quản lý Hỏi đáp Pháp lý | srs-fr-02-hoi-dap.md | UC 10-19 | 13 |
| 4 | Quản lý Chuyên gia/TVV | srs-fr-04-chuyen-gia-tvv.md | UC 39-50 | 13 |
| 5 | Quản lý Vụ việc HTPL | srs-fr-05-vu-viec.md | UC 51-67 | 19 |
| 6 | Quản lý Chi trả Chi phí | srs-fr-06-chi-tra.md | UC 68-80 | 13 |
| 7 | Quản lý Doanh nghiệp | srs-fr-07-doanh-nghiep.md | UC 81-82 | 3 |
| 8 | Quản lý Đào tạo, Tập huấn | srs-fr-03-dao-tao.md | UC 20-38 + UC mới | 22 |
| 9 | Đánh giá Hiệu quả Hỗ trợ | srs-fr-08-danh-gia.md | UC 83-91 | 9 |
| 10 | Thư viện Biểu mẫu, Hợp đồng | srs-fr-09-bieu-mau.md | UC 92-98, 163 | 8 |
| 11 | Quản lý Nội dung Tư vấn Chuyên sâu | srs-fr-12-tv-chuyen-sau.md | UC 147-153 | 7 |
| 12 | Tư vấn Nhanh | srs-fr-13-tv-nhanh.md | UC 158-162 | 5 |
| 13 | Báo cáo Thống kê | srs-fr-11-bao-cao.md | UC 120-142 | 23 |
| 14 | Quản lý Hợp đồng Tư vấn | srs-fr-14-hop-dong-tv.md | UC 163-163e | 2 |
| 15 | Chương trình HTPLDN | srs-fr-15-ct-htpldn.md | UC 164-172, 195-196 | 11 |
| 16 | API Kết nối Chia sẻ Dữ liệu | srs-fr-16-api.md | UC 171-190 | 18 |
| **Tổng** | | | | **202 FR** |

### 1.2 Tài khoản kiểm thử

> **Danh sách đầy đủ (username, email, mật khẩu):** Xem [users.csv](../input/users.csv)

**Mapping account → role SRS (xem [permission-matrix.md](permission-matrix.md)):**

| Account | Role SRS | Đơn vị | Cấp | Ghi chú |
|---------|----------|--------|-----|---------|
| admin | QTHT | Cục BTTP - Bộ Tư pháp | TW | Quản trị hệ thống TW |
| qtht_tw / qtht_bn / qtht_dp | QTHT | Cục BTTP / Bộ KH&ĐT / Sở TP HN | TW/BN/DP | Quản trị hệ thống 3 cấp |
| canbo_tw / canbo_bn / canbo_tinh | CB_NV | Cục BTTP / Bộ KH&ĐT / Sở TP HN | TW/BN/DP | Cán bộ nghiệp vụ |
| lanhdao_tw / lanhdao_bn / lanhdao_dp | CB_PD | Cục BTTP / Bộ KH&ĐT / Sở TP HN | TW/BN/DP | Cán bộ phê duyệt |
| nht_user | NHT | — | Portal | Người hỗ trợ |
| tvv_user | TVV | — | Portal | Tư vấn viên |
| chuyengia_user | CG | — | Portal | Chuyên gia |
| dn_user | DN | — | Portal | Doanh nghiệp (API only) |
| giangvien_user | GV | — | Portal | Giảng viên (module Đào tạo) |

---

## 2. Phạm vi kiểm thử

### 2.1 Trong phạm vi (In-Scope)

| Loại test | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Functional Testing | Test 202 FR thuộc 16 module in-scope (xem §1.1) | P0 |
| Authorization Testing | Test phân quyền 3 cấp TW/BN/ĐP, RBAC, row-level security | P0 |
| Workflow/State Machine Testing | Test 8 state machines: SM-HOIDAP, SM-TVV, SM-VUVIEC, SM-CHITRA, SM-TAIKHOAN, SM-KHOAHOC, SM-KH-CTHTPL, SM-DOT-BC (chi tiết §6) | P0 |
| Business Rule Testing | Test 53+ business rules (BR-AUTH, BR-DATA, BR-FLOW, BR-SLA, BR-CALC, BR-EC) | P0 |
| UI/UX Testing | Test 7 core patterns (P-01 đến P-07), so sánh với Prototype | P1 |
| Data Validation Testing | Input validation, ràng buộc dữ liệu, unique constraints | P1 |
| Cross-module Integration | DN↔VV, TVV↔VV, Hỏi đáp↔Phê duyệt, VV↔Chi trả | P1 |

### 2.2 Ngoài phạm vi (Out-of-Scope)

> **Cập nhật 2026-04-20:** Toàn bộ 16 module SRS đã được mở rộng vào scope (xem §1.1) — bao gồm Dashboard (FR-01) vừa bổ sung. Danh sách dưới đây chỉ còn các hạng mục **thực sự ngoài phạm vi**.

- Tích hợp LGSP, NDXP, VNeID (chưa có hạ tầng)
- Mobile/Tablet testing (sản phẩm desktop-only)
- Load testing / Stress testing quy mô lớn
- Penetration testing chuyên sâu

---

## 3. Chiến lược kiểm thử

### 3.1 Phương pháp tổng thể — 7 Layer (thứ tự mới v3.0)

| Layer | Tên | Mục tiêu | Source input |
|-------|-----|---------|--------------|
| 0 | Smoke Test | Login + 16 module render → xác nhận env hoạt động | smoke-specs/ + §A |
| **1** | **Pure Seed (fixture)** | Tạo data **entry state only** theo 6 variant/entity × 18 entity. **KHÔNG walk workflow khi seed.** | **[seed-fixture.yaml](../input/data/seed-fixture.yaml)** + [flow-module.md §BƯỚC 1](../input/flow-module.md) |
| **2** | **Workflow / State Machine** | Walk **full lifecycle** — transitions, account switch, reject branches, auto-transition | **[flow-module.md](../input/flow-module.md)** §module bảng flow + Phụ lục 2 preset |
| 3 | Functional | Field validation, negative, edge cases, UI behavior (**happy đã cover ở Layer 2**) | funtion/7.X-*.md |
| 4 | Authorization | Positive/negative role × 16 module + Data isolation ngang cấp | permission-matrix.md |
| 5 | Cross-module + Edge | Module links, concurrent edits, SLA calc | 7.X §Cross-module |
| 6 | UI/UX + Non-functional | Patterns P-01..P-07, security basics (XSS/CSRF), perf | /design-review |

> **Tại sao tách Layer 1 và Layer 2?** Trong v2.x, seed + workflow trộn chung "Data Preparation" → phải tính Min count phức tạp + walk workflow nhiều state để đủ count. Từ v3.0, fixture có sẵn 6 variant/entity ở entry state — phase seed chỉ click-chain tạo record, phase workflow riêng biệt mới advance state. Tester không cần switch account khi seed; chỉ switch khi test workflow.

### 3.2 Thứ tự ưu tiên test (v3.0 — 4 giai đoạn)

```
GĐ 0: Smoke (1-2 ngày)
├── /browse hoặc MCP: Truy cập URL → Login 16 role → verify 16 module load
└── Nếu fail → dừng, báo env down

GĐ 1: Pure Seed (theo seed-fixture.yaml — Tier 0 → 1 → 2 → 3 → 4)
├── Tier 0 prereq (QTHT + phụ trợ):
│   ├── DANH_MUC + DON_VI + TAI_KHOAN (SCR-VIII-01/02/03/04/13/14)
│   ├── CAU_HINH_SLA (FR-VIII-10, SCR-VIII-06 Tab 1) — prereq tính deadline VV theo BR-SLA-01/BR-CALC-03
│   ├── CAU_HINH_PHAN_CONG (FR-II-NEW-01, SCR-VIII-06 Tab 2) — prereq gợi ý phân công HOI_DAP + VV
│   └── BIEU_MAU + THU_MUC_BIEU_MAU (FR-VII-01, M14, SCR-VII-01/02) — phụ trợ, không phê duyệt (BR-FLOW-07), seed song song
├── Tier 1 master actor (song song): M1 DOANH_NGHIEP + M2 TU_VAN_VIEN (6 variant/entity)
├── Tier 2 transactional hub (sub-order theo dependency):
│   ├── M6 KHOA_HOC — chỉ cần Tier 0 DANH_MUC; KHOA_HOC có FK ctdt_id → CTDT cùng module (srs-fr-03)
│   ├── M4 HOI_DAP — cần M1 DN làm nguồn câu hỏi
│   ├── M3 VU_VIEC + M5 TV_CHUYEN_SAU_YC — cần M1 DN + M2 TVV
│   └── HO_SO_PHAP_LY_DN (FR-X.1-04 UC150, tạo tại M5) — phủ SCR-V.III-02 tab #2
├── Tier 3 downstream (phụ thuộc Tier 2 đã qua state đích):
│   ├── M7 HOP_DONG_TV (cần VV HOÀN THÀNH + TVV ĐANG HOẠT ĐỘNG)
│   ├── M9 DANH_GIA_HQ (cần VV HOÀN THÀNH trong kỳ)
│   ├── M10B KHO_CAU_HOI thủ công (nguon=THU_CONG, SCR-X2-01); nguon=TU_DONG auto-push từ HOI_DAP DA_DUYET (BR-FLOW-10)
│   └── BLOCKED: M8 HO_SO_CHI_TRA (chờ LGSP/DVC) + M10A TV_NHANH_PHIEN (chờ Cổng PLQG integration)
├── Tier 4 output (read-only aggregate, chạy khi upstream đủ data trong kỳ):
│   ├── M11.1 CT_HTPLDN_KE_HOACH (FR-XI-01 UC164, parent) → M11.2 CT_HTPLDN_DOT_BC (FR-XI-05a UC195, FK dot_bao_cao_id → KE_HOACH)
│   ├── M12 BAO_CAO (FR-IX-01..23, metadata job từ 6 entity upstream)
│   └── M13 Dashboard (aggregate 7 entity, không owned entity)
└── Output: `seed-checklist-{module}.md` (3 cột: Variant / Seeded Y/N / Sample ID)

GĐ 2: Workflow / State Machine test (theo flow-module.md — per module)
├── Mỗi module chạy bảng flow Bước 1 → N theo thứ tự
├── Verify mỗi state chuyển đúng + account switch đúng
├── Test reject branches + auto-transition + timeout (§4.2)
├── 4 preset E2E P1/P2/P3/P4 khi cần phủ tab downstream rỗng
└── Output: `workflow-test-report-{module}.md`

GĐ 3: Functional + Authorization + Edge + UI (song song khi module stable)
├── Functional: field validation / negative / edge cases (happy SKIP — đã cover GĐ 2)
├── Authorization: positive/negative role + DI-01..DI-09
├── Cross-module: DN↔VV, TVV↔VV, VV↔Chi trả, Hỏi đáp↔Phê duyệt
├── Edge: BR-EC-01..23 optimistic lock / concurrent
└── UI/UX: /design-review so sánh Prototype
```

> **Gate giữa giai đoạn:** Mỗi GĐ là gate cho GĐ kế tiếp. GĐ 1 chưa đủ seed → GĐ 2 workflow BLOCKED (không có record để advance state). GĐ 2 workflow chưa PASS happy → GĐ 3 functional BLOCKED (không có precondition).

---

## 4. Phương pháp kiểm thử

### 4.1 Functional Testing (GĐ 3 — sau khi Workflow PASS)

Mỗi UC test theo cấu trúc: **Precondition → (Happy ref GĐ 2) → Alternative → Negative → Postcondition**.
- **Happy:** **đã cover ở GĐ 2 Workflow** (bảng flow-module.md Bước 1→N). GĐ 3 chỉ reference `workflow-test-report-{module}.md` để xác nhận precondition, KHÔNG test lại happy path ở đây.
- **Negative:** input rỗng / trùng / vượt max / sai format / sai quyền → validation error hoặc 403
- **Alternative:** luồng rẽ nhánh (reject từ CB PD, yêu cầu bổ sung, cancel, auto-reject lần 4 — VV-BR-02…)
- **Edge:** BVA, XSS, concurrent edit, optimistic lock (BR-EC-01..23)

### 4.2 State Machine Testing

| Loại test | Mô tả | Ví dụ |
|-----------|-------|-------|
| Happy path | Đi qua tất cả trạng thái từ đầu đến cuối | MOI → TIEP_NHAN → ... → HOAN_THANH |
| Reject path | Test từ chối ở mỗi điểm phê duyệt | CHO_PHE_DUYET → DANG_XU_LY (reject) |
| Guard test | Test điều kiện chuyển trạng thái | Không thể xóa TVV khi có VV đang xử lý |
| Auto-transition | Test chuyển tự động | DA_TRA_LOI → CHO_PHE_DUYET (auto) |
| Timeout test | Test hết thời gian chờ | BR-EC-18: NHT không phản hồi 3 ngày |
| Invalid transition | Cố gắng chuyển trạng thái không hợp lệ | MOI → DA_DUYET (skip) |
| Immutability | Test không thể sửa sau phê duyệt | BR-FLOW-03: DA_DUYET → không thể edit |

### 4.3 Authorization Testing — Phương pháp

```
Test Pattern cho mỗi chức năng:
┌─────────────────────────────────────────────────────┐
│ 1. Positive Test: Login đúng role → Thấy menu       │
│ 2. Negative Test: Login sai role → Ẩn menu          │
│ 3. Data Scope Test:                                  │
│    ├── TW → Thấy tất cả data (TW + BN + ĐP)       │
│    ├── BN → Chỉ thấy data BN mình                   │
│    ├── ĐP → Chỉ thấy data ĐP mình                  │
│    └── Ngang cấp → KHÔNG thấy nhau                   │
│ 4. Cross-level Test:                                  │
│    └── CB NV tạo → chỉ CB PD cùng cấp duyệt        │
│ 5. URL Direct Access:                                 │
│    └── Truy cập trực tiếp URL → Redirect/403         │
└─────────────────────────────────────────────────────┘
```

### 4.4 Business Rule Testing — Mapping

| BR Group | Quy tắc cần test | Phương pháp |
|----------|-------------------|-------------|
| BR-AUTH-01~11 | Xác thực, phân quyền 3 cấp, lọc NHT (TVV=❌ trên VU_VIEC), QTHT Read-only, DN API | Login 11 role → verify CRUD scope theo [permission-matrix.md](permission-matrix.md) |
| BR-DATA-01~08 | Soft delete, auto-gen mã, audit trail, pagination | CRUD operations → check DB & UI |
| BR-FLOW-01~10 | Auto-transition, batch approve, immutability | Workflow execution → verify state changes |
| BR-SLA-01~05 | SLA 10 ngày, 4 mức cảnh báo, ngày làm việc | Tạo VV với dates → verify SLA indicators |
| BR-CALC-01~06 | Mức hỗ trợ, deadline, điểm đánh giá, ưu tiên | Input test data → verify calculations |
| BR-EC-01~23 | Optimistic locking, session limit, CSRF, pagination guard | Edge case scenarios |

> ⚠️ **Nguyên tắc cross-cutting:** Mọi BR có field "Áp dụng: Toàn bộ..." trong SRS là **DEFAULT áp dụng** cho mọi module. Ngoại lệ **chỉ** khi SRS quote dòng cụ thể — không tự suy luận. Tra cứu: [srs-v3.md Phụ lục B](../input/srs-v3/srs-v3.md) (line 3939-4088).

---

## 5. Ma trận phân quyền cần test

### 5.1 Ma trận phân quyền CRUD — Entity × Role

> **📋 Tài liệu chi tiết:** [permission-matrix.md](permission-matrix.md) — Ma trận đầy đủ 49 entity × 11 role, trích nguyên bản từ SRS §3.4.2.
>
> **Tóm tắt (cập nhật 2026-04-20):** Toàn bộ 16 module In-scope — ~46 entity × 11 role | ~1.000 test cases phân quyền (con số cũ `~550 TC / 27 entity` chỉ áp dụng cho 6 module gốc, không còn hợp lệ). Module Dashboard (7.1) không thêm entity mới — phân quyền xem Dashboard kế thừa từ các entity nguồn (HOI_DAP, VU_VIEC, KHOA_HOC, TU_VAN_VIEN).
>
> **Điểm cần lưu ý khi test:**
> - ⚠️ TVV KHÔNG có quyền trên VU_VIEC — chỉ tương tác qua HO_SO_VU_VIEC và KET_QUA_VU_VIEC
> - 👁️ QTHT có quyền Read trên hầu hết entity nghiệp vụ — cần test xem được nhưng không sửa/xóa
> - 🔌 DN truy cập qua API (không qua CMS) — cần test riêng luồng API
> - Mỗi ô có quyền = 1 positive test + 1 negative test (role khác thử truy cập)

### 5.2 Data Isolation Test Cases

| # | Scenario | Login | Expected |
|---|----------|-------|----------|
| DI-01 | TW xem tất cả data | canbo_tw | Thấy data TW + BN + ĐP |
| DI-02 | BN chỉ thấy data BN | canbo_bn | Chỉ thấy data "Bộ KH&ĐT", KHÔNG thấy data ĐP/TW khác |
| DI-03 | ĐP chỉ thấy data ĐP | canbo_tinh | Chỉ thấy data "Sở TP Hà Nội" |
| DI-04 | BN không thấy BN khác | canbo_bn | KHÔNG thấy data của các Bộ/Ngành khác |
| DI-05 | ĐP không thấy ĐP khác | canbo_tinh | KHÔNG thấy data của các Sở TP khác |
| DI-06 | NHT chỉ thấy VV được phân công | nht_user | Chỉ thấy VU_VIEC đã được phân công (📝 RU*), lọc kép BR-AUTH-10 |
| DI-06b | TVV không thấy VU_VIEC | tvv_user | TVV = ❌ trên VU_VIEC. Chỉ thấy HO_SO_VU_VIEC + KET_QUA_VU_VIEC được phân công |
| DI-07 | CB PD cùng cấp mới duyệt được | lanhdao_bn | Chỉ duyệt được bản ghi do CB BN tạo |
| DI-08 | QTHT xem được business modules nhưng không sửa | qtht_tw | Thấy danh sách Hỏi đáp/VV/Chi trả/DN (👁️ R) nhưng KHÔNG có nút Tạo/Sửa/Xóa |
| DI-09 | DN không truy cập CMS UI | dn_user | Truy cập CMS URL → bị chặn. DN chỉ tương tác qua API (🔌 C†) |

---

## 6. Test theo State Machine

> **Chi tiết State Machine (states + paths + BR):** Xem [smoke/](smoke/README.md).
> **Smoke spec gate check (4 bước) của mỗi module:** Xem [smoke-specs/](smoke-specs/README.md) — chạy trước khi test State Machine.

| SM | Entity | States | Module | Test Paths (SM) | Smoke spec (gate check) |
|----|--------|--------|--------|-----------------|-------------------------|
| SM-HOIDAP | HOI_DAP | 9 | Hỏi đáp PL | [smoke/6.2-sm-hoidap.md](smoke/6.2-sm-hoidap.md) — 7 paths | [smoke-specs/6.2-smoke-hoidap.md](smoke-specs/6.2-smoke-hoidap.md) |
| SM-TVV | TU_VAN_VIEN | 9 | CG/TVV | [smoke/6.4-sm-tvv.md](smoke/6.4-sm-tvv.md) — 8 paths | [smoke-specs/6.4-smoke-tvv.md](smoke-specs/6.4-smoke-tvv.md) |
| SM-VUVIEC | VU_VIEC | 12 | Vụ việc | [smoke/6.5-sm-vuviec.md](smoke/6.5-sm-vuviec.md) — 9 paths | [smoke-specs/6.5-smoke-vuviec.md](smoke-specs/6.5-smoke-vuviec.md) |
| SM-CHITRA | HO_SO_CHI_TRA | 10 | Chi trả | [smoke/6.6-sm-chitra.md](smoke/6.6-sm-chitra.md) — 9 paths | [smoke-specs/6.6-smoke-chitra.md](smoke-specs/6.6-smoke-chitra.md) |
| SM-TAIKHOAN | TAI_KHOAN | 4 | Quản trị HT | [smoke/6.10-sm-taikhoan.md](smoke/6.10-sm-taikhoan.md) — 7 paths | [smoke-specs/6.10-smoke-taikhoan.md](smoke-specs/6.10-smoke-taikhoan.md) |
| SM-KHOAHOC | KHOA_HOC | 9 | Đào tạo, Tập huấn | (paths gộp trong [funtion/7.3-dao-tao-tap-huan.md](funtion/7.3-dao-tao-tap-huan.md); SM detail xem [`flow-module.md` §8.1](../input/flow-module.md)) | [smoke-specs/6.3-smoke-daotao.md](smoke-specs/6.3-smoke-daotao.md) |
| SM-KH-CTHTPL | CHUONG_TRINH_HTPL | 8 | Chương trình HTPLDN | (paths gộp trong [funtion/7.15-chuong-trinh-HTPLDN.md](funtion/7.15-chuong-trinh-HTPLDN.md) §Test Case Matrix Nhóm 3a — 13 TC) | [smoke-specs/6.15-smoke-chuong-trinh-HTPLDN.md](smoke-specs/6.15-smoke-chuong-trinh-HTPLDN.md) |
| SM-DOT-BC | DOT_BAO_CAO | 6 | Chương trình HTPLDN | (paths gộp trong [funtion/7.15-chuong-trinh-HTPLDN.md](funtion/7.15-chuong-trinh-HTPLDN.md) §Test Case Matrix Nhóm 3b — 11 TC) | [smoke-specs/6.15-smoke-chuong-trinh-HTPLDN.md](smoke-specs/6.15-smoke-chuong-trinh-HTPLDN.md) |

> **Module không có SM nghiệp vụ:**
> - **Dashboard (FR-01)** — read-only aggregation layer, không có entity owned bởi module. Module chỉ đọc data từ SM-HOIDAP / SM-VUVIEC / SM-KHOAHOC / SM-TVV để tính 9 KPI + 2 biểu đồ. Không có transition. Smoke spec gate check: [smoke-specs/6.1-smoke-dashboard.md](smoke-specs/6.1-smoke-dashboard.md).
> - **Báo cáo Thống kê** (entity `BAO_CAO` chỉ có 3 trạng thái kỹ thuật `DANG_TAO → HOAN_THANH | LOI` của job xuất file, không phải workflow). Smoke spec gate check vẫn có: [smoke-specs/6.11-smoke-baocao-thongke.md](smoke-specs/6.11-smoke-baocao-thongke.md).
> - **Hợp đồng Tư vấn** (trạng thái HĐ `DANG_THUC_HIEN / HOAN_THANH / HUY / TAM_DUNG` chỉ là status field, KHÔNG có phê duyệt / vòng đời — SRS §5). Chỉ CRUD thuần + liên kết N:N vụ việc. Smoke spec gate check: [smoke-specs/6.14-smoke-hop-dong-tv.md](smoke-specs/6.14-smoke-hop-dong-tv.md).
> - **API Kết nối Chia sẻ Dữ liệu** (18 API outbound read-only, KHÔNG thay đổi dữ liệu PM → không có state machine). API thực thi filter theo trạng thái publishable của entity nguồn (BR-INTG-07). Smoke spec gate check (dùng `curl` thay vì `/browse`): [smoke-specs/6.16-smoke-API-ketnoi-chiase.md](smoke-specs/6.16-smoke-API-ketnoi-chiase.md).

---

## 7. Test Case Matrix — 16 module đang hoạt động

### 7.0 Seed Fixture Protocol — GĐ 1 (Pure Seed)

> **Thay thế §7.0 Data Readiness cũ (v2.x).** Từ v3.0, không còn tính Min count, không còn schema 8-cột Sample ID tracking.

**Mindset pure seed** (trích `seed-fixture.yaml` header):
- **Mục tiêu: TẠO DATA thành công, KHÔNG test workflow.**
- Module SM: chỉ seed ở **entry state** (state đầu sau thêm mới). KHÔNG advance.
- State transitions (kiểm tra, phân công, phê duyệt, …) = việc của **GĐ 2 Workflow**, không phải GĐ 1 Seed.
- Seed OK = record xuất hiện đúng entry state, counter KPI hiển thị đúng.
- Nếu gặp bug khi seed → NOTE lại, **KHÔNG log bug ngay**. Log ở GĐ 3 Functional phase.
- Tester **KHÔNG cần switch account** khi seed — chỉ cần account tạo mới (CB NV).

**Input chính:**
- `input/data/seed-fixture.yaml` — 6 variants cố định/entity × 18 entity, field values khớp SRS Inputs
- `input/flow-module.md` §BƯỚC 1 của mỗi module — account + click flow để tạo record entry state
- `input/data/entity-map.md` — kiểm tra entity nào tạo ở SCR nào

**Quy trình 4 bước:**
1. **Kiểm tra Tier 0 prereq** — `DANH_MUC` + `DON_VI` + `TAI_KHOAN` đủ chưa. Thiếu → nhờ QTHT seed qua SCR-VIII-01/02/03/04/13/14 trước.
2. **Seed theo thứ tự Tier** (Tier 1 → 2 → 3 → 4). Module downstream đọc data từ Tier thấp hơn — thiếu upstream thì downstream rỗng. Xem [flow-module.md §BƯỚC 1 Hub Tier](../input/flow-module.md).
3. **Mỗi entity chạy 6 variant** từ `seed-fixture.yaml` `*_variants[0..5]`. Click flow Bước 1 trong `flow-module.md` của module tương ứng. State dừng ở entry state (vd `MOI_DANG_KY`, `DA_TIEP_NHAN`, `DU_THAO`, `NHAP`, …).
4. **Update seed-checklist** sau mỗi variant: `Seeded Y/N + Sample ID`. Variant bị BLOCKED (xem §7.0c) → ghi reason code.

**Output artifact — `seed-checklist-{module}.md`:**

Template tại [output/template/seed-checklist-template.md](template/seed-checklist-template.md). Schema 3 cột (tối giản):

| Cột | Mô tả |
|-----|-------|
| Variant | `{entity}_variants[index]` — vd `dn_variants[1]`, `tvv_variants[3]` |
| Seeded | `Y` / `N` / `BLOCKED` + reason code |
| Sample ID | Mã record hệ thống gen sau khi lưu (vd `DN-HN-001`, `TVV-20260423-001`) |

**Idempotency đơn giản:** Trước khi tạo variant — kiểm tra unique key (MST / username / mã) đã tồn tại chưa. Tồn tại → skip, ghi Sample ID hiện tại vào checklist. Không tồn tại → tạo mới.

**Dependency chain:** xem [flow-module.md Tier 0 → 4 table](../input/flow-module.md) hoặc [entity-map.md](../input/data/entity-map.md) — KHÔNG hardcode ở đây để tránh drift.

### 7.0b Workflow Test Protocol — GĐ 2

> Section MỚI v3.0. Tách riêng để test workflow state transitions + account switch + reject branches, TRƯỚC khi chạy functional.

**Input chính:**
- `input/flow-module.md` §module — bảng flow Bước 1 → N (account + state chuyển + thao tác)
- `input/flow-module.md` Phụ lục 2 — 4 preset E2E (P1 DN detail / P2 TVV LS / P3 Chi trả BLOCKED / P4 Đánh giá HQ)
- `input/flow-module.md` Phụ lục 3 — troubleshooting khi seed/transition fail
- `output/qa-reports/round{N}/{module}/seed-checklist-{module}.md` (GĐ 1 output — lấy Sample ID làm precondition)

**Quy trình:**
1. Mở bảng flow của module trong `flow-module.md`, chạy tuần tự Bước 1 → N.
2. Mỗi Bước: đăng nhập account theo cột "Account thao tác", click button theo cột "Thao tác thực hiện", verify cột "Trạng thái chuyển" đúng như UI.
3. Test **happy path** 1 lần cho từng module (dùng 1 Sample ID từ GĐ 1).
4. Test **reject branches** theo "Lưu ý test flow rẽ nhánh" trong flow-module.md (vd VV: `CHỜ PHÊ DUYỆT` → `ĐANG XỬ LÝ` khi CB PD từ chối; auto-reject lần 4).
5. Test **auto-transition** (SM-HOIDAP: checkbox "Đã trả lời" → auto `CHỜ PHÊ DUYỆT` không cần nút trình).
6. 4 preset E2E chạy khi tab downstream rỗng (P1 cho DN detail, P2 cho TVV LS, …).

**Output artifact — `workflow-test-report-{module}.md`:**

Template tại [output/template/workflow-test-report-template.md](template/workflow-test-report-template.md). Schema:

| Cột | Mô tả |
|-----|-------|
| Bước | Theo flow-module.md Bước 1..N |
| Account | Username theo users.csv |
| State from → to | Trạng thái chuyển |
| Result | PASS / FAIL / BLOCKED |
| Evidence | Screenshot path + Sample ID |
| Note | Ghi chú troubleshooting nếu có (tra Phụ lục 3) |

### 7.0c BLOCKED states — Fail-fast registry

Các state KHÔNG thể đạt qua UI trong GĐ 1 (seed) hoặc GĐ 2 (workflow) → mark BLOCKED ngay với reason code. Nguồn gốc: 2 module đã confirm BLOCKED trong `seed-fixture.yaml` + `flow-module.md` §Tóm tắt Bước 1:

| Module | BLOCKED vì | Reason code | Escalate |
|--------|------------|-------------|----------|
| M8 Chi trả (SM-CHITRA) | DN nộp Mẫu 01 qua DVC/LGSP — không có nút [+ Thêm mới] trên CMS | `EXTERNAL_API` | Chờ integration LGSP/DVC. Preset P3 chờ BE inject record qua API test / SQL seed. |
| M10A Phiên TV nhanh (SM-TVNHANH) | DN gửi từ khung chat Cổng PLQG | `EXTERNAL_API` | Chờ integration Cổng PLQG. |

**Reason code chuẩn:**

| Reason code | Khi nào dùng |
|-------------|-------------|
| `EXTERNAL_API` | State phụ thuộc callback từ Cổng PLQG / DVC / LGSP / thanh toán bên 3 |
| `AUTO_TRANSITION` | Transition không có UI trigger (chỉ "system auto sau N ngày / N lần") — cần BE cron |
| `TIME_TRAVEL` | State cần timestamp cách hiện tại ≥N ngày (SLA tuổi record / deadline sát hạn) — cần BE fake timestamp |
| `CRON_DEPENDENT` | State cần job định kỳ chạy (reset theo năm, đóng kỳ, tổng hợp cuối tháng) |
| `UI_BUG` | Form render lỗi / button disabled sai / dropdown 404 chặn tạo record (bug app-side, log ở GĐ 3) |
| `ENDPOINT_404` | API backend thiếu — đã thử max 2 path variant |
| `FORM_VALIDATION` | Validation lạ không pass được (unique constraint ngầm, MST format ngầm) |
| `WORKFLOW_STUCK` | Record tạo được entry state nhưng transition kế không khả thi (nút phê duyệt mất, role không đủ quyền) |

**Xử lý:**
- State thuộc bảng BLOCKED → set `Seeded = BLOCKED — <reason code>` trong seed-checklist, **KHÔNG thử tạo qua UI** (đốt time budget vô ích).
- GĐ 3 Functional gặp TC phụ thuộc → ghi `Pre-blocked per §7.0c <reason code>`, skip.
- **Escalate:** Khi BLOCKED chặn ≥3 test path P0 trong 1 module → báo user + BE team cung cấp SQL seed / cron trigger endpoint / fake timestamp utility.

### 7.1 Module: Dashboard (11 FR)

> **Chi tiết:** [funtion/7.1-dashboard.md](funtion/7.1-dashboard.md)
> **Tổng TC:** 34 (P0: 14, P1: 17, P2: 3) — read-only aggregation layer hiển thị 9 KPI (UC1-UC9) + 2 KPI bổ sung (KPI-03 tỷ lệ HS bổ sung, KPI-04 thời gian xử lý TB theo ngày LV — BR-CALC-03) + 2 biểu đồ (UC8 bar+line điểm hài lòng + tỷ lệ SLA BR-SLA-05, UC9 donut tỷ lệ đạt chứng nhận + điểm TB). FR-I-CROSS-02 Auto-refresh 60s kết hợp Page Visibility API (pause khi tab ẩn). Module KHÔNG có entity riêng, KHÔNG có state machine — đọc từ HOI_DAP (SM-HOIDAP `MOI`), VU_VIEC (SM-VUVIEC theo nhóm trạng thái), KHOA_HOC (SM-KHOAHOC `DANG_DIEN_RA/KET_THUC`), TU_VAN_VIEN (SM-TVV `DANG_HOAT_DONG`), KET_QUA_DANH_GIA, KET_QUA_DAO_TAO, CAU_HINH_SLA. Phân quyền 3 cấp TW/BN/ĐP (BR-AUTH-01/03/04/08): TW toàn quốc, BN chỉ BN mình, ĐP chỉ ĐP mình — dropdown đơn vị TW chọn bất kỳ, BN/ĐP read-only. Bộ lọc `tu_ngay`/`den_ngay`/`nam`/`don_vi_id` đồng bộ URL. Click thẻ KPI → drill-down `/hoi-dap/danh-sach` / `/vu-viec/danh-sach` / `/dao-tao/khoa-hoc` / `/chuyen-gia-tvv/danh-sach` (trừ 2 KPI bổ sung — không drill-down). Cross-module: chạy SAU 7.2/7.3/7.4/7.5/7.8 để có data nguồn. TC 5 nhóm: Happy (5) + Negative (4) + Workflow gồm filter/auto-refresh/drill-down (11) + Authorization (7) + Cross-module so khớp count với module đích (7).

### 7.2 Module: Hỏi đáp Pháp lý (13 FR)

> **Chi tiết:** [funtion/7.2-hoi-dap-phap-ly.md](funtion/7.2-hoi-dap-phap-ly.md)
> **Tổng TC:** 36 (P0: 11, P1: 21, P2: 4) — workflow tiếp nhận → trả lời → phê duyệt → công khai, mẫu phản hồi, phân công, SLA.

### 7.3 Module: Đào tạo, Tập huấn (22 FR)

> **Chi tiết:** [funtion/7.3-dao-tao-tap-huan.md](funtion/7.3-dao-tao-tap-huan.md)
> **Tổng TC:** 40 (P0: 14, P1: 24, P2: 2) — CTDT/khóa học 2 cấp, SM-KHOAHOC (duyệt → diễn ra → duyệt KQ → chứng nhận), bài giảng, ngân hàng câu hỏi + đề kiểm tra, giảng viên, đăng ký/đề xuất từ DN/NHT qua API.

### 7.4 Module: Chuyên gia/TVV (13 FR)

> **Chi tiết:** [funtion/7.4-chuyen-gia-tvv.md](funtion/7.4-chuyen-gia-tvv.md)
> **Tổng TC:** 31 (P0: 10, P1: 17, P2: 4) — đăng ký TVV, thẩm định, phê duyệt, đánh giá, tạm dừng/vô hiệu hóa (có guard).

### 7.5 Module: Vụ việc HTPL (19 FR)

> **Chi tiết:** [funtion/7.5-vu-viec-htpl.md](funtion/7.5-vu-viec-htpl.md)
> **Tổng TC:** 35 (P0: 14, P1: 16, P2: 5) — workflow nghiệp vụ lõi, phân công NHT theo NĐ55, auto-reject lần 4, immutability sau duyệt.

### 7.6 Module: Chi trả Chi phí (13 FR)

> **Chi tiết:** [funtion/7.6-chi-tra-chi-phi.md](funtion/7.6-chi-tra-chi-phi.md)
> **Tổng TC:** 30 (P0: 13, P1: 13, P2: 4) — tính mức hỗ trợ theo quy mô DN (BR-CALC-01), over-cap, annual reset, immutability.

### 7.7 Module: Quản lý Doanh nghiệp (3 FR)

> **Chi tiết:** [funtion/7.7-quan-ly-doanh-nghiep.md](funtion/7.7-quan-ly-doanh-nghiep.md)
> **Tổng TC:** 18 (P0: 4, P1: 11, P2: 3) — master data DN, CRUD + guard xóa, Import/Export Excel, phân loại quy mô NĐ39/2018.

### 7.8 Module: Đánh giá Hiệu quả Hỗ trợ (9 FR)

> **Chi tiết:** [funtion/7.8-danh-gia.md](funtion/7.8-danh-gia.md)
> **Tổng TC:** 40 (P0: 14, P1: 22, P2: 4) — lập KH đánh giá (sơ bộ 6 tháng / tròn năm — BR-LEGAL-08), thiết lập tiêu chí (SUM trọng số = 100% — BR-CALC-04), phân công + phê duyệt PC, chọn VV HOAN_THANH, chấm điểm auto-tính xếp loại, lập BC TT17/2025 + phê duyệt BC, immutability sau DANG_DANH_GIA.

### 7.9 Module: Thư viện Biểu mẫu, Hợp đồng (8 FR)

> **Chi tiết:** [funtion/7.9-bieu-mau.md](funtion/7.9-bieu-mau.md)
> **Tổng TC:** 38 (P0: 11, P1: 25, P2: 2) — CRUD thư mục + biểu mẫu 2 cấp, upload file doc/docx/xls/xlsx (max 20MB, virus scan), preview online, công khai trực tiếp lên Cổng PLQG KHÔNG cần phê duyệt (BR-FLOW-07, SM-BIEUMAU: NHAP↔CONG_KHAI↔AN), import hàng loạt ≤50 file, API chia sẻ với Cổng PLQG, CRUD HĐ Tư vấn auto-gen mã HDTV-YYYYMMDD-SEQ (liên kết vụ việc V).

### 7.10 Module: Quản trị Hệ thống (25 FR)

> **Chi tiết:** [funtion/7.10-quan-tri-he-thong.md](funtion/7.10-quan-tri-he-thong.md)
> **Tổng TC:** 32 (P0: 12, P1: 17, P2: 3) — xác thực, CRUD danh mục, tài khoản, vai trò, audit log, authorization.

### 7.12 Module: Tư vấn Chuyên sâu (7 FR)

> **Chi tiết:** [funtion/7.12-tu-van-chuyen-sau.md](funtion/7.12-tu-van-chuyen-sau.md)
> **Tổng TC:** 44 (P0: 16, P1: 25, P2: 3) — vòng đời TVCS 7 state (SM-TVCS: TIEP_NHAN → PHAN_CONG → DANG_TU_VAN → HOAN_THANH → CHO_PHE_DUYET → DA_DUYET + HUY), phân công CG + SLA timeout 2 ngày LV, phê duyệt CB PD cùng cấp (BR-FLOW-04 từ chối cần lý do), 3 UC loại M API inbound từ Cổng PLQG (TVCS UC149 / HSPL UC151 / Đánh giá CL UC153 idempotent), CRUD HSPL DN (auto-gen HSPL-YYYYMMDD-SEQ) + tư liệu PL công khai trực tiếp Cổng PLQG (BR-FLOW-07), auto-save draft trả lời CG mỗi 30s, immutability sau DA_DUYET, cross-module cập nhật điểm TB chuyên gia (↔ module 7.4 TVV), upsert DN theo MST (↔ module 7.7 DN), liên kết vụ việc (↔ module 7.5 VV).

### 7.13 Module: Tư vấn Nhanh (5 FR)

> **Chi tiết:** [funtion/7.13-tu-van-nhanh.md](funtion/7.13-tu-van-nhanh.md)
> **Tổng TC:** 39 (P0: 12, P1: 25, P2: 2) — hệ thống Q&A keyword search (KHÔNG AI) phục vụ DN tự tra cứu trên Cổng PLQG. SM-TVNHANH 6 state (MOI → DANG_TIM_KIEM → DA_GOI_Y → CB_TRA_LOI → HOAN_THANH + HET_HAN auto 30 ngày). Kho Q&A 3 nguồn (BR-FLOW-10): `TU_DONG` từ HOI_DAP DA_DUYET (auto-import, không cần duyệt lại), `THU_CONG` nhập tay (CHO_DUYET → duyệt/từ chối đơn lẻ + hàng loạt), `IMPORT` Excel (preview → CHO_DUYET). Full-text search (BR-DATA-08) trên `cau_hoi + cau_tra_loi + tu_khoa` với GIN tsvector + unaccent. Workflow phiên TV nhanh: DN gửi câu hỏi qua Cổng → keyword search kho → gợi ý TOP 5 relevance DESC → CB NV chọn/chỉnh sửa → gửi trả lời → DN đánh giá 1-5 sao + cập nhật `diem_danh_gia_tb` KHO_CAU_HOI. 3 UC API inbound từ Cổng PLQG (UC160 DN gửi / UC161 DN tìm kiếm / UC162 DN đánh giá). Cross-module: auto-import HOI_DAP (↔ module 7.2), đánh giá Q&A cập nhật điểm TB.

### 7.11 Module: Báo cáo Thống kê (23 FR)

> **Chi tiết:** [funtion/7.11-bao-cao-thong-ke.md](funtion/7.11-bao-cao-thong-ke.md)
> **Tổng TC:** 38 (P0: 12, P1: 22, P2: 4) — read-only aggregation layer 23 loại BC (UC120 → UC142) trong 1 màn hình unified SCR-IX-01. Module KHÔNG có state machine nghiệp vụ (entity `BAO_CAO` chỉ có 3 trạng thái kỹ thuật `DANG_TAO → HOAN_THANH | LOI` của job xuất). Tất cả FR-IX kế thừa template TPL-REPORT-FULL (input kỳ + đơn vị + format xuất, processing 10 bước, output bảng + biểu đồ). 4 cụm BC: Vụ việc (UC121-124, 130-133), Chi phí (UC134-138 — kèm so sánh trần NĐ55), Đào tạo + CG-TVV (UC125-129), CT HTPLDN (UC139-142) + UC120 Hỏi đáp + UC128 Đánh giá. BR áp dụng: BR-AUTH-08 phân quyền dữ liệu 3 cấp TW/BN/ĐP, BR-RPT-01 chỉ tính bản ghi đã duyệt, BR-DATA-06 max 50K rows xuất, BR-SLA-02 4 mức cảnh báo cho BC VV đang xử lý, BR-DATA-05 audit log xem/xuất BC. Cross-module: BC đọc từ HOI_DAP/VU_VIEC/KHOA_HOC/TU_VAN_VIEN/HO_SO_CHI_TRA/DOT_DANH_GIA/CHUONG_TRINH_HTPL/DOANH_NGHIEP — module BC chạy SAU 7.2/7.3/7.4/7.5/7.6/7.7/7.8 đã có data `DA_DUYET`. Xuất XLSX/DOCX theo TT17/2025.

### 7.14 Module: Hợp đồng Tư vấn (2 FR)

> **Chi tiết:** [funtion/7.14-hop-dong-tv.md](funtion/7.14-hop-dong-tv.md)
> **Tổng TC:** 29 (P0: 9, P1: 18, P2: 2) — CRUD thuần HĐ tư vấn giữa đơn vị (bên A) và TVV/tổ chức (bên B), KHÔNG có phê duyệt, KHÔNG có state machine (trạng thái `DANG_THUC_HIEN / HOAN_THANH / HUY / TAM_DUNG` chỉ là status field). Auto-gen mã `HDTV-YYYYMMDD-SEQ` (BR-DATA-04). Form Accordion 5 section: Thông tin chung / Vụ việc liên kết N:N / Mốc tiến độ (CHUA_BAT_DAU → DANG_THUC_HIEN → HOAN_THANH) / Thanh toán giai đoạn (CHUA_THANH_TOAN → DA_THANH_TOAN) / Nhật ký. Validations: `ngay_bat_dau <= ngay_ket_thuc` (ERR-HDTV-02), `SUM(thanh_toan) <= gia_tri_HĐ` (ERR-HDTV-03), `gia_tri > 0` (ERR-HDTV-05). Guard xóa: không xóa HĐ có VV liên kết (ERR-HDTV-04 + BR-DATA-01 soft delete). UI: highlight đỏ cột `thoi_han_ket_thuc` ≤30 ngày, progress bar TT = SUM(DA_THANH_TOAN) / gia_tri_HĐ × 100%, badge số VV liên kết. Access: truy cập qua Chi tiết VV MH-05.3 tab "HĐ liên kết" (modal/drawer) + Chi tiết TVV MH-04.3 tab "Lịch sử" + list chính SCR-X3-01 (nếu còn menu). Cross-module: liên kết N:N VU_VIEC (↔ 7.5), FK tu_van_vien_id DANG_HOAT_DONG (↔ 7.4), bên A auto đơn vị (↔ 7.10 DON_VI). Phân quyền: CB_NV=✏️CRUD*, CB_PD=👁️R* scoped, QTHT=👁️R (không CUD), TVV/CG/NHT/DN=❌.

### 7.15 Module: Chương trình HTPLDN (11 FR)

> **Chi tiết:** [funtion/7.15-chuong-trinh-HTPLDN.md](funtion/7.15-chuong-trinh-HTPLDN.md)
> **Tổng TC:** 42 (P0: 14, P1: 23, P2: 5) — quản lý CT HTPLDN theo cấp TW/BN/ĐP với 2 SM song song. SM-KH-CTHTPL 8 state (DU_THAO → CHO_PHE_DUYET → DA_DUYET → DA_CONG_BO → DANG_THUC_HIEN ↔ TAM_DUNG → HOAN_THANH + HUY) — auto-gen mã `CT-YYYYMMDD-SEQ`, công bố Cổng PLQG qua API REST trực tiếp (BR-FLOW-05) + rollback khi API fail. SM-DOT-BC 6 state (TAO_DOT → DANG_LAP_BC → CHO_DUYET_KQ → DA_DUYET_KQ → DA_GUI_TW → DA_TONG_HOP) — auto-transition kép (đợt BC + BC), gợi ý số liệu từ COUNT(VV) + SUM(chi phí), từ chối có lý do (BR-FLOW-04), phê duyệt cùng cấp (BR-AUTH-05). Workflow BC ĐP+BN → TW (BR-FLOW-08): BN/ĐP gửi TW (FR-XI-08), TW tổng hợp form 21a/21b TT17/2025 (FR-XI-09) + xuất Excel/Word. Cross-module: nguồn số liệu BC ↔ 7.5 VV + 7.6 Chi trả; output BC ↔ 7.11 Báo cáo Thống kê (UC139-142); phân quyền theo DON_VI ↔ 7.10 QTHT.

### 7.16 Module: API Kết nối Chia sẻ Dữ liệu (18 FR)

> **Chi tiết:** [funtion/7.16-API-ket-noi-chia-se.md](funtion/7.16-API-ket-noi-chia-se.md)
> **Tổng TC:** 42 (P0: 13, P1: 24, P2: 5) — 18 API outbound (9 cặp chia sẻ + tìm kiếm) cho Cổng PLQG qua REST JSON kết nối trực tiếp (không LGSP), bảo mật 2 lớp mTLS + JWT Bearer RS256 (BR-INTG-02), rate limit 100 req/min/consumer (BR-INTG-03), response time < 3s (BR-INTG-04). Module KHÔNG có màn hình CMS, KHÔNG có state machine (read-only outbound) — thay vào đó filter theo trạng thái publishable của entity nguồn (BR-INTG-07): HOI_DAP `DA_DUYET`, KHOA_HOC publishable, TU_VAN_VIEN `DANG_HOAT_DONG`, VU_VIEC `HOAN_THANH/DA_DUYET`, DOT_DANH_GIA `DA_DUYET_BC`, BIEU_MAU `CONG_KHAI+la_cong_khai=1`, NOI_DUNG_TU_VAN_CS `HOAN_THANH` (metadata only), CHUONG_TRINH_HTPL `DA_CONG_BO` (kế hoạch only), DOANH_NGHIEP công khai. TC phân 5 nhóm loại (Happy/Negative/Workflow/Auth/Cross-module) + 3 cụm (A Infrastructure 16 TC, B Per-pair 20 TC, C Workflow+Auth+Cross 6 TC). BR-SEC-01 loại trừ thông tin nhạy cảm (CMND/CCCD/SĐT/địa chỉ cá nhân khi expose TVV; MST/địa chỉ chi tiết khi expose VV). Công cụ test: Postman/Bruno + curl+jq + k6 (rate-limit & p95) + OpenSSL s_client (mTLS). Cross-module: đọc từ 7.2/7.3/7.4/7.5/7.7/7.8/7.9/7.12 + module CT HTPLDN — chạy SAU các module đó đã có data publishable. Phân quyền: DN = 🔌 C† (chỉ qua API, không qua CMS, DI-09).

### 7.17 Tổng hợp Test Cases

| Module | P0 | P1 | P2 | Tổng |
|--------|----|----|-----|------|
| Dashboard | 14 | 17 | 3 | 34 |
| Quản trị HT | 12 | 17 | 3 | 32 |
| Hỏi đáp PL | 11 | 21 | 4 | 36 |
| CG/TVV | 10 | 17 | 4 | 31 |
| Vụ việc HTPL | 14 | 16 | 5 | 35 |
| Chi trả Chi phí | 13 | 13 | 4 | 30 |
| Doanh nghiệp | 4 | 11 | 3 | 18 |
| Đào tạo, Tập huấn | 14 | 24 | 2 | 40 |
| Đánh giá Hiệu quả | 14 | 22 | 4 | 40 |
| Thư viện Biểu mẫu | 11 | 25 | 2 | 38 |
| Tư vấn Chuyên sâu | 16 | 25 | 3 | 44 |
| Tư vấn Nhanh | 12 | 25 | 2 | 39 |
| Báo cáo Thống kê | 12 | 22 | 4 | 38 |
| Hợp đồng Tư vấn | 9 | 18 | 2 | 29 |
| Chương trình HTPLDN | 14 | 23 | 5 | 42 |
| API Kết nối Chia sẻ | 13 | 24 | 5 | 42 |
| **Tổng** | **193** | **320** | **55** | **568** |

> **Phân quyền — 2 tầng test (cập nhật 2026-04-24 — tách round):**
> - **Tầng 1: 40 TC authorization trong §7** = smoke-level — verify nhanh mỗi role có/không có quyền trên module đó (chạy cùng functional test ở Round 4 P4 mỗi module).
> - **Tầng 2: ~1.000 TC trong [permission-matrix.md](permission-matrix.md)** = full coverage cho 16 module — test từng ô Entity × Role. **Tách riêng Round 5 dedicated** ([tasks/_archive/round5/plan.md](../tasks/_archive/round5/plan.md)) sau khi Round 4 functional stable, để tránh lẫn mindset (functional bug vs auth deny) và cho signal sạch. Con số cũ `~550 TC` chỉ áp dụng cho 6 module gốc.

---

## 8. Tools, Skills & Prompt Templates

### 8.1 Tools cho Automated Testing (nếu áp dụng)

| Tool | Mục đích | Khi nào dùng |
|------|---------|-------------|
| **Playwright / Cypress** | E2E automated test cho UI workflows | Khi cần regression test lặp lại |
| **Postman / Bruno** | Test API endpoints trực tiếp | Test CRUD operations, auth, validation |
| **k6 / Artillery** | Load testing | Test PERF-01/03: 500 CCU, response < 3s |
| **OWASP ZAP** | Security scanning | Test XSS, CSRF, injection |
| **axe DevTools** | Accessibility testing | WCAG 2.1 Level A compliance |

### 8.2 Claude Code Skills cho Testing

> **Tool backend (per CLAUDE.md 2026-04-21):** Tất cả skill QA dưới đây dùng **MCP Chrome DevTools** làm primary tool (smoke 3/3 PASS, 0% crash, 1 lần login/session, native `list_network_requests` + `list_console_messages`). Fallback gstack Playwright (`$B`) khi MCP server unavailable. Patterns chi tiết: CLAUDE.md MCP-Rule 1-7 (signal-based `wait_for`, fresh `uid` từ `take_snapshot`, sidebar click thay `navigate_page`, expand sidebar lần đầu).

| Skill | Mục đích | Khi nào dùng |
|-------|---------|-------------|
| `/browse` | Headless browser — navigate, click, verify, đếm data | Smoke test (L1), pure seed fixture (L2) |
| `/qa-only` | QA report only (không fix) | Workflow test (L3), Functional test (L4) — báo cáo bug cho dev team |
| `/qa` | Systematic QA test + fix bugs | Như `/qa-only` nhưng iterative fix ngay (khi có quyền write source) |
| `/design-review` | UI/UX audit — so sánh UI thực tế vs Prototype, visual/spacing/hierarchy | Sau Lệnh 4 (L5), audit 7 patterns P-01→P-07 per module |
| `/investigate` | Root cause analysis khi gặp bug | Debug lỗi phức tạp giữa workflow/functional |

### 8.3 Flow thực thi — 5 Lệnh theo thứ tự (v3.0)

Module `funtion/7.X-*.md` chứa BR + TC chi tiết (dùng ở Lệnh 4). `flow-module.md` chứa workflow per module (dùng ở Lệnh 3). `seed-fixture.yaml` chứa giá trị input (dùng ở Lệnh 2). **AI chỉ cần 3 file input này + bảng I/O → đủ chạy.**

**Rules chung cho tất cả lệnh:**
- **Gate:** Lệnh N+1 chỉ chạy khi output của Lệnh N tồn tại. Không có → dừng, chạy Lệnh N trước.
- **Test method:** Mặc định skill UI (`/browse`, `/qa-only`, `/design-review`) với tool backend **MCP Chrome DevTools** (per §8.2 note). CHỈ test API khi TC bắt buộc qua API (vd DN role: HD-027, VV-030, CT-026, DN-016, TVV-029).
- **Fallback khi MCP fail:** Restart Claude Code → MCP tự reconnect (per MCP-Rule 5). Vẫn fail → fallback gstack `$B` (per CLAUDE.md Rule 6 + Rule 7 retry 1 lần). Cả hai fail → BLOCKED toàn bộ TC UI + ghi `Browser tool unavailable (MCP + gstack both failed)`. KHÔNG bypass sang API cho TC UI. Báo user + dừng.
- **Fail-fast:** Endpoint 404 → thử max 2 path variant.
- **Time budget per module:** Lệnh 2 (seed) = 20 phút. Lệnh 3 (workflow) = 30 phút (default) / **60 phút cho module SM phức tạp (SM ≥10 state HOẶC ≥3 role switch)**. Lệnh 4 (functional) = 45 phút, Lệnh 5 (UI) = 30 phút. Vượt → dừng + report progress.
- **Seed idempotency (đơn giản):** Đầu Lệnh 2 — đọc seed-checklist hiện có. Mỗi variant: check unique key (MST/username/mã) đã tồn tại trên UI (filter theo key) → tồn tại = skip, ghi Sample ID cũ vào checklist. Không tạo duplicate.
- **Pure seed mindset (Lệnh 2):** CHỈ tạo entry state. KHÔNG advance workflow. KHÔNG switch account khi seed. Bug phát hiện khi seed → note, KHÔNG log bug (log ở Lệnh 4).
- **Workflow switch account (Lệnh 3):** Bảng flow-module.md có cột "Account thao tác" — tuân thủ đúng role (CB NV → CB PD → TVV → CB NV…). Login/logout mỗi lần đổi account.
- **BLOCKED states (§7.0c):** Mark BLOCKED ngay với reason code, KHÔNG tạo qua UI. Lệnh 4/5 đọc BLOCKED → skip TC phụ thuộc.
- **Session split:** Lệnh 1-2 cùng session OK. Lệnh 3 (workflow, cần account switch nhiều) **session MỚI**. Lệnh 4 & 5 mỗi lệnh session MỚI.

**Bảng I/O per Lệnh (5 lệnh mới):**

| # | Lệnh | Skill | Input (@ vào prompt) | Output | Gate trước khi chạy |
|---|------|-------|----------------------|--------|---------------------|
| 0 | Archive đợt cũ (tuỳ chọn) | — (Bash) | — | `output/qa-reports/_archive/round{N-1}-YYYY-MM-DD/` | Có round cũ cần archive |
| 1 | Smoke test | `/browse` | `@test-strategy.md` (§1.1, §1.2, §9) | `output/qa-reports/round{N}/smoke-test/smoke-test-report.md` | — |
| **2** | **Pure Seed (per module)** | `/browse` | `@input/data/seed-fixture.yaml` (variants của module) + `@input/flow-module.md` (§BƯỚC 1 của module) + `@template/seed-checklist-template.md` | `output/qa-reports/round{N}/{module}/seed-checklist-{module}.md` (3 cột: Variant / Seeded / Sample ID) | Lệnh 1 PASS + Tier dependencies đã seed |
| **3** | **Workflow test (per module, session MỚI)** | `/qa-only` | `@input/flow-module.md` (§module bảng flow Bước 1→N + Phụ lục 2 preset + Phụ lục 3 troubleshooting) + `@output/qa-reports/round{N}/{module}/seed-checklist-{module}.md` + `@template/workflow-test-report-template.md` | `output/qa-reports/round{N}/{module}/workflow-test-report-{module}.md` | Lệnh 2 có ≥1 Sample ID entry state (module BLOCKED §7.0c skip) |
| 4 | Test functional (session MỚI) | `/qa-only` | `@funtion/7.X-{module}.md` + `@output/qa-reports/round{N}/{module}/workflow-test-report-{module}.md` + `@template/bug-report-template.md` + `@template/functional-test-report-template.md` | `output/qa-reports/round{N}/{module}/functional-test-report.md` + `bug-report-{module}.md` + `evidence/` + `screenshots/` | Lệnh 3 happy path PASS (workflow module stable) |
| 5 | UI/UX audit (session MỚI) | `/design-review` | `@funtion/7.X-{module}.md` (SCR-* + URL) + Prototype URL §9 + `@template/bug-report-template.md` | `output/qa-reports/round{N}/{module}/design-review-report.md` + `screenshots/design-diff/` (+ append bug UI vào `bug-report-{module}.md`) | Lệnh 4 xong, không còn Blocker/Critical functional open |

**So với v2.x:** Lệnh 2 cũ "Data readiness check" + Lệnh 3 cũ "Tạo data thiếu (walk workflow)" → gộp + tách thành **Lệnh 2 Seed (pure entry state)** + **Lệnh 3 Workflow (walk full SM)**. Số lượng lệnh giữ nguyên 5, nhưng scope của từng lệnh khác hẳn.

### 8.4 TC chi tiết (Tầng 2 — field-level)

Sau khi chạy Lệnh 4 xong, với module KHÔNG có Blocker → chạy `/bmad-testarch-test-design` tạo TC chi tiết field-level (BVA, EP, XSS). Input: SRS + Prototype + funtion/7.X. Output: `output/test-cases/tc-{module}-chitiet.md`.

---

## 9. Môi trường kiểm thử

| Thành phần | Giá trị |
|-----------|---------|
| Web App URL | http://103.172.236.130:3000/ |
| OTP login | **666666** (fixed OTP — config tạm thời để qua bước login nhanh) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 <!-- Giữ lại để fallback khi bypass 666666 bị tắt, hoặc để verify email khác (reset pass, kích hoạt TK) --> |
| **Prototype** | **https://prototype-dusky-alpha.vercel.app/dashboard.html** |
| Browser | Chrome / Edge (desktop, min 1024px) |
| Dữ liệu test | Seed data từ hệ thống + test data tạo trong quá trình test |

> **OTP bypass (tạm thời):** Hệ thống đang config OTP cố định `666666` cho mọi tài khoản để tester/automation qua bước login nhanh.
> Đây là phương pháp **tạm thời** — khi dev tắt bypass, quay lại dùng MailHog (link inbox giữ ở hàng trên) để lấy OTP thật.
> TC liên quan **sinh/gửi OTP thực tế** (bảo mật, rate-limit) vẫn phải test với OTP từ MailHog, không dùng 666666.
>
> **Prototype** được dùng làm tài liệu tham chiếu UI/UX bổ sung bên cạnh SRS.
> Khi test, so sánh UI thực tế với Prototype để phát hiện sai lệch về:
> layout, vị trí nút, thứ tự field, flow người dùng, label/text.

---

## 10. Tiêu chí đạt/không đạt

### 10.1 Tiêu chí đạt (Pass Criteria)

| # | Tiêu chí | Ngưỡng |
|---|---------|--------|
| 1 | Tất cả test cases P0 phải PASS | 100% P0 pass |
| 2 | Test cases P1 pass rate | ≥ 90% P1 pass |
| 3 | Không có bug Blocker/Critical chưa fix | 0 blocker/critical open |
| 4 | Phân quyền 3 cấp hoạt động đúng | 100% authorization tests pass |
| 5 | State machines chạy đúng happy path | 100% happy path pass |
| 6 | Audit log ghi đầy đủ các thao tác CUD | Verify qua nhật ký HT |
| 7 | SLA tính đúng cho Vụ việc và Chi trả | Verify calculation accuracy |

### 10.2 Phân loại Bug Severity

| Severity | Định nghĩa | Ví dụ |
|----------|-----------|-------|
| **Blocker** | Không thể sử dụng hệ thống | Không đăng nhập được, crash toàn bộ |
| **Critical** | Chức năng chính không hoạt động | Không tạo được VV, workflow bị stuck, tính sai chi trả |
| **Major** | Chức năng phụ lỗi hoặc logic sai | SLA tính sai, phân quyền sai data scope |
| **Minor** | Lỗi UI/UX nhỏ, workaround có sẵn | Sắp xếp sai, label sai chính tả |
| **Trivial** | Cosmetic, không ảnh hưởng chức năng | Font inconsistent, spacing |

---

## 11. Rủi ro & Giảm thiểu

| # | Rủi ro | Mức độ | Giảm thiểu |
|---|--------|--------|-----------|
| 1 | Server test (103.172.236.130) không ổn định | Cao | Báo ngay cho team, test offline bằng screenshot/video |
| 2 | Không có tài khoản BN/ĐP khác để test ngang cấp | Trung bình | Yêu cầu team tạo thêm tài khoản Bộ/Ngành, Sở TP khác |
| 3 | Module Chi trả phụ thuộc DVC/LGSP chưa có | Cao | Test thủ công bằng cách tạo HS trực tiếp trên PM, bỏ qua kênh DVC |
| 4 | BR-CALC-01/02 chưa xác nhận NĐ18/2026 | Trung bình | Test theo cả NĐ55 (fallback) và NĐ18 (proposed) |

---

## 12. Kế hoạch thực hiện

### 12.1 Timeline (v3.2 2026-04-24 — pure phase GĐ 0→1→2→3→chi tiết)

**Round 4 — Smoke + Seed + Workflow + Functional + Chi tiết/UI/Regression (5 tuần):**

Mỗi tuần = 1 giai đoạn strategy pure (không trộn), gate hold-for-review giữa phase.

| Tuần | Phase | Giai đoạn strategy | Trọng tâm |
|------|-------|---------------------|-----------|
| 1 | P1 Smoke + Seed Tier 0-1 | **GĐ 0 + GĐ 1 (partial)** | Ngày 1-2: Smoke 16 module × 5 role. Ngày 3-5: Seed QTHT + 6 DN + 6 TVV |
| 2 | P2 Seed Tier 2-4 xong hẳn | **GĐ 1 (complete)** | Seed 11 entity entry state: HD/VV/TVCS/HSPL/CTDT+KHOAHOC/HDTV/DANHGIA/KHOCH/CT_HTPLDN + verify BE-synced Chi trả/TV Nhanh |
| 3 | P3 Workflow xong hẳn | **GĐ 2** | 8 SM walk lifecycle (TVV/HD/VV/TVCS/KHOAHOC/CHITRA/TVNHANH/CT_HTPLDN) — happy + reject + auto-transition + guard |
| 4 | P4 Functional xong hẳn | **GĐ 3** | 16 module functional (negative + alternative + edge) + smoke-auth 40 TC/module + BR-EC-01..23 |
| 5 | P5 Chi tiết + UI + Regression + Summary | **§8.4 + Lệnh 5** | TC chi tiết field-level (BVA/EP/XSS qua `/bmad-testarch-test-design`) cho 6 module P0 + /design-review 16 module + regression round 3 + cross-module + non-func + summary |

**Round 5 — Permission Matrix & Data Isolation (1.5 tuần, sau Round 4 sign-off):**

| Tuần | Trọng tâm | Scope |
|------|-----------|-------|
| 6 | 11 batch role-walkthrough | 11 role × 16 module × entity × CRUD ~1.000 TC |
| 7 (3 ngày) | DI-01..DI-09 deep + edge auth + summary | Data isolation cross-unit, URL direct, session tampering |

Xem chi tiết: [tasks/plan.md](../tasks/plan.md) (Round 4 v1.3) + [tasks/_archive/round5/plan.md](../tasks/_archive/round5/plan.md) (Round 5).

> **Ghi chú 2026-04-24:**
> - **Pure phase per tuần** — mỗi tuần 1 giai đoạn strategy (Smoke → Seed → Workflow → Functional → Chi tiết/UI). Tránh lẫn mindset + gate sạch giữa phase.
> - M8 Chi trả (SM-CHITRA) + M10A Phiên TV nhanh (SM-TVNHANH) — **data đồng bộ từ DVC/LGSP/Cổng PLQG** (có sẵn BE), tester test flow xử lý downstream. Cascade-block nếu BE sync rỗng.
> - Permission matrix full **tách Round 5 riêng** — Round 4 chỉ smoke-level auth 40 TC/module (lồng T4 functional). Lý do: tránh lẫn mindset + signal auth sạch sau khi functional stabilize.
> - **§8.4 TC chi tiết field-level** (BVA/EP/XSS) tách T5 riêng, áp dụng 6 module P0 (HD/CG-TVV/VV/DN/TVCS/KHOAHOC) — không gộp vào T4 functional để tránh loãng focus.

### 12.2 Deliverables

| # | Deliverable | Mô tả |
|---|------------|-------|
| 1 | Test Strategy (file này) | Chiến lược, phương pháp, scope |
| 2 | Test Cases chi tiết | Test cases cho 16 module (568 TC functional theo §7.17 + ~1.000 TC phân quyền) |
| 3 | Test Execution Log | Kết quả thực thi từng TC: Pass/Fail + evidence |
| 4 | Bug Report | Danh sách bug: severity, steps to reproduce, screenshot |
| 5 | Authorization Test Report | Kết quả ma trận phân quyền |
| 6 | Test Summary Report | Tổng hợp: pass rate, bug metrics, recommendations |

---

## Phụ lục A — Checklist Smoke Test tổng quát

Verify nhanh hệ thống hoạt động. Mục tiêu: mỗi module load được, login/logout work.

- [ ] Truy cập URL test (http://103.172.236.130:3000/) → Trang login hiển thị
- [ ] Đăng nhập admin → nhập OTP **666666** (bypass cố định) → Dashboard hiện <!-- Nếu bypass bị tắt: lấy OTP từ MailHog http://103.172.236.130:8025 -->
- [ ] Lần lượt vào 16 module (§1.1) → danh sách load, không lỗi trắng (Dashboard là landing page mặc định CB_NV/CB_PD)
- [ ] Đăng xuất → Session hủy → Redirect login
- [ ] Đăng nhập CB_NV (canbo_tw) → Thấy menu + nút CRUD
- [ ] Đăng nhập CB_PD (lanhdao_tw) → Thấy menu + nút phê duyệt
- [ ] Đăng nhập CB_NV cấp BN (canbo_bn) → Data scope đúng đơn vị BN
- [ ] Đăng nhập CB_NV cấp ĐP (canbo_tinh) → Data scope đúng đơn vị ĐP

> **Smoke test chi tiết per module:** Xem §A Smoke checklist trong các file [funtion/7.X-*.md](funtion/).
> **Chi tiết phân quyền per role:** §7 (TC authorization mỗi module) và Tuần 4 (full permission matrix).
