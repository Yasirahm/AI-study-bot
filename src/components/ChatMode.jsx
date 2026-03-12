import React, { useState } from "react"
import axios from "axios"

function ChatMode() {

  const [message, setMessage] = useState("")
  const [chat, setChat] = useState([])

  const sendMessage = async () => {

    const userMsg = { role: "user", text: message }

    setChat([...chat, userMsg])

    const response = await axios.post(
      "http://localhost:5000/api/ai/chat",
      { message }
    )

    const aiMsg = { role: "ai", text: response.data.result }

    setChat((prev) => [...prev, aiMsg])

    setMessage("")
  }

  return (

    <div>

      <div className="h-96 overflow-y-auto bg-slate-800 rounded-xl p-4 space-y-3">

        {chat.map((msg, i) => (

          <div
            key={i}
            className={`p-3 rounded-lg max-w-[70%] ${
              msg.role === "user"
                ? "bg-blue-600 ml-auto text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            {msg.text}
          </div>

        ))}

      </div>

      <div className="flex mt-4 gap-2">

        <input
          className="flex-1 p-3 rounded-lg bg-slate-700 text-white"
          placeholder="Ask anything..."
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 px-5 rounded-lg text-white"
        >
          Send
        </button>

      </div>

    </div>

  )

}

export default ChatMode