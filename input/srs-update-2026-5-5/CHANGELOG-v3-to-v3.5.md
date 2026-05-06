# CHANGELOG — SRS v3 → v3.5

**Ngày bắt đầu:** 2026-05-05
**Phương pháp:** Cherry-pick các thay đổi từ srs-v4 vào srs-v3.5 theo workflow `_bmad-output/planning-artifacts/workflow-extract-srs-v3.5.md`
**Phạm vi cherry-pick:** A (theo CR đối tác) + B (lỗi nội bộ + lấp gap CSV) + C (đúng pháp luật)
**Phạm vi BỎ:** SKIP (refactor / wording / bổ sung khác) + một số phần v4 thêm BA quyết định không cherry-pick

---

## srs-fr-04-chuyen-gia-tvv.md — Mạng lưới Tư vấn viên

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-04.md`
**Cách tiếp cận:** Seed từ `srs-v4/srs-fr-04-chuyen-gia-tvv.md` (đã tích hợp 18 thay đổi cherry-pick) → gỡ phần v4 thêm cho wrapper "Tiếp nhận hồ sơ" theo D.2.1.

**Số thay đổi đã apply:** 18 thay đổi cherry-pick + 1 quyết định không cherry-pick (D.2.1)

### Danh sách thay đổi nghiệp vụ

#### 1. Mở rộng phạm vi nhóm từ "Chuyên gia/TVV cá nhân" sang "Mạng lưới TVV bao gồm cá nhân + tổ chức"
**Phân loại:** A-ITEM-02
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ ở TW/BN/ĐP cần quản lý mạng lưới tư vấn viên gồm cả tư vấn viên cá nhân lẫn tổ chức tư vấn theo NĐ 80/2021. Trong v3 hiện tại, hệ thống chỉ có nhóm chức năng cho tư vấn viên cá nhân, còn tổ chức tư vấn không có nhóm chức năng riêng — cán bộ phải dồn 2 đối tượng khác bản chất pháp lý vào cùng một danh sách. Khi tổ chức và cá nhân có thủ tục đăng ký, hồ sơ năng lực và quy trình công bố khác nhau, việc gộp chung khiến cán bộ thao tác lộn xộn và không đáp ứng yêu cầu mới của đối tác.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 02 phần B.4 ghi rõ "NĐ 80/2021 — MLTV bao gồm tổ chức + cá nhân"; mục B.3 (CMT-6) yêu cầu "Restructure menu — 2 sub-menus Cá nhân + Tổ chức". v4 áp đúng yêu cầu này; sub-menu thứ 3 cho Người hỗ trợ phái sinh từ phương án A tách entity (xem Thay đổi 8) → A-ITEM-02.
**Vị trí đã sửa:** §1 Tiêu đề + Tổng quan + Phạm vi (line 1, 5, 36-46), §3 Menu (line 1310+)
**Tham chiếu delta:** Thay đổi 1 (1.1, 1.2, 1.3)

#### 2. Tổ chức TV trở thành entity độc lập
**Phân loại:** A-ITEM-02
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ phải xuất danh sách Tổ chức tư vấn theo mẫu công bố Bộ Tư pháp (Phụ lục 2) lên Cổng Pháp luật Quốc gia. Mẫu BTP yêu cầu 12 cột thông tin gồm tên tổ chức, loại hình, người đại diện, giấy ĐKHĐ, lĩnh vực hoạt động, địa chỉ… nhưng v3 hiện tại lưu Tổ chức tư vấn dưới dạng một dòng trong danh mục dùng chung, chỉ có 5 trường thông tin nên không đủ căn cứ xuất mẫu. Khi nâng Tổ chức tư vấn thành nhóm hồ sơ riêng, các tham chiếu liên quan (tổ chức chính của tư vấn viên, danh sách tư vấn viên thuộc tổ chức) cũng phải nối lại cho đúng.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 02 phần D.1 (line 419-441) đưa bảng 18 trường có cột "Nguồn mẫu BTP" ánh xạ từng trường về cột trong mẫu công bố; mục D.2 yêu cầu "đổi tham chiếu tổ chức tư vấn từ danh mục dùng chung sang nhóm hồ sơ Tổ chức tư vấn riêng" — áp dụng cho cả mối liên hệ tổ chức của tư vấn viên và mối liên hệ tổ chức trong bảng tư vấn viên thuộc tổ chức. v4 áp đúng → A-ITEM-02.
**Vị trí đã sửa:** §4 Entity TO_CHUC_TU_VAN mới (25 trường), TVV_TO_CHUC.to_chuc_id FK → TO_CHUC_TU_VAN, TU_VAN_VIEN.to_chuc_chinh_id FK → TO_CHUC_TU_VAN
**Tham chiếu delta:** Thay đổi 2 (2.1, 2.2, 2.3)

#### 3. Bộ FR + SCR + State Machine quản lý vòng đời TC TV
**Phân loại:** A-ITEM-02
**Bối cảnh nghiệp vụ:** Tổ chức tư vấn là pháp nhân khác bản chất tư vấn viên cá nhân — đăng ký Sở Tư pháp, ký hợp đồng tập thể, được Ủy ban tỉnh ban hành Quyết định công bố vào mạng lưới. Cán bộ nghiệp vụ và cán bộ phê duyệt cần luồng tiếp nhận, phê duyệt, công bố, cập nhật trạng thái dành riêng cho tổ chức. v3 hiện tại không có nhóm chức năng riêng nào cho tổ chức tư vấn — không có màn hình tiếp nhận, không có nút phê duyệt, không có vòng đời trạng thái — nên cán bộ phê duyệt không có chỗ ban hành Số QĐ công bố tổ chức tư vấn.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 02 phần D.3 yêu cầu "tạo nhóm chức năng mới FR-IV-NEW-01 quản lý hồ sơ tổ chức tư vấn, luồng cán bộ nghiệp vụ → cán bộ phê duyệt duyệt, xuất mẫu BTP"; mục D.5 yêu cầu "3 màn hình cho Tổ chức tư vấn — Danh sách / Thêm-Sửa / Chi tiết". v4 mở rộng thêm FR-NEW-02 (cập nhật trạng thái) và FR-NEW-04 (phê duyệt) cùng vòng đời SM-TCTV — phù hợp tinh thần yêu cầu của đối tác → A-ITEM-02.
**Vị trí đã sửa:** §2 FR-IV-NEW-01 (CRUD TC TV + xuất Phụ lục 2 BTP), FR-IV-NEW-02 (cập nhật trạng thái), FR-IV-NEW-04 (phê duyệt CB PD), §3 SCR-IV-NEW-01/02/03, §5 SM-TCTV (6 trạng thái)
**Tham chiếu delta:** Thay đổi 3 (3.1 → 3.5)

#### 4. Mở rộng FR-IV-08 (Công khai) cho cả TVV cá nhân và TC TV
**Phân loại:** A-ITEM-02 + B1
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ chịu trách nhiệm công khai mạng lưới tư vấn lên Cổng Pháp luật Quốc gia để doanh nghiệp tra cứu. Theo yêu cầu của đối tác, cả Tư vấn viên cá nhân và Tổ chức tư vấn đều phải xuất hiện trên cổng — nhưng UC46 trong v3 chỉ áp dụng cho cá nhân, tổ chức không có cách công khai. Đồng thời, sau khi đổi luồng phê duyệt (xem Thay đổi 11), tư vấn viên có thêm bước trung gian "Chờ kích hoạt tài khoản" giữa Phê duyệt xong và Đang hoạt động — nếu giữ điều kiện công khai cũ (chỉ khi Đang hoạt động) thì tư vấn viên đã được cán bộ phê duyệt công nhận pháp lý vẫn bị treo trên cổng cho tới khi tự kích hoạt tài khoản, rất vô lý.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Yêu cầu thay đổi của đối tác TT CNTT (A-ITEM-02):** Mục 02 phần D.6 yêu cầu trực tiếp "FR-IV-08 mở rộng UC46 — công khai cả Tư vấn viên cá nhân và Tổ chức tư vấn lên Cổng Pháp luật Quốc gia". v4 mở phạm vi cho cả 2 đối tượng và thêm cờ phân biệt loại đối tượng được công khai → A-ITEM-02. Phần này tương ứng dòng 4.1, 4.2, 4.4-4.7 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** v3 chỉ cho công khai khi tư vấn viên ở trạng thái "Đang hoạt động"; nhưng Thay đổi 11 phối hợp đã đổi luồng — sau khi cán bộ phê duyệt xong, tư vấn viên chuyển "Chờ kích hoạt" trước rồi mới sang "Đang hoạt động" sau khi tự kích hoạt tài khoản. Giữ điều kiện cũ thì tư vấn viên đã có quyết định công nhận chính thức vẫn không lên cổng → mâu thuẫn nội bộ giữa luồng công khai và luồng phê duyệt. v4 nới điều kiện thành "Đang hoạt động hoặc Chờ kích hoạt" để công khai ngay sau phê duyệt → B1. Phần này tương ứng dòng 4.3 trong bảng vị trí.
**Vị trí đã sửa:** §2 FR-IV-08 Mô tả, Inputs (`ref_type`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai`), Processing (HOAT_DONG hoặc CHO_KICH_HOAT); §3 SCR-IV-03 nút "Công khai/Hủy công khai"; SCR-IV-01 batch action; SCR-IV-NEW-01/03 cho TC TV
**Tham chiếu delta:** Thay đổi 4 (4.1 → 4.7)

#### 5. Thêm 5 trường TU_VAN_VIEN phục vụ xuất Phụ lục 1 BTP (kèm đổi `kinh_nghiem` → `so_nam_kinh_nghiem`)
**Phân loại:** A-ITEM-03
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ phải xuất danh sách Tư vấn viên theo mẫu Bộ Tư pháp (Phụ lục 1) để công bố trên Cổng Pháp luật Quốc gia. Mẫu này bắt buộc 4 thông tin: chức vụ, nơi công tác, số quyết định công bố, ngày ban hành quyết định — nhưng hồ sơ tư vấn viên trong v3 không có chỗ nhập 4 thông tin này. Ngoài ra ô "kinh nghiệm" v3 nhập dạng văn bản tự do (ví dụ "5 năm hành nghề luật") nên cán bộ muốn lọc hoặc xếp hạng tư vấn viên theo số năm thì không thực hiện được.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 03 phần D.1 (bảng line 534-540) liệt kê đúng 4 trường thêm mới (Chức vụ / Nơi công tác / Số QĐ công bố / Ngày QĐ) và 1 trường đổi định dạng. Câu hỏi Q-03 trong báo cáo phân tích CR đã chốt: BA quyết đổi ô Kinh nghiệm văn bản → Số năm kinh nghiệm dạng số để phục vụ lọc/xếp hạng. v4 đã áp đúng cả 2 yêu cầu → A-ITEM-03.
**Vị trí đã sửa:** §4 Entity TU_VAN_VIEN (5 trường); §2 FR-IV-01/03/04 Inputs; §3 SCR-IV-02 form
**Tham chiếu delta:** Thay đổi 5 (5.1 → 5.5)

#### 6. Bổ sung chức năng xuất danh sách TVV theo Phụ lục 1 mẫu BTP
**Phân loại:** A-ITEM-03
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ phải nộp danh sách Tư vấn viên cho Bộ Tư pháp theo mẫu công bố chuẩn 10 cột — đây là biểu mẫu pháp lý cố định, không phải xuất Excel tự do. v3 hiện tại chỉ có chức năng xuất Excel với cột tùy chọn, không có tùy chọn "Xuất theo mẫu Phụ lục 1 BTP" — cán bộ phải xuất Excel xong tự sắp lại cột thủ công cho khớp mẫu, vừa mất công vừa dễ sai.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 03 phần D.2 yêu cầu trực tiếp "bổ sung chức năng xuất theo mẫu BTP — Excel/Word, 10 cột theo mẫu". v4 áp đúng → A-ITEM-03. **⚠️ Số hiệu Quyết định BTP ban hành mẫu chưa xác minh — xem mục D.1 cảnh báo.**
**Vị trí đã sửa:** §2 FR-IV-02 Processing bước 4 (xuất Excel 10 cột); §3 SCR-IV-01 nút xuất + batch action duyệt hàng loạt
**Tham chiếu delta:** Thay đổi 6 (6.1, 6.2)

#### 7. TC TV upload chứng từ PDF/Office
**Phân loại:** A-ITEM-07
**Bối cảnh nghiệp vụ:** Người đại diện Tổ chức tư vấn (hoặc cán bộ nghiệp vụ thay mặt) phải nộp các chứng từ pháp lý gồm Giấy đăng ký hoạt động Sở Tư pháp, Quyết định công bố vào mạng lưới — có thể ở dạng PDF, Word, Excel theo bản scan hoặc bản gốc do cơ quan ban hành. v3 hiện tại không có chỗ đính kèm tài liệu cho Tổ chức tư vấn vì tổ chức chỉ là một dòng trong danh mục (xem Thay đổi 2). Sau khi nâng tổ chức thành nhóm hồ sơ riêng (Thay đổi 2), cần bổ sung mục đính kèm file để lưu chứng từ.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 07 phần B yêu cầu trực tiếp "Upload file pdf/word ở tất cả chức năng quản lý". Tổ chức tư vấn nằm trong phạm vi áp dụng vì đã thành nhóm chức năng quản lý độc lập → A-ITEM-07.
**Vị trí đã sửa:** §4 Entity TO_CHUC_TU_VAN.file_dinh_kem (PDF/DOC/DOCX/XLS/XLSX max 20MB)
**Tham chiếu delta:** Thay đổi 7 (7.1)

#### 8. Tách entity NGUOI_HO_TRO khỏi TU_VAN_VIEN + bộ FR/SCR riêng cho NHT
**Phân loại:** B2a
**Bối cảnh nghiệp vụ:** Người hỗ trợ là cán bộ nội bộ Sở Tư pháp / Bộ ngành / UBND tiếp nhận hồ sơ đăng ký mạng lưới và cập nhật hồ sơ năng lực tư vấn viên thay người dùng. Theo file Danh sách UC + Transaction (CSV), Người hỗ trợ là vai trò riêng cho 3 thao tác (UC41 quản lý đăng ký, UC42 cập nhật năng lực, UC49 cập nhật thông tin) — khác bản chất với Tư vấn viên / Chuyên gia ngoài (cá nhân hành nghề tư vấn). v3 hiện tại nhồi Người hỗ trợ vào hồ sơ Tư vấn viên qua một cờ phân loại nội bộ — khiến phân quyền giữa hai đối tượng lẫn lộn và phần lớn ô trong hồ sơ bỏ trống khi lưu Người hỗ trợ vì các trường năng lực tư vấn không áp dụng cho cán bộ.
**Bằng chứng & lý do:** Đây là **Lấp UC còn thiếu so với file Danh sách UC + Transaction (CSV)** — CSV §IV dòng 358 UC41 actor "Người hỗ trợ" mô tả "Quản lý hồ sơ đăng ký tham gia mạng lưới TVV"; dòng 367 UC42 "cập nhật hồ sơ năng lực của TVV"; dòng 428 UC49 "cập nhật thông tin TVV". 3 UC này v3 không có nhóm chức năng riêng nào cho Người hỗ trợ. **BA chốt phương án A 2026-05-03 (tái xác nhận 2026-05-05)** — tách Người hỗ trợ thành nhóm hồ sơ độc lập. Memory `project_tu_van_vien_entity_covers_nht.md` đã cập nhật phương án này → B2a.
**Vị trí đã sửa:** §4 Entity NGUOI_HO_TRO + junction NGUOI_HO_TRO_LINH_VUC; TU_VAN_VIEN.loai_tvv ENUM bỏ 'NHT'; §2 FR-IV-NHT-01/02/03; §3 SCR-IV-NHT-01/02/03; §3 sub-menu NHT; §2 FR-IV-10 tác nhân; §2 FR-IV-11 tên + mô tả
**Tham chiếu delta:** Thay đổi 8 (8.1 → 8.9)
**Ghi chú:** Phương án A (tách entity NGUOI_HO_TRO 1:1 TAI_KHOAN) — chốt 2026-05-03 (tái xác nhận 2026-05-05)

#### 9. Đồng bộ thang điểm 1-5 + tách 2 entity đánh giá (thẩm định nội bộ vs phản hồi DN)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hệ thống có 2 luồng đánh giá tư vấn viên khác bản chất: cán bộ nghiệp vụ thẩm định hồ sơ năng lực theo 4 nhóm tiêu chí (chuyên môn, năng lực, hiệu quả, mạng lưới) khi xét duyệt; doanh nghiệp đánh giá chất lượng phục vụ theo 3 chỉ số (chuyên môn, thái độ, đúng hạn) sau khi vụ việc kết thúc. v3 gộp cả 2 mục đích vào cùng một nhóm dữ liệu đánh giá — cán bộ phải lọc thủ công khi audit để biết bản ghi nào là thẩm định nội bộ, bản ghi nào là phản hồi của doanh nghiệp. Đồng thời thang điểm 0-10 v3 đang dùng khập khiễng với thang sao 1-5 mà doanh nghiệp thực tế chấm.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — CSV §IV UC44 (Thẩm định) actor "Cán bộ nghiệp vụ" độc lập với CSV §V UC67 (Đánh giá kết quả hỗ trợ vụ việc) actor "Doanh nghiệp". Hai luồng nghiệp vụ độc lập, gộp 1 nhóm dữ liệu là lỗi thiết kế nội bộ. Changelog v4 line 18 ghi "F-FR04-02 (thang điểm 0-10→1-5)" → B1.
**Vị trí đã sửa:** §4 Entity DANH_GIA_TU_VAN_VIEN refactor (4 nhóm thẩm định); §4 Entity DANH_GIA_SAU_VU_VIEC mới (3 điểm 1-5 DECIMAL(3,1)); §2 FR-IV-01/06/09 thang điểm; §2 FR-IV-09 Processing đổi entity ghi; §6 BR-CALC-06; §3 SCR-IV-01 cột điểm; SCR-IV-03 header + Tab 2 Thẩm định + Tab 5 Đánh giá DN
**Tham chiếu delta:** Thay đổi 9 (9.1 → 9.12)

#### 10. Hồ sơ năng lực TVV chi tiết hơn (6 trường mới)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ khi thẩm định hồ sơ tư vấn viên cần đối chiếu trình độ, bằng cấp, chứng chỉ hành nghề, số thẻ hành nghề và mô tả kinh nghiệm để chấm 4 nhóm tiêu chí (năng lực, hiệu quả, pháp lý, mạng lưới). Hồ sơ năng lực trong v3 chỉ có 5 ô thông tin tóm tắt, không đủ căn cứ để cán bộ chấm điểm khách quan — phải hỏi tư vấn viên gửi bổ sung qua email hoặc gọi điện xác nhận, mất thời gian.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — yêu cầu thay đổi của đối tác TT CNTT mục 03 không yêu cầu trực tiếp các thông tin này; v3 thiếu thông tin nền cho cán bộ thẩm định, đây là lỗi nội bộ trong thiết kế hồ sơ năng lực. Phối hợp với Thay đổi 5 (Số năm kinh nghiệm thuộc A-ITEM-03) → B1.
**Vị trí đã sửa:** §4 Entity TU_VAN_VIEN (`trinh_do`, `bang_cap_chi_tiet`, `chung_chi_chi_tiet`, `so_the_hanh_nghe`, `file_the_hanh_nghe`, `mo_ta_kinh_nghiem`); §2 FR-IV-04 Inputs; §2 FR-IV-03 Inputs (4 trường metadata cơ bản)
**Tham chiếu delta:** Thay đổi 10 (10.1 → 10.3)

#### 11. Đầy đủ chứng từ phê duyệt + tự động cấp tài khoản TVV sau công nhận
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ phê duyệt khi công nhận tư vấn viên ban hành Quyết định công bố — đây là văn bản pháp lý nên Số quyết định và ý kiến phê duyệt phải lưu trong hệ thống làm bằng chứng (đối chiếu khi có khiếu nại hoặc kiểm tra). Tư vấn viên / Chuyên gia là người ngoài hệ thống — sau khi được công nhận cần tài khoản đăng nhập chuyên trang để xem hồ sơ và nhận vụ việc. v3 hiện tại không có chỗ nhập Số quyết định khi cán bộ phê duyệt và không tự cấp tài khoản — cán bộ phải gửi mail thông báo cho người được duyệt thủ công, tự gõ thông tin Số quyết định ra ngoài.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — UC45 (Phê duyệt TVV) dòng 396 không nói rõ về tài khoản; UC46 (Cập nhật danh sách công khai) chạy ngay sau phê duyệt, nếu không có tài khoản thì tư vấn viên không thể đăng nhập chuyên trang. v3 bỏ trống cả hai phần này. NĐ 121/2025 Điều 39 (đã verify) yêu cầu "UBND tỉnh công bố mạng lưới tư vấn viên pháp luật" — cần Số quyết định làm bằng chứng → B1. **⚠️ Việc tự cấp tài khoản phụ thuộc FR-VIII-15 — xem mục D.3.**
**Vị trí đã sửa:** §2 FR-IV-07 Inputs (`so_quyet_dinh`, `y_kien_phe_duyet`); §2 FR-IV-07 Processing (CHO_KICH_HOAT + tạo TAI_KHOAN); §5 SM-TVV thêm CHO_KICH_HOAT; §3 SCR-IV-03 nút "Phê duyệt" + MD-PHE-DUYET; §3 SCR-IV-01 batch "Phê duyệt hàng loạt"; SCR-IV-NEW-03 nút Phê duyệt cho TC TV; SCR-IV-NEW-01 batch; §3.0 label CHO_KICH_HOAT
**Tham chiếu delta:** Thay đổi 11 (11.1 → 11.9)
**⚠️ Phụ thuộc:** FR-VIII-15 (Quản lý tài khoản) — BA cần xác nhận FR-VIII-15 cover được auto-create (D.3.1)

#### 12. Đổi tên trạng thái DANG_HOAT_DONG → HOAT_DONG trong SM-TVV
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Sau khi Thay đổi 3 thiết lập vòng đời cho Tổ chức tư vấn (dùng nhãn "Đang hoạt động"), vòng đời tư vấn viên cá nhân hiện đang dùng nhãn cũ "Đang hoạt động" với mã trạng thái nội bộ khác — hai vòng đời mô tả cùng một ý nghĩa "đang hoạt động" nhưng dùng hai mã khác nhau. Cán bộ nghiệp vụ và dev đối chiếu sẽ rối: khi xem báo cáo cá nhân thấy mã này, xem báo cáo tổ chức thấy mã khác, không biết hai cái có cùng ý nghĩa hay không.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v4 changelog chỉ ghi "đồng bộ enum" không cite cụ thể, nhưng việc 2 vòng đời cùng ý nghĩa nhưng khác mã nội bộ là lỗi nội bộ rõ ràng. Đây là sửa thuần đặt tên (cosmetic) → B1.
**Vị trí đã sửa:** §5 SM-TVV; toàn bộ FR-IV-01/12; entity TU_VAN_VIEN.trang_thai; §3 §3.0 Bảng ánh xạ; §3 SCR-IV-01/SCR-IV-NEW-01/SCR-IV-NHT-01 tab "Đang hoạt động"
**Tham chiếu delta:** Thay đổi 12 (12.1 → 12.5)

#### 13. Bỏ giới hạn TVV theo địa bàn — thay filter "địa bàn" bằng "đơn vị quản lý"
**Phân loại:** C-Đúng-luật (NĐ 77/2008 Đ.19 K.2)
**Bối cảnh nghiệp vụ:** Thẻ Tư vấn viên Pháp luật theo NĐ 77/2008 có hiệu lực toàn quốc — tư vấn viên hoạt động ở Hà Nội vẫn được phép hỗ trợ doanh nghiệp ở Đà Nẵng nếu hai bên đồng ý. Doanh nghiệp ở địa phương A khi tra cứu cũng phải thấy được tư vấn viên ở địa phương B đã công khai. v3 hiện tại có ô "Địa bàn" giới hạn tư vấn viên theo tỉnh trong hồ sơ, đồng thời lúc tra cứu cũng lọc theo địa bàn đăng ký — sai luật và vô lý nghiệp vụ. Đồng thời cần phân biệt rõ: cán bộ địa phương có quyền sửa hồ sơ (giới hạn theo đơn vị quản lý), nhưng doanh nghiệp tra cứu thấy toàn quốc khi tư vấn viên đã công khai.
**Bằng chứng & lý do:** Đây là **Bất hợp lý nghiệp vụ** — NĐ 77/2008 Điều 19 Khoản 2 (đã verify): "Tư vấn viên pháp luật được hoạt động trong phạm vi toàn quốc". v3 có ô "Địa bàn" giới hạn tư vấn viên theo tỉnh — sai luật → C-Đúng-luật.
**Vị trí đã sửa:** §4 Entity TU_VAN_VIEN bỏ `dia_ban_ids[]` + bảng junction TVV_DIA_BAN; §2 FR-IV-02 filter; §3 SCR-IV-01 filter; §6 BR-LEGAL-09 mới
**Tham chiếu delta:** Thay đổi 13 (13.1 → 13.4)

#### 14. Bỏ ESCALATE bắt buộc — mỗi cấp TW/BN/ĐP tự công bố MLTV theo phân cấp
**Phân loại:** C-Đúng-luật (NĐ 121/2025 Đ.39)
**Bối cảnh nghiệp vụ:** Theo NĐ 121/2025 Điều 39, Ủy ban nhân dân cấp tỉnh có thẩm quyền tự công bố mạng lưới tư vấn viên pháp luật ở địa phương — không cần xin ý kiến trung ương. Tương tự, các bộ ngành có thẩm quyền công bố mạng lưới riêng ở phạm vi của mình. v3 hiện tại bắt buộc mọi hồ sơ phê duyệt phải đẩy lên cấp trung ương khi đạt điều kiện công bố — sai phân cấp pháp luật, đồng thời gây nghẽn quy trình ở cấp trung ương dù bộ ngành / địa phương đã đủ thẩm quyền.
**Bằng chứng & lý do:** Đây là **Bất hợp lý nghiệp vụ** — NĐ 121/2025 Điều 39 (đã verify): "Mạng lưới tư vấn viên pháp luật... được Ủy ban nhân dân cấp tỉnh công bố công khai để hỗ trợ pháp lý cho doanh nghiệp nhỏ và vừa" — UBND tỉnh có quyền công bố trực tiếp, không cần đẩy lên trung ương → C-Đúng-luật. **⚠️ v4 ban đầu cite kèm "Đ.40" đã verify SAI; đã chốt "cite để vậy đã" — không sửa trong v3.5 này.**
**Vị trí đã sửa:** §2 FR-IV-06 Processing; §2 FR-IV-07 Mô tả; §2 FR-IV-NEW-04 cho TC TV
**Tham chiếu delta:** Thay đổi 14 (14.1 → 14.3)

#### 15. Bỏ cooldown 6 tháng sau khi bị từ chối
**Phân loại:** C-Đúng-luật
**Bối cảnh nghiệp vụ:** Khi tư vấn viên / chuyên gia bị cán bộ phê duyệt từ chối hồ sơ đăng ký mạng lưới (vì hồ sơ thiếu hoặc chưa đạt năng lực), người đó có quyền sửa lại và nộp tiếp ngay khi đã hoàn thiện. v3 hiện tại đặt thời gian chờ 6 tháng kể từ ngày bị từ chối mới được nộp lại — đây là rào cản tự đặt ra, pháp luật không quy định. Ứng viên đã sửa hồ sơ xong nhưng phải đợi 6 tháng vô lý, có thể khiếu nại.
**Bằng chứng & lý do:** Đây là **Bất hợp lý nghiệp vụ** — NĐ 77/2008 (đã verify) và NĐ 55/2019 không có quy định thời gian chờ sau khi bị từ chối. v3 đặt 6 tháng là tự thêm rào cản. v4 changelog line 18: "F-FR04-06 (bỏ cooldown 6 tháng)" → C-Đúng-luật.
**Vị trí đã sửa:** §2 FR-IV-03 (cho phép nộp lại bất kỳ lúc nào sau khi sửa)
**Tham chiếu delta:** Thay đổi 15 (15.1)

#### 16. Phân quyền chỉnh sửa hồ sơ TVV — chỉ NHT được sửa, TVV/CG chỉ xem readonly
**Phân loại:** B1 + C
**Bối cảnh nghiệp vụ:** Sau khi cán bộ phê duyệt công nhận, hồ sơ tư vấn viên / chuyên gia được công khai trên Cổng Pháp luật Quốc gia làm căn cứ cho doanh nghiệp tra cứu. Theo CSV, các thao tác cập nhật hồ sơ năng lực (UC42) và cập nhật thông tin chi tiết (UC49) đều do Người hỗ trợ (cán bộ nội bộ) thực hiện — không phải tư vấn viên / chuyên gia tự thao tác. v3 hiện tại lại cho phép tư vấn viên / chuyên gia tự sửa hồ sơ năng lực đã được công nhận — vừa lệch vai trò CSV vừa làm sai lệch dữ liệu công khai vì không có cán bộ nội bộ kiểm soát.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Sửa vai trò sai so với file Danh sách UC + Transaction (CSV) (B2c):** CSV §IV dòng 367 UC42 actor "Người hỗ trợ" mô tả "Quản lý cập nhật hồ sơ năng lực của tư vấn viên"; dòng 428 UC49 actor "Người hỗ trợ" mô tả "Thực hiện chỉnh sửa thông tin chi tiết của Tư vấn viên". 2 UC này CSV ghi rõ vai trò là Người hỗ trợ (cán bộ), không phải tư vấn viên tự thao tác. v3 lại cho tư vấn viên / chuyên gia tự sửa hồ sơ năng lực đã thẩm định → lệch vai trò CSV → B2c. Phần này tương ứng dòng 16.1 và 16.2 trong bảng vị trí; dòng 16.3 (kiểm tra trùng email khi đổi) thuộc Phần 2 dưới đây.

**Phần 2 — Bất hợp lý nghiệp vụ (C):** Hồ sơ tư vấn viên sau khi cán bộ phê duyệt công nhận đã được công khai trên Cổng Pháp luật Quốc gia (theo NĐ 121/2025 Điều 39 đã verify). Nếu cho tư vấn viên / chuyên gia tự sửa thoải mái thì dữ liệu hiển thị trên cổng công khai có thể bị làm sai lệch sau công nhận, không có cán bộ nội bộ kiểm soát — vi phạm nguyên tắc nguyên vẹn hồ sơ công khai. v4 áp đúng nguyên tắc: hồ sơ đã thẩm định và công bố chỉ cán bộ tiếp nhận (Người hỗ trợ) cùng đơn vị mới được sửa, tư vấn viên / chuyên gia chỉ xem qua chuyên trang → C (bất hợp lý nghiệp vụ rõ ràng). Phần này áp dụng cho toàn bộ 3 vị trí 16.1/16.2/16.3 — cùng nguyên tắc bảo vệ hồ sơ công khai.
**Vị trí đã sửa:** §2 FR-IV-04 Mô tả; §2 FR-IV-11 Mô tả + Processing (check email duy nhất + VO_HIEU_HOA); §3 SCR-IV-01 Permission; §3 SCR-IV-02 Permission; §3 SCR-IV-03 nút "Sửa hồ sơ"; §3 SCR-IV-01 cột Hành động icon Sửa
**Tham chiếu delta:** Thay đổi 16 (16.1 → 16.7)

#### 17. BR-AUTH-08 — Phân quyền dữ liệu theo đơn vị quản lý (chống cross-tenant data leak)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hệ thống có 3 cấp đơn vị quản lý — Trung ương, Bộ ngành, Địa phương — và mỗi đơn vị quản lý hồ sơ tư vấn viên riêng. Cán bộ nghiệp vụ địa phương A không có thẩm quyền xem hoặc sửa hồ sơ tư vấn viên của địa phương B (cùng cấp ngang nhau). Tuy nhiên với hồ sơ đã công khai trên Cổng Pháp luật Quốc gia thì doanh nghiệp tra cứu vẫn thấy được toàn quốc — quyền sửa và quyền xem là hai phạm vi khác nhau. v3 hiện tại không có quy tắc lọc dữ liệu theo đơn vị quản lý — cán bộ địa phương A có thể vô tình truy cập hồ sơ tư vấn viên thuộc địa phương B.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — Memory `project_auth_scope_2tier` ghi rõ "Trung ương là cấp cha duy nhất; Bộ ngành và Địa phương là 2 loại đơn vị ngang cấp song song" — yêu cầu tự nhiên là phải có quy tắc lọc dữ liệu theo đơn vị quản lý. v3 thiếu quy tắc này là lỗi nội bộ → B1.
**Vị trí đã sửa:** §6 BR-AUTH-08 mới; §2 FR-IV-03 Inputs `don_vi_id` auto; §3 SCR-IV-02 form đơn vị quản lý auto/readonly
**Tham chiếu delta:** Thay đổi 17 (17.1 → 17.3)

#### 18. Guard nghiệp vụ trước khi vô hiệu hoá TVV (kiểm cả VV và Hỏi đáp)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Khi cán bộ nghiệp vụ vô hiệu hóa tư vấn viên (vì hết hạn thẻ, vi phạm, xin nghỉ), tư vấn viên đó có thể đang xử lý cả vụ việc lớn lẫn câu hỏi đáp lẻ của doanh nghiệp. v3 hiện tại chỉ kiểm tra tư vấn viên còn vụ việc đang xử lý hay không — nếu còn thì chặn vô hiệu hóa. Nhưng v3 bỏ sót việc kiểm tra câu hỏi đáp lẻ — tư vấn viên bị vô hiệu giữa chừng khi đang trả lời thì doanh nghiệp đặt câu hỏi bị treo, không ai đáp.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — UC42 và UC50 không quy định cụ thể phạm vi kiểm tra, nhưng nghiệp vụ rõ ràng: tư vấn viên bị vô hiệu giữa chừng đang trả lời hỏi đáp thì doanh nghiệp bị treo câu hỏi. v3 thiếu kiểm tra hỏi đáp là lỗi nội bộ trong logic guard → B1.
**Vị trí đã sửa:** §2 FR-IV-12 Processing (kiểm cả VU_VIEC và HOI_DAP); §3 SCR-IV-03 Quy tắc tương tác; §3.0b Modal MD-VO-HIEU-HOA; §3 SCR-IV-01 cột icon Xóa
**Tham chiếu delta:** Thay đổi 18 (18.1 → 18.4)

---

### Đã chủ động BỎ (không cherry-pick từ v4)

#### D.2.1 — Wrapper "Tiếp nhận hồ sơ" của v4
**Lý do:** v3 đã có state CHO_THAM_DINH + transition, nhưng v4 thêm bộ wrapper buộc CB NV bấm 1 nút riêng — không có yêu cầu pháp luật / CSV, gây ma sát thao tác. Chốt BA 2026-05-05.

**Phần v4 đã loại bỏ khỏi srs-v3.5/srs-fr-04:**
- §2 FR-IV-13 toàn bộ (XOÁ)
- §2 FR-IV-04 Processing bước 7 — bỏ "gọi FR-IV-13"
- §4 Entity TU_VAN_VIEN — bỏ field `ngay_tiep_nhan`, `nguoi_tiep_nhan`
- §3 §3.0b Modal MD-TIEP-NHAN — XOÁ
- §3 SCR-IV-03 nút "Tiếp nhận hồ sơ" header — XOÁ
- §3 SCR-IV-03 mô tả "xem hồ sơ → tiếp nhận → thẩm định" — sửa thành "xem hồ sơ → thẩm định → trình duyệt"
- §3 SCR-IV-03 FR sử dụng — bỏ FR-IV-13
- §3 SCR-IV-01 — gộp tab "Mới đăng ký" + "Chờ thẩm định" thành 1 tab gộp
- §1 SM-TVV note `[GAP-IV-04]` — sửa lại (CHO_THAM_DINH KHÔNG phải v4 thêm)
- §1 §6 BR-AUTH-08, BR-LEGAL-04, FR sử dụng SCR-IV-03 — bỏ FR-IV-13 references
- §5 SM-TVV transition table — đổi FR ref từ FR-IV-13 → FR-IV-06/04/03 phù hợp

**Hành vi nghiệp vụ sau khi áp:** State CHO_THAM_DINH GIỮ NGUYÊN từ v3. CB NV vào danh sách thấy hồ sơ Mới đăng ký/Chờ thẩm định → mở SCR-IV-03 → tab Thẩm định → click "Bắt đầu thẩm định" → ngầm chuyển sang DANG_THAM_DINH (1 thao tác thay vì 2 thao tác như v4 yêu cầu).

---

### Còn chờ BA xác nhận (có thể ảnh hưởng v3.5 sau)

- **D.3.1 — FR-VIII-15 cover auto-create TK**: Thay đổi 11 phụ thuộc FR-VIII-15 (Quản lý tài khoản). Hiện tại srs-v3.5/srs-fr-04 ghi "Sau phê duyệt → CHO_KICH_HOAT, tự tạo TAI_KHOAN, gửi mail kích hoạt". BA xác nhận FR-VIII-15 tồn tại và cover được auto-create.
- **D.3.2 — Chi tiết kĩ thuật trong SRS** (optimistic lock `version`, ClamAV virus scan, sanitize HTML chống XSS): Hiện tại giữ nguyên trong v3.5 (như v4). BA quyết định bỏ hay giữ.
- **Cite pháp lý** (`legal-citations-verification.md`): Hiện tại giữ nguyên cite v4 trong v3.5. Findings cite WRONG/PARTIAL (NĐ 55/2019 Đ.7, Đ.10, NĐ 121/2025 Đ.40, QĐ 1232 vs 1322) chưa xử lý — chốt "để vậy đã" theo BA 2026-05-05.

### Thống kê thay đổi áp dụng FR-04

- **A-ITEM-02 (Tổ chức TV):** 4 thay đổi (1, 2, 3, 4)
- **A-ITEM-03 (Mẫu BTP):** 2 thay đổi (5, 6)
- **A-ITEM-07 (Upload):** 1 thay đổi (7)
- **B2a (Tách NHT):** 1 thay đổi (8)
- **B1 (Lỗi nội bộ):** 6 thay đổi (9, 10, 11, 12, 17, 18)
- **C-Đúng-luật:** 3 thay đổi (13, 14, 15)
- **B1 + C (mix):** 1 thay đổi (16)
- **Tổng cherry-pick:** 18 thay đổi
- **Đã chủ động BỎ từ v4:** 1 (wrapper FR-IV-13)

**Số dòng srs-v3.5/srs-fr-04-chuyen-gia-tvv.md:** ~2.516 (so v4: 2.547)

**Số FR cuối cùng:** 19 (12 FR cũ FR-IV-01..12 + FR-IV-NEW-01 + FR-IV-NEW-02 + FR-IV-NEW-04 + FR-IV-NHT-01/02/03 + FR-IV-CROSS-01)

---

### Fix bổ sung sau verify deep review (2026-05-06)

#### F3 — Bổ sung SM-NHT transition table ở §5
**Phân loại:** Cải tiến cấu trúc tài liệu (ngoài 18 thay đổi)
**Lý do:** v4 không có SM-NHT transition table riêng ở §5 — chỉ có label table ở §3.0. Để tài liệu đối xứng với SM-TVV và SM-TCTV (cả 2 đều có heading + mermaid + bảng trạng thái + bảng chuyển trạng thái), bổ sung SM-NHT 4 trạng thái: CHO_KICH_HOAT → HOAT_DONG → TAM_DUNG → VO_HIEU_HOA.
**Vị trí thêm:** §5 sau SM-TCTV (line ~2370+)
**Tham chiếu:** Verify report 2026-05-06 mục F3

#### Drift D.2.1 — Sửa text mô tả SCR-IV-03 còn từ "tiếp nhận"
**Lý do:** Sau khi gỡ FR-IV-13 + nút header + modal, 3 dòng text mô tả SCR-IV-03 vẫn còn từ "tiếp nhận" trong chuỗi quy trình — không nhất quán với D.2.1.
**Vị trí đã sửa:**
- Line 1520 Quyền truy cập: bỏ "tiếp nhận" khỏi liệt kê quyền Cán bộ Nghiệp vụ
- Line 1524 Mô tả: "xem hồ sơ → ~~tiếp nhận~~ → thẩm định 4 nhóm tiêu chí → trình duyệt..."
- Line 1568 Quy trình trên 1 trang: "xem hồ sơ → ~~tiếp nhận~~ → bắt đầu thẩm định..."

---

## srs-fr-05-vu-viec.md — Quản lý Vụ việc Trợ giúp Pháp lý

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-05.md`
**Cách tiếp cận:** Copy `srs-v3/srs-fr-05-vu-viec.md` (1.891 dòng) → `srs-v3.5/srs-fr-05-vu-viec.md` → patch tuần tự 14 thay đổi IN + V4-CHƯA-SỬA #1.

**Số thay đổi đã apply:** 14 IN / 6 OUT (xem mục F Cổng duyệt trong delta) + 1 V4-CHƯA-SỬA #1
**LOC sau apply:** 2.364 dòng (+473 dòng so v3)
**Số FR:** 19 → 21 (thêm FR-V.I-NEW-02 + FR-V.I-NEW-05)

### Danh sách thay đổi nghiệp vụ

#### 1. Đổi SLA mặc định 10 → 15 ngày làm việc (sửa cite NĐ55 Đ.9 → Đ.8 K.1)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hạn xử lý vụ việc hỗ trợ pháp lý cho doanh nghiệp là cốt lõi của FR-05 — mọi vụ việc mới đều tự tính ngày phải hoàn thành theo thời hạn này, hệ thống cảnh báo cán bộ khi sắp hết hạn, đến hạn, quá hạn. v3 hiện tại đặt thời hạn 10 ngày làm việc và viện dẫn NĐ55/2019 Điều 9. Tuy nhiên Điều 9 thực tế nói về dữ liệu văn bản tư vấn và thủ tục hỗ trợ chi phí — không phải thời hạn xử lý vụ việc. Điều quy định 15 ngày trả lời vướng mắc pháp lý cho doanh nghiệp nhỏ và vừa nằm ở Điều 8 Khoản 1. v3 vừa cite sai điều luật vừa đặt thời hạn ngắn hơn 5 ngày so với pháp luật quy định.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 dòng 33 ghi "SLA 10 ngày làm việc (NĐ55/2019 Điều 9) — BR-SLA-01"; v4 dòng 48 đổi thành "15 ngày làm việc (NĐ55/2019 Điều 8 Khoản 1 — trả lời vướng mắc pháp lý cho DNNVV)". v4 changelog 2026-05-04 ghi rõ "F-FR05-01 sửa nốt 3 vị trí 10 ngày LV còn sót". Cite Điều 9 với 10 ngày trong v3 sai cả về điều luật lẫn thời hạn → B1. ⚠️ **Cite NĐ55 Điều 8 Khoản 1 chưa có trong `legal-citations-verification.md` — đề nghị BA verify ở lượt review tiếp theo trước khi đóng v3.5.**
**Vị trí đã sửa:**
- §1 Tổng quan SLA (line 33)
- §2 FR-V.I-04 Processing bước 8 (line 324)
- §2 FR-V.I-CROSS-01 Mô tả + Acceptance + Cross-ref (line 1280, 1303, 1309)
- §4 Entity VU_VIEC.deadline (line 1593)
- §6 BR-SLA-01 (line 1973)
**Tham chiếu delta:** Thay đổi 1 (1.1-1.6)
**⚠️ PENDING verify:** Cite NĐ55 Đ.8 K.1 chưa có trong `legal-citations-verification.md` — verify lượt review tiếp theo

#### 2. Công khai vụ việc lên Cổng PLQG: 5 cột CR-01 + FR-V.I-NEW-05 + 2 self-loop SM + Badge "Đã công khai" + whitelist BR-PUBLIC-04 (Q-NEW-02)
**Phân loại:** A-ITEM-01
**Bối cảnh nghiệp vụ:** Đối tác yêu cầu công khai 12 danh sách lên Cổng Pháp luật Quốc gia, trong đó danh sách Vụ việc hỗ trợ pháp lý là một. Cán bộ phê duyệt là người duyệt nội dung công khai — vì vụ việc chứa thông tin nhạy cảm về doanh nghiệp và người đại diện, không thể đăng nguyên văn lên cổng. Chủ đầu tư đã chốt phương án Q-NEW-02 ngày 2026-04-16: cán bộ phê duyệt soạn mô tả công khai riêng (không lấy tự động từ nội dung nội bộ), hệ thống chỉ gửi 9 trường an toàn ra cổng và ẩn 6 trường nhạy cảm theo nguyên tắc bảo vệ dữ liệu cá nhân (giống cách làm án lệ theo Nghị quyết 03/2017). Quyền duyệt thuộc cán bộ phê duyệt cùng cấp đơn vị. Khi gọi sang Cổng Pháp luật Quốc gia phải khóa thao tác chống nhiều cán bộ cùng lúc và chỉ đánh dấu "Đã công khai" sau khi cổng phản hồi thành công.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 01 phần D.1 (báo cáo phân tích CR line 230-262) yêu cầu trực tiếp "Thêm 5 trường công khai chung vào 12 nhóm hồ sơ, trong đó có Vụ việc (line 258)". Câu hỏi Q-NEW-02 chốt phương án (CR analysis line 1258-1297): danh sách 9 trường an toàn được hiển thị, 6 trường nhạy cảm bị ẩn, cán bộ phê duyệt soạn mô tả công khai riêng. v4 áp đúng tinh thần → A-ITEM-01. v3 hoàn toàn không có cơ chế công khai vụ việc.
**Vị trí đã sửa:**
- §4 Entity VU_VIEC: thêm 5 cột `cong_khai`, `anh_dai_dien`, `thoi_gian_dang_tai`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai`
- §2 FR-V.I-NEW-05 toàn bộ (FR mới ~120 dòng): Inputs + Processing 10 bước (Công khai + Hủy) + 9 mã lỗi ERR-CK-VV-01..10 + Pháp luật NĐ 13/2023
- §5 SM-VUVIEC mermaid: thêm 2 self-loop CONG_KHAI/HUY_CONG_KHAI cho DA_DUYET + HOAN_THANH + ghi chú "cờ overlay"
- §5 SM bảng: thêm 3 dòng cho công khai/hủy công khai
- §3 SCR-V.I-03 header thành phần 2: thêm Badge "Đã công khai" (xanh dương + tooltip)
- §3 SCR-V.I-03 bảng nút: thêm 2 dòng [Công khai] / [Hủy công khai] cho CB PD
- §6 Tổng quan BR + chi tiết: thêm BR-EC-20 (KHÔNG set CONG_KHAI trước API OK) + BR-PUBLIC-01 (điều kiện công khai) + BR-PUBLIC-04 (whitelist 9 fields theo Q-NEW-02)
- §4 LICH_SU_VU_VIEC.hanh_dong CHECK ENUM: thêm 'CONG_KHAI', 'HUY_CONG_KHAI'
**Tham chiếu delta:** Thay đổi 2 (2.1-2.16)

#### 3. Thêm field `file_dinh_kem` formal cho VU_VIEC entity (CR-07)
**Phân loại:** A-ITEM-07
**Bối cảnh nghiệp vụ:** Đối tác yêu cầu mọi nhóm chức năng quản lý chính có form Thêm mới phải cho upload tài liệu PDF/Word. v3 đã có ô đính kèm tài liệu ở các form gửi yêu cầu, ghi nhận hồ sơ và bổ sung hồ sơ — tài liệu lưu thông qua bảng đính kèm dùng chung. Tuy nhiên hồ sơ vụ việc trong v3 không khai báo trường tài liệu chính thức, chỉ ngầm thông qua bảng dùng chung — khiến dev đọc hồ sơ vụ việc tưởng vụ việc không có chỗ đính kèm và phải dùng bảng phụ, không nhất quán với 12 nhóm hồ sơ khác trong yêu cầu của đối tác.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 07 phần B (CR analysis line 334-335) yêu cầu trực tiếp "Trong tất cả các chức năng quản lý có phần Thêm mới, cho phép tải lên file pdf, word…". CR analysis line 323 ghi rõ "FR-05 (Vụ việc) — đã có nơi đính kèm cho gửi yêu cầu và bổ sung" — vụ việc đã có upload nhưng cần khai báo chính thức trong hồ sơ → A-ITEM-07.
**Vị trí đã sửa:** §4 Entity VU_VIEC (sau `ly_do_uu_tien`)
**Tham chiếu delta:** Thay đổi 3 (3.1)

#### 4. FR-V.I-NEW-02: DN bổ sung hồ sơ vụ việc (formal hoá transition `YEU_CAU_BO_SUNG → DANG_KIEM_TRA`)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Khi cán bộ nghiệp vụ kiểm tra hồ sơ vụ việc thấy thiếu, hệ thống chuyển vụ việc sang trạng thái "Yêu cầu bổ sung" và doanh nghiệp được thông báo cần nộp thêm tài liệu. v3 hiện tại có vẽ luồng "Yêu cầu bổ sung → Đang kiểm tra" với người thực hiện là doanh nghiệp, nhưng không có nhóm chức năng nào cho doanh nghiệp upload tài liệu bổ sung — chỉ có chức năng cán bộ nội bộ tự upload thay doanh nghiệp. Doanh nghiệp ngồi ngoài không có cách thao tác, chờ vô thời hạn cho đến khi cán bộ tự đóng vụ việc.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 §5 vòng đời vụ việc liệt kê chuyển trạng thái "Yêu cầu bổ sung → Đang kiểm tra" với người kích hoạt là "DN bổ sung" nhưng cột nhóm chức năng để trống. Đối chiếu v3 §2: chỉ FR-V.I-07 cho phép cán bộ nghiệp vụ upload tài liệu bổ sung — không phải doanh nghiệp tự thao tác → B1. **Lưu ý CSV:** UC52 (Doanh nghiệp gửi hồ sơ lần đầu) + UC57 (Cán bộ nghiệp vụ quản lý hồ sơ gồm tài liệu bổ sung) đã có; doanh nghiệp bổ sung sau yêu cầu là phái sinh từ luồng UC52/56, không phải UC độc lập. BA chốt IN để lấp khoảng trống nghiệp vụ.
**Vị trí đã sửa:**
- §2 FR-V.I-NEW-02 toàn bộ (FR mới ~70 dòng): tác nhân DN auth Tier 2 VNeID + Inputs (file_bo_sung, ghi_chu) + Processing 8 bước + 4 mã lỗi ERR-VV-BS-01..04
- §4 Entity VU_VIEC: thêm field `ngay_yeu_cau_bo_sung` (datetime) phục vụ tính quá hạn bổ sung
- §5 SM bảng: thêm dòng `YEU_CAU_BO_SUNG → DANG_KIEM_TRA` với FR Ref `FR-V.I-NEW-02` + cross-ref BR-EC-16
- §3 SCR-V.I-03 chế độ DN bảng quy tắc: nút [Bổ sung hồ sơ] khi state = "Yêu cầu bổ sung"
- §3 SCR-V.I-04 cột Hành động: badge "Cần bổ sung"
**Tham chiếu delta:** Thay đổi 4 (4.1-4.7)

#### 8. Refactor mô hình phân công — `loai_doi_tuong_xu_ly` + `nguoi_xu_ly_id → TAI_KHOAN` + `to_chuc_tu_van_id`; FR-V.I-09 thành 2 thẻ Cá nhân/Tổ chức (cover CSV UC59)
**Phân loại:** A-ITEM-02 phối hợp + B2c + B1
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ ở TW/BN/ĐP cần phân công vụ việc cho người xử lý phù hợp. Theo CSV §V.I UC59, người xử lý có thể là Tư vấn viên cá nhân hoặc Tổ chức tư vấn (cán bộ chọn nguyên cả tổ chức, sau đó tổ chức cử tư vấn viên cụ thể) — đây là 2 nhánh nghiệp vụ riêng biệt. v3 chỉ có nhánh chọn cá nhân, không có nhánh Tổ chức tư vấn — lệch CSV, đồng thời cản trở việc kết nối vụ việc với các Công ty Luật / VP Luật sư / Trung tâm Tư vấn Pháp luật đã ký hợp đồng tập thể với Sở Tư pháp. Bên cạnh đó, sau khi FR-04 đã tách Người hỗ trợ thành nhóm hồ sơ riêng (Thay đổi 8 ở FR-04), mối liên kết người xử lý vụ việc cũ chỉ trỏ vào hồ sơ tư vấn viên — không cover được trường hợp Người hỗ trợ làm người xử lý.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 3 cụm:

**Phần 1 — Yêu cầu thay đổi của đối tác TT CNTT (A-ITEM-02):** Mục 02 phần B.4 (CR analysis line 401) yêu cầu "NĐ 80/2021 — Mạng lưới tư vấn viên bao gồm tổ chức + cá nhân". v4 áp đúng — modal phân công có 2 thẻ Cá nhân (Tư vấn viên / Chuyên gia / Người hỗ trợ) và Tổ chức tư vấn (Công ty Luật / VP Luật sư / Trung tâm TVPL) → A-ITEM-02. Phần này tương ứng dòng 8.1, 8.2, 8.6, 8.7 trong bảng vị trí.

**Phần 2 — Sửa vai trò sai so với file Danh sách UC + Transaction (CSV) (B2c):** CSV §V.I dòng 451 UC59 vai trò "Cán bộ nghiệp vụ TW,BN,ĐP" mô tả "Cung cấp công cụ cho cán bộ Nghiệp vụ để chọn Tư vấn viên hoặc Tổ chức tư vấn phù hợp cho vụ việc". v3 FR-V.I-09 mô tả "Cán bộ nghiệp vụ phân công Người hỗ trợ / Tư vấn viên cho vụ việc" — chỉ cá nhân, không có nhánh Tổ chức tư vấn → lệch phạm vi đối tượng được chọn so với CSV → B2c. v4 áp đúng. Phần này tương ứng dòng 8.2, 8.3, 8.4 trong bảng vị trí.

**Phần 3 — Sửa lỗi nội bộ SRS (B1):** Sau khi FR-04 Thay đổi 8 tách Người hỗ trợ thành nhóm hồ sơ riêng (memory `project_tu_van_vien_entity_covers_nht` đã cập nhật), mối liên kết người xử lý vụ việc cũ chỉ trỏ vào hồ sơ tư vấn viên — không cover trường hợp Người hỗ trợ. v4 đổi mối liên kết sang tài khoản trung gian để cover cả Tư vấn viên / Chuyên gia / Người hỗ trợ → B1. Phần này tương ứng dòng 8.5, 8.8, 8.9, 8.10 trong bảng vị trí.
**Vị trí đã sửa:**
- §2 FR-V.I-09 Mô tả + Inputs (5 fields mới) + Processing Gợi ý 2 nhánh + Processing Phân công 8 bước + Outputs (9 fields với Đơn vị quản lý thay "địa bàn") + 6 mã lỗi (thêm ERR-PC-04..07) + Acceptance Criteria 5 dòng
- §4 Entity VU_VIEC: thêm 3 cột `loai_doi_tuong_xu_ly`, `nguoi_xu_ly_id` (FK TAI_KHOAN), `to_chuc_tu_van_id` (FK TO_CHUC_TU_VAN); bỏ `nguoi_ho_tro_id`
**Tham chiếu delta:** Thay đổi 8 (8.1-8.12); riêng entity PHAN_CONG_VU_VIEC spec đầy đủ ở Thay đổi 17

#### 9. Tách reference NGUOI_HO_TRO + TO_CHUC_TU_VAN khỏi TU_VAN_VIEN (phối hợp FR-04 Thay đổi 8 + 13 + 9)
**Phân loại:** B2a phối hợp FR-04
**Bối cảnh nghiệp vụ:** FR-04 Thay đổi 8 đã chốt phương án A: tách Người hỗ trợ thành nhóm hồ sơ riêng (BA chốt 2026-05-03, tái xác nhận 2026-05-05; memory `project_tu_van_vien_entity_covers_nht` đã cập nhật). Trong FR-05, hồ sơ tư vấn viên được tham chiếu lại để hiển thị thông tin người xử lý vụ việc. Nếu FR-05 vẫn giữ phân loại "Tư vấn viên / Chuyên gia / Người hỗ trợ" trong khi FR-04 đã tách Người hỗ trợ ra — hai tài liệu mâu thuẫn nhau, dev đọc không biết theo bên nào.
**Bằng chứng & lý do:** Đây là **Lấp UC còn thiếu so với file Danh sách UC + Transaction (CSV)** — phối hợp với FR-04 Thay đổi 8 (lấp UC41/42/49 cho Người hỗ trợ). v3 FR-05 phân loại tư vấn viên còn liệt kê 3 loại "Tư vấn viên / Chuyên gia / Người hỗ trợ"; sau khi FR-04 đã tách Người hỗ trợ thành nhóm hồ sơ riêng, v4 FR-05 đổi sang chỉ còn 2 loại "Tư vấn viên / Chuyên gia" và bổ sung tham chiếu sang nhóm Người hỗ trợ riêng → B2a.
**Vị trí đã sửa:**
- §4 Tổng quan entity: tăng từ 9 → 17 entity (3 owned mới + 5 referenced mới)
- §4 TU_VAN_VIEN.loai_tvv: ENUM `('TVV','CG','NHT')` → `('TVV','CG')` + ghi chú dẫn srs-fr-04
- §4 TU_VAN_VIEN: bỏ field `dia_ban_hoat_dong` (NĐ 77/2008 Đ.19 — TVV toàn quốc)
- §4 TU_VAN_VIEN.diem_danh_gia_tb: `0-10` → `DECIMAL(3,1) 1.0-5.0` (đồng bộ FR-04 Thay đổi 9)
**Tham chiếu delta:** Thay đổi 9 (9.1-9.5)

#### 11. CB PD từ chối phê duyệt → DANG_XU_LY (NHT sửa KQ) thay vì TU_CHOI (đóng VV)
**Phân loại:** C bất hợp lý nghiệp vụ
**Bối cảnh nghiệp vụ:** Sau khi Người hỗ trợ cập nhật kết quả tư vấn vụ việc, cán bộ phê duyệt review kết quả này. Nếu thấy chất lượng chưa đạt (lập luận thiếu, dẫn chứng pháp lý sai, chưa trả lời hết câu hỏi của doanh nghiệp), cán bộ phê duyệt cần để Người hỗ trợ sửa lại rồi trình tiếp — không phải đóng vụ việc và từ chối doanh nghiệp. v3 hiện tại thiết kế: cán bộ phê duyệt từ chối → vụ việc chuyển sang trạng thái Từ chối (đóng vụ việc). Cách này vô lý vì doanh nghiệp bị từ chối kết quả không phải do lỗi của họ mà do chất lượng tư vấn nội bộ chưa đạt. Đồng thời mâu thuẫn quy tắc BR-FLOW-04 ("từ chối phải có lý do hiển thị cho người tạo ban đầu") — nếu vụ việc đóng thì Người hỗ trợ không thấy lý do để sửa.
**Bằng chứng & lý do:** Đây là **Bất hợp lý nghiệp vụ** — v3 FR-V.I-13 Processing bước 3 ghi "Nếu Từ chối: chuyển trạng thái Từ chối" — đóng hoàn toàn vụ việc. Nhưng v3 §5 vòng đời vụ việc lại liệt kê chuyển trạng thái "Chờ phê duyệt → Đang xử lý" với người kích hoạt là cán bộ phê duyệt từ chối — vòng đời v3 đã đúng nhưng FR-V.I-13 mâu thuẫn. v3 mâu thuẫn nội bộ → C bất hợp lý nghiệp vụ. v4 sửa FR-V.I-13 cho đồng bộ vòng đời. ⚠️ Lưu ý: nếu cán bộ phê duyệt muốn từ chối thực sự (kết quả không thể sửa, doanh nghiệp không hợp tác), cần dùng cơ chế khác — chuyển trở lại cán bộ nghiệp vụ để cán bộ chủ động đóng vụ việc.
**Vị trí đã sửa:**
- §2 FR-V.I-13 Processing bước 3 (TU_CHOI → DANG_XU_LY thay TU_CHOI)
- §2 FR-V.I-13 Postconditions + Acceptance Criteria
- §3 SCR-V.I-03 bảng nút thao tác CHO_PHE_DUYET (giải thích KHÔNG đóng VV)
- §5 SM bảng `CHO_PHE_DUYET → DANG_XU_LY` đã có sẵn ở v3 (line 1959), giữ nguyên
**Tham chiếu delta:** Thay đổi 11 (11.1-11.5)

#### 12. UC67 đánh giá: ENUM người đánh giá CHỈ {CB_NV, DN} (loại CB_PD theo CSV) + duplicate guard per loại + tách thang VV (0-10) vs TVV (1-5)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Theo CSV §V.I dòng 562 UC67 (Đánh giá kết quả hỗ trợ vụ việc), chỉ có 2 vai trò được đánh giá: Cán bộ nghiệp vụ và Doanh nghiệp. v3 hiện tại mô tả mơ hồ "Cán bộ nghiệp vụ hoặc Doanh nghiệp" và không kiểm soát rõ ai được phép — cán bộ phê duyệt cũng có thể vô tình tham gia chấm điểm. Đồng thời v3 không kiểm tra trùng — cùng một cán bộ có thể chấm cùng vụ việc nhiều lần làm điểm trung bình không ổn định. Bên cạnh đó, sau khi Thay đổi 9 đã chốt thang điểm trung bình của tư vấn viên là 1-5 sao (đồng bộ FR-04 Thay đổi 9), nhưng điểm chất lượng vụ việc trong UC67 lại là thang 0-10 — cần tách rõ 2 thang để dev không nhầm và doanh nghiệp/cán bộ không bối rối.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — CSV §V.I dòng 562 UC67 vai trò "Cán bộ nghiệp vụ TW,BN,ĐP/Doanh nghiệp" chỉ 2 loại. v4 changelog 2026-05-04 ghi "F-FR05-06 BA chốt phương án B tuân thủ CSV: bỏ Cán bộ phê duyệt khỏi 6 vị trí UC67". v3 thiếu kiểm soát vai trò + thiếu kiểm tra trùng + nhóm dữ liệu đánh giá vụ việc chưa được khai báo → B1.
**Vị trí đã sửa:**
- §2 FR-V.I-17 Mô tả (rõ thang 0-10 + duplicate per loại)
- §2 FR-V.I-17 Preconditions PRE-03 (Role ∈ {CB_NV, DN})
- §2 FR-V.I-17 Processing 10 bước (thêm validate scope + duplicate check + tham chiếu FR-IV-CROSS-01)
- §2 FR-V.I-17 Errors: thêm ERR-DG-VV-03, ERR-DG-VV-04
- §4 Entity DANH_GIA_VU_VIEC spec (Thay đổi 17 IN): UNIQUE(vu_viec_id, loai_nguoi_danh_gia) + ENUM CB_NV/DN
- §4 VU_VIEC.diem_danh_gia + KET_QUA_VU_VIEC.diem_danh_gia: thêm note "thang 0-10 — KHÁC thang TVV 1-5"
**Tham chiếu delta:** Thay đổi 12 (12.1-12.12)

#### 13. Bỏ TVV địa bàn (NĐ 77/2008 Đ.19) + đổi thang TVV 1-5 + UI "Đơn vị quản lý" thay "địa bàn"
**Phân loại:** C-Đúng-luật + B1
**Bối cảnh nghiệp vụ:** Phối hợp với FR-04 Thay đổi 13 (bỏ giới hạn tư vấn viên theo địa bàn theo NĐ 77/2008 Điều 19 Khoản 2 — Thẻ TVV phạm vi toàn quốc) và FR-04 Thay đổi 9 (đồng bộ thang điểm sao 1-5). Trong FR-05, hồ sơ tư vấn viên được tham chiếu lại — nếu giữ ô địa bàn cũ và thang điểm cũ thì FR-05 mâu thuẫn FR-04, dev đọc hai tài liệu thấy hai phiên bản khác nhau.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Bất hợp lý nghiệp vụ (C-Đúng-luật):** NĐ 77/2008 Điều 19 Khoản 2 (đã verify) ghi rõ "Tư vấn viên pháp luật được hoạt động trong phạm vi toàn quốc". v3 hồ sơ tư vấn viên có ô địa bàn hoạt động — sai luật. v4 bỏ ô này → C-Đúng-luật. Phần này tương ứng dòng 13.1, 13.3 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** Phối hợp FR-04 Thay đổi 9 — thang điểm doanh nghiệp đánh giá tư vấn viên là 1-5 sao (3 ô chấm sao), điểm trung bình tư vấn viên cũng phải hiển thị 1-5. v3 dùng thang 0-10 lệch FR-04 — v4 đổi 1.0-5.0 → B1. Phần này tương ứng dòng 13.2 trong bảng vị trí.
**Vị trí đã sửa:**
- §4 TU_VAN_VIEN: bỏ `dia_ban_hoat_dong`, `diem_danh_gia_tb` đổi sang `DECIMAL(3,1) 1.0-5.0` (đã ghi ở Thay đổi 9 cùng entity)
- §2 FR-V.I-09 Processing nhánh Gợi ý: lọc theo lĩnh vực (bỏ "địa bàn")
- §2 FR-V.I-09 Outputs: bỏ `dia_ban`, thêm `don_vi_quan_ly` với ghi chú dẫn NĐ 77/2008 Đ.19
- D.2.3 phương án A: UI Outputs FR-V.I-09 dùng "Đơn vị quản lý" thay "địa bàn"
**Tham chiếu delta:** Thay đổi 13 (13.1-13.5) + D.2.3 phương án A

#### 14. BR-AUTH-01: bỏ VNPT eKYC + xác định 2-tier (Tier 1 nội bộ + Tier 2 VNeID)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hệ thống có 2 nhóm người dùng tách bạch: cán bộ nội bộ truy cập qua mạng kín nội bộ (Tier 1 — tên đăng nhập + mật khẩu + mã OTP gửi qua email); doanh nghiệp / tư vấn viên / chuyên gia / người hỗ trợ truy cập qua Internet (Tier 2 — đăng nhập một lần qua VNeID). Memory `project_auth_no_vnpt_ekyc` đã chốt: KHÔNG dùng VNPT eKYC. v3 hiện tại còn ghi 3 cấp xác thực với cấp 2 là VNPT eKYC — lệch định hướng kiến trúc, dev đọc tài liệu sẽ đi tìm cách tích hợp VNPT eKYC trong khi thực tế không cần.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 BR-AUTH-01 ghi "Tier 1 (MVP): Username/password + TOTP 2FA qua email. Tier 2: VNPT eKYC. Tier 3: SSO VNeID OIDC". Memory `project_auth_no_vnpt_ekyc.md` ghi rõ "KHÔNG có VNPT eKYC" → B1. v4 đã sửa thành mô hình 2 cấp đúng định hướng.
**Vị trí đã sửa:**
- §6 BR-AUTH-01 (đổi text từ "Tier 1 + VNPT eKYC + VNeID OIDC" thành "2-tier: Tier 1 nội bộ qua mạng kín + Tier 2 SSO VNeID Internet")
- §2 FR-V.I-02 PRE-01 (DN auth Tier 2 VNeID)
- §2 FR-V.I-14 PRE-01 (DN auth Tier 2 VNeID)
- §3 SCR-V.I-04 + SCR-V.I-05 Xác thực: VNeID Tier 2 (Thay đổi 19)
**Tham chiếu delta:** Thay đổi 14 (14.1-14.8). FR-V.I-10/15 PRE-01 GIỮ NGUYÊN v3 ("NHT đã đăng nhập") vì Thay đổi 10 OUT.

#### 15. DON_VI cấu trúc 2 tầng — TW cấp 1; BN/ĐP cấp 2 ngang cấp song song
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Memory `project_auth_scope_2tier` đã chốt cấu trúc đơn vị: Trung ương là cấp cha duy nhất; Bộ ngành và Địa phương là 2 loại đơn vị ngang cấp song song — Bộ ngành KHÔNG có địa phương trực thuộc. v3 hiện tại mô tả mơ hồ "cây phân cấp 3 tầng TW/BN/ĐP" — dev có thể hiểu nhầm thành Bộ ngành là cấp cha của Địa phương, từ đó cấp Bộ ngành lại có quyền xem dữ liệu của các Địa phương trong cùng cây. Phân quyền dữ liệu sẽ sai theo cấu trúc tự bịa.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — Memory `project_auth_scope_2tier.md` chốt rõ cấu trúc 2 tầng. v3 hồ sơ đơn vị mô tả "Cơ quan/đơn vị tham gia hệ thống (cây phân cấp 3 tầng TW/BN/ĐP)" và liên kết đơn vị cha không quy định rõ Bộ ngành thuộc cha nào — lệch định hướng dự án → B1.
**Vị trí đã sửa:**
- §4 DON_VI Mô tả (đổi "cây 3 tầng" → "2 tầng: TW cấp 1; BN và ĐP cấp 2 ngang cấp")
- §4 DON_VI.don_vi_cha_id: thêm constraint "NULL khi cap=TW; = TW khi cap=BN hoặc cap=DP"
- §3 SCR-V.I-01 quy tắc tương tác: cập nhật mô tả phân quyền theo BR-AUTH-03/04 + BR-AUTH-02
- §6 BR-AUTH-03/04 mới (chi tiết ở Thay đổi 17)
**Tham chiếu delta:** Thay đổi 15 (15.1-15.5)

#### 16. FR-V.I-02/04: DN auth Tier 2 VNeID + lookup DN từ session/MST + check field BR-CALC-04 trước khi tạo VV (chống duplicate DN data + chuẩn auth)
**Phân loại:** B1 + C-Đúng-luật
**Bối cảnh nghiệp vụ:** Khi doanh nghiệp gửi yêu cầu hỗ trợ pháp lý qua chuyên trang, hệ thống cần xác thực doanh nghiệp đăng nhập bằng VNeID (cấp 2 — Internet) để bảo đảm đúng người gửi. v3 hiện tại bắt doanh nghiệp tự nhập lại tên doanh nghiệp, mã số thuế, địa chỉ, người đại diện trong form gửi yêu cầu — dữ liệu này đã có trong hồ sơ doanh nghiệp ở hệ thống nên gây nhập trùng + sai sót. Đồng thời, BR-CALC-04 (theo NĐ 55/2019 Điều 4) yêu cầu hệ thống tự tính ưu tiên phân công cho vụ việc của doanh nghiệp nữ làm chủ, nhiều lao động nữ, lao động khuyết tật — nhưng v3 không kiểm tra hồ sơ doanh nghiệp đã có đủ các thông tin này trước khi tạo vụ việc, nên BR-CALC-04 không hoạt động được vì thiếu dữ liệu nguồn.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Bất hợp lý nghiệp vụ (C-Đúng-luật):** Memory `project_auth_no_vnpt_ekyc` chốt cấp 2 = VNeID cho doanh nghiệp. v3 chỉ ghi "DN đã đăng nhập trên chuyên trang" mơ hồ. v4 đổi rõ ràng cấp 2 VNeID và lấy thông tin doanh nghiệp từ phiên đăng nhập đã xác thực — không cho doanh nghiệp nhập lại. Phối hợp Thay đổi 14 + chống nhập trùng dữ liệu → C-Đúng-luật. Phần này tương ứng dòng 16.1, 16.2 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** BR-CALC-04 (NĐ 55/2019 Điều 4) ưu tiên phân công cho vụ việc của doanh nghiệp nữ làm chủ + nhiều lao động nữ + ≥30% lao động khuyết tật. Nếu hồ sơ doanh nghiệp thiếu các thông tin nền này thì BR-CALC-04 không tính được điểm ưu tiên → phân công lệch. v3 không kiểm tra trước khi tạo vụ việc; v4 thêm bước kiểm tra cảnh báo doanh nghiệp cập nhật hồ sơ trước → B1. Phần này tương ứng dòng 16.3, 16.4 trong bảng vị trí.
**Vị trí đã sửa:**
- §2 FR-V.I-02 Mô tả + Inputs 7 fields (đổi từ DN tự nhập sang lấy `doanh_nghiep_id` từ session) + Processing 8 bước (lookup DN, validate BR-CALC-04, auto-calc uu_tien) + 4 mã lỗi (thêm ERR-GHS-03, ERR-GHS-04)
- §2 FR-V.I-04 Inputs 11 fields (lookup DN theo MST, modal tạo DN mới với đủ field BR-CALC-04, override uu_tien) + Processing 10 bước + 5 mã lỗi (thêm ERR-NH-03, ERR-NH-04, ERR-NH-05)
**Tham chiếu delta:** Thay đổi 16 (16.1-16.10)
**Phụ thuộc cross-FR:** FR-07 (V.III) phương án TK-first qua FR-VIII-22 (`srs-fr-10`) — Pha 3 reconcile.

#### 17. Bổ sung spec đầy đủ 3 entity owned + 8 BR đã thiếu trong v3 (KHÔNG bao gồm BR-AUTH-10 vì Thay đổi 10 OUT)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** v3 vẽ sơ đồ liên kết các nhóm hồ sơ (Phân công, Đánh giá, Lịch sử) nhưng không liệt kê chi tiết các ô thông tin trong từng nhóm — dev đọc hồ sơ không biết hồ sơ phân công lưu những gì, hồ sơ đánh giá có cột nào. Đồng thời v3 trích thiếu 9 quy tắc nghiệp vụ đã có sẵn ở SRS gốc (phân quyền theo cấp đơn vị, cập nhật điểm trung bình tư vấn viên, tự đóng vụ việc khi quá hạn bổ sung, tự đồng bộ trạng thái cờ công khai với cổng…) — các nhóm chức năng có viện dẫn các quy tắc này nhưng mục Quy tắc nghiệp vụ trong tài liệu không có nội dung mô tả, dev không biết quy tắc cụ thể là gì.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 §4 chỉ liệt kê 9 nhóm hồ sơ (3 owned + 6 referenced), không có Phân công vụ việc, Đánh giá vụ việc, Lịch sử vụ việc owned + Tổ chức tư vấn, Người hỗ trợ, Cấu hình SLA, Cấu hình quy trình, Thông báo referenced. v3 §6 liệt kê 14 quy tắc — thiếu 9 quy tắc đã có ở SRS gốc → B1.
**Vị trí đã sửa:**
- §4 Tổng quan entity: 9 → 17 entity (3 owned mới + 5 referenced mới + 3 cấu hình)
- §4 PHAN_CONG_VU_VIEC spec đầy đủ 12 cột (loai_doi_tuong_xu_ly, nguoi_xu_ly_id, to_chuc_tu_van_id, trang_thai 3 ENUM, ngay_xac_nhan...)
- §4 DANH_GIA_VU_VIEC spec đầy đủ 11 cột (loai_nguoi_danh_gia ENUM CB_NV/DN, UNIQUE constraint per VV per loại)
- §4 LICH_SU_VU_VIEC spec đầy đủ 11 cột (CHECK ENUM 18 hành động neutral cover TVV/CG/NHT, vai_tro 5 ENUM)
- §6 Tổng quan BR: 14 → 21 BR (thêm BR-AUTH-03/04, BR-CALC-03, BR-CALC-06, BR-EC-15, BR-EC-16, BR-NOTIF-01, BR-SLA-03)
- §6 chi tiết các BR mới (đặt cuối §6 sau BR-SLA-02)
**Tham chiếu delta:** Thay đổi 17 (17.1-17.15) — KHÔNG apply BR-AUTH-10 (17.7) do Thay đổi 10 OUT

#### 19. SCR-V.I-03 cleanup description + chế độ doanh nghiệp tách + 2 SCR DN mới (SCR-V.I-04 Danh sách VV của tôi + SCR-V.I-05 Thông báo của tôi)
**Phân loại:** A-ITEM-01 phối hợp + B1
**Bối cảnh nghiệp vụ:** Màn hình chi tiết vụ việc trong v3 mô tả còn ghi lịch sử nội bộ (gộp từ màn hình A, B, C…) — phù hợp ghi chú nội bộ trong nhóm thiết kế nhưng người duyệt thầu hoặc cán bộ thẩm định đọc tài liệu thấy lộn xộn. Doanh nghiệp khi truy cập chuyên trang chỉ có form gửi yêu cầu và thông báo — không có màn hình nào cho doanh nghiệp xem danh sách vụ việc của mình hay danh sách thông báo. Đồng thời v3 thiếu phần quy ước trình bày màn hình chung (cách đọc bảng thành phần, ánh xạ mã trạng thái sang nhãn tiếng Việt, cách cắt nội dung dài, trạng thái rỗng, thông báo chung) — dev tự bịa thuật ngữ, mã trạng thái nội bộ lộ ra giao diện cho người dùng cuối thấy.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Yêu cầu thay đổi của đối tác TT CNTT (A-ITEM-01 phối hợp):** 2 màn hình mới cho doanh nghiệp (Danh sách vụ việc của tôi + Danh sách thông báo của tôi) phối hợp với cụm công khai vụ việc của Thay đổi 2. Phần này tương ứng dòng 19.10-19.13 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** v3 SCR-V.I-03 mô tả "CONSOLIDATED v2.1 + Gộp từ MH-05.4..." — lịch sử nội bộ. v3 không có 2 màn hình doanh nghiệp. v3 không có Mục 3.A-G quy ước trình bày chung. v4 changelog 2026-05-04 ghi "Deep review screen description áp dụng phương án từ báo cáo `srs-v3-fr-05-screen-review-2026-05-04.md` — fix all 11 phát hiện" → B1. Phần này tương ứng dòng 19.1-19.9 và 19.14 trong bảng vị trí.
**Vị trí đã sửa:**
- §3 SCR-V.I-03 description (bỏ "CONSOLIDATED v2.1 + Gộp từ MH-x", còn 2 dòng theo quy ước viết)
- §3 SCR-V.I-03 — Chế độ doanh nghiệp (sub-section mới): bảng quy tắc 14 dòng — ẩn Nhóm 4/5/7, chỉ 2 nút [Bổ sung hồ sơ] + [Đánh giá], bảo mật cán bộ theo NĐ 13/2023
- §3 SCR-V.I-04 (mới ~25 dòng): 3 tab + 14 thành phần + Quy tắc tương tác (cột Đơn vị xử lý, cột Công khai badge, không hiển thị tên cá nhân CB)
- §3 SCR-V.I-05 (mới ~20 dòng): filter trạng thái đọc + loại + ngày, polling 30s mặc định
**Tham chiếu delta:** Thay đổi 19 (19.10-19.13)

#### V4-CHƯA-SỬA #1. BR-AUTH-08 thiếu exception TW
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Bối cảnh nghiệp vụ:** Memory `project_auth_scope_2tier` chốt: cấp Trung ương xem toàn quốc (xem được mọi dữ liệu thuộc Bộ ngành / Địa phương). v3 BR-AUTH-08 (line 1819) ghi "Chính sách phân quyền dữ liệu áp dụng cho MỌI bảng có ràng buộc đơn vị. Không có ngoại lệ ngoại trừ Quản trị hệ thống" — cấp Trung ương cũng phải là ngoại lệ, không chỉ Quản trị hệ thống. v4 KHÔNG sửa BR-AUTH-08 (giữ nguyên text v3).
**Bằng chứng & lý do:** v3 line 1819 + v4 line 2780 đều ghi y nguyên: "Chính sách phân quyền dữ liệu áp dụng cho MỌI bảng có cột `don_vi_id`. Không có exception ngoại trừ QTHT". Nhưng v4 BR-AUTH-03/04 mới (line 2858) lại ghi: "Cán bộ TW xem được toàn bộ dữ liệu (có filter chọn đơn vị)" — TW thực tế có exception. → B1 [V4-CHƯA-SỬA] (mâu thuẫn nội bộ giữa BR-AUTH-08 và BR-AUTH-03/04 trong cùng v4).
**Vị trí đã sửa:** §6 BR-AUTH-08 — thêm "ngoại trừ QTHT và Cán bộ Trung ương (xem BR-AUTH-03/04)"
**Tham chiếu delta:** V4-CHƯA-SỬA #1 (C1.1)

### Quyết định không cherry-pick từ v4 (6 thay đổi OUT — xem mục F delta)

- **Thay đổi 5** (FR-V.I-19 Mở lại HS): KHÔNG có UC trong CSV. SM `TU_CHOI → DA_TIEP_NHAN` giữ FR Ref placeholder `FR-V.I-xx` v3; nút [Mở lại hồ sơ] ở SCR-V.I-03 v3 giữ nguyên. Bảng nút SCR-V.I-03 đã thêm note "FR formal hoá ở lượt review tiếp theo".
- **Thay đổi 6** (FR-V.I-NEW-03 Auto-từ chối 3 lần YCBS): KHÔNG có UC trong CSV. Quy tắc UI v3 SCR-V.I-03 line 1437-1442 (Thay đổi 19 IN không đụng phần này) giữ nguyên. BR-EC-15 đã trích vào §6 (Thay đổi 17) làm context — reference FR-V.I-06.
- **Thay đổi 7** (FR-V.I-NEW-04 Auto-return): KHÔNG có UC trong CSV. Quy tắc UI v3 giữ nguyên. PHAN_CONG_VU_VIEC entity spec (Thay đổi 17 IN) KHÔNG có ENUM `AUTO_RETURN` và field `ngay_auto_return`.
- **Thay đổi 10** (Đổi tên FR-V.I-15 + Action-level permissions BR-AUTH-10): CSV UC65 actor "Người hỗ trợ" — không mở rộng actor. Tên FR-V.I-10/15 + Mô tả + Pre-condition giữ "NHT" như v3. KHÔNG thêm bảng Action-level permissions, KHÔNG thêm BR-AUTH-10 vào §6.
- **Thay đổi 18** (SCR-V.I-01 7 tab + filter Đơn vị + dynamic SLA + siết Sửa/Xóa): BA quyết bỏ. SCR-V.I-01 giữ nguyên 6 tab + cảnh báo SLA 4 emoji + Sửa/Xóa hiển thị mọi trạng thái như v3.
- **Thay đổi 20** (FR-V.I-12 Thông báo KQ thủ công): BA quyết bỏ. FR-V.I-12 + SCR-V.I-03 quy tắc "Thông báo KQ tự động" giữ nguyên text v3.

### Cảnh báo & phụ thuộc cross-FR (Pha 3 reconcile)

1. **Cite NĐ55 Đ.8 K.1** (SLA 15 ngày — Thay đổi 1): chưa có trong `legal-citations-verification.md`. Đề xuất verify lượt review tiếp theo trước khi đóng v3.5 vì cite này ảnh hưởng deadline mọi VV.
2. **Cite NĐ55 Đ.4** (BR-CALC-04 ưu tiên): chưa verify, IN như v3.
3. **Cite NĐ69/2024** (SSO VNeID — BR-AUTH-01): chưa verify, IN theo v4.
4. **Cite NĐ55 Đ.7 + Đ.10** (NHT + TC TV): đã verify ❌ WRONG ở `legal-citations-verification.md` (FR-04 lượt 6) — KHÔNG cite trong v3.5/srs-fr-05 (chỉ note ở Lịch sử thay đổi và CHANGELOG).
5. **Phụ thuộc FR-04** (Thay đổi 8, 9, 13): cần FR-04 áp xong refactor mạng lưới TVV (entity TO_CHUC_TU_VAN, NGUOI_HO_TRO, DANH_GIA_SAU_VU_VIEC, FR-IV-CROSS-01) trước khi FR-05 reference. FR-04 đã apply qua Bước 2c.
6. **Phụ thuộc FR-07** (Thay đổi 16): cần FR-07 cover DN tự đăng ký entity sau auth VNeID lần đầu — phương án TK-first qua FR-VIII-22 (`srs-fr-10`) đã chốt ở FR-07 v4 line 17. Khi FR-07 + FR-10 áp v3.5 → reconcile.
7. **Phụ thuộc srs-v3.md / FR-10 (BR catalog)**: 11 BR mới trích vào §6 FR-05 — cần đảm bảo srs-v3.md gốc cũng có (Thay đổi 17 + 14 + 15). Pha 3 sync BR catalog gốc.
8. **Phụ thuộc srs-v3.md / FR-10 (DON_VI structure + BR-AUTH-02)**: DON_VI là entity dùng chung — Thay đổi 15 sửa rõ 2 tầng nhưng cần sync source of truth ở srs-v3.md hoặc FR-10. Pha 3 reconcile.
9. **3 transition SM-VUVIEC không có FR formal** (do Thay đổi 5, 6, 7 OUT): TU_CHOI → DA_TIEP_NHAN (placeholder FR-V.I-xx); auto 3 lần YCBS (chỉ có quy tắc UI + BR-EC-15); auto-return (chỉ có quy tắc UI). Dev implement theo quy tắc UI v3 + BR-EC-15/16. Lượt review tiếp theo có thể xét formal hoá nếu cần.
10. **Mở lại HS sau khi entity model đổi (Thay đổi 8 IN, Thay đổi 5 OUT)**: khi `TU_CHOI → DA_TIEP_NHAN`, entity VU_VIEC sau Thay đổi 8 có thêm 3 cột phân công (`loai_doi_tuong_xu_ly`, `nguoi_xu_ly_id`, `to_chuc_tu_van_id`). Action SM v3 ghi mơ hồ "Audit log, ghi lý do" — không nói rõ có clear 3 cột này không. Cần lượt review tiếp theo hoặc Pha 3 spec rõ.

---

## srs-fr-11-bao-cao.md — Báo cáo Thống kê

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-11.md`
**Cách tiếp cận:** Seed từ `srs-v3/srs-fr-11-bao-cao.md` (1.268 dòng) → apply 6 thay đổi đã duyệt → kết quả 1.284 dòng. KHÔNG seed từ v4 vì v4 chỉ Δ +45 dòng và phần lớn thay đổi đều surgical.

**Số thay đổi đã apply:** 6 (cherry-pick) — bỏ 2 thay đổi BA chốt OUT 2026-05-06 (Thay đổi 4 + 8); 2 phát hiện Hướng 2 (C.1, C.2) chưa duyệt → không apply.

### Danh sách thay đổi nghiệp vụ

#### 1. Chuyển dải số UC từ UC120-UC142 sang UC124-UC146 cho khớp số UC chính thức trong CSV
**Phân loại:** B2d (lấp gap CSV — CSV là source of truth)
**Bối cảnh nghiệp vụ:** Cán bộ phụ trách và lập trình viên đối chiếu nghiệp vụ giữa tài liệu yêu cầu (SRS) và file Danh sách UC + Transaction bằng cách so khớp số nghiệp vụ (UC). Toàn bộ 23 báo cáo nhóm IX trong v3 đang đánh số UC120 đến UC142, lệch 4 đơn vị so với file CSV chính thức (đánh số từ UC124 đến UC146). Hậu quả: mọi câu hỏi của Cán bộ phụ trách kiểu "báo cáo UC130 trong SRS có khớp UC130 trong CSV không?" đều trả lời sai — thực tế UC130 trong SRS lại tương ứng UC134 trong CSV. Đến giai đoạn nghiệm thu, đoàn nghiệm thu sẽ không tra được báo cáo nào trong SRS ứng với UC nào trong CSV gốc.
**Bằng chứng & lý do:** Đây là **Sửa luồng/dữ liệu sai so với file Danh sách UC + Transaction (CSV)** — file Danh sách UC + Transaction phiên bản 1.1 ngày 27/03/2026 §IX bắt đầu từ UC124 "Báo cáo thống kê số lượng hỏi đáp, vướng mắc" và kéo đến UC146 (đủ 23 báo cáo). v3 đánh số bắt đầu từ UC120 — lệch 4 đơn vị so với CSV nguồn. Theo nguyên tắc CSV là baseline chính thức, SRS phải khớp số UC theo CSV; v4 đã sửa lại đúng dải UC124-UC146 → B2d.
**Vị trí đã sửa trong srs-v3.5/srs-fr-11-bao-cao.md:**
- §1 Header file (line 6): "UC range: UC 124 – UC 146"
- §2 — 23 heading FR-IX-01 → FR-IX-23 (line 127, 179, 223, 268, 312, 344, 387, 427, 472, 513, 554, 591, 624, 663, 695, 729, 763, 802, 844, 876, 916, 950, 989) đổi mã UC theo offset +4
- §2 — 23 dòng "UC Reference" tương ứng từng FR (line 129, 181, 225, 270, 314, 346, 389, 429, 474, 515, 556, 593, 626, 665, 697, 731, 765, 804, 846, 878, 918, 952, 991)
- §3 SCR-IX-01 — Mapping 23 loại BC trong Dropdown (line 1058-1080, 23 dòng) đổi UC120-142 → UC124-146

**Tổng vị trí:** 46 ref UC. Mass renumber bằng sed reverse-order (UC142 → UC120) để tránh double-replace.
**Tham chiếu delta:** Thay đổi 1 (1.1, 1.2, 1.3, 1.4)

#### 2. Đổi tên báo cáo hỏi đáp pháp lý → hỏi đáp pháp luật
**Phân loại:** A-ITEM-14 (CR-09)
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ tra cứu báo cáo qua hai chỗ: thanh điều hướng bên trái và danh sách thả xuống chọn loại báo cáo trên màn hình. Thuật ngữ "hỏi đáp pháp lý" trong toàn dự án đang được đổi thống nhất sang "hỏi đáp pháp luật" — nhóm tiếp nhận và xử lý hỏi đáp (FR-02) đã đổi theo yêu cầu mục ITEM-11, nhóm báo cáo (FR-11) phải đồng bộ theo. Nếu FR-11 vẫn giữ tên cũ trong khi FR-02 đã đổi, cán bộ sẽ thấy hai tên khác nhau cho cùng một loại nghiệp vụ — gây nhầm lẫn khi đối chiếu giữa màn hình hỏi đáp và màn hình báo cáo.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — yêu cầu thay đổi mục ITEM-14 ghi rõ "Sub-menu Báo cáo hỏi đáp pháp lý → Báo cáo hỏi đáp pháp luật", liệt kê 3 vị trí cần đổi: mục lục tài liệu chính, danh sách thả xuống chọn loại báo cáo trong FR-11 và tên báo cáo FR-IX-01. v4 đã áp 2 vị trí thuộc FR-11; vị trí mục lục tài liệu chính sẽ xử lý ở Pha 3 → A-ITEM-14.
**Vị trí đã sửa:**
- §2 FR-IX-01 heading (line 127): "BC Số lượng hỏi đáp/vướng mắc pháp luật (UC124)"
- §3 SCR-IX-01 — optgroup dropdown (line 1058): "**Hỏi đáp pháp luật**" + tên BC kèm "pháp luật"

**Phụ thuộc cross-FR:** srs-v3.md mục lục danh sách nhóm FR — Pha 3 sync.
**Tham chiếu delta:** Thay đổi 2 (2.1, 2.2)

#### 3. Sửa phân quyền dữ liệu báo cáo theo cấu trúc 2-tier (BN và ĐP ngang cấp song song)
**Phân loại:** B1 (sửa mâu thuẫn nội bộ giữa Processing/UI và BR-AUTH-08)
**Bối cảnh nghiệp vụ:** Theo cấu trúc tổ chức của hệ thống hỗ trợ pháp lý cho doanh nghiệp, Trung ương (Bộ Tư pháp / Cục Bổ trợ tư pháp) là cấp cha duy nhất. Các Bộ ngành và các Địa phương (Ủy ban nhân dân cấp tỉnh sau Nghị định 121/2025) là hai loại đơn vị ngang cấp song song — mỗi loại quản lý một mảng riêng, không có quan hệ cấp trên cấp dưới với nhau. Bộ ngành không có Địa phương trực thuộc. Vì vậy báo cáo phải tôn trọng nguyên tắc: Trung ương xem dữ liệu toàn quốc; Bộ ngành chỉ xem dữ liệu của Bộ ngành mình; Địa phương chỉ xem dữ liệu của Địa phương mình. v3 hiện cho phép Bộ ngành xem cả "Bộ ngành mình + Địa phương trực thuộc" — sai cấu trúc tổ chức, dẫn tới cán bộ Bộ ngành thấy được dữ liệu hỏi đáp / vụ việc / tư vấn viên thuộc thẩm quyền Địa phương khác.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Xử lý chung của báo cáo nhóm IX (bước 3) và phần Lựa chọn đơn vị trên màn hình SCR-IX-01 đều ghi "Bộ ngành thấy Bộ ngành mình + các Địa phương trực thuộc". Cùng trong file này, quy tắc nghiệp vụ BR-AUTH-08 lại ghi đúng "Trung ương thấy toàn quốc, Bộ ngành thấy Bộ ngành, Địa phương thấy Địa phương". Đây là mâu thuẫn nội bộ giữa phần Xử lý / Màn hình và phần Quy tắc nghiệp vụ ngay trong cùng một file. v4 sửa cả hai vị trí để đồng bộ với BR-AUTH-08 và đúng cấu trúc tổ chức 2 nhánh ngang cấp → B1.
**Vị trí đã sửa:**
- §2 TPL-REPORT-FULL — Processing chung Bước 3 (line 79): áp dụng phạm vi 2-tier; áp BR-AUTH-03, BR-AUTH-04, BR-AUTH-08
- §3 SCR-IX-01 — Dropdown đơn vị (line 1043): "BN: chỉ BN mình (locked); ĐP: chỉ ĐP mình (locked); TW: Toàn quốc + chọn BN/ĐP bất kỳ"

**Tham chiếu delta:** Thay đổi 3 (3.1, 3.2)

#### 4. FR-IX-08 — Loại bỏ NHT khỏi enum `loai_tvv`, query NHT từ entity riêng
**Phân loại:** B1 (đồng bộ với memory `project_tu_van_vien_entity_covers_nht` — TU_VAN_VIEN enum chỉ 'TVV','CG'; NHT entity riêng NGUOI_HO_TRO)
**Bối cảnh nghiệp vụ:** Trong dự án này, Tư vấn viên pháp luật và Cộng tác viên là hai đối tượng cùng nằm trong nhóm tư vấn viên (đối tượng tư vấn pháp luật trực tiếp cho doanh nghiệp), còn Người hỗ trợ pháp lý (cán bộ thuộc tổ chức đại diện cho doanh nghiệp) là đối tượng riêng — được lưu thành nhóm thông tin tách biệt và đã có chức năng quản lý riêng ở FR-04. Báo cáo "Số lượng tư vấn viên / cộng tác viên" (UC131) chỉ đếm 2 đối tượng trong nhóm tư vấn viên, không được gộp Người hỗ trợ pháp lý vào — nếu gộp sẽ làm con số trên báo cáo bị sai vì 2 nguồn dữ liệu lưu ở 2 chỗ khác nhau, thậm chí có thể đếm trùng hoặc đếm thiếu.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Đầu vào của FR-IX-08 trong v3 cho phép lọc theo 3 loại "Tư vấn viên / Cộng tác viên / Người hỗ trợ pháp lý" trong cùng một danh sách, sai với quy ước nội bộ đã chốt: nhóm tư vấn viên chỉ gồm 2 loại "Tư vấn viên / Cộng tác viên"; Người hỗ trợ pháp lý là đối tượng riêng được quản lý ở chức năng FR-04 với nhóm thông tin tách biệt. v4 đã sửa danh sách lọc còn 2 loại và ghi chú: "Nếu cần thống kê Người hỗ trợ pháp lý, truy vấn từ nhóm thông tin riêng của Người hỗ trợ" → B1. ⚠️ Lưu ý: v4 hiện đang trích dẫn Nghị định 55/2019 Điều 7 làm căn cứ, nhưng theo file kiểm chứng pháp lý của dự án, Điều 7 nói về "dữ liệu bản án, quyết định, phán quyết" — không liên quan tới Người hỗ trợ pháp lý. Đề nghị bỏ trích dẫn sai Điều 7 này khỏi v3.5, chỉ giữ phần ghi chú nghiệp vụ về việc tách 2 đối tượng (xem mục H.1 và D.5).
**Vị trí đã sửa:**
- §2 FR-IX-08 — Inputs đặc thù (line 446-448): `loai_tvv` enum 'TVV / CG'; thay `dia_ban_id` (FK→DANH_MUC) bằng `don_vi_id` (FK→DON_VI) kèm chú thích "TVV PL hoạt động phạm vi toàn quốc theo Khoản 2 Điều 19 Nghị định 77/2008/NĐ-CP"
- §2 FR-IX-08 — Công thức (line 450): "Đếm TVV/CG đang hoạt động trong TU_VAN_VIEN; NHT lưu ở entity riêng NGUOI_HO_TRO; nếu cần thống kê NHT, dùng dimension/báo cáo riêng"
- §2 FR-IX-08 — Dimensions (line 452): "Đơn vị, Loại (TVV/CG), Lĩnh vực chuyên môn"

**Lưu ý không cite NĐ 55/2019 Đ.7:** Memory `feedback_legal_citation_web_verify` + `legal-citations-verification.md` L3 đã verify Điều 7 NĐ 55/2019 nói về "dữ liệu bản án, quyết định" — KHÔNG liên quan người hỗ trợ pháp lý. Cite này có trong v4 nhưng KHÔNG được đưa vào v3.5. Phần nghiệp vụ "NHT lưu ở entity riêng NGUOI_HO_TRO" giữ — đây là quyết định nội bộ project memory, không cần cite điều khoản pháp luật. Cite NĐ 77/2008 Điều 19 K.2 (đã verify ✅) giữ làm căn cứ phạm vi toàn quốc.
**Tham chiếu delta:** Thay đổi 5 (5.1, 5.2, 5.3) — đã áp theo phương án D.5 đề xuất.

#### 5. Rename DOT_DANH_GIA → KE_HOACH_DANH_GIA và bổ sung 2 entity còn thiếu trong danh sách
**Phân loại:** B1 (consistency cross-FR + lấp danh sách entity thiếu)
**Bối cảnh nghiệp vụ:** Báo cáo nhóm IX lấy số liệu từ nhiều mảng nghiệp vụ khác nhau (vụ việc hỗ trợ pháp lý, đào tạo bồi dưỡng, đánh giá hiệu quả, chương trình hỗ trợ pháp lý...). Phần liệt kê đối tượng dữ liệu ở §4 phải đầy đủ để cán bộ phụ trách và lập trình viên biết báo cáo dựa trên nguồn nào. v3 đang thiếu 2 đối tượng quan trọng (Kế hoạch đánh giá và Chương trình hỗ trợ pháp lý) — trong khi báo cáo về đánh giá (FR-IX-09) và 4 báo cáo về chương trình hỗ trợ pháp lý (FR-IX-20 đến FR-IX-23) đều cần dữ liệu từ 2 đối tượng này. Đồng thời nhóm Đánh giá (FR-08) trong bản v4 đã đổi tên đối tượng từ "Đợt đánh giá" sang "Kế hoạch đánh giá" (xem Thay đổi 7 trong delta-fr-08), nhóm Báo cáo phải đồng bộ theo, nếu không 2 file sẽ gọi đối tượng bằng 2 tên khác nhau.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Tổng quan đối tượng dữ liệu §4 trong v3 chỉ liệt kê 9 đối tượng, thiếu Kế hoạch đánh giá và Chương trình hỗ trợ pháp lý dù các chức năng báo cáo trong cùng file đều có nhắc tới. Ngoài ra v3 vẫn dùng tên cũ "Đợt đánh giá" trong khi nhóm FR-08 đã thống nhất sang "Kế hoạch đánh giá". v4 bổ sung 2 đối tượng còn thiếu vào bảng liệt kê và sơ đồ quan hệ, đồng thời thay tên "Đợt đánh giá" sang "Kế hoạch đánh giá" ở phần Nguồn dữ liệu §1 và phần Đầu vào của FR-IX-09 → B1.
**Vị trí đã sửa:**
- §1 Tổng quan — Nguồn dữ liệu (line 47): rename DOT_DANH_GIA → KE_HOACH_DANH_GIA
- §2 FR-IX-09 — Inputs đặc thù (line 491): `ke_hoach_danh_gia_id FK → KE_HOACH_DANH_GIA`
- §4 Tổng quan entity — bảng (line 1108-1112): bổ sung 2 dòng KE_HOACH_DANH_GIA (nhóm VI) và CHUONG_TRINH_HTPL (nhóm XI) — kèm chú thích trỏ tới srs-fr-08-danh-gia.md và srs-fr-15-ct-htpldn.md
- §4 ERD nhóm subset: thêm 2 box entity KE_HOACH_DANH_GIA (line 1174-1179) + CHUONG_TRINH_HTPL (line 1180-1185) và 2 quan hệ "BAO_CAO ..o{ ... truy vấn dữ liệu" (line 1195, 1196)

**Phụ thuộc cross-FR:** srs-fr-08-danh-gia.md (rename entity từ DOT_DANH_GIA → KE_HOACH_DANH_GIA — Pha 3 verify FR-08 cũng đã đổi tên).
**Tham chiếu delta:** Thay đổi 6 (6.1, 6.2, 6.3, 6.4)

#### 6. Đổi định dạng xuất Word (.docx) sang PDF (.pdf) theo Thông tư 17/2025
**Phân loại:** B1 (sửa mâu thuẫn nội bộ giữa cite TT 17/2025 và format không đảm bảo giữ định dạng) — kèm cảnh báo cite TT 17/2025 chưa web-verify.
**Bối cảnh nghiệp vụ:** Báo cáo nhóm IX là báo cáo nghiệp vụ phục vụ cán bộ và lãnh đạo trong nội bộ cơ quan (xem nhanh, phân tích, in để báo cáo họp giao ban) — khác với báo cáo định kỳ gửi cấp trên thuộc nhóm FR-15. Hiện đang có hai định dạng xuất khả thi: Excel (cho phép sắp xếp, lọc, mở bằng Excel để phân tích nội bộ) và Word hoặc PDF (giữ nguyên định dạng trình bày để gửi/đính kèm/lưu trữ). v3 chọn Word; v4 đổi sang PDF với lập luận "PDF giữ đúng định dạng A4, font Times New Roman 13pt theo Thông tư 17/2025". PDF có ưu điểm là không sửa được sau khi xuất, định dạng cố định không phụ thuộc phần mềm văn phòng của người mở. ⚠️ Cần Cán bộ phụ trách xác nhận Thông tư 17/2025 có thực sự yêu cầu PDF hay chấp nhận Word — đoạn trích dẫn về Mẫu 21a/21b cũng chưa được tra cứu lại (xem §H.3 và D.2).
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Tiêu chí chấp nhận của báo cáo nhóm IX trong v3 cùng trích dẫn Thông tư 17/2025 cho cả 2 định dạng Excel và Word. Word có nhược điểm là khi mở bằng phiên bản Office khác có thể bị lệch định dạng, đổi font hệ thống — mâu thuẫn với cam kết "đảm bảo đúng định dạng" mà SRS tự đưa ra. v4 đổi sang PDF để giải quyết mâu thuẫn này (PDF cố định định dạng không phụ thuộc nơi mở). v4 cũng thêm phần ghi chú tham chiếu Mẫu 21a/21b Thông tư 17/2025 ở cuối §6 làm mẫu chính thức → B1.
**Vị trí đã sửa:**
- §1 Tổng quan — Mermaid quy trình (line 34): "Xuất Excel / PDF"
- §2 TPL-REPORT-FULL — Input chung `format_xuat` (line 71): enum 'XLSX / PDF', mặc định XLSX
- §2 TPL-REPORT-FULL — Processing chung Bước 8 (line 84): "Nếu xuất PDF: tạo file .pdf giữ nguyên định dạng trình bày theo Thông tư 17/2025 (khổ A4, font Times New Roman cỡ 13)"
- §2 TPL-REPORT-FULL — Error E8 (line 116): "Định dạng xuất chỉ hỗ trợ XLSX hoặc PDF"
- §2 TPL-REPORT-FULL — Acceptance Criteria (line 122): "Given CB nhấn 'Xuất PDF' When click Then tải file .pdf theo format TT17/2025"
- §3 SCR-IX-01 — Nút Xuất (line 1047): "Xuất PDF (.pdf) → xuất theo mẫu TT17/2025"
- §3 SCR-IX-01 — Quy tắc tương tác (line 1086): "Export XLSX/PDF chèn tiêu đề BC + ..."
- §4 Entity BAO_CAO — `duong_dan_file` (line 1216): "File xuất (Excel/PDF)"
- §6 BR-DATA-06 — cột Ngoại lệ (line 1275): "Báo cáo nhóm IX có xuất PDF"

**KHÔNG đưa vào v3.5:** ghi chú GAP-IX-03 v4 nêu cụ thể số "Mẫu 21a (BC sơ bộ 6 tháng), Mẫu 21b (BC tổng kết năm)" của TT 17/2025 — chưa web-verify (memory `feedback_legal_citation_web_verify`, `feedback_no_legal_extrapolation`). Tham chiếu chung "TT 17/2025" + format A4/Times New Roman 13 đã đủ làm căn cứ format; số mẫu cụ thể chờ BA xác nhận.
**Tham chiếu delta:** Thay đổi 7 (7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9) — bỏ 7.10 (Mẫu 21a/21b chưa verify).

### Thay đổi BA chốt OUT — KHÔNG áp vào v3.5

| Thay đổi delta | Phân loại | Lý do OUT |
|---|---|---|
| Thay đổi 4 — Đồng bộ giới hạn xuất 50.000 → 10.000 dòng theo BR-DATA-06 | B1 | BA chốt 2026-05-06: không đưa vào v3.5 |
| Thay đổi 8 — Bổ sung chức năng "In báo cáo" với print preview A4 | B1 + cảnh báo TT chưa verify | BA chốt 2026-05-06: không đưa vào v3.5 |

### Phát hiện Hướng 2 (`V4-CHƯA-SỬA`) — chưa duyệt → KHÔNG áp

| Phát hiện | Mức rủi ro | Ghi chú |
|---|---|---|
| C.1 — §1 Bảng phạm vi dữ liệu vẫn ghi "BN: Dữ liệu BN + ĐP thuộc quản lý" | Cao | Sau khi áp Thay đổi 3 (Processing 2-tier + SCR Dropdown), file v3.5 tự mâu thuẫn giữa §1 (cũ) và §2/§3 (đã sửa). Đề nghị cổng duyệt sau hoặc Pha 3 reconcile. |
| C.2 — FR-IX-08 Output `so_nht` (line 461), `theo_dia_ban[]` (line 464), AC "TVV/CG/NHT + địa bàn" (line 467), SCR optgroup mapping UC131 (line 1065) "Loại TVV, Lĩnh vực CM, Địa bàn" | Cao | Sau khi áp Thay đổi 4 (Inputs/Công thức/Dimensions đã bỏ NHT + bỏ địa bàn), file v3.5 tự mâu thuẫn — Inputs không cho lọc địa bàn nhưng Output trả về theo_dia_ban[]; AC vẫn test theo "TVV/CG/NHT + địa bàn"; SCR optgroup vẫn nhắc "Địa bàn". Đề nghị cổng duyệt sau hoặc Pha 3 reconcile. |

### Inconsistency có chủ đích do Thay đổi 4 OUT

- §2 TPL-REPORT-FULL Processing Bước 9 (line 85): "Giới hạn tối đa **50.000** dòng xuất"
- §2 TPL-REPORT-FULL Error E4 (line 112): "Export vượt **50.000** rows"
- §3 SCR-IX-01 Quy tắc tương tác (line 1088): "Max **50.000** rows xuất"
- §6 BR-DATA-06 (line 1233, 1258): "không vượt quá **10,000** rows/file"

→ File v3.5 vẫn giữ inconsistency từ v3 (50.000 ở Processing/Error/SCR vs 10,000 ở BR-DATA-06). BA đã chốt OUT cho Thay đổi 4. Pha 3 hoặc lượt review sau xử lý nếu cần.

### Phụ thuộc cross-FR cần Pha 3 reconcile

1. **srs-v3.md mục lục danh sách FR group** (Thay đổi 2): "BC Hỏi đáp" → "Báo cáo hỏi đáp pháp luật" — đồng bộ với CR-09.
2. **srs-fr-08-danh-gia.md** (Thay đổi 5): xác nhận FR-08 đã rename entity DOT_DANH_GIA → KE_HOACH_DANH_GIA; nếu chưa, FR-08 cũng cần áp.
3. **srs-fr-15-ct-htpldn.md** (Thay đổi 5): xác nhận entity CHUONG_TRINH_HTPL có thực ở FR-15 để FR-11 ref được.
4. **TT 17/2025** (Thay đổi 6): cần BA web-verify (a) bộ ngành ban hành + hiệu lực, (b) format quy định Excel+Word hay Excel+PDF, (c) Mẫu 21a/21b có thực không. Nếu không xác minh được, có thể cần diễn đạt lại "PDF chuẩn lưu trữ" thay vì gắn cứng cite TT 17/2025.
5. **C.1 và C.2 inconsistency** (xem 2 mục trên): nên xử lý ở cổng duyệt riêng hoặc Pha 3 reconcile, không tự apply ở Bước 2c.

---

## srs-fr-16-api.md — API Kết nối Chia sẻ Dữ liệu

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-16.md`
**Cách tiếp cận:** Seed từ `srs-v3/srs-fr-16-api.md` (1.175 dòng) → cherry-pick 8 thay đổi từ `srs-v4/srs-fr-16-api.md` (BA quyết định OUT Thay đổi 9 = block bookkeeping/Lịch sử thay đổi/GAP-XII-01,03/ghi chú "2 luồng API"). File v3.5 cuối cùng = 1.219 dòng.

**Số thay đổi đã apply:** 8 thay đổi cherry-pick + 1 quyết định OUT (Thay đổi 9) + 2 phát hiện V4-CHƯA-SỬA hoãn xử lý (Thay đổi 10, 11)

### Danh sách thay đổi nghiệp vụ

#### 1. Áp filter `cong_khai = 1` cho 4 cặp API có Common Public Fields (HỎI ĐÁP / VỤ VIỆC / BIỂU MẪU / TVCS)
**Phân loại:** A-ITEM-01
**Bối cảnh nghiệp vụ:** Cổng Pháp luật Quốc gia gọi API của hệ thống để lấy 4 nhóm dữ liệu công khai: Hỏi đáp, Vụ việc, Biểu mẫu, Tư vấn pháp luật chuyên sâu. Theo nghiệp vụ, Cổng chỉ được nhận những bản ghi mà cán bộ phê duyệt đã quyết định công khai chính thức; bản ghi nội bộ tuy đã hoàn thành / đã duyệt nhưng đơn vị chưa muốn công khai thì không được lộ ra ngoài. v3 hiện chỉ kiểm tra trạng thái nghiệp vụ (đã duyệt / đã hoàn thành / đã công bố) trước khi trả qua API — không có thêm điều kiện kiểm cờ "đã công khai". Hệ quả là bản ghi tuy đã được duyệt xong nhưng đơn vị chưa bấm công khai vẫn bị API chia sẻ ra ngoài, khiến cán bộ phê duyệt mất quyền chủ động chọn thời điểm công khai từng bản ghi.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 01 phần D.2 (báo cáo phân tích CR) ghi nguyên văn: "Entity có quy trình: chỉ bản ghi ở trạng thái cuối (Hoàn thành/Đã duyệt/Đã phản hồi) mới được set công khai. Bản ghi bị Từ chối/Hủy: KHÔNG được công khai". Phần D.3 báo cáo liệt kê 12 nhóm dữ liệu cần áp bộ thuộc tính công khai chuẩn — trong đó Hỏi đáp, Vụ việc, Biểu mẫu, Tư vấn pháp luật chuyên sâu đều có API chia sẻ ở FR-16. Phần Tác động chéo của báo cáo nêu rõ "Nhóm API chia sẻ dữ liệu cần lọc thêm điều kiện đã công khai theo từng loại"; v4 áp đúng tinh thần — không tạo API mới, chỉ thêm điều kiện lọc vào API sẵn có → A-ITEM-01.
**Vị trí đã sửa:**
- §2a Preconditions chung TPL-API-FULL: thêm dòng `[CR-01]` Common Public Fields → BR-PUBLIC-01 + BR-PUBLIC-04 (line 111)
- §2 FR-XII-01 Processing bước 4: HỎI ĐÁP `AND cong_khai = 1` (line 179)
- §2 FR-XII-07 Processing bước 3: VỤ VIỆC `AND cong_khai = 1` + BR-PUBLIC-04 whitelist (line 473)
- §2 FR-XII-13 Processing: TVCS chia sẻ `AND cong_khai = 1` (line 695)
- §2 FR-XII-14 Processing: TVCS tìm kiếm chỉ bản ghi `cong_khai = 1` (line 736)
- §4 Entity BIEU_MAU attribute: rename `la_cong_khai` → `cong_khai` + filter `cong_khai = 1` (line 1080)
- §4 ERD subset BIEU_MAU node: `boolean cong_khai`
**Tham chiếu delta:** Thay đổi 1 (1.1 → 1.7)

#### 2. Áp BR-PUBLIC-04 (whitelist/blacklist) cho VỤ VIỆC outbound — bổ sung "tên DN" vào blacklist
**Phân loại:** A-ITEM-01 + B1
**Bối cảnh nghiệp vụ:** Vụ việc trợ giúp pháp lý chứa thông tin doanh nghiệp nhạy cảm; theo Luật bảo vệ dữ liệu cá nhân và tinh thần "chỉ chia sẻ thông tin tổng hợp" cho hệ thống bên ngoài, dữ liệu vụ việc khi chia sẻ qua API phải được che các trường có thể truy ngược ra doanh nghiệp cụ thể. v3 đã che mã số thuế và địa chỉ chi tiết nhưng vẫn để lộ tên doanh nghiệp — Cổng Pháp luật Quốc gia khi nhận dữ liệu vẫn biết được vụ việc là của doanh nghiệp nào, làm hỏng tinh thần chia sẻ tổng hợp đã đặt ra ban đầu. Đối tác TT CNTT đã yêu cầu chuẩn hoá quy tắc che thông tin nhạy cảm (whitelist trường được trả + blacklist trường bị che) thành quy tắc chính thức trong tài liệu, áp riêng cho từng nhóm dữ liệu nhạy.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Yêu cầu thay đổi của đối tác TT CNTT (A-ITEM-01):** Mục 01 phần D.1 báo cáo phân tích CR mô tả cơ chế bộ thuộc tính công khai chuẩn cộng với quy tắc che trường nhạy cảm. v4 áp quy tắc whitelist/blacklist chính thức vào API chia sẻ Vụ việc — tương ứng dòng 2.1 và 2.2 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** v3 chỉ liệt kê "mã số thuế, địa chỉ chi tiết" trong danh sách trường bị che — bỏ sót tên doanh nghiệp. Mã số thuế bị che mà tên doanh nghiệp vẫn lộ là mâu thuẫn nội bộ về logic bảo mật. v4 bổ sung tên doanh nghiệp vào danh sách trường bị che để đảm bảo dữ liệu chia sẻ là thông tin tổng hợp thực sự — tương ứng dòng 2.1 trong bảng vị trí.
**Vị trí đã sửa:**
- §2 FR-XII-07 Processing bước 3: thêm "Chỉ trả fields whitelist theo BR-PUBLIC-04" + BR `BR-PUBLIC-01, BR-PUBLIC-04 [CR-01]` (line 473)
- §2 FR-XII-07 Processing bước 4: blacklist mở rộng (MST, địa chỉ, **tên DN**) + BR `BR-SEC-01, BR-PUBLIC-04 [CR-01]` (line 474)
**Tham chiếu delta:** Thay đổi 2 (2.1, 2.2)

#### 3. Đổi tên field công khai chuẩn hóa — `la_cong_khai` → `cong_khai`, `ngay_cong_khai` → `thoi_gian_dang_tai`
**Phân loại:** A-ITEM-01
**Bối cảnh nghiệp vụ:** Đối tác TT CNTT yêu cầu chuẩn hoá bộ thuộc tính công khai chung — gồm cờ "Đã công khai" và "Thời gian đăng tải" — áp đồng bộ cho 12 nhóm dữ liệu công khai trong toàn dự án. Tên 2 trường này phải dùng cùng một quy ước ở mọi nhóm chức năng để Cổng Pháp luật Quốc gia gọi API và đọc dữ liệu nhất quán. Trong FR-16 có 2 nhóm dữ liệu chia sẻ qua API là Biểu mẫu và Hỏi đáp — đang đặt tên 2 trường này theo quy ước cũ riêng của từng nhóm, lệch với quy ước chung mà các FR khác đã chuẩn hoá.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 01 phần D.2 báo cáo phân tích CR ghi rõ tên chuẩn cho 2 trường công khai chung; phần D.1 báo cáo liệt kê Biểu mẫu và Hỏi đáp nằm trong 12 nhóm dữ liệu cần chuẩn hoá. v4 đổi tên 2 trường ở FR-16 cho khớp với quy ước chung → A-ITEM-01.
**Vị trí đã sửa:**
- §2 FR-XII-11 Outputs row 7: `thoi_gian_dang_tai \| date \| ISO 8601 [CR-01]` (line 634)
- §4 Entity BIEU_MAU + ERD: đã rename trong Thay đổi 1 (line 1080, ERD)
**Tham chiếu delta:** Thay đổi 3 (3.1 → 3.3)

#### 4. Thêm parameter `don_vi_id` vào API chia sẻ HỎI ĐÁP và TVCS
**Phân loại:** A-ITEM-06
**Bối cảnh nghiệp vụ:** Đối tác TT CNTT đã yêu cầu cho phép doanh nghiệp tự chọn cơ quan tiếp nhận khi gửi hỏi đáp pháp luật và yêu cầu tư vấn pháp luật chuyên sâu. Sau khi áp yêu cầu này, mỗi bản ghi hỏi đáp và bản ghi tư vấn chuyên sâu có thêm thông tin "cơ quan tiếp nhận". Cổng Pháp luật Quốc gia khi tra cứu hoặc hiển thị dữ liệu theo từng cơ quan cụ thể cần API trả về danh sách lọc theo cơ quan đó — nếu API không cho lọc thì Cổng phải kéo toàn bộ dữ liệu cả nước rồi tự lọc, lãng phí băng thông và phân quyền lỏng.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — mục 06 phần Tác động chéo của báo cáo phân tích CR ghi: "Nhóm API chia sẻ dữ liệu cho hỏi đáp và tư vấn chuyên sâu cần bổ sung tham số chọn cơ quan tiếp nhận (không bắt buộc, mặc định Sở Tư pháp)". v4 áp đúng cho cả 3 API liên quan: API chia sẻ Hỏi đáp, API chia sẻ Tư vấn chuyên sâu, và API tìm kiếm Tư vấn chuyên sâu → A-ITEM-06.
**Vị trí đã sửa:**
- §2 FR-XII-01 Inputs row 7 mới: `don_vi_id \| number \| FK → DON_VI \| [CR-06]` (line 170)
- §2 FR-XII-01 Processing bước 5: bộ lọc thêm `don_vi_id [CR-06]` (line 180)
- §2 FR-XII-13 Inputs: thêm `+ don_vi_id (number, N, FK→DON_VI [CR-06])` (line 693)
- §2 FR-XII-13 Processing: bộ lọc thêm `don_vi_id [CR-06]` (line 695)
- §2 FR-XII-14 Inputs: thêm `+ don_vi_id (number, N, FK→DON_VI [CR-06])` (line 734)
**Tham chiếu delta:** Thay đổi 4 (4.1 → 4.5)

#### 5. Viết lại FR-XII-17/18 đúng entity HỒ SƠ PHÁP LÝ DN — sửa số UC189/190 → UC187/188 và đổi entity DOANH_NGHIEP → HO_SO_PHAP_LY_DN
**Phân loại:** B2c + B2d
**Bối cảnh nghiệp vụ:** Cổng Pháp luật Quốc gia gọi 2 API để lấy thông tin về hồ sơ pháp lý của doanh nghiệp — hồ sơ ở đây là các tài liệu pháp lý gắn với một doanh nghiệp như giấy phép, hợp đồng, giấy chứng nhận, quyết định. Theo file Danh sách UC + Transaction (CSV) ở mục XII, 2 API này mang số use case 187 (chia sẻ hồ sơ) và 188 (tìm kiếm hồ sơ); đối tượng nghiệp vụ rõ ràng là Hồ sơ pháp lý, không phải bản thân doanh nghiệp. v3 hiện đặt sai cả số use case (đang dùng 189/190 không có trong CSV) lẫn nội dung trả về (đang trả thông tin của doanh nghiệp như tên, mã số thuế, loại hình, quy mô — tức là API chia sẻ doanh nghiệp, không phải chia sẻ hồ sơ pháp lý). Hệ thống bên ngoài đọc API này sẽ nhận sai loại dữ liệu hoàn toàn.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Sửa vai trò sai so với file Danh sách UC + Transaction (CSV) (B2c):** File CSV ở mục XII ghi rõ "API chia sẻ hồ sơ pháp lý doanh nghiệp" với số 187 và "API tìm kiếm hồ sơ pháp lý doanh nghiệp" với số 188; v3 đang dùng 189/190 không có trong CSV. v4 đổi về 187/188 — tương ứng dòng 5.1, 5.2, 5.3, 5.5 trong bảng vị trí.

**Phần 2 — Sửa luồng/dữ liệu sai so với file Danh sách UC + Transaction (CSV) (B2d):** Mô tả ngắn của use case 187 trong CSV ghi rõ: "Cung cấp API để chia sẻ thông tin các hồ sơ pháp lý doanh nghiệp" — đối tượng là Hồ sơ pháp lý của doanh nghiệp, không phải doanh nghiệp. v3 trả về thông tin doanh nghiệp (tên, mã số thuế, loại hình, quy mô, tỉnh/thành) — sai đối tượng. v4 viết lại API trả về đúng thông tin Hồ sơ: mã hồ sơ, tên hồ sơ, loại hồ sơ (giấy phép / hợp đồng / giấy chứng nhận / quyết định / khác), liên kết tới doanh nghiệp sở hữu hồ sơ, ngày cấp, ngày hết hạn, cơ quan cấp, tình trạng — tương ứng dòng 5.4, 5.6, 5.7, 5.8, 5.9, 5.10 trong bảng vị trí → B2d.
**Vị trí đã sửa:**
- Header: `UC range: UC 171 – UC 188` (line 6)
- §1 Bảng 9 cặp API row 9: UC187/UC188 + tooltip entity HO_SO_PHAP_LY_DN (line 43)
- §2 FR-XII-17 (line 823-886): viết lại heading (UC187), Mô tả, Inputs (8 fields filter HSPL), Processing (filter `trang_thai = HIEU_LUC`), Outputs (10 fields HSPL metadata: ma_ho_so, ten_ho_so, loai_ho_so, linh_vuc_id, doanh_nghiep_id, ngay_cap, ngay_het_han, co_quan_cap, trang_thai), Lưu ý B2G + KHÔNG trả mo_ta/file đính kèm, Acceptance 4 dòng cụ thể
- §2 FR-XII-18 (line 888-940): viết lại heading (UC188), Mô tả tìm kiếm trên ten_ho_so + co_quan_cap, Inputs (6 fields), Processing áp filter `trang_thai = HIEU_LUC`, Acceptance 3 dòng cụ thể
- §4 Tổng quan entity row 10: `HO_SO_PHAP_LY_DN \| referenced \| Hồ sơ pháp lý DN — tài liệu (giấy phép, hợp đồng, giấy chứng nhận, quyết định)` (line 960)
- §4 ERD subset: node `HO_SO_PHAP_LY_DN {ma_ho_so, ten_ho_so, loai_ho_so, doanh_nghiep_id FK, trang_thai}` + relationship mới `}o--o\| DANH_MUC : "linh_vuc_id"`
- §4 Entity HO_SO_PHAP_LY_DN definition (line 1103-1117): 9 attributes — ma_ho_so (UNIQUE), ten_ho_so, loai_ho_so (CHECK enum 5), doanh_nghiep_id (FK DN), linh_vuc_id (FK DM), ngay_cap, ngay_het_han, co_quan_cap, trang_thai (CHECK enum HIEU_LUC/HET_HAN/THU_HOI, default HIEU_LUC)
**Tham chiếu delta:** Thay đổi 5 (5.1 → 5.10)

#### 6. Đồng bộ rename entity NOI_DUNG_TU_VAN_CS → TU_VAN_CHUYEN_SAU
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Nhóm dữ liệu Tư vấn pháp luật chuyên sâu được nhóm chức năng FR-12 quản lý chính (chủ sở hữu định nghĩa). FR-12 đã đổi tên nhóm dữ liệu này theo quy ước mới — khớp với tên nhóm chức năng "Tư vấn chuyên sâu" trong file Danh sách UC + Transaction (CSV). FR-16 chỉ tham chiếu nhóm dữ liệu này để trả qua API, không sở hữu định nghĩa, nhưng vẫn còn dùng tên cũ — lệch với chủ sở hữu, gây mâu thuẫn nội bộ giữa 2 file SRS cùng nói về một nhóm dữ liệu.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — FR-12 (chủ sở hữu định nghĩa nhóm dữ liệu Tư vấn chuyên sâu) đã đổi tên theo quy ước mới; FR-16 chỉ tham chiếu nên phải đồng bộ theo. v4 đổi tên ở mọi vị trí FR-16 nhắc đến nhóm dữ liệu này → B1.
**Vị trí đã sửa:**
- §2 FR-XII-13 Preconditions: `entity TU_VAN_CHUYEN_SAU` (line 689)
- §2 FR-XII-13 Cross-ref: `Entity TU_VAN_CHUYEN_SAU` (line 712)
- §2 FR-XII-14 Cross-ref: `Entity TU_VAN_CHUYEN_SAU` (line 743)
- §4 Tổng quan entity row 8: `TU_VAN_CHUYEN_SAU \| referenced \| Nội dung tư vấn chuyên sâu (FR-XII-13/14)` (line 958)
- §4 ERD subset node + relationship: rename `TU_VAN_CHUYEN_SAU`
- §4 Entity definition heading: `### TU_VAN_CHUYEN_SAU (referenced — FR-XII-13/14)` (line 1083)
**Tham chiếu delta:** Thay đổi 6 (6.1 → 6.6)

#### 7. Sửa entity reference DOT_DANH_GIA → KE_HOACH_DANH_GIA cho FR-XII-09/10
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Nhóm dữ liệu Kế hoạch đánh giá hiệu quả thuộc về nhóm chức năng FR-08 (Đánh giá) — chủ sở hữu định nghĩa đã chốt tên là "Kế hoạch đánh giá". Trong cùng file FR-16, phần Tổng quan dữ liệu đã ghi đúng tên "Kế hoạch đánh giá", nhưng phần chi tiết của 2 API liên quan (FR-XII-09 và FR-XII-10) lại còn dùng tên cũ "Đợt đánh giá" — mâu thuẫn nội bộ trong cùng một file giữa phần tổng quan và phần chi tiết.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — cùng một file FR-16 v3 đặt 2 tên khác nhau cho cùng một nhóm dữ liệu ở phần Tổng quan và phần FR chi tiết. v4 chuẩn hoá cả 2 chỗ về cùng tên với chủ sở hữu là FR-08 → B1.
**Vị trí đã sửa:**
- §2 FR-XII-09 Preconditions: `entity KE_HOACH_DANH_GIA ... [GAP-XII-02]` (line 545)
- §2 FR-XII-09 Cross-ref: `Entity KE_HOACH_DANH_GIA, KET_QUA_DANH_GIA [GAP-XII-02]` (line 569)
- §2 FR-XII-10 Cross-ref: `Entity KE_HOACH_DANH_GIA [GAP-XII-02]` (line 600)
**Tham chiếu delta:** Thay đổi 7 (7.1 → 7.3)

#### 8. Dọn entity TU_VAN_VIEN — bỏ NHT khỏi enum loai_tvv, sửa status DANG_HOAT_DONG → HOAT_DONG, ghi rõ NHT lưu entity NGUOI_HO_TRO
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** API chia sẻ thông tin tư vấn viên cho Cổng Pháp luật Quốc gia chỉ trả về tư vấn viên cá nhân và chuyên gia — đây là 2 nhóm hành nghề tư vấn ngoài hệ thống đã được công khai. Người hỗ trợ là cán bộ nội bộ phụ trách quản lý mạng lưới, không phải người hành nghề tư vấn — không nằm trong phạm vi công khai và đã được BA chốt tách thành nhóm dữ liệu riêng (xem nhóm chức năng FR-04 Thay đổi 8). FR-16 vẫn còn liệt kê người hỗ trợ chung trong nhóm tư vấn viên + còn dùng cách viết cũ cho trạng thái "Đang hoạt động" — lệch quyết định đã chốt và lệch cách viết đã chuẩn hoá ở FR-04.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — gồm 2 ý: (1) bỏ người hỗ trợ ra khỏi danh sách phân loại tư vấn viên vì người hỗ trợ đã tách thành nhóm dữ liệu riêng theo FR-04 Thay đổi 8 đã chốt; (2) đổi cách viết trạng thái "Đang hoạt động" cho khớp với chuẩn hoá ở FR-04 Thay đổi 12. v4 áp đúng cả 2 điểm để FR-16 đồng bộ với FR-04 → B1.

⚠️ **Cảnh báo cite:** v4 cite "NĐ 55/2019 Đ.7" cho NHT — nhưng theo `legal-citations-verification.md` mục L3 (line 15 file đó): `❌ WRONG. Điều 7 NĐ 55/2019 nói về dữ liệu bản án/quyết định/phán quyết, KHÔNG có nội dung cán bộ HTPL`. Cite này sai và đã được verify trước đây — xem mục D.1 cảnh báo bên dưới.
**Vị trí đã sửa:**
- §4 Tổng quan entity row 3: cập nhật mô tả thành `TVV/CG — cá nhân hành nghề tư vấn (FR-XII-05/06). NHT là cán bộ HTPL DN, lưu ở entity riêng NGUOI_HO_TRO, không xuất qua API nhóm này.` (line 953) — đồng bộ với Mô tả entity bên dưới (line 1052). **Hot-fix 2026-05-06 sau deep review:** delta report Thay đổi 8 không liệt kê line này, BA quyết bổ sung để khử inconsistency v4 còn để trong overview row. Đã áp đồng thời vào `srs-v4/srs-fr-16-api.md` line 983.
- §4 Entity TU_VAN_VIEN Mô tả: nói rõ chỉ TVV/CG; NHT lưu entity riêng NGUOI_HO_TRO, không xuất qua API (line 1052)
- §4 Entity TU_VAN_VIEN attribute `loai_tvv`: `CHECK IN ('TVV','CG')` + mô tả TVV (NĐ 77/2008 Đ.19) / CG (line 1058)
- §4 Entity TU_VAN_VIEN attribute `trang_thai`: `API filter: HOAT_DONG only` (line 1059)
**Tham chiếu delta:** Thay đổi 8 (8.1 → 8.3) + hot-fix overview row 3 (ngoài delta — BA quyết 2026-05-06)

### Quyết định KHÔNG cherry-pick từ v4 (Thay đổi 9)

- **Thay đổi 9** (Bookkeeping — Lịch sử thay đổi + GAP-XII-01/03 + ghi chú "2 luồng API song song"): BA quyết bỏ 2026-05-06. v3.5 KHÔNG có bảng "Lịch sử thay đổi" ở đầu file, KHÔNG có note `[GAP-XII-03] OpenAPI Specification` ở §1, KHÔNG có ghi chú `[GAP-XII-01]` ở §2, KHÔNG có block "2 hướng luồng API song song" ở §2a Preconditions. §1 và §2a giữ nguyên text v3 (đã apply Thay đổi 1.1 thêm dòng `[CR-01]` vào Preconditions, không thêm gì khác). Hệ quả: vấn đề terminology "INBOUND/OUTBOUND" tự động không phát sinh trong v3.5.

### Phát hiện V4-CHƯA-SỬA hoãn xử lý (cần lượt review tiếp theo)

- **Thay đổi 10** (Cặp API chia sẻ + tìm kiếm TO_CHUC_TU_VAN — Yêu cầu mục 02 yêu cầu): KHÔNG apply ở v3.5 vì v4 chưa có pattern. Cần CĐT cấp 2 số UC mới cho cặp này (UC189/190 đã free sau Thay đổi 5). FR-XII-XX hiện vẫn chỉ có 18 FR (9 cặp), không có TO_CHUC_TU_VAN.
- **Thay đổi 11** (4 fields BTP `chuc_vu`, `noi_cong_tac`, `so_qd_cong_bo`, `ngay_qd_cong_bo` + đổi `kinh_nghiem` → `so_nam_kinh_nghiem` trong outputs FR-XII-05 — Yêu cầu mục 03 yêu cầu): KHÔNG apply ở v3.5 vì v4 chưa có pattern. Outputs FR-XII-05 (line 388-396) vẫn 7 fields cũ (id, ho_ten, loai, linh_vuc, dia_ban, to_chuc_hanh_nghe, trang_thai). Phụ thuộc FR-04 v3.5 đã thêm 5 trường này vào entity TU_VAN_VIEN — khi review tiếp theo có thể đồng bộ outputs FR-XII-05.

### Cảnh báo & phụ thuộc cross-FR (Pha 3 reconcile)

1. **Cite NĐ 55/2019 Điều 7** (Thay đổi 8 — entity TU_VAN_VIEN Mô tả line 1052): đã verify ❌ WRONG ở `legal-citations-verification.md` mục L3 ("Điều 7 nói về dữ liệu bản án/quyết định/phán quyết, KHÔNG có nội dung cán bộ HTPL"). Áp nguyên xi v4 theo quyết định BA "sửa theo v4 đã thống nhất". Pha 3 hoặc lượt review tiếp theo cần thay cite hoặc bỏ cụm `theo NĐ 55/2019 Đ.7`.
2. **Marker `[GAP-XII-02]`** (Thay đổi 7): còn để 3 vị trí (line 545, 569, 600) sau khi đã đồng bộ entity name. Pha 3 có thể xóa marker hoặc convert thành ghi chú "Đã đồng bộ tên entity với §4 overview".
3. **Phụ thuộc FR-02** (HOI_DAP owner): Thay đổi 4 thêm `don_vi_id` vào API chia sẻ HỎI ĐÁP. Cần FR-02 v3.5 đã expose `don_vi_id` cho DN chọn (Yêu cầu mục 06 D.1) — nếu chưa thì filter API rỗng.
4. **Phụ thuộc FR-12** (TU_VAN_CHUYEN_SAU owner): Thay đổi 6 rename entity reference. FR-12 v3.5 phải đã rename entity từ NOI_DUNG_TU_VAN_CS → TU_VAN_CHUYEN_SAU (theo CSV §X.1). Pha 3 verify.
5. **Phụ thuộc FR-04** (TU_VAN_VIEN owner): Thay đổi 8 đồng bộ enum loai_tvv ('TVV','CG') + status HOAT_DONG. FR-04 v3.5 đã apply theo memory `project_tu_van_vien_entity_covers_nht` — đã apply qua Bước 2c (CHANGELOG section srs-fr-04 Thay đổi 5/12). Đồng bộ.
6. **Phụ thuộc FR-08** (KE_HOACH_DANH_GIA + KET_QUA_DANH_GIA owner): Thay đổi 7 sửa tên entity reference. FR-08 v3.5 phải đảm bảo entity gốc cũng dùng tên `KE_HOACH_DANH_GIA` (không phải DOT_DANH_GIA cũ). Pha 3 verify.
7. **Phụ thuộc FR-09 hoặc srs-v3.md §3.4.3.55** (HO_SO_PHAP_LY_DN owner): Thay đổi 5 reference entity HO_SO_PHAP_LY_DN với 9 attributes. F-11 lượt 6 (2026-05-02) đã thiết kế entity này. FR-16 chỉ reference. Pha 3 verify entity owner thực sự ở đâu (FR-09 hay srs-v3.md gốc).
8. **Phụ thuộc FR-09** (BIEU_MAU owner): Thay đổi 1.6 rename `la_cong_khai` → `cong_khai`. FR-09 v3.5 phải đồng bộ rename trong entity gốc. Pha 3 verify.
9. **Outputs FR-XII-05 thiếu 4 fields BTP** (Thay đổi 11 hoãn): khi đồng bộ outputs với FR-04 entity TU_VAN_VIEN sau lượt review tiếp theo, dev cần biết outputs API có thể thay đổi.
10. **Cặp API TO_CHUC_TU_VAN chưa có** (Thay đổi 10 hoãn): khi BA chấp nhận thêm cặp API này ở lượt review tiếp theo, sẽ thành FR-XII-19/20 với UC189/190 (đã free sau Thay đổi 5).


#### Drift fix sau deep review (rev. 2 — 2026-05-06)

**Lý do:** Deep review v3.5/srs-fr-05 phát hiện 10 gap UI giữa nội dung file và delta — chủ yếu do TĐ 19 (Mục 3.A-G + sửa SCR-V.I-01/03) chưa apply đầy đủ + một số sub-vị trí của TĐ 8 không được sửa khi áp refactor entity model. Backend (entity, FR Inputs/Processing/Errors, BR, SM) đã apply đầy đủ và pass — gap chỉ ở tầng UI/UX.

**Vị trí đã fix:**
- (G1) SCR-V.I-03 bảng nút thao tác — dòng `DA_PHAN_CONG | [Phân công NHT]`: đổi sang 2 thẻ Cá nhân/Tổ chức + load TVV thuộc tổ chức + CC email tổ chức nếu loai='TO_CHUC'
- (G2 + G4) SCR-V.I-03 Accordion 5 — Phân công xử lý: thêm "Khi loai='TO_CHUC' → hiển thị tên tổ chức"; đổi label "địa bàn" → "đơn vị quản lý" (Sở TP/Bộ ngành công nhận theo NĐ 77/2008 Đ.19)
- (G3) SCR-V.I-01 cột 17 — đổi nhãn "NHT/TVV" → "Người xử lý / Tổ chức"; nội dung hiển thị "Họ tên cá nhân được phân công (TVV/CG/NHT), hoặc tên tổ chức tư vấn (khi loai_doi_tuong_xu_ly='TO_CHUC'), hoặc '—' nếu chưa phân công"
- (G5) FR-V.I-02 — Mô tả + Màn hình: thêm "qua PM (auth Tier 2 VNeID)" + sửa "form DN gửi HS qua chuyên trang"
- (G6) Mục 3 — thêm trước SCR-V.I-01: 7 sub-section quy ước UI (3.A Cách đọc bảng Thành phần; 3.B Ánh xạ mã DB→nhãn UI cho 6 nhóm enum; 3.C Cắt nội dung dài; 3.D Trạng thái dữ liệu chung — 6 trạng thái; 3.E Thông báo người dùng chung — 9 tình huống; 3.F Thiết kế responsive; 3.G Quy ước viết description SCR)
- (G7) SCR-V.I-03 Stepper (thành phần số 3): thêm "2 trạng thái phụ hiển thị badge cạnh thanh tiến trình: 'Yêu cầu bổ sung' (badge cam, kèm 'Lần bổ sung: {n}/3') + 'Từ chối' (badge đỏ)"
- (G8) SCR-V.I-03 — thêm "Quy ước hiển thị nút thao tác" sau bảng nút: không thuộc role → ẩn; role đúng nhưng state/scope sai → mờ + tooltip
- (G9) SCR-V.I-03 — thêm sub-section "Thông báo riêng SCR-V.I-03" gồm 11 message (confirm YCBS, toast phân công, CB PD từ chối phê duyệt → DANG_XU_LY, công khai API fail, race condition, mở lại HS thiếu lý do…)
- (G10) Đã update Lịch sử thay đổi trong file SRS v3.5 (dòng rev. 2)

**LOC sau fix:** ~2.500 dòng (so v3 1.891 = +~600 dòng; so trước fix 2.364 = +~140 dòng cho Mục 3.A-G + Thông báo riêng SCR-V.I-03)

---

## srs-fr-06 — Chi trả Chi phí Tư vấn (V.II)

**Ngày apply:** 2026-05-06
**Delta report nguồn:** v3.5-delta-fr-06.md
**Số thay đổi đã apply:** A=0 / B1=9 (Thay đổi 1, 2, 3, 4, 6, 7-cascading, 9, 10, 11)
**Số thay đổi BA quyết OUT:** 4 (Thay đổi 5, 8, 12, 13)
**File output:** `srs-v3.5/srs-fr-06-chi-tra.md` (1.414 dòng — V3 baseline 1.244 + 170 dòng patch)

### Danh sách thay đổi nghiệp vụ

#### 1. Đồng bộ enum 10 trạng thái SM-CHITRA + sửa các vị trí dùng tên trạng thái không có trong CHECK constraint
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ Nghiệp vụ và Cán bộ Phê duyệt theo dõi vòng đời hồ sơ chi trả qua nhãn trạng thái hiển thị trên màn hình. Theo nhóm FR-06, mỗi hồ sơ phải đi qua các bước "Chờ tiếp nhận → Đang kiểm tra → Yêu cầu bổ sung → Đang đánh giá → Đang thẩm định → Chờ phê duyệt → Đã duyệt → Đã thanh toán" hoặc rẽ nhánh sang "Từ chối / Hủy". V3 hiện tại dùng nhiều tên trạng thái khác nhau cho cùng một bước ở các phần Tổng quan, FR-Processing, bảng chuyển trạng thái, màn hình và quy tắc dữ liệu — ví dụ "Chờ tiếp nhận" có chỗ ghi là "Mới", "Đang thẩm định" có chỗ ghi là "Chờ thẩm định". Hệ quả: dev đọc V3 không biết hai tên có phải cùng một bước hay không; hồ sơ có thể bị khoá ở trạng thái mà bảng quy tắc dữ liệu không cho phép, cán bộ không bấm tiếp được.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §1 Tổng quan SM (line 56-65) viết `[MOI] → tiếp nhận → [DA_TIEP_NHAN]`; nhưng V3 §4 Entity HO_SO_CHI_TRA quy tắc giá trị hợp lệ (line 1044) chỉ chấp nhận `('CHO_TIEP_NHAN','DANG_KIEM_TRA',...)` — không có `MOI`, không có `DA_TIEP_NHAN`. V3 §2 FR-V.II-01 Bước 6 ghi "trạng thái = MOI" còn Đầu ra ghi "trạng thái = DA_TIEP_NHAN" — lệch khỏi danh sách hợp lệ. V3 §2 FR-V.II-09 Processing ghi "DA_THAM_DINH" và "TU_CHOI_THAM_DINH"; FR-V.II-13 ghi "TU_CHOI_THANH_TOAN" — không có trạng thái nào trong danh sách hợp lệ. Đây là lỗi nội bộ phát sinh từ việc tài liệu lưu nhiều phiên bản tên trạng thái song song. V4 thống nhất 10 trạng thái đúng danh sách hợp lệ: Chờ tiếp nhận, Đang kiểm tra, Yêu cầu bổ sung, Đang đánh giá, Đang thẩm định, Chờ phê duyệt, Đã duyệt, Đã thanh toán, Từ chối, Hủy → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-06-chi-tra.md:**
- §1 Tổng quan SM (line 56-69): khối 10 trạng thái CHO_TIEP_NHAN/DANG_KIEM_TRA/DANG_DANH_GIA/DANG_THAM_DINH/CHO_PHE_DUYET/DA_DUYET/DA_THANH_TOAN/TU_CHOI/YEU_CAU_BO_SUNG/HUY (bỏ MOI/DA_TIEP_NHAN/CHO_THAM_DINH/DA_THAM_DINH/TU_CHOI_THAM_DINH/TU_CHOI_THANH_TOAN)
- §2 FR-V.II-01 Bước 6 + Outputs trang_thai + Postcondition (line 103, 114, 118): "CHO_TIEP_NHAN"
- §2 FR-V.II-03 PRE-02 + Bước 2 + ERR-CT-KT-01 (line 220, 236, 262): "DANG_KIEM_TRA"
- §2 FR-V.II-05 Bước 8 + Postcondition (line 362, 400): "DANG_THAM_DINH"
- §2 FR-V.II-06 Processing (line 447): "DANG_THAM_DINH trở đi"
- §2 FR-V.II-09 PRE-02 + Bước 2 + Bước 4-6 + ERR-CT-TD-01 (line 563, 579, 581-583, 605): "DANG_THAM_DINH"; KHONG_DAT → TU_CHOI với prefix "THAM_DINH:"
- §2 FR-V.II-11 PRE-02 + Bước 2 (line 672, 679): "DANG_THAM_DINH AND ket_qua_tham_dinh = DAT"
- §2 FR-V.II-13 Inputs + Outputs + Postcondition (line 781, 803, 809): "DA_THANH_TOAN / TU_CHOI (ly_do = 'THANH_TOAN')"
- §3 SCR-V.II-02 bảng Chuyển trạng thái (line 1004-1017): 13 row với cột mã + nhãn Việt; thêm row "DANG_THAM_DINH → TU_CHOI: Thẩm định Không đạt" + "DA_DUYET → TU_CHOI: CB NV từ chối thanh toán"
- §5 SM-CHITRA Mermaid (line 1278-1294): 10 trạng thái + 14 transition đồng bộ enum
- §5 SM-CHITRA Bảng chuyển trạng thái (line 1320-1330): 13 row khớp Mermaid; bỏ V3 row "Auto: quá N ngày LV (BR-EC-16)" do dangling ref
- §5 Tham chiếu FR (line 1275): "FR-V.II-01 đến FR-V.II-14"
- §1 Số FR (line 7): "14"
**Tham chiếu delta:** Thay đổi 1 (1.1 → 1.11)

#### 2. CB PD "Từ chối" thành "Trả về DANG_THAM_DINH" để CB NV điều chỉnh — không phải từ chối cuối
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ Phê duyệt là khâu cuối duyệt hồ sơ chi trả chi phí tư vấn pháp luật. Khi CB Phê duyệt mở hồ sơ ở bước Chờ phê duyệt và phát hiện số liệu nhỏ cần chỉnh hoặc cần bổ sung lý do, hành vi đúng nghiệp vụ là **trả hồ sơ về CB Nghiệp vụ** chỉnh xong trình lại — không phải từ chối cuối. Hồ sơ đã qua kiểm tra, đánh giá và thẩm định Đạt nên đẩy vào Từ chối là quá nặng và làm mất công việc trước đó. V3 hiện tại mâu thuẫn nội bộ: bảng chuyển trạng thái mô tả "trả về Đang thẩm định" trong khi bảng FR-Processing lại ghi "chuyển sang Từ chối cuối" — dev không biết hành vi nào đúng, làm sai sẽ phá quy trình.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §5 Bảng chuyển trạng thái (line 1154) ghi `CHO_PHE_DUYET → DANG_THAM_DINH | CB PD từ chối | Có lý do | TB CB NV` — tức là trả về CB Nghiệp vụ. Nhưng V3 §2 FR-V.II-12 Processing Bước 4 (line 708) ghi "Nếu Từ chối → chuyển trạng thái Từ chối, ghi lý do" — đẩy thẳng sang Từ chối cuối. Hai phần SRS nói ngược nhau cho cùng một hành vi. V4 chuẩn hoá theo bảng chuyển trạng thái (trả về Đang thẩm định) và bổ sung sổ ghi lịch sử quyết định riêng cho hồ sơ phê duyệt — vì 1 hồ sơ có thể bị CB Phê duyệt trả về nhiều lần rồi CB Nghiệp vụ trình lại, cần lưu được nhiều lượt → B1.
**Vị trí đã sửa:**
- §2 FR-V.II-12 Processing Bước 1 (line 729): "Kiểm tra quyền CB PD cùng cấp (`user.don_vi_id = hs.don_vi_id`)" + ref BR-AUTH-05
- §2 FR-V.II-12 Processing Bước 3-4 (line 731-732): DUYET → DA_DUYET + ghi `nguoi_phe_duyet_id`/`ngay_phe_duyet`; TU_CHOI → DANG_THAM_DINH (trả về), KHÔNG ghi `thoi_gian_tu_choi`
- §2 FR-V.II-12 Processing Bước 5-6 (line 733-734): tạo PHE_DUYET_CHI_TRA cả 2 trường hợp; thông báo CB NV cả 2; TVV/DN chỉ khi DUYET
- §2 FR-V.II-12 Outputs `trang_thai_moi` (line 743): "DA_DUYET (khi DUYET) / DANG_THAM_DINH (khi TU_CHOI — trả về CB NV)"
- §2 FR-V.II-12 Postcondition (line 747-749): 3 dòng phản ánh hành vi mới
- §2 FR-V.II-12 Acceptance Criteria (line 760-763): 4 criteria, có ngưỡng "≥ 10 ký tự" + BR-AUTH-05 cùng đơn vị
- §3 SCR-V.II-02 #28 nút "Từ chối — trả về thẩm định" (line 990): nhãn rõ + hành vi trả về
- §3 SCR-V.II-02 Quy tắc tương tác (line 1031): rule "CB PD 'Từ chối' là trả về DANG_THAM_DINH (KHÔNG phải từ chối cuối)..."
- §3 SCR-V.II-02 bảng Chuyển trạng thái (line 1014): "CB PD từ chối — trả về CB NV sửa"
- §5 SM-CHITRA Bảng chuyển trạng thái (line 1325): "CB PD từ chối (trả về CB NV sửa) | Có lý do ≥ 10 ký tự | tạo PHE_DUYET_CHI_TRA, TB CB NV | FR-V.II-12 | BR-FLOW-04"
**Tham chiếu delta:** Thay đổi 2 (2.1 → 2.7)

#### 3. Bổ sung hành vi "Tiếp nhận hồ sơ" + "DN rút hồ sơ" trong FR-V.II-02
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Khi hồ sơ chi trả mới đến từ Cổng Dịch vụ công, CB Nghiệp vụ phải bấm "Tiếp nhận" để bắt đầu xử lý; trong cùng giai đoạn này, doanh nghiệp có quyền bấm "Rút hồ sơ" nếu thay đổi ý định nộp. V3 đã mô tả 2 chuyển trạng thái này trong bảng chuyển trạng thái nhưng KHÔNG có FR nào ghi CB Nghiệp vụ bấm ở đâu, doanh nghiệp rút qua kênh nào. Dev đọc V3 thấy bảng nói có hai hành vi nhưng tất cả các FR Processing đều rỗng cho việc này — không xây được giao diện và không biết hành vi nằm ở màn hình nào.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §5 Bảng chuyển trạng thái có sẵn 2 dòng (CB Nghiệp vụ tiếp nhận / DN rút hồ sơ) nhưng cột FR áp dụng ghi "FR-V.II-02" cho tiếp nhận và để trống "—" cho DN rút. V3 §2 FR-V.II-02 Processing chỉ có 4 bước truy vấn danh sách (chỉ đọc), không có nhánh nào cho hành vi tiếp nhận hay rút. SRS nói có hành vi mà FR không tả — dev không có chỗ bấm. V4 bổ sung 2 nhánh con trong FR-V.II-02 (line 207-225) đánh dấu `[GAP-V.II-02]` và `[GAP-V.II-03]` để khớp bảng chuyển trạng thái → B1.
**Vị trí đã sửa:**
- §2 FR-V.II-02 Postcondition (line 192): "trừ khi thực hiện thao tác Tiếp nhận hoặc DN rút hồ sơ"
- §2 FR-V.II-02 Processing — Tiếp nhận hồ sơ `[GAP-V.II-02]` (line 194-202): sub-flow 5 bước
- §2 FR-V.II-02 Processing — DN rút hồ sơ `[GAP-V.II-03]` (line 204-212): sub-flow 5 bước
- §2 FR-V.II-02 Error E2/E3 (line 218-219): ERR-CT-TN-01 + ERR-CT-RUT-01
- §2 FR-V.II-02 Acceptance Criteria (line 226-227): +2 criteria
- §5 SM-CHITRA Bảng (line 1322): row CHO_TIEP_NHAN → DANG_KIEM_TRA, FR-Ref `FR-V.II-02 [GAP-V.II-02]` + Action ghi `ngay_tiep_nhan`/`nguoi_tiep_nhan_id`
- §5 SM-CHITRA Bảng (line 1330): row CHO_TIEP_NHAN → HUY, FR-Ref `FR-V.II-02 [GAP-V.II-03]` + Action ghi `ly_do_huy = 'DN_RUT_HO_SO'`
**Tham chiếu delta:** Thay đổi 3 (3.1 → 3.7)

#### 4. Thêm FR-V.II-14 — DN bổ sung hồ sơ chi trả khi nhận yêu cầu bổ sung (V4 nguyên gốc, BA chốt 2026-05-06)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Khi CB Nghiệp vụ kiểm tra hồ sơ chi trả thấy chưa đầy đủ tài liệu, sẽ bấm "Yêu cầu bổ sung" — hồ sơ chuyển sang trạng thái Yêu cầu bổ sung và doanh nghiệp nhận thông báo qua Cổng DVC/Cổng PLQG. Doanh nghiệp phải gửi lại tài liệu bổ sung thì hồ sơ mới tiếp tục được xử lý — đây là một bước bắt buộc trong vòng đời hồ sơ. V3 hiện tại có ghi sẵn dòng "Yêu cầu bổ sung → Đang kiểm tra: DN bổ sung" trong bảng chuyển trạng thái (line 1119) nhưng KHÔNG có FR nào mô tả hành vi DN bổ sung — không biết DN gửi qua màn hình nào, dữ liệu nhập gồm gì, ai nhận thông báo. Hệ quả: chu trình hồ sơ bị treo ở Yêu cầu bổ sung; CB Nghiệp vụ buộc phải nhập tay file của DN qua kênh ngoài hệ thống, vi phạm nguyên tắc "Nguồn duy nhất qua DVC".
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §5 line 1119 ghi rõ chuyển trạng thái "Yêu cầu bổ sung → Đang kiểm tra: DN bổ sung" tồn tại; nhưng V3 §2 không có FR nào thực hiện hành vi này. File Danh sách UC + Transaction (CSV) §V.II UC70 Bước 3 chỉ ghi "CB NV gửi yêu cầu bổ sung thông tin... thông báo yêu cầu bổ sung đến người đăng ký" — kết thúc ở phía CB Nghiệp vụ, không có UC riêng cho DN gửi bổ sung. Nghiệp vụ rõ ràng cần hành vi này; nếu thiếu thì chu trình bị treo. V4 thêm FR-V.II-14 đánh dấu `[GAP-V.II-01]` để khớp dòng chuyển trạng thái sẵn có → B1.
**Vị trí đã sửa:**
- §2 FR-V.II-14 mới (line 833-892): tác nhân DN qua DVC/Cổng PLQG hoặc CB NV; PRE-01 = YEU_CAU_BO_SUNG; PRE-02 ≤ 5 ngày LV; Inputs `file_bo_sung[]` + `ghi_chu`; Processing 6 bước (validate → lưu file → DANG_KIEM_TRA → TB CB NV → audit); 3 error case (BS-01/02/03); 2 acceptance; Pháp luật cite "NĐ 55/2019, Điều 9"
- §2 FR-V.II-03 Bước 5 (line 239): "ghi `ngay_yeu_cau_bo_sung = NOW()`, tăng `bo_sung_count += 1`"
- §3 SCR-V.II-02 #11 Đếm lần bổ sung (line 973): nhãn "Lần bổ sung: {n}/3 (theo PRE-02 FR-V.II-14 + Processing FR-V.II-03 Bước 5). Highlight đỏ khi n ≥ 2"
- §5 SM-CHITRA Bảng (line 1324): "YEU_CAU_BO_SUNG → DANG_KIEM_TRA: DN bổ sung hồ sơ qua DVC | File hợp lệ, chưa quá 5 ngày LV | Lưu file, TB CB NV, audit | FR-V.II-14 [GAP-V.II-01]"
- §5 SM-CHITRA Mermaid (line 1284): "YEU_CAU_BO_SUNG --> DANG_KIEM_TRA : DN bổ sung qua DVC (FR-V.II-14)"
**Tham chiếu delta:** Thay đổi 4 (4.1 → 4.8)

#### 6. Bổ sung 2 entity owned được mention nhưng V3 thiếu define — THAM_DINH_HO_SO + PHE_DUYET_CHI_TRA + THONG_BAO referenced
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Trong nhóm FR-06, hồ sơ chi trả phải đi qua bước Thẩm định (CB Nghiệp vụ kết luận Đạt/Cần bổ sung/Không đạt) và bước Phê duyệt (CB Phê duyệt quyết định duyệt/trả về/từ chối) — mỗi bước cần một sổ ghi nhận quyết định riêng để truy vết "ai làm gì, lúc nào, kết luận thế nào". V3 §1 Tổng quan đã liệt kê 2 đối tượng dữ liệu THAM_DINH_HO_SO và PHE_DUYET_CHI_TRA là đối tượng chính của nhóm; FR-V.II-09 Bước 7 và FR-V.II-12 Bước 5 đều ghi "Tạo bản ghi" cho 2 đối tượng này. Nhưng V3 §4 chỉ định nghĩa cấu trúc cho 2 đối tượng khác (HO_SO_CHI_TRA + DANH_GIA_HO_SO) — không định nghĩa cấu trúc cho 2 đối tượng nói trên. Hệ quả: dev không có cấu trúc dữ liệu để xây; nếu bỏ qua thì mất sổ thẩm định và lịch sử quyết định CB Phê duyệt — không truy vết được khi có khiếu nại.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — đối chiếu V3 §1 line 27 với V3 §4 line 948-957 (chỉ định nghĩa 2 đối tượng, thiếu 2 đối tượng còn lại được nêu ở §1). V3 §2 FR-V.II-09 Bước 7 và FR-V.II-12 Bước 5 đều ghi "Tạo bản ghi" cho 2 đối tượng — nghĩa là 2 đối tượng phải tồn tại. Đây là khoảng trống giữa phần Tổng quan (đã hứa) và phần Đối tượng dữ liệu (chưa định nghĩa). V4 bổ sung 2 đối tượng đầy đủ (line 1287-1323) cùng đối tượng tham chiếu THONG_BAO (line 1130) phục vụ 5 FR thông báo → B1.
**Vị trí đã sửa:**
- §4 Tổng quan entity (line 1042-1051): 10 entity (4 owned + 6 referenced gồm THONG_BAO polymorphic global)
- §4 ERD subset Mermaid (line 1059-1140): thêm 2 entity nodes + 4 relationship (1:1 với HO_SO_CHI_TRA cho THAM_DINH_HO_SO; N:1 cho PHE_DUYET_CHI_TRA; ref TAI_KHOAN cho cả 2)
- §4 THAM_DINH_HO_SO (owned) (line 1208-1224): 9 fields + Volume ~3,000/năm
- §4 PHE_DUYET_CHI_TRA (owned) (line 1227-1244): 9 fields N:1 (cho phép nhiều lần CB PD trả về rồi CB NV trình lại) + Volume ~3,500/năm
- §2 FR-V.II-12 Processing Bước 5 (line 733): "Tạo bản ghi PHE_DUYET_CHI_TRA (lưu lịch sử quyết định phê duyệt: DUYET hoặc TU_CHOI)"
**Tham chiếu delta:** Thay đổi 6 (6.1 → 6.5)

#### 7. Bổ sung 9 fields lifecycle + UNIQUE ma_ho_so_dvc cho HO_SO_CHI_TRA (cascading: bỏ 2 field do Thay đổi 8 OUT)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hồ sơ chi trả cần lưu được các thông tin truy vết cho từng bước: ai tiếp nhận và lúc nào, ai từ chối và lúc nào, ai hủy và vì lý do gì, đã yêu cầu bổ sung mấy lần, hạn xử lý đến ngày nào. Đây là dữ liệu CB Nghiệp vụ và CB Phê duyệt cần để xem lịch sử trên màn hình chi tiết và để báo cáo thời hạn xử lý. V3 hiện tại định nghĩa hồ sơ chi trả chưa có chỗ ghi các thông tin trên — màn hình chi tiết V3 đã hứa hiển thị 7 dòng "Lịch sử phê duyệt chung" nhưng cấu trúc dữ liệu chỉ có 4/7 trường, các quy tắc nghiệp vụ V3 đã hứa "Tính hạn xử lý" và "Mã hồ sơ DVC duy nhất" nhưng không có chỗ lưu kết quả và không có ràng buộc duy nhất → màn hình hiển thị rỗng, không tránh được nộp trùng khi DVC gửi lại.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §4 HO_SO_CHI_TRA (line 1038-1059) có 19 thuộc tính; V4 (line 1234-1264) có 31 thuộc tính (+12). V3 §2 FR-V.II-05 EC-03 (line 400) ghi "Kiểm tra mã hồ sơ DVC duy nhất. Nếu trùng → trả HTTP 409" — V3 yêu cầu duy nhất nhưng cấu trúc dữ liệu không khai báo ràng buộc duy nhất. V3 §2 FR-V.II-01 BR-CALC-03 ghi "Tính hạn xử lý" — không có chỗ lưu kết quả. V3 SCR-V.II-02 mục 35 (line 909) tham chiếu "7 trường lịch sử phê duyệt chung" nhưng cấu trúc V3 chỉ có 4/7 — thiếu thời điểm và người từ chối, thời điểm và người tiếp nhận, lý do hủy. Màn hình hứa mà cấu trúc dữ liệu không đủ là lỗi nội bộ. V4 bổ sung đầy đủ → B1.
**Vị trí đã sửa:**
- §4 HO_SO_CHI_TRA Tham chiếu FR (line 1156): "FR-V.II-01 đến FR-V.II-14"
- §4 HO_SO_CHI_TRA `ma_ho_so_dvc` (line 1175): UNIQUE constraint (idempotent key cho ERR-CT-02)
- §4 HO_SO_CHI_TRA 9 fields lifecycle mới (line 1176-1187): `ngay_tiep_nhan`, `nguoi_tiep_nhan_id` FK→TAI_KHOAN, `thoi_gian_tu_choi`, `nguoi_tu_choi_id` FK→TAI_KHOAN, `ly_do_huy`, `bo_sung_count` CHECK 0-3 default 0, `ngay_yeu_cau_bo_sung`. **Cascading bỏ:** `deadline` + `muc_do_canh_bao` (do Thay đổi 8 OUT — giữ V3 "4 mức cảnh báo").
- §3 SCR-V.II-02 #35 Common Approval Fields (line 998): "Ngày tiếp nhận", "Người tiếp nhận", "Thời gian phê duyệt", "Người phê duyệt", "Thời gian từ chối", "Người từ chối", "Lý do từ chối", "Lý do hủy"
- §2 FR-V.II-03 Bước 5-6 (line 239-240): ghi `ngay_yeu_cau_bo_sung`/`bo_sung_count` / ghi `ly_do_tu_choi`/`thoi_gian_tu_choi`/`nguoi_tu_choi_id`
- §2 FR-V.II-09 Bước 6 (line 583): TU_CHOI ghi `ly_do_tu_choi = "THAM_DINH: " + nhan_xet`, `thoi_gian_tu_choi`, `nguoi_tu_choi_id`
- §2 FR-V.II-12 Bước 3 (line 731): DA_DUYET ghi `nguoi_phe_duyet_id`, `ngay_phe_duyet`
- §2 FR-V.II-02 Tiếp nhận Bước 3 (line 196): ghi `ngay_tiep_nhan`, `nguoi_tiep_nhan_id`
- §2 FR-V.II-02 DN rút Bước 3 (line 207): ghi `ly_do_huy = 'DN_RUT_HO_SO'`
**Tham chiếu delta:** Thay đổi 7 (7.1, 7.2 cascading 9 field, 7.5-7.9, 7.12) — KHÔNG apply 7.3/7.4/7.10/7.11 (cascading do Thay đổi 8 OUT)

#### 9. Chuẩn hoá nhãn UI tiếng Việt thuần cho SCR-V.II-01/02 — bỏ raw enum/field name
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ Nghiệp vụ và Cán bộ Phê duyệt nhìn vào màn hình SCR-V.II-01 (danh sách) và SCR-V.II-02 (chi tiết) để xử lý hồ sơ chi trả hằng ngày — màn hình phải dùng nhãn tiếng Việt chuẩn để cán bộ đọc hiểu ngay. V3 hiện tại đang để lộ giá trị nội bộ ra giao diện: thẻ Quy mô doanh nghiệp hiển thị "SIEU_NHO/NHO/VUA" thay vì "Siêu nhỏ/Nhỏ/Vừa"; nút chuyển trạng thái hiển thị "DANG_KIEM_TRA" thay vì "Đang kiểm tra"; phần thông tin chi tiết DN dùng nguyên tên trường kỹ thuật làm nhãn — cán bộ phải mò mới hiểu. Theo memory `feedback_vietnamese_only_no_english_jargon`: BA Việt Nam và người dùng cuối là cán bộ Việt Nam, giao diện bắt buộc tiếng Việt thuần.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §3 SCR-V.II-02 mục 5-6 (line 879-880) liệt kê toàn nguyên tên trường gốc làm nhãn hiển thị thay vì nhãn tiếng Việt. V3 SCR-V.II-01 cột 12 (line 830) ghi thẻ "SIEU_NHO / NHO / VUA (80px)" — để lộ giá trị nội bộ. V4 chuyển toàn bộ sang nhãn tiếng Việt "Tên doanh nghiệp", "Địa chỉ", ..., "Siêu nhỏ" / "Nhỏ" / "Vừa" và thêm Quy tắc tương tác (line 1109): "Mọi nhãn, nút, thẻ, lựa chọn, thông báo hiển thị bằng tiếng Việt chuẩn (không viết tắt, không dùng giá trị nội bộ). Giá trị nội bộ chỉ dùng để xử lý dữ liệu" → B1.
**Vị trí đã sửa:**
- §3 SCR-V.II-01 cột 6 Quy mô DN filter (line 853): nhãn Việt + giá trị nội bộ trong ngoặc
- §3 SCR-V.II-01 cột 12 Quy mô badge (line 859): "Nhãn hiển thị: 'Siêu nhỏ'/'Nhỏ'/'Vừa' (map từ enum quy_mo_dn)"
- §3 SCR-V.II-01 cột 13 số tiền (line 860): định dạng VNĐ + hậu tố "đ"
- §3 SCR-V.II-02 #3 Header info (line 966): nhãn Việt cho 5 trường
- §3 SCR-V.II-02 #4 Stepper (line 967): "hiển thị nhãn tiếng Việt"
- §3 SCR-V.II-02 #5-6 Accordion DN/TV (line 968-969): toàn bộ field name → nhãn Việt
- §3 SCR-V.II-02 #8 Checklist (line 971): 5 mục đầy đủ tiếng Việt
- §3 SCR-V.II-02 #9 Kết quả kiểm tra (line 972): nhãn 3 lựa chọn + chuyển trạng thái nhãn Việt
- §3 SCR-V.II-02 #14-17 form Đánh giá (line 977-980): nhãn 4 trường tiếng Việt + công thức tiếng Việt
- §3 SCR-V.II-02 #21-22 Thẩm định (line 984-985): "Đối chiếu thẩm định" + 4 mục checklist nhãn Việt
- §3 SCR-V.II-02 #26 Tóm tắt phê duyệt (line 989): nhãn 6 trường tiếng Việt
- §3 SCR-V.II-02 #28 nút Từ chối (line 990): "Từ chối — trả về thẩm định"
- §3 SCR-V.II-02 #30-33 Cập nhật TT (line 992-995): nhãn 4 trường tiếng Việt
- §3 SCR-V.II-02 Quy tắc tương tác (line 1034): rule UI tiếng Việt thuần — Enum chỉ giá trị nội bộ
**Tham chiếu delta:** Thay đổi 9 (9.1 → 9.14)

#### 10. Bổ sung Mô tả + URL pattern + Quyền truy cập cho SCR-V.II-01/02
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Khuôn mẫu SRS v3.1 quy định mỗi màn hình phải có đủ 7 phần: tên loại, FR sử dụng, Mô tả ngắn, đường dẫn URL, Quyền truy cập, bảng thành phần và quy tắc tương tác — để dev biết xây ở đường dẫn nào, vai trò nào được vào, và để CB Nghiệp vụ/CB Phê duyệt biết phạm vi quyền của mình. V3 chỉ ghi đủ 3 phần đầu cho SCR-V.II-01 (thiếu Mô tả/URL/Quyền) và thiếu Mô tả ngắn cho SCR-V.II-02 — dev không biết đặt URL nào, vai trò nào được phép vào, dễ xây sai phân quyền.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §3 SCR-V.II-01 (line 809-813) chỉ có Loại + FR sử dụng + tham chiếu UX-Spec, thiếu Mô tả/URL/Quyền. V3 SCR-V.II-02 (line 862-869) có URL `/chi-tra/:id` + Quyền nhưng thiếu Mô tả ngắn. V4 đồng bộ đầy đủ cho cả 2 màn hình theo khuôn mẫu v3.1 → B1.
**Vị trí đã sửa:**
- §3 SCR-V.II-01 metadata (line 839-841): + Mô tả 4 câu + URL `/chi-tra/danh-sach` + Quyền truy cập theo phạm vi đơn vị
- §3 SCR-V.II-02 metadata (line 956-959): + Mô tả 5 câu + Quyền chi tiết hơn ("CB PD cùng cấp (phê duyệt/từ chối — trả về)")
**Tham chiếu delta:** Thay đổi 10 (10.1 → 10.2)

#### 11. DON_VI 2 tầng (TW → BN/ĐP) — đồng bộ memory `project_auth_scope_2tier`
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cơ cấu đơn vị trong nghiệp vụ hỗ trợ pháp lý gồm: Trung ương (Cục BLDS&KT) là cơ quan đầu não duy nhất; các Bộ ngành (BN) và Sở Tư pháp tỉnh/thành (ĐP) là 2 nhóm đơn vị ngang cấp song song dưới TW — Bộ ngành KHÔNG có ĐP trực thuộc. Theo memory `project_auth_scope_2tier`, đây là kiến trúc 2 tầng. V3 hiện tại mô tả "cây 3 tầng TW/BN/ĐP" — hàm ý ĐP là con của Bộ ngành, sai mô hình tổ chức thực tế. CB Nghiệp vụ Bộ ngành sẽ bị hiểu nhầm là có ĐP trực thuộc → phân quyền sai phạm vi đơn vị.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — V3 §4 DON_VI (line 1098-1100) ghi: "Cơ quan/đơn vị (cây 3 tầng TW/BN/ĐP) — xem chi tiết tại srs-fr-05-vu-viec.md Section 4". V4 (line 1343) sửa lại: "Cơ quan/đơn vị (2 tầng: TW → {BN, ĐP} ngang cấp) — xem chi tiết tại srs-fr-05-vu-viec.md Section 4". V4 đúng theo memory chuẩn → B1.
**Vị trí đã sửa:**
- §4 DON_VI (referenced) Mô tả (line 1264): "Cơ quan/đơn vị (2 tầng: TW → {BN, ĐP} ngang cấp)"
**Tham chiếu delta:** Thay đổi 11 (11.1)

### Quyết định BA OUT khỏi v3.5 (2026-05-06)

- **Thay đổi 5** (FR-V.II-CROSS-01 + BR-EC-15 + BR-EC-16 — Auto từ chối quá hạn / 3 lần bổ sung): BỎ. v3.5 KHÔNG có FR-V.II-CROSS-01, KHÔNG define BR-EC-15/16. SM-CHITRA bảng đã bỏ V3 row "Auto: quá N ngày LV (BR-EC-16)" để tránh dangling ref. Bỏ Bước 7 V4 của FR-V.II-03. FR-V.II-03 Error E3 V4 (INF-CT-KT-03) cũng KHÔNG đưa vào.
- **Thay đổi 8** (SLA dynamic "Còn N ngày" + BR-SLA-02): BỎ. Cột SLA SCR-V.II-01 #16 giữ V3 "4 mức cảnh báo (80px)" + #3 SCR-V.II-02 giữ "SLA (C07)". KHÔNG thêm BR-SLA-02 vào §6. Cascading: HO_SO_CHI_TRA KHÔNG có 2 field `deadline` + `muc_do_canh_bao`. FR-V.II-01 Bước 7 giữ V3 "Tính deadline SLA" chung chung.
- **Thay đổi 12** (BR-FLOW-04 mở rộng applied + ngưỡng ≥ 10 ký tự): BỎ. BR-FLOW-04 §6 giữ V3 "FR-V.II-12". Các transition DANG_KIEM_TRA→TU_CHOI / DANG_THAM_DINH→TU_CHOI / DA_DUYET→TU_CHOI ở SM-CHITRA bảng KHÔNG có BR Ref BR-FLOW-04. Ngưỡng "≥ 10 ký tự" chỉ giữ ở Thay đổi 2 cho hành vi CB PD trả về (FR-V.II-12).
- **Thay đổi 13** (Lịch sử thay đổi tài liệu): BỎ. v3.5 KHÔNG có section "## Lịch sử thay đổi" ở đầu file.

### Cảnh báo & phụ thuộc cross-FR (Pha 3 reconcile)

1. **Phụ thuộc FR-04** — TU_VAN_VIEN ref Mô tả (line 1252) hiện vẫn ghi "TVV/CG/NHT trong mạng lưới tư vấn" (giữ V3 nguyên trạng). Memory `project_tu_van_vien_entity_covers_nht` chốt 2026-05-03/05: TU_VAN_VIEN cover TVV/CG; NHT có entity riêng NGUOI_HO_TRO. **Phát hiện ngoài v4 (V4-CHƯA-SỬA — Thay đổi C.1 trong delta)** chờ BA quyết IN/OUT. Pha 3 verify đồng bộ với srs-fr-04 v3.5.
2. **Phụ thuộc FR-05** — Section 4 các entity referenced (VU_VIEC, TU_VAN_VIEN, TAI_KHOAN, DON_VI) đều ref `srs-fr-05-vu-viec.md` Section 4. FR-05 v3.5 đã apply (CHANGELOG có section srs-fr-05). Pha 3 verify ERD owner thực sự khớp.
3. **Phụ thuộc FR-07** (DOANH_NGHIEP owner): entity referenced ở line 1255. FR-07 v3.5 chưa apply. Pha 3 verify.
4. **Cite "5 ngày LV theo NĐ 55/2019 Điều 9"** (FR-V.II-14 PRE-02 line 858 + Pháp luật line 892): chưa verify trực tiếp khoản 2-5 trong memory `legal-citations-verification.md` (L4 đã verify Đ.9 PARTIAL với tiêu đề "thủ tục hỗ trợ chi phí" nhưng số "5 ngày LV" cụ thể chưa trích). **Câu hỏi BA D.1** chờ trả lời.
5. **UC77 actor lệch CSV** (FR-V.II-10 — V4 GAP-V.II-04 ghi nhận "SRS chính xác hơn — giữ"): SRS giữ "Hệ thống auto trigger sau UC76", CSV ghi CB NV chủ động chọn HS. **Câu hỏi BA D.2** chờ trả lời.
6. **Yêu cầu thay đổi của đối tác TT CNTT mục 07** (Upload PDF/Word ở form Thêm mới) không áp được cho FR-06 vì SCR-V.II-01 ghi rõ "Nguồn duy nhất: DVC qua LGSP — CB NV KHÔNG nhập tay hồ sơ chi trả". **Câu hỏi BA D.4** chờ trả lời.
7. **NĐ 18/2026 + TT 64/2021/TT-BTC** (§1 line 35 + BR-CALC-01 line 1190 nội dung "Siêu nhỏ 100% trần 3M / Nhỏ 30% trần 5M / Vừa 10% trần 10M"): cite từ V3 baseline, chưa verify trong memory `legal-citations-verification.md`. **Câu hỏi BA D.5** chờ trả lời.

### Technical debt v3.5+ (do BỎ Thay đổi 5/8/12)

1. **State YEU_CAU_BO_SUNG không có job auto từ chối quá hạn** (do Thay đổi 5 OUT): FR-V.II-14 PRE-02 chặn DN gửi sau 5 ngày LV (E3) nhưng nếu DN không gửi gì thì hồ sơ treo vĩnh viễn ở YEU_CAU_BO_SUNG. Phiên bản sau v3.5 cần bổ sung cơ chế thông báo nhắc DN hoặc auto từ chối quá hạn (BR-EC-16) — phối hợp UC108 cấu hình SLA ở FR-10.
2. **FR-V.II-03 không có Bước auto TU_CHOI khi bo_sung_count ≥ 3** (do Thay đổi 5 OUT): UI SCR-V.II-02 #11 hiển thị "Lần bổ sung: {n}/3" + highlight đỏ khi n ≥ 2 nhưng FR không có hành động auto khi n=3. CB NV phải thủ công TU_CHOI. Phiên bản sau cần bổ sung BR-EC-15 hoặc xoá lời hứa "tối đa 3 lần" khỏi UI.
3. **SLA giữ "4 mức cảnh báo" V3** (do Thay đổi 8 OUT): cột SLA hiển thị 4 màu tĩnh thay vì dynamic "Còn N ngày". HO_SO_CHI_TRA chưa có 2 field `deadline` + `muc_do_canh_bao` — chưa có job định kỳ cập nhật. Phiên bản sau đồng bộ pattern với FR-02 SCR-II-01 cột 26 + FR-05 SCR-V.I-01 cột 20.
4. **BR-FLOW-04 chỉ ref FR-V.II-12** (do Thay đổi 12 OUT): các từ chối ở FR-V.II-03/09/13 không có ràng buộc "lý do bắt buộc ≥ 10 ký tự" chính thức trong BR; ngưỡng chỉ ghi rời rạc trong từng FR. Phiên bản sau mở rộng applied scope BR-FLOW-04 + chuẩn hoá ngưỡng "≥ 10 ký tự cho từ chối cuối; trả về có thể ngắn hơn".


---

## srs-fr-08-danh-gia.md — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-08.md`
**Cách tiếp cận:** Seed từ `srs-v3/srs-fr-08-danh-gia.md` → cherry-pick 8 Thay đổi đã thống nhất + 1 phát hiện ngoài v4 (C.2). Pending: T4 (5 trường công khai chuyên trang) chờ trả lời D.1. OUT: T9 (v4 sai vs CSV), C.3 (BA chốt giữ nguyên hiện trạng).
**Số thay đổi đã apply:** A=4 (T1, T2, T3, T5) / B1=4 (T6, T7, T8, C.2) / B2=0 / C=0

### Danh sách thay đổi nghiệp vụ

#### 1. Đổi tên module + SCR + Module entity sang "Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý"
**Phân loại:** A-ITEM-08 (CR-10)
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ và cán bộ phê duyệt ở cả ba cấp (Trung ương, Bộ ngành, Địa phương) đều dùng module này để theo dõi đánh giá hiệu quả hỗ trợ pháp lý cho doanh nghiệp. Module bao trùm trọn bộ vòng đời: lập kế hoạch đánh giá, chấm điểm, lập báo cáo, nhận kết quả — tương ứng các nghiệp vụ UC83-UC91 trong file Danh sách UC + Transaction. Tên gọi cũ "Kế hoạch đánh giá" trong v3 chỉ phản ánh được bước đầu, làm cán bộ và lãnh đạo nhầm rằng module dừng ở khâu lập kế hoạch.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — báo cáo phân tích yêu cầu thay đổi mục ITEM-08 phần D1 yêu cầu trực tiếp: "Đổi tên: 'Kế hoạch đánh giá' → 'Theo dõi đánh giá hiệu quả hỗ trợ pháp lý'", áp ở 4 vị trí gồm tiêu đề file, đường dẫn breadcrumb của màn hình SCR-VI-01, tiêu đề trang và mục lục tài liệu. v4 đã thay đúng tên ở các vị trí từ tiêu đề tới phần ghi chú nhóm cho 3 thực thể KE_HOACH_DANH_GIA / KET_QUA_DANH_GIA / BAO_CAO_DANH_GIA → A-ITEM-08.
**Vị trí đã sửa trong srs-v3.5/srs-fr-08-danh-gia.md:**
- §Title file (line 1)
- §Header Nhóm (line 5) — đồng thời nâng phiên bản 3.0 → 3.5 + số FR 9 → 10
- §2 FR-VI-01 ref màn hình (line 88)
- §2 FR-VI-01 Acceptance "CB NV truy cập…" (line 156)
- §3 SCR-VI-01 header (line 794)
- §3 SCR-VI-01 Phần A — Breadcrumb + Tiêu đề trang (line 805-806)
- §4 Module entity KE_HOACH_DANH_GIA + KET_QUA_DANH_GIA + BAO_CAO_DANH_GIA (3 vị trí)
**Tham chiếu delta:** Thay đổi 1 (1.1-1.10)

#### 2. Bổ sung trường `co_quan_duoc_danh_gia_id` vào KE_HOACH_DANH_GIA (cơ quan được đánh giá, 1:1)
**Phân loại:** A-ITEM-08 (CR-10, Q-07)
**Bối cảnh nghiệp vụ:** Trong một đợt đánh giá hiệu quả hỗ trợ pháp lý, có hai vai trò khác nhau cùng tham gia: cơ quan thực hiện đánh giá (cán bộ tổ chức việc chấm điểm, lập báo cáo) và cơ quan được đánh giá (đơn vị có hoạt động hỗ trợ pháp lý đang bị xem xét). v3 chỉ có một ô để ghi đơn vị nên cán bộ nghiệp vụ không phân biệt được hai vai trò, dễ chấm điểm sai đối tượng và không thể gửi kết quả về đúng nơi cần biết. Việc tách riêng thông tin "cơ quan được đánh giá" còn là điều kiện bắt buộc để cán bộ tại cơ quan được đánh giá mở xem được kết quả ở chức năng FR-VI-10 mới (xem Thay đổi 3).
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — báo cáo phân tích mục ITEM-08 phần D2 yêu cầu trực tiếp bổ sung trường "Cơ quan được đánh giá" cho thực thể KE_HOACH_DANH_GIA, ghi chú "1 kế hoạch đánh giá ứng với 1 cơ quan (quan hệ 1:1)" và phân biệt rõ với cơ quan thực hiện đánh giá. Quyết định Q-07 trong báo cáo phân tích cũng chốt: "1 KH đánh giá → 1 cơ quan". v4 áp đúng cả ràng buộc và phần mô tả → A-ITEM-08.
**Vị trí đã sửa:**
- §4 Mermaid ERD KE_HOACH_DANH_GIA — thêm `identifier co_quan_duoc_danh_gia_id FK`
- §4 Mermaid ERD relationship — thêm "co quan duoc DG"
- §4 Bảng entity KE_HOACH_DANH_GIA — thêm field 16
**Tham chiếu delta:** Thay đổi 2 (2.1-2.3)

#### 3. Bổ sung FR-VI-10 "Nhận kết quả đánh giá" (read-only)
**Phân loại:** A-ITEM-08 (CR-10, Q-06, GAP-VI-04)
**Bối cảnh nghiệp vụ:** Sau khi đợt đánh giá hoàn tất, cán bộ nghiệp vụ tại cơ quan được đánh giá cần biết kết quả để rút kinh nghiệm và cải thiện hoạt động hỗ trợ pháp lý. v3 chỉ có chức năng FR-VI-09 cho cán bộ phê duyệt duyệt báo cáo, hoàn toàn không có cách nào để cán bộ tại cơ quan được đánh giá xem lại kết quả của đơn vị mình. File Danh sách UC + Transaction §VI cũng chưa có nghiệp vụ tương ứng — đây là khoảng trống đã được xác nhận trong báo cáo phân tích yêu cầu thay đổi.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — báo cáo phân tích mục ITEM-08 phần D3 yêu cầu bổ sung FR-VI-10 "Nhận kết quả đánh giá" với tác nhân là cán bộ nghiệp vụ thuộc cơ quan được đánh giá, chỉ được xem (không sửa) và chỉ khi đợt đã ở trạng thái Hoàn thành. Quyết định Q-06 trong báo cáo cũng chốt: "Nhận kết quả đánh giá: chỉ xem". v4 đã bổ sung đầy đủ chức năng mới với đúng tác nhân, đúng điều kiện trạng thái và các tình huống lỗi → A-ITEM-08.
**Vị trí đã sửa:**
- §2 thêm FR-VI-10 mới (sau FR-VI-09)
- §3 SCR-VI-01 "FR sử dụng" — thêm FR-VI-10
- §4 KE_HOACH_DANH_GIA Tham chiếu FR — "FR-VI-01 đến FR-VI-10"
- §5 SM-DANHGIA Tham chiếu FR — "FR-VI-01 đến FR-VI-10"
- §6 Tổng quan BR — BR-AUTH-01 + BR-DATA-05 áp dụng cho FR-VI-10
- §6 BR-AUTH-01 Applied + BR-DATA-05 Applied — thêm FR-VI-10
**Tham chiếu delta:** Thay đổi 3 (3.1-3.6)

#### 4. Bổ sung trường `file_dinh_kem` upload chứng từ KH
**Phân loại:** A-ITEM-07 (CR-07 cross-cutting)
**Bối cảnh nghiệp vụ:** Đối tác yêu cầu mọi chức năng quản lý đều cho phép cán bộ nghiệp vụ tải lên file PDF hoặc Word đính kèm cho hồ sơ (kế hoạch chi tiết, văn bản hướng dẫn, công văn liên quan...). Riêng kế hoạch đánh giá thường có công văn ban hành kế hoạch và tài liệu hướng dẫn nội bộ kèm theo, v3 không có chỗ tải lên nên cán bộ phải lưu file ngoài hệ thống, khó truy xuất khi cần đối chiếu.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — bảng yêu cầu thay đổi mục ITEM-07 trong file khảo sát chung ghi rõ "Cho phép tải lên PDF/Word ở mọi chức năng quản lý" và đánh dấu áp dụng chéo cho 12 thực thể. v4 đã thêm trường file đính kèm cho kế hoạch đánh giá → A-ITEM-07.
**Vị trí đã sửa:**
- §4 Bảng entity KE_HOACH_DANH_GIA — thêm field 15 `file_dinh_kem` file[]
**Tham chiếu delta:** Thay đổi 5 (5.1)

#### 5. Thống nhất 8 trạng thái SM-DANHGIA + bổ sung trạng thái HUY
**Phân loại:** B1 (GAP-VI-01 — sửa mâu thuẫn nội bộ v3 dùng 3 phiên bản tên trạng thái khác nhau giữa §1, §2-3, §4, §5)
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ, cán bộ phê duyệt và đội ngũ phát triển đều cần một bộ tên trạng thái duy nhất cho đợt đánh giá để hiểu nhất quán đợt đang ở bước nào. v3 hiện đang dùng tới 3 bộ tên trạng thái khác nhau trong cùng một file: phần Tổng quan dùng một bộ tên cũ với 9 trạng thái, phần Mô tả thực thể dùng bộ tên thứ hai với 6 trạng thái, còn phần Sơ đồ chuyển trạng thái lại dùng bộ tên thứ ba với 7 trạng thái. Hậu quả: cán bộ đọc tài liệu hoang mang, dropdown lọc UI lệch với badge hiển thị, và quan trọng hơn là chưa có cách hủy đợt khi phát sinh sự cố trước lúc hoàn thành.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 §1 viết sơ đồ trạng thái dùng các tên "Bản nháp / Đã lập kế hoạch / ... / Đã duyệt báo cáo" (9 trạng thái); v3 §4 entity lại quy ước 6 trạng thái khác hẳn ("Dự thảo / Chờ duyệt phân công / ... / Hoàn thành / Hủy"); v3 §5 sơ đồ chuyển trạng thái dùng bộ thứ ba 7 trạng thái không có "Hủy". Ba bộ tên không trùng nhau trong cùng một file là lỗi nội bộ rõ rệt. v4 chốt một bộ duy nhất 8 trạng thái lấy từ §5 làm chuẩn ("Lập kế hoạch / Phân công / Chờ duyệt phân công / Thực hiện / Báo cáo / Chờ phê duyệt / Hoàn thành / Hủy"); ghi chú v4 nêu "Thống nhất sơ đồ trạng thái về 8 trạng thái — §5 là nguồn duy nhất, bổ sung Hủy". Việc thêm "Hủy" hợp lý vì cần đường thoát khi đợt phát sinh sự cố không thể tiếp tục → B1.
**Vị trí đã sửa:**
- §1 SM block tổng quan — thay 9 states cũ bằng 8 states mới + transition HUY + ghi chú GAP-VI-01
- §2 FR-VI-01 Mô tả + Processing bước 6 + Postcondition + Acceptance — NHAP → LAP_KE_HOACH
- §2 FR-VI-03 Precondition + Processing bước 3 + BR ref + Error E4 — DA_LAP_KH → PHAN_CONG
- §2 FR-VI-04 Processing bước 5/6 + BR ref + Output + Postcondition + Acceptance — DA_DUYET_PC/DA_LAP_KH → THUC_HIEN/PHAN_CONG
- §2 FR-VI-05 Precondition + Processing bước 7 + BR ref + Postcondition + Error E2 — DA_DUYET_PC → THUC_HIEN (giữ)
- §2 FR-VI-06 Precondition + Processing bước 3/8 + BR ref + Postcondition — DANG_DANH_GIA → THUC_HIEN; DA_DANH_GIA → BAO_CAO
- §2 FR-VI-07 Precondition + Processing bước 7 + BR ref + Postcondition + Error E1 — DA_DANH_GIA → BAO_CAO; DA_LAP_BC → giữ BAO_CAO
- §2 FR-VI-08 Precondition + Processing bước 2/4 + BR ref + Output + Postcondition + Error E1 + Acceptance — DA_LAP_BC/CHO_DUYET_BC → BAO_CAO/CHO_PHE_DUYET
- §2 FR-VI-09 Precondition + Processing bước 2/4/5 + BR ref + Output + Postcondition + Error E1 + Acceptance — CHO_DUYET_BC/DA_DUYET_BC/DA_LAP_BC → CHO_PHE_DUYET/HOAN_THANH/BAO_CAO
- §3 SCR-VI-01 Phần A — Lọc trạng thái dropdown (8 lựa chọn)
- §3 SCR-VI-01 Phần A — Badge mã màu (8 trạng thái)
- §3 SCR-VI-01 Phần A — Hành động Sửa/Xóa
- §3 SCR-VI-01 Phần A — Form action "Lưu nháp"
- §3 SCR-VI-01 Tab 2 — nút Phê duyệt PC + Từ chối PC
- §3 SCR-VI-01 Tab 3 — nút Hoàn tất chấm điểm
- §3 SCR-VI-01 Tab 4 — nút Trình duyệt BC + Phê duyệt BC + Từ chối BC
- §3 SCR-VI-01 Quy tắc tương tác — auto SET BAO_CAO
- §4 Entity KE_HOACH_DANH_GIA.trang_thai CHECK + default
- §5 SM-DANHGIA Mermaid — thêm 4 transitions HUY + ghi chú GAP-VI-01
- §5 SM-DANHGIA Bảng trạng thái — thêm dòng HUY
- §5 SM-DANHGIA Bảng chuyển trạng thái — thêm dòng transition HUY
**Tham chiếu delta:** Thay đổi 6 (6.1-6.27)

#### 6. Đổi tên FK `dot_danh_gia_id` → `ke_hoach_danh_gia_id` + tham chiếu `DOT_DANH_GIA` → `KE_HOACH_DANH_GIA`
**Phân loại:** B1 (sửa lỗi nội bộ v3 — tên FK không khớp tên entity owned)
**Bối cảnh nghiệp vụ:** Đối tượng quản lý chính của nhóm này được tài liệu mô tả là "Kế hoạch đánh giá" — phần định nghĩa thực thể ở §4 đã đặt tên thống nhất theo nghiệp vụ. Tuy nhiên các bảng dữ liệu nhập liệu trong §2 (FR-VI-02 đến FR-VI-09) và phần Đầu ra của FR-VI-01 lại tham chiếu sang một tên cũ "Đợt đánh giá" — đối tượng này không có định nghĩa nào trong tài liệu. Lập trình viên sẽ phải tự đoán hai tên này có phải cùng một thứ không, dẫn tới rủi ro tạo hai bảng riêng và làm sai luồng dữ liệu của toàn bộ chu trình đánh giá.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 ở 7 vị trí nhập liệu (FR-VI-02 đến FR-VI-09) và 2 vị trí mô tả đầu ra của FR-VI-01 đều tham chiếu thực thể "Đợt đánh giá", trong khi phần định nghĩa thực thể ở §4 chỉ có "Kế hoạch đánh giá", hoàn toàn không có đối tượng nào tên là "Đợt đánh giá". Đây là lỗi nội bộ — v4 thống nhất toàn bộ về một tên duy nhất "Kế hoạch đánh giá" → B1.
**Vị trí đã sửa:**
- §2 FR-VI-01 Outputs (Bản ghi DOT_DANH_GIA → KE_HOACH_DANH_GIA)
- §2 FR-VI-01 Postcondition
- §2 FR-VI-02..09 Inputs row #1 (7 vị trí — replace_all)
**Tham chiếu delta:** Thay đổi 7 (7.1-7.9)

#### 7. Mở rộng phạm vi áp dụng `BR-NOTIF-01` sang FR-VI-03/04/08
**Phân loại:** B1 (GAP-VI-03 — v3 chỉ ghi BR-NOTIF-01 áp dụng FR-VI-09 nhưng FR-VI-03/04/08 cũng có hành vi gửi thông báo phê duyệt/trình duyệt)
**Bối cảnh nghiệp vụ:** Quy tắc gửi thông báo phê duyệt (BR-NOTIF-01) áp dụng cho mọi bước trong quy trình duyệt — khi cán bộ trình duyệt thì người duyệt phải nhận thông báo, khi duyệt xong thì người trình phải nhận kết quả. Trong nhóm Đánh giá có 4 chức năng đều có hành vi gửi thông báo: cán bộ nghiệp vụ trình phân công (FR-VI-03), cán bộ phê duyệt duyệt/từ chối phân công (FR-VI-04), cán bộ nghiệp vụ trình báo cáo (FR-VI-08), cán bộ phê duyệt duyệt báo cáo (FR-VI-09). v3 chỉ liên kết BR-NOTIF-01 vào FR-VI-09, bỏ sót 3 chức năng còn lại — lập trình viên có thể quên triển khai thông báo ở 3 chức năng đó, khiến cán bộ trình duyệt không biết kết quả đã được duyệt hay chưa.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Xử lý của FR-VI-03/04/08 trong v3 đều ghi rõ bước "Gửi thông báo cho cán bộ liên quan" nhưng phần liệt kê quy tắc nghiệp vụ áp dụng và bảng tổng quan BR-NOTIF-01 lại chỉ ghi áp dụng FR-VI-09. Đây là mâu thuẫn nội bộ giữa mô tả luồng và bảng quy tắc nghiệp vụ. v4 mở rộng phạm vi BR-NOTIF-01 sang cả 4 FR có thông báo phê duyệt → B1. v4 mở rộng đúng với ghi chú "Bổ sung FR có logic thông báo phê duyệt/phân công".
**Vị trí đã sửa:**
- §6 Tổng quan BR — BR-NOTIF-01 hàng FR áp dụng
- §6 BR-NOTIF-01 Applied in
**Tham chiếu delta:** Thay đổi 8 (8.1-8.2)

#### 8. Đồng bộ tên SM-DANHGIA + footer file với title module mới
**Phân loại:** B1 [V4-CHƯA-SỬA] — phát hiện sót đồng bộ ở v4
**Bối cảnh nghiệp vụ:** Thay đổi 1 đổi tên 9 vị trí ở title + nhóm + SCR + Module entity. Nhưng tên §5 SM và footer file vẫn còn là tên cũ — không khớp với phần còn lại của file đã đổi sang "Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý". BA và cán bộ kiểm thử mở mục lục thấy tên SM-DANHGIA cũ sẽ nhầm rằng module này chưa được đổi tên hoàn chỉnh; footer cũng còn tên cũ và thiếu chữ "Pháp lý".
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** [V4-CHƯA-SỬA] — v4 line 1125 tên §5 SM vẫn là "SM-DANHGIA: Đánh giá Hiệu quả" (không có "Theo dõi"); v4 line 1255 footer file vẫn là "Hết file FR Group: VI — Đánh giá Hiệu quả Hỗ trợ" (không có "Theo dõi" và thiếu "Pháp lý"). Hai vị trí này thuộc phạm vi đổi tên của Thay đổi 1 nhưng v4 chưa cập nhật cùng nhịp. BA chốt IN 2026-05-06 để đồng bộ trọn vẹn → B1 [V4-CHƯA-SỬA].
**Vị trí đã sửa:**
- §5 SM-DANHGIA tên (heading "### SM-DANHGIA: Đánh giá Hiệu quả" → "### SM-DANHGIA: Theo dõi Đánh giá Hiệu quả")
- Footer file — "Hết file FR Group: VI — Đánh giá Hiệu quả Hỗ trợ" → "Hết file FR Group: VI — Theo dõi Đánh giá Hiệu quả Hỗ trợ Pháp lý"
**Tham chiếu delta:** C.2

### Pending / OUT đã ghi nhận

1. **T4 — 5 trường công khai chuyên trang** (PENDING D.1): Chưa apply vì chưa rõ KH đánh giá có thuộc 12 DS công khai theo CR-01 hay không. `00-khao-sat-chung.md` không liệt kê FR-08 trong cụm 12 DS. Đợi BA xác nhận sẽ bổ sung 5 field (`cong_khai`, `anh_dai_dien`, `thoi_gian_dang_tai`, `mo_ta_cong_khai`, `file_dinh_kem_cong_khai`) sau.
2. **T9 — Bổ sung CB PD vào tác nhân FR-VI-02 và FR-VI-06** (OUT): v4 chú thích "theo CSV UC 84/88" nhưng CSV thực tế chỉ ghi "Cán bộ nghiệp vụ TW,BN,ĐP" cho cả UC84 và UC88 — KHÔNG có CB PD. Giữ nguyên v3 (chỉ CB NV ở FR-VI-02; CB NV / Người đánh giá được phân công ở FR-VI-06) để khớp CSV (theo memory `project_csv_source_of_truth`).
3. **C.3 — Mâu thuẫn nội bộ Mẫu 21a/21b** (OUT, BA chốt giữ nguyên): Ghi chú line 63 ("Mẫu 21a/21b TT17/2025 thuộc nhóm XI, KHÔNG thuộc nhóm VI") + entity `BAO_CAO_DANH_GIA.mau_bao_cao` enum `('MAU_21A','MAU_21B')` — vẫn không nhất quán nhưng BA chốt 2026-05-06 giữ nguyên hiện trạng v4, chấp nhận để theo dõi.
4. **C.1 — Vết NHAP/DA_LAP_KH ở SCR-VI-01 Mô tả + URL pattern** (BA chốt IN 2026-05-06 nhưng KHÔNG APPLICABLE cho v3.5): 2 vị trí có vết là Mô tả (line 790 v4) và URL pattern (line 791 v4) — đây là nội dung v4 mới thêm khi mở rộng SCR-VI-01, KHÔNG có trong `srs-v3/srs-fr-08-danh-gia.md` baseline. Vì v3.5 cherry-pick từ v3 + chỉ apply Thay đổi đã thống nhất, KHÔNG kéo nguyên block "Mô tả + URL pattern + Quyền truy cập" của v4 sang, nên 2 vị trí cần sửa của C.1 KHÔNG tồn tại trong v3.5. Quyết định IN của BA vẫn được tôn trọng — nếu khi nào v3.5 cần thêm block Mô tả + URL pattern + Quyền truy cập (refactor v4 ngoài delta hiện tại), C.1 sẽ áp dụng tại thời điểm đó.

### Bookkeeping ghi nhận

- **Phiên bản SRS:** đổi từ "3.0" → "3.5" ở line 4 header file (BA xác nhận 2026-05-06).
- **Số FR:** đổi từ "9" → "10" ở line 7 header file (phái sinh từ Thay đổi 3 thêm FR-VI-10).
- **Lịch sử thay đổi inline trong file FR:** Thêm section "## Lịch sử thay đổi" giữa header và Mục lục, ghi entry 2026-05-06 (BA xác nhận 2026-05-06).

### Câu hỏi BA chưa trả lời (từ Delta D)
- **D.1:** KH đánh giá có thuộc 12 DS công khai chuyên trang theo CR-01 không?
- **D.3:** Sau khi web-verify NĐ 55/2019 Điều 11, có cite làm bằng chứng pháp lý cho FR-VI-10 không?
- **D.4:** Cờ "CR-VI-01" trong Lịch sử thay đổi v4 không tồn tại trong CR analysis — khi viết Lịch sử thay đổi cho v3.5 có nên ghi rõ "CR-10 (ITEM-08)" thay vì "CR-VI-01"?

---

## srs-fr-09-bieu-mau.md — Thư viện Biểu mẫu, Hợp đồng

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-09.md`
**Cách tiếp cận:** Seed từ `srs-v3/srs-fr-09-bieu-mau.md` → áp 4 thay đổi từ v4 (T1-T4) + lồng ghép cleanup của 2 thay đổi V4-CHƯA-SỬA (T5, T6 — BA đã chốt áp trực tiếp vào v4 ngày 2026-05-06, đồng bộ vào v3.5 cùng lúc). T7, T8 BA bỏ khỏi scope v3.5. D.1-D.5 BA chốt giữ y v4 (không thêm gì ngoài T1-T4).

**Số thay đổi đã apply:** A=1 / B1=5 (gồm 3 cherry-pick từ v4 + 2 đồng bộ V4-CHƯA-SỬA) = 6 thay đổi nghiệp vụ

### Danh sách thay đổi nghiệp vụ

#### 1. Áp CR-01 vào BIEU_MAU — đổi tên `la_cong_khai` → `cong_khai` + thêm 4 trường công khai chuyên trang + áp đầy đủ Inputs/UI/BR-PUBLIC
**Phân loại:** A-CR-01 + B1
**Bối cảnh nghiệp vụ:** Đối tác yêu cầu công khai 12 danh sách lên Cổng Pháp luật Quốc gia, trong đó danh sách Biểu mẫu là số 1. Mỗi biểu mẫu khi công khai cần kèm 4 thông tin chuyên trang để doanh nghiệp dễ nhận biết: ảnh đại diện, thời gian đăng tải, mô tả công khai (cán bộ nghiệp vụ soạn riêng cho người đọc bên ngoài, khác mô tả nội bộ), file đính kèm công khai. Cán bộ nghiệp vụ cần một nút bật/tắt "Công khai trên Cổng Pháp luật Quốc gia" trên hồ sơ biểu mẫu, soạn nội dung công khai riêng — không lấy tự động từ mô tả nội bộ; thời gian đăng tải tự ghi nhận khi bật công khai để doanh nghiệp biết bản nào mới.
**Bằng chứng & lý do:** Đây là thay đổi **đa phân loại** — gồm 2 cụm:

**Phần 1 — Yêu cầu thay đổi của đối tác TT CNTT (A-CR-01):** Báo cáo phân tích CR mục ITEM-01 phần D.1 (line 250) yêu cầu trực tiếp "srs-fr-09-bieu-mau.md — Biểu mẫu — Đổi tên cờ công khai và thêm 3 trường còn lại". v4 áp đúng ở §4 hồ sơ Biểu mẫu (line 770-774): đổi tên cờ công khai và thêm 4 trường đại diện công khai → A-CR-01. Phần này tương ứng dòng 1.1-1.6 trong bảng vị trí.

**Phần 2 — Sửa lỗi nội bộ SRS (B1):** Báo cáo phân tích CR ITEM-01 phần D.1 đồng thời yêu cầu "nút bật/tắt Công khai/Hủy công khai" + bổ sung BR-PUBLIC-01/02/03 (mục D.2 line 263-282). v4 chỉ áp phần hồ sơ, không cập nhật form Thêm/Sửa biểu mẫu, tiêu chí nghiệm thu, màn hình SCR-VII-02 (cột danh sách, nút thao tác, form), và mục Tổng quan quy tắc nghiệp vụ. Hệ quả: hồ sơ có 4 trường mới nhưng không có chỗ cho cán bộ nhập, không có thao tác bật công khai trên giao diện, không có quy tắc khi nào được phép công khai → 4 trường này không dùng được. Đây là lỗi nội bộ do v4 áp thiếu nửa yêu cầu của đối tác → B1. Phần này tương ứng dòng 1.7-1.12 trong bảng vị trí.
**Vị trí đã sửa trong srs-v3.5/srs-fr-09-bieu-mau.md:**
- §2 FR-VII-04 Inputs: thêm 4 trường (cong_khai, anh_dai_dien, mo_ta_cong_khai, file_dinh_kem_cong_khai)
- §2 FR-VII-04 Processing — Thêm mới: thêm bước 8 (auto fill thoi_gian_dang_tai khi cong_khai=1, áp BR-PUBLIC-01 + BR-PUBLIC-03)
- §2 FR-VII-04 Acceptance Criteria: thêm 2 GWT cho Switch công khai (bật → cong_khai=1 + thoi_gian_dang_tai auto-fill; tắt → cong_khai=0 + thoi_gian_dang_tai=NULL)
- §3 SCR-VII-02 Thành phần: tách cột Trạng thái lifecycle + cột Đã công khai + cột Ảnh đại diện; form thêm 4 field (Switch, Ảnh đại diện công khai, Mô tả công khai, File đính kèm công khai)
- §4 ERD: rename `boolean la_cong_khai` → `boolean cong_khai` ở cả THU_MUC_BIEU_MAU và BIEU_MAU; thêm `binary anh_dai_dien`, `datetime thoi_gian_dang_tai`, `text mo_ta_cong_khai` cho BIEU_MAU
- §4 BIEU_MAU bảng attributes: rename row `la_cong_khai` → `cong_khai` + tag `[CR-01]`; thêm 4 row mới (anh_dai_dien, thoi_gian_dang_tai, mo_ta_cong_khai, file_dinh_kem_cong_khai)
- §6 BR Tổng quan: thêm 3 dòng BR-PUBLIC-01/02/03
- §6 BR-PUBLIC-01/02/03 phát biểu: thêm 3 sections cuối (điều kiện công khai BIEU_MAU bất kỳ; hủy công khai clear thoi_gian_dang_tai + gọi API gỡ Cổng; auto fill thoi_gian_dang_tai không cho sửa tay)

**Tham chiếu delta:** Thay đổi 1 (1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 1.11, 1.12)

#### 2. Đồng bộ enum trạng thái THU_MUC_BIEU_MAU với SM-BIEUMAU
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ quản lý thư mục biểu mẫu cần thấy đúng trạng thái vòng đời của thư mục: Nháp / Công khai / Ẩn — giống biểu mẫu bên trong. v3 hiện tại có ba chỗ định nghĩa trạng thái thư mục không khớp nhau: form Thêm/Sửa thư mục cho phép chọn Nháp / Công khai; vòng đời chung cho biểu mẫu là Nháp / Công khai / Ẩn; nhưng hồ sơ thư mục lại quy định Kích hoạt / Vô hiệu hóa. Ba chỗ ba bộ trạng thái khác nhau cùng cho một cột — dev triển khai phải chọn theo bên nào, kiểm thử dữ liệu báo cáo theo trạng thái thư mục dễ gãy.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 form FR-VII-01 cho phép chọn 2 trạng thái Nháp / Công khai; hồ sơ thư mục v3 dòng 847 lại quy định 2 trạng thái Kích hoạt / Vô hiệu hóa. Hai chỗ trong cùng v3 quy định 2 bộ trạng thái khác nhau cho cùng một cột — lỗi nội bộ. v4 dòng 797 đã đồng bộ thành Nháp / Công khai / Ẩn → B1.
**Vị trí đã sửa:**
- §4 entity THU_MUC_BIEU_MAU.trang_thai: `CHECK IN ('KICH_HOAT','VO_HIEU_HOA') default 'KICH_HOAT'` → `CHECK IN ('NHAP','CONG_KHAI','AN') default 'NHAP'` + tag `[GAP-VII-03]`
- §4 entity THU_MUC_BIEU_MAU.cong_khai: rename `la_cong_khai` → `cong_khai` (đồng bộ với BIEU_MAU)

**Tham chiếu delta:** Thay đổi 2 (2.1)

#### 3. Tách HOP_DONG_TU_VAN sang `srs-fr-14-hop-dong-tv.md` (Nhóm X.3)
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hợp đồng tư vấn là văn bản pháp lý ký giữa đơn vị và tư vấn viên / tổ chức tư vấn để vận hành vụ việc cụ thể — thuộc tài sản pháp lý của nghiệp vụ vụ việc, không phải mẫu tham khảo cho doanh nghiệp tải về. v3 hiện tại nhồi Hợp đồng tư vấn (UC163) vào nhóm Thư viện biểu mẫu cùng với mẫu công văn, mẫu đơn — sai phân nhóm. Tệ hơn, cùng file v3 đang định nghĩa 2 bộ trạng thái khác nhau cho hợp đồng: form quản lý quy định 4 trạng thái Nháp / Hiệu lực / Hết hạn / Hủy; nhưng hồ sơ hợp đồng lại quy định Đang thực hiện / Hoàn thành / Hủy / Tạm dừng. Hai bộ trạng thái không khớp nhau, dev triển khai chọn theo bên nào cũng sai một bên.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 dòng 580 và dòng 875 cùng quy định trạng thái hợp đồng nhưng dùng 2 bộ khác nhau, chỉ chung trạng thái Hủy. v4 dòng 565-571 chuyển hướng sang `srs-fr-14-hop-dong-tv.md`, lý do ghi rõ: "Trạng thái hồ sơ tại file này trước đây mâu thuẫn... Đã thống nhất tại srs-fr-14" → B1. v4 cũng bỏ UC163 khỏi tiêu đề nhóm (line 6: "UC 92 – UC 98").
**Vị trí đã sửa:**
- §1 Header: tiêu đề Nhóm "Quản lý thư viện biểu mẫu (HĐ TV tách sang Nhóm X.3)" + UC range `UC 92 – UC 98` (bỏ UC 163) + Số FR=7 + GAP-VII-02 note
- §1 Lịch sử thay đổi: section mới ghi 2 entry (2026-04-03 tạo từ v3, 2026-05-06 áp v3.5)
- §1 Entity chính: note redirect HOP_DONG_TU_VAN → srs-fr-14
- §2 FR-VII-08: bỏ full FR Quản lý HĐ TV (block 70+ dòng v3) → block stub redirect
- §4 entity HOP_DONG_TU_VAN: bỏ full bảng attributes 12 trường → block stub redirect

**Tham chiếu delta:** Thay đổi 3 (3.1, 3.2, 3.3, 3.4, 3.5, 3.6)

#### 4. BR-AUTH-01 — áp Mô hình 2-tier xác thực, bỏ VNPT eKYC
**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Phần mềm có 2 nhóm người dùng tách bạch — cán bộ nội bộ truy cập qua mạng kín nội bộ; doanh nghiệp / tư vấn viên / chuyên gia truy cập qua Internet. Mô hình xác thực phải khớp 2 nhóm này: cấp 1 cho nội bộ (tên đăng nhập + mật khẩu + mã OTP qua email); cấp 2 cho Internet (đăng nhập một lần qua VNeID). v3 hiện tại ghi 3 cấp với cấp 2 là VNPT eKYC và cấp 3 là SSO VNeID — cấu trúc dư thừa, đồng thời đối tác đã chốt KHÔNG dùng VNPT eKYC.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — v3 dòng 945 BR-AUTH-01 ghi "Tier 1 (MVP): Username/password + TOTP 2FA qua email. Tier 2: VNPT eKYC xác thực CCCD. Tier 3: SSO VNeID OIDC". v4 dòng 880 cập nhật thành mô hình 2 cấp đúng định hướng dự án (cấp 1 nội bộ, cấp 2 Internet qua VNeID, không có VNPT eKYC) → B1.
**Vị trí đã sửa:**
- §6 BR-AUTH-01 phát biểu: "Tier 1 (MVP)... Tier 2: VNPT eKYC... Tier 3: SSO VNeID..." → "Mô hình 2-tier: Tier 1 (nội bộ qua mạng kín) = user/pass + TOTP 2FA. Tier 2 (Internet-facing) = SSO VNeID OIDC (NĐ 69/2024/NĐ-CP). Không có VNPT eKYC."
- §6 BR-AUTH-01 cột Kiểm chứng: thêm "test SSO VNeID Tier 2"

**Tham chiếu delta:** Thay đổi 4 (4.1, 4.2)

#### 5. Cleanup vết bẩn HOP_DONG_TU_VAN ngoài note redirect (V4-CHƯA-SỬA — đồng bộ với v4)
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Bối cảnh nghiệp vụ:** Sau khi Thay đổi 3 chuyển nhóm hồ sơ Hợp đồng tư vấn sang `srs-fr-14`, tài liệu nhóm Thư viện biểu mẫu phải sạch các tham chiếu cũ về hợp đồng. Nếu không, cán bộ thẩm định và dev đọc bảng tổng quan vẫn thấy hợp đồng tư vấn nằm trong nhóm Thư viện biểu mẫu, sơ đồ liên kết vẫn vẽ hợp đồng tư vấn liên kết với tư vấn viên — quay về lỗi mà Thay đổi 3 muốn sửa.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** [V4-CHƯA-SỬA] — đã rà soát toàn file v4 sau khi đã có ghi chú chuyển hướng (line 53, 565-571, 807-813), vẫn còn 5 cụm tham chiếu cũ chưa dọn:
- Line 670 (§4 Tổng quan): "Hợp đồng tư vấn — owned — Hợp đồng tư vấn giữa đơn vị và Tư vấn viên / tổ chức tư vấn" — vẫn liệt kê là nhóm hồ sơ thuộc nhóm này.
- Line 675 (§4 Tổng quan): "Tư vấn viên — referenced — liên kết hợp đồng tư vấn" — không còn lý do tham chiếu trong nhóm VII vì hợp đồng đã đi.
- Line 703-713 (§4 sơ đồ): vẫn vẽ nhóm hồ sơ Hợp đồng tư vấn với 8 ô thông tin.
- Line 751-752 (§4 sơ đồ liên kết): vẽ Hợp đồng tư vấn liên kết với Tư vấn viên (TVV ký hợp đồng) và Tệp đính kèm.
- Line 870 (§6 Tổng quan quy tắc): "BR-DATA-04 — Tự sinh mã — FR-VII-06 (Hợp đồng tư vấn)" — sai 2 lớp: (a) FR-VII-06 trong v4 là "Nhập biểu mẫu hàng loạt", không phải Hợp đồng tư vấn; (b) Hợp đồng tư vấn đã chuyển sang nhóm khác.
- Line 904 (§6 BR-DATA-04 phát biểu): cùng nội dung sai như line 870.

v3 cũng có các tham chiếu này nhưng v3 còn FR-VII-08 nên các tham chiếu hợp lệ; v4 bỏ FR-VII-08 nhưng quên dọn → lỗi do v4 sửa nửa chừng → B1 [V4-CHƯA-SỬA].
**Vị trí đã sửa:**
- §4 Tổng quan entity: bỏ row HOP_DONG_TU_VAN owned (cũ #3) + bỏ TU_VAN_VIEN referenced (cũ #8 — vai trò chỉ tồn tại để liên kết HĐ TV); đánh số lại 1-6
- §4 ERD: xóa block entity HOP_DONG_TU_VAN (10 dòng) + xóa block stub TU_VAN_VIEN (4 dòng) + xóa 2 quan hệ HOP_DONG_TU_VAN→TU_VAN_VIEN, HOP_DONG_TU_VAN→FILE_DINH_KEM
- §6 BR Tổng quan: bỏ row BR-DATA-04 (label sai "FR-VII-06 (HĐ tư vấn)")
- §6 BR-DATA-04 phát biểu: xóa toàn bộ section (không có entity nào trong nhóm dùng auto-gen mã sau khi HĐ TV chuyển file)

**Tham chiếu delta:** Thay đổi 5 (5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7)

#### 6. Sửa FR ref sai trong SM-BIEUMAU và BR-FLOW-07 — FR-VII-02 (Tìm kiếm) → FR-VII-03 (Công khai) (V4-CHƯA-SỬA — đồng bộ với v4)
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Bối cảnh nghiệp vụ:** Trong tài liệu nghiệp vụ, mỗi chuyển trạng thái và mỗi quy tắc đều được liên kết với một nhóm chức năng cụ thể để dev và cán bộ kiểm thử biết phải tìm hành vi nghiệp vụ ở đâu. Khi vòng đời biểu mẫu hoặc quy tắc nghiệp vụ liên kết sai nhóm chức năng, dev sẽ đi tìm hành vi ở nhóm chức năng không liên quan — không tìm thấy thì lại nghĩ rằng tài liệu thiếu, phải hỏi BA. Cụ thể: chuyển trạng thái Nháp → Công khai phải liên kết với nhóm chức năng Công khai thư mục, không phải nhóm Tìm kiếm.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** [V4-CHƯA-SỬA]:
- v4 line 847 (vòng đời biểu mẫu): chuyển trạng thái Nháp → Công khai liên kết với "FR-VII-02". Nhưng FR-VII-02 thực tế là "Tìm kiếm thư mục biểu mẫu, hợp đồng (UC93)" (line 151) — không liên quan công khai. Hành vi đăng tải lên cổng thuộc FR-VII-03 "Công khai thư mục biểu mẫu lên Cổng (UC94)" (line 209).
- v4 line 874 (Tổng quan quy tắc): "BR-FLOW-07 — Biểu mẫu công khai không cần phê duyệt — áp dụng FR-VII-02, FR-VII-03". Quy tắc công khai áp cho nhóm Tìm kiếm là vô nghĩa, đáng lẽ chỉ áp FR-VII-03.
- Cùng lỗi này tồn tại y nguyên từ v3 (v3 line 912 vòng đời, line 939 quy tắc), v4 không sửa → B1 [V4-CHƯA-SỬA].
**Vị trí đã sửa:**
- §5 SM-BIEUMAU bảng chuyển trạng thái: transition `NHAP → CONG_KHAI` cột FR Ref `FR-VII-02` → `FR-VII-03`
- §6 BR Tổng quan dòng BR-FLOW-07: cột áp dụng `FR-VII-02, FR-VII-03` → `FR-VII-03`
- §6 BR-FLOW-07 phát biểu: cột Áp dụng FR `FR-VII-02, FR-VII-03` → `FR-VII-03`

**Tham chiếu delta:** Thay đổi 6 (6.1, 6.2, 6.3)

### Pending / OUT đã ghi nhận

1. **T7 — Thiếu FR + UI cho UC97 CSV "Công khai biểu mẫu cá nhân"** (OUT, BA chốt 2026-05-06): CSV §VII.2 dòng 828-834 (UC97) yêu cầu thao tác Công khai/Hủy công khai/Xem DS đã công khai cho TỪNG biểu mẫu cá nhân. v3/v4 không có FR riêng, gộp ngầm vào FR-VII-04 EC-03 + FR-VII-03 cascade. v3.5 KHÔNG thêm FR-VII-NEW-01. Hệ quả tạm: field `cong_khai` chỉ được set qua form Thêm/Sửa biểu mẫu (FR-VII-04 đã có Switch sau Thay đổi 1) hoặc cascade khi thư mục công khai (FR-VII-03). Để lại làm input cho phiên bản sau.
2. **T8 — Field `thu_tu_hien_thi` ở Inputs/form nhưng KHÔNG có entity** (OUT, BA chốt 2026-05-06): v3/v4 đều có lỗi này; v3.5 giữ nguyên trạng — field xuất hiện ở FR-VII-01 Inputs, FR-VII-04 Inputs, SCR-VII-01 form nhưng không persist. Hệ quả tạm: input không lưu được. Để lại làm input cho phiên bản sau.

### Câu hỏi BA đã chốt mặc định "giữ y v4" (từ Delta D)
- **D.1:** CR-VII-01/02/03 ở v4 line 19 không tồn tại trong CR analysis — chỉ cite **CR-01** trong CHANGELOG này (mã xác định được).
- **D.2:** THU_MUC_BIEU_MAU KHÔNG thêm 4 CPF (chỉ rename `la_cong_khai` → `cong_khai` ở Thay đổi 2). Hệ quả tạm: thư mục không có ảnh đại diện/mô tả công khai riêng.
- **D.3:** KHÔNG áp Mô hình B Hybrid 2 tầng (TW_QUOC_GIA/BN_RIENG/DP_RIENG) cho BIEU_MAU. Memory `project_mau_phan_hoi_mo_hinh_b` chỉ chốt cho MAU_PHAN_HOI (FR-02). BIEU_MAU giữ phân quyền theo `don_vi_id` + BR-AUTH-08.
- **D.4:** UC ref FR-VII-06/07 giữ y SRS hiện tại (FR-VII-06 = UC97, FR-VII-07 = UC98 — lệch CSV nhưng BA chấp nhận tạm).
- **D.5:** SM-BIEUMAU header giữ "Entity: BIEU_MAU". THU_MUC_BIEU_MAU.trang_thai dùng cùng enum NHAP/CONG_KHAI/AN đã đồng bộ ở Thay đổi 2 — quan hệ ngầm, đủ rõ.

### Bookkeeping ghi nhận

- **Phiên bản SRS:** đổi từ "3.0" → "3.5" ở line 4 header file.
- **Số FR:** đổi từ "8" → "7" ở line 7 header file (do FR-VII-08 chuyển sang srs-fr-14).
- **UC range:** "UC 92 – UC 98, UC 163" → "UC 92 – UC 98".
- **Lịch sử thay đổi inline trong file FR:** Thêm section "## Lịch sử thay đổi" giữa header và Mục lục, ghi 2 entry (2026-04-03 tạo từ v3, 2026-05-06 áp v3.5).
- **Số dòng file:** v3 = 997, v3.5 = 942 (giảm 55 dòng — do FR-VII-08 + entity HOP_DONG_TU_VAN → stub redirect, bù bằng các bổ sung CR-01 + 3 BR-PUBLIC + 4 row CPF).

---

## srs-fr-10-quan-tri.md — Quản trị Hệ thống

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-10.md`
**Cách tiếp cận:** v4 đã chứa 14/14 Thay đổi (mục 7.2 workflow — tin v4 đã review qua CR đối tác 2026-04-16 + 5 chốt BA 2026-05-06). Áp 5 fix V4-CHƯA-SỬA (C.1-C.5) trực tiếp lên v4 → cp v4 → `srs-v3.5/srs-fr-10-quan-tri.md` → cập nhật header (Phiên bản 3.0 → 3.5, mô tả Số FR đầy đủ) + thêm dòng Lịch sử thay đổi 4 ngày 2026-05-06 ghi "Phát hành v3.5". Toàn bộ 14 Thay đổi + 5 fix đã đồng bộ vào CẢ v4 + v3.5.

**Số thay đổi đã apply:** A=7 / B1=11 (gồm 6 cherry-pick từ v4 + 5 đồng bộ V4-CHƯA-SỬA) / B2c=1 = 19 thay đổi nghiệp vụ

### Danh sách thay đổi nghiệp vụ

#### 1. Đổi cấu trúc DON_VI từ "3 tầng (TW→BN→ĐP)" sang "2 tầng (TW→{BN,ĐP} song song)"
**Phân loại:** A-CR-VIII + C-Đúng-thiết-kế
**Vị trí đã sửa trong srs-v3.5/srs-fr-10-quan-tri.md:**
- §2 FR-VIII-05 Mô tả + Processing bước 3 + bước 4 (enforce 2-tier qua don_vi_cha_id phải = TW)
- §3 SCR-VIII-01 Tree View row 17 + SCR-VIII-05 Cây đơn vị row 2 (mô tả tree mới)
- §4 Entity DON_VI Mô tả + cột don_vi_cha_id (ràng buộc NULL khi TW; = TW khi BN/DP)
- §6 BR-AUTH-02 tên + nội dung + Source 2026-04-18; BR-AUTH-04 (chỉ TW thấy cấp con); Tổng quan BR cột tên BR-AUTH-02

**Tham chiếu delta:** Thay đổi 1 (1.1 → 1.10)

#### 2. Đổi mô hình xác thực từ 3-tier (Tier 1+VNPT eKYC+VNeID) sang 2-tier (Tier 1+VNeID), bỏ VNPT eKYC
**Phân loại:** A-CR-VIII + C-Đúng-thiết-kế
**Vị trí đã sửa:**
- §2 FR-VIII-20 Mô tả (Tier 1 nội bộ + Tier 2 Internet)
- §2 FR-VIII-23/24/25 Preconditions + Errors (Tier 3 → Tier 2)
- §3 SCR-VIII-07 row 2 (VNeID chỉ khi Tier 2 bật)
- §6 BR-AUTH-01 nội dung + thêm "Không có VNPT eKYC"; BR-INTG-06 đổi tên + nội dung tương tự

**Tham chiếu delta:** Thay đổi 2 (2.1 → 2.8)

#### 3. CB nội bộ KHÔNG được dùng VNeID — thêm BR-AUTH-09 + thu hẹp tác nhân FR-VIII-23/25
**Phân loại:** A-CR-VIII + B1
**Vị trí đã sửa:**
- §2 FR-VIII-23 Processing bước 10 (chặn tự tạo TK qua VNeID); Errors thêm E4 ERR-VN-04 (CB nội bộ); E2 mở rộng cho DN; Postcondition + Acceptance 4 case
- §2 FR-VIII-25 Tác nhân (loại trừ CB nội bộ); Mô tả (TK-first cho DN); Preconditions + Processing 2 luồng (manual + scheduled)
- §6 BR-AUTH-09 mới (cán bộ nội bộ chỉ Tier 1) + Tổng quan BR

**Tham chiếu delta:** Thay đổi 3 (3.1 → 3.10)

#### 4. Chuyển FR-VIII-06 (UC104 Tổ chức TV) khỏi Nhóm VIII sang FR-04
**Phân loại:** A-ITEM-02
**Vị trí đã sửa:**
- §1 Tổng quan: "15 → 14 loại danh mục"
- §2 FR-VIII-06 thêm note "[ĐÃ CHUYỂN] sang FR-IV-NEW-01"
- §3 SCR-VIII-01 row 2 (Tab dọc 14 → 13 tab, bỏ "Tổ chức tư vấn")

**Tham chiếu delta:** Thay đổi 4 (4.1 → 4.4)

#### 5. FR-VIII-22 đại tu — chỉ DN tự đăng ký + form 21 trường + username = MST + cam kết + email Phương án B (UI 1 ô / 2 cột)
**Phân loại:** A-CSV + A-BA-2026-05-06 + B2c + B2d
**Vị trí đã sửa:**
- §header file UC range + Số FR; §Lịch sử thay đổi
- §2 FR-VIII-22 toàn bộ (UC191→UC120, mô tả, tác nhân, 21 trường Inputs với MST regex `^\d{10}$` cite TT 105/2020 Đ.5 + tinh_thanh_id FK DANH_MUC TINH_THANH cite QĐ 124/2004 + email ràng buộc Phương án B + cam_ket_thong_tin_dung_su_that, 11 bước Processing bypass CHO_PHAN_QUYEN, 6 Errors, 5 Postconditions, 7 Acceptance)
- §3 SCR-VIII-07 row 11 (button "Đăng ký dành cho doanh nghiệp")
- §3 SCR-VIII-08 toàn bộ (24 thành phần chia 2 nhóm + note Auto-pass)
- §4 Entity TAI_KHOAN cột username (regex + 4 cách sinh) + email (kênh login + khác DOANH_NGHIEP.email)
- §4 Entity DON_VI cột tinh_thanh_id (FK DANH_MUC TINH_THANH + GSO 01-63)
- §6 BR-AUTH-USERNAME-01 mới + BR-AUTH-EMAIL-01 mới + Tổng quan BR

**Tham chiếu delta:** Thay đổi 5 (5.1 → 5.22)

#### 6. Renumber UC ID 3 FR VNeID — UC192-194 → UC121-123 khớp CSV v1.1
**Phân loại:** B2c
**Vị trí đã sửa:**
- §header UC range
- §2 FR-VIII-23/24/25 tiêu đề + UC Reference

**Tham chiếu delta:** Thay đổi 6 (6.1 → 6.4)

#### 7. SM-TAIKHOAN bổ sung trạng thái CHO_PHAN_QUYEN (4 → 5 states)
**Phân loại:** B1 [GAP-VIII-01]
**Vị trí đã sửa:**
- §4 Entity TAI_KHOAN cột trang_thai CHECK enum 5 giá trị
- §5 SM-TAIKHOAN sơ đồ stateDiagram (5 states, 8 transitions); bảng trạng thái + bảng chuyển trạng thái thêm 2 transition CHO_KICH_HOAT → CHO_PHAN_QUYEN → HOAT_DONG

**Tham chiếu delta:** Thay đổi 7 (7.1 → 7.4)

#### 8. Thêm FR-VIII-26 Quên MK / Kích hoạt TK lần đầu (mới)
**Phân loại:** B1
**Vị trí đã sửa:**
- §2 FR-VIII-26 toàn bộ (Inputs 4 trường, Processing 14 bước, Errors 6 case chống enumerate email với INFO trung tính, Postconditions trigger update SM-TVV/SM-NGUOI_HO_TRO, Acceptance 4 case)
- §header Số FR

**Tham chiếu delta:** Thay đổi 8 (8.1 → 8.3)

#### 9. Thêm FR-VIII-28 Nhật ký hệ thống (mới) `[GAP-VIII-02]`
**Phân loại:** B1
**Vị trí đã sửa:**
- §2 FR-VIII-28 toàn bộ (Inputs filter, Processing 6 bước với cap 90 ngày + paginate 50/trang + export Excel max 10.000 dòng, Errors 2 case, Acceptance 3 case)

**Tham chiếu delta:** Thay đổi 9 (9.1)

#### 10. Thêm FR-VIII-29 Quản lý ngày lễ (mới) `[GAP-VIII-05]`
**Phân loại:** B1
**Vị trí đã sửa:**
- §2 FR-VIII-29 toàn bộ (Inputs 5 trường, Processing 6 bước với CRUD + import Excel, Errors 3 case, Outputs có calendar view, Acceptance 3 case)

**Tham chiếu delta:** Thay đổi 10 (10.1)

#### 11. Tăng độ mạnh mật khẩu — thêm yêu cầu "ký tự đặc biệt" `[GAP-VIII-04]`
**Phân loại:** B1
**Vị trí đã sửa:**
- §2 FR-VIII-15 Inputs row 5 mat_khau + Processing step 3 + Errors E3 ERR-TK-03 (3 vị trí)
- §2 FR-VIII-22 Inputs row 19 mat_khau (1 vị trí)
- §2 FR-VIII-26 Inputs row 3 mat_khau_moi (1 vị trí)
- §3 SCR-VIII-08 row 20 form mật khẩu (1 vị trí)
- §3 SCR-VIII-03 row 20 form mật khẩu (1 vị trí — fix C.1)

**Tham chiếu delta:** Thay đổi 11 (11.1 → 11.7) + fix C.1

#### 12. FR-VIII-15 — workflow tạo TK gọi tự động từ FR-IV-07 (TVV/CG) + FR-IV-NHT-01 (NHT)
**Phân loại:** B1
**Vị trí đã sửa:**
- §2 FR-VIII-15 Mô tả mở rộng + Tác nhân thêm "Hệ thống (gọi tự động từ workflow khác)"

**Tham chiếu delta:** Thay đổi 12 (12.1, 12.2)

#### 13. SCR-VIII-06 Tab 3 Mẫu phản hồi — áp Mô hình B Hybrid 2 tầng (CĐT chốt 2026-05-02)
**Phân loại:** A
**Vị trí đã sửa:**
- §3 SCR-VIII-06 FR sử dụng (đổi sang FR-II-NEW-01/02 ở srs-fr-02-hoi-dap.md `[GAP-VIII-03]`)
- §3 SCR-VIII-06 v2.1 note (tab gating per-role) + Thanh phan màn hình row 3
- §3 SCR-VIII-06 Tab 3 tiêu đề + Mô hình B note + Filter bar (Phạm vi/Lĩnh vực/Trạng thái/Search) + Bảng (cột Phạm vi badge + Tác giả + Số lần dùng) + Cột hành động per-row (Xem/Sửa/Xóa với MPH_*) + Nút thêm với disabled state + Modal CRUD (Phạm vi readonly auto-fill + Tác giả readonly) + Modal xem read-only + Empty state per role
- §3 SCR-VIII-06 Quy tắc tương tác (tab gating + element gating chi tiết per role)

**Tham chiếu delta:** Thay đổi 13 (13.1 → 13.13)

#### 14. BR-SLA-02 đổi nhãn FE "Bình thường" → "Trong hạn" + ánh xạ mã DB → nhãn (BA chốt 2026-05-04)
**Phân loại:** A
**Vị trí đã sửa:**
- §6 BR-SLA-02 nội dung (4 mức với mã DB BINH_THUONG/SAP_HET_HAN/QUA_HAN/QUA_HAN_NGHIEM_TRONG → nhãn FE "Trong hạn"/"Sắp hết hạn"/"Quá hạn"/"Quá hạn nghiêm trọng" + cite BA 2026-05-04)

**Tham chiếu delta:** Thay đổi 14 (14.1)

### Fix V4-CHƯA-SỬA cùng áp ngày 2026-05-06 (đồng bộ vào cả v4 + v3.5)

#### 15. C.1 — SCR-VIII-03 row 20 mật khẩu thêm "ký tự đặc biệt" `[GAP-VIII-04]`
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Vị trí đã sửa:** §3 SCR-VIII-03 form row 20 — đồng bộ với FR-VIII-15 ERR-TK-03 và SCR-VIII-08 row 20.

#### 16. C.2 — §6 Tổng quan BR cột "Áp dụng FR" mở rộng cho FR mới (22-29)
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Vị trí đã sửa:** §6 Tổng quan BR cập nhật cột "Áp dụng FR" cho 7 BR:
- BR-AUTH-01: "FR-VIII-15 đến FR-VIII-21" → "FR-VIII-05 đến FR-VIII-29 (mọi FR yêu cầu auth, trừ FR-VIII-06 đã chuyển)"
- BR-AUTH-08: "FR-VIII-05 đến FR-VIII-21" → "FR-VIII-05 đến FR-VIII-29 (trừ FR-VIII-06 đã chuyển)"
- BR-DATA-01: "FR-VIII-05 đến FR-VIII-15" → "FR-VIII-05 đến FR-VIII-15, FR-VIII-18, FR-VIII-19, FR-VIII-29 (trừ FR-VIII-06)"
- BR-DATA-02: "FR-VIII-05 đến FR-VIII-15" → "FR-VIII-05 đến FR-VIII-15, FR-VIII-18, FR-VIII-19, FR-VIII-22, FR-VIII-29 (trừ FR-VIII-06)"
- BR-DATA-03: "FR-VIII-05 đến FR-VIII-15" → "FR-VIII-05 đến FR-VIII-15, FR-VIII-18, FR-VIII-19, FR-VIII-22, FR-VIII-26, FR-VIII-29 (trừ FR-VIII-06)"
- BR-DATA-05: "FR-VIII-05 đến FR-VIII-21" → "FR-VIII-05 đến FR-VIII-29 (trừ FR-VIII-06 đã chuyển)"
- BR-DATA-07: "FR-VIII-05 đến FR-VIII-15" → "FR-VIII-05 đến FR-VIII-15, FR-VIII-18, FR-VIII-19, FR-VIII-28, FR-VIII-29 (trừ FR-VIII-06)"

#### 17. C.3 — SM-TAIKHOAN "Tham chiếu FR" sửa thành FR-VIII-15, FR-VIII-20-22, FR-VIII-26
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Vị trí đã sửa:** §5 SM-TAIKHOAN header (cũ ghi "FR-VIII-18 đến FR-VIII-21" — sai vì FR-VIII-18 là DM Loại hình tiếp nhận, không liên quan TK).

#### 18. C.4 — SM bảng chuyển trạng thái dòng [*] → CHO_KICH_HOAT đổi FR Ref FR-VIII-18 → FR-VIII-15
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Vị trí đã sửa:** §5 SM-TAIKHOAN bảng chuyển trạng thái (cùng lý do C.3 — FR-VIII-18 không liên quan TK).

#### 19. C.5 — SCR-VIII-03 cột Hành động thêm nút "Phân quyền" cho TK CHO_PHAN_QUYEN
**Phân loại:** B1 [V4-CHƯA-SỬA]
**Vị trí đã sửa:** §3 SCR-VIII-03 row 16 cột Hành động thêm "**Phân quyền** (khi trạng thái = CHO_PHAN_QUYEN: gán vai trò + đơn vị → chuyển HOAT_DONG)" — đồng bộ với SM-TAIKHOAN transition CHO_PHAN_QUYEN → HOAT_DONG (Thay đổi 7).

### Câu hỏi BA chưa trả lời (từ Delta D.1 + D.2) — pending verify ở Pha 3

**D.1 Cite pháp lý chưa web-verify:**
- **TT 105/2020/TT-BTC Điều 5** (MST 10 chữ số đơn vị độc lập) — cite ở FR-VIII-22 Inputs row 2, ERR-REG-01a, BR-AUTH-USERNAME-01. ⚠️ Chưa verify nội dung Điều 5 cụ thể.
- **QĐ 124/2004/QĐ-TTg** (mã GSO 01-63 tỉnh thành) — cite ở FR-VIII-22 Inputs row 5, SCR-VIII-08 row 5, Entity DON_VI tinh_thanh_id. ⚠️ Chưa verify còn hiệu lực + chưa có QĐ thay thế.

**D.2 Câu hỏi nghiệp vụ:**
- **Q1:** CHO_PHAN_QUYEN còn dùng cho ai sau khi DN bypass (Thay đổi 5)? Đề xuất giữ làm dự phòng admin migration; cần BA xác nhận.
- **Q2:** SCR-VIII-08a (QTHT duyệt TK) còn dùng được? Đề xuất chuyển thành màn hình duyệt TK chung khi có TK CHO_PHAN_QUYEN.
- **Q3:** Quy trình TVV/CG/NHT đặt MK lần đầu sau khi nhận TK auto-cấp (FR-IV-07/FR-IV-NHT-01) — cross-check với FR-04 ở Pha 3.
- **Q4:** Tập ký tự đặc biệt cụ thể trong chính sách mật khẩu — cần BA chốt regex (vd `!@#$%^&*()_+-=[]{}|;:,.<>?`).
- **Q5:** FR-II-NEW-01/02 ở srs-fr-02-hoi-dap.md có đúng tồn tại — Pha 3 cross-file consistency check.

### Phụ thuộc cross-FR cần Pha 3 reconcile

- **FR-04** phải có FR-IV-NEW-01 thay thế FR-VIII-06 (Thay đổi 4). Đã làm trong v3.5-delta-fr-04.md → cần reconcile.
- **FR-04** phải có FR-IV-07 (TVV/CG) + FR-IV-NHT-01 (NHT) workflow tự cấp TK — cite từ FR-VIII-15 Mô tả + Tác nhân (Thay đổi 12).
- **FR-02** phải có FR-II-NEW-01 + FR-II-NEW-02 cho Mẫu phản hồi Mô hình B (Thay đổi 13). Đánh dấu `[GAP-VIII-03]` chờ Pha 3.
- **FR-05 (DN)** phải có FR-V.III-02 cho đổi DOANH_NGHIEP.email (Thay đổi 5 + BR-AUTH-EMAIL-01).

### Bookkeeping ghi nhận

- **Phiên bản SRS:** đổi từ "3.0" → "3.5" ở line 4 header file.
- **UC range:** "UC 99 – UC 119, UC 191 – UC 194" → "UC 99 – UC 123" (đồng bộ CSV v1.1 sau renumber Thay đổi 6).
- **Số FR:** "25" → "27 (gốc 25 + FR-VIII-26 + FR-VIII-28 + FR-VIII-29; FR-VIII-06 đã chuyển sang FR-04)".
- **Lịch sử thay đổi inline trong file FR:** Thêm dòng 4 ngày 2026-05-06 ghi "Phát hành v3.5".
- **Cách tiếp cận đặc thù:** Vì v4 đã chứa 14/14 Thay đổi (mục 7.2 workflow — tin v4 đã review), seed v3.5 từ v4 sau khi áp 5 fix C.1-C.5 trực tiếp lên v4. Nhanh + an toàn vì v4 đã được CR đối tác + 5 chốt BA 2026-05-06 review.
- **Số dòng file:** v3 = 1975, v3.5 = 2284 (tăng 309 dòng — do thêm FR-VIII-26/28/29 + đại tu FR-VIII-22 + Mô hình B Tab 3 + 3 BR mới + 5 fix V4-CHƯA-SỬA).

---

## srs-fr-07-doanh-nghiep.md — Quản lý Doanh nghiệp được Hỗ trợ pháp lý (V.III)

**Ngày apply:** 2026-05-06
**Delta report nguồn:** `v3.5-delta-reports/v3.5-delta-fr-07.md`
**Cách tiếp cận:** Seed từ `srs-v4/srs-fr-07-doanh-nghiep.md` lượt 2026-05-06 lần 2 (đã tích hợp 10 thay đổi cherry-pick + đã gỡ Xuất Excel theo quyết định CĐT/BA) → đổi header phiên bản 3.2 → 3.5; thay block Lịch sử thay đổi 4 entry của v4 thành 2 entry (tạo từ v3 + áp v3.5).

**Số thay đổi đã apply:** 10 thay đổi cherry-pick (B2b=1, B1=9) + 1 quyết định OUT (Xuất Excel — Thay đổi 5 cũ trong delta lượt 1)

### Danh sách thay đổi nghiệp vụ

#### 1. Bỏ chức năng Import DN từ Excel (FR-V.III-NEW-01 + SCR-V.III-03)
**Phân loại:** B2b — Bỏ UC thừa không có trong CSV
**Vị trí đã sửa:** Header (Phiên bản 3.0→3.5, Số FR 3→2, UC range bỏ "+ UC mới"); §1 Sơ đồ quy trình (xoá node Import Excel); §1 UC Coverage (xoá dòng "Mới"); §2 xoá toàn bộ FR-V.III-NEW-01 (Inputs + 8 cột map + 9 bước Processing + 5 lỗi + 3 AC); §3 SCR-V.III-01 toolbar (xoá nút Import Excel); §3 xoá toàn bộ SCR-V.III-03 Wizard 3 bước; §4 DOANH_NGHIEP "Tham chiếu FR" + "Volume & Growth"; §6 BR-AUTH-01 + BR-DATA-05 Applied (bỏ NEW-01)
**Tham chiếu delta:** Thay đổi 1 (1.1 → 1.11)

#### 2. Bỏ chế độ "Thêm mới" CMS cho Cán bộ Nghiệp vụ — chuyển sang DN tự đăng ký qua FR-VIII-22
**Phân loại:** B1 [⚠️ lệch CSV UC81 transaction "CB NV thêm mới" — cần CĐT xác nhận D.2.1]
**Vị trí đã sửa:** §1 Sơ đồ quy trình (đổi node "Thêm DN" → "DN tự đăng ký FR-VIII-22"); §2 FR-V.III-01 Mô tả (viết lại — KHÔNG có chức năng Thêm mới); §2 FR-V.III-01 Xử lý (xoá toàn bộ nhánh con "Thêm mới" 7 bước); §2 FR-V.III-01 Tiêu chí nghiệm thu (CB NV thêm DN → chỉnh sửa DN; MST trùng → chỉnh sửa MST trùng DN khác); §3 SCR-V.III-01 toolbar (xoá nút "+ Thêm mới"); §3 SCR-V.III-02 tiêu đề ("Thêm/Chi tiết" → "Chi tiết/Chỉnh sửa") + Loại màn hình; §6 BR-CALC-05 mô tả ("khi thêm mới" → "khi cập nhật hồ sơ")
**Tham chiếu delta:** Thay đổi 2 (2.1 → 2.10)

#### 3. Đồng bộ trường tỉnh thành tham chiếu Danh mục dùng chung 63 tỉnh thành (mã GSO 01-63 theo Quyết định 124/2004/QĐ-TTg)
**Phân loại:** B1 — Sửa lỗi nội bộ (V3 mâu thuẫn Inputs FK→DON_VI vs Đối tượng dữ liệu FK→DANH_MUC)
**Vị trí đã sửa:** §2 FR-V.III-01 Inputs trường thứ 6 (FK→DON_VI → FK→DANH_MUC loai='TINH_THANH' kèm cite QĐ 124/2004/QĐ-TTg); §2 FR-V.III-02 Inputs trường thứ 3 (tương tự, rút gọn cite); §4 Đối tượng dữ liệu DOANH_NGHIEP `tinh_thanh_id` (bổ sung loai='TINH_THANH' + cite QĐ); (vị trí thứ 4 ở SCR-V.III-02 dòng 11 ghi riêng tại Thay đổi 10)
**Tham chiếu delta:** Thay đổi 3 (3.1, 3.2, 3.3)
**⚠️ Phụ thuộc cite pháp lý:** D.1.1 — Quyết định 124/2004/QĐ-TTg cần đối chiếu web trước khi giữ.

#### 4. Mô tả ngữ nghĩa email Doanh nghiệp — không khoá duy nhất, đồng bộ TK-first, đổi độc lập không cần OTP (BR-AUTH-EMAIL-01)
**Phân loại:** B1 — Sửa lỗi nội bộ (V3 mô tả vắn tắt "Email liên hệ" thiếu rõ unique/sync)
**Vị trí đã sửa:** §4 Đối tượng dữ liệu DOANH_NGHIEP, hàng `email` (mô tả viết lại đầy đủ — KHÔNG UNIQUE; auto-set bằng TAI_KHOAN.email khi DN tự đăng ký; đổi độc lập sau qua FR-V.III-02 theo BR-AUTH-EMAIL-01 không cần OTP; KHÁC TAI_KHOAN.email)
**Tham chiếu delta:** Thay đổi 4 (4.1)
**Lưu ý không sửa:** Inputs FR-V.III-01 trường thứ 15 và SCR-V.III-02 dòng 20 Email giữ nguyên (form CMS thuần).
**⚠️ Phụ thuộc cross-FR:** BR-AUTH-EMAIL-01 nằm ở srs-fr-10 — cross-check khi xử lý FR-10.

#### 5. Sửa mô tả Đối tượng dữ liệu DON_VI từ "cây 3 tầng TW/BN/ĐP" sang "2 tầng TW → {BN, ĐP} ngang cấp"
**Phân loại:** B1 — Sửa lỗi nội bộ (V3 mô tả sai mô hình tổ chức)
**Vị trí đã sửa:** §4 Tổng quan đối tượng dữ liệu (dòng DON_VI); §4 DON_VI (referenced) Mô tả
**Tham chiếu delta:** Thay đổi 5 (5.1, 5.2)

#### 6. Bổ sung Mô tả + URL + Quyền truy cập cho 2 màn hình (bỏ tham chiếu UX-Spec ngoài)
**Phân loại:** B1 — Sửa lỗi nội bộ (V3 chỉ ghi UX-Spec ref ngoài, không có thông tin phân quyền tại chỗ)
**Vị trí đã sửa:** §3 SCR-V.III-01 metadata (bỏ UX-Spec ref MH-07.1; thêm Mô tả + URL `/doanh-nghiep/danh-sach` + Quyền truy cập với phân quyền BR-AUTH-08); §3 SCR-V.III-02 metadata (bỏ UX-Spec ref MH-07.2; thêm Mô tả + URL `/doanh-nghiep/:id` hoặc `/sua` + Quyền truy cập)
**Tham chiếu delta:** Thay đổi 6 (6.1, 6.2)

#### 7. Đồng bộ tên trường giữa lớp Inputs/Màn hình và lớp Đối tượng dữ liệu DOANH_NGHIEP (4 cặp)
**Phân loại:** B1 — Sửa lỗi nội bộ (V3/V4 trước lượt 2 lệch tên trường giữa 2 lớp)
**Vị trí đã sửa:** §2 FR-V.III-01 Inputs trường 4 (`giay_cndk`→`giay_cn_dkkd`), trường 7 (`loai_doanh_nghiep_id`→`loai_dn_id`), trường 14 (`chuc_vu_dd`→`chuc_vu_dai_dien`), trường 16 (`so_dien_thoai`→`dien_thoai`); §3 SCR-V.III-02 dòng 8/19/21 đồng bộ tương ứng
**Tham chiếu delta:** Thay đổi 7 (7.1 → 7.7)

#### 8. Bổ sung trường `tong_nguon_von` vào Đối tượng dữ liệu DOANH_NGHIEP (đủ 3 chỉ số NĐ 39/2018 cho BR-CALC-05)
**Phân loại:** B1 — Sửa lỗi nội bộ (Inputs/SCR thu thập đủ 3 chỉ số nhưng Đối tượng dữ liệu chỉ lưu 2)
**Vị trí đã sửa:** §4 DOANH_NGHIEP (sau dòng `so_lao_dong` thêm trường `tong_nguon_von`); §4 khối ràng buộc CHECK (thêm `CHECK (tong_nguon_von >= 0)`)
**Tham chiếu delta:** Thay đổi 8 (8.1, 8.2)

#### 9. Tách Đối tượng dữ liệu DOANH_NGHIEP_LINH_VUC (M-N) — đổi UI Lĩnh vực kinh doanh sang multi-select
**Phân loại:** B1 — Sửa lỗi nội bộ (V3/V4 mâu thuẫn §1 nói có DOANH_NGHIEP_LINH_VUC nhưng §4 không có + UI dùng 1 ô text)
**Vị trí đã sửa:** §2 FR-V.III-01 Inputs trường 17 (`linh_vuc_kinh_doanh|text` → `linh_vuc_ids|structured` multi-select FK→DANH_MUC loai='LINH_VUC_KINH_DOANH'); §2 FR-V.III-02 Inputs trường 4 (tương tự); §3 SCR-V.III-01 dòng 10 filter (select đơn → multi-select); §3 SCR-V.III-02 dòng 26 (textarea → multi-select); §4 Tổng quan đối tượng dữ liệu (thêm dòng DOANH_NGHIEP_LINH_VUC); §4 Sơ đồ liên kết (thêm khối + 2 quan hệ); §4 chèn Mô tả Đối tượng dữ liệu DOANH_NGHIEP_LINH_VUC mới (2 trường + UNIQUE + Volume ~30.000 records/năm)
**Tham chiếu delta:** Thay đổi 9 (9.1 → 9.7)
**⚠️ Phụ thuộc cross-FR:** DANH_MUC config phải có `loai='LINH_VUC_KINH_DOANH'` — kiểm khi xử lý FR-10 (UC105).

#### 10. Đồng bộ tỉnh thành ở SCR-V.III-02 dòng 11 (vị trí thứ 4 — phối hợp Thay đổi 3)
**Phân loại:** B1 — Sửa lỗi nội bộ (sót 1/4 vị trí ở lượt 1, đã sync ở lượt 2)
**Vị trí đã sửa:** §3 SCR-V.III-02 dòng 11 Tỉnh thành (FK→DON_VI → FK→DANH_MUC loai='TINH_THANH' mã GSO 01-63)
**Tham chiếu delta:** Thay đổi 10 (10.1)

### Pending / OUT đã ghi nhận (không apply vào v3.5)

1. **Thay đổi 5 cũ trong delta lượt 1 — Bổ sung Xuất Excel FR-level** (OUT, BA chốt 2026-05-06 lần 2): V4 lượt 1 thêm Sub-section Processing "Xuất Excel" 6 bước + ERR-DN-04 ngưỡng 10.000 dòng + tiêu chí nghiệm thu Xuất Excel + mention "cho phép Xuất Excel" trong Mô tả SCR-V.III-01 (đánh dấu `[GAP-V.III-01]`). BA chốt KHÔNG đưa vào v3.5; lượt 2 đã gỡ FR-level khỏi v4. Trạng thái v3.5: nút "Xuất Excel" trên thanh công cụ SCR-V.III-01 vẫn giữ (kế thừa từ v3) — nhưng FR không có Processing/AC/Error tương ứng. Để lại làm input cho phiên bản sau.

### Câu hỏi BA/CĐT còn mở (từ Delta D)

- **D.1.1** — Quyết định 124/2004/QĐ-TTg có thật là nguồn chính thức của danh mục mã GSO 01-63 tỉnh thành? (cần đối chiếu web — Thay đổi 3 đang phụ thuộc)
- **D.1.2** — NĐ 55/2019 Điều 4 có quy định ưu tiên DN nữ làm chủ / lao động nữ / lao động khuyết tật? (entity DOANH_NGHIEP cite Điều 4 — chưa đối chiếu trong file `legal-citations-verification.md`)
- **D.2.1** — CSV §V.III dòng 683 transaction "CB nghiệp vụ TW,BN,ĐP thêm mới DN" được diễn giải lại thành "DN tự đăng ký + CB NV xác nhận/sửa hồ sơ" hay cần giữ song song cả 2 luồng tạo DN? (Thay đổi 2 đang phụ thuộc)

### Phụ thuộc cross-FR ghi nhận để xử lý ở Pha 3

- **FR-10 (FR-VIII-22 đăng ký DN, BR-AUTH-EMAIL-01, TT 105/2020 username DN = MST):** Thay đổi 2, 4 phụ thuộc semantic ở srs-fr-10. Kiểm BR-AUTH-EMAIL-01 và FR-VIII-22 có nhất quán với mô tả ở FR-07.
- **FR-05 (Vụ việc):** AC FR-V.III-01 nhắc "kiểm tra DN không có vụ việc đang xử lý khi xoá" — phụ thuộc trạng thái VV ở FR-05.
- **FR-12 (TV chuyên sâu, gộp MH-12.3):** Tab 2 SCR-V.III-02 mention "CRUD HO_SO_PHAP_LY_DN, 5 loại × 3 trạng thái" — entity HO_SO_PHAP_LY_DN không có trong §4 FR-07, có thể nằm ở FR-12. Cross-check ở Pha 3.
- **FR-10 (UC105 Quản lý danh mục):** DANH_MUC config phải có 2 loại mới được FR-07 dẫn chiếu: `loai='TINH_THANH'` (mã GSO 01-63) và `loai='LINH_VUC_KINH_DOANH'`.

### Bookkeeping ghi nhận

- **Phiên bản SRS:** "3.0" → "3.5" ở line 4 header file.
- **Số FR:** "3" → "2" ở line 7 header file (do xoá FR-V.III-NEW-01 Import).
- **UC range:** "UC 81 – UC 82 + UC mới" → "UC 81 – UC 82".
- **Lịch sử thay đổi inline trong file FR:** thay block 4 entry của v4 thành 2 entry (2026-04-03 tạo từ v3, 2026-05-06 áp v3.5 với 10 thay đổi cherry-pick).
- **Số dòng file:** v3 = 680, v3.5 = 585 (giảm 95 dòng — do xoá FR-V.III-NEW-01 + SCR-V.III-03 + nút Import + 2 ref BR; bù bằng bổ sung Đối tượng dữ liệu DOANH_NGHIEP_LINH_VUC + trường `tong_nguon_von` + mô tả email DN + Mô tả/URL/Quyền truy cập SCR + entry lịch sử thay đổi).
- **Cách tiếp cận đặc thù:** Vì v4 lượt 2026-05-06 lần 2 đã chứa đủ 10/10 Thay đổi đã chốt + đã gỡ Xuất Excel theo quyết định CĐT/BA, seed v3.5 từ v4 trực tiếp. Nhanh + an toàn vì v4 đã được CĐT/BA review qua 2 lượt.

---


## srs-fr-12-tv-chuyen-sau.md — Tư vấn pháp luật chuyên sâu

**Ngày apply:** 2026-05-06
**Delta report nguồn:** v3.5-delta-fr-12.md
**Số thay đổi đã apply:** A=3 / B1=10 / OUT=1 (Thay đổi 14 — note thang điểm doanh nghiệp đánh giá tư vấn chuyên sâu, không đưa vào v3.5).
**Phụ thuộc cổng duyệt 2b:** BA mark OUT Thay đổi 14 và mark IN Thay đổi 3/6/7 thông qua quyết định "C-1/C-2/C-3 sửa trong v4 rồi đưa vào v3.5". 10 cụm còn lại (1, 2, 4, 5, 8, 9, 10, 11, 12, 13) BA không flag negative — diễn giải IN ngầm vào v3.5.
**Bookkeeping line numbers:** Mọi line number trong section này đã được verify lại bằng grep trên file `srs-v3.5/srs-fr-12-tv-chuyen-sau.md` ngày 2026-05-06 (1.617 dòng). Line numbers ban đầu lấy từ v4 (1.627 dòng) bị lệch do bỏ khối "Lịch sử thay đổi" 8 dòng + thêm dòng "Nguồn:" ở header — đã đính chính.

### Danh sách thay đổi nghiệp vụ

#### 1. Đổi tên sub-menu "Tư vấn chuyên sâu" → "Tư vấn pháp luật chuyên sâu"

**Phân loại:** A-ITEM-12
**Bối cảnh nghiệp vụ:** Cán bộ nghiệp vụ ở cả ba cấp Trung ương, Bộ ngành, Địa phương dùng module này thông qua thanh điều hướng bên trái của hệ thống quản trị. Tên cũ "Tư vấn chuyên sâu" mơ hồ về phạm vi — có thể bị nhầm với tư vấn các lĩnh vực khác (kinh tế, đầu tư, kỹ thuật) trong khi nhóm này thực tế chỉ cover tư vấn pháp luật cho doanh nghiệp đối với các vụ việc phức tạp. Đối tác yêu cầu thêm chữ "pháp luật" vào tên gọi để cán bộ và doanh nghiệp đọc menu là hiểu ngay phạm vi.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — báo cáo phân tích yêu cầu thay đổi mục ITEM-12 ghi rõ: "Mục menu phụ 'Tư vấn chuyên sâu' → 'Quản lý Tư vấn pháp luật chuyên sâu'", quyết định Chủ đầu tư đã chấp nhận. Phạm vi đổi tên giới hạn ở mục menu phụ, KHÔNG đổi tên nhóm X.1 và KHÔNG đổi tên file tài liệu. v4 áp đúng phạm vi tại 13 vị trí gồm tiêu đề tài liệu, đường dẫn breadcrumb, tiêu đề trang và phần ghi chú nhóm cho 5 thực thể nghiệp vụ → A-ITEM-12.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §1 Tổng quan tiêu đề tài liệu (line 1) + tên Nhóm (line 5)
- §3 Màn hình chức năng SCR-X1-01: tiêu đề màn hình (line 1057), đường dẫn breadcrumb + tiêu đề trang trong bảng thành phần (line 1071-1072)
- §3 Màn hình chức năng SCR-X1-02: tiêu đề màn hình (line 1105), đường dẫn breadcrumb + tiêu đề trang trong bảng thành phần (line 1121-1122)
- §4 Đối tượng dữ liệu — phần dẫn nhập (line 1176); phần ghi chú nhóm cho 5 đối tượng: Phiên tư vấn (line 1309), Lịch sử trao đổi tư vấn (line 1333), Hồ sơ pháp lý doanh nghiệp (line 1356), Tư liệu pháp luật vụ việc (line 1386), Đánh giá chất lượng tư vấn (line 1415)
**Tham chiếu delta:** Thay đổi 1 (1.1-1.13)

#### 2. Đổi tên đối tượng "Nội dung tư vấn chuyên sâu" → "Tư vấn chuyên sâu" cho thống nhất nội bộ

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Đối tượng quản lý chính của nhóm Tư vấn pháp luật chuyên sâu — tức là một vụ việc tư vấn cụ thể từ doanh nghiệp gửi tới — phải có một tên duy nhất xuyên suốt tài liệu để cán bộ và lập trình viên cùng hiểu giống nhau. v3 hiện đang dùng đồng thời 2 tên cho cùng đối tượng này: phần định nghĩa thực thể đặt là "Nội dung tư vấn chuyên sâu" trong khi phần phiên tư vấn, lịch sử trao đổi và sơ đồ trạng thái lại tham chiếu "Tư vấn chuyên sâu". Lập trình viên đọc xong sẽ hoang mang giữa hai tên hoặc tự dựng 2 đối tượng riêng biệt — gây lệch dữ liệu giữa các chức năng.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần phiên tư vấn và phần lịch sử trao đổi của v3 đều tham chiếu thực thể "Tư vấn chuyên sâu", phần sơ đồ trạng thái cũng dùng tên này, nhưng phần Định nghĩa thực thể (mục 3.4.3.9) lại đặt tên là "Nội dung tư vấn chuyên sâu". Đây là mâu thuẫn nội bộ trong cùng một file. v4 thống nhất toàn bộ về một tên duy nhất "Tư vấn chuyên sâu" ở cả phần Định nghĩa thực thể, sơ đồ quan hệ, các tham chiếu chéo và mô tả luồng → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §1 Tổng quan — phần liệt kê quan hệ giữa các đối tượng (line 67-72)
- §2 FR-X.1-03 phần Hậu điều kiện (line 487)
- §2 FR-X.1-06 phần Đầu vào — trường liên kết vụ việc tư vấn (line 801)
- §2 FR-X.1-07 phần Hậu điều kiện (line 1026)
- §4 Đối tượng dữ liệu — bảng tổng quan dòng đầu (line 1182); sơ đồ quan hệ thực thể — header và 4 dòng quan hệ (line 1198, 1265-1274); mục Định nghĩa 3.4.3.9 (line 1277)
**Tham chiếu delta:** Thay đổi 2 (2.1-2.7)

#### 3. Đồng bộ danh sách trạng thái vụ việc tư vấn chuyên sâu giữa Đầu vào / Đầu ra / Hậu điều kiện và Sơ đồ chuyển trạng thái

**Phân loại:** B1 (đã mở rộng C-1)
**Bối cảnh nghiệp vụ:** Khi cán bộ nghiệp vụ tạo mới hoặc lọc danh sách vụ việc tư vấn pháp luật chuyên sâu, danh sách trạng thái hiển thị trên giao diện phải khớp với danh sách trạng thái đã chốt trong sơ đồ chuyển trạng thái của vụ việc. v3 lại có 2 danh sách khác nhau: phần Đầu vào của FR-X.1-01 và FR-X.1-02 chỉ liệt kê 4 trạng thái cũ ("Chờ xử lý / Đang xử lý / Đã xử lý / Đóng"), trong khi phần định nghĩa thực thể và sơ đồ chuyển trạng thái dùng 7 trạng thái mới ("Tiếp nhận / Phân công / Đang tư vấn / Hoàn thành / Chờ phê duyệt / Đã duyệt / Hủy"). Hậu quả: cán bộ chọn giá trị từ danh sách thả xuống ở giao diện thì hệ thống không lưu được vì giá trị đó không có trong danh sách trạng thái thực tế của vụ việc; báo cáo vòng đời vụ việc bị sai. Sau cổng duyệt 2b ngày 2026-05-06, ngoài Đầu vào, đã đồng bộ tiếp Đầu ra của FR-X.1-01 / FR-X.1-02 và bước Xử lý / Hậu điều kiện của FR-X.1-03 (tiếp nhận từ Cổng) — bốn vị trí v4 lúc đầu sót, phát hiện ở C-1.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Đầu vào của FR-X.1-01 và FR-X.1-02 trong v3 dùng 4 trạng thái cũ; trong khi phần Định nghĩa thực thể (mục 3.4.3.9) và phần Sơ đồ chuyển trạng thái cùng file đã chốt 7 trạng thái mới. Hai nguồn trong cùng một file không khớp nhau là lỗi nội bộ. v4 sửa phần Đầu vào về đúng danh sách 7 trạng thái mới, mặc định "Tiếp nhận", cũng đổi tên trường cho thống nhất. Sau cổng duyệt 2b, mở rộng thêm Đầu ra FR-X.1-01 / FR-X.1-02 (đổi tên trường "trạng thái xử lý" → "trạng thái" cho khớp Đầu vào) và bước Xử lý / Hậu điều kiện của FR-X.1-03 (đổi mặc định khi tiếp nhận từ Cổng = "Tiếp nhận" theo sơ đồ chuyển trạng thái) → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-01 phần Đầu vào dòng trạng thái (line 110); phần Đầu ra dòng trạng thái — đồng bộ tên trường (line 287)
- §2 FR-X.1-02 phần Đầu vào dòng trạng thái (line 346); phần Đầu ra dòng trạng thái (line 378)
- §2 FR-X.1-03 phần Xử lý bước "Tạo bản ghi tư vấn chuyên sâu" — mặc định trạng thái "Tiếp nhận" (line 464); phần Hậu điều kiện (line 487)
- §3 Màn hình chức năng SCR-X1-01 — bộ lọc thả xuống Trạng thái (line 1078)
**Tham chiếu delta:** Thay đổi 3 (3.1-3.7)

#### 4. Bổ sung 7 khối Xử lý chi tiết theo Sơ đồ chuyển trạng thái cho FR-X.1-01

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Sơ đồ chuyển trạng thái của vụ việc Tư vấn pháp luật chuyên sâu có 9 nhánh chuyển ứng với các thao tác nghiệp vụ khác nhau: cán bộ nghiệp vụ phân công chuyên gia, chuyên gia xác nhận, chuyên gia từ chối, chuyên gia hoàn thành tư vấn, cán bộ phê duyệt duyệt kết quả, cán bộ phê duyệt từ chối phê duyệt, hủy yêu cầu (3 ngữ cảnh hủy khác nhau). Mỗi thao tác có người thực hiện khác nhau (cán bộ nghiệp vụ / chuyên gia / cán bộ phê duyệt cùng cấp), điều kiện cho phép thực hiện khác nhau (đã có văn bản tư vấn pháp luật, lý do từ chối tối thiểu 10 ký tự, doanh nghiệp đồng ý hủy), người được nhận thông báo khác nhau, ghi nhật ký kiểm toán khác nhau. v3 chỉ có duy nhất một khối "Cập nhật trạng thái xử lý" gồm 4 bước chung chung — lập trình viên không có hướng dẫn chi tiết, mỗi nhánh chuyển sẽ tự suy luận, dẫn tới sai luồng phê duyệt và mất kiểm soát chéo.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — bảng Sơ đồ chuyển trạng thái trong cùng file v3 đã liệt kê đủ 7 nhánh chuyển với người kích hoạt, điều kiện, hành động và quy tắc nghiệp vụ áp dụng cho từng nhánh, nhưng phần Xử lý của FR-X.1-01 chỉ có một khối chung 4 bước. Đây là mâu thuẫn nội bộ giữa phần Sơ đồ chuyển trạng thái và phần Xử lý của FR. v4 bổ sung 7 khối Xử lý riêng (Phân công CG, CG xác nhận, CG từ chối, Hoàn thành, Phê duyệt, Từ chối phê duyệt, Hủy yêu cầu) đồng thời mở rộng danh sách quy tắc nghiệp vụ áp dụng — bao gồm phê duyệt cùng cấp, tự động chuyển trạng thái, từ chối phải có lý do, gửi thông báo phê duyệt → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-01 phần Xử lý — 7 khối transition mới: Phân công chuyên gia (line 149), Chuyên gia xác nhận (line 160), Chuyên gia từ chối (line 172), Hoàn thành tư vấn (line 183), Phê duyệt (line 194), Từ chối phê duyệt (line 206), Hủy yêu cầu (line 217)
- §2 FR-X.1-01 danh sách Quy tắc nghiệp vụ áp dụng — bổ sung 5 quy tắc mới: BR-AUTH-05 phê duyệt cùng cấp (line 261), BR-FLOW-01 tự động chuyển trạng thái (line 268), BR-FLOW-04 từ chối có lý do (line 269), BR-NOTIF-01 gửi thông báo (line 270), sơ đồ chuyển trạng thái SM-TVCS (line 275)
- §2 FR-X.1-01 phần Xử lý lỗi — mở rộng thông điệp lỗi E4 chuyển trạng thái không hợp lệ (line 305)
**Tham chiếu delta:** Thay đổi 4 (4.1-4.9)

#### 5. Bổ sung định nghĩa cho 3 đối tượng quản lý phụ — Hồ sơ pháp lý doanh nghiệp / Tư liệu pháp luật vụ việc / Đánh giá chất lượng tư vấn

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Ngoài đối tượng chính là vụ việc tư vấn, nhóm Tư vấn pháp luật chuyên sâu còn có 3 đối tượng quản lý phụ tương ứng các nghiệp vụ trong file Danh sách UC + Transaction: Hồ sơ pháp lý doanh nghiệp (cán bộ nghiệp vụ và Người hỗ trợ pháp lý dùng để lưu giấy phép, hợp đồng, giấy chứng nhận, quyết định pháp lý của doanh nghiệp; Cổng Pháp luật Quốc gia có thể đẩy hồ sơ vào hệ thống); Tư liệu pháp luật vụ việc (cán bộ nghiệp vụ gắn vào vụ việc tư vấn, có thể công khai lên Cổng); Đánh giá chất lượng tư vấn (điểm và nhận xét doanh nghiệp gửi qua Cổng sau khi nhận kết quả tư vấn). v3 chỉ tham chiếu 3 đối tượng này trong các nghiệp vụ FR-X.1-04 đến FR-X.1-07 mà KHÔNG có Định nghĩa thực thể chính thức — lập trình viên không có cơ sở thiết kế bảng dữ liệu, không kiểm chứng được các tham chiếu chéo, dẫn tới mỗi phần triển khai tự dựng cấu trúc khác nhau.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Tổng quan thực thể §4 trong v3 chỉ liệt kê 8 đối tượng (3 sở hữu trong nhóm: Tư vấn chuyên sâu, Phiên tư vấn, Lịch sử trao đổi; 5 tham chiếu từ nhóm khác). Hoàn toàn KHÔNG có Hồ sơ pháp lý doanh nghiệp, Tư liệu pháp luật vụ việc và Đánh giá chất lượng tư vấn — dù các nghiệp vụ FR-X.1-04 đến FR-X.1-07 đều thao tác trên 3 đối tượng này. v4 bổ sung 3 mục Định nghĩa thực thể đầy đủ (3.4.3.46/47/48) kèm ước lượng dung lượng → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §4 Tổng quan đối tượng dữ liệu — bảng liệt kê thêm 3 đối tượng sở hữu (line 1185-1187)
- §4 Định nghĩa thực thể 3.4.3.46 Hồ sơ pháp lý doanh nghiệp (line 1356, kéo dài đến line 1384)
- §4 Định nghĩa thực thể 3.4.3.47 Tư liệu pháp luật vụ việc (line 1386, kéo dài đến line 1413)
- §4 Định nghĩa thực thể 3.4.3.48 Đánh giá chất lượng tư vấn (line 1415, kéo dài đến line 1438)
**Tham chiếu delta:** Thay đổi 5 (5.1-5.4)

#### 6. Doanh nghiệp tự chọn cơ quan tiếp nhận khi gửi yêu cầu tư vấn pháp luật chuyên sâu (cả qua Cán bộ nghiệp vụ và qua Cổng)

**Phân loại:** A-ITEM-06 (đã mở rộng C-2)
**Bối cảnh nghiệp vụ:** Khi doanh nghiệp gửi yêu cầu tư vấn pháp luật chuyên sâu qua Cổng Pháp luật Quốc gia, doanh nghiệp cần được quyền chọn cơ quan tiếp nhận yêu cầu — vì doanh nghiệp biết rõ lĩnh vực vướng mắc nên muốn gửi thẳng cơ quan có chuyên môn (ví dụ doanh nghiệp tại Hà Nội có vướng mắc về xuất nhập khẩu muốn gửi thẳng Bộ Công Thương thay vì gửi qua Sở Tư pháp Hà Nội rồi mới chuyển tiếp). v3 mặc định cơ quan tiếp nhận là đơn vị của cán bộ tiếp nhận, doanh nghiệp không có quyền chọn — không phù hợp với tinh thần của Nghị định 55/2019 (doanh nghiệp có quyền yêu cầu hỗ trợ pháp lý với cơ quan có thẩm quyền). Quyết định Q-04 đã chốt: Cổng để doanh nghiệp chọn từ danh sách tất cả các cơ quan, mặc định là Sở Tư pháp tỉnh/thành nơi doanh nghiệp đăng ký kinh doanh; quyết định Q-05 chốt: hệ thống tự lọc theo cơ quan, cán bộ ở cơ quan khác không thấy yêu cầu này. Sau cổng duyệt 2b, BA quyết áp dụng đầy đủ ITEM-06 cho cả 2 nguồn nhận yêu cầu (cán bộ nghiệp vụ tự nhập + Cổng tự gửi qua đầu mối tiếp nhận) và bổ sung quy tắc định tuyến.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — báo cáo phân tích yêu cầu thay đổi mục ITEM-06 phần D.4 ghi rõ: "Áp dụng cho FR-X.1 — khi doanh nghiệp gửi từ Cổng (UC149): doanh nghiệp chọn (mặc định Sở Tư pháp); khi cán bộ nghiệp vụ tạo: đơn vị của cán bộ". v4 thêm trường Cơ quan tiếp nhận vào phần Đầu vào của FR-X.1-01 và mở rộng mô tả trong Định nghĩa thực thể. Sau cổng duyệt 2b, mở rộng tiếp Đầu vào FR-X.1-03 (đầu mối tiếp nhận tự động từ Cổng cũng nhận tham số Cơ quan tiếp nhận, nếu Cổng không gửi thì áp mặc định Sở Tư pháp tỉnh DN) và bổ sung quy tắc định tuyến BR-ROUTE-TVCS-01 trong §6 → A-ITEM-06.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-01 phần Đầu vào — thêm trường Cơ quan tiếp nhận (line 113)
- §2 FR-X.1-03 phần Đầu vào — thêm trường Cơ quan tiếp nhận do doanh nghiệp chọn ở Cổng (line 436)
- §2 FR-X.1-03 phần Xử lý bước 3a — kiểm tra Cơ quan tiếp nhận hợp lệ và áp mặc định nếu thiếu (line 447)
- §4 Định nghĩa thực thể 3.4.3.9 — phần ghi chú trường Cơ quan tiếp nhận (line 1298)
- §6 Quy tắc nghiệp vụ — thêm BR-ROUTE-TVCS-01 vào bảng Tổng quan (line 1520) và phần định nghĩa chi tiết (line 1591, kéo dài đến line 1595)
**Tham chiếu delta:** Thay đổi 6 (6.1-6.5)

#### 7. Bộ 5 thông tin công khai lên chuyên trang cho Tư vấn chuyên sâu và Tư liệu pháp luật vụ việc — đầy đủ 5 tầng

**Phân loại:** A-ITEM-01 (đã mở rộng C-3)
**Bối cảnh nghiệp vụ:** Đối tác yêu cầu cán bộ nghiệp vụ công khai 12 danh sách lên chuyên trang để doanh nghiệp tra cứu, với bộ 5 thông tin chuẩn cho mỗi mục công khai: nút bật/tắt công khai, ảnh đại diện, thời điểm đăng tải, mô tả hiển thị, file đính kèm phiên bản công khai. Trong nhóm Tư vấn pháp luật chuyên sâu có 2 đối tượng thuộc 12 danh sách công khai: Danh sách 9 "Tư vấn chuyên sâu" tương ứng đối tượng Tư vấn chuyên sâu, Danh sách 3 "Tài liệu hỗ trợ pháp lý" tương ứng đối tượng Tư liệu pháp luật vụ việc (theo Q-01). Yêu cầu full stack 5 tầng: thực thể + Đầu vào + Xử lý + Màn hình + Quy tắc nghiệp vụ BR-PUBLIC-01/02/03.
**Bằng chứng & lý do:** Đây là **Yêu cầu thay đổi của đối tác TT CNTT** — bảng yêu cầu thay đổi mục ITEM-01 phần D.1 trong file phân tích liệt kê hai dòng cần sửa cho file FR-12: thêm 5 trường công khai cho đối tượng Tư vấn chuyên sâu và thêm 4 trường cho đối tượng Tư liệu pháp luật vụ việc (đối tượng Tư liệu đã có trạng thái Công khai sẵn nên chỉ thêm 4 trường còn thiếu cho đủ bộ 5). ITEM-01 phần D.2 định nghĩa 3 quy tắc nghiệp vụ BR-PUBLIC-01/02/03; phần D.3 chốt mapping trạng thái cho phép công khai: Tư vấn chuyên sâu = "Đã duyệt"; Tư liệu = "bất kỳ" (theo BR-FLOW-07 sẵn có). Sau cổng duyệt 2b ngày 2026-05-06, v4 đã được mở rộng cover đủ 5 tầng → A-ITEM-01.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-01 phần Đầu vào — 5 trường công khai (line 114-118)
- §2 FR-X.1-01 phần Xử lý — 2 khối "Công khai chuyên trang" (line 229, kéo dài đến line 238) và "Hủy công khai chuyên trang" (line 240, kéo dài đến line 248)
- §2 FR-X.1-01 danh sách Quy tắc nghiệp vụ áp dụng — thêm BR-ROUTE-TVCS-01, BR-PUBLIC-01, BR-PUBLIC-02, BR-PUBLIC-03 (line 271-274)
- §2 FR-X.1-06 phần Xử lý — mở rộng khối "Công khai lên Cổng" (line 845, kéo dài đến line 854) và khối "Hủy công khai" (line 856, kéo dài đến line 863) với mô tả/ảnh/file công khai và thời điểm đăng tải tự động
- §3 Màn hình SCR-X1-01 — thanh hành động hàng loạt mở rộng (Công khai / Hủy công khai hàng loạt cho bản ghi đã duyệt) (line 1082)
- §3 Màn hình SCR-X1-02 — thêm Tab gấp 8b "Công khai chuyên trang" (line 1129), mở rộng Thanh hành động trạng thái "Đã duyệt" (line 1130), bổ sung Quy tắc tương tác (line 1139)
- §4 Định nghĩa thực thể 3.4.3.9 — 5 trường công khai cho đối tượng Tư vấn chuyên sâu (line 1299-1303)
- §4 Định nghĩa thực thể 3.4.3.47 — 5 trường công khai cho đối tượng Tư liệu pháp luật vụ việc (line 1407-1411)
- §6 Quy tắc nghiệp vụ — thêm 3 mục BR-PUBLIC vào bảng Tổng quan (line 1521-1523) và 3 phần định nghĩa chi tiết: BR-PUBLIC-01 (line 1597), BR-PUBLIC-02 (line 1603), BR-PUBLIC-03 (line 1609)
**Tham chiếu delta:** Thay đổi 7 (7.1-7.12)

#### 8. Bổ sung 6 khối Xử lý còn thiếu cho FR-X.1-04 (Hồ sơ pháp lý doanh nghiệp) và FR-X.1-06 (Tư liệu pháp luật vụ việc)

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hai chức năng quản lý hồ sơ pháp lý của doanh nghiệp (FR-X.1-04, UC150) và quản lý tư liệu pháp luật của vụ việc (FR-X.1-06, UC152) là 2 chức năng quản lý dữ liệu cơ bản (xem danh sách, thêm, sửa, xóa, tìm kiếm, xuất file, công khai). v3 lại thiếu nhiều bước xử lý nghiệp vụ căn bản: với hồ sơ pháp lý thì thiếu "Xem chi tiết" và "Xuất Excel" mặc dù màn hình SCR-X1-03 đã có nút và Tiêu chí chấp nhận đã yêu cầu; với tư liệu pháp luật thì thiếu "Chỉnh sửa / Xóa mềm / Xóa file đính kèm / Tìm kiếm" mặc dù Tiêu chí chấp nhận có đề cập. Cán bộ nghiệp vụ và Người hỗ trợ pháp lý không có hướng dẫn rõ ràng về cách thực hiện các thao tác này, lập trình viên cũng không có cơ sở triển khai — đặc biệt nguy hiểm với thao tác "Sửa tư liệu đã công khai" (cần chặn để không thay đổi nội dung công khai sau khi doanh nghiệp đã thấy).
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Xử lý của FR-X.1-04 trong v3 chỉ có 5 khối (xem danh sách, thêm mới, chỉnh sửa, xóa, tìm kiếm), thiếu khối "Xem chi tiết" và "Xuất Excel" dù màn hình và Tiêu chí chấp nhận trong cùng file đã có. Phần Xử lý của FR-X.1-06 chỉ có 5 khối (xem danh sách, thêm mới, tải file, công khai, hủy công khai), thiếu 4 khối còn lại. Đây là mâu thuẫn nội bộ giữa phần Xử lý và phần Tiêu chí chấp nhận / Màn hình. v4 bổ sung 6 khối Xử lý còn thiếu (2 khối cho FR-X.1-04, 4 khối cho FR-X.1-06) → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-04 phần Xử lý — Xem chi tiết (line 606), Xuất Excel (line 616)
- §2 FR-X.1-06 phần Xử lý — Chỉnh sửa tư liệu (line 865), Xóa mềm tư liệu (line 876), Xóa file đính kèm (line 887), Tìm kiếm tư liệu (line 898)
**Tham chiếu delta:** Thay đổi 8 (8.1-8.6)

#### 9. Hợp đồng kỹ thuật cho 3 đầu mối tiếp nhận tự động từ Cổng Pháp luật Quốc gia

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Ba nghiệp vụ FR-X.1-03 (tiếp nhận yêu cầu tư vấn từ doanh nghiệp qua Cổng), FR-X.1-05 (đồng bộ hồ sơ pháp lý từ Cổng) và FR-X.1-07 (tiếp nhận đánh giá chất lượng tư vấn từ doanh nghiệp qua Cổng) đều là tiếp nhận thông tin tự động từ Cổng Pháp luật Quốc gia. Cổng và phần mềm hỗ trợ pháp lý là 2 hệ thống độc lập do 2 đơn vị khác nhau triển khai, nên cần một hợp đồng kỹ thuật cụ thể (đường liên kết tiếp nhận, phương thức gửi, thông tin xác thực) để 2 bên ăn khớp. v3 chỉ ghi chung chung "tiếp nhận tự động qua kết nối an toàn, có khóa xác thực" — không có thông tin cụ thể, dẫn tới mỗi bên triển khai theo cách riêng và không tích hợp được.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần mô tả của 3 nghiệp vụ FR-X.1-03, FR-X.1-05, FR-X.1-07 trong v3 chỉ có mô tả ở mức câu chữ về việc "tiếp nhận qua kết nối an toàn", thiếu hợp đồng kỹ thuật giữa 2 hệ thống. v4 bổ sung khối "Đầu mối tiếp nhận" cho từng nghiệp vụ với đầy đủ phương thức gửi, đường liên kết, thông tin xác thực và chuẩn an toàn → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-03 khối Đầu mối tiếp nhận (line 413, kéo dài đến line 417)
- §2 FR-X.1-05 khối Đầu mối tiếp nhận (line 686, kéo dài đến line 690)
- §2 FR-X.1-07 khối Đầu mối tiếp nhận (line 966, kéo dài đến line 970)
**Tham chiếu delta:** Thay đổi 9 (9.1-9.3)

#### 10. Quyền của Người hỗ trợ pháp lý với hồ sơ pháp lý doanh nghiệp trong vụ việc được phân công

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Người hỗ trợ pháp lý là cán bộ thuộc tổ chức đại diện cho doanh nghiệp, được phân công hỗ trợ doanh nghiệp xử lý từng vụ việc cụ thể. Khi được phân công, Người hỗ trợ pháp lý cần đọc và cập nhật hồ sơ pháp lý của doanh nghiệp đó để có đủ thông tin tư vấn. v3 chỉ ghi tác nhân chung là "cán bộ nghiệp vụ và Người hỗ trợ pháp lý", không nói rõ Người hỗ trợ chỉ được xem/sửa hồ sơ của doanh nghiệp nào và phạm vi tới đâu. Hậu quả: lập trình viên có thể cho Người hỗ trợ thấy hồ sơ của mọi doanh nghiệp (lộ dữ liệu các doanh nghiệp khác cùng cơ quan) hoặc chặn cứng không cho thấy gì cả (Người hỗ trợ không làm được nghiệp vụ).
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Tác nhân của FR-X.1-04 trong v3 chỉ ghi chung "cán bộ nghiệp vụ và Người hỗ trợ pháp lý" mà không có quy tắc lọc dữ liệu cụ thể cho Người hỗ trợ. Trong khi đó file Danh sách UC + Transaction §IV (UC41/42/49) đã ghi rõ "Người hỗ trợ" là tác nhân cho các nghiệp vụ liên quan vụ việc được phân công. v4 bổ sung 3 tiêu chí chấp nhận cho Người hỗ trợ pháp lý: (a) chỉ thấy hồ sơ của các doanh nghiệp có vụ việc đang được mình phụ trách trong cơ quan của mình, (b) ngoài phạm vi đó thì hệ thống từ chối truy cập, (c) chỉ được đọc và cập nhật, không được tạo mới và xóa → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §2 FR-X.1-04 phần Tiêu chí chấp nhận — 3 tiêu chí cuối cho Người hỗ trợ pháp lý (line 669-671)
**Tham chiếu delta:** Thay đổi 10 (10.1)

#### 11. Sửa BR-AUTH-01 về đúng mô hình xác thực 2 cách (cán bộ nội bộ qua mạng kín + Internet qua VNeID, không có VNPT eKYC)

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hệ thống có 2 nhóm người dùng cần đăng nhập theo 2 cách khác nhau: cán bộ nội bộ (Trung ương, Bộ ngành, Địa phương) làm việc qua mạng kín nội bộ; doanh nghiệp, tư vấn viên, cộng tác viên, Người hỗ trợ pháp lý truy cập qua Internet. Theo quyết định nội bộ dự án (chốt 2026-05-02), xác thực chỉ có 2 cách: cán bộ nội bộ dùng tên đăng nhập / mật khẩu kèm mã xác minh một lần; người dùng Internet đăng nhập qua VNeID theo Nghị định 69/2024. v3 đang ghi mô hình 3 cách có thêm dịch vụ định danh điện tử của VNPT — sai so với quyết định nội bộ và không phù hợp với khung pháp lý đã chốt.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần phát biểu của quy tắc BR-AUTH-01 trong v3 ghi 3 cách xác thực gồm tên đăng nhập/mật khẩu + mã xác minh, dịch vụ định danh VNPT, đăng nhập qua VNeID. v4 sửa thành mô hình 2 cách đúng với quyết định dự án (cán bộ nội bộ qua mạng kín dùng tên đăng nhập / mật khẩu + mã xác minh; người dùng Internet đăng nhập qua VNeID theo Nghị định 69/2024) → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §6 Quy tắc nghiệp vụ — phát biểu BR-AUTH-01 và Kiểm chứng (line 1529)
**Tham chiếu delta:** Thay đổi 11 (11.1-11.2)

#### 12. Bỏ trường "hình thức tư vấn" mồ côi ở cấp Vụ việc tư vấn chuyên sâu

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Hình thức tư vấn (gặp trực tiếp, gọi video, gọi điện thoại, qua hồ sơ giấy tờ) đặc trưng cho từng phiên tư vấn cụ thể, không phải cho cả vụ việc — vì một vụ việc có thể có nhiều phiên với hình thức khác nhau (ước lượng trung bình 2 phiên / vụ, 2.000 vụ thì có khoảng 4.000 phiên). Hình thức tư vấn vì vậy phải đặt ở cấp Phiên tư vấn, không đặt ở cấp Vụ việc. v3 có ghi trường hình thức tư vấn ở cấp vụ việc nhưng hoàn toàn không có chức năng / đầu vào / xử lý / màn hình nào trong nhóm này dùng tới — trường này tồn tại trong tài liệu mà không có ý nghĩa nghiệp vụ. Đối tượng Phiên tư vấn đã có trường hình thức riêng và nó là chỗ đúng.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — phần Lịch sử thay đổi của v4 đã ghi rõ lý do bỏ trường này: "Trường hình thức tư vấn ở cấp Vụ việc không được bất kỳ chức năng / đầu vào / xử lý / tiêu chí chấp nhận nào trong nhóm tham chiếu. Hình thức tư vấn được quản lý ở cấp Phiên tư vấn (4 hình thức bắt buộc) — phù hợp với mô hình một vụ việc có nhiều phiên." v4 đã bỏ trường này khỏi cả Sơ đồ quan hệ và Bảng thuộc tính của đối tượng Tư vấn chuyên sâu → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §4 Sơ đồ quan hệ thực thể — đối tượng Tư vấn chuyên sâu trong khối mermaid (line 1198-1213) đã bỏ dòng hình thức tư vấn
- §4 Định nghĩa thực thể 3.4.3.9 Bảng thuộc tính (line 1284-1303) đã bỏ dòng hình thức tư vấn (xác minh sạch: 0 lần xuất hiện chuỗi `hinh_thuc_tv` trong toàn file)
**Tham chiếu delta:** Thay đổi 12 (12.1-12.2)

#### 13. Liên kết Vụ việc tư vấn chuyên sâu với Hợp đồng tư vấn (Nhóm 14)

**Phân loại:** B1
**Bối cảnh nghiệp vụ:** Theo file Danh sách UC + Transaction §X.3 (UC159 "Quản lý hợp đồng tư vấn với chuyên gia"), doanh nghiệp nhỏ và vừa và chuyên gia có thể ký hợp đồng dịch vụ tư vấn pháp luật chuyên sâu — đây là nâng cấp từ phiên tư vấn miễn phí (công ích) sang hợp đồng dịch vụ có thu phí. Quan hệ này cần được lưu vết để cán bộ phụ trách biết được vụ tư vấn miễn phí nào đã chuyển sang hợp đồng có thu phí, tính được tỉ lệ chuyển đổi, và báo cáo cho lãnh đạo về hiệu quả của khâu tư vấn miễn phí. v3 chưa có liên kết giữa Tư vấn chuyên sâu và Hợp đồng tư vấn nên không truy vết được.
**Bằng chứng & lý do:** Đây là **Sửa lỗi nội bộ SRS** — file Danh sách UC + Transaction §X.3 đã có nghiệp vụ UC159 quản lý hợp đồng tư vấn với chuyên gia, có quan hệ logic với vụ việc tư vấn chuyên sâu (chuyển từ tư vấn miễn phí sang dịch vụ trả phí), nhưng v3 không thiết lập liên kết giữa hai đối tượng. v4 bổ sung trường liên kết tới Hợp đồng tư vấn (không bắt buộc, vì không phải vụ nào cũng chuyển thành hợp đồng) trong đối tượng Tư vấn chuyên sâu, kèm phần Ghi chú tham chiếu chéo sang nhóm 14 → B1.
**Vị trí đã sửa trong srs-v3.5/srs-fr-12-tv-chuyen-sau.md:**
- §4 Định nghĩa thực thể 3.4.3.9 — thêm trường liên kết Hợp đồng tư vấn (line 1297)
- §4 Định nghĩa thực thể 3.4.3.9 — phần Ghi chú tham chiếu chéo sang nhóm 14 (line 1305)
**Tham chiếu delta:** Thay đổi 13 (13.1-13.2)

### Thay đổi BA mark OUT — KHÔNG đưa vào v3.5

- **Thay đổi 14 (B1) — Note thang điểm doanh nghiệp đánh giá tư vấn chuyên sâu:** v4 mở rộng phần ghi chú trường điểm doanh nghiệp đánh giá ở cấp vụ việc, làm rõ thang 0-10 tách biệt với thang đánh giá tư vấn viên (1-5) và không đưa vào quy tắc tính điểm trung bình tư vấn viên BR-CALC-06. BA quyết định OUT ngày 2026-05-06, không đưa note này vào v3.5; trường điểm trong v3.5 (line 1293) giữ nguyên cách diễn đạt v3 ("Điểm DN đánh giá", có ràng buộc 0-10). Nếu sau này cần làm rõ phạm vi, có thể đưa vào lượt review tiếp theo.

### Bookkeeping ghi nhận FR-12

- **Phiên bản SRS:** đổi từ "3.0" → "3.5" ở line 4 header file.
- **Nguồn:** thêm dòng "**Nguồn:** clone từ srs-v3/... áp 13 thay đổi đã được BA mark IN" ở line 9 header.
- **Khối Lịch sử thay đổi inline trong file FR:** v4 có khối này (8 dòng, ngày 2026-04-03 đến 2026-05-06) ghi tiến trình build v4. v3.5 BỎ khối này vì là metadata quá trình build v4, không thuộc bất kỳ thay đổi nghiệp vụ nào trong delta. Lịch sử apply v3.5 ghi tại CHANGELOG này.
- **Số dòng file:** v3 = 1.297, v3.5 = 1.617 (tăng 320 dòng — do 7 khối Xử lý mới của FR-X.1-01 ở Thay đổi 4, 3 đối tượng phụ ở Thay đổi 5, đầy đủ 5 tầng công khai cho Thay đổi 7, 6 khối Xử lý ở Thay đổi 8, 4 quy tắc nghiệp vụ mới BR-ROUTE-TVCS-01 và BR-PUBLIC-01/02/03).

### Cảnh báo phụ thuộc cross-FR (xử lý ở Pha 3) — FR-12

- **Thay đổi 13 (Liên kết Hợp đồng tư vấn):** trường liên kết tham chiếu đối tượng Hợp đồng tư vấn ở nhóm 14 (FR-14). Pha 3 cần kiểm chứng tên định danh Hợp đồng tư vấn ở nhóm 14 khớp với phần ghi chú trong nhóm này.
- **Thay đổi 7 (BR-PUBLIC-01/02/03):** hiện 3 quy tắc nghiệp vụ này được định nghĩa cục bộ trong §6 file FR-12 (line 1597, 1603, 1609). ITEM-01 là yêu cầu xuyên suốt 12 đối tượng / 9 file FR. Pha 3 cần đồng bộ về `srs-v3.md` Phụ lục B để các file FR-02, FR-03, FR-04, FR-05, FR-09, FR-13 cũng dùng chung 3 quy tắc này thay vì mỗi file định nghĩa riêng.
- **Thay đổi 6 (BR-ROUTE-TVCS-01):** quy tắc định tuyến cục bộ trong §6 file FR-12 (line 1591). Pha 3 cần kiểm chứng pattern khớp với BR-ROUTE-HD-01 trong nhóm FR-02 (cùng tinh thần ITEM-06).
- **Thay đổi 11 (BR-AUTH-01 sửa về 2-tier):** quy tắc xác thực dùng chung cho 16 file FR. Pha 3 đồng bộ phát biểu BR-AUTH-01 ở các file FR khác về cùng nội dung.

### Gap ngoài delta phát hiện ở deep review (xử lý ở lượt review tiếp / Pha 3)

Đây là 5 điểm tinh chỉnh không nằm trong delta strict, nên không bị coi là sai apply, nhưng làm tài liệu chưa hoàn chỉnh theo template SRS:

1. **Sơ đồ quan hệ thực thể §4 (line 1198-1274) thiếu quan hệ cho 3 đối tượng mới** (Hồ sơ pháp lý doanh nghiệp / Tư liệu pháp luật vụ việc / Đánh giá chất lượng tư vấn) — chỉ thêm Định nghĩa, không vẽ quan hệ trong khối mermaid. Người đọc sơ đồ sẽ không thấy 3 đối tượng phụ.
2. **FR-X.1-01 phần Hậu điều kiện (line 292-296)** chưa nhắc tới luồng Công khai chuyên trang (Thay đổi 7).
3. **FR-X.1-01 phần Tiêu chí chấp nhận (line 308-315)** giữ 6 tiêu chí v3, chưa có tiêu chí cho 7 nhánh chuyển trạng thái mới (Thay đổi 4) và 2 luồng công khai (Thay đổi 7).
4. **FR-X.1-04 phần Tiêu chí chấp nhận** chưa thêm tiêu chí cho "Xem chi tiết" và "Xuất Excel" (Thay đổi 8.1, 8.2).
5. **Phần Mô tả của FR-X.1-01 / FR-X.1-04 / FR-X.1-06** chưa cập nhật để nhắc tới các luồng nghiệp vụ mới được bổ sung.

5 gap này thuộc category "đầy đủ nội dung tài liệu" chứ không phải "đúng nội dung delta", phù hợp xử lý ở lượt review tiếp theo hoặc giai đoạn đóng cuối Pha 3.
