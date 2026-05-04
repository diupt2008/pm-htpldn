# Seed Checklist — Bài giảng (B4)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-27 08:18-08:30 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Kích hoạt` (mặc định, `isDeleted=false`)
**Màn:** SCR-III-03 — Kho tài liệu • **Đường dẫn:** `/dao-tao/bai-giang/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > bai_giang_variants](../../../../input/data/seed-fixture.yaml) (v2.5: 8 variant)
**SRS:** [FR-III-07 UC26 — Quản lý tài liệu/bài giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: ✅ XONG 8/8

Reuse 6 record R4 (Bài giảng 01..06, IDs cũ vẫn còn `isDeleted=false`) + seed 2 NEW edge R5: [7] PDF + DOANH_NGHIEP fallback "Kinh doanh thương mại" + [8] VIDEO + THUE + `congKhai=true`. Verify outbound qua `GET /api/v1/bai-giangs?page=1&pageSize=20` reqid=1262 → `meta.total=8`, [8] `congKhai:true` xác nhận.

---

## Bảng dữ liệu seed

| # | Tên bản ghi | Loại | Lĩnh vực | Mã/ID | Có vào kho? |
|---|-------------|------|----------|-------|:-----------:|
| 1 | Bài giảng 01 - Tổng quan Luật Doanh nghiệp | Slide | Kinh doanh thương mại (fallback DOANH_NGHIEP) | `48b293f0-ea73-4a68-adf9-d1cd93cbb695` | ✅ reuse R4 |
| 2 | Bài giảng 02 - Luật Lao động cơ bản | Slide | Lao động | `d96f6c6f-530f-41a9-b58e-14bcb05d7c9d` | ✅ reuse R4 |
| 3 | Bài giảng 03 - Thuế GTGT thực hành | Video | Thuế | `1c970735-c3d7-48fa-a249-f316de4af39e` | ✅ reuse R4 |
| 4 | Bài giảng 04 - Hợp đồng thương mại | Slide | Kinh doanh thương mại (fallback HOP_DONG) | `7757e05e-a308-4fc3-a83f-099a0da87c3d` | ✅ reuse R4 |
| 5 | Bài giảng 05 - Sở hữu trí tuệ | Video | Sở hữu trí tuệ | `f95baecf-8d9e-4830-a89f-5dd2bb2d1054` | ✅ reuse R4 |
| 6 | Bài giảng 06 - Đất đai cơ bản | Slide | Đất đai | `e480b312-661a-4f94-8146-f7fd9a965478` | ✅ reuse R4 |
| 7 | Bài giảng 07 - Pháp luật DN cũ (vô hiệu hóa) | PDF · 1.4MB | Kinh doanh thương mại (fallback DOANH_NGHIEP) | `830684b7-b77d-4078-9f71-e47cbb2aff2f` | ✅ NEW R5 |
| 8 | Bài giảng 08 - Tổng quan thuế quốc tế | Video · `congKhai=true` | Thuế | `ee7b94e3-18c5-437c-98fc-396011e420b0` | ✅ NEW R5 |

**Tổng:** 8 vào kho / 0 bị chặn — list hiển thị "1-8 / 8 mục", `meta.total=8`. [8] `congKhai:true` verify API outbound.

---

## Ảnh chụp

- [Danh sách 6/6 trước seed (R4 reuse)](../screenshots/baigiang-b4-list-6of6-r5.png)
- [Danh sách 8/8 sau seed (R4 reuse + R5 NEW)](../screenshots/baigiang-b4-list-8of8-r5.png)

---

## Quan sát (không log bug — không có SRS clause vi phạm)

- **Fixture [7] `state_target: VO_HIEU_HOA` mismatch SRS** — SRS FR-III-07 §Inputs (8 row) + §Outputs (7 row) + §3.4.3.20 BAI_GIANG đều **không có field `trang_thai`/state**. Form FE đúng SRS (chỉ toggle `cong_khai` boolean). → Fixture thừa so với SRS, **không phải bug FE thiếu trường**. Cần BA confirm: bỏ `state_target` trong fixture v2.6 hoặc bổ sung field state vào SRS rồi mới yêu cầu FE expose. Seed [7] hiện ở state mặc định `isDeleted=false` + `congKhai=false`.
- **Lĩnh vực dropdown thiếu `DOANH_NGHIEP` + `HOP_DONG`** — regression cross-task **lần 6** (NHCH R1, NHCH R4, HOI_DAP R4, BAI_GIANG R4, GV R4, BAI_GIANG R5). Fallback "Kinh doanh thương mại" tiếp tục dùng. Hiện đã có POST-01 backlog `tasks/todo.md` để mở rộng Tier 0 fixture sau Round 5 — chưa fix BE.
- **JWT revoke aggressive ~1-2 phút** — pattern memory `qa_htpldn_jwt_revoke_aggressive`. Seed B4 cần 5 lần re-login + soft-navigate `history.pushState` thay `navigate_page` để giữ session khi mở modal. ENV-block nghi ngờ cấu hình BE session timeout. Đề nghị dev BE verify lại token TTL (hiện claim `exp: 15min` nhưng thực tế ~1-2 phút).
- **Form Slide/PDF dùng textbox "File URL (URL MinIO)" + spinbutton "Dung lượng (bytes)"** thay vì file picker upload structured (SRS FR-III-07 dòng 4 ngụ ý multipart) — observation từ R4 vẫn còn.
- **Form Video render field riêng "YouTube URL" required** thay "File URL" + "Dung lượng" — đúng SRS dòng 5, đổi schema theo `loaiTaiLieu` chọn.
- **Field `anh_dai_dien` (SRS dòng 7) thiếu UI** — response BE trả `anhDaiDien:null` → BE có field nhưng FE chưa expose.
- **Combobox Lĩnh vực single-select** — SRS dòng 6 `linh_vuc_ids[]` ngụ ý multi.
- **Bản ghi #1 R4 còn cosmetic `fileUrl` nối `slides/baigiang-01.pdfslides/baigiang-01.pptx`** từ MCP `fill` quirk APPEND — không cản trở downstream.
- **Loại tài liệu dropdown có 5 mục (SLIDE/PDF/Slide/PDF/Video)** — duplicate enum SLIDE vs. Slide, PDF vs. PDF. Có thể là FE render lẫn raw enum + label. Khoanh vùng để FR-III-07 R6 verify nếu BA quan tâm.

---

*2026-04-27 08:18-08:30 — QA chạy bằng Chrome DevTools MCP*
