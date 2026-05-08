# Seed Checklist — Ngày Lễ 2026 (R7.1.5)

**Ngày:** 2026-05-06 14:12 • **Tài khoản:** `qtht_01` • **Trạng thái mong đợi:** `loai=NGAY_LE` (active)
**Màn:** *(UI tab "Ngày lễ" CHƯA deploy — DEPLOY-004)* — seed qua **API direct** • **Đường dẫn API:** `POST /api/v1/ngay-le`
**Dữ liệu mẫu:** [seed-fixture.yaml > ngay_le_variants v2.7.1 line 230-235](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-VIII-29 §3.2 Quản lý ngày lễ `[GAP-VIII-05]`](../../../../input/srs-update-2026-5-5/srs-fr-10-quan-tri.md)

---

## Downstream consumer × filter

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.5.3 SLA banner trừ ngày lễ (BR-CALC-03) | `ngay BETWEEN deadline_start AND deadline_end` | ≥1 ngày lễ trong khoảng deadline test | active | `GET /api/v1/ngay-le?nam=2026` → ≥10 record | ✅ |
| R7.7.17 Edge BR-EC-12 SLA holiday skip | same | same | active | same | ✅ |

**Acceptance pass:** đủ 5 khoảng ngày lễ FY2026 (Tết DL/Tết NĐ/Giỗ Tổ/30-4+1-5/Quốc khánh) — BE schema single-date nên expand multi-day periods thành record/ngày.

---

## Kết quả: ✅ XONG 15/5 khoảng (4 pre-existing + 11 seeded mới)

5/5 khoảng ngày lễ cover đầy đủ qua 15 record single-date. Schema BE = `{ngay, nam, tenNgayLe, loai, ghiChu}` (single date, không có range). Workaround: expand từng ngày trong period.

**Bug:** Không có (workaround chính thức cho UI gap DEPLOY-004 — UI tab "Ngày lễ" chưa deploy).

---

## Bảng dữ liệu seed

### Pre-existing (4 record từ DB seed)

| # | Ngày | Tên ngày lễ | Khoảng | Status |
|---|------|-------------|--------|:-:|
| 1 | 2026-01-01 | Tết Dương lịch | DL (1 ngày) | ✅ |
| 2 | 2026-04-30 | Ngày Giải phóng miền Nam (30/4) | 30/4-1/5 | ✅ |
| 3 | 2026-05-01 | Ngày Quốc tế Lao động (1/5) | 30/4-1/5 | ✅ |
| 4 | 2026-09-02 | Ngày Quốc khánh (2/9) | Quốc khánh | ✅ |

### Seeded mới (11 record, 2026-05-06 14:12)

| # | Ngày | Tên ngày lễ | Khoảng | API id | Status |
|---|------|-------------|--------|--------|:-:|
| 5 | 2026-02-16 | Tết Nguyên đán Bính Ngọ (mùng 1) | Tết NĐ | 2c852cd5-... | ✅ 201 |
| 6 | 2026-02-17 | Tết Nguyên đán Bính Ngọ (mùng 2) | Tết NĐ | d25e5ebe-... | ✅ 201 |
| 7 | 2026-02-18 | Tết Nguyên đán Bính Ngọ (mùng 3) | Tết NĐ | a43e9614-... | ✅ 201 |
| 8 | 2026-02-19 | Tết Nguyên đán Bính Ngọ (mùng 4) | Tết NĐ | bebe6939-... | ✅ 201 |
| 9 | 2026-02-20 | Tết Nguyên đán Bính Ngọ (mùng 5) | Tết NĐ | d34d9db3-... | ✅ 201 |
| 10 | 2026-02-21 | Tết Nguyên đán Bính Ngọ (mùng 6) | Tết NĐ | 11debee9-... | ✅ 201 |
| 11 | 2026-02-22 | Tết Nguyên đán Bính Ngọ (mùng 7) | Tết NĐ | 106afc22-... | ✅ 201 |
| 12 | 2026-04-26 | Giỗ Tổ Hùng Vương (10/3 ÂL) | Giỗ Tổ | aa7c1f84-... | ✅ 201 |
| 13 | 2026-05-02 | Nghỉ bù 30/4-1/5 (ngày 1) | 30/4-1/5 | 73fd337d-... | ✅ 201 |
| 14 | 2026-05-03 | Nghỉ bù 30/4-1/5 (ngày 2) | 30/4-1/5 | af10979c-... | ✅ 201 |
| 15 | 2026-09-01 | Nghỉ bù Quốc khánh (1/9) | Quốc khánh | a578c352-... | ✅ 201 |

**Coverage 5 khoảng fixture:**
- Tết Dương lịch (2026-01-01): ✅ 1/1 ngày
- Tết Nguyên đán (2026-02-16..22): ✅ 7/7 ngày
- Giỗ Tổ Hùng Vương (2026-04-26): ✅ 1/1 ngày
- Giải phóng + QTLĐ (2026-04-30..05-03): ✅ 4/4 ngày
- Quốc khánh (2026-09-01..02): ✅ 2/2 ngày

**Tổng:** 15 vào kho / 0 bị chặn.

---

## Ảnh chụp

- *(không có UI screenshot — UI tab chưa deploy DEPLOY-004; verify qua API response trên)*

---

*2026-05-06 14:12 — QA chạy bằng Chrome DevTools MCP `evaluate_script` POST API direct (workaround UI gap)*
