# Workflow Test Report — Chương trình HTPLDN Giai đoạn 1

> **Module:** Quản lý Chương trình HTPLDN GĐ1 (FR-XI-01..05 / SM-CHUONG_TRINH_HTPL) · **Round:** R7.6.4 (R2 re-test) · **Date:** 2026-05-08 · **Tester:** QA Automation (Claude Code via Chrome DevTools MCP)
>
> **SRS refs (v3.5):**
> - [`input/srs-update-2026-5-5/srs-v3.5.md §3.4.3.10 CHUONG_TRINH_HTPL`](../../../../input/srs-update-2026-5-5/srs-v3.5.md) — entity definition, 8-state SM, permission matrix line 1281
> - [`input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md` line 149](../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) — "FR-15 KHÔNG nâng cấp lên A FULL" → FR-15 chi tiết KHÔNG có file v3.5 update
> - **Detailed FR-XI-01..09 spec (legacy v3, vẫn còn hiệu lực):** [`input/srs-v3/srs-fr-15-ct-htpldn.md`](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) — fields form Tab Thông tin (rows 887-898) + action-bar transitions (line 903) + state machine MH-CT-01..04
> - Process map: [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md §⑤`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md)
>
> **Bug report:** [`bug-report-flow-cthtpldn.md`](../bug-reports/ct-htpldn/bug-report-flow-cthtpldn.md)

---

## Kết luận

⚠️ **PASS-WITH-NOTE — 10/11 bước PASS (90.9%)**. R7.6.4 R1 (2026-05-07) FAIL B7 do BUG-CTHTPLDN-B7-001 (BE 409 ERR-VAL-XI-06-11 cascade block B8/B9/B10). **R7.6.4 R2 (2026-05-08): BUG-CTHTPLDN-B7-001 đã FIXED** → B7/B8/B9 PASS. **NEW BUG-CTHTPLDN-B10-001 Major** phát sinh: BE chặn HOAN_THANH với code `ERR-VAL-XI-06-10` "Khong the hoan thanh: con 0/0 dot bao cao chua DA_TONG_HOP" — message contradictory (0/0 = không có đợt BC nào), BE đang yêu cầu CT phải có ≥1 Đợt BC DA_TONG_HOP trước khi HOAN_THANH. Yêu cầu này không có trong SRS FR-XI-01 line 903 nhưng phù hợp với cascade logic R7.6.5 (Đợt BC) → cần BA confirm pre-condition.

**R7.6.5 (GĐ2 Đợt BC) bây giờ unblock** vì có CT-A `CT-20260508-0001` ở DANG_THUC_HIEN (đủ điều kiện tạo Đợt BC theo spec FR-XI-05a).

**Regression so với R6.6.4:** R6 PASS 11/11. R7 R2 PASS 10/11 — B10 fail là discovery mới do BE thêm validation `ke_hoach_chi_tiet`/`don_vi_thuc_hien` (R1 B7) đã được fix nhưng phát hiện thêm `bao_cao_da_tong_hop` (R2 B10).

---

## Bảng kiểm tra workflow

| # | Bước (transition) | Actor | Sample test (R2 2026-05-08) | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → DU_THAO` (Tạo CT thủ công UC164, [Tạo chương trình]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Form 4 trường bắt buộc + auto sinh mã `CT-20260508-{SEQ}`. Đơn vị auto = "Cục Bổ trợ tư pháp - Bộ Tư pháp". Stepper 6 bước render đúng. |
| 2 | `DU_THAO → CHO_PHE_DUYET` ([Đệ trình duyệt]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Submit trực tiếp không có modal xác nhận. Banner "Đã đệ trình duyệt" hiện. Stepper bước 1 check (✓), bước 2 active. Form chuyển read-only. |
| 3 | `CHO_PHE_DUYET → DA_DUYET` ([Phê duyệt]) | `cb_pd_tw_01` | CT-20260508-0001 | ✅ | Modal "Phê duyệt chương trình?" → Đồng ý. Stepper bước 2 check, bước 3 active. BR-AUTH-05 cùng cấp TW PASS (cb_pd_tw_01 same TW như cb_nv_tw_01). |
| 4 | `CHO_PHE_DUYET → DU_THAO` ([Từ chối] + lý do ≥10 ký tự) | `cb_pd_tw_01` | CT-20260508-0002 | ✅ | Modal "Từ chối chương trình" có textarea Lý do từ chối required + counter `0/1000` (BR-FLOW-04). Lý do test 130 ký tự. State quay về Dự thảo, form editable lại. **Note:** lần đầu fill_form bị reset → workaround: click + type_text. |
| 5 | `DA_DUYET → DA_CONG_BO` ([Công bố lên Cổng PLQG]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Modal "Công bố lên Cổng PLQG?" → Đồng ý. State Đã công bố. Stepper bước 3 check. (FR-XII-15 push API ngoài scope smoke.) Network: `POST /publish` → 200. |
| 6 | `DA_CONG_BO → DA_DUYET` ([Hủy công bố]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Modal "Hủy công bố?" → Đồng ý. State quay về Đã duyệt, stepper bước 3 unchecked. Network: `POST /unpublish` → 200. |
| 7 | `DA_DUYET → DANG_THUC_HIEN` ([Bắt đầu thực hiện]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | **BUG-CTHTPLDN-B7-001 R1 đã FIXED!** Modal "Bắt đầu thực hiện? Sau đó có thể tạo đợt báo cáo." → Đồng ý. State Đang thực hiện. Stepper bước 4 ✓. Network: `POST /activate` → **200** (R1 trả 409 với code ERR-VAL-XI-06-11). |
| 8 | `DANG_THUC_HIEN → TAM_DUNG` ([Tạm dừng] + lý do) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Modal "Tạm dừng chương trình" có textarea Lý do tạm dừng required + counter `0/500`. Lý do test 86 ký tự. State Tạm dừng, stepper ẩn step 4 (đúng spec — TAM_DUNG out of stepper). Button đổi sang [Tiếp tục]. Network: `POST /pause` → 200. |
| 9 | `TAM_DUNG → DANG_THUC_HIEN` ([Tiếp tục]) | `cb_nv_tw_01` | CT-20260508-0001 | ✅ | Modal "Tiếp tục chương trình?" → Đồng ý. State Đang thực hiện. Stepper bước 4 ✓ trở lại. Buttons: [Tạm dừng] + [Hoàn thành]. Network: `POST /resume` → 200. |
| 10 | `DANG_THUC_HIEN → HOAN_THANH` ([Hoàn thành]) | `cb_nv_tw_01` | CT-20260508-0001 | ❌ | **NEW BUG-CTHTPLDN-B10-001 Major** — BE trả 409 `ERR-VAL-XI-06-10` "Khong the hoan thanh: con 0/0 dot bao cao chua DA_TONG_HOP". Toast hiện đúng (UI silent fix vs R1 B7), nhưng message logic sai — "0/0" = không có đợt BC nào → không nên block. Hoặc BE đang yêu cầu pre-condition ≥1 Đợt BC DA_TONG_HOP, không có trong SRS FR-XI-01 line 903. Cần BA confirm. |
| 11 | `DU_THAO → HUY` ([Hủy CT] + xác nhận) | `cb_nv_tw_01` | CT-20260508-0003 | ✅ | Modal "Hủy chương trình? Hành động này không thể hoàn tác." → Đồng ý. State Đã hủy, stepper ẩn (đúng spec — TAM_DUNG/HUY ẩn khỏi stepper). Không còn action button. |

> Icon: ✅ pass · ❌ fail · 🚫 blocked (cascade upstream) · ⏭ skip · — chưa test

**Tổng:** 10/11 PASS (90.9%) · 1/11 FAIL (B10) · 0 blocked cascade.

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R6.6.4 | 2026-05-05 | PASS 11/11 transitions với CT-20260505-0001..0003. Unblock R6.6.5 + R6.7.15. |
| R7.6.4 R1 | 2026-05-07 | ⚠️ 7/11 PASS — B7 FAIL do BE thêm validation `ERR-VAL-XI-06-11` (regression vs R6). Cascade block B8-B10. CT-20260507-0001 stuck DA_DUYET. |
| **R7.6.4 R2** | **2026-05-08** | **⚠️ 10/11 PASS — BUG-CTHTPLDN-B7-001 fixed. NEW BUG-CTHTPLDN-B10-001 (ERR-VAL-XI-06-10) — BE chặn HOAN_THANH với message "0/0" contradictory. CT-A unblock R7.6.5 (Đợt BC).** |

---

## Tài khoản dùng

| Username | Vai trò | Cấp | Dùng cho bước |
|---|---|---|---|
| `cb_nv_tw_01` | CB_NV_TW (Cán bộ Nghiệp vụ TW) | TW | 1, 2, 5, 6, 7, 8, 9, 10 (failed), 11 |
| `cb_pd_tw_01` | CB_PD_TW (Cán bộ Phê duyệt TW) | TW | 3 (CT-A), 4 (CT-B reject) |

Pattern multi-role: dùng MCP `isolatedContext: cb_pd_tw_01` mở session riêng cho CB PD; CT-A + CT-B visible cross context (cùng cấp TW). Note: 1 lần BE 401 session expired giữa B9 và B10 (~5 phút idle) — re-login OK lần 2.

---

## Bằng chứng

### Pre-test list (3 CT R7 cũ + CT1 đã advance DANG_THUC_HIEN sau dev fix)
![Pre-test list 3 CT with CT1 active](../seed/r7-6-4-pre-list-3CT-with-CT1-active.png)

### B1 — CT-A created `DU_THAO`
![B1 CT-A DU_THAO](../bug-reports/image/r7-6-4-r2-ct1-b1-duthao.png)

### B2 — CT-A `CHO_PHE_DUYET`
![B2 CT-A CHO_PHE_DUYET](../bug-reports/image/r7-6-4-r2-ct1-b2-cho-pd.png)

### B3 — CT-A `DA_DUYET` (cb_pd_tw_01 phê duyệt)
![B3 CT-A DA_DUYET + check stepper](../bug-reports/image/r7-6-4-r2-ct1-b3-da-duyet.png)

### B4 — CT-B `DU_THAO` sau từ chối
![B4 CT-B từ chối back DU_THAO](../bug-reports/image/r7-6-4-r2-ct2-b4-tu-choi-back-duthao.png)

### B5 — CT-A `DA_CONG_BO`
![B5 CT-A DA_CONG_BO](../bug-reports/image/r7-6-4-r2-ct1-b5-da-cong-bo.png)

### B7 — CT-A `DANG_THUC_HIEN` (BUG-CTHTPLDN-B7-001 R1 ĐÃ FIX)
![B7 CT-A DANG_THUC_HIEN PASS](../bug-reports/image/r7-6-4-r2-ct1-b7-dang-thuc-hien-PASS.png)

```text
POST /api/v1/chuong-trinh-htpls/52fe225a-1c38-4727-b587-4e505439eaec/activate
Response: 200 OK
(R1 2026-05-07: 409 ERR-VAL-XI-06-11. R2 2026-05-08: 200 — BUG fixed.)
```

### B8 — CT-A `TAM_DUNG`
![B8 CT-A TAM_DUNG](../bug-reports/image/r7-6-4-r2-ct1-b8-tam-dung.png)

### B10 — BE 409 (NEW BUG)
![B10 CT-A FAIL toast](../bug-reports/image/r7-6-4-r2-ct1-b10-FAIL-toast.png)

```text
POST /api/v1/chuong-trinh-htpls/52fe225a-1c38-4727-b587-4e505439eaec/complete
Request body: {"version":8}
Response 409:
{
  "success": false,
  "error": {
    "code": "ERR-VAL-XI-06-10",
    "message": "Khong the hoan thanh: con 0/0 dot bao cao chua DA_TONG_HOP",
    "timestamp": "2026-05-08T03:20:11.248Z",
    "requestId": "41795bb0-fe7a-4373-b81b-91ffa09263e9"
  }
}
```

### B11 — CT-C `DA_HUY` (Đã hủy)
![B11 CT-C DA_HUY](../bug-reports/image/r7-6-4-r2-ct3-b11-da-huy.png)

### List danh sách 6 CT cuối round (3 R7-cũ + 3 R7-R2-mới)
![List final 6 CT](../bug-reports/image/r7-6-4-r2-list-final-6CT.png)

---

## Output cho task downstream

| Task | Trạng thái sau R7.6.4 R2 | Lý do |
|---|---|---|
| **R7.6.5** Workflow CT HTPLDN GĐ2 Đợt BC | 🟢 **UNBLOCK** | Có CT-20260508-0001 + CT-20260507-0001 ở DANG_THUC_HIEN — đủ điều kiện tạo Đợt BC theo FR-XI-05a. Note: R7.6.5 sẽ test luôn pre-condition của B10 — nếu CT có ≥1 Đợt BC DA_TONG_HOP thì /complete có pass không, để confirm BUG-CTHTPLDN-B10-001 là logic mới hay bug. |
| **R7.7.15** Functional CT HTPLDN (42 TC) | 🟢 unblock đầy đủ | 6 CT đa state (DU_THAO/DA_DUYET/DANG_THUC_HIEN/HUY/Đã hủy) — đủ test 42 TC functional + perm + edge. Nhóm TC HOAN_THANH chờ B10 fix hoặc xác nhận pre-condition. |
| **R7.E2** CT HTPLDN GĐ1 monitor | ✅ remain done | Pool tăng 3→6 CT. API endpoint vẫn `/api/v1/chuong-trinh-htpls`. |

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| API base | `/api/v1/chuong-trinh-htpls` (endpoint số nhiều) |
| Tool test | Chrome DevTools MCP (primary per CLAUDE.md routing rule) |

### CT mới tạo trong R2 (2026-05-08)

| Mã CT | UUID | State cuối | Path test |
|---|---|---|---|
| CT-20260508-0001 | 52fe225a-1c38-4727-b587-4e505439eaec | DANG_THUC_HIEN (B10 fail) | Main flow B1→B9 + B10 BUG |
| CT-20260508-0002 | a15dd651-fb59-4653-ab3d-205322a00dc2 | DU_THAO (sau reject) | Reject path B4 |
| CT-20260508-0003 | 6236346a-06a0-4d04-8308-8e8126b50dee | HUY | Cancel path B11 |

---

*R7.6.4 R2 | 2026-05-08 10:21 (Asia/Saigon) | QA Automation (Claude Code via Chrome DevTools MCP, isolated context multi-role)*
