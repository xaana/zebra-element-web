import { atom } from "jotai";
import { JSONContent } from "@tiptap/core";

import type { StepItem, MatrixFile } from "@/plugins/reports/types";
import type { GeneratedOutline } from "@/components/reports/TemplateSelector";

// State to store API URL
export const showHomeAtom = atom<boolean>(true);
// State to store selected files
export const selectedFilesAtom = atom<MatrixFile[]>([]);
// State to store active step
export const activeStepAtom = atom<StepItem | undefined>(undefined);
// State to store editor state
export const editorStateAtom = atom<JSONContent | undefined>(undefined);
// State to store editor content in HTML
export const editorContentAtom = atom<string | undefined>(undefined);
// State to store generated content outline
export const generatedOutlineAtom = atom<GeneratedOutline | undefined>(undefined);
