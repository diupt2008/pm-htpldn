# Seed Checklist — NGAN_HANG_CAU_HOI Tier 2 (T2.A5d phần 1)

**Phase:** P2 Block A Ngày 5 • **Plan ref:** [todo.md](../../../../tasks/todo.md) §P2 T2.A5d • **Date:** 2026-04-25 16:57-17:07
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — SCR-III-04 tab "Câu hỏi" `[+ Thêm mới]`
**Entry state:** `NHAP` (default trong form, đúng SRS FR-III-09 Inputs row 7)
**Input:** [seed-fixture.yaml > ngan_hang_ch_variants[1..7]](../../../../input/data/seed-fixture.yaml#L1044)
**SRS ref:** `FR-III-09 §Inputs` + `Entity NGAN_HANG_CAU_HOI 3.4.3.21`

---

## Verdict: ✅ **PASS 7/7** — clean pass, default state `Nháp`

7 fixture POST 201 Created, FE modal tự đóng + list refresh, badge "Nháp" (`NHAP`). Loại câu hỏi map: TRAC_NGHIEM (fixture) → TRAC_NGHIEM_MOT (UI form, đúng SRS), TU_LUAN giữ nguyên. Mức độ map: TB (fixture) → TRUNG_BINH/"Trung bình" (UI/SRS).

### Seed matrix — 7 variants

| # | Lĩnh vực fixture | Mức độ | Loại | Đáp án đúng | Seeded UI | Timestamp |
|---|------------------|--------|------|-------------|:---------:|-----------|
| 1 | LAO_DONG → Lao động | DE → Dễ | TRAC_NGHIEM_MOT | "30 ngày" (B) | ✅ | 25/04 16:57 |
| 2 | DOANH_NGHIEP → **fallback Kinh doanh thương mại** | TB → Trung bình | TRAC_NGHIEM_MOT | "Không bắt buộc" (B) | ✅ | 25/04 17:01 |
| 3 | THUE → Thuế | KHO → Khó | TRAC_NGHIEM_MOT | "10% trong 15 năm" (B) | ✅ | 25/04 17:02 |
| 4 | SHTT → Sở hữu trí tuệ | KHO → Khó | TU_LUAN | (no options — TU_LUAN) | ✅ | 25/04 17:03 |
| 5 | HOP_DONG → **fallback Kinh doanh thương mại** | DE → Dễ | TRAC_NGHIEM_MOT | "Có giá trị ngay khi ký" (A) | ✅ | 25/04 17:05 |
| 6 | DAT_DAI → Đất đai | TB → Trung bình | TU_LUAN | (no options — TU_LUAN) | ✅ | 25/04 17:06 |
| 7 | DAT_DAI → Đất đai | DE → Dễ | TRAC_NGHIEM_MOT | "50 năm" (B) | ✅ | 25/04 17:07 |

**Total:** **7 seeded / 0 BLOCKED** — list hiện 7/7 mục, dạng "1-7 / 7 mục", entry state `Nháp` cho cả 7. UUID không bắt được do MCP `fetch` API bị BE revoke JWT giữa session (xem Obs O3).

Evidence:
- [screenshots/nhch-t2a5d-empty-init.png](../screenshots/nhch-t2a5d-empty-init.png) — list rỗng đầu phiên (`Không có câu hỏi nào phù hợp`)
- [screenshots/nhch-t2a5d-pass-7of7-list.png](../screenshots/nhch-t2a5d-pass-7of7-list.png) — list final 7 mục với Lĩnh vực + Mức độ + Loại + Trạng thái Nháp

---

## Observations ngoài SRS (không log bug)

| # | Observation | Fixture affected | Workaround | Memory ref |
|---|-------------|------------------|------------|------------|
| O1 | Dropdown **Lĩnh vực pháp lý** chỉ render 10 value (Dân sự, Hình sự, Hành chính, Lao động, Đất đai, Hôn nhân gia đình, Kinh doanh thương mại, Khiếu nại tố cáo, Thuế, SHTT) — **thiếu `DOANH_NGHIEP` + `HOP_DONG`** so với fixture. Cùng obs đã ghi từ R1 NHCH 2026-04-23 + R4 HOI_DAP 2026-04-24. SRS FR-III-09 chỉ định `linh_vuc_id Y FK → DANH_MUC` — không liệt kê enum. Không đủ căn cứ log bug per `feedback_bug_must_have_srs_ref`. | #2 (DOANH_NGHIEP) + #5 (HOP_DONG) | Fallback "Kinh doanh thương mại" — đồng obs với R1 + HOI_DAP R4 | [qa_htpldn_nhch_cr_round1](/Users/teamai/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_nhch_cr_round1.md), [qa_htpldn_hoidap_seed_round4_retry1](/Users/teamai/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_hoidap_seed_round4_retry1.md) |
| O2 | Form expand động: chọn `Loại câu hỏi = Trắc nghiệm 1 đáp án` → render thêm "Các lựa chọn" (default 2 ô A,B với required) + "Đáp án đúng" radio. Chọn `Tự luận` → KHÔNG render. SRS FR-III-09 row 5 nói `cac_lua_chon Cond` đúng spec. Đây là behavior đúng. Ghi obs để dev/QA sau biết. | All TRAC_NGHIEM | — | — |
| O3 | **Session BE revoke JWT aggressive** (~2 phút thực bất chấp `exp` 15 phút claim) — đã bị kick về `/login` 2 lần khi seed (sau #1 và sau #2). Pattern cùng obs với T1.B4 BIEU_MAU R4 (memory `qa_htpldn_jwt_revoke_aggressive`). Không xảy ra với T2.A1-A4 cùng round → suspect env-config drift. Ngoài SRS scope. | Workflow seed bị gián đoạn → re-login retry 2 lần, UI flow vẫn complete | Tăng `useNavigate` qua sidebar click (không `navigate_page` toàn URL) để giữ session lâu hơn | [qa_htpldn_jwt_revoke_aggressive](/Users/teamai/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_jwt_revoke_aggressive.md) |
| O4 | MCP `fetch('/api/v1/ngan-hang-cau-hois')` trả 401 (HttpOnly cookie không persist sau navigate URL trực tiếp) → không bắt được UUID record qua API probe. Workaround: dùng UI list verify count + timestamp + content match. Không cản trở seed (entry state đã verify qua badge "Nháp" trong list). | All 7 fixture | UI list snapshot làm evidence thay UUID | — |
| O5 | Loại câu hỏi map: SRS có 3 enum `TRAC_NGHIEM_MOT/TRAC_NGHIEM_NHIEU/TU_LUAN` (FR-III-09 row 4). Fixture viết `TRAC_NGHIEM` đơn giản → fixture cần update để chỉ rõ MOT/NHIEU. Tôi đã chọn `TRAC_NGHIEM_MOT` cho cả 5 fixture trắc nghiệm vì `dap_an_dung` là single value. SRS không vi phạm — fixture chưa đủ chi tiết. | All TRAC_NGHIEM | Suy luận đáp án đơn → MOT | Đề xuất cập nhật seed-fixture.yaml v2.5+ tách `TRAC_NGHIEM_MOT/NHIEU` |

Observations không log bug per memory `feedback_bug_must_have_srs_ref.md` (O1 là regression cross-round, O2 + O5 là behavior đúng spec, O3-O4 là env / tool quirk).

---

## Linkage verify (for downstream T2.A5d phần 2 ĐKT)

| # | Link | Status |
|---|------|:------:|
| L1 | NHCH #6+#7 cùng `DAT_DAI` để cung cấp đủ câu cho ĐKT #3 "Luật đất đai 2024" (per fixture comment line 1043) | ✅ 2 record DAT_DAI seeded — `Phân tích các điều kiện DN giao đất...` (TU_LUAN) + `Theo Luật Đất đai 2024, thời hạn giao đất tối đa...` (TRAC_NGHIEM_MOT) |
| L2 | NHCH #3 (THUE KHO) + #5 (KDTM/HOP_DONG fallback DE) reserve cho ĐKT #2 "Luật thuế GTGT" (THU_CONG, cau_hoi_ids [3,5]) | ✅ Cả 2 seeded đủ làm câu hỏi THU_CONG cho ĐKT #2 khi T2.A5b unblock |
| L3 | NHCH 7 record với 3 mức độ (DE×3, TB×2, KHO×2) — đáp ứng random_config DE:1/TB:1/KHO:1 cho ĐKT #1 NGAU_NHIEN | ✅ Đủ pool cho random — match `random_config` ĐKT #1 |

**Cascade unblock:** ĐKT seed (T2.A5d phần 2) chỉ chờ KHOA_HOC ≥1 ở state hợp lệ — see `seed-checklist-DEKT.md` BLOCKED note.

---

## T2.A5d phần 1 (NHCH) Gate Decision

**Status:** ✅ **PASS 7/7** — clean pass, all entry state `Nháp`/`NHAP`, 0 SRS-ref bug, 5 obs không log.

**Todo status:** `[x]` done clean — phần 1 NHCH complete (legend plan §3 v1.5)

**Next action:**
- T2.A5d phần 1 closed → record IDs giữ nguyên cho downstream:
  - T3.5 Workflow Khóa học (NHCH gắn vào ĐKT trong khóa học)
  - T4.6 Functional Khóa học 40 TC (test NHCH CRUD + filter)
  - T2.A5d phần 2 ĐKT — pending T2.A5b KHOA_HOC unblock
- Note: 2 task BLOCKED upstream T2.A5a CTĐT + T2.A5b KHOA_HOC chưa run → CTĐT seed chạy trước (4 record DU_THAO), sau đó cần dev/CB_PD approve để KHOA_HOC seed có thể chọn được CTĐT (per memory `qa_htpldn_khoahoc_cr_round2`).

---

*Initial run: 2026-04-25 16:57-17:07 | **PASS 7/7** (re-login 2x do BE JWT revoke obs O3)*
*QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block A T2.A5d phần 1*
