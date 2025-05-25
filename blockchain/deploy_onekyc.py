from web3 import Web3
from solcx import compile_source, install_solc
from dotenv import load_dotenv
import os

install_solc("0.8.0")

source_code = """
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract OneKYC {
    enum Status { Pending, Approved, Rejected }

    struct KYCRequest {
        address user;
        string dataHash; // IPFS or ZK-proof commitment
        Status status;
    }

    mapping(address => KYCRequest) public kycRequests;
    mapping(string => address) public passportToAddress;

    event KYCRequested(address indexed user, string dataHash);
    event KYCApproved(address indexed user, string passportId);
    event KYCRejected(address indexed user);

    function requestKYC(string memory dataHash) public {
        require(bytes(dataHash).length > 0, "Invalid data hash");
        kycRequests[msg.sender] = KYCRequest(msg.sender, dataHash, Status.Pending);
        emit KYCRequested(msg.sender, dataHash);
    }

    function approveKYC(address user, string memory passportId) public {
        require(kycRequests[user].status == Status.Pending, "Not pending");
        kycRequests[user].status = Status.Approved;
        passportToAddress[passportId] = user;
        emit KYCApproved(user, passportId);
    }

    function rejectKYC(address user) public {
        require(kycRequests[user].status == Status.Pending, "Not pending");
        kycRequests[user].status = Status.Rejected;
        emit KYCRejected(user);
    }

    function isKYCApproved(string memory passportId) public view returns (bool) {
        return kycRequests[passportToAddress[passportId]].status == Status.Approved;
    }
}
"""

compiled = compile_source(source_code, solc_version="0.8.0")
contract_id, contract_interface = compiled.popitem()
abi = contract_interface["abi"]
bytecode = contract_interface["bin"]

load_dotenv()


# Connect to Ganache
w3 = Web3(Web3.HTTPProvider(os.getenv("GANACHE_URL")))
w3.eth.default_account = w3.eth.accounts[0]

# Deploy
RupeeX = w3.eth.contract(abi=abi, bytecode=bytecode)
tx_hash = RupeeX.constructor().transact()
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

print("Contract deployed at:", tx_receipt.contractAddress)

# Save ABI
import json

with open("OneKYC_abi.json", "w") as f:
    json.dump(abi, f)
