# Functional Test Report — R7.8.4 Profile + Đổi MK self-service

**Ngày:** 2026-05-07 18:25 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Spec ref:** [input/srs-update-2026-5-5/ho-so-doi-mat-khau.md](../../../../input/srs-update-2026-5-5/ho-so-doi-mat-khau.md)
**Endpoint:** `POST /api/v1/auth/change-password`
**Scope:** Verify 2 tab (Thông tin cá nhân + Bảo mật) + 3 mâu thuẫn FR-VIII-26 vs spec ho-so-doi-mat-khau.md

---

## Kết quả: ⚠️ PASS 5/5 trường + 3 trường MK + 3 mâu thuẫn DETECTED

UI render đầy đủ 5 trường thông tin + 3 trường form đổi MK đúng spec. Validation BE work nhưng có **3 mâu thuẫn** vs spec đã confirm — 1 đã log (BUG-FR26-001 Minor defer), 2 mới cần escalate BA chốt spec.

---

## A. Tab "Thông tin cá nhân" — PASS 5/5

| # | Trường | Spec | UI thực tế | Match? |
|---|---|---|---|:-:|
| 1 | `username` Tên đăng nhập | Hiển thị, không sửa | "qtht_02" + hint "Tên đăng nhập không thể thay đổi" | ✅ |
| 2 | `email` Email | Hiển thị, không sửa, sync VNeID | "qtht_02@htpldn.test" (account LOCAL) | ✅ |
| 3 | `hoTen` Họ tên | Bắt buộc, ≤200 ký tự, sửa được | textbox value="QTHT Test 02", required `*` | ✅ |
| 4 | `dienThoai` Điện thoại | Optional, regex `0[3-9]xxxxxxxx`, sửa được | textbox empty, optional | ✅ (chưa test regex enforcement) |
| 5 | `vaiTro` Vai trò | Hiển thị list role | "QTHT" (badge) | ✅ |

**Button:** "Lưu thay đổi" — UI present.

---

## B. Tab "Bảo mật" — PASS 3/3 trường + 3 mâu thuẫn

### B.1 Form đổi MK — UI render

| # | Field | Spec | UI thực tế | Match? |
|---|---|---|---|:-:|
| 1 | `currentPassword` Mật khẩu hiện tại | Bắt buộc | textbox required `*` + toggle eye | ✅ |
| 2 | `newPassword` Mật khẩu mới | Bắt buộc, ≥8, **chữ hoa + chữ thường + chữ số** (3 yêu cầu) | textbox required `*` + toggle eye + hint | ⚠️ hint khác spec |
| 3 | `newPasswordConfirm` Nhập lại MK mới | Bắt buộc, khớp newPassword | textbox required `*` + toggle eye | ✅ |

**Note line:** "Sau khi đổi mật khẩu thành công, các phiên đăng nhập trên thiết bị khác sẽ bị đăng xuất tự động." — match spec (chỉ thay đổi word order).

### B.2 Validation test — 3 case BE behavior

| Case | Payload | Expected (spec) | Actual BE response | Match? |
|---|---|---|---|:-:|
| C1 | `currentPassword`="WrongPassword@1" + valid new | errCode `ERR-PWD-04` "MK hiện tại không đúng" | 422 `ERR-AUTH-VIII-CP-01` "Mật khẩu hiện tại không đúng" | ⚠️ errCode mismatch |
| C2 | `newPassword`="NoSpecial1" (10 char, hoa+thường+số, **không có ký tự đặc biệt**) | Spec ≥8 + hoa+thường+số → **PASS** mới đúng | 422 `ERR-VAL-SYS-00-01` "Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 chữ số và **1 ký tự đặc biệt**" | ❌ BE strict hơn spec |
| C3 | `newPasswordConfirm` ≠ `newPassword` | errCode `ERR-PWD-06` "MK xác nhận không khớp" | 422 `ERR-VAL-VIII-CP-04` "Mật khẩu xác nhận không khớp" | ⚠️ errCode mismatch |

---

## C. 3 Mâu thuẫn detected (verify chính)

### C.1 ⚠️ Mâu thuẫn #1 — MK strength rule

**Spec ho-so-doi-mat-khau.md line 22:**
> "Bắt buộc nhập; **tối thiểu 8 ký tự; phải gồm đồng thời chữ hoa, chữ thường và chữ số**."

**UI hint thực tế (uid 17_9):**
> "Tối thiểu 8 ký tự, gồm **chữ hoa, chữ thường, chữ số và ký tự đặc biệt**."

**BE enforcement (C2 above):** Reject `NoSpecial1` (no special char) → confirm BE yêu cầu 4 elements thay vì 3.

**→ Spec sai hoặc BE/UI sai.** Cần BA chốt: "ký tự đặc biệt" có required hay không?

### C.2 ⚠️ Mâu thuẫn #2 — ErrCode naming convention

| Trường hợp | SRS FR-VIII-26 §Error Handling | BE actual |
|---|---|---|
| Wrong current password | `ERR-PWD-04` | `ERR-AUTH-VIII-CP-01` |
| Weak password | `ERR-PWD-05` | `ERR-VAL-SYS-00-01` |
| Password confirm mismatch | `ERR-PWD-06` | `ERR-VAL-VIII-CP-04` |

**→ Đã log [BUG-FR26-001](../bug-reports/qtht-tai-khoan/bug-report-r7-7-8c-reset-mk.md) Minor defer Open ở R7.7.8c.** R7.8.4 confirm bug vẫn ảnh hưởng cả endpoint `change-password` (không chỉ `reset-password`).

### C.3 ⚠️ Mâu thuẫn #3 — "Phiên đăng nhập" section ngoài spec

**UI có thêm:** Heading L5 "Phiên đăng nhập" + table (Thiết bị / IP / Đăng nhập / Hoạt động cuối / Trạng thái / Thao tác) + 1 row hiện tại "Chrome / ::ffff:127.0.0.1 / 17:24:55 7/5/2026 / Phiên hiện tại".

**Spec ho-so-doi-mat-khau.md:** KHÔNG có section "Phiên đăng nhập" hay quản lý session.

**→ FE đã build feature ngoài spec.** Hai khả năng:
- (a) Spec thiếu — feature này nên có (best practice security UX) → bổ sung spec.
- (b) Feature build sớm — chưa được approval → ẩn/remove.

Cần BA chốt scope.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP (`mcp__chrome-devtools__*`).
**Setup:** Session login qtht_02. Navigate `/profile` → click tab "Bảo mật".
**Verify UI:** `take_snapshot` đọc field labels, required mark `*`, hint text, button.
**Verify BE:** `evaluate_script` chạy `fetch('/api/v1/auth/change-password', {method:'POST', body:...})` × 3 case (wrong current / weak new / confirm mismatch).
**Capture diagnostic:** errCode + message text + status code + timestamp + requestId.

---

## Ảnh chụp

- [r7-8-4-profile-bao-mat-tab.png](r7-8-4-profile-bao-mat-tab.png) — Tab "Bảo mật" với form đổi MK 3 trường + section "Phiên đăng nhập" extra.

---

## Recommendation

| Mâu thuẫn | Severity | Action | Owner |
|---|:-:|---|---|
| C.1 strength rule | Medium | BA chốt: "ký tự đặc biệt" required hay không. Update spec hoặc relax BE. | BA + dev |
| C.2 errCode naming | Minor (BUG-FR26-001 đã có) | Map errCode lại theo SRS hoặc update SRS. Defer được. | dev BE |
| C.3 "Phiên đăng nhập" extra | Low | BA confirm scope: keep + update spec, hay remove FE feature. | BA |

---

## Out of scope

- Validation `dienThoai` regex `0[3-9]xxxxxxxx` — chưa test edge case (10 char ngoài range, 11 char, có ký tự lạ).
- Tab "Bảo mật" — manage session khác (logout other devices) — chưa test trigger.
- Email VNeID sync flow — account `qtht_02` LOCAL không cover.
- Save profile (PUT `hoTen`/`dienThoai`) — chưa test happy path + edge case.

R7.8.4 scope ưu tiên = verify 3 mâu thuẫn FR-VIII-26.

---

*2026-05-07 18:25 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
