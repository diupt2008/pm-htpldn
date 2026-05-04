# Verification BUG-002 — Đối chiếu báo cáo BA với SRS thực tế

**Ngày:** 2026-04-27
**Phản hồi báo cáo:** `docs/bug-report/bug-002-response-sm02-scope.md`
**Nguồn đối chiếu:**
- SRS local: `input/srs/srs-v3.md`, `input/srs/srs-fr-04-chuyen-gia-tvv.md`
- NotebookLM: `only-srs-v3` (notebook id `4445d3ff-0561-4a4b-914d-8863b2b0e291`)
- Code thực tế: `source_code/packages/api/src/modules/chuyen-gia-tvv/`, `source_code/packages/web/src/pages/chuyen-gia-tvv/`

---

## ⬛ KẾT LUẬN (đọc trước)

> **Báo cáo BA chứa nhiều fabrication (chế trích dẫn không tồn tại trong SRS).** Verdict "Dev SAI — vượt scope SM-02" KHÔNG đứng vững khi đối chiếu với SRS thật. Code dev đang follow đúng FR-IV-06 + SCR-IV-03 (spec operational). Chỉ tồn tại 1 bug hợp lệ ở mức Medium: thiếu audit fields `ngay_tiep_nhan` / `nguoi_tiep_nhan` per §3.2.0.8.

| Hạng mục | BA verdict | Verdict đúng |
|----------|------------|--------------|
| Auto-skip `MOI_DANG_KY → DANG_THAM_DINH` | ✗ Dev SAI, vượt scope SM-02 | ✓ **Dev ĐÚNG** theo FR-IV-06 + SCR-IV-03 |
| Cần nút "Tiếp nhận hồ sơ" riêng | Bắt buộc theo SCR-IV-03 row 5 | ✗ **Không có** button này trong bất kỳ SCR nào của SRS |
| `FR-IV-13` / UC "Tiếp nhận hồ sơ TVV" | Coi như tồn tại | ✗ **Không tồn tại** — NotebookLM + grep file xác nhận |
| Action transition trong C.3 (audit + notification) | Theo Phụ lục C.3 | ✗ Action thực tế = "—" (rỗng) |
| BR-AUTH-08 gắn với transition này | Bắt buộc | ✗ BR Ref thực tế = "—" |
| `ngay_tiep_nhan` / `nguoi_tiep_nhan` | Bắt buộc theo §3.2.0.8 | ✓ **Đúng** — và đây là bug thật duy nhất (Medium) |
| Severity | Major (giữ) | **Medium** (audit gap, không phải workflow break) |

---

## 1. Bảng đối chiếu từng bằng chứng BA

### Bằng chứng 1 — Cell "Hiện tại" SM-02 chỉ chứa 1 transition

**BA cite:** `srs-v3.md:850`
**Thực tế:** `srs-v3.md:748`

```
| SM-02 | SM-TVV | `CHO_THAM_DINH` → `DANG_THAM_DINH` | Gộp thành **`DANG_THAM_DINH`** | Bước "bắt đầu thẩm định" không có hành động thực tế |
```

✅ **Đúng** — cột "Hiện tại" chỉ ghi 1 transition. Nhưng line number BA cite lệch ~100 dòng.

### Bằng chứng 2 — Lý do gộp không áp được cho transition Tiếp nhận

**BA cite:** transition `MOI_DANG_KY → CHO_THAM_DINH` có hành động:
- Trigger: CB NV nhấn "Tiếp nhận"
- Guard: hồ sơ đủ giấy tờ + CB NV cùng đơn vị (BR-AUTH-08)
- Action: ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan`, gửi thông báo NHT
- FR Ref: FR-IV-13

**Thực tế (`srs-v3.md:4229` + `srs-fr-04-chuyen-gia-tvv.md:1215`, NotebookLM xác nhận):**

```
| MOI_DANG_KY | CHO_THAM_DINH | CB NV tiếp nhận | Hồ sơ đủ giấy tờ | — | FR-IV-06 | — |
```

❌ **BA chế:**
- Guard "CB NV cùng đơn vị" → KHÔNG có (chỉ "Hồ sơ đủ giấy tờ")
- Action "ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan`, thông báo NHT" → KHÔNG có (Action = "—")
- FR Ref `FR-IV-13` → SAI (Actual = `FR-IV-06`)
- BR Ref `BR-AUTH-08` → KHÔNG có (BR Ref = "—")

### Bằng chứng 3 — Phụ lục C.3 vẫn giữ transition

**BA cite:** `srs-v3.md:4891` (mermaid), `srs-v3.md:4912` (transition table)
**Thực tế:** `srs-v3.md:4209-4210` (mermaid), `srs-v3.md:4229-4230` (table)

✅ Phụ lục C.3 thực sự còn 2 transition tách biệt. Nhưng line numbers BA cite lệch ~280 dòng. Và Action/BR Ref khác hoàn toàn so với BA quote (xem Bằng chứng 2).

### Bằng chứng 4 — SCR-IV-03 row 5 yêu cầu nút "Tiếp nhận hồ sơ"

**BA quote nguyên văn (`srs-fr-04-chuyen-gia-tvv.md:1274`):**

```
| 5 | header | Nút Tiếp nhận hồ sơ | button (primary) | "Tiếp nhận hồ sơ" → C12 confirm
→ FR-IV-13 TIEP_NHAN → SET CHO_THAM_DINH, ghi ngay_tiep_nhan, nguoi_tiep_nhan.
Gửi thông báo Người hỗ trợ
| Điều kiện: role = Cán bộ Nghiệp vụ AND user.don_vi_id = tvv.don_vi_id (BR-AUTH-08)
            AND trang_thai = MOI_DANG_KY |
```

**Thực tế (`srs-fr-04-chuyen-gia-tvv.md:896`, NotebookLM xác nhận):**

```
| 5 | header | Nut Cap nhat TT (gop MH-04.7) | button (secondary) | "Cap nhat trang thai" → modal: chon TT moi (Tam dung/Khoi phuc/Vo hieu hoa) + ly do (bat buoc, min 10 ky tu). Validate: vo hieu hoa chi khi khong co VV dang XL (ERR-TVV-VH-01 kiem tra ca VU_VIEC va HOI_DAP). Khi vo hieu hoa → auto go Cong PLQG | click → mo modal | Chi CB NV |
```

❌ **Fabrication hoàn toàn.** Row 5 thực tế là **"Nút Cập nhật trạng thái"** (post-approval: Tạm dừng/Khôi phục/Vô hiệu hóa) — KHÔNG phải "Nút Tiếp nhận hồ sơ".

NotebookLM trả lời nguyên văn: *"KHÔNG có nút 'Tiếp nhận hồ sơ' nào được thiết kế trong header của màn hình SCR-IV-03"*.

8 buttons trong header SCR-IV-03 (rows 1-8): Breadcrumb, Quay lại, Header info, Sửa, Cập nhật TT, Phê duyệt, Từ chối, Công khai. KHÔNG có "Tiếp nhận".

### Bằng chứng 5 — §3.2.0.7.1 không có entry AT cho SM-TVV

**BA cite:** `srs-v3.md:812-818`
**Thực tế:** `srs-v3.md:706-716`

✅ **Đúng phần fact** — không có AT-* nào cho SM-TVV trong §3.2.0.7.1.

❌ **Sai phần kết luận** — BA bỏ qua FR-IV-06 + SCR-IV-03 (spec operational authoritative):

| Source | Nội dung trích nguyên văn |
|--------|---------------------------|
| **FR-IV-06 Preconditions** (`srs-fr-04:421`) | "TVV ở trạng thái **MOI_DANG_KY hoặc DANG_THAM_DINH**." |
| **FR-IV-06 Processing Bước 1** (`srs-fr-04:438`) | "Chuyển trạng thái TVV sang **DANG_THAM_DINH (nếu chưa)** \| SM-TVV" |
| **SCR-IV-03 Quy tắc tương tác** (`srs-fr-04:921`) | "Tham dinh: **MOI_DANG_KY → DANG_THAM_DINH (lan dau)**." |

→ Spec operational ghi rõ auto-transition từ MOI_DANG_KY khi CB NV mở form thẩm định lần đầu. Đây là spec dev follow.

### Bằng chứng 6 — Common Approval Fields §3.2.0.8

**BA cite:** `srs-v3.md:869-870`
**Thực tế:** `srs-v3.md:767-768`

✅ **Đúng requirement** — `ngay_tiep_nhan` / `nguoi_tiep_nhan` là field bắt buộc, áp dụng cho TU_VAN_VIEN (line 761).

⚠️ **Nhưng KHÔNG kết luận được "phải có nút Tiếp nhận riêng".** Auto-fill có thể trigger khi CB NV bắt đầu thẩm định (= bước "tiếp nhận xử lý" trong nghiệp vụ). Đây mới là bug hợp lệ duy nhất: dev hiện chưa ghi 2 field này khi auto-transition.

### Bằng chứng bổ sung — Nguyên tắc Đợt 7

**BA cite:** `srs-v3.md:806`
**Thực tế:** `srs-v3.md:704`

```
KHÔNG xóa UC nào. Chỉ giảm bước thao tác thủ công và field bắt buộc. UC vẫn tồn tại đầy đủ.
```

❌ **Lập luận BA vô nghĩa** — UC "Tiếp nhận hồ sơ TVV" KHÔNG TỒN TẠI:

NotebookLM xác nhận nguyên văn: *"Hệ thống KHÔNG CÓ Use Case nào mang tên chính thức là 'Tiếp nhận hồ sơ TVV'. Hành động 'CB NV tiếp nhận' chỉ là một bước (trigger) trong vòng đời máy trạng thái SM-TVV, và thao tác này được gộp chung vào phạm vi của FR-IV-06 (UC44 - Thẩm định hồ sơ TVV)"*.

UC44 = "Thẩm định hồ sơ TVV" = FR-IV-06 — vẫn còn nguyên trong implementation hiện tại. Không có UC nào bị "xóa".

---

## 2. Tóm tắt fabrication trong báo cáo BA

| Item BA chế | Thực tế trong SRS |
|-------------|-------------------|
| `FR-IV-13` | Không tồn tại. Nhóm IV chỉ có FR-IV-01 → FR-IV-12 + FR-IV-CROSS-01 (NotebookLM + grep file xác nhận) |
| UC "Tiếp nhận hồ sơ TVV" | Không tồn tại. UC44 = "Thẩm định hồ sơ TVV" = FR-IV-06 |
| Row 5 SCR-IV-03 = "Nút Tiếp nhận hồ sơ" | Sai. Row 5 thực tế = "Nút Cập nhật trạng thái" (post-approval) |
| Action C.3 row `MOI_DANG_KY → CHO_THAM_DINH` = "Ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan`, thông báo NHT" | Sai. Action thực tế = "—" (rỗng) |
| BR-AUTH-08 gắn cho transition này | Sai. BR Ref thực tế = "—" (rỗng) |
| Guard "CB NV cùng đơn vị" cho transition | Sai. Guard thực tế = "Hồ sơ đủ giấy tờ" |
| Line numbers `srs-v3.md:850, 851, 806, 812-818, 869-870, 4891, 4912` | Tất cả lệch 60-280 dòng so với file thật. Có thể BA đọc bản SRS khác hoặc fabricate |

---

## 3. Spec operational thực tế cho luồng Tiếp nhận → Thẩm định TVV

| Source | Spec |
|--------|------|
| **§3.2.0.7.5 SM-02** (`srs-v3.md:748`) | Chỉ nhắc gộp pair `CHO_THAM_DINH → DANG_THAM_DINH`. Không nói gì về `MOI_DANG_KY` |
| **Phụ lục C.3 transition table** (`srs-v3.md:4229-4230`) | Liệt kê 2 transition tách biệt, cùng FR Ref `FR-IV-06`, Action rỗng |
| **FR-IV-06 Preconditions** (`srs-fr-04:421`) | "TVV ở trạng thái MOI_DANG_KY HOẶC DANG_THAM_DINH" |
| **FR-IV-06 Processing Bước 1** (`srs-fr-04:438`) | "Chuyển trạng thái TVV sang DANG_THAM_DINH (nếu chưa)" |
| **SCR-IV-03 Quy tắc tương tác** (`srs-fr-04:921`) | "Tham dinh: MOI_DANG_KY → DANG_THAM_DINH (lan dau)" |
| **SCR-IV-03 Header buttons** (`srs-fr-04:892-899`) | 8 buttons. KHÔNG có "Tiếp nhận hồ sơ" |
| **§3.2.0.8 Common Approval Fields** (`srs-v3.md:761-768`) | Yêu cầu `ngay_tiep_nhan` / `nguoi_tiep_nhan` bắt buộc cho TU_VAN_VIEN |

**Kết luận spec:** SRS có 1 nhập nhằng giữa Phụ lục C.3 (mô tả 2 transition tách biệt với Action rỗng) và FR-IV-06 + SCR-IV-03 (mô tả auto-skip explicit). Vì FR + SCR là spec **operational** dev phải implement, dev đã làm đúng.

---

## 4. Hiện trạng code thực tế

| Khía cạnh | Code | Match SRS thật? |
|-----------|------|-----------------|
| Auto-transition `MOI_DANG_KY → DANG_THAM_DINH` khi CB NV mở form thẩm định | `tu-van-vien.service.ts:803-806` (`if (tvv.trangThai === 'MOI_DANG_KY' \|\| tvv.trangThai === 'CHO_THAM_DINH') { tvv.trangThai = 'DANG_THAM_DINH'; }`) | ✓ Đúng FR-IV-06 + SCR-IV-03 |
| Constants 2 transition tách biệt | `packages/shared/src/constants/transitions/tu-van-vien.transitions.ts:14-15` | ✓ Đúng Phụ lục C.3 |
| Không có button "Tiếp nhận hồ sơ" trong UI | `web/src/pages/chuyen-gia-tvv/chi-tiet/index.tsx:244-247` | ✓ Đúng SCR-IV-03 (không có button này trong spec) |
| **Không có cột `ngay_tiep_nhan` / `nguoi_tiep_nhan`** | `entities/tu-van-vien.entity.ts` | ❌ **Vi phạm §3.2.0.8** — BUG THẬT (Medium) |
| Không gửi notification NHT khi auto-transition | `tu-van-vien.service.ts:980-1016` | ⚠️ Spec không bắt buộc (Action C.3 rỗng), nhưng UX có thể cải thiện |

---

## 5. Verdict revised

| Hạng mục | BA verdict | Verdict đúng | Cơ sở |
|----------|------------|--------------|-------|
| Phạm vi SM-02 | "Chỉ 1 pair" → bắt dev khôi phục transition manual | ⚠️ Spec mâu thuẫn nội bộ; FR-IV-06 + SCR-IV-03 (operational) cho phép auto từ `MOI_DANG_KY` | NotebookLM + Read |
| Transition `MOI_DANG_KY → CHO_THAM_DINH` thủ công qua FR-IV-13 | ✗ Bắt buộc | ✗ FR-IV-13 không tồn tại; transition manual có thể bỏ qua theo FR-IV-06 | Grep + NotebookLM |
| Cơ chế dev (auto-transition) | ✗ Sai cơ chế | ✓ Đúng cơ chế per FR-IV-06 + SCR-IV-03 | Read FR-IV-06 |
| Field `ngay_tiep_nhan` / `nguoi_tiep_nhan` bắt buộc auto-fill | ✓ Đúng | ✓ Đúng — và đây là bug thật duy nhất | §3.2.0.8 |
| UC "Tiếp nhận hồ sơ TVV" phải còn nguyên | ✗ Bắt buộc | ✗ UC này không tồn tại | NotebookLM xác nhận |
| Severity | Major (giữ) | **Medium** | Chỉ thiếu audit fields, không workflow break |

---

## 6. Hành động fix khuyến nghị

| # | Hành động | Tham chiếu SRS | Vị trí code |
|---|-----------|----------------|-------------|
| 1 | **Migration:** thêm cột `ngay_tiep_nhan` (datetime, nullable cho hồ sơ cũ), `nguoi_tiep_nhan` (FK → TAI_KHOAN, nullable) vào bảng `tu_van_vien` | §3.2.0.8 | Tạo migration mới |
| 2 | **Entity:** thêm 2 field tương ứng | §3.2.0.8 | `entities/tu-van-vien.entity.ts` |
| 3 | **Service:** trong `thamDinh()`, khi auto-transition `MOI_DANG_KY → DANG_THAM_DINH` lần đầu, ghi luôn `tvv.ngayTiepNhan = NOW()` + `tvv.nguoiTiepNhan = currentUser.id` | §3.2.0.8 + FR-IV-06 Processing | `tu-van-vien.service.ts:803-806` |
| 4 | (Optional UX) Gửi notification NHT khi state chuyển sang DANG_THAM_DINH lần đầu | Spec không bắt buộc nhưng UX tốt | `tu-van-vien.service.ts` notification block |
| 5 | **CR đề xuất:** Clarify SRS — hoặc xoá row `MOI_DANG_KY → CHO_THAM_DINH` khỏi Phụ lục C.3, hoặc thêm bước thủ công vào FR-IV-06. Loại bỏ nhập nhằng | §3.2.0.7.5 + Phụ lục C.3 + FR-IV-06 | Spec change |

**KHÔNG cần:**
- ❌ Tạo endpoint `/tu-van-viens/:id/tiep-nhan` (BA đề xuất)
- ❌ Render button "Tiếp nhận hồ sơ" (BA đề xuất, không có trong SCR)
- ❌ Khôi phục transition manual `MOI_DANG_KY → CHO_THAM_DINH` (mâu thuẫn FR-IV-06)
- ❌ Giữ Severity Major

---

## 7. Khuyến nghị quy trình BA

1. **Yêu cầu BA chứng minh nguồn fabrication.** Cụ thể:
   - File nào chứa `FR-IV-13`?
   - File nào chứa "Nút Tiếp nhận hồ sơ" trong SCR-IV-03 row 5?
   - File nào chứa Action "Ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan`, thông báo NHT" cho transition `MOI_DANG_KY → CHO_THAM_DINH`?
   Nếu BA không cung cấp được, báo cáo này phải được rút lại.
2. **Có khả năng BA nhầm sang module khác:** Hỏi đáp (FR-II-03), Vụ việc (FR-V.I-03) đều có "Tiếp nhận" UC riêng — nhưng TVV thì không.
3. **Quy trình review BA:** trước khi escalate verdict "Dev SAI" với severity Major, BA nên cite line number chính xác và verify với grep/notebook trước khi ký phán quyết.

---

## 8. 1 câu chốt

> **BUG-002 không phải "dev đọc thiếu spec" như BA kết luận — mà là "BA cite spec không tồn tại". Bug thật duy nhất là thiếu 2 cột audit `ngay_tiep_nhan` / `nguoi_tiep_nhan` (Medium, fix gọn 1 commit). Không cần tạo endpoint hay button mới. Yêu cầu BA cung cấp nguồn FR-IV-13 + SCR-IV-03 row 5 hoặc rút lại báo cáo.**
