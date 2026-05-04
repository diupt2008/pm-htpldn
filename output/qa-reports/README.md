# QA Reports — PM HTPLDN

> Phần mềm Hỗ trợ Pháp lý Doanh nghiệp | SRS v3.1

## Quản lý đợt test (Round)

> Khi dev deploy bản mới + reset database → bắt đầu **đợt test mới (round)**.
> Report đợt cũ chuyển vào `_archive/roundN/`. Report mới nằm ở thư mục gốc module.

### Quy tắc khi deploy mới

```
1. Tạo folder: _archive/round1/ (hoặc round2, round3...)
2. Di chuyển TẤT CẢ report + screenshots hiện tại vào _archive/roundN/
3. Giữ lại: README.md, cấu trúc folder module (rỗng)
4. Chạy test mới → report mới lưu vào folder module như bình thường
```

### Tại sao giữ report cũ?

| Thông tin | Giá trị sau reset |
|-----------|------------------|
| Bug đã phát hiện | Dev cần verify đã fix chưa (regression test) |
| Cấu trúc UI (cột, tabs, fields) | So sánh bản cũ vs mới → phát hiện regression |
| Kết quả phân quyền | Verify bản mới đã fix phân quyền chưa |
| Bài học kinh nghiệm | Tránh lặp lại sai lầm |

### Tại sao KHÔNG để lẫn với report mới?

- `/qa-only` có thể đọc nhầm report cũ → so sánh sai
- Không biết report nào thuộc bản deploy nào
- Lẫn lộn giữa bug cũ (đã fix) và bug mới

## Cấu trúc thư mục

```
qa-reports/
├── _archive/                ← Đợt test cũ (khi deploy mới → chuyển vào đây)
│   └── round1-2026-04-16/   ← Đợt 1: deploy ngày 15-16/04
│       ├── chitra/
│       ├── doanh-nghiep/
│       ├── hoi-dap/
│       ├── ...
│       └── tong-hop/
├── smoke-test/              ← Smoke test (đợt hiện tại)
├── chitra/                  ← Module Chi trả (đợt hiện tại)
├── doanh-nghiep/            ← Module Doanh nghiệp (đợt hiện tại)
├── hoi-dap/                 ← Module Hỏi đáp Pháp lý (đợt hiện tại)
├── quan-tri/                ← Module Quản trị Hệ thống (đợt hiện tại)
├── tvv/                     ← Module CG/TVV (đợt hiện tại)
├── vu-viec/                 ← Module Vụ việc HTPL (đợt hiện tại)
├── phan-quyen/              ← Test Phân quyền (đợt hiện tại)
├── tong-hop/                ← Báo cáo tổng hợp (đợt hiện tại)
└── test-cases/              ← TC chi tiết (xem test-strategy Section 7.8)
```

## Mỗi module chứa

| File / Folder | Mô tả |
|---------------|-------|
| `lan1-YYYY-MM-DD.md` | Report lần test đầu tiên (trong đợt hiện tại) |
| `lan2-YYYY-MM-DD.md` | Report lần test lại — retest sau fix bug (cùng đợt) |
| `raw-data/` | JSON data thô từ automation |
| `screenshots/` | Screenshots bằng chứng |

## Quy ước đặt tên

- **`roundN`** = Đợt test thứ N (mỗi lần deploy mới + reset DB = 1 round)
- **`lan1`** = Lần test đầu tiên trong 1 round
- **`lan2`** = Lần test lại (retest) sau khi dev fix bug, cùng round
- **`lan2-chi-tiet`** = Bản report chi tiết hơn cho cùng lần test
- **`lan1-bo-sung`** = Report bổ sung thêm cho cùng lần test

## Thống kê — Đợt hiện tại (Round 1: 2026-04-15 ~ 04-16)

| Module | Lần 1 | Lần 2 | Screenshots |
|--------|-------|-------|-------------|
| Smoke Test | ✅ | — | 19 |
| Chi trả | ✅ 04-15 | ✅ 04-16 | 13 |
| Doanh nghiệp | ✅ 04-15 | ✅ 04-16 | 14 |
| Hỏi đáp | ✅ 04-15 | ✅ 04-16 | 31 |
| Quản trị | ✅ 04-15 | ✅ 04-16 | 20 |
| TVV | ✅ 04-15 | ✅ 04-16 | 45 |
| Vụ việc | ✅ 04-15 | ✅ 04-16 | 45 |
| Phân quyền | ✅ 04-16 | ✅ 04-16 (bổ sung) | 15 |
