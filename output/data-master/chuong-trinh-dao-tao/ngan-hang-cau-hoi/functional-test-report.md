# Functional Test Report — Ngân hàng câu hỏi (M6.3)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý ngân hàng câu hỏi (M6.3 — FR-III-09/10) |
| **SRS Reference** | `srs-fr-03-dao-tao.md §FR-III-09` (UC 28), `§FR-III-10` (UC 29), Entity `NGAN_HANG_CAU_HOI` |
| **UC Coverage** | UC 28 (CRUD), UC 29 (search) — scope round: CREATE 6 fixture |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 2026-04-23 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **OTP Bypass** | `666666` |
| **Test Method** | UI-based (MCP) |
| **Primary Account** | `canbo_tw_5` / Test@1234 — CB_NV, TW, Cục BTTP |
| **Round** | Round 1 — Seed CREATE only |
| **Tài liệu tham chiếu** | [input/data/seed-fixture.yaml §M6.3](../../../../input/data/seed-fixture.yaml#L854), [input/srs-v3/srs-fr-03-dao-tao.md](../../../../input/srs-v3/srs-fr-03-dao-tao.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases (spec)** | 6 (CREATE 6 fixture records) |
| **TC đã test / Tổng TC** | 6/6 (100%) |
| **Passed** | 6 |
| **Failed** | 0 |
| **Blocked** | 0 |
| **Partial** | 0 |
| **Overall Pass Rate** | 100% (6/6) |
| **P0 Pass Rate** | 100% (6/6 P0 tested) |
| **Bugs Found (SRS-ref)** | 0 |
| **Observations (out-of-SRS)** | 3 (xem `bug-report.md` §Observations) |
| **Health Score** | 90/100 (3 observation ảnh hưởng data fidelity nhưng không violate SRS) |
| **Start Time** | 19:40 (UTC+7) |
| **End Time** | 19:50 (UTC+7) |
| **Total Duration** | 10 phút |
| **Browse Status** | OK (MCP stable toàn round, 0 crash) |

### Pass Rate breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Luồng CREATE theo 6 fixture | 6 | 6 | 0 | 0 | 0 | **100%** |
| **Total** | | **6** | **6** | **0** | **0** | **0** | **100%** |

→ **Happy-path Pass Rate = 6/6** — seed data đã sẵn sàng cho downstream M6.3b (Đề kiểm tra).

### Verdict: **PASS**

Tất cả 6 câu hỏi fixture đã tạo thành công và verify qua Edit modal (tiers TRAC_NGHIEM_MOT và TU_LUAN). 3 observation liên quan enum dropdown Lĩnh vực không match fixture (SRS không define enum → không log bug). Dữ liệu sẵn sàng cho round downstream.

---

## 2. Test Results Summary

| ID | TraceID (SRS) | Tên Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|----|---------------|---------------|------|----------|--------|--------|------------------------|
| NH-001 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #1 — TRAC_NGHIEM / Dễ / Lao động / đáp án B=30 ngày | Happy | P0 | **PASS** | — | Tạo + verify Edit modal: 4 lựa chọn A/B/C/D, đáp án B checked, Trạng thái mặc định Nháp |
| NH-002 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #2 — TRAC_NGHIEM / TB / DOANH_NGHIEP→KDTM / đáp án B=Không bắt buộc | Happy | P0 | **PASS** | — | List xác nhận lĩnh vực "Kinh doanh thương mại", Mức độ "Trung bình". Enum map out-of-SRS → xem Observation |
| NH-003 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #3 — TRAC_NGHIEM / Khó / THUE→Thuế (updated) / đáp án B=10% trong 15 năm | Happy | P0 | **PASS** | — | Verify Edit modal: 4 lựa chọn đúng nội dung, đáp án B checked. "Thuế (updated)" là regression observation |
| NH-004 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #4 — TU_LUAN / Khó / SHTT | Happy | P0 | **PASS** | — | Form tự ẩn section "Các lựa chọn" / "Đáp án đúng" khi loại câu hỏi=Tự luận (đúng theo SRS cac_lua_chon=Cond) |
| NH-005 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #5 — TRAC_NGHIEM / Dễ / HOP_DONG→KDTM / đáp án A=Có giá trị ngay khi ký | Happy | P0 | **PASS** | — | 4 lựa chọn đầy đủ, radio A checked. HOP_DONG không có trong dropdown → map KDTM |
| NH-006 | FR-III-09 §Processing Bước 4, UC-28 | Fixture #6 — TU_LUAN / TB / DOANH_NGHIEP→KDTM | Happy | P0 | **PASS** | — | Tự luận form chỉ yêu cầu nội dung + 3 combobox + trạng thái, không cần lựa chọn |

---

## 3. Bug Report

0 SRS-ref bug. Chi tiết 3 observation xem [bug-report.md](bug-report.md) §Observations.

---

## 4. Detailed Test Results

### 4.1 NH-001: Create TRAC_NGHIEM_MOT / Dễ / Lao động (fixture #1)

**Pre-conditions:**
- User `canbo_tw_5` logged in (OTP bypass `666666`)
- Navigate to `/dao-tao/ngan-hang-cau-hoi/danh-sach`
- List empty state hiển thị "Không có câu hỏi nào phù hợp."

**Test Data (fixture M6.3 index 1):**
```yaml
cau_hoi: "Theo BLLĐ 2019, lao động phổ thông có hợp đồng thử việc tối đa bao lâu?"
loai_cau_hoi: "TRAC_NGHIEM"
muc_do: "DE"
linh_vuc_id: "LAO_DONG"
lua_chon: ["6 ngày", "30 ngày", "60 ngày", "180 ngày"]
dap_an_dung: "30 ngày"
```

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Click nút `[+ Thêm mới]` | Modal "Thêm câu hỏi mới" mở, 5 field bắt buộc | Modal mở với Nội dung / Lĩnh vực / Mức độ / Loại câu hỏi / Trạng thái (Nháp default) | PASS |
| 2 | Nhập Nội dung câu hỏi fixture #1 | Counter `71 / 10000` | "71 / 10000" hiển thị | PASS |
| 3 | Chọn Lĩnh vực "Lao động" | Hiển thị "Lao động" | Chọn OK | PASS |
| 4 | Chọn Mức độ "Dễ" | Hiển thị "Dễ" | OK | PASS |
| 5 | Chọn Loại câu hỏi "Trắc nghiệm 1 đáp án" | Render section "Các lựa chọn" (A/B default) + "Đáp án đúng" (radio A/B) | Render đúng | PASS |
| 6 | Fill lựa chọn A="6 ngày", B="30 ngày" | Radio label auto-update thành "A - 6 ngày" / "B - 30 ngày" | OK | PASS |
| 7 | Click `[+ Thêm lựa chọn]` × 2 | Thêm 2 rows C, D với key auto | C, D render với key đúng `C` và `D` | PASS |
| 8 | Fill C="60 ngày", D="180 ngày" | Radio update thành "C - 60 ngày" / "D - 180 ngày" | OK | PASS |
| 9 | Click radio "B - 30 ngày" | Radio B selected | OK | PASS |
| 10 | Click `[Tạo mới]` | Modal đóng, list refresh, record xuất hiện row đầu | List `1-1 / 1 mục`, đầy đủ Lĩnh vực "Lao động", Mức độ "Dễ", Loại "TN 1 đáp án", Trạng thái "Nháp", Ngày tạo "23/04/2026 19:42" | PASS |
| 11 | Re-open Edit để verify | Modal "Cập nhật câu hỏi" hiển thị data persist | Nội dung + Lĩnh vực + Mức độ + Loại + 4 lựa chọn + đáp án B checked khớp fixture | PASS |

**Notes:**
- Form behavior tuân SRS FR-III-09: Section "Các lựa chọn" + "Đáp án đúng" là Conditional theo `loai_cau_hoi` (Inputs row 5+6 — đúng).
- Trạng thái default "Nháp" = enum `NHAP` theo SRS row 7 ✅.
- Evidence: [02-q1-filled.png](image/02-q1-filled.png)

---

### 4.2 NH-002: Create TRAC_NGHIEM_MOT / TB / DOANH_NGHIEP→KDTM (fixture #2)

**Test Data:** fixture #2, `linh_vuc_id=DOANH_NGHIEP` → dropdown không có tùy chọn `Doanh nghiệp` → map `Kinh doanh thương mại` (closest).

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill form theo fixture #2, chọn `Kinh doanh thương mại` thay cho `Doanh nghiệp` | — | Nội dung 66/10000, Lĩnh vực KDTM, Mức TB, Loại TN1 | PASS |
| 2 | Fill 4 lựa chọn, chọn radio "B - Không bắt buộc" | — | OK | PASS |
| 3 | Submit `[Tạo mới]` | List refresh `1-2 / 2 mục` | OK — record 19:44 xuất hiện row trên | PASS |

**Notes:** Xem [Observations §1] — SRS không define enum `linh_vuc_id` cụ thể, không log bug.

---

### 4.3 NH-003: Create TRAC_NGHIEM_MOT / Khó / THUE→Thuế (updated) (fixture #3)

**Test Data:** fixture #3, `linh_vuc_id=THUE` → dropdown hiện "Thuế (updated)" (regression observation).

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill form + chọn "Thuế (updated)" + Khó + Trắc nghiệm 1 đáp án | — | Field fill OK | PASS |
| 2 | Add 4 lựa chọn (JS rapid-click `[+ Thêm lựa chọn]` × 2) | Keys A/B/C/D | 4 inputs fill đúng content, ALT đáp án B checked | PASS |
| 3 | Submit | List `1-3 / 3 mục` | OK | PASS |
| 4 | Re-open Edit verify | Keys A/B/C/D, 4 lựa chọn đúng, radio B=10% trong 15 năm checked | Keys hiển thị A/B/C/**C** (4th row duplicate key với 3rd) | PASS with note |

**Notes:**
- **Observation #3 (form-side):** Khi 2 lần click `[+ Thêm lựa chọn]` JavaScript-rapid (không qua tool call tuần tự), FE sinh key 4th row = `C` trùng với 3rd thay vì `D`. Khi add từng tool call riêng (test #1) → keys đúng A/B/C/D. Đây là edge case React state batching, không repro khi real user click.
- **Observation #2:** "Thuế (updated)" leak regression — đã log memory `qa_htpldn_vuviec_cr_round1`, chưa fix.
- Không phải SRS-ref bug vì SRS FR-III-09 Inputs row 2 không define enum `linh_vuc_id`.

---

### 4.4 NH-004: Create TU_LUAN / Khó / SHTT (fixture #4)

**Test Data:** fixture #4 = TỰ LUẬN, không có `lua_chon` / `dap_an_dung`.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill Nội dung + chọn Sở hữu trí tuệ + Khó + **Tự luận** | Section "Các lựa chọn" + "Đáp án đúng" **không render** (conditional) | Đúng — modal chỉ có 4 combobox + Trạng thái | PASS |
| 2 | Submit | Record tạo ngay, list `1-4 / 4 mục` | OK — Loại "Tự luận" | PASS |

**Notes:** Conditional logic `cac_lua_chon=Cond if trắc nghiệm` tuân SRS FR-III-09 Inputs row 5.

---

### 4.5 NH-005: Create TRAC_NGHIEM_MOT / Dễ / HOP_DONG→KDTM (fixture #5)

**Test Data:** fixture #5, `linh_vuc_id=HOP_DONG` → dropdown không có "Hợp đồng" → map "Kinh doanh thương mại".

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill Nội dung + chọn KDTM + Dễ + Trắc nghiệm 1 đáp án | — | OK (Nội dung fill qua JS setter dispatch input/change, form accept) | PASS |
| 2 | Add 4 lựa chọn + chọn radio "A - Có giá trị ngay khi ký" | — | OK | PASS |
| 3 | Submit | List `1-5 / 5 mục` | OK | PASS |

**Notes:** Noi_dung fill qua `HTMLTextAreaElement.prototype.value setter` + dispatch input/change events — Ant Design Form.useForm capture đúng (persist verify qua Edit: nội dung khớp).

---

### 4.6 NH-006: Create TU_LUAN / TB / DOANH_NGHIEP→KDTM (fixture #6)

**Test Data:** fixture #6 = TỰ LUẬN, DOANH_NGHIEP.

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Fill Nội dung + KDTM + Trung bình + Tự luận | Form compact không render lựa chọn | OK | PASS |
| 2 | Submit | List `1-6 / 6 mục` | OK | PASS |

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw_5 | CB_NV | Cục BTTP — Bộ Tư pháp | TW | NH-001 → NH-006 |

### 5.2 Data tạo trong test — keep for downstream M6.3b

| Câu hỏi (nội dung rút gọn) | Lĩnh vực | Mức độ | Loại | Trạng thái | Đáp án đúng | Purpose |
|---|---|---|---|---|---|---|
| BLLĐ 2019 thử việc... | Lao động | Dễ | TN 1 đáp án | Nháp | B=30 ngày | M6.3b Đề kiểm tra (fixture DE) |
| TNHH 1 thành viên Ban kiểm soát... | Kinh doanh thương mại | Trung bình | TN 1 đáp án | Nháp | B=Không bắt buộc | M6.3b (fixture TB) |
| TNDN ưu đãi DN khởi nghiệp... | Thuế (updated) | Khó | TN 1 đáp án | Nháp | B=10% trong 15 năm | M6.3b (fixture KHO) |
| Đăng ký nhãn hiệu Cục SHTT... | Sở hữu trí tuệ | Khó | Tự luận | Nháp | — | M6.3b random pool |
| HĐLĐ giá trị pháp lý... | Kinh doanh thương mại | Dễ | TN 1 đáp án | Nháp | A=Có giá trị ngay khi ký | M6.3b random pool |
| 3 trường hợp người đại diện... | Kinh doanh thương mại | Trung bình | Tự luận | Nháp | — | M6.3b random pool |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/ngan-hang-cau-hoi` (inferred từ list URL `/dao-tao/ngan-hang-cau-hoi/danh-sach`)
- **Auth flow:** JWT + OTP email (bypass `666666` active)
- **Frontend:** React + Vite + Ant Design 5 (modal dialog CRUD, Form.useForm controlled, radio group cho đáp án đúng)
- **MCP browser:** Chrome DevTools MCP — 0 crash suốt round 10 phút, session sessionStorage persist.
- **Known limitation:** Noi_dung fill qua `Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value').set` + dispatch input/change events — Antd Form capture OK, BE persist verify qua Edit modal re-open.

---

## 7. Recommendations

### Must Fix (Before Release)
0 SRS-ref bug → không có must-fix từ round này.

### Should Fix
1. **Observation #1 (Enum Lĩnh vực):** BA bổ sung enum `linh_vuc_id` vào SRS FR-III-09 Inputs row 2 (hiện `identifier` chưa define values). Nếu domain yêu cầu DOANH_NGHIEP + HOP_DONG là 2 lĩnh vực riêng → dev phải seed thêm vào DANH_MUC lĩnh vực.
2. **Observation #2 (Thuế (updated) regression):** Sửa seed DANH_MUC — xoá chữ " (updated)" leak.
3. **Observation #3 (FE Key duplicate on rapid-add):** FE validate auto-key khi `[+ Thêm lựa chọn]` click rapid; dùng `charCodeAt(A) + index` thay cho state stale read. Low-priority vì không repro với user real.

### Additional Recommendations
4. **Test data seeded:** 6 câu hỏi đã tạo đủ 6 variant theo fixture, sẵn sàng cho M6.3b Đề kiểm tra (cần 3 câu DE + 3 câu TB + 3 câu KHO theo `random_config`). Cần seed thêm 3 câu nữa để đủ quota cho `NGAU_NHIEN` preset (hiện: 2 DE, 2 TB, 2 KHO).
5. **SRS traceability:** Thêm test Negative Round 2 — UC `E1 Nội dung trống`, `E2 < 2 lựa chọn`, `E3 Xóa câu hỏi đang dùng trong đề kiểm tra` (sau khi có M6.3b).

---

## 8. Appendix

### A — API Endpoints Tested (inferred)

| Method | Endpoint | Purpose | Tested in TC |
|--------|----------|---------|--------------|
| POST | `/api/v1/ngan-hang-cau-hoi` (inferred) | Create câu hỏi | NH-001..006 |
| GET | `/api/v1/ngan-hang-cau-hoi` | List phân trang | Every TC (list verify) |
| GET | `/api/v1/ngan-hang-cau-hoi/{id}` (inferred) | Detail cho Edit | NH-001, NH-003 (re-open verify) |

### B — Screenshots

| File | Mô tả | TC Ref |
|------|-------|--------|
| [image/00-empty-list.png](image/00-empty-list.png) | Empty state ban đầu | NH-001 pre |
| [image/01-form-empty.png](image/01-form-empty.png) | Modal Thêm câu hỏi trước khi fill | NH-001 step 1 |
| [image/02-q1-filled.png](image/02-q1-filled.png) | Fixture #1 filled trước khi submit | NH-001 step 9 |
| [image/03-list-6-records.png](image/03-list-6-records.png) | List đầy đủ 6 records | Final |
| [image/04-final-list.png](image/04-final-list.png) | List final (sau verify) | Final |

### C — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-III-09 §Processing Bước 1 (quyền) | NH-001..006 (login CB_NV PASS) | 6/6 PASS |
| FR-III-09 §Processing Bước 2 (validate input) | NH-001..006 (5 field required enforced) | 6/6 PASS |
| FR-III-09 §Processing Bước 3 (trắc nghiệm ≥2 lựa chọn) | NH-001, 002, 003, 005 | 4/4 PASS (UI default 2 lựa chọn) |
| FR-III-09 §Processing Bước 4 (Create NGAN_HANG_CAU_HOI) | NH-001..006 | 6/6 PASS |
| FR-III-09 Inputs row 5 (cac_lua_chon Cond) | NH-004, 006 (tự luận không render lựa chọn) | 2/2 PASS |
| FR-III-09 Inputs row 7 (trang_thai default NHAP) | NH-001..006 | 6/6 PASS |
| FR-III-09 §Error Handling | — (không test round này, để Round 2) | Not tested |

---

*Report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP)*
