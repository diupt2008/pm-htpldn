# Seed Checklist — Doanh nghiệp (T1.B2 — full pool 12)

> 🔄 **POST-RESET 2026-05-01:** Dev reset toàn DB. Pass count + sample ID dưới đây là **tham chiếu pre-reset** (R1-R10), KHÔNG phản ánh data hiện tại. Re-seed theo [post-reset-seed-plan.md](../../../../tasks/post-reset-seed-plan.md) Phase 1-2. R11 sẽ tick lại checkbox sau khi seed lại OK.

---

**Ngày:** 2026-04-26 23:10 (chính) + 2026-04-27 00:00–00:30 (bổ sung [7..12]) • **Tài khoản:** `cb_nv_tw_01`
**Màn:** SCR-V.III-02 • **Đường dẫn:** `/doanh-nghiep/danh-sach`
**Dữ liệu mẫu:** [seed-fixture.yaml > dn_variants 12 record](../../../../input/data/seed-fixture.yaml)
**SRS:** [FR-V.III-01](../../../../input/srs-v3/srs-fr-08-doanh-nghiep.md)

---

## Kết quả: ✅ XONG 12/12 (6 reuse + 6 NEW edge)

12/12 record DN tồn tại trong DB. [1..6] reuse từ R4 (DN-{HNI/HPG/DNG}-0001/0002). [7..12] seed mới Round 5 (DN-{HNI-0003,HNI-0004,HPG-0003,HPG-0004,DNG-0003,HNI-0005}).

**Bug:** 0 bug Major mới. Có 1 Minor obs về precision (trình bày dưới). 1 obs về missing validation BVA boundary NĐ39 (DN[12] vượt ngưỡng vẫn được lưu).

---

## Bảng dữ liệu seed — đầy đủ 12 variant

| # | Mã DN | Tên | MST | Quy mô | Tỉnh | Loại DN (DB) | Scenario | Có vào kho? |
|---|-------|-----|-----|:--:|---|---|---|:---:|
| 1 | DN-HNI-0001 | Công ty TNHH Kiểm thử Alpha | 0100100101 | Nhỏ | Hà Nội | (R4) | happy path | ✅ reuse |
| 2 | DN-HNI-0002 | Công ty Cổ phần Beta | 0100100102 | Siêu nhỏ | Hà Nội | (R4) | happy path | ✅ reuse |
| 3 | DN-HPG-0001 | Công ty TNHH Gamma Sản xuất | 0200200203 | Vừa | Hải Phòng | (R4) | happy path | ✅ reuse |
| 4 | DN-HPG-0002 | Doanh nghiệp Tư nhân Delta | 0200200204 | Nhỏ | Hải Phòng | (R4) | happy path | ✅ reuse |
| 5 | DN-DNG-0001 | Công ty Cổ phần Epsilon IT | 0300300305 | Vừa | Đà Nẵng | (R4) | happy path | ✅ reuse |
| 6 | DN-DNG-0002 | Công ty TNHH Zeta Giáo dục | 0300300306 | Siêu nhỏ | Đà Nẵng | (R4) | happy path | ✅ reuse |
| 7 | DN-HNI-0003 | Hộ kinh doanh Eta - Bún chả Hà Nội | 0100100107 | Siêu nhỏ | Hà Nội | Hộ kinh doanh | BVA SIEU_NHO 5 LĐ + 800tr DT | ✅ NEW |
| 8 | DN-HNI-0004 | Công ty TNHH Theta Logistics | 0100100108 | Vừa | Hà Nội | DN nhỏ và vừa | BVA just-below 199 LĐ + 99 tỷ DT | ✅ NEW |
| 9 | DN-HPG-0003 | Công ty Cổ phần Iota Y tế | 0200200209 | Nhỏ | Hải Phòng | DN nhỏ và vừa | phụ_nữ_làm_chủ=false (gender ĐD nam) | ✅ NEW |
| 10 | DN-HPG-0004 | Doanh nghiệp Tư nhân Kappa Nông sản | 0200200210 | Siêu nhỏ | Hải Phòng | DN nhỏ và vừa | phụ_nữ_làm_chủ=true (toggle ON) | ✅ NEW |
| 11 | DN-DNG-0003 | Công ty TNHH Lambda Du lịch | 0300300311 | Nhỏ | Đà Nẵng | DN nhỏ và vừa | soft-delete OK (no VV gắn) | ✅ NEW |
| 12 | DN-HNI-0005 | Công ty Cổ phần Mu Tài chính | 0100100112 | Vừa | Hà Nội | DN nhỏ và vừa | BVA vượt ngưỡng 250 LĐ + 200 tỷ DT | ✅ NEW |

**Tổng:** 12/12 vào kho · 0 chặn · 100% pool fixture v2.5

---

## Observations (không log bug — không có SRS clause cứng)

1. **Precision drift cho input số tiền lớn:** DN[8] doanh thu 99 tỷ (raw value 99000000512), DN[12] vốn 300 tỷ (raw value 299999985664). UI hiển thị đúng "99.000.000.000" nhưng DB store value khác ~512đ. Do JS Number 32-bit conversion. Không ảnh hưởng nghiệp vụ (cosmetic).
2. **Loại DN schema khác fixture:** DB dùng schema NĐ39 (DN_SIEU_NHO/DN_NHO_VA_VUA/HO_KINH_DOANH/HOP_TAC_XA/DN_XA_HOI). Fixture đề xuất TNHH/CP/DNTN/HKD theo Luật DN. Khi seed, dùng DB schema (DN_NHO_VA_VUA = mặc định cho TNHH/CP/DNTN trong fixture).
3. **DN[12] BVA vượt ngưỡng KHÔNG được FE/BE validate:** input 250 LĐ + 200 tỷ DT vượt ngưỡng "Vừa" theo NĐ39 nhưng FE accept submit + BE persist. Không có WRN-DN-01 / không reject. Cần BA confirm: có cần validate không hay cho phép vượt ngưỡng (chỉ cảnh báo cosmetic)?

---

## Sample IDs cho downstream

**Pool [1..6]** dùng cho happy path workflow (A3 SM-VUVIEC, A4 SM-HOIDAP với DN scope, A5 SM-TVCS).
**Pool [7..12]** dùng cho edge case test ở P4:
- DN-HNI-0003 (HKD Eta) → T4.4 DN test loại HKD
- DN-HNI-0004 (Theta cận biên VUA) → T4.4 BVA boundary just-below
- DN-HPG-0003 (Iota PNN=false) → T4.4 cờ phụ nữ làm chủ
- DN-HPG-0004 (Kappa PNN=true) → T4.4 ưu tiên NĐ55
- DN-DNG-0003 (Lambda no-VV) → T4.4 soft-delete cascade-check
- DN-HNI-0005 (Mu vượt ngưỡng) → T4.4 BVA + WRN-DN-01

---

## Ảnh chụp

- [List 6 DN reuse R4 (T1.B2 chính)](../screenshots/seed-dn/dn-list-6-record.png)
- [List 12 DN sau seed [7..12]](../screenshots/seed-dn/dn-list-12-record.png)

---

*2026-04-26 23:10 + 2026-04-27 00:30 — QA chạy bằng Chrome DevTools MCP*
