import { type Message } from '@ai-sdk/react'

interface MessageProps {
      message: Message
      onDelete: ( id: string ) => void
}

export default function MessageBubble ( { message, onDelete }: MessageProps ) {
      return (
            <div className="flex flex-col">
                  <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium">
                              { message.role === 'user' ? 'You' : 'Riddlemaster' }
                        </span>
                        { message.role === 'assistant' && (
                              <span className="text-xl">🎩</span>
                        ) }
                        <button
                              className="text-gray-400 hover:text-red-600 transition-colors px-2 ml-auto"
                              onClick={ () => onDelete( message.id ) }
                        >×</button>
                  </div>
                  <div className="whitespace-pre-wrap">
                        { message.content }
                  </div>
            </div>
      )
} 