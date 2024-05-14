import { useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { useMatrixClientContext } from "matrix-react-sdk/src/contexts/MatrixClientContext";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";

import { TemplateCard } from "./TemplateCard";
import type { Template } from "@/plugins/reports/types";
import { TemplateList } from "./TemplateList";
import { ReportGenerator } from "./ReportGenerator";
import type { Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generatedOutlineAtom } from "@/plugins/reports/stores/store";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { sampleTemplate, logTemplate } from "@/plugins/reports/initialContent";
import { getTemplateContent } from "@/plugins/reports/utils/getTemplateContent";

interface TemplateSelectorProps {
    editor: Editor | null;
    nextStep: () => void;
    prevStep: () => void;
}

export type GeneratedOutline = {
    documentPrompt: string;
    allTitles: string[];
    contentSize: string;
    tone: string;
    targetAudience: string;
};

const defaultTemplates = [sampleTemplate, logTemplate];
export const TemplateSelector = ({ editor, nextStep, prevStep }: TemplateSelectorProps): JSX.Element => {
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null | undefined>(undefined);
    const setGeneratorOutline = useSetAtom(generatedOutlineAtom);
    const [templates, setTemplates] = useState<Template[]>([...defaultTemplates]);
    const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
    const [filterValue, setFilterValue] = useState("all");
    const [displayType, setDisplayType] = useState("grid");
    const client = useMatrixClientContext();

    useEffect(() => {
        const fetchTemplatesData = async (): Promise<void> => {
            try {
                const response = await fetch(
                    `${SettingsStore.getValue("reportsApiUrl")}/api/template/get_document_list`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_id: client.getSafeUserId() }),
                    },
                );
                const data = await response.json();
                if (data?.document?.length === 0) return;
                setTemplates((prev) => [
                    ...prev,
                    ...data.document.map(
                        ({
                            id,
                            document_name: name,
                            document_description: description,
                            document_type: type,
                            updated_at: updatedAt,
                        }: {
                            id: string;
                            document_name: string;
                            document_description: string;
                            document_type: string;
                            updated_at: Date;
                        }) => ({
                            id,
                            name,
                            description: description ?? "",
                            type,
                            timestamp: updatedAt,
                        }),
                    ),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchData = async (): Promise<void> => {
            await fetchTemplatesData();
        };

        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (filterValue === "reports") {
            setFilteredTemplates(templates.filter((template) => template.type === "report"));
        } else if (filterValue === "templates") {
            setFilteredTemplates(templates.filter((template) => template.type === "template"));
        } else {
            setFilteredTemplates(templates);
        }
    }, [filterValue, templates]);

    const handleSelectTemplate = async (template: Template | null): Promise<void> => {
        // Editor initialization priorities: editorState > template > blank
        if (template === null) {
            // Blank template selected
            setSelectedTemplate(() => null);
            editor?.commands.setContent("");
        } else {
            setSelectedTemplate(() => template);
            // If template is not from preset templates, fetch its content
            if (Number(template.id) >= 0) {
                const templateContentString = await getTemplateContent(template.id);
                templateContentString && editor?.commands.setContent(templateContentString);
                // templateContentString &&
                //     setSelectedTemplate((prev) => {
                //         return prev ? { ...prev, content: JSON.parse(templateContentString) } : undefined;
                //     });
                // const templateContentJson = JSON.parse(templateContentString ?? "");
                // template && templateContentJson && editor?.commands.setContent(templateContentJson);
            } else {
                template.content && editor?.commands.setContent(template.content);
            }
        }
        nextStep();
    };

    const handleReportGenerateAI = (
        documentPrompt: string,
        allTitles: string[],
        contentSize: string,
        tone: string,
        targetAudience: string,
    ): void => {
        setGeneratorOutline({
            documentPrompt,
            allTitles,
            contentSize,
            tone,
            targetAudience,
        });
        handleSelectTemplate(null);
    };

    return (
        <>
            <div className="w-full text-2xl font-semibold mb-2 flex items-center gap-2">
                <Icon name="GalleryVerticalEnd" className="h-5 w-5" />
                All Reports
            </div>
            <div className="flex items-center gap-2 mb-6">
                <ReportGenerator onReportGenerate={handleReportGenerateAI} />
                <Button
                    className="font-semibold text-sm"
                    onClick={() => handleSelectTemplate(null)}
                    size="sm"
                    disabled={selectedTemplate === null}
                    variant="secondary"
                >
                    <Icon name="Plus" className="mr-2" />
                    New From Blank
                </Button>
            </div>

            <div className="flex justify-between items-center mb-6">
                <ToggleGroup
                    type="single"
                    value={filterValue}
                    onValueChange={(value) => {
                        if (value) setFilterValue(value);
                    }}
                    className="justify-start gap-2"
                    size="sm"
                >
                    <ToggleGroupItem value="all" aria-label="Toggle all">
                        <Icon name="AlignJustify" className="mr-2" />
                        All
                    </ToggleGroupItem>
                    <ToggleGroupItem value="templates" aria-label="Toggle templates">
                        <Icon name="LayoutTemplate" className="mr-2" />
                        Templates
                    </ToggleGroupItem>
                    <ToggleGroupItem value="reports" aria-label="Toggle reports">
                        <Icon name="FileCheck2" className="mr-2" />
                        Reports
                    </ToggleGroupItem>
                </ToggleGroup>

                <Tabs value={displayType} onValueChange={(value) => setDisplayType(value)} className="">
                    <TabsList>
                        <TabsTrigger value="grid">
                            <Icon className="mr-2" name="LayoutGrid" />
                            Grid
                        </TabsTrigger>
                        <TabsTrigger value="list">
                            <Icon className="mr-2" name="List" />
                            List
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {displayType === "grid" ? (
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filteredTemplates.map((template) => (
                        <TemplateCard
                            key={template.id}
                            template={template}
                            selected={selectedTemplate !== null && selectedTemplate?.id === template.id}
                            onSelectTemplate={handleSelectTemplate}
                        />
                    ))}
                </div>
            ) : (
                <TemplateList templates={filteredTemplates} selectTemplate={handleSelectTemplate} />
            )}
        </>
    );
};
