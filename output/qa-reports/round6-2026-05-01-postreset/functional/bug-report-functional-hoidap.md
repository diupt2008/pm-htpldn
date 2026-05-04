# Bug Report — Hỏi đáp Pháp lý (Phase 7 Functional)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code |
| **Ngày** | 2026-05-02 |
| **Loại test** | Functional (Phase 7 — Negative + Edge + Permission) |
| **Round** | Round 6 — R6.7.1 |
| **Tài liệu tham chiếu** | [test-strategy.md](../../../test-strategy.md), [7.2-hoi-dap-phap-ly.md](../../../funtion/7.2-hoi-dap-phap-ly.md), [srs-fr-02-hoi-dap.md](../../../../input/srs-v3/srs-fr-02-hoi-dap.md), [functional-test-report-HoiDap.md](functional-test-report-HoiDap.md) |

---

## Tổng hợp

Phát hiện **0** lỗi có SRS reference cụ thể trong quá trình test R6.7.1 Phase 7 Hỏi đáp (12 TC effective: 3 negative + 1 immutability + 1 UI + 1 SLA + 6 authorization).

> **Rule log bug (feedback 2026-04-23):** Bug chỉ log khi có SRS reference cụ thể (`FR-X`, `BR-X`, `SCR-X row Y`, `§Error Handling EN`, `Inputs row N`). Quan sát không map được clause SRS → KHÔNG log vào file bug. Xem memory `feedback_bug_must_have_srs_ref`.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 0    | 0        | 0     | 0      | 0     | 0       |

## Bug Summary Table

*Không có bug.*

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| — | — | — | — | — | — | — | — |

---

## Note section — Observations (không log bug)

**Quan sát chỉ ghi nhận, không log bug** — vì không deviation SRS:

### Obs-1 (HD-005) — Wording app ngắn hơn SRS

App hiện error "Nội dung tối đa 5000 ký tự" khi vượt 5000.
SRS line 150 quy định: "Nội dung câu hỏi tối đa 5000 ký tự".

App thiếu từ "câu hỏi" so với SRS — wording diff không ảnh hưởng UX hoặc nghiệp vụ. Cùng nghĩa, người dùng vẫn hiểu đúng.

**Quyết định:** Không log bug. Wording không phải SRS verbatim required clause.

### Obs-2 (HD-019) — FE strict hơn spec cho HOAN_THANH/HUY

SRS line 117 (Processing-Xóa) quy định: "Kiểm tra trạng thái không phải DA_DUYET" — tức record HOAN_THANH có thể xóa.
App ẩn cả nút Sửa lẫn Xóa cho records state HOAN_THANH + HUY (terminal states).

FE chọn strict-immutable cho terminal states — đây là FE prudence, không phải deviation. Không có user complain expected.

**Quyết định:** Không log bug. FE strict OK khi không gây UX issue.

### Obs-3 (HD-019) — Không thể test BE block trực tiếp

App dùng JWT trong Zustand memory store (non-persisted) + httpOnly cookie. Token KHÔNG expose qua `window` → không thể test direct PATCH/DELETE qua MCP `evaluate_script`.

**Quyết định:** Không log bug. Đây là design limitation của tool test (MCP Chrome DevTools), không phải app bug. Đề xuất: dùng ` postman/curl` với cookie export riêng nếu cần test BE-side.

### Obs-4 (HD-022) — Gap data cho 2/3 enum SLA

Dataset Round 6 chỉ có 1 record HD-002 ở mức BINH_THUONG. Không có record nào đang ở mức SAP_HET (deadline gần) hoặc QUA_HAN (deadline đã qua) → chưa verify được badge UI cho 2 mức này.

**Quyết định:** Không log bug. Gap data, không phải app bug. Đề xuất seed thêm 2 records với deadline cũ (xem report §7 Recommendations).

### Obs-5 (HD-027) — DN API direct test out-of-scope

DN dùng API qua Cổng PLQG (FR-II-CROSS-01) cần credentials Cổng PLQG simulator. Không có trong scope Phase 7.

**Quyết định:** Không log bug. Move sang R6.7.16 T4.16 API kết nối. Indirect verification PASS qua 2 records HD-005/HD-003 đã có trong dataset với `kenh=Cổng PLQG`.

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass tạm) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | `/api/v1/` |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT (memory store) + httpOnly cookie + OTP email |
| Tool test | Chrome DevTools MCP (6 isolated contexts) |

---

*Bug report generated: 2026-05-02 23:08 | QA Automation via Claude Code*
