# Quy trình nghiệp vụ PM HTPLDN

Tài liệu dẫn giải luồng nghiệp vụ hệ thống PM HTPLDN theo thứ tự dễ hiểu nhất, rút gọn từ 33 source SRS trong NotebookLM `gstack-HTPLDN`.

## Mục lục

1. [01-tong-quan-nghiep-vu.md](./01-tong-quan-nghiep-vu.md) — Mục tiêu hệ thống, 11 vai trò, 3 luồng end-to-end (Hỏi đáp → Vụ việc TGPL → TV chuyên sâu), các nguyên tắc xuyên suốt (SLA, audit, công khai, lọc kép).
2. [02-thu-tu-module.md](./02-thu-tu-module.md) — 16 module FR-01..FR-16 xếp theo 5 lớp phụ thuộc dữ liệu, mỗi module có: login tạo / login duyệt / đầu vào / đầu ra. Kèm bảng tóm tắt thứ tự seed và 5 luật suy dẫn cho QA.

## Cách dùng

- **QA viết test plan mới** → đọc `02` để biết module nào cần seed trước, tài khoản nào cần login.
- **QA làm smoke end-to-end** → đọc `01` mục "Ba kịch bản nghiệp vụ" để chọn luồng test.
- **Dev onboard** → đọc `01` trước (bối cảnh), rồi `02` (chi tiết quan hệ).

## Nguồn

- NotebookLM: https://notebooklm.google.com/notebook/2160bfb1-2020-4199-90a6-d607b298bb42
- SRS chi tiết: [../srs-v3/](../srs-v3/) (baseline v3.1)
- **SRS update v3.5 (2026-05-05/06):** [../srs-update-2026-5-5/](../srs-update-2026-5-5/) — per-FR delta + [`CHANGELOG-v3-to-v3.5.md`](../srs-update-2026-5-5/CHANGELOG-v3-to-v3.5.md) + consolidated [`srs-v3.5.md`](../srs-update-2026-5-5/srs-v3.5.md) (6695 lines)
- Flow & seed fixture: [../flow-module.md](../flow-module.md) · [../data/entity-map.md](../data/entity-map.md) · [../data/seed-fixture.yaml](../data/seed-fixture.yaml)
- Tài khoản test: [../users.csv](../users.csv)
