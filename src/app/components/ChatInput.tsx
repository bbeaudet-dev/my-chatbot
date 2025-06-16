import { useCallback, useState } from 'react'

const placeholders = [
      "Start a new puzzle...",
      "I'm ready for a challenge...",
      "Give me your worst!",
      "Let's solve a mystery...",
      "Hit me with a riddle..."
]

export default function ChatInput({
      input,
      onChange,
      onSubmit,
      status
}: {
      input: string
      onChange: ( e: React.ChangeEvent<HTMLTextAreaElement> ) => void
      onSubmit: ( e: React.FormEvent<HTMLFormElement> ) => void
      status: 'idle' | 'submitted' | 'streaming' | 'ready' | 'error'
}) {
      const [ placeholder ] = useState( () =>
            placeholders[ Math.floor( Math.random() * placeholders.length ) ]
      )

      const handleKeyDown = useCallback( ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
            if ( e.key === 'Enter' && !e.shiftKey ) {
                  e.preventDefault()
                  const form = e.currentTarget.form
                  if ( form ) form.requestSubmit()
            }
      }, [] )

      return (
            <form onSubmit={ onSubmit } className="p-4 bg-[#F5E6D3]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513]">
                  <div className="flex items-end gap-2">
                        <textarea
                              value={ input }
                              onChange={ onChange }
                              onKeyDown={ handleKeyDown }
                              placeholder={ placeholder }
                              rows={ 1 }
                              className="flex-1 resize-none rounded-lg border-2 border-[#8B4513] p-3 text-[#2C1810] bg-[#F5E6D3] focus:outline-none focus:border-[#8B4513] min-h-[44px] max-h-[200px]"
                              disabled={ status === 'streaming' || status === 'submitted' }
                        />
                        <button
                              type="submit"
                              disabled={ !input.trim() || status === 'streaming' || status === 'submitted' }
                              className="rounded-lg bg-[#2C1810] text-[#D4AF37] px-4 py-2.5 font-serif hover:bg-[#8B4513] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-2 border-[#8B4513]"
                        >
                              Send
                        </button>
                  </div>
            </form>
      )
} 