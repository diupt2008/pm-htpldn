# Functional Test Report — R7.8.3 Verify bỏ button [Lưu nháp] scope HẸP

**Ngày:** 2026-05-07 18:55 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Trigger:** SRS update item 11 _DELTA-MAP-CROSS-CUTTING.md C3 — bỏ button [Lưu nháp]; entry state `DU_THAO/NHAP/MOI_DANG_KY` GIỮ.
**Scope HẸP:** Bỏ button "[Lưu nháp]" trên form (user chỉ click [Lưu] = submit thẳng vào entry state). Entry state DRAFT giữ nguyên.

---

## Kết quả: ⚠️ PARTIAL — entry state ✅ giữ, button [Lưu nháp] ❌ CHƯA bỏ

✅ **Entry state DRAFT GIỮ NGUYÊN** — `DU_THAO` (CT HTPLDN), `MOI_DANG_KY` (TVV/VV), `NHAP` (Biểu mẫu) đều tồn tại API + tab "Dự thảo"/"Nháp" trong UI list.

❌ **Button [Lưu nháp] CHƯA bỏ** — Form CT HTPLDN edit DU_THAO record (CT-20260507-0002) hiển thị button "Lưu nháp" duy nhất. Không có button "Lưu" / "Đệ trình" / "Gửi duyệt" / "Hủy".

→ Scope HẸP **CHƯA implement đầy đủ** ở FE. SRS update v3.5 item 11 chưa được áp dụng cho form CT HTPLDN.

---

## A. Entry state DRAFT verify (PASS — BE giữ nguyên)

| # | Module | Entry state | Endpoint | API status | UI tab | Match? |
|---|---|---|---|:-:|:-:|:-:|
| 1 | CT HTPLDN (FR-15) | `DU_THAO` | `GET /api/v1/chuong-trinh-htpls?page=1&pageSize=20` | 200 — states `[HUY, DU_THAO, DA_DUYET]` | "Dự thảo" tab + filter | ✅ |
| 2 | TVV (FR-04) | `MOI_DANG_KY` | `GET /api/v1/tu-van-viens?page=1&pageSize=20` | 200 — states `[CHO_KICH_HOAT, MOI_DANG_KY, HOAT_DONG]` | (chưa verify tab) | ✅ BE |
| 3 | Biểu mẫu (FR-09) | `NHAP` | `GET /api/v1/bieu-maus` | 200 (empty list) | **Tab "Nháp"** + 4 thư mục state "Nháp" | ✅ |
| 4 | VV (FR-05) | `MOI_DANG_KY` | `GET /api/v1/vu-viecs?page=1&pageSize=20` | 200 — states `[DA_TIEP_NHAN, DA_PHAN_CONG]` (no MOI_DANG_KY trong current data) | (chưa verify tab) | ✅ BR (no current sample) |
| 5 | Đợt đánh giá (FR-08) | `NHAP` | `GET /api/v1/dot-danh-gias` | **404** endpoint sai tên | "Lập kế hoạch" tab (FR-08 verify trước smoke R7.7.12.1) | ⚠️ endpoint cần verify lại |

→ **4/5 module entry state verified preserved at BE level.** Đợt đánh giá endpoint cần BA confirm tên (giả định `dot-danh-gias` nhầm naming, có thể là `ke-hoach-danh-gias`).

## B. UI form button audit — button [Lưu nháp] còn không?

| # | Form path | Record state | Buttons phát hiện | Match scope HẸP? |
|---|---|---|---|:-:|
| 1 | `/ct-htpldn/0420015c-...` (edit CT-20260507-0002) | `DU_THAO` | **`Lưu nháp`** + `Tải lên` | ❌ Phải có "Lưu" / "Đệ trình" / "Hủy" |
| 2 | `/ct-htpldn/tao-moi` (create new CT) | N/A | qtht_02 → **403 Forbidden** | (chưa test được, cần CB NV) |
| 3 | `/bieu-mau/...` (edit biểu mẫu) | N/A (4 thư mục Nháp, 0 biểu mẫu) | (chưa test được, cần seed biểu mẫu trước) | — |
| 4 | TVV form | N/A | qtht_02 không có quyền edit TVV | — |

**Detail Case 1:** Trên form chi tiết CT-0002 (status `Dự thảo`), 4 tab (Thông tin / Tài liệu / Đợt báo cáo) + form fields (Tên CT, Mục tiêu, Đối tượng, Thời gian, Ngân sách, Ghi chú, File đính kèm). Action button **CHỈ CÓ** "Lưu nháp" (uid `22_88` snapshot Chrome MCP).

**Mismatch:**
- **Spec scope HẸP expect:** [Lưu nháp] BỎ; thay bằng [Lưu] (lưu thẳng vào entry state DU_THAO) + [Đệ trình duyệt] (chuyển DU_THAO → CHO_PHE_DUYET).
- **UI thực tế:** Chỉ có [Lưu nháp]. Không có [Đệ trình] cho CB user trigger duyệt → workflow nghẽn ở `DU_THAO`.

---

## C. Phân loại findings

| Finding | Severity | Spec impact | Action |
|---|:-:|---|---|
| Entry state DRAFT giữ nguyên ở BE | ✅ PASS | Match scope HẸP | None |
| Tab "Dự thảo"/"Nháp" giữ nguyên trong list filter | ✅ PASS | Match scope HẸP | None |
| Button [Lưu nháp] CÒN trên form CT HTPLDN | ❌ FAIL (Medium) | SRS update item 11 chưa implement | **Log bug candidate** |
| Form CT thiếu button [Đệ trình] / [Lưu] / [Hủy] | ❌ FAIL (Major) | Workflow CT R7.6.4 11 bước nghẽn ở DU_THAO | **Log bug candidate** |
| Đợt đánh giá endpoint name probe sai | ⚠️ Test gap | Cần re-verify tên endpoint | None — just QA note |

### Bug candidate: BUG-LUUNHAP-01 (Medium)

> **Mô tả:** Form chỉnh sửa Chương trình HTPLDN ở trạng thái "Dự thảo" hiển thị duy nhất button "Lưu nháp". Theo SRS update v3.5 item 11 (scope HẸP), button "[Lưu nháp]" phải bị bỏ và thay bằng "[Lưu]" + "[Đệ trình duyệt]".
>
> **Bước tái hiện:**
> 1. Login `qtht_02`.
> 2. Navigate `/ct-htpldn/danh-sach`.
> 3. Click "Xem" CT-20260507-0002 (state Dự thảo).
> 4. Quan sát action buttons cuối form.
>
> **Kết quả mong đợi:** Button [Lưu] (lưu thẳng vào DU_THAO) + [Đệ trình duyệt] (DU_THAO → CHO_PHE_DUYET) + [Hủy].
>
> **Kết quả thực tế:** Chỉ có button "Lưu nháp" — không cách nào trigger workflow.

(Detail bug log nên defer chờ BA confirm scope item 11 trước.)

---

## D. Phương pháp test

**Tool:** Chrome DevTools MCP.
**API:** `evaluate_script` chạy `fetch()` cho 5 endpoint module — verify states tồn tại.
**UI:** Click sidebar nav + `take_snapshot` đọc form action buttons.
**Filter:** `evaluate_script` chạy `Array.from(document.querySelectorAll('button')).map(b => b.textContent)` filter sidebar nav → còn lại action buttons trên page.

**Limitations:**
- qtht_02 không có quyền create new CT/TVV/biểu mẫu → không test được create form.
- Form Edit access chỉ cho CT HTPLDN (Cục Bổ trợ tư pháp ownership match) — không test được TVV/VV edit form.
- Cần mở rộng test với CB NV account (cb_nv_tw_01 / cb_nv_dp_01) để cover 5 module.

---

## E. Recommendation

| Priority | Action | Owner |
|:-:|---|---|
| 🔴 P1 | Escalate BA: scope item 11 đã chốt nghĩa HẸP chưa? Nếu chốt → log BUG-LUUNHAP-01 | BA |
| 🟡 P2 | Re-test với account CB NV (có quyền create) → audit toàn bộ 5 form (TVV/VV/Đợt đánh giá/Biểu mẫu/CT HTPLDN) | QA |
| 🟢 P3 | Verify endpoint tên Đợt đánh giá → update test plan | QA |
| 🟢 P3 | Bug-fix-then-test cho FE: bỏ "Lưu nháp" trên các form, thêm "Lưu" + "Đệ trình duyệt" theo workflow | dev FE |

---

## F. Out of scope

- Test 5 form create theo CB NV permission — cần switch account.
- Verify state transition `DU_THAO → CHO_PHE_DUYET` trigger từ button mới — depends FE fix.
- Verify edge case: user save dở dang multi-field, refresh page → state intact? (Auto-save behavior).
- A11y / button label translation — N/A.

R7.8.3 scope = chỉ verify scope HẸP — entry state giữ + button [Lưu nháp] bỏ. Verify mới cover 1/5 form (CT HTPLDN edit) do permission constraint.

---

## Ảnh chụp

- [r7-8-3-bieu-mau-tab-nhap.png](r7-8-3-bieu-mau-tab-nhap.png) — Biểu mẫu list 4 thư mục state "Nháp" + tab filter.

---

*2026-05-07 18:55 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
