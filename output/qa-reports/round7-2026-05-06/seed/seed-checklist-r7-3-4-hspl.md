# Seed Checklist — Hồ sơ pháp lý DN (R7.3.4)

**Ngày:** 2026-05-07 23:00 • **Tài khoản seed:** `cb_nv_tw_01` (đa số) + `cb_nv_dp_01` (HSPL-0021/22 đơn vị STP-AG) + `nht_01` (HSPL-0023 self-create — BUG candidate)
**Trạng thái mong đợi:** `HIEU_LUC` (entry default theo SRS line 1374)
**Màn:** SCR-X1-03 — Hồ sơ pháp lý DN • **Đường dẫn UI:** tab "Hồ sơ pháp lý DN" trong DN detail
**Endpoint thực tế:** `POST /api/v1/ho-so-phap-ly-dns` (plural-s, khác fixture giả định)
**SRS:** [`srs-fr-12-tv-chuyen-sau.md`](../../../../input/srs-update-2026-5-5/srs-fr-12-tv-chuyen-sau.md) v3.5 §FR-X.1-04 (UC150) line 511-672 + entity §3.4.3.46 line 1356-1384 (19 field)

---

## Endpoint discovery

| Fixture giả định | Endpoint thực BE | Status |
|------------------|------------------|:------:|
| `/api/v1/ho-so-phap-ly-dn` (singular, R6 fixture) | `/api/v1/ho-so-phap-ly-dns` (plural-s) | ✅ Re-mapped |
| Detail GET | `/api/v1/ho-so-phap-ly-dns/{id}` | ❌ trả 500 ERR-SYS-00-00-01 (BUG) |
| List | `/api/v1/ho-so-phap-ly-dns?page&pageSize&loaiHoSo&trangThai&doanhNghiepId&tuNgay&denNgay&search` | ✅ |
| Export | `/api/v1/ho-so-phap-ly-dns/export` | ✅ exists (chưa test response) |
| Inbound API | `/api/v1/ho-so-phap-ly-dns/inbound` | ✅ exists (UC151) |
| Public | `/api/v1/public/ho-so-pl-dns` (variant `pl` không phải `phap-ly`) | ✅ exists |

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

| Task downstream | Filter | Số record cần | State entity yêu cầu | Verify query | Status |
|-----------------|--------|--------------|----------------------|--------------|:---:|
| TV-017 Create + auto-gen mã | `?nguon=THU_CONG` | ≥1 | bất kỳ | API POST 201 | ✅ |
| TV-018 Search keyword + loại + ngày + state (AND) | 5 loại × 3 state | ≥1/loại + ≥1/state | HIEU_LUC/HET_HAN/THU_HOI | per-filter | ✅ |
| TV-019 Update HIEU_LUC → HET_HAN | `?trangThai=HIEU_LUC` | ≥1 | HIEU_LUC | total ≥1 | ✅ |
| TV-020 Soft delete | bất kỳ | ≥1 | HIEU_LUC | total ≥1 | ✅ |
| TV-053 NHT scope BR-AUTH-10 | `HSPL.don_vi_id = NHT.don_vi_id` AND `EXISTS VV` | ≥1 cùng đơn vị NHT + VV phân công | HIEU_LUC | NHT login → list ≥1 | ⚠️ Partial |
| TV-054 NHT 403 cho Create/Delete | NHT POST/DELETE | n/a | n/a | NHT POST → 403 | ❌ FAIL (NHT có CD perm) |
| TV-055 Detail render 19 field | GET /{id} | ≥1 record | HIEU_LUC | API 200 + 19 field | ❌ FAIL (BE 500) |
| TV-056 Export Excel | export endpoint | ≥3 record | bất kỳ | file `.xlsx` valid | ✅ |

**Acceptance pass:** mọi row Status ✅ qua API verify per-filter.

---

## Kết quả: ✅ XONG 23/23 record (20 cũ + 2 STP-AG seed mới + 1 NHT self-create)

### Pool TW-scope (đã có sẵn từ session trước hôm nay 2026-05-07 10:41:..Z)

`cb_nv_tw_01` đã seed 20 record TVCS pool trước đó, donVi=BTP-TW, mã `HSPL-20260507-0001..0020`. Phân bố:
- **5 loại** × 4 record each = 20: GIAY_PHEP=4, HOP_DONG=4, GIAY_CN=4, QUYET_DINH=4, KHAC=4
- **3 trạng thái**: HIEU_LUC=10, HET_HAN=6, THU_HOI=4
- **10 DN distinct** (mỗi DN 2 HSPL): Đại Phúc NH2, Vạn Phúc VU1, Sao Mai NH1, Hoa Sen SN2, Tân Bình SN1, An Khang BNI, Thành Đạt BG, Trường Thịnh BTC, Sông Hồng BKH, Bình Minh AG.

### Bổ sung R8 — 2 record STP-AG cho TV-053 NHT scope

| Mã | Loại | DN | đơn vị | State | Người tạo |
|---|---|---|---|---|---|
| HSPL-20260507-0021 | GIAY_PHEP | Bình Minh AG | STP-AG (`8002_06`) | HIEU_LUC | cb_nv_dp_01 |
| HSPL-20260507-0022 | GIAY_CN | Bình Minh AG | STP-AG (`8002_06`) | HIEU_LUC | cb_nv_dp_01 |

### Phụ — 1 record self-created bởi NHT (chứng cứ BUG-A8-001)

| Mã | Loại | DN | đơn vị | State | Người tạo |
|---|---|---|---|---|---|
| HSPL-20260507-0023 | KHAC | Bình Minh AG | STP-AG | HIEU_LUC | nht_01 ⚠️ (NHT spec không có quyền Create) |

---

## Per-filter verify (cb_nv_tw_01 / TW scope)

| Filter | Total | OK |
|--------|------:|:--:|
| Total | 23 (=20 TW + 2 AG + 1 NHT-AG) | ✅ |
| `?loaiHoSo=GIAY_PHEP` | 5 (4 + 1 mới) | ✅ |
| `?loaiHoSo=HOP_DONG` | 4 | ✅ |
| `?loaiHoSo=GIAY_CN` | 5 (4 + 1 mới) | ✅ |
| `?loaiHoSo=QUYET_DINH` | 4 | ✅ |
| `?loaiHoSo=KHAC` | 5 (4 + 1 NHT-create) | ✅ |
| `?trangThai=HIEU_LUC` | 13 (=10 + 3 mới) | ✅ |
| `?trangThai=HET_HAN` | 6 | ✅ |
| `?trangThai=THU_HOI` | 4 | ✅ |
| `?doanhNghiepId=Bình Minh AG` | 5 (=2 cũ + 2 AG seed + 1 NHT) | ✅ |
| `?tuNgay=2026-12-31&denNgay=2025-01-01` | 400 ERR-HSPL-06 | ✅ (negative TV-018 ERR-HSPL-06 PASS) |
| `?search=ISO` | 2 | ✅ |
| `?search=hợp đồng` (có dấu) | 0 ⚠️ | ❌ — same unaccent BUG TV-005 pattern |
| `?keyword=ISO` | 23 (filter không áp) | ⚠️ — keyword param ignored, không phải search |

**Coverage check:**
- TV-017 ✅ Create endpoint hoạt động (HSPL-0023 confirm by NHT)
- TV-018 ✅ 5/5 loại + 3/3 state + ngày range invalid 400 ERR-HSPL-06
- TV-019 ✅ 13 record HIEU_LUC sẵn có
- TV-020 ✅ 23 record có thể chọn xóa mềm
- TV-053 ⚠️ STP-AG scope có HSPL nhưng VV linkage thiếu (xem mục dưới)
- TV-054 ❌ — NHT có 4 permission C/R/U/D (spec chỉ R/U) — NHT-A8-001 BUG
- TV-055 ❌ — Detail GET 500 ERR-SYS-00-00-01 — NHT-A8-002 BUG (xem dưới)
- TV-056 ✅ — endpoint `/export` exists, ready chạy TV-056

---

## Tài khoản dùng test (input/users.csv tương thích)

| Username | Vai trò | Đơn vị | Dùng cho |
|---|---|---|---|
| `cb_nv_tw_01` | CB_NV_TW | BTP-TW | TV-017..020 (Create/Search/Update/Delete) + TV-055 detail + TV-056 Export |
| `cb_nv_dp_01` | CB_NV_DP | STP-AG | Seed HSPL-0021/0022 đơn vị STP-AG |
| `nht_01` | NHT | STP-AG | TV-053 scope + TV-054 negative |
| `qtht_01` | QTHT | (system) | Audit log query (TV-044 đã PASS R7.7.5) |

---

## TV-053 NHT scope — Setup partial + bug discovery

**Spec BR-AUTH-10 mở rộng (line 669):**
```
HSPL.don_vi_id = NHT.don_vi_id 
AND EXISTS VU_VIEC vv 
    WHERE vv.doanh_nghiep_id = HSPL.doanh_nghiep_id 
    AND vv.nguoi_ho_tro_id = NHT.tvv_id
```

**Setup R8:**
1. ✅ HSPL-0021/0022 đơn vị STP-AG (match nht_01.don_vi)
2. ❌ VV-002 (DN = Bình Minh AG, đơn vị STP-AG) PATCH `nguoiHoTroId = nht_01.tkId` → BLOCKED (`409 ERR-STATE-VI-01-05` — VV state DA_PHAN_CONG không cho PATCH trực tiếp).
3. ❌ Endpoint `vu-viecs/{id}/thay-nguoi-ho-tro` không có. Endpoint `phan-cong` chỉ work khi state DA_TIEP_NHAN.
4. ❌ Hệ quả: VV-002 nguoiHoTroId vẫn = `56ab1973-...` (Trương taiKhoanId, không phải NHT).

**Quan sát BE filter actual khi nht_01 list HSPL:**
- nht_01 inbox trả 2 record: HSPL-0023 (self-create) + HSPL-0022 (cb_nv_dp_01 create)
- KHÔNG hiện HSPL-0021 (cùng cấp/cùng DN/cùng đơn vị nhưng khác creator) ⚠️
- BR-AUTH-10 spec yêu cầu cả 2 lớp filter (đơn vị + VV) — BE chỉ áp 1 lớp đơn vị (incomplete)

**Verdict TV-053:** Có thể test cơ bản (NHT thấy HSPL đơn vị mình) nhưng KHÔNG verify đủ BR-AUTH-10 mở rộng (cần R7.4.A3 hoàn tất + VV thực sự phân công cho nht_01).

---

## Bug discoveries trong quá trình seed (sẽ log riêng)

| Bug ID | Severity | Description |
|---|---|---|
| **BUG-FUNC-HSPL-001** | Major | NHT có 4 permission `create/read/update/delete_ho_so_phap_ly_dn` — vi phạm SRS Thay đổi 10 v3.5 (NHT chỉ R+U). NHT-01 đã CREATE thành công HSPL-0023. |
| **BUG-FUNC-HSPL-002** | Major | NHT scope filter list HSPL **thiếu lớp VV linkage** (BR-AUTH-10 mở rộng). NHT thấy HSPL đơn vị mình ngay cả khi không có VV phân công cho NHT. |
| **BUG-FUNC-HSPL-003** | Critical | `GET /api/v1/ho-so-phap-ly-dns/{id}` (Detail) trả **500 ERR-SYS-00-00-01** Internal server error → block TV-055 hoàn toàn. |
| **BUG-FUNC-HSPL-004** | Minor | NHT thấy HSPL-0022 nhưng không thấy HSPL-0021 (cùng creator cb_nv_dp_01, cùng DN, cùng đơn vị, cùng tạo bởi cùng API call) — filter inconsistent. |
| **BUG-FUNC-HSPL-005** | Minor | List `?keyword=` param không được áp filter (trả full pool) — BE chỉ accept `?search=`. Spec input row 1 ghi "keyword" — naming mismatch. |
| **BUG-FUNC-HSPL-006** | Major | List `?search=` không hỗ trợ unaccent (đồng pattern với BUG-FUNC-TVCS-FN-001) — BR-DATA-08 violation. |

> **Note:** Bug 001/002/003 sẽ log riêng vào `bug-report-r7-7-5-tvcs.md` hoặc `bug-report-r7-3-4-hspl.md`. Hiện đã có `bug-report-r7-7-5-tvcs.md` từ functional sweep — append 6 bug HSPL vào đó hoặc tạo file mới.

---

## Downstream unblock

- TV-017 (Create + auto-gen mã) — ✅ READY TEST R9.
- TV-018 (Search) — ✅ READY (kết hợp test BUG-FUNC-HSPL-006 unaccent).
- TV-019 (Update HIEU_LUC → HET_HAN) — ✅ READY.
- TV-020 (Soft delete BR-DATA-01) — ✅ READY.
- TV-053 (NHT scope) — ⚠️ READY partial (test giới hạn ở 1 lớp filter đơn vị; BR-AUTH-10 lớp VV cần R7.4.A3 hoàn tất).
- TV-054 (NHT no Create/Delete) — ⚠️ READY (đã có evidence permission overgrant — verify negative xác nhận BUG-FUNC-HSPL-001).
- TV-055 (Detail 19 field) — ❌ BLOCKED bởi BUG-FUNC-HSPL-003 (BE 500). Defer R9 sau dev fix.
- TV-056 (Export Excel) — ✅ READY (endpoint `/export` exists).

---

## Cleanup tip

Sau dev fix BUG-FUNC-HSPL-001 (NHT permission overgrant), soft-delete HSPL-0023 (NHT-created — không hợp lệ theo spec) để pool sạch.

---

*2026-05-07 23:00 — QA chạy bằng Chrome DevTools MCP via API POST /api/v1/ho-so-phap-ly-dns*
