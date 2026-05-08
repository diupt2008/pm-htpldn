# Seed Checklist — Bài giảng (R7.3.10 — R8 hoàn tất 8/8)

**Ngày:** 2026-05-08 20:48–20:50 • **Tài khoản:** `cb_nv_tw_02` • **Trạng thái mong đợi:** active (BG entity dùng trường `congKhai` boolean, không có state machine `KICH_HOAT/VO_HIEU_HOA` — observation R8)
**Màn:** SCR-III-03 — Kho tài liệu • **Đường dẫn:** `/dao-tao/bai-giang/danh-sach`
**Dữ liệu mẫu:** chưa có trong [seed-fixture.yaml](../../../../../input/data/seed-fixture.yaml) — improvise theo SRS Inputs FR-III-07
**SRS:** [FR-III-07 UC26 — Quản lý kho tài liệu, bài giảng](../../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-07)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho task downstream sẽ đọc data này.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.B10 — Workflow ĐKT FR-III-NEW-03 | `bai_giang_ids: identifier[], N | FK → BAI_GIANG (N-N)` (FR-III-NEW-03 Inputs row 3) | ≥1 BG để map vào ĐKT | active (không có state field per impl) | `GET /api/v1/bai-giangs?page=1&pageSize=20` → `total >= 1` | ✅ (8 active) |
| R7.7.6 — Khóa học 40 TC | `bai_giang_ids: identifier[], N | FK → BAI_GIANG (N-N)` (FR-III-01 KH Inputs row 10) | ≥1 BG cover các loại + LV | active | Cùng API | ✅ |

**Acceptance pass khi:** ✅ R7.4.B10 + R7.7.6 sẵn sàng dùng — 8 BG cover 3 loại (VIDEO/SLIDE/PDF) + 7 LV.

**Quy tắc 2026-05-02 R11:** BG entity **không có state machine** `NHAP/KICH_HOAT/VO_HIEU_HOA` như task R7 ban đầu giả định. SRS FR-III-07 Inputs không định nghĩa `trang_thai` field — chỉ có `cong_khai` boolean (Switch công khai chuyên trang). Task title cũ R7 ghi "KICH_HOAT" là spec drift — đã cập nhật task description.

---

## Kết quả: ✅ XONG 8/8

Hoàn tất R7.3.10 R8 — seed thêm **3 record (1 SLIDE + 2 PDF)** lên trên 5 VIDEO cũ R7. Final 8 records cover 3 loại × 7 LV. Dùng API atomic `POST /api/v1/bai-giangs` (JSON body) + `PATCH` follow-up cho `fileUrl + dungLuong` (BE schema serialize 2 field separate, không phải nested `fileBaiGiang`).

**Bug:** [bug-report-bai-giang-r7-3-10.md](../../bug-reports/dao-tao/bug-report-bai-giang-r7-3-10.md) — 1 Major BE missing validation `fileBaiGiang/urlYoutube` theo `loaiTaiLieu` (vi phạm SRS FR-III-07 Inputs row 4-5 + Error Handling E2/E3).

---

## Bảng dữ liệu seed (R8 round)

| # | ID prefix | Tên bài giảng | Loại | LV | File URL | Dung lượng | Round |
|---|-----------|---------------|:----:|---|----------|:----------:|-------|
| 1 | `f39f4b89` | Bài giảng 03 - Thuế GTGT thực hành | VIDEO | Thuế | youtube.com/watch?v=TEST_003 | — | R7 |
| 2 | `c8ebce76` | Bài giảng 02 - Luật Lao động cơ bản | VIDEO | Lao động | youtube.com/watch?v=TEST_002_BLLD | — | R7 |
| 3 | `d161e5cd` | Bài giảng 04 - Hợp đồng thương mại | VIDEO | (—) | youtube.com/watch?v=TEST_004_HD | — | R7 |
| 4 | `6e21b34b` | Bài giảng 05 - Sở hữu trí tuệ | VIDEO | SHTT | youtube.com/watch?v=TEST_005_SHTT | — | R7 |
| 5 | `39a3b98c` | Bài giảng 06 - Đất đai cơ bản | VIDEO | Đất đai | youtube.com/watch?v=TEST_006_DAT_DAI | — | R7 |
| 6 | **`fdb2b165`** | **Bài giảng 07 - Quản lý Hành chính DN (Slide)** | **SLIDE** | **Hành chính** | `/uploads/bai-giang/07-hanh-chinh-doanh-nghiep.pptx` | **2.4 MB** | **R8 mới** ✅ |
| 7 | **`5d7ea66b`** | **Bài giảng 08 - Bộ luật Dân sự 2015 (PDF)** | **PDF** | **Dân sự** | `/uploads/bai-giang/08-bo-luat-dan-su-2015.pdf` | **4.6 MB** | **R8 mới** ✅ |
| 8 | **`05f2ad96`** | **Bài giảng 09 - Luật Doanh nghiệp 2020 cập nhật (PDF)** | **PDF** | **Doanh nghiệp** | `/uploads/bai-giang/09-luat-doanh-nghiep-2020.pdf` | **5.4 MB** | **R8 mới** ✅ |

**Tổng:** 8 active / 0 bị chặn.

---

## Verify coverage (kiểm tra 2026-05-08 20:50)

| Filter | Coverage | Note |
|--------|----------|------|
| **Tổng** | 8 | UI list 1-8/8 mục |
| **Loại tài liệu (3 loại)** | 3 | VIDEO:5, PDF:2, SLIDE:1 ✅ |
| **Lĩnh vực (7 LV unique)** | 7 | Doanh nghiệp + Dân sự + Hành chính + Lao động + SHTT + Thuế + Đất đai ✅ |
| **Có file URL** | 8/8 | 5 VIDEO YouTube link + 3 PDF/Slide /uploads/ |
| **Dung lượng (chỉ SLIDE/PDF)** | 3/3 | 2.4 MB + 4.6 MB + 5.4 MB |

→ Cover **vượt yêu cầu** (≥5 LV → 7 LV; 3 loại đủ để test filter dropdown).

---

## Note kỹ thuật — schema POST /bai-giangs

Schema input vs output không khớp 1-1 (BE dùng ORM relation):

**INPUT (POST/PATCH body):**
```json
{
  "tenBaiGiang": "string (Y)",
  "moTa": "string (Y)",
  "loaiTaiLieu": "VIDEO | SLIDE | PDF (Y)",
  "fileUrl": "string (path/URL)",     // ← thay vì SRS field "file_bai_giang"
  "dungLuong": "number (bytes)",       // ← thay vì SRS field "size"
  "linhVucIds": "UUID[] (relation input)",
  "congKhai": "boolean (default false)"
}
```

**OUTPUT (GET response):**
```json
{
  "fileUrl": "...",
  "dungLuong": 123,
  "linhVucs": [{ id, ma, ten, ... }],   // ← FE render từ array này (relation hydrate)
  "congKhai": false,
  // KHÔNG có "trangThai" field — confirm BG không state machine
}
```

**Spec drift:** SRS FR-III-07 Inputs row 4 ghi `file_bai_giang` (single nested field) — impl thực tách thành 2 field `fileUrl + dungLuong` flat. Không phải bug nhưng cần BA cập nhật SRS field naming.

---

## So sánh round (R7 → R8)

| Round | Total | VIDEO | SLIDE | PDF | LV count |
|-------|:-----:|:-----:|:-----:|:---:|:--------:|
| R7 (2026-05-07) | 5 | 5 | 0 | 0 | 5 |
| **R8 (2026-05-08 20:48)** | **8** | **5** | **1** | **2** | **7** ✅ |

---

## Probe diagnostic phụ trợ — discovery validation gap

**6 records test `fileBaiGiang` shape** (đã CLEANUP DELETE):
- Tất cả 6 shape (null, string URL, object {url,name,size}, object {fileUrl,fileName}, object {id,name}, omitted) đều trả `201 Created` cho `loaiTaiLieu: PDF` — vi phạm SRS Inputs row 4 "Cond: bắt buộc nếu SLIDE/PDF" + Error E2 "ERR-BG-02 sai định dạng".
- BE silent drop nested `fileBaiGiang` object, lưu `fileUrl=null, dungLuong=null` — không có guard schema.
- → Log Major bug.

---

## Ảnh chụp

- [Final UI list 8 bài giảng (3 loại + 7 LV)](r7-3-10-bai-giang-list-8-final.png) — Tab "Kho tài liệu" hiển thị icon `file-pdf`/`file-image` (Slide)/`play-square` (Video) đầy đủ.

---

*2026-05-08 20:50 — QA chạy bằng Chrome DevTools MCP (cb_nv_tw_02). Direct API atomic seed + PATCH (né JWT revoke). MCP `upload_file` tool không cần dùng do BE accept JSON body với fileUrl string trực tiếp.*
