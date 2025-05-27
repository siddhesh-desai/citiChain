import requests

BASE = "http://127.0.0.1:8000"

# Replace with actual Ganache addresses and private keys
user1 = "0xFcb81e63c257B7049a7962DaB4A4aCEAe0fADF49"
user2 = "0xF62912D0A7dC892346883CC55c0e9204Da893e80"
user1_key = "0x03b7abc03c5887a2c768f69dd77af238d7dfb6250a77b75b0ff393f999f20f52"
user2_key = "0x39f111321ffc15589d63eccee95c83605fdd78765bf1cfe688ba819650135e3f"

# Mint tokens to user1
mint_data = {"to": user1, "amount": 10 * 21}
print("Mint Response:", requests.post(f"{BASE}/mint", json=mint_data).json())

# Transfer from user1 to user2
transfer_data = {
    "sender": user1,
    "private_key": user1_key,
    "to": user2,
    "amount": 10 * 20,
}
print(
    "Transfer Response:", requests.post(f"{BASE}/transfer", json=transfer_data).json()
)

# Check balances
print("Balance of user1:", requests.get(f"{BASE}/balance/{user1}").json())
print("Balance of user2:", requests.get(f"{BASE}/balance/{user2}").json())

# TransferFrom is optional unless you implement allowance logic
# print("TransferFrom Response:", requests.post(f"{BASE}/transfer_from", json={
#     "from": user1,
#     "sender": user2,
#     "private_key": user2_key,
#     "from_address": user1,
#     "to": user2,
#     "amount": 10**18
# }).json())

# Transactions
print("All Transactions:", requests.get(f"{BASE}/transactions").json())
print(
    "Transactions filtered by sender:",
    requests.get(f"{BASE}/transactions", params={"sender": user1}).json(),
)
print(
    "Transactions filtered by receiver:",
    requests.get(f"{BASE}/transactions", params={"receiver": user2}).json(),
)

res = requests.post(f"{BASE}/create_user").json()
user3 = res["address"]
user3_key = res["private_key"]

print("Create User:", res)
print("Balance of user3:", requests.get(f"{BASE}/balance/{user3}").json())
print(
    "Transfer from user1 to user3:",
    requests.post(
        f"{BASE}/transfer",
        json={
            "sender": user1,
            "private_key": user1_key,
            "to": user3,
            "amount": 10,
        },
    ).json(),
)

print("Balance of user3:", requests.get(f"{BASE}/balance/{user3}").json())

# import requests
# import time

# BASE_URL = "http://127.0.0.1:8000"

# # Test data (use a real Ganache address and valid passport ID)
# test_user_address = "0xFcb81e63c257B7049a7962DaB4A4aCEAe0fADF49"
# test_data_hash = "hash_of_user_kyc_data"
# test_passport_id = "PASSPORT123456"


# # === 1. Submit KYC request ===
# def test_kyc_request():
#     print("📝 Submitting KYC request...")
#     payload = {"user_address": test_user_address, "data_hash": test_data_hash}
#     res = requests.post(f"{BASE_URL}/kyc/request", json=payload)
#     print("✅ KYC Request:", res.status_code)
#     print("🔍 Raw response text:", res.text)


# # === 2. Approve KYC ===
# def test_approve_kyc():
#     print("🛂 Approving KYC...")
#     payload = {"user_address": test_user_address, "passport_id": test_passport_id}
#     res = requests.post(f"{BASE_URL}/kyc/approve", json=payload)
#     print("✅ KYC Approved:", res.status_code, res.json())


# # === 3. Check KYC status ===
# def test_check_kyc():
#     print("🔍 Checking KYC status...")
#     payload = {"passport_id": test_passport_id}
#     res = requests.post(f"{BASE_URL}/kyc/check", json=payload)
#     print("✅ KYC Check:", res.status_code, res.json())


# # === 4. Reject KYC (optional, useful for rejection scenario test) ===
# def test_reject_kyc():
#     print("❌ Rejecting KYC...")
#     payload = {"user_address": test_user_address}
#     res = requests.post(f"{BASE_URL}/kyc/reject", json=payload)
#     print("✅ KYC Rejected:", res.status_code, res.json())


# # === Run full test sequence ===
# if __name__ == "__main__":
#     test_kyc_request()
#     time.sleep(2)  # Give Ganache some time for transaction mining
#     test_approve_kyc()
#     time.sleep(2)
#     test_check_kyc()

#     # If you want to test rejection instead, comment out approve+check and run:
#     # test_reject_kyc()
