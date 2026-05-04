# Folder smoke-specs/ — Smoke Test Specs (Self-contained)

Folder này chứa smoke test specs theo format **self-contained 4 bước** — đọc 1 file là đủ để chạy smoke cho 1 module.

- **Template mẫu:** [../template/smoke-procedure.md](../template/smoke-procedure.md) — copy khi add module mới
- **State Machine specs** (khác folder): [../smoke/](../smoke/) — chỉ chứa trạng thái + Test Paths + BR
- **Browse rule crash:** [../../CLAUDE.md](../../CLAUDE.md) — Rule 7: crash 2 lần → STOP

> **Thứ tự số khớp [../../input/srs-v3/](../../input/srs-v3/)** — `6.N-smoke-<module>.md` tương ứng `srs-fr-N-<module>.md` và `7.N-<module>.md` bên functional spec. Số skip (6.11, 6.16) đã có spec khác hoặc dùng `curl` thay `/browse`.

---

## Danh sách smoke test (14 module)

| # | Module | File | Account | Menu sidebar | Functional spec |
|---|--------|------|---------|--------------|-----------------|
| 6.1 | Dashboard (Tổng quan) | [6.1-smoke-dashboard.md](6.1-smoke-dashboard.md) | canbo_tw | Tổng quan / Dashboard / Trang chủ | [7.1](../funtion/7.1-dashboard.md) |
| 6.2 | Hỏi đáp Pháp lý | [6.2-smoke-hoidap.md](6.2-smoke-hoidap.md) | canbo_tw | Quản lý hỏi đáp pháp lý | [7.2](../funtion/7.2-hoi-dap-phap-ly.md) |
| 6.3 | Đào tạo, Tập huấn | [6.3-smoke-daotao.md](6.3-smoke-daotao.md) | canbo_tw | Quản lý đào tạo, tập huấn → Khóa học | [7.3](../funtion/7.3-dao-tao-tap-huan.md) |
| 6.4 | Chuyên gia / TVV | [6.4-smoke-tvv.md](6.4-smoke-tvv.md) | canbo_tw | Quản lý chuyên gia / tư vấn viên | [7.4](../funtion/7.4-chuyen-gia-tvv.md) |
| 6.5 | Vụ việc HTPL | [6.5-smoke-vuviec.md](6.5-smoke-vuviec.md) | canbo_tw | Quản lý vụ việc hỗ trợ pháp lý | [7.5](../funtion/7.5-vu-viec-htpl.md) |
| 6.6 | Chi trả Chi phí | [6.6-smoke-chitra.md](6.6-smoke-chitra.md) | canbo_tw | Quản lý chi trả chi phí | [7.6](../funtion/7.6-chi-tra-chi-phi.md) |
| 6.7 | Doanh nghiệp được HT | [6.7-smoke-doanhnghiep.md](6.7-smoke-doanhnghiep.md) | canbo_tw | Quản lý doanh nghiệp được hỗ trợ | [7.7](../funtion/7.7-quan-ly-doanh-nghiep.md) |
| 6.8 | Đánh giá Hiệu quả | [6.8-smoke-danhgia.md](6.8-smoke-danhgia.md) | canbo_tw | Đánh giá hiệu quả hỗ trợ pháp lý | [7.8](../funtion/7.8-danh-gia.md) |
| 6.9 | Biểu mẫu, Hợp đồng | [6.9-smoke-bieumau.md](6.9-smoke-bieumau.md) | canbo_tw | Quản lý thư viện biểu mẫu | [7.9](../funtion/7.9-bieu-mau.md) |
| 6.10 | Quản trị Hệ thống (Tài khoản) | [6.10-smoke-taikhoan.md](6.10-smoke-taikhoan.md) | admin / qtht_tw | Quản trị hệ thống → Tài khoản | [7.10](../funtion/7.10-quan-tri-he-thong.md) |
| 6.12 | Tư vấn Chuyên sâu | [6.12-smoke-tv-chuyensau.md](6.12-smoke-tv-chuyensau.md) | canbo_tw | Quản lý tư vấn → Tư vấn chuyên sâu | [7.12](../funtion/7.12-tu-van-chuyen-sau.md) |
| 6.13 | Tư vấn Nhanh | [6.13-smoke-tuvan-nhanh.md](6.13-smoke-tuvan-nhanh.md) | canbo_tw | Quản lý tư vấn → Tư vấn nhanh | [7.13](../funtion/7.13-tu-van-nhanh.md) |
| 6.14 | Hợp đồng Tư vấn | [6.14-smoke-hop-dong-tv.md](6.14-smoke-hop-dong-tv.md) | canbo_tw | Hợp đồng tư vấn (hoặc qua chi tiết VV/TVV) | [7.14](../funtion/7.14-hop-dong-tv.md) |
| 6.15 | Chương trình HTPLDN | [6.15-smoke-chuong-trinh-HTPLDN.md](6.15-smoke-chuong-trinh-HTPLDN.md) | canbo_tw | Chương trình HTPLDN | [7.15](../funtion/7.15-chuong-trinh-HTPLDN.md) |

**Tổng: 14 module.**

---

## Flow chung 4 bước (mỗi file module đều có)

1. **Pre-check** — curl check server + API login (phát hiện account lock sớm)
2. **Bước 1: LOGIN** — browser login + OTP bypass `666666`
3. **Bước 2: VÀO MODULE**
   - 2a. Verify menu + submenu xuất hiện trong sidebar (snapshot DOM + grep)
   - 2b. Navigate + verify URL/elements
4. **Bước 3: KIỂM TRA LỖI NGẦM** — console errors + network 4xx/5xx + toast UI đỏ
5. **Bước 4: GHI KẾT QUẢ** — copy template report + điền verdict + screenshots

---

## Cách add module mới

1. Copy [../template/smoke-procedure.md](../template/smoke-procedure.md) → lưu vào folder này với tên `6.N-smoke-<module>.md` (số N khớp thứ tự `funtion/7.N-<module>.md` và `../../input/srs-v3/srs-fr-N-<module>.md`)
2. Fill bảng Metadata (account, menu label, submenu, route URL, expected elements)
3. Điền ghi chú đặc thù module (permission / precondition / known bug)
4. Xóa block hướng dẫn ở đầu template
5. Update bảng danh sách ở README này

---

## Verdict

Mỗi module sau khi chạy có 1 trong 4 verdict:

| Verdict | Điều kiện | Unlock functional/regression? |
|---------|-----------|-------------------------------|
| ✅ **PASS** | 4/4 bước PASS, 0 console error 5xx | Yes |
| ⚠️ **WARN** | 4/4 PASS nhưng có render chậm / warning | Yes — note |
| ❌ **FAIL** | ≥1 bước FAIL | No — báo dev, chờ fix |
| 🔒 **BLOCKED** | Browse crash 2 lần / account lock / server down | Skip module round này |

---

## Output report

- Template report: [../template/smoke-test-report-template.md](../template/smoke-test-report-template.md)
- Lưu tại: `output/qa-reports/round{N}/smoke-test/<module>/smoke-test-report.md`
- Screenshots: `output/qa-reports/round{N}/smoke-test/<module>/screenshots/`

---

*smoke-specs folder v2.2 | 2026-04-20 | PM HTPLDN QA — 14 module, số khớp input/srs-v3/ và funtion/*
