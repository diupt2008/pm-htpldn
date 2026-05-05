# Delta Map — FR-12 update (Tư vấn pháp luật chuyên sâu)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md` (1563 lines) so với `srs-v3/srs-fr-12-tv-chuyen-sau.md` (1297 lines, Δ +20%) — file thay đổi NHỎ.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude

---

## 1. Có gì mới / đổi / xoá

### Thay đổi DUY NHẤT (theo lịch sử thay đổi 2026-05-05)

**BỎ field `hinh_thuc_tv` orphan khỏi entity `TU_VAN_CHUYEN_SAU`:**
- Trước: `TU_VAN_CHUYEN_SAU.hinh_thuc_tv` — orphan (không có FR/Inputs/Processing/AC/Accordion nào trong Nhóm X.1 dùng)
- Sau: BỎ field này khỏi ERD (line 1179) + bảng thuộc tính 3.4.3.9
- Hình thức tư vấn quản lý ở cấp **`PHIEN_TU_VAN.hinh_thuc`** (4 enum gồm `TRUC_TIEP/...`, bắt buộc Y)
- Lý do: 1 vụ TV CS có thể có nhiều phiên với hình thức khác nhau (volume ratio 1:2)

### Section khác KHÔNG đổi

- 7 FR (FR-X.1-01 đến FR-X.1-07) — không đổi.
- 6 SCR (X1-01..X1-07) — KHÔNG đổi mới, các SCR-03..07 đã DEPRECATED v2.1 sẵn.
- SM-TVCS — không đổi.
- BR — không đổi.

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-v3.md` (master) | 49 (TVCS + PHIEN + hinh_thuc) | **A FULL** | ERD + entity attr table sync (master) |
| `srs-fr-11-bao-cao.md` | 4 (`hinh_thuc_tv`) | **B DELTA** | Báo cáo group-by `hinh_thuc_tv` — đổi nguồn sang `PHIEN_TU_VAN.hinh_thuc` |
| `srs-fr-16-api.md` | 15 (TVCS 12 + hinh_thuc_tv 3) | **B DELTA** | API response schema TVCS — bỏ field orphan |
| `srs-fr-13-tv-nhanh.md` | 4 (PHIEN_TU_VAN) | **C IMPACT** | TV nhanh share entity PHIEN_TU_VAN với TVCS — verify field `hinh_thuc` consistent |

**Không impact:** FR-01, FR-02, FR-04..FR-10, FR-14, FR-15.

---

## 3. Findings critical

1. **Field orphan đã có sẵn trong DB** — nếu BE chưa migrate, query data cũ vẫn còn `hinh_thuc_tv`. Cần verify hậu deploy.
2. **Báo cáo TT17 group-by `hinh_thuc_tv`** ở FR-11 — phải đổi nguồn sang `PHIEN_TU_VAN.hinh_thuc`. 1 vụ có nhiều phiên → group-by ở cấp phiên thay vì vụ. **Logic báo cáo có thể đổi count** (1 vụ 2 phiên → 2 row report thay vì 1).
3. **API response schema** ở FR-16 — bỏ field `hinh_thuc_tv` khỏi `/api/v1/tu-van-chuyen-saus/{id}` response. Client cũ truy cập field này → undefined.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/funtion/7.12-*.md` | Bỏ test case verify field `hinh_thuc_tv` trên TVCS detail. Thêm verify `PHIEN_TU_VAN.hinh_thuc` thay thế |
| `input/data/seed-fixture.yaml` | Verify `tv_cs_variants` không còn ref `hinh_thuc_tv` (nếu có) |
| `output/funtion/7.11-*.md` (Báo cáo) | Test case BC TT17 group-by phiên — verify count đổi (1 vụ N phiên = N row) |

---

## 5. Quy tắc tra cứu khi test / log bug

- Test/log bug TVCS field `hinh_thuc_tv` → cite `srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md` lịch sử thay đổi 2026-05-05 + ERD line 1179 đã bỏ.
- Test BC TT17 group-by → cite `PHIEN_TU_VAN.hinh_thuc` (entity cấp phiên), không cite TVCS.

---

## 6. Open issues — defer kiểm tra khi test

- **Migration data cũ:** record `TU_VAN_CHUYEN_SAU` cũ có `hinh_thuc_tv` value — dev migrate sang đâu? Hay drop column? QA verify khi test.
- **API client downstream** (Cổng PLQG, hệ thống khác đọc API outbound TVCS): có client nào đọc `hinh_thuc_tv` không? Bỏ field = breaking change cho client.
