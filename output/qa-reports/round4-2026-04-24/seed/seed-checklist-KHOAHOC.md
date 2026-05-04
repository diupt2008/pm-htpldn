# Seed Checklist — Khóa học (T2.A5b)

**Ngày:** 2026-04-25 22:14-22:20 • **Tài khoản:** `cb_nv_tw_01` • **Trạng thái mong đợi:** `DỰ THẢO`
**Màn:** SCR-III-02 — Tạo khóa học mới • **Đường dẫn:** `/dao-tao/khoa-hoc/danh-sach` → `/dao-tao/khoa-hoc/tao-moi`
**Dữ liệu mẫu:** [seed-fixture.yaml > khoa_hoc_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-III-01 UC20 — Quản lý Chương trình đào tạo / Khóa học](../../../../input/srs-v3/srs-fr-03-dao-tao.md)

---

## Kết quả: 🚫 KHÔNG LÀM ĐƯỢC 0/6

Form Tạo khóa học mới yêu cầu chọn CTĐT từ dropdown, nhưng dropdown rỗng — endpoint `GET /api/v1/chuong-trinh-dao-taos?...&trangThai=DA_DUYET` filter chỉ chương trình đã duyệt. 4 CTĐT seed ở T2.A5a đều ở trạng thái Dự thảo nên không lọt filter. Helper text `"Chỉ hiển thị các chương trình đã được phê duyệt"` xác nhận rule. Empty text dropdown: `"Không có chương trình phù hợp"`.

**Bug:** Không log bug mới. Lý do: SRS FR-III-01 §Inputs Khóa học row 3 chỉ định `ctdt_id Y FK → CTDT` — KHÔNG có clause yêu cầu CTĐT phải `DA_DUYET`. Filter này là business rule do FE/BE thêm, không vi phạm SRS clause cụ thể (per `feedback_bug_must_have_srs_ref`). Cần workflow phê duyệt CTĐT (P3) chạy trước → thoát chặn → mới seed được.

---

## Bảng dữ liệu seed

| # | Tên khóa học (fixture) | CTĐT cha (fixture) | Hình thức | Mã/ID | Có vào kho? |
|---|------------------------|---------------------|-----------|-------|:-----------:|
| 1 | Pháp luật doanh nghiệp căn bản | CTDT-BTP-TW-2026-0001 (DU_THAO) | TRUC_TUYEN | — | 🚫 |
| 2 | Luật thuế GTGT thực hành | CTDT-BTP-TW-2026-0001 (DU_THAO) | TRUC_TIEP | — | 🚫 |
| 3 | Hợp đồng thương mại quốc tế | CTDT-BTP-TW-2026-0001 (DU_THAO) | TRUC_TUYEN | — | 🚫 |
| 4 | An toàn lao động ngành xây dựng | CTDT-BTP-TW-2026-0002 (DU_THAO) | TRUC_TIEP | — | 🚫 |
| 5 | Sở hữu trí tuệ cho startup | CTDT-BTP-TW-2026-0003 (DU_THAO) | TRUC_TUYEN | — | 🚫 |
| 6 | Luật đất đai cập nhật 2024 | CTDT-BTP-TW-2026-0004 (DU_THAO) | TRUC_TIEP | — | 🚫 |

**Tổng:** 0 vào kho / 6 bị chặn (toàn bộ chặn ở dropdown CTĐT — không submit được).

---

## Bằng chứng

- **API call FE phát ra khi mở form (reqid=117):**
  `GET /api/v1/chuong-trinh-dao-taos?page=1&pageSize=100&trangThai=DA_DUYET → 200 OK`
- **Empty state DOM dropdown:** `<div role="listbox" id="ctdtId_list" class="ant-select-item-empty">Không có chương trình phù hợp</div>`
- **Helper text dưới combobox:** `"Chỉ hiển thị các chương trình đã được phê duyệt"`
- **A11y combobox `description`:** `"Chỉ hiển thị các chương trình đã được phê duyệt"`

---

## Quan sát ngoài SRS (không log bug)

- **O1 — Filter CTĐT `trangThai=DA_DUYET` không có SRS clause.** SRS FR-III-01 §Inputs Khóa học row 3 chỉ ràng buộc `FK → CTDT`, không yêu cầu state DA_DUYET. Tuy nhiên đây là business rule hợp lý (không cho gắn Khóa học vào CTĐT chưa duyệt để tránh inconsistency metadata). Đề xuất BA bổ sung clause vào SRS FR-III-01 §Validations hoặc §Processing — Thêm Khóa học. Cùng obs đã ghi ở memory `qa_htpldn_khoahoc_cr_round1` (R1) + `qa_htpldn_khoahoc_cr_round2` (R2) — đây là lần thứ 3 cross-round.
- **O2 — Mâu thuẫn nội bộ SRS về entry state CTĐT.** FR-III-01 §Processing — Thêm mới CTDT row 4: "Đặt trạng thái = `NHAP`". Nhưng flow-module + state diagram §3.4.3.19 nói entry là `DU_THAO`. T2.A5a + R1/R2 thực tế seed `DU_THAO` (BE/FE hiện hành). Cần BA align SRS — không ảnh hưởng T2.A5b nhưng có khả năng làm test FR-III-01 functional bị nhiễu. Không log bug do là spec issue, không phải code issue.
- **O3 — Form Tạo khóa học có 2 spinbutton bị set `valuemax="0" valuemin="1"`** (Sĩ số tối đa + Số buổi học) — `max < min` reverse. A11y attr buggy nhưng không cản trở UX khi dropdown CTĐT đã chặn từ đầu. Không log do không chạy được flow để verify validation runtime.
- **O4 — Form thiếu các field fixture cần:** `ngan_sach`, `bai_giang_ids`, `giang_vien_link`, `link_zoom`, `mo_ta`. SRS FR-III-01 §Inputs Khóa học cũng không liệt kê các field này (chỉ 10 field cơ bản). Fixture vượt scope SRS. Không log bug.

---

## Cascade impact + Next action

| Task downstream | Impact | Trigger unblock |
|-----------------|--------|------------------|
| T2.A5d phần 2 ĐKT | **BLOCKED** — ĐKT cần `khoa_hoc_id` (per fixture comment `seed-fixture.yaml#L908`) | T2.A5b PASS |
| T3.5 Workflow Khóa học | Sẽ chạy bình thường nếu T3.X workflow CTĐT phê duyệt ≥1 CTDT → DA_DUYET trước | T3.X CTĐT approve |
| T4.6 Functional Khóa học (40 TC) | Có thể test một phần (Bài giảng, NHCH, Giảng viên độc lập) — TC liên quan Khóa học CRUD vẫn chặn | T2.A5b PASS |

**Đề xuất unblock (theo thứ tự ưu tiên):**

1. **Recommended:** Sau khi C2 P2 review xong, chèn 1 mini-step ở đầu P3 — workflow phê duyệt CTĐT (cb_nv_tw_01 [Gửi phê duyệt] → cb_pd_tw_01 [Phê duyệt] cho ≥1 CTDT) → re-run T2.A5b với 6 fixture (vẫn cần đủ 4 CTĐT cha DA_DUYET cho variant 1+2+3, 4, 5, 6). Đây là deviation nhỏ khỏi mindset "P2 không workflow" nhưng cần thiết để T2.A5d phần 2 + T3.5 + T4.6 chạy được.
2. **Alternative:** Defer T2.A5b sang sau T3.5 (workflow Khóa học chạy xong là CTĐT đã DA_DUYET) — nhưng T3.5 chính nó cần ≥1 Khóa học DU_THAO làm input → chicken-egg. → Phải chọn (1).

---

## Ảnh chụp

- [List Khóa học rỗng init state](screenshots/khoahoc-t2a5b-list-empty-init.png)
- [Form Tạo khóa học — helper text "Chỉ hiển thị các chương trình đã được phê duyệt"](screenshots/khoahoc-t2a5b-form-empty.png)
- [Dropdown CTĐT mở — "Không có chương trình phù hợp"](screenshots/khoahoc-t2a5b-ctdt-dropdown-empty.png)

---

*2026-04-25 22:20 — QA chạy bằng Chrome DevTools MCP, account `cb_nv_tw_01`*
