#!/bin/bash

# Worker API Test Suite
# Run this script to verify all endpoints

BASE_URL="http://localhost:3001/api"
COLORS=true

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
  echo ""
  echo "========================================"
  echo "$1"
  echo "========================================"
}

print_success() {
  if [ "$COLORS" = true ]; then
    echo -e "${GREEN}✓ $1${NC}"
  else
    echo "✓ $1"
  fi
}

print_error() {
  if [ "$COLORS" = true ]; then
    echo -e "${RED}✗ $1${NC}"
  else
    echo "✗ $1"
  fi
}

print_info() {
  if [ "$COLORS" = true ]; then
    echo -e "${YELLOW}→ $1${NC}"
  else
    echo "→ $1"
  fi
}

#############################################
# TEST 1: Health Check
#############################################
print_header "TEST 1: Health Check"

response=$(curl -s -w "\n%{http_code}" "$BASE_URL/health" 2>/dev/null)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "200" ]; then
  print_success "Health check passed (200)"
else
  print_error "Health check failed ($http_code)"
  exit 1
fi

#############################################
# TEST 2: Failed Login (Wrong Password)
#############################################
print_header "TEST 2: Failed Login (Wrong Password)"

response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worker.uz","password":"wrongpassword"}' 2>/dev/null)
http_code=$(echo "$response" | tail -n1)

if [ "$http_code" = "401" ]; then
  print_success "Failed login returns 401"
else
  print_error "Expected 401, got $http_code"
fi

#############################################
# TEST 3: Successful Login
#############################################
print_header "TEST 3: Successful Login (Admin)"

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worker.uz","password":"password123"}' 2>/dev/null)

http_code=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@worker.uz","password":"password123"}' 2>/dev/null)

if [ "$http_code" = "200" ]; then
  print_success "Admin login successful"
  
  # Extract token
  ADMIN_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  ADMIN_USER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  
  echo "  Token: ${ADMIN_TOKEN:0:30}..."
  echo "  User ID: $ADMIN_USER_ID"
else
  print_error "Admin login failed"
  exit 1
fi

#############################################
# TEST 4: Candidate Login
#############################################
print_header "TEST 4: Successful Login (Candidate)"

response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"aziz.karimov@example.com","password":"password123"}' 2>/dev/null)

http_code=$(curl -s -w "%{http_code}" -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"aziz.karimov@example.com","password":"password123"}' 2>/dev/null)

if [ "$http_code" = "200" ]; then
  print_success "Candidate login successful"
  
  CANDIDATE_TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  CANDIDATE_USER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  
  echo "  Token: ${CANDIDATE_TOKEN:0:30}..."
  echo "  User ID: $CANDIDATE_USER_ID"
else
  print_error "Candidate login failed"
  exit 1
fi

#############################################
# TEST 5: Access Admin Metrics with Admin Token
#############################################
print_header "TEST 5: Admin Metrics (Valid Admin Token)"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/admin/metrics" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "x-user-id: $ADMIN_USER_ID" 2>/dev/null)

if [ "$http_code" = "200" ]; then
  print_success "Admin can access metrics (200)"
else
  print_error "Admin cannot access metrics (got $http_code)"
fi

#############################################
# TEST 6: Access Admin Metrics with Candidate Token
#############################################
print_header "TEST 6: Admin Metrics (Candidate Token - Should Fail)"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/admin/metrics" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -H "x-user-id: $CANDIDATE_USER_ID" 2>/dev/null)

if [ "$http_code" = "403" ]; then
  print_success "Candidate blocked from admin (403 Forbidden)"
else
  print_error "Expected 403, got $http_code"
fi

#############################################
# TEST 7: Access Without Token
#############################################
print_header "TEST 7: Access Without Token (Should Fail)"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/admin/metrics" 2>/dev/null)

if [ "$http_code" = "401" ]; then
  print_success "No token = 401 Unauthorized"
else
  print_error "Expected 401, got $http_code"
fi

#############################################
# TEST 8: Get Jobs (Public)
#############################################
print_header "TEST 8: Get Jobs (Public)"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/jobs" 2>/dev/null)

if [ "$http_code" = "200" ]; then
  print_success "Jobs list accessible"
else
  print_error "Jobs endpoint failed (got $http_code)"
fi

#############################################
# TEST 9: Get Matching Jobs (Candidate Only)
#############################################
print_header "TEST 9: Get Matching Jobs (Candidate)"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/matching/jobs" \
  -H "Authorization: Bearer $CANDIDATE_TOKEN" \
  -H "x-user-id: $CANDIDATE_USER_ID" 2>/dev/null)

if [ "$http_code" = "200" ]; then
  print_success "Candidate can access matching"
else
  print_error "Matching endpoint failed (got $http_code)"
fi

#############################################
# TEST 10: Invalid Token
#############################################
print_header "TEST 10: Invalid Token"

http_code=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/admin/metrics" \
  -H "Authorization: Bearer invalid_token_12345" \
  -H "x-user-id: $ADMIN_USER_ID" 2>/dev/null)

if [ "$http_code" = "401" ]; then
  print_success "Invalid token rejected (401)"
else
  print_error "Expected 401, got $http_code"
fi

#############################################
# SUMMARY
#############################################
print_header "TEST SUMMARY"

echo ""
echo "All tests completed!"
echo ""
echo "To run individual tests:"
echo "  curl -X POST http://localhost:3001/api/auth/login"
echo "  curl -H 'Authorization: Bearer YOUR_TOKEN' http://localhost:3001/api/admin/metrics"
echo ""
