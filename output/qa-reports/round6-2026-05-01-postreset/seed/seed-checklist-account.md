# Seed Checklist — Account login (R6.2.7)

**Ngày:** 2026-05-01 18:30 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `Chờ kích hoạt`
**Màn:** SCR-VIII-02 — Quản lý tài khoản • **Đường dẫn:** `/quan-tri/tai-khoan`
**Dữ liệu mẫu:** [seed-fixture.yaml > cap_tai_khoan_cg_nht_r5](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-VIII-02 — Quản lý tài khoản & phân quyền

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | Status |
|-----------------|------------------------|---------------|:---:|
| R6.2.8 FK link `TU_VAN_VIEN.tai_khoan_id` | `username IN (cg_tw_01..06, nht_ag_01, nht_dn_01, nht_hp_01)` | 9 TK | ✅ |
| R6.4.A5 TVCS phân công CG | `loaiTaiKhoan=Chuyên gia ∧ trangThai=HOAT_DONG` | ≥1 CG TW Hoạt động | ⏳ chờ kích hoạt |
| R6.4.A3 VV phân công NHT | `vaiTro=Người hỗ trợ ∧ donVi=Sở TP địa phương` | ≥1 NHT/3 ĐP | ⏳ chờ kích hoạt |

**Acceptance pass khi:** 9 TK đã tạo (state = "Chờ kích hoạt") → cần kích hoạt sang "Hoạt động" để R6.2.8/A3/A5 pass.

---

## Kết quả: ✅ XONG 9/9

Tạo 9 tài khoản qua modal SCR-VIII-02. Mỗi TK PASS với UUID. Toast "Tạo tài khoản thành công. Email kích hoạt đã được gửi." Tất cả ở state `Chờ kích hoạt` — cần kích hoạt thủ công bằng button [Kích hoạt] inline trước khi login.

**Bug:** không có (workflow create account hoạt động đúng).

---

## Bảng dữ liệu seed

| # | Username | Họ tên | Đơn vị | Loại TK | Vai trò | UUID | Có vào kho? |
|---|----------|--------|--------|---------|---------|------|:-----------:|
| 1 | cg_tw_01 | Chuyên gia TW 01 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `b2ab3c2e-4d19-44c0-85c2-bec4c7c62d75` | ✅ |
| 2 | cg_tw_02 | Chuyên gia TW 02 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `9c6df2d4-8dd0-4808-9787-2cff1a9fe373` | ✅ |
| 3 | cg_tw_03 | Chuyên gia TW 03 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `cc1d412a-7d8a-4b48-9d62-2fc27694c256` | ✅ |
| 4 | cg_tw_04 | Chuyên gia TW 04 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `71df0466-d472-4753-829f-538ec48ed84e` | ✅ |
| 5 | cg_tw_05 | Chuyên gia TW 05 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `8882a07f-b37b-4cd8-8814-64ad4139912c` | ✅ |
| 6 | cg_tw_06 | Chuyên gia TW 06 | Cục Bổ trợ tư pháp - Bộ Tư pháp | Chuyên gia | Chuyên gia tư vấn | `c360292e-b4bf-4d42-a09f-af3a26085cd1` | ✅ |
| 7 | nht_ag_01 | Người hỗ trợ An Giang 01 | Sở Tư pháp An Giang | Người hỗ trợ | Người hỗ trợ | `4b870548-4581-47b7-9f5e-b0cc3e2dac2f` | ✅ |
| 8 | nht_dn_01 | Người hỗ trợ Đơn vị 01 | Sở Tư pháp Bắc Giang | Người hỗ trợ | Người hỗ trợ | `8efadd52-8c33-4eca-9b16-b1adb526ffe5` | ✅ |
| 9 | nht_hp_01 | Người hỗ trợ Hỗ trợ PL 01 | Sở Tư pháp Bắc Ninh | Người hỗ trợ | Người hỗ trợ | `d28f4cc3-5131-4084-b4a7-598c2a10c4d9` | ✅ |

**Tổng:** 9 vào kho / 0 bị chặn.

---

## Adapt fixture (do app convention)

| Spec gốc fixture | App seed thực tế | Lý do |
|---|---|---|
| `nht_dn_01` → "Sở TP Đà Nẵng" | "Sở Tư pháp Bắc Giang" | App không có Đà Nẵng. CLAUDE.md convention: AG/BG/BNI thay HN/HP/DN |
| `nht_hp_01` → "Sở TP Hải Phòng" | "Sở Tư pháp Bắc Ninh" | App không có Hải Phòng. Adapt như trên |
| `vai_tro: NHT` (string raw) | "Người hỗ trợ" | App display label, FK enum giữ nguyên |
| `vai_tro: CG` (string raw) | "Chuyên gia tư vấn" | Tương tự, app dùng vai_tro_id riêng |

Username giữ theo fixture spec (nht_dn_01, nht_hp_01) — không reflect đơn vị thực tế.

---

## Việc cần làm tiếp (sau BE recover)

1. **Kích hoạt 9 TK:** click button [Kích hoạt] inline cho mỗi row → state `Hoạt động`. Hoặc test xem OTP bypass `666666` có chấp nhận state "Chờ kích hoạt" không (handoff §1).
2. **Verify login:** thử login `cg_tw_01 / Secret@123 / 666666` — nếu fail → cần activate trước.
3. **R6.2.8 FK link:** sau khi cả 9 active, mở module Quản lý CG/TVV để verify FK link giữa profile (TVV-0001..0008 hiện tại) và tài khoản.

---

## Ảnh chụp

- [r6-cg-tw-01-form-filled.png](../screenshots/r6-cg-tw-01-form-filled.png) — Modal tạo cg_tw_01 đã fill xong
- [r6-r62.7-9-accounts-created.png](../screenshots/r6-r62.7-9-accounts-created.png) — Danh sách 9 TK + tab "Chờ kích hoạt 9"

---

## Pattern MCP đã verify (form Thêm tài khoản mới)

Form 9 field bắt buộc — app SCR-VIII-02 modal:
- Tên đăng nhập, Họ tên, Email, Điện thoại — textbox
- Loại tài khoản — combobox (`Cán bộ` / `Người hỗ trợ` / `Tư vấn viên` / `Chuyên gia` / `Doanh nghiệp` / `Quản trị hệ thống`)
- Đơn vị — combobox 70+ option (filter qua type text)
- Mật khẩu + Nhập lại mật khẩu — textbox password
- Vai trò — combobox 10 option (filter theo Loại TK)

**Time/account:** ~30s/TK, 9 TK = ~5 phút. Không gặp BUG-FUNC-TVV-002 (không có dropdown LV multi-select).

**Workaround note:** combobox "Đơn vị" filter qua type text. "Người xử lý" trong PC config filter empty khi type username — phải clear filter và chọn theo hiển thị tên (`CB Nghiệp vụ TW 01`).

---

*2026-05-01 18:30 — QA chạy bằng Chrome DevTools MCP*
