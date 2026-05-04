# Workflow Test Report — {{TÊN MODULE}}

> **Module:** {{Tên đầy đủ + mã FR}} · **SRS:** [`02-thu-tu-module.md §{{X}}`](../../../input/quy-trinh-nghiep-vu/02-thu-tu-module.md) · **Round:** R{{N}} · **Date:** YYYY-MM-DD · **Tester:** {{Tên QA}}
> **Bug:** [`bug-report-flow-{{module}}.md`](bug-report-flow-{{module}}.md)

---

## Kết luận

{{✅ PASS / ⚠️ PASS-WITH-NOTE / ❌ FAIL}} — **{{X}}/{{Y}} bước PASS**. {{Fail tại Bước N (bug ID) | Còn N bước chưa test | Tất cả pass}}.

> {{Optional: TODO ambiguity SRS — nếu spec có conflict, ghi rõ ở đây kèm link line}}.

---

## Bảng kiểm tra workflow

> Copy đầy đủ transition từ bảng SRS `02-thu-tu-module.md §X` vào đây. Mỗi transition 1 row. Đừng tự bỏ bớt.

| # | Bước (transition) | Actor | Sample test | Status | Bug / Note |
|:-:|---|---|---|:-:|---|
| 1 | `{{From state}} → {{To state}}` ({{trigger / button label}}) | {{role}} | {{Sample ID}} | {{icon}} | {{bug ID hoặc lý do skip/blocked}} |
| 2 | ... | ... | ... | ... | ... |
| N | ... | ... | ... | ... | ... |

> Icon: ✅ pass · ❌ fail · ⏭ skip (defer external/cron) · 🚫 blocked (cascade upstream) · — chưa test

---

## Lịch sử round

| Round | Date | Kết quả tóm tắt (1 dòng) |
|---|---|---|
| R1 | DD/MM | {{vd: Seed N sample state X PASS}} |
| R2 | DD/MM | {{vd: FAIL Bước N — log BUG-XX}} |
| R{{N}} | DD/MM | {{kết quả round mới nhất}} |

---

## Bằng chứng (chỉ bước fail / pass quan trọng round mới nhất)

![{{Caption}}](../bug-reports/image/r{{N}}-{{slug}}.png)

```text
{{Optional: API request/response cho bước fail hoặc bước key pass}}
```

---

*R{{N}} | {{Tester}}*
