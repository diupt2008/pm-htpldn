# Data Readiness Report — Module Đánh giá Hiệu quả Hỗ trợ (Round 2)

> **Verdict gốc (audit 2026-04-19 lần 1):** ❌ **KHÔNG SẴN SÀNG** — 9/9 state trống + 3/3 precondition thiếu.
>
> **Verdict sau seed (2026-04-19 lần 2):** ⚠️ **SEED 1/9 STATE** — chỉ seed được `NHAP` (3 bản ghi). 8 state còn lại **BLOCKED BỞI BE** (các transition endpoints `NHAP→DA_LAP_KH→DANG_PHAN_CONG→DA_PHAN_CONG` chưa build, `tieu-chi` nested POST chưa build). Functional test chỉ chạy được DG-002, DG-010, DG-011, DG-012 (tạo/list/xuất/validate).
>
> **Cập nhật schema FE:** Spec 7.8 ghi 9 state (NHAP/DA_LAP_KH/**CHO_DUYET_PC/DA_DUYET_PC**/DANG_DANH_GIA/DA_DANH_GIA/**DA_LAP_BC**/CHO_DUYET_BC/DA_DUYET_BC). Schema FE thực tế khác: NHAP/DA_LAP_KH/**DANG_PHAN_CONG/DA_PHAN_CONG**/DANG_DANH_GIA/DA_DANH_GIA/CHO_DUYET_BC/DA_DUYET_BC/**HUY** (không có DA_LAP_BC riêng). Bảng §1.1 cập nhật theo schema FE.

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 2 (2026-04-16) |
| **Ngày audit** | 2026-04-19 |
| **Tester** | Claude + `/browse` (chain mode + `curl` API trực tiếp) |
| **Environment** | http://103.172.236.130:3000/ |
| **Account dùng audit** | `canbo_tw` / `Test@1234` (OTP bypass `666666`) — token JWT role CB_TW |
| **Spec tham chiếu** | [output/funtion/7.8-danh-gia.md §Data Readiness](../../../funtion/7.8-danh-gia.md) (12 items: 9 state + 3 precondition) |
| **Strategy tham chiếu** | [test-strategy.md §1.2 + §7.0 + §9](../../../test-strategy.md) |
| **Pre-check** | ✅ Server 200, login qua API → accessToken 5188 chars, smoke module 6.8 đã PASS |

---

## 1. Executive Summary

### 1.1 Counts table — 9 state FE schema (sau seed 2026-04-19)

| # | State (FE thực tế) | Spec 7.8 tương ứng | Test path cần | Trước | Sau | Sample ID mới | Account dùng | Kết luận |
|---|-------|---------|---------------|-------|------|---------------|--------------|----------|
| 1 | NHAP | NHAP | DG-002, DG-018 | 0 | **3** | `DG-20260419-0001` (57a707aa...)<br>`DG-20260419-0002` (fc4787f3...)<br>`DG-20260419-0003` (95b5d294...) | canbo_tw | ✅ **ĐỦ** (seed ≥1, thực tế 3 combo tần suất × đối tượng) |
| 2 | DA_LAP_KH | DA_LAP_KH | DG-004, DG-005, DG-019 | 0 | 0 | — | — | ❌ **BLOCKED BE** — không có endpoint transition từ NHAP |
| 3 | DANG_PHAN_CONG | ≈ CHO_DUYET_PC | DG-020, DG-021 | 0 | 0 | — | — | ❌ **BLOCKED BE** — chưa có endpoint |
| 4 | DA_PHAN_CONG | ≈ DA_DUYET_PC | DG-022 | 0 | 0 | — | — | ❌ **BLOCKED BE** — chưa có endpoint |
| 5 | DANG_DANH_GIA | DANG_DANH_GIA | DG-007, DG-023 | 0 | 0 | — | — | ❌ **BLOCKED** — cần DA_PHAN_CONG + ≥1 VV HOAN_THANH |
| 6 | DA_DANH_GIA | DA_DANH_GIA | DG-008, DG-024 | 0 | 0 | — | — | ❌ **BLOCKED** — cần hoàn tất chấm điểm |
| 7 | CHO_DUYET_BC | ≈ CHO_DUYET_BC (bỏ DA_LAP_BC) | DG-026, DG-027 | 0 | 0 | — | — | ❌ **BLOCKED** — cần DA_DANH_GIA + BC |
| 8 | DA_DUYET_BC | DA_DUYET_BC | DG-038 | 0 | 0 | — | — | ❌ **BLOCKED** — cần CHO_DUYET_BC + lanhdao duyệt |
| 9 | HUY | (không có trong spec) | (optional) | 0 | 0 | — | — | ⏭️ **SKIP** (không yêu cầu) |

**Ghi chú mapping spec 7.8 ↔ FE schema:**
- Spec `CHO_DUYET_PC / DA_DUYET_PC` → FE `DANG_PHAN_CONG / DA_PHAN_CONG` (tên khác, meaning tương tự: đợt đang trong giai đoạn phân công / đã hoàn tất phân công).
- Spec `DA_LAP_BC` → FE không có state riêng (có thể skip vào thẳng `CHO_DUYET_BC` khi lập BC xong trình duyệt).
- FE thêm state `HUY` (cancel).

**→ Cần update spec 7.8 + SM-DANHGIA cho khớp schema FE** (issue nêu ở §6.3).

### 1.2 Precondition data (items #10-#12 spec 7.8)

| # | Loại data | Yêu cầu | Actual | Kết luận |
|---|-----------|---------|--------|----------|
| 10 | VV trạng thái `HOAN_THANH` trong kỳ | ≥3 | **0** (VV total=16, distribution: DA_TIEP_NHAN=8, DA_PHAN_CONG=3, YEU_CAU_BO_SUNG=2, TU_CHOI=1, DANG_XU_LY=2) | ❌ **THIẾU** — blocker cho DG-006, DG-037 |
| 11 | Tiêu chí trong DM hệ thống (UC109) | ≥2 | **0** (DM tree `TIEU_CHI_DANH_GIA` = 0 nodes) | ❌ **THIẾU** — blocker cho DG-039 |
| 12 | CB đủ điều kiện cùng đơn vị TW | ≥2 | **1** (chỉ `canbo_tw` — test-accounts.csv không có CB_NV TW thứ hai) | ❌ **THIẾU** — blocker cho DG-005, DG-040 |

### 1.3 Precondition filter (module page load)

| # | Loại data | Yêu cầu | Actual | Kết luận |
|---|-----------|---------|--------|----------|
| A | Danh mục lĩnh vực PL (`LINH_VUC_PL`) | ≥1 | **12** (DAN_SU, HINH_SU, HANH_CHINH, LAO_DONG, DAT_DAI, ...) | ✅ ĐỦ |
| B | Đơn vị (`/don-vi/public`) | ≥1 | **84** | ✅ ĐỦ |

### 1.4 Verdict tổng

**❌ KHÔNG SẴN SÀNG.** Không state nào có data. 3/3 precondition data THIẾU. Không thể chạy functional test cho module Đánh giá cho đến khi:
1. Module 7.4 Vụ việc seed ≥3 VV đẩy đến `HOAN_THANH` (dependency bắt buộc cho DG-006/037).
2. Module 7.10 QTHT/Danh mục seed ≥2 `TIEU_CHI_DANH_GIA` trong DM (UC109).
3. Tạo thêm ≥1 CB_NV TW (cùng đơn vị `Cục BTTP`) hoặc confirm reuse `admin` role được (admin là QTHT, không phải CB_NV — khả năng cao phải seed thêm user).
4. Xác nhận endpoint `/api/v1/tieu-chi-danh-gias` đã implement ở BE (hiện trả `404 ERR-SYS-00-04-01`).

Sau khi 4 điều trên fix, walk workflow 9 state theo §4.2.

---

## 1A. Seed log (2026-04-19 lần 2)

### 1A.1 Records tạo thành công

| # | ID | Mã | Tên đợt | Tần suất | Đối tượng | Kỳ | State |
|---|----|----|---------|----------|-----------|-----|-------|
| 1 | `57a707aa-ac54-405a-85b1-983cd88f0223` | `DG-20260419-0001` | SEED-NHAP-SO_BO_6T-VU_VIEC Q1-2026 | SO_BO_6_THANG | VU_VIEC | 2026-01-01 → 2026-06-30 | NHAP |
| 2 | `fc4787f3-b5ca-4dab-8de6-6342aff6412e` | `DG-20260419-0002` | SEED-NHAP-TRON_NAM-TONG_HOP 2026 | TRON_NAM | TONG_HOP | 2026-01-01 → 2026-12-31 | NHAP |
| 3 | `95b5d294-ac25-4057-a2fa-3966329840c6` | `DG-20260419-0003` | SEED-NHAP-SO_BO_6T-DAO_TAO H1-2026 | SO_BO_6_THANG | DAO_TAO | 2026-01-01 → 2026-06-30 | NHAP |

**Combo purpose:** phủ cả 2 tần suất (`SO_BO_6_THANG`, `TRON_NAM`) + 3 đối tượng (`VU_VIEC`, `DAO_TAO`, `TONG_HOP`) → đủ dữ liệu cho DG-001 (list + filter), DG-002 (tạo), DG-010 (xuất Excel), DG-011 (validate field bắt buộc), DG-012 (validate ngày).

### 1A.2 Blocker xác nhận qua probe — BE chưa build transition endpoints

Probe toàn bộ endpoint có thể áp dụng cho transition NHAP → DA_LAP_KH và các bước tiếp theo:

| Endpoint thử | Method | HTTP | Kết quả |
|--------------|--------|------|---------|
| `/ke-hoach-danh-gias/{id}/tieu-chis` | POST | 404 | `ERR-SYS-00-04-01 Cannot POST` — chỉ GET tồn tại |
| `/ke-hoach-danh-gias/{id}/hoan-tat-lap-kh` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/trinh-phan-cong` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/phe-duyet-phan-cong` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/trinh-duyet` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/phe-duyet` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/huy`, `/cancel`, `/submit`, `/approve` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/chuyen-trang-thai`, `/state-transition`, `/transition` | POST | 404 | — |
| `/ke-hoach-danh-gias/{id}/gui-duyet`, `/duyet`, `/tu-choi`, `/phan-cong`, `/danh-gia`, `/lap-bao-cao` | POST | 404 | — |
| PATCH `/{id}` với `{trangThai:"DA_LAP_KH",...}` | PATCH | 200 ✅ | **Silently drops `trangThai` field** — version không tăng, trangThai vẫn NHAP (BE hard-code whitelist fields) |

**Endpoint tồn tại (chỉ cho state `DA_PHAN_CONG` trở đi) — xác nhận qua error message:**

```
GET /ke-hoach-danh-gias/{id}/vu-viec-eligible
→ 400 ERR-STATE-SYS-00-01: "Ke hoach phai o trang thai DA_PHAN_CONG, hien tai la 'NHAP'"

POST /ke-hoach-danh-gias/{id}/vu-viec-select  (vuViecIds ≥1)
→ validates payload first, would fail với "không đủ VV HOAN_THANH" kể cả khi đủ state

POST /ke-hoach-danh-gias/{id}/ket-quas/complete
POST /ke-hoach-danh-gias/{id}/bao-cao/submit
POST /ke-hoach-danh-gias/{id}/bao-cao/approve
POST /ke-hoach-danh-gias/{id}/bao-cao/reject
```

**Suy ra:** BE đã build nửa sau pipeline (chọn VV → chấm điểm → BC → duyệt BC) **nhưng thiếu toàn bộ nửa đầu** (hoàn tất lập KH + phân công + duyệt PC). Không có đường nào đưa `NHAP` → `DA_PHAN_CONG` qua API.

### 1A.3 Security concern phụ

`PATCH /ke-hoach-danh-gias/{id}` **trả về `success:true`** khi body chứa `{trangThai: "DA_DUYET_BC"}` (fake), nhưng thực tế **BE silently drop field `trangThai`** trong whitelist → record không thay đổi. Hành vi này an toàn (không bypass state machine), nhưng nên trả `400 ERR-VAL` để tránh developer hiểu nhầm patch success. Log issue xem §6.4.

---

## 2. Phương pháp audit

### 2.1 Auth flow (dùng cho API probe trực tiếp)

```bash
# Bước 1: login → lấy otpToken
curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"canbo_tw","password":"Test@1234"}'
# → data.otpToken (UUID 36 chars, TTL 300s)

# Bước 2: verify-otp với OTP bypass 666666
curl -s -X POST http://103.172.236.130:3000/api/v1/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"otpToken":"<otpToken>","otpCode":"666666"}'
# → data.accessToken (JWT RS256, ~5188 chars) + refresh_token (cookie httpOnly)
```

**Lưu ý field name:** body verify-otp dùng `otpCode` (không phải `otp`). Dùng sai → 400 `ERR-VAL-SYS-00-01 — Mã OTP chỉ chứa chữ số`.

### 2.2 Count API (per state)

```bash
for S in NHAP DA_LAP_KH CHO_DUYET_PC DA_DUYET_PC DANG_DANH_GIA DA_DANH_GIA \
         DA_LAP_BC CHO_DUYET_BC DA_DUYET_BC HUY; do
  curl -s -H "Authorization: Bearer $TOKEN" \
    "http://103.172.236.130:3000/api/v1/ke-hoach-danh-gias?page=1&pageSize=1&trangThai=$S" \
    | python3 -c "import sys,json;d=json.loads(sys.stdin.read());print('$S:', d['meta']['total'])"
done
```

Tất cả 10 state (9 SM + HUY) trả `meta.total = 0`. Endpoint list không filter (`?page=1&pageSize=50`) cũng trả `meta.total = 0`, `data = []`.

### 2.3 UI confirm (smoke 6.8)

Tab "Tất cả" (mặc định chọn khi vào `/danh-gia/ke-hoach/danh-sach`) hiển thị empty state `Không có kế hoạch đánh giá nào phù hợp.` — thống nhất với API count.

![Empty list](danh-gia-list-empty.png)

### 2.4 Endpoint BE chưa implement (phát hiện phụ)

| Endpoint | Kết quả | Ghi chú |
|----------|---------|---------|
| `GET /api/v1/tieu-chi-danh-gias` | `404 ERR-SYS-00-04-01 Cannot GET` | **Khả năng BE chưa build UC109.** Test DG-004 (thiết lập tiêu chí), DG-031 (QTHT CRUD tiêu chí), DG-039 (ref từ DM) sẽ BLOCKED cho đến khi BE xác nhận endpoint path chính xác hoặc triển khai. |
| `GET /api/v1/vu-viec-ho-tros` | `404 ERR-SYS-00-04-01 Cannot GET` | Endpoint thực là `/api/v1/vu-viecs` (đã xác minh 200 OK). Note cập nhật spec khi test module 7.4. |
| `GET /api/v1/users` / `/tai-khoan` / `/nguoi-dungs` | 404 hoặc 403 Forbidden (role canbo_tw) | Không audit được count CB_NV TW qua API. Phải dùng `admin` / `qtht_tw` account. |

---

## 3. Chi tiết per state

### State 1: NHAP — 0 rows ❌

- **Test path:** DG-002 (tạo), DG-018 (hoàn tất KH).
- **Cách tạo:** `canbo_tw` → module Đánh giá → `+ Tạo kế hoạch` drawer → nhập tên + tần suất (`SO_BO_6_THANG`|`TRON_NAM`) + đối tượng (`VU_VIEC`|`DAO_TAO`|`TONG_HOP`) + kỳ đánh giá + lưu. BE auto-gen mã `DG-YYYYMMDD-001` (BR-DATA-04).
- **Blocker cảm quan:** Nên OK, endpoint `POST /api/v1/ke-hoach-danh-gias` chắc có.

### State 2: DA_LAP_KH — 0 rows ❌

- **Test path:** DG-004 (tiêu chí SUM=100%), DG-005 (phân công), DG-019 (transition từ NHAP).
- **Cách tạo:** tạo NHAP → thiết lập tiêu chí (SUM trọng số = 100% — BR-CALC-04) → save → state chuyển DA_LAP_KH.
- **Blocker:** endpoint `/tieu-chi-danh-gias` 404 (§2.4). Nếu thực sự chưa có BE, bước này **BLOCKED** hoàn toàn.

### State 3: CHO_DUYET_PC — 0 rows ❌

- **Test path:** DG-020, DG-021 (duyệt/từ chối PC).
- **Cách tạo:** canbo_tw → trình phân công (PC) với ≥1 người + ≥1 `TRUONG_NHOM` (DG-005 yêu cầu) → state chuyển CHO_DUYET_PC.
- **Blocker:** cần ≥2 CB đủ điều kiện cùng đơn vị (Precondition #12) — hiện chỉ có 1 `canbo_tw` TW.

### State 4: DA_DUYET_PC — 0 rows ❌

- **Test path:** DG-022 (chọn VV).
- **Cách tạo:** `lanhdao_tw` duyệt đợt ở CHO_DUYET_PC (BR-AUTH-05 cùng cấp).

### State 5: DANG_DANH_GIA — 0 rows ❌

- **Test path:** DG-007 (chấm điểm), DG-023 (auto-transition).
- **Cách tạo:** ở DA_DUYET_PC → chọn ≥1 VV `HOAN_THANH` trong kỳ → state chuyển DANG_DANH_GIA.
- **Blocker:** cần ≥3 VV HOAN_THANH (Precondition #10) — hiện **0**.

### State 6: DA_DANH_GIA — 0 rows ❌

- **Test path:** DG-008, DG-024 (lập BC).
- **Cách tạo:** chấm điểm xong tất cả VV trong đợt → auto-transition.

### State 7: DA_LAP_BC — 0 rows ❌

- **Test path:** DG-025 (trình duyệt BC).
- **Cách tạo:** canbo_tw lập BC (auto-tổng hợp số liệu + nhập nhận xét/kiến nghị/kinh phí thủ công — DG-008).

### State 8: CHO_DUYET_BC — 0 rows ❌

- **Test path:** DG-026, DG-027 (duyệt/từ chối BC).
- **Cách tạo:** canbo_tw trình BC.

### State 9: DA_DUYET_BC (HOÀN THÀNH) — 0 rows ❌

- **Test path:** DG-038 (auto-fill BC), verify immutability.
- **Cách tạo:** lanhdao_tw duyệt BC → gửi TB BR-NOTIF-01.

---

## 4. Dependency chain & kế hoạch seed data

### 4.1 Dependency

```
Module 7.10 QTHT/Danh mục
   └─ Seed ≥2 TIEU_CHI_DANH_GIA vào DM (UC109)          ← BLOCKER 1 (có thể BE chưa build)

Module 7.4 Vụ việc HTPL
   └─ Seed ≥3 VV → đẩy tới HOAN_THANH                   ← BLOCKER 2 (VV hiện có 16 nhưng 0 HOAN_THANH)

Module QTHT Tài khoản
   └─ Seed ≥1 CB_NV TW thứ hai cùng đơn vị Cục BTTP     ← BLOCKER 3 (1 CB_NV TW duy nhất)

Module 7.8 Đánh giá
   └─ Walk workflow 9 state (Lệnh 3 — Data Seeding)
```

### 4.2 Kế hoạch walk workflow (Lệnh 3)

Tạo **2 đợt song song** để đạt cả state giữa + state cuối, tiết kiệm credit:

| Đợt | Walk đến state | Test path cover |
|-----|----------------|-----------------|
| DG-smoke-A | NHAP → DA_LAP_KH → CHO_DUYET_PC → DA_DUYET_PC → DANG_DANH_GIA | DG-002/004/005/019/020/022/023 |
| DG-smoke-B | Từ DANG_DANH_GIA (clone) → DA_DANH_GIA → DA_LAP_BC → CHO_DUYET_BC → DA_DUYET_BC | DG-007/008/024/025/026/038 |

Nếu BE quá chậm: tạo **9 đợt rời rạc**, mỗi đợt dừng ở 1 state (nhanh debug nhưng tốn 9x effort).

### 4.3 Ước lượng effort

- **Blocker 1 (tiêu chí DM):** 1h (nếu BE chỉ cần seed DM; nếu BE chưa build endpoint → BLOCKED đến khi BE commit).
- **Blocker 2 (VV HOAN_THANH):** 2-3h walk workflow module 7.4 cho 3 VV (DA_TIEP_NHAN → DA_PHAN_CONG → DANG_XU_LY → HOAN_THANH). Cần lanhdao_tw duyệt 2 step.
- **Blocker 3 (CB TW #2):** 15m (admin tạo user mới).
- **Walk module 7.8:** 2-3h cho 2 đợt song song.
- **Total:** ~6h sau khi BLOCKER 1 (tiêu chí endpoint) được xác nhận.

---

## 5. Phân quyền & BR cần verify ở Lệnh 4

Những điểm data audit không thể xác minh một mình — đưa vào checklist Lệnh 4:

| Check | Nguồn | Note |
|-------|-------|------|
| BR-AUTH-05 (duyệt cùng cấp) | DG-020, DG-026, DG-033 | Cần ≥1 đợt do `canbo_bn` tạo + `lanhdao_tw` thử duyệt (phải FAIL). |
| BR-CALC-04 (SUM trọng số=100%) | DG-004, DG-013 | Verify cả UI (hiển thị realtime) + BE reject khi ≠100. |
| BR-FLOW-04 (lý do từ chối ≥10 ký tự) | DG-017, DG-021, DG-027 | |
| BR-NOTIF-01 (MailHog) | DG-020, DG-026 | Verify qua http://103.172.236.130:8025/. |
| Immutability tiêu chí (ERR-DG-TC-02) | DG-029 | Khi đợt vào DANG_DANH_GIA. |
| Auto-transition (DG-023) | — | Cả UI + DB. |

---

## 6. Khuyến nghị

### 6.1 Escalate với BE (blocker chính)
1. **BE chưa build 4 transition endpoints giai đoạn đầu** — cần xác nhận roadmap:
   - `POST /ke-hoach-danh-gias/{id}/tieu-chis` (thêm tiêu chí) hoặc `/{id}/hoan-tat-lap-kh` (NHAP → DA_LAP_KH)
   - `POST /ke-hoach-danh-gias/{id}/trinh-phan-cong` (DA_LAP_KH → DANG_PHAN_CONG)
   - `POST /ke-hoach-danh-gias/{id}/phe-duyet-phan-cong` (DANG_PHAN_CONG → DA_PHAN_CONG)
   - Endpoint cho cán bộ được phân công (danh sách `phan-cong-danh-gia`)
2. **Confirm endpoint tiêu chí DG:** `/api/v1/tieu-chi-danh-gias` (root level) = 404. BE có build ở root, nested `/ke-hoach-danh-gias/{id}/tieu-chis`, hay tạo gián tiếp qua nested `POST` với key khác?
3. **Align schema state:** BE/FE dùng `DANG_PHAN_CONG / DA_PHAN_CONG / HUY` còn spec 7.8 ghi `CHO_DUYET_PC / DA_DUYET_PC / DA_LAP_BC`. Chọn 1 naming convention, update cái còn lại.

### 6.2 Sau khi BE commit endpoints (Lệnh 3 tiếp theo)
1. **Seed VV HOAN_THANH:** chạy Lệnh 3 module 7.4 trước. Target: ≥3 VV với `thoiGianKetThuc` trong kỳ kế hoạch đánh giá (ví dụ 2026 Q1).
2. **Tạo CB_NV TW #2:** admin → QTHT/Tài khoản → tạo `canbo_tw2` cùng đơn vị Cục BTTP, role CB_NV. Bổ sung test-accounts.csv.
3. **Seed DM TIEU_CHI_DANH_GIA** (nếu pattern nested vẫn theo UC109): admin/qtht_tw → QTHT/Danh mục → thêm ≥2 tiêu chí nhóm `HIEU_QUA_HTPL` (BR-DATA-05 ghi audit trail).
4. **Walk state còn lại:** dùng 3 NHAP đã seed (DG-20260419-0001/0002/0003) + 3-5 đợt mới (do BE yêu cầu tiêu chí SUM=100% chắc phải tạo đợt mới khi workflow hoạt động). Ghi Sample ID vào §1.1 cột `Sample ID mới` tương ứng state.

### 6.3 Update docs
- **Spec 7.8 §State Machine:** thay state `CHO_DUYET_PC/DA_DUYET_PC/DA_LAP_BC` bằng FE thực tế `DANG_PHAN_CONG/DA_PHAN_CONG` + loại bỏ `DA_LAP_BC` (không có state riêng, BC tạo + trình gộp vào 1 bước submitBaoCao).
- **Spec 6.8 smoke:** note 9 state tabs FE đúng + thêm `HUY`.
- **CLAUDE.md:** thêm entry "Module 7.8: chỉ NHAP + nửa sau pipeline (vu-viec-select/ket-quas/bao-cao) hoạt động, 3 transition giữa chưa build".

### 6.4 Security/UX concerns phụ
- **PATCH silently drops `trangThai`:** BE cần trả `400 ERR-VAL` (`trangThai is not allowed`) thay vì `200 success`. Developer/tester sẽ nhầm state đã đổi nhưng thực tế không.
- **Endpoint response double-wrap:** `detail` trả về `{data: {data: {...}}}` (wrap 2 lần). Interceptor FE `extractErrorMessage` có thể xử lý được, nhưng script bên ngoài (curl, Postman) cần tránh nhầm.

### 6.3 Update docs
- Spec 6.8 smoke: cập nhật label nút thành `+ Tạo kế hoạch` (không phải `+ Tạo đợt đánh giá`).
- Spec 7.8 funtion: thêm note "Precondition #12 (CB ≥2 cùng đơn vị) hiện test-accounts chỉ có 1 CB_NV TW, cần seed trước Lệnh 3".
- Ghi endpoint `/api/v1/tieu-chi-danh-gias` vào bug-report nếu BE xác nhận chưa build.

---

## 7. Evidence

### 7.1 Screenshot
- `danh-gia-list-empty.png` — tab Tất cả, empty state `Không có kế hoạch đánh giá nào phù hợp.` (xác nhận 0 row UI).

### 7.2 API log (raw)

```
GET /api/v1/ke-hoach-danh-gias?page=1&pageSize=50
→ 200 {success:true,data:[],meta:{total:0,page:1,pageSize:50,totalPages:0}}

GET /api/v1/ke-hoach-danh-gias?trangThai=NHAP         → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DA_LAP_KH    → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=CHO_DUYET_PC → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DA_DUYET_PC  → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DANG_DANH_GIA→ total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DA_DANH_GIA  → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DA_LAP_BC    → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=CHO_DUYET_BC → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=DA_DUYET_BC  → total:0
GET /api/v1/ke-hoach-danh-gias?trangThai=HUY          → total:0

GET /api/v1/vu-viecs?page=1&pageSize=20
→ 200 total:16 — distribution {DA_TIEP_NHAN:8, DA_PHAN_CONG:3, YEU_CAU_BO_SUNG:2, TU_CHOI:1, DANG_XU_LY:2}
GET /api/v1/vu-viecs?trangThai=HOAN_THANH → total:0

GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL → 12 nodes
GET /api/v1/danh-muc/tree?loaiDanhMuc=TIEU_CHI_DANH_GIA → 0 nodes
GET /api/v1/don-vi/public → 84 don vi

GET /api/v1/tieu-chi-danh-gias → 404 ERR-SYS-00-04-01 Cannot GET
```

### 7.3 Seed log (raw, lần 2)

```
POST /api/v1/ke-hoach-danh-gias  {tenDot:"SEED-NHAP-SO_BO_6T-VU_VIEC Q1-2026",tanSuat:"SO_BO_6_THANG",doiTuong:"VU_VIEC",...}
→ 200 success, id=57a707aa..., maKeHoach=DG-20260419-0001, trangThai=NHAP, version=1

POST /api/v1/ke-hoach-danh-gias  {tenDot:"SEED-NHAP-TRON_NAM-TONG_HOP 2026",tanSuat:"TRON_NAM",doiTuong:"TONG_HOP",...}
→ 200 success, id=fc4787f3..., maKeHoach=DG-20260419-0002, trangThai=NHAP, version=1

POST /api/v1/ke-hoach-danh-gias  {tenDot:"SEED-NHAP-SO_BO_6T-DAO_TAO H1-2026",tanSuat:"SO_BO_6_THANG",doiTuong:"DAO_TAO",...}
→ 200 success, id=95b5d294..., maKeHoach=DG-20260419-0003, trangThai=NHAP, version=1

POST /{id}/tieu-chis / /trinh-phan-cong / /phe-duyet-phan-cong / /trinh-duyet / /hoan-tat-lap-kh
   /huy / /cancel / /submit / /approve / /chuyen-trang-thai / /state-transition / /transition
   /gui-duyet / /duyet / /tu-choi / /phan-cong / /danh-gia / /lap-bao-cao
→ TẤT CẢ 404 ERR-SYS-00-04-01 Cannot POST

PATCH /{57a707aa...} {trangThai:"DA_LAP_KH", version:1}
→ 200 success (silent drop trangThai, version không tăng)

GET  /{57a707aa...}/vu-viec-eligible
→ 400 ERR-STATE-SYS-00-01 "Ke hoach phai o trang thai DA_PHAN_CONG, hien tai la 'NHAP'"

Final count (2026-04-19 lần 2):
  NHAP=3, DA_LAP_KH=0, DANG_PHAN_CONG=0, DA_PHAN_CONG=0,
  DANG_DANH_GIA=0, DA_DANH_GIA=0, CHO_DUYET_BC=0, DA_DUYET_BC=0, HUY=0
```

### 7.4 FE service file ref

Service `/src/services/ke-hoach-danh-gia.api.ts` có 21 methods:
- `list, detail, create, update, remove, batchDelete, export` (CRUD + bulk)
- `listTieuChi` (GET only — chưa có CRUD)
- `getEligibleCases, selectCases` (VV selection — gate `DA_PHAN_CONG`)
- `getKetQuas, batchSaveScores, completeScoring` (scoring)
- `getBaoCao, updateBaoCao, submitBaoCao, approveBaoCao, rejectBaoCao, exportBaoCao` (BC workflow)
- `getBaoCaoThongKeHieuQua` (thống kê global)

**Thiếu methods:** `hoanTatLapKh`, `trinhPhanCong`, `pheDuyetPhanCong`, `tuChoiPhanCong`, `huy` — 5 methods workflow giai đoạn đầu. FE hook `use-ke-hoach-danh-gia.ts` cũng không dùng endpoint nào khác keHoachDanhGiaApi → confirm FE chưa expose transition khác.

---

*Data Readiness v2.0 | 2026-04-19 | PM HTPLDN QA Round 2 | Module 7.8 Đánh giá | Seed pass 1/9 (NHAP only)*
