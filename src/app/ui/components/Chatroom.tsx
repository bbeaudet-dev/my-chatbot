"use client"

import { useChat, type Message } from '@ai-sdk/react'
import { createIdGenerator } from 'ai'
import { useEffect, useRef, useState } from 'react'
import ChatroomHeader from './ChatroomHeader'
import MessageList from './MessageList'
import ChatInput from './ChatInput'
import EmojiDisplay from './EmojiDisplay'

const INTRO_TEXT = `Welcome to the Lateral Thinking RiddleBot! 🎩✨

This bot presents you with intriguing lateral thinking puzzles - mysteries that require creative thinking and asking the right questions to solve. Unlike traditional puzzles, these challenges often have unexpected solutions that require looking at the problem from different angles.

To solve a puzzle:
1. Ask yes/no questions to gather information
2. Think creatively about possible explanations
3. Don't worry about adding question marks - the bot will handle that for you!

Learn more about how this bot was built in my [blog post](https://personal-portfolio-sandy-omega-68.vercel.app/).`

export default function Chatroom({ id, initialMessages }: {id?: string | undefined; initialMessages?: Message[]} = {}) {
    const { messages, setMessages, input, handleInputChange, handleSubmit, status, stop, error, reload } = useChat({
        id, 
        initialMessages, 
        sendExtraMessageFields: true,
        onFinish: (message, { usage, finishReason }) => {
            console.log('Finished streaming message:', message)
            console.log('Token usage (completion, prompt, total):', usage.completionTokens, usage.promptTokens, usage.totalTokens)
            console.log('Finish reason:', finishReason)
        },
        onError: newError => {console.error('An error occurred:', newError)},
        onResponse: response => {console.log('Received HTTP response from server:', response)},
        generateId: createIdGenerator({prefix: 'msgc', size: 16})
    })

    const chatContainerRef = useRef<HTMLDivElement>(null)
    const [currentEmoji, setCurrentEmoji] = useState('🎩')
    const [lastMessage, setLastMessage] = useState<Message | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [isScrolling, setIsScrolling] = useState(false)

    // Auto-scroll to bottom when messages change or status changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages, status])

    // Update last message when new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            const last = messages[messages.length - 1]
            if (last) {
                setLastMessage(last)
            }
        }
    }, [messages])

    // Handle scroll events
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
        setIsScrolling(!isAtBottom)
    }

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(message => message.id !== id))
    }

    return (
        <div className="relative flex flex-col h-screen bg-[#F5E6D3]">
            {/* Main chat container */}
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
                <ChatroomHeader introText={INTRO_TEXT} />
                
                <div 
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4 space-y-4"
                    onScroll={handleScroll}
                >
                    <MessageList 
                        messages={messages} 
                        status={status}
                        error={error}
                        onDeleteMessage={handleDeleteMessage}
                        onStop={stop}
                        onRetry={reload}
                        onRegenerate={reload}
                    />
                    <div ref={messagesEndRef} />
                </div>

                <div className="flex items-center space-x-4">
                    <EmojiDisplay emoji={currentEmoji} />
                    <ChatInput 
                        input={input} 
                        onChange={handleInputChange} 
                        onSubmit={handleSubmit} 
                        status={status} 
                    />
                </div>
            </div>
        </div>
    )
} 