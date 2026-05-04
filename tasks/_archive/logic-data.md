# Logic-Data — Hướng dẫn tạo data test PM HTPLDN cho QA

> **Mục đích:** Tra nhanh trước khi seed/test. Biết **tạo data gì trước, data gì sau**, màn nào phụ thuộc data nào, cái nào nhập tay được, cái nào bắt buộc đồng bộ.
>
> **Đọc chi tiết state machine + selector:** [`flow-module.md`](../flow-module.md). **Đọc bảng transition đầy đủ:** [`02-thu-tu-module.md`](./02-thu-tu-module.md). File này **rút gọn** cho QA nhìn tổng quan.

---

## 1. Hệ thống chia thành 5 "LỚP DATA" — test từ trên xuống

Dữ liệu PM HTPLDN chảy từ upstream → downstream. Module dưới **đọc** data module trên → muốn test module dưới phải seed xong module trên.

```
┌─────────────────────────────────────────────────────────────┐
│ LỚP 1: QUẢN TRỊ (nền tảng — giả định đã setup)              │
│   → Danh mục, Đơn vị, Tài khoản, Cấu hình SLA, Phân công   │
├─────────────────────────────────────────────────────────────┤
│ LỚP 2: MASTER DATA (ai hỗ trợ ai, tài liệu nền)             │
│   → Doanh nghiệp · Tư vấn viên · Biểu mẫu · CT HTPLDN GĐ1  │
├─────────────────────────────────────────────────────────────┤
│ LỚP 3: GIAO DỊCH LÕI (ghi nhận yêu cầu hỗ trợ)              │
│   → Vụ việc · Hỏi đáp · Tư vấn chuyên sâu · Khóa học       │
├─────────────────────────────────────────────────────────────┤
│ LỚP 4: HẬU KỲ (xử lý sau khi hoàn thành)                    │
│   → Hợp đồng · Chi trả · Đánh giá HQ · Tư vấn Nhanh        │
├─────────────────────────────────────────────────────────────┤
│ LỚP 5: ĐẦU RA (đọc từ tất cả các lớp trên)                  │
│   → CT HTPLDN GĐ2 · Báo cáo · Dashboard · API              │
└─────────────────────────────────────────────────────────────┘
```

**Quy tắc vàng:** Seed hết LỚP N rồi mới test LỚP N+1. Bỏ qua = tab rỗng / workflow block / KPI = 0.

---

## 2. Thứ tự tạo data — làm theo 5 bước

### BƯỚC 1 — QTHT pre-seed (QA không tự tạo, chỉ verify)

Môi trường test được QTHT setup sẵn các thứ sau. QA **không phải tự tạo**, nhưng **phải check tồn tại** trước test case phụ thuộc. Thiếu → nhờ QTHT seed qua `SCR-VIII-01..04/13/14`.

- Danh mục chuẩn (Lĩnh vực PL, Tổ chức tư vấn, Loại DN, Loại hình HT, Tiêu chí ĐG…)
- Đơn vị 3 cấp (TW/BN/ĐP)
- Tài khoản theo role (`cb_nv_tw_01`, `cb_pd_tw_01`, `qtht_01`…)
- **`CAU_HINH_SLA`** (SCR-VIII-06 Tab 1) — thuần QTHT pre-seed. Prereq cho FR-V.I-09 Phân công VV (tính deadline)

⚠️ **`CAU_HINH_PHAN_CONG` KHÔNG thuần LỚP 1** — xem BƯỚC 1.5 bên dưới.

### BƯỚC 1.5 — Cấu hình phân công (xen kẽ LỚP 1/2)

`CAU_HINH_PHAN_CONG` = mapping **Lĩnh vực PL ↔ CB/TVV phụ trách** (SRS: `srs-fr-10-quan-tri.md:1574` + FR-II-NEW-01 tại `srs-fr-02-hoi-dap.md:695-754`). Là prereq của FR-II-06 Phân công Hỏi đáp (dropdown "gợi ý người xử lý" rỗng nếu chưa map).

**Màn seed:** `SCR-VIII-06` Tab 2 "Phân công mặc định" → [+ Thêm mapping]. Form có **1 dropdown duy nhất "Người xử lý"** (UI verified 2026-04-25). Đối chiếu DDL `CAU_HINH_PHAN_CONG` (`srs-fr-02-hoi-dap.md:1202-1216`): chỉ 1 cột `nguoi_xu_ly_id` FK → `TAI_KHOAN`. Phân biệt CB vs TVV thông qua `vai_tro` của `TAI_KHOAN` (TVV ACTIVE cũng có `TAI_KHOAN`), KHÔNG phải 2 cột tách.

> ⚠️ **Sửa 2026-04-25:** Bản trước viết "2 dropdown tách biệt CB/TVV" — sai do interpret SRS sai. UI thực tế + DDL chỉ 1 cột.

**Nguồn dropdown (verified từ SRS FR-II-NEW-01 Inputs line 712-720 + UI 2026-04-25):**

| Dropdown trong form | Nguồn data | Filter |
|---|---|---|
| **Lĩnh vực PL** | `DANH_MUC` loại `LINH_VUC_PL` | đang hoạt động |
| **Người xử lý** | `TAI_KHOAN` | `trang_thai = HOAT_DONG` (theo ERR-CH-02). Bao gồm cả CB (CB NV / CB PD) và TVV ACTIVE — TVV được phê duyệt sẽ được cấp tài khoản, xuất hiện trong danh sách. |
| **Đơn vị áp dụng** | `DON_VI` | auto-fill theo đơn vị user (Inputs #3) |
| **Mức ưu tiên** | input số | default 99, 1 = cao nhất (Inputs #4) |

**Hệ quả: có 2 đợt seed (vẫn tách như cũ — vì TVV ACTIVE phụ thuộc workflow Tier 1)**

| Đợt | Người xử lý map vào | Thứ tự thực hiện |
|---|---|---|
| **Đợt 1 — chỉ map CB** | Dùng TK CB có sẵn từ BƯỚC 1 (`cb_nv_tw_01`...) | Làm được **ngay sau BƯỚC 1** |
| **Đợt 2 — backfill thêm TVV** | TK TVV `HOAT_DONG` (sau khi TVV qua workflow phê duyệt) | **Phải làm sau BƯỚC 2 ②** (SM-TVV có phê duyệt + cấp TK). Add **row mới** với `uu_tien = 2` (CB row cũ giữ `uu_tien = 1`), KHÔNG update row Đợt 1. |

**Khuyến nghị:** Nếu chỉ smoke test FR-II Phân công → dùng Đợt 1 cho nhanh. Nếu cần test full scenario phân công ưu tiên TVV theo lĩnh vực → làm Đợt 2.

### BƯỚC 2 — Tạo master data (4 việc, song song được)

| Việc | Ai tạo | Vào màn | Kết quả |
|---|---|---|---|
| **① Thêm Doanh nghiệp** | CB NV | `SCR-V.III-02` → [+ Thêm mới] | 1 DN có MST, quy mô (Siêu nhỏ/Nhỏ/Vừa) |
| **② Thêm Tư vấn viên** | CB NV tạo → CB PD duyệt | `SCR-IV-02` → [+ Thêm mới] → [Trình duyệt] → CB PD [Phê duyệt] | 1 TVV trạng thái `ĐANG HOẠT ĐỘNG` |
| **③ Upload Biểu mẫu** (optional) | CB NV | `SCR-VII-02` → upload file | 1 biểu mẫu `NHAP` / `CÔNG KHAI` |
| **④ Lập Kế hoạch CT HTPLDN** (optional) | CB NV → CB PD → CB NV | `SCR-XI-01` Tab Thông tin → [+ Tạo kế hoạch] → Trình → Duyệt → Công bố → Kích hoạt | 1 CT trạng thái `ĐANG THỰC HIỆN` |

**Lưu ý:** ① và ② là **bắt buộc** cho LỚP 3. ③ và ④ làm khi cần test module tương ứng.

### BƯỚC 3 — Tạo giao dịch lõi (4 luồng, mỗi luồng là 1 workflow)

Mỗi luồng đều có **vài state** đi qua nhiều role. Bảng dưới chỉ nêu input + output, chi tiết state xem `flow-module.md`.

| Luồng | Input cần có | Flow thao tác | Output state cuối |
|---|---|---|---|
| **⑤ Vụ việc TGPL** | DN ① + TVV ② | CB NV tạo VV → Kiểm tra hồ sơ → Phân công TVV → TVV xử lý → CB NV trình duyệt → CB PD duyệt → CB NV cập nhật KQ | `HOÀN THÀNH` |
| **⑥ Hỏi đáp** | DN ① + người xử lý (TVV ② **hoặc** CB NV trong đơn vị — theo `flow-module.md` §6 bước 3) | CB NV nhập câu hỏi → Tiếp nhận → Phân công → Người được gán trả lời (tick "Đã trả lời" → auto chuyển Chờ duyệt) → CB PD duyệt → CB NV công khai | `DA_DUYET` / `CÔNG KHAI` |
| **⑦ Tư vấn chuyên sâu** | DN ① + TVV ② (vai trò Chuyên gia) | CB NV tạo yêu cầu → Phân công CG → CG thực hiện (auto chuyển Chờ duyệt) → CB PD duyệt | `ĐÃ DUYỆT` |
| **⑧ Khóa học** | Giảng viên (tạo từ tab Giảng viên) | CB NV tạo CTĐT → tạo Khóa học → Trình duyệt → CB PD duyệt → CB NV công khai → thêm học viên → diễn ra → kết thúc → chấm điểm → CB PD duyệt kết quả | `HOÀN THÀNH` + có chứng nhận |

**Lưu ý cascade:** Module Vụ việc **bypass 2 state đầu** khi tester nhập tay (chưa có integration DVC). Module Khóa học cũng bypass bước "DN đề xuất từ Cổng PLQG".

### BƯỚC 4 — Hậu kỳ (chạy sau khi LỚP 3 có state cuối)

| Luồng | Input cần có | Ghi chú |
|---|---|---|
| **⑨ Hợp đồng tư vấn** | TVV ② + VV ⑤ `HOÀN THÀNH` | Thuần CRUD, không có phê duyệt. Chỉ liên kết N:N với VV đã xong |
| **⑩ Chi trả chi phí** | VV ⑤ + DN ① + TVV ② + (optional) HĐ ⑨ | 🚫 **KHÔNG CÓ NÚT THÊM MỚI** — phải BE inject hoặc chờ LGSP. Hiện BLOCKED |
| **⑪ Đánh giá hiệu quả** | ≥ 3 VV `HOÀN THÀNH` trong kỳ + TVV làm đánh giá viên | CB NV lập đợt → phân công → CB PD duyệt PC → đánh giá viên chấm → CB NV trình BC → CB PD duyệt cuối |
| **⑫ Tư vấn Nhanh** — phần B (Kho Q&A) | Lĩnh vực PL (DM LỚP 1) | CB NV nhập câu hỏi → CB PD duyệt → bật `hieu_luc = 1`. Hoặc **auto-feed** từ Hỏi đáp ⑥ `DA_DUYET` |
| **⑫ Tư vấn Nhanh** — phần A (Phiên TV) | Kho Q&A ⑫B đã có data | 🚫 **KHÔNG CÓ NÚT THÊM MỚI** — DN khởi tạo từ Cổng PLQG. Hiện BLOCKED |

### BƯỚC 5 — Đầu ra (đọc từ LỚP 2/3/4)

Chỉ cần seed đủ LỚP 2/3/4 là chạy được. Không phải "tạo" data mới.

| Module | Phụ thuộc | Cách test |
|---|---|---|
| **⑬ CT HTPLDN GĐ2 — Đợt báo cáo** | CT GĐ1 `ĐANG THỰC HIỆN` + số liệu VV/Chi trả/Khóa học trong kỳ | CB NV cấp BN/ĐP lập đợt BC → điền Mẫu 21a/21b → duyệt → gửi TW → TW tổng hợp |
| **⑭ Báo cáo thống kê** (23 loại) | Mọi entity ở trạng thái cuối | Chọn 1 trong 23 loại BC → nhập filter → [Chạy] → xuất Excel/Word |
| **⑮ Dashboard** (9 KPI) | Toàn bộ transactional | Mở trang chủ CMS → verify số liệu khớp công thức |
| **⑯ API kết nối** (18 outbound + 8 inbound) | Upstream ở state `DA_DUYET` / `CÔNG KHAI` | curl endpoint → verify payload. 8 inbound BLOCKED chờ LGSP |

---

## 3. Bảng FR-code — dùng khi viết test plan

Mỗi dòng = **1 hành động workflow quan trọng có FR-code** để trace ngược về SRS. Dùng khi bạn viết test plan cho 1 module và cần biết trước action đó cần prereq gì, sinh ra data gì cho downstream.

| Chức năng / Màn hình | Data đầu vào bắt buộc (upstream) | Data đầu ra → Downstream tiêu thụ |
|---|---|---|
| **Phân công Hỏi đáp** (FR-II-06) | • `DOANH_NGHIEP` tồn tại<br>• `TU_VAN_VIEN` = `DANG_HOAT_DONG`<br>• `CAU_HINH_PHAN_CONG` đã map lĩnh vực *(xem BƯỚC 1.5 — seed Case A hoặc B)* | Sinh `HOI_DAP` = `DA_DUYET` → Kho Q&A Tư vấn Nhanh (FR-X.2) |
| **Phân công Vụ việc** (FR-V.I-09) | • `DOANH_NGHIEP` tồn tại<br>• `TU_VAN_VIEN` = `DANG_HOAT_DONG`<br>• `CAU_HINH_SLA` *(BƯỚC 1 — QTHT pre-seed)* | Sinh `VU_VIEC` = `HOAN_THANH` → Đánh giá (FR-VI) + Chi trả (FR-V.II) |
| **Chi trả Chi phí** (FR-V.II-05 / FR-V.II-12) | • `VU_VIEC` liên kết ID<br>• `TU_VAN_VIEN` thực hiện tư vấn<br>• `DOANH_NGHIEP` (quy mô Siêu nhỏ/Nhỏ/Vừa → tính % hỗ trợ theo BR-CALC-01) | Sinh `HO_SO_CHI_TRA` = `DA_THANH_TOAN` → số liệu Kinh phí cho Báo cáo CT HTPLDN (FR-XI) |
| **Chọn Vụ việc Đánh giá** (FR-VI-05) | • `VU_VIEC` = `HOAN_THANH` **trong kỳ đánh giá**<br>• `TIEU_CHI_DANH_GIA` (Σ trọng số = 100%) | Sinh `BAO_CAO_DANH_GIA` → Dashboard (FR-I) + Báo cáo (FR-IX) |
| **Lập Báo cáo TT17 / Mẫu 21a-21b** (FR-XI-06) | Toàn bộ data giao dịch: `VU_VIEC`, `KHOA_HOC`, `HO_SO_CHI_TRA`, `TU_VAN_VIEN` ở trạng thái cuối (Đã duyệt / Hoàn thành) | Auto-fill cột biểu mẫu 21a/21b; xuất Excel/Word cho TW tổng hợp |
| **Tư vấn Nhanh — Tra cứu** (FR-X.2-02) | `KHO_CAU_HOI` = `DA_DUYET` **và** `hieu_luc = 1` | Sinh `PHIEN_TU_VAN` = `HOAN_THANH` → phục vụ Báo cáo thống kê |
| **Báo cáo thống kê** (FR-IX-01..23) | Bản ghi của **MỌI entity nghiệp vụ** ở trạng thái cuối (`DA_DUYET` / `HOAN_THANH` / `DA_THANH_TOAN`) — theo BR-RPT-01 | Read-only output (không sinh data mới) |

**Cách đọc:**
- **Cột giữa** = prereq bắt buộc. Thiếu 1 item → action fail hoặc màn hình rỗng.
- **Cột phải** = data sinh ra + ai là downstream consumer. Biết để test tiếp module downstream.
- **Khác với §4 (Bản đồ UI element):** §3 phục vụ **viết test plan** (trace FR-code → SRS), §4 phục vụ **debug tại chỗ** (mở màn thấy trống → seed gì trước).

---

## 4. Bản đồ "màn nào cần data nào" (tra nhanh)

QA mở 1 màn hình mà thấy trống → tra bảng này trước khi log bug.

| Muốn test màn hình / chức năng này | Phải có data này trước | Nếu trống thì… |
|---|---|---|
| **DN detail Tab "Hồ sơ PL"** | Tư vấn chuyên sâu ⑦ đã tạo HSPL gắn DN | Seed preset P1 bước 2 |
| **DN detail Tab "Lịch sử hỗ trợ"** (3 KPI) | VV ⑤ `HOÀN THÀNH` gắn DN | Chạy VV đủ 8 state, không dừng giữa chừng |
| **DN detail Tab "Hồ sơ chi trả"** | Chi trả ⑩ `ĐÃ THANH TOÁN` | BLOCKED — BE inject hoặc chờ LGSP |
| **TVV detail Tab "Lịch sử hỗ trợ"** | VV ⑤ gắn TVV này | Seed preset P2 |
| **Dropdown "Chọn TVV"** (khi phân công VV/HD/Chi trả) | TVV ② `ĐANG HOẠT ĐỘNG` | Quay lại duyệt TVV |
| **Dropdown "Chọn DN"** (khi tạo VV/HD/TV CS) | DN ① đã lưu thành công | Kiểm `don_vi_id` của user khớp DN |
| **Dropdown "Chọn VV"** (khi tạo Hợp đồng/Chi trả) | VV ⑤ `HOÀN THÀNH` | Chạy bước cuối "Cập nhật KQ" cho VV |
| **Danh sách "Chấm điểm"** (Đánh giá HQ) | ≥ 1 VV `HOÀN THÀNH` trong kỳ đánh giá | Kiểm `ngay_hoan_thanh` có trong kỳ |
| **Mẫu 21a/21b auto-fill** | VV/Khóa học/Chi trả trong kỳ | Seed đủ LỚP 3+4 trong kỳ BC |
| **Dashboard KPI ≠ 0** | Toàn bộ transactional | Chạy preset P1 + P2 + P4 |
| **Tư vấn Nhanh trả về gợi ý** | Kho Q&A ⑫B `DA_DUYET` + `hieu_luc=1` | Seed Kho Q&A trước |
| **API outbound `GET /...`** | Upstream state `DA_DUYET` / `CÔNG KHAI` | Seed upstream trước khi curl |

---

## 5. Phân loại — cái nào nhập tay, cái nào không?

### ✅ NHẬP TAY ĐƯỢC (có nút `[+ Thêm mới]`)

Tất cả module sau đây test được ngay không cần integration ngoài:

1. Doanh nghiệp (+ Import Excel hàng loạt)
2. Tư vấn viên (CB NV nhập hộ thay "TVV tự đăng ký")
3. Biểu mẫu (upload file)
4. CT HTPLDN GĐ1 (Kế hoạch)
5. Vụ việc (bypass 2 state đồng bộ DVC)
6. Hỏi đáp (nhập hộ thay DN gửi qua Cổng)
7. Tư vấn chuyên sâu (nhập hộ thay API Cổng PLQG)
8. Khóa học / Bài giảng / NH câu hỏi / Giảng viên
9. Hợp đồng tư vấn
10. Đánh giá hiệu quả
11. Kho Q&A (Tư vấn Nhanh phần B)
12. CT HTPLDN GĐ2 (Đợt BC)
13. Báo cáo thống kê (chạy query)

### 🚫 KHÔNG NHẬP TAY ĐƯỢC — chỉ đồng bộ từ ngoài

| Module / Chức năng | Nguồn bắt buộc | Trạng thái QA |
|---|---|---|
| **Hồ sơ Chi trả — Mẫu 01 NĐ55** | DN nộp qua Cổng DVC → LGSP | 🚫 BLOCKED. Test negative: verify **KHÔNG thấy** nút `[+ Thêm mới]` trên `SCR-V.II-01` — nếu thấy = BUG. Chờ BE inject thì test được workflow phê duyệt |
| **Phiên Tư vấn Nhanh** (phần A) | DN gửi câu hỏi từ khung chat Cổng PLQG | 🚫 BLOCKED. CB NV chỉ tham gia khi DN không hài lòng gợi ý |
| **Điểm đánh giá chất lượng TV chuyên sâu** (1-5★) | API inbound từ Cổng (DN chấm) | 🚫 CMS read-only, không sửa được |
| **Dữ liệu VNeID** (CCCD, họ tên chuẩn) | NDXP ↔ VNeID Bộ Công an | Đồng bộ ngầm |
| **DM dùng chung BTP** (Tỉnh/thành, Lĩnh vực PL) | API DM Dùng chung BTP | Auto-gen |
| **AUDIT_LOG** | Trigger từ mọi thao tác CUD | Không ai tạo/sửa/xóa, kể cả Admin |
| **API inbound** (8 endpoint `POST /vu-viec`, `/chi-tra`…) | JWT LGSP | 🚫 BLOCKED chung với 2 mục đầu |

---

## 6. 4 preset seed data có sẵn (dùng khi gặp "màn hình rỗng")

| Preset | Dùng khi test | Chạy cái gì |
|---|---|---|
| **P1** — DN detail đầy đủ | Tab 2/3/4 của DN | DN → HSPL → TVV → VV HOÀN THÀNH → Chi trả (P3) |
| **P2** — TVV đầy đủ | Tab "Lịch sử hỗ trợ" của TVV | TVV + 2 DN + VV #A HOÀN THÀNH + VV #B ĐANG XỬ LÝ |
| **P3** — Chi trả E2E | Workflow phê duyệt chi trả | 🚫 BLOCKED chờ BE inject `CHỜ TIẾP NHẬN` |
| **P4** — Đánh giá HQ | Đợt đánh giá có đủ VV chấm | Chạy P2 × 3 → có 3 TVV + 6 DN + 3 VV HOÀN THÀNH |

Chi tiết giá trị cụ thể (MST, tên, số tiền, ngày) xem [`../data/seed-fixture.yaml`](../data/seed-fixture.yaml).

---

## 7. Checklist QA trước khi log bug "tab trống"

Khi thấy tab / màn hình trống, **theo thứ tự** check các câu hỏi sau:

1. **UI có text "Chức năng đang phát triển" không?** → YES = BUG Critical (UI chưa build), log ngay.
2. **Đã seed đủ data upstream chưa?** → Tra bảng §4 ở trên. Nếu chưa → seed xong rồi retest.
3. **Record mong đợi có ở trạng thái cuối chưa?** (VD: VV phải `HOÀN THÀNH`, không phải `ĐÃ DUYỆT`). → Chưa thì chạy nốt workflow.
4. **Data nằm đúng kỳ / đúng đơn vị scope của user không?** → Check `ngay_hoan_thanh` trong kỳ, `don_vi_id` của user khớp data.
5. **API trả gì?** (mở DevTools Network / MCP `list_network_requests`). → 
   - API 200 có data nhưng UI trống = FE bug
   - API 200 data = [] = BE scope filter sai / chưa có data thật
   - API 404 = route chưa build (BE bug)
   - API envelope wrap 2 lần = bug double-wrap (xem memory `qa_htpldn_api_wrap_bug`)
6. **Vẫn không ra?** → Log bug với screenshot + API response + state upstream thực tế.

---

## 8. Mấy điểm "gotcha" hay sai

1. **Module Vụ việc bypass 2 state** khi nhập tay (tester skip `MỚI TẠO` + `CHỜ TIẾP NHẬN`, khởi tạo thẳng `ĐÃ TIẾP NHẬN`). Khi integration DVC xong phải test lại full 9 state.
2. **Đánh giá HQ có double-state**: SM = `LAP_KE_HOACH` nhưng DB field = `NHAP`. Test phải assert cả hai.
3. **Kho Q&A có 2 nguồn:** `THU_CONG` (CB NV nhập tay, có phê duyệt) vs `TU_DONG` (auto từ Hỏi đáp `DA_DUYET`, bỏ qua duyệt). Test phải tách rõ.
4. **CT HTPLDN có 2 giai đoạn độc lập:** GĐ1 Kế hoạch test ngay sau QTHT (BƯỚC 2); GĐ2 Đợt BC chỉ chạy khi CT `ĐANG THỰC HIỆN` + đủ số liệu LỚP 3/4 (BƯỚC 5).
5. **Chi trả là module DUY NHẤT chặn nhập tay.** Thấy nút `[+ Thêm mới]` trên SCR-V.II-01 = BUG vi phạm spec.
6. **Khóa học có state `DA_CONG_KHAI` trong DB ENUM nhưng Phụ lục C.2 bỏ sót transition.** Test plan cần note mâu thuẫn SRS và confirm với BA.

---

## 9. Link tham khảo

| Cần biết | Đọc file |
|---|---|
| State machine chi tiết, thao tác click-level, selector | [`../flow-module.md`](../flow-module.md) |
| Bảng transition đầy đủ 16 module + 5 luật suy dẫn | [`02-thu-tu-module.md`](./02-thu-tu-module.md) |
| Entity tạo tại màn nào / đọc tại màn nào | [`../data/entity-map.md`](../data/entity-map.md) |
| Giá trị cụ thể (MST, số tiền, ngày) khi seed | [`../data/seed-fixture.yaml`](../data/seed-fixture.yaml) |
| Tổng quan business | [`01-tong-quan-nghiep-vu.md`](./01-tong-quan-nghiep-vu.md) |
| Tài khoản test + convention | [`../users.csv`](../users.csv) |
