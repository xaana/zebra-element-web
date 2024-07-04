import { MatrixFile } from "../files/types";

export type StepItem = {
    id: number;
    text: string;
    // status: StepStatus
    title: string;
    description: string;
    nextStepTitle: string;
};

export type AiGenerationContent = {
    documentPrompt: string;
    allTitles: string[];
    contentSize: string;
    tone: string;
    targetAudience: string;
    requirementDocuments?: MatrixFile[];
    supportingDocuments?: MatrixFile[];
    templateId?: string;
};

export type Report = {
    id: string;
    name: string;
    timestamp: string;
    owner: string;
    type?: string;
    description?: string;
    accessType?: string;
    content?: string;
    status?: string;
    aiContent?: AiGenerationContent;
    fileType: string;
};

export type Message = {
    id: string;
    content: string;
    role: "system" | "user";
    messageUid?: string;
    createdAt?: Date;
    children?: React.ReactNode | null;
    childrenContent?: any;
    messageActions?: boolean;
    model?: string;
};
