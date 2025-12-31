import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { AnalysisResult, AfterReadingContent, VisualSummaryItem, WordAnnotationSimple } from '../types';

if (!import.meta.env.VITE_API_KEY) {
    console.warn("VITE_API_KEY environment variable is not set. Please set it in .env file.");
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || '');

const analysisSchema = {
    type: SchemaType.OBJECT,
    properties: {
        passageNumber: { type: SchemaType.STRING, description: "The passage number or title provided in the input." },
        titleEnglish: { type: SchemaType.STRING, description: "The English title of the passage." },
        titleKorean: { type: SchemaType.STRING, description: "The Korean translation of the title." },
        summaryEnglish: { type: SchemaType.STRING, description: "A single, concise English sentence summarizing the passage." },
        summaryAnnotations: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    englishWord: { type: SchemaType.STRING, description: "The English word." },
                    koreanAnnotation: { type: SchemaType.STRING, description: "The meaning in this specific context." }
                },
                required: ["englishWord", "koreanAnnotation"]
            }
        },
        sentences: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    original: { type: SchemaType.STRING, description: "The original English sentence." },
                    translation: { type: SchemaType.STRING, description: "Direct translation tailored for learning." },
                    isTopicSentence: { type: SchemaType.BOOLEAN, description: "True if this is the core topic sentence." },
                    annotations: {
                        type: SchemaType.ARRAY,
                        description: "Grammar points, key vocabulary, and contextual nuances.",
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                englishWordOrPhrase: { type: SchemaType.STRING, description: "The target word or phrase." },
                                koreanAnnotation: { type: SchemaType.STRING, description: "Grammatical explanation or contextual meaning." },
                                annotationType: { type: SchemaType.STRING, description: "'grammar', 'vocabulary', 'context', or 'connector'." },
                            },
                            required: ["englishWordOrPhrase", "koreanAnnotation", "annotationType"],
                        },
                    },
                },
                required: ["original", "translation", "isTopicSentence", "annotations"],
            },
        },
        flow: {
            type: SchemaType.OBJECT,
            description: "The narrative flow of the text.",
            properties: {
                title: { type: SchemaType.STRING, description: "Flow chart title." },
                steps: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: { type: SchemaType.STRING, description: "Short keyword for this flow step." },
                            description: { type: SchemaType.STRING, description: "Summary of how this sentence advances the story/argument." },
                            connectorLabel: { type: SchemaType.STRING, description: "Optional: A short Korean label (e.g., '문제', '원리', '결과') for the arrow connecting to the NEXT step." },
                            highlights: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
                        },
                        required: ["title", "description"]
                    }
                }
            },
            required: ["title", "steps"]
        }
    },
    required: ["passageNumber", "titleEnglish", "titleKorean", "summaryEnglish", "summaryAnnotations", "sentences", "flow"],
};

export const analyzePassage = async (text: string): Promise<AnalysisResult> => {
    const prompt = `You are an expert English language teacher. Analyze the passage focusing on **Grammar** and **Contextual Flow**.
    Return JSON with EXACTLY this structure:
    {
        "passageNumber": "Title/Number",
        "titleEnglish": "Eng Title",
        "titleKorean": "Kor Title",
        "summaryEnglish": "Summary",
        "summaryAnnotations": [{"englishWord": "word", "koreanAnnotation": "contextual meaning"}],
        "sentences": [
            {
                "original": "Sentence",
                "translation": "Korean Translation",
                "isTopicSentence": true/false,
                "annotations": [{"englishWordOrPhrase": "phrase", "koreanAnnotation": "grammar/meaning", "annotationType": "grammar|vocabulary|context"}]
            }
        ],
        "flow": {
            "title": "Logic Flow",
            "steps": [{"title": "Step Key", "description": "Step Logic", "highlights": ["key phrase"]}]
        }
    }
    Input: "${text}"`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        const jsonText = result.response.text();
        console.log("Gemini Raw Response (Analyze):", jsonText);

        const cleanedJson = jsonText.replace(/```json\n?|\n?```/g, "").trim();
        const parsed = JSON.parse(cleanedJson);
        console.log("Parsed Analysis:", parsed);

        // Map loose structure to strict structure if needed
        const mappedResult: AnalysisResult = {
            passageNumber: parsed.passageNumber || "Analysis",
            titleEnglish: parsed.titleEnglish || "Untitled Passage",
            titleKorean: parsed.titleKorean || "제목 없음",
            summaryEnglish: parsed.summaryEnglish || parsed.mainTopicSentence || "No summary provided.",
            summaryAnnotations: Array.isArray(parsed.summaryAnnotations) ? parsed.summaryAnnotations : [],
            sentences: Array.isArray(parsed.sentences) ? parsed.sentences : [],
            flow: parsed.flow || (parsed.logicalFlow ? {
                title: "Login Flow",
                steps: parsed.logicalFlow.map((s: any) => ({
                    title: s.koreanTitle || s.title || "Step",
                    description: s.description || "",
                    highlights: s.highlights || []
                }))
            } : { title: "Flow", steps: [] })
        };

        // Final safety check for sentences if valid structure wasn't returned
        if (mappedResult.sentences.length === 0 && parsed.annotations) {
            // Fallback: treat the whole text as one sentence if model failed to split
            mappedResult.sentences.push({
                original: text,
                translation: "번역 실패",
                isTopicSentence: false,
                annotations: []
            });
        }

        return mappedResult;
    } catch (error: any) {
        console.error("Error analyzing passage:", error);
        let message = "Failed to analyze the passage. Please check your API key and connection.";
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            message = "⚠️ 사용량이 초과되었습니다 (429 Error). 잠시 후 다시 시도해주세요. (Google API Quota reached)";
        }
        throw new Error(message);
    }
};

const wordAnnotationSimpleSchema = {
    type: SchemaType.OBJECT,
    properties: {
        englishWord: { type: SchemaType.STRING, description: "The English word or phrase to be annotated." },
        koreanAnnotation: { type: SchemaType.STRING, description: "The short Korean translation/explanation." }
    },
    required: ["englishWord", "koreanAnnotation"]
};


const afterReadingSchema = {
    type: SchemaType.OBJECT,
    properties: {
        titleKorean: { type: SchemaType.STRING },
        summaryKorean: { type: SchemaType.STRING },
        visualSummaryPrompts: {
            type: SchemaType.ARRAY,
            description: "4 Key scenes visualized with CHARACTERS.",
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    imagePrompt: { type: SchemaType.STRING, description: "A prompt for a scene where cute 2D characters (animals/people) ACT OUT the concept to explain it." }
                },
                required: ["title", "description", "imagePrompt"]
            }
        },
        comprehension: {
            type: SchemaType.OBJECT,
            properties: {
                trueFalse: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            question: { type: SchemaType.STRING },
                            annotations: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { englishWord: { type: SchemaType.STRING }, koreanAnnotation: { type: SchemaType.STRING } }, required: ["englishWord", "koreanAnnotation"] } },
                            answer: { type: SchemaType.BOOLEAN }
                        },
                        required: ["question", "annotations", "answer"]
                    }
                }
            },
            required: ["trueFalse"]
        },
        simplified: {
            type: SchemaType.OBJECT,
            properties: {
                title: { type: SchemaType.STRING },
                text: { type: SchemaType.STRING },
                annotations: { type: SchemaType.ARRAY, items: { type: SchemaType.OBJECT, properties: { englishWord: { type: SchemaType.STRING }, koreanAnnotation: { type: SchemaType.STRING } }, required: ["englishWord", "koreanAnnotation"] } }
            },
            required: ["title", "text", "annotations"]
        },
        translation: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING }
        }
    },
    required: ["titleKorean", "summaryKorean", "visualSummaryPrompts", "comprehension", "simplified", "translation"]
};

// Image generation is not directly supported in the standard text-generation models via this SDK in the same way.
// We will simply use placeholders as discussed.
const generateImage = async (prompt: string): Promise<string> => {
    return "https://via.placeholder.com/400x300?text=" + encodeURIComponent(prompt.substring(0, 20));
};


export const generateAfterReadingContent = async (text: string): Promise<AfterReadingContent> => {
    const prompt = `You are an expert curriculum developer. Create 'After Reading' activities for this English passage.
    Focus on:
    1. **Character-based Visualization**: For 'visualSummaryPrompts', describe scenes where **cute characters (e.g., bear, rabbit)** are acting out the situation to make the concept easy to understand.
    2. **Reading Comprehension**: Check exact understanding of facts.
    3. **Simplification**: Make the text simpler for students.
    
    Return JSON.
    Text: "${text}"`;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-flash-latest",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const result = await model.generateContent(prompt);
        const jsonText = result.response.text();
        // Clean markdown code blocks if present
        const cleanedJson = jsonText.replace(/```json\n?|\n?```/g, "").trim();
        let content;
        try {
            content = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("JSON Parse Error", jsonText);
            throw new Error("Failed to parse.");
        }

        // Mock images for now
        const visualPrompts = Array.isArray(content.visualSummaryPrompts) ? content.visualSummaryPrompts : [];
        const imageUrls = visualPrompts.map(() => "https://placehold.co/600x400/png?text=Character+Scene");

        const visualSummary: VisualSummaryItem[] = visualPrompts.map((item: any, index: number) => ({
            title: item.title || "Scene",
            description: item.description || "",
            imageUrl: imageUrls[index], // In a real app, we'd generate images from item.imagePrompt
        }));

        return {
            titleKorean: content.titleKorean || "제목",
            summaryKorean: content.summaryKorean || "요약",
            visualSummary,
            comprehension: content.comprehension || { trueFalse: [] },
            simplified: content.simplified || { title: "", text: "", annotations: [] },
            translation: Array.isArray(content.translation) ? content.translation : [],
        };

    } catch (error: any) {
        console.error("Error generating after-reading:", error);

        let message = "Failed to generate after-reading content content.";
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            message = "⚠️ 사용량이 초과되었습니다 (429 Error). 잠시 후 다시 시도해주세요. (Google API Quota reached)";
        } else if (error.message?.includes('safety')) {
            message = "⚠️ 콘텐츠 안전 필터에 의해 차단되었습니다. 지문 내용을 확인해주세요.";
        }

        throw new Error(message);
    }
}
