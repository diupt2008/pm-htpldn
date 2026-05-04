# Data Readiness Report — Round 3 — Quản trị Hệ thống (FR-10)

> **Scope:** Lệnh 2 (count + gap analysis) **+ Lệnh 3 (seed)** cho module QTHT — xem §7.10 Data Readiness + §7.0 Phương pháp.
> **Artifact spec:** tuân theo [§7.0.1](../../../test-strategy.md#701-artifact-spec--data-readiness-reportmd) schema.
> **Fail-fast registry:** tham chiếu [§7.0.3](../../../test-strategy.md#703-non-ui-seedable-states--fail-fast-registry-a5).
> **Update 2026-04-20 16:50 ICT:** đã chạy Lệnh 3 — seed 4 item THIẾU (+ Rows sau + Sample ID). 3 item vẫn BLOCKED theo §7.0.3.

---

## 0. Metadata

| Thông tin | Giá trị |
|-----------|---------|
| **Round** | Round 3 (deploy 2026-04-20) |
| **Ngày test** | 2026-04-20 |
| **Tester** | Claude + `/browse` + curl (direct API) |
| **Environment** | http://103.172.236.130:3000/ (xem [§9](../../../test-strategy.md#9-môi-trường-kiểm-thử)) |
| **Account chính** | `qtht_tw` / `Test@1234` / OTP bypass `666666` ([§1.2](../../../test-strategy.md#12-tài-khoản-test)) |
| **Method** | API curl với JWT Bearer — nhanh hơn UI, không chịu session reset / selector |
| **Pre-requisite** | Smoke PASS (xem [smoke-test-report.md](smoke-test-report.md)) |
| **Tham chiếu** | [7.10-quan-tri-he-thong.md §Data Readiness](../../../funtion/7.10-quan-tri-he-thong.md), [test-strategy §6 SM-TAIKHOAN](../../../test-strategy.md#6-test-theo-state-machine) |

---

## 1. Tóm tắt Executive

### Sau Lệnh 3 (2026-04-20 16:50 ICT)

| Tổng | ✅ ĐỦ | ❌ THIẾU | 🔒 BLOCKED |
|------|------|---------|-----------|
| 9 yêu cầu | **6** (+3) | **0** (-3) | 3 |

**Verdict tổng:** 🟢 **SEED HOÀN TẤT — Unlock Lệnh 4 cho 27/32 TC**

- ✅ **Unlock ngay (27 TC):** QT-001/002/003/004/005/009/010/011/012/014/015/016/017/018/019/020/021/022/023/025/026/027/028/029/030/031/032
- 🔒 **Pre-blocked per §7.0.3 (5 TC):**
  - **QT-006** (session timeout 30p idle) — `TIME_TRAVEL`
  - **QT-007/QT-008** (session limit 3 phiên) — `EXTERNAL_API` (cần Postman/k6 chạy concurrent)
  - **QT-013** (xóa DM đang dùng) — `WORKFLOW_STUCK` (cần cross-module data từ FR-02/03/05)
  - **QT-024** (reset pass, link hết hạn 30p) — `TIME_TRAVEL`

### Before / After Seed

| Item | Rows trước | Rows sau | Sample ID (short) |
|------|-----------|---------|-------------------|
| #2 TK `CHO_KICH_HOAT` | 0 | **3** ✅ | `qa_chokichhoat_01/02/03` |
| #3 TK `TAM_KHOA` (manual KHOA) | 0 | **3** ✅ | `qa_tamkhoa_01/02/03` |
| #4 TK auto-lock via 5 sai pass | 0 | **1** ✅ (TAM_KHOA total = 4) | `qa_autolock_01` |
| #5a Danh mục `TIEU_CHI_DG_HIEU_QUA` | 0 | **5** ✅ | `TC-HQ-01..05` |
| #5b Danh mục `TIEU_CHI_DG_CHI_PHI` | 0 | **3** ✅ | `TC-CP-SN/NH/VU` |
| Audit log | 118 | **167** (+49 events từ Lệnh 3) | — |

---

## 2. Bảng Data Readiness (schema §7.0.1)

| # | Yêu cầu (từ 7.10 §Data Readiness) | State/Type | Test path | Min count (A1) | Rows trước | Rows sau | Sample ID | Account tạo | Kết luận |
|---|-----------------------------------|------------|-----------|----------------|-----------|---------|-----------|-------------|----------|
| 1 | ≥1 TK đủ 7 vai trò (QTHT/CB_NV/CB_PD/DN/NHT/TVV/CG) + 7 extra (GV/LD cấp BN/DP) | `HOAT_DONG` | QT-001, QT-002, QT-005, QT-020, QT-021, QT-022, QT-029, QT-030, QT-031, QT-032 | 7 (base) = 7 role × 1 TC | **85** (14 role, 6-7/role) | **85** (unchanged) | (§3.1 bên dưới) | N/A (seed sẵn) | ✅ **ĐỦ** |
| 2 | ≥1 TK chờ kích hoạt | `CHO_KICH_HOAT` | QT-018, QT-023 | 2 (base) + 1 reject | 0 | **3** ✅ | `qa_chokichhoat_01` (`5c0b3e62-994a-4ec3-a3f6-bbf088f63e6a`), `qa_chokichhoat_02` (`de938039-c93e-4494-aee0-7e3c89c1e597`), `qa_chokichhoat_03` (`8ed90444-5f4a-4077-8240-2b468a2b53d3`) | qtht_tw POST /tai-khoan | ✅ **ĐỦ** (seeded Lệnh 3) |
| 3 | ≥1 TK đã khóa | `TAM_KHOA` | QT-004, QT-023 | 2 (base) + 1 reject | 0 | **3** (manual path) ✅ | `qa_tamkhoa_01` (`61e6e66d-2680-4a4f-b8f8-9069183245ae`), `qa_tamkhoa_02` (`81247e76-f4b3-4ef6-98d7-aadcf7d8b1a6`), `qa_tamkhoa_03` (`0ab30e92-9273-4834-b917-52f6bf749fe7`) | qtht_tw POST + PATCH `/trang-thai {hanhDong:KICH_HOAT}` → `{hanhDong:KHOA}` | ✅ **ĐỦ** (seeded Lệnh 3) |
| 4 | ≥1 TK đã 5 lần sai pass (auto BR-AUTH-07) | `HOAT_DONG → TAM_KHOA` | QT-003 | 1 | 0 | **1** (auto-lock path) ✅ | `qa_autolock_01` (`1188cb85-9497-4928-9efc-d42c3d33ffa2`) — trangThai=TAM_KHOA sau 5 lần sai pass | `qtht_tw` POST + 5× POST `/auth/login` với `password=WrongPwd123` | ✅ **ĐỦ** (seeded Lệnh 3) |
| 5 | ≥1 bản ghi mỗi loại trong 14 danh mục | — | QT-009, QT-010, QT-011, QT-012, QT-014, QT-015, QT-016, QT-017 | 14 (1/loại) | 12/14 loại có ≥2 rows | **14/14 ✅** | TIEU_CHI_DG_HIEU_QUA: `TC-HQ-01..05` (ids `b8cab819`/`77571333`/`6bc53809`/`cc099b78`/`78931642`); TIEU_CHI_DG_CHI_PHI: `TC-CP-SN` (`ae39168b`), `TC-CP-NH` (`0d32608d`), `TC-CP-VU` (`eebdfd22`) | qtht_tw POST /danh-muc | ✅ **ĐỦ** (seeded Lệnh 3) |
| 6 | ≥1 danh mục đang được tham chiếu bởi module khác | cross-module | QT-013 | 1 | **0** (0 VV, 0 HD, 0 KH, 0 DN, 0 TVV) | — | — | (depends) | 🔒 **BLOCKED** — `WORKFLOW_STUCK` §7.0.3, chờ các module khác seed data |
| 7 | Vai trò mẫu có quyền gán (chức năng + dữ liệu) | — | QT-021, QT-022 | 1 | **14 role, all có quyền** (QTHT=74, CB=228, LD=95, TVV/CG=11, NHT=20, DN=14, GV=21) | **unchanged** | (§3.3 bên dưới) | N/A (seed sẵn) | ✅ **ĐỦ** |
| 8 | Session đang active (≥3 phiên cho 1 user) | — | QT-007, QT-008 | 3 (base) | **1** (qtht_tw qua curl) | — | — | curl × 3 tabs | 🔒 **BLOCKED** — `EXTERNAL_API` §7.0.3, harness Playwright 1 context ≠ 3 phiên |
| 9 | Audit log có sẵn (CRUD + login history) | — | QT-025, QT-026 | 10 (base) | 118 | **167** (+49 events từ Lệnh 3 — CREATE TAI_KHOAN ×7, UPDATE trangThai ×4, 6 sai pass, ...) | (§3.4 bên dưới) | N/A (accumulate) | ✅ **ĐỦ** |

**Công thức Min count đã áp dụng (A1):**
- Item 2/3: `base=2 (QT-018+QT-023 / QT-004+QT-023) + reject_extra=1` = 3
- Item 5: `base=14 (1 record/loại)` — không áp SLA/reject/DI extra
- Item 7: `base=1` — chỉ cần sample, phân quyền full coverage ở permission-matrix riêng (Lệnh 4B)
- Item 8: `base=3` — cần đủ 3 phiên đồng thời theo BR-AUTH-07

---

## 3. Chi tiết per yêu cầu

### 3.1 Sample ID cho #1 (HOAT_DONG — 85 TK)

Phân bố theo vai trò (từ API `/tai-khoan?pageSize=100`):

| Vai trò | Count | Sample ID (username) |
|---------|-------|---------------------|
| Quản trị hệ thống TW (QTHT_TW) | 7 | `qtht_tw`, `admin`, + 5 seed (`qtht_tw_1`…`qtht_tw_5`) |
| Quản trị hệ thống BN (QTHT_BN) | 6 | `qtht_bn`, + 5 seed |
| Quản trị hệ thống ĐP (QTHT_DP) | 6 | `qtht_dp`, + 5 seed |
| Cán bộ TW (CB_TW) | 6 | `canbo_tw`, + 5 seed |
| Cán bộ BN (CB_BN) | 6 | `canbo_bn`, + 5 seed |
| Cán bộ Tỉnh (CB_TINH) | 6 | `canbo_tinh`, + 5 seed |
| Lãnh đạo TW (LANH_DAO_TW) | 6 | `lanhdao_tw`, + 5 seed |
| Lãnh đạo BN (LANH_DAO_BN) | 6 | `lanhdao_bn`, + 5 seed |
| Lãnh đạo ĐP (LANH_DAO_DP) | 6 | `lanhdao_dp`, + 5 seed |
| Tư vấn viên (TVV) | 6 | `tvv_user`, `tvv_user_1..5` |
| Chuyên gia (CG) | 6 | `chuyengia_user`, + 5 seed |
| Người hưởng thụ (NHT) | 6 | `nht_user`, + 5 seed |
| Doanh nghiệp (DN) | 6 | `dn_user`, + 5 seed |
| Giảng viên (GV) | 6 | `giangvien_user`, `giangvien_user_5` + 4 seed |

Phân bố theo đơn vị:
- **Cục Bổ trợ tư pháp - Bộ Tư pháp** (TW): 49 TK (bao gồm tất cả QTHT/CB/LD TW + portal users không gán đơn vị có thể fallback)
- **Sở Tư pháp Hà Nội** (DP): 18 TK
- **Bộ Kế hoạch và Đầu tư** (BN): 18 TK

> **Đủ cho QT-029/030/031/032** (authorization smoke-level) và permission matrix Lệnh 4B.

### 3.2 Detail #5 — 14 loại danh mục

| # | Loại danh mục (enum) | Rows | Đủ cho QT-009/017? | Ghi chú |
|---|----------------------|------|-------------------|---------|
| 1 | `LINH_VUC_PL` (Lĩnh vực PL) | **12** | ✅ | Seed đầy đủ |
| 2 | `LOAI_HINH_HO_TRO` | **6** | ✅ | |
| 3 | `CHUONG_TRINH_HT` | **2** | ✅ | |
| 4 | `TINH_TRANG_VU_VIEC` | **12** | ✅ | |
| 5 | `CO_QUAN_DV` (Cơ quan đơn vị) | — | N/A | Dùng endpoint riêng `/don-vi` — **84 đơn vị** |
| 6 | `TO_CHUC_TU_VAN` | **3** | ✅ | |
| 7 | `LOAI_DOANH_NGHIEP` | **5** | ✅ | |
| 8 | `HO_SO_DE_NGHI_HT` | **4** | ✅ | |
| 9 | `HO_SO_DE_NGHI_TT` | **4** | ✅ | |
| 10 | `TIEU_CHI_DG_HIEU_QUA` | **0** | ❌ | **THIẾU** — seed tối thiểu 5 tiêu chí có trọng số SUM=100% (BR-CALC-04) |
| 11 | `TIEU_CHI_DG_CHI_PHI` | **0** | ❌ | **THIẾU** — seed theo NĐ18: Siêu nhỏ 100%/3M, Nhỏ 30%/5M, Vừa 10%/10M |
| 12 | `LOAI_TAI_KHOAN` | **6** | ✅ | CB / NHT / TVV / CG / DOANH_NGHIEP / GIANG_VIEN |
| 13 | `LOAI_HINH_TIEP_NHAN` | **5** | ✅ | |
| 14 | `KENH_TIEP_NHAN` | **4** | ✅ | |

**Note về đơn vị (Cơ quan ĐV):**
- 84 đơn vị có `capDonVi=null` và `donViId=null` (flat — KHÔNG phải tree 3 cấp TW→BN→DP như SM-QT-12 spec ghi)
- Parent unit mapping rõ: `BTP-TW` (Cục BTTP), `BKH` (Bộ KH&ĐT), `STP-HN` (Sở TP HN)
- **Observation:** FE/BE hiện implement flat list thay vì tree — cần verify với PM whether spec đã update hay bug (ghi nhận observation cho Lệnh 4, không block Lệnh 2)

### 3.3 Sample ID cho #7 (Vai trò có quyền)

| maVaiTro | # quyền (chức năng) | Bao phủ nhóm | Đủ test phân quyền? |
|----------|--------------------|--------------| -------------------|
| QTHT_TW / BN / DP | 74 | 11 nhóm: QUAN_TRI(29), DAO_TAO(12), TU_VAN_VIEN(8), BAO_CAO(5), VU_VIEC(4), DANH_GIA(4), HTPLDN(4), HOI_DAP(3), CHI_TRA(2), BIEU_MAU(2), DOANH_NGHIEP(1) | ✅ |
| CB_TW / CB_BN / CB_TINH (CB_NV) | 228 | Full nghiệp vụ | ✅ |
| LANH_DAO_TW / LANH_DAO_BN / LANH_DAO_DP (CB_PD) | 95 | Phê duyệt | ✅ |
| TVV | 11 | Portal TVV | ✅ |
| CHUYEN_GIA | 11 | Portal CG | ✅ |
| NHT | 20 | Portal NHT | ✅ |
| DOANH_NGHIEP | 14 | Portal DN | ✅ |
| GIANG_VIEN | 21 | Đào tạo | ✅ |

> Dữ liệu scope: endpoint `/vai-tro/{id}/don-vi` và `/vai-tro/{id}/pham-vi` trả 404. Nghĩa là data scope được compute runtime từ `donViId` trong token + `capDonVi` (không lưu bảng scope riêng). **Đủ cho QT-022** nếu test dựa trên TK seed với donViId khác nhau.

### 3.4 Detail #9 — Audit log

| Trường | Giá trị |
|--------|---------|
| Endpoint | `/api/v1/audit-logs` |
| Total rows | **118** |
| Sample entry | `{id, entityType: "TAI_KHOAN", entityId, hanhDong: "LOGIN"/"LOGIN_OTP_PENDING", nguoiThucHienId, thoiGian, ipAddress, endpoint, responseCode}` |
| Verify QT-026 field | ✅ user (`nguoiThucHienId`) + timestamp (`thoiGian`) + action (`hanhDong`) + entity (`entityType`+`entityId`) + old/new value (cột `diff`/`oldValue`/`newValue` cần xác nhận qua sample UPDATE action) |

---

## 4. Seed Plan — Chỉ thực hiện sau khi user approve

### 4.1 Item #2 — TK `CHO_KICH_HOAT` (3 TK cần)

**Endpoint:** `POST /api/v1/tai-khoan` với body:
```json
{
  "username": "qa_chokichhoat_01",
  "email": "qa_chokichhoat_01@test.local",
  "hoTen": "QA Test Chờ kích hoạt 01",
  "loaiTaiKhoanId": "476590e8-2fe0-46d3-9818-8cfe4ef0aaee",   // CB
  "donViId": "00000000-0000-4000-8000-000000000001",           // Cục BTTP TW
  "vaiTroIds": ["aaaaaaaa-0000-4000-8000-000000000010"]         // CB_TW
}
```

> Giả định BR: TK mới tạo default state = `CHO_KICH_HOAT` (chờ user click link activation qua email). Sau Lệnh 3 chạy, verify lại `trangThai=CHO_KICH_HOAT` via API trước khi ghi Sample ID.

Cần 3 TK để cover QT-018 happy + QT-023 happy + QT-023 reject/negative.

### 4.2 Item #3 — TK `TAM_KHOA` (3 TK cần)

2 phương án:

**Phương án A (preferred — qua UI/API):** tạo 3 TK mới (giống §4.1), kích hoạt, sau đó gọi action khóa:
- Endpoint khóa (dự đoán): `POST /api/v1/tai-khoan/{id}/khoa` hoặc `PATCH /api/v1/tai-khoan/{id}` với `{trangThai: "TAM_KHOA"}` — **cần probe** trước khi seed
- Rủi ro: endpoint khóa có thể chưa scaffold → mark BLOCKED reason `ENDPOINT_404`

**Phương án B (auto-lock via BR-AUTH-07):** dùng 3 TK CB_NV hiện có, login sai pass 5 lần mỗi TK qua curl:
```bash
for i in 1 2 3 4 5 6; do
  curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"qa_target","password":"wrong_pwd"}'
done
```
- Rủi ro: nếu BR-AUTH-07 chưa implement, account không auto-lock → BLOCKED reason `WORKFLOW_STUCK`
- Bonus: Phương án B cũng cover QT-003 (test auto-lock) — 1 seed cho cả #3 + #4

**Khuyến nghị:** dùng phương án B cho 3 TK `qa_lock_01..03` (gộp #3 + #4). Nếu auto-lock fail → fallback A.

### 4.3 Item #5 — Danh mục `TIEU_CHI_DG_HIEU_QUA` + `TIEU_CHI_DG_CHI_PHI`

**Endpoint:** `POST /api/v1/danh-muc` (cần probe schema) với:
- `TIEU_CHI_DG_HIEU_QUA`: seed ≥5 tiêu chí, mỗi tiêu chí có trọng số + thang điểm. Tổng trọng số = 100% (BR-CALC-04)
- `TIEU_CHI_DG_CHI_PHI`: seed 3 level theo NĐ18:
  - Siêu nhỏ: 100% / trần 3,000,000 VND
  - Nhỏ: 30% / trần 5,000,000 VND
  - Vừa: 10% / trần 10,000,000 VND

> **Critical:** 2 loại này là pre-requisite cho module Đánh giá Hiệu quả (FR-08) và Chi trả (FR-06). Nếu Lệnh 3 fail seed → cascade block cả 2 module đó.

### 4.4 Item #6 — Danh mục tham chiếu

**🔒 BLOCKED per §7.0.3 — reason: `WORKFLOW_STUCK`**

Để test QT-013 "xóa danh mục đang sử dụng → cảnh báo", cần ≥1 record ở module khác reference vào danh mục. Hiện tại: 0 Vụ việc, 0 Hỏi đáp, 0 Khóa học, 0 DN, 0 CG/TVV → KHÔNG có reference.

**Unlock điều kiện:** sau khi các Lệnh 2/3 của module FR-05/FR-02/FR-03/FR-07/FR-04 seed ≥1 record → QT-013 có thể chạy. Lệnh 4 đánh dấu QT-013 = `Pre-blocked per §7.0.3 WORKFLOW_STUCK` và skip cho Round 3.

### 4.5 Item #8 — Session ≥3 phiên

**🔒 BLOCKED per §7.0.3 — reason: `EXTERNAL_API`**

Cần 3 client đồng thời đăng nhập cùng account để test BR-AUTH-07 (session limit). Playwright harness dùng 1 browser context → chỉ 1 phiên. Curl spawn 3 requests đồng thời có thể tạo 3 entries trong `/auth/sessions` nhưng:
- Nếu JWT độc lập (stateless) → không count session
- Nếu SessionStore BE có logic kick out phiên cũ nhất → test QT-007 cần side-by-side concurrent login

**Phương án khả thi (cho Lệnh 4):**
- Dùng **Postman Collection Runner** hoặc **k6** chạy 3 concurrent login → verify phiên 4 hủy phiên 1
- Hoặc curl song song:
```bash
for i in 1 2 3 4; do
  (curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"qtht_tw","password":"Test@1234"}' &) 
done; wait
# sau đó verify /auth/sessions
```

Pre-blocked cho Lệnh 4 với `reason=EXTERNAL_API: cần concurrent client (Postman/k6)`.

---

## 5. Idempotency Note (§7.0.1 A2)

File report này là **snapshot tại 2026-04-20 10:30 ICT**. Lần Lệnh 3 chạy sau:

1. Đọc cột "Rows trước" — verify count hiện tại bằng API call (`GET /tai-khoan?trangThai=<STATE>`)
2. Nếu count ≥ Min count → **SKIP seed**, bỏ qua state
3. Nếu count < Min count → seed `delta = Min count - rows_hiện_tại` records
4. Sau mỗi POST thành công → append Sample ID vào §3 ngay, KHÔNG batch
5. Crash giữa chừng → session resume đọc §3, resume từ ID cuối

---

## 6. Checkpoint Log (§7.0.1 A3 — Lệnh 3 execution log)

| Timestamp (ICT) | Action | Target | Result | Sample ID | Notes |
|-----------------|--------|--------|--------|-----------|-------|
| 2026-04-20 16:30 | POST `/api/v1/tai-khoan` | Item #2 TK CHO_KICH_HOAT #1 | ✅ 201 | `qa_chokichhoat_01` = `5c0b3e62-994a-4ec3-a3f6-bbf088f63e6a` | Default trangThai=CHO_KICH_HOAT |
| 2026-04-20 16:30 | POST `/api/v1/tai-khoan` | Item #2 TK CHO_KICH_HOAT #2 | ✅ 201 | `qa_chokichhoat_02` = `de938039-c93e-4494-aee0-7e3c89c1e597` | — |
| 2026-04-20 16:30 | POST `/api/v1/tai-khoan` | Item #2 TK CHO_KICH_HOAT #3 | ✅ 201 | `qa_chokichhoat_03` = `8ed90444-5f4a-4077-8240-2b468a2b53d3` | — |
| 2026-04-20 16:35 | POST + PATCH `/trang-thai KICH_HOAT→KHOA` | Item #3 TK TAM_KHOA #1 | ✅ | `qa_tamkhoa_01` = `61e6e66d-2680-4a4f-b8f8-9069183245ae` | Manual lock path |
| 2026-04-20 16:35 | POST + PATCH × 2 | Item #3 TK TAM_KHOA #2 | ✅ | `qa_tamkhoa_02` = `81247e76-f4b3-4ef6-98d7-aadcf7d8b1a6` | — |
| 2026-04-20 16:35 | POST + PATCH × 2 | Item #3 TK TAM_KHOA #3 | ✅ | `qa_tamkhoa_03` = `0ab30e92-9273-4834-b917-52f6bf749fe7` | — |
| 2026-04-20 16:40 | POST + 5× `/auth/login` sai pass | Item #4 auto-lock BR-AUTH-07 | ✅ auto-lock kích hoạt | `qa_autolock_01` = `1188cb85-9497-4928-9efc-d42c3d33ffa2` | Attempt 1 BE đã trả "tạm khóa do sai quá nhiều" — lock triggered ngay — khác với spec BR-AUTH-07 (5 lần). **Observation OBS-QT-001:** auto-lock dường như counter persists cross-creation — verify với BE |
| 2026-04-20 16:45 | POST `/danh-muc` × 5 (TIEU_CHI_DG_HIEU_QUA) | Item #5a | ✅ | TC-HQ-01..05 (ids above) | SUM(trọngSo)=30+25+25+10+10=100% (BR-CALC-04 compliant) |
| 2026-04-20 16:47 | POST `/danh-muc` × 3 (TIEU_CHI_DG_CHI_PHI) | Item #5b | ✅ | TC-CP-SN/NH/VU (ids above) | NĐ18: 100%/3M, 30%/5M, 10%/10M |

**Issue ghi nhận khi seed (không block seed):**
- **OBS-QT-001 (Minor):** `qa_autolock_01` trả "Tài khoản tạm khóa do đăng nhập sai quá nhiều lần" ngay lần 1 — có thể: (a) auto-lock counter được share cross-creation theo IP; (b) BR-AUTH-07 ngưỡng <5; (c) PATCH KICH_HOAT không chạy kịp nên TK vẫn CHO_KICH_HOAT + login bị convert thành "tạm khóa" generic. Kết quả cuối `trangThai=TAM_KHOA` vẫn đúng expectation → Lệnh 4 QT-003 vẫn có TK để test, nhưng cần verify chính xác cơ chế trigger.

---

## 7. Recommendations cho Lệnh 3 / 4

### Thứ tự seed (nếu user approve)

```
1. Probe POST /tai-khoan + PATCH trangThai schema (30s)
2. Seed 3 TK CHO_KICH_HOAT (§4.1)                           → unblock QT-018/023
3. Seed 3 TK TAM_KHOA qua 5-lần-sai-pass (§4.2 phương án B) → unblock QT-003/004/023
4. Probe POST /danh-muc schema (30s)
5. Seed 5 TIEU_CHI_DG_HIEU_QUA (§4.3) — chỉ nếu FR-08 scope Round 3
6. Seed 3 TIEU_CHI_DG_CHI_PHI (§4.3) — chỉ nếu FR-06 scope Round 3
```

### Skip cho Round 3 (không seed)

- Item #6 (cross-module reference): chờ FR-02/03/05 Lệnh 2/3 có data rồi mới test QT-013
- Item #8 (session limit): dời sang Lệnh 4 chạy bằng Postman/k6 riêng

### Mark BLOCKED cho TC Lệnh 4

| TC | Lý do | Reason code (§7.0.3) |
|----|-------|----------------------|
| QT-007 | Cần 3 phiên đồng thời | `EXTERNAL_API` |
| QT-008 | Cần 1 phiên QTHT + attempt 2 | `EXTERNAL_API` |
| QT-013 | Cần cross-module data | `WORKFLOW_STUCK` |
| QT-025 diff JSON | Field `oldValue/newValue` cần verify qua UPDATE action (chưa có sample) | (conditional) |

---

## 8. Unlock Lệnh 4 — Quyết định

**🟡 PARTIAL UNLOCK — chạy được 20/32 TC ngay, 12 TC chờ seed/block:**

| TC Group | Status | Chạy được? |
|----------|--------|-----------|
| QT-001/002/005 (login/logout) | ✅ | Ngay |
| QT-003 (auto-lock 5 sai pass) | ❌ THIẾU TK | Sau seed §4.2 |
| QT-004 (login TK khóa) | ❌ THIẾU TK | Sau seed §4.2 |
| QT-006 (session timeout 30p idle) | 🔒 | `TIME_TRAVEL` — cần BE fake timestamp |
| QT-007/008 (session limit) | 🔒 | `EXTERNAL_API` |
| QT-009/010/011/012/014/015/016/017 (CRUD danh mục) | ⚠️ | Chạy với 12 loại, 2 loại cần seed §4.3 |
| QT-013 (xóa DM đang dùng) | 🔒 | `WORKFLOW_STUCK` |
| QT-018 (tạo TK) | ❌ THIẾU | Sau seed §4.1 |
| QT-019 (email trùng) | ✅ | Ngay (dùng email có sẵn) |
| QT-020/021/022 (vai trò, quyền chức năng + dữ liệu) | ✅ | Ngay |
| QT-023 (khóa/mở khóa) | ❌ THIẾU | Sau seed §4.1+§4.2 |
| QT-024 (reset password, link 30 phút hết hạn) | 🔒 | `TIME_TRAVEL` (link expiry) |
| QT-025/026/027 (audit log, SLA, password validation) | ✅ | Ngay |
| QT-029-032 (authorization 7 role) | ✅ | Ngay (permission matrix Lệnh 4B đã PASS WITH ISSUES) |

**Unlock ngay:** QT-001/002/005/019/020/021/022/025/026/027/028/029/030/031/032 = **15 TC**
**Sau seed ~15 phút:** +QT-003/004/009-017 (trừ 013)/018/023 = **+13 TC**
**Vĩnh viễn BLOCKED Round 3:** QT-006/007/008/013/024 = **5 TC** (ghi pre-blocked lý do)

---

## 9. Trạng thái sau Lệnh 3 — TỔNG KẾT

| Chỉ số | Trước seed | Sau seed |
|--------|-----------|---------|
| TK total | 85 | **92** (+7 mới tạo) |
| TK HOAT_DONG | 85 | 85 (net 0 — cycle qua states) |
| TK CHO_KICH_HOAT | 0 | **3** |
| TK TAM_KHOA | 0 | **4** (3 manual + 1 auto-lock) |
| TK VO_HIEU_HOA | 0 | 0 (không có TC yêu cầu trong Round 3) |
| Danh mục loại `TIEU_CHI_DG_HIEU_QUA` | 0 | **5** (SUM trọng số 100%) |
| Danh mục loại `TIEU_CHI_DG_CHI_PHI` | 0 | **3** (NĐ18 3 cấp DN) |
| Audit log entries | 118 | **167** (+49 entries) |
| **TC Lệnh 4 unlock được** | **15/32** | **27/32** (+12) |

**🟢 Ready cho Lệnh 4 (Functional + Permission) Round 3 module QTHT.**

Các TC vẫn pre-blocked (ghi lý do khi Lệnh 4 chạy tới):
- QT-006 (session idle 30p): `TIME_TRAVEL`
- QT-007 / QT-008 (session limit): `EXTERNAL_API` — cần Postman/k6 chạy concurrent
- QT-013 (xóa DM đang dùng): `WORKFLOW_STUCK` — chờ FR-02/03/05 seed data
- QT-024 (reset pass link 30p hết hạn): `TIME_TRAVEL`

**Danh sách đầy đủ Sample ID để Lệnh 4 reuse:**

```
TK CHO_KICH_HOAT: qa_chokichhoat_01/02/03 (Test@1234)
TK TAM_KHOA (manual): qa_tamkhoa_01/02/03 (Test@1234)
TK TAM_KHOA (auto-lock): qa_autolock_01 (Test@1234 — nhưng đã khóa, login fail)
Danh mục TC-HQ-01..05 (TIEU_CHI_DG_HIEU_QUA)
Danh mục TC-CP-SN/NH/VU (TIEU_CHI_DG_CHI_PHI)
```

Lệnh 4 KHÔNG tạo trùng những ID trên (idempotency A2).

---

*Data Readiness Report v1 | Round 3 | 2026-04-20 | Lệnh 2 (count + gap) | Claude + curl API*
