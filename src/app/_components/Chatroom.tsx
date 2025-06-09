"use client"

import { useChat } from '@ai-sdk/react'

export default function Chatroom() {
    const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, status, stop, error, reload } = useChat({
        onFinish: (message, { usage, finishReason }) => {
            console.log('Finished streaming message:', message)
            console.log('Token usage (completion, prompt, total):', usage.completionTokens, usage.promptTokens, usage.totalTokens)
            console.log('Finish reason:', finishReason)
        },
        onError: error => {
            console.error('An error occurred:', error)
        },
        onResponse: response => {
            console.log('Received HTTP response from server:', response)
        },
    })

    const handleDelete = (id: string) => {
        setMessages(messages.filter(message => message.id !== id))
    }

    return (
        <div className="flex flex-col w-full mx-auto p-4">

            {/* Header */}
            <div className="mb-6">
                <h1>Chat Assistant</h1>
                <p>Ask me anything!</p>
            </div>

            {/* Message Thread */}
            <div className="p-4">
                {/* Messages */}
                {messages.map(message => (
                    <div key={message.id}>
                        {message.role === 'user' ? 'User: ' : 'AI: '}
                        {message.content}
                        <button onClick={() => handleDelete(message.id)}>x</button>
                    </div>
                ))}
                {/* Stop */}
                {(status === 'submitted' || status === 'streaming') && (
                    <div>
                        {status === 'submitted' && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>}
                        <button type="button" onClick={() => stop()} disabled={!(status === 'streaming' || status === 'submitted')}>Stop</button>
                    </div>
                )}
                {/* Regenerate */}
                <button
                    onClick={() => reload()}
                    disabled={!(status === 'ready' || status === 'error')}>
                    Regenerate
                </button>
                {/* Error */}
                {error && (
                    <div>
                        <div>An error occurred.</div>
                        <button type="button" onClick={() => reload()}>
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Form */}
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