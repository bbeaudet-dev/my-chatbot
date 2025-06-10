import { type Message } from '@ai-sdk/react'

interface MessageProps {
    message: Message
    onDelete: (id: string) => void
}

export default function MessageBubble({message, onDelete}: MessageProps) {
    return(
        <>
        <div className="flex justify-between items-start">
            <span className="font-medium mb-1">{message.role === 'user' ? 'You' : 'AI'}</span>
            <button 
                className="text-gray-400 hover:text-red-600 transition-colors px-2"
                onClick={() => onDelete(message.id)}
            >×</button>
        </div>
        <div className="whitespace-pre-wrap">
            {message.content}
        </div>
        </>
    )
}