interface ChatInputProps {
    input: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (e: React.FormEvent) => void
    status: string
}

export default function ChatInput({ input, onChange, onSubmit, status }: ChatInputProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Add question mark if missing and it's a question
        let processedInput = input.trim()
        if (processedInput && !processedInput.endsWith('?') && 
            (processedInput.toLowerCase().startsWith('is') || 
             processedInput.toLowerCase().startsWith('does') ||
             processedInput.toLowerCase().startsWith('can') ||
             processedInput.toLowerCase().startsWith('are') ||
             processedInput.toLowerCase().startsWith('do') ||
             processedInput.toLowerCase().startsWith('did') ||
             processedInput.toLowerCase().startsWith('was') ||
             processedInput.toLowerCase().startsWith('were'))) {
            processedInput += '?'
        }

        // Create a synthetic event with the processed input
        const syntheticEvent = {
            ...e,
            target: {
                ...e.target,
                value: processedInput
            }
        } as React.FormEvent

        onSubmit(syntheticEvent)
    }

    return (
        <form onSubmit={handleSubmit} className="sticky bottom-0 bg-[#F5E6D3]/90 backdrop-blur-sm p-4 rounded-lg border-2 border-[#8B4513]">
            <div className="flex gap-3">
                <input
                    value={input}
                    onChange={onChange}
                    placeholder="Ask a yes/no question..."
                    className="flex-1 p-3 border-2 border-[#8B4513] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] bg-[#F5E6D3] text-[#2C1810] placeholder-[#8B4513]/50"
                />
                <button 
                    type="submit" 
                    className="px-6 py-3 rounded-lg font-medium bg-[#2C1810] text-[#D4AF37] hover:bg-[#8B4513] transition-colors disabled:opacity-50 border-2 border-[#8B4513]"
                    disabled={!input.trim() || status === 'streaming'}
                >
                    Send
                </button>
            </div>
        </form>
    )
} 