# TODO — QA PM HTPLDN — Round 5 FROZEN reference (R1-R10 lịch sử pre-reset)

> **File này là tách ra từ [`tasks/todo.md`](../../../tasks/todo.md)** ngày 2026-05-01 sau khi dev reset DB toàn bộ.
> **Trạng thái:** FROZEN — KHÔNG cập nhật sau 1/5. Giữ làm reference cho Round 6 (cách seed, lessons learned, bug pattern, dev fix iterate 5 tuần).
> **Round 6 active tracker:** [`tasks/todo.md`](../../../tasks/todo.md) section "Round 6 — Active task tracker".
> **R6 README:** [`README.md`](../round6-2026-05-01-postreset/README.md).
>
> Status icon ✅ ⚠️ 🚫 trong file này = state lúc R10 (1/5 14:30), KHÔNG phản ánh data hiện tại (đã reset).

---

# 📚 Round 5 — FROZEN reference (R1-R10 lịch sử pre-reset)

> Toàn bộ section dưới đây (bảng tiến độ + Notes + P0-P5 + Postmortem + Module bị block + Bug đã đóng) = **lịch sử pre-reset**, KHÔNG cập nhật sau 2026-05-01. Giữ làm reference cho R6 (cách seed, lessons learned, bug pattern). Status icon ✅ ⚠️ 🚫 = state lúc R10 (1/5).

## Tiến độ Round 5 (FROZEN)

| Phase | Window | Tổng | ✅ | 🟢 | 🔵 | ⚠️ | 🚫 | ⏳ |
|---|---|---|---|---|---|---|---|---|
| P0 Chuẩn bị | T0 (0.5 ngày) | 2 | 2 | - | - | - | - | - |
| P1 Smoke + LỚP 1-2 nền tảng | T1 (1 tuần) | 13 | 12 | - | - | - | 1 | - |
| P2 5 trụ song song | T2 (1 tuần) | 25 | 10 | 4 | - | 4 | 6 | 1 |
| P3 LỚP 4-5 đầu ra | T3 (1 tuần) | 5 | - | - | - | 1 | 3 | 1 |
| P4 Functional 16 module | T4 (1 tuần) | 17 | - | 1 | - | 5 | 6 | 5 |
| P5 TC chi tiết + UI + Regression | T5 (1 tuần) | 6 | - | - | - | 1 | - | 5 |
| **Tổng Round 5 (frozen)** | | **68** | **24** | **5** | **0** | **11** | **16** | **12** |

> **Note 2026-04-28:** Tách 5 task `*-PUBLIC` (A1/A3/A4/A5/P3.2) — luồng DN/NHT gửi qua Cổng PLQG/DVC — hoãn đợi dev. Test luồng CB NV nhập tay tính riêng (vd A1 = 11/12 bước = 92%).

> **Note 2026-04-29 00:18-00:52:** T1.B3b 6 CG ✅ + T1.B3c 3 NHT ✅ + T1.B1c 6 MPH ⚠️ (skip Lý do — fixture mismatch SRS). Pool TVV/CG/NHT giờ đủ unblock A2b (Phân công Đợt 3) + A3 dropdown NHT + A4 MPH + A5 modal Phân công CG.

> **Note 2026-04-29 01:00-01:35 R6 (A1 re-run advance 9 record mới):** A1 R6 ✅ advance 9 record CG/NHT (T1.B3b/T1.B3c, TVV-0021..0029) qua Bước 2-5 SM-TVV + Bước 6 FR-IV-08 [Công khai] → 15 ACTIVE + 9 `la_cong_khai=true`. State-side caveat A5 cleared. Section R6 tại [workflow-test-report-TVV.md](./workflow/workflow-test-report-TVV.md#round-6--advance-state-9-record-cgnht-mới-t1b3bt1b3c--2026-04-29-01001-35).

> **Note 2026-04-29 09:10 R7 (A2b re-test sau user thông báo "đã thêm data"):** A2b ✅ 7/9 row Đợt 3 (1 R6 + 6 R7) cho 6 user CG/TVV csv × 6 LV unique (TW). 22 row total. Dev claim "đã thêm" KHÔNG fix dropdown — TAI_KHOAN entity vẫn 15 user. 2 row NHT pending BA SRS mâu thuẫn (FR-II-NEW-01 "CB/TVV" vs FR-II-06 "CB/TVV/NHT"). Acceptance gốc nhầm scope NHT + entity TU_VAN_VIEN.

> **Note 2026-04-29 R6 (Trụ A re-test sau dev claim "fix all"):** A2b ⚠️ 1/9 row (acceptance gap — TU_VAN_VIEN ≠ TAI_KHOAN entity, dropdown Phân công load từ TAI_KHOAN, dropdown miss NHT, unique (LV, người xử lý) chặn reuse). A3 ❌ confirm BUG-FLOW-VUVIEC-001 STILL OPEN (UI 0 nút workflow + 7/9 BE 404 — identical R3 28/4). A4 ❌ confirm BUG-FLOW-HOIDAP-002 STILL OPEN (FE giờ BLOCK strict CB NV cùng đơn vị — vi phạm SRS FR-II-07 Preconditions + E3 WRN-PH-01) + BUG-FLOW-HOIDAP-003 STILL OPEN (modal Phân công HD-001 Hình sự vẫn empty). A5 ❌ confirm BUG-FLOW-TVCS-003 STILL OPEN (FE vẫn truyền `trangThai=HOAT_DONG` thay `DANG_HOAT_DONG` — vi phạm SRS srs-fr-04-chuyen-gia-tvv line 41/494/513/539). **Dev claim "fix all Trụ A" KHÔNG đúng — 4 bug Critical/Major Open lại confirmed.**

> **Note 2026-04-29 17:45-18:00 T4.1 Functional Hỏi đáp:** ⚠️ 21/35 PASS + 4 PARTIAL. CRUD/Tiếp nhận/Phân công/Soạn/Phê duyệt/Hủy/Authz smoke OK. **NEW BUG-FUNC-HOIDAP-001 Critical** — chọn Mẫu phản hồi crash `<PhanHoiForm>` TypeError → 404 fallback (HD-034). HD-015/016/017 BLOCKED cascade BUG-FLOW-HOIDAP-004 R8 Open (502 Cổng PLQG). HD-027/028/029 DEFER permission round. 2 observations: HUY state vẫn hiện edit/delete; "Đã trả lời" checkbox spec không có UI.

> **Note 2026-04-29 09:36 R7 (A5 re-test):** A5 ❌ FAIL — modal Phân công CG TVCS-0001 dropdown `Trống`. Pool thực có **8 CG** `DANG_HOAT_DONG + Công khai` cover 6 LV (TVV-0019..0026), riêng Doanh nghiệp có 2 CG (TVV-0019 + TVV-0021). FE truyền `trangThai=HOAT_DONG` (entity TAI_KHOAN) cho `/api/v1/tu-van-viens` (entity TU_VAN_VIEN) → BE trả 0. 2-source verify (SRS local + NotebookLM ERD) match. Section R7 thêm vào [bug-report-flow-TVCS.md](./bug-reports/bug-report-flow-TVCS.md) + [workflow-test-report-TVCS.md](./workflow/workflow-test-report-TVCS.md).

> **Note 2026-04-29 15:06-15:20 R8 (Trụ A re-test sau dev claim "đã fix"):** A3 ❌ STILL OPEN lần 4 (UI 0 nút + BE 7/9 endpoint 404 identical R3/R6). A4 ⚠️ BUG-002 + BUG-003 ✅ Closed (FE giờ hiện textarea + WRN-PH-01 dialog đúng SRS, modal Phân công HD-001 hiện cb_nv_tw_03), happy path B1-B5 PASS (HD-20260426-001 KDTM advance Tiếp nhận → Đã duyệt) nhưng B6 [Công khai PLQG] FAIL 502 → **new BUG-FLOW-HOIDAP-004 Major** BE config Cổng PLQG `Invalid URL`. A5 ❌ BUG-003 ✅ Closed (FE truyền `trangThai=DANG_HOAT_DONG&loaiTvv=CG&linhVucIds=...` đúng, dropdown 2 CG) nhưng B2 click [Phân công] → **new BUG-FLOW-TVCS-004 Critical** BE 404 reject cả 2 CG `Chuyen gia khong ton tai hoac chua duoc duyet` (BE filter POST inconsistent với GET dropdown).

> **Note 2026-05-01 12:50-12:56 R9 (Trụ A re-test sau dev claim fix lần 4):** A3 ❌ STILL OPEN lần 5 — UI thêm 9 collapsible section + state machine progress bar nhưng vẫn 0 nút workflow + 7/9 endpoint 404 identical R3/R6/R8. A4 ✅ BUG-FLOW-HOIDAP-004 Closed — POST `/cong-khai` 200, HD-20260426-001 advance `Đã duyệt → Công khai`, `trangThaiDongBo: SUCCESS`. A5 ✅ BUG-FLOW-TVCS-004 Closed — POST `/phan-cong` 200, TVCS-0001 advance `Tiếp nhận → Phân công`, BE filter consistent với GET dropdown. **3/3 bug verify: A3 vẫn fail (chỉ cải thiện cosmetic UI), A4 + A5 dev fix đúng.**

> **Note 2026-05-01 13:48-13:55 R10 (A4 test 2 bước còn lại):** B11 [Hủy công khai] ✅ — POST `/huy-cong-khai` 200, HD-001 `Công khai → Đã duyệt`, version 8→9, `laCongKhai: false`. B12 [Đóng từ CONG_KHAI] ❌ — log **BUG-FLOW-HOIDAP-005 Major**: FE thiếu nút [Đóng] cho cả CB NV và CB PD ở state CONG_KHAI; direct API POST `/dong-ho-so` trả 403 Forbidden cho cả 2 role (JWT permissions thiếu `complete_hoi_dap`). Vi phạm SRS line 480.

> **Note 2026-05-01 14:30 R10b (A5 deep dive — data gap, KHÔNG phải bug app):** Test Bước 4 [CG Chấp nhận] TVCS-0001 → BLOCKED. Root cause: TVV-0021 (Lý Thị Mười Ba) không có TAI_KHOAN linked qua FK `TU_VAN_VIEN.tai_khoan_id`. Pool 3 CG accounts trong csv (`cg_01..03`) thuộc đơn vị STP-AG/BG/BNI, khác đơn vị TVCS-0001 (Cục BTTP TW). Path (b) tạo TVCS đơn vị STP-AG cũng fail — STP-AG có 0 DN seed. Đã update fixture v2.6.1 thêm block `cap_tai_khoan_cg_nht_r5` (9 cặp account-profile) + thêm task seed mới T1.B3d 🚫 (đợi dev reset password QTHT — qtht_01/02/03/admin đều 401 ERR-AUTH-LOGIN-01).

> Trụ E (E1-E4 daily monitor, không gate) tính ngoài 16 task P2 — hiện 4/4 🟢 (no gate, monitor được ngay).

⚠️ **SRS chờ BA xác nhận:** 5 mâu thuẫn — xem [system-overview §7](../../../tasks/system-overview.md#7--5-mâu-thuẫn-cần-ba-xác-nhận)

---

## P0 — Chuẩn bị

- ✅ **T0.1** Verify env + 11 vai trò login
  - **Kết quả:** PASS 10/11 — DN role API-only. [_prep-log.md](./_prep-log.md)
- ✅ **T0.2** Tạo skeleton folder Round 5 — Pass. [README](./README.md)
- ✅ **C0** Auto chuyển P1

---

## P1 — Smoke + LỚP 1-2 nền tảng (Tuần 1)

### Block A — Smoke 16 module

- ✅ **T1.A1** Smoke 16 module × 5 vai trò chính
  - **Kết quả:** PASS 0 bug. E3+E4 mở, E2 một phần, E1 block. [smoke-test-report.md](./smoke-test/smoke-test-report.md)

### Block B — Seed Tier 0-1 master (`qtht_01` + `cb_nv_tw_01`)

- ✅ **T1.B1** Seed Quản trị nền tảng
  - **Kết quả:** PASS — Đơn vị 5/5, Tiêu chí ĐG 100%, Phân công 8/8. [seed-checklist-QTHT.md](./seed/seed-checklist-QTHT.md)
  - **Bug:** [bug-report-seed-qtht.md](./bug-reports/bug-report-seed-qtht.md) — 3/3 đóng
- ✅ **T1.B2** Seed Doanh nghiệp (12 variant)
  - **Kết quả:** PASS 12/12. 0 bug. [seed-checklist-DN.md](./seed/seed-checklist-DN.md)
- ✅ **T1.B3** Seed TVV entry `Mới đăng ký` (12 variant)
  - **Kết quả:** PASS 12/12. Gap CG/NHT lấp qua T1.B3b/c. [seed-checklist-TVV.md](./seed/seed-checklist-TVV.md)

- ✅ **T1.B1c** Seed Mẫu phản hồi + Lý do từ chối/bổ sung — **mới R5**
  - **Kết quả:** PASS 6/6 Mẫu phản hồi. Lý do skip — fixture mismatch SRS. [seed-checklist-QTHT.md §B1c](./seed/seed-checklist-QTHT.md#b1c--t1b1c-seed-mẫu-phản-hồi--observation-lý-do--2026-04-29-0035-0052)

- ✅ **T1.B3b** Seed 6 CG cover 6 lĩnh vực — **mới R5**
  - **Kết quả:** PASS 6/6 CG (TVV-0021..0026) cover 6 LV. [seed-checklist-TVV.md §B3b](./seed/seed-checklist-TVV.md#b3b--t1b3b-seed-6-cg-cover-6-lĩnh-vực--2026-04-29-0018)

- ✅ **T1.B3c** Seed 3 NHT cấp ĐP — **mới R5**
  - **Kết quả:** PASS 3/3 NHT (TVV-0027..0029) cấp ĐP. [seed-checklist-TVV.md §B3c](./seed/seed-checklist-TVV.md#b3c--t1b3c-seed-3-nht-cấp-đp--2026-04-29-0032)

- 🚫 **T1.B3d** Seed 9 cặp TAI_KHOAN login linked với CG/NHT R5 (variant 13-21) — **mới R10 1/5** `[block: QTHT 401, cần dev reset password trước]`
  - **Kết quả:** BLOCKED — qtht_01/02/03 + admin đều 401 ERR-AUTH-LOGIN-01. Không tạo được TAI_KHOAN. [seed-fixture.yaml `cap_tai_khoan_cg_nht_r5`](../../../input/data/seed-fixture.yaml)
  - **Cần có sẵn:** dev reset password QTHT + verify 9 TVV/CG/NHT đã ở DANG_HOAT_DONG (T1.B3b/c ✅)
  - **Tác động:** A5 Bước 4-12 + A3 VV Phân công NHT + B7 KH (CG giảng) BLOCK đến khi seed xong
- ✅ **T1.B4** Seed Thư mục + Biểu mẫu entry `Nháp` (5 thư mục + 11 BM)
  - **Kết quả:** PASS 4 thư mục + 7 BM. 0 bug. [seed-checklist-BIEUMAU.md](./seed/seed-checklist-BIEUMAU.md)

### Block C — Pre-seed Tier 2 entry state (input cho Trụ A)

- ✅ **T1.C1** Seed Hỏi đáp entry `Mới` (11 variant)
  - **Kết quả:** PASS 6/6. 0 bug. [seed-checklist-HOIDAP.md](./seed/seed-checklist-HOIDAP.md)
- ✅ **T1.C2** Seed Vụ việc entry `Đã tiếp nhận` (15 variant)
  - **Kết quả:** PASS 8/8 (dùng lại R4). 0 bug. [seed-checklist-VUVIEC.md](./seed/seed-checklist-VUVIEC.md)
- ✅ **T1.C3** Seed TV chuyên sâu entry `Tiếp nhận` (10 variant)
  - **Kết quả:** PASS 6/6 (dùng lại R4). 0 bug mới. [seed-checklist-TVCS.md](./seed/seed-checklist-TVCS.md)
- ✅ **T1.C4** Seed HSPL Hồ sơ pháp lý DN (10 variant)
  - **Kết quả:** PASS 6/6 `Hiệu lực` đủ 5/5 enum. 0 bug. [seed-checklist-HSPL.md](./seed/seed-checklist-HSPL.md)

- ✅ **C1a gate** (cuối Ngày 5): 4 seed-checklist Block B + B1 partial accept → unblock ngay **A1 + Trụ B + Trụ C + Trụ E** chạy song song với Block C
- ✅ **C1b gate**: 4 seed-checklist Block C PASS (T1.C1-C4 xong) → unblock **A3/A4/A5 + Trụ D**
- ✅ **C1 final gate**: 8 seed-checklist + smoke report PASS → auto chuyển P2 (theo yêu cầu user "không cần dừng chờ duyệt")

---

## P2 — 5 trụ song song (Tuần 2)

> **Mindset trụ:** mỗi trụ = "tạo data + chạy flow ngay + verify state cuối". Trụ độc lập → song song được.

### 🟦 Trụ A — TVV → PC → VV → HD → TVCS (~5 ngày, ưu tiên 1)

- ✅ **A1** Workflow TVV — luồng CB NV nhập tay (12 bước — theo [02-thu-tu-module.md §③](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L220-L249))
  - **Kết quả:** PASS 12/12 bước. R6 advance thêm 9 record CG/NHT. [workflow-test-report-TVV.md](./workflow/workflow-test-report-TVV.md)
  - **Bug:** [bug-report-flow-TVV.md](./bug-reports/bug-report-flow-TVV.md) — 3/4 đóng (1 pending BA)

- ⏳ **A1-PUBLIC** Workflow TVV — luồng NHT tự đăng ký qua form công khai (3 bước) `[need: dev build form công khai]`
  - **Kết quả:** Chưa test — defer theo split scope 28/4.

- ✅ **A2** QTHT thêm Phân công Đợt 2 (≥6 row TVV × 6 lĩnh vực)
  - **Kết quả:** PASS 6/6 row. 0 bug. [seed-checklist-QTHT.md §A2](./seed/seed-checklist-QTHT.md#a2--phân-công-đợt-2-uu_tien2--2026-04-27-1930-1950)

- ✅ **A2b** QTHT thêm Phân công Đợt 3 cho CG + NHT mới — **mới R5** `[~78% — 7/9 row PASS, 2 NHT pending BA]`
  - **Kết quả:** ⚠️ 7/9 row PASS. 2 NHT pending BA SRS ambiguity. [seed-checklist-QTHT.md §A2b R7](./seed/seed-checklist-QTHT.md#a2b-r7--re-test-sau-dev-claim-đã-thêm-dữ-liệu--7-9-row-cgtvv-2026-04-29-0910)
  - **Cần có sẵn:** TAI_KHOAN entity (cg_01..03 + tvv_01..03 csv) ✅

- 🚫 **A3** Workflow Vụ việc — luồng CB NV nhập tay (~15 bước — theo [02-thu-tu-module.md §⑥](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L392-L413)) `[block: BUG-FLOW-VUVIEC-001 STILL OPEN R9 lần 5]`
  - **Kết quả:** R9 FAIL lần 5 — UI thêm 9 section nhưng vẫn 0 nút + 7/9 endpoint 404. [workflow-test-report-VUVIEC.md](./workflow/workflow-test-report-VUVIEC.md)
  - **Bug:** [bug-report-flow-VUVIEC.md](./bug-reports/bug-report-flow-VUVIEC.md) — 0/1 đóng
  - **Cần có sẵn:** data ready, chờ dev build BE 7 endpoint + FE 10 nút workflow

- 🚫 **A3-PUBLIC** Workflow VV — luồng DN gửi qua DVC/Hệ thống khác (3 bước) `[defer: T4.16 test API]`
  - **Kết quả:** Hoãn. Đợi giai đoạn T4.16 test API.

- ⚠️ **A4** Workflow Hỏi đáp — luồng CB NV nhập tay (12 transition — theo [02-thu-tu-module.md §⑦](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L463-L481)) `[~92% — R10 11/12 bước PASS, B12 path từ CONG_KHAI BUG-005]`
  - **Kết quả:** R10 ⚠️ 11/12 PASS. B11 [Hủy công khai] ✅. B12 path từ CONG_KHAI ❌ FE thiếu nút + BE 403. [workflow-test-report-HOIDAP.md](./workflow/workflow-test-report-HOIDAP.md)
  - **Bug:** [bug-report-flow-HOIDAP.md](./bug-reports/bug-report-flow-HOIDAP.md) — 4/5 đóng (BUG-005 Major Open)

- 🚫 **A4-PUBLIC** Workflow HD — luồng DN gửi qua Cổng PLQG/DVC (1 bước) `[defer: T4.16 test API]`
  - **Kết quả:** Hoãn. Đợi giai đoạn T4.16 test API.

- ⚠️ **A5** Workflow TV chuyên sâu — luồng CB NV nhập tay (~11 bước — theo [02-thu-tu-module.md §⑧](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L527-L542)) `[~23% — R10 B1-B3 PASS, B4-12 BLOCKED data gap T1.B3d]`
  - **Kết quả:** R10 ⚠️ 3/13 PASS. B4-12 BLOCKED — TVV-0021 không có account login linked qua FK. [workflow-test-report-TVCS.md](./workflow/workflow-test-report-TVCS.md)
  - **Bug:** [bug-report-flow-TVCS.md](./bug-reports/bug-report-flow-TVCS.md) — 4/4 đóng (KHÔNG bug app)
  - **Cần có sẵn:** T1.B3d 🚫 (cần dev reset password QTHT trước → seed 9 cặp account-profile theo `cap_tai_khoan_cg_nht_r5` fixture v2.6.1)

- 🚫 **A5-PUBLIC** Workflow TVCS — luồng DN gửi qua Cổng PLQG (1 bước) `[defer: T4.16 test API]`
  - **Kết quả:** Hoãn. Đợi giai đoạn T4.16 test API.

---

### 🟩 Trụ B — Đào tạo (~3 ngày, song song A)

- ✅ **B1** Tạo CTĐT entry `Dự thảo` (fixture 6 variant)
  - **Kết quả:** PASS 6/6. 0 bug. [seed-checklist-CTDT.md](./seed/seed-checklist-CTDT.md)

- ✅ **B2** Đẩy CTĐT → `Đã duyệt`
  - **Kết quả:** PASS 6/6 chuyển state. 0 bug SRS-ref. [workflow-test-report-CTDT.md](./workflow/workflow-test-report-CTDT.md)

- ✅ **B3** Tạo Khóa học gắn CTĐT entry `Dự thảo` (fixture 8 variant)
  - **Kết quả:** PASS 8/8. 1 Major bug timezone UNFIXED từ R2. [seed-checklist-KHOAHOC.md](./seed/seed-checklist-KHOAHOC.md)
  - **Bug:** [bug-report-seed-KHOAHOC.md](./bug-reports/bug-report-seed-KHOAHOC.md) — 0/1 đóng

- ✅ **B4** Tạo Bài giảng entry `Kích hoạt` — song song B1-B3 (fixture 8 variant)
  - **Kết quả:** PASS 8/8. 0 bug. [seed-checklist-BAIGIANG.md](./seed/seed-checklist-BAIGIANG.md)

- ✅ **B5** Tạo Ngân hàng câu hỏi + Đề kiểm tra (10 NHCH + 5 ĐKT)
  - **Kết quả:** PASS NHCH 10/10 + ĐKT 5/5. 0 bug. [seed-checklist-NHCH.md](./seed/seed-checklist-NHCH.md)

- ✅ **B5b** Publish NHCH `Nháp → Công khai` + re-run ĐKT ngẫu nhiên
  - **Kết quả:** PASS 7/7. 0 bug. [workflow-test-report-NHCH-PUBLISH.md](./workflow/workflow-test-report-NHCH-PUBLISH.md)

- ✅ **B6** Tạo Giảng viên entry `Đang hoạt động` — song song B1-B5 (fixture 8 variant)
  - **Kết quả:** PASS 8/8. 0 bug mới. [seed-checklist-GIANGVIEN.md](./seed/seed-checklist-GIANGVIEN.md)

- ⚠️ **B7** Workflow Khóa học (10 bước — theo [02-thu-tu-module.md §⑨](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L551-L617)) `[~30% — Bước 2-3 PASS, BUG-001 chưa verify, Bước 4-10 chờ học viên]`
  - **Kết quả:** ⚠️ Bước 2-3 PASS, BUG-001 dev claim fix NOT verified. [workflow-test-report-KHOAHOC.md](./workflow/workflow-test-report-KHOAHOC.md)
  - **Bug:** [bug-report-flow-KHOAHOC.md](./bug-reports/bug-report-flow-KHOAHOC.md) — 0/1 đóng
  - **Cần có sẵn:** B3-B6 ✅ + B7-clarify ⏳ BA confirm vai trò "học viên" + ≥3 học viên seed

---

### 🟨 Trụ C — Biểu mẫu (~30 phút, song song A+B — nhanh nhất)

- ⚠️ **C1** Workflow Biểu mẫu (`Nháp → Công khai → Ẩn`) `[~100% flow — 4/4 nhánh PASS, 3 bug Open]`
  - **Kết quả:** ⚠️ PASS 4/4 nhánh state. 3 bug Open. [workflow-test-report-BIEUMAU.md](./workflow/workflow-test-report-BIEUMAU.md)
  - **Bug:** [bug-report-flow-BIEUMAU.md](./bug-reports/bug-report-flow-BIEUMAU.md) — 0/3 đóng

---

### 🟧 Trụ D — Hậu kỳ phụ thuộc Trụ A (~3 ngày, sau A xong)

- 🚫 **D1** Tạo kỳ Đánh giá HQ + tiêu chí entry `Lập kế hoạch` (fixture 5 variant) — block do A3 fail `[block: cần 6 VV Hoàn thành từ A3 ❌]`
  - **TK:** `cb_nv_tw_01` · **Cần có sẵn:** T1.B1 ✅ + 6 VV `Hoàn thành` từ A3 ❌
  - **Output dự kiến:** 5 kỳ ĐG (4 happy + 1 reject path) + 4 tiêu chí/kỳ tổng 100%.
  - **Report:** `seed-checklist-DANHGIA.md`

- 🚫 **D2** Workflow Đánh giá HQ (11 bước — theo [02-thu-tu-module.md §⑬](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L794-L815)) — block do D1 `[block: cascade D1]`
  - **TK:** CB NV → CB PD → TVV → CB NV → CB PD · **Cần có sẵn:** D1 ❌
  - **Output dự kiến:** 4 kỳ `Hoàn thành` + 1 kỳ test reject + báo cáo TT17 auto-export.
  - **Lưu ý:** UI hiện `Lập kế hoạch` nhưng DB lưu `Nháp` — verify cả 2.
  - **Report:** `workflow-test-report-DANHGIA.md`

- ⚠️ **D3** Tạo Kho QA + verify auto-feed `Tự động` — song song D1-D2 (fixture 9 variant) `[~50% — 9 QA thủ công OK, auto-feed chờ A4]`
  - **Kết quả:** ⚠️ 9 QA thủ công OK. Auto-feed chờ A4 unblock. `seed-checklist-KHOCH.md`
  - **Cần có sẵn:** T1.B1 ✅ + HD `Đã duyệt` từ A4 ❌

---

### 🟥 Trụ E — Theo dõi unblock (xuyên suốt round, không gate)

> Mỗi sáng curl + MCP smoke → ghi 1 dòng vào `_pillar-E-status.md`. Hết tuần T3 chưa unblock → cascade-block downstream, dời round sau.

- 🟢 **E1** Hợp đồng tư vấn (FR-X3-01) `[need: BE seed module HĐTV]`
  - **Cách theo dõi:** Daily curl `GET /api/v1/hop-dong-tu-vans` + verify sidebar SCR-X3-01
  - **Tác động nếu block:** seed HĐTV + workflow + T4.14 (29 TC) defer

- 🟢 **E2** CT HTPLDN GĐ1 (FR-15) `[need: BE seed module CT HTPLDN GĐ1]`
  - **Cách theo dõi:** Daily MCP click thử nút Tạo CT trên SCR-XI-01
  - **Tác động nếu block:** P3.3 + P3.4 + T4.15 (42 TC) defer

- 🟢 **E3** Chi trả (FR-06) `[need: LGSP đẩy record Chi trả]`
  - **Cách theo dõi:** Daily verify SCR-V.II-01 list count (chờ LGSP đẩy record)
  - **Tác động nếu block:** P3.1 + T4.12 (30 TC) defer

- 🟢 **E4** Phiên TV nhanh (FR-13.A) `[need: Cổng PLQG đẩy record TV nhanh]`
  - **Cách theo dõi:** Daily verify SCR-X2-03 list (chờ Cổng PLQG)
  - **Tác động nếu block:** P3.2 + T4.11 (39 TC) defer

- ⏳ **C2 gate** (cuối T2): 4 file `_pillar-{A,B,C,D}-result.md` + `_pillar-E-status.md` → user duyệt go P3 `[need: 4 file pillar result PASS + user duyệt]`

---

## P3 — LỚP 4-5 đầu ra (Tuần 3)

> Phụ thuộc: Trụ E unblock. Nếu chưa unblock → cascade-block các task tương ứng.

- 🚫 **P3.1** Workflow Chi trả (13 bước — theo [02-thu-tu-module.md §⑪](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L697-L713)) — block do A3 + BE seed API `[block: cần 6 VV Hoàn thành từ A3 + BE seed API]`
  - **Cần có sẵn:** E3 ✅ + 6 VV `Hoàn thành` từ A3 ❌
  - **Output dự kiến:** 6 Chi trả `Đã thanh toán` (cấp cho P3.4 + T4.12).
  - **Report:** `workflow-test-report-CHITRA.md`

- ⏳ **P3.2** Workflow TV nhanh — luồng CB NV nhập tay (5 trạng thái — verify ở `srs-fr-13-tv-nhanh.md` khi chạy) `[need: D3 unblock + ≥3 QA tự động]`
  - **Cần có sẵn:** E4 ✅ + 9 QA `Đã duyệt` từ D3 ⏳ + ≥3 QA tự động
  - **Output dự kiến:** 6 phiên TV nhanh `Kết thúc` + 1 phiên `Hết hạn` auto.
  - **Report:** `workflow-test-report-TVNHANH.md`

- 🚫 **P3.2-PUBLIC** Workflow TV nhanh — luồng DN gửi qua Cổng PLQG (1 bước) `[defer: T4.16 test API]`
  - **Kết quả:** Hoãn. Đợi giai đoạn T4.16 test API.

- ⚠️ **P3.3** Workflow CT HTPLDN GĐ1 — luồng nhập tay (11 bước — theo [02-thu-tu-module.md §⑤](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L328-L342)) `[~82% — 9/11 bước, 3 bug Open]`
  - **Kết quả:** ⚠️ 9/11 bước (82%). 3 bug Open (BUG-001 Critical vẫn block). [workflow-test-report-CTHTPLDN.md](./workflow/workflow-test-report-CTHTPLDN.md)
  - **Bug:** [bug-report-flow-CTHTPLDN.md](./bug-reports/bug-report-flow-CTHTPLDN.md) — 1/4 đóng (FIND-004 ✅)

- 🚫 **P3.4** Workflow CT HTPLDN GĐ2 Đợt BC (7 bước — theo [02-thu-tu-module.md §⑭-bis](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L839-L849)) — block do A3 + P3.1 `[block: cascade A3 + P3.1]`
  - **Cần có sẵn:** P3.3 ⚠️ + 6 VV `Hoàn thành` (A3 ❌) + 6 Chi trả `Đã thanh toán` (P3.1 ❌)
  - **Output dự kiến:** Đợt BC tổng hợp ĐP/BN → TW.
  - **Report:** `workflow-test-report-CTHTPLDN.md` (Phase B)

- ⏳ **C3 gate**: 4 workflow report → user duyệt go P4 `[need: 4 workflow report + user duyệt]`

---

## P4 — Functional 16 module (Tuần 4)

> Bỏ happy path (đã cover P2-P3). Test case lỗi + nhánh phụ + edge + 40 TC phân quyền/module.

### Ngày 1
- ⚠️ **T4.1** Hỏi đáp (35 TC tested) `[~60% — 21/35 PASS, 4 PARTIAL, 1 FAIL, 3 BLOCKED, 4 DEFER, 2 SKIP]`
  - **Kết quả:** PASS 21/35 + 4 partial. 1 Critical mới + 3 BLOCKED cascade BUG-004. [functional-test-report-HOIDAP.md](./functional/functional-test-report-HOIDAP.md)
  - **Bug:** [bug-report-functional-HOIDAP.md](./bug-reports/bug-report-functional-HOIDAP.md) — 0/1 đóng (BUG-FUNC-001 MPH crash)
- ⚠️ **T4.2** CG/TVV (31 TC) `[~13% — 4/31 PASS, 27 defer]`
  - **Kết quả:** ⚠️ 4/31 PASS. 27 TC defer. [functional-test-report-CGTVV.md](./functional/functional-test-report-CGTVV.md)
- 🚫 **T4.3** Vụ việc (35 TC) — block do A3 thiếu nút thao tác (dev bug, không phải data gap) `[block: cascade A3 thiếu nút thao tác]`

### Ngày 2
- ⚠️ **T4.4** Doanh nghiệp (18 TC) `[~61% — 11/18 PASS, 1 FAIL, 3 BLOCKED, 1 PARTIAL, 2 DEFER]`
  - **Kết quả:** ⚠️ 11/18 PASS, 1 FAIL, 3 BLOCKED, 1 PARTIAL, 2 DEFER. [functional-test-report-DN.md](./functional/functional-test-report-DN.md)
  - **Bug:** [bug-report-functional-DN.md](./bug-reports/bug-report-functional-DN.md) — 0/4 đóng (1 Critical Import build, 1 Major auto-suggest, 2 Medium NHT leak + KPI sai)
- 🚫 **T4.5** TV chuyên sâu (44 TC) — block do A5 thiếu nút thao tác `[block: cascade A5 thiếu nút thao tác]`
- 🟢 **T4.6** Khóa học (40 TC) `[~30% — Bước 1-3 + reject path; Bước 4-10 chờ B7]`

### Ngày 3
- ⏳ **T4.7** Dashboard (34 TC) — chờ data ≥3 record/state cuối từ VV/TVCS/HD/Chi trả/TV nhanh `[need: ≥3 record/state cuối từ VV/TVCS/HD/Chi trả/TV nhanh]`
- ⚠️ **T4.8** Quản trị HT (32 TC) `[~13% — 4/32 PASS, 28 defer]`
  - **Kết quả:** ⚠️ 4/32 PASS. 28 TC defer. [functional-test-report-QTHT.md](./functional/functional-test-report-QTHT.md)
- 🚫 **T4.9** Đánh giá HQ (40 TC) — block do D2 `[block: cascade D2]`

### Ngày 4
- ⏳ **T4.10** Biểu mẫu (38 TC) — chờ seed thêm 2 BM `Công khai` `[need: seed thêm 2 BM Công khai]`
- ⏳ **T4.11** TV nhanh (39 TC) — chờ D3 + P3.2 `[need: D3 + P3.2 unblock]`
- 🚫 **T4.12** Chi trả (30 TC) — block do P3.1 `[block: cascade P3.1]`

### Ngày 5
- ⏳ **T4.13** Báo cáo (38 TC) — chờ data state cuối từ LỚP 2-4 `[need: data state cuối từ LỚP 2-4]`
- 🚫 **T4.14** HĐ tư vấn (29 TC) — block do E1 (submenu) `[block: cascade E1 submenu]`
- 🚫 **T4.15** CT HTPLDN (42 TC) — block do P3.4 `[block: cascade P3.4]`
- ⏳ **T4.16** API kết nối (42 TC) — chờ data upstream state cuối `[need: data upstream state cuối]`
- ⚠️ **T4.17** Edge BR-EC-01..23 `[~30% — 7/23 PASS, 16 BR defer]`
  - **Kết quả:** ⚠️ 7/23 PASS. 16 BR defer. [edge-test-report-BR-EC.md](./edge/edge-test-report-BR-EC.md)

- ⏳ **C4 gate**: 16 functional report + edge report → user duyệt go P5 `[need: 16 functional report + edge report + user duyệt]`

---

## P5 — TC chi tiết + UI + Regression + Tổng kết (Tuần 5)

- ⏳ **T5.1** TC chi tiết field-level × 6 module ưu tiên (≥30 TC/module: biên/equivalence/XSS) → `tc-{module}-chitiet.md` `[need: C4 gate PASS]`
- ⏳ **T5.2** Review UI 16 module (so sánh prototype) → 16 file `design-review-report-{module}.md` `[need: C4 gate PASS]`
- ⚠️ **T5.3** Regression bug round trước `[~33% — 6/18 closed, FAIL target 80%]`
  - **Kết quả:** ⚠️ 6/18 closed (33%). FAIL target 80%. [regression-round5-report.md](./regression-round5-report.md)
- ⏳ **T5.4** 6 luồng chéo module (DN↔VV / TVV↔VV / HD↔PD / HD→Kho QA auto / DN↔VV↔HSPL / VV↔Chi trả) → `cross-module-report.md` `[need: C4 gate PASS]`
- ⏳ **T5.5** Phi chức năng (page load <3s, auto-refresh dashboard 60s, XSS, CSRF, session timeout) → `nonfunc-report.md` `[need: C4 gate PASS]`
- ⏳ **T5.6** Tổng kết R5 (pass rate, bug theo severity, cascade-block, release recommendation) → `test-summary-round5.md` `[need: T5.1-5.5 PASS]`

- ⏳ **C5 gate**: user duyệt → kết thúc R5 → kick off [Round 5 Permission](../../../tasks/_archive/round5/plan.md) hoặc Round 6 / fix lại / dời `[need: T5.1-5.6 PASS + user duyệt]`

---

## Postmortem R5 — Deep review seed coverage cross-check system-overview §5.2 (28/4 22:55-23:10)

### A. Gap đã sửa trong session R5

| Chỗ | Acceptance gốc | Lỗi | Sửa R5 |
|---|---|---|---|
| **T1.B3** | "Seed TVV entry `Mới đăng ký` (12 variant)" | Gộp loai_tvv không split CG/TVV. Fixture line 39 ghi 1 variant CG nhưng note "BE default TVV" → 0 CG được tạo. | T1.B3 → ⚠️ + tách task **T1.B3b** seed riêng ≥6 CG. |
| **A5 acceptance** | "6 CG/TVV ACTIVE từ A1" | Gộp CG và TVV → CG=0+TVV=6 vẫn pass. SRS §⑧ line 533 strict "Chỉ CG". | Sửa thành "≥6 CG `loai_tvv=CG, DANG_HOAT_DONG` cover 6 lĩnh vực fixture". |
| **R4 seed cấp tốc** | Chỉ seed 1 CG `Test Chuyên Gia A4A5` (Doanh nghiệp) | Cover 1 lĩnh vực, không strict 6 lĩnh vực fixture cover 6 TVCS. | T1.B3b yêu cầu ≥6 CG cover 6 lĩnh vực. |

### B. Gap mới phát hiện qua deep review system-overview §5.2-5.3

Cross-check 14 dropdown source × acceptance todo/plan → tìm thêm **5 gap data nghiêm trọng**:

| # | Dropdown | Filter (system-overview §5.2) | Module dùng | Pool hiện có | Gap | Fix đề xuất |
|:-:|---|---|---|---|---|---|
| **1** | Phân công VV (A3) | `vai_tro IN (TVV,CG,NHT) AND linh_vuc khớp` | A3 VV | 5 TVV (5 lĩnh vực: SHTT/Thuế/đa-LV/Đất đai/Lao động) + 1 CG (Doanh nghiệp) + **0 NHT** | A3 dropdown thiếu NHT + thiếu TVV/CG cho lĩnh vực Hợp đồng/KDTM | **T1.B3c (mới)**: seed ≥3 NHT cấp ĐP `DANG_HOAT_DONG` (NĐ77/2008) + ≥1 TVV/CG cho mỗi 6 lĩnh vực fixture |
| **2** | Mẫu phản hồi (A4) | `MAU_PHAN_HOI filter theo lĩnh vực HD` | A4 HD soạn trả lời | **0 MAU_PHAN_HOI seed** trong todo | A4 trả lời sẽ rỗng dropdown mẫu | **T1.B1c (mới)**: seed ≥6 mẫu phản hồi cover 6 lĩnh vực HD |
| **3** | Lý do từ chối/bổ sung | `DANH_MUC LY_DO_TU_CHOI/BO_SUNG filter theo module HD/VV/TVCS` | A3/A4/A5 reject path | T1.B1 acceptance không split per module | Reject branches A3/A4/A5 có thể empty dropdown | **T1.B1 augmentation**: verify QTHT seed ≥2 lý do TU_CHOI + ≥2 lý do BO_SUNG cho mỗi module HD/VV/TVCS (≥12 record) |
| **4** | Học viên (B7) | Account "học viên" cho Khóa học đăng ký | B7 Workflow KH bước 6 Đăng ký | Plan/todo line 192 ghi "học viên" nhưng không clear vai trò + chưa seed pool học viên | B7 không advance bước Đăng ký được | **B7 augmentation**: BA confirm vai trò học viên (DN role hay TVV/NHT?) + seed ≥3 học viên fixture |
| **5** | Đánh giá viên (D2) | `TU_VAN_VIEN trang_thai=DANG_HOAT_DONG` | D2 ĐG HQ Phân công | Dùng được 6 TVV/CG từ T1.B3+B3b | OK pool đủ — không gap | (đã đủ, ghi nhận) |

### C. Lesson learned — phương án triệt để

**Vấn đề gốc:** Plan/todo gốc viết acceptance theo "số lượng" entity tổng, không theo "filter dropdown" của module tiêu thụ. Khi dropdown filter strict (vai_tro, loai, lĩnh vực) → seed không match → empty.

**Phương án triệt để (áp dụng từ R5+ và mọi round sau):**

1. **Seed task acceptance phải spec đầy đủ filter chiều xuống dropdown:**
   - `entity = X` (`bao nhiêu` không đủ)
   - `loai/vai_tro = Y` per dropdown filter
   - `trang_thai = Z` (state chính xác filter dropdown)
   - `lĩnh vực cover {set}` nếu dropdown strict lĩnh vực
   - Verify qua API call exact query string của module tiêu thụ.

2. **Pre-P2 task validation mới — T1.D Cross-check seed × dropdown filter:**
   - Mỗi module ở P2 → liệt kê dropdown sẽ click + filter source.
   - Đối chiếu pool hiện có với filter → log task seed bổ sung trước khi chạy workflow.
   - Output: `_seed-coverage-matrix.md` checklist 14 dropdown × filter × pool count.

3. **Áp dụng cho 3 task seed mới (T1.B3c, T1.B1c, B7 aug):** thêm vào todo.md ngay phía dưới T1.B3b + cập nhật A3/A4/B7 acceptance reference các task seed mới.

4. **Memory mới:** Save rule "Seed acceptance theo dropdown filter, không theo count" vào memory để không lặp lại.

### D. 3 task seed bổ sung cần làm trước P2 unblock đầy đủ

- ✅ **T1.B3c** Seed NHT (≥3 NHT cấp ĐP `DANG_HOAT_DONG`, NĐ77/2008) + 5 TVV/CG cover lĩnh vực còn thiếu (Hợp đồng/KDTM cho A3 VV) `[full 100%]`
- ✅ **T1.B1c** Seed Mẫu phản hồi `MAU_PHAN_HOI` (≥6 mẫu cover 6 lĩnh vực) + verify lý do TU_CHOI/BO_SUNG ≥2/module `[full 100%]`
- ⏳ **B7-clarify** BA confirm vai trò "học viên" Khóa học + seed ≥3 học viên — block B7 đến khi BA reply `[need: BA confirm vai trò học viên + seed ≥3 học viên]`

**Tổng cộng R5 phát sinh thêm:** 1 task đã thêm (T1.B3b) + 3 task chờ thêm (T1.B3c, T1.B1c, B7-clarify) = **4 task lấp gap seed**.

---

## Post-Round-5 backlog (làm sau C5 PASS — không block Round 5)

- ⏳ **POST-01 Mở rộng Tier 0 fixture** — fixture hiện thiếu (10 lĩnh vực + ≥6 loại DN + ≥7 đơn vị 3 cấp). `[need: BA confirm danh mục lĩnh vực + loại DN + đơn vị mới]`
  - **Chờ BA confirm:** danh mục lĩnh vực + loại DN + đơn vị mới.
  - **Tại sao hoãn post-R5:** đổi master data giữa round invalidate seed R4 đã PASS.
  - **Acceptance:** BA confirm → update fixture → re-seed Tier 0 → bump v2.6.

---

## Module bị block (cập nhật daily — Trụ E, verify lại đầu round)

| Module | Lý do nghi ngờ block | Số ngày block | Tác động |
|---|---|---|---|
| 🚫 HĐ Tư vấn (M14) | Submenu Tư vấn không có HĐ TV cho cb_nv_tw_01 (verify T1.A1 26/4) — pending check role QTHT | 3 | E1 + workflow + T4.14 |
| 🚫 Vụ việc (M5) | R9 1/5 12:50: STILL OPEN lần 5 — UI thêm 9 collapsible section + state machine progress bar nhưng vẫn 0 nút workflow + 7/9 endpoint 404. Dev cần build BE 7 endpoint REST + FE 10 nút action. | 5 | A3 + D1/D2 + P3.1 + P3.4 + ⚠️ T4.3 |
| ⚠️ TVCS (M10B) | R10 1/5 14:30: B4-12 BLOCKED data gap — TVV-0021 (Lý Thị Mười Ba) không có TAI_KHOAN linked → CG không click [Chấp nhận]. Cần T1.B3d seed 9 cặp account-profile (chờ dev reset password QTHT). | 0 (data) | D2 chờ TVCS Hoàn thành; T4.5 unblock CRUD |
| ⚠️ Hỏi đáp (M2) | R9 1/5 12:55: BUG-004 ✅ Closed — POST `/cong-khai` 200, HD-001 advance `Đã duyệt → Công khai`, `trangThaiDongBo: SUCCESS`. B7-B8 defer T4.1. | 0 | T4.1 + D3 unblock |
| ⚠️ CT HTPLDN GĐ1 (M11) | UI render `/ct-htpldn/danh-sach` OK, 0 record — cần seed test nút Tạo CT | partial | E2 + P3.3+P3.4 + T4.15 |
| ✅ TVV (M3) — luồng nhập tay | Pass 12/12 bước (100%) sau R4 #14 verified (2026-04-28). | 0 | UNBLOCK cascade |
| ⏳ TVV (M3) — luồng NHT công khai | Chưa test (task A1-PUBLIC defer theo plan). | 0 | Không block luồng nhập tay |
| ✅ Chi trả (M8) | UNBLOCK — `/chi-tra/danh-sach` 20 row BE-synced | 0 | — |
| ✅ Phiên TV nhanh (M10A) | UNBLOCK — `/tv-nhanh/danh-sach` 20 row BE-synced | 0 | — |

---

## Bug đã đóng (closed-verified)

| Bug ID | Severity | Module | Closed-verified | Note |
|--------|----------|--------|:---------------:|------|
| BUG-FLOW-TVV-001 | Critical | TVV (A1) | 2026-04-27 R2 | CB_PD nút Phê duyệt/Từ chối hiện đầy đủ + endpoint POST `/phe-duyet` 200 |
| BUG-FLOW-TVV-003 | Major | TVV (A1) | 2026-04-27 R2 | Modal Cập nhật trạng thái dropdown có 2 options hợp lệ cho ACTIVE state |
| BUG-FLOW-TVV-004 | Medium | TVV (A1) | 2026-04-27 R2 | List có thêm 2 tab "Yêu cầu bổ sung" + "Đang thẩm định" |
| BUG-FLOW-HOIDAP-001 | Critical | Hỏi đáp (A4) | 2026-04-28 R3 | Modal Phân công hết 403/422; alert + button disabled khi pool rỗng đúng SRS line 473 / FR-II-NEW-01 |
| BUG-FLOW-TVCS-001 | Critical | TVCS (A5) | 2026-04-28 R3 | UI Detail có `[Phân công]` + `[Hủy]`, list icon team shortcut, modal Phân công CG render đúng SRS line 510-533 |
| BUG-FLOW-TVCS-002 | Minor | TVCS (A5) | 2026-04-28 R3 | Cột "Ngày bắt đầu" giờ hiển thị `—` cho state TIEP_NHAN (đúng FR-X.1-01 §Outputs) |
| BUG-FLOW-TVCS-003 | Critical | TVCS (A5) | 2026-04-29 R8 | FE giờ truyền `trangThai=DANG_HOAT_DONG&loaiTvv=CG&linhVucIds=...` đúng SRS, dropdown render 2 CG |
| BUG-FLOW-HOIDAP-002 | Major | Hỏi đáp (A4) | 2026-04-29 R8 | FE hiện textarea + dialog WRN-PH-01, BE accept POST `/phan-hois` 201 từ CB NV cùng đơn vị, state advance Đang xử lý → Chờ phê duyệt |
| BUG-FLOW-HOIDAP-003 | Medium | Hỏi đáp (A4) | 2026-04-29 R8 | Modal Phân công HD-001 Hình sự hiện gợi ý cb_nv_tw_03 đúng FR-II-06 + BR-AUTH-08 |
| BUG-FLOW-HOIDAP-004 | Major | Hỏi đáp (A4) | 2026-05-01 R9 | BE config Cổng PLQG fixed, POST `/cong-khai` 200, HD-001 advance `Đã duyệt → Công khai`, `trangThaiDongBo: SUCCESS` |
| BUG-FLOW-TVCS-004 | Critical | TVCS (A5) | 2026-05-01 R9 | BE filter POST `/phan-cong` consistent với GET dropdown, TVCS-0001 advance `Tiếp nhận → Phân công` |

⚠️ **Pending BA confirm:** BUG-FLOW-TVV-002 (Major) — workflow R2 dùng 4-state (skip CHO_THAM_DINH) thay 5-state SRS. Cần BA decide: accept deviation hay strict 5-state.

---

## Quy ước bắt buộc

- Bug Open phải embed screenshot inline base64 (link relative broken khi gửi 1 file `.md`).
- Mọi bug phải có SRS reference (FR-xx / BR-yy / SCR-zz / Error code) — không có ref → ghi "Observations", không log bug.

---

## Next: sau C5 PASS

[Round 5 Permission Matrix](../../../tasks/_archive/round5/plan.md) — 11 vai trò × 16 module × CRUD ~1000 TC, timeline 1.5 tuần.
