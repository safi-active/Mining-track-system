#!/usr/bin/env python
"""Test login with seeded credentials."""
import json
import httpx

email = "safiaactive@gmail.com"
password = "admin123"

client = httpx.Client(base_url="http://127.0.0.1:8000")

print(f"Testing login with:")
print(f"  Email: {email}")
print(f"  Password: {password}")
print()

try:
    response = client.post(
        "/auth/login",
        json={"email": email, "password": password}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("\n✅ Login successful!")
        token = response.json().get("access_token")
        if token:
            print(f"Token: {token[:50]}...")
    else:
        print("\n❌ Login failed")
except Exception as e:
    print(f"Error: {e}")
finally:
    client.close()
