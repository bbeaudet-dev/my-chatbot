import { type Message } from '@ai-sdk/react'

/**
 * Represents a single insight in the puzzle
 * @test
 * - Should create insight with unique ID
 * - Should track discovery state and timestamp
 * - Should not allow re-discovery
 */
interface Insight {
    id: string
    description: string
    discovered: boolean
    discoveredAt?: Date
}

/**
 * Statistics tracking for puzzle solving progress
 * @test
 * - Should initialize with correct default values
 * - Should track time to solve
 * - Should increment question count
 * - Should track frustration level changes
 * - Should record check-ins with timestamps
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
 * @test
 * - Should maintain consistent state
 * - Should track start and end times
 * - Should prevent state corruption
 */
interface PuzzleState {
    puzzleId: string
    insights: Insight[]
    stats: PuzzleStats
    lastCheckIn: Date
    startTime: Date
    endTime?: Date
}

/**
 * Manages the state of a puzzle solving session
 * @test
 * - Should initialize with correct puzzle ID and insights
 * - Should track message history and update stats
 * - Should detect puzzle completion
 * - Should manage frustration level based on user behavior
 * - Should handle check-ins appropriately
 * - Should track insight discovery
 * - Should prevent duplicate insight discovery
 * - Should maintain immutable state through getters
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
             lastMessage.content.toLowerCase().includes('congratulations'))) {
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
                (b.discoveredAt?.getTime() || 0) - (a.discoveredAt?.getTime() || 0)
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

    // Record a check-in
    recordCheckIn(response: string) {
        console.log('📝 Recording check-in:', { response })
        this.state.stats.checkIns.push({
            timestamp: new Date(),
            response
        })
        this.state.lastCheckIn = new Date()
    }

    // Mark an insight as discovered
    discoverInsight(insightId: string) {
        const insight = this.state.insights.find(i => i.id === insightId)
        if (insight && !insight.discovered) {
            insight.discovered = true
            insight.discoveredAt = new Date()
            this.state.stats.insightsDiscovered++
            console.log('💡 Insight discovered:', {
                description: insight.description,
                totalDiscovered: this.state.stats.insightsDiscovered,
                remaining: this.state.stats.totalInsights - this.state.stats.insightsDiscovered
            })
        }
    }

    // Get current state
    getState(): PuzzleState {
        return { ...this.state }
    }

    // Get stats for storage
    getStats(): PuzzleStats {
        return { ...this.state.stats }
    }
} 