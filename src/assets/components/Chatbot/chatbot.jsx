import React, { useState, useEffect, useRef } from "react";
import Chatboticon from "../chatboticon/chatboticon";
import Chatform from "../chatform/chatform";
import ChatMessage from "../ChatMessage/chatMessage";
import "./chatbot.css";

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const chatBodyRef = useRef(null);

  // update chat history with bot message
  const updateHistory = (text) => {
    setChatHistory((prev) => [
      ...prev.filter((msg) => msg.text !== "Thinking..."),
      { role: "model", text },
    ]);
  };

  // MAIN FUNCTION USED BY Chatform
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
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "React Chatbot",
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: lastUserMessage.text,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("OpenRouter API error:", data);
        updateHistory("Something went wrong 😢");
        return;
      }

      const botText =
        data?.choices?.[0]?.message?.content || "No response from AI";

      updateHistory(botText.trim());
    } catch (error) {
      console.error("Fetch error:", error);
      updateHistory("Something went wrong 😢");
    }
  };

  // auto-scroll on new message
  useEffect(() => {
    if (!chatBodyRef.current) return;
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  return (
    <div className="container">
      <div className="chatbot-popup">
        {/* Header */}
        <div className="chat-header">
          <div className="header-info">
            <Chatboticon />
            <h2 className="logo-text">chatbot</h2>
          </div>
          <button className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>

        {/* Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <Chatboticon />
            <p className="message-text">
              hey there!
              <br />
              how can i help you today?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* Footer */}
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
