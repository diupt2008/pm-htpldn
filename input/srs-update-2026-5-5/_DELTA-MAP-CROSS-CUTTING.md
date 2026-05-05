# Delta Map — Cross-cutting changes (Hard delete + Bỏ ClamAV + Bỏ lưu nháp)

> **Mục đích:** 3 thay đổi user clarify 2026-05-05 (item 9/10/11 dev list) — KHÔNG thuộc 1 module riêng, áp dụng **TOÀN HỆ THỐNG**.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude

---

## C1. Bỏ Soft-delete → Hard delete (item 9)

### Scope user xác nhận

> "Dùng hard delete, không ảnh hưởng gì" — user 2026-05-05.

### Phản biện QA — CÓ ẢNH HƯỞNG

User claim "không ảnh hưởng" — **mình KHÔNG đồng ý**. 4 risk thực tế:

1. **Test case INVALID:** mọi TC verify `is_deleted = 1` sau DELETE → fail (record xoá khỏi DB).
2. **Audit trail compliance:** AUDIT_LOG là INSERT-only (BR-DATA-05). Nếu HARD delete record nghiệp vụ, audit log vẫn ghi action DELETE — OK. Nhưng nếu cần REPLAY xem record đã xoá → KHÔNG còn được.
3. **Cascade FK:** DN xoá → VV/Chi trả/HĐ link DN_id sẽ bị broken FK hoặc cascade delete? Pháp luật yêu cầu lưu lịch sử hồ sơ TVV/DN. Cần BA confirm cascade behavior.
4. **Feature "Khôi phục từ thùng rác"** (nếu đã design) → bỏ luôn.

### Module impact (12 file)

| File | `is_deleted` | `BR-DATA-01` | `xoá mềm` | Action |
|---|---|---|---|---|
| `srs-fr-10-quan-tri.md` | 2 | **8** (nguồn BR) | 11 | **A FULL** — invalidate BR-DATA-01 nguồn |
| `srs-v3.md` (master) | 42 | 3 | 49 | **A FULL** — sync BR + ERD bỏ field is_deleted |
| `srs-fr-02-hoi-dap.md` | 3 | 5 | 11 | **B DELTA** |
| `srs-fr-04-chuyen-gia-tvv.md` | 1 | 4 | 8 | **B DELTA** |
| `srs-fr-05-vu-viec.md` | 3 | 3 | 5 | **B DELTA** |
| `srs-fr-07-doanh-nghiep.md` | 3 | 4 | 9 | **B DELTA** |
| `srs-fr-08-danh-gia.md` | 5 | 0 | 5 | **C IMPACT** |
| `srs-fr-09-bieu-mau.md` | 4 | 4 | 9 | **B DELTA** |
| `srs-fr-11-bao-cao.md` | 1 | 0 | 1 | **C IMPACT** |
| `srs-fr-14-hop-dong-tv.md` | 1 | 4 | 8 | **B DELTA** |
| `srs-fr-15-ct-htpldn.md` | 1 | 5 | 10 | **B DELTA** |
| `srs-fr-01-dashboard.md` | 1 | 0 | 0 | **C IMPACT** |

**KHÔNG impact:** FR-06 chi-tra, FR-13 tv-nhanh, FR-16 api (no ref).

### Action QA

- BR-DATA-01 phải INVALIDATE trên 12 file (BA cần cấp file SRS update riêng cho cross-cutting này).
- Test case verify `is_deleted = 1` → mark obsoleted-by-SRS-update.
- Test case mới: verify DELETE → record không còn trong GET response (HARD delete confirmed).

---

## C2. Bỏ ClamAV / virus scan (item 10)

### Scope user xác nhận

> "Quy mô bỏ cả hệ thống" — user 2026-05-05.

### Module impact (3 file spec trực tiếp + 5 file gián tiếp)

| File | ClamAV ref | virus/quét/độc | file_dinh_kem | Action |
|---|---|---|---|---|
| `srs-fr-02-hoi-dap.md` | 1 | 1 | 9 | **B DELTA** — invalidate spec virus scan |
| `srs-fr-05-vu-viec.md` | 1 | 4 | 7 | **B DELTA** — invalidate EC-V.I-05-11 partial failure |
| `srs-fr-09-bieu-mau.md` | 0 | 3 | 8 | **B DELTA** — invalidate ERR-BM-07 |
| `srs-v3.md` master | 0 | 2 | 6 | **C IMPACT** — sync |
| `srs-fr-04-chuyen-gia-tvv.md` | 0 | 0 | 1 | **D SKIP** — chỉ field, không spec virus |
| `srs-fr-06-chi-tra.md` | 0 | 0 | 2 | **D SKIP** |
| `srs-fr-07-doanh-nghiep.md` | 0 | 0 | 2 | **D SKIP** |
| `srs-fr-14-hop-dong-tv.md` | 0 | 0 | 1 | **D SKIP** |

### Phản biện QA — security regression risk

**Bỏ virus scan toàn hệ thống = SECURITY REGRESSION.** User upload file độc → BE store + serve cho user khác download → infection chain.

Mitigation BA cần xác nhận:
- Có alternative scan engine khác không (vd Windows Defender API, cloud AV)?
- Hoặc BE chỉ lưu file metadata + redirect download qua S3 với ACL strict?
- Hoặc bỏ luôn upload file (chỉ link external)?

→ **QA flag risk Critical**, escalate BA security review trước khi test.

### Action QA

- Test case "upload file độc → ERR-* virus detected" → mark obsoleted.
- Thêm test case **security:** upload file `.exe`, `.bat`, file nén có macro → verify BE behavior (accept/reject?).
- ERR-BM-07 (FR-09) + EC-V.I-05-11 (FR-05) invalidate.

---

## C3. Bỏ lưu nháp (item 11) — ESCALATE BA TRƯỚC KHI TEST

### Scope user xác nhận

> "Quy mô bỏ cả hệ thống" — user 2026-05-05.

### Phản biện QA — MÂU THUẪN ENTRY STATE

**Bỏ lưu nháp toàn hệ thống KHÔNG thể áp dụng global vì 5 module có draft state là ENTRY STATE của workflow:**

| Module | State | Vai trò | Hệ quả nếu bỏ |
|---|---|---|---|
| FR-04 chuyen-gia-tvv (18 ref `MOI_DANG_KY`) | **`MOI_DANG_KY`** | Entry state SM-TVV (sau CB NV thêm TVV) | **PHÁ SM-TVV** — không có state khởi tạo |
| FR-05 vu-viec (1 ref) | `MOI_DANG_KY` | Entry state SM-VUVIEC (CB NV nhập tay bypass DVC) | Phá luồng nhập tay |
| FR-08 danh-gia (9 ref `NHAP` + 4 ref "lưu nháp") | **`NHAP`** | Entry state SM-DANHGIA (tạo đợt đánh giá) | **PHÁ SM-DANHGIA** |
| FR-09 bieu-mau (19 ref `NHAP` + 2 ref "lưu nháp") | **`NHAP`** | Entry state SM-BIEUMAU (CB NV upload biểu mẫu) | **PHÁ SM-BIEUMAU** |
| FR-15 ct-htpldn (49 ref `DU_THAO`) | **`DU_THAO`** | **Entry state SM-CTHTPL** (CB NV tạo CT) | **PHÁ TOÀN BỘ quy trình tạo/duyệt CT HTPLDN** |

→ **Bỏ "lưu nháp" KHÔNG = bỏ entry state.** Có 2 nghĩa:
- **Nghĩa hẹp:** bỏ button "[Lưu nháp]" trên form (user chỉ click [Lưu] = submit thẳng vào entry state). Entry state giữ nguyên.
- **Nghĩa rộng:** bỏ luôn entry state DRAFT → form chỉ có 1 action "Submit" → bypass thẳng đến state CHỜ DUYỆT.

User chưa clarify nghĩa hẹp hay rộng. **Mình STRONGLY RECOMMEND nghĩa hẹp** — nghĩa rộng phá 5 SM (4 module nâng từ B → A FULL). Nếu BA quyết nghĩa rộng → QA cần redesign test plan 5 module.

### Action QA — escalate BA TRƯỚC khi test

**KHÔNG test "bỏ lưu nháp" cho đến khi BA confirm scope:**

| Câu hỏi BA | Option A (nghĩa hẹp) | Option B (nghĩa rộng) |
|---|---|---|
| Button [Lưu nháp] trên form | Bỏ button | Bỏ button |
| Entry state DRAFT (`MOI_DANG_KY/NHAP/DU_THAO`) | **GIỮ** — backend tự set khi user click [Lưu] | **BỎ** — form submit thẳng vào CHO_DUYET |
| Workflow ảnh hưởng | UI minor — test smoke 1 module | 5 module redesign SM |
| Test plan | 1 task | 5 task A FULL |

---

## Tổng kết — phân nhóm hợp nhất TOÀN BỘ batch SRS update 2026-05-05

Tổng 5 file SRS module + 1 file profile + 3 cross-cutting:

| Module | FR-04 | FR-07 | FR-10 | FR-03 | FR-12 | Profile | Hard del | ClamAV | Lưu nháp HẸP | **Final** |
|---|---|---|---|---|---|---|---|---|---|---|
| srs-v3 master | A | A | A | A | A | — | A | C | C | **A FULL** |
| FR-04 chuyen-gia-tvv | (self) | — | B | — | — | — | B | — | C | **A FULL** |
| FR-05 vu-viec | A | B | B | — | — | — | B | B | C | **A FULL** |
| FR-12 tv-chuyen-sau | A | B | B | — | (self) | — | — | — | — | **A FULL** |
| FR-07 doanh-nghiep | — | (self) | D | — | — | — | B | — | — | **A FULL** |
| FR-10 quan-tri | B | — | (self) | — | — | C | A (BR-DATA-01) | — | — | **A FULL** |
| FR-03 dao-tao | — | — | — | (self) | — | — | — | — | — | **A FULL** |
| FR-14 hop-dong-tv | B | B | B | — | — | — | B | — | C | **B DELTA** |
| FR-11 bao-cao | B | D | C | B | B | — | C | — | — | **B DELTA** |
| FR-09 bieu-mau | B | D | C | — | — | — | B | B | C | **B DELTA** |
| FR-02 hoi-dap | B | D | B | — | — | — | B | B | C | **B DELTA** |
| FR-08 danh-gia | B | B | C | C | — | — | C | — | C | **B DELTA** |
| FR-06 chi-tra | B | B | B | — | — | — | — | — | — | **B DELTA** |
| FR-16 api | B | B | C | B | B | — | — | — | C | **B DELTA** |
| FR-15 ct-htpldn | D | D | B | — | — | — | B | — | C | **B DELTA** |
| FR-13 tv-nhanh | D | D | B | — | C | — | — | — | C | **B DELTA** |
| FR-01 dashboard | C | C | C | C | — | — | C | — | C | **C IMPACT** |

**Total nhóm A FULL: 7 file** (xác nhận sau verify lưu nháp scope HẸP — KHÔNG nâng FR-09/FR-15).

---

## Đáp án verified từ data 2026-05-05 — KHÔNG cần hỏi BA thêm

| Câu | Verify | Đáp án final |
|---|---|---|
| Hard delete cascade FK | `srs-fr-04 line 1465` modal MD-XOA VẪN ghi "Dữ liệu vẫn được lưu trữ (xóa mềm)" | **SRS chưa cover hard delete** — mâu thuẫn dev claim. QA test theo dev behavior thực tế deploy + log bug nếu lệch SRS. |
| ClamAV alternative | User confirm: "quy mô bỏ cả hệ thống" | **KHÔNG có alternative**. Bỏ luôn. Risk security regression đã flag — escalate dev/BA security review |
| Lưu nháp scope | `srs-fr-03 line 66/86/90/168` (DU_THAO + NHAP VẪN tồn tại) + `srs-fr-04 line 52/167/207/314/320` (MOI_DANG_KY VẪN tồn tại) | **Scope HẸP** — SRS update KHÔNG bỏ entry state. Chỉ bỏ button [Lưu nháp]. Entry state DRAFT giữ nguyên (dev set khi user click Lưu). **KHÔNG phá 5 SM** — FR-09 + FR-15 KHÔNG nâng cấp lên A FULL |
| Compliance NĐ55/NĐ77 lưu trữ | KHÔNG có ref "lưu trữ 10 năm/retention" trong FR-04/FR-07 | **SRS không cover** — câu này phải hỏi BA/legal, không trả lời được từ tài liệu. Defer khi log bug nếu phát sinh |

## Action QA — final

1. **R7.0.5 mở rộng (DONE)** — không chỉ 5 task R6 mà 9 task (thêm B2/B2.5/B7/D2/D3 unblocked-by-dev-fix).
2. **R7.0.6 mới (DONE)** — verify 3 cross-cutting changes.
3. **Phân nhóm hợp nhất A FULL = 7 file** (KHÔNG nâng lên 9 vì lưu nháp HẸP). Bảng trên (line 138-156) **valid** không cần update phân nhóm.
4. **3 câu defer khi test:** hard delete cascade FK behavior, compliance retention, ClamAV alternative — log bug khi gặp behavior thực tế lệch.
