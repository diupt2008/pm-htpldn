# Kế hoạch kiểm thử — SRS Update 2026-05-04 (FR-02 / FR-03 / FR-04)

> **File này:** Test strategy + plan riêng cho 3 file SRS update batch ngày 2026-05-04.
> Bổ trợ cho [`tasks/plan.md`](../../plan.md) v2.5.1 (R6 active) — KHÔNG ghi đè R6 đang chạy. R6 ưu tiên hoàn tất Phase 4-7 cũ trước, sau đó merge SRS update vào round mới (R7).
>
> **Source delta:** [`input/srs-update-2026-5-4/`](../../../input/srs-update-2026-5-4/)
> - `srs-fr-02-hoi-dap.md` (1745 dòng, +23% vs srs-v3 cũ)
> - `srs-fr-03-dao-tao.md` (2954 dòng, +133% vs srs-v3 cũ)
> - `srs-fr-04-chuyen-gia-tvv.md` (2528 dòng, +94% vs srs-v3 cũ)
>
> **Ngày lập:** 2026-05-04 · **Phiên bản:** v1.0 draft · **Author:** QA Agent

---

## Mục lục

| § | Nội dung |
|---|----------|
| §1 | [Mục tiêu + Scope](#1-mục-tiêu--scope) |
| §2 | [SRS Diff — Delta cụ thể](#2-srs-diff--delta-cụ-thể) |
| §3 | [Test Strategy 7 lớp](#3-test-strategy-7-lớp) |
| §4 | [Tool & Skill matrix](#4-tool--skill-matrix) |
| §5 | [Dependency graph + Vertical slices](#5-dependency-graph--vertical-slices) |
| §6 | [Acceptance + Verification per layer](#6-acceptance--verification-per-layer) |
| §7 | [Risk + Mitigation](#7-risk--mitigation) |
| §8 | [Timeline + Checkpoints](#8-timeline--checkpoints) |
| §9 | [Giả định cần BA xác nhận](#9-giả-định-cần-ba-xác-nhận) |

---

## 1. Mục tiêu + Scope

### 1.1 Mục tiêu chất lượng

| # | Tiêu chí | Ngưỡng |
|---|----------|--------|
| G1 | UC mới (3 + 6 + 6 = 15 UC) PASS happy path | 100% |
| G2 | State machine mới/refactor (SM-CTDT + SM-KHOAHOC v2 + SM-KH-DAO-TAO + SM-TCTV + SM-TVV refactor) — PASS toàn bộ transition | 100% |
| G3 | Action-level Permission Codes nhóm III (~60 mã trong §7) — verify ít nhất 1 ALLOW + 1 DENY/code | ≥90% |
| G4 | NFR mới: optimistic locking PHAN_HOI / batch / KE_HOACH; auto-save draft AES-256-GCM; XSS sanitize MAU_PHAN_HOI; aria-label WCAG 4.1.2 | PASS sample ≥1 TC/NFR |
| G5 | Bug Critical/Blocker còn mở | 0 |
| G6 | Cross-module integration: HD escalate Nhóm II / TCTV ↔ TVV / KE_HOACH ↔ CTDT ↔ KHOA_HOC ↔ LICH_HOC ↔ HOC_VIEN | Sample ≥1 luồng/cross PASS |
| G7 | Audit log mọi CUD (kể cả TU_CHOI → CHO_DUYET refinement) | Đầy đủ |
| G8 | UI strings tiếng Việt thuần (BA review v3 — bỏ jargon "SLA/deadline/dropdown/in-app") | Sample 5 màn hình PASS |

**Không đạt G1/G2/G5 → FAIL.** G3/G4/G6/G7/G8 partial → PASS có ghi chú.

### 1.2 In scope

- 3 file SRS update batch 2026-05-04 (FR-02 / FR-03 / FR-04)
- 15 UC mới + 5 SM mới/refactor + ~60 permission code §7 + ~28 finding screen review (F-01..F-23 FR-02 + 7 fix FR-03 + 14 fix FR-04)
- 2 entity hoàn toàn mới: TO_CHUC_TU_VAN, NGUOI_HO_TRO
- 3 entity refactor (SRS cũ đã có, SRS mới định nghĩa rõ hơn): KE_HOACH_DAO_TAO, LICH_HOC, HOC_VIEN
- 4 NFR mới: optimistic locking / auto-save AES-256-GCM / XSS / WCAG aria-label
- Cross-module: HD escalate Nhóm II, TCTV ↔ TVV, KHDT 3 cấp Mô hình A

### 1.3 Out of scope

- Module ngoài 3 file SRS update (Dashboard, QTHT, VV, Chi trả, DN, ĐG hiệu quả, Biểu mẫu, TV chuyên sâu, TV nhanh, Báo cáo, Hợp đồng, CT HTPLDN, API) — giữ R6 cũ
- Penetration testing chuyên sâu (chỉ XSS/locking sample)
- Load/Stress test (1000 user concurrent)
- Mobile/Tablet (desktop-only product)

---

## 2. SRS Diff — Delta cụ thể

### 2.1 FR-02 Hỏi đáp (Nhóm II) — +23%

**3 UC mới:**

| UC mới | Tên | Màn hình | Tác nhân |
|--------|-----|----------|----------|
| FR-II-NEW-01 | Cấu hình lĩnh vực ↔ phân công | MH-10.7 Tab "Phân công mặc định" | QTHT / CB NV TW/BN/ĐP |
| FR-II-NEW-02 | Quản lý mẫu phản hồi (Mô hình B Hybrid 2 tầng) | MH-10.7 Tab "Mẫu phản hồi" | CB NV TW (TW_QUOC_GIA) / BN (BN_RIENG) / ĐP (DP_RIENG) — `pham_vi_ap_dung` immutable |
| FR-II-CROSS-01 | Cấu hình SLA tự động (cron 30 phút) | (tác vụ nền, không có UI) | Hệ thống |

**Refactor lớn:**

- **SLA cite:** Đ.9 NĐ55 (sai cũ) → **Đ.8 K.1**, 2-tier theo `muc_do_phuc_tap`: HOI_DAP_THUONG=15 ngày LV / HOI_DAP_PHUC_TAP=30 ngày LV
- **BR-SLA-02:** 4 mức cảnh báo `BINH_THUONG/SAP_HET_HAN/QUA_HAN/QUA_HAN_NGHIEM_TRONG` (>50%/100%/200% thời hạn)
- **BR-SLA-03:** Thông báo cảnh báo SLA (email + thông báo trong hệ thống)
- **BR-CALC-04:** Đổi `muc_do_phuc_tap` chỉ khi state TIEP_NHAN/DANG_XU_LY (recalc deadline)
- **BR-AUTH-08 exception:** MAU_PHAN_HOI có scope đặc biệt theo `pham_vi_ap_dung` — không apply data scoping mặc định

**23 finding screen coverage (F-01..F-23):**

- F-01 deprecate `trang_thai_luan_chuyen` dead field
- F-02 nút "Đổi mức độ phức tạp" SCR-II-02
- F-03 label "Đang phân công cho" khi phân công lại SCR-II-03
- F-04 radio `muc_do_phuc_tap` Form Thêm mới
- F-05 cột "Mức độ" + filter SCR-II-01
- F-06 filter + badge cột Kênh thêm `TVN_BRIDGE`
- F-07 ERR-TH-01/02/03 chi tiết FR-II-04
- F-08 ERR-PC-04/05/06 chi tiết FR-II-06
- F-09 cấp lẫn lộn cho batch Công khai
- F-10/11/12 loading skeleton + 403 + 404
- F-13 hiển thị "(Đã xóa)" khi FK trỏ record vô hiệu
- F-14/15 counter `{n}/1000` ly_do_huy + ghi_chu_tiep_nhan
- F-16 emoji strip ten_nguoi_gui
- F-17 dropdown form handle FK đã vô hiệu
- F-18 counter mo_ta_cong_khai sau XSS sanitize
- **F-19 session expired modal + auto-save draft localStorage AES-256-GCM** (NFR mới)
- **F-20 user mất quyền giữa chừng** (toast + giữ data + sao chép)
- **F-21 Lưu nháp auto-save 60s + optimistic locking PHAN_HOI** (NFR mới)
- **F-22 batch optimistic locking + báo cáo per-record** (NFR mới)
- **F-23 aria-label icon-only buttons WCAG 4.1.2** (NFR mới)
- G-DR-01 ERR-DELETE-STATE/AUTH-DEL/BATCH-CONFLICT
- G-DR-04 SEC-07 + EC-SEC-07a (lifecycle policy localStorage draft)
- G-DR-05 nút "Escalate sang Nhóm II" SCR-X2-03 (FR-13)

### 2.2 FR-03 Đào tạo (Nhóm III) — +133% (LỚN NHẤT)

**Cấu trúc 3 cấp Mô hình A (mới):**

```
KE_HOACH_DAO_TAO (KH năm) — SM-KH-DAO-TAO
└── CHUONG_TRINH_DAO_TAO (CTDT) — SM-CTDT (mới)
    └── KHOA_HOC — SM-KHOAHOC v2 (11 trạng thái)
        ├── LICH_HOC (per-buổi, mới)
        ├── HOC_VIEN qua DANG_KY_DAO_TAO
        └── KET_QUA_DAO_TAO + lich_hoc_id (điểm danh enum 3-value)
```

**5 UC mới:**

| UC mới | Tên | Ghi chú |
|--------|-----|---------|
| FR-III-20 | Xuất file docx/PDF ký số cho CTDT | UC mới — CR cấp văn bản ký số |
| FR-III-NEW-01 | Tạo đề kiểm tra | UC mới — pool câu hỏi → đề KT |
| FR-III-NEW-02 | Quản lý đề kiểm tra | UC mới expand |
| FR-III-NEW-03 | Phân phối đề + map bài giảng | UC mới expand — N-N junction |
| FR-III-21 | Phê duyệt khóa học | UC mới F-05 — CB PD duyệt KHOA_HOC |
| FR-III-22 | Quản lý Lịch học buổi dạy | UC mới F-07 — CRUD LICH_HOC + điểm danh per-buổi |

**3 SM thay đổi:**

| SM | Thay đổi |
|----|---------|
| **SM-KHOAHOC** | 9 → 11 trạng thái: thêm `TU_CHOI` + `TU_CHOI_KQ`. Refinement Cách 2: TU_CHOI → CHO_DUYET trực tiếp (không qua DU_THAO) |
| **SM-CTDT** (mới) | 7 trạng thái: DU_THAO/CHO_DUYET/TU_CHOI/DA_DUYET/DANG_THUC_HIEN/HOAN_THANH/DA_HUY. Auto-transition DA_DUYET → DANG_THUC_HIEN khi có ≥1 KHOA_HOC con DA_CONG_KHAI/DANG_DIEN_RA |
| **SM-KH-DAO-TAO** | Refinement: TU_CHOI → CHO_DUYET trực tiếp (không qua DU_THAO) |

**Entity refactor (KHÔNG mới hoàn toàn — verify 2026-05-04: 3 entity dưới đã có ở SRS cũ, SRS mới chỉ định nghĩa lại rõ hơn):**

- **KE_HOACH_DAO_TAO** — SRS mới làm rõ Mô hình A (KH năm 1:N CTDT 1:N KHOA_HOC) + quy trình phê duyệt riêng
- **HOC_VIEN** — SRS mới tách entity rõ ràng + thêm `tai_khoan_id` link TK
- **LICH_HOC** — SRS mới làm rõ per-buổi + thêm `lich_hoc_id` trong KET_QUA_DAO_TAO
- **KET_QUA_DAO_TAO** điểm danh boolean → enum 3-value `CO_MAT/VANG_PHEP/VANG_KHONG_PHEP` (THAY ĐỔI THẬT — DDL đổi)

**FR-III-19 Hướng B (refactor):** Bỏ cấp chứng nhận PDF → chỉ công bố KQ vào TK học viên + chuyên trang

**§7 Action-level Permission Codes (mới — F-FR03-18):** ~60 permission code, 6 nhóm:
- 7.1 KE_HOACH_DAO_TAO (10 code)
- 7.2 CHUONG_TRINH_DAO_TAO (10 code)
- 7.3 KHOA_HOC (16 code — bao gồm RESULT_SUBMIT/APPROVE/REJECT/PUBLISH_RESULT)
- 7.4 LICH_HOC (4 code)
- 7.5 DANG_KY_DAO_TAO (5 code — bao gồm CANCEL_OWN cho DN/NHT)
- 7.6 GIANG_VIEN, BAI_GIANG, NGAN_HANG_CAU_HOI, DE_KIEM_TRA (CRUD + DISTRIBUTE), DE_XUAT_DAO_TAO (~15 code)

**Cite pháp lý:** Đ.6 (sai cũ — về CSDL vụ việc) → **Đ.10 K.2 NĐ55/2019** (đào tạo PL DNNVV)

### 2.3 FR-04 TVV/Mạng lưới (Nhóm IV) — +94%

**Module TCTV (Tổ chức Tư vấn) hoàn toàn mới — CR-02:**

| UC mới | Tên | Ghi chú |
|--------|-----|---------|
| FR-IV-NEW-01 | Quản lý Tổ chức tư vấn | CRUD TCTV + state machine |
| FR-IV-NEW-02 | Cập nhật trạng thái TCTV | Tạm dừng / Vô hiệu hóa / Khôi phục |
| FR-IV-NEW-04 | Phê duyệt TCTV theo NĐ 55/2019 Đ.9 | BA chốt phương án A — CB PD công bố vào MLTV |

- **SM-TCTV (mới):** 6 trạng thái — `MOI_DANG_KY/CHO_PHE_DUYET/TU_CHOI/HOAT_DONG/TAM_DUNG/VO_HIEU_HOA`. Guard `VO_HIEU_HOA` chỉ khi không có TVV liên kết hoạt động
- **3 SCR mới:** SCR-IV-NEW-01/02/03
- **Entity TO_CHUC_TU_VAN** + junction TVV_TO_CHUC

**Module NHT (Người hỗ trợ pháp lý) refactor B+ — F-FR04-NEW-02:**

- Bỏ `NHT` khỏi enum `loai_tvv` → tách entity riêng
- **Entity NGUOI_HO_TRO + NGUOI_HO_TRO_LINH_VUC** (1:1 với TAI_KHOAN)
- 3 UC mới: FR-IV-NHT-01 (CRUD), FR-IV-NHT-02 (tìm kiếm phục vụ phân công VV/HD), FR-IV-NHT-03 (xem hồ sơ)
- 3 SCR mới: SCR-IV-NHT-01/02/03

**Refactor TVV:**

- **SM-TVV (refactor):** 9 trạng thái — thêm `CHO_THAM_DINH`, `TU_CHOI` → `CHO_THAM_DINH` (không qua MOI_DANG_KY), `TAM_DUNG` → `VO_HIEU_HOA`
- **FR-IV-13 (mới):** Tiếp nhận & chuyển trạng thái tiền thẩm định
- Bỏ `TVV_DIA_BAN` (Thẻ TVV toàn quốc theo NĐ 77/2008 Đ.19)
- Thang điểm đánh giá: `0-10` → `1-5`
- Bỏ cooldown 6 tháng
- Cite NĐ pháp lý: 121/2025 Đ.24 (sai) → **Đ.39-40** + 55/2019 Đ.9

**Cite pháp lý:** NĐ55/2019 Điều 9 (mạng lưới TVV) + NĐ77/2008 Điều 13 (ĐKHĐ TC TV) + NĐ121/2025 Đ.39-40 (phân cấp UBND tỉnh)

---

## 3. Test Strategy 7 lớp

> **Pattern:** Theo [`scaling-test-strategy.md`](../../../output/scaling-test-strategy.md) v1.1 + bài học A5 R5/R6/R7 (acceptance theo filter, KHÔNG theo total count).

| Lớp | Tên | Trọng tâm | Tools | Output |
|-----|-----|-----------|-------|--------|
| **L0** | SRS Sync + BA confirm | Diff scope vs SRS cũ + verify NotebookLM + BA chốt giả định ambiguous | NotebookLM HTPLDN id `e3a2681b-fdd6-4a24-917c-9ed636e8a110` + grep SRS local + bmad-checkpoint-preview | `srs-update-2026-05-04-diff.md` + BA sign-off list |
| **L1** | Tier 0 DM update | Seed DM mức độ phức tạp HD / 2-tier SLA / pham_vi_ap_dung MPH / loại TCTV | MCP browse + curl API | seed-checklist-tier0-update.md |
| **L2** | Entity actor refactor | Seed + advance state TCTV + NGUOI_HO_TRO entity migrate + TVV refactor (bỏ địa bàn, thang 1-5) | MCP browse + qa-only | seed-checklist-tctv.md + seed-checklist-nht.md + tvv-refactor-report.md |
| **L3** | Tier 2 transactional + new entities | Seed KE_HOACH (KHDT) → CTDT → KHOA_HOC → LICH_HOC → HOC_VIEN entry state | MCP browse + atomic chain seed | seed-checklist-khdt-3cap.md |
| **L4** | Workflow E2E (5 SM) | SM-HOIDAP với SLA 4 mức cảnh báo + SM-CTDT + SM-KHOAHOC v2 (+TU_CHOI) + SM-KH-DAO-TAO + SM-TCTV + SM-TVV refactor | qa skill + investigate khi block | workflow-test-report-* (5 file) |
| **L5** | Action-level Permission §7 | 11 vai trò × ~60 permission code (FR-03 nhóm) + permission TCTV/NHT (FR-04) + MPH 3-cấp (FR-02) | qa-only batch + permission test isolation | permission-test-report-fr02-fr03-fr04.md |
| **L6** | Edge + NFR | Optimistic locking PHAN_HOI / batch / KE_HOACH; auto-save draft AES-256-GCM; XSS sanitize MPH; aria-label WCAG 4.1.2; F-19/F-20 session/permission mất giữa chừng; BR-INTG-05 retry push API | cso skill + investigate + codex challenge | nfr-edge-report-srs-update.md |
| **L7** | Functional negative + UI consistency | Negative + alternative + edge per UC mới (15 UC); UI strings tiếng Việt thuần BA review v3 (bỏ jargon SLA/deadline/dropdown/in-app) | qa-only + design-review | functional-negative-report.md + ui-consistency-report.md |

### 3.1 Thứ tự thực thi

```
L0 (gate) → L1 → L2 → L3 → L4 → L5 // L6 // L7
                                  ║
                               (L5/L6/L7 có thể parallel sau L4 PASS)
```

**Checkpoint giữa các lớp:** sau L0 (BA sign-off), sau L2 (entity actor stable), sau L4 (workflow E2E PASS) — đề xuất human review (`bmad-checkpoint-preview`).

### 3.2 Pattern seed acceptance — strict per filter

Theo memory `feedback_seed_acceptance_strict_split.md` + bài học A5 R5/R6/R7:

```
❌ Sai: "Seed 12 record TCTV"
✅ Đúng: "Seed ≥3 TCTV cho mỗi (loại × cấp × state):
         - Loại Văn phòng LS × cấp TW × HOAT_DONG: ≥3
         - Loại Trung tâm TVPL × cấp BN × HOAT_DONG: ≥3
         - Loại Văn phòng LS × cấp ĐP × CHO_PHE_DUYET: ≥3
         (verify per-filter query downstream)"
```

Mỗi seed task có ≥2 chiều combinatorial → split sub-task + verify per-filter. Mỗi entity actor có dropdown ở module khác → BẮT BUỘC tách 2 task (`seed-create` + `advance-state`) theo memory `feedback_seed_actor_state_gap.md`.

---

## 4. Tool & Skill matrix

### 4.1 Browser automation (đã sẵn)

| Tool | Vai trò | Khi dùng |
|------|---------|----------|
| **MCP Chrome DevTools** | Primary từ 2026-04-21 (CLAUDE.md MCP-Rule 1-7) | Mặc định cho mọi UI test — login + nav sidebar + form CRUD + verify network/console |
| **Gstack browse** (`$B`) | Fallback | Khi MCP unavailable + cần CSS-selector-exact-match |

**Pattern:**
- Login template MCP đã verify (`qtht_01/Secret@123/OTP 666666`) — xem CLAUDE.md
- Multi-role test KHÔNG logout, dùng `mcp__chrome-devtools__new_page` với `isolatedContext` riêng (memory `qa_htpldn_round5_t01`)
- Network verify: `mcp__chrome-devtools__list_network_requests` cho double-wrap bug (memory `qa_htpldn_api_wrap_bug`)
- Permission probe: API trước UI khi test permission TC (memory `qa_htpldn_qtht_permission_bypass`)

### 4.2 SRS verification (đã sẵn)

| Tool | Vai trò |
|------|---------|
| **NotebookLM HTPLDN** (id `e3a2681b-fdd6-4a24-917c-9ed636e8a110`) | Query SRS authoritative — verify mỗi log/đóng/đổi severity bug (memory `feedback_bug_verify_notebooklm_local`) |
| **grep SRS local** | Cross-check 2-source — quote nguyên văn vào bug report |
| **MailHog** (http://103.172.236.130:8025) | OTP fallback nếu bypass `666666` bị tắt |

### 4.2b Diff SRS cũ ↔ mới — 3 cấp công cụ tùy mức độ

> **Pattern:** Khi BA gửi SRS update batch, cần verify scope thay đổi trước khi lên test plan. Đã verify ngày 2026-05-04 cho batch SRS update — 20/21 claim đúng.

| Mức | Công cụ | Khi nào dùng | Prompt mẫu |
|-----|---------|-------------|------------|
| **Đơn giản** | `diff` shell hoặc VSCode "Compare Selected" | Xem dòng-vs-dòng cũ-mới khi delta nhỏ (<10%) | `diff -u srs-v3/srs-fr-XX.md srs-update-2026-5-4/srs-fr-XX.md` |
| **Trung bình (CHÍNH)** | **`Explore` agent** (subagent_type=Explore) | Verify từng claim cụ thể: "có UC mới X không?", "SM có thêm trạng thái Y không?". Phù hợp khi delta >20% — diff trực tiếp ra rác do refactor | "Đọc 2 file [cũ] + [mới], verify các claim sau: 1. ... 2. ... Báo cáo: ✅/❌/⚠️ + bằng chứng dòng cụ thể" |
| **Sâu** | `bmad-technical-research` hoặc `general-purpose` agent | Phân tích cross-file impact: "đổi SM-KHOAHOC ảnh hưởng module nào downstream?" | "Trace impact thay đổi X trong file SRS Y → list module/entity downstream affected + verify cross-reference" |

**Quy trình diff SRS chuẩn (3 bước):**
1. **Đọc Lịch sử thay đổi** (header table) trong file SRS mới — tác giả thường liệt kê delta tóm tắt
2. **Grep TOC** (`grep -n "^## \|^### "` 2 file) → so sánh số UC, số SCR, số entity, số SM
3. **Spawn `Explore` agent** với danh sách claim cụ thể → nhận báo cáo ✅/❌/⚠️ kèm line number quote

**Output mẫu:** [`summary-for-BA.md`](../../srs-update-2026-05-04/summary-for-BA.md) — file gửi BA xác nhận sau khi diff.

### 4.3 Skills cho từng layer

| Layer | Skill primary | Skill fallback |
|-------|---------------|----------------|
| **L0** SRS sync | `bmad-checkpoint-preview` (human gate) + `general-purpose` agent (research delta) | manual review |
| **L1** Tier 0 seed | `qa` (test + fix loop) | `browse` manual |
| **L2** Entity actor | `qa-only` (report) + `qa` (fix block) | `browse` |
| **L3** Tier 2 | `qa-only` | atomic chain seed |
| **L4** Workflow E2E | `qa` (5 SM × 1 luồng/SM) | `investigate` khi block |
| **L5** Permission | `qa-only` batch + script API probe | session-isolation pattern |
| **L6** Edge + NFR | `cso` (security audit XSS / AES / locking) + `codex challenge` (adversarial) + `investigate` | `general-purpose` agent |
| **L7** Functional + UI | `qa-only` (negative) + `design-review` (UI consistency) | manual |

### 4.4 Templates + Hooks (đã sẵn)

- [`output/template/bug-report-template.md`](../../../output/template/bug-report-template.md) — strict 6 sections (memory `feedback_bug_report_template_strict`)
- [`output/template/seed-checklist-template.md`](../../../output/template/seed-checklist-template.md) — section "Downstream consumer × filter"
- [`output/template/test-plan-overview-template.md`](../../../output/template/test-plan-overview-template.md)
- [`.claude/hooks/check-todo-concise.py`](../../../.claude/hooks/) — chặn `**Kết quả:**` >25 từ (memory `feedback_todo_concise_result`)
- [`.claude/hooks/check-bug-template-sections.py`](../../../.claude/hooks/) — chặn forbidden sections trong bug report

### 4.5 Skills KHÔNG dùng / không cần thêm

- `/ship`, `/land-and-deploy`, `/canary` — đây là QA project, không deploy
- `/design-shotgun`, `/design-html`, `/design-consultation` — không design mới
- `setup-deploy`, `setup-browser-cookies` — đã setup
- BMAD agent-pm, agent-dev, agent-architect — không phải dev project

---

## 5. Dependency graph + Vertical slices

```
┌──────────────────────────────────────────────────────────────────┐
│ L0  SRS SYNC (gate everything)                                    │
│    └── BA confirm 5 giả định (xem §9)                            │
└──────────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ L1.1 DM HD   │    │ L1.2 SLA     │    │ L1.3 DM TCTV │
│ phức tạp     │    │ 2-tier 15/30 │    │ loại TCTV    │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ L2.1 TCTV    │    │ L2.2 NHT     │    │ L2.3 TVV     │
│ seed+advance │    │ entity migr  │    │ refactor     │
└──────────────┘    └──────────────┘    └──────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────────────────────┐
│ L3.1 HD      │    │ L3.2 KHDT 3 cấp              │
│ entry với    │    │ KE_HOACH → CTDT → KHOA_HOC   │
│ phức tạp     │    │       → LICH_HOC + HOC_VIEN   │
└──────────────┘    └──────────────────────────────┘
        │                          │
        ▼                          ▼
┌──────────────┐    ┌─────────────────────────────────┐
│ L4.1 SM-HD   │    │ L4.2 SM-CTDT (mới)              │
│ +SLA 4 cảnh  │    │ L4.3 SM-KHOAHOC v2 (TU_CHOI)    │
│ báo + escal  │    │ L4.4 SM-KH-DAO-TAO (refinement) │
└──────────────┘    │ L4.5 SM-TCTV (mới)              │
        │           │ L4.6 SM-TVV refactor             │
        │           └─────────────────────────────────┘
        │                          │
        └───────────┬──────────────┘
                    ▼
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ L5 Permission│    │ L6 Edge +NFR │    │ L7 Functional│
│ §7 60 codes  │    │ (parallel)   │    │ negative+UI  │
└──────────────┘    └──────────────┘    └──────────────┘
```

### 5.1 Vertical slices (mỗi slice = 1 path complete end-to-end)

| Slice ID | Tên | Path |
|----------|-----|------|
| **VS-1** | HD escalate sang TVN | HD MOI → TIEP_NHAN với muc_do_phuc_tap=PHUC_TAP → SLA 30 ngày → escalate Nhóm II |
| **VS-2** | HD công khai với MAU_PHAN_HOI 3-cấp | CB NV ĐP soạn PHAN_HOI dùng template TW_QUOC_GIA → CHO_PHE_DUYET → CONG_KHAI |
| **VS-3** | HD timeout SLA → 4 mức cảnh báo | HD seed thời điểm vượt 100% deadline → cron tự động chuyển QUA_HAN → email CB NV+CB PD |
| **VS-4** | KHDT năm full cycle | Tạo KHDT năm DU_THAO → CHO_DUYET → DA_DUYET → CTDT → KHOA_HOC → LICH_HOC → DK → CO_MAT/VANG → KQ → công bố |
| **VS-5** | KHDT từ chối refinement | KHDT/CTDT/KHOA_HOC: TU_CHOI → CHO_DUYET (sửa rồi gửi lại, không qua DU_THAO) |
| **VS-6** | TCTV registration full cycle | CB NV tạo TCTV (Giấy ĐKHĐ Sở TP) → CHO_PHE_DUYET → CB PD công bố MLTV (NĐ55 Đ.9) → HOAT_DONG → TVV link → đánh giá → TAM_DUNG → VO_HIEU_HOA (guard) |
| **VS-7** | NHT entity migration + assignment | Tạo NGUOI_HO_TRO entity riêng → link TK → assign vào HD/VV (FR-IV-NHT-02 phục vụ phân công) |
| **VS-8** | TVV refactor + thẩm định | TVV MOI_DANG_KY → CHO_THAM_DINH → DANG_THAM_DINH (4 tiêu chí 1-5) → CHO_PHE_DUYET → HOAT_DONG → công khai toàn quốc (NĐ77/2008 Đ.19, không địa bàn) |
| **VS-9** | Optimistic locking PHAN_HOI | 2 CB NV đồng thời sửa cùng 1 PHAN_HOI → race → 1 thắng + 1 thấy ERR-CONFLICT + auto-save draft AES-256-GCM |
| **VS-10** | XSS sanitize MAU_PHAN_HOI | CB NV soạn MPH với `<script>alert(1)</script>` → save → sanitize loại bỏ + verify chuỗi sạch trong DB |

Mỗi slice = 1 happy path + ≥2 negative case + verify cross-module impact (L4 → L5 → L6 → L7 inline).

---

## 6. Acceptance + Verification per layer

### 6.1 Format chung

Mỗi task có **3 phần bắt buộc:**

```
**Acceptance:** <điều kiện đạt cụ thể, theo filter — KHÔNG theo total count>
**Verify query:** <query API/DOM/DB cụ thể để verify>
**Bằng chứng:** <screenshot path / API response trích / DB query result>
```

### 6.2 Per-layer acceptance

| Layer | Acceptance pattern | Verify method |
|-------|-------------------|---------------|
| **L0** | 5 giả định BA chốt rõ (xem §9), diff sync 100% với srs-update-2026-5-4 | NotebookLM query + grep SRS local 2-source |
| **L1** | Mỗi DM mới có ≥3 record × mỗi filter downstream | curl API filter param + DOM dropdown count (scroll virtual list theo memory `feedback_antd_dropdown_test_method`) |
| **L2** | Mỗi entity actor: ≥3 record × (loại × cấp × state) AND đã advance đến state consumer cần | API filter `?trang_thai=HOAT_DONG&don_vi=...` + verify dropdown phân công có ≥1 option |
| **L3** | Mỗi entry state có ≥3 record × (cấp × state nguồn) | API list filter |
| **L4** | Mỗi SM walk full transition theo bảng SM ([`02-thu-tu-module.md`](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) — memory `feedback_test_plan_check_sm_table`) | Screenshot từng state + audit log entry mỗi transition |
| **L5** | Mỗi permission code §7 verify 1 ALLOW (role có quyền) + 1 DENY (role không có) | API probe + UI button visible/disabled + 403 response |
| **L6** | Mỗi NFR có ≥1 TC reproduce + bằng chứng | Race condition timeline / network response / DOM aria-label / DB encrypted value |
| **L7** | Negative case: invalid input/state mismatch/concurrent state | UI error message khớp ERR code SRS + verify state KHÔNG đổi |

### 6.3 Bug report

Mỗi bug log theo strict 6 sections (memory `feedback_bug_report_template_strict`):
1. Mô tả (1-3 câu)
2. Bước tái hiện
3. KQ mong đợi (theo SRS quote)
4. KQ thực tế
5. Bằng chứng (≥1 screenshot inline base64 — memory `feedback_bug_report_embed_screenshot`)
6. So sánh (optional, chỉ permission bug)

CẤM section "Tác động" / "Đề xuất fix" / "SRS verification" / "Phân biệt module".

---

## 7. Risk + Mitigation

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|-----------|
| R1 | Dev chưa implement đủ 15 UC mới → block test | High | Critical | L0 phase: liên hệ dev confirm scope sẵn sàng. Test theo wave (L1→L2→L3) khi dev ready |
| R2 | SM-CTDT mới + SM-KHOAHOC v2 (11 trạng thái) phức tạp → bug nhiều, regress lan rộng | High | Critical | L4 split 1 SM = 1 task riêng. Walk full transition + audit log/transition. Investigate skill khi block ≥2 transition |
| R3 | NGUOI_HO_TRO entity migrate khỏi loai_tvv enum cũ → break R6 cũ (HD/VV/TVCS phân công cho NHT) | Medium | Critical | L2.2 phải có rollback plan + backfill TK NHT cũ vào entity mới. Regression test R6 workflow trên NHT trước khi đóng L2 |
| R4 | Optimistic locking PHAN_HOI race condition khó reproduce | Medium | Major | L6 dùng 2 MCP isolatedContext + script timing để force race. Investigate skill |
| R5 | XSS sanitize MAU_PHAN_HOI test vector chưa đủ | Medium | Major | cso skill audit + payload list OWASP XSS-1..XSS-7. Test cả storage XSS + reflected XSS |
| R6 | localStorage AES-256-GCM verify mode nội bộ — có thể không reproduce qua UI | Low | Major | L6 dùng `mcp__chrome-devtools__evaluate_script` đọc localStorage raw + verify ciphertext format. Escalate dev nếu cần test API |
| R7 | Permission §7 60 code × 11 role = 660 TC quá nhiều | High | Major | L5 split 6 batch (1 batch/code group). Sample mỗi batch ≥3 ALLOW + ≥3 DENY representative trước, full coverage ở R7 sau |
| R8 | Permission test isolation: BE httpOnly cookie sticky không reset khi switch role | Medium | Major | Memory `qa_htpldn_round5_t01` — dùng `new_page` với `isolatedContext` riêng tên unique per role |
| R9 | JWT BE revoke aggressive ~2 phút (memory `qa_htpldn_jwt_revoke_aggressive`) | Medium | Medium | Re-login khi gặp 401 trong workflow dài >2 phút. Atomic chain login template MCP-7 |
| R10 | API double-wrap bug có thể xuất hiện ở entity mới (memory `qa_htpldn_api_wrap_bug`) | Low | Medium | curl verify response shape khi seed entity mới (TCTV, NGUOI_HO_TRO, KHDT, LICH_HOC, HOC_VIEN) |
| R11 | Acceptance theo total count → false PASS như A5 R5 | Medium | Critical | Mọi seed task acceptance theo per-filter query (memory `feedback_seed_acceptance_strict_split`) |
| R12 | Sycophancy với dev khi push back bug | Medium | Medium | Memory `feedback_dev_pushback_critical_thinking` — 4 bước verify trước khi accept dev claim |

---

## 8. Timeline + Checkpoints

> **Giả định:** Dev ready 100% scope SRS update, parallel với R6 đóng. Nếu dev chưa ready → push timeline.

| Phase | Tuần | Task chính | Checkpoint cuối phase |
|-------|------|------------|----------------------|
| **L0** | T0 (1 ngày) | SRS sync + BA confirm 5 giả định | BA sign-off doc — `srs-update-2026-05-04-diff.md` |
| **L1** | T1 (1 ngày) | DM HD phức tạp + SLA 2-tier + DM TCTV | seed-checklist-tier0-update.md PASS per-filter |
| **L2** | T1 (3-4 ngày) | TCTV + NGUOI_HO_TRO + TVV refactor | 3 entity stable, dropdown phân công render >0 option, regression R6 NHT workflow PASS |
| **L3** | T2 (2 ngày) | HD entry + KHDT 3 cấp entry state | Per-filter query verify entry state đầy đủ |
| **L4** | T2-T3 (1 tuần) | 5 SM workflow E2E | 5 workflow report PASS happy path + 1 negative/SM |
| **L5** | T3-T4 (1 tuần) | Permission §7 sample wave | Permission report sample 6 group × ≥6 TC = ≥36 TC PASS |
| **L6** | T4 (3 ngày, parallel L5) | Edge + NFR (locking/AES/XSS/aria) | nfr-edge-report PASS sample ≥1 TC/NFR |
| **L7** | T4 (3 ngày, parallel L5/L6) | Functional negative + UI consistency | ui-consistency-report PASS sample 5 màn hình |
| **R7 close** | T5 (1 ngày) | Tổng kết + bug retest + handoff | Final summary + bug status table |

**Tổng:** ~5 tuần — depends on dev readiness + bug fix cycle.

**Checkpoint trigger `bmad-checkpoint-preview`:**
- Sau L0 (gate everything)
- Sau L2 (entity actor stable trước khi seed transactional)
- Sau L4 (workflow PASS trước khi permission/NFR)
- Sau R7 close

---

## 9. Giả định cần BA xác nhận

Trước khi execute, **BA cần chốt 5 giả định:**

1. **Migration NHT khỏi `loai_tvv` enum cũ:** Sau migrate, R6 cũ (HD/VV/TVCS phân công cho NHT) có break không? Nếu break → cần dev backfill TK NHT cũ → entity NGUOI_HO_TRO mới với mapping table. Test plan giả định **migration in-place + backward compat 1 round**.

2. **3 cấp Mô hình A KHDT:** SRS chốt KHDT năm 1:N CTDT 1:N KHOA_HOC. R6 cũ KHOA_HOC tạo trực tiếp (không cần CTDT). Sau migrate, KHOA_HOC R6 cũ có cần backfill `chuong_trinh_id` không? Test plan giả định **R6 KHOA_HOC cũ giữ orphan + R7 KHOA_HOC mới phải có CTDT cha**.

3. **MAU_PHAN_HOI 3 phạm vi (TW_QUOC_GIA / BN_RIENG / DP_RIENG):** SRS nói "TW_QUOC_GIA khả dụng cho 63 ĐP nhưng KHÔNG khả dụng cho BN". BA confirm: BN có chuyên ngành riêng → chỉ thấy mẫu BN_RIENG của chính BN đó? Nếu BN cần đọc TW_QUOC_GIA để tham khảo → cần thêm scope. Test plan giả định **strict theo SRS — BN không thấy TW_QUOC_GIA**.

4. **TVV refactor: bỏ TVV_DIA_BAN + thang điểm 0-10 → 1-5:** Dữ liệu TVV cũ (R6 đã seed thang 0-10 + có địa bàn) có cần migrate không? Test plan giả định **R7 dùng TVV mới với thang 1-5; R6 TVV cũ giữ làm reference, không retest**.

5. **TVN_BRIDGE enum (FR-02 F-06):** Đây là kênh nguồn HD mới — TV nhanh bridge. R6 cũ chưa có. Test plan giả định **dev đã thêm enum vào DM kênh + UI badge**.

**Format chốt giả định:** BA reply OK/NOK + rationale → save vào `tasks/decisions/srs-update-2026-05-04-ba-signoff.md`.

---

## 10. Tham chiếu nội bộ

- [`tasks/plan.md`](../../plan.md) v2.5.1 — R6 active plan (KHÔNG ghi đè)
- [`v1 todo`](todo.md) — task list chi tiết của plan này
- [`tasks/lessons-learned.md`](../../lessons-learned.md) — bài học A5 + LGSP + UI auto-chain
- [`output/test-strategy.md`](../../../output/test-strategy.md) v3.0 — chiến lược tổng (giữ làm khung)
- [`output/scaling-test-strategy.md`](../../../output/scaling-test-strategy.md) v1.1 — pattern scaling
- [`output/permission-matrix.md`](../../../output/permission-matrix.md) — ma trận quyền cũ (cần update sau §7)
- [`output/permission-matrix-by-fr.md`](../../../output/permission-matrix-by-fr.md) — view FR × role
- [`input/data/entity-map.md`](../../../input/data/entity-map.md) — cross-module entity map (cần thêm 5 entity mới)
- [`input/quy-trinh-nghiep-vu/flow-module.md`](../../../input/quy-trinh-nghiep-vu/flow-module.md) — state machine 14 module (cần update SM-CTDT, SM-KHOAHOC v2, SM-TCTV, SM-KH-DAO-TAO)
- [`output/template/`](../../../output/template/) — bug-report-template, seed-checklist-template, test-plan-overview-template
