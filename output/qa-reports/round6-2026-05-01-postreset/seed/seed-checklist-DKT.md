# Seed Checklist — Đề kiểm tra (R6.3.8b)

**Ngày:** 2026-05-02 10:12 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `Nháp`
**Màn:** SCR-III-04 tab "Đề kiểm tra" • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach?tab=de-kiem-tra`
**Dữ liệu mẫu:** [seed-fixture.yaml > de_kiem_tra_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** FR-III-NEW-01 + §3.4.3.22 DE_KIEM_TRA

---

## Downstream consumer × filter

| Task downstream | Đọc filter | Số record cần | Status |
|-----------------|------------|---------------|:---:|
| R6.4.B7 KH workflow gắn ĐKT | `de_kiem_tra` theo `khoa_hoc_id` | ≥1/KH = ≥3 | ✅ |
| Phase 4 publish ĐKT (FR-III-NEW-01 publish) | `trangThai=NHAP` | ≥1 | ✅ (5/5) |
| Phân phối ĐKT vào KH | `cachTao=THU_CONG/NGAU_NHIEN` mix | cover 2 cách | ⚠️ chỉ THU_CONG |

**Per-filter verify (qua API GET `/api/v1/de-kiem-tras`):**

| Filter | Count | Pass |
|---|:---:|:---:|
| `cachTao=THU_CONG` | 5 | ✅ |
| `cachTao=NGAU_NHIEN` | 0 | 🚫 (block bởi BE pool filter NHCH `trangThai=CONG_KHAI`) |
| `trangThai=NHAP` | 5 | ✅ |
| Tổng | 5 | ✅ |

---

## Kết quả: ✅ XONG 5/5 — full count, partial cover (THU_CONG only)

5 ĐKT entry `Nháp` cover 5 LV (DN/SHTT/LĐ/ĐĐ/HĐ) × 2 mức (DE/TB/KHO via NHCH bond). KHÔNG cover `cachTao=NGAU_NHIEN` do BE business rule chặn (NHCH `trangThai != CONG_KHAI` → "Ngân hàng không đủ câu hỏi thỏa điều kiện" `ERR-BIZ-III-NEW01-01`). Cách tạo NGAU_NHIEN sẽ unblock sau khi R6.4.B5b publish NHCH `Nháp → Công khai` (Phase 4).

**Bug:** Không có. (BE filter `trangThai=CONG_KHAI` cho random pool là design hợp lý theo SRS — NHCH Nháp không nên xuất hiện trong đề kiểm tra random.)

---

## Bảng dữ liệu seed

| # | Tên đề | Cách tạo | Câu hỏi | LV cover | ID | Vào kho? |
|---|---|---|---|---|---|:---:|
| 1 | Đề kiểm tra - Pháp luật DN căn bản | THU_CONG | DN_TB_2 + DN_TB_8 | DOANH_NGHIEP | `1ca90e32...` | ✅ |
| 2 | Đề kiểm tra - Sở hữu trí tuệ chuyên sâu | THU_CONG | SHTT_KHO_4 + SHTT_KHO_9 | SO_HUU_TRI_TUE | `79e59a01...` | ✅ |
| 3 | Đề kiểm tra - Pháp luật Lao động cơ bản | THU_CONG | LD_DE_1 + LD_DE_10 | LAO_DONG | `61f6c8e9...` | ✅ |
| 4 | Đề kiểm tra - HĐ thương mại nội địa (THU_CONG) | THU_CONG | HD_DE_5 + DN_TB_2 | HOP_DONG + DOANH_NGHIEP | `a07917f5...` | ✅ |
| 5 | Đề kiểm tra - Luật đất đai 2024 | THU_CONG | DD_DE_7 + DD_TB_6 | DAT_DAI | `67d9f4bf...` | ✅ |

**Tổng:** 5/5 vào kho · 0 chặn

---

## Ảnh chụp

- [5/5 ĐKT Nháp - Thủ công](../screenshots/r6-3-8b-dkt-5-of-5.png)

---

## Phương pháp seed

UI form yêu cầu Tên đề + Cách tạo + (cauHoiIds | randomConfig). `khoa_hoc_id` **KHÔNG required** by BE — cột "Khóa học" hiển thị "Chưa phân phối" cho ĐKT mới tạo.

API `POST /api/v1/de-kiem-tras` schema phát hiện qua probe:
```json
{
  "tenDe": "string",
  "cachTao": "THU_CONG | NGAU_NHIEN",
  "cauHoiIds": ["UUID..."],          // required khi THU_CONG, ≥1
  "randomConfig": [                   // required khi NGAU_NHIEN, ≥1
    { "linhVucId": "UUID", "mucDo": "DE|TRUNG_BINH|KHO", "soLuong": int ≥1 }
  ],
  "thoiGianLamBai": int (1-480 phút),
  "diemDat": int (0-100)
}
```

**Phát hiện BE business rule:** `cachTao=NGAU_NHIEN` filter NHCH pool theo `trangThai=CONG_KHAI`. Tất cả 10 NHCH ở R6.3.8a đang `trangThai=NHAP` → POST trả `422 ERR-BIZ-III-NEW01-01: "Ngân hàng không đủ câu hỏi thỏa điều kiện"` ngay cả khi `cacLuaChon × mucDo` đủ trong fixture. → NGAU_NHIEN ĐKT phải chờ R6.4.B5b (NHCH publish workflow Phase 4).

**Phương án Phase 3:** Toàn bộ 5 ĐKT dùng `cachTao=THU_CONG` (chọn câu cụ thể từ NHCH Nháp — BE cho phép). Đủ filter downstream vì KH workflow chỉ check ĐKT tồn tại, không phân biệt cách tạo.

---

## Dep gap surfaced

**R6.3.8b NGAU_NHIEN cover** chờ **R6.4.B5b NHCH publish** (Phase 4 workflow, dep R6.3.8a ✅). Sau khi R6.4.B5b PASS, có thể bổ sung 2-3 NGAU_NHIEN ĐKT (theo fixture index 1, 4) để đầy đủ matrix `cachTao` × `linhVucId` × `mucDo`.

---

*2026-05-02 10:12 — QA chạy bằng Chrome DevTools MCP + API direct (`POST /api/v1/de-kiem-tras`)*
