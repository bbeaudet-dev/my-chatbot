export default function ChatroomHeader () {
      const welcomeTitle = "Welcome to RiddleBot! 🎩✨"
      const welcomeText1 = 
            `
                  This bot presents you with lateral thinking puzzles requiring creativity and outside-the-box thinking (e.g. "the horse's name was Friday").
            `
      const welcomeText2 = 
            `
                  Once you start a new puzzle:
                  1. Ask the riddlemaster any question
                  2. Riddlemaster will answer yes/no/unclear
                  3. Think <-laterally-> to find the solution!
            `
      return (
            <div className="mb-6 p-4 bg-[#2C1810]/90 backdrop-blur-sm rounded-lg border-2 border-[#8B4513]">
                  <div className="prose prose-invert max-w-none">
                        <div className="whitespace-pre-line text-[#D4AF37] font-serif font-bold">{ welcomeTitle }</div>
                        <div className="whitespace-pre-line text-[#D4AF37] font-serif">{ welcomeText1 }</div>
                        <div className="whitespace-pre-line text-[#D4AF37] font-serif">{ welcomeText2 }</div>
                  </div>
            </div>
      )
} 