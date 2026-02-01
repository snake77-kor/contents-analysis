import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { AnalysisResult, AfterReadingContent } from '../types';

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
        summaryKorean: { type: SchemaType.STRING, description: "Korean translation of the English summary." },
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
                    original: { type: SchemaType.STRING, description: "The English sentence WITH chunking slashes '/' inserted at natural pause points (e.g., 'When you speak / with your palms facing up, / ...')." },
                    translation: { type: SchemaType.STRING, description: "Korean translation tailored for learning, with KEYWORDS or PHRASES wrapped in double asterisks '**' for highlighting (e.g., '당신이 **손바닥을 위로 향하게** 하고 말할 때')." },
                    isTopicSentence: { type: SchemaType.BOOLEAN, description: "True if this is the core topic sentence." },
                    annotations: {
                        type: SchemaType.ARRAY,
                        description: "Grammar points, key vocabulary, and contextual nuances.",
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                englishWordOrPhrase: { type: SchemaType.STRING, description: "The target word or phrase (WITHOUT slashes)." },
                                koreanAnnotation: { type: SchemaType.STRING, description: "For Vocabulary: Meaning + (Synonym/Antonym). For Grammar: Brief grammatical term (e.g., '관계대명사', '분사구문')." },
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
    required: ["passageNumber", "titleEnglish", "titleKorean", "summaryEnglish", "summaryKorean", "summaryAnnotations", "sentences", "flow"],
};

export const analyzePassage = async (text: string): Promise<AnalysisResult> => {
    const prompt = `You are an expert English language teacher. Analyze the passage focusing on **Grammar** and **Contextual Flow**.
    Return JSON with EXACTLY this structure:
    {
        "passageNumber": "Title/Number",
        "titleEnglish": "Eng Title",
        "titleKorean": "Kor Title",
        "summaryEnglish": "Summary",
        "summaryKorean": "Summary Meaning (Korean)",
        "summaryAnnotations": [{"englishWord": "word", "koreanAnnotation": "contextual meaning"}],
        "sentences": [
            {
                "original": "Sentence WITH chunking slashes '/' at natural pauses",
                "translation": "Korean Translation with **highlights** on keywords",
                "isTopicSentence": true/false,
                "annotations": [{"englishWordOrPhrase": "phrase (NO SLASHES)", "koreanAnnotation": "grammar/meaning", "annotationType": "grammar|vocabulary|context"}]
            }
        ],
        "flow": {
            "title": "논리 흐름 (Logical Flow)",
            "steps": [{"title": "Korean Keyword (Step)", "description": "Korean Explanation of logic", "highlights": ["key phrase"]}]
        }
    }
    IMPORTANT: The 'flow' section MUST be in **KOREAN**.
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
            summaryKorean: parsed.summaryKorean || "요약 없음",
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
        titleKorean: { type: SchemaType.STRING, description: "Korean title of the passage." },
        summaryKorean: { type: SchemaType.STRING, description: "Korean summary." },
        vocabularyList: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    word: { type: SchemaType.STRING },
                    meaning: { type: SchemaType.STRING, description: "Korean meaning" }
                },
                required: ["word", "meaning"]
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
                            answer: { type: SchemaType.BOOLEAN },
                            annotations: {
                                type: SchemaType.ARRAY,
                                items: wordAnnotationSimpleSchema
                            }
                        },
                        required: ["question", "answer"]
                    }
                }
            },
            required: ["trueFalse"]
        },
        fillInTheBlank: {
            type: SchemaType.ARRAY,
            items: {
                type: SchemaType.OBJECT,
                properties: {
                    question: { type: SchemaType.STRING, description: "Sentence with a blank (_______)." },
                    answer: { type: SchemaType.STRING, description: "Correct word." },
                    options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "3-4 options including answer." }
                },
                required: ["question", "answer"]
            }
        },
        translation: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING, description: "Full Korean translation of the passage, sentence by sentence." }
        }
    },
    required: ["titleKorean", "summaryKorean", "vocabularyList", "comprehension", "fillInTheBlank", "translation"]
};

export const generateAfterReadingContent = async (text: string): Promise<AfterReadingContent> => {
    const prompt = `Generate 'After Reading' educational content for the following text.
    Target Audience: High School Students.
    
    1. **Vocabulary List**: Extract 5-8 key English vocabulary words with Korean meanings.
    2. **True/False Questions**: Create 3-5 challenging questions based on the text.
    3. **Fill-in-the-Blank**: Create 3-5 sentences summarizing key points, with the KEYWORD replaced by '_______'. Provide distractors if possible.
    4. **Translation**: Provide a full Korean translation.
    
    Return JSON format adhering to the schema.
    
    Input: "${text}"`;
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: afterReadingSchema,
            },
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

        return {
            titleKorean: content.titleKorean || "제목",
            summaryKorean: content.summaryKorean || "요약",
            vocabularyList: content.vocabularyList || [],
            comprehension: content.comprehension || { trueFalse: [] },
            fillInTheBlank: content.fillInTheBlank || [],
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
