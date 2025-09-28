import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY || '');

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MoodEntry {
  mood: string;
  emoji: string;
  description?: string;
}

class AIService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async generateResponse(message: string, context?: ChatMessage[]): Promise<string> {
    try {
      const prompt = this.buildPrompt(message, context);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse();
    }
  }

  async studyAssistant(question: string, subject?: string): Promise<string> {
    try {
      const prompt = `As a helpful study assistant, please answer this ${subject ? `${subject} ` : ''}question: ${question}

Please provide:
1. A clear, accurate answer
2. Step-by-step explanation if applicable
3. Any relevant examples or context

Keep your response educational and encouraging.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Study Assistant Error:', error);
      return "I'm having trouble right now, but I'd love to help you study! Try asking your question again in a moment.";
    }
  }

  async moodSupport(moodEntry: MoodEntry): Promise<string> {
    try {
      const prompt = `The user is feeling ${moodEntry.mood} ${moodEntry.emoji}. ${moodEntry.description ? `They described it as: ${moodEntry.description}` : ''}

As a supportive AI companion, provide:
1. Acknowledgment of their feelings
2. Gentle, encouraging words
3. A helpful suggestion or activity
4. Remind them that feelings are temporary

Keep your response warm, empathetic, and supportive (2-3 sentences).`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Mood Support Error:', error);
      return `I hear you're feeling ${moodEntry.mood} ${moodEntry.emoji}. Your feelings are valid, and I'm here with you. Remember that emotions come and go like waves - this feeling will pass. 💙`;
    }
  }

  async languagePractice(text: string, type: 'grammar' | 'vocabulary' | 'translation'): Promise<string> {
    try {
      let prompt = '';
      
      switch (type) {
        case 'grammar':
          prompt = `Please check this text for grammar errors and provide corrections: "${text}"

Format your response as:
- Original: [text]
- Corrected: [corrected text]
- Explanation: [brief explanation of changes]`;
          break;
        case 'vocabulary':
          prompt = `Help me improve the vocabulary in this text: "${text}"

Suggest 2-3 alternative words or phrases that could make it more engaging or precise.`;
          break;
        case 'translation':
          prompt = `Please translate this text to English and explain any cultural context: "${text}"`;
          break;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Language Practice Error:', error);
      return "I'm having trouble with language practice right now. Please try again in a moment!";
    }
  }

  async generateMotivationalQuote(): Promise<string> {
    try {
      const prompt = `Generate an inspiring, personalized motivational quote for someone using a daily companion app. 

Make it:
- Encouraging and uplifting
- Relevant to personal growth
- Fresh and unique (not cliché)
- About 1-2 sentences

Focus on themes like: learning, progress, self-care, resilience, or personal development.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Motivational Quote Error:', error);
      return "Every step forward, no matter how small, is progress. You're doing better than you think! ✨";
    }
  }

  private buildPrompt(message: string, context?: ChatMessage[]): string {
    let prompt = `You are Nexa, a friendly and supportive AI companion. Your personality is warm, encouraging, and helpful. You're designed to be a daily companion that helps with learning, productivity, and emotional support.

Guidelines:
- Be conversational and friendly
- Keep responses concise but helpful
- Show empathy and understanding
- Encourage learning and growth
- Maintain a positive, supportive tone

`;

    if (context && context.length > 0) {
      prompt += "Previous conversation:\n";
      context.slice(-5).forEach(msg => {
        prompt += `${msg.role === 'user' ? 'Human' : 'Nexa'}: ${msg.content}\n`;
      });
      prompt += "\n";
    }

    prompt += `Human: ${message}\nNexa:`;
    return prompt;
  }

  private getFallbackResponse(): string {
    const fallbacks = [
      "I'm having a moment of technical difficulty, but I'm here for you! Could you try asking that again?",
      "Hmm, I seem to be having trouble processing that. Mind rephrasing your question?",
      "I'm experiencing some connectivity issues right now. Let's try that again in a moment!",
      "Sorry, I didn't catch that properly. Could you help me out by asking again?",
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
}

export const aiService = new AIService();