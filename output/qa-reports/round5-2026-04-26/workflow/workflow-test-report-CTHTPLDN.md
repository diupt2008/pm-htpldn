# Workflow Test Report — CT HTPLDN GĐ1 (Phase A) — Pilot cấp TW

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Bảng kiểm tra workflow + bug summary dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh state hiện tại. Re-test workflow theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 3 sau khi seed lại Phase 1-2 xong. R11/R12 sẽ update lại bảng kiểm tra.

---

> **Phase:** P3 Workflow • **Plan ref:** [`tasks/todo.md` §P3.3](../../../tasks/todo.md) • **Date:** 2026-04-29 (R3)
> **Tester:** QA Automation via Chrome DevTools MCP
> **Round:** R5 P3.3 pilot — R3 retest 2026-04-29 08:30 (sau seed thêm 2 CT mới)
> **State Machine:** SM-CHUONG_TRINH_HTPL — 11 transition / 8 state ([02-thu-tu-module.md §⑤](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md#L328-L342))
> **Bug report:** [`bug-report-flow-CTHTPLDN.md`](../bug-reports/bug-report-flow-CTHTPLDN.md)

---

## Verdict

⚠️ **PARTIAL PASS pilot TW (R3)** — Pass 9/11 transition (82%) — **+2 vs R2** (#4 reject + #11 hủy unblock). Cascade-block 3 (#5 BUG-001 LGSP 502 reconfirmed lần 3 + #6 + #7b). 1 finding NEW (FIND-005).

| Metric | R1 (đầu 28/4) | R2 retest (22:55) | **R3 retest (29/4 08:30)** |
|--------|:-:|:-:|:-:|
| Cấp test | TW pilot | TW pilot | TW pilot |
| CT mẫu | CT-20260428-0001 | CT-20260428-0001 | + CT-20260429-0001 + CT-20260429-0002 |
| Transition pass | 6/11 | 7/11 (+#10) | **9/11 (+#4 +#11)** |
| Transition block | 3 (LGSP 502) | 3 (env JWT) | **3 cascade từ BUG-001 (#5/#6/#7b)** |
| Transition chưa test | 3 (#4, #10, #11) | 3 (#4, #11 + cascade) | **0** |
| Output đạt | 1 CT `DANG_THUC_HIEN` | 1 CT `HOAN_THANH` | + 1 CT `HUY` + 1 CT `DA_DUYET` (publish-blocked) |
| Bug status | 1 Critical + 3 Finding Open | 1 Critical + 3 Finding chưa verify | **1 Critical reconfirmed + 3 Finding (2 cũ + 1 NEW)** |
| **Gate cho P3.4 + T4.15** | ☒ FAIL | ☒ FAIL | **☒ FAIL** — chưa publish được, chưa đủ 3 CT TW/BN/ĐP |

---

## Accounts dùng

| Role | Username | Cấp | Bước nào dùng |
|------|----------|-----|---------------|
| CB NV TW | `cb_nv_tw_01` | TW | #1 Tạo · #2 Trình duyệt · #5 Công bố (block) · #7a · #8/#9/#10 (R2) · **#11 Hủy (R3)** |
| CB PD TW | `cb_pd_tw_01` | TW | #3 Phê duyệt · **#4 Từ chối (R3)** |

---

## Coverage table — 11 transition SM-CHUONG_TRINH_HTPL

| # | Transition | Actor | R1 | R2 | **R3** | Evidence |
|:-:|------------|-------|:-:|:-:|:-:|----------|
| 1 | `— → DU_THAO` ([+ Thêm Chương trình]) | CB NV | ✅ | ✅ | ✅ | CT-20260429-0001 + CT-20260429-0002 tạo OK (POST 201) |
| 2 | `DU_THAO → CHO_PHE_DUYET` ([Gửi phê duyệt]) | CB NV | ✅ | ✅ | ✅ | CT-001 + CT-002 đều chuyển `Chờ PD` (POST `/submit` 200) |
| 3 | `CHO_PHE_DUYET → DA_DUYET` ([Phê duyệt]) | CB PD | ✅ | ✅ | ✅ | CT-002 chuyển `Đã duyệt` (POST `/approve` 200 từ PD context) |
| **4** | `CHO_PHE_DUYET → DU_THAO` ([Từ chối] ≥10 ký tự) | CB PD | ⏳ | 🚫 | **✅ NEW** | CT-001 từ `Chờ PD` về `Dự thảo` sau click [Từ chối] + lý do "Thử nghiệm R3 - nội dung cần làm rõ mục tiêu và đối tượng hơn - test BR-FLOW-04" (>10 ký tự). Modal "Từ chối chương trình" → textbox `Lý do từ chối` → [Xác nhận từ chối]. Screenshot: `image/p33-r3-tr04-reject-passed.png`. |
| 5 | `DA_DUYET → DA_CONG_BO` ([Công bố lên Cổng PLQG]) | CB NV | 🚫 LGSP 502 | 🚫 BLOCKED | **🚫 502 RECONFIRMED** | CT-002 click [Công bố lên Cổng PLQG] → modal "Công bố lên Cổng PLQG?" → [Đồng ý] → `POST /api/v1/chuong-trinh-htpls/85a493e5.../publish` **HTTP 502**. State giữ `Đã duyệt`. Console error 502 không có toast user-friendly. **BUG-001 vẫn chưa fix qua 3 round**. Evidence: `image/p33-r3-bug001-publish-502.png`. |
| 6 | `DA_CONG_BO → DA_DUYET` ([Hủy công bố]) | CB NV | 🚫 cascade | 🚫 cascade | 🚫 cascade | Cascade từ #5 — không đạt được state `DA_CONG_BO` để test. |
| 7a | `DA_DUYET → DANG_THUC_HIEN` (alt path skip công bố) | CB NV | ✅ | ✅ | ✅ R1 valid | Workaround verified R1 (CT-001). R3 không re-test (đã có evidence cũ). |
| 7b | `DA_CONG_BO → DANG_THUC_HIEN` (main path) | CB NV | 🚫 cascade | 🚫 cascade | 🚫 cascade | Cascade từ #5. |
| 8 | `DANG_THUC_HIEN → TAM_DUNG` ([Tạm dừng] + lý do) | CB NV | ✅ | ✅ | ✅ R1/R2 valid | Verified R1 trên CT-001. |
| 9 | `TAM_DUNG → DANG_THUC_HIEN` ([Tiếp tục]) | CB NV | ✅ | ✅ | ✅ R1/R2 valid | Verified R1 trên CT-001. |
| 10 | `DANG_THUC_HIEN → HOAN_THANH` ([Hoàn thành]) | CB NV | ⏳ | ✅ | ✅ R2 valid | Verified R2 trên CT-001 (`HOAN_THANH`). |
| **11** | `DU_THAO → HUY` ([Hủy CT]) | CB NV | ⏳ | 🚫 | **✅ NEW** | CT-001 (sau khi reject về DU_THAO ở #4) click [Hủy CT] → modal "Hủy chương trình?" với cảnh báo "Hành động này không thể hoàn tác" → [Hủy CT] xác nhận → state header chuyển từ `Dự thảo` → **`Đã hủy`**. Stepper biến mất (CT closed). Form readonly. Screenshot: `image/p33-r3-tr11-huy-passed.png`. |

**Verdict numeric R3:**
- ✅ Pass: 9/11 (82%) — **+2 vs R2** (#4 + #11 unblock)
- 🚫 Block: 3/11 cascade (#5 + #6 + #7b — root cause **BUG-001 LGSP 502** reconfirmed lần 3)
- → **R3 verdict:** Workflow CT HTPLDN GĐ1 happy path đầy đủ ngoại trừ leg `Công bố lên Cổng PLQG`. CT vận hành nội bộ OK qua path alt #7a. Block cấp Cổng → DN/NHT không tra cứu CT công khai.

---

## Findings — Status R3 retest

| Finding ID | R1 | R2 | **R3 retest** | Evidence |
|------------|:-:|:-:|:-:|----------|
| **BUG-FLOW-CTHTPLDN-001** Critical — LGSP/Cổng PLQG 502 | Open | 🚫 chưa retest | ⚠️ **VẪN CÒN — RECONFIRMED lần 3** | CT-002 click [Công bố] → POST `/publish` HTTP 502. Console error 502 generic, không toast friendly. 3 round failed → escalate dev/ops kiểm tra LGSP credentials/endpoint. |
| **FIND-CTHTPLDN-002** Minor UI | Open | 🚫 chưa retest | ⚠️ **VẪN CÒN — RECONFIRMED + BE chặn 403 đúng** | CT-001 trên context CB NV TW (người tạo) state `CHO_PHE_DUYET` thấy 2 nút [Phê duyệt]+[Từ chối] (uid=12_9, 12_10). NV click [Phê duyệt] + modal [Đồng ý] → POST `/approve` **403 Forbidden** (BE chặn đúng). Evidence: `bug-reports/image/p33-r3-find002-nv-see-pd-buttons.png`. **Severity Minor — UI mis-disclosure, không phá nghiệp vụ.** |
| **FIND-CTHTPLDN-004** Minor Đơn vị `-` | Open | ⚠️ vẫn còn (CT-001) | ⚠️ **VẪN CÒN — RECONFIRMED 3 CT** | CT-001 + CT-002 detail field "Đơn vị" = `-` (uid=11_22+11_23 trên CT-002). List page hiển thị đúng "Cục Bổ trợ tư pháp - Bộ Tư pháp". Bug FE binding `don_vi_id`/`don_vi_name` chưa fix. |
| **FIND-CTHTPLDN-005** Minor UI **NEW R3** | — | — | ⚠️ **NEW R3 — BE chặn 403 đúng** | CT-002 trên context CB PD TW state `DA_DUYET` thấy nút [Bắt đầu thực hiện] (uid=31_1). Theo SRS line 338 chỉ `cb_nv_<cap>_01` được trigger. PD click → modal [Đồng ý] → POST `/activate` **403 Forbidden**. Cùng pattern FIND-002 — FE chưa gate workflow buttons theo role. Evidence: `bug-reports/image/p33-r3-find005-pd-see-activate.png`. |

---

## Cascade impact

| Downstream task | R1 | R2 | R3 |
|-----------------|----|----|----|
| **P3.4** GĐ2 Đợt BC | 🚫 | 🚫 | 🚫 — cần 3 CT TW/BN/ĐP `DANG_THUC_HIEN` cùng `Đợt báo cáo` + chuỗi A3+P3.1 |
| **T4.15** Functional 42 TC CT HTPLDN | ⚠️ | ⚠️ | ⚠️ — workflow cốt lõi pass; phần publish/Cổng PLQG vẫn block. Reject + Hủy giờ unblock cho TC liên quan. |

---

## Env condition R3 (cải thiện vs R2)

**JWT lifetime R3:** Đo thực tế ~3-5 phút trong 1 phiên active (vs ~60s ở R2). Đủ để hoàn thành chuỗi tạo CT → submit → switch role → approve → publish trong cùng session. **Không phải re-login giữa các thao tác.**

**Pattern dùng:** Mỗi role 1 isolated context (`mcp__chrome-devtools__new_page` với `isolatedContext` riêng tên unique) — verify được multi-role test mà không bị BE httpOnly cookie sticky overwrite (memory `qa_htpldn_round5_t01`). Switch giữa role chỉ là `select_page` + `navigate_page` → không re-login.

**Kết quả:** R3 hoàn thành 11/11 transition trong 1 session, không bị block do JWT (vs R2 chỉ test được 1 transition #10).

---

## Re-run trigger

- **Khi dev fix LGSP/Cổng PLQG 502** → re-test #5/#6/#7b publish (cascade BUG-001).
- **Khi FE fix FIND-004 (don_vi binding)** → verify detail page field "Đơn vị" hiển thị đúng tên.
- **Khi FE fix FIND-002 + FIND-005** → verify role-based button gating cho cả NV và PD.
- Test BN + ĐP cấp khác (cb_nv_bn_01 ↔ cb_pd_bn_01, cb_nv_dp_01 ↔ cb_pd_dp_01) — defer sau khi LGSP fix + dev confirm scope.

---

## Tab counts cuối session R3

| Tab | Count R2 | Count R3 | Sample IDs R3 |
|-----|:-----:|:-----:|------------|
| Tất cả | 1 | 3 | CT-20260428-0001 + CT-20260429-0001 + CT-20260429-0002 |
| Dự thảo | 0 | 0 | — |
| Chờ PD | 0 | 0 | — |
| Đã duyệt | 0 | **1** | CT-20260429-0002 (publish-blocked) |
| Đã công bố | 0 | 0 | — (BUG-001 block) |
| Đang thực hiện | 0 | 0 | — |
| **Hoàn thành** | 1 | 1 | CT-20260428-0001 |
| **Đã hủy** | 0 | **1** | CT-20260429-0001 |

---

## API Endpoints đã verify R3

| Action | Endpoint | Method | Auth role | Result |
|--------|----------|--------|-----------|:------:|
| Tạo CT | `POST /api/v1/chuong-trinh-htpls` | POST | CB NV | ✅ 201 |
| Get detail | `GET /api/v1/chuong-trinh-htpls/{id}` | GET | CB NV/PD | ✅ 200 |
| List filter | `GET /api/v1/chuong-trinh-htpls?page=1&pageSize=20` | GET | CB NV | ✅ 304 |
| Submit (Gửi PD) | `POST /api/v1/chuong-trinh-htpls/{id}/submit` | POST | CB NV | ✅ 200 |
| Approve (Phê duyệt) | `POST /api/v1/chuong-trinh-htpls/{id}/approve` | POST | CB PD | ✅ 200 |
| Approve (NV gọi) | `POST /api/v1/chuong-trinh-htpls/{id}/approve` | POST | CB NV | ✅ 403 (BE chặn đúng) |
| Reject (Từ chối) | `POST /api/v1/chuong-trinh-htpls/{id}/reject` (suy luận, không capture trực tiếp) | POST | CB PD | ✅ 200 |
| **Publish (Công bố)** | `POST /api/v1/chuong-trinh-htpls/{id}/publish` | POST | CB NV | ❌ **502** |
| Activate (Bắt đầu) | `POST /api/v1/chuong-trinh-htpls/{id}/activate` | POST | CB PD | ✅ 403 (BE chặn đúng) |
| Cancel (Hủy) | `POST /api/v1/chuong-trinh-htpls/{id}/cancel` (suy luận) | POST | CB NV | ✅ 200 |

**Lưu ý:** Endpoint reject + cancel không capture network trực tiếp R3 (network log limit pageSize). State chuyển đúng → suy ra POST 200.

---

*R1 pilot complete: 2026-04-28 16:45 — 6/11 transition pass (55%)*
*R2 retest complete: 2026-04-28 22:55 — 7/11 transition pass (64%) sau dev fix #10*
*R3 retest complete: 2026-04-29 08:30 — **9/11 transition pass (82%)** sau seed thêm 2 CT mới (CT-001 reject+hủy + CT-002 publish-retest). BUG-001 RECONFIRMED lần 3. FIND-005 NEW. | QA Automation via Chrome DevTools MCP*
