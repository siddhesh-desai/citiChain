import React from "react";

const TechStack = () => {
  const techCategories = [
    {
      title: "Blockchain & Smart Contracts",
      icon: "⛓️",
      technologies: [
        { name: "Ethereum", desc: "ERC-20 RupeeX Token" },
        { name: "Solidity", desc: "Smart Contract Development" },
        { name: "Chainlink", desc: "Oracle Integration" },
        { name: "IPFS", desc: "Decentralized Storage" },
      ],
    },
    {
      title: "Privacy & Security",
      icon: "🔐",
      technologies: [
        { name: "Zero-Knowledge Proofs", desc: "Privacy-First Identity" },
        { name: "Semaphore", desc: "Anonymous Signaling" },
        { name: "Merkle Trees", desc: "Tamper-Proof Records" },
        { name: "Soulbound NFTs", desc: "Non-Transferable Identity" },
      ],
    },
    {
      title: "AI & Machine Learning",
      icon: "🤖",
      technologies: [
        { name: "OCR Technology", desc: "Document Verification" },
        { name: "Facial Recognition", desc: "Biometric Authentication" },
        { name: "RAG + AI Agents", desc: "CitiGPT Intelligence" },
        { name: "Fraud Detection", desc: "Real-time Monitoring" },
      ],
    },
    {
      title: "Infrastructure",
      icon: "🏗️",
      technologies: [
        { name: "Node.js", desc: "Backend Services" },
        { name: "MongoDB", desc: "Database Management" },
        { name: "React", desc: "Frontend Interface" },
        { name: "Cloudinary", desc: "Media Storage" },
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powered by Cutting-Edge Technology
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Built on a robust foundation of blockchain, AI, and modern web
            technologies for unparalleled security and performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {techCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="text-lg font-bold text-white">
                  {category.title}
                </h3>
              </div>

              <div className="space-y-4">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="border-l-2 border-blue-400 pl-4"
                  >
                    <h4 className="font-semibold text-white text-sm">
                      {tech.name}
                    </h4>
                    <p className="text-blue-200 text-xs">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Tech Highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-bold mb-2">Hybrid Architecture</h3>
            <p className="text-blue-200">
              Seamlessly bridges DeFi and CeFi for optimal efficiency and
              regulation compliance
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-time Processing</h3>
            <p className="text-blue-200">
              Lightning-fast transactions with smart contract automation and
              oracle integration
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
            <p className="text-blue-200">
              Bank-grade security with blockchain immutability and
              zero-knowledge privacy
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
