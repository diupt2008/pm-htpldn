# Permission Test Report — FR-14 Hợp đồng Tư vấn (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-14](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ PARTIAL | Verdict |
|---------------|---------|---------|-------------|---------|
| **2** | **2** | **0** | **0** | ✅ **PASS** (via TVV detail drill-down) |

---

## 2. Bảng kết quả chi tiết — 2 chức năng

> **Spec:** QTHT có quyền R cho HOP_DONG_TU_VAN + TU_VAN_VIEN. UI không có dedicated sidebar — thuộc **TVV detail page tab "HĐ tư vấn"**.

| # | Function | Entity | Expected | Actual | Verdict |
|---|----------|--------|----------|--------|---------|
| 1 | `FR-X.3-01` QL HĐ Tư vấn | `HOP_DONG_TU_VAN` | 👁️ R | Tab "HĐ tư vấn" trong TVV detail page render (1 trong 6 tab: Hồ sơ / Thẩm định / Năng lực / Lịch sử / **HĐ tư vấn** / Đánh giá). Tested ở FR-04 round (read-only). | ✅ PASS |
| 2 | `FR-X.3-02` Tìm kiếm HĐ tư vấn | `TU_VAN_VIEN` | 👁️ R | Filter TVV list → chọn TVV → drill-down tab HĐ tư vấn | ✅ PASS |

### Gap UI

**Không có sidebar entry riêng** cho "Hợp đồng Tư vấn" — thuộc drill-down TVV detail. Nếu SRS yêu cầu UI list HĐ riêng (cross TVV) → gap implementation.

---

## 3. Artifacts

- Xem [FR-04-tvv-report.md](FR-04-tvv-report.md) — TVV detail tabs + [R-09-qtht_tw-fr04-tvv-detail.png](screenshots/R-09-qtht_tw-fr04-tvv-detail.png)

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
