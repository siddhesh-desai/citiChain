// Required: npm install react-router-dom
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function CitiGPTChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi! I'm CitiGPT – your 24/7 intelligent financial guide. How can I help you today?",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const smartSuggestions = [
    "Track my expenses",
    "How can I save more?",
    "Show me investment options",
    "What’s my credit score?",
  ];

  const getSmartReply = (msg) => {
    const lower = msg.toLowerCase();
    if (lower.includes("emi") || lower.includes("loan")) {
      navigate("/transfer-money");
      return "Redirecting you to the Smart Loan payment page...";
    }
    if (lower.includes("passport") || lower.includes("kyc")) {
      navigate("/passport");
      return "Opening your Reputation Passport...";
    }
    if (lower.includes("credit score")) {
      return "Your credit score is 812. Strong credit! ✅";
    }
    if (lower.includes("investment")) {
      return "Based on your spending, mutual funds and digital gold could be great options. 📈";
    }
    if (lower.includes("save")) {
      return "Tip: Set monthly auto-debits to your RupeeX savings vault. Even ₹500/month adds up.";
    }
    if (lower.includes("track")) {
      return "You spent ₹21,400 this month. Groceries (35%), Food Delivery (20%), UPI Transfers (18%).";
    }
    return `💡 You asked about: "${msg}"\n(This is CitiGPT's placeholder response)`;
  };

  const sendMessage = async (msg = input) => {
    if (!msg.trim()) return;
    const userMessage = { sender: "user", text: msg, time: new Date().toLocaleTimeString() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: getSmartReply(msg),
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, botReply]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: open ? 350 : 60,
        height: open ? 500 : 60,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 30,
        background: "white",
        overflow: "hidden",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        zIndex: 1000,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chatbot"
          style={{
            backgroundColor: "#1E40AF",
            color: "white",
            height: 60,
            width: 60,
            border: "none",
            cursor: "pointer",
            fontSize: 28,
            borderRadius: "50%", // full circle
            boxShadow: "0 0 8px #3B82F6", // subtle blue glow
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 0 15px #60A5FA")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 0 8px #3B82F6")}
        >
          🤖
        </button>
      )}

      {open && (
        <>
          {/* Header bar with full blue background and white close button */}
          <div
            style={{
              backgroundColor: "#1E40AF",
              height: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              padding: "0 15px",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 28,
                cursor: "pointer",
                lineHeight: 1,
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#A5B4FC")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              ×
            </button>
          </div>

          {/* Chat messages container */}
          <div
            style={{
              flexGrow: 1,
              padding: 12,
              overflowY: "auto",
              fontSize: 14,
              background: "#f8f9fa",
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "10px 14px",
                    borderRadius: 20,
backgroundColor: msg.sender === "user" ? "#0061A8" :"#e1e1e1",
color: msg.sender === "user" ? "white" : "#black",

                    whiteSpace: "pre-wrap",
                    maxWidth: "80%",
                  }}
                >
                  {msg.text}
                </span>
                <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{msg.time}</div>
              </div>
            ))}
            {loading && <div style={{ color: "#555", marginBottom: 10 }}>CitiGPT is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input and suggestions */}
          <div style={{ padding: "0 12px 10px" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {smartSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  style={{
                    padding: "6px 12px",
                    fontSize: 12,
                    border: "1px solid #0061A8",
                    background: "white",
                    color: "#0061A8",
                    borderRadius: 30,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              style={{ display: "flex", gap: 6 }}
            >
              <input
                type="text"
                placeholder="Ask me anything..."
                aria-label="Type your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flexGrow: 1,
                  padding: "10px 14px",
                  borderRadius: 20,
                  border: "1px solid #ccc",
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#1E40AF",
                  color: "white",
                  border: "none",
                  padding: "10px 16px",
                  borderRadius: 20,
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
