# Seed Checklist — Đề kiểm tra (R7.3.9 — R8 5 ĐKT cover 5 LV)

**Ngày:** 2026-05-08 19:50 • **Tài khoản:** `cb_nv_tw_02` • **Trạng thái mong đợi:** `NHAP`
**Màn:** SCR-III-04 tab "Đề kiểm tra" • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach?tab=de-kiem-tra`
**Dữ liệu mẫu:** chưa có trong [seed-fixture.yaml](../../../../../input/data/seed-fixture.yaml) — improvise theo SRS Inputs FR-III-NEW-01
**SRS:** [FR-III-NEW-01 — Tạo đề kiểm tra](../../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-new-01)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho task downstream sẽ đọc data này.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.4.B10 — Workflow ĐKT (FR-III-NEW-01/02/03) | `≥1 ĐKT NHAP để tạo + phân phối + map bài giảng` (FR-III-NEW-03 PRE: "Đề kiểm tra ở NHAP") | ≥1 NHAP | NHAP | `GET /api/v1/de-kiem-tras?trangThai=NHAP` | ✅ (5/5 NHAP) |
| R7.7.6 — Khóa học 40 TC | `≥1 ĐKT cho phân phối khóa học` | ≥1 NHAP | NHAP | `GET /api/v1/de-kiem-tras` | ✅ (5/5 NHAP, đa LV) |
| Future R7.4.B11 — Phê duyệt khóa học | (depend chain qua KH workflow) | — | — | — | — |

**Acceptance pass khi:** ✅ R7.4.B10 sẵn sàng dùng — 5 ĐKT NHAP cover 5 LV (Hành chính + Lao động + Đất đai + SHTT + Thuế).

**Quy tắc 2026-05-02 R11:** State `NHAP` = default sau create per FR-III-NEW-01 Outputs → R7.3.9 chỉ là seed-create, advance state DA_PHAN_PHOI thuộc R7.4.B10.

---

## Kết quả: ✅ XONG 5/5

Seed 5 ĐKT trạng thái `Nháp` qua `POST /api/v1/de-kiem-tras` mode `THU_CONG` (1 cauHoi unique LV) — 5/5 trả `201 Created`. Mỗi ĐKT chứa 1 NHCH KICH_HOAT từ R7.3.8 R8 (cover Hành chính/Lao động/Đất đai/Thuế/SHTT). Đáp ứng acceptance R7.4.B10 dep ≥1 NHAP per LV.

**Bug:** Không log bug — flow chạy clean qua API. R7 bug DKT-FE-01 (FE max=100 vs BE max=10) đã closed verify từ trước.

---

## Bảng dữ liệu seed (R8 round)

| # | Tên đề | LV | NHCH cau hỏi | Số câu | Cách tạo | Thời gian | Điểm đạt | ID prefix | Trạng thái |
|---|--------|----|---|:---:|----------|:--------:|:--------:|-----------|:----------:|
| 1 | ĐKT cuối khóa - Pháp luật Hành chính 2026 | Hành chính (012) | `9b559e27` (TRAC_NGHIEM_NHIEU) | 1 | THU_CONG | 30 phút | 5/10 | `08d9c77e` | NHAP |
| 2 | ĐKT cuối khóa - Pháp luật Lao động 2026 | Lao động (013) | `92d5c6bd` (TRAC_NGHIEM_MOT) | 1 | THU_CONG | 30 phút | 5/10 | `38468bd1` | NHAP |
| 3 | ĐKT cuối khóa - Luật Đất đai 2026 | Đất đai (014) | `7be46d4a` (TU_LUAN) | 1 | THU_CONG | 30 phút | 5/10 | `7a39133e` | NHAP |
| 4 | ĐKT cuối khóa - Luật Quản lý thuế 2026 | Thuế (018) | `b8d00ca6` (TU_LUAN) | 1 | THU_CONG | 30 phút | 5/10 | `608ed1da` | NHAP |
| 5 | ĐKT cuối khóa - Sở hữu trí tuệ 2026 | SHTT (019) | `c6c4c97a` (TU_LUAN) | 1 | THU_CONG | 30 phút | 5/10 | `5582dbbb` | NHAP |

**Tổng:** 5 NHAP / 0 bị chặn.

---

## Verify per-LV coverage (kiểm tra 2026-05-08 19:50)

API `GET /api/v1/de-kiem-tras?page=1&pageSize=20` trả 5 record:

| Filter | Coverage | Note |
|--------|----------|------|
| **Trạng thái** | NHAP (5/5) | ✅ |
| **Cách tạo** | THU_CONG (5/5) | ✅ |
| **Lĩnh vực (5 LV)** | 5 unique: Hành chính + Lao động + Đất đai + SHTT + Thuế | ✅ R7.4.B10 dep met |
| **Số câu / đề** | 1 (mỗi đề) | Minimal valid — đủ cho R7.4.B10 walkthrough |
| **Khóa học** | "Chưa phân phối" (5/5) | ✅ NHAP đúng — chưa qua FR-III-NEW-03 phân phối |

**Side-evidence:** NHCH "Số đề sử dụng" tăng từ 0 → 1 cho 5 records dùng (cross-confirm liên kết DE_CAU_HOI thiết lập đúng theo FR-III-NEW-01 Postcondition).

---

## Note kỹ thuật — workflow POST + body

App impl dùng POST `/api/v1/de-kiem-tras` body shape:
```json
{
  "tenDe": "ĐKT cuối khóa - <LV> 2026",
  "cachTao": "THU_CONG",
  "cauHoiIds": ["<NHCH-UUID>"],
  "thoiGianLamBai": 30,
  "diemDat": 5,
  "diemToiDa": 10,
  "linhVucId": "<LV-UUID>"
}
```

- `diemDat` thang 0-10 (sau R7 fix BUG-DKT-FE-01).
- `cachTao=THU_CONG` → `cauHoiIds` required (≥1).
- `cachTao=NGAU_NHIEN` → cần `randomConfig` (chưa test trong R8).
- Default state sau create: `NHAP` (per FR-III-NEW-01 Output).

---

## So sánh round (R7 → R8)

| Round | Total | NHAP | Cover LV |
|-------|:-----:|:----:|---------|
| R7 (2026-05-07) | 0 | 0 | block bởi NHCH state drift + FE diemDat bug |
| R7→R8 transition (2026-05-08) | 0 | 0 | NHCH advance KICH_HOAT (R7.3.8 R8) |
| **R8 fix (2026-05-08 19:50)** | **5** | **5** | **5 unique LV** ✅ |

---

## Ảnh chụp

- [Final UI list 5 ĐKT NHAP cover 5 LV](r7-3-9-dkt-list-5-nhap-final.png) — Tab "Đề kiểm tra" hiển thị 5/5 record `Nháp`, `Thủ công`, 1 câu/đề, "Chưa phân phối"

---

*2026-05-08 19:50 — QA chạy bằng Chrome DevTools MCP (cb_nv_tw_02). Direct API POST atomic do JWT revoke <1 phút bug R7.4.B0 ngăn UI navigation đa-bước. R8 unblock toàn bộ R7.4.B10 chuỗi (Workflow ĐKT phân phối).*
