# B.6 BR-INTG: Quy tắc Tích hợp

| ID | Phát biểu quy tắc | Nguồn | Áp dụng FR | Ngoại lệ | Kiểm chứng |
|----|-------------------|-------|-----------|---------|------------|
| BR-INTG-01 | **Mô hình tích hợp hybrid 3 kênh (C-08a):** (1) LGSP cho HT nội bộ BTP (DVC, VBPL, Danh mục), (2) NDXP cho HT liên ngành (VNeID), (3) Trực tiếp cho Cổng PLQG (18 API), Email SMTP (thông báo), HT khác (UC55) | Thiết kế tổng thể Section 5.5, 8.1-8.2 | Nhóm XII, FR-V.I-03/05, FR-V.II-01, FR-VIII-20 | v1.6: Thay thế "tất cả qua LGSP" | Verify network topology per channel |
| BR-INTG-02 | **Bảo mật API: mTLS + token xác thực Bearer RS256.** Mọi API outbound phải xác thực qua 2 lớp (áp dụng cho cả kết nối trực tiếp với Cổng PLQG). Kênh Trực tiếp: token xác thực cho Cổng PLQG, API key cho HT khác (xem C-08a) | Architecture AD-05/06 | Nhóm XII | — | Test invalid token = 401 |
| BR-INTG-03 | **Rate limit: 100 requests/phút/consumer** | PRD Section 6.16 | Nhóm XII | — | Load test rate limit |
| BR-INTG-04 | **Response time API < 3 giây** | NFR-01, PRD | Nhóm XII | Báo cáo nặng có thể > 3s (async) | Performance test |
| BR-INTG-05 | **Retry policy: tối đa 3 lần, backoff exponential (1s, 2s, 4s)** (áp dụng cho API outbound realtime — Cổng PLQG)**.** Nếu vẫn fail → log lỗi + thông báo QTHT | FR-V.II-04, team design | FR-V.II-04, FR-V.I-12 | — | Test retry logic |
| BR-INTG-06 | **VNeID tích hợp theo mô hình 2-tier (NĐ69/2024/NĐ-CP thay thế NĐ59/2022):** Tier 1 (nội bộ qua mạng kín): username/password + TOTP 2FA — không cần CCCD vì user là cán bộ nội bộ. Tier 2 (Internet-facing): SSO VNeID qua OIDC Authorization Code flow (phương thức xác thực UX phía VNeID — PM không kiểm soát) — yêu cầu Chứng nhận ATTT cấp 3 + thỏa thuận Bộ Công an (thời gian phê duyệt ~30 ngày làm việc). **Không có tier VNPT eKYC IDCheck.** | PRD FR-VIII-20, NĐ69/2024/NĐ-CP | FR-VIII-20 | Tier 1 là fallback mặc định cho nội bộ. VNeID (Tier 2) chưa xác nhận có public OAuth2/OIDC endpoints | Test Tier 1 login + TOTP, test SSO VNeID Tier 2 |
| BR-INTG-07 | **Chỉ chia sẻ dữ liệu đã duyệt/công khai qua API.** Bản ghi draft/chờ duyệt KHÔNG xuất hiện trong API response | Pattern IP-03/05 | Nhóm XII | — | Test API filter trạng thái |

**Trạng thái:** ✅ CĐT xác nhận (LGSP) | 🟡 Đề xuất (VNeID flow, retry policy)
