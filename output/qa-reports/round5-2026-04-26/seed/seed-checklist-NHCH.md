# Seed Checklist — Ngân hàng câu hỏi (B5 phần 1)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 13:18-13:24 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Nháp` (`NHAP`)
**Màn:** SCR-III-04 tab "Câu hỏi" • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > ngan_hang_ch_variants[1..10]](../../../../input/data/seed-fixture.yaml#L1656)
**SRS:** [FR-III-09 UC28 — Quản lý Ngân hàng câu hỏi](../../../../input/srs-v3/srs-fr-03-dao-tao.md)
**Precondition:** [seed-checklist-NHCH R4](../../round4-2026-04-24/seed/seed-checklist-NHCH.md) ✅ → 7 NHCH R4 vẫn tồn tại trong DB.

---

## Kết quả: ✅ XONG 10/10

**Tóm tắt 1 dòng:** 10/10 NHCH `Nháp` (7 reuse R4 IDs 1..7 + 3 NEW IDs 8..10), cover 5 lĩnh vực × 3 mức độ × 2 loại câu hỏi.

---

## Bảng dữ liệu seed

| # | seqId | Nội dung (rút gọn) | Lĩnh vực | Mức độ | Loại | Đáp án đúng | Có vào kho? |
|---|-------|--------------------|----------|--------|------|-------------|:-----------:|
| 1 | 1 | Theo BLLĐ 2019, lao động phổ thông có HĐ thử việc tối đa bao lâu? | Lao động | Dễ | TN 1 đáp án | "30 ngày" (B) | ✅ (R4 reuse) |
| 2 | 2 | Công ty TNHH 1TV có bắt buộc Ban kiểm soát không? | KDTM (fallback DOANH_NGHIEP) | Trung bình | TN 1 đáp án | "Không bắt buộc" (B) | ✅ (R4 reuse) |
| 3 | 3 | Mức thuế TNDN ưu đãi cho DN khởi nghiệp đổi mới sáng tạo? | Thuế | Khó | TN 1 đáp án | "10% trong 15 năm" (B) | ✅ (R4 reuse) |
| 4 | 4 | Phân tích các bước đăng ký nhãn hiệu tại Cục SHTT VN | Sở hữu trí tuệ | Khó | Tự luận | (TU_LUAN — no options) | ✅ (R4 reuse) |
| 5 | 5 | HĐLĐ có giá trị pháp lý ngay khi ký? | KDTM (fallback HOP_DONG) | Dễ | TN 1 đáp án | "Có giá trị ngay khi ký" (A) | ✅ (R4 reuse) |
| 6 | 6 | Phân tích điều kiện DN giao đất thuê đất theo Luật Đất đai 2024 | Đất đai | Trung bình | Tự luận | (TU_LUAN — no options) | ✅ (R4 reuse) |
| 7 | 7 | Theo Luật Đất đai 2024, thời hạn giao đất tối đa? | Đất đai | Dễ | TN 1 đáp án | "50 năm" (B) | ✅ (R4 reuse) |
| 8 | 8 | DN có vốn nước ngoài thành lập TNHH 1TV cần tỷ lệ vốn tối thiểu? | KDTM (fallback DOANH_NGHIEP) | Trung bình | TN 1 đáp án | "Không giới hạn (theo ngành nghề)" (D) | ✅ NEW |
| 9 | 9 | Phân tích quy trình đăng ký bảo hộ nhãn hiệu quốc tế Madrid... | Sở hữu trí tuệ | Khó | Tự luận | (TU_LUAN — no options) | ✅ NEW |
| 10 | 10 | Mức xử phạt khi DN không đóng BHXH bắt buộc? | Lao động | Dễ | TN 1 đáp án | "12-15% số tiền BHXH" (A) | ✅ NEW |

**Tổng:** 10 vào kho / 0 bị chặn. List paginate "1-10 / 10 mục", entry state `Nháp` cho cả 10.

**UUIDs (cần cho ĐKT THU_CONG seed):**
- NHCH-1: (truncated, query API trả full list)
- NHCH-2: `337c3882-b09b-4d00-ae16-f11ddfcf481a`
- NHCH-3: `f574a99c-4cf2-4c89-a62b-ac08e02a83b6`
- NHCH-4: `eb91a04a-d8b3-48dd-a68d-dce12b56ba01`
- NHCH-5: `21f517f0-e8b5-4179-a70a-39633894a782`
- NHCH-6: `817a5dfa-b03f-4ae0-96af-78d657d81d79`
- NHCH-7: `be624094-4860-4c85-bf02-4c298c11005a`
- NHCH-8: `eeb56a95-c369-4430-8feb-b7f3a72bdd13`
- NHCH-9: `a29aa27f-fa01-444b-b283-c55feee2fe8a`
- NHCH-10: `72ff8b09-630e-4511-aecc-9c3e0bbbed7c`

---

## Ảnh chụp

- [List 10/10 mục NHAP](../screenshots/nhch-b5-list-10of10.png)

---

## Quan sát ngoài SRS (không log bug)

- **O1 — Dropdown Lĩnh vực thiếu DOANH_NGHIEP + HOP_DONG (regression cross-task lần thứ 7).** Render 10 LV (Dân sự / Hình sự / Hành chính / Lao động / Đất đai / HNGD / Kinh doanh thương mại / Khiếu nại tố cáo / Thuế / SHTT). Fixture variant [2] [5] [8] có `linh_vuc_id=DOANH_NGHIEP` hoặc `HOP_DONG` → fallback "Kinh doanh thương mại" (KDTM). SRS FR-III-09 row 2 chỉ định FK → DANH_MUC, không enum → không bug per `feedback_bug_must_have_srs_ref.md`. Cùng obs đã ghi từ R1/R4-HD/R4-NHCH/R4-CTĐT/R4-GV/R5-CTĐT/R5-BG (memories `qa_htpldn_*`).
- **O2 — Spinbutton "Số lượng" trong rule NGAU_NHIEN có quirk attribute `valuemax="0"` `valuemin="1"`** (nghịch lý). MCP `Increase Value` button click bị disabled không tương tác được. Workaround: dùng `fill` trực tiếp value. SRS không spec → cosmetic FE attribute issue, không bug. Cùng obs với KH B3 (memory `qa_htpldn_khoahoc_seed_round5` O4).
- **O3 — Form expand động đúng spec:** chọn `Loại câu hỏi = TN 1 đáp án` → render thêm "Các lựa chọn" + "Đáp án đúng" radio. Chọn `TN nhiều đáp án` → render checkbox đa chọn. Chọn `Tự luận` → KHÔNG render. SRS FR-III-09 row 5 nói `cac_lua_chon Cond` đúng spec. Behavior đúng.
- **O4 — Combobox dropdown behavior 2 cách:** (a) Lĩnh vực có search input (icon search) → type-and-Enter filter OK. (b) Mức độ + Loại câu hỏi không có search → ArrowDown navigation only. Khác behavior cùng combobox component → cosmetic obs, không bug.
- **O5 — JWT revoke không gặp trong session này** (login 13:17 → seed xong 13:24, cùng modal flow ~7 phút) — khác với regression `qa_htpldn_jwt_revoke_aggressive` từ R4. Có thể env BE đã được dev fix.

---

## Cascade impact

- **B5 phần 2 (ĐKT)** UNBLOCK — 10 NHCH đã có UUID đầy đủ.
- **T3.5 Workflow Khóa học** sẵn sàng có pool NHCH đủ 3 mức độ × 5 LV cho ĐKT NGAU_NHIEN sau khi NHCH được publish lên CONG_KHAI.
- **T4.6 Functional Khóa học 40 TC** unblock cho test CRUD NHCH.

---

## Publish workflow (B5b — 2026-04-27 21:25-21:35)

> **Tham chiếu:** [tasks/todo.md §B5b](../../../../tasks/todo.md) + [workflow-test-report-NHCH-PUBLISH.md](../workflow/workflow-test-report-NHCH-PUBLISH.md).

5/5 NHCH publish `Nháp` → `Công khai` qua form Cập nhật field Trạng thái:

| # | NHCH | Lĩnh vực | Mức độ | Loại | State sau B5b |
|:-:|------|----------|--------|------|:------:|
| 1 | NHCH-10 (BHXH) | Lao động | **Dễ** | TN 1 đáp án | ✅ Công khai |
| 2 | NHCH-7 (Giao đất 2024) | Đất đai | **Dễ** | TN 1 đáp án | ✅ Công khai |
| 3 | NHCH-8 (DN vốn nước ngoài) | KDTM (fallback DOANH_NGHIEP) | **Trung bình** | TN 1 đáp án | ✅ Công khai |
| 4 | NHCH-6 (ĐK giao đất thuê đất) | Đất đai | **Trung bình** | Tự luận | ✅ Công khai |
| 5 | NHCH-3 (Thuế TNDN) | Thuế | **Khó** | TN 1 đáp án | ✅ Công khai |

**Pool sau publish:** 2 DE + 2 TB + 1 KHO. Verify list filter `trangThai=CONG_KHAI` = `1-5 / 5 mục` ([screenshot](../screenshots/nhch-b5b-list-filter-CONG_KHAI-5of5.png)).

**5 NHCH còn lại giữ trạng thái Nháp:** NHCH-1 (Lao động/Dễ), NHCH-2 (KDTM/TB), NHCH-4 (SHTT/Khó), NHCH-5 (KDTM/Dễ), NHCH-9 (SHTT/Khó). Để dành cho phase functional test (CRUD/state transition `Nháp` → `Ẩn` chưa test).

---

*2026-04-27 13:24 — Seed 10/10 NHAP. **2026-04-27 21:35 (B5b)** — Publish 5 → CONG_KHAI. QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01`.*
