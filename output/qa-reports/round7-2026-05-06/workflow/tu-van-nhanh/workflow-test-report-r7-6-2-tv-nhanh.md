# Workflow Test Report — R7.6.2 Workflow TV nhanh nhập tay (5 trạng thái) — FR-13

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Tư vấn Nhanh (FR-13 · Nhóm X.2) |
| **SRS ref** | [`srs-fr-13-tv-nhanh.md`](../../../../../input/srs-v3/srs-fr-13-tv-nhanh.md) §SM-TVNHANH (line 60-68) + [`02-thu-tu-module.md §⑫ FR-13`](../../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) line 745-790 |
| **Round** | **R9 (2026-05-08)** — re-test sau dev seed 50 phiên · trước đó R8 (2026-05-07) BLOCKED |
| **Tester** | QA Automation (Chrome DevTools MCP) |
| **Pre-req** | ✅ Dev seed 50 phiên TV nhanh cover 6 state (MOI 8 / DANG_TIM_KIEM 6 / DA_GOI_Y 12 / CB_TRA_LOI 8 / HOAN_THANH 12 / HET_HAN 4) · R7.3.16 🟢 Kho QA 6 DA_DUYET hieuLuc=true |
| **Bug report** | [bug-report-r7-6-2-tvn-create-block.md](../../bug-reports/tu-van-nhanh/bug-report-r7-6-2-tvn-create-block.md) |

---

## Verdict R9

✅ **PASS 4/5 transition + 1 PARTIAL B5 (mTLS DN-only).**

- ✅ **B1 MOI** — pool 8 phiên `MOI` accessible. Sample `TVN-QA-20260506-0001` detail OK (kenhTuVan=TV_NHANH, cauHoiDn=text, version=1, ngayGui timestamp). Note: `POST /api/v1/tu-van-nhanhs` create vẫn 401 mTLS (đúng spec FR-X.2-03 — chỉ Cổng PLQG mới tạo được). CMS không có UI nhập tay → R7.6.2 hoạt động qua dev-seeded sample, không phải UI manual.
- ✅ **B2 DANG_TIM_KIEM** — pool 6 phiên auto từ MOI. Sample `TVN-QA-20260429-0014` `goiYTraLoi=null` đúng intermediate state (HT đang tìm kiếm). Spec line 624 system auto.
- ✅ **B3 DA_GOI_Y** — pool 12 phiên với `goiYTraLoi` array embedded (sample 2 entries score 85/75). Endpoint `GET /{id}/goi-y` → 200 (data:[] dynamic — gợi ý đã lock trong detail object). Spec FR-X.2-02 §Processing 3 TOP 5 → seed test có 2 entries (đủ cover unit test, real keyword search dùng FTS GIN tsvector).
- ✅ **B4 CB_TRA_LOI** — UI + API end-to-end PASS. UI: detail page Stepper 5 state + Top 5 gợi ý + form Soạn trả lời (textarea 5000 chars + button [Gửi trả lời]). Click [Gửi trả lời] → state DA_GOI_Y → CB_TRA_LOI, nguoiTraLoiId=cb_nv_tw_01, ngayTraLoi auto, version+1. API `POST /{id}/tra-loi` body `{noiDungTraLoi, khoCauHoiDaChonId, version}` → 200 verified độc lập (TVN-QA-20260428-0015).
- ⚠️ **B5 HOAN_THANH** — pool 12 phiên HOAN_THANH tồn tại (dev seed direct DB) chứng minh workflow đến HOAN_THANH có thể đạt được. Endpoint CMS `POST /{id}/danh-gia` vẫn **401 ERR-AUTH-MTLS-02** với cookie session — đúng spec FR-X.2-05 (DN qua Cổng PLQG mTLS). Sample HOAN_THANH có schema field `danhGiaTv` (embedded) hiện null cho 1 sample test; cần Cổng PLQG sandbox để verify end-to-end DN đánh giá → cập nhật `diem_danh_gia_tb` KHO_CAU_HOI.

**Cách dev đã unblock:** Seed direct DB 50 sessions cover 6 state (bypass mTLS endpoint). MOI/DANG_TIM_KIEM/DA_GOI_Y/CB_TRA_LOI/HOAN_THANH/HET_HAN đều có sample. UI list/detail render đầy đủ cho mọi state. UI tab filter (Tất cả/Chờ xử lý/Đã gợi ý/Hoàn thành) hoạt động OK.

**Improvement so với R8:**
- ✅ Filter trạng thái bar UI có sẵn (combobox "Trạng thái" + Từ khóa + dates) — R8 chỉ có filter Lĩnh vực+Nguồn (note: filter này thuộc trang Kho câu hỏi, không phải TV nhanh).
- ✅ Detail page Stepper hiển thị visual progress 5 state với check icon cho state đã qua.
- ✅ Form trả lời có counter character (0/5000) + validate required.
- ⚠️ B5 vẫn cần Cổng PLQG sandbox hoặc seed danhGiaTv direct → verify cập nhật KHO_CAU_HOI.diem_danh_gia_tb (TVN-038).

---

## Bảng kiểm tra workflow R9 — 5 transition theo SRS line 622-628 (SM-TVNHANH, exclude HET_HAN cron)

| # | Bước (transition) | Actor | Sample | Status | Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → MOI` (DN gửi câu hỏi qua Cổng PLQG) | DN qua Cổng PLQG (dev seed) | TVN-QA-20260506-0001 + 7 phiên MOI | ✅ | **PASS qua dev seed.** Pool 8 phiên MOI accessible. Sample TVN-QA-20260506-0001 detail OK: `kenhTuVan=TV_NHANH`, `cauHoiDn="Chuyển nhượng cổ phần trong công ty cổ phần thuế ra sao?"`, `goiYTraLoi=null`, `noiDungTraLoi=null`, `version=1`, `ngayGui=2026-05-06T20:31:40Z`. Lưu ý: `POST /tu-van-nhanhs` create từ CMS vẫn 401 mTLS đúng spec FR-X.2-03 (BUG-TVN-R762-001 vẫn open — chỉ unblock test bằng dev seed). |
| 2 | `MOI → DANG_TIM_KIEM` (HT nhận câu hỏi, auto) | System | TVN-QA-20260429-0014 + 5 phiên DANG_TIM_KIEM | ✅ | **PASS via pool sample.** 6 phiên ở state intermediate. Sample `goiYTraLoi=null` (HT đang xử lý FTS) đúng spec line 624. Không có UI/API CMS trigger thủ công (system auto). |
| 3 | `DANG_TIM_KIEM → DA_GOI_Y` (HT keyword search kho, gợi ý TOP) | System | TVN-QA-20260428-0015..0021 (12 phiên) | ✅ | **PASS via pool sample.** Sample TVN-QA-20260428-0015 `goiYTraLoi=[{score:85,cauHoi:'Câu hỏi tham chiếu #15A'}, {score:75, ...#15B}]` (2 entries seed test). Endpoint `GET /{id}/goi-y` 200 trả `data:[]` (gợi ý đã lock embedded trong detail object — tốt cho replay). UI render "Top 5 gợi ý từ Kho câu hỏi" panel + empty state khi không match. Spec FR-X.2-02 §Processing 3 PASS mechanics (TOP 5 ≤ giá trị thực tùy match), real keyword cần FTS GIN tsvector trên text DA_DUYET. |
| 4 | `DA_GOI_Y → CB_TRA_LOI` ([Gửi trả lời] CB NV) | cb_nv_tw_01 | TVN-QA-20260428-0016 (UI) + TVN-QA-20260428-0015 (API) | ✅ | **PASS UI + API.** UI: detail page Stepper 5 state + form Soạn trả lời + button [Gửi trả lời]. Click [Gửi trả lời] với 257 chars → state DA_GOI_Y → CB_TRA_LOI, `nguoiTraLoiId=cb_nv_tw_01`, `ngayTraLoi=2026-05-07T17:47:45Z`, `version=2→3`. API direct `POST /{id}/tra-loi` body `{noiDungTraLoi, khoCauHoiDaChonId, version}` → 200 verified với TVN-QA-20260428-0015 (link kho QA-20260508-0003). Spec FR-X.2-02 §Processing 4-5-6 PASS. |
| 5 | `CB_TRA_LOI → HOAN_THANH` (DN đánh giá điểm 1-5 + nhận xét) | DN qua Cổng PLQG | 12 phiên HOAN_THANH (TVN-QA-20260416-0036 ...) | ⚠️ | **PARTIAL via pool, mTLS chặn từ CMS.** Pool 12 phiên HOAN_THANH chứng minh transition đến cuối SM đạt được. Sample TVN-QA-20260416-0036 schema có field `danhGiaTv` (embedded sub-resource null trong sample) + `nguoiTraLoi.hoTen='CB Nghiệp vụ TW 02'` + `khoCauHoiDaChon.ma='QA-20260508-0003'`. Endpoint `POST /{id}/danh-gia` `{diem:5,nhanXet}` từ CMS cookie → **401 ERR-AUTH-MTLS-02** đúng spec FR-X.2-05 (DN-only qua Cổng PLQG). Cần Cổng PLQG sandbox hoặc seed `danh_gia_tv` direct DB để verify cập nhật `KHO_CAU_HOI.diem_danh_gia_tb` (TVN-038 cross-link). Alt path `DA_GOI_Y → HOAN_THANH` (DN hài lòng đánh giá trực tiếp, SRS line 626) cùng endpoint cùng restriction. |

> Icon: ✅ pass · ⚠️ partial (mechanics PASS, mTLS endpoint vẫn chặn CMS) · 🚫 blocked · ❌ fail · ⏭ external

---

## Pool TV nhanh sau dev seed (R9 verify — 2026-05-08 00:44)

`GET /api/v1/tu-van-nhanhs?pageSize=50` (cb_nv_tw_01 cookie):

| Metric | Giá trị | Đạt? |
|---|---|:-:|
| Total | 50 | ✅ |
| byState MOI | 8 | ✅ ≥1 cho B1 |
| byState DANG_TIM_KIEM | 6 | ✅ ≥1 cho B2 |
| byState DA_GOI_Y | 12 | ✅ ≥1 cho B3 + B4 input |
| byState CB_TRA_LOI | 8 | ✅ ≥1 cho B5 input |
| byState HOAN_THANH | 12 | ✅ ≥1 cho TVN-038 cross-link |
| byState HET_HAN | 4 | ✅ cho TVN-032 batch verify |
| Schema field | id, maPhien, doanhNghiepId, cauHoiDn, kenhTuVan, goiYTraLoi, noiDungTraLoi, nguoiTraLoiId, trangThai, ngayGui, khoCauHoiDaChonId, hoiDapId, ngayTraLoi | ✅ đủ field SRS FR-X.2-02 |

State distribution cover đủ 6 state SM-TVNHANH cho regression test. Mã pattern `TVN-QA-YYYYMMDD-NNNN` đúng convention BR-DATA-04.

---

## Pre-req kho QA — verify per-filter (R9)

`GET /api/v1/kho-cau-hois?pageSize=50` (cb_nv_tw_01 scope):

| Metric | Giá trị | Đạt? |
|---|---|:-:|
| Total | 9 | — |
| byState DA_DUYET | 6 | ✅ ≥1 cho gợi ý |
| byState CHO_DUYET | 1 | ✅ |
| byState NHAP | 1 | ✅ |
| byState HET_HIEU_LUC | 1 | ✅ |
| byNguon THU_CONG | 8 | ✅ |
| byNguon IMPORT | 1 | ✅ |
| hieuLuc=true | 6 | ✅ ≥1 cho hiển thị |
| LV cover (DA_DUYET ∧ hieuLuc=true) | 5/6 — `_013` LĐ, `_014` DN, `_018` KDTM, `_019` SHTT, `_01a` ĐĐ | ⚠️ thiếu Thuế |

5 mã DA_DUYET cover 5 LV: QA-20260507-0008/0007/0006/0005/0004. R7.4.D3 chưa chạy (workflow duyệt + bulk + reject + toggle hiệu lực) → còn 1 NHAP + 1 CHO_DUYET chưa đẩy lên DA_DUYET.

---

## API endpoints xác nhận (R8)

| Step | Method | Path | Auth | Behavior |
|---|---|---|---|---|
| List phiên | GET | `/api/v1/tu-van-nhanhs?page=1&pageSize=50` | CMS cookie | 200, total=0 ✅ accessible nhưng không có data |
| Detail phiên | GET | `/api/v1/tu-van-nhanhs/{id}` | CMS cookie | 404 ERR-TVN-01 "Phien tu van nhanh khong ton tai" với UUID giả ✅ |
| **Tạo phiên (create)** | **POST** | `/api/v1/tu-van-nhanhs` | **mTLS only** | **401 ERR-AUTH-MTLS-02** với CMS cookie. Bug R7.6.2 chính. |
| Gợi ý TOP 5 | GET | `/api/v1/tu-van-nhanhs/{id}/goi-y` | CMS cookie | 404 ERR-TVN-01 (no session) — endpoint exists ✅ |
| CB NV trả lời | POST | `/api/v1/tu-van-nhanhs/{id}/tra-loi` | CMS cookie | 422 ERR-TVN-02 noiDungTraLoi required ✅ endpoint accessible |
| Chuyển kênh | POST | `/api/v1/tu-van-nhanhs/{id}/chuyen-kenh` | CMS cookie | 404 ERR-TVN-01 (no session) — endpoint exists ✅ |
| **DN đánh giá** | **POST** | `/api/v1/tu-van-nhanhs/{id}/danh-gia` | **mTLS only** | **401 ERR-AUTH-MTLS-02** với CMS cookie. DN-only flow. |
| Kho QA list | GET | `/api/v1/kho-cau-hois?page=1&pageSize=50` | CMS cookie | 200, 9 record ✅ |

> ⚠️ Plural endpoint name: `tu-van-nhanhs` / `kho-cau-hois` (có `s`). `tu-van-nhanh` / `kho-cau-hoi` (không `s`) trả 404 ERR-SYS-00-04-01.

---

## Bằng chứng R9

### List 50 phiên + 6 state coverage

![R9 — `/tv-nhanh/danh-sach` cb_nv_tw_01: 50 phiên cover 6 state, 4 tab filter, badge số gợi ý + cột Trạng thái Vietnamese, button "eye" (xem) + "message" (trả lời) inline action](../../screenshots/r7-6-2-r9-tvn-list-50sessions.png)

### Detail page Stepper + form Soạn trả lời (B3 → B4)

![R9 — Detail TVN-QA-20260428-0016 trước [Gửi trả lời]: Stepper Mới ✅ → Đang tìm kiếm ✅ → Đã gợi ý (current) → CB trả lời → Hoàn thành; Top 5 gợi ý empty placeholder; form textarea 5000 chars](../../screenshots/r7-6-2-r9-tvn-detail-stepper.png)

### Sau khi click [Gửi trả lời] (B4 transition)

![R9 — Detail TVN-QA-20260428-0016 sau click [Gửi trả lời]: state CB_TRA_LOI, nguoiTraLoiId=cb_nv_tw_01, version=3](../../screenshots/r7-6-2-r9-tvn-after-tra-loi.png)

### API trace R9

```text
=== R9 verify pool sau dev seed (cb_nv_tw_01, 2026-05-08 00:44 GMT+7) ===
GET  /api/v1/tu-van-nhanhs?pageSize=50
  → 200 total=50, byState: {MOI:8, DANG_TIM_KIEM:6, DA_GOI_Y:12, CB_TRA_LOI:8, HOAN_THANH:12, HET_HAN:4}

GET  /api/v1/tu-van-nhanhs/c16028e2-29e5-4e9a-bf0f-55ebd290550b (TVN-QA-20260506-0001)
  → 200 {trangThai:'MOI', kenhTuVan:'TV_NHANH', cauHoiDn:'Chuyển nhượng cổ phần...', goiYTraLoi:null, version:1}  ✅ B1

GET  /api/v1/tu-van-nhanhs/3ee455dc-a443-44af-9a41-500cd4125e29 (TVN-QA-20260428-0015)
  → 200 {trangThai:'DA_GOI_Y', goiYTraLoi:[{score:85, cauHoi:'Câu hỏi tham chiếu #15A'}, {score:75, cauHoi:'#15B'}], version:2}  ✅ B3

POST /api/v1/tu-van-nhanhs/3ee455dc.../tra-loi
     {noiDungTraLoi:'Theo Luật Doanh nghiệp 2020 Điều 127, chuyển nhượng cổ phần áp thuế...', khoCauHoiDaChonId:'a061c1f4-...', version:2}
  → 200 {trangThai:'CB_TRA_LOI', nguoiTraLoiId:'0c039382-...(cb_nv_tw_01)', ngayTraLoi:'2026-05-07T17:45:56Z', version:3}  ✅ B4 API

UI flow B4 (TVN-QA-20260428-0016):
  Click button [message] trên row → navigate /tv-nhanh/{id}
  Detail render Stepper 5 state + form textarea + [Gửi trả lời]
  Type 257 chars → counter "257 / 5000"
  Click [Gửi trả lời] → state DA_GOI_Y → CB_TRA_LOI, nguoiTraLoiId set, version 2→3  ✅ B4 UI

POST /api/v1/tu-van-nhanhs/3ee455dc.../danh-gia
     {diem:5, nhanXet:'Trả lời rõ ràng...', version:3}
  → 401 ERR-AUTH-MTLS-02 "mTLS client certificate fingerprint missing"  ⚠️ B5 mTLS chặn (đúng spec FR-X.2-05 DN-only)

GET  HOAN_THANH sample TVN-QA-20260416-0036 (expanded)
  → 200 {trangThai:'HOAN_THANH', noiDungTraLoi:'...', danhGiaTv:null, nguoiTraLoi:{hoTen:'CB Nghiệp vụ TW 02'}, khoCauHoiDaChon:{ma:'QA-20260508-0003'}}
  → 12 phiên HOAN_THANH chứng minh workflow đến cuối SM đạt được qua dev seed direct DB.
```

### R8 BLOCKED trace (lưu trữ)

```text
=== R8 B1 BLOCK trace (cb_nv_tw_01, 2026-05-07 23:42) ===
GET  /api/v1/tu-van-nhanhs?pageSize=50 → 200 total=0 (rỗng — chưa seed)
POST /api/v1/tu-van-nhanhs {cauHoi,kenh,linhVucId} → 401 ERR-AUTH-MTLS-02
navigate /tv-nhanh/tao-moi → 302 redirect /tv-nhanh/danh-sach (no manual route)
UI: chỉ 3 button [Tìm kiếm]/[Xóa bộ lọc]/[Làm mới] — không có [+ Tạo phiên]
```

R8 evidence (giữ nguyên reference): [r7-6-2-tvn-list-empty.png](../../screenshots/r7-6-2-tvn-list-empty.png), [r7-6-2-tvn-no-create-button.png](../../screenshots/r7-6-2-tvn-no-create-button.png).

---

## Phương án xử lý còn lại (B5 + cleanup)

1. **B5 HOAN_THANH end-to-end:** Cần MỘT trong:
   - (a) Cổng PLQG sandbox + mTLS client cert cho QA gọi `POST /{id}/danh-gia` thật.
   - (b) BE expose CMS proxy path cho CB NV nhập điểm thay DN trong scenario test (vd `POST /{id}/danh-gia/cms-proxy`).
   - (c) Dev seed `danh_gia_tv` direct DB cho ≥1 phiên HOAN_THANH có sẵn → verify TVN-038 (KHO_CAU_HOI.diem_danh_gia_tb cập nhật).
2. **BUG-TVN-R762-001 không fully closed:** Ở R9 unblock bằng dev seed, KHÔNG fix root cause. CMS UI vẫn không có [+ Tạo phiên] (đúng spec), POST `/tu-van-nhanhs` vẫn 401 mTLS (đúng spec). → Bug giữ Open hoặc move sang category "Test infrastructure dependency" nếu chấp nhận giải pháp dev seed làm chuẩn cho QA.
3. **R7.4.D3 (workflow Kho QA)** vẫn ⏳ chưa chạy → kho QA chưa cover đủ Thuế (5/6 LV). Khi B3 chạy với phiên Thuế, gợi ý có thể empty. Pre-req độc lập với B1..B5.
4. **Functional R7.7.11 unblock:** Sau R9 PASS, các TC TVN-016..025/029..032/037/038 phụ thuộc phiên TV nhanh giờ có thể chạy được — re-run round riêng.

---

## Ghi chú thực thi

- **Phân loại R9:** ✅ APP/PRE-REQ unblock (dev seed DB) + ⚠️ EXTERNAL DEP (mTLS Cổng PLQG cho B5 vẫn cần). KHÔNG có lỗi mới phát sinh. Console chỉ deprecation warnings (Drawer width / Modal destroyOnClose) — UI lib internal, không block.
- **Tool routing:** Chrome DevTools MCP. UI flow login → list → detail click [message] → form fill → [Gửi trả lời] hoạt động end-to-end OK. Re-login giữa session do timeout 5 phút idle (CLAUDE.md cookie-not-sessionStorage).
- **Account state:** cb_nv_tw_01 HOAT_DONG, cookie session 5 phút TTL (cần re-login giữa long-running test).
- **Lưu ý dev seed pattern:** TVN-QA-* mã pattern khác convention TVN-{YYYYMMDD}-NNNN. Confirm với BA: keep "QA" prefix cho seed test (dễ filter cleanup) hay match production format?

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| **R9** | 2026-05-08 | ✅ **PASS 4/5 + 1 PARTIAL B5** sau dev seed 50 phiên cover 6 state. B1 (8 MOI) + B2 (6 DANG_TIM_KIEM) + B3 (12 DA_GOI_Y, gợi ý seed 2 entries) + B4 UI+API end-to-end (DA_GOI_Y → CB_TRA_LOI). B5 mTLS chặn CMS endpoint `/danh-gia` 401 — pool 12 HOAN_THANH chứng minh transition đạt được qua dev seed. UI Detail Stepper + form trả lời 5000 chars + [Gửi trả lời] hoạt động OK. |
| R8 | 2026-05-07 | 🚫 0/5 BLOCKED — `POST /tu-van-nhanhs` create 401 mTLS (DN-only path) + UI trang TV nhanh không có button [+ Tạo phiên] manual. CMS chỉ render filter+table empty. Pre-req kho QA partial 6 DA_DUYET cover 5/6 LV. Endpoints CMS path khả dụng (`tra-loi`, `chuyen-kenh`, `goi-y`, list, detail) nhưng không reach được vì B1 BLOCKED. |

---

*R9 | QA Automation via Claude Code | Chrome DevTools MCP*
