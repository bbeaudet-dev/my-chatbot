interface ChatInputProps {
    input: string
    onChange: (element: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (element: React.FormEvent) => void
}

export default function ChatInput({input, onChange, onSubmit}: ChatInputProps) {
    return(
        <form onSubmit={onSubmit} className="flex gap-3 sticky bottom-0 bg-white p-2">
            <input
                value={input}
                onChange={onChange}
                placeholder="Start chatting..."
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
                type="submit" 
                className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={!input.trim() || status === 'streaming'}
            >
                Send
            </button>
        </form>
    )
}