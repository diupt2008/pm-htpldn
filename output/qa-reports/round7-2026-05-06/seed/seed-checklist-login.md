# R7.0.4 — Login verify accounts

**Date:** 2026-05-06 · **Round:** R7 · **OTP bypass:** `666666`

## Verdict

✅ PASS 10/10 sample accounts. BE xác thực hoạt động đúng cho 6 role tested (QTHT, CB_NV_TW, CB_PD_TW, CB_NV_DP, CB_NV_BN, NHT, CG, TVV).

## Method

- Mỗi account login qua MCP `new_page` với `isolatedContext` riêng (cookie isolation per role per memo `qa_htpldn_round5_t01`).
- Steps: navigate `/login` → fill creds → click `Đăng nhập` → wait OTP page → type `666666` → wait dashboard/403 page.
- Verify: URL landing + role hiển thị header + sidebar menu đúng phân quyền.

## Results

| # | Username | Vai trò CSV | Landing URL | Sidebar menu | Verdict |
|:-:|---|---|---|---|:-:|
| 1 | `qtht_01` | QTHT | `/dashboard` | 13 menu (full) | ✅ |
| 2 | `cb_nv_tw_01` | CB_NV_TW | `/dashboard` | 13 menu (full) | ✅ |
| 3 | `cb_pd_tw_01` | CB_PD_TW | `/dashboard` | 13 menu (full) | ✅ |
| 4 | `cb_nv_dp_01` | CB_NV_DP (AG) | `/dashboard` (VV 23, scope ĐP) | 13 menu (filter "Đơn vị" ẩn — đúng spec ĐP) | ✅ |
| 5 | `cb_nv_bn_01` | CB_NV_BN (BKH) | `/dashboard` (VV 0, scope BN) | 13 menu (filter "Đơn vị" ẩn) | ✅ |
| 6 | `nht_01` | NHT (AG) | `/403` (NHT no default dashboard) | 3 menu (Đào tạo / Vụ việc / Tư vấn) | ✅ |
| 7 | `nht_02` | NHT (BG) | `/403` | 3 menu | ✅ |
| 8 | `nht_03` | NHT (BNI) | `/403` | 3 menu | ✅ |
| 9 | `cg_01` | CG (AG) | `/403` (CG no default dashboard) | 2 menu (Đào tạo / Tư vấn) | ✅ |
| 10 | `tvv_01` | TVV (AG) | `/403` (TVV no default dashboard) | 4 menu (Đào tạo / Mạng lưới TVV / Vụ việc / Tư vấn) | ✅ |

## Notes

- **`cg_tw_01..06` không tồn tại trong `users.csv`** — todo.md spec yêu cầu test 6 account này, nhưng seed plan đặt việc tạo ở R7.2.8a (block bởi R7.2.7 NHT entity 404). Substitute test bằng `cg_01` (đại diện role CG).
- Role NHT/CG/TVV landing `/403` sau login = **PASS** (per CLAUDE.md known behavior: 3 role này không có dashboard default, sidebar render đầy đủ menu).
- Dashboard scope ĐP (`cb_nv_dp_01`): VV count = 23 (chỉ AG), filter "Đơn vị" ẩn — đúng phân quyền.
- Dashboard scope BN (`cb_nv_bn_01`): VV count = 0 (BKH chưa có dữ liệu), filter "Đơn vị" ẩn.

## Evidence

- [r7-0-4-login-qtht_01.png](../screenshots/r7-0-4-login-qtht_01.png)
- [r7-0-4-login-cb_nv_tw_01.png](../screenshots/r7-0-4-login-cb_nv_tw_01.png)
- [r7-0-4-login-cb_pd_tw_01.png](../screenshots/r7-0-4-login-cb_pd_tw_01.png)
- [r7-0-4-login-cb_nv_dp_01.png](../screenshots/r7-0-4-login-cb_nv_dp_01.png)
- [r7-0-4-login-cb_nv_bn_01.png](../screenshots/r7-0-4-login-cb_nv_bn_01.png)
- [r7-0-4-login-nht_01.png](../screenshots/r7-0-4-login-nht_01.png)
- [r7-0-4-login-nht_02.png](../screenshots/r7-0-4-login-nht_02.png)
- [r7-0-4-login-nht_03.png](../screenshots/r7-0-4-login-nht_03.png)
- [r7-0-4-login-cg_01.png](../screenshots/r7-0-4-login-cg_01.png)
- [r7-0-4-login-tvv_01.png](../screenshots/r7-0-4-login-tvv_01.png)
