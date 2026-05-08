# Workflow Test Report — R7.4.A4 Hỏi đáp 11 paths v3.5 (FR-02)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Hỏi đáp Pháp luật (FR-02 · Nhóm II) |
| **SRS ref** | [`6.2-sm-hoidap.md`](../../../../smoke/6.2-sm-hoidap.md) v3.5 (11 paths) + [`02-thu-tu-module.md §FR-02`](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) line 484-509 |
| **Round** | R8 (2026-05-08) |
| **Tester** | QA Automation (Chrome DevTools MCP) |
| **Pre-req** | R7.2.9 ✅ TK active · R7.3.1 ⚠️ pool reset (re-seed inline 6 HD R7.4.A4) · R7.3.1.MoB ✅ · R7.3.1.TVN 🟢 chưa run (TVN_BRIDGE pool empty) |
| **Bug report** | [bug-report-r7-4-a4-hd-workflow-block.md](../../bug-reports/hoi-dap/bug-report-r7-4-a4-hd-workflow-block.md) |

---

## Verdict R8

🚫 **BLOCKED 2/11 PASS — BE thêm state DA_PHAN_CONG (8-state) khác Master spec + thiếu transition DA_PHAN_CONG → DANG_XU_LY → workflow stuck.**

- ✅ **TP-HD-03 Cancel** — HD-004 MOI → HUY 200, version+1, `lyDo` lưu. Spec line 507 PASS.
- ⚠️ **TP-HD-08 Phân công TC TV** — PARTIAL: API `POST /phan-cong` body `{loaiDoiTuongXuLy:'TO_CHUC', toChucTuVanId, nguoiPhanCongId, version}` → 200 nhưng response cho `loaiDoiTuongXuLy=null` + `toChucTuVanId=null` ❌ silently bỏ qua 2 field v3.5 → BUG-HD-A4-003.
- 🚫 **TP-HD-01/02/04/05/06/07/10/11** — BLOCKED chain: phân công xong state = DA_PHAN_CONG (8-state SM) chứ KHÔNG phải DANG_XU_LY (Master spec 7-state). Endpoint `POST /phan-hois` từ chối với ERR-STATE-II-07-03 "Hỏi đáp ở trạng thái 'DA_PHAN_CONG' không thể tạo phản hồi". KHÔNG có endpoint nào để chuyển DA_PHAN_CONG → DANG_XU_LY (probe 7 endpoints variants đều 404). UI detail page state DA_PHAN_CONG chỉ có button [Quay lại] — không có [Bắt đầu xử lý]/[Tiếp nhận phân công]/[Soạn phản hồi]. → BUG-HD-A4-001 Critical.
- 🚫 **TP-HD-09 TVN_BRIDGE** — SKIP: pool `kenhTiepNhan=TVN_BRIDGE` trả total=0 → cần R7.3.1.TVN seed phiên TVN ESCALATE từ FR-13 trước.

**Cascading blocks downstream:**
- R7.4.D3.AUTO (auto-feed Kho QA TU_DONG): cần ≥1 HD DA_DUYET → block.
- R7.7.1 functional 60 TC v3.5 HD: cần ít nhất 1 record cover mọi state → 6 state đầu (TIEP_NHAN..HOAN_THANH) chưa reach.

---

## Bảng kiểm tra workflow R8 — 11 test paths theo SRS line 622-628 + v3.5 paths

| # | Path | Step | Actor | Sample | Status | Note |
|:-:|---|---|---|---|:-:|---|
| TP-HD-01 | Happy Path 7-step (MOI→...→HOAN_THANH) | B1-B2 MOI→TIEP_NHAN | cb_nv_tw_01 | HD-002 (Lao động) | ✅ | API `POST /tiep-nhan {version}` → 201, state TIEP_NHAN, ngayTiepNhan auto-fill, version 1→2. |
| TP-HD-01 | | B3 TIEP_NHAN→DA_PHAN_CONG | cb_nv_tw_01 | HD-002 | ⚠️ | API `POST /phan-cong {nguoiPhanCongId, version, ghiChu}` → 200, state TIEP_NHAN→**DA_PHAN_CONG** (8-state SM) ❌ Master spec định trực tiếp →DANG_XU_LY (7-state). Lần đầu fail ERR-HD-PHANCONG-CFG-01 "is not in CauHinhPhanCong" — fixed bằng seed 5 entries CauHinhPhanCong (BA Q11 chốt BỎ entity này nhưng BE vẫn check) → BUG-HD-A4-002. |
| TP-HD-01 | | B4 DA_PHAN_CONG→DANG_XU_LY | — | HD-002 | 🚫 | **Không có endpoint nào**: probe 7 variants (`tiep-nhan-phan-cong`, `bat-dau-xu-ly`, `xac-nhan-phan-cong`, `chap-nhan`, `start-processing`, `accept-assignment`, `tiep-nhan-cong-viec`) đều 404. PATCH state direct cũng từ chối. UI detail chỉ có button [Quay lại]. **BUG-HD-A4-001** + cascade B5-B7. |
| TP-HD-01 | | B5..B7 DANG_XU_LY→DA_TRA_LOI→CHO_PHE_DUYET→DA_DUYET→CONG_KHAI→HOAN_THANH | — | — | 🚫 | Cascade B4 — không reach DANG_XU_LY. |
| TP-HD-02 | Reject (CHO_PHE_DUYET → DANG_XU_LY) | — | cb_pd_<cap>_01 | — | 🚫 | Cascade TP-HD-01 — không reach CHO_PHE_DUYET. Endpoint `/tu-choi {lyDo, version}` đã probe (422 missing lyDo → exists, validate đúng BR-FLOW-04). |
| TP-HD-03 | Cancel MOI → HUY | — | cb_nv_tw_01 | HD-004 (Thuế) | ✅ | API `POST /huy {version, lyDo}` → 200, state MOI→HUY, version 1→2, `lyDo` stored. Spec line 507 PASS. Guard "không có phản hồi đang soạn" verified mặc nhiên (HD chưa có phản hồi). |
| TP-HD-04 | Auto-transition DA_TRA_LOI→CHO_PHE_DUYET (BR-FLOW-01) | — | System | — | 🚫 | Cascade — không reach DA_TRA_LOI. |
| TP-HD-05 | Batch Approve (BR-FLOW-02) | — | cb_pd_<cap>_01 | — | 🚫 | Cascade — không có ≥2 CHO_PHE_DUYET. Endpoint bulk chưa probe (defer). |
| TP-HD-06 | Immutability {DA_DUYET, CONG_KHAI, HOAN_THANH} | — | cb_nv_<cap>_01 | — | 🚫 | Cascade — không reach DA_DUYET. |
| TP-HD-07 | Unpublish CONG_KHAI → DA_DUYET | — | cb_nv_<cap>_01 | — | 🚫 | Cascade — không reach CONG_KHAI. Endpoint `/huy-cong-khai {version}` đã probe (422 missing version → exists). |
| TP-HD-08 | Phân công TC TV (FR-II-06 v3.5) | — | cb_nv_tw_01 | HD-006 (Doanh nghiệp) | ⚠️ | API `POST /phan-cong {loaiDoiTuongXuLy:'TO_CHUC', toChucTuVanId:<TC>, nguoiPhanCongId, version}` → 200 ✅ state DA_PHAN_CONG. **NHƯNG response `loaiDoiTuongXuLy=null + toChucTuVanId=null`** ❌ — BE silently bỏ qua 2 field v3.5. → BUG-HD-A4-003. ERR-PC-05 (TVV không thuộc TC) chưa test do pool TC TV-TVV chưa link. |
| TP-HD-09 | TVN_BRIDGE inbound (FR-13 ESCALATE → FR-02) | — | System | — | 🚫 | SKIP: `GET /api/v1/hoi-daps?kenhTiepNhan=TVN_BRIDGE` → total=0. Cần R7.3.1.TVN seed phiên TV nhanh ESCALATE qua UI FR-13 trước. |
| TP-HD-10 | Đóng hồ sơ thủ công (BR-FLOW-06 mới v3.5) | — | cb_nv_<cap>_01 | — | 🚫 | Cascade — không reach DA_DUYET/CONG_KHAI. Endpoint `/dong-ho-so {version}` đã probe (exists). |
| TP-HD-11 | Vai trò Công khai/Hủy CK (BR-FLOW-05 v3.5) | — | cb_pd_<cap>_01 | — | 🚫 | Cascade — không reach DA_DUYET. Endpoint `/cong-khai {version}` đã probe (exists). |

> Icon: ✅ pass · ⚠️ partial (mechanics OK but field missing) · 🚫 blocked (B4 transition gap cascade) · ❌ fail · ⏭ skip

---

## Endpoints discovered (R8)

| Method | Endpoint | Purpose | Status R8 |
|--------|----------|---------|-----------|
| GET | `/api/v1/hoi-daps?page=&pageSize=&trangThai=&kenhTiepNhan=&linhVucId=` | List + filter | ✅ |
| GET | `/api/v1/hoi-daps/{id}` | Detail (full schema 40+ fields) | ✅ |
| POST | `/api/v1/hoi-daps` | Create MOI (manual UC10) | ✅ 201 |
| POST | `/api/v1/hoi-daps/{id}/tiep-nhan` body `{version}` | MOI → TIEP_NHAN | ✅ 201 |
| POST | `/api/v1/hoi-daps/{id}/phan-cong` body `{nguoiPhanCongId, version, ghiChu?, loaiDoiTuongXuLy?, toChucTuVanId?}` | TIEP_NHAN → **DA_PHAN_CONG** (BUG: spec nói →DANG_XU_LY) | ⚠️ 200 |
| GET | `/api/v1/hoi-daps/{id}/goi-y-phan-cong` | Auto-suggest người xử lý | ✅ 200 (data:[]) |
| POST | `/api/v1/hoi-daps/{id}/phan-hois` body `{noiDung}` | Add phản hồi (yêu cầu state DANG_XU_LY) | 🚫 422 ERR-STATE-II-07-03 |
| POST | `/api/v1/hoi-daps/{id}/phe-duyet` body `{version}` | CHO_PHE_DUYET → DA_DUYET | exists (422 missing version) |
| POST | `/api/v1/hoi-daps/{id}/tu-choi` body `{lyDo, version}` | CHO_PHE_DUYET → DANG_XU_LY (BR-FLOW-04) | exists (422 missing fields) |
| POST | `/api/v1/hoi-daps/{id}/cong-khai` body `{version}` | DA_DUYET → CONG_KHAI | exists |
| POST | `/api/v1/hoi-daps/{id}/huy-cong-khai` body `{version}` | CONG_KHAI → DA_DUYET | exists |
| POST | `/api/v1/hoi-daps/{id}/dong-ho-so` body `{version}` | {DA_DUYET\|CONG_KHAI} → HOAN_THANH (BR-FLOW-06 v3.5) | exists |
| POST | `/api/v1/hoi-daps/{id}/huy` body `{version, lyDo}` | MOI → HUY | ✅ 200 |
| **MISSING** | `/api/v1/hoi-daps/{id}/{tiep-nhan-phan-cong\|bat-dau-xu-ly\|xac-nhan-phan-cong}` | DA_PHAN_CONG → DANG_XU_LY | **❌ 404** all variants |

---

## Pool sau test (R8 final state)

| Mã HD | LV | Kênh | State cuối | Note |
|---|---|---|---|---|
| HD-20260507-001 | Lao động | TRUC_TIEP | MOI | (cũ) BN BKH |
| HD-20260507-002 | Lao động | TRUC_TIEP | **DA_PHAN_CONG** | TP-HD-01 STUCK |
| HD-20260507-003 | Đất đai | HE_THONG_KHAC | MOI | reserve |
| HD-20260507-004 | Thuế | TRUC_TIEP | **HUY** | TP-HD-03 PASS |
| HD-20260507-005 | Sở hữu trí tuệ | HE_THONG_KHAC | MOI | reserve |
| HD-20260507-006 | Doanh nghiệp | TRUC_TIEP | **DA_PHAN_CONG** | TP-HD-08 STUCK |
| HD-20260507-007 | Lao động | HE_THONG_KHAC | MOI | reserve |

**byState:** {MOI: 4, DA_PHAN_CONG: 2, HUY: 1, các state DANG_XU_LY/DA_TRA_LOI/CHO_PHE_DUYET/DA_DUYET/CONG_KHAI/HOAN_THANH: 0}

---

## Bằng chứng

### TP-HD-01/B4 BLOCK — UI detail DA_PHAN_CONG thiếu action button

![R8 — Detail HD-20260507-002 state "Đã phân công": Stepper 8-state hiển thị (Mới/Tiếp nhận/Đã phân công/Đang xử lý/Chờ phê duyệt/Đã duyệt/Công khai/Hoàn thành), thông tin xử lý đầy đủ, panel "Danh sách phản hồi (0) Chưa có phản hồi nào.", chỉ button [Quay lại] — KHÔNG có action transition](../../bug-reports/hoi-dap/image/r7-4-a4-hd-da-phan-cong-no-action.png)

### Pool list final state

![R8 — `/hoi-dap` list: 7 record cover MOI 4 + DA_PHAN_CONG 2 + HUY 1, 9 tab filter (Tất cả/Mới 4/Tiếp nhận/Đang xử lý/Chờ phê duyệt/Đã duyệt/Công khai/Hoàn thành/Hủy)](../../bug-reports/hoi-dap/image/r7-4-a4-hd-list-final.png)

### Trace API key

```text
=== R8 TP-HD-01 trace (cb_nv_tw_01, 2026-05-08 01:26-01:30) ===

POST /api/v1/hoi-daps/d9b34f3d.../tiep-nhan {version:1}
  → 201 {trangThai:'TIEP_NHAN', ngayTiepNhan:'...', version:2}  ✅ B2

POST /api/v1/hoi-daps/d9b34f3d.../phan-cong
     {nguoiPhanCongId:'d99760d8...(ly_13 CG)', version:2, ghiChu:'...'}
  → 422 ERR-HD-PHANCONG-CFG-01 "(ly_13 taiKhoanId, LV Lao động) is not in CauHinhPhanCong for đơn vị BTP-TW"  ❌
  → BUG-HD-A4-002 (CauHinhPhanCong DEPRECATED Q11 nhưng BE vẫn check)

POST /api/v1/cau-hinh-phan-congs (workaround seed) × 5 LV
  → 201 × 5 (seed cb_nv_tw_01 + 5 LV)  ✅ workaround

POST /api/v1/hoi-daps/d9b34f3d.../phan-cong
     {nguoiPhanCongId:'0c039382...(cb_nv_tw_01 self)', version:2, ghiChu:'...'}
  → 200 {trangThai:'DA_PHAN_CONG', nguoiPhanCongTen:'CB Nghiệp vụ TW 01', version:3}
  → ⚠️ BUG-HD-A4-001: state DA_PHAN_CONG (8-state SM) thay vì DANG_XU_LY (Master spec 7-state)

POST /api/v1/hoi-daps/d9b34f3d.../phan-hois {noiDung:'<phản hồi>'}
  → 422 ERR-STATE-II-07-03 "Hỏi đáp ở trạng thái 'DA_PHAN_CONG' không thể tạo phản hồi"  ❌

Probe transition DA_PHAN_CONG → DANG_XU_LY:
  POST /api/v1/hoi-daps/.../tiep-nhan-phan-cong  → 404
  POST /api/v1/hoi-daps/.../bat-dau-xu-ly        → 404
  POST /api/v1/hoi-daps/.../xac-nhan-phan-cong  → 404
  POST /api/v1/hoi-daps/.../chap-nhan            → 404
  POST /api/v1/hoi-daps/.../start-processing    → 404
  POST /api/v1/hoi-daps/.../accept-assignment   → 404
  POST /api/v1/hoi-daps/.../tiep-nhan-cong-viec → 404
  → ❌ Không có endpoint nào để chuyển — workflow STUCK

UI detail HD-20260507-002:
  buttons: ["Quay lại"]
  → ❌ Không có [Bắt đầu xử lý]/[Soạn phản hồi]/[Tiếp nhận phân công]

=== TP-HD-08 trace ===
POST /api/v1/hoi-daps/HD-006.../phan-cong
     {loaiDoiTuongXuLy:'TO_CHUC', toChucTuVanId:'<TC-id>', nguoiPhanCongId:'cb_nv_tw_01', version:2}
  → 200 {trangThai:'DA_PHAN_CONG', loaiDoiTuongXuLy:null, toChucTuVanId:null, version:3}
  → ⚠️ BUG-HD-A4-003: BE accept request body but silently ignores 2 field v3.5

=== TP-HD-03 trace ===
POST /api/v1/hoi-daps/HD-004.../huy {version:1, lyDo:'<reason>'}
  → 200 {trangThai:'HUY', version:2, ...}  ✅
```

---

## Phương án xử lý (để R7.4.A4 unblock)

1. **DEV BA quyết định SM** — confirm 7-state Master spec hay 8-state với DA_PHAN_CONG. Liên quan [LỖI A srs-conflicts-need-ba.md](../../../../srs-conflicts-need-ba.md). Nếu 8-state: bổ sung transition DA_PHAN_CONG → DANG_XU_LY (auto khi assignee mở detail HOẶC explicit endpoint `/bat-dau-xu-ly`). UI thêm button hành động phù hợp.
2. **DEV BE remove CauHinhPhanCong check** — implement auto-filter 4 tiêu chí FR-II-06 Step 5 (lĩnh vực + đơn vị BR-AUTH-08 + workload ASC + ho_ten ASC LIMIT 10). Workaround R8 dev seed trực tiếp tránh dùng entity này.
3. **DEV BE persist `loaiDoiTuongXuLy + toChucTuVanId`** trên POST `/phan-cong` — TP-HD-08 v3.5.
4. **R7.3.1.TVN run** — seed phiên TV nhanh ESCALATE từ FR-13 → tạo HD `kenh=TVN_BRIDGE` để TP-HD-09 có sample.
5. **Re-test R7.4.A4 R9** sau dev fix → walk full 11 paths.

---

## Ghi chú thực thi

- **Phân loại R8 (CLAUDE.md Rule 9):** APP/BE BUG (state DA_PHAN_CONG missing transition + CauHinhPhanCong check + persist field v3.5) + APP/FE BUG (UI thiếu action button DA_PHAN_CONG). KHÔNG phải SELECTOR OUTDATED, KHÔNG phải session reset. Đã capture diagnostic 2-source (UI snapshot + API probe 7 endpoint variants) trước khi log bug.
- **R7.3.1 pool reset:** R7.3.1 seed 6 HD MOI cover 6 LV bị mất giữa rounds (chỉ còn 1 record từ BN BKH). Re-seed inline 6 HD-20260507-002..007 cover 5 LV (Lao động×2, Đất đai, Thuế, SHTT, DN). Cần root-cause như TVCS R7.4.A5.
- **CauHinhPhanCong workaround:** Seed 5 entries (cb_nv_tw_01 × 5 LV) để bypass BE check. Cleanup sau khi BE fix.
- **Anti-pattern tránh:** Không retry POST `/phan-hois` lặp khi 422 ERR-STATE-II-07-03 — confirmed BE state-machine reject. Phân loại Rule 9 = APP/BE BUG, escalate.

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| **R8** | 2026-05-08 | 🚫 2/11 PASS (TP-HD-03 + TP-HD-08 PARTIAL). 8 BLOCKED do BUG-HD-A4-001 (DA_PHAN_CONG transition missing) + 1 SKIP TP-HD-09 (TVN_BRIDGE pool empty). Re-seed inline 6 HD MOI. CauHinhPhanCong workaround seed 5 entries. UI detail DA_PHAN_CONG chỉ có [Quay lại] — không có action button. |

---

*R8 | QA Automation via Claude Code | Chrome DevTools MCP*
