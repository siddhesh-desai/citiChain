import React from "react";

const StatsSection = () => {
  const stats = [
    { number: "10M+", label: "Active Users", icon: "👥" },
    { number: "₹500Cr+", label: "Transaction Volume", icon: "💳" },
    { number: "99.9%", label: "Uptime", icon: "⚡" },
    { number: "50+", label: "Partner Banks", icon: "🏦" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
