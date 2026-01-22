import React, { useRef } from "react";
const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // update chat history with the user's message
    setChatHistory((history) => [
      ...history,
      { role: "user", text: userMessage },
    ]);

    //   add a " thinking..." placeholder for bot response
    setTimeout(
      () => {
        setChatHistory((history) => [
          ...history,
          { role: "model", text: "Thinking..." },
        ]);
        // call the function to generate bot response
        generateBotResponse([chatHistory, { role: "user", text: userMessage }]);
      },

      600
    );
  };

  return (
    <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default Chatform;
