# Decision — GIANG_VIEN SRS contradiction (2026-04-27)

Phát hiện 2026-04-27 khi review B6 readiness.

## 2 nguồn SRS mâu thuẫn

| Nguồn | Enum `trang_thai` |
|---|---|
| FR-III-11 §Inputs (`srs-fr-03-dao-tao.md:827`) | `DANG_GIANG_DAY / TAM_DUNG` (2 enum) |
| §3.4.3.25 row 11 (`srs-v3.md:1933`) | `DANG_HOAT_DONG / TAM_DUNG / VO_HIEU_HOA` (3 enum, default `DANG_HOAT_DONG`) |

## Quyết định

**§3.4.3.25 (data dictionary)** = source of truth. BE persist + UI render dropdown filter theo nguồn này. FR-III-11 §Inputs outdated, BA cần sửa align §3.4.3.25.

## Hành động

- `BUG-GV-002-R4` Medium re-classify: từ "BE enum mismatch SRS" → "SRS internal contradiction, BA confirm sửa FR-III-11".
- Sửa fixture `seed-fixture.yaml` line 1789-1791 comment: cite cả 2 nguồn + flag contradiction.
- Variant [7] `TAM_DUNG`: 2 step (create default `DANG_HOAT_DONG` + manual toggle).
- Re-test 3 R4 bug khi seed B6: BUG-GV-001/002/003.

## Bài học chung (đã save memory `feedback_fixture_mismatch_not_bug`)

Khi entity có 2 nguồn SRS conflict (§Inputs vs §3.4.3.x): mặc định ưu tiên §3.4.3.x làm source of truth (data layer). Khi log bug enum/field: grep cả 2 nguồn trước khi quyết classify.
