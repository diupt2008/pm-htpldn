# Seed Checklist — BIEU_MAU + THU_MUC_BIEU_MAU Tier 1 (T1.B4)

**Phase:** P1 Tuần 1 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P1 T1.B4 • **Date:** 2026-04-25 (15:47–16:01 retry-0 PARTIAL → 16:30–16:39 retry-1 PASS)
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** retry-0 MCP UI (PARTIAL 1/4 do JWT revoke aggressive) → retry-1 MCP UI seed thư mục #1 + curl direct API cho thư mục #2-4 + biểu mẫu #1-6 (multipart upload + JSON create)
**Entry state:** `NHAP` (per FR-VII-01 / FR-VII-04)
**Input:** [seed-fixture.yaml > thu_muc_bieu_mau_variants[1..4] + bieu_mau_variants[1..6]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: ✅ **PASS 4/4 thư mục — 6/6 biểu mẫu** (state `NHAP` xác nhận qua API + UI)

**Root cause retry-0 PARTIAL (15:47–16:01):** JWT bị BE revoke ~2 phút real-time bất chấp `exp` 15 phút trong claim. 5 lần re-login chỉ commit kịp thư mục #1 trước revoke. Pattern không khớp T2.A1-A4 cùng round R4 → suspected env config change hoặc race với `/auth/refresh`.

**Cách giải retry-1 (16:30–16:39):** Race với revoke window — login MCP fresh → capture FE-refreshed token từ network log (FE refresh-token cookie HttpOnly hoạt động được trong browser context, BE revoke không impact session có cookie hợp lệ) → 1 batch curl trong <5 phút thực hiện toàn bộ POST. Đã discover endpoint chính xác `POST /api/v1/bieu-maus/upload` (multipart) → trả `fileId` → `POST /api/v1/bieu-maus` (JSON) với enum `loaiHinh ∈ {HOP_DONG, BIEU_MAU, MAU_DON, KHAC}`.

### Seed matrix — Thư mục biểu mẫu (FR-VII-01)

| # | Variant | Lĩnh vực fixture | Lĩnh vực thực tế | Seeded | UUID | Timestamp |
|---|---------|------------------|------------------|:------:|------|-----------|
| 1 | HĐ Lao động | LAO_DONG | Lao động (`6e673931-...`) | ✅ | `551c792a-d995-4597-bcc2-0d13dac06c56` | 25/04/2026 15:48:57 (retry-0) |
| 2 | HĐ Dân sự - Thương mại | HOP_DONG | Kinh doanh thương mại (fallback `7a826d8e-...` — UI dropdown thiếu HOP_DONG) | ✅ | `3987eae5-fa65-46de-a53e-f5398f70d51f` | 25/04/2026 16:33:09 (retry-1) |
| 3 | Biểu mẫu Doanh nghiệp | DOANH_NGHIEP | Doanh nghiệp (`f0a6e207-...` — visible khi `includeInactive=true`) | ✅ | `33e791ee-a9c8-4717-8a90-69e556aa0ae5` | 25/04/2026 16:33:09 (retry-1) |
| 4 | Biểu mẫu Thuế | THUE | Thuế (`69370af1-...`) | ✅ | `9225984e-b2b2-48f6-b4e8-8779e6984b7d` | 25/04/2026 16:33:09 (retry-1) |

**Total:** **4/4 PASS** — UI tab `Tất cả (4)` verify, all `trangThai=NHAP`, donViId đúng `00000000-0000-4000-8000-000000000001` (Cục BTP).

### Seed matrix — Biểu mẫu (FR-VII-04)

| # | Variant | Thư mục | Lĩnh vực | LoạiHình | File (bytes) | Mã BM | Seeded | UUID | Timestamp |
|---|---------|---------|----------|----------|------|-------|:------:|------|-----------|
| 1 | Mẫu Hợp đồng lao động chuẩn | HĐ Lao động | LAO_DONG | HOP_DONG | hdld-mau.docx (954) | `BM-20260425-001` | ✅ | `42b96ae5-5714-4062-b0db-62dbd94d017b` | 25/04/2026 16:38:51 |
| 2 | Mẫu Hợp đồng dịch vụ | HĐ Dân sự - TM | KINH_DOANH_TM | HOP_DONG | hddv-mau.docx (954) | (auto) | ✅ | `0e95cc04-34a5-4d0b-a6c8-db8c86550e30` | 25/04/2026 16:38:51 |
| 3 | Mẫu Biên bản họp HĐTV | Biểu mẫu DN | DOANH_NGHIEP | BIEU_MAU | bb-hdtv.docx (954) | (auto) | ✅ | `a061668f-b3da-4505-839b-b24a2577c026` | 25/04/2026 16:38:52 |
| 4 | Mẫu HĐ thuê đất KCN | HĐ Dân sự - TM | DAT_DAI | HOP_DONG | hd-thuedat-kcn.docx (954) | (auto) | ✅ | `08d533fd-a627-48c1-ac3f-3ea20565744a` | 25/04/2026 16:38:52 |
| 5 | Mẫu Tờ khai thuế GTGT | Biểu mẫu Thuế | THUE | MAU_DON | tokhai-gtgt.xlsx (1573) | (auto) | ✅ | `453e5388-00a0-4cf1-a814-4d7aea3b10a2` | 25/04/2026 16:38:53 |
| 6 | Mẫu Hợp đồng NDA chuẩn | HĐ Dân sự - TM | SO_HUU_TRI_TUE | HOP_DONG | nda-chuan.docx (954) | (auto) | ✅ | `5d4b7bed-a0e6-4d31-a65a-8644063fc91e` | 25/04/2026 16:38:53 |

**Total:** **6/6 PASS** — `trangThai=NHAP`, BR-DATA-04 auto-gen mã `BM-YYYYMMDD-SEQ` (verify `BM-20260425-001` qua UI), file hash + size lưu OK, `syncStatus=null` (chưa CÔNG KHAI nên chưa push Cổng PLQG).

Evidence:
- [screenshots/bieumau-t1b4-pass-4thumuc.png](../screenshots/bieumau-t1b4-pass-4thumuc.png) — UI list 4 thư mục NHÁP (Tất cả (4))
- [screenshots/bieumau-t1b4-pass-bm-list.png](../screenshots/bieumau-t1b4-pass-bm-list.png) — UI list Biểu mẫu của thư mục HĐ Lao động: BM-20260425-001 state Nháp
- [screenshots/bieumau-t1b4-partial-1of4.png](../screenshots/bieumau-t1b4-partial-1of4.png) — retry-0 archive (1/4 chỉ HD Lao động)
- API verify: `GET /api/v1/thu-muc-bieu-maus` → 4 records | `GET /api/v1/bieu-maus` → 6 records, all `trangThai=NHAP`

---

## Bug-report kèm theo

3 bug SRS-ref + 1 obs ngoài SRS, log file riêng [bug-report-seed-bieumau-t1b4.md](../bug-reports/bug-report-seed-bieumau-t1b4.md).

| Bug ID | Severity | Title | SRS Reference |
|--------|----------|-------|---------------|
| BUG-BIEUMAU-001-R4 | Critical | BE revoke JWT ~2 phút real-time bất chấp `exp` 15 phút claim trong token | `srs-fr-09-bieu-mau.md §BR-AUTH-01` (xác thực + session) |
| BUG-BIEUMAU-002-R4 | Major | Dropdown Lĩnh vực FE dùng filter active-only, ẩn `HOP_DONG` + `DOANH_NGHIEP` (visible khi `includeInactive=true`) | `srs-fr-09-bieu-mau.md §FR-VII-01 Inputs row 2 (linh_vuc_id Y)` |
| BUG-BIEUMAU-003-R4 | Medium | Cột "Số biểu mẫu" trên list thư mục hiển thị `0` cho tất cả 4 thư mục dù 6 BM đã link đúng | `srs-fr-09-bieu-mau.md §FR-VII-02 (Tìm kiếm thư mục — count metric)` |

---

## Observations ngoài SRS (không log bug)

| # | Observation | Affected | Workaround |
|---|-------------|----------|-----------|
| O1 | Endpoint `/api/v1/files/upload` (entityType chỉ accept `VuViec/HoSoVuViec/KetQuaVuViec/HoSoChiTra/HoSoTuVanVien/DanhGiaVuViec`) **KHÔNG support `BieuMau`** — module có endpoint riêng `POST /api/v1/bieu-maus/upload`. Đây là design choice (1 module 1 upload pipeline), không phải bug. | API discovery | Dùng đúng endpoint cho từng module |
| O2 | `loaiHinh` thực tế enum 4 giá trị `HOP_DONG/BIEU_MAU/MAU_DON/KHAC`. SRS FR-VII-04 Inputs row 5 không define enum cụ thể, fixture dùng tên free-text ("HĐ lao động", "Biên bản họp", "Tờ khai thuế") → BA confirm enum + cập nhật fixture. | Fixture v2.4 | Map fixture string → enum: HĐ → HOP_DONG, Biên bản/Mẫu → BIEU_MAU, Tờ khai → MAU_DON |
| O3 | BE check `Content-Type` header của field `file` thay vì magic bytes thực — curl phải set `;type=application/vnd.openxmlformats-officedocument.wordprocessingml.document` thì pass, nếu để default `application/octet-stream` sẽ ERR-VAL-FILE-03. | Test automation | Set explicit MIME khi upload qua curl |

---

## Linkage verify (cho downstream)

| # | Link | Status |
|---|------|:------:|
| L1 | 4 thư mục × link 6 biểu mẫu (FK thuMucId) | ✅ Mỗi BM trỏ đúng thư mục đích theo fixture |
| L2 | Entry state `NHAP` (SM-BIEUMAU Bước 1) | ✅ 4/4 thư mục + 6/6 BM badge "Nháp" |
| L3 | BR-DATA-04 auto-gen mã `BM-YYYYMMDD-SEQ` | ✅ `BM-20260425-001` verify qua UI |
| L4 | BR-DATA-03 common fields (donViId, nguoiTaoId, ngayTao) | ✅ Đầy đủ trong response |

Cascade UNBLOCK: T3.10 Workflow Biểu mẫu (NHÁP→CÔNG KHAI→ẨN) | T4.10 Functional Biểu mẫu 38 TC | T4.16 API `GET /api/v1/bieu-mau?la_cong_khai=1` (cần T3.10 push CONG_KHAI ≥1 record).

---

## T1.B4 Gate Decision

**Status:** ✅ **PASS 4/4 thư mục + 6/6 biểu mẫu — clean pass after retry-1**

**Todo status:** `[x]` done with bug-report attached (3 bug SRS-ref)

**Sample IDs giữ:**
- THU_MUC: TM1=`551c792a-...` (LAO_DONG), TM2=`3987eae5-...` (KDTM), TM3=`33e791ee-...` (DN), TM4=`9225984e-...` (THUE)
- BIEU_MAU: BM1..6 IDs ở matrix trên, mã canonical `BM-20260425-001` (BM#1)
- File templates: `/tmp/bieu-mau-templates/{hdld-mau,hddv-mau,bb-hdtv,hd-thuedat-kcn,nda-chuan}.docx + tokhai-gtgt.xlsx`

**Next action:** P1 hoàn thành 3/5 ✅ + 2/5 ⚠️ → ready cho C1 user duyệt go P2 + bắt đầu T3.10 sau seed P2 xong.

---

*retry-0 attempt: 2026-04-25 15:47–16:01 — PARTIAL 1/4 + 0/6 (5 lần re-login)*
*retry-1 attempt: 2026-04-25 16:30–16:39 — **PASS 4/4 + 6/6** (1 login + curl batch direct API)*
*QA AI via Claude Code + Chrome DevTools MCP + curl | Phase P1 Tuần 1 T1.B4*
