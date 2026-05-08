# Workflow Test Report — R7.4.A5 Workflow TVCS 11 bước (FR-12)

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Tư vấn chuyên sâu (FR-12 · Nhóm X.1) |
| **SRS ref** | [`srs-fr-12-tv-chuyen-sau.md`](../../../../../input/srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md) v3.5 (line 1452-1496 SM-TVCS) + [`02-thu-tu-module.md §⑧ FR-12`](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) |
| **Round** | R8 (2026-05-07) |
| **Tester** | QA Automation (Chrome DevTools MCP) |
| **Pre-req** | R7.2.6 ✅ 8 CG `HOAT_DONG` + R7.3.3 ✅ pool 10 TVCS TIEP_NHAN (re-seeded R8 do pool reset giữa R7→R8) |
| **Bug report** | [bug-report-r7-4-a5-tvcs-cg-action-block.md](../../bug-reports/tu-van-chuyen-sau/bug-report-r7-4-a5-tvcs-cg-action-block.md) |

---

## Verdict R8

⚠️ **PARTIAL 3/11 PASS — 2 BE bug Critical/Major chặn nhánh CG.**

- ✅ **3 PASS** — B1 (seed re-thực hiện R8), B2 (6/6 LV cover dropdown filter `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds`), B10 (PHAN_CONG → HUY UI button + modal + transition).
- ❌ **5 BLOCKED** — B3/B4/B6/B8/B9 do BE `/xac-nhan` reject với 403 ERR-AUTH-TVCS-CG-01 dù FK linkage OK + 2 CG cùng pattern + listing `/api/v1/noi-dung-tu-van-cs` filter trả 0 cho CG.
- ⏭ **3 EXTERNAL** — B5 (cron 2 ngày LV BE), B7 (auto BR-FLOW-01 BE), B11 (Portal DN external).

State env so với R6 R17 (2026-05-04):
- ✅ State enum `DANG_HOAT_DONG → HOAT_DONG` đã migrate (verified `?loaiTvv=CG&size=20` → `byState: {HOAT_DONG: 7}`).
- ❌ Pool R7.3.3 (10 TVCS-20260506-*) MẤT giữa R7 → R8 — nguyên nhân pool reset BE chưa rõ. Re-seed inline 10 TVCS-20260507-* HO_SO + DIEN_THOAI (skip VIDEO_CALL theo BUG-TVCS-VIDEO-CALL-001 known-bug Closed BE side, FE chưa expose).
- ❌ FK gap R6 (cg_tw_01..06 inbox rỗng) đổi shape: TK link OK nhưng BE `/xac-nhan` action-level auth check sai + listing endpoint filter sai cho CG role.

---

## Bảng kiểm tra workflow R8 — 11 transition theo SRS line 1452-1496

| # | Bước (transition) | Actor | Sample | Status | Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → TIEP_NHAN` (UC147 nhập tay CMS) | cb_nv_tw_01 | TVCS-20260507-0001..0010 | ✅ | Re-seed inline 10/10 (do pool reset). API `POST /api/v1/noi-dung-tu-van-cs` body `{doanhNghiepId, linhVucId, noiDung, tomTat, hinhThucTv, ngayTuVan}` → 201, state TIEP_NHAN, mã auto-gen `TVCS-YYYYMMDD-SEQ` (BR-DATA-04). Cover 6 LV (LĐ×2, Thuế×2, SHTT×1, DN×3, KDTM×1, ĐĐ×1). |
| 2 | `TIEP_NHAN → PHAN_CONG` ([Phân công CG]) | cb_nv_tw_01 | TVCS-0001..0006, 0009 | ✅ | **6/6 LV PASS.** TVCS-0001 (LĐ→OptLock) qua UI: modal "Phân công chuyên gia" mở, dropdown CG render duy nhất 1 record khớp `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds=<LĐ UUID>` (TVV-0003 Ngô VO_HIEU_HOA filter ra đúng), submit → toast + state PHAN_CONG. 5 cycle còn lại (Thuế/SHTT/DN/ĐĐ/KDTM) qua API `POST /{id}/phan-cong {chuyenGiaId, version, ghiChu}` → 200, state PHAN_CONG ver 1→2. |
| 3 | `PHAN_CONG → DANG_TU_VAN` ([Chấp nhận] CG) | CG account | TVCS-0004 (Lý) + TVCS-0006 (Đinh) | 🚫 | **BLOCKED — BE bug.** ly_13 + dinh_14 login OK, GET detail TVCS-0004/0006 trả `chuyenGiaId` khớp `TVV-0001.id`/`TVV-0002.id`, user `id` khớp `TVV.taiKhoanId`. POST `/xac-nhan {quyetDinh: 'CHAP_NHAN', version}` → **403 ERR-AUTH-TVCS-CG-01** "Chỉ chuyên gia được phân công mới thực hiện hành động này". 2-CG confirmed → BE bug, không phải config 1 account. Xem [BUG-FUNC-TVCS-A5-001](../../bug-reports/tu-van-chuyen-sau/bug-report-r7-4-a5-tvcs-cg-action-block.md). |
| 4 | `PHAN_CONG → TIEP_NHAN` ([Từ chối] CG) | CG account | TVCS-0006 | 🚫 | Cùng endpoint `/xac-nhan` `{quyetDinh: 'TU_CHOI', lyDo, version}` → **403 ERR-AUTH-TVCS-CG-01**. Cascade B3 bug. |
| 5 | `PHAN_CONG → banner cảnh báo` (Auto cron 2 ngày LV) | System | — | ⏭ | External cron BE — out of CMS test scope. SRS line 537 spec rõ "System". |
| 6 | `DANG_TU_VAN → HOAN_THANH` (CG tích HT + ≥1 file VB TVPL) | CG account | — | 🚫 | Cascade dep B3 — không reach DANG_TU_VAN. |
| 7 | `HOAN_THANH → CHO_PHE_DUYET` (Auto BR-FLOW-01) | System | — | ⏭ | System auto BE — out of CMS UI scope. Verified gián tiếp qua A4 HD R11 BR-FLOW-01 PASS (project memory). |
| 8 | `CHO_PHE_DUYET → DA_DUYET` ([Phê duyệt]) | cb_pd_tw_01 | — | 🚫 | Cascade dep B6/B7 — không reach CHO_PHE_DUYET. cb_pd_tw_01 ready. |
| 9 | `CHO_PHE_DUYET → DANG_TU_VAN` ([Từ chối] lý do ≥10) | cb_pd_tw_01 | — | 🚫 | Cascade dep B6/B7. |
| 10 | `PHAN_CONG → HUY` ([Hủy yêu cầu], guard CG chưa xác nhận) | cb_nv_tw_01 | TVCS-0009 (DN→Probe Permission) | ✅ | Detail TVCS-0009 PHAN_CONG render footer button [Hủy yêu cầu]. Click → modal "Hủy nội dung tư vấn" với field "Lý do hủy" required (max 1000) + button [Xác nhận hủy]/[Quay lại]. Nhập lý do "DN không còn nhu cầu tư vấn — hủy theo yêu cầu DN" → submit → banner "Nội dung tư vấn đã bị hủy" + state badge `Phân công → Hủy`. List view confirm row TVCS-0009 trạng thái "Hủy", chỉ còn button delete (button team + edit gone — terminal). |
| 11 | `DANG_TU_VAN → HUY` (DN yêu cầu hủy + cb_pd duyệt) | cb_nv + cb_pd + Portal DN | — | 🚫 | Cascade dep B3 + Portal DN external (out of CMS scope). |

> Icon: ✅ pass · 🚫 blocked (BE bug hoặc cascade) · ⏭ external (system auto / portal out-of-scope)

---

## Pool sau test (state cuối — verified `GET /api/v1/noi-dung-tu-van-cs?page=1&pageSize=50` ngày 2026-05-07 21:58)

| Mã | LV | Hình thức | DN | CG được phân công | State cuối |
|---|---|---|---|---|:-:|
| TVCS-20260507-0001 | Lao động | HO_SO | Hoa Sen SN2 | Probe CG R7.4.A1 OptLock Test (TVV-0008) | PHAN_CONG |
| TVCS-20260507-0002 | Thuế | DIEN_THOAI | Sao Mai NH1 | Trương Văn Mười Sáu (TVV-0004) | PHAN_CONG |
| TVCS-20260507-0003 | SHTT | HO_SO | Đại Phúc NH2 | Mai Thị Mười Bảy (TVV-0005) | PHAN_CONG |
| TVCS-20260507-0004 | DN | HO_SO | Vạn Phúc VU1 | Lý Thị Mười Ba (TVV-0001) | PHAN_CONG |
| TVCS-20260507-0005 | Đất đai | DIEN_THOAI | Hưng Thịnh VU2 | Hồ Văn Mười Tám (TVV-0006) | PHAN_CONG |
| TVCS-20260507-0006 | KDTM | HO_SO | Minh Đức SN3 | Đinh Văn Mười Bốn (TVV-0002) | PHAN_CONG |
| TVCS-20260507-0007 | Lao động | HO_SO | Tân Bình SN1 | (chưa) | TIEP_NHAN (reserve B4) |
| TVCS-20260507-0008 | Thuế | HO_SO | Gạo Doe bơ | (chưa) | TIEP_NHAN (reserve) |
| TVCS-20260507-0009 | DN | HO_SO | Test R778b | Probe Permission (TVV-0007) | **HUY** (B10 PASS) |
| TVCS-20260507-0010 | DN | DIEN_THOAI | Sông Hồng BKH | (chưa) | TIEP_NHAN (reserve) |

**Per-filter verify (cb_nv_tw_01 scope, R8 21:58):**
- Total: 10
- byState: PHAN_CONG=6, TIEP_NHAN=3, HUY=1
- LV cover: LĐ=2, Thuế=2, SHTT=1, DN=3, KDTM=1, ĐĐ=1 ✅

---

## Per-LV coverage B2 (PASS 6/6)

| LV | TVCS sample | CG khớp filter | Source verify |
|---|---|---|---|
| Lao động | TVCS-0001 | Probe OptLock (TVV-0008 HOAT_DONG) | UI dropdown render đúng 1 record (Ngô TVV-0003 VO_HIEU_HOA filter ra). Network: `GET /api/v1/tu-van-viens?pageSize=100&trangThai=HOAT_DONG&loaiTvv=CG&linhVucIds=bbbbbbbb-0000-4000-8000-000000000013` |
| Thuế | TVCS-0002 | Trương (TVV-0004) | API `phan-cong` 200 |
| SHTT | TVCS-0003 | Mai (TVV-0005) | API `phan-cong` 200 |
| Doanh nghiệp | TVCS-0004 | Lý (TVV-0001) | API `phan-cong` 200 |
| Đất đai | TVCS-0005 | Hồ (TVV-0006) | API `phan-cong` 200 |
| KDTM | TVCS-0006 | Đinh (TVV-0002) | API `phan-cong` 200 |

Filter `loaiTvv=CG ∧ trangThai=HOAT_DONG ∧ linhVucIds` áp đúng SRS line 533. Enum `HOAT_DONG` đã migrate v3.5 (BUG-CG-A1-001 R7 nay không còn).

---

## API endpoints xác nhận (R8)

| Step | Method | Path | Body | Effect |
|---|---|---|---|---|
| Tạo TVCS | POST | `/api/v1/noi-dung-tu-van-cs` | `{doanhNghiepId, linhVucId, noiDung, tomTat, hinhThucTv, ngayTuVan}` | TIEP_NHAN, ver=1, mã `TVCS-YYYYMMDD-SEQ` |
| Phân công CG | POST | `/api/v1/noi-dung-tu-van-cs/{id}/phan-cong` | `{chuyenGiaId, version, ghiChu}` | TIEP_NHAN → PHAN_CONG, ver+1 |
| Hủy yêu cầu | POST | `/api/v1/noi-dung-tu-van-cs/{id}/huy` (qua modal UI) | `{lyDo, version}` | PHAN_CONG → HUY (terminal) |
| CG xác nhận / từ chối | POST | `/api/v1/noi-dung-tu-van-cs/{id}/xac-nhan` | `{quyetDinh: 'CHAP_NHAN'\|'TU_CHOI', lyDo?, version}` | PHAN_CONG → DANG_TU_VAN / TIEP_NHAN. ❌ **Reject 403 cho CG được phân công** (BUG). |
| Detail | GET | `/api/v1/noi-dung-tu-van-cs/{id}` | — | Trả full TVCS + chuyenGiaId, version, trangThai. CG accessible cho assigned record. |
| List CB NV | GET | `/api/v1/noi-dung-tu-van-cs?page=1&pageSize=50` | — | CB NV: trả 10 ✅. CG (ly_13/dinh_14): trả total=0 ❌ (BUG). |

---

## Bằng chứng

### B1 + B2 — Re-seed + Phân công 6/6 LV (state cuối)

![R8 — TVCS list cb_nv_tw_01: 10 record, 6 PHAN_CONG cover 6 LV + 1 HUY (B10) + 3 TIEP_NHAN reserve](../../screenshots/r7-4-a5-list-final-state.png)

### B3 fail — CG inbox empty + 403 từ /xac-nhan

![R8 — Login `dinh_14` (CG, KDTM) → /403 dashboard, sidebar có Quản lý tư vấn](../../screenshots/r7-4-a5-cg-403-dinh-14.png)

![R8 — `ly_13` mở /tv-chuyen-sau/danh-sach: "Không có nội dung tư vấn chuyên sâu nào" mặc dù TVCS-0004 chuyenGiaId khớp TVV-0001](../../screenshots/r7-4-a5-cg-inbox-empty-fk-bug.png)

```text
=== R8 B3 BLOCK trace (ly_13 / dinh_14, 2026-05-07 21:54) ===
GET  /api/v1/auth/me (ly_13)
  → {userId: d99760d8-b38b-401e-a5ac-227664debef4, vaiTro: ['CG'], donViId: 00000000-0000-4000-8000-000000000001}

GET  /api/v1/noi-dung-tu-van-cs/cee63433-785b-411a-991a-780d10cad6fc (TVCS-0004)
  → 200 {trangThai: PHAN_CONG, chuyenGiaId: df00f7e1-..., version: 2}
     LINKAGE OK: TVCS.chuyenGiaId(df00f7e1) == TVV-0001.id ✅
                 TVV-0001.taiKhoanId(d99760d8) == ly_13.userId ✅

GET  /api/v1/noi-dung-tu-van-cs?page=1&pageSize=50
  → 200 {data: [], meta: {total: 0}} ❌ inbox lọc sai

POST /api/v1/noi-dung-tu-van-cs/cee63433.../xac-nhan
     {quyetDinh: 'CHAP_NHAN', version: 2}
  → 403 ERR-AUTH-TVCS-CG-01 "Chỉ chuyên gia được phân công mới thực hiện hành động này"

PATCH /api/v1/noi-dung-tu-van-cs/cee63433...
     {tomTat: 'Test update from CG', version: 2}
  → 200 ✅ (CG có quyền update_noi_dung_tu_van_cs nên PATCH chung OK)

=== Cùng pattern với dinh_14 / TVCS-0006 (KDTM, TVV-0002) ===
GET  detail → chuyenGiaId(5e0377d4) == TVV-0002.id ✅
              dinh_14.userId(4b732377) == TVV-0002.taiKhoanId ✅
POST /xac-nhan → 403 ERR-AUTH-TVCS-CG-01 (cùng error code)
```

### B10 PASS — PHAN_CONG → HUY UI

Banner success "Nội dung tư vấn đã bị hủy", state badge `Phân công → Hủy`, button [Hủy yêu cầu] ẩn, stepper biến mất. List view: TVCS-0009 cột Trạng thái "Hủy", row chỉ còn button "delete" (team+edit gone — terminal).

---

## Phương án xử lý (để A5 PASS 9/11)

1. **DEV BE fix `/xac-nhan` action-level auth check.** Reproduce: ly_13 (TVV-0001.taiKhoanId) gọi POST `/api/v1/noi-dung-tu-van-cs/{id-TVCS-0004}/xac-nhan` với TVCS-0004.chuyenGiaId = TVV-0001.id → expect 200, actual 403 ERR-AUTH-TVCS-CG-01. Sau khi fix: B3/B4 unblock → B6 unblock cascade → B8/B9 chạy được.
2. **DEV BE fix listing filter cho role CG.** `GET /api/v1/noi-dung-tu-van-cs` khi `req.user.vaiTro = ['CG']` cần JOIN TU_VAN_VIEN ON TAI_KHOAN.id = TU_VAN_VIEN.tai_khoan_id, lọc TVCS WHERE chuyen_gia_id = TVV.id. Hiện trả total=0.
3. **Re-test A5 R9 sau dev fix:** 5 cycle B3-B4-B6-B7-B8-B9 trên TVCS-0001..0006 (đã PHAN_CONG). 1 cycle B11 cần Portal DN seed (vẫn defer external).

## Ghi chú thực thi

- **Pre-condition gãy R8:** Pool R7.3.3 mất giữa R7→R8 (10 TVCS-20260506-* gone). Phải re-seed inline. Cần root-cause: (a) DB scheduled cleanup? (b) Manual BE reset? (c) Migration accidental wipe? Đề nghị BE confirm + thêm seed-protection cho QA round.
- **Account list MailHog activated (R7.2.9):** ly_13 / dinh_14 / truong_16 / mai_17 / ho_18 — pass `Secret@123` + OTP `666666`. Probe accounts (`probe_perm` + `probe_optlock`) chưa thử login R8 (rate-limit), TK state có thể vẫn CHO_KICH_HOAT.
- **Anti-pattern tránh:** Không retry `/xac-nhan` lặp khi 403 — phân loại Rule 9 = APP/BE BUG, không phải SELECTOR OUTDATED hay session reset. STOP + escalate đúng. Đã capture diagnostic 2-source (ly_13 + dinh_14) trước khi log bug.

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| **R8** | 2026-05-07 | ⚠️ 3/11 PASS (B1 re-seed + B2 6/6 LV + B10). 5 BLOCKED do BE bug `/xac-nhan` 403 + listing filter (2-CG confirmed: ly_13/dinh_14). 3 EXTERNAL (B5/B7/B11). State enum `HOAT_DONG` migrated. Pool reset cần root-cause. |
| R17 | 2026-05-04 | ⚠️ 3/11 PASS (B1+B2 6/6 + B10 BUG-FUNC-TVCS-002 fixed). FK gap (TU_VAN_VIEN.tai_khoan_id NULL) chưa fix → B3/B4/B6/B11 BLOCKED. 6 BLOCKED + 2 EXTERNAL. |
| R14-R16 | 2026-05-02..04 | 2/11 PASS (B1+B2). Bug TVCS-002 button [Hủy yêu cầu] miss UI + FK gap. |
| R13 | 2026-05-02 | 2/11 PASS (B1+B2 3 cycle DN/LĐ/Thuế). |

---

*R8 | QA Automation via Claude Code | Chrome DevTools MCP*
