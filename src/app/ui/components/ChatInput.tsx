interface ChatInputProps {
    input: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => void
    status: string
}

export default function ChatInput({ input, onChange, onSubmit, status }: ChatInputProps) {
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        let newInput = input.trim()
        if (newInput && !newInput.endsWith('?') && 
            (newInput.toLowerCase().startsWith('is') || 
            newInput.toLowerCase().startsWith('does') || 
            newInput.toLowerCase().startsWith('can') || 
            newInput.toLowerCase().startsWith('are') ||
            newInput.toLowerCase().startsWith('do') || 
            newInput.toLowerCase().startsWith('did') || 
            newInput.toLowerCase().startsWith('was') || 
            newInput.toLowerCase().startsWith('were'))) {
            newInput += '?'
        }
        onSubmit(event)
    }

    return (
        <form onSubmit={handleSubmit} className="sticky bottom-0 bg-[#F5E6D3]/90 backdrop-blur-sm p-4 rounded-lg border-2 border-[#8B4513]">
            <div className="flex gap-3">
                <input
                    value={input}
                    onChange={onChange}
                    placeholder="Start a new puzzle..."
                    className="flex-1 p-3 border-2 border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-[#F5E6D3] text-[#2C1810] placeholder-[#8B4513]/50"
                />
                <button 
                    type="submit" 
                    className="px-6 py-3 rounded-lg font-medium bg-[#2C1810] text-[#D4AF37] hover:bg-[#8B4513] transition-colors disabled:opacity-50 border-2 border-[#8B4513]"
                    disabled={!input.trim() || status === 'streaming'}
                >Send</button>
            </div>
        </form>
    )
} 