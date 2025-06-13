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
            <form onSubmit={ onSubmit } className="flex items-end gap-2 p-4">
                  <textarea
                        value={ input }
                        onChange={ onChange }
                        onKeyDown={ handleKeyDown }
                        placeholder={ placeholder }
                        rows={ 1 }
                        className="flex-1 resize-none rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
                        disabled={ status === 'streaming' || status === 'submitted' }
                  />
                  <button
                        type="submit"
                        disabled={ !input.trim() || status === 'streaming' || status === 'submitted' }
                        className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
                  >
                        Send
                  </button>
            </form>
      )
} 