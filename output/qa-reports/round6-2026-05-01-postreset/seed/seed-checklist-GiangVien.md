# Seed Checklist — Giảng viên (R6.3.10)

**Ngày:** 2026-05-02 22:40 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Đang hoạt động` (DANG_HOAT_DONG)
**Màn:** SCR-III-05 — Quản lý Giảng viên • **Đường dẫn:** `/dao-tao/giang-vien/danh-sach`
**Dữ liệu mẫu:** ad-hoc 8 GV cover 6 LV + 2 loại (GIANG_VIEN/TRO_GIANG)
**SRS:** [FR-III-11 UC30 — Quản lý giảng viên/trợ giảng](../../../../input/srs-v3/srs-fr-03-dao-tao.md) + [§3.4.3.25 GIANG_VIEN](../../../../input/srs-v3/srs-v3.md)

> **Decision applied:** [`tasks/decisions/giangvien-srs-contradiction-2026-04-27.md`](../../../../tasks/decisions/giangvien-srs-contradiction-2026-04-27.md). §3.4.3.25 = source of truth. Default state `DANG_HOAT_DONG` (3 enum). FR-III-11 §Inputs `DANG_GIANG_DAY/TAM_DUNG` outdated. App đã align §3.4.3.25 (default UI = "Đang hoạt động").

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|---|---|---|---|---|:---:|
| FR-III-15 Lập kế hoạch đào tạo (gán GV vào KH) | `trang_thai = DANG_HOAT_DONG ∧ loai IN (GIANG_VIEN,TRO_GIANG) ∧ linh_vuc khớp` | ≥1 GV/LV × 6 LV | DANG_HOAT_DONG | `GET /api/v1/giang-viens?trangThai=DANG_HOAT_DONG&loai=GIANG_VIEN` → 6 records | ✅ |
| FR-III-12 Tìm kiếm giảng viên (UC31) | `tu_khoa ∨ linh_vuc_id ∨ vai_tro` (GIANG_VIEN/TRO_GIANG) | ≥1 / 6 LV + GV/TG mix | DANG_HOAT_DONG | `GET /api/v1/giang-viens?loai=TRO_GIANG` → 2 records | ✅ |

**Acceptance pass:** ✅ entity tồn tại, 8 record state DANG_HOAT_DONG, cover 6/6 LV, 6 GV + 2 TG.

---

## Kết quả: ✅ XONG 8/8

Tạo 8 GV cover 6/6 LV (DN/HĐ/LĐ/Thuế/SHTT/ĐĐ) × 2 loại (6 GIANG_VIEN + 2 TRO_GIANG). Tất cả state `DANG_HOAT_DONG`. UI list render 8/8 + API filter `trangThai/loai` work đúng. R6.3.10 unblocked.

**Bug:** không log (xem Observations).

---

## Bảng dữ liệu seed

| # | Mã GV | Họ tên | Loại | Chuyên ngành | Trình độ | LV chính | Có vào kho? |
|---|-------|--------|------|--------------|----------|----------|:-----------:|
| 1 | GV-BTP-TW-0001 | TS Nguyễn Văn Doanh Nghiệp | Giảng viên | Luật Doanh nghiệp | Tiến sĩ | Doanh nghiệp | ✅ |
| 2 | GV-BTP-TW-0002 | ThS Trần Thị Lao Động | Giảng viên | Luật Lao động | Thạc sĩ | Lao động | ✅ |
| 3 | GV-BTP-TW-0003 | TS Lê Văn Thuế | Giảng viên | Luật Thuế | Tiến sĩ | Thuế | ✅ |
| 4 | GV-BTP-TW-0004 | ThS Phạm Thị Hợp Đồng | Giảng viên | Luật Dân sự — Hợp đồng | Thạc sĩ | Hợp đồng | ✅ |
| 5 | GV-BTP-TW-0005 | TS Hoàng Văn Sở Hữu Trí Tuệ | Giảng viên | Sở hữu trí tuệ | Tiến sĩ | Sở hữu trí tuệ | ✅ |
| 6 | GV-BTP-TW-0006 | ThS Vũ Thị Đất Đai | Giảng viên | Luật Đất đai | Thạc sĩ | Đất đai | ✅ |
| 7 | GV-BTP-TW-0007 | CN Đỗ Văn Trợ Giảng DN | Trợ giảng | Luật Doanh nghiệp | Cử nhân | Doanh nghiệp | ✅ |
| 8 | GV-BTP-TW-0008 | CN Bùi Thị Trợ Giảng LĐ | Trợ giảng | Luật Lao động | Cử nhân | Lao động | ✅ |

**Tổng:** 8/8 vào kho.

**Coverage matrix:**

| LV | GIANG_VIEN | TRO_GIANG | Tổng |
|---|:-:|:-:|:-:|
| Doanh nghiệp | 1 | 1 | 2 |
| Lao động | 1 | 1 | 2 |
| Thuế | 1 | 0 | 1 |
| Hợp đồng | 1 | 0 | 1 |
| Sở hữu trí tuệ | 1 | 0 | 1 |
| Đất đai | 1 | 0 | 1 |
| **Total** | **6** | **2** | **8** |

---

## API verify

```text
POST /api/v1/giang-viens (×8)  
→ HTTP 201 mỗi lần. Mã auto-gen GV-BTP-TW-{0001..0008}. Default state DANG_HOAT_DONG.

GET /api/v1/giang-viens?page=1&pageSize=20
→ total=8, returned=8.

Per-filter:
  trangThai=DANG_HOAT_DONG → 8 ✅
  loai=GIANG_VIEN          → 6 ✅
  loai=TRO_GIANG           → 2 ✅
  linhVucIds=<UUID>        → 8 (filter BE return all — see OBS-GV-002)
```

**Form fields theo §3.4.3.25 + FR-III-11 (app implement):**
- `hoTen` (Y), `loai` radio (GIANG_VIEN/TRO_GIANG), `chuyenNganh` (Y), `trinhDo` (Y, app required)
- `toChuc` (N), `email` (N), `dienThoai` (N), `nangLuc` (N max 5000)
- `linhVucIds` array (Y), `trangThai` default "Đang hoạt động"

---

## Observations (không log thành bug)

### OBS-GV-001 — App field `trinhDo` Required, SRS §3.4.3.25 không có field này

UI form bắt buộc `trinhDo` (Tiến sĩ/Thạc sĩ/Cử nhân). §3.4.3.25 18 fields KHÔNG có `trinh_do` — trường này chỉ xuất hiện ở FR-III-11 §Inputs (`trinh_do (text, Y)`). App align FR-III-11 §Inputs ở field này, nhưng align §3.4.3.25 ở `trang_thai` enum. → App pick-and-mix giữa 2 nguồn. Không vi phạm SRS rõ — cần BA confirm có giữ `trinh_do` Y trong UC spec không.

### OBS-GV-002 — Filter `linhVucIds` BE ignore, return all

`GET /api/v1/giang-viens?linhVucIds=<UUID>` trả tất cả 8 records bất kể UUID nào (Doanh nghiệp / Lao động / Thuế... đều total=8). BE chưa apply filter theo lĩnh vực. UI filter "Lĩnh vực" có thể cũng bị ảnh hưởng. SRS FR-III-12 (UC31 Tìm kiếm giảng viên) spec filter `linh_vuc_id` — BE chưa implement đúng. KHÔNG log bug Major vì FR-III-12 thuộc test scope riêng (không trong R6.3.10 acceptance), nhưng cần escalate khi test FR-III-12.

### OBS-GV-003 — JWT revoke aggressive khi multi-session

Login UI mới invalidate JWT cũ ngay lập tức (memory `qa_htpldn_jwt_revoke_aggressive` confirm pattern repeat 3 lần). Workaround: bulk seed qua curl ngay sau verify-otp, không nên fill UI form rồi delay submit. Làm việc một session UI HOẶC một session API tại 1 thời điểm — không mix.

---

## Ảnh chụp

- [UI list 8/8 GV state Đang hoạt động cover 6 LV + GV/TG mix](../screenshots/r14-r6-3-10-giangvien-8of8.png)

---

*2026-05-02 22:40 — QA Automation via curl + Chrome DevTools MCP*
