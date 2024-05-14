import { atom } from "jotai";

import type { StepItem } from "@/plugins/reports/types";
import type { GeneratedOutline } from "@/components/reports/TemplateSelector";

// State to store API URL
export const showHomeAtom = atom<boolean>(true);
// State to store active step
export const activeStepAtom = atom<StepItem | undefined>(undefined);
// State to store generated content outline
export const generatedOutlineAtom = atom<GeneratedOutline | undefined>(undefined);
