# Workflow Test Report — CTĐT (FR-III-01)

> **Module:** Chương trình đào tạo (`CHUONG_TRINH_DAO_TAO`) · **SRS:** [`srs-fr-03 §FR-III-01`](../../../../input/srs-v3/srs-fr-03-dao-tao.md) + [`02-thu-tu-module §⑨ FR-03`](../../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · **Round:** R11 · **Date:** 2026-05-02 · **Tester:** QA Automation
> **Bug:** [`bug-report-flow-ctdt.md`](../bug-reports/bug-report-flow-ctdt.md)

---

## Kết luận

🚫 **BLOCK** — **0/2 transition PASS** ở R11. Block ngay từ Bước 1 do BUG-FUNC-CTDT-001 Critical (BE chặn submit CTĐT chưa có khóa học, guard ngoài SRS). 6/6 CTĐT seed R6.3.5 stuck `DU_THAO`.

> **TODO ambiguity SRS:** Không có. SRS rõ ràng — cả NotebookLM lẫn grep local đều confirm guard "≥1 khóa học" không có. BE bug, không phải spec gap.

---

## Bảng kiểm tra workflow

| # | Bước (transition) | Actor | Sample test | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 0 | Seed entry `DU_THAO` (R6.3.5 đã pass phase 3) | `cb_nv_tw_01` | 6 CTĐT cover 6 LV | ✅ | R6.3.5 PASS 6/6 (trước R11) |
| 1 | `DU_THAO → CHO_DUYET` ([Gửi phê duyệt]) | `cb_nv_tw_01` | CTDT-BTP-TW-2026-0001 | ❌ | BUG-FUNC-CTDT-001 — BE 422 ERR-BIZ-III-01-04 |
| 2 | `CHO_DUYET → DA_DUYET` ([Duyệt]) | `cb_pd_tw_01` | — | 🚫 | Cascade từ Bước 1 |

> Icon: ✅ pass · ❌ fail · ⏭ skip · 🚫 blocked · — chưa test

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R11 | 2026-05-02 | BLOCK 0/2 transition. BE chặn submit CTĐT chưa có KH (ERR-BIZ-III-01-04 không trong SRS). Log BUG-FUNC-CTDT-001 Critical. |

---

## Bằng chứng (R11)

![CTDT-0001 form chi tiết — sau click confirm modal "Gửi phê duyệt", CTĐT vẫn "Dự thảo"](../bug-reports/image/bug-flow-ctdt-001-422-no-khoa-hoc.png)

```text
POST /api/v1/chuong-trinh-dao-taos/6f9a8f18-b5ba-4cc1-82c4-e33b8144f4aa/submit
Status: 422
Response: {"success":false,"error":{"code":"ERR-BIZ-III-01-04","message":"Không thể gửi phê duyệt chương trình chưa có khóa học nào", ...}}
```

**Cascade impact:** R6.4.B2 BLOCK → R6.4.B2.5 (KH cần CTĐT cha `DA_DUYET` per dropdown filter SCR-III-02 Tab Thông tin) BLOCK → R6.4.B7 BLOCK.

---

*R11 | QA Automation via Claude Code*
