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

export interface VisualSummaryItem {
    title: string;
    description: string;
    imageUrl: string;
}

export interface SimplifiedContent {
    title: string;
    text: string;
    annotations: WordAnnotationSimple[];
}

export interface AfterReadingContent {
    titleKorean: string;
    summaryKorean: string;
    visualSummary: VisualSummaryItem[];
    comprehension: {
        trueFalse: TrueFalseQuestion[];
    };
    simplified: SimplifiedContent;
    translation: string[];
}
