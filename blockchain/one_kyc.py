# User aayega

# Register ()
#     Normal inputs etc
#     Create user on chain
#     create hash
#     create transaction
#     save evrythng to db

# Login()
#     email
#     pass
#     returns json if pending and all

# List all requests
#     filter by approved, etc
    

# Approve(transaction)
#     function to approve
#     db update

# Decline(transaction, reason -optional)
#     dunction to reject
#     db update

# Show request
#     for a user it returns all the fields
       
# A blockchain based One KYC system fastapi

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional, Any
from bson import ObjectId
from dotenv import load_dotenv
from datetime import datetime
from pymongo import MongoClient
import os
import json
from web3 import Web3
from eth_account import Account
import random
import string
from pydantic_core import core_schema
from pydantic import GetCoreSchemaHandler


class PyObjectId(ObjectId):

    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_after_validator_function(
            cls.validate,
            core_schema.str_schema(),
            serialization=core_schema.to_string_ser_schema(),
        )

    @classmethod
    def validate(cls, v: Any) -> ObjectId:
        if not ObjectId.is_valid(v):
            raise ValueError(f"Invalid ObjectId: {v}")
        return ObjectId(v)

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    email: str
    password: str
    mobile: str
    dob: Optional[str] = None  # Date of Birth in ISO format
    address: str
    document_links: Optional[dict] = None
    status: str = "Pending"  # Pending, Approved, Declined
    reason: Optional[str] = None  # Reason for decline, if any
    pan_number: Optional[str] = None
    aadhar_number: Optional[str] = None
    one_kyc_number: Optional[str] = None  # Unique identifier for One KYC
    data_hash: Optional[str] = None  # Hash of the user data for integrity
    wallet_address: Optional[str] = None  # Blockchain wallet address
    wallet_private_key: Optional[str] = None  # Private key for the wallet
    zkp_address: Optional[str] = None  # Zero-Knowledge Proof address
    created_at: Optional[str] = None  # Timestamp of creation

    class Config:
        json_encoders = {
            ObjectId: str
        }
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    mobile: str
    dob: Optional[str] = None  # Date of Birth in ISO format
    address: str
    document_links: Optional[dict] = None
    pan_number: Optional[str] = None
    aadhar_number: Optional[str] = None
    created_at: Optional[str] = datetime.now().isoformat()  # Default to current time

class UserLogin(BaseModel):
    email: str
    password: str

class UpdateStatus(BaseModel):
    id: PyObjectId = Field(..., alias="_id")
    reason: Optional[str] = None  # Reason for decline, if any


# Database setup
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[os.getenv("MONGO_DB")]
print("Collections in DB:", db.list_collection_names())

onekyc_users_collection = db["onekyc_users"]

# Blockchain setup 
GANACHE_URL = os.getenv("GANACHE_URL")
w3 = Web3(Web3.HTTPProvider(GANACHE_URL))

if not w3.is_connected():
    raise Exception("Failed to connect to the blockchain")

# OneKYC Contract Setup
ONE_KYC_CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("ONEKYC_CONTRACT_ADDRESS"))

with open("OneKYC_abi.json") as f:
    onekyc_abi = json.load(f)

onekyc_contract = w3.eth.contract(address=ONE_KYC_CONTRACT_ADDRESS, abi=onekyc_abi)
default_account = w3.eth.accounts[0]
w3.eth.default_account = default_account

# OneKYC blockchain functions
def create_wallet_on_chain():
    acct = Account.create()
    user_data = {
        "address": acct.address,
        "private_key": acct.key.hex(),
    }
    return user_data

# def submit_kyc(user_address: str, data_hash: str, private_key: str):
#     tx = onekyc_contract.functions.requestKYC(data_hash).build_transaction(
#         {
#             "from": user_address,
#             "nonce": w3.eth.get_transaction_count(user_address),
#             "gas": 300000,
#             "gasPrice": w3.eth.gas_price,
#         }
#     )
#     signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
#     tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
#     return tx_hash.hex()

def fund_wallet(user_address: str, amount: float):
    PRIVATE_KEY_OF_FUNDED_ACCOUNT = os.getenv("PRIVATE_KEY_OF_FUNDED_ACCOUNT")
    if not PRIVATE_KEY_OF_FUNDED_ACCOUNT:
        raise Exception("Private key for funded account not set in environment variables")
    funder = w3.eth.account.from_key(PRIVATE_KEY_OF_FUNDED_ACCOUNT)
    tx = {
        'to': user_address,
        'value': w3.to_wei(amount, 'ether'),
        'gas': 21000,
        'gasPrice': w3.eth.gas_price,
        'nonce': w3.eth.get_transaction_count(funder.address),
    }
    signed_tx = funder.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    w3.eth.wait_for_transaction_receipt(tx_hash)


def submit_kyc(user_address: str, data_hash: str, private_key: str):
    acct = Account.from_key(private_key)
    if acct.address != user_address:
        raise Exception("Wallet address and private key mismatch")
    
    fund_wallet(user_address, 0.1)  # Fund the wallet with 1 ether

    tx = onekyc_contract.functions.requestKYC(data_hash).build_transaction({
        "nonce": w3.eth.get_transaction_count(acct.address),
        "gas": 300000,
        "gasPrice": w3.eth.gas_price
    })

    signed_txn = acct.sign_transaction(tx)
    # print("Signed transaction:", signed_txn)
    tx_hash = w3.eth.send_raw_transaction(signed_txn['raw_transaction'])  # ✅ fixed line
    return tx_hash.hex()

def generate_passport_id() -> str:
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    return f"ONEKYC-{random_suffix}"

def approve_kyc(user_address: str):
    passport_id = generate_passport_id()

    tx = onekyc_contract.functions.approveKYC(
        user_address, passport_id
    ).build_transaction(
        {
            "from": default_account,
            "nonce": w3.eth.get_transaction_count(default_account),
            "gas": 300000,
        }
    )
    return {"tx_hash": w3.eth.send_transaction(tx).hex(),
            "one_kyc_number": passport_id}

def reject_kyc(user_address: str):
    tx = onekyc_contract.functions.rejectKYC(user_address).build_transaction(
        {
            "from": default_account,
            "nonce": w3.eth.get_transaction_count(default_account),
            "gas": 300000,
        }
    )
    return w3.eth.send_transaction(tx).hex()

def get_kyc_status(passport_id: str):
    status1 = onekyc_contract.functions.isKYCApproved(passport_id).call()
    user = onekyc_users_collection.find_one({"one_kyc_number": passport_id})

    if not user:
        return False
    
    status = user.get("status", "Pending")

    if status == "Approved":
        status2 = True
    else:
        status2 = False 

    return status1 and status2

# FastAPI app initialization
app = FastAPI()
# Alloow CORS for all origins (for development purposes)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/kyc/register")
def register_user(user: UserCreate):
    # Check if user already exists
    existing_user = onekyc_users_collection.find_one({
        "$or": [
            {"email": user.email},
            {"mobile": user.mobile},
            {"pan_number": user.pan_number},
            {"aadhar_number": user.aadhar_number}
        ]
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user data
    user_data = user.model_dump()
    user_data["status"] = "Pending"
    user_data["created_at"] = datetime.now().isoformat()

    # Create a hash of the user data
    user_data_str = json.dumps(user_data, sort_keys=True)
    user_data["data_hash"] = Web3.keccak(text=user_data_str).hex()

    # Create a wallet on the blockchain
    wallet_data = create_wallet_on_chain()
    user_data["wallet_address"] = wallet_data["address"]
    user_data["wallet_private_key"] = wallet_data["private_key"]

    # Submit KYC request to the blockchain
    try:
        tx_hash = submit_kyc(user_data["wallet_address"], user_data["data_hash"], user_data["wallet_private_key"])
        user_data["zkp_address"] = tx_hash
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")
    
    # Insert into MongoDB
    result = onekyc_users_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    return {"message": "User registered successfully", "user": user_data}

@app.post("/kyc/login")
def login_user(user: UserLogin):
    # Find user by email
    existing_user = onekyc_users_collection.find_one({"email": user.email})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check password (in a real application, use hashed passwords)
    if existing_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Return user data excluding sensitive information
    user_data = existing_user.copy()
    user_data.pop("password", None)
    user_data["_id"] = str(user_data["_id"])
    user_data.pop("wallet_private_key", None)
    user_data.pop("zkp_address", None)
    return {"message": "Login successful", "user": user_data}

@app.get("/kyc/users")
def list_users(status: Optional[str] = None):
    query = {}
    if status:
        query["status"] = status

    users = list(onekyc_users_collection.find(query))

    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("wallet_private_key", None)
        user.pop("password", None)

    return {"users": users}

@app.post("/kyc/approve")
def approve_user(update: UpdateStatus):
    user_id = str(update.id)
    user = onekyc_users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user["status"] == "Approved":
        raise HTTPException(status_code=400, detail="User already approved")
    
    try:
        tx_res = approve_kyc(user["wallet_address"])
        tx_hash = tx_res["tx_hash"]
        passport_id = tx_res["one_kyc_number"]
        user["status"] = "Approved"
        user["one_kyc_number"] = passport_id
        user["zkp_address"] = tx_hash
        user["reason"] = update.reason

        # Update in MongoDB
        onekyc_users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user})
        return {"status":"success", "message": "User approved successfully", "zkp_address": tx_hash, "one_kyc_number": passport_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")
    
@app.post("/kyc/reject")
def reject_user(update: UpdateStatus):
    user_id = str(update.id)
    user = onekyc_users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user["status"] == "Declined":
        raise HTTPException(status_code=400, detail="User already declined")
    
    try:
        tx_hash = reject_kyc(user["wallet_address"])
        user["status"] = "Declined"
        user["reason"] = update.reason

        # Update in MongoDB
        onekyc_users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user})
        return {"status":"success", "message": "User rejected successfully", "tx_hash": tx_hash}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")

@app.get("/kyc/status/{passport_id}")
def get_kyc_status_endpoint(passport_id: str):
    try:
        status = get_kyc_status(passport_id)
        return {"status": status}
    except HTTPException as e:
        print(e)
        return {"status": False, "detail": str(e.detail)}
    except Exception as e:
        print(e)
        return {"status": False, "detail": "An error occurred while fetching KYC status"}
    

@app.get("/kyc/users/{user_id}")
def get_user(user_id: str):
    user = onekyc_users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    user.pop("wallet_private_key", None)
    user.pop("password", None)
    return {"user": user}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)


# #  Test the above apis

# # 1. Register a user
# code here

# import requests
# # 1. Register a user
# def register_user():
#     url = "http://localhost:8000/kyc/register"
#     user_data = {
#         "name": "John Doe",
#         "email": "sW",
#         "password": "password123",
#         "mobile": "1234567890",
#         "dob": "1990-01-01",
#         "address": "123 Main St, City, Country",

#         "document_links": {
#             "pan": "https://example.com/pan.jpg",
#             "aadhar": "https://example.com/aadhar.jpg"
#         },
#         "pan_number": "ABCDE1234F",
#         "aadhar_number": "1234-5678-9012",
#         "created_at": "2023-10-01T12:00:00Z"
#     }
#     response = requests.post(url, json=user_data)
#     if response.status_code == 200:
#         print("User registered successfully:", response.json())
#     else:
#         print("Failed to register user:", response.json())

# # 2. Login a user

# def login_user():
#     url = "http://localhost:8000/kyc/login"
#     login_data = {
#         "email": "sW",
#         "password": "password123"
#     }
#     response = requests.post(url, json=login_data)
#     if response.status_code == 200:
#         print("Login successful:", response.json())
#     else:
#         print("Failed to login:", response.json())

# # 3. List all users

# def list_users(status=None):
#     url = "http://localhost:8000/kyc/users"
#     params = {}
#     if status:
#         params["status"] = status
#     response = requests.get(url, params=params)
#     if response.status_code == 200:
#         print("Users:", response.json())
#     else:
#         print("Failed to list users:", response.json())

# # 4. Approve a user

# def approve_user(user_id):
#     url = "http://localhost:8000/kyc/approve"
#     update_data = {
#         "_id": user_id,
#         "reason": "Approved after verification"
#     }
#     response = requests.post(url, json=update_data)
#     if response.status_code == 200:
#         print("User approved successfully:", response.json())
#     else:
#         print("Failed to approve user:", response.json())

# # 5. Reject a user

# def reject_user(user_id, reason=None):
#     url = "http://localhost:8000/kyc/reject"
#     update_data = {
#         "_id": user_id,
#         "reason": reason or "Rejected due to invalid documents"
#     }
#     response = requests.post(url, json=update_data)
#     if response.status_code == 200:
#         print("User rejected successfully:", response.json())
#     else:
#         print("Failed to reject user:", response.json())

# # 6. Get KYC status
# def get_kyc_status(passport_id):
#     url = f"http://localhost:8000/kyc/status/{passport_id}"
#     response = requests.get(url)
#     if response.status_code == 200:
#         print("KYC Status:", response.json())
#     else:
#         print("Failed to get KYC status:", response.json())

# # 7. Get user details by ID
# # 8. Get user details by passport ID