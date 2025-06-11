export default function ChatroomHeader() {
    const welcomeTitle = "Welcome to RiddleBot! 🎩✨"
    const welcomeText1 = `
        This bot presents you with intriguing lateral thinking puzzles - riddles that require creative thinking and asking the right questions to solve.
    `
    const welcomeText2 = `
        1. Say anything to start a new puzzle
        2. Ask the riddlemaster any question
        3. Riddlemaster will answer yes/no/unclear
        3. Think <-laterally-> to find solutions
    `
    return (
        <div className="mb-6 p-4 bg-[#2C1810]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513]">
            <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-line text-[#D4AF37] font-serif font-bold">{welcomeTitle}</div>
                <div className="whitespace-pre-line text-[#D4AF37] font-serif">{welcomeText1}</div>
                <div className="whitespace-pre-line text-[#D4AF37] font-serif">{welcomeText2}</div>
            </div>
        </div>
    )
} 