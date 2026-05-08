# Workflow test report — R7.4.A3-PUBLIC Công khai VV (FR-V.I-NEW-05)

**Ngày chạy:** 2026-05-08 (R8 post-Round 7)
**SRS ref:** smoke `6.5-sm-vuviec.md` TP-VV-10/11 (NEW 2026-05-06) + `srs-fr-05-vu-viec.md` BR-PUBLIC-01/04, BR-EC-20
**Account dùng:** `cb_nv_tw_01` (multi-role CB_NV+CB_PD+QA_VT_DEL_TEST_R7) + `truong_16` (CG `TVV-BTP-TW-0004`)
**Tool:** Chrome DevTools MCP

## Status: 🚫 BLOCKED — không reach DA_DUYET hoặc HOAN_THANH state

Cần ≥1 VV ở DA_DUYET hoặc HOAN_THANH (per smoke 6.5-sm-vuviec.md `Data Readiness`) để chạy 2 self-loop test:
- TP-VV-10 — Công khai VV (cong_khai 0→1) + verify whitelist 9 fields
- TP-VV-11 — Hủy công khai (cong_khai 1→0) + clear thoi_gian_dang_tai

Verified hiện trạng:
- Tab "Hoàn thành" VV list: empty `.ant-empty` "Không có dữ liệu" (gồm DA_DUYET + HOAN_THANH + DA_DANH_GIA per spec line 1308)
- Dashboard "Vụ việc hoàn thành": 0
- API `GET /vu-viecs?tab=HOAN_THANH&page=1&pageSize=20` → 200 `{data: []}`

→ KHÔNG có VV nào để chạy TP-VV-10/11. R7.4.A3 (workflow base) chưa advance VV qua DA_PHAN_CONG.

## Cố gắng unblock — discovered cascade gap

Per todo R7.4.A3 cần multi-role advance: TVV/NHT accept → submit → CB PD duyệt → CB NV hoàn thành. Cố gắng chạy chain này discover thêm 4 finding:

### Finding 1 ✅ — TVV TW có TK login (R6 → R7 đã giải quyết)

**R6 documented gap:** TVV TW pool không có TK login (test login `tvv_btp_tw_01` → 401).
**R7 fix verify:** TK đã được tạo qua R7.2.9 ✅ với username convention **firstname + sequence** (KHÔNG phải `tvv_btp_tw_*`):

| Mã TVV | Username | State | Ghi chú |
|---|---|:-:|---|
| TVV-BTP-TW-0001 | `ly_13` | DANG_HOAT_DONG | Verified login OK |
| TVV-BTP-TW-0002 | `dinh_14` | DANG_HOAT_DONG | — |
| TVV-BTP-TW-0003 | `ngo_15` | DANG_HOAT_DONG | — |
| TVV-BTP-TW-0004 | `truong_16` | DANG_HOAT_DONG | **Verified hôm nay** — login OK, vai trò CG |
| TVV-BTP-TW-0005 | `mai_17` | DANG_HOAT_DONG | — |
| TVV-BTP-TW-0006 | `ho_18` | DANG_HOAT_DONG | — |

→ **R6 BLOCK đã được giải quyết.** Tài liệu setup gap cũ trong `output/qa-reports/round6-2026-05-01-postreset/workflow/workflow-test-report-VuViec.md:256` outdated.

### Finding 2 🐛 — Cờ deviation R7: TK pool đều là CG (không phải TVV) — vẫn DANG_HOAT_DONG (state cũ)

Per BUG-CG-A1-001 (R7.4.A1-CG ⚠️ DEVIATION still Open) — pool 6 TVV TW là loai_tvv=CG state DANG_HOAT_DONG (legacy) thay vì CHO_KICH_HOAT theo spec v3.5. Re-verified hôm nay:

```
GET /api/v1/auth/me (truong_16) → vaiTro: ["CG"]
```

→ Pool entity là CG, KHÔNG phải TVV thuần (loai_tvv=TVV chỉ có 2 record CHO_PHE_DUYET — state khác). Hệ quả ở Finding 4.

### Finding 3 🐛 — VV-002 phân công cho CG, vai trò CG không có `read_vu_viec` permission

Verified `truong_16` (vai trò CG) login → landing /403 — sidebar chỉ 2 mục (đào tạo + Tư vấn TVCS). Probe API:

```
GET /api/v1/vu-viecs?page=1&pageSize=20 → 403 ERR-PERM-SYS-00-01 "Forbidden"
```

→ **CG được phân công VV nhưng KHÔNG truy cập VV được** → không thể accept transition `DA_PHAN_CONG → DANG_XU_LY` qua UI. Deadlock state.

> **Bug log:** [bug-report-r7-4-a3-public-phancong-cascade.md](../../bug-reports/vu-viec/bug-report-r7-4-a3-public-phancong-cascade.md) BUG-VV-PC-001 Critical Open.

### Finding 4 🐛 — BE `/goi-y-tvv` filter cho VV cấp TW chỉ trả 1 CG, không trả NHT

Mở modal phân công VV-002 → BE chỉ trả 1 record CG `Trương Văn Mười Sáu (TVV-BTP-TW-0004) — 0 VV đang xử lý`. KHÔNG trả NHT mặc dù pool có:

| Mã NHT | Đơn vị | Cấp | Trạng thái |
|---|---|:-:|:-:|
| NHT-BTP-TW-0001 | BTP-TW | TW (cùng cấp VV) | CHO_KICH_HOAT |
| NHT-STP-AG-0001 | STP-AG | ĐP | HOAT_DONG |
| NHT-STP-DN-0001 | STP-DN | ĐP | HOAT_DONG |
| NHT-STP-HP-0001 | STP-HP | ĐP | HOAT_DONG |

Per spec line 1765: `DANG_KIEM_TRA → DA_PHAN_CONG: Đạt + chọn NHT (Guard: NHT đang hoạt động)` — pool gợi ý đáng lẽ là NHT, không phải CG.

> **Bug log:** Cùng file BUG-VV-PC-002 Major Open.

## Transitions tested

| # | From | To | Action | Role | Result |
|---|---|---|---|---|---|
| 1 | DA_PHAN_CONG | DANG_XU_LY | TVV/NHT xác nhận | `truong_16` (CG) | 🚫 BLOCKED — CG 403 không truy cập được VV |
| 2 | DANG_XU_LY | CHO_PHE_DUYET | CB NV trình | cb_nv_tw_01 | 🚫 Cascade |
| 3 | CHO_PHE_DUYET | DA_DUYET | CB PD duyệt | cb_pd_tw_01 | 🚫 Cascade |
| 4 | DA_DUYET | HOAN_THANH | CB NV cập nhật KQ cuối | cb_nv_tw_01 | 🚫 Cascade |
| 5 | DA_DUYET ↻ self-loop | (cong_khai 0→1) | CB PD công khai | cb_pd_tw_01 | 🚫 Cascade — KHÔNG reach DA_DUYET |
| 6 | HOAN_THANH ↻ self-loop | (cong_khai 0→1) | CB PD công khai | cb_pd_tw_01 | 🚫 Cascade |
| 7 | self-loop | (cong_khai 1→0) | CB PD hủy công khai | cb_pd_tw_01 | 🚫 Cascade |

**0/7 transition PASS** — tất cả block ở transition 1.

## Test Path coverage (theo smoke 6.5-sm-vuviec.md)

| TP | Tên | Status |
|---|---|:-:|
| TP-VV-10 | Công khai VV — Badge + whitelist 9 fields | 🚫 |
| TP-VV-11 | Hủy công khai — clear thoi_gian_dang_tai | 🚫 |

## Findings phụ — environment / dev quirks (đã capture, không log bug)

### Auth-store ở localStorage (không phải sessionStorage)

CLAUDE.md MCP-Rule 3 ghi `auth-store` ở `sessionStorage` (verified 2026-04-21) — **OUTDATED**. App hiện tại lưu ở `localStorage`:

```
localStorage["auth-store"] = JSON.stringify({state: {userInfo: {...}}})
```

Logout cần gọi `POST /api/v1/auth/logout` (xoá refresh-token cookie HttpOnly) + `localStorage.clear()` thì mới đảm bảo ra `/login` page; navigate `/login` không có 2 bước này → app giữ refresh-token cookie + gọi `/auth/me` thành công → bounce về `/dashboard`.

→ **Action:** Update CLAUDE.md MCP-Rule 3 + Template login (xem cuối report cập nhật).

### Multi-role test account `cb_nv_tw_01`

`cb_nv_tw_01` có 3 vai trò: `["CB_NV_TW", "QA_VT_DEL_TEST_R7", "CB_PD_TW"]` — multi-role test account. Permissions gồm `approve_vu_viec`, `hoan-thanh_vu_viec`, `cap-nhat-ket-qua_ket_qua_vu_viec`, etc. Có thể hành động cả CB NV và CB PD trên cùng VV — vi phạm spirit BR-AUTH-05 (CB PD ≠ CB NV trình) nhưng accept được cho test workflow positive.

## Cascade impact (downstream block)

| Task | Cần | Hiện trạng | Block? |
|---|---|---|:-:|
| R7.4.A3-PUBLIC (this) | ≥1 VV DA_DUYET hoặc HOAN_THANH | 0 | 🚫 |
| R7.4.A3-DN-BS | VV YEU_CAU_BO_SUNG + DN VNeID | 0 + missing | 🚫 |
| R7.7.3 functional 72 TC | ≥1 VV mỗi state | 0 ở 5 state cuối | 🚫 |
| R7.7.3-PRIVACY P0 NĐ 13/2023 | VV cong_khai=1 | 0 | 🚫 |
| R7.5.4 BC04 (VV hoàn thành export) | ≥1 VV HOAN_THANH | 0 | 🚫 |
| R7.5.2 Tab #3 KPI | ≥1 VV mỗi state | partial | ⚠️ |
| R7.3.14 HĐ tư vấn | ≥1 VV HOAN_THANH | 0 | 🚫 |
| R7.4.D1/D2 ĐG hiệu quả | ≥3 VV HOAN_THANH match đợt | 0 | 🚫 |

→ **Critical bottleneck.** Fix BUG-VV-PC-001/002 = unblock ≥7 task.

## Next actions đề xuất user

1. **Escalate dev** với 2 bug ở [bug-report-r7-4-a3-public-phancong-cascade.md](../../bug-reports/vu-viec/bug-report-r7-4-a3-public-phancong-cascade.md):
   - Fix Critical: `/goi-y-tvv` filter trả NHT entity (cùng cấp + đúng loại); UI loại trừ CG.
   - Fix Major: vai trò NHT có permission `read_vu_viec` cho VV được phân công (instance scope).
2. **Sau dev fix:** kích hoạt NHT-BTP-TW-0001 qua mail (R7.2.9 pattern) → re-assign VV-002 cho NHT → run R7.4.A3 advance chain → run R7.4.A3-PUBLIC.
3. **Trong lúc chờ:** chuyển sang task 🟢 ready khác (R7.4.A2 Tiếp nhận TVV / R7.7.4.5 NHT functional / R7.7.4.6 TC TV functional / R7.7.4 DN 17 TC).

## Evidence files

- [r7-4-a3-public-tab-hoanthanh-empty.png](r7-4-a3-public-tab-hoanthanh-empty.png) — Tab Hoàn thành empty
- [r7-4-a3-public-vv002-detail.png](r7-4-a3-public-vv002-detail.png) — VV-002 detail page (state DA_PHAN_CONG, button Phân công duy nhất)
- [r7-4-a3-public-phancong-modal-only-cg.png](r7-4-a3-public-phancong-modal-only-cg.png) — Modal dropdown chỉ 1 CG
- Bug detail: [bug-report-r7-4-a3-public-phancong-cascade.md](../../bug-reports/vu-viec/bug-report-r7-4-a3-public-phancong-cascade.md)

---

*R8 post-Round 7 | 2026-05-08 | QA Automation via Chrome DevTools MCP (Claude Code)*
