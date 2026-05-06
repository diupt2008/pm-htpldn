# Delta Map — FR-10 update (Quản trị Hệ thống)

> **Mục đích:** Tóm tắt phần thay đổi của `srs-update-2026-5-5/srs-fr-10-quan-tri.md` (2.284 dòng) so với `srs-v3/srs-fr-10-quan-tri.md` (1.975 dòng, Δ +309 dòng / +16%) — apply 14 Thay đổi nghiệp vụ + 5 fix V4-CHƯA-SỬA = 19 thay đổi.
> **Ngày tạo:** 2026-05-05 | **Cập nhật:** 2026-05-06 (expand từ 3 FR mới ban đầu lên 19 thay đổi đầy đủ).
> **Source:** CHANGELOG-v3-to-v3.5.md line 1129-1318.
> **Tác giả:** QA + Claude

---

## 1. Có gì mới / đổi / xoá

### FR mới (3 FR)

| FR-ID | Tên | Note |
|---|---|---|
| FR-VIII-26 | Quên mật khẩu / Kích hoạt tài khoản lần đầu | Workflow chung 2 case (kích hoạt TK lần đầu + reset password). Trigger update SM-TVV và SM-NGUOI_HO_TRO. Inputs 4 trường, Processing 14 bước, 6 errors chống enumerate email với INFO trung tính |
| FR-VIII-28 | Nhật ký hệ thống `[GAP-VIII-02]` | Inputs filter, 6 bước Processing với cap 90 ngày + paginate 50/trang + export Excel max 10.000 dòng, 2 errors, 3 acceptance |
| FR-VIII-29 | Quản lý ngày lễ `[GAP-VIII-05]` | CRUD entity NGAY_LE + import Excel, calendar view, 5 trường Inputs, 6 bước Processing, 3 errors, 3 acceptance |

### FR refactor (5 FR)

| FR-ID | Thay đổi |
|---|---|
| FR-VIII-06 | **CHUYỂN** sang FR-04 — DM Tổ chức TV → entity riêng FR-IV-NEW-01. Tab dọc 14 → 13 tab. UC range bỏ UC104 |
| **FR-VIII-22** | **ĐẠI TU** — DN tự đăng ký only, **username = MST** (regex `^\d{10}$`, cite TT 105/2020 Đ.5), **21 trường Inputs**, **`tinh_thanh_id` FK DANH_MUC** (cite QĐ 124/2004), **email Phương án B** (UI 1 ô / 2 cột), **`cam_ket_thong_tin_dung_su_that`**, 11 bước Processing **bypass CHO_PHAN_QUYEN**, 6 errors, 5 postconditions, 7 acceptance. UC191 → **UC120** |
| FR-VIII-23 | VNeID đăng nhập KHÔNG tự tạo TK lần đầu — chặn nếu chưa có TK. Thêm **ERR-VN-04** (CB nội bộ chặn). UC192 → UC121 |
| FR-VIII-24 | VNeID đăng xuất — không đổi nhiều. UC193 → UC122 |
| FR-VIII-25 | Đồng bộ VNeID chỉ áp dụng DN/NHT/TVV/CG, **KHÔNG** cho CB nội bộ. Tách 2 luồng (manual + scheduled). UC194 → UC123 |
| FR-VIII-15 | **Workflow gọi TỰ ĐỘNG** từ FR-IV-07 (TVV/CG) + FR-IV-NHT-01 (NHT). Tác nhân thêm "Hệ thống (gọi tự động từ workflow khác)" |

### Entity / SM / BR

**Entity:**
- **NGAY_LE** — đã có sẵn (chỉ thêm FR CRUD VIII-29). Volume 5-10 record/năm.
- **TAI_KHOAN** — dùng sẵn `token_reset_mk` + `token_het_han`. Thêm `username` regex (4 cách sinh: MST cho DN; auto cho TVV/CG/NHT theo họ tên + suffix số; manual cho CB nội bộ; auto cho admin).
- **DON_VI** — thêm `tinh_thanh_id` FK DANH_MUC TINH_THANH (GSO 01-63 theo QĐ 124/2004); `don_vi_cha_id` ràng buộc NULL khi `cap=TW`, = TW khi `cap=BN/DP`.
- **DOANH_NGHIEP** — `email` (kênh login) phải KHÁC `DOANH_NGHIEP.email` doanh nghiệp (BR-AUTH-EMAIL-01).

**State Machine — SM-TAIKHOAN:** **4 → 5 trạng thái** (`[GAP-VIII-01]`):
- Thêm `CHO_PHAN_QUYEN` (chờ QTHT gán vai trò + đơn vị).
- 8 transitions với 2 transition mới: `CHO_KICH_HOAT → CHO_PHAN_QUYEN` (lần đầu) + `CHO_PHAN_QUYEN → HOAT_DONG` (sau gán quyền).
- DN tự đăng ký **bypass** CHO_PHAN_QUYEN (đi thẳng `CHO_KICH_HOAT → HOAT_DONG`).

**BR mới (4 BR):**

| BR-ID | Nội dung |
|---|---|
| BR-AUTH-09 | Cán bộ nội bộ chỉ Tier 1 — không được dùng VNeID (mạng kín nội bộ) |
| BR-AUTH-USERNAME-01 | Quy tắc sinh username 4 nguồn (MST cho DN, auto cho TVV/CG/NHT, manual cho CB, auto cho admin) |
| BR-AUTH-EMAIL-01 | `TAI_KHOAN.email` (kênh login) phải KHÁC `DOANH_NGHIEP.email` (kênh nhận thông báo DN) — Phương án B 2 cột |
| BR-INTG-06 | Đổi tên + nội dung VNeID OIDC (NĐ 69/2024) thay VNPT eKYC cũ |

### Quy tắc nghiệp vụ đổi (lớn)

| Quy tắc | Cũ | Mới |
|---|---|---|
| **Cấu trúc DON_VI** | "3 tầng (TW→BN→ĐP)" — cây nested | **"2 tầng (TW→{BN, ĐP})"** — BN/ĐP ngang cấp song song. **Logic data scope KHÔNG đổi** (TW thấy all, BN thấy BN, ĐP thấy ĐP). Chỉ rename concept |
| **BR-AUTH-02** tên | "Phân quyền 3 tầng" | **"Cấu trúc 2 tầng TW → {BN, ĐP}"** |
| **BR-AUTH-04** | (chưa rõ) | "Chỉ TW thấy cấp con" |
| **BR-AUTH-01** mô hình auth | 3-tier (Tier 1 + VNPT eKYC + VNeID) | **2-tier:** Tier 1 nội bộ qua mạng kín + Tier 2 SSO VNeID (Internet-facing). **Bỏ VNPT eKYC** |
| Username DN tự đăng ký | (form input) | **MST** (10 chữ số, UNIQUE) |
| Mật khẩu | 8 ký tự + chữ hoa + chữ thường + số | **+ ký tự đặc biệt** (`[GAP-VIII-04]`). Áp ở FR-VIII-15 + FR-VIII-22 + FR-VIII-26 + SCR-VIII-03 + SCR-VIII-08 |
| SCR-VIII-06 Tab 3 Mẫu phản hồi | Đơn giản | **Mô hình B Hybrid 2 tầng** (CĐT chốt 2026-05-02): tab gating per-role + filter Phạm vi/Lĩnh vực/Trạng thái + bảng cột Phạm vi badge + Tác giả + Số lần dùng + element gating per role |
| BR-SLA-02 nhãn FE | Mã DB | **"Trong hạn / Sắp hết hạn / Quá hạn / Quá hạn nghiêm trọng"** (BA chốt 2026-05-04) |
| FR-VIII-23/25 actor | Bao gồm CB nội bộ | **Loại trừ CB nội bộ** (BR-AUTH-09) |

### UC mapping đổi

| Cũ | Mới |
|---|---|
| FR-VIII-22 — UC191 | **UC120** |
| FR-VIII-23 — UC192 | **UC121** |
| FR-VIII-24 — UC193 | **UC122** |
| FR-VIII-25 — UC194 | **UC123** |

### 5 fix V4-CHƯA-SỬA (đồng bộ vào cả v4 + v3.5 ngày 2026-05-06)

| Fix | Nội dung |
|---|---|
| **C.1** | SCR-VIII-03 row 20 password thêm "ký tự đặc biệt" — đồng bộ với FR-VIII-15 ERR-TK-03 + SCR-VIII-08 row 20 |
| **C.2** | §6 Tổng quan BR cột "Áp dụng FR" mở rộng cho 7 BR (BR-AUTH-01/08, BR-DATA-01/02/03/05/07) bao trùm các FR mới VIII-22-29 (trừ FR-VIII-06 đã chuyển) |
| **C.3** | SM-TAIKHOAN "Tham chiếu FR" sửa từ `FR-VIII-18 đến FR-VIII-21` → `FR-VIII-15, FR-VIII-20-22, FR-VIII-26` (FR-VIII-18 là DM Loại hình tiếp nhận, không liên quan TK) |
| **C.4** | SM bảng chuyển trạng thái dòng `[*] → CHO_KICH_HOAT` đổi FR Ref `FR-VIII-18` → `FR-VIII-15` (cùng lý do C.3) |
| **C.5** | SCR-VIII-03 cột Hành động thêm nút **"Phân quyền"** cho TK `CHO_PHAN_QUYEN` (gán vai trò + đơn vị → chuyển HOAT_DONG) — đồng bộ với SM-TAIKHOAN transition Thay đổi 7 |

### Số FR / UC

- v3: 25 FR, UC 99-119 + 191-194 → v3.5: **27 FR**, UC 99-123 (gốc 25 + VIII-26/28/29; VIII-06 đã chuyển sang FR-04).

---

## 2. Module bị ảnh hưởng — phân nhóm theo Rule 4

| File SRS | Số ref | Nhóm | Test scope |
|---|---|---|---|
| `srs-fr-10-quan-tri.md` (self) | — | **A FULL** | 14 Thay đổi + 5 fix; FR mới VIII-26/28/29; FR-VIII-22 đại tu; SM-TAIKHOAN 5 states; 4 BR mới |
| `srs-v3.md` (master) | 64 | **A FULL** | UC mapping mới, entity NGAY_LE/AUDIT_LOG, BR-AUTH-01 VNeID, BR-CALC-03/SLA-04, SM-TAIKHOAN, "phân quyền 3 cấp" rename, 4 BR mới |
| `srs-fr-04-chuyen-gia-tvv.md` | Phụ thuộc — FR-IV-07 (TVV/CG) + FR-IV-NHT-01 (NHT) workflow tự cấp TK | **A FULL** (đã có _DELTA-MAP-FR04 riêng) | Đồng bộ FR-VIII-15 gọi tự động |
| `srs-fr-02-hoi-dap.md` | 14 | **B DELTA** | CHO_KICH_HOAT enum, AUDIT_LOG, BR-CALC-03 SLA hỏi đáp, "3 tầng → 2 tầng" rename, **FR-II-NEW-01/02 cho Mẫu phản hồi Mô hình B** (`[GAP-VIII-03]`) |
| `srs-fr-05-vu-viec.md` | 9 | **B DELTA** | CHO_KICH_HOAT enum, BR-CALC-03 SLA, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK |
| `srs-fr-06-chi-tra.md` | 10 | **B DELTA** | BR-CALC-03 SLA chi trả, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK, DON_VI 2 tầng |
| `srs-fr-07-doanh-nghiep.md` | Phụ thuộc — DN tự đăng ký qua FR-VIII-22 đại tu | **A FULL** (đã có _DELTA-MAP-FR07) | DOANH_NGHIEP.email khác TAI_KHOAN.email |
| `srs-fr-12-tv-chuyen-sau.md` | 12 | **B DELTA** | BR-AUTH-01 VNeID, AUDIT_LOG, DOANH_NGHIEP FK 4 lần |
| `srs-fr-13-tv-nhanh.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "3 tầng" rename, BR-AUTH-01 VNeID, AUDIT_LOG |
| `srs-fr-14-hop-dong-tv.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "3 tầng" rename, AUDIT_LOG, DOANH_NGHIEP FK |
| `srs-fr-15-ct-htpldn.md` | 6 | **B DELTA** | CHO_KICH_HOAT enum, "TW/BN/ĐP" rename, AUDIT_LOG |
| `srs-fr-01-dashboard.md` | 6 | **C IMPACT** | BR-AUTH-01 VNeID Tier 2, BR-CALC-03 KPI-04 SLA, BR-AUTH-08 AUDIT_LOG. Smoke 2-3 KPI |
| `srs-fr-08-danh-gia.md` | 5 | **C IMPACT** | AUDIT_LOG, "3 tầng" rename, DOANH_NGHIEP FK |
| `srs-fr-09-bieu-mau.md` | 5 | **B DELTA** | BR-AUTH-01 VNeID, BR-AUTH-08 AUDIT_LOG, BR-DATA-01/03/05 (đã apply qua FR-09 changelog Thay đổi 4) |
| `srs-fr-11-bao-cao.md` | 1 | **C IMPACT** | BR-DATA-05 AUDIT_LOG xem/xuất báo cáo |
| `srs-fr-16-api.md` | 4 | **C IMPACT** | AUDIT_LOG (consumer_id, endpoint), DOANH_NGHIEP FK |
| `srs-fr-03-dao-tao.md` | 1 | **D SKIP** | Chỉ 1 ref AUDIT_LOG generic |

---

## 3. Findings critical (ưu tiên test)

1. **FR-VIII-22 đại tu** — luồng test mới hoàn toàn: DN nhập 21 trường, MST làm username, email Phương án B (1 ô / 2 cột), cam kết thông tin → bypass CHO_PHAN_QUYEN. Test edge case: MST trùng → ERR-REG-01a; email trùng DOANH_NGHIEP.email → reject; thiếu cam kết → reject.
2. **SM-TAIKHOAN 4 → 5 states** — toàn bộ test case cũ verify SM 4 state INVALID. Cần test transition mới `CHO_KICH_HOAT → CHO_PHAN_QUYEN → HOAT_DONG` (TVV/CG/NHT/CB) vs `CHO_KICH_HOAT → HOAT_DONG` (DN bypass).
3. **BR-AUTH-09 mới — CB nội bộ KHÔNG dùng VNeID** — test edge case: CB nội bộ click VNeID → ERR-VN-04.
4. **Password "ký tự đặc biệt"** — toàn bộ password cũ KHÔNG có ký tự đặc biệt → fail validation. Test 5 vị trí: FR-VIII-15, FR-VIII-22, FR-VIII-26, SCR-VIII-03, SCR-VIII-08.
5. **BR-AUTH-02 "3 tầng → 2 tầng"** — chỉ rename concept, logic data scope GIỮ NGUYÊN. Verify: TW thấy all, BN thấy BN, ĐP thấy ĐP — không đổi. Khi update artifact QA: rename "3 tầng" → "2 tầng" về CẤU TRÚC, GIỮ "3 cấp/3 loại đơn vị" về DATA SCOPE.
6. **FR-VIII-15 gọi tự động từ FR-04** — test cross-module: tạo TVV qua FR-IV-07 → verify TAI_KHOAN auto-tạo + role TVV gán sẵn + state CHO_KICH_HOAT.
7. **SCR-VIII-06 Tab 3 Mẫu phản hồi Mô hình B Hybrid** — test gating per-role: QTHT thấy đủ; CB NV TW thấy TW_QUOC_GIA + BN_RIENG + DP_RIENG (read); CB NV BN thấy BN_RIENG own + TW_QUOC_GIA (read); CB NV ĐP thấy DP_RIENG own + TW_QUOC_GIA (read).
8. **NGAY_LE seed data** — 4 module có SLA (FR-01 dashboard, FR-02 hỏi đáp, FR-05 vụ việc, FR-06 chi trả) cần seed NGAY_LE trước khi test SLA.
9. **FR-VIII-26 trigger update SM-TVV/SM-NHT** — workflow test TVV/NHT phải bao gồm bước kích hoạt TK lần đầu (bước cuối để TVV/NHT đăng nhập + xuất hiện trong dropdown phân công).
10. **5 fix V4-CHƯA-SỬA** — test verify đồng bộ: SCR-VIII-03 password "ký tự đặc biệt" + nút Phân quyền + SM header FR ref đúng.

---

## 4. File QA cần update (KHÔNG động SRS gốc)

| File QA | Update gì |
|---|---|
| `output/permission-matrix.md` | Verify role 'DN' có sẵn (auto-gán khi self-reg). Thêm AUDIT_LOG read-only cho QTHT. NGAY_LE entity CRUD QTHT only. **Thêm transition CHO_PHAN_QUYEN cho TK của TVV/CG/NHT/CB** |
| `output/permission-matrix-by-fr.md` + `by-role.md` | Thêm 3 FR mới (VIII-26/28/29); bỏ FR-VIII-06 (chuyển sang FR-04); thêm BR-AUTH-09 áp CB nội bộ; thêm SCR-VIII-08 (form đăng ký DN) |
| `input/data/seed-fixture.yaml` | Thêm fixture NGAY_LE (Tết, 30/4, 1/5, 2/9...). Đổi method seed DN: qua API self-reg với username=MST + 21 trường. Update password rule "ký tự đặc biệt" cho test data. Verify mau_phan_hoi_variants với 3 phạm vi Mô hình B (TW_QUOC_GIA / BN_RIENG / DP_RIENG) |
| `input/quy-trinh-nghiep-vu/flow-module.md` | **SM-TAIKHOAN: 4 → 5 states** với transition mới CHO_KICH_HOAT → CHO_PHAN_QUYEN → HOAT_DONG. Workflow kích hoạt TK lần đầu cho TVV/NHT. DN bypass CHO_PHAN_QUYEN |
| `input/quy-trinh-nghiep-vu/02-thu-tu-module.md` | Bảng SM-TAIKHOAN refresh 5 states. Bỏ FR-VIII-06 (DM TC TV — đã move). DN tự đăng ký MST workflow |
| `input/quy-trinh-nghiep-vu/01-tong-quan-nghiep-vu.md` | Update mô hình 2 tầng + 2-tier auth + bỏ VNPT eKYC |
| `output/funtion/7.10-quan-tri-he-thong.md` | **Refactor lớn** — thêm 3 file functional test mới: FR-VIII-26 (Quên MK + Kích hoạt TK lần đầu), FR-VIII-28 (Nhật ký HT), FR-VIII-29 (Ngày lễ). **Đại tu FR-VIII-22** test plan (username=MST, 21 trường, email Phương án B, bypass CHO_PHAN_QUYEN). Update FR-VIII-23/25 (BR-AUTH-09 chặn CB nội bộ). Update FR-VIII-15 workflow tự cấp. Bỏ FR-VIII-06 (chuyển sang FR-04). Thêm test 5 fix V4-CHƯA-SỬA (C.1-C.5) |
| `output/smoke-specs/6.10-smoke-taikhoan.md` | Thêm 3 smoke spec tương ứng + smoke MST format + email Phương án B + nút Phân quyền |
| `output/smoke/6.10-sm-taikhoan.md` | Cập nhật SM-TAIKHOAN: 5 states + 8 transitions + 2 luồng song song (TVV/CG/NHT/CB qua CHO_PHAN_QUYEN vs DN bypass) |
| `tasks/todo.md` | Thêm task R7: workflow self-reg DN MST + workflow kích hoạt TK TVV/NHT/CB qua CHO_PHAN_QUYEN + permission test AUDIT_LOG + verify 5 fix V4-CHƯA-SỬA |
| `output/test-strategy.md` | Note: SRS update FR-10 — 14 Thay đổi + 5 fix V4-CHƯA-SỬA = 19 thay đổi. Scope mở rộng 3 FR mới + đại tu FR-VIII-22 + 4 BR mới + SM-TAIKHOAN 5 states |
| `input/users.csv` | Verify TK QTHT có sẵn. Verify TK DN có thể test luồng self-reg (hoặc dùng tài khoản test mới). Update password test data với "ký tự đặc biệt" |

**KHÔNG động:**
- `srs-v3/srs-fr-10-quan-tri.md` — file SRS gốc, ownership BA.
- `srs-update-2026-5-5/srs-fr-10-quan-tri.md` — file delta source.

**Update terminology toàn bộ artifact QA:** rename "3 tầng" → "2 tầng" về **cấu trúc**, GIỮ "3 cấp / 3 loại đơn vị" về **data scope** (BA chốt 2026-05-06).

---

## 5. Quy tắc tra cứu khi test / log bug

- **Test/log bug FR-VIII-22 (Self-reg DN MST)** → cite `srs-update-2026-5-5/srs-fr-10-quan-tri.md:line N` (Thay đổi 5).
- **Test/log bug FR-VIII-26 (Kích hoạt TK / Quên MK)** → cite Thay đổi 8.
- **Test/log bug FR-VIII-28 (Nhật ký HT)** → cite Thay đổi 9.
- **Test/log bug FR-VIII-29 (Ngày lễ)** → cite Thay đổi 10.
- **Test/log bug DON_VI 2 tầng** → cite Thay đổi 1 + BR-AUTH-02/04.
- **Test/log bug BR-AUTH-09** → cite Thay đổi 3 + ERR-VN-04.
- **Test/log bug password "ký tự đặc biệt"** → cite Thay đổi 11 + GAP-VIII-04. Áp 5 vị trí.
- **Test/log bug Mẫu phản hồi Mô hình B** → cite Thay đổi 13 + memory `project_mau_phan_hoi_mo_hinh_b`. Cross-ref FR-II-NEW-01/02 ở srs-fr-02-hoi-dap.md (`[GAP-VIII-03]` chờ Pha 3).
- **Test/log bug FR-VIII-01 đến FR-VIII-21** (CRUD danh mục, vai trò, TK, đăng nhập/xuất) — vẫn cite `srs-v3/srs-fr-10-quan-tri.md:line N` nếu nội dung không đổi, hoặc cite file mới nếu line/section có thay đổi.
- **Mâu thuẫn `dia_ban_id`/`la_cong_khai`/SM 4 state cũ** → log thành **bug data migration** hoặc **bug SRS contradiction**, hỏi BA — KHÔNG tự suy luận.

---

## 6. Open issues — defer kiểm tra khi test

### D.1 Cite pháp lý chưa web-verify

- **TT 105/2020/TT-BTC Điều 5** (MST 10 chữ số đơn vị độc lập) — cite ở FR-VIII-22 Inputs row 2, ERR-REG-01a, BR-AUTH-USERNAME-01. ⚠️ Chưa verify nội dung Điều 5 cụ thể.
- **QĐ 124/2004/QĐ-TTg** (mã GSO 01-63 tỉnh thành) — cite ở FR-VIII-22 Inputs row 5, SCR-VIII-08 row 5, Entity DON_VI tinh_thanh_id. ⚠️ Chưa verify còn hiệu lực + chưa có QĐ thay thế.
- **NĐ 69/2024** (SSO VNeID — BR-AUTH-01 / BR-INTG-06) — chưa verify, IN theo v4.

### D.2 Câu hỏi nghiệp vụ chờ BA

- **Q1:** CHO_PHAN_QUYEN còn dùng cho ai sau khi DN bypass? Đề xuất giữ làm dự phòng admin migration; cần BA xác nhận.
- **Q2:** SCR-VIII-08a (QTHT duyệt TK) còn dùng được? Đề xuất chuyển thành màn hình duyệt TK chung khi có TK CHO_PHAN_QUYEN.
- **Q3:** Quy trình TVV/CG/NHT đặt MK lần đầu sau khi nhận TK auto-cấp (FR-IV-07/FR-IV-NHT-01) — cross-check với FR-04 ở Pha 3.
- **Q4:** Tập ký tự đặc biệt cụ thể trong chính sách mật khẩu — cần BA chốt regex (vd `!@#$%^&*()_+-=[]{}|;:,.<>?`).
- **Q5:** FR-II-NEW-01/02 ở srs-fr-02-hoi-dap.md có đúng tồn tại — Pha 3 cross-file consistency check.

### Defer khi test

- **DN không email/chưa ĐKKD** (FR-VIII-22 bắt email): SRS không cover fallback. Khi gặp edge case real → log + hỏi BA.
- **NGAY_LE seed danh sách 2026:** SRS chỉ cover UI CRUD QTHT. Không cover initial seed. Khi cần seed real để test SLA → hỏi BA cấp file Excel chính thức.
- **Token vĩnh viễn FR-VIII-26** cho TVV/NHT chậm kích hoạt: design intent rõ — chấp nhận tradeoff. Mitigation = "1 lần dùng" + bị hủy sau dùng. QA test edge case: token đã dùng lần 2 → ERR-PWD-04.
- **UC mapping đổi (UC191-194 → UC120-123):** không có file CSV UC tracking trong project — bỏ qua, no impact.

---

## 7. Đáp án đã verify (2026-05-05/06)

| Câu | Đáp án | Bằng chứng |
|---|---|---|
| BR-AUTH-02 "3 tầng → 2 tầng" đổi logic? | **CHỈ RENAME, logic KHÔNG đổi.** "2 tầng" = cấu trúc đơn vị (TW→{BN, ĐP} ngang cấp song song). "3 cấp / 3 loại đơn vị" = data scope (TW level + BN level + ĐP level). BR-AUTH-04 xác nhận: BN không có cấp con. Logic phân quyền giữ nguyên | `srs-update-2026-5-5/srs-fr-10-quan-tri.md:2161` (BR-AUTH-02) + `:2173` (BR-AUTH-04) + `:293` (mô hình 2-tier 3 loại đơn vị) |
| Token vĩnh viễn FR-VIII-26 risk? | **Design intent rõ — chấp nhận tradeoff.** Token vĩnh viễn cho TVV/NHT chậm kích hoạt, mitigation = "1 lần dùng" + bị hủy sau dùng. QA test edge case: token đã dùng lần 2 → ERR-PWD-04 | `srs-update-2026-5-5/srs-fr-10-quan-tri.md:1273` + `:1280` |
