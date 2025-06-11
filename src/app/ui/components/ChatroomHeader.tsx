interface ChatroomHeaderProps {
    introText: string
}

export default function ChatroomHeader({ introText }: ChatroomHeaderProps) {
    return (
        <div className="mb-6 p-4 bg-[#2C1810]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513]">
            <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-[#D4AF37] font-serif">
                    {introText}
                </div>
            </div>
        </div>
    )
} 