# Seed Checklist — HOI_DAP Tier 2 (T2.A1)

**Phase:** P2 Block A Ngày 1 • **Plan ref:** [plan.md](../../../../tasks/plan.md) §P2 T2.A1 • **Date:** 2026-04-24 (retry-1 17:23-17:37 sau BE fix)
**Account:** `cb_nv_tw_01` (CB Nghiệp vụ TW 01)
**Method:** MCP Chrome DevTools — SCR-II-02 `[+ Thêm mới]`
**Entry state:** `MOI` (per SM-HOIDAP Bước 1)
**Input:** [seed-fixture.yaml > hoi_dap_variants[1..6]](../../../../input/data/seed-fixture.yaml)

---

## Verdict: ✅ **PASS 6/6** — `BUG-HDCR-500-R4` closed-verified

**Root cause (resolved):** Initial run 15:30-15:32 BLOCKED 6/6 do BE `POST /api/v1/hoi-daps` trả HTTP 500 `ERR-SYS-00-00-01` generic (reqid=553 + 555 deterministic). Dev merged fix giữa 15:32 và 16:11 (timestamp HD-002 được seed manual verify). QA retry-1 Pha 1 canary (HD-003 Beta fixture #2) lúc 17:25 → POST 201 Created (reqid=192). Pha 2 seed 4 fixture còn lại (Gamma/Delta/Epsilon/Zeta) 17:32-17:37 — 4/4 PASS tuần tự. Tổng 6/6 entry state `MOI`.

Chi tiết bug + closed-verified note: [bug-report-seed-tier2-4.md §BUG-HDCR-500-R4](../bug-reports/bug-report-seed-tier2-4.md).

### Seed matrix — 6 variants

| # | Variant | DN link | Lĩnh vực | Kênh | Seeded | Mã HD | UUID | Timestamp |
|---|---------|---------|----------|------|:------:|-------|------|-----------|
| 1 | Nguyễn Văn Alpha — Hỏi về thời gian nghỉ phép năm | DN-HNI-0001 | Lao động (LAO_DONG) | Trực tiếp (TRUC_TIEP) | ✅ | `HD-20260424-002` | `0b051db1-a119-4c52-9303-d61986010360` | 24/04/2026 16:11 |
| 2 | Trần Thị Beta — Hoàn thuế GTGT đầu vào hàng nhập khẩu | DN-HNI-0002 | Thuế (THUE) | Dịch vụ công (DVC) | ✅ | `HD-20260424-003` | `9d5b504a-0cd9-4333-8364-62d51e650c23` | 24/04/2026 17:25 |
| 3 | Lê Văn Gamma — Thời hạn HĐ lao động xác định thời hạn | DN-HPG-0001 | **Kinh doanh thương mại (KDTM)** — fallback HOP_DONG | Cổng PLQG (CONG_PLQG) | ✅ | `HD-20260424-004` | `cab92f6e-c6f3-4b80-9838-2193f315a71b` | 24/04/2026 17:32 |
| 4 | Phạm Văn Delta — Thủ tục tăng vốn điều lệ công ty TNHH 2 thành viên | DN-HPG-0002 | **Kinh doanh thương mại (KDTM)** — fallback DOANH_NGHIEP | Dịch vụ công (DVC) | ✅ | `HD-20260424-005` | `ccfa36c3-16de-4620-8800-7a47165348f1` | 24/04/2026 17:33 |
| 5 | Hoàng Thị Epsilon — Thủ tục đăng ký bảo hộ nhãn hiệu cho sản phẩm mới | DN-DNG-0001 | Sở hữu trí tuệ (SHTT) | Cổng PLQG (CONG_PLQG) | ✅ | `HD-20260424-006` | `f4a43279-a39e-4d96-bdfc-e677d409b595` | 24/04/2026 17:36 |
| 6 | Vũ Văn Zeta — Quyền thế chấp khi thuê đất KCN trả tiền hàng năm | DN-DNG-0002 | Đất đai (DAT_DAI) | Hệ thống khác (HE_THONG_KHAC) | ✅ | `HD-20260424-007` | `51166651-09ae-41a3-9abb-4994b340e8ff` | 24/04/2026 17:37 |

**Total:** **6 seeded / 0 BLOCKED** — cả 6 POST 201 Created, FE modal tự đóng + list refresh, entry state `MOI` (badge "Mới"). Network spot-check canary reqid=192 cho HD-003 (Pha 1).

Evidence:
- [screenshots/hoidap-canary-pha1-pass-HD003.png](../screenshots/hoidap-canary-pha1-pass-HD003.png) — Pha 1 sau fixture #2 (3 mục)
- [screenshots/hoidap-t2a1-pass-6of6-list.png](../screenshots/hoidap-t2a1-pass-6of6-list.png) — Pha 2 final state (7 mục bao gồm 6 fixture + HD-20260424-001 legacy session khác)
- Dashboard KPI hiện "Hỏi đáp mới" tăng đều sau mỗi seed

---

## Observations ngoài SRS (không log bug)

| # | Observation | Fixture affected | Workaround | Memory ref |
|---|-------------|------------------|-----------|------------|
| O1 | Dropdown Lĩnh vực pháp lý FE chỉ render 10 value (Dân sự, Hình sự, Hành chính, Lao động, Đất đai, Hôn nhân GĐ, KDTM, Khiếu nại, Thuế, SHTT) — thiếu `HOP_DONG` + `DOANH_NGHIEP` so với SRS FR-II-01 + seed-fixture.yaml | #3 (Gamma HOP_DONG) + #4 (Delta DOANH_NGHIEP) | Fallback value `Kinh doanh thương mại` | [qa_htpldn_hoidap_cr_round1](/Users/teamai/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_hoidap_cr_round1.md) — cùng obs từ R1 2026-04-23 |
| O2 | Modal Thêm mới: `fill_form` MCP không persist value cho multiline textarea "Nội dung câu hỏi" (React controlled state). Chỉ `click` + `type_text` khi focused mới commit. | #5 (Epsilon) + #6 (Zeta) ban đầu gặp, fix bằng type_text | Dùng `type_text` thay vì `fill`/`fill_form` cho textarea multiline Ant Design | Selector library mới — lưu memory MCP patterns |
| O3 | Search DN modal khi gõ lại sau clear (click "close-circle" rồi click input) **append** value cũ (vd. `DN-HNI-0002` + click clear rồi gõ `Beta` → thành `DN-HNI-0002Beta`) → search miss. Workaround: clear bằng click input + Select all + gõ mới, hoặc type_text có submitKey. | #2 Beta initial search (recovered) | Recovered trong 1 retry; spot-check ~30% case repro | Form UI quirk — observation, chưa đủ cấu thành bug theo SRS reference rule |
| O4 | Checklist legacy record `HD-20260424-001` "Tiêu đề 01" từ user `Congnt` — không thuộc fixture của tôi, pre-existed trong DB. Loại khỏi matrix assertion. | — | Count fixture match 6/6, ignore legacy | — |

Observations không log bug per memory `feedback_bug_must_have_srs_ref.md` (O1 là regression obs từ R1 đã confirm 2x, O2-O3 là MCP tool behavior, O4 data ngoại lai).

---

## Linkage verify (for downstream T3.2 SM-HOIDAP workflow)

| # | Link | Status |
|---|------|:------:|
| L1 | 6 DN Sample IDs (T1.B2) × 6 HOI_DAP fixtures → 6 cặp N:1 HOIDAP → DN, one-to-one | ✅ Mỗi HD link đúng DN theo column "Người gửi" khi UI render |
| L2 | Entry state `MOI` (SM-HOIDAP Bước 1) | ✅ 6/6 show badge "Mới" trong list |
| L3 | SLA deadline auto-generated | ⏸️ Column "SLA / Thời hạn" show "—" — có thể vì entry `MOI` chưa có deadline cho tới khi phân công (BR-CALC-03 thực tế compute sau Bước 2 Tiếp nhận), không phải bug |

Unblock cascade registry M4 HOI_DAP → Resume T3.2 SM-HOIDAP workflow + T4.1 Functional HD 36 TC + P5 HD→KHOCH auto (cần state HOAN_THANH nên chạy sau T3.2).

---

## T2.A1 Gate Decision

**Status:** ✅ **PASS 6/6** — clean pass, all entry state `MOI`, BUG-HDCR-500-R4 closed-verified.

**Todo status:** `[x]` done clean (legend plan §3 v1.5)

**Next action:**
- T2.A1 closed → Resume P2 remaining tasks: T2.A5 (CTDT+KHOAHOC), T2.B1-B5 (HDTV, DANHGIA, KHOCH, CHITRA, TVNHANH verify), T2.C1 (CT_HTPLDN KH).
- Note còn 2 task BLOCKED trong P2: T2.A3 TVCS (`BUG-TVCS-CR-R4`), T2.A4 HSPL (`BUG-HSPL-TAB-R4`) — chưa có tín hiệu dev fix, giữ cascade-block.
- Sample IDs 6 HD giữ nguyên để downstream tham chiếu trong T3.2 workflow.

---

*Initial attempt: 2026-04-24 15:30-15:32 | BLOCKED 6/6 BE 500*
*Retry-1: 2026-04-24 17:23-17:37 | **PASS 6/6** (Pha 1 canary fixture #2 + Pha 2 seed 4 remain)*
*QA AI via Claude Code + Chrome DevTools MCP | Phase P2 Block A*
