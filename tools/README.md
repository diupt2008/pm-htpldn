# QA Tools — MEGA-CHAIN runner + templates

Tools để QA test app HTPLDN nhanh hơn. Giảm thời gian 47 TC từ ~185 phút (pattern sai 1 TC = 1 Bash) xuống ~30 phút (batch với mega-chain).

**Docs:** Xem [CLAUDE.md §Rule 11](../CLAUDE.md) và [memory/qa_htpldn_selectors_library.md](~/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_selectors_library.md).

## Files

```
tools/
├── mega-chain-runner.sh           # Runner: cleanup + chain execute
└── chain-templates/
    ├── login-qtht_tw.json         # Login QTHT_TW (8 steps)
    └── navigate-dm-dungchung.json # Nav to Danh mục dùng chung (5 steps)
```

## Usage pattern

### Pattern 1: Single mega-chain (1 login + tests all in 1 chain ≤12 step)

```bash
# Xây chain = login + navigate + tests
cat > /tmp/mega.json <<'EOF'
[
  # ← paste nội dung login-qtht_tw.json
  # ← paste nội dung navigate-dm-dungchung.json
  # ← thêm test actions (≤3-4 test action để cap tổng ≤15 step)
  ["click","button:has-text(\"Thêm mới\")"],
  ["wait","input[placeholder=\"Nhập mã danh mục\"]"],
  ["fill","input[placeholder=\"Nhập mã danh mục\"]","TEST_001"],
  ["fill","input[placeholder=\"Nhập tên danh mục\"]","Test record"],
  ["click","button:has-text(\"Đồng ý\")"],
  ["js","new Promise(r=>setTimeout(r,2500))"],
  ["screenshot","/path/to/screenshots/TC-009.png"],
  ["js","JSON.stringify({tc:'TC-009', total:document.querySelector('.ant-pagination-total-text')?.textContent})"]
]
EOF

./tools/mega-chain-runner.sh /tmp/mega.json
```

### Pattern 2: Multi-chain trong 1 bash call (cho > 5 TC)

Khi batch lớn không fit 1 chain ≤15 step, split thành multiple chains trong CÙNG 1 Bash call — server stays alive giữa chains per Rule 10 Fix #1:

```bash
# Chain 1: login + navigate + batch test A
./tools/mega-chain-runner.sh /tmp/chain-A.json

# Chain 2: batch test B — CÙNG bash, --no-cleanup
./tools/mega-chain-runner.sh /tmp/chain-B.json --no-cleanup

# Chain 3: batch test C — CÙNG bash, --no-cleanup
./tools/mega-chain-runner.sh /tmp/chain-C.json --no-cleanup
```

**Quan trọng:** 3 lệnh trên phải ở cùng 1 Bash tool call (không tách message).

### Pattern 3: Preventive cleanup giữa batches

Sau ~8-10 chain trong session, browser server degrade. Khi thấy chain đầu tiên timeout → cleanup + restart:

```bash
./tools/mega-chain-runner.sh /tmp/chain-X.json  # cleanup + chạy
```

## Selector library

Xem [memory/qa_htpldn_selectors_library.md](~/.claude/projects/-Users-teamai-Downloads-antigravity-QA-skilkk/memory/qa_htpldn_selectors_library.md) — đã verify 2026-04-21.

**Must-know app quirks:**
- Form là **Drawer** không phải Modal
- Submit button **[Đồng ý]** không phải [Lưu]
- Row actions là **`<a>`** không phải `<button>`
- OTP selector: `input[inputmode="numeric"][maxlength="1"]` (KHÔNG `.ant-otp`)

## Batch size guidance

| Batch size | Kết quả |
|-----------|---------|
| 1 TC/chain | ⚠️ Lãng phí overhead (70s/TC) — chỉ dùng cho debugging |
| 3-5 TC/chain | ✅ Optimal — cap ≤15 step Playwright |
| 7-10 TC/chain | ⚠️ Dễ timeout — cần split |
| 15+ TC/chain | ❌ Gần như chắc chắn timeout — KHÔNG dùng |

## Speedup math

| Approach | Overhead/TC | 47 TC total |
|----------|-------------|-------------|
| 1 TC = 1 Bash (pattern SAI) | 70s | **185 phút** (measured 2026-04-20) |
| Mega-chain 5 TC/chain | 8s | **~30 phút** (theoretical, chưa measure) |
| + API seed bypass login | 3s | **~12 phút** (if gstack team implement) |
