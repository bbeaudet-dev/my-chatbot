import { type Message } from '@ai-sdk/react'

/**
 * Represents a single insight in the puzzle
 */
interface Insight {
    id: string
    description: string
    discovered: boolean
    discoveredAt?: Date
}

/**
 * Statistics tracking for puzzle solving progress
 */
export interface PuzzleStats {
    timeToSolve?: number // in seconds
    totalQuestions: number
    frustrationLevel: number // 0-100
    insightsDiscovered: number
    totalInsights: number
    checkIns: {
        timestamp: Date
        response: string
    }[]
}

/**
 * Complete puzzle state including insights and stats
 */
interface PuzzleState {
    puzzleId: string
    insights: Insight[]
    stats: PuzzleStats
    lastCheckIn: Date
    startTime: Date
    endTime?: Date
}

export const SYSTEM_PROMPT = `You are a master puzzle designer and storyteller, creating engaging mystery puzzles that challenge players to think critically and solve complex scenarios. Your role is to guide players through a carefully crafted narrative while maintaining strict rules about hints and answers.

CORE PRINCIPLES:
1. Initial Riddle and Commentary:
   - Begin by presenting the riddle or mystery scenario in an engaging way
   - Provide atmospheric descriptions and character details
   - Add commentary and reactions to player's questions and discoveries
   - Maintain an engaging narrative voice throughout

2. Yes/No Answers for Questions:
   - Answer ALL direct questions with ONLY "yes" or "no"
   - Never provide additional context or hints in your answers
   - If a question is unclear, ask for clarification
   - For questions like "was she happy or sad", answer only "yes" or "no" to the specific question

3. Hint System:
   - Give hints ONLY when:
     * Player has made at least 3 failed attempts
     * Player explicitly asks for a hint
     * Player shows clear signs of frustration (e.g., "I'm stuck", "This is impossible")
   - Wait at least 2 minutes between hints
   - Hints should be subtle and directional, not revealing
   - Never give more than one hint at a time
   - Never reveal the solution directly

4. Story and Character Development:
   - Create characters whose motivations and actions are relatable and believable
   - Ensure character decisions align with their established personality
   - Players should be able to think "I would do the same in their situation"
   - Avoid actions that feel out of character or unrealistic

5. Puzzle Structure:
   - Each puzzle must have a clear, logical solution
   - Include multiple clues that can be discovered through yes/no questions
   - Ensure all elements of the story are relevant to the solution
   - Create a satisfying ending that ties together multiple story elements

6. Ending Requirements:
   - The solution must be logically consistent with all provided clues
   - The ending should tie together at least 3 major story elements
   - The resolution should feel natural and satisfying
   - Character actions in the ending must be consistent with their development
   - Players should be able to understand and empathize with the final outcome

Remember: Your goal is to create an engaging puzzle that challenges players while maintaining strict rules about hints and answers. The story should be compelling, the characters relatable, and the solution satisfying.`

/**
 * Manages the state of a puzzle solving session
 */
export class PuzzleStateManager {
    private state: PuzzleState

    constructor(puzzleId: string, insights: string[]) {
        console.log('🎮 Initializing new puzzle state:', { puzzleId, totalInsights: insights.length })
        this.state = {
            puzzleId,
            insights: insights.map(desc => ({
                id: Math.random().toString(36).substr(2, 9),
                description: desc,
                discovered: false
            })),
            stats: {
                totalQuestions: 0,
                frustrationLevel: 0,
                insightsDiscovered: 0,
                totalInsights: insights.length,
                checkIns: []
            },
            lastCheckIn: new Date(),
            startTime: new Date()
        }
    }

    // Update state based on new messages
    updateState(messages: Message[]) {
        this.state.stats.totalQuestions++
        console.log('📊 Question count:', this.state.stats.totalQuestions)
        
        // Update frustration level based on:
        // - Time spent without new insights
        // - Number of questions asked
        // - Type of questions (repetitive vs. new directions)
        this.updateFrustrationLevel(messages)

        // Check for solved state
        const lastMessage = messages[messages.length - 1]
        if (lastMessage?.role === 'assistant' && 
            (lastMessage.content.toLowerCase().includes('well done') || 
             lastMessage.content.includes('congratulations'))) {
            this.state.endTime = new Date()
            this.state.stats.timeToSolve = 
                (this.state.endTime.getTime() - this.state.startTime.getTime()) / 1000
            console.log('🎉 Puzzle solved!', {
                timeToSolve: this.state.stats.timeToSolve,
                totalQuestions: this.state.stats.totalQuestions,
                insightsDiscovered: this.state.stats.insightsDiscovered
            })
        }
    }

    private updateFrustrationLevel(messages: Message[]) {
        const recentMessages = messages.slice(-5)
        const repetitiveQuestions = this.countRepetitiveQuestions(recentMessages)
        const timeSinceLastInsight = this.getTimeSinceLastInsight()
        
        // Increase frustration based on:
        // - Repetitive questions
        // - Time without new insights
        // - Number of questions asked
        let frustration = this.state.stats.frustrationLevel
        
        if (repetitiveQuestions > 2) {
            frustration += 10
            console.log('😫 Detected repetitive questions:', repetitiveQuestions)
        }
        if (timeSinceLastInsight > 300) {
            frustration += 5 // 5 minutes
            console.log('⏰ Long time since last insight:', timeSinceLastInsight)
        }
        if (this.state.stats.totalQuestions > 20) {
            frustration += 5
            console.log('🤔 High question count:', this.state.stats.totalQuestions)
        }
        
        // Cap frustration at 100
        this.state.stats.frustrationLevel = Math.min(100, frustration)
        console.log('😤 Current frustration level:', this.state.stats.frustrationLevel)
    }

    private countRepetitiveQuestions(messages: Message[]): number {
        // Simple implementation - could be made more sophisticated
        const questions = messages
            .filter(m => m.role === 'user')
            .map(m => m.content.toLowerCase())
        
        return questions.filter((q, i) => 
            questions.slice(0, i).some(prevQ => 
                this.areQuestionsSimilar(q, prevQ)
            )
        ).length
    }

    private areQuestionsSimilar(q1: string, q2: string): boolean {
        // Simple similarity check - could be made more sophisticated
        const words1 = new Set(q1.split(' '))
        const words2 = new Set(q2.split(' '))
        const commonWords = [...words1].filter(w => words2.has(w))
        return commonWords.length / Math.max(words1.size, words2.size) > 0.7
    }

    private getTimeSinceLastInsight(): number {
        const lastInsight = this.state.insights
            .filter(i => i.discovered)
            .sort((a, b) => 
                (b.discoveredAt?.getTime() ?? 0) - (a.discoveredAt?.getTime() ?? 0)
            )[0]
        
        if (!lastInsight?.discoveredAt) return 0
        return (new Date().getTime() - lastInsight.discoveredAt.getTime()) / 1000
    }

    // Check if it's time for a check-in
    shouldCheckIn(): boolean {
        const timeSinceLastCheckIn = 
            (new Date().getTime() - this.state.lastCheckIn.getTime()) / 1000
        const shouldCheck = timeSinceLastCheckIn > 300 // 5 minutes
        if (shouldCheck) {
            console.log('👋 Time for a check-in!', {
                timeSinceLastCheckIn,
                frustrationLevel: this.state.stats.frustrationLevel
            })
        }
        return shouldCheck
    }

    recordCheckIn(response: string) {
        this.state.stats.checkIns.push({
            timestamp: new Date(),
            response
        })
        this.state.lastCheckIn = new Date()
        console.log('📝 Recorded check-in:', response)
    }

    discoverInsight(insightId: string) {
        const insight = this.state.insights.find(i => i.id === insightId)
        if (insight && !insight.discovered) {
            insight.discovered = true
            insight.discoveredAt = new Date()
            this.state.stats.insightsDiscovered++
            console.log('🔍 Discovered insight:', insight.description)
        }
    }

    getState(): PuzzleState {
        return { ...this.state }
    }

    getStats(): PuzzleStats {
        return { ...this.state.stats }
    }
} 