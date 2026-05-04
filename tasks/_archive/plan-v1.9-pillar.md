# Kế hoạch QA Round 4 — bản v1.9 (làm theo trụ dữ liệu)

**Ngày viết:** 2026-04-25
**Dựa trên:** plan v1.8 đã chạy + góp ý của bạn ngày 25/04 + file `input/quy-trinh-nghiep-vu/logic-data.md` (5 lớp data) + `02-thu-tu-module.md` (bảng 17 module) + `flow-module.md` (16 luồng)

## Vì sao đổi?

Plan cũ (v1.8) làm kiểu **xếp hàng**: tạo data hết 11 nhóm trước, rồi mới chạy flow hết 10 luồng, rồi mới test chức năng 16 module. Vấn đề:

- Nếu flow TVV (tuần 3) bị lỗi → đã trót tạo data VV/HĐ/Đánh giá HQ ở tuần 2 → công cốc, phải seed lại.
- Phát hiện bug muộn 1 tuần.

Plan mới (v1.9) làm kiểu **theo trụ**: tạo data nhóm nào → chạy flow nhóm đó luôn → OK rồi mới đi tiếp. Nhóm nào không liên quan thì chạy song song.

**Không đổi gì:** vẫn 16/16 module, vẫn 5 tuần, vẫn G1-G9 mục tiêu cũ, P0+P1 đã chốt giữ nguyên.

---

## Việc đã xong tới 25/04 (giữ y nguyên)

| Việc | Kết quả |
|---|---|
| T0.1 Login 11 tài khoản | ✅ 10/11 PASS |
| T0.2 Dọn folder Round 4 | ✅ |
| T1.A1 Smoke 16 module | ✅ 14/16 PASS (Chi trả + TV nhanh chờ LGSP) |
| T1.B1 Tạo data QTHT | ⚠️ partial (PC HD 5/6, PC VV miss) |
| T1.B2 Tạo 6 DN | ✅ DN-{HNI/HPG/DNG}-0001/0002 |
| T1.B3 Tạo 6 TVV (state Mới đăng ký) | ✅ TVV-BTP-TW-0001..0006 |
| T1.B4 Tạo 4 thư mục + 6 biểu mẫu (state Nháp) | ✅ |
| T2.A1 Tạo 6 Hỏi đáp (state Mới) | ✅ HD-20260424-002..007 |
| T2.A2 Tạo 6 Vụ việc (state Đã tiếp nhận) | ✅ VV-BTP-TW-20260424-001..006 |
| T2.A3 Tạo 6 TV chuyên sâu (state Tiếp nhận) | ✅ TVCS-20260424-0001..0006 |
| T2.A4 Tạo 6 Hồ sơ pháp lý DN | ✅ HSPL-20260425-0001..0006 |

**Đang bị block (chờ dev fix):**
- T2.B1 Hợp đồng tư vấn — màn hình SCR-X3-01 chưa build (BUG-HDTV-001-R4)
- T2.C1 CT HTPLDN GĐ1 — nút "Tạo chương trình" lỗi RangeError (BUG-CTHTPLDN-001-R4)
- T2.B4 Chi trả — chờ LGSP đồng bộ
- T2.B5 TV nhanh (Phiên) — chờ Cổng PLQG đồng bộ

---

## 5 trụ làm việc — chia theo nhóm dữ liệu

> **Cách hiểu:** Mỗi trụ = "tạo data + chạy flow + verify state cuối" cho 1 nhóm. Trụ nào không liên quan nhau → chạy song song.

### 🟦 Trụ A — TVV và 4 luồng giao dịch (làm trước, ~5 ngày)

**Vì sao làm trước:** TVV "Đang hoạt động" là cái mà nhiều thứ phụ thuộc nhất. Có TVV active rồi mới tạo được phân công TVV, mới test được phân công VV/HD theo lĩnh vực, mới test được Đánh giá HQ. Cho nên làm A đầu tiên — pass thì cả round nhẹ gánh, fail thì biết sớm để gọi dev.

| # | Việc | Tài khoản | Cần có sẵn | Sau khi xong sẽ có |
|---|---|---|---|---|
| **A1** | Chạy flow TVV (T3.1) | `cb_nv_tw_01` tạo → `cb_pd_tw_01` duyệt | 6 TVV state Mới đăng ký (đã có) | 6 TVV "Đang hoạt động" + 6 tài khoản TVV |
| **A2** | QTHT thêm phân công Đợt 2 cho 6 TVV (T2.0.5) | `qtht_01` | A1 xong | Modal phân công HD/VV có ≥2 gợi ý/lĩnh vực (CB ưu tiên 1, TVV ưu tiên 2) |
| **A3** | Chạy flow Vụ việc (T3.3) | CB NV → TVV → CB NV → CB PD | 6 VV state Đã tiếp nhận (đã có) + TVV active từ A1 | ≥3 VV "Hoàn thành" (cái này cần cho Trụ D đánh giá HQ) |
| **A4** | Chạy flow Hỏi đáp (T3.2) | CB NV → CB/TVV → CB PD | 6 HD state Mới (đã có) + phân công từ A2 | 6 HD "Đã duyệt"/"Công khai" |
| **A5** | Chạy flow TV chuyên sâu (T3.4) | CB NV → CG → CB PD | 6 TVCS state Tiếp nhận (đã có) + CG/TVV active từ A1 | 6 TVCS "Đã duyệt" |

**Nếu A1 fail:** không retry liều, gọi dev fix ngay. Trong lúc chờ → quay sang chạy Trụ B + C (không phụ thuộc TVV). A2/A3/A4/A5 đành block tạm.

---

### 🟩 Trụ B — Đào tạo (chạy song song A, ~3 ngày)

**Đặc điểm:** không cần TVV, không cần DN. Chỉ cần Tài khoản + Danh mục là chạy được. Chạy lúc nào cũng được.

| # | Việc | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **B1** | Tạo 4 CTĐT (T2.A5a) | `cb_nv_tw_01` | LỚP 1 đã có | 4 CTĐT state Dự thảo |
| **B2** | Đẩy CTĐT lên Đã duyệt | CB NV → CB PD | B1 xong | ≥1 CTĐT Đã duyệt (để combobox B3 lọc được) |
| **B3** | Tạo 6 Khóa học gắn CTĐT (T2.A5b) | `cb_nv_tw_01` | B2 xong | 6 KH state Dự thảo |
| **B4** | Tạo 6 Bài giảng (T2.A5c) — **chạy song song B1-B3** | `cb_nv_tw_01` | LỚP 1 đã có | 6 BG state Kích hoạt. Lưu ý: SRS chỉ có cờ `cong_khai`, chụp form lại để check |
| **B5** | Tạo 3 Đề kiểm tra (T2.A5d phần ĐKT) | `cb_nv_tw_01` | NHCH 7/7 đã có + KH ≥1 từ B3 | 3 ĐKT state Dự thảo. Cần BA confirm có cần gắn `khoa_hoc_id` không |
| **B6** | Tạo 6 Giảng viên (T2.A5e) — **chạy song song** | `cb_nv_tw_01` | LỚP 1 đã có | 6 GV. Lưu ý: SRS ghi DANG_GIANG_DAY/TAM_DUNG, fixture ghi "Đang hoạt động" → check label thực tế |
| **B7** | Chạy flow Khóa học đầy đủ (T3.5) | CB NV → CB PD → học viên | B3 + B4 + B5 + B6 xong | KH "Hoàn thành" + có chứng nhận |

**Nếu B2 fail (không đẩy được CTĐT lên Đã duyệt):** vấn đề cũ Round 2. Workaround: xin dev mở endpoint duyệt nhanh hoặc SQL update. Không được thì B3+B5+B7 block, nhưng B4 (Bài giảng) + B6 (Giảng viên) vẫn chạy độc lập được.

---

### 🟨 Trụ C — Biểu mẫu (chạy song song A+B, ~30 phút)

**Đặc điểm:** nhanh nhất. Data đã có sẵn (T1.B4 ✅). Chỉ cần đẩy state.

| # | Việc | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **C1** | Chạy flow Biểu mẫu Nháp → Công khai → Ẩn (T3.10) | `cb_nv_tw_01` | 6 BM state Nháp (đã có) | ≥1 BM Công khai. Verify API `/api/v1/bieu-mau?la_cong_khai=1` chỉ trả BM đã công khai |

---

### 🟧 Trụ D — Hậu kỳ (sau khi A xong, ~3 ngày)

**Đặc điểm:** phải chờ A3 cho đủ ≥3 VV "Hoàn thành" + A1 cho TVV active.

| # | Việc | Tài khoản | Cần có sẵn | Output |
|---|---|---|---|---|
| **D1** | Tạo 1 kỳ Đánh giá HQ + tiêu chí (T2.B2) | `cb_nv_tw_01` | DM Tiêu chí ĐG (LỚP 1) + ≥3 VV Hoàn thành từ A3 + 1 TVV làm đánh giá viên | 1 kỳ ĐG + tiêu chí tổng trọng số = 100% |
| **D2** | Chạy flow Đánh giá HQ 7 bước (T3.9) | CB NV → CB PD → TVV → CB NV → CB PD | D1 xong | Kỳ ĐG "Hoàn thành" + báo cáo TT17 auto. Lưu ý: màn hình hiển thị state `LAP_KE_HOACH` nhưng DB ghi `NHAP` — phải check cả 2 |
| **D3** | Tạo 6 câu hỏi Kho Q&A (T2.B3) — **song song D1-D2** | `cb_nv_tw_01` → `cb_pd_tw_01` | LỚP 1 đã có | 6 Q&A "Đã duyệt". Test 2 nguồn: nhập tay (qua duyệt) vs auto từ HD "Đã duyệt" của A4 |

---

### 🟥 Trụ E — Đang chờ dev/LGSP (theo dõi xuyên suốt, không gate)

| # | Việc | Trạng thái 25/04 | Bị ảnh hưởng |
|---|---|---|---|
| **E1** | Tạo Hợp đồng tư vấn (T2.B1) | 🚫 SCR-X3-01 chưa build | Flow HĐTV + functional 29 TC |
| **E2** | Tạo CT HTPLDN GĐ1 (T2.C1) | 🚫 nút "Tạo CT" lỗi RangeError | Flow CT HTPLDN GĐ1+GĐ2 + functional 42 TC |
| **E3** | Verify Chi trả ≥3 record (T2.B4) | 🚫 chờ LGSP | Flow Chi trả + functional 30 TC |
| **E4** | Verify Phiên TV nhanh ≥3 record (T2.B5) | 🚫 chờ Cổng PLQG | Flow TV Nhanh + functional 39 TC |

**Cách theo dõi:** mỗi sáng curl 4 endpoint + MCP ping 1 lần → ghi 1 dòng vào `_pillar-E-status.md`. Cuối tuần nếu chưa unblock → đánh dấu cascade-block toàn bộ phần liên quan, dời sang Round 5.

---

### Tier 5 — Đầu ra (sau khi 5 trụ + dev unblock E, ~1 ngày)

| # | Việc | Phụ thuộc |
|---|---|---|
| **5.1** | Flow Chi trả (T3.6) | E3 unblock + A3 (VV Hoàn thành) + A1 (TVV active) |
| **5.2** | Flow TV Nhanh Phiên (T3.7) | E4 unblock + D3 (Kho Q&A đã duyệt) |
| **5.3** | Flow CT HTPLDN GĐ1 + GĐ2 (T3.8) | E2 unblock + A3 (VV) + B7 (Đào tạo) + 5.1 (Chi trả) |

---

## Lịch tuần (cập nhật theo trụ)

| Tuần | Làm gì | Cuối tuần kiểm tra |
|---|---|---|
| **T0** ✅ | Chuẩn bị | C0 ✅ |
| **T1** ✅ | Smoke + LỚP 1 + LỚP 2 partial (đã làm xong tới 25/04) | C1 ✅ |
| **T2** | **3 trụ song song:** A1-A5 (TVV+VV+HD+TVCS) + B1-B7 (Đào tạo) + C1 (Biểu mẫu) | **C2** — review trụ A+B+C |
| **T3** | Trụ D (Đánh giá HQ + Kho QA) + theo dõi E mỗi ngày + Tier 5 (Chi trả/TVNhanh/CT HTPLDN) | **C3** — review trụ D + Tier 5 + chốt status E |
| **T4** | Functional 16 module (3-4 module/ngày) | **C4** |
| **T5** | TC chi tiết + UI + Regression + Tổng kết | **C5** |

**Khác plan cũ:** plan v1.8 có 5 lần hold-for-review (C0-C5). Plan v1.9 còn 4 lần (gộp C2 cũ vào C2 mới, gộp C3 cũ vào C3 mới). Bạn đỡ phải review giữa kỳ 1 lần.

**Mỗi trụ xong → tạo 1 file ngắn `_pillar-{A..E}-result.md`** chỉ liệt kê: test gì / kết quả / file lưu / nếu fail xử lý sao. File này archive làm bằng chứng, không cần bạn duyệt.

---

## Đối chiếu 16 module — không sót cái nào

Mình check lại với bảng 17 dòng trong `02-thu-tu-module.md`:

| # | Module | LỚP | Thuộc trụ nào | Trạng thái 25/04 |
|---|---|---|---|---|
| 1 | FR-10 Quản trị HT | 1 | T1.B1 + A2 (PC Đợt 2) + T4.8 functional | ⚠️ T1.B1 partial |
| 2 | FR-07 Doanh nghiệp | 2 | T1.B2 + T4.4 functional 18 TC | ✅ data đã có |
| 3 | FR-04 CG/TVV | 2 | **Trụ A** A1 + T4.2 functional 31 TC | ⏳ |
| 4 | FR-09 Biểu mẫu | 2 | **Trụ C** C1 + T4.10 functional 38 TC | ⏳ |
| 5 | FR-15 CT HTPLDN GĐ1 | 2 | **Trụ E** E2 → 5.3 + T4.15 | 🚫 |
| 6 | FR-05 Vụ việc | 3 | **Trụ A** A3 + T4.3 functional 35 TC | ⏳ data ✅ |
| 7 | FR-02 Hỏi đáp | 3 | **Trụ A** A4 + T4.1 functional 36 TC | ⏳ data ✅ |
| 8 | FR-12 TV chuyên sâu | 3 | **Trụ A** A5 + T4.5 functional 44 TC | ⏳ data ✅ |
| 9 | FR-03 Đào tạo (4 sub) | 3 | **Trụ B** B1-B7 + T4.6 functional 40 TC | ⏳ NHCH ✅ phần khác ⏳ |
| 10 | FR-14 Hợp đồng TV | 4 | **Trụ E** E1 + T4.14 functional 29 TC | 🚫 |
| 11 | FR-06 Chi trả | 4 | **Trụ E** E3 → 5.1 + T4.12 functional 30 TC | 🚫 |
| 12 | FR-08 Đánh giá HQ | 4 | **Trụ D** D1-D2 + T4.9 functional 40 TC | ⏳ chờ A3 |
| 13 | FR-13 TV Nhanh (Phiên + Kho QA) | 4 | **Trụ D** D3 (Kho QA) + **Trụ E** E4 → 5.2 (Phiên) + T4.11 functional 39 TC | ⏳ Kho QA / 🚫 Phiên |
| 14 | FR-15 CT HTPLDN GĐ2 | 5 | **Tier 5** 5.3 + T4.15 (chung GĐ1) | 🚫 cascade từ E2 |
| 15 | FR-11 Báo cáo | 5 | T4.13 functional 38 TC (cần A+B+D xong) | ⏳ |
| 16 | FR-01 Dashboard | 5 | T4.7 functional 34 TC (cần A+B+D xong) | ⏳ |
| 17 | FR-16 API kết nối | 5 | T4.16 functional 42 TC (8 inbound chờ LGSP) | ⏳ |

→ 17/17 module có trong plan, không sót.

---

## Rủi ro chính cần để ý

| # | Rủi ro | Khả năng | Tác động | Cách xử |
|---|---|---|---|---|
| R-A1 | Flow TVV (A1) fail | Trung bình | Cao — block A2-A5 + Trụ D | Switch sang B+C song song. Gọi dev fix. Không retry liều |
| R-B2 | Đẩy CTĐT lên Đã duyệt fail (lặp Round 2) | Cao | Trung bình | Xin dev endpoint hoặc SQL. Fail thì B3/B5/B7 block, B4+B6 vẫn chạy |
| R-E | Trụ E không unblock đến hết T3 | Cao | Cao | Daily ping. Quá ngày 7 → cascade-block, dời Round 5. Trụ A+B+C+D vẫn pass thì G1/G2/G3 vẫn đạt |
| R cũ | HSPL block kéo dài | — | — | Đã closed 25/04, verify regression ở P5 |

---

## Cần bạn confirm 5 ý trước khi mình sửa plan.md + todo.md

1. **Bỏ 1 lần review giữa kỳ (gộp C2 cũ + C3 cũ thành 2 lần mới) — OK?** Bạn đỡ touch điểm. Mỗi trụ xong vẫn có file kết quả archive.
2. **A1 fail thì xử sao?** Mình đề xuất: gọi dev fix ngay, switch sang B+C, không retry quá 1 lần. OK?
3. **Daily ping Trụ E** — mỗi sáng curl 4 endpoint + MCP smoke + ghi 1 dòng. Đến hết T3 chưa fix thì cascade-block dời Round 5. OK?
4. **Trụ B2 (CTĐT Đã duyệt) workaround** — xin dev mở endpoint duyệt nhanh, hoặc SQL update DB? Bạn ưu tiên cái nào, hay để mình tự xử khi gặp?
5. **16 module có thiếu cái nào không?** Mình đã check bảng 17 dòng `02-thu-tu-module.md`, không sót. Nếu bạn thấy thiếu thì flag.

---

## Lịch sử thay đổi

- **2026-04-25 v1.9** — Đổi từ kiểu xếp hàng (seed all → flow all) sang kiểu theo trụ. Lý do: phát hiện bug sớm 1 tuần, trụ độc lập chạy song song, giảm seed-uổng-công khi flow fail. Giữ nguyên 16/16 module + 5 tuần + 5 mục tiêu G1-G9. Bỏ 1 gate hold-for-review. Thêm 5 file `_pillar-*-result.md` archive. R-B2 + R-E là 2 rủi ro mới cần đặt theo dõi.
