# Business Flow — Phần mềm Hỗ trợ Pháp lý Doanh nghiệp (HTPLDN)

> **Nguồn trích xuất**: NotebookLM `only-srs-v3` (17 sources) + `docs/requirements/srs-v3-master.md` + `docs/requirements/fr-01..16-*.md`.
> **Phạm vi**: Toàn bộ nghiệp vụ của hệ thống HTPLDN do Cục Bổ trợ Tư pháp (Bộ Tư pháp) chủ quản, theo NĐ55/2019, NĐ18/2026 và TT17/2025.
> **Ngày trích xuất**: 2026-04-22.
> **Độ phủ**: 14 actors · 16 phân hệ (FR-01..FR-16) · 188 Use Cases · 11 state machines chính · 18 API outbound · 4 kênh tích hợp.

---

## Cấu trúc tài liệu

| File | Nội dung | Diagram chính |
|---|---|---|
| [00-tong-quan-nghiep-vu.md](./00-tong-quan-nghiep-vu.md) | Actors, module map, vòng đời end-to-end, điểm tích hợp liên phân hệ, kiến trúc kênh Hybrid. | Context diagram, End-to-end lifecycle, Module integration map. |
| [01-fr-01-dashboard.md](./01-fr-01-dashboard.md) | Dashboard KPI + biểu đồ, auto-refresh. | Use-case diagram, Data flow, drill-down map. |
| [02-fr-02-hoi-dap.md](./02-fr-02-hoi-dap.md) | Hỏi đáp pháp lý: tiếp nhận → phản hồi → phê duyệt → công khai Cổng PLQG. | SM-HOIDAP, Sequence DN ↔ PM ↔ Cổng. |
| [03-fr-03-dao-tao.md](./03-fr-03-dao-tao.md) | Chương trình/Khóa học, đăng ký, đề kiểm tra, chứng nhận. | SM-KHOAHOC, Flow đăng ký + phê duyệt KQ. |
| [04-fr-04-chuyen-gia-tvv.md](./04-fr-04-chuyen-gia-tvv.md) | Mạng lưới TVV/CG/NHT: đăng ký → thẩm định → công khai. | SM-TVV, Flow thẩm định 4 nhóm tiêu chí. |
| [05-fr-05-vu-viec.md](./05-fr-05-vu-viec.md) | Vụ việc Trợ giúp Pháp lý: vòng đời 12 trạng thái. | SM-VUVIEC, Sequence đa kênh tiếp nhận (DVC/HT khác/Trực tiếp). |
| [06-fr-06-chi-tra.md](./06-fr-06-chi-tra.md) | Chi trả chi phí tư vấn NĐ18/2026 (100%/30%/10%). | SM-CHITRA, Flow đánh giá + phê duyệt + thanh toán. |
| [07-fr-07-doanh-nghiep.md](./07-fr-07-doanh-nghiep.md) | Quản lý DNNVV thụ hưởng: CRUD + import + phân quy mô. | ERD DN ↔ VV ↔ Chi trả, Flow import Excel. |
| [08-fr-08-danh-gia.md](./08-fr-08-danh-gia.md) | Đợt đánh giá hiệu quả 6 tháng/năm theo TT17/2025. | SM-DANHGIA, Flow 8-bước đánh giá. |
| [09-fr-09-bieu-mau.md](./09-fr-09-bieu-mau.md) | Thư viện biểu mẫu, hợp đồng — công khai trực tiếp. | SM-BIEUMAU, Flow upload + preview + chia sẻ API. |
| [10-fr-10-quan-tri.md](./10-fr-10-quan-tri.md) | QTHT: danh mục, tài khoản, phân quyền, SLA, VNeID SSO. | SM-TAIKHOAN, Sequence đăng nhập 3 Tier. |
| [11-fr-11-bao-cao.md](./11-fr-11-bao-cao.md) | 23 báo cáo TT17/2025 (hỏi đáp, VV, ĐT, CG/TVV, chi phí, CT). | Flow template TPL-REPORT-FULL, Ma trận BC. |
| [12-fr-12-tv-chuyen-sau.md](./12-fr-12-tv-chuyen-sau.md) | Tư vấn chuyên sâu 1-1 (inbound Cổng PLQG). | SM-TVCS, Sequence Cổng → PM → CG. |
| [13-fr-13-tv-nhanh.md](./13-fr-13-tv-nhanh.md) | Tư vấn nhanh dựa trên kho Q&A + Full-text search. | SM-TVNHANH, Flow 3 nguồn bổ sung kho Q&A. |
| [14-fr-14-hop-dong-tv.md](./14-fr-14-hop-dong-tv.md) | Hợp đồng tư vấn ↔ Vụ việc (N:N) + thanh toán giai đoạn. | ERD HĐ ↔ VV, Flow thanh toán giai đoạn. |
| [15-fr-15-ct-htpldn.md](./15-fr-15-ct-htpldn.md) | Kế hoạch + Báo cáo Chương trình HTPLDN: ĐP/BN → TW tổng hợp. | SM-KH-CTHTPL, SM-DOT-BC, Flow ngược 3 cấp. |
| [16-fr-16-api.md](./16-fr-16-api.md) | 18 API outbound (9 cặp chia sẻ + tìm kiếm) qua kênh trực tiếp. | API matrix, Sequence Consumer ↔ Gateway ↔ PM. |

---

## Chú thích ký hiệu (Diagram legend)

- **Tất cả sơ đồ dùng Mermaid.** Render trực tiếp trên GitHub/VS Code Markdown Preview (extension `Markdown Preview Mermaid Support`).
- **Kiểu sơ đồ được sử dụng**:
  - `flowchart` → vẽ luồng nghiệp vụ, điều kiện phân nhánh.
  - `stateDiagram-v2` → vẽ vòng đời entity (state machine).
  - `sequenceDiagram` → vẽ tương tác giữa actor & subsystem.
  - `erDiagram` → vẽ quan hệ dữ liệu cốt lõi.
- **Màu/nhãn quy ước**:
  - `CB NV` = Cán bộ Nghiệp vụ (TW/BN/ĐP) · `CB PD` = Cán bộ Phê duyệt · `QTHT` = Quản trị hệ thống.
  - `DN` = Doanh nghiệp · `NHT` = Người hỗ trợ · `TVV` = Tư vấn viên · `CG` = Chuyên gia.
  - `LGSP` = Trục tích hợp nội bộ BTP · `NDXP` = Nền tảng dữ liệu tích hợp liên ngành · `Cổng PLQG` = Cổng Pháp luật Quốc gia.

## Thứ tự đọc khuyến nghị

1. **Tổng quan** → [00-tong-quan-nghiep-vu.md](./00-tong-quan-nghiep-vu.md) (sơ đồ context + vòng đời end-to-end + module map).
2. **Luồng cốt lõi** → 05 (Vụ việc) → 06 (Chi trả) → 04 (TVV) → 07 (DN) → 08 (Đánh giá).
3. **Kênh nghiệp vụ khác** → 02 (Hỏi đáp) → 12 (TVCS) → 13 (TV nhanh) → 03 (Đào tạo) → 14 (HĐ TV) → 15 (CT HTPLDN).
4. **Dịch vụ nền tảng** → 10 (Quản trị) → 09 (Biểu mẫu) → 11 (Báo cáo) → 16 (API) → 01 (Dashboard).
