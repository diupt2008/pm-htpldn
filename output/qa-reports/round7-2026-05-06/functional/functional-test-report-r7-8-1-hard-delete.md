# Functional Test Report — R7.8.1 Verify Hard Delete behavior

**Ngày:** 2026-05-07 18:35 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Trigger:** Item 9 dev list — claim "BE đã chuyển từ soft-delete sang hard-delete". Mâu thuẫn: SRS modal MD-XOA vẫn ghi xóa mềm (BR-DATA-XX-soft-delete).
**Module test:** Danh mục dùng chung (`/api/v1/danh-muc/{id}` DELETE) — đại diện cho pattern hard-delete BE.

---

## Kết quả: ✅ PASS — HARD DELETE confirmed

**DELETE → record bị xóa hoàn toàn khỏi DB.** GET list `includeInactive=true` không còn record. GET by ID trả 404 `ERR-VAL-VIII-99-04 "Không tìm thấy danh mục"`. Confirmed dev claim đúng.

**→ Mâu thuẫn SRS:** Modal MD-XOA "Xóa mềm" trong spec **ĐÃ OBSOLETE** — cần update spec để khớp behavior thực tế.

---

## Bảng kết quả test

| Bước | Action | Endpoint | Status | Kết quả |
|---|---|---|:-:|---|
| 1 | CREATE DM mới | `POST /api/v1/danh-muc` body `{loaiDanhMuc:"LINH_VUC_PL", ma:"TEST_HD_R781", ten:"Test Hard Delete R7.8.1", thuTu:99, kichHoat:true}` | 201 | id = `2980d412-ace7-4cb1-be6a-ff090c0e905a` ✅ |
| 2 | GET list trước DELETE (`includeInactive=true`) | `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL&includeInactive=true` | 200 | count=13, found `TEST_HD_R781` ✅ |
| 3 | DELETE | `DELETE /api/v1/danh-muc/2980d412-...` | **204** No Content | Success ✅ |
| 4 | GET list sau DELETE (`includeInactive=true`) | `GET /api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL&includeInactive=true` | 200 | count=12 (decreased by 1), `TEST_HD_R781` NOT found ✅ |
| 5 | GET by ID sau DELETE | `GET /api/v1/danh-muc/2980d412-...` | **404** | `ERR-VAL-VIII-99-04 "Không tìm thấy danh mục"` ✅ |

---

## Phân tích hard vs soft delete

| Behavior | Soft delete (spec MD-XOA) | Hard delete (BE actual) |
|---|---|---|
| GET list mặc định | Hide deleted | N/A (record gone) |
| GET list `includeInactive=true` | **Show deleted** với badge "Đã xóa" | **Không show** (record gone) |
| GET by ID | 200 trả full record + `deleted_at` | **404** record không tồn tại |
| Restore được? | Yes (UPDATE `deleted_at=null`) | No (record gone, cần CREATE lại) |
| FK reference | Hold by `deleted_at` flag | **CASCADE hoặc fail FK constraint** |
| Audit log | Action="DELETE" + soft_deleted=true | Action="DELETE" + record removed |

**BE actual behavior matches HARD DELETE pattern hoàn toàn.** Test step 4 critical: `includeInactive=true` mà vẫn KHÔNG thấy = không phải soft-delete (nếu soft thì query này phải trả về).

---

## Mâu thuẫn SRS — cần update

| File spec | Vị trí | Nội dung sai | Action |
|---|---|---|---|
| Modal MD-XOA spec | "Xóa mềm — record vẫn lưu DB với `deleted_at`" | Nay BE hard-delete | Update spec: "Xóa cứng — record bị remove khỏi DB" |
| BR-DATA-XX-soft-delete (nếu có) | "Default behavior soft-delete" | Nay hard-delete | Update BR |
| FE button label "Xóa" | (chưa verify FE label) | "Xóa" có thể hiểu là soft → user nhầm | Add confirm dialog rõ "Xóa vĩnh viễn"? |

**⚠️ Risk:** User clicked "Xóa" tưởng là soft, BE actually hard-delete → **mất data không recovery được**. Cần escalate UX team add confirm dialog warning + có thể bổ sung "Khôi phục" feature nếu user chỉ muốn vô hiệu hóa.

---

## Phương pháp test

**Tool:** Chrome DevTools MCP `evaluate_script` chạy fetch trực tiếp từ session login.
**Module chọn:** `/api/v1/danh-muc` — endpoint generic, ít risk làm break data prod (dùng test record `TEST_HD_R781` không link đến entity khác).
**Cleanup:** Test record đã bị DELETE step 3, không cần cleanup thêm.
**Endpoint discovery:** Network log reqid=932/933 chỉ ra endpoint thực `/api/v1/danh-muc/tree?loaiDanhMuc=LINH_VUC_PL`.

---

## Out of scope

- Test hard-delete cross-entity (DN, TVV, HSCT, VV) — entity khác có thể có pattern khác (vd VV bị FK lock không xóa được).
- FK constraint behavior — nếu DM bị reference bởi VV/HSCT, DELETE có cascade hay reject 409? (cần test riêng).
- Audit log entry sau DELETE — chưa verify (nhưng R7.7.8d đã PASS audit log nên giả định OK).
- Permission DELETE per role — thuộc R7.8.5.
- Confirm dialog UX trên FE — chưa test trên UI thực, chỉ test BE direct.

R7.8.1 scope = chỉ verify BE behavior hard-delete vs soft-delete spec.

---

*2026-05-07 18:35 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
