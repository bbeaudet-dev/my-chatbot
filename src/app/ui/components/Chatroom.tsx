"use client"

import { useChat, type Message } from '@ai-sdk/react'
import { createIdGenerator } from 'ai'
import { useEffect, useRef, useState } from 'react'
import ChatroomHeader from './ChatroomHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import EmojiDisplay from './EmojiDisplay'

export default function Chatroom({ id, initialMessages }: {id?: string | undefined; initialMessages?: Message[]} = {}) {
    const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop, error, reload } = useChat({
        id, initialMessages: initialMessages || [], sendExtraMessageFields: true,
        onFinish: (message, { usage, finishReason }) => {
            console.log('Finished streaming message:', message)
            console.log('Token usage (completion, prompt, total):', usage.completionTokens, usage.promptTokens, usage.totalTokens)
            console.log('Finish reason:', finishReason)
        },
        onError: newError => {console.error('An error occurred:', newError)},
        onResponse: response => {console.log('Received HTTP response from server:', response)},
        generateId: createIdGenerator({prefix: 'msgc', size: 16})
    })
    const [currentEmoji, setCurrentEmoji] = useState('🎩')
    
    // Auto-scroll - look more into how this works
    const chatContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }, [messages, status])

    // Emoji
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage?.content.toLowerCase().includes('congratulations') || 
                lastMessage?.content.toLowerCase().includes('well done')) {
                setCurrentEmoji('🎉')
            } else if (lastMessage?.content.toLowerCase().includes('hint')) {
                setCurrentEmoji('🔍')
            } else if (lastMessage?.content.toLowerCase().includes('think')) {
                setCurrentEmoji('🤔')
            } else {
                setCurrentEmoji('🎩')
            }
        }
    }, [messages])

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(message => message.id !== id))
    }

    return (
        <div className="flex flex-col w-full max-w-4xl min-h-screen p-4 mx-auto" >
            <div className="flex gap-4">
                <div className="flex-1">
                    <ChatroomHeader />
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                        <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} status={status} error={error} onStop={stop} onRetry={reload} onRegenerate={reload} />
                    </div>
                    <ChatInput input={input} onChange={handleInputChange} onSubmit={handleSubmit} status={status}/>
                </div>
                <div className="w-32">
                    <EmojiDisplay emoji={currentEmoji} />
                </div>
            </div>
        </div>
    )
} 