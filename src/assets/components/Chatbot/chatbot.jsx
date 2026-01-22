import React, { useState, useEffect, useRef } from "react";
import Chatboticon from "../chatboticon/chatboticon";
import Chatform from "../chatform/chatform";
import ChatMessage from "../ChatMessage/chatMessage";
import "./chatbot.css";
import { companyInfo } from "../companyInfo/companyInfo";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]); // empty initially
  const [showChatbot, setShowChatbot] = useState(false);
  const chatBodyRef = useRef(null);

  const updateHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text },
    ]);
  };

  const generateBotResponse = async (history) => {
    const lastUserMessage = [...history]
      .reverse()
      .find((msg) => msg.role === "user");

    if (!lastUserMessage) return;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            // inject companyInfo as context
            { role: "system", content: companyInfo },
            { role: "user", content: lastUserMessage.text },
          ],
        }),
      });

      const data = await response.json();
      updateHistory(data?.choices?.[0]?.message?.content || "No response");
    } catch {
      updateHistory("Something went wrong 😢");
    }
  };

  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
  }, [chatHistory]);

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      {/* TOGGLER */}
      <button
        id="chatbot-toggler"
        type="button"
        onClick={() => setShowChatbot((prev) => !prev)}
      >
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>

      {/* POPUP */}
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">chatbot</h2>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            className="material-symbols-rounded"
            onClick={() => setShowChatbot(false)}
          >
            keyboard_arrow_down
          </button>
        </div>

        <div ref={chatBodyRef} className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <Chatform
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
