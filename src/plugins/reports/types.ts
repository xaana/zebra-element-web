import { JSONContent } from "@tiptap/core";

export type MatrixFile = {
    id: string;
    name: string;
    downloadUrl: string;
    timestamp: Date;
    sender: string;
    roomId: string;
    //   room?: Room
    isEncrypted: boolean;
    //   mediaHelper: MediaEventHelper
    mediaId: string;
};

export type StepItem = {
    id: number;
    text: string;
    // status: StepStatus
    title: string;
    description: string;
    nextStepTitle: string;
};

export type Template = {
    id: string;
    name: string;
    description: string;
    timestamp: string;
    type: "document" | "template";
    content?: JSONContent;
    status?: string;
};

export type File = {
    id: string;
    name: string;
    owner: string;
    createdAt: Date;
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
