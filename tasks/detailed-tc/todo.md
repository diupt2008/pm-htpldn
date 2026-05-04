# TODO — Plan Test Chi Tiết 16 Module (Phase A + B sync 1 file)

**Plan:** [plan.md](plan.md) · **Today:** 2026-04-30
**Estimate:** 19-22 ngày (A 7-9 + B 12-15, có overlap song song)
**Tool A:** Skill BMAD · **Tool B:** MCP chrome-devtools + `/qa-only`

**Icon:** ✅ xong · 🟢 sẵn sàng · 🔵 đang làm · ⏳ chờ data · ⚠️ partial · 🚫 block · 📝 chưa viết TC

**Quy ước:** mỗi module có 2 task `A` + `B` nested. Update A xong → flip B từ 🚫 chờ TC → 🟢 hoặc 🚫 chờ bug khác.

---

## Tiến độ tổng

| Wave | Lớp | Modules | TC tổng | Phase A | Phase B |
|---|---|---|---:|---|---|
| W1 | 1 | 4 QTHT | 408 | ✅ tất cả | 🟢 4 ready |
| W2 | 2 | DN + CG-TVV + BM + CT GĐ1 | 416 | ✅ DN, 📝 3 còn lại | 🟢 1 + 🚫 3 |
| W3 | 3 | HD + VV + TVCS + KH | 383 | ✅ HD, 📝 3 còn lại | 🟢 1 + 🚫 3 |
| W4 | 4 | HĐTV + CT + TVN + ĐG | 260 | 📝 4 | 🚫 4 |
| W5 | 5 | CT GĐ2 + BC + DB + API | 220 | 📝 4 | 🚫 4 |

---

## D0 — Triage + audit (0.5 ngày)

- 🟢 **D0.1** Update `00-tong-so-luong-testcase.md` — DN 224, total 717
- 🟢 **D0.2** Audit 5 file REVIEW edge-case-hunter — verify TC merge file chính
- 🟢 **D0.3** Map dependency 16 module × seed/workflow → `_dep-matrix.md`
- ⏳ **D0.4** User duyệt thứ tự + strategy

---

## Wave 1 — LỚP 1 QTHT nền tảng (3 ngày) — 🟢 ALL READY (Phase A đã có)

### W1.1 QTHT Nhật ký HT (46 TC, 0.5 ngày)

- ✅ **A** — TC đã có (`01-TC-nhat-ky-he-thong.md`)
- 🟢 **B** — Chạy 46 TC
  - **TK:** qtht_01 + cb_nv_tw_01 + cb_pd_tw_01
  - **Output:** `output/execution-test/QTHT/Nhat-ky-he-thong/`

### W1.2 QTHT Cấu hình HT (47 TC còn lại, 0.5 ngày)

- ✅ **A** — TC đã có (4 file 01-04)
- ⚠️ **B** — Đã chạy 32/79 ở T4.8, đóng gap 47 TC còn lại
  - SLA (~12), Phân công (~10), Mẫu PH (~12), Quy trình (~13)
  - **Output:** `output/execution-test/QTHT/Cau-hinh-he-thong/`

### W1.3 QTHT DM dùng chung (187 TC, 1.5 ngày)

- ✅ **A** — TC đã có (10 file 01-10) + TPL strategy
- 🟢 **B** — Chạy theo strategy
  - B.1 TPL 47 TC đại diện DM Lĩnh vực
  - B.2 Smoke 5×13 = 65 TC
  - B.3 Đặc thù 9 DM = 75 TC
  - **Output:** `output/execution-test/QTHT/DM-dung-chung/`

### W1.4 QTHT TKPQ (128 TC, 1.5 ngày)

- ✅ **A** — TC đã có (4 file 01-04)
- 🟢 **B** — Chạy 128 TC
  - Vai trò 29 + Tài khoản 57 + PQ Dữ liệu 20 + PQ Chức năng 22
  - **TK:** qtht_01 + 5 role verify + `_03` permission test
  - **Output:** `output/execution-test/QTHT/tai-khoan-phan-quyen/`

**Checkpoint W1:** 4 functional report + 0 Critical Open → duyệt W2

---

## Wave 2 — LỚP 2 Master Data (4 ngày)

### W2.1 Doanh nghiệp (224 TC) — ✅ Có TC

- ✅ **A** — TC đã có (6 file 01-06, 224 TC)
- ⚠️ **B** — Đã chạy 18/224 ở T4.4, đóng gap 206 TC còn lại
  - CRUD (50) + Search (~25) + Tab HSPL (32) + Tab LS (26) + Permission (30)
  - 🚫 Import Excel (39) — block BUG-Critical
  - **Output:** `output/execution-test/quan-ly-doanh-nghiep/`

### W2.2 CG/TVV (FR-04, ~80 TC, 1 ngày)

- 📝 **A** — Viết TC mới — `bmad-testarch-test-design` + `generate-e2e-tests`
  - **Output:** `output/test-cases/CG-TVV/00..NN`
- 🚫 **B** — Chạy TC khi A ✅ + BUG-TVCS-003/004 close
  - **Output:** `output/execution-test/chuyen-gia-tu-van-vien/`

### W2.3 Biểu mẫu (FR-09, ~60 TC, 0.5 ngày)

- 📝 **A** — Viết TC mới
  - **Output:** `output/test-cases/bieu-mau/`
- 🚫 **B** — Chạy khi A ✅ + 3 bug-flow-BIEUMAU verify
  - **Output:** `output/execution-test/bieu-mau/` (cần tạo)

### W2.4 CT HTPLDN GĐ1 (FR-15, ~70 TC, 0.5 ngày)

- 📝 **A** — Viết TC mới
  - **Output:** `output/test-cases/ct-htpldn-gd1/`
- 🚫 **B** — Chạy khi A ✅ + 3 bug-flow-CTHTPLDN verify
  - **Output:** `output/execution-test/ct-htpldn-gd1/` (cần tạo)

**Checkpoint W2:** Master data đủ → duyệt W3

---

## Wave 3 — LỚP 3 Giao dịch lõi (3 ngày)

### W3.1 Hỏi đáp (118 TC) — ✅ Có TC

- ✅ **A** — TC đã có (7 file 01-07, 118 TC)
- ⚠️ **B** — Đã chạy 35/118 ở T4.1, đóng gap 83 TC còn lại
  - CRUD (~20) + Search + Tiếp nhận + Quản lý
  - ⚠️ Phân công — verify BUG-A4 cascade
  - ⚠️ Phản hồi — verify BUG-FUNC-HOIDAP-001 close
  - 🚫 Phê duyệt — block 3 TC do BUG-HOIDAP-004 502
  - **Output:** `output/execution-test/hoi-dap/`

### W3.2 Vụ việc TGPL ⭐ (FR-05, ~120 TC, 1 ngày — module phức tạp nhất)

- 📝 **A** — Viết TC mới (file lớn nhất)
  - **Output:** `output/test-cases/vu-viec/` — 15 bước SM-VUVIEC
- 🚫 **B** — Chạy khi A ✅ + BUG-VUVIEC-001 close + DN + CG-TVV
  - **Output:** `output/execution-test/vu-viec/` (cần tạo)

### W3.3 TV Chuyên sâu (FR-12, ~80 TC, 0.5 ngày)

- 📝 **A** — Viết TC mới
  - **Output:** `output/test-cases/tv-chuyen-sau/`
- 🚫 **B** — Chạy khi A ✅ + W2.2 ✅ + BUG-TVCS-004 close
  - **Output:** `output/execution-test/tv-chuyen-sau/` (cần tạo)

### W3.4 Đào tạo Khóa học (FR-03, ~100 TC, 1 ngày)

- 📝 **A** — Viết TC mới (5 entity: CTĐT/Khóa học/Bài giảng/NHCH/Giảng viên)
  - **Output:** `output/test-cases/dao-tao/`
- 🚫 **B** — Chạy khi A ✅ + B7 close + 3 học viên seed
  - **Output:** `output/execution-test/dao-tao/` (cần tạo)

**Checkpoint W3:** Lõi đủ data Hoàn thành → duyệt W4

---

## Wave 4 — LỚP 4 Phái sinh (2 ngày)

### W4.1 Hợp đồng TV (FR-14, ~50 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + Trụ E1 unblock + W3.3 ✅
  - **Output:** `output/execution-test/hop-dong-tv/` (cần tạo)

### W4.2 Chi trả (FR-06, ~70 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + E3 + Vụ việc Hoàn thành (W3.2)
  - **Output:** `output/execution-test/chi-tra/` (cần tạo)

### W4.3 TV Nhanh (FR-13, ~60 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + E4 + Kho QA
  - **Output:** `output/execution-test/tv-nhanh/` (cần tạo)

### W4.4 Đánh giá HQ (FR-08, ~80 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + Vụ việc Hoàn thành (W3.2) + D2
  - **Output:** `output/execution-test/danh-gia/` (cần tạo)

**Checkpoint W4:** Phái sinh đủ → duyệt W5

---

## Wave 5 — LỚP 5 Tổng hợp & Đầu ra (2 ngày)

### W5.1 CT HTPLDN GĐ2 (FR-15, ~50 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + W2.4 + W3.2 + W4.2 cascade
  - **Output:** `output/execution-test/ct-htpldn-gd2/` (cần tạo)

### W5.2 Báo cáo TK (FR-11, ~80 TC)

- 📝 **A** — Viết TC mới (23 loại BC trên 1 SCR-IX-01 — strategy 1 đại diện + smoke)
- 🚫 **B** — Chạy khi A ✅ + 9 module có data DA_DUYET
  - **Output:** `output/execution-test/bao-cao/` (cần tạo)

### W5.3 Dashboard (FR-01, ~40 TC)

- 📝 **A** — Viết TC mới
- 🚫 **B** — Chạy khi A ✅ + ≥3 record/state cuối từ mỗi module
  - **Output:** `output/execution-test/dashboard/` (cần tạo)

### W5.4 API Kết nối (FR-16, ~50 TC)

- 📝 **A** — Viết TC mới (18 outbound; 8 inbound TODO clarify)
- 🚫 **B** — Chạy khi A ✅ + data CONG_KHAI từ 9 module
  - **Output:** `output/execution-test/api-ket-noi/` (cần tạo)

**Checkpoint W5:** Final aggregate → user duyệt đóng plan

---

## D-Final — Aggregate (0.5 ngày)

- ⏳ **DF.1** Tổng hợp 20 functional-detailed report → `output/execution-test/_aggregate-detailed-tc.md`
- ⏳ **DF.2** Retest TC FAIL nếu dev fix kịp (cap 1 lần/TC)
- ⏳ **DF.3** Update plan + todo status final

---

## Risk

| ID | Risk | Module ảnh hưởng | Mitigation |
|---|---|---|---|
| R1 | Skill BMAD generate TC chất lượng thấp | All Phase A | A4 edge-case-hunter + A6 test-review bắt buộc |
| R2 | BUG-VUVIEC-001 STILL OPEN R8 | W3.2 + W4.2 + W4.4 + W5.1 | Phase A vẫn viết, defer Phase B |
| R3 | BUG-TVCS-003/004 STILL OPEN R8 | W2.2 + W3.3 | Phase A viết, defer Phase B |
| R4 | BUG-HOIDAP-001 + 004 Open | W3.1 (4 TC skip) | Skip TC, đánh dấu defer |
| R5 | E1-E4 chưa unblock | W4.1-3 + W5.x | DEFER Wave 4-5 nếu cuối T2 chưa ready |
| R6 | Phase A blow up >2 ngày/module | All Phase A | Cap cứng, P0 trước, P1/P2 defer |
| R7 | 5 mâu thuẫn SRS pending BA | Cross-module | Quote BA email, không log bug mới |
| R8 | 5 file REVIEW chưa merge | W1 + W2.1 + W3.1 | D0.2 audit trước W1 |

---

## Quy tắc update (BẮT BUỘC)

Khi xong 1 task:
1. Flip icon trên dòng task (A hoặc B) → ✅/⚠️/🚫
2. Cập nhật bảng "Tiến độ tổng" đầu file nếu wave thay đổi
3. Notify cell Phase B của module đó nếu Phase A vừa xong → 🚫 chờ TC chuyển 🟢 (nếu không bug khác)
4. Update bảng §2 Scope trong [`plan.md`](plan.md) cùng lúc
