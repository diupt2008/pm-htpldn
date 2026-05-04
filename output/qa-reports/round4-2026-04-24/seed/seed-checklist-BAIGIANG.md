# Seed Checklist — Bài giảng (T2.A5c)

**Ngày:** 2026-04-25 21:35-21:40 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Kích hoạt` (mặc định, `isDeleted=false` + `congKhai=false`)
**Màn:** SCR-III-03 — Kho tài liệu • **Đường dẫn:** `/dao-tao/bai-giang/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > bai_giang_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-07 UC26 — Quản lý tài liệu/bài giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: ✅ XONG 6/6

Tạo đủ 6 bài giảng (4 Slide + 2 Video) qua nút `[+ Thêm bài giảng]`. Bản ghi #1 phải làm lại 1 lần do BE chỉ chấp nhận đuôi `.pptx` cho loại Slide trong khi seed-fixture viết `.pdf` — đổi đuôi rồi gửi lại OK. Bài giảng là entity riêng (không cần Khoá học cha) → seed độc lập, không bị chặn bởi T2.A5b.

**Bug:** `BUG-BG-EXT-R4` Major — BE strict ext SLIDE → `.pptx` (SRS FR-III-07 dòng 4 viết `.pptx/.pdf` không phân biệt theo loại). Chi tiết trong mục Quan sát bên dưới.

---

## Bảng dữ liệu seed

| # | Tên bản ghi | Loại | Lĩnh vực | Mã/ID | Có vào kho? |
|---|-------------|------|----------|-------|:-----------:|
| 1 | Bài giảng 01 - Tổng quan Luật Doanh nghiệp | Slide | Kinh doanh thương mại (fallback DOANH_NGHIEP) | `48b293f0-ea73-4a68-adf9-d1cd93cbb695` | ✅ |
| 2 | Bài giảng 02 - Luật Lao động cơ bản | Slide | Lao động | `d96f6c6f-530f-41a9-b58e-14bcb05d7c9d` | ✅ |
| 3 | Bài giảng 03 - Thuế GTGT thực hành | Video | Thuế | `1c970735-c3d7-48fa-a249-f316de4af39e` | ✅ |
| 4 | Bài giảng 04 - Hợp đồng thương mại | Slide | Kinh doanh thương mại (fallback HOP_DONG) | `7757e05e-a308-4fc3-a83f-099a0da87c3d` | ✅ |
| 5 | Bài giảng 05 - Sở hữu trí tuệ | Video | Sở hữu trí tuệ | `f95baecf-8d9e-4830-a89f-5dd2bb2d1054` | ✅ |
| 6 | Bài giảng 06 - Đất đai cơ bản | Slide | Đất đai | `e480b312-661a-4f94-8146-f7fd9a965478` | ✅ |

**Tổng:** 6 vào kho / 0 bị chặn — list "1-6 / 6 mục", `meta.total=6`, cả 6 bản ghi `isDeleted=false` + `congKhai=false`.

---

## Ảnh chụp

- [Danh sách rỗng đầu phiên](../screenshots/baigiang-t2a5c-empty-init.png)
- [Danh sách 6/6 sau seed](../screenshots/baigiang-t2a5c-pass-6of6-list.png)

---

## Quan sát

- **Bug Major:** Fixture YAML viết `slides/baigiang-XX.pdf` cho Slide → BE trả 400 `ERR-BG-SLIDE-EXT` "File SLIDE phải có đuôi .pptx". Workaround đổi `.pdf` → `.pptx`. Cần BA quyết: SRS sửa rõ ext theo loại, hoặc fixture đổi đuôi, hoặc BE relax accept cả 2.
- **Lĩnh vực thiếu DOANH_NGHIEP + HOP_DONG** — regression 4th time (NHCH R1, NHCH R4, HOI_DAP R4, BAI_GIANG R4). Fallback "Kinh doanh thương mại".
- **Form Slide/PDF dùng textbox "File URL" + spinbutton "Dung lượng (bytes)"** thay vì file picker upload structured (SRS FR-III-07 dòng 4 ngụ ý multipart). Form Video render field riêng "YouTube URL" — đúng SRS dòng 5.
- **Field `anh_dai_dien` (SRS dòng 7) thiếu UI** — response BE trả `anhDaiDien:null` ngụ ý field exists BE nhưng FE chưa expose.
- **Combobox Lĩnh vực single-select** — SRS dòng 6 `linh_vuc_ids[]` ngụ ý multi.
- **MCP `fill` quirk** — gọi 2 lần liên tiếp APPEND thay REPLACE → fileUrl bản ghi #1 bị nối `slides/baigiang-01.pdfslides/baigiang-01.pptx`. Cosmetic, không cản trở downstream (dùng `id` + `linhVucIds`).
- **SRS §3.4.3.20 BAI_GIANG không có field state/trang_thai** — fixture viết `state_target: "KÍCH HOẠT"` không map field BE. Verify state qua `isDeleted=false` + `congKhai=false`.

---

*2026-04-25 21:35-21:40 — QA chạy bằng Chrome DevTools MCP*
