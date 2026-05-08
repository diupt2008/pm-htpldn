# Bug Report — R7.0.6 FR-07 SCR-V.III-01 UI button gap

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation (Claude Code via MCP) |
| **Ngày** | 2026-05-06 |
| **Loại test** | Pre-test UI surface audit (R7.0.6) |
| **Round** | R7 (post SRS update 2026-05-05) |
| **Tài liệu tham chiếu** | [ui-surface-audit.md](../../seed/cross-module/ui-surface-audit.md) · [srs-fr-07-doanh-nghiep.md](../../../../../input/srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md) |

---

## Tổng hợp

UI surface audit R7.0.6 phát hiện 2 button trên SCR-V.III-01 (Quản lý DN) vẫn còn render mặc dù SRS update FR-07 (BA chốt 2026-05-05) đã quy định BỎ. Cả 2 đều cho phép CB Nghiệp vụ tạo DN bypass FR-VIII-22 self-registration → DN không có TK liên kết, vi phạm quy tắc TK-first.

**Re-test 2026-05-06 (sau dev fix):** ✅ Cả 2 bug RESOLVED. Action bar SCR-V.III-01 nay chỉ còn 4 button đúng spec.

### Severity breakdown

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 2    | 0        | 2     | 0      | 0     | 0       |

## Bug Summary Table

| Bug ID | Severity | Priority | Type | TC Ref | **SRS Reference** | Title | Status |
|--------|----------|----------|------|--------|-------------------|-------|--------|
| ~~FR07-UI-001~~ | Major | P1 | UI/UX | R7.0.6 C1 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:83 + 128 + 295` | SCR-V.III-01 vẫn còn button [Thêm mới] — sai SRS update FR-07 (BỎ vì DN tạo qua self-reg FR-VIII-22) | **Closed** |
| ~~FR07-UI-002~~ | Major | P1 | UI/UX | R7.0.6 C2 | `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:283-285 + 295` | SCR-V.III-01 vẫn còn button [Import Excel] — FR-V.III-NEW-01 đã BỎ (BA chốt 2026-05-05) | **Closed** |

---

## ~~FR07-UI-001~~ [CLOSED] — SCR-V.III-01 vẫn còn button [Thêm mới] (sai SRS update FR-07)

> **Re-test:** 2026-05-06 — ✅ PASS (Closed-verified). Action bar nay chỉ render 4 button `[Tìm kiếm] [Xóa bộ lọc] [Xuất Excel] [Làm mới]`. Button [Thêm mới] đã bị BỎ. Match `srs-fr-07-doanh-nghiep.md:83+128+295`. Screenshot: [r7-0-6-fr-07-dn-buttons-RESOLVED.png](../../screenshots/r7-0-6-fr-07-dn-buttons-RESOLVED.png).
> **Re-test:** 2026-05-07 R8 — ✅ PASS (Closed-verified, lần 2). Action bar SCR-V.III-01 vẫn chỉ 4 button đúng spec, không có [Thêm mới]. Screenshot: [r8-verify-2026-05-07-fr07-dn-buttons-still-removed.png](../../screenshots/r8-verify-2026-05-07-fr07-dn-buttons-still-removed.png).

### Mô tả

SCR-V.III-01 "Quản lý Doanh nghiệp" (`/doanh-nghiep/danh-sach`) vẫn render button `[plus Thêm mới]` (uid `40_30`) cho role CB_NV_TW. Theo SRS update FR-07 chốt 2026-05-05, DN được tạo qua self-registration FR-VIII-22 (TK-first), CB Nghiệp vụ KHÔNG còn quyền tạo DN trực tiếp. Button này nếu user click có thể tạo DN bypass FR-VIII-22 → DN không có TK liên kết, vi phạm quy tắc TK-first + scope FR-07.

### Các bước tái hiện

1. Login `cb_nv_tw_01 / Secret@123 / OTP 666666` qua MCP (R7.0.4 PASS).
2. Click sidebar "Quản lý doanh nghiệp được hỗ trợ".
3. Quan sát thanh action trên table (uid `40_28..40_33`).

### Kết quả mong đợi

- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:83`: "Hỗ trợ Xem / Tìm / Cập nhật / Xóa mềm + xem lịch sử hỗ trợ + xuất Excel. **KHÔNG có chức năng 'Thêm mới'** — DN được tạo qua self-registration (FR-VIII-22 ở srs-fr-10) hoặc qua các luồng nghiệp vụ khác".
- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:128`: "**Thêm mới:** **BỎ** — DN được tạo qua self-registration (FR-VIII-22 ở srs-fr-10), CB Nghiệp vụ không tạo DN trực tiếp. CB Nghiệp vụ muốn tạo vụ việc cho DN nào → DN đó phải có TK trong hệ thống trước (do DN tự đăng ký)."
- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:295`: SCR-V.III-01 "**KHÔNG có nút 'Thêm mới' / 'Import Excel'**".
- Action bar trên table chỉ có: `[Tìm kiếm] [Xóa bộ lọc] [Xuất Excel] [Làm mới]`.

### Kết quả thực tế

Action bar render 6 button: `[Tìm kiếm] [Xóa bộ lọc] [Thêm mới] [Import Excel] [Xuất Excel] [Làm mới]`. Button `[plus Thêm mới]` (uid `40_30`) visible, click sẽ navigate vào form tạo DN.

Snapshot a11y tree (R7.0.6 verify):

```
uid=40_28 button "search Tìm kiếm"
uid=40_29 button "clear Xóa bộ lọc"
uid=40_30 button "plus Thêm mới"        ← phải BỎ (FR07-UI-001)
uid=40_31 button "upload Import Excel"  ← phải BỎ (FR07-UI-002)
uid=40_32 button "download Xuất Excel"
uid=40_33 button "reload Làm mới"
```

### Bằng chứng

![FR07-UI-001 — SCR-V.III-01 vẫn còn button [Thêm mới]](../../screenshots/r7-0-6-fr-07-dn-buttons-still-present.png)

---

## ~~FR07-UI-002~~ [CLOSED] — SCR-V.III-01 vẫn còn button [Import Excel] (sai SRS update FR-07)

> **Re-test:** 2026-05-06 — ✅ PASS (Closed-verified). Button [Import Excel] đã bị BỎ khỏi action bar. Match `srs-fr-07-doanh-nghiep.md:283-285+295`. Screenshot: [r7-0-6-fr-07-dn-buttons-RESOLVED.png](../../screenshots/r7-0-6-fr-07-dn-buttons-RESOLVED.png).
> **Re-test:** 2026-05-07 R8 — ✅ PASS (Closed-verified, lần 2). Button [Import Excel] vẫn không hiện trong action bar SCR-V.III-01. Screenshot: [r8-verify-2026-05-07-fr07-dn-buttons-still-removed.png](../../screenshots/r8-verify-2026-05-07-fr07-dn-buttons-still-removed.png).

### Mô tả

SCR-V.III-01 vẫn render button `[upload Import Excel]` (uid `40_31`) cho role CB_NV_TW. FR-V.III-NEW-01 (Import DN từ Excel) đã được BA chốt BỎ 2026-05-05 vì DN tự đăng ký TK-first qua FR-VIII-22. Button này nếu user click có thể bulk-import DN bypass self-reg → tạo hàng loạt DN không có TK liên kết.

### Các bước tái hiện

1. Login `cb_nv_tw_01 / Secret@123 / OTP 666666` qua MCP.
2. Click sidebar "Quản lý doanh nghiệp được hỗ trợ".
3. Quan sát thanh action trên table.

### Kết quả mong đợi

- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:283-285`: "~~FR-V.III-NEW-01: Import DN từ Excel~~ — **BỎ (BA chốt 2026-05-05)**. Lý do bỏ: DN tự đăng ký theo TK-first qua FR-VIII-22 (srs-fr-10). Không cần CB Nghiệp vụ bulk-import DN nữa. DN nào chưa có trong hệ thống → phải tự đăng ký."
- Theo `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md:295`: SCR-V.III-01 "**KHÔNG có nút 'Thêm mới' / 'Import Excel'**".
- Action bar KHÔNG render button `[Import Excel]`.

### Kết quả thực tế

Action bar có button `[upload Import Excel]` (uid `40_31`) visible bên cạnh `[Thêm mới]`. URL đích nội bộ `/doanh-nghiep/import` (per SRS line 392 — wizard 3 bước cũ vẫn được dev build).

> **Note:** SCR-V.III-03 dead spec (line 387-415 trong `srs-update-2026-5-5/srs-fr-07-doanh-nghiep.md` vẫn còn) — đây là inconsistency trong SRS update file đã được BA confirm XÓA 2026-05-05. Dev có thể đã đọc nhầm spec line 387-415 thay vì FR section line 283 → render button. Đề nghị dev đọc đúng FR section.

### Bằng chứng

![FR07-UI-002 — Button [Import Excel] vẫn còn trên SCR-V.III-01](../../screenshots/r7-0-6-fr-07-dn-buttons-still-present.png)

Snapshot xem ở FR07-UI-001 (cùng frame).

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` (bypass) |
| MailHog (OTP inbox) | http://103.172.236.130:8025 |
| API base | http://103.172.236.130:3000/api/v1 |
| Frontend | React + Vite + Ant Design |
| Xác thực | JWT + OTP (sessionStorage) |
| Tool test | Chrome DevTools MCP |
| Account verify | `cb_nv_tw_01` (Cán bộ Nghiệp vụ TW) |

---

*Bug report generated: 2026-05-06 | QA Automation via Claude Code MCP | Origin: R7.0.6 UI surface audit*
