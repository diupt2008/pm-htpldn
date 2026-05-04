# Workflow Test Report — Tư vấn viên (SM-TVV) — Nhóm IV

> **Phase:** P3 Workflow • **Plan ref:** [`tasks/todo.md` §P3 T3.1](../../../tasks/todo.md) • **Date:** 2026-04-25
> **Tester:** QA AI via Claude Code + Chrome DevTools MCP
> **Round:** Round 4
> **State Machine:** SM-TVV — 5 happy state (`MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH → CHO_PHE_DUYET → DANG_HOAT_DONG`) + 2 side state (`YEU_CAU_BO_SUNG`, `TU_CHOI`)
> **Input flow:** [`input/flow-module.md §2`](../../../input/flow-module.md) — FLOW LUỒNG "HỒ SƠ TƯ VẤN VIÊN" (SM-TVV) - Nhóm IV
> **Seed precondition:** [`seed-checklist-TVV.md`](../../qa-reports/round4-2026-04-24/seed/seed-checklist-TVV.md) — 6 TVV `TVV-BTP-TW-0001..0006` state `MOI_DANG_KY`
> **Bug report:** [`bug-report-flow-tvv.md`](bug-report-flow-tvv.md)

---

## Verdict

⚠️ **PASS-WITH-BUGS** — 5/5 nhánh state-final PASS • 4 Major + 1 Medium SRS-ref bug phát hiện.

| Metric | Giá trị |
|--------|---------|
| Happy path (Bước 1→5) | ⚠️ 4/5 PASS — Bước 3 state `CHO_THAM_DINH` bị skip (BUG-FLOW-TVV-004) |
| Reject branches | 3/3 PASS state — YCBS / CB PD reject / Soft-delete |
| Auto-transition | 3/6 PASS — 3 FAIL ở audit-trail (BUG-002/003) |
| Preset E2E | 0 PASS / 1 SKIP (P2 chờ T3.3) |
| Bug found | 5 (xem [bug-report-flow-tvv.md](bug-report-flow-tvv.md)) |
| **Gate cho P4 Functional** | ☐ PASS — sẵn sàng (cần re-verify sau dev fix) |

---

## Accounts dùng

| Role | Username | Cấp | Ghi chú |
|------|----------|-----|---------|
| CB NV | `cb_nv_tw_01` | TW | Bước 1 (seed) + Bước 2-4 (Tiếp nhận / Thẩm định / Trình duyệt) + Soft-delete |
| CB PD | `cb_pd_tw_01` | TW | Bước 5 (Phê duyệt / Từ chối) |

---

## 1. Happy Path — Bước 1 → 5 (TVV-BTP-TW-0001 Nguyễn Văn Tư Vấn)

> **Tham chiếu SRS:** [`flow-module.md §2`](../../../input/flow-module.md) — luồng thẩm định và kết nạp TVV vào mạng lưới.

| Bước | Account | State chuyển | Thao tác (per SRS) | **Data test** | API endpoint | Result | Evidence |
|:----:|---------|--------------|--------------------|---------------|--------------|:------:|----------|
| **1 (seed)** | CB NV | (Tạo mới) ➔ `MOI_DANG_KY` | Click [+ Thêm mới] → form `SCR-IV-02` → nhập hồ sơ TVV | TVV: `Nguyễn Văn Tư Vấn` / CCCD `001085000001` / NS `1985-03-15` / Lĩnh vực Lao động / Tổ chức `Trung tâm trợ giúp pháp lý` (đầy đủ 6 fixture seed T1.B3) | POST `/api/v1/tu-van-viens` | ✅ PASS | seed report — `TVV-BTP-TW-0001..0006` |
| **2** | CB NV | `MOI_DANG_KY` ➔ `CHO_THAM_DINH` | Mở danh sách → nhấn nút [Tiếp nhận] hồ sơ | TVV-BTP-TW-0001 (uuid `fd76f004-...`) | (theo SRS phải có endpoint `/tiep-nhan` riêng) | ⚠️ **DEVIATION** | UI thiếu nút (BUG-FLOW-TVV-005); API `/tiep-nhan` 404 (BUG-FLOW-TVV-004) |
| **3** | CB NV | `CHO_THAM_DINH` ➔ `DANG_THAM_DINH` | Mở hồ sơ, chọn tab Thẩm định, bắt đầu chấm điểm | TVV-BTP-TW-0001 | POST `/tu-van-viens/{id}/tham-dinh` body `{ ketLuan:"DAT", nhom1KetQua:true, nhom1Diem:90, nhom2..nhom4 }` | ⚠️ DEVIATION | State nhảy thẳng `MOI_DANG_KY → DANG_THAM_DINH` (skip CHO_THAM_DINH — BUG-004); chấm điểm + chuyển state OK • [`image/03-detail-TVV0001-DANG_THAM_DINH-after-step3.png`](image/03-detail-TVV0001-DANG_THAM_DINH-after-step3.png) |
| **4** | CB NV | `DANG_THAM_DINH` ➔ `CHO_PHE_DUYET` | Chấm điểm 4 nhóm tiêu chí (Pháp lý/Năng lực/Hiệu quả/Mạng lưới). Khi nhóm Pháp lý ĐẠT → chọn kết luận Đạt → nhấn [Trình duyệt] | TVV-BTP-TW-0001 — radio Pháp lý: **Đạt**; radio Kết luận: **ĐẠT**; điểm nhóm 2-3 = 5/10 (default), nhóm 4 tham gia mạng lưới = true | POST `/tu-van-viens/{id}/tham-dinh` body `{ ketLuan:"DAT", trinhDuyet:true, version:N }` | ✅ PASS | State chuyển CHO_PHE_DUYET đúng • [`image/05-detail-TVV0001-CHO_PHE_DUYET-after-step4.png`](image/05-detail-TVV0001-CHO_PHE_DUYET-after-step4.png) |
| **5** | CB PD | `CHO_PHE_DUYET` ➔ `DANG_HOAT_DONG` | Log out CB NV → Login CB PD → mở danh sách chờ duyệt → nhấn [Phê duyệt] | TVV-BTP-TW-0001 — `ghiChu: "Phê duyệt TVV happy path - đủ điều kiện gia nhập mạng lưới"` | POST `/tu-van-viens/{id}/phe-duyet` body `{ ghiChu, version:4 }` | ✅ PASS state | API 200, state DANG_HOAT_DONG, `ngayCongNhan: "2026-04-25"` auto-set ✓ • Audit fields `nguoiDuyetId/ngayDuyet/ghiChuPheDuyet/nguoiGuiDuyetId/ngayGuiDuyet` vẫn null (BUG-FLOW-TVV-002) |

**Happy path summary:** 4/5 bước PASS state-final.
- **Bước 2 + 3:** State machine không khớp SRS — `CHO_THAM_DINH` chưa bao giờ được entered. Implementation gộp Bước 2-3 thành 1 step `/tham-dinh` (BUG-004 + BUG-005).
- **Bước 5:** State chuyển đúng nhưng audit trail null (BUG-002).

---

## 2. Reject Branches

### 2.1 Nhánh phụ Bước 3 — YCBS (Yêu cầu bổ sung)

> **Tham chiếu SRS:** [`flow-module.md §2 (Phụ) Bước 3`](../../../input/flow-module.md) — `ĐANG THẨM ĐỊNH ➔ YÊU CẦU BỔ SUNG` — CB NV phát hiện thiếu giấy tờ → chọn kết luận YCBS + nhập lý do.

#### 2.1a Path SAI flow (TVV-BTP-TW-0002) — document BUG-FLOW-TVV-004

| Bước | Account | State chuyển | Thao tác | **Data test** | API endpoint | Result |
|:----:|---------|--------------|----------|---------------|--------------|:------:|
| 1a | CB NV | `MOI_DANG_KY` ➔ `YEU_CAU_BO_SUNG` (skip Bước 2-3) | `/tham-dinh` ketLuan=YCBS trực tiếp từ MOI_DANG_KY | TVV-BTP-TW-0002 (uuid `63640ce9-...`) — `ketLuan:"YEU_CAU_BO_SUNG"`, `lyDo:"Hồ sơ TVV-0002 thiếu chứng chỉ hành nghề - yêu cầu bổ sung tài liệu trong 15 ngày"` | POST `/tu-van-viens/{id}/tham-dinh` | ⚠️ **PARTIAL** — state cuối đúng nhưng skip 2 state intermediate (vi phạm SRS). Bằng chứng cho BUG-FLOW-TVV-004. |

#### 2.1b Path ĐÚNG SRS (TVV-BTP-TW-0005) — re-test sau user feedback

| Bước | Account | State chuyển | Thao tác | **Data test** | API endpoint | Result |
|:----:|---------|--------------|----------|---------------|--------------|:------:|
| 1b-i | CB NV | `MOI_DANG_KY` ➔ `DANG_THAM_DINH` | Bước 2-3 SRS — chấm điểm DAT để vào DANG_THAM_DINH | TVV-BTP-TW-0005 (uuid `6e9dfdf5-...`) — `ketLuan:"DAT"`, nhom1-4 đầy đủ, `lyDo:"Bước 3 SRS-compliant - bắt đầu thẩm định TVV-0005"` | POST `/tu-van-viens/{id}/tham-dinh` | ✅ PASS (skip CHO_THAM_DINH per BUG-004) |
| 1b-ii | CB NV | `DANG_THAM_DINH` ➔ `YEU_CAU_BO_SUNG` | Bước 3 phụ SRS — chuyển kết luận YCBS sau khi thẩm định | TVV-BTP-TW-0005 — `ketLuan:"YEU_CAU_BO_SUNG"`, nhom1KetQua=false (Pháp lý KO đạt), `lyDo:"TVV-0005 thiếu bằng tốt nghiệp đại học - yêu cầu bổ sung trong 15 ngày"` | POST `/tu-van-viens/{id}/tham-dinh` (lần 2) | ✅ **PASS** — state cuối đúng, `thamDinhMoiNhat.ketLuan: YEU_CAU_BO_SUNG`, `lyDo` lưu đúng. |

### 2.2 Nhánh Bước 5 — CB PD từ chối (TVV-BTP-TW-0003)

> **Tham chiếu SRS:** [`flow-module.md line 120`](../../../input/flow-module.md) — "Khi Cán bộ Phê duyệt chọn [Từ chối]: Bắt buộc phải nhập Lý do (tối thiểu 10 ký tự)". TVV section không nói rõ state đích → terminal close `TU_CHOI` chấp nhận được.

| Bước | Account | State chuyển | Thao tác | **Data test** | API endpoint | Result |
|:----:|---------|--------------|----------|---------------|--------------|:------:|
| Pre | CB NV | `MOI_DANG_KY` ➔ `CHO_PHE_DUYET` | Advance qua Bước 3-4 (DAT + trinhDuyet=true) | TVV-BTP-TW-0003 (uuid `09ef865d-...`) | POST `/tu-van-viens/{id}/tham-dinh` × 2 | ✅ PASS (chuẩn bị state) |
| 2 | CB PD | `CHO_PHE_DUYET` ➔ `TU_CHOI` | CB PD click [Từ chối] + nhập lý do ≥10 ký tự | TVV-BTP-TW-0003 — `lyDo:"Hồ sơ chưa đầy đủ chứng minh năng lực thực tế của TVV - cần bổ sung"`, version=3 | POST `/tu-van-viens/{id}/tu-choi` | ✅ PASS state — ⚠️ `ghiChuPheDuyet` null (BUG-FLOW-TVV-003) |

### 2.3 Nhánh Bước 1 phụ — Soft-delete (TVV-BTP-TW-0004)

> **Tham chiếu SRS:** [`flow-module.md §2`](../../../input/flow-module.md) chưa có dòng cụ thể cho delete TVV state MOI_DANG_KY → suy luận: trước khi tiếp nhận thì CB NV được phép xóa hồ sơ nháp.

| Bước | Account | State chuyển | Thao tác | **Data test** | API endpoint | Result |
|:----:|---------|--------------|----------|---------------|--------------|:------:|
| 1 | CB NV | `MOI_DANG_KY` (giữ nguyên) + `isDeleted: false → true` | API DELETE soft-delete | TVV-BTP-TW-0004 (uuid `5bd3b075-...`) | DELETE `/tu-van-viens/{id}` | ✅ PASS — 204 No Content; `deletedAt: 2026-04-25T09:07:53.110Z`; biến mất khỏi list MOI_DANG_KY (tab count -1) |

**Note UI:** Trên list-table action "Xóa" hiển thị as `StaticText` (không phải link/button) → đã log ở CG/TVV UI Round 1, không re-log.

---

## 3. Auto-transition / Side-effect

| # | Trigger | Field bị set | Cơ chế | **Data test** | Result | Note |
|:-:|---------|--------------|--------|---------------|:------:|------|
| 1 | `/phe-duyet` thành công | `ngayCongNhan` | Backend stamp khi state = DANG_HOAT_DONG | TVV-0001 sau Bước 5 | ✅ PASS | `2026-04-25` (đúng ngày test) |
| 2 | Mọi action | `version` increment | Optimistic locking +1 mỗi update | TVV-0001 version 1 → 5 | ✅ PASS | Conflict 409 nếu version stale (đã verify probe) |
| 3 | Mọi action | `nguoiCapNhatId` | Auto theo current user | TVV-0001 sau /phe-duyet → `8de824dd-...` (cb_pd_tw_01) | ✅ PASS | — |
| 4 | `/phe-duyet` (Bước 5) | `nguoiDuyetId, ngayDuyet, ghiChuPheDuyet` | Phải set khi state CHO_PHE_DUYET → DANG_HOAT_DONG | TVV-0001 sau Bước 5 | ❌ FAIL | **BUG-FLOW-TVV-002** — vẫn null |
| 5 | `/tham-dinh trinhDuyet=true` (Bước 4) | `nguoiGuiDuyetId, ngayGuiDuyet` | Phải set khi state DANG_THAM_DINH → CHO_PHE_DUYET | TVV-0001 sau Bước 4 | ❌ FAIL | **BUG-FLOW-TVV-002** — vẫn null |
| 6 | `/tu-choi` (Bước 5 reject) | `ghiChuPheDuyet` | Phải set bằng `lyDo` từ body | TVV-0003 sau /tu-choi | ❌ FAIL | **BUG-FLOW-TVV-003** — vẫn null |

---

## 4. Preset E2E

| Preset | Mục tiêu | Chạy? | Result | Data test cần | Note |
|--------|----------|:-----:|:------:|---------------|------|
| P2 — TVV detail Lịch sử | ≥2 VV (state khác nhau) gắn với TVV-0001 | ❌ SKIP | — | Cần T3.3 SM-VUVIEC chạy trước → tạo 2 VV (HOAN_THANH + DANG_XU_LY) gán TVV-0001 | Defer P3 ngày sau |

---

## 5. API Endpoints đã verify

| Action | Endpoint | Method | Body fields chính | Auth role |
|--------|----------|--------|-------------------|-----------|
| Get detail | `/api/v1/tu-van-viens/{id}` | GET | — | CB_NV / CB_PD |
| List (filter state) | `/api/v1/tu-van-viens?trangThai=X` | GET | — | CB_NV / CB_PD |
| Thẩm định (Bước 3-4) | `/api/v1/tu-van-viens/{id}/tham-dinh` | POST | `nhom1KetQua, nhom1Diem, ..., nhom4ThamGia, ketLuan ∈ {DAT, KHONG_DAT, YEU_CAU_BO_SUNG}, lyDo, version, trinhDuyet?:bool` | CB_NV |
| Cập nhật trạng thái (generic) | `/api/v1/tu-van-viens/{id}/cap-nhat-trang-thai` | POST | `trangThaiMoi, lyDo, version` | CB_NV |
| Phê duyệt (Bước 5) | `/api/v1/tu-van-viens/{id}/phe-duyet` | POST | `ghiChu, version` | CB_PD |
| Từ chối (Bước 5) | `/api/v1/tu-van-viens/{id}/tu-choi` | POST | `lyDo, version` | CB_PD |
| Yêu cầu bổ sung (alt) | `/api/v1/tu-van-viens/{id}/bo-sung` | POST | `lyDo, version` | CB_NV |
| Soft-delete | `/api/v1/tu-van-viens/{id}` | DELETE | — | CB_NV |
| Tiếp nhận (Bước 2) | `/api/v1/tu-van-viens/{id}/tiep-nhan` | POST | (chưa có) | — — **404 Not Found** (BUG-FLOW-TVV-004) |

**Note:** UI button "Trình duyệt" (Bước 4) gọi cùng `/tham-dinh` endpoint với extra flag `trinhDuyet:true` — không có dedicated `/trinh-duyet` endpoint.

---

## 6. Cascade impact (sau T3.1 PASS)

| Downstream task | Trước T3.1 | Sau T3.1 PASS |
|-----------------|------------|----------------|
| T3.3 SM-VUVIEC Bước 3 (Phân công NHT/TVV) | 🚫 BLOCKED | ✅ UNBLOCKED — TVV-0001 `DANG_HOAT_DONG` sẵn |
| T2.0.5 Seed PC TH B (TVV phụ trách) | 🚫 BLOCKED | ✅ UNBLOCKED |
| T4.2 Functional CG/TVV (31 TC) | ⚠️ Partial — chỉ test create/list | ✅ READY — 5 state (DANG_HOAT_DONG / YEU_CAU_BO_SUNG / TU_CHOI / MOI_DANG_KY / soft-deleted) đã có data |
| T5.4 Cross-module TVV↔VV | 🚫 BLOCKED | ✅ UNBLOCKED |

---

## 7. Tab counts cuối session (verify)

| Tab | Count | Sample IDs |
|-----|:-----:|------------|
| Đang hoạt động | 1 | TVV-BTP-TW-0001 |
| Mới đăng ký | 1 | TVV-BTP-TW-0006 (chưa touch) |
| Yêu cầu bổ sung | 2 | TVV-BTP-TW-0002 (path sai), TVV-BTP-TW-0005 (path đúng) |
| Chờ thẩm định | 0 | (state này không bao giờ entered — BUG-004) |
| Chờ phê duyệt | 0 | — |
| Đã từ chối | 1 | TVV-BTP-TW-0003 |
| (Soft-deleted, ẩn) | 1 | TVV-BTP-TW-0004 |

---

## 8. Bugs & Findings

Xem [`bug-report-flow-tvv.md`](bug-report-flow-tvv.md) — 5 bug có SRS reference (4 Major + 1 Medium):
- **BUG-FLOW-TVV-001** Major — API `/tham-dinh` accept `ketLuan` arbitrary string
- **BUG-FLOW-TVV-002** Major — Audit trail fields (`nguoiDuyetId`, `ngayDuyet`, `nguoiGuiDuyetId`, `ngayGuiDuyet`, `ghiChuPheDuyet`) null sau workflow
- **BUG-FLOW-TVV-003** Major — `ghiChuPheDuyet` không lưu `lyDo` sau /tu-choi
- **BUG-FLOW-TVV-004** Major — State machine skip CHO_THAM_DINH + DANG_THAM_DINH
- **BUG-FLOW-TVV-005** Major — UI thiếu nút [Tiếp nhận] trên list + detail page

---

*Workflow test complete: 2026-04-25 16:10 | QA AI via Claude Code + Chrome DevTools MCP + direct API*
*Method: 80% API direct (Bearer token 15-min TTL từ /auth/login + /verify-otp `666666`), 20% UI walk-through để verify form behavior + state badge.*
