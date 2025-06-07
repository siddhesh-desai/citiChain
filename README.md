# CitiChain 🚀

**The Future of Blockchain Banking in India**

CitiChain is a next-generation digital banking platform that unifies traditional finance and DeFi, powered by blockchain, AI, and privacy-first identity. Experience seamless onboarding, instant transactions, and secure data sharing across banks and institutions.

---

## 🌟 Key Features

- **OneKYC with ZKPs:** One-time KYC for all banks. AI-powered onboarding with OCR, facial scan, and Zero-Knowledge Proofs for privacy-first identity.
- **RupeeX Stablecoin:** INR-pegged, fiat-backed ERC-20 token for fast, secure, real-time transactions.
- **Reputation Passport:** Shareable, decentralized wallet storing your credit, transaction, and behavior data—issued as Soulbound NFTs + DIDs.
- **Consent Ledger:** Tamper-proof data access history using Merkle Trees + IPFS. Smart contract-powered permissions with selective sharing.
- **Smart Loans:** Purpose-driven loans/scholarships usable only at verified institutions, reducing fraud.
- **CitiGPT:** AI-powered assistant for financial guidance, investment advice, and smart contract interaction.

---

## 🏗️ Project Structure

```
citiChain/
│
├── backend/                # Node.js/Express API, MongoDB, business logic
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── middlewares/
│       ├── models/
│       └── routes/
│
├── blockchain/             # Solidity contracts, deployment scripts, ABIs
│   ├── deploy.py
│   ├── deploy_onekyc.py
│   ├── main.py
│   ├── one_kyc.py
│   ├── OneKYC_abi.json
│   └── RupeeX_abi.json
│
├── citychain-frontend/     # Main React + Vite frontend (user/institution)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   └── index.html
│
├── frontend/               # (Legacy/demo) React frontend
│
├── .env
├── README.md
└── requirements.txt
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-org/citiChain.git
cd citiChain
```

### 2. Setup Blockchain (Ganache/Hardhat)

- Install dependencies:
  ```sh
  cd blockchain
  pip install -r ../requirements.txt
  ```
- Start Ganache or your local Ethereum node.
- Deploy contracts:
  ```sh
  python deploy.py
  python deploy_onekyc.py
  ```

### 3. Backend API

- Install dependencies:
  ```sh
  cd ../backend
  npm install
  ```
- Configure `.env` (MongoDB URI, contract addresses, etc.)
- Start server:
  ```sh
  npm run dev
  ```

### 4. Frontend

- Install dependencies:
  ```sh
  cd ../citychain-frontend
  npm install
  ```
- Start the app:
  ```sh
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173)

---

## 🛡️ Tech Stack

- **Smart Contracts:** Solidity, Web3.py, Ganache
- **Backend:** Node.js, Express, MongoDB, dotenv
- **Frontend:** React, Vite, Tailwind CSS, Heroicons
- **AI/ML:** OCR, Facial Recognition, RAG + AI Agents (CitiGPT)
- **Privacy:** Zero-Knowledge Proofs (Semaphore), IPFS, Merkle Trees

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT License

---

## 💬 Contact

- Email: siddheshdesai777@gmail.com

---

_Transform your banking experience with CitiChain!_

