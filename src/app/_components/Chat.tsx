"use client"

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useMemo } from 'react'


function ChatroomHeader() {
    return (
        <div className="mb-6">
            <h1>Chat Assistant</h1>
            <p>Ask me anything!</p>
        </div>
    )
}

function ChatroomFeed({ messages }: { messages: UIMessage[] }) {
    return (
        <div className="p-4">
            {messages.map(message => (
                <div key={message.id} className={`p-4`}>
                    <div>{message.content}</div>
                </div>
            ))}
        </div>
    )
}

// function ChatroomForm() {
//     return(
        
//     )
// }

export default function Chatroom() {
    const { messages, input, setInput, handleInputChange, handleSubmit } = useChat()

    return (
        <div className="flex flex-col w-full mx-auto p-4">
            <ChatroomHeader />
            <ChatroomFeed messages={messages} />
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Start chatting..."
                    className="p-3 border-2 rounded-lg"
                />
                <button type="submit" className="p-5">
                    Send
                </button>
            </form>
        </div>
    )
}