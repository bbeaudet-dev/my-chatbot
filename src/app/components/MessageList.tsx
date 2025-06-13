import { type Message } from '@ai-sdk/react'
import MessageBubble from './MessageBubble'

interface MessageListProps {
      messages: Message[]
      status: string
      error: Error | null | undefined
      onDeleteMessage: ( id: string ) => void
      onStop: () => void
      onRetry: () => void
      onRegenerate: () => void
}

export default function MessageList ( { messages, status, error, onDeleteMessage, onStop, onRetry, onRegenerate }: MessageListProps ) {
      return (
            <div className="flex-1 p-4 bg-[#F5E6D3]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513] mb-4 overflow-y-auto">
                  {/* Message List */ }
                  { messages.map( message => (
                        <div key={ message.id } className={ `mb-4 ${ message.role === 'user' ? 'ml-12' : 'mr-12' }` }>
                              <div className={ `p-3 rounded-lg ${ message.role === 'user'
                                          ? 'bg-[#2C1810] text-[#D4AF37] border-2 border-[#8B4513]'
                                          : 'bg-[#F5E6D3] border-2 border-[#8B4513] shadow-lg'
                                    }` }>
                                    <MessageBubble key={ message.id } message={ message } onDelete={ onDeleteMessage } />
                              </div>
                        </div>
                  ) ) }

                  {/* Loading State */ }
                  { ( status === 'submitted' || status === 'streaming' ) && (
                        <div className="flex items-center justify-center my-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8B4513]"></div>
                              <button
                                    type="button"
                                    onClick={ onStop }
                                    disabled={ !( status === 'streaming' || status === 'submitted' ) }
                                    className="ml-3 px-3 py-1 text-sm text-[#2C1810] hover:text-[#8B4513] disabled:opacity-50"
                              >Stop</button>
                        </div>
                  ) }

                  {/* Error State */ }
                  { error && (
                        <div className="text-center my-4">
                              <div className="text-red-600 mb-2">An error occurred.</div>
                              <button
                                    className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                    type="button"
                                    onClick={ onRetry }
                              >Retry</button>
                        </div>
                  ) }

                  {/* Regenerate Button */ }
                  { messages.length > 0 && ( status === 'ready' || status === 'error' ) && (
                        <div className="flex justify-center mt-4">
                              <button
                                    className="px-4 py-2 text-sm bg-[#2C1810] text-[#D4AF37] rounded-lg hover:bg-[#8B4513] transition-colors disabled:opacity-50 border-2 border-[#8B4513]"
                                    onClick={ onRegenerate }
                                    disabled={ !( status === 'ready' || status === 'error' ) }
                              >Regenerate Response</button>
                        </div>
                  ) }
            </div>
      )
} 