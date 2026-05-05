# Seed Checklist — Kho Q&A Tư vấn Nhanh (R6.4.D3)

**Ngày:** 2026-05-02 20:30 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Chờ duyệt` (THU_CONG) + `Tự động` (TU_DONG)
**Màn:** SCR-X.2-01 — Quản lý Kho câu hỏi/tư vấn (MH-13.1) • **Đường dẫn:** `/api/v1/kho-cau-hois` (UI hiện chưa có route)
**Dữ liệu mẫu:** ad-hoc 1 Q&A THU_CONG (BR-FLOW-10 auto-feed verify từ HD đã duyệt)
**SRS:** [FR-X.2-01 UC158 — Quản lý kho câu hỏi/tư vấn](../../../../input/srs-v3/srs-fr-13-tv-nhanh.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|---|---|---|---|---|:---:|
| FR-X.2-02 Phiên TV nhanh keyword search | `nguon IN (TU_DONG,THU_CONG,IMPORT) ∧ trang_thai=DA_DUYET ∧ linh_vuc khớp` (`srs-fr-13 line 459` "TOP 5 goi y tu KHO_CAU_HOI") | ≥1 / 6 LV | `DA_DUYET` (sau approve) | `GET /api/v1/kho-cau-hois?nguon=TU_DONG` → `data.length ≥ 1` | ⚠️ |
| BR-FLOW-10 Auto-feed từ HD | `HOI_DAP.trang_thai = DA_DUYET ∨ HOAN_THANH` → trigger BE tạo `KHO_CAU_HOI nguon=TU_DONG, hoi_dap_goc_id=HD.id` | ≥1 record TU_DONG | TU_DONG record tồn tại | `GET /api/v1/kho-cau-hois?nguon=TU_DONG` → `total ≥ 1` khi có HD HOAN_THANH | 🚫 |

**Acceptance:** ⚠️ partial — BE CRUD OK, auto-feed BE chưa trigger, UI route thiếu.

---

## Kết quả: ⚠️ MỘT PHẦN 1/2

- ✅ **Tạo Kho QA THU_CONG qua API:** PASS. Record `QA-20260502-0001` state `CHO_DUYET`. BE CRUD + permissions đầy đủ.
- 🚫 **Auto-feed TU_DONG verify:** FAIL. `HD-20260501-001` đang state `HOAN_THANH` (A4 R11 PASS final state) nhưng `GET /kho-cau-hois?nguon=TU_DONG` total=0 → BE chưa trigger BR-FLOW-10.
- ⚠️ **UI Kho QA route:** thiếu sidebar/route cho `cb_nv_tw_01`. Sidebar "Quản lý tư vấn" chỉ có 2 submenu `Tư vấn chuyên sâu` + `Tư vấn nhanh` (= phiên TV nhanh, không phải Kho).

**Bug:** không log (xem Observations).

---

## Bảng dữ liệu seed

| # | Loại | Mã / ID | Câu hỏi | LV | Nguồn | Trạng thái | Có vào kho? |
|---|------|---------|---------|----|-------|-----------|:-----------:|
| 1 | THU_CONG | QA-20260502-0001 (`5c2cf335-144f-4fd5-92f4-7e3da98cd87d`) | Hợp đồng lao động thử việc tối đa bao lâu? | Lao động | THU_CONG | CHO_DUYET | ✅ |
| — | TU_DONG (auto-feed) | — | (không có record) | — | — | — | 🚫 |

**Tổng:** 1/2 vào kho. Auto-feed gap.

**API verify:**
```text
POST /api/v1/kho-cau-hois  body: {cauHoi, cauTraLoi, linhVucId, tuKhoa[], nguon=THU_CONG}
→ HTTP 201 {success:true, data:{id, maCauHoi: "QA-20260502-0001", trangThai: "CHO_DUYET", nguon: "THU_CONG"}}

GET /api/v1/hoi-daps?page=1&pageSize=50
→ HTTP 200 total=6, states: MOI:3 / HUY:1 / DANG_XU_LY:1 / HOAN_THANH:1
   (HD-20260501-001 HOAN_THANH = A4 R11 final state)

GET /api/v1/kho-cau-hois?nguon=TU_DONG
→ HTTP 200 total=0  ← FAIL: HD HOAN_THANH không trigger auto-feed
```

---

## Observations (không log thành bug)

### OBS-D3-001 — UI route Kho QA thiếu cho cb_nv_tw_01 → **promoted BUG-KHOQA-001 Critical 2026-05-05**

Sidebar `Quản lý tư vấn` chỉ render 2 submenu: `Tư vấn chuyên sâu` (`/tv-chuyen-sau/danh-sach`) + `Tư vấn nhanh` (`/tv-nhanh/danh-sach` = quản lý phiên FR-X.2-02). Navigate trực tiếp `/tv-nhanh/kho-cau-hoi` → app redirect về `/tv-nhanh/danh-sach`. SRS spec MH-13.1 SCR-X.2-01 (FR-X.2-01) Priority `Essential` — NotebookLM query 2026-05-05 confirm KHÔNG có quy định defer FE. BE đầy đủ + JWT có 7 permissions Kho QA → gap FE đơn thuần.

→ **Đã log [BUG-KHOQA-001](../bug-reports/bug-report-flow-kho-qa.md) Critical P0** (2026-05-05) cover toàn bộ 12 thành phần SCR-X2-01 thiếu UI (toolbar 3 nút + tab phân loại + filter + bảng + modal form + modal Import + duyệt inline).

### OBS-D3-002 — Auto-feed BR-FLOW-10 chưa trigger

SRS `srs-fr-13 line 430` quote: "Q&A nguon TU_DONG: auto tu HOI_DAP da duyet, khong can duyet them". A4 R11 PASS 11/11 → HD-20260501-001 đẩy state cuối `HOAN_THANH`. Sau A4 PASS, query `GET /kho-cau-hois?nguon=TU_DONG` = total 0. BE chưa implement trigger BR-FLOW-10 (hoặc trigger fire khi HD `DA_DUYET` thay vì `HOAN_THANH` — app SM-HOIDAP có thể đã rename state). Cần BA + dev confirm:
- Trigger auto-feed fire ở state nào? `DA_DUYET` (theo SRS) hay `HOAN_THANH` (state thực tế của HD)?
- BE đã implement trigger chưa?

KHÔNG log bug vì SRS có ambiguity giữa state name spec vs app implement.

### OBS-D3-003 — Field `tuKhoa` BE expect array, SRS Inputs không spec rõ format

POST với `tuKhoa: "hợp đồng,lao động,thử việc"` (string CSV) → BE 422 `ERR-VAL-SYS-00-01 "tuKhoa must be an array"`. Retry với `tuKhoa: ["hop dong","lao dong","thu viec"]` → PASS 201. SRS line 100 không spec field `tuKhoa` rõ. Đây là BE-only decision, không vi phạm SRS.

---

## Ảnh chụp

- [Tư vấn nhanh page — không có nested tab Kho QA, chỉ 4 tab phiên Tất cả/Chờ XL/Đã gợi ý/Hoàn thành](../screenshots/r14-d3-tu-van-nhanh-no-kho-qa-tab.png)
- API evidence chi tiết ở `Bảng dữ liệu seed` block trên + re-verify R14 dưới đây.

---

## Re-verify R14 — 2026-05-02 22:48 (sau D2 test)

Re-query qua JWT bắt từ Axios interceptor, cùng tài khoản `cb_nv_tw_01`:

```text
GET /api/v1/kho-cau-hois?nguon=TU_DONG → 200, data=[]   ← VẪN 0 records (không đổi)
GET /api/v1/kho-cau-hois?nguon=THU_CONG → 200, data=[{maCauHoi:"QA-20260502-0001", nguon:"THU_CONG", trangThai:"CHO_DUYET"}]  ← THU_CONG seed cũ giữ
GET /api/v1/kho-cau-hois?page=1 → total=1 (chỉ 1 record THU_CONG)
GET /api/v1/hoi-daps?trangThai=HOAN_THANH → data=[{maHoiDap:"HD-20260501-001", trangThai:"HOAN_THANH"}]  ← HD HOAN_THANH vẫn còn
```

**Kết luận re-verify:** Status D3 KHÔNG đổi.
- 🚫 Auto-feed BR-FLOW-10 vẫn FAIL — HD HOAN_THANH không trigger tạo Kho QA TU_DONG. Cần BA + dev confirm trigger logic + state name (DA_DUYET vs HOAN_THANH).
- ⚠️ UI route Kho QA vẫn thiếu — sidebar "Quản lý tư vấn" vẫn chỉ 2 submenu (Tư vấn chuyên sâu + Tư vấn nhanh). Page `/tv-nhanh/danh-sach` chỉ có 4 tab phiên TV nhanh, không có nested Kho QA.

D3 status giữ ⚠️ partial. Không log bug mới (cùng SRS ambiguity với obs cũ). Cần escalate dev/BA confirm scope FE Kho QA (defer hay sẽ build).

---

*2026-05-02 20:30 — QA Automation via curl + Chrome DevTools MCP*
*2026-05-02 22:48 — Re-verify R14 — status không đổi, auto-feed vẫn 0 + UI route vẫn thiếu*
