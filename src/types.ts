export interface SummaryAnnotation {
    englishWord: string;
    koreanAnnotation: string;
}

export interface WordAnnotation {
    englishWordOrPhrase: string;
    koreanAnnotation: string;
    annotationType: 'vocabulary' | 'grammar' | 'phrase' | 'connector' | 'keyword';
}

export interface AnnotatedSentence {
    original: string;
    translation: string;
    isTopicSentence: boolean;
    annotations: WordAnnotation[];
}

export interface FlowStep {
    title: string;
    description: string;
    connectorLabel?: string;
    highlights?: string[];
}

export interface AnalysisResult {
    passageNumber: string;
    titleEnglish: string;
    titleKorean: string;
    summaryEnglish: string;
    summaryKorean: string;
    summaryAnnotations: SummaryAnnotation[];
    sentences: AnnotatedSentence[];
    flow: {
        title: string;
        steps: FlowStep[];
    };
}

export interface WordAnnotationSimple {
    englishWord: string;
    koreanAnnotation: string;
}

export interface TrueFalseQuestion {
    question: string;
    annotations: WordAnnotationSimple[];
    answer: boolean;
}

export interface VocabularyItem {
    word: string;
    meaning: string;
    synonyms?: string; // Optional synonyms
}

export interface FillInTheBlankQuestion {
    question: string; // The sentence with a blank (e.g., "The _____ revolves around...")
    answer: string;   // The correct word
    options?: string[]; // Distractors (optional)
}

export interface AfterReadingContent {
    titleKorean: string;
    summaryKorean: string;
    vocabularyList: VocabularyItem[]; // New: Vocab List
    comprehension: {
        trueFalse: TrueFalseQuestion[];
    };
    fillInTheBlank: FillInTheBlankQuestion[]; // New: Cloze Test
    translation: string[];
}
