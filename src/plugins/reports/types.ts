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
    createdAt: Date;
    content?: Object;
};

export type File = {
    id: string;
    name: string;
    owner: string;
    createdAt: Date;
};
