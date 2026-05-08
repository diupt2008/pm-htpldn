# Workflow Test Report — Chương trình HTPLDN Giai đoạn 2 (Đợt báo cáo)

> **Module:** SM-DOT-BC (FR-XI-05a/06/07/07a/08/09 — UC195/169/170/196/171/172) · **Round:** R7.6.5 · **Date:** 2026-05-08 · **Tester:** QA Automation (Claude Code via Chrome DevTools MCP)
>
> **SRS refs (v3.5 + legacy v3 cho FR-15):**
> - **v3.5:** [`input/srs-update-2026-5-5/srs-v3.5.md` line 2090+](../../../../input/srs-update-2026-5-5/srs-v3.5.md) — entity DOT_BAO_CAO §3.4.3.x (CHECK trang_thai 6 states)
> - **v3.5:** [`input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md` line 149](../../../../input/srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) — xác nhận "FR-15 KHÔNG nâng cấp lên A FULL"
> - **Legacy v3 (vẫn còn hiệu lực):** [`input/srs-v3/srs-fr-15-ct-htpldn.md`](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md) FR-XI-05a/06/07/07a/08/09 (line 442–784)
> - Process map: [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md` ⑭-bis line 851–875](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md)
>
> **Bug report:** [`bug-report-flow-cthtpldn-gd2.md`](../bug-reports/ct-htpldn/bug-report-flow-cthtpldn-gd2.md)

---

## Kết luận

🚫 **PARTIAL — 5/7 PASS via API, 1 N/A spec, 1 BLOCKED. UI HOÀN TOÀN BLOCKER.**

**3 phát hiện gốc:**

1. **🚨 BUG-DOTBC-UI-001 Major (NEW):** Tab "Đợt báo cáo" SCR-XI-01 (FR-XI-05a–09) **CHƯA BUILD** — hiển thị placeholder "Tính năng sẽ được triển khai ở Story 13.6" + image "Trống". Toàn bộ R7.6.5 không thể test qua UI. Workaround: **BE endpoints exist và hoạt động** → fallback API.
2. **✅ B1–B5 PASS via API:** SM-DOT-BC 5 transitions chính (TAO_DOT/DANG_LAP_BC/CHO_DUYET_KQ/DA_DUYET_KQ/reject path) đều đạt 200 với schema BE chuẩn.
3. **🚫 BUG-DOTBC-API-001 Major (NEW) — TW CT deadlock tại DA_DUYET_KQ:**
   - Spec line 874: `DA_DUYET_KQ → DA_GUI_TW` chỉ áp BN/ĐP. TW user gọi `/gui-tw` trả 403 (đúng spec).
   - Spec line 875: `DA_GUI_TW → DA_TONG_HOP` qua `[Tổng hợp]` của TW.
   - **BE chưa có endpoint `tong-hop` / `consolidate` / `aggregate` / `mark-tong-hop`** (test 6 patterns đều 404).
   - **Hậu quả:** TW CT có Đợt BC sẽ **không bao giờ** đạt được DA_TONG_HOP → cascade vô hạn block BUG-CTHTPLDN-B10-001 R7.6.4 (BE chặn HOAN_THANH khi `chua DA_TONG_HOP > 0`).

**Verify BUG-CTHTPLDN-B10-001 R7.6.4 (R2 2026-05-08):** Confirmed. Sau B5 hoàn tất với 2 ĐBC (DOT-4-1 DA_DUYET_KQ + DOT-4-2 DANG_LAP_BC), retry [Hoàn thành] CT-A → BE 409 `ERR-VAL-XI-06-10` "Khong the hoan thanh: con **2/2** dot bao cao chua DA_TONG_HOP" — message đếm đúng (2 chưa DA_TONG_HOP / 2 tổng) → confirm logic BE: yêu cầu **ALL ĐBC ở state DA_TONG_HOP** mới cho HOAN_THANH. Bug R7.6.4-B10 message "0/0" R2 chỉ gặp khi total=0 → **wording bug** riêng.

---

## Bảng kiểm tra workflow (7 transitions SM-DOT-BC)

| # | Transition | Actor spec | Endpoint | Status | Note |
|:-:|---|---|---|:-:|---|
| 1 | `— → TAO_DOT` ([Tạo đợt BC] FR-XI-05a) | `cb_nv_<cap>_01` | `POST /api/v1/dot-bao-caos` | ✅ | Schema 8 fields: chuongTrinhId, tenDot, kyBaoCao (SO_BO_6_THANG/SO_BO_NAM/TRON_NAM), nam, hanNop, tuNgay, denNgay, bieuMauSuDung (MAU_21A/B/CA_HAI). DOT-4-1 created TAO_DOT. |
| 2 | `TAO_DOT → DANG_LAP_BC` ([Bắt đầu lập BC] FR-XI-06) | `cb_nv_<cap>_01` | `POST /{id}/start` | ✅ | Required: `soLieuTongHop` object + `version`. DOT-4-1 → DANG_LAP_BC. HATEOAS exposes `submit-bc`. |
| 3 | `DANG_LAP_BC → CHO_DUYET_KQ` ([Trình duyệt KQ] FR-XI-07 BR-AUTH-05) | `cb_nv_<cap>_01` | `POST /{id}/submit-bc` | ✅ | DOT-4-1 → CHO_DUYET_KQ. `nguoiGuiDuyetId` + `ngayGuiDuyet` set. HATEOAS exposes `approve-bc`. |
| 4 | `CHO_DUYET_KQ → DA_DUYET_KQ` ([Duyệt KQ] FR-XI-07a BR-AUTH-05 same TW) | `cb_pd_tw_01` | `POST /{id}/approve-bc` body `{quyetDinh:"PHE_DUYET"}` | ✅ | DOT-4-1 → DA_DUYET_KQ. `nguoiDuyetId` set. HATEOAS exposes `gui-tw`. |
| 5 | `CHO_DUYET_KQ → DANG_LAP_BC` ([Từ chối KQ] BR-FLOW-04 ≥10 chars) | `cb_pd_tw_01` | `POST /{id}/approve-bc` body `{quyetDinh:"TU_CHOI", lyDo:"..."}` | ✅ | DOT-4-2 → DANG_LAP_BC. Field name = `lyDo` (không phải `lyDoTuChoi`/`ghiChuPheDuyet`). BR-FLOW-04 ENF (8 chars → 400 ERR-VAL-XI-07a-02). |
| 6 | `DA_DUYET_KQ → DA_GUI_TW` ([Gửi lên TW] FR-XI-08 — chỉ BN/ĐP) | `cb_nv_bn_01`/`cb_nv_dp_01` | `POST /{id}/gui-tw` | ⏭ N/A | TW CT (donViId root) → 403 `ERR-PERM-SYS-00-01` Forbidden khi cb_nv_tw_01 gọi. Đúng spec line 874 "Guard: chỉ BN/ĐP gửi". KHÔNG test được vì CT-A là TW-cấp. Cần seed thêm CT cấp BN/ĐP để verify đầy đủ. |
| 7 | `DA_GUI_TW → DA_TONG_HOP` ([Tổng hợp] FR-XI-09) | `cb_nv_tw_01` | (chưa biết — probed 6 patterns) | ❌ | **BE endpoint chưa exist** — probe `/tong-hop`, `/tonghop`, `/consolidate`, `/aggregate`, `/finalize`, `/consolidate-bc` đều trả 404 `ERR-SYS-00-04-01`. Combined với B6 N/A → TW CT bị deadlock vĩnh viễn ở DA_DUYET_KQ. |

**Tổng:** 5/7 PASS · 1/7 N/A (B6 BN/ĐP-only, không scope test) · 1/7 BLOCKED (B7 BE missing endpoint).

---

## Phát hiện cross-cutting

### 🚨 BUG-DOTBC-UI-001 Major — Tab "Đợt báo cáo" UI chưa build

**Trigger:** Click tab "Đợt báo cáo" trên SCR-XI-01 chi tiết CT (`/ct-htpldn/{id}`).

**Hiện thị:** Banner deadline TT17/2025 OK + image "Trống" + text "**Tính năng sẽ được triển khai ở Story 13.6**".

**Vi phạm spec:**
- [`input/quy-trinh-nghiep-vu/02-thu-tu-module.md` line 325](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md): `Đợt báo cáo` tab phải có "bảng các đợt báo cáo (cột: Mã / Tên / Kỳ BC / Hạn nộp / Trạng thái) + nút [+ Tạo đợt mới]".
- [`input/srs-v3/srs-fr-15-ct-htpldn.md` FR-XI-05a line 442+](../../../../input/srs-v3/srs-fr-15-ct-htpldn.md): SCR-XI-01 tab Đợt báo cáo phải support CRUD đợt + drill-down BC.

**Bằng chứng:** [r7-6-5-tab-dot-bc-chua-build.png](../bug-reports/image/r7-6-5-tab-dot-bc-chua-build.png)

**Tác động:**
- R7.6.5 toàn bộ KHÔNG thể test qua UI (must fallback API).
- R7.7.15 functional 42 TC CT HTPLDN nhóm Đợt BC bị block (≥10 TC).
- BUG-CTHTPLDN-B10-001 R7.6.4 không thể tự fix qua UI (user không có entry-point để tạo đợt → tổng hợp → cho phép HOAN_THANH).

### 🚫 BUG-DOTBC-API-001 Major — TW CT deadlock tại DA_DUYET_KQ (BE thiếu endpoint /tong-hop)

**Reproduce:** Đẩy 1 đợt BC qua workflow đến state `DA_DUYET_KQ`. HATEOAS link forward chỉ có `gui-tw`. TW user gọi `gui-tw` → 403 (đúng spec). Probe các pattern khác (`tong-hop`, `consolidate`, `aggregate`, `finalize`, `mark-tong-hop`, `tw-tong-hop`) → 404.

**Spec line 875** [`02-thu-tu-module.md`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md): `DA_GUI_TW → DA_TONG_HOP | cb_nv_tw_01 | [Tổng hợp] (FR-XI-09)` — endpoint phải tồn tại nhưng BE chưa expose.

**Hậu quả cascade với BUG-CTHTPLDN-B10-001 R7.6.4:**
- BE check tại `/complete`: yêu cầu count(ĐBC where trang_thai != DA_TONG_HOP) == 0.
- TW CT chỉ có 2 path để escape: (a) không có ĐBC nào — BE vẫn 409 message "0/0" (R2 R7.6.4 B10) hoặc (b) có ĐBC ALL ở DA_TONG_HOP — không khả thi vì không có endpoint tổng hợp.
- → TW CT vĩnh viễn không HOAN_THANH được.

**Cần BA confirm:**
1. Đối với TW CT, transition DA_DUYET_KQ → DA_TONG_HOP có cần qua DA_GUI_TW không (auto-skip)? Hay BE expose endpoint riêng `consolidate-tw`?
2. Nếu CT TW không có ĐBC (vd CT chỉ thực hiện không cần báo cáo định kỳ), BE có cho phép HOAN_THANH với count=0 không?

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt |
|---|---|---|
| **R7.6.5 R1** | **2026-05-08** | **🚫 5/7 API PASS · UI BLOCKER (Story 13.6 chưa build) · TW CT deadlock DA_DUYET_KQ.** Confirm BUG-CTHTPLDN-B10-001 R7.6.4 cause logic. |

---

## Tài khoản dùng

| Username | Vai trò | Cấp | Dùng cho bước |
|---|---|---|---|
| `cb_nv_tw_01` | CB_NV_TW | TW | B1, B2, B3 (CT-A DOT-4-1 + DOT-4-2) |
| `cb_pd_tw_01` | CB_PD_TW | TW | B4 (PHE_DUYET DOT-4-1) + B5 (TU_CHOI DOT-4-2) |

---

## Bằng chứng

### UI block — Tab "Đợt báo cáo" Story 13.6 chưa build
![Tab Đợt BC chưa build](../bug-reports/image/r7-6-5-tab-dot-bc-chua-build.png)

### State machine evidence (API JSON)

#### B1 — DOT-4-1 created TAO_DOT (POST 201)
```json
{"id":"4b2615d6-a08a-4dbf-8d1a-bd681dfe6853","trangThai":"TAO_DOT","maDot":"DOT-4-1","tenDot":"Đợt BC R7.6.5 GĐ2 Sơ bộ 6 tháng 2026 (re-test 2026-05-08)","kyBaoCao":"SO_BO_6_THANG","version":1}
```

#### B2 — DOT-4-1 DANG_LAP_BC (POST /start)
```json
{"trangThai":"DANG_LAP_BC","version":2,"_links":{"submit-bc":"POST"}}
```

#### B3 — DOT-4-1 CHO_DUYET_KQ (POST /submit-bc)
```json
{"trangThai":"CHO_DUYET_KQ","version":3,"nguoiGuiDuyetId":"0c039382-...","ngayGuiDuyet":"2026-05-08T04:02:30.422Z","_links":{"approve-bc":"POST"}}
```

#### B4 — DOT-4-1 DA_DUYET_KQ (POST /approve-bc PHE_DUYET)
```json
{"trangThai":"DA_DUYET_KQ","version":4,"nguoiDuyetId":"319cae73-...","ngayDuyet":"2026-05-08T04:03:07.246Z","_links":{"gui-tw":"POST"}}
```

#### B5 — DOT-4-2 reject CHO_DUYET_KQ → DANG_LAP_BC (POST /approve-bc TU_CHOI lyDo)
```json
{"id":"82599ea3-ef85-4683-98fb-b03972b6f910","trangThai":"DANG_LAP_BC","version":4,"ghiChuPheDuyet":"Tu choi BC do so lieu thieu va can bo sung them - test reject","maDot":"DOT-4-2"}
```

#### B6 — TW user 403 trên gui-tw (đúng spec)
```json
POST /api/v1/dot-bao-caos/4b2615d6-.../gui-tw  Body: {"version":4}
Response 403: {"code":"ERR-PERM-SYS-00-01","message":"Forbidden"}
```

#### B7 — Endpoint tong-hop missing (404 × 6 patterns)
```text
POST /api/v1/dot-bao-caos/{id}/tong-hop      → 404 ERR-SYS-00-04-01
POST /api/v1/dot-bao-caos/{id}/tonghop       → 404
POST /api/v1/dot-bao-caos/{id}/consolidate   → 404
POST /api/v1/dot-bao-caos/{id}/aggregate     → 404
POST /api/v1/dot-bao-caos/{id}/finalize      → 404
POST /api/v1/dot-bao-caos/{id}/mark-tong-hop → 404
```

#### Verify BUG-CTHTPLDN-B10-001 logic confirmed (cumulative 2 ĐBC)
```json
POST /api/v1/chuong-trinh-htpls/52fe225a-.../complete  Body: {"version":8}
Response 409: {"code":"ERR-VAL-XI-06-10","message":"Khong the hoan thanh: con 2/2 dot bao cao chua DA_TONG_HOP"}
```

---

## Output cho task downstream

| Task | Trạng thái sau R7.6.5 | Lý do |
|---|---|---|
| **R7.6.4 B10** Hoàn thành CT | 🚫 vẫn block | Confirm logic BE: yêu cầu ALL ĐBC = DA_TONG_HOP. TW CT deadlock vì BE thiếu endpoint /tong-hop. |
| **R7.7.15** Functional CT 42 TC | 🟢 unblock 1 phần | Nhóm GĐ1 OK (R7.6.4 R2 6 CT). Nhóm Đợt BC (~12 TC) **block hoàn toàn** vì UI chưa build (Story 13.6). |
| **R7.E2** monitor | ✅ remain done | Pool 6 CT GĐ1 + 2 ĐBC (DOT-4-1 DA_DUYET_KQ, DOT-4-2 DANG_LAP_BC). |

---

## Phụ lục — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| OTP login | `666666` bypass |
| API base | `/api/v1/dot-bao-caos` (số nhiều) + `/api/v1/chuong-trinh-htpls/{id}/{action}` |
| Tool test | Chrome DevTools MCP `evaluate_script` (UI BLOCKED, fallback API) |
| Story FE | `13.6 Quản lý Đợt báo cáo` (placeholder text trên UI) — chưa build |

### Đợt BC tạo trong R7.6.5

| Mã | UUID | State cuối | Path |
|---|---|---|---|
| DOT-4-1 | 4b2615d6-a08a-4dbf-8d1a-bd681dfe6853 | DA_DUYET_KQ | Main flow B1→B4 (deadlock B7) |
| DOT-4-2 | 82599ea3-ef85-4683-98fb-b03972b6f910 | DANG_LAP_BC | Reject path B5 |

---

*R7.6.5 R1 | 2026-05-08 11:05 (Asia/Saigon) | QA Automation (Claude Code via Chrome DevTools MCP, API fallback)*
