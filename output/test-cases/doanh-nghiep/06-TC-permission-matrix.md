# Test Cases — Permission Matrix 11 Role × FR-07 (DOANH_NGHIEP)

> **SRS Ref**: BR-AUTH-01 / BR-AUTH-08 / BR-AUTH-11 (srs-v3.md Phụ lục B), [permission-matrix.md](../../permission-matrix.md). Entity DOANH_NGHIEP + HO_SO_PHAP_LY_DN.
> **Nguồn**: NotebookLM (`2160bfb1-2020-4199-90a6-d607b298bb42`)
> **Ngày tạo**: 2026-04-30
> **Đặc thù**: Verify boundary 11 role — auth/scope/403. Đặc biệt **DN role 📝 RU\* là API-only (BR-AUTH-11)** — không test trên CMS UI.

---

## Quy ước

(Cùng quy ước file 01)

---

## Permission Matrix Reference (rút gọn từ permission-matrix.md)

| Role | DOANH_NGHIEP (FR-07) | HO_SO_PHAP_LY_DN (Tab #2 — FR-X.1-04) | Note |
|------|----------------------|----------------------------------------|------|
| QTHT | 👁️ R toàn HT | (chưa cite) | Read all DN cross-đơn-vị |
| CB_NV_TW | ✅ CRUD* | ✅ CRUD* | scope = TW (toàn quốc) |
| CB_NV_BN | ✅ CRUD* | ✅ CRUD* | scope = đơn vị BN mình |
| CB_NV_DP | ✅ CRUD* | ✅ CRUD* | scope = đơn vị ĐP mình |
| CB_PD_TW | 👁️ R* | ❌ (không có actor) | Read scope TW, KHÔNG CRUD, KHÔNG tab #2 |
| CB_PD_BN | 👁️ R* | ❌ | Read scope BN |
| CB_PD_DP | 👁️ R* | ❌ | Read scope ĐP |
| NHT | ❌ | (verify "Người hỗ trợ" mapping) | Default 403 |
| TVV | ❌ | (verify) | Default 403 |
| CG | ❌ | (verify) | Default 403 |
| GV | ❌ | ❌ | Default 403 |
| DN | 📝 RU* (API only) | ❌ | **Out-of-scope CMS** — test riêng API |

> Test accounts: `qtht_01`, `cb_nv_tw_01`, `cb_nv_bn_01`, `cb_nv_dp_01`, `cb_pd_tw_01`, `cb_pd_bn_01`, `cb_pd_dp_01`, `nht_01`, `tvv_01`, `cg_01`, `gv_01` — xem [users.csv](../../../input/users.csv) + [test-accounts-isolation.csv](../../../input/test-accounts-isolation.csv).

---

## A. ROLE CÓ QUYỀN — VERIFY HAPPY ACCESS + SCOPE

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-001 | BR-AUTH-08 / FR-07 | QTHT — đọc DN toàn HT, KHÔNG CRUD | 1. qtht_01 login. 2. Seed DN ở 3 đơn vị (TW + BN + ĐP). | — | 1. Mở `/doanh-nghiep`. 2. Quan sát toolbar. | (3) UI hiển thị tất cả DN cross-đơn-vị (👁️ R toàn HT). KHÔNG có nút [+ Thêm mới], [Import Excel], [Sửa], [Xóa] (chỉ Read). Backend GET 200, POST/PUT/DELETE → 403 nếu hack. | Happy 🔴 |
| TC-PERM-002 | BR-AUTH-08 / FR-07 | CB_NV_TW — CRUD + scope toàn quốc | 1. cb_nv_tw_01 login. 2. Seed 3 đơn vị có DN. | — | 1. Mở danh sách. 2. Verify nút CRUD. 3. Tạo + sửa + xóa thử 1 DN. | (3) UI có đủ 4 nút [+ Thêm mới], [Import Excel], [Sửa], [Xóa]. CRUD thành công. Scope = toàn quốc (thấy DN của mọi đơn vị). | Happy 🔴 |
| TC-PERM-003 | BR-AUTH-08 / FR-07 | CB_NV_BN — CRUD scope BN | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. 2. DN A của KH&ĐT, DN B của Tài chính. | — | 1. Mở danh sách. 2. Quan sát data + verify CRUD. | (3) Chỉ thấy DN A (KH&ĐT). KHÔNG thấy DN B. CRUD trên DN A OK. Cố sửa DN B qua URL hack → 403. | Happy 🔴 |
| TC-PERM-004 | BR-AUTH-08 / FR-07 | CB_NV_DP — CRUD scope ĐP | 1. cb_nv_dp_01 (Sở TP HCM) login. 2. DN A HCM, DN B HN. | — | 1. Danh sách. | (3) Chỉ thấy DN HCM. CRUD OK. Cross-DP KHÔNG thấy. | Happy 🔴 |
| TC-PERM-005 | BR-AUTH-08 / FR-07 | CB_PD_TW — read-only toàn quốc, KHÔNG CRUD | 1. cb_pd_tw_01 login. 2. Seed multi-đơn-vị. | — | 1. Mở danh sách. 2. Quan sát toolbar. | (3) UI thấy DN toàn quốc (R*). KHÔNG có [+ Thêm mới], [Import Excel], [Sửa], [Xóa] trên row. Cố POST API → 403. | Happy 🔴 |
| TC-PERM-006 | BR-AUTH-08 / FR-07 | CB_PD_BN — read-only scope BN | 1. cb_pd_bn_01 login. 2. DN multi-đơn-vị. | — | 1. Danh sách. | (3) Chỉ thấy DN của Bộ mình. KHÔNG có nút CRUD. | Happy 🟡 |
| TC-PERM-007 | BR-AUTH-08 / FR-07 | CB_PD_DP — read-only scope ĐP | 1. cb_pd_dp_01 login. 2. DN multi-đơn-vị. | — | 1. Danh sách. | (3) Chỉ thấy DN của Sở mình. KHÔNG nút CRUD. | Happy 🟡 |

---

## B. ROLE KHÔNG QUYỀN — VERIFY 403 BLOCK

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-010 | BR-AUTH-08 / FR-07 | NHT — không truy cập module DN | 1. nht_01 login. | — | 1. Quan sát sidebar. 2. Cố navigate URL `/doanh-nghiep`. | (3) Sidebar KHÔNG có menu "Quản lý Doanh nghiệp" (theo permission-matrix). URL hack → redirect `/403` hoặc `/dashboard`. Backend GET → 403. | Negative 🔴 |
| TC-PERM-011 | BR-AUTH-08 / FR-07 | TVV — không truy cập module DN | 1. tvv_01 login. | — | 1. Sidebar. 2. URL hack. | (3) Tương tự TC-PERM-010 cho TVV (KHÔNG có menu, 403). | Negative 🔴 |
| TC-PERM-012 | BR-AUTH-08 / FR-07 | CG — không truy cập module DN | 1. cg_01 login. | — | 1. Sidebar. 2. URL hack. | (3) Tương tự (403). | Negative 🟡 |
| TC-PERM-013 | BR-AUTH-08 / FR-07 | GV — không truy cập module DN | 1. gv_01 login. | — | 1. Sidebar. 2. URL hack. | (3) Tương tự (403). | Negative 🟡 |

---

## C. DN ROLE — OUT-OF-SCOPE CMS (BR-AUTH-11)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-020 | BR-AUTH-11 | DN không có CMS user — KHÔNG đăng nhập được CMS | 1. Cố login với username dạng DN. | — | 1. Login `/login` với credentials DN. | (3) Login fail. BR-AUTH-11 quote: "DN KHÔNG đăng nhập CMS — DN tương tác qua API chuyên trang Cổng PLQG". CMS không có user role DN. ⚠️ Đánh dấu **Out-of-scope CMS** — TC này verify edge case, expected fail. | Edge 🟡 |
| TC-PERM-021 | BR-AUTH-11 / G7 | DN role API-only — placeholder | (Test riêng API smoke, không phải CMS QA) | — | (See API test plan riêng) | ⚠️ **SRS Gap G7:** TC field-level cho DN role được defer sang API test plan riêng. Module DN CMS không cần test DN role. Note: DN qua API filter `don_vi_id` + `doanh_nghiep_id` từ token (NotebookLM cite [10]). | Edge — defer |

---

## D. CROSS-CUTTING — DATA ISOLATION

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-030 | BR-AUTH-08 | Multi-tenant isolation — 2 ĐP ngang cấp KHÔNG thấy nhau | 1. Seed: DN-HCM của Sở TP HCM, DN-HN của Sở TP HN. 2. cb_nv_dp_01 (HCM) login. | — | 1. Mở danh sách. 2. Verify chỉ DN-HCM. 3. Logout. 4. Login `cb_nv_dp_02` (HN). 5. Verify chỉ DN-HN. | (3) Cb_nv_dp_01 KHÔNG thấy DN-HN; cb_nv_dp_02 KHÔNG thấy DN-HCM (BR-AUTH-08 ngang cấp KHÔNG thấy nhau). | Happy 🔴 |
| TC-PERM-031 | BR-AUTH-08 | Tầng cấp BN không thấy DN của ĐP khác Bộ | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. 2. DN của Sở TP HCM (thuộc Bộ Tư pháp). | — | 1. Mở danh sách. 2. Quan sát. | (3) Cb_nv_bn_01 không thấy DN của Sở thuộc Bộ khác. SRS Phụ lục B BR-AUTH-08 + BR-AUTH-03 ngang cấp KHÔNG thấy nhau. | Happy 🟡 |
| TC-PERM-032 | BR-AUTH-08 / cross-module | Sửa DN của đơn vị khác qua URL hack → 403 | 1. cb_nv_dp_01 (HCM) login. 2. DN-HN của HN. 3. Lấy URL chi tiết DN-HN. | — | 1. Cố mở `/doanh-nghiep/{DN-HN-id}`. 2. Cố [Sửa]. | (1) DB không thay đổi. (3) Backend trả 403 cho GET detail (data isolation BR-AUTH-08) hoặc 404 (ẩn record). PUT cũng 403. AUDIT_LOG: action=ACCESS_DENIED. | Negative 🔴 |
| TC-PERM-033 | BR-AUTH-11 | API endpoint test — verify scope với token | 1. Lấy token cb_nv_dp_01 (HCM) qua `/auth/login`. 2. Curl `/api/v1/doanh-nghiep` với header Authorization. | — | 1. GET API list. 2. Filter response. | (1) DB không thay đổi (read). (3) Response chỉ chứa DN của HCM (don_vi_id filter ở backend). Verify response.data có 0 DN ngoài HCM. | Edge 🟡 |

---

## E. SESSION & ADVANCED PERMISSION (bổ sung từ review)

| ID | TraceID | Tên Test Case | Pre-conditions | Test Data | Các bước thực hiện | Kết quả mong đợi | Type |
|----|---------|--------------|----------------|-----------|-------------------|------------------|------|
| TC-PERM-040 | BR-AUTH-01 | JWT expired mid-session | 1. cb_nv_tw_01 login. 2. JWT TTL 15 phút. | — | 1. Đợi 16 phút. 2. Click action CRUD. | (3) ⚠️ Theo memory CLAUDE.md note "BE revoke JWT ~2 phút thực bất chấp exp 15 phút claim" — verify behavior. Expected: redirect `/login` với message "Phiên hết hạn, vui lòng đăng nhập lại". ⚠️ **SRS không quote message nguyên văn** — flag BA. | Edge 🟡 |
| TC-PERM-041 | BR-AUTH-01 | Multi-tab login same user — session sync | 1. Tab1 login cb_nv_tw_01. 2. Tab2 login cb_nv_tw_02 (cùng browser). | — | 1. Tab1 thực hiện hành động CRUD. | (3) ⚠️ **SRS Gap**: cookie/session sticky hay isolation? Theo memory `qa_htpldn_round5_t01.md` — BE httpOnly cookie sticky → Tab1 + Tab2 dùng chung session, có thể xung đột. Flag BA. | Edge 🟡 |
| TC-PERM-042 | BR-AUTH-01 | Logout clear server session | 1. cb_nv_tw_01 login. 2. Click Logout. | Token cũ saved | 1. Cố API call với token cũ. | (3) Backend reject 401. Token bị invalidate (verify backend behavior). | Negative 🔴 |
| TC-PERM-043 | BR-DATA-05 / BR-AUTH-08 | Quan sát AUDIT_LOG scope theo role | 1. cb_nv_dp_01 (HCM) đã thực hiện CREATE DN. 2. qtht_01 login. | — | 1. QTHT mở module Nhật ký (FR-10) lọc audit của entity=DOANH_NGHIEP. | (3) QTHT thấy audit của TẤT CẢ đơn vị (👁️ R toàn HT trên AUDIT_LOG per permission-matrix.md line 123 "FR-10 AUDIT_LOG R*" — wait, is it R* scoped or R toàn?). ⚠️ Verify scope AUDIT_LOG cho QTHT. | Edge 🟡 |
| TC-PERM-044 | BR-AUTH-08 / cross-org | CB_NV_BN xem DN của Bộ khác Bộ — qua URL hack DN ID cụ thể | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. 2. DN-Y thuộc Bộ Tài chính. | URL `/doanh-nghiep/{DN-Y-id}` | 1. Paste URL detail DN-Y. | (1) Backend trả 403 hoặc 404 (ẩn record). (3) UI redirect 403 page. ⚠️ **SRS Gap G24**: 403 vs 404 (security best practice 404 để tránh enumeration). Flag BA. | Negative 🔴 |
| TC-PERM-045 | BR-AUTH-08 / Tab #2 perm | CB_PD_TW click Tab #2 (HSPL) — actor không trong list | 1. cb_pd_tw_01 login. 2. Mở chi tiết DN-X. | — | 1. Quan sát các tab. 2. Click Tab #2. | (3) ⚠️ **SRS Gap G23**: NotebookLM cite [5] FR-X.1-04 actor = "Cán bộ Nghiệp vụ (TW/BN/ĐP), Người hỗ trợ" — KHÔNG có CB_PD. Tab #2 expected disabled hoặc click → 403. Flag BA verify thực tế. | Edge 🔴 |
| TC-PERM-046 | BR-AUTH-08 / Tab #2 perm | NHT/TVV/CG (Người hỗ trợ) — verify CRUD Tab #2 | 1. nht_01, tvv_01, cg_01 lần lượt login. 2. Mở chi tiết DN trong scope. | — | 1. Click Tab #2. 2. Cố CRUD HSPL. | (3) ⚠️ **SRS Gap G23**: NotebookLM cite [5] "Người hỗ trợ" — chưa rõ mapping role cụ thể (NHT? TVV? CG? all?). Verify CRUD Tab #2. Flag BA. | Edge 🟡 |
| TC-PERM-047 | BR-AUTH-08 / FR-07 + scope | CB_NV_BN tạo DN — gán don_vi_id của user | 1. cb_nv_bn_01 (Bộ KH&ĐT) login. | DN data không có cột tỉnh (UI tự gán) | 1. Tạo DN. 2. Verify DB. | (1) DB: `don_vi_id = <Bộ KH&ĐT id>` (BR-AUTH-08 multi-tenant + BR-DATA-02 NOT NULL srs-fr-07:644). KHÔNG cho phép user chọn don_vi_id khác (qua API hack). | Happy 🔴 |
| TC-PERM-048 | BR-AUTH-08 / FR-07 + URL hack | CB_NV_DP cố tạo DN với don_vi_id của ĐP khác (qua API) | 1. cb_nv_dp_01 (HCM) login. 2. Curl POST `/doanh-nghiep` với `don_vi_id=<HN id>`. | — | 1. POST API. | (1) Backend reject hoặc force override don_vi_id = HCM (ignore client value). (2) 403 hoặc 400. ⚠️ **SRS Gap**: behavior chưa quote rõ. Flag security. | Negative 🔴 |
| TC-PERM-049 | BR-AUTH-11 / API only | DN qua API token — out-of-scope CMS test note | (Defer test riêng API) | — | — | (3) Tham chiếu cho team API test: BR-AUTH-11 "API lọc theo don_vi_id (Sở TP) + doanh_nghiep_id (token)" (NotebookLM cite [10]). DN chỉ thấy hồ sơ của chính mình. ⚠️ Mark **Defer** — không test trên CMS. | Edge — defer |
| TC-PERM-050 | BR-AUTH-08 / negative | Account khóa giữa session — JWT vẫn valid? | 1. cb_nv_tw_01 login. 2. Admin lock tài khoản qua module FR-10. | — | 1. cb_nv_tw_01 thực hiện CRUD. | (3) ⚠️ **SRS Gap G25**: backend revoke JWT ngay khi lock hay đợi expire? Default expected: revoke immediately. Verify. Flag BA. | Edge 🟡 |
| TC-PERM-051 | BR-AUTH-08 / FR-07 / SCR-V.III-01 row#5 | QTHT — có nút [Xuất Excel] + export scope toàn HT | 1. qtht_01 login. 2. Seed DN ở 3 đơn vị. | — | 1. Mở `/doanh-nghiep`. 2. Quan sát toolbar. 3. Click [Xuất Excel]. | (3) SRS row#5 quote "Luôn hiển thị" → QTHT THẤY nút [Xuất Excel]. File export chứa DN của TẤT CẢ đơn vị (scope toàn HT theo QTHT permission). ⚠️ Verify: QTHT chỉ R (không CRUD) nhưng vẫn export được. | Happy 🟡 |
| TC-PERM-052 | BR-AUTH-08 / FR-07 / SCR-V.III-01 row#5 | CB_PD_TW — có nút [Xuất Excel] + export scope TW | 1. cb_pd_tw_01 login. 2. Seed DN multi-đơn vị. | — | 1. Mở `/doanh-nghiep`. 2. Quan sát toolbar: không có [Thêm mới], không có [Import Excel], CÓ [Xuất Excel]. 3. Click [Xuất Excel]. | (3) SRS row#5 "Luôn hiển thị" → CB_PD_TW THẤY [Xuất Excel] dù là read-only role. File export chứa DN của toàn quốc (scope TW). ⚠️ Verify: toolbar chỉ có [Xuất Excel] + [Làm mới] (không có CRUD buttons). | Edge 🟡 |

---

## Tổng kết file 06-TC

- **30 TC** (verified bằng grep): 11 Happy + 8 Negative + 11 Edge (gồm 11 TC từ Edge Case Hunter + 2 TC từ Deep Review)
- **TC bổ sung từ Deep Review**: TC-PERM-051 (QTHT export scope toàn HT), TC-PERM-052 (CB_PD_TW export visibility)
- **Critical TC** (🔴): 001, 002, 003, 004, 005, 010, 011, 030, 032, 042, 044, 045, 047, 048 — phải pass 100%
- **Out-of-scope CMS**: TC-PERM-020, 021, 049 (DN role) — defer sang API test plan
- **SRS Gap**: G7 (DN role API-only), G23 (Tab #2 perm cho CB_PD/Người hỗ trợ), G24 (403 vs 404 enumeration), G25 (account lock JWT revoke)
- **Cross-module dependency**: file này phụ thuộc seed multi-đơn-vị data → verify GĐ 1 seed xong (DN của TW + BN + ĐP) trước khi run.
