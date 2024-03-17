import { atom } from "jotai";
import { JSONContent } from "@tiptap/core";

import type { File, Template, StepItem } from "@/plugins/reports/types";

// State to store selected files
export const selectedFilesAtom = atom<File[]>([]);
// State to store selected template
export const selectedTemplateAtom = atom<Template | undefined>(undefined);
// State to store previously selected template
export const previousTemplateAtom = atom<Template | undefined>(undefined);
// State to store active step
export const activeStepAtom = atom<StepItem | undefined>(undefined);
// State to store editor state
export const editorStateAtom = atom<JSONContent | undefined>(undefined);
// State to store editor content in HTML
export const editorContentAtom = atom<string | undefined>(undefined);
