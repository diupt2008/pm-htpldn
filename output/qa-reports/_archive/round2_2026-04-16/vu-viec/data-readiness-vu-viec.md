# Data Readiness Report — Module: Vụ việc HTPL

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Vụ việc Hỗ trợ Pháp lý (7.4) |
| **Round** | Round 2 |
| **Ngày** | 2026-04-18 |
| **Người tạo** | QA Automation (Claude Code, Opus 4.7) |
| **Spec** | [test-strategy §7.0.1](../../../test-strategy.md#701-artifact-spec--data-readiness-reportmd) |
| **Method** | API seed (canbo_tw + nht_user tokens) — `POST /api/v1/vu-viecs/manual` + state walk actions |
| **Refer** | [funtion/7.5-vu-viec-htpl.md §Data Readiness](../../../funtion/7.5-vu-viec-htpl.md#data-readiness-cho-module-này) |

---

## 1. State Readiness Matrix (SM-VUVIEC, 9 states)

| # | State | Test path cần | Rows trước (Lệnh 2) | Rows sau (Lệnh 3) | Sample ID | Account tạo | Kết luận |
|---|-------|---------------|---------------------|-------------------|-----------|-------------|----------|
| 1 | **CHO_TIEP_NHAN** | VV-005, VV-007, VV-031 (tiếp nhận, notification) | 0 | **0** | — | — | **BLOCKED — BUG-VV-007: endpoint DN portal không tồn tại** (tried `POST /portal/vu-viecs`, `/public/vu-viecs`, `/vu-viecs/portal`, `/vu-viecs/dn` — all 404). Manual creation skip state CHO_TIEP_NHAN, luôn tạo thẳng DA_TIEP_NHAN |
| 2 | **DA_TIEP_NHAN** | VV-007 (kiểm tra), VV-001 (list) | 3 | **6** | `VV-BTP-TW-20260418-001` (id=47810302-179e-4aad-96ae-b041c8017976), `VV-BTP-TW-20260418-004` (779d8a3e-...), `VV-BTP-TW-20260418-005` (89f5dd73-...), `VV-BTP-TW-20260418-006` (129eb793-...) + pre-existing `VV-BTP-TW-20260417-001`, `VV-BTP-TW-20260414-001` | canbo_tw (CB_NV TW) | **ĐỦ** |
| 3 | **DANG_KIEM_TRA** | VV-008 (yêu cầu bổ sung) | 0 | **0** | — | — | **BLOCKED — BUG-VV-008: state transient** — action `/kiem-tra` yêu cầu `ketLuan` (DAT/KHONG_DAT/YEU_CAU_BO_SUNG) → luôn transition thẳng sang DA_PHAN_CONG/TU_CHOI/YEU_CAU_BO_SUNG, không bao giờ idle ở DANG_KIEM_TRA. State này unreachable qua API |
| 4 | **YEU_CAU_BO_SUNG** | VV-009 (bổ sung 1,2,3), VV-010 (lần 4 auto reject) | 0 | **1** (count=1) | `VV-BTP-TW-20260418-003` (id=d0864a2b-6e0b-4fac-a98d-162a51eadb92, `boSungCount=1`) | canbo_tw | **PARTIAL — count=1, không phải count=3.** Không loop được vì: từ YEU_CAU_BO_SUNG, `_links: []` → API không cung cấp action để DN nộp bổ sung → không lặp được tới count=3 → **VV-010 (auto reject lần 4) BLOCKED** |
| 5 | **DA_PHAN_CONG** | VV-011 (phân công), VV-020 (phân công lại) | 1 | **2** | `VV-BTP-TW-20260418-002` (id=ee135b48-bada-498d-b7e9-820e303b8610) + pre-existing `VV-BTP-TW-20260414-004` | canbo_tw (via kiem-tra DAT) | **ĐỦ** (về count), **NHƯNG ⚠️** tất cả DA_PHAN_CONG có `nguoiHoTroId=null` + `ngayPhanCong=null` → data inconsistency (**BUG-VV-003**) |
| 6 | **DANG_XU_LY** | VV-013, VV-014 (xử lý, trình PD), VV-020 | 2 | **2** | pre-existing `VV-BTP-TW-20260414-003`, `VV-BTP-TW-20260414-002` | — (không tạo mới được) | **ĐỦ** về count, **NHƯNG** không thể tạo thêm VV mới đến state này vì **BUG-VV-006: tiep-nhan + phan-cong endpoints đều reject DA_PHAN_CONG/DA_TIEP_NHAN** |
| 7 | **CHO_PHE_DUYET** | VV-014, VV-015, VV-016 (duyệt, từ chối) | 0 | **0** | — | — | **BLOCKED — BUG-VV-009: `/trinh-phe-duyet` fail "Chưa có kết quả xử lý từ tư vấn viên"** (ERR-VAL-VI-TD-02). Không có endpoint để set `ketQuaXuLy` (tried `/ket-qua-vu-viec`, `/ket-qua-vu-viecs` — 404). PATCH `ketQuaXuLy` bị immutability guard chặn. Workflow stuck |
| 8 | **DA_DUYET** | VV-017, VV-023 (hoàn thành, immutability) | 0 | **0** | — | — | **BLOCKED — pre-blocked per state 7** |
| 9 | **HOAN_THANH** | VV-018 (đánh giá), VV-033 | 0 | **0** | — | — | **BLOCKED — pre-blocked per state 7** |
| 10 | **DA_DANH_GIA** | VV-018 | 0 | **0** | — | — | **BLOCKED — pre-blocked per state 9** |
| 11 | **TU_CHOI** | VV-019 (từ chối), VV-010 (auto reject) | 0 | **0** | — | — | **BLOCKED** — cần kiem-tra(KHONG_DAT) hoặc pheDuyet(reject). Chưa test |

---

## 2. Non-workflow Data Readiness

| # | Loại | Rows trước | Rows sau | Sample ID | Kết luận |
|---|------|-----------|----------|-----------|----------|
| 1 | DN (doanh nghiệp) | ≥3 | 3 | `6efe3b32-556a-40de-a58a-568fbb094e2a` (QA Test DN Mới 001), `c573a0e4-...` (QTHT Updated), `074f431e-...` (QA DN Xóa Test), `a03241a1-...` (zxczc) | **ĐỦ** |
| 2 | TVV active (DANG_HOAT_DONG) | ≥1 | 1 | `818fc074-2d27-4368-976b-d218113669e8` (TVV-BTP-TW-0001, Congnt) | **ĐỦ** cho test đơn lẻ, **THIẾU** để test VV-012 (lọc + workload warning cần ≥2-3 TVV cùng lĩnh vực) |
| 3 | NHT active (cấp TW) | ≥1 | 0 active | `cfaf51d1-...` (NHT-BTP-TW-0009, MOI_DANG_KY) + others all MOI_DANG_KY | **THIẾU** — 0 NHT ở state DANG_HOAT_DONG. VV-011 (phân công NHT) sẽ BLOCKED trừ khi seed duyệt TVV lên DANG_HOAT_DONG. Workaround: dùng tvvId thay nhtId (endpoint phan-cong field là `tvvId` chứ không `nhtId`) |
| 4 | Lĩnh vực PL IDs | — | 3 | Dân sự `3b3e0735-...`, Hình sự `310ce17f-...`, Hành chính `f29f7d36-...` | **ĐỦ** |
| 5 | Loại hình HT IDs | — | 3 | Tư vấn PL `6331c54d-...`, Tham gia tố tụng `cd6109bb-...`, `5f22af09-...` | **ĐỦ** |
| 6 | Hạng mục kiểm tra (checklist config) | ? | **?** | — | **UNKNOWN** — endpoint `/api/v1/hang-muc-kiem-tras`, `/cau-hinh-kiem-tra` đều 404. Hiện tại kiem-tra accept bất kỳ UUID nào cho hangMucId (không validate reference) → **BUG-VV-010: hangMucId không reference check** |

---

## 3. Findings (App bugs discovered trong quá trình seed)

**CẢNH BÁO:** Trong lúc seed state machine qua API, phát hiện **5 bugs mới** ở mức application (ngoài 2 bugs đã báo trong round 2). Đây là blocker cho toàn bộ workflow state machine. Details ở [bug-report-vu-viec.md](bug-report-vu-viec.md) (sẽ update).

| Bug ID | Severity | Mô tả ngắn | State impacted |
|--------|----------|------------|----------------|
| **BUG-VV-003** | Critical | `DA_PHAN_CONG` state inconsistent: `nguoiHoTroId=null`, `ngayPhanCong=null` sau khi kiem-tra(DAT) | DA_PHAN_CONG → DANG_XU_LY chain hỏng |
| **BUG-VV-004** | Critical | **NHT xem được toàn bộ 11 VV** (kể cả không phân công cho mình) — vi phạm BR-AUTH-10 | Authorization leakage |
| **BUG-VV-005** | Major | HATEOAS `_links.tiep-nhan` trả về khi VV ở DA_PHAN_CONG, nhưng backend guard chỉ cho tiep-nhan khi CHO_TIEP_NHAN → link không actionable | UX confusion |
| **BUG-VV-006** | Critical | **Workflow stuck DA_PHAN_CONG**: `tiep-nhan` yêu cầu CHO_TIEP_NHAN, `phan-cong` không cho DA_PHAN_CONG. Không có action nào để progress DANG_XU_LY | Block workflow core |
| **BUG-VV-007** | Major | DN portal endpoint để tạo VV ở state CHO_TIEP_NHAN không tồn tại (tried 4 variants) | Không test được DN submit flow + VV-005 auto-blocked |
| **BUG-VV-008** | Medium | State `DANG_KIEM_TRA` transient — API kiem-tra yêu cầu ketLuan → luôn transition thẳng, state không idle được | VV-008, VV-019 test thiết kế sai hoặc state machine không match SRS |
| **BUG-VV-009** | Major | `trinh-phe-duyet` requires `ketQuaXuLy` set, nhưng không có endpoint set field này (PATCH bị immutability chặn) | Block CHO_PHE_DUYET → DA_DUYET → HOAN_THANH chain |
| **BUG-VV-010** | Minor | Field `checklist.*.hangMucId` không validate reference (accept bất kỳ UUID nào, không check tồn tại trong bảng config) | Data integrity — invalid checklist items can be recorded |

---

## 4. TC Coverage Impact — Lệnh 4 session sau

Theo kết quả seed, các TC có thể/không thể chạy trong Lệnh 4 fresh session:

### ✅ Có thể test (state có data)
- **VV-001, VV-002, VV-024:** List + search + export (với 11 VV ở 4 states) → data **ĐỦ**
- **VV-003, VV-004:** Create manual (via UI click "+ Nhập thủ công") → data không cần pre-existing
- **VV-007, VV-008, VV-019:** Action `kiem-tra` trên DA_TIEP_NHAN có 6 VV để test 3 ketLuan variants (DAT, YEU_CAU_BO_SUNG, KHONG_DAT) → data **ĐỦ**
- **VV-011, VV-012:** Phân công — TVV có 1 active. Đủ smoke test, thiếu cho workload scenario
- **VV-022:** SLA indicators — tất cả đều BINH_THUONG → **THIẾU** data overdue
- **VV-024:** Export Excel (toggled disabled trên tab Tất cả)
- **VV-026b, VV-028, VV-029, VV-030:** Auth matrix — seed account `nht_user`, `tvv_user`, `qtht_tw`, `dn_user` đủ

### ⚠️ Partial (data có nhưng không đủ coverage)
- **VV-009:** Bổ sung 1,2,3 lần — hiện có boSungCount=1, cần loop (BLOCKED bởi BUG-VV-007)
- **VV-022 SLA 4 mức** — chỉ có BINH_THUONG

### ❌ Blocked (app bugs, không phải data issue)
- **VV-005 (CHO_TIEP_NHAN → DA_TIEP_NHAN):** No DN portal endpoint
- **VV-010 (auto reject lần 4):** Cannot loop YEU_CAU_BO_SUNG
- **VV-013, VV-013b, VV-013c (NHT xử lý, upload, kết quả):** Workflow stuck DA_PHAN_CONG
- **VV-014 (trình duyệt):** Blocked BUG-VV-009
- **VV-015, VV-016 (phê duyệt/từ chối):** Pre-blocked VV-014
- **VV-017 (hoàn thành):** Pre-blocked VV-015
- **VV-018 (đánh giá):** Pre-blocked VV-017
- **VV-023 (immutability):** Pre-blocked VV-015
- **VV-026 (NHT scope):** BUG-VV-004 evident (NHT đọc được tất cả)
- **VV-027 (CB_PD cùng cấp):** Pre-blocked VV-015
- **VV-031, VV-032, VV-033 (notification + kết quả):** Pre-blocked VV-005/VV-017

### Summary per priority
| Priority | Có thể test | Partial | Blocked | Tổng |
|----------|------------|---------|---------|------|
| **P0** | 6 | 0 | 8 | **14** |
| **P1** | 5 | 1 | 10 | **16** |
| **P2** | 2 | 1 | 2 | **5** |
| **Tổng** | **13 (37%)** | **2 (6%)** | **20 (57%)** | **35** |

---

## 5. Evidence Files

Tất cả lưu trong `evidence/`:
- `01-vv-seed-01-datiepnhan.json` — VV-BTP-TW-20260418-001 full detail
- `02-vv-create-kiemtra.json` — VV-002 creation response
- `03-vv-create-ycbs.json` — VV-003 creation response
- `04-vv-create-cpd.json` — VV-004 creation response
- `05-vv-create-daduyet.json` — VV-005 creation response
- `06-vv-create-ht.json` — VV-006 creation response
- `walk-kiemtra-02.json` — kiem-tra action fail (checklist validation chain)
- `walk-phancong.json` — phan-cong fail evidence (BUG-VV-006)
- `walk-ycbs-step1.json` — YEU_CAU_BO_SUNG state achieved, `_links: []`
- `walk-trinhpheduyet.json` — trinh-phe-duyet fail evidence (BUG-VV-009)

---

## 6. Recommendations for Lệnh 4

### Có thể chạy trong session sau (13 TC + 2 partial)
- UI list/search/filter (VV-001, VV-002, VV-022, VV-024)
- UI Create form (VV-003, VV-004)
- UI Action `kiem-tra` with 3 ketLuan variants (VV-007 + VV-008 + VV-019)
- UI Phân công (VV-011, VV-012)
- Authorization smoke (VV-026b, VV-028, VV-029, VV-030)

### Phải chờ dev fix trước khi unlock 20 TC còn lại
**Must fix P0 để unlock core workflow:**
1. **BUG-VV-006** (stuck DA_PHAN_CONG) — ưu tiên cao nhất
2. **BUG-VV-003** (nguoiHoTroId null sau kiem-tra) — fix cùng BUG-VV-006
3. **BUG-VV-009** (trinh-phe-duyet requires ketQuaXuLy without setter endpoint)

**Must fix P0 để không lộ dữ liệu:**
4. **BUG-VV-004** (NHT xem toàn bộ VV) — security risk

**Should fix P1:**
5. BUG-VV-007 (DN portal endpoint missing)
6. BUG-VV-005 (HATEOAS link incorrect)
7. BUG-VV-008 (DANG_KIEM_TRA state design mismatch với SRS)

### Thời gian re-test sau fix
- Nếu dev fix BUG-VV-003,004,006,009 → unlock ~15 thêm TC → re-test 30-45 min
- Nếu fix toàn bộ → unlock 20 TC → re-test 60-90 min

---

*Data readiness report generated: 2026-04-18 | QA Automation via Claude Code | Opus 4.7 | Method: API-based seed*
