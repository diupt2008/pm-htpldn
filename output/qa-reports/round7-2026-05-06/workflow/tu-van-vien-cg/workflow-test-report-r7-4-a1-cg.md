# Workflow test report — R7.4.A1-CG Advance 8 CG → HOAT_DONG (renamed)

**Latest round:** R8b 2026-05-08 · **Initial round:** R7 2026-05-06
**Accounts:** `qtht_02` (verify list) · `cb_nv_tw_02` (thẩm định + trình duyệt) · `cb_pd_tw_02` (phê duyệt) · `cb_nv_dp_02` + `cb_pd_dp_02` (BR-AUTH-08 deny test)
**SRS ref:** SM-TVV 10 state v3.5 ([6.4-sm-tvv.md](../../../../smoke/6.4-sm-tvv.md)) · FR-IV-08/09/10 functional ([7.4-chuyen-gia-tvv.md](../../../../funtion/7.4-chuyen-gia-tvv.md)) · FR-VIII-15 (auto TK) · BR-AUTH-05 + BR-AUTH-08 + BR-LEGAL-04 + BR-FLOW-04
**Scope:** TP-TVV-01 (advance happy path) cho 6 CG — KHÔNG cover TP-02..09 (YEU_CAU_BO_SUNG/TU_CHOI/TAM_DUNG/VO_HIEU_HOA/khôi phục — thuộc R7.4.A1 gốc).

## Verdict (LATEST — R8b 2026-05-08)

✅ **PASS — 14/14** sau dev rebuild. BUG-CG-A1-001 confirmed **Closed-verified**: rename `DANG_HOAT_DONG → HOAT_DONG` ✅, state `CHO_KICH_HOAT` enum + tab UI ✅, new workflow phê duyệt → `CHO_KICH_HOAT` ✅.

## R8b Round (LATEST — 2026-05-08 verify post dev rebuild)

### Re-verify gates (3/3 ✅)

| Gate | Verify command | R8b result |
|---|---|---|
| BE rename `DANG_HOAT_DONG → HOAT_DONG` | `GET /api/v1/tu-van-viens?loaiTvv=CG&trangThai=DANG_HOAT_DONG` | 200 + count=0 ✅ enum legacy deprecated |
| BE rename target | `GET /api/v1/tu-van-viens?loaiTvv=CG&trangThai=HOAT_DONG` | 200 + count=8 ✅ rename applied |
| State `CHO_KICH_HOAT` enum valid | `GET /api/v1/tu-van-viens?trangThai=CHO_KICH_HOAT` | 200 + count=2 (TVV-0013 + TVV-0009) ✅ enum + populated |
| UI tab "Chờ kích hoạt tài khoản" | SCR-IV-01 list page | uid=47_40 ✅ tab present, click filter → 2 records visible |
| Spot-check legacy CG state | `GET /api/v1/tu-van-viens/{TVV-0001}` | `trangThai: "HOAT_DONG"` ✅ rename applied |
| New workflow → CHO_KICH_HOAT | TVV-0013 (R7.4.A1 R8b) + TVV-0014 (R8 verify-2) | Both POST `/phe-duyet` → `trangThai: "CHO_KICH_HOAT"` ✅ |

### Pool sau R8b

| Filter | Count | Distribution |
|---|:-:|---|
| `?loaiTvv=CG&size=100` | 8 | HOAT_DONG:8 |
| `?loaiTvv=TVV&size=100` | 8 | CHO_PHE_DUYET:1, TU_CHOI:3, HOAT_DONG:1, CHO_KICH_HOAT:2, YEU_CAU_BO_SUNG:1 |
| `?trangThai=CHO_KICH_HOAT` | 2 | TVV-0013 Hoàng Văn Năm (R8b approved) + TVV-0009 Nguyễn Văn Tư Vấn (R7 stuck) |

### Bug status update R8b

| Bug ID | R7 status | R8 verify-1 | R8 verify-2 (16:47) | R8b verify | Final |
|---|:-:|:-:|:-:|:-:|:-:|
| BUG-CG-A1-001 (state name) | Open Major | 🔴 Open (TVV-0007 legacy) | ✅ Closed (TVV-0014 fresh) | ✅ Closed (rename + enum + tab + workflow) | **Closed-verified** |

> **Reconciling conflicting retests:** R8 verify-1 (early R8) tested TVV-0007 — a legacy record approved BEFORE dev fix. BE doesn't migrate legacy enum retroactively in real-time. R8 verify-2 (16:47) tested TVV-0014 — fresh approval after fix → CHO_KICH_HOAT correct. R8b confirms via TVV-0013 (R7.4.A1) + 3 enum API gates + 1 UI tab gate. The R8 verify-1 "still open" claim was on stale evidence.

### Evidence (R8b)
- [`evidence-r7-4-a1/R8b-CG-tab-cho-kich-hoat-2records.png`](evidence-r7-4-a1/R8b-CG-tab-cho-kich-hoat-2records.png) — Tab "Chờ kích hoạt tài khoản" + 2 TVV records
- API responses captured live (qtht_02 session) + cross-confirm via TVV-0013 R8b workflow report

---

## Verdict (R7 2026-05-06 — initial)

⚠️ **DONE_WITH_CONCERNS** — **13/14 PASS** (sau khi unblock TC-07 + TC-14 qua R7.7.8a + R7.7.8d ngày 2026-05-07), 1/14 ⚠️ DEVIATION (BUG-CG-A1-001 state name DANG_HOAT_DONG vs CHO_KICH_HOAT — chờ DEV BE migrate enum).

## Pool sau test

| Mã | Tên | State | TK | Note |
|---|---|:-:|---|---|
| TVV-BTP-TW-0001 | Lý Thị Mười Ba | DANG_HOAT_DONG | d99760d8 | R7.2.6 + advance |
| TVV-BTP-TW-0002 | Đinh Văn Mười Bốn | DANG_HOAT_DONG | 4b732377 | R7.2.6 + advance |
| TVV-BTP-TW-0003 | Ngô Thị Mười Lăm | DANG_HOAT_DONG | 35b47430 | R7.2.6 + advance |
| TVV-BTP-TW-0004 | Trương Văn Mười Sáu | DANG_HOAT_DONG | 56ab1973 | R7.2.6 + advance |
| TVV-BTP-TW-0005 | Mai Thị Mười Bảy | DANG_HOAT_DONG | 46865350 | R7.2.6 + advance |
| TVV-BTP-TW-0006 | Hồ Văn Mười Tám | DANG_HOAT_DONG | 20814c0b | R7.2.6 + advance |
| TVV-BTP-TW-0007 | Probe CG R7.4.A1 Permission Test | DANG_HOAT_DONG | fdfafbed | NEW for TC-A1 advance verification |
| TVV-BTP-TW-0008 | Probe CG R7.4.A1 OptLock Test | DANG_HOAT_DONG | 5a57bd1d | NEW for TC-12 + cleanup advance |

Filter `?loaiTvv=CG&size=100` → `total=8, byState={DANG_HOAT_DONG: 8}`.

## Test Case Matrix

| TC ID | Mô tả | Loại | P | Status | Evidence |
|---|---|:-:|:-:|:-:|---|
| TC-CG-A1-01 | Pool 8 CG (6 cũ + 2 mới) verify trạng thái pre-advance | Setup | P0 | ✅ | `byState: {MOI_DANG_KY:2, DANG_HOAT_DONG:6}` |
| TC-CG-A1-02 | TVV-008 BR-LEGAL-04 — thẩm định 4 nhóm tiêu chí (Nhóm 1+4 boolean, Nhóm 2 thang 1-5, Nhóm 3 nullable) | Workflow | P0 | ✅ | TVV-0007 POST `/tham-dinh` body `{nhom1KetQua:true,nhom2Diem:80,nhom3Diem:null,nhom4ThamGia:true,ketLuan:DAT,version:1,trinhDuyet:false}` → 200 |
| TC-CG-A1-03 | MOI_DANG_KY → DANG_THAM_DINH (BE skip CHO_THAM_DINH — R7.4.A2 covers explicit) | Workflow | P0 | ✅ | TVV-0007 state v1→v2 sau step 1 |
| TC-CG-A1-04 | DANG_THAM_DINH → CHO_PHE_DUYET (`trinhDuyet:true`) | Workflow | P0 | ✅ | TVV-0007 state v2→v3 |
| **TC-CG-A1-05** | TVV-011 — CB PD phê duyệt → **CHO_KICH_HOAT** per spec | Workflow | P0 | ⚠️ **DEVIATION** | BE returns `DANG_HOAT_DONG`, spec yêu cầu `CHO_KICH_HOAT`. Bug **BUG-CG-A1-001** (Major) |
| TC-CG-A1-06 | TVV-011 — Auto-tạo TK qua FR-VIII-15 step 6 | Workflow | P0 | ✅ | TVV-0007 `taiKhoanId: fdfafbed-...` post-approval |
| TC-CG-A1-07 | TK state = CHO_KICH_HOAT (per spec) | Workflow | P0 | ✅ **UNBLOCKED 2026-05-07** | Qua R7.7.8a UI: endpoint `GET /api/v1/tai-khoan?trangThai=...` (singular). Tab "Chờ kích hoạt 4" gồm `probe_perm` + `probe_optlock` + `nht_04_ui` + `qa_test_tk_r778a`. 6 CG cũ TVV-0001..0006 TK `Hoạt động` (đã activate qua R7.2.9 mail). Đúng spec |
| TC-CG-A1-08 | ngayCongNhan auto-set | Workflow | P1 | ✅ | TVV-0007 `ngayCongNhan: 2026-05-06` |
| TC-CG-A1-09 | Mail kích hoạt gửi MailHog (TVV-012a, FR-VIII-26) | Workflow | P1 | ✅ | MailHog inbox `probe.perm@test.htpldn.vn` có mail "Hồ sơ TVV đã được phê duyệt" với `username: probe_perm` + MK tạm |
| TC-CG-A1-10 | TVV-027 — CB PD ĐP cố phê duyệt TVV TW (BR-AUTH-05/08) | Auth | P0 | ✅ | `cb_pd_dp_02` POST `/phe-duyet` TVV-0008 → **403 ERR-AUTH-VPD-00-01** |
| TC-CG-A1-11 | CB NV ĐP cố thẩm định TVV TW (BR-AUTH-08) | Auth | P0 | ✅ | `cb_nv_dp_02` POST `/tham-dinh` TVV-0008 → **403 ERR-AUTH-VPD-00-01** + GET detail cũng 403 |
| TC-CG-A1-12 | Optimistic lock — stale `version: 999` → 409 | Edge | P1 | ✅ | TVV-0008 POST `/tham-dinh` `version:999` → **409 ERR-STATE-LOCK-409** "Dữ liệu đã bị thay đổi bởi người dùng khác" |
| TC-CG-A1-13 | loai_tvv=CG preserved qua transitions | Data | P0 | ✅ | 8/8 records `loaiTvv: "CG"` |
| TC-CG-A1-14 | Audit log entry per transition (FR-VIII-28) | Audit | P1 | ✅ **UNBLOCKED 2026-05-07** | Qua R7.7.8d UI: endpoint `GET /api/v1/audit-logs?entityType=TU_VAN_VIEN`. Filter trả 56 entries cover 8 CG, mỗi CG có Tạo mới + 2 THAM_DINH + 1 PHE_DUYET. Screenshot [r7-7-8d-audit-tvv-transitions.png](r7-7-8d-audit-tvv-transitions.png) |

## API endpoints xác nhận

| Step | Method | Path | Body | Effect |
|---|---|---|---|---|
| Thẩm định | POST | `/api/v1/tu-van-viens/{id}/tham-dinh` | `{nhom1KetQua, nhom2Diem, nhom3Diem (nullable), nhom4ThamGia, ketLuan: 'DAT'\|'KHONG_DAT'\|'YEU_CAU_BO_SUNG', version, trinhDuyet: bool}` | trinhDuyet=false: MOI_DANG_KY → DANG_THAM_DINH (BE skip CHO_THAM_DINH). trinhDuyet=true: DANG_THAM_DINH → CHO_PHE_DUYET |
| Phê duyệt | POST | `/api/v1/tu-van-viens/{id}/phe-duyet` | `{version}` | CHO_PHE_DUYET → DANG_HOAT_DONG (BE) / **spec: CHO_KICH_HOAT** |
| Detail | GET | `/api/v1/tu-van-viens/{id}` | — | Trả `tvv` + `hoSo` + `linhVucs[]` + `thamDinhMoiNhat` |
| List | GET | `/api/v1/tu-van-viens?loaiTvv=CG&size=N` | — | Filter loại + cấp |

## Bugs phát hiện

### BUG-CG-A1-001 — State sau phê duyệt sai spec v3.5

- **Mô tả:** Sau khi CB PD POST `/phe-duyet`, BE trả `trangThai: "DANG_HOAT_DONG"`. Theo SRS update 2026-05-05 §FR-IV-NEW-04 (`srs-fr-04-chuyen-gia-tvv.md:2011`) đã rename `DANG_HOAT_DONG → HOAT_DONG` + chèn state mới `CHO_KICH_HOAT` giữa CHO_PHE_DUYET và HOAT_DONG. State cuối cùng sau phê duyệt phải là `CHO_KICH_HOAT` (chờ chủ TK click mail kích hoạt → HOAT_DONG).
- **Bằng chứng:**
  - Spec [smoke/6.4-sm-tvv.md](../../../../smoke/6.4-sm-tvv.md) line 24-25 + line 76 + 7.4-chuyen-gia-tvv.md TVV-011.
  - BE response TVV-0007 sau POST `/phe-duyet`: `{trangThai: "DANG_HOAT_DONG", version: 4}`.
- **Severity:** **Major** — block TP-TVV-09 test (CHO_KICH_HOAT → HOAT_DONG via mail). Cũng block hiển thị badge state đúng trong UI.

## Spec compliance summary

| Rule | Spec | Observed | Compliant |
|---|---|---|:-:|
| BR-AUTH-05 | CB PD cùng cấp phê duyệt | cb_pd_dp_02 → 403 cho TVV TW | ✅ |
| BR-AUTH-08 | Phân quyền theo donViId | cb_nv_dp_02 → 403 cho TVV TW (cả GET + POST) | ✅ |
| BR-LEGAL-04 | NĐ77/2008 thẩm định 4 nhóm | BE accept body 4 nhóm + ketLuan | ✅ |
| FR-VIII-15 | Auto-tạo TK lúc phê duyệt | taiKhoanId auto-set | ✅ |
| State name v3.5 | DANG_HOAT_DONG → HOAT_DONG | BE còn dùng DANG_HOAT_DONG | ❌ |
| State CHO_KICH_HOAT | Insert giữa CHO_PHE_DUYET và HOAT_DONG | BE skip → đi thẳng DANG_HOAT_DONG | ❌ |
| Optimistic lock | 409 stale version | 409 ERR-STATE-LOCK-409 | ✅ |
| ngayCongNhan auto | Set khi approve | 2026-05-06 | ✅ |
| Mail kích hoạt | Gửi qua FR-VIII-26 | Mail có trong MailHog | ✅ |

## Out of scope (defer)

- **TC-07 TK state CHO_KICH_HOAT** — endpoint truy vấn TAI_KHOAN chưa rõ. Test chính thuộc R7.7.8a TK SM.
- **TC-14 Audit log per transition** — endpoint nhật ký chưa rõ. Test chính thuộc R7.7.8d.
- **TP-TVV-02..09** — KHÔNG_DAT/YEU_CAU_BO_SUNG/TU_CHOI/TAM_DUNG/VO_HIEU_HOA/khôi phục. Thuộc task gốc R7.4.A1 (broader workflow).
- **R7.4.A2 explicit "Tiếp nhận" transition** — MOI_DANG_KY → CHO_THAM_DINH cần API riêng (BE skip khi POST tham-dinh).

## Files / Evidence

- API responses captured in network log (live session).
- Pool state verified pre/post mỗi TC.
- BUG-CG-A1-001 cần log riêng file [bug-report-flow-r7-4-a1-cg-state.md](../../bug-reports/tu-van-vien-cg/bug-report-flow-r7-4-a1-cg-state.md).
