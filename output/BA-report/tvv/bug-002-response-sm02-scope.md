# Phản hồi BUG-002 — Phạm vi gộp state SM-02 (SM-TVV)

**Ngày:** 2026-04-27
**Liên quan:** §3.2.0.7.5 SM-02, Phụ lục C.3 SM-TVV, FR-IV-13, SCR-IV-03

---

## ⬛ KẾT LUẬN (đọc trước khi đi vào chi tiết)

> **SM-02 chỉ cho phép gộp 1 pair `CHO_THAM_DINH → DANG_THAM_DINH`. KHÔNG cho phép gộp thêm transition `MOI_DANG_KY → CHO_THAM_DINH`.**

| Hạng mục | Phán quyết |
|----------|-----------|
| **Verdict** | ✗ **Dev SAI** — implementation vượt scope SM-02 |
| **Severity** | 🔴 **Giữ Major** (không downgrade Medium) |
| **Có cần BA xác nhận không?** | **KHÔNG.** SRS đã quy định rõ qua 6 điểm độc lập, không có điểm mơ hồ |
| **Hành động** | Trả về dev fix theo 6 bước ở §3 — không escalate BA, không hold |
| **Re-test** | Sau fix, verify đúng 2 bước: (1) CB NV nhấn "Tiếp nhận" thủ công → `CHO_THAM_DINH`; (2) auto → `DANG_THAM_DINH` |

**Tại sao dev sai (1 dòng):** §3.2.0.7.5 SM-02 chỉ ghi 1 transition trong cột "Hiện tại"; lý do gộp ("không có hành động thực tế") áp riêng cho transition đó; transition `MOI_DANG_KY → CHO_THAM_DINH` có hành động nghiệp vụ thật (audit + guard quyền + notification) nên không thuộc phạm vi SM-02.

**Tại sao không cần BA (1 dòng):** SRS phân tách rõ §3.2.0.7.1 (auto-transition) khác §3.2.0.7.5 (gộp state); không có entry AT nào cho SM-TVV → dev không có cơ sở SRS để auto-skip Bước Tiếp nhận. Mọi diễn giải khác đều mâu thuẫn với 5+ vị trí khác trong SRS (Phụ lục C.3, SCR-IV-03 row 5, §3.2.0.8 Common Approval Fields, §3.2.0.7 nguyên tắc Đợt 7).

---

## 1. Câu hỏi cần trả lời

> SM-02 (§3.2.0.7.5) cho phép gộp toàn chuỗi `MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH`, hay chỉ gộp pair `CHO_THAM_DINH → DANG_THAM_DINH`?

## 2. Trả lời theo SRS — chỉ gộp 1 pair

### Bằng chứng 1 — Cell "Hiện tại" của SM-02 chỉ chứa 1 transition

`srs-v3.md:850`:

| # | SM | Hiện tại | Đề xuất | Lý do |
|---|----|----------|---------|-------|
| SM-02 | SM-TVV | `CHO_THAM_DINH` → `DANG_THAM_DINH` | Gộp thành **`DANG_THAM_DINH`** | Bước "bắt đầu thẩm định" không có hành động thực tế |

Cột "Hiện tại" chỉ có 1 transition. Nếu ý định là gộp chuỗi 2 transition, SRS phải ghi `MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH`.

**Đối chứng:** SM-03 trong cùng bảng (`srs-v3.md:851`) ghi chuỗi 3 state khi cần gộp:

| SM-03 | SM-DANHGIA | `LAP_KE_HOACH` → `PHAN_CONG` → `CHO_DUYET_PC` | Gộp `LAP_KE_HOACH` + `PHAN_CONG` thành **`CHUAN_BI`** |

→ Format có khả năng diễn tả chuỗi. SM-02 không dùng = chỉ định 1 pair.

### Bằng chứng 2 — Lý do gộp không áp được cho transition Tiếp nhận

Lý do SM-02: **"Bước 'bắt đầu thẩm định' không có hành động thực tế"**.

Lý do này áp duy nhất cho transition `CHO_THAM_DINH → DANG_THAM_DINH` (bước "bắt đầu thẩm định" — đúng là không có thao tác thực, hệ thống tự nhảy state khi CB NV mở form thẩm định).

Trong khi đó `MOI_DANG_KY → CHO_THAM_DINH` có hành động thực tế đầy đủ (`srs-v3.md:4912`):
- Trigger: CB NV nhấn "Tiếp nhận"
- Guard: hồ sơ đủ giấy tờ + CB NV cùng đơn vị (BR-AUTH-08)
- Action: ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan`, gửi thông báo NHT
- FR Ref: FR-IV-13

→ Lý do gộp **không phủ** lên transition này.

### Bằng chứng 3 — Phụ lục C.3 (Dev reference) vẫn giữ transition

`srs-v3.md:4891` (mermaid diagram):
```
MOI_DANG_KY --> CHO_THAM_DINH : CB NV tiếp nhận (FR-IV-13)
```

`srs-v3.md:4912` (transition table):
```
| MOI_DANG_KY | CHO_THAM_DINH | CB NV tiếp nhận | Hồ sơ đủ giấy tờ, CB NV cùng đơn vị | Ghi ngay_tiep_nhan, nguoi_tiep_nhan, thông báo NHT | FR-IV-13 | BR-AUTH-08 |
```

Phụ lục C được khai báo là **Dev reference** (`srs-v3.md:278`) — authoritative cho implement state machine. Nếu §3.2.0.7.5 đã loại transition này, Phụ lục C.3 phải được cập nhật/strikeout. Hiện tại chưa có dấu hiệu đó → transition còn hiệu lực.

### Bằng chứng 4 — SCR-IV-03 row 5 vẫn yêu cầu nút "Tiếp nhận hồ sơ"

`srs-fr-04-chuyen-gia-tvv.md:1274`:
```
| 5 | header | Nút Tiếp nhận hồ sơ | button (primary) | "Tiếp nhận hồ sơ" → C12 confirm
→ FR-IV-13 TIEP_NHAN → SET CHO_THAM_DINH, ghi ngay_tiep_nhan, nguoi_tiep_nhan.
Gửi thông báo Người hỗ trợ
| Điều kiện: role = Cán bộ Nghiệp vụ AND user.don_vi_id = tvv.don_vi_id (BR-AUTH-08)
            AND trang_thai = MOI_DANG_KY |
```

Nút này chỉ tồn tại nếu transition `MOI_DANG_KY → CHO_THAM_DINH` còn thủ công. Nếu auto-skip thì SRS phải xóa nút này. Nó vẫn tồn tại = bằng chứng trực tiếp transition không bị gộp.

### Bằng chứng 5 (quyết định) — §3.2.0.7.1 không có entry cho SM-TVV

SRS phân tách rõ 2 cơ chế tối ưu UX:

- **§3.2.0.7.1 Auto chuyển trạng thái** = bỏ click thủ công, hệ thống tự nhảy state. 5 items AT-01 → AT-05 (`srs-v3.md:812-818`). **Không item nào thuộc SM-TVV.**
- **§3.2.0.7.5 Gộp trạng thái trung gian** = giảm số state hiển thị, không bỏ click.

Dev đang implement *auto-transition* cho SM-TVV (bỏ click "Tiếp nhận"), nhưng không có entry AT-06 nào trong §3.2.0.7.1 cho phép điều này. Sai cả về **cơ chế** (gộp ≠ auto) lẫn **phạm vi** (SM-02 chỉ gộp 1 pair).

### Bằng chứng 6 — Common Approval Fields §3.2.0.8

`srs-v3.md:869-870`:

| Trường | Bắt buộc | Auto-fill |
|--------|----------|-----------|
| `ngay_tiep_nhan` | **Yes** | Mặc định ngày hiện tại, cho phép sửa |
| `nguoi_tiep_nhan` | **Yes** | Auto-fill theo CB NV nhấn "Tiếp nhận" |

`nguoi_tiep_nhan` được auto-fill từ thao tác "Tiếp nhận" thủ công. Nếu auto-skip transition → không có thao tác → 2 field bắt buộc này null → vi phạm constraint NOT NULL.

### Bằng chứng bổ sung — nguyên tắc Đợt 7

`srs-v3.md:806`: **"KHÔNG xóa UC nào. Chỉ giảm bước thao tác thủ công và field bắt buộc. UC vẫn tồn tại đầy đủ."**

UC "Tiếp nhận hồ sơ TVV" (FR-IV-13) là 1 UC độc lập. Auto-skip transition `MOI_DANG_KY → CHO_THAM_DINH` = thực chất xóa UC đó khỏi luồng người dùng = vi phạm nguyên tắc.

---

## 3. Hành động fix (theo SRS, không cần BA)

| # | Hành động | Tham chiếu SRS |
|---|-----------|----------------|
| 1 | Khôi phục transition thủ công `MOI_DANG_KY → CHO_THAM_DINH` qua FR-IV-13 | Phụ lục C.3 row 1; FR-IV-13 |
| 2 | Render lại nút "Tiếp nhận hồ sơ" tại SCR-IV-03 row 5 (điều kiện: role = CB NV + cùng đơn vị + `trang_thai = MOI_DANG_KY`) | `srs-fr-04:1274` |
| 3 | Giữ phần dev đã làm đúng: auto chuyển `CHO_THAM_DINH → DANG_THAM_DINH` (đây mới là SM-02). UI có thể không hiển thị `CHO_THAM_DINH` như resting state | §3.2.0.7.5 SM-02 |
| 4 | Verify khi nhấn "Tiếp nhận", BE ghi đủ `ngay_tiep_nhan` (NOW) + `nguoi_tiep_nhan` (current user) | §3.2.0.8 |
| 5 | Verify guard BR-AUTH-08: `user.don_vi_id = tvv.don_vi_id` trước khi cho click | BR-AUTH-08 |
| 6 | Verify gửi notification đến NHT sau khi tiếp nhận | Phụ lục C.3 row 1 Action |

---

## 4. Severity — giữ Major

Không downgrade. Lý do:
- **Mất audit trail:** không biết ai/lúc nào tiếp nhận hồ sơ → vi phạm §3.2.0.8 + BR-AUTH-08.
- **Mất guard quyền:** auto-skip = bỏ check `user.don_vi_id = tvv.don_vi_id`. Hồ sơ TVV của đơn vị A có thể bị đơn vị B "vô tình" xử lý.
- **Mất notification:** NHT không biết hồ sơ đã được tiếp nhận → ảnh hưởng UX nghiệp vụ.
- **Mất UC khỏi luồng:** UC "Tiếp nhận hồ sơ TVV" không còn entry point trong UI → không thể nghiệm thu UC này → ảnh hưởng deliverable hợp đồng.

4 hệ quả trên đều là bug nghiệp vụ thật, không phải edge case → đủ điều kiện Major.

---

## 5. Nếu thực sự muốn auto-skip cả Bước 2 [Tiếp nhận]

Đây là **CR mới**, không thuộc SM-02 hiện tại. Cần:

1. PM/BA propose CR sửa §3.2.0.7.1 thêm entry **AT-06: SM-TVV — Tiếp nhận tự động khi NHT nộp đủ hồ sơ → CHO_THAM_DINH**.
2. Update Phụ lục C.3: đổi trigger transition `MOI_DANG_KY → CHO_THAM_DINH` từ "CB NV tiếp nhận" sang "Auto khi NHT nộp đủ hồ sơ".
3. Update SCR-IV-03 row 5: xóa nút "Tiếp nhận hồ sơ" hoặc đổi thành nút "Xem hồ sơ" read-only.
4. Update §3.2.0.8: `nguoi_tiep_nhan` đổi từ "Yes" sang "N" hoặc auto-fill = "SYSTEM".
5. Update §3.2.0.7 nguyên tắc: ghi nhận trường hợp ngoại lệ "auto-skip UC tiếp nhận với SM-TVV".
6. Phân tích tác động đến BR-AUTH-08, audit logs, nghiệm thu UC.

→ Đây là 1 CR đầy đủ, không phải "diễn giải" SM-02 hiện có.

---

## 6. ⬛ KẾT LUẬN CUỐI (sau khi đã đối chiếu SRS)

> **Lặp lại verdict đã nêu ở đầu file — sau khi đi qua đầy đủ 6 bằng chứng từ SRS, kết luận không thay đổi.**

### 6.1. Phán quyết

| Hạng mục | Phán quyết | Cơ sở |
|----------|-----------|-------|
| Phạm vi SM-02 | **Chỉ 1 pair** `CHO_THAM_DINH → DANG_THAM_DINH` | Bằng chứng 1, 2 |
| Transition `MOI_DANG_KY → CHO_THAM_DINH` | **Còn hiệu lực, thủ công, qua FR-IV-13** | Bằng chứng 3, 4 |
| Cơ chế dev đang dùng (auto-transition) | **Sai cơ chế** — không phải "gộp" mà là "auto" | Bằng chứng 5 |
| Field audit `ngay_tiep_nhan`/`nguoi_tiep_nhan` | **Bắt buộc, auto-fill từ thao tác Tiếp nhận** | Bằng chứng 6 |
| UC "Tiếp nhận hồ sơ TVV" (FR-IV-13) | **Phải còn nguyên trong luồng** | Bằng chứng bổ sung |

→ **Toàn bộ 7 bằng chứng đồng thuận**, không có điểm SRS nào support diễn giải "gộp toàn chuỗi". Vấn đề **đóng** — không cần BA.

### 6.2. Phản hồi reviewer (báo cáo phản biện 2 chiều)

| Đề xuất reviewer | Phản hồi |
|------------------|----------|
| Hạ Major → Medium ("implementation over-merged") | ✗ **Không chấp nhận.** Hệ quả thực tế là 4 bug nghiệp vụ (mất audit, mất guard quyền, mất notification, mất UC khỏi luồng) — không phải "over-merge nhẹ" |
| "Cần BA xác nhận SM-02 cho phép gộp toàn chuỗi hay chỉ 1 cặp" | ✗ **Không cần.** SRS đã trả lời rõ qua 6 điểm. Escalate BA = tạo blocker không cần thiết và đặt câu hỏi cho 1 vấn đề đã có đáp án thành văn |

### 6.3. Đề xuất chính thức (action items)

1. ✅ **Giữ severity Major.** Không downgrade.
2. ✅ **Đóng câu hỏi BA.** Không escalate.
3. ✅ **Trả về dev** với 6 hành động fix tại §3.
4. ✅ **Re-test acceptance** sau fix:
   - Tại `MOI_DANG_KY`: nút "Tiếp nhận hồ sơ" hiển thị (đúng điều kiện SCR-IV-03 row 5).
   - Click "Tiếp nhận" → BE ghi `ngay_tiep_nhan = NOW`, `nguoi_tiep_nhan = current_user`, gửi notification NHT.
   - State chuyển `MOI_DANG_KY → CHO_THAM_DINH` (qua đúng 1 bước thủ công).
   - Sau đó auto chuyển `CHO_THAM_DINH → DANG_THAM_DINH` khi CB NV mở form thẩm định (đây mới là SM-02).
   - Tổng cộng đúng **2 bước**: 1 thủ công + 1 auto. KHÔNG được auto từ `MOI_DANG_KY` thẳng sang `DANG_THAM_DINH`.
5. ⛔ **Nếu dev/đối tác vẫn muốn auto-skip Bước Tiếp nhận** → phải submit CR mới theo §5, không tự diễn giải SM-02.

### 6.4. 1 câu chốt

> **BUG-002 không phải vấn đề mơ hồ cần BA — đây là vấn đề dev đọc thiếu spec. Fix theo §3, đóng bug. Hết.**
