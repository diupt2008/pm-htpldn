# Seed Checklist — Giảng viên (T2.A5e)

**Ngày:** 2026-04-25 22:24-22:32 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Đang hoạt động` (BE enum `DANG_HOAT_DONG`)
**Màn:** SCR-III-05 — Giảng viên / Trợ giảng (sub-menu 4) • **Đường dẫn:** `/dao-tao/giang-vien/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > giang_vien_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-11 UC30 — Quản lý giảng viên, trợ giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: ✅ XONG 6/6

Tạo đủ 6 giảng viên `GV-BTP-TW-0001..0006` (BE auto-gen, BR-DATA-04 pattern), entry state `DANG_HOAT_DONG`. Phát hiện 3 SRS-ref bug (1 Major + 2 Medium) + 3 obs.

**Bug:**
- [`BUG-GV-001-R4`](../bug-reports/bug-report-seed-giangvien-t2a5e.md) Major — Form thiếu `file_dinh_kem` (SRS §Inputs row 10).
- [`BUG-GV-002-R4`](../bug-reports/bug-report-seed-giangvien-t2a5e.md) Medium — Enum `trang_thai` BE = `DANG_HOAT_DONG` ≠ SRS = `DANG_GIANG_DAY/TAM_DUNG` (UI thêm enum thứ 3 `Vô hiệu hóa`).
- [`BUG-GV-003-R4`](../bug-reports/bug-report-seed-giangvien-t2a5e.md) Medium — List thiếu cột `Lĩnh vực` (SRS §Outputs).

---

## Bảng dữ liệu seed

| # | Họ tên | Chuyên ngành | Trình độ | Lĩnh vực (đã chọn) | Mã (auto-gen) | Có vào kho? |
|---|--------|--------------|----------|--------------------|---------------|:-----------:|
| 1 | GS.TS Trần Giảng Viên | Luật dân sự | Tiến sĩ | Kinh doanh thương mại ¹ | GV-BTP-TW-0001 | ✅ |
| 2 | PGS.TS Lê Sư Phạm | Luật kinh tế | Tiến sĩ | Thuế ¹ | GV-BTP-TW-0002 | ✅ |
| 3 | ThS. Phạm Trẻ Trung | Luật lao động | Thạc sĩ | Lao động | GV-BTP-TW-0003 | ✅ |
| 4 | TS. Hoàng SHTT | Sở hữu trí tuệ | Tiến sĩ | Sở hữu trí tuệ | GV-BTP-TW-0004 | ✅ |
| 5 | ThS. Vũ Thuế | Luật thuế | Thạc sĩ | Thuế | GV-BTP-TW-0005 | ✅ |
| 6 | GS. Đỗ Hoàng | Luật hành chính | Tiến sĩ | Đất đai ¹ | GV-BTP-TW-0006 | ✅ |

¹ Fallback: fixture yêu cầu `DOANH_NGHIEP`/`HOP_DONG` nhưng dropdown lĩnh vực chỉ có 10 option chuẩn TT17, thiếu 2 enum này (regression cross-round, lặp pattern qa_htpldn_baigiang_seed_round4 + qa_htpldn_ctdt_seed_round4 — đây không phải bug app, SRS không có clause).

**Tổng:** 6 vào kho / 0 bị chặn.

---

## Verify enum BE (POST/GET response)

| reqid | Method | URL | Status | Note |
|-------|--------|-----|--------|------|
| 123, 130, 135, 139, 144, 148 | POST | `/api/v1/giang-viens` | 201 | 6 record persist |
| 150 | GET | `/api/v1/giang-viens?page=1&pageSize=20` | 200 | Tất cả 6 record có `trangThai: "DANG_HOAT_DONG"` |

**Trích response:**
```json
{"maGiangVien":"GV-BTP-TW-0001","hoTen":"GS.TS Trần Giảng Viên","loai":"GIANG_VIEN","trangThai":"DANG_HOAT_DONG","soKhoaDaDay":0,"taiKhoanId":null}
```

**Kết luận state:** UI label "Đang hoạt động" map BE enum `DANG_HOAT_DONG`. Fixture viết `state_target: "ĐANG HOẠT ĐỘNG"` đúng với implementation, nhưng cả implementation lẫn fixture đều **mismatch SRS** (DANG_GIANG_DAY/TAM_DUNG) → log BUG-GV-002-R4.

---

## Observations (không SRS-ref, không log bug)

- **OBS-1 — Dropdown lĩnh vực thiếu DOANH_NGHIEP + HOP_DONG (regression 5th cross-round).** 10 option DM TT17 chuẩn, thiếu 2 enum mở rộng. Cùng pattern T2.A1 (Hỏi đáp), T2.A5a (CTĐT), T2.A5c (Bài giảng), T2.A5d (NHCH). Đây là gap DM, không phải bug Giảng viên — đã có obs trên các module trước.
- **OBS-2 — Form có field `Loại` (radio Giảng viên/Trợ giảng) là Y bắt buộc.** SRS FR-III-11 §Inputs không liệt kê field này (chỉ FR-III-12 §Inputs có `vai_tro N text`). Implementation thăng hạng N→Y → cần BA confirm là enrichment hay deviation.
- **OBS-3 — Validation lần 1 fail vì radio `Loại` không default check.** Phải click radio "Giảng viên" rồi submit lại. Field Y nhưng không có default value → friction nhỏ, có thể UX improvement.

---

## Ảnh chụp

- [seed-gv-list-6-6.png](../screenshots/seed-gv-list-6-6.png) — list 6/6 record sau khi seed
- [seed-gv-001-form-pre-submit.png](../screenshots/seed-gv-001-form-pre-submit.png) — form GV-1 trước submit (verify field layout)
- [seed-gv-filter-trangthai-3-enum.png](../screenshots/seed-gv-filter-trangthai-3-enum.png) — filter Trạng thái dropdown 3 enum (Đang hoạt động/Tạm dừng/Vô hiệu hóa) ≠ SRS 2 enum

---

## Cascade

UNBLOCK T3 nếu workflow GV (NV→PD) có; T4.6 Functional Khóa học (cần seed GV để map vào KHOA_HOC). T2.A5b vẫn block (CTĐT chưa duyệt) → KHOA_HOC chưa tạo được → GV chưa map được → tab "Lịch sử giảng dạy" đợi.

---

*2026-04-25 22:32 — QA chạy bằng Chrome DevTools MCP*
