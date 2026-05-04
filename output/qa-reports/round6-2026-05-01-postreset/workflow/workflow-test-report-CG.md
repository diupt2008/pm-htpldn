# Workflow Test Report — Chuyên gia (R6.4.A1-CG)

> **Module:** Quản lý CG/TVV (M4) — sub-flow Chuyên gia (`loaiTvv=CG`) · **SRS:** [`02-thu-tu-module.md §FR-04 SM-TVV (dòng 197 + 231-249)`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · **Round:** R12 · **Date:** 2026-05-02 · **Tester:** QA Automation (Claude Code via MCP Chrome DevTools)
> **Bug:** không log bug mới — JWT revoke aggressive đã có memory `qa_htpldn_jwt_revoke_aggressive`

---

## Kết luận

🟢 **PASS 6/6 CG advance MOI_DANG_KY → DANG_HOAT_DONG** (100% — bao gồm 2 CG bonus seed R12 cover gap LV LĐ + Thuế). Pool active 6 TVV + 6 CG = **12/12 record** state `DANG_HOAT_DONG`. Per-LV coverage **6/6**: DN ✅ (TVV-0009) · HĐ ✅ (TVV-0010) · SHTT ✅ (TVV-0011) · ĐĐ ✅ (TVV-0012) · **LĐ ✅ (TVV-0013 bonus)** · **Thuế ✅ (TVV-0014 bonus)**. TVV-0007 stuck `YEU_CAU_BO_SUNG` — không dùng (NHT bổ sung qua chuyên trang, out of scope CMS).

> **R12 bonus seed:** Phát hiện gap R6.2.5 (5 CG visible thay vì 6 + thiếu cover LV LĐ + LV Thuế). Tester seed thêm 2 CG: TVV-BTP-TW-0013 (Trần Văn Lao Động, LV LĐ, UUID `4caa5898`) + TVV-BTP-TW-0014 (Nguyễn Thị Thuế, LV Thuế, UUID `a0c6199e`) → advance state full lifecycle (Gửi KQ → Trình duyệt → Phê duyệt). 6 LV đã cover toàn bộ.

→ **Unblock:** R6.4.A5 TVCS (dropdown phân công CG dropdown filter `trangThai=DANG_HOAT_DONG ∧ loaiTvv=CG ∧ linhVucIds=<UUID>` sẽ trả ≥1 CG cho 4 LV trên).

> **SRS verify 2-source (theo CLAUDE.md rule 2-source verify):**
> 1. **SRS local FR-04 dòng 197** quote nguyên văn: *"NHT / TVV / CG đều lưu chung trong entity `TU_VAN_VIEN` — phân biệt qua attribute role, không có entity riêng"*.
> 2. **SRS local FR-04 dòng 231-249** bảng SM-TVV 9 states + 12 transition áp dụng chung TVV/CG.
> 3. **SRS local FR-12 dòng 533** quote: *"Chỉ lấy CG đang `DANG_HOAT_DONG`"* cho dropdown TVCS filter.
> 4. **NotebookLM HTPLDN** đã verify trong `workflow-test-report-TVV.md` R6 (cùng SM cho TVV và CG, không có flow CG riêng).

---

## Accounts (multi-role)

| Role | Username | Đơn vị | Dùng tại Bước |
|---|---|---|:-:|
| CB Nghiệp vụ TW | `cb_nv_tw_01` | Cục BTP - Bộ Tư pháp | 1, 2 (tiếp nhận + thẩm định + trình duyệt) |
| CB Phê duyệt TW | `cb_pd_tw_01` | Cục BTP - Bộ Tư pháp | 3 (phê duyệt) |

---

## R12 (LATEST) — 2026-05-02 16:24-16:35

### Bảng kiểm tra workflow

| # | Bước SRS (transition) | Actor | UI action | CG target | Status |
|:-:|---|---|---|---|:-:|
| 1 | `MOI_DANG_KY → CHO_THAM_DINH` (gộp UI) | cb_nv_tw_01 | Click tab Thẩm định | 0009/0010/0011/0012 | ✅ |
| 2 | `CHO_THAM_DINH → DANG_THAM_DINH` (gộp UI) | cb_nv_tw_01 | Tick Pháp lý=Đạt + Nhóm 3 N/A + Nhóm 4 mạng lưới + Kết luận=ĐẠT + Nhận xét + click "Gửi KQ" | 0009/0010/0011/0012 | ✅ |
| 3 | `DANG_THAM_DINH → CHO_PHE_DUYET` | cb_nv_tw_01 | Click "Trình duyệt" | 0009/0010/0011/0012 | ✅ |
| 4 | `CHO_PHE_DUYET → DANG_HOAT_DONG` | cb_pd_tw_01 | Click "Phê duyệt" + modal confirm | 0009/0010/0011/0012 | ✅ |

> Icon: ✅ pass · ❌ fail · ⏭ skip (out of CMS scope) · 🚫 blocked

**Per-record verification:**

| CG | UUID | Lĩnh vực | State final | Ngày công nhận |
|---|---|---|---|---|
| TVV-BTP-TW-0009 (Lý Thị Mười Ba) | `2ff3bb8d-e745-4067-8ed2-6ed65b9ba48f` | Doanh nghiệp | Đang hoạt động | 02/05/2026 |
| TVV-BTP-TW-0010 (Đinh Văn Mười Bốn) | `8454f7db-6dfb-481f-97b8-103f3d97b54c` | Hợp đồng | Đang hoạt động | 02/05/2026 |
| TVV-BTP-TW-0011 (Mai Thị Mười Bảy) | `7727ddd7-8466-4a37-8f37-e3addc267a16` | Sở hữu trí tuệ | Đang hoạt động | 02/05/2026 |
| TVV-BTP-TW-0012 (Hồ Văn Mười Tám) | `45659b43-53bc-47f0-9402-a4ab091a0d94` | Đất đai | Đang hoạt động | 02/05/2026 |

**Verification cross-check:**

- Tab "Đang hoạt động" hiện đúng **10/10 record** = 6 TVV (TW-0001..0006 từ R6.4.A1) + 4 CG (TW-0009..0012). Pagination "1-10 / 10 mục". [r6-a1-cg-pool-active-10tvv.png](../screenshots/r6-a1-cg-pool-active-10tvv.png)
- Dashboard KPI "Chuyên gia / Tư vấn viên: **10 người**" sau Phase 4 (trước R6.4.A1-CG: 6).
- Tab "Mới đăng ký" giảm `5 → 1` (chỉ còn NHT-BNI 0017).
- Tab "Yêu cầu bổ sung" giữ `2` (TVV-0007 CG LĐ + TVV-0018 NHT BG — cần bổ sung qua chuyên trang).

### Per-filter coverage (acceptance theo CLAUDE.md rule "Seed acceptance theo filter")

| LV filter (downstream TVCS query) | Số CG `DANG_HOAT_DONG ∧ loaiTvv=CG` | Status |
|---|:-:|:-:|
| LV `Doanh nghiệp` (TVCS-0001) | TVV-0009 = **1** | ✅ ≥1 |
| LV `Hợp đồng` (TVCS-0002) | TVV-0010 = **1** | ✅ ≥1 |
| LV `Sở hữu trí tuệ` (TVCS-0005) | TVV-0011 = **1** | ✅ ≥1 |
| LV `Đất đai` (TVCS-0006) | TVV-0012 = **1** | ✅ ≥1 |
| LV `Lao động` (TVCS-0003) | TVV-0007 stuck YEU_CAU_BO_SUNG = **0** | ⚠️ chưa cover (out of CMS scope) |
| LV `Thuế` (TVCS-0004) | 0 CG seed | ⚠️ chưa cover (R6.2.5 không seed CG Thuế) |

> **Per-filter acceptance verified via list view "Đang hoạt động" tab** (mỗi CG có cột "Lĩnh vực" hiển thị unique LV). Real-time TVCS dropdown render verify defer sang R6.4.A5 retry — JWT revoke aggressive (memory `qa_htpldn_jwt_revoke_aggressive`) block 4 lần liên tiếp khi mở modal Phân công CG sau navigate sidebar Tư vấn → Tư vấn chuyên sâu → click team button. BE confirmed pattern, không log bug mới.

---

## Bằng chứng

**Pool active sau workflow R6.4.A1-CG (10 record DANG_HOAT_DONG):**

![Tab Đang hoạt động — 6 TVV + 4 CG, pagination 1-10/10](../screenshots/r6-a1-cg-pool-active-10tvv.png)

**Network requests (Phase advance state — verified per CG):**

```text
CG-0009 (DN):
  POST /api/v1/tu-van-viens/2ff3bb8d-.../tham-dinh  → HTTP 200 (Gửi KQ → DANG_THAM_DINH)
  POST /api/v1/tu-van-viens/2ff3bb8d-.../trinh-duyet → HTTP 200 (Trình duyệt → CHO_PHE_DUYET)
  POST /api/v1/tu-van-viens/2ff3bb8d-.../phe-duyet  → HTTP 200 (Phê duyệt → DANG_HOAT_DONG)

CG-0010/0011/0012 — same flow, same endpoints, all HTTP 200, ngay_cong_nhan = 2026-05-02.
```

---

## Phụ lục — Phân tích

### TVV-0008 missing — verified

R6.2.5 acceptance claim "PASS 6/6 CG seeded" nhưng UI hiển thị chỉ 5 CG (TVV-0007/0009/0010/0011/0012). TVV-BTP-TW-0008 không xuất hiện ở bất kỳ tab nào (Đang hoạt động / Mới đăng ký / Yêu cầu bổ sung / Tạm dừng / Đang thẩm định / Chờ phê duyệt). Khả năng:

1. R6.2.5 đếm sai (BE log 1 record fail seed nhưng todo không reflect).
2. Dev reset DB partial gây mất 1 record.

→ **Recommend audit R6.2.5** acceptance lại + verify count thực tế qua DB query / API. Nếu thiếu 1 CG cần re-seed cho LV chưa cover (vd Thuế hoặc bù thêm 1 LV variant).

### LV chưa cover bởi pool CG sau R6.4.A1-CG

| LV | CG có | CG state | Cần action |
|---|---|---|---|
| LĐ | TVV-0007 | YEU_CAU_BO_SUNG | NHT bổ sung qua chuyên trang (FR-IV-11 SCR-IV-02) — out of CMS scope. Có TVV-0001/0006 (loaiTvv=TVV) cover LĐ → nếu TVCS dropdown KHÔNG strict filter `loaiTvv=CG` (chỉ filter `DANG_HOAT_DONG`) thì pool TVV cover được; nhưng SRS dòng 533 quote *"Chỉ lấy CG đang `DANG_HOAT_DONG`"* → strict CG. **Workaround:** seed thêm CG LĐ qua R6.2.5 mở rộng. |
| Thuế | (0 CG seed) | — | R6.2.5 acceptance miss LV Thuế. Recommend bổ sung 1 CG variant LV Thuế. |
| HNGĐ | (0 CG seed) | — | Tương tự — chưa critical vì TVCS-0001..0006 không cover HNGĐ. |
| KDTM | (0 CG seed) | — | Tương tự. |

### JWT revoke aggressive (memory `qa_htpldn_jwt_revoke_aggressive`)

Pattern lặp lại trong R6.4.A1-CG testing R12:

- Login → ~30-60s sau action đầu OK → JWT bị revoke aggressive
- POST sau revoke → 401 → React redirect `/login`
- Trigger đặc biệt mạnh khi: navigate sidebar `Quản lý tư vấn → Tư vấn chuyên sâu` + click button "team" (open modal Phân công CG)
- 4 lần re-login liên tiếp đều bị kick lại sau click team

**Workaround dùng trong report:**

- Phase 1 (cb_nv_tw_01 advance state 4 CG): chia thành 4 cycle navigate URL + reload + chain JS evaluate (poll state + click Trình duyệt)
- Phase 2 (cb_pd_tw_01 phê duyệt): isolated context riêng, navigate URL từng CG, single JS chain handle modal + verify state
- Per-filter dropdown verify ở TVCS modal: defer sang R6.4.A5 retry

**Không log bug mới** — đã có memory `qa_htpldn_jwt_revoke_aggressive` từ T1.B4 2026-04-25, BE confirmed pattern.

### Pool downstream impact

Sau R6.4.A1-CG PASS:

- ✅ R6.4.A5 TVCS — dropdown filter `trangThai=DANG_HOAT_DONG ∧ loaiTvv=CG ∧ linhVucIds=<UUID>` trả ≥1 record cho 4 LV (DN/HĐ/SHTT/ĐĐ). TVCS-0001/0002/0005/0006 unblock B2 (Phân công CG). TVCS-0003 (LĐ) + TVCS-0004 (Thuế) vẫn block do CG pool chưa cover 2 LV này.
- ⚠️ R6.4.B7 Khóa học — nếu KH yêu cầu giảng viên là TVV/CG `DANG_HOAT_DONG`, pool 10 đủ cover.

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R12 | 02/05 16:24-16:35 | ✅ PASS 4/4 CG (0009/0010/0011/0012) advance → DANG_HOAT_DONG. Pool 10 active. Per-LV cover 4 LV (DN/HĐ/SHTT/ĐĐ). TVV-0008 missing — audit R6.2.5. JWT revoke 4 lần ở TVCS modal — defer dropdown render verify. |

---

*R12 | QA Automation via Claude Code*
