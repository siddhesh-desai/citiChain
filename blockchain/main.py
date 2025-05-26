from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from web3 import Web3
from web3._utils.events import get_event_data
from eth_account import Account
import json
import motor.motor_asyncio
import os
from dotenv import load_dotenv
from typing import Optional
from bson import ObjectId
from datetime import datetime


load_dotenv()

# Load contract ABI
with open("RupeeX_abi.json") as f:
    abi = json.load(f)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI")
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client[os.getenv("MONGO_DB")]
users_collection = db["users"]
transactions_collection = db["transactions"]
kyc_collection = db["kyc_requests"]

# FastAPI App
app = FastAPI()

# Web3 Setup
w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))
if not w3.is_connected():
    raise Exception("Web3 not connected to Ganache")

# Contract Setup
contract_address = Web3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
contract = w3.eth.contract(address=contract_address, abi=abi)

# Owner Account
owner_address = w3.eth.accounts[0]
owner_private_key = os.getenv("OWNER_PRIVATE_KEY")

ganache_url = os.getenv("GANACHE_URL")
web3 = Web3(Web3.HTTPProvider(ganache_url))
CONTRACT_ADDRESS = Web3.to_checksum_address(os.getenv("ONEKYC_CONTRACT_ADDRESS"))

with open("OneKYC_abi.json") as f:
    CONTRACT_ABI = json.load(f)

contract_onekyc = web3.eth.contract(address=CONTRACT_ADDRESS, abi=CONTRACT_ABI)
default_account = web3.eth.accounts[0]
web3.eth.default_account = default_account


# ------------------- Models ------------------- #
class MintRequest(BaseModel):
    to: str
    amount: int


class TransferRequest(BaseModel):
    sender: str
    private_key: str
    to: str
    amount: int


class TransferFromRequest(BaseModel):
    spender: str
    private_key: str
    from_address: str
    to: str
    amount: int


# ------------------- Blockchain Routes ------------------- #


@app.post("/mint")
async def mint(req: MintRequest):
    try:
        tx = contract.functions.mint(req.to, req.amount).build_transaction(
            {
                "from": owner_address,
                "nonce": w3.eth.get_transaction_count(owner_address),
                "gas": 200000,
                "gasPrice": w3.to_wei("50", "gwei"),
            }
        )
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=owner_private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        await transactions_collection.insert_one(
            {
                "type": "mint",
                "to": req.to,
                "amount": req.amount,
                "tx_hash": tx_hash.hex(),
            }
        )

        return {"tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mint failed: {str(e)}")


@app.post("/transfer")
async def transfer(req: TransferRequest):
    try:
        tx = contract.functions.transfer(req.to, req.amount).build_transaction(
            {
                "from": req.sender,
                "nonce": w3.eth.get_transaction_count(req.sender),
                "gas": 200000,
                "gasPrice": w3.to_wei("50", "gwei"),
            }
        )
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=req.private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        await transactions_collection.insert_one(
            {
                "type": "transfer",
                "from": req.sender,
                "to": req.to,
                "amount": req.amount,
                "tx_hash": tx_hash.hex(),
            }
        )

        return {"tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transfer failed: {str(e)}")


@app.post("/transfer_from")
async def transfer_from(req: TransferFromRequest):
    try:
        tx = contract.functions.transferFrom(
            req.from_address, req.to, req.amount
        ).build_transaction(
            {
                "from": req.spender,
                "nonce": w3.eth.get_transaction_count(req.spender),
                "gas": 200000,
                "gasPrice": w3.to_wei("50", "gwei"),
            }
        )
        signed_tx = w3.eth.account.sign_transaction(tx, private_key=req.private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)

        await transactions_collection.insert_one(
            {
                "type": "transferFrom",
                "spender": req.spender,
                "from": req.from_address,
                "to": req.to,
                "amount": req.amount,
                "tx_hash": tx_hash.hex(),
            }
        )

        return {"tx_hash": tx_hash.hex()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TransferFrom failed: {str(e)}")


@app.get("/balance/{address}")
async def get_balance(address: str):
    try:
        checksum_address = Web3.to_checksum_address(address)
        balance = contract.functions.balanceOf(checksum_address).call()
        return {"address": checksum_address, "balance": balance}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Balance fetch failed: {str(e)}")


@app.get("/transactions")
async def get_all_transactions():
    try:
        all_tx = await transactions_collection.find().to_list(length=1000)
        return [serialize_doc(tx) for tx in all_tx]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Transaction fetch failed: {str(e)}"
        )


@app.get("/transactions/sender/{sender}")
async def get_by_sender(sender: str):
    txs = await transactions_collection.find({"from": sender}).to_list(length=1000)
    return [serialize_doc(tx) for tx in txs]


@app.get("/transactions/receiver/{receiver}")
async def get_by_receiver(receiver: str):
    txs = await transactions_collection.find({"to": receiver}).to_list(length=1000)
    return [serialize_doc(tx) for tx in txs]


# ------------------- User Routes ------------------- #


@app.post("/create_user")
async def create_user():
    acct = Account.create()
    user_data = {
        "address": acct.address,
        "private_key": acct.key.hex(),
    }
    result = await users_collection.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    return user_data


@app.get("/users")
async def get_users():
    users = await users_collection.find().to_list(length=100)
    return [serialize_doc(user) for user in users]


def serialize_doc(doc):
    doc["_id"] = str(doc["_id"])
    return doc


# ===========================
# SCHEMAS
# ===========================


class KYCRequestCreate(BaseModel):
    user_address: str
    data_hash: str


class KYCReview(BaseModel):
    user_address: str
    passport_id: Optional[str]


class KYCStatusCheck(BaseModel):
    passport_id: str


class KYCRequestModel(BaseModel):
    id: Optional[str] = str(ObjectId())
    user_address: str
    data_hash: str
    passport_id: Optional[str] = None
    status: str = "Pending"
    created_at: datetime = datetime.utcnow()


# ===========================
# BLOCKCHAIN FUNCTIONS
# ===========================


def submit_kyc(user_address: str, data_hash: str):
    tx = contract_onekyc.functions.requestKYC(data_hash).build_transaction(
        {
            "from": user_address,
            "nonce": web3.eth.get_transaction_count(user_address),
            "gas": 300000,
        }
    )
    return web3.eth.send_transaction(tx)


def approve_kyc(user_address: str, passport_id: str):
    tx = contract_onekyc.functions.approveKYC(
        user_address, passport_id
    ).build_transaction(
        {
            "from": default_account,
            "nonce": web3.eth.get_transaction_count(default_account),
            "gas": 300000,
        }
    )
    return web3.eth.send_transaction(tx)


def reject_kyc(user_address: str):
    tx = contract_onekyc.functions.rejectKYC(user_address).build_transaction(
        {
            "from": default_account,
            "nonce": web3.eth.get_transaction_count(default_account),
            "gas": 300000,
        }
    )
    return web3.eth.send_transaction(tx)


def check_kyc(passport_id: str) -> bool:
    return contract_onekyc.functions.isKYCApproved(passport_id).call()


# ===========================
# DATABASE FUNCTIONS
# ===========================


async def save_request(data: KYCRequestModel):
    await kyc_collection.insert_one(data.dict())


async def update_request_status(
    user_address: str, status: str, passport_id: Optional[str] = None
):
    update = {"$set": {"status": status}}
    if passport_id:
        update["$set"]["passport_id"] = passport_id
    await kyc_collection.update_one({"user_address": user_address}, update)


async def get_request_by_passport(passport_id: str):
    return await kyc_collection.find_one({"passport_id": passport_id})


# ===========================
# FASTAPI ROUTES
# ===========================


@app.post("/kyc/request")
def request_kyc(payload: KYCRequestCreate):
    tx_hash = submit_kyc(payload.user_address, payload.data_hash)
    kyc = KYCRequestModel(
        user_address=payload.user_address, data_hash=payload.data_hash
    )
    save_request(kyc)
    return {"msg": "KYC submitted", "tx_hash": tx_hash.hex()}


@app.post("/kyc/approve")
def approve(payload: KYCReview):
    tx_hash = approve_kyc(payload.user_address, payload.passport_id)
    update_request_status(payload.user_address, "Approved", payload.passport_id)
    return {"msg": "KYC approved", "tx_hash": tx_hash.hex()}


@app.post("/kyc/reject")
def reject(payload: KYCReview):
    tx_hash = reject_kyc(payload.user_address)
    update_request_status(payload.user_address, "Rejected")
    return {"msg": "KYC rejected", "tx_hash": tx_hash.hex()}


@app.post("/kyc/check")
def check_status(payload: KYCStatusCheck):
    approved = check_kyc(payload.passport_id)
    return {"passport_id": payload.passport_id, "approved": approved}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
