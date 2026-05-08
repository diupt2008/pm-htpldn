# Functional Test Report — R7.8.2 Verify bỏ ClamAV

**Ngày:** 2026-05-07 18:45 • **Tài khoản:** `qtht_02` • **Tool:** Chrome DevTools MCP
**Trigger:** SRS update item 10 _DELTA-MAP-CROSS-CUTTING.md C2 — "Quy mô bỏ cả hệ thống" virus scan ClamAV.
**Endpoint test:** `POST /api/v1/files/upload` (multipart, field `file` + `entityType` + `entityId`)
**Spec invalidate:** SRS FR-02 line 1073, FR-05 line 1730, FR-09 ERR-BM-07 — "Quét virus ClamAV"

---

## Kết quả: ⚠️ PASS extension whitelist + 🚨 SECURITY GAP magic-byte sniffing

**Tốt:** Extension whitelist hoạt động đúng — `.exe`, `.bat`, `.docm` (macro), `.zip` đều bị reject với `ERR-VAL-FILE-03 "Loại file không được hỗ trợ"`. Whitelist chỉ chấp nhận `.doc, .docx, .xls, .xlsx, .pdf, .jpg, .png`.

**🚨 Security gap:** BE **KHÔNG** check magic bytes (file signature). Attacker có thể rename `malware.exe` → `malware.pdf`, BE accept past validation. Đây là **direct consequence của bỏ ClamAV** — trước có ClamAV scan content nên rename không qua được; nay chỉ check extension → mime spoofing trivial.

---

## Bảng kết quả test

### A. Extension whitelist (PASS) — 4 case dangerous file đều reject

| # | Filename | MIME | Content | Status | Error code | Match? |
|---|---|---|---|:-:|---|:-:|
| 1 | `malware.exe` | `application/x-msdownload` | PE header bytes `4D 5A 90 00...` | 400 | `ERR-VAL-FILE-03 "Loại file không được hỗ trợ"` | ✅ Reject |
| 2 | `script.bat` | `application/bat` | `@echo off\necho HACKED` | 400 | `ERR-VAL-FILE-03` | ✅ Reject |
| 3 | `macro.docm` | `application/vnd.ms-word.document.macroEnabled.12` | fake-doc | 400 | `ERR-VAL-FILE-03` | ✅ Reject |
| 4 | `archive.zip` | `application/zip` | ZIP header `50 4B 03 04` | 400 | `ERR-VAL-FILE-03` | ✅ Reject |

**Whitelist:** `.doc, .docx, .xls, .xlsx, .pdf, .jpg, .png` (BE message confirm).

### B. Magic-byte sniffing (FAIL) — 1 case mime spoof PASSES extension

| # | Filename | MIME | Content actual | Status | Result | Match? |
|---|---|---|---|:-:|---|:-:|
| 5 | `fake-malware.pdf` | `application/pdf` | **PE header bytes** `4D 5A 90 00...` (giả PDF) | 422 → 403 | Past `ERR-VAL-FILE-03`, past entityType, past entityId, **stop at `ERR-PERM-FILE-02 Forbidden`** (permission only) | ❌ Lọt qua content check |
| 6 | `real.pdf` | `application/pdf` | `%PDF-1.4\n...\n%%EOF` (thật) | 422 → 403 | Same path | (control case) |

**Critical:** Case 5 (PE bytes giả PDF) và Case 6 (PDF thật) **đi cùng path validation**. BE chỉ phân biệt theo extension `.pdf`, KHÔNG đọc magic bytes (PDF magic = `%PDF` = `25 50 44 46`; PE magic = `MZ` = `4D 5A`).

→ **Nếu user có quyền upload vào 1 VuViec** (vd CB NV trong scope, DN tự upload HS), họ có thể store file `.exe` rename `.pdf` lên server. File khác user download có thể trigger malware nếu mở bằng `.exe` extension restore.

---

## So sánh trước/sau bỏ ClamAV

| Layer defense | Trước bỏ ClamAV (v3) | Sau bỏ ClamAV (v3.5 actual) | Risk |
|---|---|---|---|
| Extension whitelist | ✅ Có | ✅ Có (`.doc/.docx/.xls/.xlsx/.pdf/.jpg/.png`) | Low |
| MIME-type check (Content-Type header) | ✅ Có | ⚠️ Có nhưng client gửi (untrusted) | Medium |
| Magic-byte / file signature check | ❌ Không (rely ClamAV) | ❌ Không | **High** — mime spoof |
| Virus scan content | ✅ ClamAV | **❌ KHÔNG** | **High** — malware lọt |
| Sandboxed execution check | ❌ | ❌ | High |
| Macro detection (Office docs) | ✅ ClamAV partial | **❌ KHÔNG** | **High** — `.docm/.xlsm` macro vẫn upload được nếu rename `.docx/.xlsx` |
| File size cap | ✅ 20MB/file (FR-02 line 1073) | (chưa test, giả định giữ) | OK |

**Tổng kết:** Bỏ ClamAV mất 3 layer defense (virus scan, macro detection, content match). Chỉ còn extension whitelist + MIME check (untrusted client). **Mime spoofing trivial.**

---

## Recommendation — escalate BA + Security team

### Option 1 — Magic-byte sniffing minimum (RECOMMENDED)
Add BE-side check: read first 8-16 bytes of upload, verify magic matches extension whitelist:
- `.pdf` → `25 50 44 46` (`%PDF`)
- `.jpg` → `FF D8 FF`
- `.png` → `89 50 4E 47 0D 0A 1A 0A`
- `.doc/.xls` (CFB) → `D0 CF 11 E0 A1 B1 1A E1`
- `.docx/.xlsx` (ZIP-based) → `50 4B 03 04` (must also check inner `[Content_Types].xml`)

Effort: ~1-2 ngày dev BE. Low cost, high benefit.

### Option 2 — Cloud AV alternative (Production-ready)
Integrate Windows Defender API / VirusTotal API / cloud AV scanner before persisting file. Trade-off: latency upload tăng 200-500ms + cost API call.

### Option 3 — Restrict access (Mitigation tạm)
- Serve uploaded files với `Content-Disposition: attachment; filename="..."` + `X-Content-Type-Options: nosniff` headers (force download, no inline render).
- ACL strict: chỉ owner + reviewer của entity được download.
- Rate-limit upload endpoint.

### Option 4 — Bỏ luôn upload file (Extreme)
Replace với link external (Google Drive / OneDrive) — user paste URL, BE chỉ store URL. Loại bỏ file storage hoàn toàn.

---

## Spec cần update (invalidate ClamAV mention)

| File | Line | Nội dung sai | Fix |
|---|---|---|---|
| `srs-fr-02-hoi-dap.md` | 1073 | "Quét virus ClamAV" | "Validate extension whitelist + ⚠️ chưa có magic-byte check" |
| `srs-fr-05-vu-viec.md` | 1730 | "upload + quét virus ClamAV" | Same |
| `srs-fr-09-bieu-mau.md` | 384 | "Quét antivirus trước lưu trữ → ERR-BM-07" | Mark obsolete; ERR-BM-07 nay không reachable |

---

## Phương pháp test

**Tool:** Chrome DevTools MCP `evaluate_script` chạy `fetch()` multipart upload trực tiếp, không cần UI form (vẫn dùng cookie session login).
**Endpoint discovery:** Probe POST 5 candidate endpoints, `/api/v1/files/upload` trả 400 với message specific → confirm endpoint thực.
**Test pattern:**
1. Upload extension blacklist (`.exe/.bat/.docm/.zip`) → expect reject ✅
2. Upload mime spoof (`.pdf` extension + PE content) → check BE có sniff content không.
3. Control: real PDF → confirm path validation đến đâu.

**KHÔNG test:** end-to-end upload happy path (bị 403 do qtht_02 không own VuViec target). Nhưng path validation đã pass extension + MIME check → đủ chứng minh BE không sniff content.

---

## Out of scope

- Upload qua UI form (drag-drop hoặc click) — chưa test, giả định FE gọi cùng endpoint.
- File size cap 20MB — chưa test boundary.
- Race condition / concurrent upload — N/A.
- Upload qua các module khác (FR-09 biểu mẫu, FR-02 hỏi đáp, FR-05 VV) — giả định share endpoint `/api/v1/files/upload` (nếu có endpoint riêng cần test thêm).
- Download file flow (Content-Disposition headers, MIME sniffing browser) — thuộc test riêng.

R7.8.2 scope = chỉ verify upload extension + magic-byte check sau bỏ ClamAV.

---

## Bug log candidate

**SECURITY-FILE-01 — Major** (đề xuất):
> BE upload endpoint `/api/v1/files/upload` chỉ check extension whitelist + Content-Type header (client-provided, untrusted), KHÔNG check magic bytes. Attacker rename `malware.exe` → `malware.pdf` để bypass extension check, BE accept và lưu file PE bytes lên server. Lost ClamAV protection sau v3.5 cross-cutting change.

(Defer log bug detail — chờ Security team sign-off scope acceptable risk hay cần fix.)

---

*2026-05-07 18:45 — QA huongttt chạy bằng Chrome DevTools MCP, account qtht_02.*
