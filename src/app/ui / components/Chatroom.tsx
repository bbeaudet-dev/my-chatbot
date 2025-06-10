"use client"

import { useChat, type Message } from '@ai-sdk/react'
import { createIdGenerator } from 'ai';
import ChatroomHeader from './ChatroomHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'


export default function Chatroom( { id, initialMessages}: {id?: string | undefined; initialMessages?: Message[]} = {}) {
    const { messages, setMessages, input, setInput, handleInputChange, handleSubmit, status, stop, error, reload } = useChat({
        id, initialMessages, sendExtraMessageFields: true,
        onFinish: (message, { usage, finishReason }) => {
            console.log('Finished streaming message:', message)
            console.log('Token usage (completion, prompt, total):', usage.completionTokens, usage.promptTokens, usage.totalTokens)
            console.log('Finish reason:', finishReason)
        },
        onError: newError => {console.error('An error occurred:', newError)},
        onResponse: response => {console.log('Received HTTP response from server:', response)},
        generateId: createIdGenerator({prefix: 'msgc', size: 16})
    })

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(message => message.id !== id))
    }

    return (
        <div className="flex flex-col w-full max-w-2xl mx-auto p-4 min-h-screen">
            <ChatroomHeader />
            <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} status={status} error={error} onStop={stop} onRetry={reload} onRegenerate={reload} />
            <ChatInput input={input} onChange={handleInputChange} onSubmit={handleSubmit} />
        </div>
    )
}