import React, { useState, useEffect, useRef } from "react";

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");

    // Simulate backend call
    try {
      // Replace with your API call to chatbot backend
      const response = await fakeChatbotAPI(input);
      setMessages((msgs) => [...msgs, { sender: "bot", text: response }]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { sender: "bot", text: "Sorry, something went wrong." },
      ]);
    }
  };

  const fakeChatbotAPI = (msg) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(`You said: "${msg}" (This is a placeholder response)`);
      }, 1000);
    });

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        width: open ? 320 : 60,
        height: open ? 400 : 60,
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        borderRadius: 12,
        background: "white",
        overflow: "hidden",
        transition: "width 0.3s, height 0.3s",
        display: "flex",
        flexDirection: "column",
      }}
      aria-live="polite"
    >
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chatbot" : "Open chatbot"}
        style={{
          backgroundColor: "#4f46e5",
          color: "white",
          height: 60,
          width: 60,
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: 24,
        }}
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <>
          <div
            style={{
              flexGrow: 1,
              padding: "10px",
              overflowY: "auto",
              fontSize: 14,
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
                    padding: "8px 12px",
                    borderRadius: 16,
                    backgroundColor:
                      msg.sender === "user" ? "#4f46e5" : "#e5e7eb",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            style={{ display: "flex", padding: "10px", gap: 8 }}
          >
            <input
              type="text"
              aria-label="Type your message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{ flexGrow: 1, padding: "8px 12px", borderRadius: 20, border: "1px solid #ccc" }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "#4f46e5",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: 20,
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
        </>
      )}
    </div>
  );
}
