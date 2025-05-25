from web3 import Web3
from solcx import compile_source, install_solc
from dotenv import load_dotenv
import os

install_solc("0.8.0")

source_code = """
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RupeeX {
    string public name = "RupeeX";
    string public symbol = "RPX";
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    address public owner;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    event AllTransactions(address indexed from, address indexed to, uint256 value, string action);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
        emit AllTransactions(address(0), to, amount, "mint");
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        emit AllTransactions(msg.sender, to, amount, "transfer");
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
        emit AllTransactions(from, to, amount, "transferFrom");
        return true;
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

with open("RupeeX_abi.json", "w") as f:
    json.dump(abi, f)
