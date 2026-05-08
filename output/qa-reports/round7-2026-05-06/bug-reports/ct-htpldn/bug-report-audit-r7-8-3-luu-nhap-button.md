# Bug Report — R7.8.3 Button [Lưu nháp] CHƯA bỏ trên form CT HTPLDN

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM Hỗ trợ Pháp lý Doanh nghiệp |
| **Môi trường** | http://103.172.236.130:3000 |
| **Người test** | QA huongttt via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 2026-05-07 |
| **Loại test** | Cross-cutting / UI |
| **Round** | Round 7 — R7.8.3 |
| **Tài liệu tham chiếu** | [_DELTA-MAP-CROSS-CUTTING.md C3 line 88-122](../../../../../input/srs-update-2026-5-5/_DELTA-MAP-CROSS-CUTTING.md) |

---

## Tổng hợp

Phát hiện **1 bug Major** + **1 bug Medium** liên quan FE chưa implement scope HẸP "Bỏ button [Lưu nháp]" theo SRS update item 11.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 0        | 1     | 1      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|---|---|---|---|---|---|---|---|
| ~~BUG-LUUNHAP-01~~ | **Major** | P1 | Workflow | R7.8.3-TC02 | `_DELTA-MAP-CROSS-CUTTING.md C3 line 107` (scope HẸP — bỏ button [Lưu nháp]) | Form chỉnh sửa CT HTPLDN trạng thái Dự thảo CHƯA bỏ button [Lưu nháp] + thiếu [Đệ trình duyệt] → workflow CT R7.6.4 nghẽn ở DU_THAO | Closed (R8) |
| ~~BUG-LUUNHAP-02~~ | Medium | P2 | UI/UX | R7.8.3-TC02 | `_DELTA-MAP-CROSS-CUTTING.md C3 line 107-108` | Form CT HTPLDN edit chỉ có button "Lưu nháp" duy nhất, không có [Hủy] / [Quay lại] → user không thoát form được mà không save | Closed (R8) |

---

## ~~BUG-LUUNHAP-01~~ — Form CT HTPLDN trạng thái "Dự thảo" còn button [Lưu nháp], thiếu [Đệ trình duyệt] [CLOSED]

> **Re-test 2026-05-08 R8:** ✅ **CLOSED**. Account `cb_nv_tw_02`. Form chỉnh sửa CT-20260507-0002 (DU_THAO) action-bar có 4 button: [Quay lại] + [Lưu] + [Đệ trình duyệt] + [Hủy CT]. Button "Lưu nháp" cũ đã bỏ, thay [Lưu]. [Đệ trình duyệt] đã có để chuyển DU_THAO → CHO_PHE_DUYET. Evidence: `screenshots/r8-verify-2026-05-08-luunhap-01-fixed.png`. BUG-LUUNHAP-02 cũng đóng cùng (có [Quay lại]).

### Mô tả

Theo SRS update item 11 _DELTA-MAP-CROSS-CUTTING.md C3 (scope HẸP, line 107), button "[Lưu nháp]" phải bị bỏ và thay bằng "[Lưu]" (lưu thẳng vào entry state DU_THAO) + "[Đệ trình duyệt]" (chuyển DU_THAO → CHO_PHE_DUYET). FE thực tế vẫn giữ nguyên button "Lưu nháp" và KHÔNG có button "Đệ trình duyệt" → user CB NV không có cách nào trigger workflow chuyển CT từ Dự thảo sang Chờ phê duyệt qua UI.

### Các bước tái hiện

1. Login `qtht_02`.
2. Navigate `/ct-htpldn/danh-sach`.
3. Click "Xem" trên CT-20260507-0002 (trạng thái "Dự thảo").
4. Quan sát các button action ở cuối form (sau các field Tên CT / Mục tiêu / Đối tượng / Thời gian / Ngân sách / File đính kèm).
5. Mở DevTools console chạy `Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim()).filter(t => /Lưu|Đệ trình|Hủy|Submit/i.test(t))` để liệt kê action buttons.

### Kết quả mong đợi

Form Edit CT HTPLDN trạng thái "Dự thảo" hiển thị:
- Button **[Lưu]** — lưu thay đổi vào DU_THAO (state giữ nguyên).
- Button **[Đệ trình duyệt]** — chuyển CT từ DU_THAO sang CHO_PHE_DUYET (cho CB PD review).
- Button **[Hủy]** hoặc **[Quay lại]** — hủy thay đổi không-save.
- KHÔNG có button [Lưu nháp].

### Kết quả thực tế

Form chỉ có **1 button duy nhất**: "Lưu nháp" (uid `22_88` trong Chrome DevTools snapshot).

```js
// DevTools query
['Lưu nháp']
```

Hệ quả workflow R7.6.4 (CT HTPLDN GĐ1 11 bước):
- B1 CB NV tạo CT → state `DU_THAO` (qua API hoặc UI).
- B2 CB NV [Đệ trình duyệt] → state chuyển `CHO_PHE_DUYET`. **❌ KHÔNG TRIGGER ĐƯỢC từ UI** — không có button.
- B3 CB PD review + duyệt/từ chối → state `DA_DUYET` hoặc về `DU_THAO`. (Block do B2 chưa trigger được).

→ R7.6.4 workflow CT HTPLDN có thể FAIL do thiếu UI để trigger transition. Cần verify lại với CB NV account (qtht_02 chỉ Edit được vì không có quyền create form).

### Bằng chứng

- Full report: [functional-test-report-r7-8-3-luu-nhap-scope-hep.md](../../functional/cross-cutting/functional-test-report-r7-8-3-luu-nhap-scope-hep.md) §B UI form button audit.
- DevTools snapshot URL: `/ct-htpldn/0420015c-2f63-433b-8ab7-644fde4d2632` (CT-20260507-0002 trạng thái Dự thảo).
- Form fields: Tên CT (textbox required) / Lĩnh vực pháp luật (combobox) / Mục tiêu (textarea required) / Đối tượng thụ hưởng (textarea required) / Thời gian bắt đầu (date required) / Thời gian kết thúc (date) / Ngân sách (number) / Ghi chú (textarea) / File đính kèm (upload).
- Action buttons visible: chỉ "Lưu nháp".

---

## BUG-LUUNHAP-02 — Form CT HTPLDN thiếu button [Hủy] / [Quay lại]

### Mô tả

Cùng form Edit CT HTPLDN trạng thái "Dự thảo", ngoài thiếu [Lưu] / [Đệ trình duyệt] (BUG-LUUNHAP-01), form còn thiếu button [Hủy] hoặc [Quay lại danh sách]. User mở edit form, sửa dở dang, không có cách thoát mà không save → buộc phải click [Lưu nháp] (commit thay đổi không mong muốn) hoặc click breadcrumb "CT HTPLDN" / browser back (FE không cảnh báo unsaved changes).

### Các bước tái hiện

1. Login `qtht_02`.
2. Navigate `/ct-htpldn/0420015c-2f63-433b-8ab7-644fde4d2632`.
3. Sửa field "Tên chương trình" thành text khác.
4. Tìm button [Hủy] / [Quay lại] / [Cancel].

### Kết quả mong đợi

Form có button [Hủy] (gần button [Lưu]) — click → discard changes + back về list, prompt confirm nếu có unsaved changes.

### Kết quả thực tế

Không có button [Hủy] / [Quay lại]. Cách thoát duy nhất: click breadcrumb hoặc browser back — KHÔNG có warning unsaved changes (verify bằng cách thay đổi field, click breadcrumb → page navigate ngay không hỏi).

### Bằng chứng

- DevTools query: `Array.from(document.querySelectorAll('button')).map(b => b.textContent.trim())` → không có "Hủy" / "Cancel" / "Quay lại" trong danh sách action buttons.
- Behavior verify: thay đổi tên → click breadcrumb "CT HTPLDN" → navigate không prompt.

---

*2026-05-07 — QA huongttt via Chrome DevTools MCP. Reference: SRS update 2026-05-05 _DELTA-MAP-CROSS-CUTTING.md C3.*
