# Tổng hợp Artifacts

| Loại | Số lượng | Chi tiết |
|------|----------|----------|
| **Functional Requirements (FR)** | **178** | 16 nhóm (I → XII), bao gồm CROSS-cutting và NEW |
| **Business Rules (BR)** | **56** | AUTH(9), CALC(6), DATA(8), FLOW(10), INTG(7), LEGAL(8), LICH(1), RETRY(1), RPT(1), SLA(5) |
| **Entity Definitions** | **23** | 15 entity chính (§3.4.4) + 8 entity phụ (FK tables) |
| **State Machines (SM)** | **10** | HOIDAP, VUVIEC, CHITRA, TVV, KHOAHOC, DANHGIA, CTHTPL, TVCS, BIEUMAU, TAIKHOAN (aliases HD/VV normalized v1.8) |
| **API / Integration Points** | **7 INT + 16 FR-XII** | 7 integration requirements (INT-01..07) + 16 outbound API FRs (FR-XII). API contracts/schemas → Architecture Design |
| **Performance Requirements** | **8** | PERF-01 → PERF-08 + 3 EC (PERF-01a, PERF-03a, PERF-08a) + Degradation table |
| **Security Requirements** | **6** | SEC-01 → SEC-06 + 2 EC (SEC-03a, SEC-06a) |
| **Reliability Requirements** | **5** | REL-01 → REL-05 + 1 EC (REL-03a) |
| **Availability Requirements** | **5** | AVL-01 → AVL-05 + 2 EC (AVL-03a, AVL-05a) |
| **Maintainability Requirements** | **5** | MNT-01 → MNT-05 |
| **Portability Requirements** | **5** | PRT-01 → PRT-05 |
| **Edge Case Clarifications (EC)** | **8** | SEC-03a, SEC-06a, REL-03a, AVL-03a, AVL-05a, PERF-01a, PERF-03a, PERF-08a + 1 degradation table |
| **Tổng Requirements** | **212** | 178 FR + 34 NFR (+ 8 EC clarifications trên NFR hiện có). *Ghi chú:* 178 FR < 195 UC (188 CSV + 7 bổ sung) vì một số FR dùng template chung (VD: TPL-DM-CRUD bao phủ 15 UC danh mục bằng 1 template), do đó nhiều UC được gộp vào cùng một FR. |
