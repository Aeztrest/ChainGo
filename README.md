# 🌐 ChainGo - Web3 Marketplace

![ChainGo Banner](https://via.placeholder.com/1200x300?text=ChainGo+Web3+Marketplace)

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

ChainGo is a decentralized marketplace platform that lets users **publish, discover, and trade listings** using blockchain technology. It combines **Next.js**, **Stacks blockchain**, and **Clarity smart contracts** to create a seamless Web3 experience.

## 🚀 Live Demo
> Coming Soon...

## 🔗 Repository
[GitHub Repository](https://github.com/Aeztrest/Web3-Marketplace)

---

## ✨ Features

- 🪙 **NFT-based Listings**: Each product is minted as an NFT when listed.
- 🔐 **Token-Based Authentication**: Users get a Clarity-issued token upon registration.
- 🤝 **Wallet Integration**: Seamless Stacks wallet login and user identity handling.
- 📦 **Smart Transfer**: Listing ownership transfers to buyer; payment auto-transfers to seller.

---

## 🧰 Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Python (FastAPI), Docker
- **Blockchain**: Stacks Blockchain, Clarity, Clarinet
- **Wallet**: Hiro Wallet
- **Others**: PostgreSQL, JWT, REST API

---

## 🛠 Getting Started

### Prerequisites

- Node.js, pnpm
- Python 3.11+
- Docker & Docker Compose
- Clarinet CLI
- Hiro Wallet

### Installation

```bash
# Frontend
cd ChainGo-Frontend
pnpm install
pnpm dev

# Backend
cd ../BackEnd
docker-compose up --build
```

---

## ⚙️ Usage

1. Connect your wallet using Hiro extension.
2. Register → receive NFT + token.
3. Publish a listing (NFT minted).
4. Buyer purchases → item transferred + payment auto-sent via smart contract.

---

## 🧠 Smart Contracts

| Contract | Description |
|----------|-------------|
| `marketplace-auth.clar` | Handles registration + NFT/token issuance |
| `marketplace-listing.clar` | Mints listing as NFT and manages ownership |
| `marketplace-transfer.clar` | Transfers listing ownership to buyer and funds to seller |

Functions like:
- `register-user()`
- `mint-listing(title, price)`
- `buy-listing(id)`

---

## 📦 Deployment

### Testnet

```bash
clarinet check
clarinet deploy --network testnet
```

### Mainnet

Replace network config in `Clarinet.toml` and deploy again.

---

## 🧪 Testing

```bash
clarinet test
# or for backend
cd BackEnd/backend
pytest
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

MIT License © Aeztrest

---

## 💬 Support

Feel free to reach out via GitHub issues or [@Aeztrest](https://github.com/Aeztrest)

---

## 🙏 Acknowledgments

- Built with ❤️ on top of the [Stacks](https://www.stacks.co/) ecosystem
- Inspired by Letgo and NFT marketplaces
