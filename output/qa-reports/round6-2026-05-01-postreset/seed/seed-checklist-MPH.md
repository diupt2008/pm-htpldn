# Seed Checklist — MAU_PHAN_HOI Mô hình B Hybrid 2 tầng (R6.1.5)

**Ngày:** 2026-05-05 14:20 • **Tài khoản:** `cb_nv_tw_01` + `cb_nv_bn_01..03` + `cb_nv_dp_01..03` (7 user × 1-2 mẫu) • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-VIII-06 Tab 3 Mẫu phản hồi (MH-10.7) • **Đường dẫn:** `/quan-tri/cau-hinh?tab=mau-phan-hoi`
**Dữ liệu mẫu:** [seed-fixture.yaml > mau_phan_hoi_variants + mau_phan_hoi_bn_variants + mau_phan_hoi_dp_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [`srs-v3 §3.4.2`](../../../../input/srs-v3/srs-v3.md) (QTHT=R, CB_NV_TW/BN/DP=CRUD\*) + [`srs-update-2026-5-4 §FR-II-NEW-02`](../../../../input/srs-update-2026-5-4/srs-fr-02-hoi-dap.md) (Mô hình B Hybrid + action-level MPH_CREATE_TW/BN/DP)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query (curl/UI) | Status |
|-----------------|------------------------|---------------|----------------------|------------------------|:---:|
| FR-II-07 SCR-II-02 dropdown chèn mẫu (HD soạn phản hồi) — TW user | `linhVucId = câu hỏi AND trangThai='KICH_HOAT' AND scope MPH_READ` (`srs-update-2026-5-4 row 19`) | ≥1 mẫu / 6 LV = 6 (TW khung) | `KICH_HOAT` + `capTao=TW` | UI: `cb_nv_tw_01` mở HD-001 Hỏi đáp → dropdown thấy ≥1 mẫu mỗi LV | ☐ → ✅ |
| FR-II-07 dropdown chèn mẫu — BN user (BKH/BTC/BCT) | TW khung + BN_RIENG đơn vị mình | 6 TW + 1 BN/đơn-vị | `KICH_HOAT` + `capTao=TW/BN`+`donViId match` | UI: `cb_nv_bn_01` HD detail dropdown thấy 7 mẫu (6 TW + 1 BN-BKH) | ☐ → ✅ |
| FR-II-07 dropdown chèn mẫu — ĐP user (AG/BG/BNI) | TW khung + DP_RIENG đơn vị mình | 6 TW + 1 DP/đơn-vị | `KICH_HOAT` + `capTao=TW/DP`+`donViId match` | UI: `cb_nv_dp_01` HD detail dropdown thấy 7 mẫu (6 TW + 1 DP-AG) | ☐ → ✅ |

**Acceptance pass khi:** mọi row Status = ✅ qua verify per-filter.

---

## Kết quả: ✅ XONG 12/12 qua UI + scope MPH_READ verify đầy đủ (6/6 user PASS)

Seed thành công 12 mẫu phản hồi qua UI Tab 3 (SCR-VIII-06) bằng 7 tài khoản CB_NV (1 TW + 3 BN + 3 DP). Cover **đầy đủ Mô hình B Hybrid 2 tầng** + 6 LV × 2 mẫu/LV.

**BUG-FUNC-MPH-002 + BUG-FUNC-MPH-003 đều Closed (Fixed 2026-05-05 R12):**
- MPH-002: FE fix route guard cho CB_NV — sidebar entry + CRUD button hiển thị đúng cho user thuộc đơn vị sở hữu mẫu.
- MPH-003: BE fix filter scope MPH_READ — verified 6/6 user CB_NV chỉ thấy mẫu TW + đơn vị mình (BN/DP không leak cross-đơn vị). TW user thấy 12 cross-view; QTHT cross-view 12.

### Scope MPH_READ verify table (R12 retest 15:30)

| User | Đơn vị | Expected | Actual | Status |
|---|---|:---:|:---:|:---:|
| `cb_nv_tw_01` | TW (Cục BTP) | 12 (6 TW + 3 BN + 3 DP cross-view) | 12 | ✅ |
| `cb_nv_bn_01` | BKH-ĐT | 7 (6 TW + 1 BN-BKH) | 7 | ✅ |
| `cb_nv_bn_02` | BTC | 7 (6 TW + 1 BN-BTC) | 7 | ✅ |
| `cb_nv_bn_03` | BCT | 7 (6 TW + 1 BN-BCT) | 7 | ✅ |
| `cb_nv_dp_01` | Sở TP AG | 7 (6 TW + 1 DP-AG) | 7 | ✅ |
| `cb_nv_dp_02` | Sở TP BG | 7 (6 TW + 1 DP-BG) | 7 | ✅ |
| `cb_nv_dp_03` | Sở TP BNI | 7 (6 TW + 1 DP-BNI) | 7 | ✅ |
| `qtht_01` | (cross-view) | 12 (full) | 12 | ✅ |

---

## Bảng dữ liệu seed

### TW khung quốc gia (6 mẫu — `cb_nv_tw_01`)

| # | Tên bản ghi | Lĩnh vực | Cấp tạo | Đơn vị (BE) | Có vào kho? |
|---|-------------|----------|:-:|--------------------|:-----------:|
| 1 | Mẫu phản hồi HD - Doanh nghiệp | DOANH_NGHIEP | TW | `00000000-...8000-000001` | ✅ |
| 2 | Mẫu phản hồi HD - Hợp đồng/KDTM | HOP_DONG | TW | `00000000-...8000-000001` | ✅ |
| 3 | Mẫu phản hồi HD - Lao động | LAO_DONG | TW | `00000000-...8000-000001` | ✅ |
| 4 | Mẫu phản hồi HD - Thuế | THUE | TW | `00000000-...8000-000001` | ✅ |
| 5 | Mẫu phản hồi HD - Sở hữu trí tuệ | SHTT | TW | `00000000-...8000-000001` | ✅ |
| 6 | Mẫu phản hồi HD - Đất đai | DAT_DAI | TW | `00000000-...8000-000001` | ✅ |

### BN_RIENG (3 mẫu — `cb_nv_bn_01..03`)

| # | Tên bản ghi | Lĩnh vực | Cấp tạo | Đơn vị (BE) | Account seed | Có vào kho? |
|---|-------------|----------|:-:|--------------------|--------------|:-----------:|
| 7 | Mẫu phản hồi BN-BKH - Doanh nghiệp | DOANH_NGHIEP | BN | `...8001-000001` (BKH-ĐT) | `cb_nv_bn_01` | ✅ |
| 8 | Mẫu phản hồi BN-BTC - Thuế | THUE | BN | `...8001-000002` (BTC) | `cb_nv_bn_02` | ✅ |
| 9 | Mẫu phản hồi BN-BCT - Lao động | LAO_DONG | BN | `...8001-000003` (BCT) | `cb_nv_bn_03` | ✅ |

### DP_RIENG (3 mẫu — `cb_nv_dp_01..03`)

| # | Tên bản ghi | Lĩnh vực | Cấp tạo | Đơn vị (BE) | Account seed | Có vào kho? |
|---|-------------|----------|:-:|--------------------|--------------|:-----------:|
| 10 | Mẫu phản hồi DP-AG - Hợp đồng | HOP_DONG | DP | `...8002-000006` (Sở TP AG) | `cb_nv_dp_01` | ✅ |
| 11 | Mẫu phản hồi DP-BG - Sở hữu trí tuệ | SHTT | DP | `...8002-000008` (Sở TP BG) | `cb_nv_dp_02` | ✅ |
| 12 | Mẫu phản hồi DP-BNI - Đất đai | DAT_DAI | DP | `...8002-000011` (Sở TP BNI) | `cb_nv_dp_03` | ✅ |

**Tổng:** 12/12 vào kho · 0/12 bị chặn · Cover 6 LV × 2 mẫu/LV (1 TW + 1 BN hoặc DP).

---

## Verify query results (qua QTHT cross-view)

```
GET /api/v1/mau-phan-hois?page=1&size=50  →  HTTP 200, total=12
{
  "countByLevel": { "TW": 6, "BN": 3, "DP": 3 },
  "perLV": {
    "DOANH_NGHIEP": 2 (TW + BN-BKH),
    "HOP_DONG":     2 (TW + DP-AG),
    "LAO_DONG":     2 (TW + BN-BCT),
    "THUE":         2 (TW + BN-BTC),
    "SHTT":         2 (TW + DP-BG),
    "DAT_DAI":      2 (TW + DP-BNI)
  }
}
```

### Schema BE (lưu ý field naming)

```json
{
  "id": "...",
  "tenMau": "Mẫu phản hồi BN-BKH - Doanh nghiệp",
  "linhVucId": "bbbbbbbb-...001a",
  "loai": "MAU_PHAN_HOI",
  "trangThai": "KICH_HOAT",
  "capTao": "BN",                                   // BE field — KHÁC SRS: pham_vi_ap_dung
  "donViId": "00000000-...8001-000001"
}
```

> **Note schema mismatch:** BE response field `capTao` (TW/BN/DP) không khớp SRS `pham_vi_ap_dung` (TW_QUOC_GIA/BN_RIENG/DP_RIENG). BE map: `TW=TW_QUOC_GIA`, `BN=BN_RIENG`, `DP=DP_RIENG`. KHÔNG block, chỉ note để BA/dev align.

---

## Ảnh chụp

- [TW final 6 mẫu (cb_nv_tw_01 view trước fix MPH-003)](../screenshots/r6-1-5-mph-tw-6-mau-via-ui.png)
- [DP-BNI seed flow final 9 mục view của BNI (trước fix MPH-003 — leak cross-đơn vị)](../screenshots/r6-1-5-mph-final-12-mau-mo-hinh-b.png)
- [QTHT cross-view 12 mẫu Mô hình B](../screenshots/r6-1-5-mph-qtht-cross-view-12-mau.png)
- [BUG-FUNC-MPH-002 evidence cũ (FE chặn route — đã fix)](../screenshots/r6-1-5-mph-cb-nv-tw-403-route-block.png)
- 🆕 [MPH-003 retest PASS: DP-BNI scope đúng 7 mục (1 DP-BNI + 6 TW)](../screenshots/r6-1-5-mph-003-fixed-dp-bni-scope-7mau.png)
- 🆕 [MPH-003 retest PASS: TW cross-view đầy đủ 12 mục (6 TW có Sửa/Xóa, 3 BN + 3 DP read-only)](../screenshots/r6-1-5-mph-003-fixed-tw-cross-view-12.png)

---

*2026-05-05 14:25 — QA chạy bằng Chrome DevTools MCP qua UI (KHÔNG dùng API). 7 lần login + 12 lần [Thêm mới] qua Tab 3.*
