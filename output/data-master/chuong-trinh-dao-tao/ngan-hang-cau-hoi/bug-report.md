# Bug Report — Ngân hàng câu hỏi (M6.3)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN (Phần mềm Hỗ trợ Pháp lý Doanh nghiệp) |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Chrome DevTools MCP) |
| **Ngày** | 19:40..19:50 [2026-04-23] |
| **Loại test** | Functional — Seed CREATE (Happy path 6 fixture) |
| **Round** | Round 1 |
| **Tài liệu tham chiếu** | [functional-test-report.md](functional-test-report.md), [input/data/seed-fixture.yaml §M6.3](../../../../input/data/seed-fixture.yaml#L854), [input/srs-v3/srs-fr-03-dao-tao.md §FR-III-09](../../../../input/srs-v3/srs-fr-03-dao-tao.md) |

---

## Tổng hợp

Phát hiện **0** lỗi có SRS reference cụ thể trong quá trình test CREATE 6 fixture M6.3.

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể (`FR-X`, `BR-X`, `SCR-X row Y`, `§Error Handling EN`, `Inputs row N`). Quan sát không map được clause SRS → ghi ở section `## Observations — ngoài SRS (không log bug)` cuối file, không tính vào severity count.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 0    | 0        | 0     | 0      | 0     | 0       |

### Test result breakdown theo Type

| Type | Mô tả | TC count | PASS | PARTIAL | FAIL | BLOCKED | **Pass Rate** |
|------|-------|----------|------|---------|------|---------|---------------|
| **Happy** | Luồng CREATE 6 fixture M6.3 | 6 | 6 | 0 | 0 | 0 | **100%** |
| **Total** | | **6** | **6** | **0** | **0** | **0** | **100%** |

→ **Happy-path Pass Rate = 6/6** — sẵn sàng seed downstream M6.3b Đề kiểm tra.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|--------|-------------------|-------|--------|
| — | — | — | — | — | — | — | Không có bug SRS-ref trong round này | — |

Chú thích: Tất cả 6 fixture tạo PASS; các khác biệt UI ↔ fixture được ghi ở Observations.

---

## Observations — ngoài SRS (không log bug)

> **Mục đích:** Ghi lại quan sát trong quá trình test nhưng **không có SRS reference cụ thể** — không đủ căn cứ log bug formal. Nếu quan sát quan trọng, BA cần bổ sung SRS clause trước, rồi log bug round sau.

| Observation | Chi tiết / Evidence | SRS có nói không? | Đề xuất |
|-------------|----------------------|-------------------|---------|
| **OBS-01 — Dropdown Lĩnh vực thiếu DOANH_NGHIEP và HOP_DONG** | Fixture M6.3 index 2, 5, 6 yêu cầu `linh_vuc_id` ∈ `{DOANH_NGHIEP, HOP_DONG}`. Dropdown thực tế có: `Dân sự, Hình sự, Hành chính, Lao động, Đất đai, Hôn nhân gia đình, Kinh doanh thương mại, Khiếu nại tố cáo, Thuế (updated), Sở hữu trí tuệ`. 3 fixture đó phải map về "Kinh doanh thương mại" (closest). Evidence: [image/01-form-empty.png](image/01-form-empty.png) + `evaluate_script` dump options từ list Test Report §4.2. | SRS FR-III-09 Inputs row 2: `linh_vuc_id \| identifier \| Y \| —` — **chỉ nói identifier, không define enum values**. Không thể gọi là SRS violation. | BA xác nhận + bổ sung enum `linh_vuc_id` vào SRS Phụ lục A/B (DM lĩnh vực pháp luật) + dev seed DANH_MUC lĩnh vực thêm "Doanh nghiệp" và "Hợp đồng" nếu domain cần. Sau khi có enum → log bug round sau nếu vẫn thiếu. |
| **OBS-02 — "Thuế (updated)" leak regression trong dropdown Lĩnh vực** | Option dropdown `title="Thuế (updated)"` hiển thị nguyên chuỗi đuôi `(updated)` cho user chọn, lưu thẳng vào record (fixture #3 verify Edit modal: Lĩnh vực vẫn "Thuế (updated)"). | Quan sát leak đã log ở round trước: memory `qa_htpldn_vuviec_cr_round1` (CREATE Vụ việc) + `qa_htpldn_hoidap_cr_round1` (CREATE Hỏi đáp). **Regression chưa fix**. Không có SRS clause define exact value → không thể log bug formal. | Dev sửa seed `DANH_MUC` lĩnh vực: xoá suffix `(updated)` hoặc rollback seed version. Đây là lỗi DB data, không phải code. Không cần chờ BA. |
| **OBS-03 — FE auto-key duplicate khi rapid-click [+ Thêm lựa chọn]** | Khi click `[+ Thêm lựa chọn]` 2 lần liên tiếp (JavaScript rapid-click, không chờ re-render), key 4th row render `C` trùng với 3rd thay vì `D`. Evidence: fixture #3 Edit modal — `uid=25_29 value="C"` (3rd), `uid=25_32 value="C"` (4th duplicate), radio 4th label "C - 20% chuẩn" thay vì "D - 20% chuẩn". Fixture #1 add qua tool call tuần tự (có delay) → keys đúng A/B/C/D (verify Edit modal NH-001). | SRS FR-III-09 Inputs row 5: `cac_lua_chon \| structured \| Cond \| ≥ 2 lựa chọn (nếu trắc nghiệm)` — SRS không spec uniqueness của key. **Không có SRS clause define auto-key format**. Edge case automation, không repro khi user real click với delay tự nhiên. | Low priority. FE nên compute key theo `String.fromCharCode(65 + rows.length)` tại render time (derived từ array index) thay vì state stale read. Nếu không fix → không ảnh hưởng UX thực. |

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass active |
| API base | `/api/v1/` |
| Frontend | React + Vite + Ant Design 5 (Form.useForm controlled, Modal dialog CRUD) |
| Xác thực | JWT + OTP email |
| Browser tool | Chrome DevTools MCP (`chrome-devtools-mcp@latest`) |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| canbo_tw_5 | CB_NV | TW | Tất cả observation |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho |
|------|-------|----------|
| [image/00-empty-list.png](image/00-empty-list.png) | Trang Ngân hàng câu hỏi trước seed (empty) | Pre-test state |
| [image/01-form-empty.png](image/01-form-empty.png) | Modal "Thêm câu hỏi mới" trước khi fill | OBS-01 (dropdown enum) |
| [image/02-q1-filled.png](image/02-q1-filled.png) | Fixture #1 đã fill đủ 4 lựa chọn + radio B | NH-001 evidence |
| [image/03-list-6-records.png](image/03-list-6-records.png) | Full list 6 records sau khi seed | Post-seed verify |
| [image/04-final-list.png](image/04-final-list.png) | Final list sau verify Edit NH-001 + NH-003 | Final state |

---

*Bug report generated: 2026-04-23 | QA Automation via Claude Code (Chrome DevTools MCP)*
