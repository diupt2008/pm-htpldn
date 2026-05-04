# B.3 BR-FLOW: Quy tắc Workflow

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|-----------|---------|------------|
| BR-FLOW-01 | **Auto-transition "Đã trả lời" → "Chờ phê duyệt":** Khi CB NV tích "Đã trả lời" trên hỏi đáp, hệ thống TỰ ĐỘNG chuyển trạng thái sang "Chờ phê duyệt" (KHÔNG cần bước "Trình") | PRD FR-II-07, biên bản b3 | FR-II-07, FR-II-08 | — | Test state auto-transition |
| BR-FLOW-02 | **Phê duyệt hàng loạt:** CB PD có thể chọn nhiều bản ghi và phê duyệt hàng loạt (batch approve) | PRD FR-II-08 | FR-II-08 | Từ chối phải từng bản ghi (yêu cầu lý do) | Test batch approve N records |
| BR-FLOW-03 | **Không sửa/xóa sau phê duyệt:** Bản ghi đã ở trạng thái "Đã duyệt" hoặc "Hoàn thành" không thể chỉnh sửa hoặc xóa | Pattern IP-02 | Toàn bộ workflow entities | QTHT có thể force-edit (audit đặc biệt) | Test UPDATE on approved = error |
| BR-FLOW-04 | **Từ chối yêu cầu lý do:** Mọi hành động "Từ chối" phải nhập lý do. Lý do hiển thị cho người tạo ban đầu | Pattern IP-02 | FR-II-08, FR-III-18, FR-IV-07, FR-V.I-13, FR-V.II-12, FR-VI-09 | — | Test reject without reason = validation error |
| BR-FLOW-05 | **Công khai qua API trực tiếp (Cổng PLQG):** Chỉ bản ghi đã duyệt mới được công khai lên Cổng PLQG (REST trực tiếp, không qua LGSP). Hủy công khai gỡ khỏi Cổng | Pattern IP-03 | FR-II-08, FR-III-16, FR-IV-08, FR-VII-03, FR-XI-05 | Biểu mẫu nhóm VII: công khai KHÔNG cần phê duyệt | Test publish undrafted = error |
| BR-FLOW-06 | **Hồ sơ mới theo quy trình mới, hồ sơ cũ giữ quy trình cũ:** Khi thay đổi quy trình (FR-V.I-NEW-01), hồ sơ đang xử lý tiếp tục theo quy trình tại thời điểm tạo | FR-V.I-NEW-01 | FR-V.I-NEW-01 | — | Test version quy trình |
| BR-FLOW-07 | **Biểu mẫu nhóm VII: công khai trực tiếp, KHÔNG cần phê duyệt.** CB NV tự chịu trách nhiệm nội dung | PRD FR-VII-03, CĐT xác nhận | FR-VII-03, FR-VII-04 | — | Test publish without approve step |
| BR-FLOW-08 | **Báo cáo CT HTPLDN: ĐP + BN → TW tổng hợp.** ĐP/BN gửi BC đã duyệt lên TW. TW xem từng đơn vị + tổng hợp trên biểu mẫu TT17 | PRD FR-XI-08/09 | FR-XI-08, FR-XI-09 | — | Test aggregation flow |
| BR-FLOW-09 | ~~**Hủy/dời phiên tư vấn: trước 24h cho phép, sau 24h từ chối**~~ **LOẠI BỎ** — FR-X.1-09 đã xóa (C1-15, C2-3) | ~~PRD FR-X.1-09~~ | ~~FR-X.1-09~~ | — | — |
| BR-FLOW-10 | **Kho câu hỏi tư vấn nhanh: 3 nguồn bổ sung:** (1) Tự động từ hỏi đáp nhóm II đã duyệt, (2) Thêm thủ công (chờ duyệt), (3) Import (chờ duyệt) | PRD FR-X.2-01 | FR-X.2-01 | — | Test auto-import from HOI_DAP |

**Trạng thái:** ✅ CĐT xác nhận
