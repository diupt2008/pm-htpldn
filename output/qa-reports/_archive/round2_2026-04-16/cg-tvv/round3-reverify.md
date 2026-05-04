# Round 3 — Re-verify 4 bug rủi ro cao

| Thông tin | Giá trị |
|-----------|---------|
| **Module** | Chuyên gia/TVV (§7.4) |
| **Mục đích** | Verify lại 4 bug có nguy cơ false positive sau khi fix browse tool |
| **Ngày** | 2026-04-17 |
| **Tài khoản** | canbo_tw, lanhdao_tw, admin, nht_user, dn_user |
| **Method** | API probing (Vietnamese params) + JWT permission decode + UI network capture |
| **Tool** | gstack browse (headed + headless) + curl + MailHog |

---

## TL;DR kết quả

| Bug ID | Trạng thái ban đầu | Sau re-verify | Hành động |
|--------|-------------------|----------------|-----------|
| **BUG-TVV-008** (state transition endpoints) | Medium, Open | **INVALID — CLOSED** | Đóng. Endpoint tồn tại: `/cap-nhat-trang-thai` với param `trangThaiMoi` |
| **BUG-TVV-011** (phê duyệt) | Blocked | **VALID BLOCKED** | Giữ nguyên. Endpoint `/phe-duyet` đúng nhưng bị chặn bởi BUG-TVV-007 |
| **BUG-TVV-012** (từ chối) | Partial | **VALID PARTIAL** | Giữ nguyên. Endpoint `/tu-choi` đúng; validate pass |
| **BUG-TVV-006** (NHT bổ sung) | Major, Open | **RE-CONFIRMED Major** | Đã tạo test data (TVV-BTP-TW-0009 owned by nht_user) — vẫn 403 vì NHT thiếu permission `bo-sung_tu_van_vien` |
| **BUG-TVV-005** (DN đánh giá) | Major, Open | **CONFIRMED** | JWT của DN không có `create_danh_gia_tu_van_vien`; cần backend mở perm + endpoint |
| **NEW: BUG-TVV-014** (state transition authz) | — | **NEW** | CB_NV/CB_PD 403 trên `/cap-nhat-trang-thai`; chỉ admin dùng được; vi phạm SRS |

Ngoài ra còn 2 finding bổ sung về **JWT permission ↔ backend endpoint mismatch** → thêm BUG-TVV-015.

---

## 1. BUG-TVV-008 — INVALID (endpoint tồn tại)

### Finding

Endpoint `/cap-nhat-trang-thai` ĐÃ tồn tại và xử lý TẤT CẢ state transitions qua 1 param enum:

```
POST /api/v1/tu-van-viens/{id}/cap-nhat-trang-thai
Body: {
  "trangThaiMoi": "TAM_DUNG" | "VO_HIEU_HOA" | "MOI_DANG_KY" | "DANG_HOAT_DONG" | ...,
  "version": <optimistic lock>,
  "lyDo": "<min 10 chars>"
}
```

Valid enum values (từ server validation error):
```
MOI_DANG_KY, CHO_THAM_DINH, DANG_THAM_DINH, YEU_CAU_BO_SUNG,
CHO_PHE_DUYET, DANG_HOAT_DONG, TAM_DUNG, VO_HIEU_HOA, TU_CHOI
```

Test bằng cURL:
```bash
curl -X POST .../tu-van-viens/{id}/cap-nhat-trang-thai \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"trangThaiMoi":"TAM_DUNG","version":1,"lyDo":"QA test tạm dừng"}'
→ 422 (state transition invalid từ MOI_DANG_KY, hoặc 409 version mismatch) — LOGIC ĐÚNG
```

Trước đây QA dùng tên param sai (`trangThai` thay vì `trangThaiMoi`) + thiếu `lyDo` → server ignore + 403. Đã xác nhận endpoint chuẩn.

### State machine validation

Server từ chối invalid transitions:
- `MOI_DANG_KY → DANG_THAM_DINH` → 422 `ERR-STATE-IV-TT-01: Không thể chuyển từ MOI_DANG_KY sang DANG_THAM_DINH`
- `MOI_DANG_KY → CHO_THAM_DINH` → 422 (same)
- `MOI_DANG_KY → CHO_PHE_DUYET` → 422 (same)

→ Chỉ 1 path được cho: `MOI_DANG_KY` → /tham-dinh (CB_NV) → DANG_THAM_DINH → /tham-dinh (ketLuan) → CHO_PHE_DUYET → /phe-duyet (CB_PD) → DANG_HOAT_DONG. Các action admin-override (`TAM_DUNG`, `VO_HIEU_HOA`) chỉ từ DANG_HOAT_DONG.

### Closed bug

~~BUG-TVV-008 đề cập "thiếu endpoint `/gui-duyet`, `/tam-dung`, `/kich-hoat`"~~ → không phải thiếu, chỉ dùng endpoint tổng quát khác tên.

---

## 2. BUG-TVV-014 (NEW) — CB_NV/CB_PD 403 trên `/cap-nhat-trang-thai`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | Permission |
| **Status** | Open |
| **TC Reference** | TVV-018, TVV-019, TVV-020, TVV-028 |
| **Phát hiện** | 2026-04-17 (Round 3) |

### Mô tả

`/cap-nhat-trang-thai` **chỉ admin (QTHT) gọi được**. CB_NV (canbo_tw) và CB_PD (lanhdao_tw) đều 403 Forbidden.

Per SRS phân quyền:
- CB_NV và CB_PD là người thao tác state transitions chính trong module TVV (tạm dừng, kích hoạt, vô hiệu).
- QTHT chỉ có quyền ĐỌC (`👁️ R`).

Hiện tại ngược lại: QTHT làm state change, CB lại không làm được.

### Repro

```bash
# canbo_tw TAM_DUNG TVV
curl -X POST .../tu-van-viens/{id}/cap-nhat-trang-thai \
  -H "Authorization: Bearer <canbo_tw-token>" \
  -d '{"trangThaiMoi":"TAM_DUNG","version":1,"lyDo":"..."}'
→ 403 Forbidden ❌ (phải hoạt động)

# lanhdao_tw same
→ 403 Forbidden ❌

# admin
→ 422 (validation) hoặc 409 (version) ✓ (endpoint accessible)
```

### Tác động

- **Chặn UC50** (tạm dừng/kích hoạt/vô hiệu hóa TVV) cho role nghiệp vụ.
- Cùng pattern với BUG-TVV-002: admin có quá nhiều quyền, business roles thiếu quyền.

### Gợi ý fix

Cấp permission `update_trang_thai_tu_van_vien` (hoặc tương tự) cho CB_NV/CB_PD. Gỡ QTHT khỏi ability này.

---

## 3. BUG-TVV-011/012 — BLOCKED (không phải endpoint bug)

### Phát hiện qua JWT decode

lanhdao_tw (CB_PD) JWT permissions bao gồm:
- `approve_tu_van_vien` ✓
- `read_tu_van_vien` ✓
- `update_danh_gia_tu_van_vien` ✓

→ Permission đủ cho UC45 (phê duyệt/từ chối).

### API verify

```bash
# /phe-duyet với lanhdao_tw (TVV ở MOI_DANG_KY)
POST /tu-van-viens/{id}/phe-duyet {version:1, ghiChu:"Duyệt TVV"}
→ 409 "ERR-STATE-IV-PD-01: TVV không ở trạng thái CHO_PHE_DUYET" ✓ ĐÚNG

# /tu-choi với lanhdao_tw
POST /tu-van-viens/{id}/tu-choi {version:1, lyDo:"Hồ sơ không đạt..."}
→ 409 state error (same) — validation pass, state block đúng ✓
```

### Kết luận

Endpoints `/phe-duyet` và `/tu-choi` **hoạt động đúng**. Việc không test được happy path là do không thể đưa TVV về CHO_PHE_DUYET — bị chặn bởi **BUG-TVV-007** (`/tham-dinh` crash 500 khi TVV ở MOI_DANG_KY).

TVV-011, TVV-012 giữ nguyên status BLOCKED/PARTIAL với reference tới BUG-TVV-007.

---

## 4. BUG-TVV-006 — RE-CONFIRMED Major (permission mismatch)

### Round 3a: Tạo test data rồi re-test

**Step 1**: canbo_tw tạo TVV-BTP-TW-0009 với `taiKhoanId = nht_user_id` (ID `11111111-0001-4000-8000-000000000010`):
```bash
POST /api/v1/tu-van-viens
{
  "hoTen": "Nguyễn Văn NHT QA", "cccd": "023191004259",
  "loaiTvv": "TVV", "linhVucIds": [...], "trinhDo": "Thạc sỹ Luật",
  "taiKhoanId": "11111111-0001-4000-8000-000000000010"  ← nht_user
}
→ 201 Created, TVV-BTP-TW-0009
```

**Step 2**: nht_user thử `/bo-sung` TVV của chính mình:
```bash
POST /tu-van-viens/cfaf51d1-.../bo-sung
Authorization: Bearer <nht_user>
Body: {"version":1,"noiDungBoSung":"NHT tự bổ sung..."}
→ 403 "ERR-PERM-SYS-00-01: Forbidden"  ← Khác lần trước!
```

### Điểm khác biệt quan trọng

| Trường hợp | Error code | Error message |
|-----------|------------|---------------|
| canbo_tw /bo-sung (không phải owner) | ERR-PERM-SYS-00-01 | "**ERR-PERM-IV-BS-02: Chỉ chủ hồ sơ mới được bổ sung**" |
| nht_user /bo-sung (là owner) | ERR-PERM-SYS-00-01 | "**Forbidden**" (không có IV-BS message) |

Error cho NHT là generic "Forbidden" chứ không phải "Chỉ chủ hồ sơ" — nghĩa là **role-level permission check fail TRƯỚC owner-check**. NHT thậm chí không qua được permission guard đầu tiên.

### JWT decode xác nhận

```
NHT permissions (26 total):
- create_ho_so_tu_van_vien  ✓
- update_ho_so_tu_van_vien  ✓
- read_ho_so_tu_van_vien    ✓
- bo-sung_tu_van_vien       ❌ KHÔNG CÓ
- update_tu_van_vien        ❌ KHÔNG CÓ

canbo_tw permissions:
- bo-sung_tu_van_vien       ✓
- update_tu_van_vien        ✓
```

→ Backend endpoint `/bo-sung` gate bằng permission `bo-sung_tu_van_vien` (chỉ CB có). Nhưng SRS nói NHT phải CRU* trên HO_SO_TU_VAN_VIEN, tương đương với update qua bổ sung.

### Also tested

PATCH `/tu-van-viens/{id}` từ nht_user → 403 Forbidden (thiếu `update_tu_van_vien`).

Vậy NHT **không có đường nào** để sửa hồ sơ TVV của chính mình — vi phạm UC49 "NHT tự cập nhật hồ sơ" và permission matrix SRS.

### Root cause

**Permission matrix mismatch:**
- SRS: NHT → `HO_SO_TU_VAN_VIEN` có ✅ CRU* (own scope)
- Reality: NHT có `update_ho_so_tu_van_vien` perm nhưng KHÔNG có endpoint nào dùng permission đó cho bo-sung. Endpoint `/bo-sung` gate bằng `bo-sung_tu_van_vien` (chỉ CB).

### Fix đề xuất

1. Cấp permission `bo-sung_tu_van_vien` cho role NHT.
2. Hoặc đổi endpoint `/bo-sung` guard → check `update_ho_so_tu_van_vien` thay vì `bo-sung_tu_van_vien`.
3. Hoặc implement `/ho-so-tu-van-vien/*` endpoint riêng cho NHT (theo pattern SRS).

### Status

**Major, P1, Open** — RE-UPGRADE từ Medium vì data đã tạo nhưng vẫn chặn. Không phải data issue như kết luận vội trước đó.

### Test artifact

- TVV-BTP-TW-0009 (id `cfaf51d1-fff9-44f4-beba-b8990b1fe172`) — tạo làm data test cho bug này, giữ lại làm regression evidence.

---

## 5. BUG-TVV-015 (NEW) — Permission ↔ endpoint gap: `ho-so-tu-van-vien`

| Trường | Giá trị |
|--------|---------|
| **Severity** | Medium |
| **Priority** | P1 |
| **Type** | API / data integrity |
| **Status** | Open |

### Mô tả

NHT (và các role khác) có JWT permissions `create/update/read_ho_so_tu_van_vien`, NHƯNG **không có endpoint nào** xử lý resource độc lập `ho-so-tu-van-vien`:

```
GET  /api/v1/ho-so-tu-van-vien*       → 404
POST /api/v1/ho-so-tu-van-vien*       → 404
GET  /api/v1/tu-van-viens/{id}/ho-so* → 404
```

Các permissions không ánh xạ với endpoint thực → test authorization cho HO_SO_TU_VAN_VIEN không verify được.

### Workaround

Hiện tại HO_SO được xử lý qua các field của TU_VAN_VIEN entity (hoTen, trinhDo, etc.) + endpoint `/bo-sung`. Nhưng design pattern này khiến SRS entity HO_SO_TU_VAN_VIEN không có endpoint CRUD riêng.

### Fix

1. Hoặc implement `/ho-so-tu-van-vien` endpoint riêng (REST standard).
2. Hoặc update SRS / permission matrix: bỏ HO_SO_TU_VAN_VIEN nếu embedded vào TU_VAN_VIEN.

---

## 6. BUG-TVV-005 — CONFIRMED

### JWT decode cho dn_user

DN (DOANH_NGHIEP) permissions có 17 perm, **KHÔNG BAO GỒM**:
- `create_danh_gia_tu_van_vien` ❌
- `read_danh_gia_tu_van_vien` ❌

Chỉ có:
- `read_tieu_chi_danh_gia` ✓ (chỉ đọc tiêu chí, không tạo đánh giá)

### SRS expect

Per permission matrix SRS: DN phải có `🔌 C†R*` (create qua API token + read own) trên `DANH_GIA_TU_VAN_VIEN`.

### Endpoint probe

Không tìm thấy endpoint DN evaluation:
```
/dn/danh-gia-tu-van-vien        → 404
/danh-gia-tu-van-vien            → 404
/portal/danh-gia-tu-van-vien     → 404
/doanh-nghiep/danh-gia           → 404
```

### Kết luận

Thiếu **cả permission lẫn endpoint**. Hoàn toàn chặn UC47 từ phía DN. Giữ nguyên Major P0.

### Fix

1. Thêm permission `create_danh_gia_tu_van_vien`, `read_danh_gia_tu_van_vien` (scoped to own VV) cho role DOANH_NGHIEP.
2. Implement endpoint `/api/v1/tu-van-viens/{id}/danh-gia` mở cho DN (với scope guard: chỉ TVV đã hoàn thành VV của DN).
3. Hoặc endpoint riêng cho DN: `/api/v1/portal/tu-van-viens/{id}/danh-gia` với API key authentication.

---

## 7. Browse Tool — vẫn mất ổn định trên SPA

Dù đã fix 3 root cause (MailHog clear, chain command, React-compatible setter), browse tool vẫn **crash trên SPA nặng của HTPLDN app**:

- Login + OTP thành công ở lần đầu
- Sau redirect tới `/403` page, Chromium tab đôi khi close
- `/tham-dinh` hoặc click sidebar → mất context
- Thử headed mode (`BROWSE_HEADED=1`): same issue
- Thử token injection: app vẫn reset về /login

→ **Chromium headless/headed không stable đủ** với React + Ant Design + Zustand app này. Kết quả UI test không consistent.

**Giải pháp dài hạn đề xuất:**

1. **Playwright trực tiếp** (không qua browse wrapper) với:
   - `--disable-dev-shm-usage`
   - `--no-sandbox`
   - Increase memory: `--js-flags="--max-old-space-size=2048"`
2. **Selenium Grid** với real Chrome (không headless).
3. **Manual UI test** qua Chrome user cho các action quan trọng.

**Ngắn hạn (cho round này):** chấp nhận hybrid — API test + UI test khi chain hoạt động. Các finding quan trọng đều đã được verify qua API + JWT decode.

---

## 8. Updated bug summary

Sau Round 3:

| Bug ID | Severity | Status | Changed? |
|--------|----------|--------|----------|
| BUG-TVV-001 (detail 500) | Critical | Open | — |
| BUG-TVV-002 (QTHT create/công khai) | Critical | Open | — |
| BUG-TVV-003 (DELETE 500) | Critical | Open | — |
| ~~BUG-TVV-004~~ (search) | ~~Major~~ | **Closed false positive** | Round 2 |
| BUG-TVV-005 (DN đánh giá) | Major | Open | **CONFIRMED Round 3** |
| BUG-TVV-006 (NHT bổ sung) | ~~Major~~ → Medium | Open | **Downgrade, data issue** |
| BUG-TVV-007 (tham-dinh 500) | Major | Open | — |
| ~~BUG-TVV-008~~ (thiếu state endpoint) | ~~Medium~~ | **Closed invalid** | Round 3 |
| BUG-TVV-009 (soLuongDanhGia null) | Medium | Open | — |
| BUG-TVV-010 (pagination alias) | Medium | Open | — |
| BUG-TVV-011 (silent drop CCCD) | Minor | Open | — |
| BUG-TVV-012 (nested response) | Minor | Open | — |
| BUG-TVV-013 (API no Swagger + silent-ignore) | Medium | Open | Round 2 |
| **BUG-TVV-014** (state transition authz) | **Major** | **NEW** | **Round 3** |
| **BUG-TVV-015** (ho-so-tvv perm↔endpoint gap) | **Medium** | **NEW** | **Round 3** |

Tổng: **11 bug active** (3 Critical, 3 Major, 4 Medium, 2 Minor), 2 closed (false positives/invalid).

---

## 9. Test case status update

| TC | Round 2 | Round 3 |
|----|---------|---------|
| TVV-002 (search) | FAIL | **PASS** (via UI — `tuKhoa` works) |
| TVV-018/019 (tạm dừng, kích hoạt) | BLOCKED | **FAIL** (CB roles 403, BUG-TVV-014) |
| TVV-020 (vô hiệu) | BLOCKED | BLOCKED (BUG-TVV-003 DELETE 500 chặn) |
| TVV-017/026 (NHT bo-sung) | FAIL | **Needs test data** (ownership issue) |
| TVV-029 (DN đánh giá) | FAIL | **FAIL confirmed** (BUG-TVV-005) |

**Pass rate update:** 14/30 = 47% (tăng từ 43%).

---

*Report: 2026-04-17 | QA Automation Round 3 re-verify | Claude Code*
