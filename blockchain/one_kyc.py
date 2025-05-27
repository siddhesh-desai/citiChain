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
from fastapi.middleware.cors import CORSMiddleware


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

# RupeeX Schemas
class RupeeXUser(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    name: str
    email: str
    mobile: str
    password: str
    one_kyc_number: Optional[str] = None  # Unique identifier for One KYC
    bank: Optional[str] = None  # Bank name
    wallet_address: Optional[str] = None  # Blockchain wallet address
    wallet_private_key: Optional[str] = None  # Private key for the wallet
    created_at: Optional[str] = None  # Timestamp of creation

    class Config:
        json_encoders = {
            ObjectId: str
        }
        allow_population_by_field_name = True
        arbitrary_types_allowed = True

class RupeeXTransaction(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    type: str  # e.g., "mint", "transfer"
    to_user_id: str  # User ID to which RPX is sent
    to_wallet_address: str  # Wallet address to which RPX is sent
    from_user_id: Optional[str] = None  # User ID from which RPX is sent (if applicable)
    from_wallet_address: Optional[str] = None  # Wallet address from which RPX is sent (if applicable)
    amount: int  # Amount of RPX
    tx_hash: str  # Transaction hash on the blockchain
    created_at: Optional[str] = datetime.now().isoformat()  # Default to current time
    unit: Optional[str] = "RPX"  # Unit of the transaction

    class Config:
        json_encoders = {
            ObjectId: str
        }
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class RupeeXUserCreate(BaseModel):
    name: str
    email: str
    mobile: str
    password: str
    one_kyc_number: str  # Unique identifier for One KYC
    bank: Optional[str] = None  # Bank name
    created_at: Optional[str] = datetime.now().isoformat()  # Default to current time

class RupeeXUserLogin(BaseModel):
    email: str
    password: str

class RupeeXMintRequest(BaseModel):
    amount: int  # Amount of RPX to mint
    to_user_id: str  # Address to mint RPX to

class RupeeXTransferRequest(BaseModel):
    amount: int  # Amount of RPX to transfer
    from_user_id: str  # User ID from which RPX is sent
    to_user_id: str  # User ID to which RPX is sent


# Database setup
load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
mongo_client = MongoClient(MONGO_URI)
db = mongo_client[os.getenv("MONGO_DB")]
print("Collections in DB:", db.list_collection_names())

onekyc_users_collection = db["onekyc_users"]
transactions_collection = db["transactions"]
users_collection = db["users"]

# Blockchain setup 
GANACHE_URL = os.getenv("GANACHE_URL")
w3 = Web3(Web3.HTTPProvider(GANACHE_URL))

if not w3.is_connected():
    raise Exception("Failed to connect to the blockchain")

# OneKYC Contract Setup
ONE_KYC_CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("ONEKYC_CONTRACT_ADDRESS"))
RUPEEX_CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))

with open("OneKYC_abi.json") as f:
    onekyc_abi = json.load(f)

with open("RupeeX_abi.json") as f:
    rupeex_abi = json.load(f)

onekyc_contract = w3.eth.contract(address=ONE_KYC_CONTRACT_ADDRESS, abi=onekyc_abi)
rupeex_contract = w3.eth.contract(address=RUPEEX_CONTRACT_ADDRESS, abi=rupeex_abi)

default_account = w3.eth.accounts[0]
w3.eth.default_account = default_account

owner_address = w3.eth.accounts[0]
owner_private_key = os.getenv("OWNER_PRIVATE_KEY")


# OneKYC blockchain functions
def create_wallet_on_chain():
    acct = Account.create()
    user_data = {
        "address": acct.address,
        "private_key": acct.key.hex(),
    }
    return user_data

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

# RupeeX blockchain functions


# FastAPI app initialization
app = FastAPI()
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

# RupeeX User Endpoints
@app.post("/rupeex/register")
def register_rupeex_user(user: RupeeXUserCreate):
    # Check if user already exists
    existing_user = users_collection.find_one({
        "$or": [
            {"email": user.email},
            {"mobile": user.mobile},
            {"one_kyc_number": user.one_kyc_number}
        ]
    })
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create user data
    user_data = user.model_dump()
    user_data["created_at"] = datetime.now().isoformat()

    # Create a wallet on the blockchain
    wallet_data = create_wallet_on_chain()
    user_data["wallet_address"] = wallet_data["address"]
    user_data["wallet_private_key"] = wallet_data["private_key"]

    # Fund the wallet with 0.1 ether
    try:
        fund_wallet(user_data["wallet_address"], 0.1)  # Fund the wallet with 0.1 ether
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")

    # Insert into MongoDB
    result = users_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    user_data.pop("wallet_private_key", None)
    user_data.pop("password", None)
    user_data.pop("one_kyc_number", None)
    return {"message": "User registered successfully", "user": user_data}

@app.post("/rupeex/login")
def login_rupeex_user(user: RupeeXUserLogin):
    # Find user by email
    existing_user = users_collection.find_one({"email": user.email})
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
    return {"message": "Login successful", "user": user_data}

@app.get("/rupeex/users")
def list_rupeex_users():
    users = list(users_collection.find({}))

    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("wallet_private_key", None)
        user.pop("password", None)

    return {"users": users}

@app.get("/rupeex/users/{user_id}")
def get_rupeex_user(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])
    user.pop("wallet_private_key", None)
    user.pop("password", None)
    return {"user": user}

@app.get("/rupeex/balance/{user_id}")
def get_rupeex_balance(user_id: str):
    user = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    wallet_address = user.get("wallet_address")
    if not wallet_address:
        raise HTTPException(status_code=400, detail="Wallet address not found for user")
    
    checksum_address = Web3.to_checksum_address(wallet_address)
    balance = rupeex_contract.functions.balanceOf(checksum_address).call()
    return {"wallet_address": checksum_address, "balance": balance, "unit": "RPX"}

@app.post("/rupeex/mint")
def mint_rupeex_tokens(mint_request: RupeeXMintRequest):
    user = users_collection.find_one({"_id": ObjectId(mint_request.to_user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    wallet_address = user.get("wallet_address")
    if not wallet_address:
        raise HTTPException(status_code=400, detail="Wallet address not found for user")
    
    try:
        tx = rupeex_contract.functions.mint(wallet_address, mint_request.amount).build_transaction(
            {
                "from": owner_address,
                "nonce": w3.eth.get_transaction_count(owner_address),
                "gas": 200000,
                "gasPrice": w3.to_wei("50", "gwei"),
            }
        )
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=owner_private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        # Add transaction to MongoDB
        transaction_data = {
            "from_user_address":owner_address,
            "type":"mint",
            "to_user_id":mint_request.to_user_id,
            "to_wallet_address":wallet_address,
            "amount":mint_request.amount,
            "tx_hash":tx_hash.hex(),
            "created_at": datetime.now().isoformat(),
            "unit": "RPX"
        }

        transactions_collection.insert_one(transaction_data)

        return {"message": "Tokens minted successfully", "tx_hash": tx_hash.hex(), "amount": mint_request.amount}

    except ValueError as e:
        print(e)
        raise HTTPException(status_code=400, detail=f"Blockchain transaction error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")
    
@app.post("/rupeex/transfer")
def transfer_rupeex_tokens(transfer_request: RupeeXTransferRequest):
    from_user = users_collection.find_one({"_id": ObjectId(transfer_request.from_user_id)})
    to_user = users_collection.find_one({"_id": ObjectId(transfer_request.to_user_id)})

    if not from_user or not to_user:
        raise HTTPException(status_code=404, detail="User not found")

    from_wallet_address = from_user.get("wallet_address")
    to_wallet_address = to_user.get("wallet_address")

    from_balance = get_rupeex_balance(transfer_request.from_user_id)
    if from_balance["balance"] < transfer_request.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance for transfer")

    if not from_wallet_address or not to_wallet_address:
        raise HTTPException(status_code=400, detail="Wallet address not found for user")
    
    try:
        tx = rupeex_contract.functions.transfer(to_wallet_address, transfer_request.amount).build_transaction(
            {
                "from": from_wallet_address,
                "nonce": w3.eth.get_transaction_count(from_wallet_address),
                "gas": 200000,
                "gasPrice": w3.to_wei("50", "gwei"),
            }
        )
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=from_user["wallet_private_key"])
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)


        transaction_data = {
            "type":"transfer",
            "from_user_id":transfer_request.from_user_id,
            "from_wallet_address":from_wallet_address,
            "to_user_id":transfer_request.to_user_id,
            "to_wallet_address":to_wallet_address,
            "amount":transfer_request.amount,
            "tx_hash":tx_hash.hex(),
            "created_at": datetime.now().isoformat(),
            "unit": "RPX"
        }

        transactions_collection.insert_one(transaction_data)

        return {"message": "Tokens transferred successfully", "tx_hash": tx_hash.hex(), "amount": transfer_request.amount}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Blockchain transaction error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Blockchain transaction failed: {str(e)}")

@app.get("/rupeex/transactions")
def get_rupeex_transactions(sender: Optional[str] = None, receiver: Optional[str] = None, type: Optional[str] = None):

    if type and type not in ["mint", "transfer"]:
        raise HTTPException(status_code=400, detail="Invalid transaction type. Must be 'mint' or 'transfer'.")
    
    if sender and not ObjectId.is_valid(sender):
        raise HTTPException(status_code=400, detail="Invalid sender ID format")
    
    if receiver and not ObjectId.is_valid(receiver):
        raise HTTPException(status_code=400, detail="Invalid receiver ID format")
    if sender and receiver and sender == receiver:
        raise HTTPException(status_code=400, detail="Sender and receiver cannot be the same")
    
    
    query = {}
    if sender:
        query["from_user_id"] = sender
    if receiver:
        query["to_user_id"] = receiver
    if type:
        query["type"] = type

    transactions = list(transactions_collection.find(query))

    for tx in transactions:
        tx["_id"] = str(tx["_id"])

    return {"transactions": transactions}

@app.get("/rupeex/transactions/{transaction_id}")
def get_rupeex_transaction(transaction_id: str):
    if not ObjectId.is_valid(transaction_id):
        raise HTTPException(status_code=400, detail="Invalid transaction ID format")

    transaction = transactions_collection.find_one({"_id": ObjectId(transaction_id)})

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction["_id"] = str(transaction["_id"])
    return {"transaction": transaction}

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)

