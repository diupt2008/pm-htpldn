# Bug Report — Quản trị hệ thống / Nhật ký hệ thống (SCR-VIII-10 / FR-VIII-28)

| Thông tin | Giá trị |
|-----------|---------|
| **Dự án** | PM HTPLDN (Phần mềm Hỗ trợ Pháp lý Doanh nghiệp) |
| **Phiên bản** | 1.0 |
| **Môi trường** | http://103.172.236.130:3000/ |
| **Người test** | QA Automation via Claude Code (Chrome DevTools MCP) |
| **Ngày** | 10:35:00 2026-04-22 |
| **Loại test** | UI Compliance (UI vs SRS) |
| **Round** | Round 1 |
| **Tài liệu tham chiếu** | [srs-fr-10-quan-tri.md §SCR-VIII-10](../../../../input/srs-v3/srs-fr-10-quan-tri.md) + NotebookLM query `f3f70416fef5` |

---

## Tổng hợp

Kiểm tra 1 màn hình duy nhất `/quan-tri/audit-log` (không chia tab) với role QTHT_TW (`qtht_tw_5`). Đối chiếu 1-1 từng thành phần SRS (11 thành phần) vs UI thực tế.

Phát hiện **11** lỗi trong đó:

| Tổng | Critical | Major | Medium | Minor | Trivial |
|------|----------|-------|--------|-------|---------|
| 11   | 0        | 4     | 4      | 3     | 0       |

**Verdict: FAIL** — Filter bar và bảng danh sách lệch nặng so với SRS. Thiếu filter "Người dùng" (core), Module/Hành động dùng mã SQL không translate, thiếu cột "Đơn vị", thiếu JSON diff expandable, thiếu badge màu, thiếu khả năng sort.

## Bug Summary Table

| Bug ID | Severity | Priority | Type | Module | TC Ref | Title | Status |
|--------|----------|----------|------|--------|--------|-------|--------|
| BUG-NKHT-001 | Major | P1 | UI/UX | Nhật ký HT | SCR-VIII-10 #4 | Thiếu filter "Người dùng" (searchable dropdown → TAI_KHOAN) | Open |
| BUG-NKHT-002 | Major | P1 | UI/UX | Nhật ký HT | SCR-VIII-10 #5 | Filter Module lệch SRS: hiển thị mã SQL + lẫn entity + thiếu 5 module | Open |
| BUG-NKHT-003 | Major | P1 | UI/UX | Nhật ký HT | SCR-VIII-10 #6 | Filter Hành động thiếu LOGIN/LOGOUT + có 5 option thừa + nhãn Anh ngữ | Open |
| BUG-NKHT-004 | Major | P1 | UI/UX | Nhật ký HT | SCR-VIII-10 #9 | Bảng thiếu cột "Đơn vị" và thiếu "Chi tiết thay đổi (JSON diff expandable)" | Open |
| BUG-NKHT-005 | Medium | P2 | UI/UX | Nhật ký HT | SCR-VIII-10 #9 | Cột "Thời gian" thiếu giây (HH:mm thay vì HH:mm:ss) và KHÔNG sortable | Open |
| BUG-NKHT-006 | Medium | P2 | Data | Nhật ký HT | SCR-VIII-10 #9 | Cột "Người thực hiện" hiển thị username thay vì ho_ten (SRS yêu cầu ho_ten) | Open |
| BUG-NKHT-007 | Medium | P2 | UI/UX | Nhật ký HT | SCR-VIII-10 #9 | "Hành động" trong bảng không có badge màu (SRS yêu cầu 7 màu theo loại thao tác) | Open |
| BUG-NKHT-008 | Medium | P2 | Data | Nhật ký HT | SCR-VIII-10 #9 | Cột "Module" hiển thị "-" (null) cho mọi dòng dù có data LOGIN/LOGIN_OTP_PENDING | Open |
| BUG-NKHT-009 | Minor | P3 | UI/UX | Nhật ký HT | SCR-VIII-10 #10 | Pagination default 20/trang thay vì 50/trang theo SRS | Open |
| BUG-NKHT-010 | Minor | P3 | UI/UX | Nhật ký HT | SCR-VIII-10 #11 | Empty state text "Trống / Không có dữ liệu" thay vì "Không tìm thấy nhật ký phù hợp." | Open |
| BUG-NKHT-011 | Minor | P3 | UI/UX | Nhật ký HT | SCR-VIII-10 #3-7 | Filter "Endpoint / IP" thừa + button "Làm mới" thừa (không có trong SRS) | Open |

> **Chú thích Type:**
> - `UI/UX` — giao diện, hiển thị, tương tác
> - `Data` — giá trị dữ liệu hiển thị không đúng spec
> - `Happy` / `Negative` / `Edge` / `Workflow` / `Permission` — không áp dụng (UI compliance test)

> **Chú thích Severity:**
> - `Critical` — không có (UI vẫn load + data vẫn hiển thị + QTHT vẫn xem được log toàn hệ thống)
> - `Major` — tính năng quan trọng (filter core, cột bảng core) lỗi, ảnh hưởng tra cứu audit log
> - `Medium` — lỗi format/behavior/giá trị, ảnh hưởng UX nhưng có thể tra cứu được
> - `Minor` — khác biệt chi tiết với spec, không ảnh hưởng nghiệp vụ

---

## BUG-NKHT-001 — Thiếu filter "Người dùng" (searchable dropdown → TAI_KHOAN)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-001 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Filter bar, route `/quan-tri/audit-log` |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **Trình duyệt** | Chromium (Chrome DevTools MCP, headed) |
| **Tài khoản** | qtht_tw_5 / Test@1234 (QTHT_TW) |
| **TC Reference** | SCR-VIII-10 #4 (Filter-bar "Người dùng") |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1538, FR-VIII-28 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS yêu cầu filter bar có 5 trường: **Từ ngày – Đến ngày / Người dùng / Module / Loại thao tác / Entity**. UI thực tế thiếu hoàn toàn filter **"Người dùng"** (dropdown searchable → TAI_KHOAN). Thay vào đó UI có "Endpoint / IP" (không có trong SRS) + "Entity type" (chỉ tên bảng, không cho tìm theo ho_ten/username).

### Các bước tái hiện

1. Đăng nhập `qtht_tw_5` / `Test@1234` → OTP `666666`
2. Sidebar → Quản trị hệ thống ▶ → Nhật ký hệ thống
3. Quan sát filter bar

### Kết quả mong đợi

Filter bar có đủ 5 field theo SRS (srs-fr-10-quan-tri.md dòng 1537-1541):

| # | Trường | Loại |
|---|--------|------|
| 1 | Từ ngày – Đến ngày | date-picker (range) |
| 2 | **Người dùng** | **select (searchable) → TAI_KHOAN** |
| 3 | Module | select |
| 4 | Loại thao tác | select |
| 5 | Entity | text-input (tên bảng hoặc mã bản ghi) |

Filter "Người dùng" cho phép QTHT tra cứu tất cả log của 1 user cụ thể — đây là use-case chính của audit log (ví dụ: "cho tôi xem mọi thao tác của `canbo_tw_3` trong tháng 4").

### Kết quả thực tế

UI chỉ có 6 field khác cấu trúc:

1. Endpoint / IP (text-input) ← **KHÔNG có trong SRS**
2. Module (select)
3. Entity type (text-input) ← SRS là "Entity" (không giới hạn type)
4. Hành động (select) ← SRS là "Loại thao tác"
5. Từ ngày (date-picker)
6. Đến ngày (date-picker)

**→ KHÔNG có field "Người dùng" searchable.**

### Bằng chứng

- [01-overview.png](image/01-overview.png) — filter bar đầy đủ, không có "Người dùng"
- a11y snapshot fields: `Endpoint / IP` / `Module` / `Entity type` / `Hành động` / `Từ ngày` / `Đến ngày` — thiếu label "Người dùng"

### Tác động (Impact)

QTHT không thể tra cứu log theo tài khoản. Phải dùng filter "Entity type = TAI_KHOAN" chung cho mọi user, sau đó scroll thủ công qua 6544 record. Vi phạm use-case nghiệp vụ chính của audit log.

### Gợi ý sửa (Suggested Fix)

Thêm filter `Người dùng` dạng `Select` searchable, data source `GET /api/v1/tai-khoan?q=<keyword>`, param API `user_id` (hoặc `tao_boi_id`/`thuc_hien_boi_id`).

```diff
  <FilterBar>
    <DateRange ... />
+   <Select
+     placeholder="Chọn người dùng"
+     showSearch
+     filterOption
+     fetchOptions={searchTaiKhoan}
+     labelRender={(u) => `${u.ho_ten} (${u.username})`}
+     onChange={setUserId}
+   />
    <Select placeholder="Chọn module" ... />
    <Input placeholder="Entity" ... />
    <Select placeholder="Chọn hành động" ... />
  </FilterBar>
```

---

## BUG-NKHT-002 — Filter Module lệch SRS: hiển thị mã SQL + lẫn entity + thiếu 5 module

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-002 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Filter bar → dropdown Module |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #5 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1539 |
| **Assignee** | BE + FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS quy định dropdown Module có **12 giá trị tiếng Việt** (1 giá trị / phân hệ nghiệp vụ). UI thực tế chỉ có **10 giá trị mã SQL viết hoa**, trong đó 3 giá trị (AUTH/TAI_KHOAN/VAI_TRO) thực ra là tên bảng/entity, không phải module.

### Các bước tái hiện

1. Login + navigate tới `/quan-tri/audit-log` (xem BUG-NKHT-001)
2. Click dropdown "Chọn module"
3. Quan sát list options

### Kết quả mong đợi

Dropdown gồm 12 options tiếng Việt (theo SRS dòng 1539):

`Hỏi đáp / Đào tạo / CG-TVV / Vụ việc / Chi trả / DN / Đánh giá / Biểu mẫu / Quản trị / Báo cáo / Tư vấn / CT HTPLDN`

### Kết quả thực tế

Dropdown có 10 options mã SQL:

`AUTH / TAI_KHOAN / VAI_TRO / DAO_TAO / VU_VIEC / CHI_TRA / DANH_GIA / DOANH_NGHIEP / HOI_DAP / TU_VAN`

**So sánh:**

| SRS | UI | Match |
|-----|----|-------|
| Hỏi đáp | HOI_DAP | ⚠️ mã SQL, không translate |
| Đào tạo | DAO_TAO | ⚠️ |
| **CG-TVV** | — | ❌ THIẾU |
| Vụ việc | VU_VIEC | ⚠️ |
| Chi trả | CHI_TRA | ⚠️ |
| DN | DOANH_NGHIEP | ⚠️ |
| Đánh giá | DANH_GIA | ⚠️ |
| **Biểu mẫu** | — | ❌ THIẾU |
| **Quản trị** | — | ❌ THIẾU |
| **Báo cáo** | — | ❌ THIẾU |
| Tư vấn | TU_VAN | ⚠️ |
| **CT HTPLDN** | — | ❌ THIẾU |
| — | AUTH | ⚠️ THỪA (đây là loại event auth, không phải module) |
| — | TAI_KHOAN | ⚠️ THỪA (entity, không phải module) |
| — | VAI_TRO | ⚠️ THỪA (entity, không phải module) |

→ Thiếu **5 module** (CG-TVV, Biểu mẫu, Quản trị, Báo cáo, CT HTPLDN); **10/10 option hiển thị mã SQL thay vì label VN**; **3 option thừa** (AUTH, TAI_KHOAN, VAI_TRO) lẫn lộn entity vào module.

### Bằng chứng

- [02-module-dropdown.png](image/02-module-dropdown.png) — screenshot dropdown
- evaluate_script result: `["AUTH","TAI_KHOAN","VAI_TRO","DAO_TAO","VU_VIEC","CHI_TRA","DANH_GIA","DOANH_NGHIEP","HOI_DAP","TU_VAN"]`

### Tác động (Impact)

- End user (QTHT thuần nghiệp vụ, không biết schema) không đoán được `HOI_DAP = Hỏi đáp`, `TAI_KHOAN` là gì so với `AUTH`.
- Không lọc được log của 5 phân hệ: CG-TVV, Biểu mẫu, Quản trị, Báo cáo, CT HTPLDN — rất nặng với CT HTPLDN (nhóm XII là module phức tạp nhất).
- Lẫn entity vào module làm sai logic filter (filter "TAI_KHOAN" sẽ trả về mọi log liên quan đến bảng TAI_KHOAN bất kể từ module nào gọi — Hỏi đáp tạo tài khoản vãng lai cũng dính).

### Gợi ý sửa (Suggested Fix)

1. FE: dùng danh mục module chuẩn (12 mã) + map sang label VN:

```ts
const MODULES = [
  { code: 'HOI_DAP', label: 'Hỏi đáp' },
  { code: 'DAO_TAO', label: 'Đào tạo' },
  { code: 'CG_TVV', label: 'CG-TVV' },
  { code: 'VU_VIEC', label: 'Vụ việc' },
  { code: 'CHI_TRA', label: 'Chi trả' },
  { code: 'DOANH_NGHIEP', label: 'DN' },
  { code: 'DANH_GIA', label: 'Đánh giá' },
  { code: 'BIEU_MAU', label: 'Biểu mẫu' },
  { code: 'QUAN_TRI', label: 'Quản trị' },
  { code: 'BAO_CAO', label: 'Báo cáo' },
  { code: 'TU_VAN', label: 'Tư vấn' },
  { code: 'CT_HTPLDN', label: 'CT HTPLDN' },
];
```

2. BE: chuẩn hoá cột `module` trong bảng `AUDIT_LOG` — tách rõ `module` (12 giá trị) khỏi `entity_type` (tên bảng). Không được để entity leak vào dropdown module.

---

## BUG-NKHT-003 — Filter Hành động thiếu LOGIN/LOGOUT + có 5 option thừa + nhãn Anh ngữ

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-003 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Filter bar → dropdown Hành động |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #6 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1540 |
| **Assignee** | BE + FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS quy định filter "Loại thao tác" có **7 option tiếng Việt**: `Tạo / Sửa / Xóa / Phê duyệt / Từ chối / Đăng nhập / Đăng xuất`. UI có **10 option mã Anh** và tên field là "Hành động" (không khớp SRS "Loại thao tác"). Đáng chú ý: **thiếu LOGIN/LOGOUT** dù chính data trong bảng đang hiển thị `LOGIN` và `LOGIN_OTP_PENDING` → filter không filter được data của chính nó.

### Các bước tái hiện

1. Login + navigate `/quan-tri/audit-log`
2. Click dropdown "Chọn hành động"
3. Quan sát list options
4. Đồng thời quan sát giá trị cột Hành động trong bảng có những gì

### Kết quả mong đợi

- Label trường: **"Loại thao tác"** (theo SRS)
- 7 options tiếng Việt: `Tạo / Sửa / Xóa / Phê duyệt / Từ chối / Đăng nhập / Đăng xuất`
- Data trong bảng hiển thị value khớp với options (ví dụ row LOGIN → hiển thị "Đăng nhập" + filter "Đăng nhập" ra đúng row đó)

### Kết quả thực tế

- Label trường: **"Hành động"** (sai nhãn)
- 10 options: `CREATE / READ / UPDATE / DELETE / SUBMIT / APPROVE / REJECT / PUBLISH / UNPUBLISH / EXPORT`
- **THIẾU**: `LOGIN`, `LOGOUT` (trong khi data row đang hiển thị `LOGIN`, `LOGIN_OTP_PENDING`)
- **THỪA**: `READ`, `SUBMIT`, `PUBLISH`, `UNPUBLISH`, `EXPORT` (READ không nên ghi audit nhiều vì tải hệ thống; PUBLISH/UNPUBLISH không có trong spec audit)

**Chênh lệch nhãn:**

| SRS | UI |
|-----|------|
| Tạo | CREATE |
| Sửa | UPDATE |
| Xóa | DELETE |
| Phê duyệt | APPROVE |
| Từ chối | REJECT |
| **Đăng nhập** | **❌ KHÔNG có (nhưng data LOGIN vẫn xuất hiện)** |
| **Đăng xuất** | **❌ KHÔNG có** |
| — | READ (thừa) |
| — | SUBMIT (thừa) |
| — | PUBLISH (thừa) |
| — | UNPUBLISH (thừa) |
| — | EXPORT (thừa) |

### Bằng chứng

- [03-action-dropdown.png](image/03-action-dropdown.png)
- a11y snapshot: label "Hành động" thay vì "Loại thao tác"
- evaluate_script: `["CREATE","READ","UPDATE","DELETE","SUBMIT","APPROVE","REJECT","PUBLISH","UNPUBLISH","EXPORT"]` — 0 option login/logout
- Data rows hiện `LOGIN` và `LOGIN_OTP_PENDING` (không tồn tại trong dropdown filter)

### Tác động (Impact)

- QTHT không thể filter nhanh "mọi đăng nhập/đăng xuất trong ngày" — đây là use-case quan trọng nhất của audit log về mặt bảo mật (phát hiện brute-force, login bất thường).
- UI không nhất quán: filter dropdown không chứa value mà data đang hiển thị (LOGIN có trong row, không có trong filter) → người dùng không đoán được nên dùng option nào.
- `LOGIN_OTP_PENDING` là state trung gian, không có trong SRS — có thể ẩn hoặc gộp vào `LOGIN` (failed attempt).

### Gợi ý sửa (Suggested Fix)

```ts
const ACTIONS = [
  { code: 'CREATE',  label: 'Tạo' },
  { code: 'UPDATE',  label: 'Sửa' },
  { code: 'DELETE',  label: 'Xóa' },
  { code: 'APPROVE', label: 'Phê duyệt' },
  { code: 'REJECT',  label: 'Từ chối' },
  { code: 'LOGIN',   label: 'Đăng nhập' },
  { code: 'LOGOUT',  label: 'Đăng xuất' },
];
```

- Rename label trường thành "Loại thao tác"
- Thêm LOGIN/LOGOUT
- Xem xét ẩn READ/SUBMIT/PUBLISH/UNPUBLISH/EXPORT (hoặc xin CĐT xác nhận có thêm vào SRS không)
- Cân nhắc gộp `LOGIN_OTP_PENDING` vào nhóm `LOGIN` (với phân biệt qua trường Response code 200/401)

---

## BUG-NKHT-004 — Bảng thiếu cột "Đơn vị" và "Chi tiết thay đổi (JSON diff expandable)"

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-004 |
| **Severity** | Major |
| **Priority** | P1 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Bảng danh sách (table-body) |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #9 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1543 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS quy định bảng danh sách có **8 cột cố định** theo thứ tự (dòng 1543): `Thời gian / Người dùng / Đơn vị / Module / Entity / Mã bản ghi / Loại thao tác / Chi tiết thay đổi (JSON diff expandable)`. UI thực tế có 10 cột khác cấu trúc:

- ❌ **Thiếu cột "Đơn vị"** — QTHT TW không biết thao tác đến từ đơn vị nào (Bộ Công Thương vs Sở TP Hà Nội)
- ❌ **Thiếu cột "Chi tiết thay đổi" expandable JSON diff** — UI dùng nút `[Xem chi tiết]` mở modal riêng (deviation từ SRS — SRS yêu cầu expandable row inline)
- ⚠️ Thừa 3 cột: `IP`, `Endpoint`, `Code`
- ⚠️ Thừa 1 cột `Thao tác` chứa nút `[Xem chi tiết]` — SRS ghi rõ "Read-only — khong co nut Sua/Xoa" và không yêu cầu action column

### Các bước tái hiện

1. Login + navigate `/quan-tri/audit-log`
2. Quan sát header bảng danh sách
3. Click 1 nút `[Xem chi tiết]`
4. Quan sát layout (modal vs expanded row)

### Kết quả mong đợi

Bảng có **8 cột** đúng thứ tự SRS:

| # | Cột | Loại |
|---|-----|------|
| 1 | Thời gian (dd/mm/yyyy HH:mm:ss, sortable DESC default) | datetime |
| 2 | Người dùng (ho_ten) | text |
| 3 | **Đơn vị** | text |
| 4 | Module | text |
| 5 | Entity | text |
| 6 | Mã bản ghi | text |
| 7 | Loại thao tác (badge màu 7 loại) | badge |
| 8 | Chi tiết thay đổi | **JSON diff expandable INLINE** (click dấu ▶ → mở rộng dưới row) |

Với ví dụ JSON diff format (SRS dòng 1549):
```json
{"field": "trang_thai", "old": "DANG_XU_LY", "new": "CHO_PHE_DUYET"}
```

### Kết quả thực tế

Bảng có **10 cột** khác SRS:

| # | Cột UI | So với SRS |
|---|--------|------------|
| 1 | Thời gian | OK (nhưng thiếu giây — xem BUG-NKHT-005) |
| 2 | Module | OK về tên, value hiển thị "-" (xem BUG-NKHT-008) |
| 3 | Entity type | ⚠️ tên khác SRS ("Entity") |
| 4 | Entity ID | ⚠️ tên khác SRS ("Mã bản ghi") |
| 5 | Hành động | ⚠️ tên khác SRS ("Loại thao tác") + thiếu badge |
| 6 | Người thực hiện | ⚠️ tên khác SRS ("Người dùng") + giá trị username ≠ ho_ten (BUG-NKHT-006) |
| 7 | IP | ❌ thừa |
| 8 | Endpoint | ❌ thừa |
| 9 | Code | ❌ thừa |
| 10 | Thao tác (nút [Xem chi tiết]) | ❌ thừa (SRS read-only, không có action) |
| — | ❌ **THIẾU: Đơn vị** |
| — | ❌ **THIẾU: Chi tiết thay đổi (JSON diff expandable inline)** |

Khi click `[Xem chi tiết]` → mở **modal Ant Design** với Descriptions (hiển thị Thời gian / Module / Hành động / Entity type / Entity ID / Người thực hiện / Vai trò / IP / Response code / Endpoint / User agent + 2 block "Dữ liệu cũ" + "Dữ liệu mới" dạng `<pre>`). **Không phải expandable row inline** như SRS.

### Bằng chứng

- [01-overview.png](image/01-overview.png) — 10 cột
- [04-detail-modal.png](image/04-detail-modal.png) — modal "Chi tiết nhật ký"
- evaluate_script trả về 10 ant-table-thead cells, không có `ant-table-column-sorter` ở cột nào

### Tác động (Impact)

1. **Thiếu Đơn vị**: QTHT TW không biết thao tác đến từ đơn vị nào → không filter được theo đơn vị (ngoài filter theo user). Với 6544 log và hệ thống đa cấp TW/BN/ĐP, đây là thiếu thốn nặng cho forensics.
2. **Modal thay expandable**: UX kém hơn — phải click → xem modal → đóng modal. SRS expandable cho phép so sánh nhiều row cạnh nhau, dễ scan JSON diff.
3. **Thừa IP/Endpoint/Code**: Không phải vấn đề nghiệp vụ, nhưng chiếm hiển thị trong bảng tạo horizontal scroll — SRS đưa các field này vào "Chi tiết thay đổi" expandable để bảng chính gọn.

### Gợi ý sửa (Suggested Fix)

1. Thêm column `Đơn vị` (lookup `DON_VI.ten_don_vi` theo `user_id` → `don_vi_id`) vào bảng chính ở vị trí #3.
2. Đổi cột chính thành 8 cột đúng SRS: `Thời gian / Người dùng / Đơn vị / Module / Entity / Mã bản ghi / Loại thao tác / Chi tiết thay đổi`.
3. Cột "Chi tiết thay đổi" đổi từ modal sang **expandable row** (Ant Design Table `expandable` prop với `expandedRowRender`). Nội dung expand = JSON diff + các metadata IP/Endpoint/Code/User agent.
4. Xoá cột "Thao tác" — không cần nút Xem chi tiết, mỗi row đã có dấu `▶` để expand.

```tsx
<Table
  columns={[
    { key: 'thoi_gian', title: 'Thời gian', sorter: true, defaultSortOrder: 'descend' },
    { key: 'nguoi_dung_ho_ten', title: 'Người dùng' },
    { key: 'don_vi_ten', title: 'Đơn vị' },
    { key: 'module', title: 'Module', render: (v) => MODULE_LABEL[v] ?? '—' },
    { key: 'entity_type', title: 'Entity' },
    { key: 'entity_id', title: 'Mã bản ghi' },
    { key: 'action', title: 'Loại thao tác', render: (v) => <Tag color={ACTION_COLOR[v]}>{ACTION_LABEL[v]}</Tag> },
  ]}
  expandable={{
    expandedRowRender: (row) => <JsonDiff old={row.du_lieu_cu} new={row.du_lieu_moi} meta={{ip: row.ip, endpoint: row.endpoint, code: row.code}} />
  }}
/>
```

---

## BUG-NKHT-005 — Cột "Thời gian" thiếu giây (HH:mm thay vì HH:mm:ss) và KHÔNG sortable

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-005 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Cột `Thời gian` trong bảng |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #9 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1543 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS: cột Thời gian format **`dd/mm/yyyy HH:mm:ss`** và **sortable (default DESC)**. UI: format `dd/mm/yyyy HH:mm` (thiếu giây) + **không** có sorter icon/handler (click header không sort).

### Các bước tái hiện

1. Login + navigate `/quan-tri/audit-log`
2. Quan sát format cell cột đầu (Thời gian)
3. Click header "Thời gian" → quan sát hành vi sort

### Kết quả mong đợi

- Cell hiển thị `22/04/2026 10:32:47` (có giây)
- Header có icon sorter ▲▼, default DESC
- Click header đảo ASC/DESC

### Kết quả thực tế

- Cell hiển thị `22/04/2026 10:32` (thiếu giây)
- Header KHÔNG có sorter icon, click không phản hồi
- evaluate_script: `hasSort: false, clickable: false` cho cả 10 cột

### Bằng chứng

- [01-overview.png](image/01-overview.png) — 20 row đều dạng `dd/mm/yyyy HH:mm`
- evaluate_script: `{"text":"Thời gian","hasSort":false,"clickable":false}`

### Tác động (Impact)

- Với 6544 log và nhiều sự kiện xảy ra cùng phút (ví dụ LOGIN + LOGIN_OTP_PENDING cùng tại 10:29), không phân biệt được thứ tự chính xác giữa các event.
- Không đảo được sort ASC/DESC → không xem được log cũ nhất trực tiếp mà phải nhảy đến trang 328.

### Gợi ý sửa

- FE: format `dayjs(t).format('DD/MM/YYYY HH:mm:ss')`
- FE: thêm `sorter: (a,b) => a.thoi_gian - b.thoi_gian, defaultSortOrder: 'descend'` trên column def
- BE: endpoint `?order=thoi_gian,desc` + accept `asc`

---

## BUG-NKHT-006 — Cột "Người thực hiện" hiển thị username thay vì ho_ten

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-006 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Cột `Người thực hiện` trong bảng |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #9 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1543 ("Nguoi dung (ho_ten)") |
| **Assignee** | BE + FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS: cột "Người dùng" hiển thị **`ho_ten`** (ví dụ "Quản trị hệ thống TW 5"). UI: cột "Người thực hiện" hiển thị **`username`** (ví dụ "qtht_tw_5"). Sai value field, và cũng sai cả label cột (xem BUG-NKHT-004).

### Các bước tái hiện

1. Login `qtht_tw_5` / navigate audit-log
2. Quan sát cell cột "Người thực hiện" cho row LOGIN đầu tiên
3. So sánh với `ho_ten` trong modal "Chi tiết nhật ký" (click [Xem chi tiết])

### Kết quả mong đợi

Cell hiển thị `Quản trị hệ thống TW 5` (ho_ten).

### Kết quả thực tế

Cell hiển thị `qtht_tw_5` (username). Modal chi tiết hiển thị đúng cả 2: `qtht_tw_5 (Quản trị hệ thống TW 5)` → chứng tỏ data BE có cả 2 trường, nhưng UI chỉ render username ở bảng.

### Bằng chứng

- [01-overview.png](image/01-overview.png) — cột "Người thực hiện" = `qtht_tw_5`, `qtht_tw_4`...
- [04-detail-modal.png](image/04-detail-modal.png) — modal hiển thị full: `qtht_tw_5 (Quản trị hệ thống TW 5)`

### Tác động

End user đọc log khó nhận biết ai (username ít có ý nghĩa nghiệp vụ, ho_ten rõ hơn đặc biệt khi nhiều tài khoản cùng role). CĐT khi audit muốn nhìn ho_ten để báo cáo cấp trên.

### Gợi ý sửa

FE column `Người dùng` render `{row.user.ho_ten}` thay vì `{row.user.username}`, hoặc render cả 2 dạng `{ho_ten} ({username})` như modal.

---

## BUG-NKHT-007 — "Hành động" trong bảng không có badge màu theo SRS

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-007 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Cột `Hành động` trong bảng |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #9 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1543 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS: cột "Loại thao tác" render dạng **badge** với **7 màu cố định** theo loại:

| Loại | Màu (SRS) |
|------|-----------|
| Tạo | xanh |
| Sửa | vàng |
| Xóa | đỏ |
| Phê duyệt | xanh lá |
| Từ chối | cam |
| Đăng nhập | xám |
| Đăng xuất | xám |

UI: render dạng plain text không có badge/màu ở cột bảng.

Lưu ý: Trong **modal "Chi tiết nhật ký"** ở BUG-NKHT-004, Hành động LOGIN được render `<span class="ant-tag ant-tag-filled ant-tag-green">LOGIN</span>` (màu xanh lá) — **không khớp SRS** (Đăng nhập = xám) và chỉ có ở modal, không có ở bảng.

### Các bước tái hiện

1. Navigate audit-log
2. Quan sát cột `Hành động` trong bảng (LOGIN, LOGIN_OTP_PENDING)
3. Click [Xem chi tiết] → quan sát badge màu trong modal

### Kết quả mong đợi

Ở bảng: badge "Đăng nhập" nền **xám** (không phải xanh lá).

### Kết quả thực tế

- Bảng: plain text `LOGIN` / `LOGIN_OTP_PENDING` không có styling
- Modal: badge `LOGIN` màu **xanh lá** (sai — SRS quy định xám cho đăng nhập; xanh lá reserved cho "Phê duyệt")

### Bằng chứng

- [01-overview.png](image/01-overview.png) — cột Hành động plain text
- [04-detail-modal.png](image/04-detail-modal.png) — modal badge xanh lá
- HTML: `<span class="ant-tag ant-tag-filled ant-tag-green">LOGIN</span>`

### Gợi ý sửa

```ts
const ACTION_COLOR = {
  CREATE: 'blue',      // xanh
  UPDATE: 'gold',      // vàng
  DELETE: 'red',       // đỏ
  APPROVE: 'green',    // xanh lá
  REJECT: 'orange',    // cam
  LOGIN: 'default',    // xám
  LOGOUT: 'default',   // xám
};

// In column render:
render: (v) => <Tag color={ACTION_COLOR[v] ?? 'default'}>{ACTION_LABEL[v] ?? v}</Tag>
```

---

## BUG-NKHT-008 — Cột "Module" hiển thị "-" (null) cho mọi dòng dù có data LOGIN

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-008 |
| **Severity** | Medium |
| **Priority** | P2 |
| **Type** | Data |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Cột `Module` trong bảng + trong modal chi tiết |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #9 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1543 |
| **Assignee** | BE Team |
| **Found by** | QA Automation |

### Mô tả

Toàn bộ 20 row trong viewport (và "1-20 / 6544 mục" — nhiều khả năng tất cả 6544 record) có cột Module = `-`. Đồng thời `Module` cũng hiển thị `—` trong modal chi tiết. Trong khi đó cột Entity type = `TAI_KHOAN` → BE không ghi module cho các event LOGIN.

### Các bước tái hiện

1. Navigate audit-log
2. Quan sát cột Module của row bất kỳ
3. Click [Xem chi tiết] → quan sát field Module

### Kết quả mong đợi

Row LOGIN có Module = `Quản trị` (hoặc `AUTH` nếu theo enum đang có) — **không null**.

### Kết quả thực tế

- Bảng: mọi row Module = `-`
- Modal: Module = `—`

### Bằng chứng

- [01-overview.png](image/01-overview.png) — toàn bộ cột Module dấu `-`
- [04-detail-modal.png](image/04-detail-modal.png) — Module = `—`

### Tác động

Cột Module hoàn toàn không có thông tin → filter Module trở nên vô nghĩa (chọn AUTH không khớp vì row có module=null, không có "AUTH"). Ảnh hưởng lớn đến khả năng tra cứu log theo phân hệ.

### Gợi ý sửa

BE: bổ sung field `module` khi ghi AUDIT_LOG. Event login/logout → `module='QUAN_TRI'` hoặc `module='AUTH'` (thống nhất với enum trong dropdown). Backfill data cũ nếu cần.

---

## BUG-NKHT-009 — Pagination default 20/trang thay vì 50/trang theo SRS

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-009 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Pagination footer |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #10 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1544 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS: pagination **50 mục/trang** (default). UI: default 20/trang. Dropdown có 4 option `[10 / 20 / 50 / 100]` — active = 20. User muốn 50 phải đổi thủ công mỗi session.

### Bằng chứng

- [05-pagesize-options.png](image/05-pagesize-options.png) — dropdown `[10, 20, 50, 100]`, active=20

### Gợi ý sửa

FE: đổi `defaultPageSize={50}` trên Table hoặc Pagination component.

---

## BUG-NKHT-010 — Empty state text không khớp SRS

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-010 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Empty state khi filter không có kết quả |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #11 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1545 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS: empty state text = **"Không tìm thấy nhật ký phù hợp."**. UI: hiển thị text Ant Design default = **"Trống / Không có dữ liệu"**.

### Các bước tái hiện

1. Navigate audit-log
2. Entity type = `NONEXISTENT_ENTITY_XYZ`
3. Click `[Tìm kiếm]`
4. Quan sát empty state

### Kết quả mong đợi

Text `"Không tìm thấy nhật ký phù hợp."`

### Kết quả thực tế

Text `"Trống / Không có dữ liệu"` (Ant Design default, generic)

### Bằng chứng

- [06-empty-state.png](image/06-empty-state.png)

### Gợi ý sửa

FE: `<Empty description="Không tìm thấy nhật ký phù hợp." />` hoặc `locale={{ emptyText: 'Không tìm thấy nhật ký phù hợp.' }}` trên Table.

---

## BUG-NKHT-011 — Filter "Endpoint / IP" thừa + nút "Làm mới" thừa (không có trong SRS)

| Trường | Chi tiết |
|--------|----------|
| **Bug ID** | BUG-NKHT-011 |
| **Severity** | Minor |
| **Priority** | P3 |
| **Type** | UI/UX |
| **Status** | Open |
| **Module** | Quản trị hệ thống / Nhật ký hệ thống |
| **Thành phần** | Filter bar |
| **URL** | http://103.172.236.130:3000/quan-tri/audit-log |
| **TC Reference** | SCR-VIII-10 #3-8 |
| **SRS Reference** | srs-fr-10-quan-tri.md dòng 1537-1542 |
| **Assignee** | FE Team |
| **Found by** | QA Automation |

### Mô tả

SRS chỉ quy định 5 filter + 2 button `[Tìm kiếm] [Xóa bộ lọc]` (dòng 1542). UI có thêm:
- Filter `Endpoint / IP` (text-input) — không có trong SRS
- Button `[Làm mới]` (reload) — không có trong SRS (SRS chỉ có [Xuất Excel] cạnh tiêu đề, không có reload button trong filter bar)

Không phải lỗi nghiêm trọng nhưng cần xác nhận với CĐT: (a) thêm vào SRS, hoặc (b) remove khỏi UI để đúng spec.

### Bằng chứng

- [01-overview.png](image/01-overview.png) — filter bar có 6 field + 4 button `[Tìm kiếm] [Xóa bộ lọc] [Làm mới] [Xuất Excel]`

### Gợi ý sửa

- Nếu giữ: update SRS bổ sung Endpoint/IP + Làm mới (yêu cầu BA confirm)
- Nếu remove: xóa field Endpoint/IP và button Làm mới để khớp spec (cân nhắc tác động nếu dev QTHT cần debug trace theo endpoint)

---

## Phụ lục

### A — Môi trường test

| Thành phần | Giá trị |
|------------|---------|
| URL ứng dụng | http://103.172.236.130:3000/ |
| URL module | http://103.172.236.130:3000/quan-tri/audit-log |
| OTP bypass | `666666` |
| MailHog | http://103.172.236.130:8025 (không dùng do bypass) |
| Trình duyệt | Chromium via Chrome DevTools MCP |
| Stack FE | React + Vite + Ant Design |

### B — Tài khoản sử dụng

| Tên đăng nhập | Vai trò | Cấp | Dùng cho bug nào |
|---------------|---------|-----|------------------|
| qtht_tw_5 | QTHT | TW | Toàn bộ BUG-NKHT-001..011 |

### C — Danh mục ảnh chụp

| File | Mô tả | Dùng cho bug |
|------|-------|--------------|
| [01-overview.png](image/01-overview.png) | Toàn bộ màn hình audit-log (filter bar + bảng 20 row + pagination) | BUG-NKHT-001/002/003/004/005/006/007/008 |
| [02-module-dropdown.png](image/02-module-dropdown.png) | Dropdown Module expanded 10 options | BUG-NKHT-002 |
| [03-action-dropdown.png](image/03-action-dropdown.png) | Dropdown Hành động expanded 10 options | BUG-NKHT-003 |
| [04-detail-modal.png](image/04-detail-modal.png) | Modal "Chi tiết nhật ký" | BUG-NKHT-004/006/007 |
| [05-pagesize-options.png](image/05-pagesize-options.png) | Dropdown page-size `[10,20,50,100]` active=20 | BUG-NKHT-009 |
| [06-empty-state.png](image/06-empty-state.png) | Empty state `Trống / Không có dữ liệu` | BUG-NKHT-010 |

### D — SRS trích dẫn (srs-fr-10-quan-tri.md dòng 1523-1553)

```
### SCR-VIII-10: Nhat ky He thong (MH-10.10 — MAN HINH MOI v2.1)
**Loai man hinh:** Danh sach (Read-only)
**FR su dung:** FR-VIII-28

| # | Vung | Thanh phan | Loai | Du lieu / Noi dung |
|---|------|-----------|------|---------------------|
| 1 | toolbar | Breadcrumb | breadcrumb | "Trang chu > Quan tri he thong > Nhat ky he thong" |
| 2 | toolbar | Tieu de | label | "Nhat ky He thong" + [Xuat Excel] |
| 3 | filter-bar | Tu ngay – Den ngay | date-picker (range) | Khoang thoi gian |
| 4 | filter-bar | Nguoi dung | select (searchable) | Dropdown searchable → TAI_KHOAN |
| 5 | filter-bar | Module | select | Hoi dap / Dao tao / CG-TVV / Vu viec / Chi tra / DN / Danh gia / Bieu mau / Quan tri / Bao cao / Tu van / CT HTPLDN |
| 6 | filter-bar | Loai thao tac | select | Tao / Sua / Xoa / Phe duyet / Tu choi / Dang nhap / Dang xuat |
| 7 | filter-bar | Entity | text-input | Ten bang hoac ma ban ghi |
| 8 | filter-bar | Nut tim kiem | button | [Tim kiem] [Xoa bo loc] |
| 9 | content | Bang nhat ky | table (read-only) | Cot: Thoi gian (dd/mm/yyyy HH:mm:ss, sortable DESC) / Nguoi dung (ho_ten) / Don vi / Module / Entity / Ma ban ghi / Loai thao tac (badge mau: Tao=xanh, Sua=vang, Xoa=do, Duyet=xanh la, Tu choi=cam, Dang nhap=xam, Dang xuat=xam) / Chi tiet thay doi (JSON diff: old_value → new_value, expandable). Sticky header. Read-only — khong co nut Sua/Xoa |
| 10 | footer | Phan trang | pagination | 50 muc/trang |
| 11 | content | Trang thai trong | empty | "Khong tim thay nhat ky phu hop." |

#### Quy tac tuong tac
- Audit log khong bao gio bi xoa (A.3). Retention: 5 nam
- Chi tiet thay doi luu dang JSON: {"field": "trang_thai", "old": "DANG_XU_LY", "new": "CHO_PHE_DUYET"}
- Export Excel: max 50.000 dong (BR-DATA-06)
- Quyen truy cap: chi QTHT (read-only)
```

### E — SRS mapping matrix (SRS yêu cầu vs UI thực tế)

| SRS # | SRS component | UI actual | Match |
|-------|---------------|-----------|-------|
| 1 | Breadcrumb "Trang chu > Quan tri he thong > Nhat ky he thong" | "Trang chủ > Quản trị hệ thống > Nhật ký hệ thống" | ✅ |
| 2 | Tiêu đề + [Xuất Excel] | "Nhật ký hệ thống" + [Xuất Excel] (+ [Làm mới] thừa) | ⚠️ BUG-011 |
| 3 | Từ ngày – Đến ngày (date-range) | Từ ngày + Đến ngày (2 date picker riêng) | ⚠️ minor UX |
| 4 | **Người dùng** (select searchable) | ❌ MISSING | ❌ **BUG-001** |
| 5 | Module (12 option VN) | 10 option mã SQL + 3 option thừa | ❌ **BUG-002** |
| 6 | Loại thao tác (7 option VN) | "Hành động" (10 option EN, thiếu LOGIN/LOGOUT) | ❌ **BUG-003** |
| 7 | Entity (text, tìm tên bảng hoặc mã bản ghi) | Entity type (text, chỉ tên bảng) | ⚠️ partial |
| 8 | [Tìm kiếm] [Xóa bộ lọc] | [Tìm kiếm] [Xóa bộ lọc] + [Làm mới] thừa | ⚠️ BUG-011 |
| 9 | Bảng 8 cột: Thời gian/Người dùng/Đơn vị/Module/Entity/Mã bản ghi/Loại thao tác (badge)/Chi tiết thay đổi (expandable) | 10 cột (thiếu Đơn vị, thiếu Chi tiết JSON diff expandable, thừa IP/Endpoint/Code/Thao tác) | ❌ **BUG-004/005/006/007/008** |
| 10 | Pagination 50/trang | Pagination 20/trang default | ❌ **BUG-009** |
| 11 | Empty "Không tìm thấy nhật ký phù hợp." | "Trống / Không có dữ liệu" | ❌ **BUG-010** |

### F — Scope chưa test (out-of-scope round này)

- [ ] Xuất Excel (BR-DATA-06 giới hạn 50.000 dòng) — chưa click nút Xuất Excel
- [ ] Phân quyền: role non-QTHT (CB_NV, CB_PD) truy cập `/quan-tri/audit-log` có bị 403 không (SRS: "Quyen truy cap: chi QTHT")
- [ ] BR-DATA-05: immutability — không có nút Sửa/Xóa (đã verify negative); verify BE không cho UPDATE/DELETE request
- [ ] BR-AUTH-08: AUDIT_LOG bypass row-level security — QTHT_BN/QTHT_DP có xem được log của toàn hệ thống không
- [ ] Filter date-range boundary (từ ngày > đến ngày validation)
- [ ] Search bằng tổ hợp nhiều filter đồng thời

---

*Bug report generated: 2026-04-22 10:35:00 | QA Automation via Claude Code (Chrome DevTools MCP)*
