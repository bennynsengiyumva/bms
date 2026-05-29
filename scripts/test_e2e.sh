#!/bin/bash

# Configuration
API_URL="http://localhost:3001/api"
ADMIN_EMAIL="admin@bms.rw"
ADMIN_PASSWORD="admin123"

# Colors for output
GREEN='\033[0-9;32m'
RED='\033[0-9;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== BMS End-to-End Workflow Test ===${NC}"

# 1. Login as Admin
echo "Logging in as admin..."
LOGIN_RES=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")
ADMIN_TOKEN=$(echo $LOGIN_RES | jq -r .token)

if [ "$ADMIN_TOKEN" == "null" ] || [ -z "$ADMIN_TOKEN" ]; then
  echo -e "${RED}Login failed!${NC}"
  echo $LOGIN_RES
  exit 1
fi
echo "Admin logged in successfully."

# 2. Get Church ID
CHURCH_ID=$(curl -s -X GET "$API_URL/churches/churches" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.[0].id')
echo "Using Church ID: $CHURCH_ID"

# 3. Create a Pastor
PASTOR_EMAIL="pastor_$(date +%s)@example.com"
PASTOR_PASSWORD="pastor123"
echo "Creating a pastor: $PASTOR_EMAIL"
PASTOR_ID=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$PASTOR_EMAIL\",
    \"password\": \"$PASTOR_PASSWORD\",
    \"fullName\": \"Test Pastor\",
    \"role\": \"pastor\",
    \"churchId\": \"$CHURCH_ID\"
  }" | jq -r .user.id)

# Get Pastor Token
PASTOR_TOKEN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$PASTOR_EMAIL\", \"password\": \"$PASTOR_PASSWORD\"}" | jq -r .token)
echo "Pastor created and logged in. UserID: $PASTOR_ID"

# 4. Register a Candidate
CAND_EMAIL="candidate_$(date +%s)@example.com"
echo "Registering a candidate: $CAND_EMAIL"
CAND_RES=$(curl -s -X POST "$API_URL/candidates/register" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$CAND_EMAIL\",
    \"password\": \"candidate123\",
    \"fullName\": \"John E2E\",
    \"churchId\": \"$CHURCH_ID\",
    \"gender\": \"M\",
    \"dateOfBirth\": \"1990-01-01\"
  }")
CANDIDATE_ID=$(echo $CAND_RES | jq -r .id)
CANDIDATE_USER_ID=$(echo $CAND_RES | jq -r .userId)
echo "Candidate created. ID: $CANDIDATE_ID, UserID: $CANDIDATE_USER_ID"

# 5. Complete Lessons
echo "Logging all lesson completions..."
LESSONS=$(curl -s -X GET "$API_URL/lessons" -H "Authorization: Bearer $ADMIN_TOKEN")
for LESSON_ID in $(echo "$LESSONS" | jq -r '.[].id'); do
  curl -s -X POST "$API_URL/lessons/candidate/$CANDIDATE_ID/log" \
    -H "Authorization: Bearer $ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"lessonId\": \"$LESSON_ID\",
      \"completionDate\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",
      \"understandingScore\": 5
    }" > /dev/null
done
PROGRESS=$(curl -s -X GET "$API_URL/lessons/candidate/$CANDIDATE_ID/progress" -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r .progressPercentage)
echo "Candidate progress: $PROGRESS%"

# 6. Spiritual Interview
echo "Scheduling and logging interview as 'Ready'..."
INTERVIEW_ID=$(curl -s -X POST "$API_URL/spiritual/candidate/$CANDIDATE_ID/interviews" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"interviewerId\": \"$PASTOR_ID\",
    \"interviewDate\": \"$(date -u +%Y-%m-%dT%H:%M:%SZ)\"
  }" | jq -r .id)

curl -s -X PATCH "$API_URL/spiritual/interviews/$INTERVIEW_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"readinessScore\": 95,
    \"feedback\": \"Excellent candidate.\",
    \"isReady\": true
  }" > /dev/null

CAND_STATUS=$(curl -s -X GET "$API_URL/candidates/$CANDIDATE_ID" -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r .status)
echo "Candidate status after interview: $CAND_STATUS"

# 7. Baptism Event
echo "Creating baptism event..."
EVENT_ID=$(curl -s -X POST "$API_URL/baptism/events" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"eventDate\": \"$(date -u -d "+1 day" +%Y-%m-%dT10:00:00Z)\",
    \"location\": \"River Side\",
    \"officiatingPastorId\": \"$PASTOR_ID\",
    \"churchId\": \"$CHURCH_ID\"
  }" | jq -r .id)
echo "Event created: $EVENT_ID"

# 8. Baptism Record
echo "Recording baptism..."
RECORD_ID=$(curl -s -X POST "$API_URL/baptism/records" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"candidateId\": \"$CANDIDATE_ID\",
    \"eventId\": \"$EVENT_ID\",
    \"certificateNumber\": \"CERT-$(date +%s)\"
  }" | jq -r .id)
echo "Baptism recorded: $RECORD_ID"

# 9. Pastor Signature
echo "Signing record as pastor..."
SIGN_RES=$(curl -s -X POST "$API_URL/baptism/records/$RECORD_ID/sign" \
  -H "Authorization: Bearer $PASTOR_TOKEN")
SIGNED_AT=$(echo $SIGN_RES | jq -r .signedAt)

if [ "$SIGNED_AT" != "null" ]; then
  echo -e "${GREEN}Record signed successfully at $SIGNED_AT${NC}"
else
  echo -e "${RED}Signature failed!${NC}"
  echo $SIGN_RES
fi

# 10. Verify Membership
echo "Verifying membership..."
MEMBER_CHECK=$(curl -s -X GET "$API_URL/members" -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r ".[] | select(.userId == \"$CANDIDATE_USER_ID\")")

if [ -n "$MEMBER_CHECK" ]; then
  echo -e "${GREEN}SUCCESS: Candidate is now a Member!${NC}"
else
  echo -e "${RED}FAILURE: Membership transition failed.${NC}"
fi

echo -e "${GREEN}=== End-to-End Test Complete ===${NC}"
