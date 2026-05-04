#!/bin/bash
OUT=/tmp/permission-sweep-result.csv
echo "role,entity,http_code" > "$OUT"

# role|user pairs
ROLES="QTHT_TW|qtht_tw_4
QTHT_BN|qtht_bn_4
QTHT_DP|qtht_dp_4
CB_NV_TW|canbo_tw_4
CB_NV_BN|canbo_bn_4
CB_NV_DP|canbo_tinh_4
CB_PD_TW|lanhdao_tw_4
CB_PD_BN|lanhdao_bn_4
CB_PD_DP|lanhdao_dp_4
NHT|nht_user_4
TVV|tvv_user_4
CG|chuyengia_user_4"

# entity|endpoint pairs
ENDPOINTS="DANH_MUC|danh-muc?loaiDanhMuc=LINH_VUC_PL&size=1
TAI_KHOAN|tai-khoan?size=1
VAI_TRO|vai-tro?size=1
QUYEN_HAN|quyen-han?size=1
DON_VI|don-vi?size=1
CAU_HINH_SLA|cau-hinh/sla
AUDIT_LOG|audit-logs?size=1
THONG_BAO|thong-baos?size=1"

while IFS='|' read -r role user; do
  echo "--- $role ($user) ---" >&2
  LOGIN_RESP=$(curl -s -X POST http://103.172.236.130:3000/api/v1/auth/login \
    -H "Content-Type: application/json" -d "{\"username\":\"$user\",\"password\":\"Test@1234\"}")
  OTP=$(echo "$LOGIN_RESP" | python3 -c "import json,sys
try:
  d=json.loads(sys.stdin.read())
  print(d.get('data',{}).get('otpToken','') if d.get('success') else '')
except: print('')" 2>/dev/null)
  if [ -z "$OTP" ]; then
    echo "$role,_LOGIN_,FAIL" >> "$OUT"
    continue
  fi
  VERIFY=$(curl -s -X POST http://103.172.236.130:3000/api/v1/auth/verify-otp \
    -H "Content-Type: application/json" -d "{\"otpToken\":\"$OTP\",\"otpCode\":\"666666\"}")
  JWT=$(echo "$VERIFY" | python3 -c "import json,sys
try:
  d=json.loads(sys.stdin.read())
  print(d.get('data',{}).get('accessToken','') if d.get('success') else '')
except: print('')" 2>/dev/null)
  if [ -z "$JWT" ]; then
    echo "$role,_OTP_,FAIL" >> "$OUT"
    continue
  fi
  while IFS='|' read -r entity ep; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $JWT" "http://103.172.236.130:3000/api/v1/$ep")
    echo "$role,$entity,$CODE" >> "$OUT"
  done <<< "$ENDPOINTS"
done <<< "$ROLES"

echo "DONE"
wc -l "$OUT"
