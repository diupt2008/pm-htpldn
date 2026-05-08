# R7.0.5 — Smoke SCR-VIII-02 button [Thêm mới]

**Date:** 2026-05-06 · **Round:** R7 · **Account:** `qtht_01` · **URL:** `/quan-tri/tai-khoan`

## Verdict

✅ PASS — button `[plus Thêm mới]` visible trên SCR-VIII-02 (Quản lý tài khoản). Không cần seed lại, route hoạt động bình thường.

## Method

1. Login `qtht_01/Secret@123/666666` (đã PASS R7.0.4).
2. Click sidebar `Quản trị hệ thống` → submenu hiện 4 mục.
3. Click `Tài khoản & phân quyền` → navigate `/quan-tri/tai-khoan`.
4. Snapshot a11y tree.

## Evidence

- Heading h4 `Quản lý tài khoản` render OK.
- Button `[plus Thêm mới]` (uid `33_27`) visible cạnh `[Tìm kiếm]` + `[Xóa bộ lọc]`.
- 5 tab status: `Tất cả 34` / `Hoạt động 34` / `Chờ kích hoạt 0` / `Tạm khóa 0` / `Chờ phân quyền 0`.
- Table 34 record (page 1: 20/34, total 2 trang).
- Filter row đầy đủ: Từ khóa / Trạng thái / Loại TK / Đơn vị / Vai trò.

Screenshot: [r7-0-5-scr-viii-02-them-moi-button.png](../screenshots/r7-0-5-scr-viii-02-them-moi-button.png)

## Notes

- 34 TK match users.csv (40 record CSV − 6 cg_tw_* chưa seed).
- Login cuối visible: `qtht_01` (vừa login R7.0.4 11:53), `cb_nv_bn_01` (R7.0.4 11:55), `tvv_01` (R7.0.4 11:57), `cb_nv_tw_03` (07:37 6/5/26 — phiên trước).
