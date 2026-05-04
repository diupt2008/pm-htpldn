# T0.1 — Prep Log Round 5

**Run:** 2026-04-26 21:25-21:34 (~9 phút)
**Tool:** Chrome DevTools MCP (primary) + curl (env + DN API)
**Tester:** automated MCP session
**Acceptance:** `curl http://103.172.236.130:3000/` OK + MCP smoke + 10/11 UI login OK + DN role API-only verified

---

## 1. Env verify

| Check | Command | Result |
|---|---|---|
| FE root | `curl -sSf http://103.172.236.130:3000/` | ✅ HTTP 200 · 0.107s |
| MCP smoke | `new_page /login` + `wait_for "Nhập tên đăng nhập"` | ✅ Form render <2s |
| MailHog | not pinged (OTP bypass `666666` áp dụng cho mọi role) | n/a |

**Conclusion:** Môi trường sẵn sàng cho QA Round 5.

---

## 2. Login matrix 11 vai trò

Mỗi role login trong **isolatedContext riêng** (clean session, no cookie carry).
Pattern: `new_page → fill form → submit → OTP 666666 → verify role badge + sidebar`.

| # | Role | Username | Đơn vị | HTTP | URL sau login | Role badge | Sidebar items | Result |
|---|---|---|---|---|---|---|---|---|
| 1 | CB_NV_TW | cb_nv_tw_01 | BTP-TW | 200 | `/dashboard` | CB_NV_TW | 12 (full nghiệp vụ, no QTHT) | ✅ PASS |
| 2 | CB_NV_BN | cb_nv_bn_01 | BKH | 200 | `/dashboard` | CB_NV_BN | 12 | ✅ PASS |
| 3 | CB_NV_DP | cb_nv_dp_01 | STP-AG | 200 | `/dashboard` | CB_NV_DP | 12 | ✅ PASS |
| 4 | CB_PD_TW | cb_pd_tw_01 | BTP-TW | 200 | `/dashboard` | CB_PD_TW | 12 | ✅ PASS |
| 5 | CB_PD_BN | cb_pd_bn_01 | BKH | 200 | `/dashboard` | CB_PD_BN | 12 | ✅ PASS |
| 6 | CB_PD_DP | cb_pd_dp_01 | STP-AG | 200 | `/dashboard` | CB_PD_DP | 12 | ✅ PASS |
| 7 | CG | cg_01 | STP-AG | 200 | `/403` | CG | 2 (Đào tạo + Tư vấn) | ✅ PASS (no default dashboard, sidebar scoped đúng role) |
| 8 | NHT | nht_01 | STP-AG | 200 | `/403` | NHT | 4 (Đào tạo + Vụ việc + DN + Tư vấn) | ✅ PASS (idem) |
| 9 | TVV | tvv_01 | STP-AG | 200 | `/403` | TVV | 4 (Đào tạo + CG/TVV + Vụ việc + Tư vấn) | ✅ PASS (idem) |
| 10 | QTHT | qtht_01 | (no đơn vị) | 200 | `/dashboard` | QTHT | 13 (full + Quản trị hệ thống) | ✅ PASS |
| 11 | DN | dn_01 | STP-AG | **403** | `POST /api/v1/auth/login` deny | n/a | n/a | ✅ PASS — expected deny |

**Tổng:** 11/11 đạt acceptance · UI 10/10 PASS · DN API-only deny đúng spec.

---

## 3. DN role — verify API-only

```bash
curl -X POST http://103.172.236.130:3000/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"dn_01","password":"Secret@123"}'
```

**Response (HTTP 403):**

```json
{
  "success": false,
  "error": {
    "code": "ERR-AUTH-CMS-DN",
    "message": "Tài khoản Doanh nghiệp tương tác qua API chuyên trang, không đăng nhập CMS. Vui lòng sử dụng Cổng PLQG.",
    "timestamp": "2026-04-26T14:33:55.185Z",
    "requestId": "ed96091a-5cf6-43dc-9ee2-cd64126bc690"
  }
}
```

**Phân loại:** PASS — BE chặn DN login qua `/api/v1/auth/login` (CMS path) và hướng dẫn dùng Cổng PLQG. Khớp design "DN role API-only" trong system-overview.

---

## 4. Quan sát phụ (không log bug — chỉ ghi nhận)

1. **Role landing page khác nhau:**
   - CB_NV/CB_PD (TW/BN/DP) + QTHT → `/dashboard` (Tổng quan).
   - CG/NHT/TVV → `/403` placeholder (không có dashboard mặc định).
   - **Pattern hợp lệ** theo CLAUDE.md: "Role không có dashboard default = sidebar vẫn render đúng, /403 = PASS".

2. **Sidebar scope theo role:**
   - QTHT có thêm submenu "Quản trị hệ thống" — đặc thù role.
   - CG sidebar gọn nhất (2 module) → đúng spec FR-IV (Chuyên gia chỉ thao tác trong Đào tạo + Tư vấn).
   - CB_NV/CB_PD scope giống nhau ở UI level (cùng 12 module sidebar) — phân biệt thực sự ở permission CRUD/approve, sẽ verify ở P2 trụ A.

3. **Counter dashboard:**
   - `cb_nv_tw_01`/`cb_pd_tw_01`/`qtht_01` thấy 7 hỏi đáp + 7 vụ việc tiếp nhận + 7 đang xử lý → **carry-over data từ Round 4** (HD-20260424-002..007 + VV seed cũ).
   - `cb_nv_bn_01` thấy 1 hỏi đáp duy nhất → scope đúng đơn vị BKH.
   - `cb_nv_dp_01`/`cb_pd_dp_01` thấy 0 record → đơn vị AG chưa có data.
   - **Tác động:** Round 5 cần lưu ý carry-over này khi seed mới (T1.B*) — kiểm tra fixture `cb_nv_tw_01` để xem record nào trùng cần re-seed hay reuse.

4. **OTP bypass `666666`** vẫn hoạt động cho mọi role test → không thay đổi từ Round 4.

5. **Session isolation pattern:** Logout qua `clear sessionStorage + cookies + POST /auth/logout` **không** đủ vì `navigate_page /login` sau đó vẫn redirect `/dashboard` (BE httpOnly cookie sticky). **Workaround đã verify:** `new_page` với `isolatedContext` riêng cho mỗi role → 100% clean session.

---

## 5. Verdict

✅ **T0.1 PASS** — môi trường + 11 vai trò sẵn sàng. Round 5 có thể tiếp tục T0.2 (skeleton folder) → P1 (smoke 16 module + seed nền tảng).

---

## 6. Artifacts

- Report: `output/qa-reports/round5-2026-04-26/_prep-log.md` (file này)
- Folder Round 5: `output/qa-reports/round5-2026-04-26/` + subfolder `bug-reports/` đã tạo.
- Bug found: 0
