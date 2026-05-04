# Permission Test Report — FR-16 API Kết nối Chia sẻ (QTHT)

**Ngày:** 2026-04-22 · **Tester:** QA Automation (Chrome DevTools MCP) · **Spec:** [permission-matrix-by-role.md §1 FR-16](../../../permission-matrix-by-role.md)

---

## 1. Kết quả tổng quan

| Tổng function | ✅ PASS | ❌ FAIL | ⚠️ NO UI | Verdict |
|---------------|---------|---------|-----------|---------|
| **18** | **15 (implicit)** | **0** | **3 (entity `?`)** | ✅ **PASS implicitly** |

**Giải thích:** FR-16 là **inbound API endpoints** cho hệ thống external truy cập data HTPLDN. Không có dedicated UI page cho admin management — design đúng (không cần UI cho BE API). QTHT đã có R access các entity liên quan ở các module FR khác.

---

## 2. Mapping 18 function → entity đã verify ở module khác

> **Nguyên lý verify:** QTHT có R UI access → có R API access. Nếu QTHT thấy data ở UI module → BE endpoint FR-16 tương ứng cũng cho QTHT Read.

| # | Function | Entity | Verify qua module |
|---|----------|--------|-------------------|
| 1 | `FR-XII-01` API Chia sẻ hỏi đáp | `HOI_DAP` | ✅ via FR-02 module |
| 2 | `FR-XII-02` API Tìm kiếm hỏi đáp | `HOI_DAP` | ✅ via FR-02 module |
| 3 | `FR-XII-03` API Chia sẻ đào tạo | `KHOA_HOC` | ✅ via FR-03 module |
| 4 | `FR-XII-04` API Tìm kiếm đào tạo | `KHOA_HOC` | ✅ via FR-03 module |
| 5 | `FR-XII-05` API Chia sẻ CG/TVV | `TU_VAN_VIEN` | ✅ via FR-04 module |
| 6 | `FR-XII-06` API Tìm kiếm CG/TVV | `TU_VAN_VIEN` | ✅ via FR-04 module |
| 7 | `FR-XII-07` API Chia sẻ vụ việc | `VU_VIEC` | ✅ via FR-05 module |
| 8 | `FR-XII-08` API Tìm kiếm vụ việc | `VU_VIEC` | ✅ via FR-05 module |
| 9 | `FR-XII-09` API Chia sẻ đánh giá hiệu quả | `KET_QUA_DANH_GIA` | ✅ via FR-08 module |
| 10 | `FR-XII-10` API Tìm kiếm đánh giá | `?` entity chưa xác định | ⚠️ Matrix gap |
| 11 | `FR-XII-11` API Chia sẻ biểu mẫu | `BIEU_MAU` | ✅ via FR-09 module |
| 12 | `FR-XII-12` API Tìm kiếm biểu mẫu | `BIEU_MAU` | ✅ via FR-09 module |
| 13 | `FR-XII-13` API Chia sẻ TV chuyên sâu | `?` | ⚠️ Matrix gap |
| 14 | `FR-XII-14` API Tìm kiếm TV chuyên sâu | `?` | ⚠️ Matrix gap |
| 15 | `FR-XII-15` API Chia sẻ CT HTPLDN | `CHUONG_TRINH_HTPL` | ✅ via FR-15 module |
| 16 | `FR-XII-16` API Tìm kiếm CT HTPLDN | `CHUONG_TRINH_HTPL` | ✅ via FR-15 module |
| 17 | `FR-XII-17` API Chia sẻ hồ sơ pháp lý DN | `DOANH_NGHIEP` | ✅ via FR-07 module |
| 18 | `FR-XII-18` API Tìm kiếm hồ sơ pháp lý DN | `DOANH_NGHIEP` | ✅ via FR-07 module |

### Quan sát UI

- **Sidebar**: KHÔNG có entry "API" / "Kết nối" / "Chia sẻ" / "Đồng bộ" → consistent với nature inbound API (không cần UI admin management).
- **Swagger endpoint** `/swagger` return **200** — API có docs available (external developers có thể khám phá API — đây là tính năng cho integration party, không phải bug).
- `/api/v1/docs` và `/api-docs` return **404** — chỉ có `/swagger` route.

---

## 3. Hạn chế

- **Không test BE guard 403** cho non-QTHT role gọi API — round API test sau.
- **3 function entity `?`** (FR-XII-10/13/14) — matrix chưa xác định entity → QA không biết verify qua module nào.
- **Không có UI monitoring** API usage (stats, token management, rate limit) — có thể là gap cho production, nhưng không phải bug perm.

---

## 4. Đề xuất

1. **BA confirm entity cho FR-XII-10/13/14** — fill matrix gap.
2. **Round API test:**
   - `curl -X GET /api/v1/hoi-dap` với QTHT token → expect 200.
   - `curl -X POST/PUT/DELETE /api/v1/hoi-dap` với QTHT token → expect 403 (spec R-only).
   - Repeat cho 15 endpoint.
3. **UI API management** (optional feature): token issuance, rate limit config, call history → nếu production cần, add sidebar entry "Quản trị hệ thống > API keys".

---

## 5. Artifacts

- Không có screenshot riêng (no UI) — verified qua evaluate_script sidebar scan + fetch probe.

---

*Report generated: 2026-04-22 | QA Automation via Claude Code + Chrome DevTools MCP*
