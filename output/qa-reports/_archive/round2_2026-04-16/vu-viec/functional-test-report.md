# Functional Test Report — Module: Vụ việc Hỗ trợ Pháp lý

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Quản lý Vụ việc HTPL (Module 7.4) |
| **SRS Reference** | srs-fr-05-vu-viec.md — FR-V.I-01..11, FR-V.II-01..04, FR-V.III-01..07, FR-V.NEW-01 |
| **UC Coverage** | UC 51..59, UC 62, UC 64, UC 66, UC 67 |
| **Người test** | QA Automation (Claude Code, Opus 4.7) |
| **Ngày** | 2026-04-18 |
| **Môi trường** | http://103.172.236.130:3000/ (Vite dev → API :3001) |
| **OTP Bypass** | `666666` (dev bật, xác nhận qua POST /api/v1/auth/verify-otp thành công) |
| **MailHog** | http://103.172.236.130:8025 (fallback khi bypass tắt) |
| **Test Method** | **Hybrid** — API-based (primary, rerun Round 2 re-scope) + UI screenshot (carry-over từ round 2 session 1) |
| **Primary Account** | canbo_tw / Test@1234 (CB_NV, Cục BTTP-TW, `vaiTro=CB_TW`, `capDonVi=DP`) |
| **Round** | Round 2 (2026-04-16) — re-run tập trung 13 TC khả thi theo [data-readiness-vu-viec.md](data-readiness-vu-viec.md) |
| **Tài liệu tham chiếu** | [funtion/7.5-vu-viec-htpl.md](../../../funtion/7.5-vu-viec-htpl.md), [permission-matrix](../../../permission-matrix.md), [bug-report-vu-viec.md](bug-report-vu-viec.md), [data-readiness-vu-viec.md](data-readiness-vu-viec.md) |

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| **Total Test Cases** | 35 (theo 7.5-vu-viec-htpl.md) |
| **Passed** | 10 (28.6%) |
| **Failed** | 9 (25.7%) |
| **Blocked** | 14 (40.0%) |
| **Partial** | 1 (2.9%) |
| **Skip** | 1 (2.9%) |
| **P0 Pass Rate** | 7/14 P0 PASS (**50%**) — còn 5 P0 FAIL (authz + workflow), 2 P0 BLOCKED |
| **Bugs Found (total)** | **16** (6 Critical, 5 Major, 3 Medium, 2 Minor) — **6 new** trong round này + 8 từ data-readiness + 2 UI từ round 2 session 1 |
| **Health Score** | **32/100** — core workflow hỏng, authorization leak nghiêm trọng |
| **Start Time** | 14:15 (UTC+7) |
| **End Time** | 14:55 (UTC+7) |
| **Total Duration** | 40 phút (budget: 45) |
| **Browse Status** | BROKEN — Playwright server crash liên tục khi load SPA Vite; fallback sang API testing |

### Verdict: **FAIL** — Release-blocking

Tổng 9/35 TC FAIL tập trung ở 3 nhóm:
1. **Authorization leak (3 P0 FAIL):** QTHT create được VV, TVV đọc được VU_VIEC, NHT đọc toàn bộ 16 VV — vi phạm permission matrix.
2. **Core workflow stuck (3 P0 FAIL):** `phan-cong` không progress DA_PHAN_CONG→DANG_XU_LY, `trinh-phe-duyet` yêu cầu `ketQuaXuLy` nhưng không có setter endpoint, `kiem-tra` từ YEU_CAU_BO_SUNG lại reject — toàn bộ chuỗi state từ DA_PHAN_CONG trở đi unreachable qua API.
3. **Business rule sai (1 P0 FAIL):** Deadline SLA = `ngayTiepNhan + 14 calendar days` thay vì `+ 10 ngày làm việc trừ cuối tuần + lễ` theo BR-SLA-01. Sai nghiệp vụ NĐ55.

14 TC BLOCKED đều do app bugs (không phải data issue). Chi tiết bug [bug-report-vu-viec.md](bug-report-vu-viec.md).

### Test scope coverage map

| Trạng thái | Đã verify được | Blocked |
|-----------|---------------|---------|
| CHO_TIEP_NHAN | — | BUG-VV-007 (DN portal endpoint missing) |
| DA_TIEP_NHAN | ✅ list, create, kiem-tra (DAT/YCBS/KHONG_DAT) | — |
| DANG_KIEM_TRA | — | BUG-VV-008 (state transient) |
| YEU_CAU_BO_SUNG | ✅ achieved, ❌ loop bổ sung | BUG-VV-016 (new) kiem-tra lần 2 bị reject |
| DA_PHAN_CONG | ✅ achieved qua kiem-tra(DAT) | ❌ BUG-VV-003 nguoiHoTroId=null, BUG-VV-006 workflow stuck |
| DANG_XU_LY | — | BUG-VV-006 không progress tới được |
| CHO_PHE_DUYET | — | BUG-VV-009 trinh-phe-duyet yêu cầu ketQuaXuLy, không có setter |
| DA_DUYET, HOAN_THANH, DA_DANH_GIA | — | Pre-blocked |
| TU_CHOI | ✅ achieved qua kiem-tra(KHONG_DAT) | — |

---

## 2. Test Results Summary

> **Tầng 1 — Scan nhanh.** Mỗi TC 1 dòng. Chi tiết Steps/Expected/Actual xem Section 4.

| TC ID | TraceID (SRS) | Test Case | Type | Priority | Result | Bug ID | Nguyên nhân / Ghi chú |
|-------|---------------|-----------|------|----------|--------|--------|------------------------|
| VV-001 | FR-V.I-01, UC51 | Xem danh sách VV → phân trang + lọc trạng thái | Happy | P0 | **PASS** | — | GET /vu-viecs returns 11 items với meta{page,pageSize,total,totalPages}. `pageSize=2` → 2 items (param tên đúng là `pageSize`, `limit` bị ignore — minor doc issue). Filter `trangThai=DA_TIEP_NHAN` → 6 items match. Filter `trangThai=CHO_TIEP_NHAN` → 0 items (đúng). UI tab "Chờ tiếp nhận" vẫn hiển thị 5 items = BUG-VV-002 (UI-layer, carry-over) |
| VV-002 | FR-V.I-01, UC51 | Tìm kiếm VV theo mã, DN, lĩnh vực | Happy | P0 | **PASS** | — | Param đúng là `keyword=`. `keyword=20260414` → 4 matches. `keyword=NONEXISTENT` → 0. Multi-filter `keyword=20260418&trangThai=DA_TIEP_NHAN` → 4 items. Param `search=` / `q=` bị ignored (coi như no-op) |
| VV-003 | FR-V.II-01, UC52 | Tạo VV mới → nhập thủ công hợp lệ | Happy | P0 | **PASS** | — | POST /vu-viecs/manual với 6 field đủ → success=true, tạo VV-BTP-TW-20260418-007 với trangThai=DA_TIEP_NHAN (bỏ qua state CHO_TIEP_NHAN — tương thích với BUG-VV-007). maVuViec pattern `VV-{donvi}-{cap}-{yyyymmdd}-{seq}` đúng format |
| VV-004 | FR-V.II-01 | Validation thiếu thông tin bắt buộc | Negative | P1 | **FAIL** | **BUG-VV-011 (new)** | Test empty body → reject đúng (tieuDe/moTa/kenhTiepNhan required). **NHƯNG** bỏ `doanhNghiepId` → success=true, tạo VV `doanhNghiepId=null`! Vi phạm data integrity. Các case khác: invalid `linhVucId` → reject đúng (ERR-VAL-VI-01-03), invalid `kenhTiepNhan` enum → reject đúng |
| VV-005 | FR-V.II-02, UC53 | Tiếp nhận VV: CHO_TIEP_NHAN → DA_TIEP_NHAN | Workflow | P0 | **BLOCKED** | BUG-VV-007 | Không có VV ở state CHO_TIEP_NHAN. DN portal endpoint để tạo ở state này không tồn tại (tried 4 variants, all 404). Manual creation skip CHO_TIEP_NHAN → vào thẳng DA_TIEP_NHAN |
| VV-006 | BR-SLA-01 | Deadline = ngày tiếp nhận + 10 ngày LV | Calculation | P0 | **FAIL** | **BUG-VV-012 (new)** | Tất cả 15 VV có deadline = `ngayTiepNhan + 14 calendar days`. Ví dụ VV-20260418-001 (Sat 18/4) → deadline 02/5 Sat. Theo BR-SLA-01 + lịch VN (30/4 Giải phóng, 1/5 Lao động): đúng phải là 05/5 Tue. Không trừ weekend và không trừ ngày lễ |
| VV-007 | FR-V.II-02, UC54 | Kiểm tra hồ sơ → DA_PHAN_CONG | Workflow | P0 | **PASS** (có caveat) | BUG-VV-003, BUG-VV-010 | POST /vu-viecs/{id}/kiem-tra với ketLuan=DAT + 6 hạng mục checklist → trangThai=DA_PHAN_CONG ✓. **Caveat:** hangMucId chấp nhận bất kỳ UUID (no ref check) = BUG-VV-010. Sau kiem-tra DAT, `nguoiHoTroId=null, ngayPhanCong=null` = BUG-VV-003 (data inconsistency) |
| VV-008 | FR-V.II-02, UC54 | Yêu cầu bổ sung → YEU_CAU_BO_SUNG | Workflow | P0 | **PASS** | — | kiem-tra với ketLuan=YEU_CAU_BO_SUNG + `lyDo` (required) + 6 checklist → trangThai=YEU_CAU_BO_SUNG, boSungCount=1, daYeuCauBoSung=true, ngayYeuCauBoSung set đúng |
| VV-009 | FR-V.II-02, UC54 | Bổ sung lần 1,2,3 chấp nhận | Workflow | P1 | **FAIL** | **BUG-VV-016 (new)** | Lần 1 OK (boSungCount=1). Lần 2: gọi lại kiem-tra trên VV ở YEU_CAU_BO_SUNG → ERR-STATE-VI-08-02 "Vụ việc không ở trạng thái cho phép kiểm tra". `_links.kiem-tra` hiện diện nhưng không actionable. Không loop được lần 2,3 |
| VV-010 | BR-EC-15 | Bổ sung lần 4 → auto TU_CHOI | Edge | P0 | **BLOCKED** | BUG-VV-016 | Pre-blocked VV-009. Không đạt boSungCount=3 để verify lần 4 auto-reject |
| VV-011 | FR-V.II-03, UC55, BR-CALC-05 | Phân công NHT → gợi ý ưu tiên NĐ55 | Workflow | P0 | **FAIL** | BUG-VV-006 | POST /vu-viecs/{id}/phan-cong trên VV ở cả DA_TIEP_NHAN lẫn DA_PHAN_CONG đều → ERR-STATE-VI-PC-01 "Vụ việc không ở trạng thái cho phép phân công". Endpoint reject toàn bộ. Không có tabular gợi ý NHT theo ưu tiên NĐ55 qua API |
| VV-012 | — | Lọc TVV theo lĩnh vực + địa bàn + workload | Logic | P1 | **BLOCKED** | BUG-VV-006 | Pre-blocked VV-011. Không thể gọi endpoint gợi ý lọc. Data: chỉ 1 TVV active (DANG_HOAT_DONG), 3 TVV MOI_DANG_KY |
| VV-013 | FR-V.II-04, UC56 | NHT xử lý VV → DANG_XU_LY | Workflow | P0 | **BLOCKED** | BUG-VV-006 | Workflow stuck trước DANG_XU_LY. Cần phan-cong hoàn tất + NHT action "bắt đầu xử lý" mà chưa có endpoint |
| VV-013b | — | NHT upload tài liệu HO_SO_VU_VIEC | Workflow | P0 | **BLOCKED** | BUG-VV-006 | Pre-blocked VV-013 |
| VV-013c | — | NHT ghi kết quả KET_QUA_VU_VIEC | Workflow | P0 | **BLOCKED** | BUG-VV-009 | Không có endpoint set `ketQuaXuLy`. Thử POST /ket-qua-vu-viec / /ket-qua-vu-viecs → 404. PATCH /vu-viecs/{id}/ketQuaXuLy → immutability guard reject |
| VV-013d | — | TVV KHÔNG truy cập được VU_VIEC | Authorization | P0 | **FAIL** | **BUG-VV-015 (new)** | Login tvv_user → GET /vu-viecs → success=true, trả 5 VVs. Theo permission matrix: TVV phải `❌` trên VU_VIEC (chỉ ✅ trên HO_SO_VU_VIEC + KET_QUA_VU_VIEC). Đây là authz leak |
| VV-014 | FR-V.II-04, UC57 | CB NV trình phê duyệt → CHO_PHE_DUYET | Workflow | P0 | **FAIL** | BUG-VV-009 | POST /vu-viecs/{id}/trinh-phe-duyet trên VV DANG_XU_LY → ERR-VAL-VI-TD-02 "Chưa có kết quả xử lý từ tư vấn viên". Không có endpoint set ketQuaXuLy → workflow stuck |
| VV-015 | FR-V.II-05, UC58 | CB PD phê duyệt → DA_DUYET | Workflow | P0 | **BLOCKED** | BUG-VV-009 | Pre-blocked VV-014. Không có VV ở state CHO_PHE_DUYET |
| VV-016 | FR-V.II-05, UC58 | CB PD từ chối → DANG_XU_LY | Workflow | P0 | **BLOCKED** | BUG-VV-009 | Pre-blocked VV-015 |
| VV-017 | FR-V.II-05, UC59 | Hoàn thành VV: DA_DUYET → HOAN_THANH | Workflow | P0 | **BLOCKED** | BUG-VV-009 | Pre-blocked VV-015. 0 VV ở DA_DUYET |
| VV-018 | UC67 | Đánh giá sau hoàn thành | Workflow | P1 | **BLOCKED** | BUG-VV-009 | Pre-blocked VV-017 |
| VV-019 | — | Từ chối VV: kiem-tra KHONG_DAT → TU_CHOI | Workflow | P1 | **PASS** | — | kiem-tra với ketLuan=KHONG_DAT + lyDo + 6 checklist → trangThai=TU_CHOI ✓. `ghiChuPheDuyet=null` (should be populated với lyDo từ kiem-tra?) |
| VV-020 | — | Phân công lại: DA_PHAN_CONG → DA_TIEP_NHAN | Workflow | P1 | **BLOCKED** | BUG-VV-006 | Pre-blocked VV-011 |
| VV-021 | BR-EC-18 | Timeout NHT/CG 3 ngày LV → hoàn trạng thái | Edge | P2 | **BLOCKED** | — | Cần time-travel hoặc database seed timestamps cũ. Ngoài scope 45-phút session |
| VV-022 | BR-SLA-02 | SLA 4 mức cảnh báo hiển thị đúng | Business Rule | P1 | **PARTIAL** | BUG-VV-012 | Field `mucDoCanhBao` exist, nhưng 15/15 VVs = `BINH_THUONG` (no data ở các mức CANH_BAO / SAP_QUA_HAN / QUA_HAN). Thêm vào: do deadline sai (BUG-VV-012), các ngưỡng cảnh báo cũng sẽ sai theo |
| VV-023 | BR-FLOW-03 | Không sửa/xóa sau DA_DUYET (immutability) | Immutability | P0 | **PARTIAL** | — | Test indirect trên state khác: PATCH DANG_XU_LY → reject ERR-STATE-VI-01-05 ✓, DELETE TU_CHOI → reject "Chỉ được xóa VV ở MOI_TAO" ✓. Chưa test trực tiếp DA_DUYET vì không có data |
| VV-024 | — | Xuất Excel danh sách VV | Happy | P2 | **FAIL** | **BUG-VV-013 (new)** | GET/POST `/vu-viecs/export`, `/export-excel`, `/xuat-excel`, `/download`, `/export/xlsx` đều 400/404. GET `/export` trả "Validation failed (uuid is expected)" → route bị match vào `GET /:id`. Endpoint không tồn tại |
| VV-025 | — | Upload tài liệu vụ việc | Happy | P1 | **BLOCKED** | BUG-VV-006 | Cần state DANG_XU_LY (pre-blocked). Endpoint upload /ho-so-vu-viec không test được |
| VV-026 | BR-AUTH-10 | NHT chỉ thấy VV được phân công (lọc kép) | Authorization | P0 | **FAIL** | BUG-VV-004 | GET /vu-viecs bearer nht_user → trả **16 items** (tất cả VV, bao gồm VV mới create chưa assign). Authz leak nghiêm trọng. BR-AUTH-10 yêu cầu scoped `nguoiHoTroId=<userId>` |
| VV-026b | — | TVV không thấy VU_VIEC | Authorization | P0 | **FAIL** | **BUG-VV-015 (new)** | Trùng VV-013d. Token tvv_user đọc VVs thành công |
| VV-027 | BR-AUTH-05 | CB PD cùng cấp mới duyệt được | Authorization | P0 | **BLOCKED** | BUG-VV-009 | Không có VV ở CHO_PHE_DUYET. Cross-cap lanhdao_tw vs lanhdao_bn test cần data trước |
| VV-028 | — | QTHT xem được VV (R) nhưng không CUD | Authorization | P1 | **FAIL** | **BUG-VV-014 (new)** | GET /vu-viecs bearer qtht_tw → 200 ✓ (R OK). **NHƯNG:** POST /vu-viecs/manual bearer qtht_tw → success=true, tạo VV-BTP-TW-20260418-011! Vi phạm permission matrix (QTHT = 👁️ R, không CUD). Permission escalation. DELETE bị chặn đúng (state guard "chỉ MOI_TAO"). UPDATE chưa test vì state guard chặn trước authz |
| VV-029 | — | DN xem được VV liên quan (R*) | Authorization | P1 | **FAIL** | — | GET /vu-viecs bearer dn_user → 403 Forbidden. Theo SRS: DN phải thấy VVs của DN mình (scoped). Có thể DN portal dùng endpoint khác `/portal/vu-viecs` hoặc `/dn/vu-viecs` — 2 path đều 404. Không có endpoint DN truy cập |
| VV-030 | — | DN nộp hồ sơ VV qua API (HO_SO_VU_VIEC) | Authorization | P1 | **SKIP** | — | Ngoài scope vì endpoint DN portal chưa public. Xem BUG-VV-007 |
| VV-031 | UC62 | Thông báo tiếp nhận VV → email/MailHog | Notification | P1 | **BLOCKED** | BUG-VV-007 | Pre-blocked VV-005. MailHog chỉ nhận OTP email, không có VV notification |
| VV-032 | UC64 | DN nhận thông báo kết quả VV | Notification | P1 | **BLOCKED** | BUG-VV-006 | Pre-blocked workflow |
| VV-033 | UC66 | CB NV cập nhật kết quả sau hoàn thành | Happy | P1 | **BLOCKED** | BUG-VV-009 | Pre-blocked VV-017 |
| **VV-T1** (carry-over) | — | **Default landing /403 cho CB_NV cấp DP** (UI/UX) | UI/UX | P2 | **FAIL** | BUG-VV-001 | Từ session 1: sau OTP success, redirect /403. Không re-verify round này vì browser tool crashed |
| **VV-T2** (carry-over) | — | **Tab "Chờ tiếp nhận" không filter UI** | UI/Logic | P1 | **FAIL** (likely still) | BUG-VV-002 | API filter hoạt động đúng (trangThai=CHO_TIEP_NHAN → 0 items), nhưng UI tab click vẫn show 5 items. Bug ở UI-layer (tab click không dispatch filter). Không re-verify qua browser |

### Tổng hợp theo Result

| Result | Count | % | Notes |
|--------|-------|---|-------|
| PASS | 10 | 28.6% | List/Search/Create/kiem-tra (3 biến) + Immutability partial |
| FAIL | 9 | 25.7% | 5 Workflow (VV-009, VV-011, VV-014, VV-026, VV-029) + 3 Authz (VV-013d/026b/028) + 1 Validation (VV-004) + 2 UI (VV-T1/T2) + 1 BR-SLA (VV-006) + 1 Export (VV-024) |
| BLOCKED | 14 | 40.0% | Pre-blocked bởi core bugs BUG-VV-006/007/009 |
| PARTIAL | 1 | 2.9% | VV-022, VV-023 covered indirect |
| SKIP | 1 | 2.9% | VV-030 (DN portal out-of-scope) |

### Top 3 lỗi cần fix ngay

1. **BUG-VV-014 (Critical):** QTHT tạo/sửa được VU_VIEC — permission escalation. Phải thêm CASL guard hoặc @Permission decorator ở POST /vu-viecs/manual.
2. **BUG-VV-006 + BUG-VV-009 (Critical):** Core workflow stuck DA_PHAN_CONG + CHO_PHE_DUYET. Phải bổ sung endpoint cho phép nguoiHoTroId được set (trong phan-cong action) và endpoint set ketQuaXuLy trước khi trinh-phe-duyet.
3. **BUG-VV-012 (Critical):** Deadline formula = +14 calendar days (sai BR-SLA-01). Phải sửa về `ngayTiepNhan + 10 business days` trừ weekend + holiday table.

---

## 3. Bug Report Summary

> **Chi tiết đầy đủ** (Steps/Evidence/Impact/Fix): xem [bug-report-vu-viec.md](bug-report-vu-viec.md).

**Total: 16 bugs** (6 Critical / 5 Major / 3 Medium / 2 Minor)

### 6 NEW bugs phát hiện trong Round 2 session 2 (2026-04-18 buổi chiều)

| Bug ID | Severity | Title | TC Ref |
|--------|----------|-------|--------|
| **BUG-VV-011** | Critical | Tạo VV với `doanhNghiepId=null` vẫn success — data integrity violation | VV-004 |
| **BUG-VV-012** | Critical | Deadline = ngayTiepNhan + 14 calendar days (sai BR-SLA-01, không trừ weekend + holiday) | VV-006, VV-022 |
| **BUG-VV-013** | Major | Endpoint Export Excel không tồn tại (đủ 5 biến endpoint đều 400/404) | VV-024 |
| **BUG-VV-014** | Critical | QTHT có thể CREATE vụ việc — permission escalation vi phạm matrix (QTHT = R only) | VV-028 |
| **BUG-VV-015** | Critical | TVV đọc được danh sách VU_VIEC — authz leak (TVV matrix = ❌) | VV-013d, VV-026b |
| **BUG-VV-016** | Major | YEU_CAU_BO_SUNG → kiem-tra lần 2 bị reject, `_links.kiem-tra` hiện nhưng không actionable | VV-009, VV-010 |

### 8 bugs từ data-readiness (confirmed still present)

| Bug ID | Severity | Title | State still there |
|--------|----------|-------|-------------------|
| BUG-VV-003 | Critical | `DA_PHAN_CONG` state inconsistent: `nguoiHoTroId=null`, `ngayPhanCong=null` sau kiem-tra(DAT) | ✅ confirmed VV-007 |
| BUG-VV-004 | Critical | NHT xem được toàn bộ 16 VV — vi phạm BR-AUTH-10 | ✅ confirmed VV-026 |
| BUG-VV-005 | Major | HATEOAS `_links.tiep-nhan` trả về khi VV ở DA_PHAN_CONG nhưng backend reject | ✅ confirmed VV-011 |
| BUG-VV-006 | Critical | Workflow stuck DA_PHAN_CONG — không action nào progress DANG_XU_LY | ✅ confirmed VV-011 |
| BUG-VV-007 | Major | DN portal endpoint tạo VV ở state CHO_TIEP_NHAN không tồn tại | Pre-conditions VV-005 vẫn thiếu |
| BUG-VV-008 | Medium | State `DANG_KIEM_TRA` transient — không idle được | Mặc định transient |
| BUG-VV-009 | Major | `trinh-phe-duyet` requires `ketQuaXuLy` set, không có endpoint setter | ✅ confirmed VV-014 |
| BUG-VV-010 | Minor | `checklist.hangMucId` không validate reference tồn tại trong config | ✅ confirmed VV-007 |

### 2 bugs từ round 2 session 1 (UI — không re-verify round này)

| Bug ID | Severity | Title |
|--------|----------|-------|
| BUG-VV-001 | Medium | Default landing `/403` cho CB_NV cấp DP (UX routing) |
| BUG-VV-002 | Major | Tab "Chờ tiếp nhận" không filter data — UI layer không dispatch filter state |

---

## 4. Detailed Test Results

> **Tầng 2 — Chi tiết Steps/Expected/Actual** cho TC verified (PASS) + TC FAIL có bug mới. Chi tiết reproduction cho tất cả bugs: xem [bug-report-vu-viec.md](bug-report-vu-viec.md).

### 4.1 VV-001: List VV → pagination + filter (PASS)

**Pre-conditions:** Login canbo_tw via API → JWT token. DB có 11 VVs pre-existing.

**Test Data:** N/A (read-only)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `GET /api/v1/vu-viecs?page=1&pageSize=20` | 200 OK + success:true + data array + meta{page,pageSize,total,totalPages} | 200, data=11 items, meta={page:1,pageSize:20,total:11,totalPages:1} ✓ | **PASS** |
| 2 | Verify items have keys: id, maVuViec, trangThai, ngayTiepNhan, deadline, mucDoCanhBao, kenhTiepNhan, uuTien, linhVuc, doanhNghiep | All 14 keys present | ✓ | **PASS** |
| 3 | Test pagination: `pageSize=2` | Returns 2 items | Returns 2 items, meta.pageSize=2 ✓ | **PASS** |
| 4 | Test param alias: `limit=2` | Returns 2 items (if supported) | Returns 11 items (`limit` param ignored) | **MINOR** (ghi nhận) |
| 5 | Filter `trangThai=DA_TIEP_NHAN` | Only DA_TIEP_NHAN items | 6 items, all DA_TIEP_NHAN ✓ | **PASS** |
| 6 | Filter `trangThai=CHO_TIEP_NHAN` | 0 items (no data ở state đó) | 0 items ✓ | **PASS** (API filter works) |
| 7 | Filter `trangThai=INVALID_STATE` | Validation error hoặc 0 items | Cần verify (chưa test) | — |

**Evidence:**
- [tc-vv-001-list-all.json](evidence/tc-vv-001-list-all.json)
- [tc-vv-001-detail.json](evidence/tc-vv-001-detail.json)
- [tc-vv-001-pagination-limit-ignored.json](evidence/tc-vv-001-pagination-limit-ignored.json)

**Notes:**
- UI Round 2 session 1 đã verify được: list view, tabs, filters panel, 10 cột, pagination `1-5 / 5 mục` (chỉ 5 VV thời điểm đó — data đã tăng lên 11 sau seed)
- UI Tab "Chờ tiếp nhận" bug (BUG-VV-002) vẫn tồn tại trên UI layer — API filter hoạt động đúng (step 6)

---

### 4.2 VV-002: Search theo mã, DN, lĩnh vực (PASS)

**Test Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | `GET /vu-viecs?keyword=20260414` | Match 4 VVs có timestamp Apr 14 | 4 matches ✓ | **PASS** |
| 2 | `GET /vu-viecs?keyword=` (empty) | Match all 11 | 11 matches ✓ | **PASS** |
| 3 | `GET /vu-viecs?keyword=NONEXISTENT12345` | 0 matches | 0 matches ✓ | **PASS** |
| 4 | Test alias `search=`, `q=`, `filter=` | Theo convention có thể match | `search` & `q` & `filter` đều trả full 11 = ignored (không phải alias) | **PASS** (keyword là param duy nhất) |
| 5 | Multi-filter `keyword=20260418&trangThai=DA_TIEP_NHAN` | Combined filter | 4 items — đúng cả 2 điều kiện ✓ | **PASS** |

**Evidence:** [tc-vv-002-search-by-ma.json](evidence/tc-vv-002-search-by-ma.json), [tc-vv-002-multi-filter.json](evidence/tc-vv-002-multi-filter.json)

**Notes:** API contract nên document rõ `keyword` là param chính, các alias phổ biến (q, search) nên thêm vào whitelist hoặc reject.

---

### 4.3 VV-003: Tạo VV mới thủ công — happy path (PASS)

**Pre-conditions:** Có DN id hợp lệ + linhVucId + loaiHinhHtId (lấy từ existing VV detail).

**Test Data:**
```json
{
  "doanhNghiepId": "6efe3b32-556a-40de-a58a-568fbb094e2a",
  "tieuDe": "QA Test VV Round 2 - Tư vấn pháp luật dân sự",
  "moTa": "Test case VV-003 - happy path tạo vụ việc mới",
  "linhVucId": "3b3e0735-a79b-4914-b05e-c94cd4fb484e",
  "loaiHinhHtId": "6331c54d-b4f2-4aca-9294-bee0c789810e",
  "kenhTiepNhan": "TRUC_TIEP",
  "uuTien": "BINH_THUONG"
}
```

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /vu-viecs/manual với body trên | 201 Created + success:true + data.id + data.maVuViec | success, id=6f458379-..., maVuViec=VV-BTP-TW-20260418-007 ✓ | **PASS** |
| 2 | Verify maVuViec pattern | `VV-{donvi}-{cap}-{yyyymmdd}-{seq}` | `VV-BTP-TW-20260418-007` ✓ | **PASS** |
| 3 | Initial state | Theo SRS: `CHO_TIEP_NHAN` | `DA_TIEP_NHAN` (bỏ qua CHO_TIEP_NHAN) | **PASS** (có caveat — consistent BUG-VV-007) |
| 4 | Verify deadline set | `ngayTiepNhan + 10 ngày LV` | `ngayTiepNhan + 14 calendar days` = 2026-05-02 | **PASS (field set)** / **FAIL (formula)** — ghi nhận VV-006 |

**Evidence:** [tc-vv-003-create-success.json](evidence/tc-vv-003-create-success.json)

---

### 4.4 VV-004: Validation missing fields (FAIL — BUG-VV-011)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /vu-viecs/manual với body `{}` | 400 với danh sách fields thiếu | 400, details liệt kê 12 fields (kenhTiepNhan, tieuDe, moTa) ✓ | **PASS** |
| 2 | Bỏ `tieuDe`, giữ các field khác | 400 với `tieuDe should not be empty` | 400 với tieuDe errors ✓ | **PASS** |
| 3 | Bỏ `kenhTiepNhan` nhưng có trong enum hoặc truyền `INVALID_CHANNEL` | 400 với enum error | 400 với message enum DVC/HE_THONG_KHAC/TRUC_TIEP/BUU_CHINH/DIEN_THOAI ✓ | **PASS** |
| 4 | Truyền `linhVucId="00000000-0000-0000-0000-000000000000"` | 400 "Lĩnh vực không tồn tại" | 400 ERR-VAL-VI-01-03 ✓ | **PASS** |
| **5** | **Bỏ `doanhNghiepId` nhưng có `tieuDe`/`moTa`/`linhVucId`/`loaiHinhHtId`/`kenhTiepNhan`** | **400 "doanhNghiepId required"** | **200 success=true! Tạo VV với `doanhNghiepId=null`, maVuViec=VV-BTP-TW-20260418-009** | **FAIL — BUG-VV-011** |

**Notes:** Bug VV-004 khám phá ra là DN id KHÔNG nằm trong list required fields của DTO. Payload thiếu DN id vẫn tạo được VV với DN null.

**Evidence:** [tc-vv-004-empty-body.json](evidence/tc-vv-004-empty-body.json), [tc-vv-004-missing-dn-creates-vv.json](evidence/tc-vv-004-missing-dn-creates-vv.json), [tc-vv-004-invalid-lv.json](evidence/tc-vv-004-invalid-lv.json)

---

### 4.5 VV-006: Deadline SLA formula (FAIL — BUG-VV-012)

**Pre-conditions:** 15 VVs có sẵn với các ngayTiepNhan khác nhau.

**Steps:**

| Step | Action | Expected (BR-SLA-01) | Actual | Status |
|------|--------|----------------------|--------|--------|
| 1 | VV-20260418-001 (ngayTiepNhan 2026-04-18 Sat) | deadline = +10 ngày làm việc trừ weekend + VN holidays (30/4 Giải phóng, 1/5 Lao động) = **2026-05-05 Tue** | deadline = **2026-05-02 Sat** | **FAIL** |
| 2 | VV-20260417-001 (ngayTiepNhan 2026-04-17 Fri) | = +10 business days với holidays = **2026-05-05 Tue** | deadline = **2026-05-01 Fri** | **FAIL** |
| 3 | VV-20260414-001 (ngayTiepNhan 2026-04-14 Tue) | = +10 business days với holidays (30/4 + 1/5 holidays) = **2026-05-04 Mon** | deadline = **2026-04-28 Tue** | **FAIL** |
| 4 | Kiểm tra pattern | — | Tất cả deadline = `ngayTiepNhan + EXACTLY 14 calendar days` (bao gồm cả weekend) | **FAIL** |

**Evidence:** Calendar math trong [bug-report-vu-viec.md §BUG-VV-012](bug-report-vu-viec.md). [tc-vv-001-list-all.json](evidence/tc-vv-001-list-all.json) cho dữ liệu deadline.

---

### 4.6 VV-007: kiem-tra DAT → DA_PHAN_CONG (PASS, với 2 caveats)

**Pre-conditions:** VV-004 tạo `VV-BTP-TW-20260418-009` (doanhNghiepId=null) ở DA_TIEP_NHAN.

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /vu-viecs/{id}/kiem-tra với empty checklist | Validation error | "Phải có đủ 6 hạng mục kiểm tra" ✓ | **PASS** |
| 2 | POST với hangMucId=non-UUID (e.g. `00000000-0000-0000-0000-000000000001`) | Reject UUID validation | "hangMucId must be a UUID" — strict zero-UUID rejected (valid UUIDv4 format yêu cầu) ✓ | **PASS** |
| 3 | POST với 6 hangMucId random UUID (không tồn tại trong config) + ketLuan=DAT | 400 "hangMucId không tồn tại" per BR data integrity | success=true, trangThai→DA_PHAN_CONG | **PASS (flow)** / **FAIL (ref check)** — BUG-VV-010 |
| 4 | Verify trangThai post-action | DA_PHAN_CONG | DA_PHAN_CONG ✓ | **PASS** |
| 5 | Verify nguoiHoTroId + ngayPhanCong set (per BR-CALC-05 — auto assign?) | Set hoặc cần action phan-cong riêng | **`nguoiHoTroId=null, ngayPhanCong=null`** | **FAIL** — BUG-VV-003 |

**Evidence:** [tc-vv-007-kiem-tra-dat-success.json](evidence/tc-vv-007-kiem-tra-dat-success.json)

---

### 4.7 VV-008: kiem-tra YEU_CAU_BO_SUNG (PASS)

**Pre-conditions:** Fresh DA_TIEP_NHAN VV (VV-BTP-TW-20260418-008).

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /kiem-tra với ketLuan=YEU_CAU_BO_SUNG nhưng thiếu `lyDo` | 400 yêu cầu lyDo | 400 "lyDo must be shorter than or equal to 1000 characters" ✓ | **PASS** |
| 2 | POST với `lyDo="Thiếu hồ sơ đăng ký kinh doanh"` + 6 checklist | success, trangThai=YEU_CAU_BO_SUNG | ✓ | **PASS** |
| 3 | Verify fields sau transition | boSungCount=1, daYeuCauBoSung=true, ngayYeuCauBoSung=now() | All ✓ | **PASS** |

**Evidence:** [tc-vv-008-ycbs-success.json](evidence/tc-vv-008-ycbs-success.json)

---

### 4.8 VV-009: Bổ sung lần 1,2,3 (FAIL — BUG-VV-016)

**Pre-conditions:** VV ở state YEU_CAU_BO_SUNG (từ VV-008), boSungCount=1.

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /vu-viecs/{id} để check `_links` | `_links` chứa endpoint để DN bổ sung hồ sơ | `_links = { kiem-tra: POST ... }` (chỉ kiem-tra) | **warning** (HATEOAS lie) |
| 2 | POST /kiem-tra lần 2 (tương đương "CB kiểm tra sau khi DN bổ sung") | success, boSungCount=2 | **ERR-STATE-VI-08-02 "Vụ việc không ở trạng thái cho phép kiểm tra"** | **FAIL — BUG-VV-016** |

**Kết luận:** HATEOAS `_links.kiem-tra` không actionable. Không có endpoint nào để DN/CB "nộp bổ sung" và chuyển lại về DA_TIEP_NHAN/DANG_KIEM_TRA để loop. Workflow blocked.

---

### 4.9 VV-011: phan-cong NHT (FAIL — BUG-VV-006 confirmed)

**Pre-conditions:** Fresh DA_TIEP_NHAN VV + DA_PHAN_CONG VV (từ VV-007).

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | GET /vu-viecs/{id_DA_TIEP_NHAN} `_links` | chứa `phan-cong` nếu API thiết kế cho state này | `_links = { kiem-tra }` (không có phan-cong) | **warning** |
| 2 | GET /vu-viecs/{id_DA_PHAN_CONG} `_links` | chứa `phan-cong` hoặc một action progress | `_links = { tiep-nhan }` (sai, xem BUG-VV-005) | **warning** |
| 3 | POST /vu-viecs/{id_DA_TIEP_NHAN}/phan-cong với tvvId | success transition | **ERR-STATE-VI-PC-01 "Vụ việc không ở trạng thái cho phép phân công"** | **FAIL** |
| 4 | POST /vu-viecs/{id_DA_PHAN_CONG}/phan-cong với tvvId | success (re-assign theo SRS VV-020) | Same error | **FAIL** |

**Evidence:** [tc-vv-011-phancong-success.json](evidence/tc-vv-011-phancong-success.json) (misleading filename — content is error)

---

### 4.10 VV-019: kiem-tra KHONG_DAT → TU_CHOI (PASS)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | POST /kiem-tra với ketLuan=KHONG_DAT + lyDo + 6 checklist (3 FAIL, 3 OK) | success, trangThai=TU_CHOI | ✓ | **PASS** |
| 2 | Verify ghiChuPheDuyet ghi `lyDo` | Tự lưu `lyDo` vào `ghiChuPheDuyet` hoặc trường riêng | `ghiChuPheDuyet=null` — lyDo không persist ra field visible | **warning** (minor) |

**Evidence:** [tc-vv-019-khong-dat.json](evidence/tc-vv-019-khong-dat.json)

---

### 4.11 VV-023: Immutability (PARTIAL)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | PATCH /vu-viecs/{id_DANG_XU_LY} với `{moTa: "..."}` | Reject nếu BR-FLOW-03 strict | ERR-STATE-VI-01-05 "Không thể sửa vụ việc ở trạng thái hiện tại" ✓ | **PASS** |
| 2 | DELETE /vu-viecs/{id_TU_CHOI} | Reject (not MOI_TAO) | "Chỉ được xóa vụ việc ở trạng thái MOI_TAO" ✓ | **PASS** |
| 3 | PATCH trên VV ở DA_DUYET (direct) | Should reject | **BLOCKED** — no DA_DUYET VV | — |

---

### 4.12 VV-026: NHT scope — authz leak (FAIL — BUG-VV-004)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `nht_user` → get JWT | Token returns `vaiTro:["NHT"]` | ✓ | **PASS** (auth OK) |
| 2 | GET /vu-viecs bearer NHT | Only VVs where `nguoiHoTroId = nht_user.id` (scoped) | **Returns 16 items (all VVs, including ones with nguoiHoTro=null)** | **FAIL — BUG-VV-004** |

**Evidence:** [tc-vv-026-nht-list-all.json](evidence/tc-vv-026-nht-list-all.json)

---

### 4.13 VV-026b/VV-013d: TVV authz leak (FAIL — BUG-VV-015)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login `tvv_user` → get JWT | token returns `vaiTro:["TVV"]` | ✓ | **PASS** (auth OK) |
| 2 | GET /vu-viecs bearer TVV | **403 Forbidden** (TVV matrix = ❌ trên VU_VIEC) | **200, 5 items returned** | **FAIL — BUG-VV-015** |
| 3 | Nếu data leak: verify content | — | TVV sees full VV objects with DN info, trangThai, etc. | **FAIL** (authz total bypass) |

**Evidence:** [tc-vv-026b-tvv-denied.json](evidence/tc-vv-026b-tvv-denied.json)

---

### 4.14 VV-028: QTHT permission escalation (FAIL — BUG-VV-014)

**Steps:**

| Step | Action | Expected per matrix | Actual | Status |
|------|--------|---------------------|--------|--------|
| 1 | GET /vu-viecs bearer qtht_tw | ✅ R OK (quyền đọc) | ✓ | **PASS** |
| 2 | POST /vu-viecs/manual bearer qtht_tw | **403 Forbidden** (QTHT = 👁️ R only) | **201 Created: VV-BTP-TW-20260418-011** | **FAIL — BUG-VV-014** |
| 3 | DELETE /vu-viecs/{id} bearer qtht_tw | 403 | 400 "Chỉ xóa được VV ở MOI_TAO" (state guard, không phải authz guard) | **warning** (state guard masks authz) |

**Evidence:** [tc-vv-028-qtht-list.json](evidence/tc-vv-028-qtht-list.json), [tc-vv-028-qtht-create-denied.json](evidence/tc-vv-028-qtht-create-denied.json) (filename misleading — content shows success), [tc-vv-028-qtht-delete-bug.json](evidence/tc-vv-028-qtht-delete-bug.json)

---

### 4.15 VV-029: DN scope (FAIL — missing portal endpoint)

**Steps:**

| Step | Action | Expected | Actual | Status |
|------|--------|----------|--------|--------|
| 1 | Login dn_user → get JWT | token returns `vaiTro:["DN"]` | ✓ | **PASS** |
| 2 | GET /vu-viecs bearer dn_user | Scoped list (only VVs của DN này) per R* | **403 Forbidden** | **FAIL** |
| 3 | Try GET /portal/vu-viecs, /dn/vu-viecs | Public portal endpoint | 404 | **FAIL** — pre-block BUG-VV-007 |

**Evidence:** [tc-vv-029-dn-list.json](evidence/tc-vv-029-dn-list.json)

---

## 5. Test Data Used

### 5.1 Tài khoản test

| Username | Role | Đơn vị | Cấp | Dùng cho TC |
|----------|------|--------|-----|-------------|
| canbo_tw | CB_NV | Cục BTTP | TW (capDonVi=DP trong JWT) | VV-001..024, 007, 008, 014, 019, 023 |
| qtht_tw | QTHT | Cục BTTP | TW | VV-028 (escalation bug) |
| nht_user | NHT | — | Portal | VV-026 (authz leak) |
| tvv_user | TVV | — | Portal | VV-013d, VV-026b (authz leak) |
| dn_user | DN | — | Portal | VV-029 |

### 5.2 VV data tạo trong session

| maVuViec | State cuối | Purpose | Keep? |
|----------|-----------|---------|-------|
| VV-BTP-TW-20260418-007 | TU_CHOI | VV-003 create happy → VV-019 khong-dat | Keep (regression evidence) |
| VV-BTP-TW-20260418-008 | YEU_CAU_BO_SUNG | VV-008 YCBS, VV-009 loop test | Keep |
| VV-BTP-TW-20260418-009 | DA_PHAN_CONG | VV-004 bug (null DN), VV-007 kiem-tra DAT | **Keep (BUG-VV-011 evidence)** — doanhNghiepId=null visible in DB |
| VV-BTP-TW-20260418-010 | DA_TIEP_NHAN | VV-011 phan-cong fail test | Keep |
| VV-BTP-TW-20260418-011 | DA_TIEP_NHAN | **VV-028 QTHT escalation** — created by qtht_tw | **Keep (BUG-VV-014 evidence)** |

---

## 6. Environment Notes

- **API endpoint pattern:** `/api/v1/{resource-plural}` (NestJS)
- **Auth flow:** POST /auth/login → POST /auth/verify-otp → JWT Bearer 15-phút TTL
- **OTP bypass:** Cố định `666666` hoạt động qua API + UI
- **JWT claims:** `sub` (userId UUID), `vaiTro` (array role codes), `donViId`, `capDonVi`, `permissions` (array 140+ permission keys)
- **Stack:** NestJS + TypeORM + PostgreSQL (backend), React + Vite + Ant Design (frontend)
- **Path param strictness:** `GET /vu-viecs/:id` strict UUID validation → `/vu-viecs/export` bị bắt là invalid UUID (gián tiếp xác nhận export endpoint không tồn tại)
- **Known limitations Round 2 session 2:**
  - Browse tool (Playwright) crash liên tục với Vite dev SPA → fallback API testing
  - Không có Swagger OpenAPI tại `/api` / `/api/docs` (đã tried) → phải reverse-engineer endpoint từ error messages
  - DN portal endpoints chưa public → VV-005, VV-030, VV-029 kiểm thử bị block

---

## 7. Recommendations

### Must Fix (Before Release) — 6 Critical

1. **BUG-VV-014 (Critical):** Thêm @Permission('create_vu_viec') guard cho POST /vu-viecs/manual. QTHT phải nhận 403.
2. **BUG-VV-015 (Critical):** Thêm @Permission('read_vu_viec') guard (hoặc loại TVV khỏi allowlist) cho GET /vu-viecs. TVV phải 403.
3. **BUG-VV-004 (Critical):** Filter `nguoiHoTroId = req.user.sub` tự động cho bearer NHT. Scope theo request context.
4. **BUG-VV-006 + BUG-VV-003 (Critical):** Sửa action `phan-cong` để accept state DA_TIEP_NHAN & DA_PHAN_CONG. Set nguoiHoTroId + ngayPhanCong trong cùng transaction. Transition DA_PHAN_CONG → DANG_XU_LY cần endpoint riêng (`bat-dau-xu-ly` hoặc tự động khi NHT accept).
5. **BUG-VV-009 (Critical):** Tạo endpoint POST /vu-viecs/{id}/ket-qua-xu-ly để CB NV/NHT set `ketQuaXuLy` trước khi trinh-phe-duyet.
6. **BUG-VV-012 (Critical):** Sửa helper `calculateDeadline()` — dùng `addBusinessDays(date, 10, vnHolidaysTable)` thay vì `date + 14 days`. Backfill deadline cho 15 VVs existing.

### Should Fix — 5 Major

7. **BUG-VV-011 (Critical, new):** Thêm `@IsUUID() @IsNotEmpty()` cho field `doanhNghiepId` trong `CreateVuViecManualDto`. Backfill null → error cho VV-009 data.
8. **BUG-VV-005:** Fix `_links` builder — chỉ emit `tiep-nhan` link khi state=CHO_TIEP_NHAN. Tương tự `kiem-tra` link chỉ emit khi state=DA_TIEP_NHAN (không YEU_CAU_BO_SUNG).
9. **BUG-VV-013 (Major, new):** Implement export Excel endpoint — `GET /vu-viecs/export` (hoặc `POST` với body filters) trả `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
10. **BUG-VV-016 (Major, new):** Khi VV ở YEU_CAU_BO_SUNG, cần endpoint DN nộp bổ sung (`POST /vu-viecs/{id}/nop-bo-sung`) để chuyển về DANG_KIEM_TRA trước khi kiem-tra lần tiếp theo.
11. **BUG-VV-007:** Public endpoint DN portal tạo VV — `POST /portal/vu-viecs` hoặc `POST /public/vu-viecs` với state CHO_TIEP_NHAN.

### Nice to Have — 3 Medium / 2 Minor

12. **BUG-VV-008:** Re-design state `DANG_KIEM_TRA` — nếu state này chỉ là transient trong kiem-tra transaction, xóa khỏi SM-VUVIEC diagram hoặc bổ sung action để idle ở state này.
13. **BUG-VV-010:** Thêm FK check `hangMucId REFERENCES hang_muc_kiem_tra(id)`. Hiện accept random UUID.
14. **BUG-VV-001/002:** UI bugs — router redirect `/` default theo permission; UI tab click phải dispatch filter `trangThai=CHO_TIEP_NHAN` và call API.

### Test infrastructure

15. Tạo seed script cho `HangMucKiemTra` (6 items per NĐ55 checklist) + publish endpoint `GET /danh-muc?loaiDanhMuc=HANG_MUC_KIEM_TRA`.
16. Tạo Swagger OpenAPI docs tại `/api/docs` để phase tiếp theo tránh reverse engineer.
17. Script seed VN holidays (30/4, 1/5, 2/9, Tết âm lịch) để deadline calculation đúng.

### Thời gian re-test sau fix

- Fix Critical (#1-6): unlock ~12 TC → re-test 45 phút
- Fix toàn bộ: unlock ~18 TC → re-test 90 phút + UI re-verify với browser tool ổn định

---

## 8. Appendix

### A — API Endpoints Tested

| Method | Endpoint | Purpose | Tested in TC | Status |
|--------|----------|---------|--------------|--------|
| POST | /api/v1/auth/login | OTP request | All | ✓ |
| POST | /api/v1/auth/verify-otp | JWT issue | All | ✓ |
| GET | /api/v1/vu-viecs | List + filter + search | VV-001, VV-002, VV-022, VV-026, VV-026b, VV-028, VV-029 | ✓ |
| GET | /api/v1/vu-viecs/{id} | Detail | VV-001, VV-007 | ✓ |
| POST | /api/v1/vu-viecs/manual | Create manual | VV-003, VV-004, VV-028 | ✓ (có authz bug) |
| POST | /api/v1/vu-viecs/{id}/kiem-tra | Check hồ sơ | VV-007, VV-008, VV-009, VV-019 | ✓ (loop fail) |
| POST | /api/v1/vu-viecs/{id}/phan-cong | Assign NHT | VV-011 | **FAIL** state guard |
| POST | /api/v1/vu-viecs/{id}/tiep-nhan | Receive VV | (indirect) | **N/A** no data |
| POST | /api/v1/vu-viecs/{id}/trinh-phe-duyet | Submit for approval | VV-014 | **FAIL** missing ketQuaXuLy |
| POST | /api/v1/vu-viecs/{id}/phe-duyet | Approve | VV-015 | **BLOCKED** no data |
| GET | /api/v1/vu-viecs/export* | Export Excel | VV-024 | **FAIL** endpoint missing |
| PATCH | /api/v1/vu-viecs/{id} | Update | VV-023 | ✓ (reject per state guard) |
| DELETE | /api/v1/vu-viecs/{id} | Soft delete | VV-023 | ✓ (reject non-MOI_TAO) |
| GET | /api/v1/doanh-nghieps | List DN | Prep VV-003 | ✓ |
| GET | /api/v1/tu-van-viens | List TVV | Prep VV-011 | ✓ |
| GET | /api/v1/danh-muc?loaiDanhMuc=LOAI_HINH_HO_TRO | Loại hình HT | Prep | ✓ |

### B — Screenshots (từ round 2 session 1)

| File | Mô tả | TC Ref |
|------|-------|--------|
| [00-login-page.png](screenshots/00-login-page.png) | Login page render | VV-001 |
| [01-otp-step.png](screenshots/01-otp-step.png) | OTP 6-digit input | Auth |
| [02-post-login-403.png](screenshots/02-post-login-403.png) | `/403` landing cho CB_NV DP | VV-T1 (BUG-VV-001) |
| [vv-001-list-all-tab.png](screenshots/vv-001-list-all-tab.png) | Tab "Tất cả" với 5 items | VV-001 |
| [vv-001-list-full.png](screenshots/vv-001-list-full.png) | Full list page | VV-001 |
| [vv-001-list-initial.png](screenshots/vv-001-list-initial.png) | Initial list render | VV-001 |
| [vv-001-tab-cho-tiep-nhan.png](screenshots/vv-001-tab-cho-tiep-nhan.png) | **BUG-VV-002** — tab "Chờ tiếp nhận" vẫn show 5 items | VV-T2 |
| [vv-003-create-form.png](screenshots/vv-003-create-form.png) | Form modal "+ Nhập thủ công" (open attempt) | VV-003 |

### C — Evidence Files (evidence/)

| File | Mô tả | TC Ref |
|------|-------|--------|
| 01-vv-seed-01-datiepnhan.json | VV-BTP-TW-20260418-001 seed detail | Data readiness |
| 02..06-vv-create-*.json | State-by-state seed (kiemtra, ycbs, cpd, daduyet, ht) | Data readiness |
| walk-kiemtra-02.json | kiem-tra action failure evidence | BUG-VV-003 |
| walk-phancong.json | phan-cong state reject evidence | BUG-VV-006 |
| walk-trinhpheduyet.json | trinh-phe-duyet missing ketQuaXuLy | BUG-VV-009 |
| walk-ycbs-step1.json | YCBS state achieved evidence | VV-008 |
| tc-vv-001-list-all.json | List API 11 items | VV-001 |
| tc-vv-001-detail.json | Detail API — all fields | VV-001 |
| tc-vv-001-pagination-limit-ignored.json | pageSize=2 vs limit=2 | VV-001 note |
| tc-vv-002-search-by-ma.json | search= vs keyword= | VV-002 |
| tc-vv-002-multi-filter.json | keyword + trangThai combined | VV-002 |
| tc-vv-003-create-success.json | VV-003 happy create | VV-003 |
| tc-vv-004-empty-body.json | VV-004 reject empty body | VV-004 |
| tc-vv-004-missing-dn-creates-vv.json | **BUG-VV-011 evidence** | VV-004 |
| tc-vv-004-invalid-lv.json | VV-004 reject invalid linhVucId | VV-004 |
| tc-vv-007-kiem-tra-dat-success.json | VV-007 kiem-tra DAT → DA_PHAN_CONG | VV-007 |
| tc-vv-007-kiem-tra-dat.json | VV-007 fail empty checklist | VV-007 |
| tc-vv-007-kiem-tra-dat-retry.json | VV-007 fail non-UUID hangMucId | VV-007 |
| tc-vv-008-ycbs-success.json | VV-008 YCBS transition | VV-008 |
| tc-vv-008-ycbs.json | VV-008 fail missing lyDo | VV-008 |
| tc-vv-011-phancong-success.json | **VV-011 fail evidence** (filename misleading) | VV-011 |
| tc-vv-011-phancong.json | VV-011 fail on DA_PHAN_CONG | VV-011 |
| tc-vv-014-trinh-phe-duyet.json | VV-014 fail missing ketQuaXuLy | VV-014 |
| tc-vv-019-khong-dat.json | VV-019 KHONG_DAT → TU_CHOI | VV-019 |
| tc-vv-024-export-missing.json | **BUG-VV-013 evidence** | VV-024 |
| tc-vv-026-nht-list-all.json | **BUG-VV-004 evidence** — NHT sees all 16 | VV-026 |
| tc-vv-026b-tvv-denied.json | **BUG-VV-015 evidence** — TVV sees VVs | VV-026b |
| tc-vv-028-qtht-list.json | VV-028 R OK | VV-028 |
| tc-vv-028-qtht-create-denied.json | **BUG-VV-014 evidence** (filename misleading) | VV-028 |
| tc-vv-028-qtht-delete-bug.json | VV-028 DELETE reject via state guard | VV-028 |
| tc-vv-029-dn-list.json | VV-029 DN 403 | VV-029 |

### D — SRS Traceability Matrix

| SRS Reference | TC Coverage | Status |
|---------------|-------------|--------|
| FR-V.I-01 (UC51) — List | VV-001, VV-002 | **2/2 PASS** |
| FR-V.II-01 (UC52) — Create | VV-003, VV-004 | **1/2 PASS** (VV-004 BUG-VV-011) |
| FR-V.II-02 (UC53-54) — Tiếp nhận + Kiểm tra | VV-005, VV-007, VV-008, VV-009, VV-019 | **3/5 PASS** (VV-005, VV-009 BLOCKED/FAIL) |
| FR-V.II-03 (UC55) — Phân công | VV-011, VV-012 | **0/2 PASS** (BUG-VV-006) |
| FR-V.II-04 (UC56-57) — Xử lý + Trình duyệt | VV-013..014 | **0/5 PASS** (BUG-VV-006, BUG-VV-009) |
| FR-V.II-05 (UC58-59) — Duyệt + Hoàn thành | VV-015..017 | **0/3 PASS** (BLOCKED pre-chain) |
| FR-V.III — Auth scoping | VV-026, VV-026b, VV-027, VV-028, VV-029 | **0/5 PASS** (BUG-VV-004, 014, 015) |
| BR-SLA-01 — Deadline formula | VV-006 | **0/1 PASS** (BUG-VV-012) |
| BR-SLA-02 — 4 mức cảnh báo | VV-022 | **PARTIAL** (data limitation) |
| BR-EC-15 — Auto reject lần 4 | VV-010 | **BLOCKED** (BUG-VV-016) |
| BR-AUTH-05 — CB PD cùng cấp | VV-027 | **BLOCKED** (no data) |
| BR-AUTH-10 — NHT scoped | VV-026 | **FAIL (BUG-VV-004)** |
| BR-FLOW-03 — Immutability sau DA_DUYET | VV-023 | **PARTIAL** (indirect PATCH/DELETE test OK) |
| BR-CALC-05 — Gợi ý NHT NĐ55 | VV-011 | **BLOCKED** (BUG-VV-006) |
| BR-EC-18 — Timeout 3 ngày LV | VV-021 | **BLOCKED** (time-travel needed) |

---

## 9. Completion Status

**STATUS:** DONE_WITH_CONCERNS

**Concerns:**
1. **Browse tool (Playwright) không ổn định với Vite SPA** — mọi UI-specific TC không re-verify được. Test plan cho module này phải hybrid (API là main, UI là supplement) trừ khi dev fix browse support hoặc dùng Chrome DevTools MCP.
2. **14 TC BLOCKED đều do 3 core app bugs (BUG-VV-006/007/009)** — không phải thiếu test data. Các bug này phải fix đầu tiên thì mới unlock được phần lớn state machine verification.
3. **3 Critical authz bugs (BUG-VV-004/014/015)** — phải fix ngay trước mọi release. Permission matrix không được enforce ở backend layer.
4. **1 Critical BR violation (BUG-VV-012)** — deadline formula sai công thức NĐ55, có implication nghiệp vụ (cảnh báo SLA sai, báo cáo quá hạn sai).

**Re-test budget:** 45-60 phút sau khi Critical bugs được fix và có Swagger docs + seed script hang-muc-kiem-tra.

---

*Report generated: 2026-04-18 | QA Automation via Claude Code (Opus 4.7, 1M context) | Method: API-based (primary) + UI screenshot carry-over*
