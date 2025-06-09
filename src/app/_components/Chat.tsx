'use client'
import { useChat } from 'ai/react'

export function Chat() {
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    return (
        <div className="flex flex-col w-full max-w-md mx-auto">
            <div className="flex-1 overflow-y-auto">
                {messages.map(m => (
                    <div key={m.id} className="mb-4">
                        <strong>{m.role}: </strong>
                        {m.content}
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Say something..."
                    className="flex-1 p-2 border rounded"
                />
                <button type="submit">Send</button>
            </form>
        </div>
    )
}