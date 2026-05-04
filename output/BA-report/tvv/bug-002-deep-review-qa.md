# Deep Review BA Response — BUG-FLOW-TVV-002 (SM-02 scope)

**Reviewer:** QA (re-verify song song NotebookLM HTPLDN + grep SRS local).
**Ngày:** 2026-04-27.
**Đối tượng review:** [`bug-002-response-sm02-scope.md`](./bug-002-response-sm02-scope.md) — phản hồi BA từ chối downgrade BUG-002 + claim "không cần BA confirm vì SRS đã rõ".
**Quy trình:** áp dụng rule [`feedback_dev_pushback_critical_thinking`](memory) — không sycophancy, verify ngang dev. Mỗi bằng chứng BA quote được grep ngược về SRS local + cross-check NotebookLM `HTPLDN` (notebook id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`).

---

## ⬛ KẾT LUẬN (đọc trước)

> **Verdict CORE của BA = ĐÚNG. Phương pháp = SAI nghiêm trọng. Khuyến nghị "không cần BA confirm" = SAI.**

| Hạng mục | Phán quyết QA |
|----------|----------------|
| Phạm vi SM-02 chỉ gộp 1 cặp `CHO_THAM_DINH → DANG_THAM_DINH` | ✅ **BA đúng** — confirmed cả SRS local + NotebookLM |
| Implementation dev (auto-skip cả Bước 2) vượt scope SM-02 | ✅ **BA đúng** — đúng phân biệt §3.2.0.7.1 (auto) vs §3.2.0.7.5 (gộp) |
| Giữ severity Major (không downgrade) | ⚠️ **Đồng ý có điều kiện** — lý do BA mạnh nhưng 4 hệ quả BA nêu có 2 cái dựa trên evidence bịa, cần re-justify từ evidence thật |
| **Quote bằng chứng 3 (Phụ lục C.3 transition table line 4912)** | ❌ **BA bịa nội dung** — Action + BR Ref + FR Ref BA quote KHÁC hoàn toàn SRS thực tế |
| **Quote bằng chứng 4 (SCR-IV-03 row 5 nút "Tiếp nhận hồ sơ" + FR-IV-13)** | ❌ **BA bịa hoàn toàn** — row 5 thực tế là "Nút Cập nhật TT", không có nút "Tiếp nhận hồ sơ" trong SCR-IV-03; FR-IV-13 không tồn tại trong SRS |
| Mis-apply BR-AUTH-08 cho guard "click Tiếp nhận" | ❌ **BA mis-apply** — BR-AUTH-08 là rule phân quyền data scope theo `don_vi_id`, không phải rule guard "Tiếp nhận" |
| **Khuyến nghị "đóng câu hỏi BA, không escalate"** | ❌ **SAI** — phát hiện ra **SRS internal contradiction** (state machine spec yêu cầu thủ công vs UI spec không có nút thủ công) → BẮT BUỘC escalate BA để resolve |

**1 dòng:** BA đúng kết luận lớn (SM-02 chỉ gộp 1 cặp) nhưng đã đẩy verdict từ "đúng" lên "không cần BA" bằng cách fabricate 2 bằng chứng (FR-IV-13 + nút "Tiếp nhận hồ sơ" trong SCR-IV-03 row 5). Khi dùng evidence thật thay BC fabricated, kết luận chuyển từ "dev đọc thiếu spec" → "**SRS internal contradiction giữa state machine spec và UI spec**" → cần BA resolve, không close tự ý.

---

## 1. Verify từng bằng chứng BA

### Bằng chứng 1 — §3.2.0.7.5 SM-02 cell "Hiện tại" chỉ chứa 1 transition

**BA quote** (`srs-v3.md:850`):
> SM-02 | SM-TVV | `CHO_THAM_DINH` → `DANG_THAM_DINH` | Gộp thành **`DANG_THAM_DINH`** | Bước "bắt đầu thẩm định" không có hành động thực tế

**SRS local** (line 748):
```
| SM-02 | SM-TVV | `CHO_THAM_DINH` → `DANG_THAM_DINH` | Gộp thành **`DANG_THAM_DINH`** | Bước "bắt đầu thẩm định" không có hành động thực tế |
```
**NotebookLM:** confirm khớp nguyên văn.

**Verdict:** ✅ **ĐÚNG**. (Note nhỏ: BA quote line 850, local file line 748 — chỉ là số dòng khác do version, content khớp.)

### Bằng chứng 2 — Lý do gộp không áp được cho transition Tiếp nhận

**BA lập luận:** Lý do "Bước 'bắt đầu thẩm định' không có hành động thực tế" áp riêng cho `CHO_THAM_DINH → DANG_THAM_DINH`. Transition `MOI_DANG_KY → CHO_THAM_DINH` (CB NV nhấn Tiếp nhận) có hành động thực sự nên không thể gộp cùng.

**Logic check:** ĐÚNG. SM-03 cùng bảng (`srs-v3.md` line 750) ghi rõ chuỗi 3 state khi cần gộp:
```
| SM-03 | SM-DANHGIA | `LAP_KE_HOACH` → `PHAN_CONG` → `CHO_DUYET_PC` | Gộp `LAP_KE_HOACH` + `PHAN_CONG` thành **`CHUAN_BI`** (7→5 states) |
```
Format có khả năng diễn tả chuỗi — nếu SM-02 muốn gộp toàn chuỗi đã viết tương tự. Không viết = chỉ gộp 1 pair.

**Verdict:** ✅ **ĐÚNG**. Lập luận đối chứng SM-03 vững.

### Bằng chứng 3 — Phụ lục C.3 transition table

**BA quote** (`srs-v3.md:4912`):
```
| MOI_DANG_KY | CHO_THAM_DINH | CB NV tiếp nhận | Hồ sơ đủ giấy tờ, CB NV cùng đơn vị | Ghi ngay_tiep_nhan, nguoi_tiep_nhan, thông báo NHT | FR-IV-13 | BR-AUTH-08 |
```

**SRS local** (line 4232):
```
| MOI_DANG_KY | CHO_THAM_DINH | CB NV tiếp nhận | Hồ sơ đủ giấy tờ | — | FR-IV-06 | — |
```

**NotebookLM** (cross-verify):
```
| MOI_DANG_KY | CHO_THAM_DINH | CB NV tiếp nhận | Hồ sơ đủ giấy tờ | — | FR-IV-06 | — |
```

**Diff:**
| Cell | BA quote | SRS thực tế | Status |
|------|----------|-------------|:------:|
| Guard | "Hồ sơ đủ giấy tờ, CB NV cùng đơn vị" | "Hồ sơ đủ giấy tờ" | ❌ BA thêm phần "CB NV cùng đơn vị" |
| Action | "Ghi ngay_tiep_nhan, nguoi_tiep_nhan, thông báo NHT" | "—" | ❌ BA bịa nội dung Action |
| FR Ref | "FR-IV-13" | "FR-IV-06" | ❌ BA bịa FR ref |
| BR Ref | "BR-AUTH-08" | "—" | ❌ BA bịa BR ref |

**Verdict:** ❌ **BA fabricated 4/5 cell của row này.** Chỉ Trigger ("CB NV tiếp nhận") là khớp.

Hệ quả: 3/4 hệ quả Major BA nêu (mất audit trail `ngay_tiep_nhan`/`nguoi_tiep_nhan`, mất guard quyền BR-AUTH-08, mất notification NHT) đều dựa trên Action/Guard column **không tồn tại trong SRS thực tế**.

### Bằng chứng 4 — SCR-IV-03 row 5 nút "Tiếp nhận hồ sơ"

**BA quote** (`srs-fr-04:1274`):
```
| 5 | header | Nút Tiếp nhận hồ sơ | button (primary) | "Tiếp nhận hồ sơ" → C12 confirm
→ FR-IV-13 TIEP_NHAN → SET CHO_THAM_DINH, ghi ngay_tiep_nhan, nguoi_tiep_nhan.
Gửi thông báo Người hỗ trợ
| Điều kiện: role = Cán bộ Nghiệp vụ AND user.don_vi_id = tvv.don_vi_id (BR-AUTH-08)
            AND trang_thai = MOI_DANG_KY |
```

**SRS local** (`srs-fr-04-chuyen-gia-tvv.md` line 893, SCR-IV-03 header buttons table row 5):
```
| 5 | header | Nut Cap nhat TT (gop MH-04.7) | button (secondary) |
"Cap nhat trang thai" → modal: chon TT moi (Tam dung/Khoi phuc/Vo hieu hoa) + ly do
(bat buoc, min 10 ky tu). Validate: vo hieu hoa chi khi khong co VV dang XL...
| click → mo modal | Chi CB NV |
```

**NotebookLM cross-verify:** confirm row 5 = "Nut Cap nhat TT", **không có button "Tiếp nhận hồ sơ" nào trong SCR-IV-03 cả** (NotebookLM tự ghi: "Đây chính là gap thiết kế UI khiến cho vòng lặp phê duyệt bị tắc nghẽn").

**FR-IV-13:** grep toàn bộ SRS local 18 file + NotebookLM query → **KHÔNG TỒN TẠI**. FR cuối cùng nhóm IV trong SRS = `FR-IV-12` (UC50 — Cập nhật trạng thái hoạt động TVV) hoặc `FR-IV-CROSS-01` (Tổng hợp điểm đánh giá TVV).

**Verdict:** ❌ **BA fabricated cả row 5 SCR-IV-03 + bịa FR-IV-13**.

### Bằng chứng 5 — §3.2.0.7.1 không có entry SM-TVV

**BA lập luận:** SRS phân tách §3.2.0.7.1 (auto-transition, AT-01..AT-05) khác §3.2.0.7.5 (gộp state). Không có AT-XX nào cho SM-TVV → dev không có cơ sở SRS để auto-skip Bước Tiếp nhận.

**SRS local** (line 706-718): `§3.2.0.7.1 Auto chuyển trạng thái (5 đề xuất)` — 5 entries:
```
AT-01: SM-KHOAHOC (FR-III-01)
AT-02: SM-KHOAHOC (FR-III-05)
AT-03: SM-VUVIEC (FR-V.I-16)
AT-04: SM-DANHGIA (FR-VI-07)
AT-05: SM-KH-CTHTPL (FR-XI-03)
```

KHÔNG có entry SM-TVV.

**NotebookLM:** confirm § §3.2.0.7.1 chỉ có 5 entries, không bao gồm SM-TVV.

**Verdict:** ✅ **ĐÚNG**. Lập luận phân biệt cơ chế "gộp" vs "auto" của BA chuẩn xác.

### Bằng chứng 6 — Common Approval Fields §3.2.0.8

**BA quote**: `ngay_tiep_nhan` Yes + auto-fill ngày hiện tại; `nguoi_tiep_nhan` Yes + auto-fill từ thao tác Tiếp nhận. Nếu auto-skip → null → vi phạm NOT NULL.

**SRS local** (line 769-770): khớp nguyên văn.

**NHƯNG** SRS local cùng section §3.2.0.8 có bảng "Áp dụng cho từng nhóm" (line 791-797), entry IV. CG/TVV liệt kê:
```
| IV. CG/TVV | TU_VAN_VIEN | trang_thai (Hoạt động/Tạm dừng), file_dinh_kem,
              danh_gia_trung_binh (auto), cong_khai (on/off), thoi_gian_tao, nguoi_tao | S3-20 |
```

→ Bảng này **KHÔNG liệt kê** `ngay_tiep_nhan` / `nguoi_tiep_nhan` cho TVV. Có 2 cách diễn giải:

| Diễn giải | Hệ quả |
|-----------|--------|
| (a) Header rule "Áp dụng cho mọi entity có quy trình phê duyệt" override bảng "Áp dụng cho từng nhóm" → TVV bắt buộc có 2 field này | BA đúng — auto-skip vi phạm NOT NULL |
| (b) Bảng "Áp dụng cho từng nhóm" override header → TVV chỉ cần 6 field liệt kê, không cần `ngay_tiep_nhan`/`nguoi_tiep_nhan` | BA sai — auto-skip không vi phạm field nào |

**Verdict:** ⚠️ **BA chỉ quote nửa story.** Không nhắc bảng "Áp dụng cho từng nhóm" gây ambiguity. Đây cũng là 1 SRS internal inconsistency cần BA resolve.

### Bằng chứng phụ — Đợt 7 nguyên tắc "KHÔNG xóa UC nào"

**BA quote** (`srs-v3.md:806`):
> "KHÔNG xóa UC nào. Chỉ giảm bước thao tác thủ công và field bắt buộc. UC vẫn tồn tại đầy đủ."

**SRS local** (line 711, đoạn intro §3.2.0.7):
> Nguyên tắc: KHÔNG xóa UC nào. Chỉ giảm bước thao tác thủ công và field bắt buộc. UC vẫn tồn tại đầy đủ.

Khớp nguyên văn (chỉ khác số line).

**Verdict:** ✅ **ĐÚNG**.

Tuy nhiên: phần này tự nó **không đủ** để khẳng định BUG-002 phải Major. Vì §3.2.0.7.1 (auto-transition) cũng giảm thao tác thủ công nhưng UC vẫn tồn tại — chỉ thay trigger. Dev có thể đã interpret "auto-skip Tiếp nhận" theo cùng nguyên tắc đó (UC44 vẫn tồn tại, chỉ thay trigger từ "CB NV nhấn" → "auto khi nộp đủ hồ sơ"). Nhưng vì SM-TVV KHÔNG có trong §3.2.0.7.1 (Bằng chứng 5) → dev không có thẩm quyền tự thêm AT-06 → quay về verdict CORE đúng.

---

## 2. Tổng hợp đúng/sai BC

| BC | Tóm tắt | SRS local | NotebookLM | Status |
|:--:|---------|:---------:|:----------:|:------:|
| 1 | SM-02 cell "Hiện tại" chỉ 1 transition | ✅ | ✅ | ✅ ĐÚNG |
| 2 | Lý do gộp không áp được cho Tiếp nhận | logic ✅ | logic ✅ | ✅ ĐÚNG |
| 3 | Phụ lục C.3 transition table có FR-IV-13 + Action ngay_tiep_nhan + BR-AUTH-08 | ❌ thực tế là FR-IV-06, Action "—", BR Ref "—" | ❌ confirm | ❌ **BỊA** |
| 4 | SCR-IV-03 row 5 = nút "Tiếp nhận hồ sơ" gọi FR-IV-13 | ❌ thực tế row 5 = "Nut Cap nhat TT"; SCR-IV-03 không có nút Tiếp nhận; FR-IV-13 không tồn tại | ❌ confirm | ❌ **BỊA** |
| 5 | §3.2.0.7.1 không có entry SM-TVV | ✅ | ✅ | ✅ ĐÚNG |
| 6 | Common Approval Fields ngay_tiep_nhan/nguoi_tiep_nhan bắt buộc | ✅ ở header rule | n/a | ⚠️ NỬA — bảng "Áp dụng từng nhóm" không liệt kê cho TVV → SRS ambiguity |
| Phụ | Đợt 7 KHÔNG xóa UC | ✅ | n/a | ✅ ĐÚNG |

**Tỷ lệ:** 4 ĐÚNG + 1 NỬA + 2 BỊA = phương pháp BA fail "verify rigor".

---

## 3. Phát hiện QUAN TRỌNG mà BA bỏ sót — SRS internal contradiction

Sau khi loại bỏ BC bịa, SRS thực tế cho thấy **mâu thuẫn nội bộ**:

| Spec layer | State machine spec (Phụ lục C.3) | UI spec (SCR-IV-03) |
|------------|----------------------------------|---------------------|
| Transition `MOI_DANG_KY → CHO_THAM_DINH` | ✅ Trigger: "CB NV tiếp nhận" (FR-IV-06) | ❌ KHÔNG có nút "Tiếp nhận hồ sơ" trong header buttons (8 row check) |
| Transition `CHO_THAM_DINH → DANG_THAM_DINH` | ⚠️ Đã được gộp theo SM-02 (§3.2.0.7.5) | n/a |
| Action ghi `ngay_tiep_nhan` | ❌ Action column = "—" trong table | n/a |
| Common Approval Fields áp dụng | ⚠️ Header nói "mọi entity có quy trình phê duyệt" | ⚠️ Bảng "Áp dụng từng nhóm" không liệt kê 2 field này cho TVV |

**3 mâu thuẫn cụ thể:**

1. **Mâu thuẫn 1 — State spec vs UI spec:** Phụ lục C.3 yêu cầu thao tác thủ công CB NV cho transition `MOI_DANG_KY → CHO_THAM_DINH`. SCR-IV-03 (UI spec authoritative) không có nút thủ công nào cho thao tác đó. Dev không thể implement "Tiếp nhận hồ sơ" mà không có UI spec.

2. **Mâu thuẫn 2 — Action column mismatch:** Phụ lục C.3 transition `MOI_DANG_KY → CHO_THAM_DINH` Action = "—". Common Approval Fields lại nói `ngay_tiep_nhan` và `nguoi_tiep_nhan` được auto-fill từ thao tác "Tiếp nhận". Nếu transition không có Action ghi gì, 2 field này được set ở đâu?

3. **Mâu thuẫn 3 — Common Approval Fields scope:** Header nói áp cho "mọi entity có quy trình phê duyệt". Bảng "Áp dụng cho từng nhóm" cho IV. CG/TVV chỉ liệt kê 6 field, không có `ngay_tiep_nhan`/`nguoi_tiep_nhan`. Cái nào authoritative?

**Hệ quả:** dev có thể đã đọc SRS đúng cách của họ (chọn UI spec authoritative + bảng "Áp dụng từng nhóm" authoritative) → kết luận TVV không cần thao tác Tiếp nhận thủ công + không cần ghi 2 field. **Đây không phải "đọc thiếu spec", mà là chọn 1 trong 2 cách diễn giải hợp lý của SRS không nhất quán.**

→ BA claim "không cần BA confirm vì SRS đã rõ" SAI. SRS không rõ; cần BA resolve 3 mâu thuẫn trên.

---

## 4. Phán quyết QA về BUG-002 (re-evaluate)

### 4.1. Severity

| Đề xuất | Cơ sở |
|---------|-------|
| **GIỮ Major** | Verdict CORE BA đúng — SM-02 không cho phép gộp cả Bước 2 [Tiếp nhận]. State `CHO_THAM_DINH` không achievable qua UI = vi phạm Phụ lục C.3 mermaid + transition table state spec |
| Đề xuất severity revise | Không revise. **Lý do giữ Major khác BA:** BA dùng 4 hệ quả, 3/4 dựa trên evidence bịa. Giữ Major dựa trên 2 hệ quả thật từ evidence chuẩn: (1) State machine spec (Phụ lục C.3) bị vi phạm — `MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH` chỉ còn 1 transition gộp `MOI_DANG_KY → DANG_THAM_DINH`, (2) §3.2.0.7.5 SM-02 cho phép gộp 1 cặp duy nhất, dev gộp 2 cặp = vượt scope SRS |

### 4.2. Hành động — KHÁC BA

| BA recommend | QA recommend | Lý do |
|--------------|--------------|-------|
| Đóng câu hỏi BA, không escalate | ❌ **PHẢI escalate BA** | SRS có 3 mâu thuẫn nội bộ (UI spec vs state spec, Action column vs Common Approval Fields, header rule vs bảng từng nhóm) → cần BA chính thức decide which spec authoritative |
| Trả về dev fix theo 6 bước | ⚠️ Chỉ 1 bước hiện thực được | Dev không thể implement nút "Tiếp nhận hồ sơ" mà không có UI spec — SCR-IV-03 chưa có row mô tả nút này. BA phải bổ sung row mới vào SCR-IV-03 hoặc dev phải có CR mới |
| Re-test acceptance: 1 thủ công + 1 auto | ✅ Đồng ý nguyên tắc, nhưng | Phải đợi SCR-IV-03 update có nút "Tiếp nhận hồ sơ" trước. Hiện chưa có UI spec để re-test. |

### 4.3. 3 câu hỏi BẮT BUỘC gửi BA

1. **SCR-IV-03 chính thức có nút "Tiếp nhận hồ sơ" hay không?**
   - Nếu CÓ → BA phải bổ sung row mô tả nút (loại button, label, condition hiển thị, action handler) vào SCR-IV-03 + cập nhật SRS line 893.
   - Nếu KHÔNG → §3.2.0.7.5 SM-02 phải mở rộng scope cho phép gộp `MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH` thành chuỗi 3-state gộp 1 (như SM-03), HOẶC §3.2.0.7.1 phải thêm AT-06 cho SM-TVV.

2. **Action column của transition `MOI_DANG_KY → CHO_THAM_DINH` trong Phụ lục C.3 nên là gì?**
   - Hiện tại = "—" (không ghi gì).
   - Nếu cần ghi `ngay_tiep_nhan` + `nguoi_tiep_nhan` → BA cập nhật table.
   - Nếu không cần → bảng "Áp dụng cho từng nhóm" §3.2.0.8 (không liệt kê 2 field cho TVV) là authoritative.

3. **2 field `ngay_tiep_nhan` + `nguoi_tiep_nhan` có bắt buộc cho TU_VAN_VIEN không?**
   - §3.2.0.8 header rule "áp dụng cho mọi entity có quy trình phê duyệt" → CÓ.
   - §3.2.0.8 bảng "Áp dụng cho từng nhóm" IV. CG/TVV → KHÔNG (chỉ 6 field khác).
   - BA chọn 1 trong 2.

---

## 5. Phản hồi 1 dòng cho từng claim của BA

| BA claim | QA phản hồi |
|----------|-------------|
| "Không cần BA — SRS đã rõ qua 6 điểm" | ❌ SRS có 3 mâu thuẫn nội bộ chưa được resolve; 2 trong 6 BC BA dùng là fabricated |
| "Verify ngang dev quyền truy cập SRS" | ✅ Đồng ý — và QA cũng verify ngang BA, kết quả 2 BC BA bịa |
| "Toàn bộ 7 bằng chứng đồng thuận" | ❌ Chỉ 4 đồng thuận; 1 nửa; 2 bịa |
| "Hạ Major → Medium = không chấp nhận" | ⚠️ Đồng ý GIỮ Major, nhưng vì lý do khác BA |
| "Vấn đề đóng — không cần BA" | ❌ Vấn đề MỞ — bắt buộc escalate BA 3 câu hỏi cụ thể (§4.3) |
| "Trả về dev fix theo 6 bước" | ⚠️ Dev không thể fix mà không có UI spec; cần BA bổ sung SCR-IV-03 trước |

---

## 6. Khuyến nghị cuối

1. ✅ **Giữ severity Major** cho BUG-FLOW-TVV-002 — trên cơ sở evidence thật (BC 1, 2, 5, phụ).
2. ❌ **Reject BA recommend "không cần BA confirm"** — SRS có 3 mâu thuẫn nội bộ cần BA chính thức decide.
3. 📤 **Escalate 3 câu hỏi BA** (§4.3) trước khi trả về dev fix.
4. ✏️ **Yêu cầu BA refactor file `bug-002-response-sm02-scope.md`** — loại bỏ 2 BC bịa (BC 3 phần Action/FR/BR Ref + BC 4 toàn bộ), giữ lại 4 BC + 1 nửa hợp lệ. File hiện tại có thể gây nhầm lẫn dev nếu họ tự verify.
5. 🔒 **BUG-002 status:** giữ **PARTIAL — pending BA confirm 3 questions** (như đã ghi trong [`bug-report-flow-TVV.md`](../../qa-reports/round5-2026-04-26/bug-reports/bug-report-flow-TVV.md)). KHÔNG re-open dev fix khi chưa có BA decision.

---

## 7. Verification trail

| Source | Method | Result |
|--------|--------|--------|
| `srs-v3.md` line 706-754 | `grep -n` + `sed -n` | confirm §3.2.0.7.1 (5 entries no SM-TVV) + §3.2.0.7.5 SM-02 row chỉ 1 transition |
| `srs-v3.md` line 4203-4232 | `sed -n` Phụ lục C.3 | confirm transition `MOI_DANG_KY → CHO_THAM_DINH` FR-IV-06, Action "—", BR Ref "—" |
| `srs-v3.md` line 755-797 | `sed -n` §3.2.0.8 | confirm Common Approval Fields header rule + bảng "Áp dụng từng nhóm" mismatch |
| `srs-fr-04-chuyen-gia-tvv.md` line 880-916 | `sed -n` SCR-IV-03 header buttons | confirm row 5 = "Nut Cap nhat TT", không có nút "Tiếp nhận hồ sơ" |
| `srs-fr-04-chuyen-gia-tvv.md` line 70-71 | `grep` | confirm UC44/UC45 = FR-IV-06/FR-IV-07; FR-IV-13 không tồn tại |
| `grep -rn "FR-IV-13" input/srs-v3/` | `grep` | 0 matches |
| NotebookLM HTPLDN (id `e3a2681b...`) | query 4 câu hỏi cùng lúc | confirm SM-02 chỉ 1 cặp + SCR-IV-03 row 5 = "Nut Cap nhat TT" + KHÔNG có nút "Tiếp nhận hồ sơ" + FR-IV-13 không tồn tại + transition table chính xác |

*Deep review hoàn tất: 2026-04-27 ~20:15 | QA via Claude Code (NotebookLM + SRS local cross-verify per memory rule `feedback_bug_verify_notebooklm_local`)*
