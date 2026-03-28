"""
Quick test script to verify backend is working
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("Testing Backend Connectivity")
print("=" * 60)

# Test 1: Health check
print("\n1. Testing Health Check...")
try:
    response = requests.get(f"{BASE_URL}/health")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 2: Root endpoint
print("\n2. Testing Root Endpoint...")
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"   Status: {response.status_code}")
    print(f"   Response: {response.json()}")
except Exception as e:
    print(f"   ❌ Error: {e}")

# Test 3: Test signup
print("\n3. Testing Signup Endpoint...")
try:
    signup_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Test@123",
        "role": "student"
    }
    response = requests.post(
        f"{BASE_URL}/auth/signup",
        json=signup_data,
        headers={"Content-Type": "application/json"}
    )
    print(f"   Status: {response.status_code}")
    print(f"   Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print("\n" + "=" * 60)
