# 10 câu hỏi cần anh/chị BA xác nhận trước khi QA test

**Ngày:** 2026-05-04 · **Gửi:** BA · **Từ:** QA team

---

## Tóm tắt 1 phút

Em đọc kỹ 3 file SRS mới (Hỏi đáp, Đào tạo, Tư vấn viên) và phát hiện **10 chỗ chưa rõ** — em không thể tự đoán được, phải nhờ anh/chị xác nhận.

**Trong 10 câu:**
- **7 câu nghiêm trọng** (em không test được nếu chưa có câu trả lời)
- **3 câu nhẹ** (em vẫn test được, nhưng cần xác nhận để chắc)

**Em mong anh/chị dành 30 phút đọc + reply.** Nếu có chỗ nào em viết khó hiểu, em sẵn sàng họp 30 phút giải thích thêm.

---

# 📩 Module Hỏi đáp pháp luật — 3 câu

## Câu 1. Cơ chế "Hủy công khai" hoạt động ra sao? — **NGHIÊM TRỌNG** 🔴

**Tình huống:** Cán bộ đã trả lời câu hỏi của doanh nghiệp xong, đã đẩy lên Cổng Pháp luật Quốc gia. Sau đó phát hiện **trả lời sai**, muốn gỡ xuống.

**Trong SRS có ghi nút "Hủy công khai" nhưng không nói cụ thể nó làm gì:**
- Hệ thống có gọi sang Cổng Pháp luật Quốc gia để bảo "gỡ xuống" không?
- Hay chỉ đánh dấu trong hệ thống là "đã hủy" nhưng trên Cổng PLQG vẫn còn?

**❓ Em cần BA chốt:**
- (A) Có gọi API sang Cổng PLQG để gỡ thật → cần biết Cổng có hỗ trợ API gỡ không
- (B) Chỉ đánh dấu local → trên Cổng PLQG dữ liệu cũ vẫn còn, dùng cho mục đích nội bộ thôi

→ **Tại sao cần biết:** QA phải test "sau khi hủy, dữ liệu trên Cổng PLQG còn hay không?". Không có câu trả lời → không biết test gì.

---

## Câu 2. Khi nào câu hỏi chuyển sang trạng thái "Hoàn thành"? — **NGHIÊM TRỌNG** 🔴

**Tình huống:** Sau khi cán bộ trả lời + lãnh đạo duyệt + đã công khai, hồ sơ này lúc nào sẽ kết thúc (Hoàn thành)?

**SRS có nút "Đóng hồ sơ" nhưng không nói:**
- Cán bộ nhấn nút thủ công?
- Hay sau X ngày tự đóng?

**❓ Em cần BA chốt:**
- (A) Cán bộ nhấn nút thủ công → khi nào nhấn? (sau X ngày? sau khi DN xác nhận hài lòng?)
- (B) Tự động đóng sau N ngày → N là bao nhiêu? (7 ngày, 30 ngày?)

→ **Tại sao cần biết:** QA phải test workflow "câu hỏi đi từ đầu đến cuối". Không biết khi nào kết thúc → không test được lifecycle đầy đủ.

---

## Câu 3. Cán bộ ở các cấp khác nhau cùng "Công khai hàng loạt" thì sao? — nhẹ 🟡

**Tình huống:** Cán bộ Trung ương chọn 10 câu hỏi trong list để công khai cùng lúc. Trong 10 câu đó:
- 7 câu thuộc Trung ương (cán bộ này có quyền)
- 3 câu thuộc Tỉnh (cán bộ này KHÔNG có quyền)

**SRS hiện tại nói:** "Cho phép nhấn nút Công khai → hệ thống tự skip 3 câu khác cấp + báo cáo cuối: 7 thành công, 3 lỗi vì khác cấp"

**Em thấy hơi lạ:** Cách thông thường là **không cho nhấn nút khi có câu khác cấp** — bắt người dùng tự bỏ chọn 3 câu kia. Như vậy rõ ràng hơn.

**❓ Em cần BA chốt:**
- (A) Cách thông thường: ngăn nhấn nút sớm, người dùng tự bỏ chọn (rõ ràng, an toàn)
- (B) Cách hiện tại trong SRS: cho nhấn + tự skip + báo cáo (linh hoạt nhưng dễ gây nhầm)

→ **Tại sao cần biết:** Cách (A) và (B) cho UX rất khác nhau. QA cần biết test theo cách nào.

---

# 🎓 Module Đào tạo — 3 câu

## Câu 4. Có 6 nhóm chức năng SRS chưa nói rõ — **NGHIÊM TRỌNG** 🔴

**Em phát hiện trong file SRS Đào tạo có 34 chỗ ghi marker "GAP-III-..." — nghĩa là tác giả SRS biết chỗ đó còn thiếu nhưng chưa kịp viết chi tiết.**

Em phân ra 6 nhóm:

| Nhóm | Nội dung chưa rõ |
|------|------------------|
| 1 | Quy trình **kích hoạt khóa học** (cán bộ nhấn gì, hệ thống làm gì) |
| 2 | Quy trình **kết thúc khóa học** (khi nào, ai làm) |
| 3 | Quy trình **hủy khóa học** (đã có người đăng ký rồi thì hủy thế nào) |
| 4 | Định nghĩa chi tiết **Kế hoạch đào tạo năm** + **Học viên** (có những trường thông tin gì) |
| 5 | **Lỗi gì** sẽ xảy ra khi cán bộ phê duyệt kết quả + công bố kết quả (cần list ra) |
| 6 | Spec **Lịch học buổi dạy** (chức năng mới hoàn toàn — ai tạo, sửa thế nào, xóa thế nào) |

**❓ Em cần BA chốt:** 6 nhóm này đã có quyết định nội bộ chưa?
- Nếu rồi → cụ thể là gì?
- Nếu chưa → khi nào BA chốt được? (vì QA chưa thể viết test case cho 6 nhóm này)

→ **Tại sao cần biết:** Đây là 34 chỗ trống trong spec. Không có thông tin → không có gì để test.

---

## Câu 5. Kết quả khóa học là 2 mức hay 5 mức? (mâu thuẫn trong cùng 1 file SRS) — **NGHIÊM TRỌNG** 🔴

**Trong cùng file SRS Đào tạo, em đọc thấy 2 chỗ ghi mâu thuẫn nhau:**

**Chỗ 1 (line 2007):** Kết quả học tập có **5 nhãn**:
- Đạt
- Không đạt
- Giỏi
- Khá
- Trung bình

**Chỗ 2 (line 2397 + line 631):** Kết quả học tập chỉ có **2 nhãn**:
- Đạt
- Không đạt

**❓ Em cần BA chốt:**
- (A) **2 mức** đơn giản: chỉ Đạt/Không đạt (không xếp loại)
- (B) **5 mức** đầy đủ: Đạt + xếp loại Giỏi/Khá/TB cho người Đạt
- (C) **Tùy loại đề kiểm tra:** đề trắc nghiệm = 2 mức, đề tự luận = 5 mức

→ **Tại sao cần biết:** Đây là mâu thuẫn rõ ràng trong cùng 1 file. Không chốt → màn hình hiển thị sai vì dev không biết build cái nào, QA cũng không biết test cái nào.

---

## Câu 6. Học viên đạt khóa học khi nào? Vắng bao nhiêu thì rớt? — **NGHIÊM TRỌNG** 🔴

**Tình huống cụ thể:** 1 khóa học có 10 buổi. Học viên Nguyễn Văn A vắng 3 buổi (1 buổi có phép, 2 buổi không phép). Điểm thi cuối khóa của A là 6/10.

**Hỏi:** A có **Đạt** khóa học này không?

**SRS hiện tại có:**
- Công thức tính tỷ lệ chuyên cần: `(số buổi có mặt + vắng có phép) / tổng buổi × 100%` → A có 80% chuyên cần
- Cột "kết quả": Đạt / Không đạt

**Nhưng SRS KHÔNG nói:**
- Tỷ lệ chuyên cần phải ≥ bao nhiêu % thì mới Đạt? (50%? 70%? 80%?)
- Điểm thi phải ≥ bao nhiêu thì mới Đạt? (5? 6? 7?)
- Phải đạt **cả 2** (chuyên cần AND điểm) hay chỉ cần đạt **1 trong 2**?

**❓ Em cần BA chốt:**
- Ngưỡng chuyên cần tối thiểu (vd: ≥ 70%)
- Điểm thi tối thiểu (vd: ≥ 5)
- Logic kết hợp:
  - (A) AND — phải đạt cả chuyên cần lẫn điểm thi
  - (B) OR — chỉ cần đạt 1 trong 2
- Ngưỡng cố định toàn hệ thống, hay mỗi khóa được tự đặt ngưỡng riêng?

→ **Tại sao cần biết:** QA phải test "khi nào hệ thống đánh giá Đạt, khi nào Không đạt". Không có ngưỡng → test sao biết đúng/sai?

---

# 👨‍⚖️ Module Tư vấn viên — 4 câu

## Câu 7. Cán bộ thẩm định Tư vấn viên dựa vào tiêu chí gì? — **NGHIÊM TRỌNG** 🔴

**Tình huống:** Một người đăng ký làm Tư vấn viên. Cán bộ phải thẩm định 4 nhóm tiêu chí:
1. **Pháp lý** (Đạt / Không đạt) — vd: có Thẻ TVV không
2. **Năng lực chuyên môn** (chấm thang 1-5) — vd: kinh nghiệm + bằng cấp
3. **Hiệu quả & uy tín** (chấm thang 1-5) — có thể bỏ qua nếu là TVV mới
4. **Mạng lưới** (Có / Không) — có tham gia mạng lưới không

Sau đó cán bộ kết luận: **Đạt / Không đạt / Yêu cầu bổ sung**.

**SRS nói:** "Cán bộ tự phán xét tổng hợp 4 nhóm — KHÔNG hard-code ngưỡng điểm" — chỉ có 1 quy tắc duy nhất: **Pháp lý phải Đạt**.

**Em đang phân vân:** Vậy cán bộ chấm cách nào cũng được hay sao?
- Ví dụ: Pháp lý = Đạt + Năng lực = 1 điểm/5 + Hiệu quả = 2/5 + Mạng lưới = Không → cán bộ vẫn có thể kết luận **Đạt** được không?
- Hay phải có hướng dẫn nội bộ "Năng lực ≥ 3 + Mạng lưới = Có mới được Đạt"?

**❓ Em cần BA chốt:**
- (A) Có hướng dẫn nội bộ cụ thể (vd: "≥3đ/5 cho mỗi nhóm") → cho QA xin để test
- (B) Cán bộ tự do hoàn toàn → QA chỉ test 1 quy tắc duy nhất là "nhóm Pháp lý phải Đạt"

→ **Tại sao cần biết:** Nếu không có chuẩn, QA không biết test "cán bộ kết luận Đạt là đúng hay sai".

---

## Câu 8. Người ngoài đăng ký Tư vấn viên qua kênh nào? — nhẹ 🟡

**SRS ghi:** "Ứng viên Tư vấn viên có thể đăng nhập qua **VNeID** *hoặc* đăng ký mới qua chuyên trang công khai (bằng email/CCCD)"

**Em phân vân chữ "hoặc":** cả 2 đều OK, hay phải chọn 1?

**❓ Em cần BA chốt:**
- (A) **Bắt buộc qua VNeID** — không nhận đăng ký bằng email/CCCD nữa (an toàn nhất)
- (B) **Cả 2 luồng đều OK** — tùy người dùng chọn (linh hoạt)
- (C) **Tùy giai đoạn** — giai đoạn đầu cho cả 2, sau khi VNeID ổn định thì bắt buộc

→ **Tại sao cần biết:** 2 luồng có cách verify danh tính khác nhau hoàn toàn (VNeID đã verify sẵn; email/CCCD cần thêm bước xác thực). QA phải test khác nhau.

---

## Câu 9. Người hỗ trợ pháp lý cũ trong hệ thống xử lý sao? — **NGHIÊM TRỌNG** 🔴

**Bối cảnh:** Trước đây "Người hỗ trợ" (NHT) lưu chung 1 bảng với Tư vấn viên (đánh dấu loại = "NHT"). SRS mới **tách Người hỗ trợ ra bảng riêng**.

**Vấn đề:** Trong hệ thống đang chạy đã có một số bản ghi NHT cũ. SRS mới **không nói** xử lý sao với chúng:

| Câu hỏi cụ thể | Hệ quả nếu không trả lời |
|---|---|
| Bản ghi NHT cũ → tự chuyển sang bảng mới? Hay xóa đi tạo lại? | Mất dữ liệu lịch sử |
| Vụ việc R6 đang phân công cho NHT cũ → còn xem được không? | Workflow đang chạy bị break |
| ID NHT cũ giữ nguyên hay sinh ID mới? | Báo cáo lịch sử bị sai |
| Nếu chuyển sai → có quay lại được không (rollback)? | Không có cách phục hồi |
| Tự động (script chạy 1 phát) hay làm thủ công từng record? | Ảnh hưởng giờ deploy |

**❓ Em cần BA + dev chốt:** Plan migration cụ thể từng câu trên.

→ **Tại sao cần biết:** Nếu không plan kỹ, sau khi deploy production sẽ **break các vụ việc đang chạy** (đang được phân công cho NHT cũ). QA cần test plan migration trước khi deploy thật.

---

## Câu 10. Module Vụ việc đã được dev sửa đồng bộ chưa? — **NGHIÊM TRỌNG** 🔴

**Bối cảnh:** Module Vụ việc (FR-V) có chức năng "Phân công vụ việc cho người hỗ trợ pháp lý" (UC59). Chức năng này **đọc dữ liệu Người hỗ trợ** từ module Tư vấn viên (FR-IV).

**SRS Tư vấn viên mới nhắc đến UC59 ở 5 chỗ khác nhau** — nghĩa là tác giả SRS giả định Vụ việc sẽ gọi sang Người hỗ trợ qua API mới.

**Vấn đề:** **Module Vụ việc KHÔNG nằm trong batch update lần này.** Em không biết dev đã sửa Vụ việc đồng bộ chưa.

**Tình huống xấu nếu không sửa đồng bộ:**
1. Deploy SRS update mới → Người hỗ trợ chuyển sang bảng mới
2. Vụ việc vẫn đọc từ bảng cũ → màn hình "Phân công vụ việc" hiện **list rỗng** (không tìm thấy người hỗ trợ nào)
3. Cán bộ không phân công vụ việc được → toàn bộ luồng VV bị block

**❓ Em cần BA chốt:**
- (a) Dev đã sửa Vụ việc để gọi đúng API mới chưa?
- (b) Nếu chưa → khi nào dev sửa? Có file SRS update cho Vụ việc không?
- (c) Lịch deploy: Tư vấn viên và Vụ việc cùng deploy 1 lần, hay tách?

→ **Tại sao cần biết:** Đây là **rủi ro cao nhất** trong batch này. Không sync kỹ → production sẽ break luồng phân công vụ việc.

---

# 📋 Tổng kết — em chia thứ tự ưu tiên

## 🔴 7 câu nghiêm trọng — cần BA reply trước khi QA mở round test mới

| # | Câu hỏi | Module |
|---|---------|--------|
| 1 | Hủy công khai có gọi API sang Cổng PLQG không | Hỏi đáp |
| 2 | Khi nào câu hỏi chuyển "Hoàn thành" | Hỏi đáp |
| 4 | 6 nhóm chức năng Đào tạo còn thiếu spec | Đào tạo |
| 5 | Kết quả khóa học 2 mức hay 5 mức (SRS mâu thuẫn) | Đào tạo |
| 6 | Ngưỡng chuyên cần + điểm thi để học viên Đạt | Đào tạo |
| 7 | Cán bộ thẩm định TVV theo tiêu chí gì | Tư vấn viên |
| 9 | Người hỗ trợ cũ migrate sao | Tư vấn viên |
| 10 | Module Vụ việc có sửa đồng bộ chưa | Tư vấn viên |

## 🟡 3 câu nhẹ — em vẫn test được, nhưng cần xác nhận

| # | Câu hỏi | Module |
|---|---------|--------|
| 3 | UX khi cán bộ chọn câu hỏi khác cấp + nhấn batch | Hỏi đáp |
| 8 | Người ngoài đăng ký TVV qua VNeID hay email | Tư vấn viên |

*Và 1 câu nữa em quên đưa vào table — đã bỏ vì là vấn đề BA tự xử với CĐT (cite điều khoản pháp lý).*

---

## 📞 Em đề xuất cách làm

1. **Anh/chị BA đọc file này (30 phút)** — reply OK/NOK + lý do từng câu
2. Câu nào khó → **họp 30 phút** để em giải thích thêm (gợi ý: câu 4, 6, 7, 9)
3. Câu 9 (migration NHT) + câu 10 (Vụ việc đồng bộ) → **cần BA mời dev họp cùng**
4. **Khi 7 câu nghiêm trọng đã có câu trả lời** → QA bắt đầu test theo plan đã chuẩn bị

---

## Một lưu ý nhỏ về cách em làm

Em đã rà SRS 2 lần để đảm bảo không bịa câu hỏi:
- **Lần 1:** AI agent tự đọc → đưa ra 14 câu
- **Lần 2:** Em verify lại từng câu bằng grep SRS → **loại 4 câu** (vì SRS đã trả lời rồi mà em không tìm thấy)

→ 10 câu hiện tại đều có quote line cụ thể trong SRS. Anh/chị có thể nhờ em show line nếu cần.

---

**Tham chiếu:**
- Plan test sau khi BA chốt: [`plan.md`](plan.md)
- Tóm tắt nội dung 3 file SRS: [`summary-for-BA.md`](summary-for-BA.md)
