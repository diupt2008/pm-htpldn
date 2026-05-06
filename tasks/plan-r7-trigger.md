# Plan trigger Round 7 — Apply 3 SRS update 2026-05-05

> **File:** execution checklist khi dev deploy + reset DB. Tách khỏi `plan.md` để dùng đúng lúc event xảy ra.
> **Ngày tạo:** 2026-05-06 | **Tác giả:** QA + Claude
> **Tham chiếu:** [`_DELTA-MAP-FR03/04/07/10/12.md`](../input/srs-update-2026-5-5/) + [`_DELTA-MAP-CROSS-CUTTING.md`](../input/srs-update-2026-5-5/_DELTA-MAP-CROSS-CUTTING.md) + [`_DELTA-MAP-PROFILE-PWD.md`](../input/srs-update-2026-5-5/_DELTA-MAP-PROFILE-PWD.md)

> **Update 2026-05-06 sau verify role-correct:** Bảng §5 "8 bug deploy gap" đã re-verify với role đúng — **6 bug confirmed, 2 dropped (false positive)**. Sub-menu "Tổ chức tư vấn" + "Người hỗ trợ pháp lý" thực tế đã deploy, lần verify đầu dùng `qtht_01` không thấy vì SCR-IV-01 line 1474-1477 không cho QTHT permission. Đầy đủ 6 bug + evidence: [`output/qa-reports/round7-2026-05-06/bug-reports/bug-report-deploy-gap.md`](../output/qa-reports/round7-2026-05-06/bug-reports/bug-report-deploy-gap.md). Bài học: [`tasks/lessons-learned.md` 2026-05-06](lessons-learned.md).

---

## 1. Scenario thực tế (verified 2026-05-06 qua MCP web rà soát)

**Đây KHÔNG phải Scenario A/B/C đơn giản — là MIX:**

| Thành phần | Status | Bằng chứng |
|---|---|---|
| DB reset | **MỘT PHẦN** | DN có 30 record mới (DN000001..030 — pattern khác Round 6 cũ 62 record) |
| TVV/CG/NHT data | **Reset hết** | KPI-07 = 0 người, table TVV "Không có dữ liệu" |
| KH/CTĐT data | **Reset hết** | KPI đào tạo = 0 |
| VV data | **Có 70 record** | Dashboard "Vụ việc tiếp nhận: 70" — cần verify là VV cũ migrate hay seed mới |

→ Pattern: dev reset data ACTOR (DN/TVV/KH) + giữ data TRANSACTIONAL (VV) hoặc seed VV mới.

---

## 2. Deploy status — verified qua API + UI

### ✅ ĐÃ deploy (10 thay đổi)

| # | Item | Bằng chứng |
|---|---|---|
| 1 | FR-VIII-22 Self-reg DN | Login page có button "Đăng ký tài khoản doanh nghiệp" |
| 2 | FR-VIII-26 Quên MK | Login page có link "Quên mật khẩu?" |
| 3 | Menu "Cá nhân tư vấn" → **"Mạng lưới Tư vấn viên"** | Sidebar đổi tên đúng |
| 4 | Sub-menu "Tư vấn viên / Chuyên gia" | Render OK trong Mạng lưới TVV |
| 5 | Tab tách "Đang thẩm định" + "Yêu cầu bổ sung" | UI 6 tab TVV |
| 6 | FR-VIII-23 VNeID button | Login có "Đăng nhập bằng VNeID" |
| 7 | Endpoint `/api/v1/to-chuc-tu-vans` | 401 (deployed, cần auth) |
| 8 | Endpoint `/api/v1/ngay-le` | 401 (deployed) |
| 9 | Endpoint `/api/v1/ke-hoach-dao-taos` | 401 (deployed — entity FR-03 mới) |
| 10 | FR-V.III-NEW-01 Bỏ Import DN | Trang DN KHÔNG có button [Thêm mới]/[Import Excel] |

### ❌ CHƯA deploy hoặc PARTIAL (8 thay đổi)

| # | Item | Bằng chứng | Block test gì |
|---|---|---|---|
| 1 | **Entity NGUOI_HO_TRO BE** | `/api/v1/nguoi-ho-tros` → **404** | R7 P3 NHT (FR-IV-NHT-01/02/03) |
| 2 | **Entity HOC_VIEN BE** | `/api/v1/hoc-viens` → **404** | R7 FR-03 đào tạo (HOC_VIEN entity mới) |
| 3 | **Sub-menu UI "Người hỗ trợ pháp lý"** | Sidebar Mạng lưới TVV chỉ 1 sub-menu (TVV/CG) | UI test FR-IV-NHT |
| 4 | **Sub-menu UI "Tổ chức tư vấn"** | Sidebar chỉ TVV/CG | UI test FR-IV-NEW-01 (BE có endpoint, UI chưa expose) |
| 5 | **Sub-menu Đào tạo:** Kế hoạch năm + Lịch học + Đề kiểm tra + Học viên | Đào tạo chỉ 5 sub-menu cũ | R7 FR-03 (5 FR mới: III-20/21/22/NEW-01/02/03) |
| 6 | **Tab "Ngày lễ" trong Cấu hình HT** | Cấu hình HT 4 tab: SLA/Phân công/Mẫu/Quy trình | UI test FR-VIII-29 |
| 7 | **Filter "Địa bàn" TVV vẫn còn** | TVV table có dropdown "Địa bàn" | SRS update đã BỎ `dia_ban_ids` |
| 8 | **Tab SM-TVV "Chờ kích hoạt"** | TVV table chỉ 6 tab (Đang HĐ/Tạm dừng/Mới ĐK/YCBS/Đang TĐ/Chờ PD) | SRS update có `CHO_KICH_HOAT` mới |

### ⚠️ TVCS endpoint 404

`/api/v1/tu-van-chuyen-saus` → 404. Có thể URL khác (TBD). Cần dev confirm path đúng hoặc verify khi click menu "Quản lý tư vấn".

---

## 3. Phương án xử lý — STOP TRƯỚC KHI TEST + escalate dev

**Lý do:** 8/18 thay đổi CHƯA deploy = **partial deploy** = nếu run R7 ngay sẽ:
- Block 5+ task R7 P3 (NHT) + R7 FR-03 (HOC_VIEN entity)
- False bug report (UI thiếu sub-menu — đó là dev gap, không phải bug spec)
- Mất time test feature dev chưa support

### Option khả thi

| Option | Mô tả | Effort | Risk |
|---|---|---|---|
| **A. STOP — escalate dev fix gap trước** | Báo dev 8 item chưa deploy, chờ deploy đầy đủ rồi run R7 | 1-2 ngày chờ dev | Thấp |
| **B. Run partial — chỉ test phần đã deploy** | Test 10 thay đổi đã deploy + skip 8 item chờ dev | 2-3 ngày | Trung bình — phải re-test khi dev deploy nốt 8 item |
| **C. Hybrid — test deployed + parallel hỏi dev** | Bắt đầu R7 P0/P1/P2 (FR-10 nền tảng) trong khi dev fix UI 8 item, đồng thời log bug UI gap | 1-2 ngày | Thấp — dev fix UI 8 item là việc nhỏ (sub-menu + tab) |

→ **Recommend Option C** — không lãng phí time chờ dev, vẫn có audit log gap UI.

---

## 4. Execution checklist — Option C

### Phase A — Pre-test (T0, sau dev deploy lần này)

- [x] **A1** Verify deploy status (DONE 2026-05-06): 10 deployed + 8 partial — báo cáo này
- [ ] **A2** Frozen Round 6 — đổi header todo.md thành "Round 6 frozen + Round 7 active"
- [ ] **A3** Backup + commit baseline trước khi seed
- [ ] **A4** Log bug UI gap 8 item — file mới `output/qa-reports/round7-2026-05-06/bug-report-deploy-gap.md`
  - 8 bug Severity Major (UI gap) — gửi dev đồng thời chạy P1+P2

### Phase B — Run R7 song song dev fix UI gap (T0+1 đến T0+3 ngày)

**Có thể chạy NGAY (deploy đủ):**
- R7.1.1 Seed 5 ngày lễ (qua API trực tiếp `/api/v1/ngay-le` POST — vì UI tab chưa có)
- R7.2.1 FR-VIII-22 Self-reg DN — login page button đã có
- R7.2.2 FR-VIII-26 Quên MK / Kích hoạt — login link đã có
- R7.2.3 FR-VIII-28 Nhật ký HT — sub-menu "Nhật ký hệ thống" đã có
- R7.3.2 FR-IV-NEW-01 Quản lý TC TV (qua API direct vì UI sub-menu chưa)
- R7.3.3 FR-IV-NEW-04 Phê duyệt TC TV (qua API)
- R7.3.4 FR-IV-13 Tiếp nhận TVV — UI có
- R7.4.1+R7.4.2 FR-07 DN — UI đã đúng (verify bỏ Thêm mới/Import)

**Block — chờ dev fix:**
- R7.3.1 NHT (entity 404)
- R7 FR-03 HOC_VIEN/Lịch học/Đề kiểm tra (4 sub-menu chưa có + entity 404)
- R7.2.4 NGAY_LE UI test (tab chưa có — chạy bằng API trực tiếp tạm)

### Phase C — Re-test 9 R6 task liên quan SRS update (T0+3 đến T0+5 ngày)

R7.0.5 — re-evaluate sau Phase B PASS:
- R6.5.1 KPI-07 → verify count = 0 (TVV reset, NHT chưa có entity nên = 0 đúng)
- R6.5.3 SLA + NGAY_LE → verify deadline tính skip ngày lễ
- R6.7.2 CG/TVV (31 TC) → re-test với enum mới (sau dev fix UI tab + filter)
- R6.7.4 DN (8 TC) → DN-007 PARTIAL có thể obsolete vì CB NV bỏ Create
- R6.4.A1.5 PC TVV → re-test dropdown sau dev fix entity NHT
- R6.4.B2/B2.5/B7 (CTĐT/KH) → SM-CTDT mới giải quyết spec contradiction → unblock
- R6.4.D2 (FR-08 ĐG) → dev item 2 fix bug
- R6.4.D3 (Kho QA) → dev item 4 fix bug

### Phase D — Re-test 12 R6 task spec KHÔNG đổi (T0+5 đến T0+7 ngày)

R6.6.1 Chi trả + R6.6.2/3 TV nhanh + R6.6.5 CT GĐ2 + R6.7.5/6/7/9/11/13/14/16 + R6.7.10 BM + R6.7.17 Edge — re-test với data fresh (cùng spec cũ).

### Phase E — Cross-cutting verify (R7.0.6 — T0+7)

3 verify từ user clarify:
- Hard delete: verify DELETE → record không còn trong GET list
- Bỏ ClamAV: upload file `.exe` → verify BE không scan (security regression đã flag)
- Bỏ lưu nháp: verify form không có button [Lưu nháp] (scope HẸP — entry state DRAFT giữ nguyên)

---

## 5. Bug report deploy gap — template gửi dev

> File output: `output/qa-reports/round7-2026-05-06/bug-report-deploy-gap.md`

| Bug ID | Severity | Module | Mô tả 1 dòng |
|---|---|---|---|
| DEPLOY-001 | Major | FR-04 | Entity NGUOI_HO_TRO BE chưa deploy (`/api/v1/nguoi-ho-tros` → 404) |
| DEPLOY-002 | Major | FR-04 | Sub-menu UI "Người hỗ trợ pháp lý" chưa thêm vào sidebar Mạng lưới TVV |
| DEPLOY-003 | Major | FR-04 | Sub-menu UI "Tổ chức tư vấn" chưa thêm (BE đã có endpoint) |
| DEPLOY-004 | Major | FR-03 | Entity HOC_VIEN BE chưa deploy (`/api/v1/hoc-viens` → 404) |
| DEPLOY-005 | Major | FR-03 | 4 sub-menu Đào tạo mới chưa thêm: Kế hoạch năm/Lịch học/Đề kiểm tra/Học viên |
| DEPLOY-006 | Medium | FR-10 | Tab "Quản lý ngày lễ" trong Cấu hình HT chưa thêm (BE có endpoint) |
| DEPLOY-007 | Medium | FR-04 | Filter "Địa bàn" trong table TVV vẫn còn (SRS update đã bỏ `dia_ban_ids`) |
| DEPLOY-008 | Medium | FR-04 | Tab SM-TVV "Chờ kích hoạt" chưa thêm (SRS update có CHO_KICH_HOAT mới) |

---

## 6. Tracking — link vào todo.md

R7.0.0 verify scenario reset DB → **DONE 2026-05-06** (kết quả: MIX partial reset + partial deploy).

R7.0.0.1 mới: log 8 bug deploy gap + escalate dev.

R7.0.0.2 mới: API direct seed (workaround UI gap) — seed NGAY_LE + TC TV qua POST API.

---

## 7. Câu hỏi BA còn open (khi test phát sinh)

Defer log bug khi gặp behavior thực tế:
- Hard delete cascade FK behavior (compliance NĐ55/NĐ77 retention).
- ClamAV alternative — security regression risk.
- Migration data cũ `loai_tvv = 'NHT'` — verify khi gặp record cũ trong DB.

---

## 8. Time estimate final

| Phase | Effort | Cumulative |
|---|---|---|
| A pre-test + bug report gap | 0.5 ngày | T+0.5 |
| B run R7 partial + chờ dev fix UI gap | 2-3 ngày | T+3 |
| C re-test 9 R6 SRS impact | 1.5 ngày | T+4.5 |
| D re-test 12 R6 spec không đổi | 2 ngày | T+6.5 |
| E cross-cutting verify | 0.5 ngày | T+7 |

**Tổng: 7 ngày** (nếu dev fix UI gap song song trong 1-2 ngày). Nếu dev chậm → Phase B kéo dài thêm 1-2 ngày.
