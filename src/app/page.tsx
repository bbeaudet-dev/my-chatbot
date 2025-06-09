'use client'
import { useChat } from '@ai-sdk/react'

export default function Page() {
    const { messages, input, handleInputChange, handleSubmit } = useChat()

    return (
        <div className="flex flex-col w-full max-w-2xl h-screen mx-auto p-4">
            <ChatbotHeader />
            <ChatFeed />
            <ChatForm />
        </div>
    )

    function ChatbotHeader() {
        return (
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Chat Assistant</h1>
                <p className="text-gray-600">Ask me anything!</p>
            </div>
        )
    }

    function ChatFeed() {
        return (
            <div className="flex-1 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg border">
                {messages.length === 0 && (
                    <div className="text-gray-500 text-center py-8">
                        Start a conversation below...
                    </div>
                )}
                {messages.map(message => (
                    <div key={message.id} className={`mb-4 p-3 rounded-lg ${message.role === 'user' ? 'bg-blue-500 text-white ml-12' : 'bg-white border mr-12'}`}>
                        <div className="text-sm font-semibold mb-1 opacity-75">
                            {message.role === 'user' ? 'You' : 'Assistant'}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                ))}
            </div>
        )
    }

    function ChatForm() {
        return (
            <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                >
                    Send
                </button>
            </form>
        )
    }
}