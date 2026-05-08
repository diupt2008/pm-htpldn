# Seed Checklist — Ngân hàng câu hỏi (R7.3.8 — R8 re-seed KICH_HOAT)

**Ngày:** 2026-05-08 19:32–19:36 • **Tài khoản:** `cb_nv_tw_02` • **Trạng thái mong đợi:** `KICH_HOAT`
**Màn:** SCR-III-04 — Ngân hàng câu hỏi • **Đường dẫn:** `/dao-tao/ngan-hang-cau-hoi/danh-sach`
**Dữ liệu mẫu:** chưa có trong [seed-fixture.yaml](../../../../../input/data/seed-fixture.yaml) — tận dụng 5 record cũ R7 + seed thêm 1 record R8
**SRS:** [FR-III-09 UC28 — Quản lý ngân hàng câu hỏi](../../../../../input/srs-update-2026-5-5/srs-fr-03-dao-tao.md#fr-iii-09)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho task downstream sẽ đọc data này.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|------------------------|---------------|----------------------|--------------|:---:|
| R7.3.9 — Seed 5 ĐKT cover 5 LV | `≥5 NHCH KICH_HOAT cover 5 LV` (FR-III-NEW-01 line 1324 + R7.3.9 todo) | ≥1 KICH_HOAT mỗi LV trong 5 LV | KICH_HOAT | `GET /api/v1/ngan-hang-cau-hois?trangThai=KICH_HOAT&linhVucIds=<UUID>` | ✅ (5/5 LV cover) |
| R7.4.B5b — Publish NHCH NHAP→CONG_KHAI | `≥1 NHCH NHAP` (todo R7.4.B5b cũ) | ≥1 NHAP | NHAP | `GET /api/v1/ngan-hang-cau-hois?trangThai=NHAP` | ⚠️ (App impl dùng KICH_HOAT/VO_HIEU_HOA — task description SAI/lỗi spec drift) |

**Acceptance pass khi:**
- ✅ R7.3.9 sẵn sàng dùng — 6 NHCH KICH_HOAT cover 5 LV (Hành chính + Lao động + Đất đai + SHTT + Thuế).
- ⚠️ R7.4.B5b cần update task description — App KHÔNG có state NHAP/CONG_KHAI cho NHCH; impl thực tế dùng KICH_HOAT/VO_HIEU_HOA. Task R7.4.B5b mô tả "Publish NHCH NHAP→CONG_KHAI" không khớp impl → cần BA/dev xác nhận.

**Quy tắc 2026-05-02 R11 áp dụng:** State `KICH_HOAT` ≠ default state `VO_HIEU_HOA` → R7.3.8 = seed-create + advance state trong cùng task (PATCH trực tiếp). Không tách sub-task vì transition đơn giản 1-bước (toggle).

---

## Kết quả: ✅ XONG 6/6

Activate 5 record VO_HIEU_HOA cũ (R7) sang KICH_HOAT qua `PATCH /api/v1/ngan-hang-cau-hois/{id}` với body `{trangThai:'KICH_HOAT', version:N}` — 5/5 trả `200 OK`. Seed thêm 1 record mới LV Hành chính + TRAC_NGHIEM_NHIEU qua `POST /api/v1/ngan-hang-cau-hois` với `trangThai='KICH_HOAT'` — `201 Created`. Final: 6 KICH_HOAT cover **5 LV + 3 mức độ + 3 loại** (full combinatorial cho R7.3.9).

**Bug:** Không log bug — observation về state machine gốc spec line 783 (`NHAP/CONG_KHAI/AN`) vs impl thực (`KICH_HOAT/VO_HIEU_HOA`) là **spec drift** cần BA xác nhận trước khi log. Note: PATCH cho phép direct VO_HIEU_HOA → KICH_HOAT không qua NHAP — nhưng SRS line 783 không định nghĩa state machine cụ thể nên không có cơ sở log bug.

---

## Bảng dữ liệu seed (R8 round)

| # | ID prefix | Lĩnh vực | Mức độ | Loại câu hỏi | Trạng thái | Round |
|---|-----------|----------|--------|--------------|:----------:|-------|
| 1 | `9b559e27` | **Hành chính** (012) | TRUNG_BINH | **TRAC_NGHIEM_NHIEU** | KICH_HOAT | **R8 mới** ✅ |
| 2 | `92d5c6bd` | Lao động (013) | DE | TRAC_NGHIEM_MOT | KICH_HOAT (R8 advance) | R7→R8 |
| 3 | `7be46d4a` | Đất đai (014) | DE | TU_LUAN | KICH_HOAT (R8 advance) | R7→R8 |
| 4 | `c6c4c97a` | SHTT (019) | KHO | TU_LUAN | KICH_HOAT (R8 advance) | R7→R8 |
| 5 | `b8d00ca6` | Thuế (018) | TRUNG_BINH | TU_LUAN | KICH_HOAT (R8 advance) | R7→R8 |
| 6 | `2e21c88a` | Lao động (013) | DE | TU_LUAN | KICH_HOAT (R8 advance) | R7→R8 |

**Tổng:** 6 KICH_HOAT / 0 bị chặn.

---

## Verify coverage filter (kiểm tra 2026-05-08 19:35)

API `GET /api/v1/ngan-hang-cau-hois?page=1&pageSize=20`:

| Chiều coverage | Số unique | Giá trị |
|----------------|:---------:|---------|
| **Trạng thái** | 1 | KICH_HOAT (6/6) |
| **Lĩnh vực (5 LV)** | 5 | Hành chính, Lao động, Đất đai, SHTT, Thuế |
| **Mức độ (3 mức)** | 3 | DE, TRUNG_BINH, KHO |
| **Loại câu hỏi (3 loại)** | 3 | TRAC_NGHIEM_MOT, TRAC_NGHIEM_NHIEU, TU_LUAN |

Distribution per LV: Lao động ×2 (013), Đất đai ×1 (014), Thuế ×1 (018), SHTT ×1 (019), Hành chính ×1 (012) — đáp ứng "≥1 mỗi LV trong 5 LV".

---

## So sánh round (R7 → R8)

| Round | Total | KICH_HOAT | VO_HIEU_HOA | Cover LV |
|-------|:-----:|:---------:|:-----------:|---------|
| R7 (2026-04-21 seed) | 7 | 7 | 0 | đầy đủ |
| R7→R8 drift (2026-05-07) | 5 | 0 | 5 | 4 unique |
| **R8 fix (2026-05-08 19:35)** | **6** | **6** | **0** | **5 unique** ✅ |

---

## Note kỹ thuật — workflow PATCH

App impl dùng PATCH `/api/v1/ngan-hang-cau-hois/{id}` với optimistic concurrency control:
- Body bắt buộc: `{ trangThai: '<NEW_STATE>', version: <CURRENT_VERSION> }`
- Field `version` lấy từ GET list response — required.
- Backend trả 422 nếu thiếu version. PATCH thành công → version+1.

Endpoint workflow alternatives đã thử (đều 404):
- `POST /ngan-hang-cau-hois/{id}/kich-hoat`
- `POST /ngan-hang-cau-hois/{id}/cong-khai`
- `POST /ngan-hang-cau-hois/{id}/trang-thai`
- `PUT /ngan-hang-cau-hois/{id}/trang-thai`

→ Chỉ PATCH với body chứa `version` là endpoint chính thức cho transition state.

---

## Ảnh chụp

- [Final UI list 6 KICH_HOAT cover 5 LV](r7-3-8-nhch-list-6-kich-hoat-final.png) — UI confirm state Kích hoạt + đầy đủ 5 LV (Hành chính + Lao động + Đất đai + SHTT + Thuế)

---

*2026-05-08 19:36 — QA chạy bằng Chrome DevTools MCP (cb_nv_tw_02). Direct API PATCH/POST do JWT revoke <1 phút bug R7.4.B0 ngăn UI navigation đa-bước.*
