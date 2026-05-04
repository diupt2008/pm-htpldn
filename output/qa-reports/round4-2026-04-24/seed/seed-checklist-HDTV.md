# Seed Checklist — HOP_DONG_TU_VAN (T2.B1)

**Phase:** P2 Block B • **Date:** 2026-04-25 17:25–17:28 • **Account:** `cb_nv_tw_01`
**Method:** MCP Chrome DevTools • **Entry state kỳ vọng:** `NHAP`
**Input:** [seed-fixture.yaml > hop_dong_tv_variants[1..6]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: 🚫 **BLOCKED 0/6** — `BUG-HDTV-001-R4` Critical Open

Module SCR-X3-01 chưa build phía FE: sidebar "Quản lý tư vấn" chỉ có 2 submenu (TVCS + TV nhanh), thiếu Hợp đồng Tư vấn; 8 FE URL pattern đều 404. BE `/api/v1/hop-dong-tu-vans` (plural) trả 401 → tồn tại nhưng không có FE consumer.

Bug + evidence: [bug-report-seed-hdtv-t2b1.md](../bug-reports/bug-report-seed-hdtv-t2b1.md).

---

## Đã test được gì

| # | Bước test | Kết quả |
|---|-----------|:------:|
| 1 | Login `cb_nv_tw_01` + OTP `666666` → Dashboard | ✅ |
| 2 | Click sidebar "Quản lý tư vấn" → kỳ vọng 3 submenu (TVCS / TV nhanh / HDTV) | 🚫 chỉ có 2 (thiếu HDTV) |
| 3 | Probe 8 FE URL pattern HDTV | 🚫 100% trả 404 |
| 4 | Probe BE `/api/v1/hop-dong-tu-vans` plural | ⚠️ 401 (exist orphan) |
| 5 | Probe BE `/api/v1/hop-dong-tu-van` singular + `/search` | 🚫 404 |
| 6 | Click sidebar "Quản lý CG/TVV" — verify HDTV không phải tab nội bộ | ✅ confirm SCR-X3-01 phải là page riêng |

---

## Seed matrix — 6 fixture

| # | Variant | Bên B (type) | Giá trị | Thời hạn | Mã HĐ | Seeded |
|---|---------|--------------|---------|----------|-------|:------:|
| 1 | HĐ DN Zeta — TVV Nguyễn VT | TVV | 50.000.000 | 01/01/2026 → 31/12/2026 | — | 🚫 |
| 2 | HĐ thuế DN Gamma — TVV Trần TV | TVV | 30.000.000 | 01/02/2026 → 31/08/2026 | — | 🚫 |
| 3 | HĐ thương mại — TVV Lê CG | TVV | 80.000.000 | 01/03/2026 → 28/02/2027 | — | 🚫 |
| 4 | HĐ đa vụ việc — Đoàn LS HN | TO_CHUC | 200.000.000 | 15/01/2026 → 15/12/2026 | — | 🚫 |
| 5 | HĐ năm 2025 | TVV | 25.000.000 | 01/01/2025 → 31/12/2025 | — | 🚫 |
| 6 | HĐ ngắn hạn DN Epsilon | TVV | 10.000.000 | 01/02/2026 → 30/06/2026 | — | 🚫 |

**Total:** 0 seeded / 6 BLOCKED

---

## Cascade ảnh hưởng

- T3.X workflow HDTV (Tuần 3) — defer chờ unblock
- T4.14 Functional HDTV 29 TC (Tuần 4 Ngày 5) — defer chờ unblock

---

*2026-04-25 17:25–17:28 | QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block B*
