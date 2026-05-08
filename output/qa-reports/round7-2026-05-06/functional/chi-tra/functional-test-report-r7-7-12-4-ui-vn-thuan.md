# Functional Test Report — R7.7.12.4 UI tiếng Việt thuần SCR-V.II-01/02

**Ngày:** 2026-05-07 18:15 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Spec ref:** [funtion/7.6-chi-tra-chi-phi.md](../../../../funtion/7.6-chi-tra-chi-phi.md) — yêu cầu UI tiếng Việt thuần, không leak enum code / English / null / undefined / raw JSON.
**Scope:** SCR-V.II-01 (list HSCT) + SCR-V.II-02 (detail HSCT).

---

## Kết quả: ✅ PASS 2/2

Cả 2 màn (list + detail) Vietnamese-only, **0 enum code, 0 English UI leak, 0 null/undefined, 0 raw JSON**. Status badge dịch sang tiếng Việt đầy đủ; số tiền format `₫`; status code BE (`CHO_TIEP_NHAN`) không lộ ra UI.

---

## Bảng kết quả

| # | Màn | URL | Lines text | enumCode | English | null/undef | rawJSON | httpStatus | Match? |
|---|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 1 | SCR-V.II-01 List HSCT | `/chi-tra/danh-sach` | 127 | 0 | 0 | 0 | 0 | 0 | ✅ |
| 2 | SCR-V.II-02 Detail HSCT000076 | `/chi-tra/f0000000-...076` | 53 | 0 | 0 | 0 | 0 | 0 | ✅ |

---

## Chi tiết kiểm tra

### SCR-V.II-01 — List view
**Status badge dịch:**
| Code BE | UI Vietnamese |
|---|---|
| `CHO_TIEP_NHAN` | "Chờ tiếp nhận" |
| `DANG_THAM_DINH` | "Đang thẩm định" |
| `DANG_DANH_GIA` | "Đang đánh giá" |
| `CHO_PHE_DUYET` | "Chờ phê duyệt" |
| `DA_THANH_TOAN` | "Đã thanh toán" |
| `YEU_CAU_BO_SUNG` | "Yêu cầu bổ sung" |
| `TU_CHOI_THANH_TOAN` | "Từ chối TT" |

**Tab filter (5):** Tất cả / Chờ xử lý / Đang đánh giá / Chờ phê duyệt / Đã xử lý — tiếng Việt.
**Column header (10):** Mã HS / Tên DN / Quy mô DN / Số tiền đề nghị / Số tiền được duyệt / Mức HT % / Trạng thái / SLA / Ngày nộp / Hành động — tiếng Việt.
**Số tiền format:** `200.000.000` (no `₫` ở list, có `₫` ở detail — consistent locale `vi-VN`).
**Empty value:** dùng `—` thay null/undefined → không leak.
**Pagination:** "1-20 / 78 mục" + "20 / trang" — tiếng Việt thuần.
**SLA text:** "Còn 6 ngày LV" / "Quá hạn 39 ngày LV" — tiếng Việt + đơn vị "LV" (làm việc) chuẩn nội bộ.

### SCR-V.II-02 — Detail view
**Breadcrumb:** Trang chủ / Chi trả chi phí / Chi tiết #HSCT000076 — tiếng Việt.
**Stepper status (7 step):** Tiếp nhận / Kiểm tra / Đánh giá / Thẩm định / Phê duyệt / Thanh toán + status hiện tại "Chờ tiếp nhận".
**Section heading:** "Thông tin Doanh nghiệp" / "Thông tin Tư vấn viên" / "Lịch sử xử lý" — tiếng Việt.
**Field labels:** Mã HS / Tên DN / Quy mô DN / Mã số thuế / Số tiền đề nghị / Phí tư vấn / Số tiền được duyệt / Họ tên TVV / Mã TVV / Mã vụ việc / Tiêu đề vụ việc — tiếng Việt.
**Số tiền format:** `200.000.000 ₫` (with currency symbol).
**Empty TVV/VV:** dùng `—` (HSCT chưa được tiếp nhận → chưa gán TVV).
**Empty history:** "Chưa có lịch sử xử lý" — tiếng Việt thuần.
**Button:** "Quay lại danh sách" — tiếng Việt.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP `evaluate_script` chạy regex scan toàn bộ `document.body.innerText`.

**Pattern check (5 nhóm):**
```js
{
  enumCode: /CHO_TIEP_NHAN|DANG_KIEM_TRA|CHO_PHE_DUYET|DA_DUYET|DA_THANH_TOAN|TU_CHOI|HUY|YEU_CAU_BO_SUNG|DANG_THAM_DINH|DANG_DANH_GIA|TU_CHOI_THANH_TOAN|TAT_CA/,
  english: /Pending|Approved|Rejected|Cancel|Submit|Save|Edit|Delete|Loading|Error|Success|Status|Total|Page|Next|Previous|Search|Filter|Reset|Apply|Confirm|Update|Create|Remove|View|Detail|List/,
  nullUndef: /null|undefined|NaN|\[object Object\]/,
  httpStatus: /(40[0-9]|50[0-9]) (Bad Request|Unauthorized|...)/,
  rawJson: /^[{[].*[}\]]$/
}
```
Result: 0 match cả 5 pattern × 2 màn.

**Ngoại lệ chấp nhận** (không tính leak):
- Logo "Q0" / counter "12" số liệu KPI — không phải text UI cần dịch.
- Tên tiếng Anh thương hiệu trong test data ("VU1", "SN1", "BTC") — đặt tên fixture, không phải UI copy.

---

## Ảnh chụp

- [r7-7-12-4-scr-v-ii-02-detail-vn.png](r7-7-12-4-scr-v-ii-02-detail-vn.png) — SCR-V.II-02 detail HSCT000076 với stepper + section info + Vietnamese text.

(SCR-V.II-01 list screenshot dùng từ R7.E3 verify checklist: [r7-e3-chi-tra-78-records.png](../../seed/r7-e3-chi-tra-78-records.png))

---

## Out of scope

- SCR-V.II-03 (workflow phê duyệt step) — cần test riêng khi run R7.7.12 functional.
- SCR-V.II-04+ (đính kèm file, comment, audit log) — chưa nằm trong R7.7.12.4.
- A11y / contrast ratio — thuộc R7.X.X audit accessibility.
- Mobile responsive — thuộc R7.X.X smoke responsive.

R7.7.12.4 scope = chỉ verify text content tiếng Việt thuần ở 2 màn chính SCR-V.II-01/02.

---

*2026-05-07 18:15 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
