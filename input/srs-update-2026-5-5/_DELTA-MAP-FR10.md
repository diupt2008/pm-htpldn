# Delta Map — FR-10 update (Quản trị Hệ thống)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-10-quan-tri.md` so với `srs-v3/srs-fr-10-quan-tri.md`, list module bị ảnh hưởng + file QA cần update.
> **Ngày tạo:** 2026-05-05 | **Tác giả:** QA + Claude

---

## 1. Có gì mới / đổi / xoá

### FR mới (3 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-VIII-26 | Quên mật khẩu / Kích hoạt tài khoản lần đầu | Workflow chung 2 case (kích hoạt TK lần đầu + reset password). Trigger update SM-TVV và SM-NHT khi kích hoạt TK |
| FR-VIII-28 | Nhật ký hệ thống | Phantom FR cho SCR-VIII-10 (MH-10.10) đã có |
| FR-VIII-29 | Quản lý ngày lễ | CRUD entity NGAY_LE cho SLA (BR-CALC-03) |

### FR refactor (4 FR)

| FR-ID | Thay đổi |
|---|---|
| FR-VIII-22 | Self-registration giờ CHỈ DN (KHÔNG NHT/TVV/CG/CB). 22 fields (19 thông tin DN + 3 TK). TK ở `CHO_KICH_HOAT`, role 'DN' gán sẵn. UC120 (cũ UC191) |
| FR-VIII-23 | VNeID đăng nhập KHÔNG tự tạo TK lần đầu — chặn nếu chưa có TK |
| FR-VIII-24 | VNeID đăng xuất — không đổi nhiều |
| FR-VIII-25 | Đồng bộ VNeID chỉ áp dụng DN/NHT/TVV/CG, **KHÔNG** cho CB nội bộ |

### Entity / SM / BR

- **Entity:** KHÔNG có entity mới (NGAY_LE đã có sẵn — chỉ thêm FR CRUD). TAI_KHOAN dùng sẵn `token_reset_mk` + `token_het_han`.
- **SM-TAIKHOAN:** thêm transition `CHO_KICH_HOAT → HOAT_DONG` (qua FR-VIII-26).
- **BR-AUTH-02 đổi tên:** "Phân cấp 3 tầng" → **"Cấu trúc 2 tầng TW → {BN, ĐP}"**. **Logic data scope KHÔNG đổi** — TW thấy all, BN thấy BN, ĐP thấy ĐP. Chỉ rename khái niệm.

### UC mapping đổi

| Cũ | Mới |
|---|---|
| FR-VIII-22 — UC191 | UC120 |
| FR-VIII-23 — UC192 | UC121 |
| FR-VIII-24 — UC193 | UC122 |
| FR-VIII-25 — UC194 | UC123 |

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-v3.md` (master) | 64 | **A FULL** | Tổng SRS — UC mapping mới, entity 51 NGAY_LE, AUDIT_LOG, BR-AUTH-01 VNeID, BR-CALC-03/SLA-04 (NGAY_LE ref), SM-TAIKHOAN, "phân quyền 3 cấp" rename |
| `srs-fr-02-hoi-dap.md` | 14 | **B DELTA** | CHO_KICH_HOAT enum, AUDIT_LOG, BR-CALC-03 SLA hỏi đáp, "3 tầng TW/BN/ĐP" rename |
| `srs-fr-04-chuyen-gia-tvv.md` | 4 | **B DELTA** | CHO_KICH_HOAT enum, "3 tầng" rename, AUDIT_LOG. **Đã có _DELTA-MAP-FR04 riêng**, đây là phần overlap |
| `srs-fr-05-vu-viec.md` | 9 | **B DELTA** | CHO_KICH_HOAT enum, BR-CALC-03 SLA, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK |
| `srs-fr-06-chi-tra.md` | 10 | **B DELTA** | BR-CALC-03 SLA chi trả, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK |
| `srs-fr-12-tv-chuyen-sau.md` | 12 | **B DELTA** | BR-AUTH-01 VNeID, AUDIT_LOG, DOANH_NGHIEP FK 4 lần |
| `srs-fr-13-tv-nhanh.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "3 tầng" rename, BR-AUTH-01 VNeID, AUDIT_LOG |
| `srs-fr-14-hop-dong-tv.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK |
| `srs-fr-15-ct-htpldn.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "TW/BN/ĐP" rename, AUDIT_LOG |
| `srs-fr-01-dashboard.md` | 6 | **C IMPACT** | BR-AUTH-01 VNeID Tier 3, BR-CALC-03 KPI-04 SLA, BR-AUTH-08 AUDIT_LOG. Smoke 2-3 KPI |
| `srs-fr-08-danh-gia.md` | 5 | **C IMPACT** | AUDIT_LOG, "3 tầng" rename, DOANH_NGHIEP FK |
| `srs-fr-09-bieu-mau.md` | 5 | **C IMPACT** | BR-AUTH-01 VNeID, BR-AUTH-08 AUDIT_LOG, BR-DATA-01/03/05 |
| `srs-fr-11-bao-cao.md` | 1 | **C IMPACT** | BR-DATA-05 AUDIT_LOG xem/xuất báo cáo |
| `srs-fr-16-api.md` | 4 | **C IMPACT** | AUDIT_LOG (consumer_id, endpoint), DOANH_NGHIEP FK |
| `srs-fr-03-dao-tao.md` | 1 | **D SKIP** | Chỉ 1 ref AUDIT_LOG generic |
| `srs-fr-07-doanh-nghiep.md` | 0 | **D SKIP** | Đã có _DELTA-MAP-FR07 riêng |

---

## 3. Findings critical

1. **BR-AUTH-02 rename "3 tầng → 2 tầng"** — cần BA confirm: thuật ngữ chỉ đổi cách gọi hay đổi cả logic? Bằng chứng cross-check (BR-AUTH-04 ở FR-01 line 702 vẫn nói "3 cấp") → có inconsistency. **Hỏi BA TRƯỚC khi update file QA**.
2. **FR-VIII-22 self-reg DN-only** — tất cả workflow test bắt đầu từ DN tự đăng ký, không còn CB NV tạo DN. Cần seed DN bằng API self-reg + auto kích hoạt qua FR-VIII-26.
3. **FR-VIII-26 trigger update SM-TVV và SM-NHT** — workflow test TVV/NHT phải bao gồm bước kích hoạt TK lần đầu (bước cuối cùng để TVV/NHT có thể đăng nhập + xuất hiện trong dropdown phân công).
4. **FR-VIII-29 NGAY_LE** — 4 module có SLA (FR-01 dashboard, FR-02 hỏi đáp, FR-05 vụ việc, FR-06 chi trả) cần seed data NGAY_LE trước khi test.
5. **FR-VIII-23 VNeID chặn TK chưa có** — test edge case: user lần đầu đăng nhập VNeID nhưng chưa có TK → expect ERR-VN-02, KHÔNG auto-create.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | Verify role 'DN' có sẵn (auto-gán khi self-reg). Thêm AUDIT_LOG read-only cho QTHT. NGAY_LE entity CRUD QTHT only |
| `input/data/seed-fixture.yaml` | Thêm fixture NGAY_LE (Tết, 30/4, 1/5, 2/9...). Đổi method seed DN: qua API self-reg thay vì SQL trực tiếp |
| `input/flow-module.md` | Cập nhật SM-TAIKHOAN thêm transition CHO_KICH_HOAT → HOAT_DONG. Thêm workflow kích hoạt TK lần đầu cho TVV/NHT |
| `output/funtion/7.10-*.md` (Quản trị) | Thêm 3 file functional test mới: FR-VIII-26 (Quên MK), FR-VIII-28 (Nhật ký), FR-VIII-29 (Ngày lễ). Update FR-VIII-22 (DN-only). Update FR-VIII-23/25 (VNeID logic) |
| `output/smoke-specs/6.10-smoke-*.md` | Thêm 3 smoke spec tương ứng |
| `output/smoke/6.10-sm-*.md` | Cập nhật SM-TAIKHOAN |
| `tasks/todo.md` | Thêm round mới — task seed NGAY_LE + workflow self-reg DN + workflow kích hoạt TK TVV/NHT + permission test AUDIT_LOG |
| `output/test-strategy.md` | Note thay đổi: BR-AUTH-02 rename, self-reg DN-only |
| `input/users.csv` | Verify TK QTHT có sẵn. Verify TK DN có thể test luồng self-reg (hoặc dùng tài khoản test mới) |

**KHÔNG động:**
- `srs-v3/srs-fr-10-quan-tri.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-10-quan-tri.md` — file delta source.

**Update terminology toàn bộ artifact QA** ("3 tầng" → "2 tầng" hoặc giữ "3 cấp dữ liệu"): chờ BA confirm trước khi sed find-replace.

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-VIII-22 (Self-reg DN)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1005-1090`.
- **Test/log bug FR-VIII-26 (Kích hoạt TK / Quên MK)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1241-1312`.
- **Test/log bug FR-VIII-28 (Nhật ký HT)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1314-1374`.
- **Test/log bug FR-VIII-29 (Ngày lễ)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line 1376-1436`.
- **Test/log bug FR-VIII-01 đến FR-VIII-21** (CRUD danh mục, vai trò, TK, đăng nhập/xuất) → vẫn cite `srs-v3/srs-fr-10-quan-tri.md:line N` nếu nội dung không đổi, hoặc cite file mới nếu line/section có thay đổi.
- **Mâu thuẫn BR-AUTH-02 (3 tầng vs 2 tầng):** log thành **bug SRS contradiction**, hỏi BA — KHÔNG tự suy luận.

---

## 6. Đáp án từ deep review SRS (2026-05-05)

| # | Câu hỏi | Đáp án | Bằng chứng |
|---|---|---|---|
| 8 | BR-AUTH-02 "3 tầng → 2 tầng" đổi logic? | **CHỈ RENAME, logic KHÔNG đổi.** "2 tầng" = cấu trúc đơn vị (TW→{BN,ĐP} ngang cấp song song, không nested). "3 cấp/3 loại đơn vị" = data scope (TW level + BN level + ĐP level). BR-AUTH-04 xác nhận: BN không có cấp con. Logic phân quyền giữ nguyên. **Khi update artifact QA: rename "3 tầng" → "2 tầng" về CẤU TRÚC, GIỮ "3 cấp/3 loại đơn vị" về DATA SCOPE.** | `srs-update-2026-5-5/srs-fr-10-quan-tri.md:2161` (BR-AUTH-02) + `:2173` (BR-AUTH-04) + `:293` (mô hình 2-tier 3 loại đơn vị) |
| 10 | Token vĩnh viễn FR-VIII-26 risk? | **Design intent rõ — chấp nhận tradeoff.** Token vĩnh viễn cho TVV/NHT chậm kích hoạt, mitigation = "1 lần dùng" + bị hủy sau dùng. **QA test edge case: token đã dùng lần 2 → ERR-PWD-04.** | `srs-update-2026-5-5/srs-fr-10-quan-tri.md:1273` + `:1280` |

## 7. Open issues — defer kiểm tra khi test

- **DN không email/chưa ĐKKD** (FR-VIII-22 bắt email): SRS không cover fallback. Khi gặp edge case real → log + hỏi BA.
- **NGAY_LE seed danh sách 2026:** SRS chỉ cover UI CRUD QTHT. Không cover initial seed. Khi cần seed real để test SLA → hỏi BA cấp file Excel chính thức.
- **UC mapping đổi (UC191-194 → UC120-123):** không có file CSV UC tracking trong project — bỏ qua, no impact.
