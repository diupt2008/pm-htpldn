# Seed Checklist — [TÊN MODULE] ([MÃ TASK])

**Ngày:** [YYYY-MM-DD HH:MM] • **Tài khoản:** `[username]` • **Trạng thái mong đợi:** `[Tên trạng thái VN]`
**Màn:** [SCR-XX-NN — Tên màn theo SRS] • **Đường dẫn:** `[/url-thực-tế]`
**Dữ liệu mẫu:** [seed-fixture.yaml > tên_variants](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-XX-NN UCxxx — Tên chức năng](../../../../input/srs-v3/srs-fr-xx-tên.md)

---

## Downstream consumer × filter (BẮT BUỘC trước khi seed)

> Quote nguyên văn SRS filter cho mọi task downstream sẽ đọc data này. Không gộp scope. Cover combinatorial = entity × state × flag × lĩnh vực.

| Task downstream | Đọc filter (quote SRS) | Số record cần | State entity yêu cầu | Verify query (curl/UI) | Status |
|-----------------|------------------------|---------------|----------------------|------------------------|:---:|
| [vd A5 modal Phân công CG] | `loaiTvv=CG ∧ trang_thai=DANG_HOAT_DONG ∧ la_cong_khai=true ∧ linh_vuc khớp` (`srs-fr-12 line 938` + `02-thu-tu-module §⑧ line 533`) | ≥1 CG / lĩnh vực × 6 LV = ≥6 CG | `DANG_HOAT_DONG` | `GET /api/v1/tu-van-viens?trangThai=DANG_HOAT_DONG&loaiTvv=CG&linhVucIds=<UUID>` → `data.length >= 1` mỗi LV | ☐ |
| [vd A3 dropdown Phân công VV] | `vai_tro IN (TVV,CG,NHT) ∧ linh_vuc khớp` (`02-thu-tu-module §⑥`) | ≥1 / 6 LV | `DANG_HOAT_DONG` | `GET /api/v1/vu-viecs/<id>/goi-y-tvv?limit=20` → `data.length >= 1` | ☐ |

**Acceptance pass khi:** mọi row `Status` = ☐ → ✅ qua verify query thực tế (không chỉ đếm tổng).

**🚫 RULE BẮT BUỘC (2026-05-02 R11 — sau A5 BLOCK lần 4):**
- Nếu cột "State entity yêu cầu" ≠ default state sau seed-create → BẮT BUỘC tách task `<entity>-advance-state` riêng.
- Acceptance task seed-create chỉ đóng ✅ KHI verify query downstream PASS (không chỉ "saved N/N").
- Memory ref: [`feedback_seed_actor_state_gap.md`](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_seed_actor_state_gap.md) + [`feedback_dependency_chain_state_explicit.md`](../../../../../.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/feedback_dependency_chain_state_explicit.md).

---

## Kết quả: [✅ XONG N/N | ⚠️ MỘT PHẦN N/N | 🚫 KHÔNG LÀM ĐƯỢC 0/N]

[1 câu nói rõ làm được mấy bản ghi / mấy bị chặn. Nếu chặn — nói rõ chặn ở bước nào.]

**Bug (nếu có):** [`BUG-XXX-001-RX`](../bug-reports/bug-report-seed-xxx.md) — [1 câu mô tả]

---

## Bảng dữ liệu seed

| # | Tên bản ghi | [Cột chính 1] | [Cột chính 2] | Mã/ID | Có vào kho? |
|---|-------------|---------------|---------------|-------|:-----------:|
| 1 | [tên] | [val] | [val] | [auto-gen / —] | ✅ / 🚫 |
| 2 | [tên] | [val] | [val] | [ID] | ✅ / 🚫 |

**Tổng:** [N vào kho / N bị chặn]

---

## Ảnh chụp

- [Mô tả ảnh 1](../screenshots/file.png)
- [Mô tả ảnh 2](../screenshots/file.png)

---

*[YYYY-MM-DD HH:MM] — QA chạy bằng Chrome DevTools MCP*
