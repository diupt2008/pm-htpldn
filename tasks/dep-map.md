# Dependency Map — task tạo state nào, phục vụ task nào

**Mục đích:** Bird's eye view cross-file dep. Khi task A trong file X cần state Y, lookup file nào tạo state Y.

**Last updated:** 2026-05-08 (sau khi tách todo.md → 20 module file)

> **Lưu ý:** state thực tế trên BE đọc từ [`state-snapshot.md`](state-snapshot.md). File này chỉ map intent (task nào _được kỳ vọng_ tạo state nào).

---

## 1. Task → File mapping (tra cứu task ở file nào)

| Task ID | File |
|---|---|
| R7.0.1..7 | [todo-pre-test.md](todo-pre-test.md) |
| R7.1.1..6, R7.2.1, R7.2.9, R7.5.5, R7.7.8, R7.7.8a..e | [todo-qtht.md](todo-qtht.md) |
| R7.2.5, R7.2.6, R7.4.A1, R7.4.A1-CG, R7.4.A2, R7.7.2 | [todo-tvv-cg.md](todo-tvv-cg.md) |
| R7.2.7, R7.7.4.5 | [todo-nht.md](todo-nht.md) |
| R7.2.2, R7.2.3, R7.4.A6, R7.7.4.6 | [todo-tc-tv.md](todo-tc-tv.md) |
| R7.2.4, R7.3.4, R7.5.2, R7.7.4 | [todo-doanh-nghiep.md](todo-doanh-nghiep.md) |
| R7.3.1, R7.3.1.MoB, R7.3.1.TVN, R7.4.A4, R7.7.1 | [todo-hoi-dap.md](todo-hoi-dap.md) |
| R7.3.2, R7.4.A3, R7.4.A3-PUBLIC, R7.4.A3-DN-BS, R7.7.3, R7.7.3-PRIVACY | [todo-vu-viec.md](todo-vu-viec.md) |
| R7.3.3, R7.4.A5, R7.7.5 | [todo-tvcs.md](todo-tvcs.md) |
| R7.3.14, R7.7.14, R7.E1 | [todo-hop-dong-tv.md](todo-hop-dong-tv.md) |
| R7.3.5/6/8/9/10/11/12/13/15, R7.4.B0/B1/B5b/B7/B10/B11/B12, R7.7.6 | [todo-dao-tao.md](todo-dao-tao.md) |
| R7.3.7, R7.4.C1, R7.7.10 | [todo-bieu-mau.md](todo-bieu-mau.md) |
| R7.4.D1, R7.4.D2, R7.4.D2a, R7.4.D2b, R7.7.9 | [todo-danh-gia-hq.md](todo-danh-gia-hq.md) |
| R7.3.16, R7.4.D3, R7.4.D3.AUTO | [todo-kho-qa.md](todo-kho-qa.md) |
| R7.6.1, R7.7.12, R7.7.12.1..4, R7.E3 | [todo-chi-tra.md](todo-chi-tra.md) |
| R7.6.2, R7.6.3, R7.7.11, R7.E4 | [todo-tv-nhanh.md](todo-tv-nhanh.md) |
| R7.6.4, R7.6.5, R7.7.15, R7.7.15.b, R7.E2 | [todo-ct-htpldn.md](todo-ct-htpldn.md) |
| R7.5.1, R7.7.7 | [todo-dashboard.md](todo-dashboard.md) |
| R7.5.4, R7.7.13 | [todo-bao-cao.md](todo-bao-cao.md) |
| R7.5.3, R7.7.16, R7.7.17, R7.8.1..6 | [todo-cross-cutting.md](todo-cross-cutting.md) |

---

## 2. State → producer task (task nào tạo state nào)

| Entity / State | Producer task | File |
|---|---|---|
| ≥1 NHT HOAT_DONG | R7.2.7 (seed) + R7.2.9 (mail kích hoạt) | nht / qtht |
| ≥1 TC TV HOAT_DONG | R7.2.3 (phê duyệt) | tc-tv |
| ≥1 DN | R7.2.4 | doanh-nghiep |
| ≥1 TVV/CG MOI_DANG_KY | R7.2.5, R7.2.6 | tvv-cg |
| ≥1 TVV CHO_KICH_HOAT | R7.4.A1 | tvv-cg |
| ≥1 CG DANG_HOAT_DONG | R7.4.A1-CG | tvv-cg |
| ≥1 HD MOI / DA_PHAN_CONG / DANG_XU_LY / DA_DUYET | R7.3.1 (seed) + R7.4.A4 (advance) | hoi-dap |
| ≥1 VV DA_TIEP_NHAN | R7.3.2 | vu-viec |
| ≥1 VV DA_PHAN_CONG / DANG_XU_LY / HOAN_THANH | R7.4.A3 | vu-viec |
| ≥1 VV cong_khai=1 | R7.4.A3-PUBLIC | vu-viec |
| ≥1 VV YEU_CAU_BO_SUNG / DANG_KIEM_TRA | R7.4.A3-DN-BS | vu-viec |
| ≥1 TVCS TIEP_NHAN | R7.3.3 (seed) + R7.4.A5 (advance) | tvcs |
| ≥1 HSPL DN | R7.3.4 | doanh-nghiep |
| ≥1 KH năm DA_DUYET / DA_CONG_KHAI | R7.3.5 (seed NHAP) + R7.4.B0 (advance) | dao-tao |
| ≥1 CTĐT DA_DUYET | R7.3.6 (seed) + R7.4.B1 (advance) | dao-tao |
| ≥1 KH DA_KET_THUC | R7.3.15 (seed) + R7.4.B7 (advance) | dao-tao |
| ≥1 NHCH KICH_HOAT / CONG_KHAI | R7.3.8 (seed NHAP) + R7.4.B5b (publish) | dao-tao |
| ≥1 ĐKT NHAP | R7.3.9 + R7.4.B10 | dao-tao |
| ≥1 Bài giảng KICH_HOAT | R7.3.10 | dao-tao |
| ≥1 Giảng viên HOAT_DONG | R7.3.11 | dao-tao |
| ≥1 Học viên | R7.3.12 (block dev) | dao-tao |
| ≥1 Lịch học | R7.3.13 (block dev) + R7.4.B12 | dao-tao |
| ≥1 BM CONG_KHAI | R7.3.7 (seed TM/BM NHAP) + R7.4.C1 (publish) | bieu-mau |
| ≥1 đợt ĐG LAP_KE_HOACH..HOAN_THANH | R7.4.D1 (tạo) + R7.4.D2 (advance 9 bước) | danh-gia-hq |
| ≥1 đợt ĐG HUY (4 state nguồn) | R7.4.D2a | danh-gia-hq |
| ≥1 Kho QA DA_DUYET / CHO_DUYET | R7.3.16 (seed) + R7.4.D3 (advance) + R7.4.D3.AUTO (auto-feed từ HD) | kho-qa |
| ≥1 HSCT (Chi trả) các state | R7.6.1 (workflow LGSP) | chi-tra |
| ≥1 phiên TVN MOI / HOAN_THANH | R7.6.2 (workflow) + dev seed 50 phiên | tv-nhanh |
| ≥1 phiên TVN cong_khai=1 | R7.6.3 | tv-nhanh |
| ≥1 CT HTPLDN DA_DUYET | R7.6.4 (GĐ1) | ct-htpldn |
| ≥1 Đợt BC DA_DUYET_KQ / DA_TONG_HOP | R7.6.5 (GĐ2) | ct-htpldn |
| ≥1 HĐ TV DANG_THUC_HIEN | R7.3.14 | hop-dong-tv |
| ≥1 ngày lễ KICH_HOAT | R7.1.5 | qtht |
| ≥1 audit log entry | R7.5.5 (accumulate qua Phase 4) | qtht |

---

## 3. Critical dep chain (luồng dài cần chạy theo thứ tự)

**Chain Đào tạo (8 task):**
```
R7.3.5 (KH năm seed) → R7.4.B0 (advance) → R7.3.6 (CTĐT seed) → R7.4.B1 (advance)
  → R7.3.15 (KH seed) → R7.4.B7 (workflow) → R7.4.B11 (phê duyệt) → R7.7.6 (functional 40 TC)
```

**Chain Đánh giá HQ (5 task):**
```
R7.4.D1 (tạo đợt) → R7.4.D2 (workflow 9 bước) → R7.4.D2a (HUY transition)
                                              → R7.4.D2b (FR-VI-10 cross-co-quan) → R7.7.9 (functional 46 TC)
```

**Chain CT HTPLDN (5 task):**
```
R7.6.4 (GĐ1) → R7.6.5 (GĐ2 Đợt BC) → R7.7.15 + R7.7.15.b (functional)
```

**Chain VV (6 task):**
```
R7.3.2 (seed) → R7.4.A3 (workflow base) → R7.4.A3-PUBLIC (công khai)
                                       → R7.4.A3-DN-BS (DN bổ sung)
                                       → R7.7.3 (72 TC) + R7.7.3-PRIVACY (2 TC P0)
```

**Chain Hỏi đáp (5 task):**
```
R7.3.1 (seed) + R7.3.1.MoB (mẫu) + R7.3.1.TVN (escalate)
  → R7.4.A4 (workflow 11 paths) → R7.7.1 (60 TC v3.5)
```

**Chain Chi trả (block dev):**
```
🚫 LGSP integration → R7.6.1 (workflow 12 bước) → R7.7.12.2 + R7.7.12.3 (functional sub-task)
```

---

## 4. Cross-module dep nổi bật

| Producer | Consumer | Lý do |
|---|---|---|
| R7.4.A3 (vu-viec.md) | R7.3.14 (hop-dong-tv.md), R7.7.13 (bao-cao.md), R7.7.14 (hop-dong-tv.md), R7.5.2 (doanh-nghiep.md), R7.5.4 (bao-cao.md) | VV HOAN_THANH cần cho HĐ TV, BC04, cross-module DN |
| R7.4.A1 (tvv-cg.md) | R7.3.14 (hop-dong-tv.md) | TVV active để gắn HĐ TV |
| R7.2.3 (tc-tv.md) | R7.4.A3 (vu-viec.md), R7.4.A4 (hoi-dap.md) | TC TV HOAT_DONG cần cho phân công VV/HD |
| R7.2.7 + R7.2.9 (nht/qtht.md) | R7.4.A3 (vu-viec.md), R7.7.4.5 (nht.md) | NHT HOAT_DONG cần cho phân công VV |
| R7.2.4 (doanh-nghiep.md) | R7.4.A3-DN-BS (vu-viec.md), R7.7.3-PRIVACY (vu-viec.md) | DN data cho DN bổ sung HS + privacy test |
| R7.6.1 (chi-tra.md) | R7.5.2 (doanh-nghiep.md), R7.7.12.2/3 (chi-tra.md) | HSCT các state cho cross-module DN + sub-task |
| R7.6.4 (ct-htpldn.md) | R7.5.1 (dashboard.md), R7.7.7 (dashboard.md), R7.7.16 (cross-cutting.md) | CT count cần cho KPI + Dashboard + API test |
| R7.1.5 (qtht.md) | R7.5.3 (cross-cutting.md) | Ngày lễ cho SLA banner verify |

---

## 5. Cập nhật khi nào

- **Thêm task mới** → thêm dòng vào bảng §1 (Task→File) + §2 (State→Producer) nếu task tạo state mới.
- **Đổi mapping module** → update §1.
- **Phát hiện chain mới** → thêm vào §3.
