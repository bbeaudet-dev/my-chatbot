export default function EmojiDisplay ( { emoji }: { emoji: string } ) {
      return (
            <div className="sticky top-4">
                  <div className="bg-[#2C1810] border-4 border-[#8B4513] rounded-lg p-4 shadow-lg">
                        <div className="text-6xl text-center mb-2">{ emoji }</div>
                        <div className="text-center text-[#D4AF37] font-serif text-sm">
                              { emoji === '🎩' && 'The Riddlemaster' }
                              { emoji === '🔍' && 'Seeking Clues' }
                              { emoji === '🤔' && 'Deep in Thought' }
                              { emoji === '🎉' && 'Mystery Solved!' }
                        </div>
                  </div>
            </div>
      )
} 