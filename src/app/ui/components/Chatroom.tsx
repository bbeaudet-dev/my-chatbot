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

    // Auto-scroll to bottom when messages change or status changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
        }
    }, [messages, status])

    // Update emoji based on message content
    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (lastMessage?.role === 'assistant') {
                if (lastMessage.content.toLowerCase().includes('congratulations') || 
                    lastMessage.content.toLowerCase().includes('well done')) {
                    setCurrentEmoji('🎉')
                } else if (lastMessage.content.toLowerCase().includes('hint')) {
                    setCurrentEmoji('🔍')
                } else if (lastMessage.content.toLowerCase().includes('think')) {
                    setCurrentEmoji('🤔')
                } else {
                    setCurrentEmoji('🎩')
                }
            }
        }
    }, [messages])

    const handleDeleteMessage = (id: string) => {
        setMessages(messages.filter(message => message.id !== id))
    }

    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto p-4 min-h-screen" 
             style={{
                 backgroundImage: 'url("/parchment-pattern.svg")',
                 backgroundRepeat: 'repeat',
                 backgroundSize: '100px 100px'
             }}>
            <div className="flex gap-4">
                {/* Main chat area */}
                <div className="flex-1">
                    <ChatroomHeader introText={INTRO_TEXT} />
                    <div 
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto"
                        style={{ maxHeight: 'calc(100vh - 300px)' }}
                    >
                        <MessageList 
                            messages={messages} 
                            onDeleteMessage={handleDeleteMessage} 
                            status={status} 
                            error={error} 
                            onStop={stop} 
                            onRetry={reload} 
                            onRegenerate={reload} 
                        />
                    </div>
                    <ChatInput 
                        input={input} 
                        onChange={handleInputChange} 
                        onSubmit={handleSubmit} 
                        status={status}
                    />
                </div>

                {/* Emoji display */}
                <div className="w-32">
                    <EmojiDisplay emoji={currentEmoji} />
                </div>
            </div>
        </div>
    )
} 