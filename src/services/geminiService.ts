import { GoogleGenAI } from "@google/genai";
import { AIResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function processInspiration(input: string, type: 'video' | 'note' | 'action'): Promise<AIResponse> {
  try {
    let contentToAnalyze = input;
    let coverImage = undefined;

    if (type !== 'action') {
      // 1. Fetch content from backend (to avoid CORS)
      const fetchResponse = await fetch('/api/fetch-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input }),
      });

      if (fetchResponse.ok) {
        const data = await fetchResponse.json();
        contentToAnalyze = data.content;
        coverImage = data.coverImage;
      }
    }

    // 2. Call Gemini from frontend
    const prompt = type === 'action' ? `
      你是一个高效的行动教练。用户输入了一个他们想做的、想学的或一个灵感。
      请基于以下输入，给出 3 件用户可以立马去做的具体小事（每件事不超过 20 字）。
      
      输入: "${contentToAnalyze}"
      
      返回一个具有以下结构的 JSON 对象：
      {
        "title": "一个吸引人的短标题（10个字以内）",
        "tag": "#行动",
        "summary": "简要描述为什么这三件事很重要",
        "prospects": "这个行动可能带来的长期价值",
        "tasks": ["行动1", "行动2", "行动3"]
      }
      请务必使用中文回答。
    ` : `
      You are Seedbrain, 一个面向创业者和学习者的灵感孵化器。
      请深入分析以下内容并提取灵感:
      
      "${contentToAnalyze}"
      
      返回一个具有以下结构的 JSON 对象：
      {
        "title": "一个吸引人的短标题（10个字以内）",
        "tag": "一个相关的标签，如 #商业, #人工智能, #学习, #增长",
        "summary": "3句简洁的话解释核心价值或亮点",
        "prospects": "对商业价值或行业趋势的简要分析",
        "tasks": ["3-4个可以在1小时内完成的具体任务"]
      }
      
      风格：专业、前瞻且简洁。请务必使用中文回答。
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    const aiData = JSON.parse(text);
    
    return {
      ...aiData,
      coverImage: coverImage || undefined
    } as AIResponse;
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Failed to process inspiration. Please try again.");
  }
}
