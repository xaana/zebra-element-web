import React from "react";
import { getBlobSafeMimeType } from "matrix-react-sdk/src/utils/blobs";
import BaseDialog from "matrix-react-sdk/src/components/views/dialogs/BaseDialog";
import DialogButtons from "matrix-react-sdk/src/components/views/elements/DialogButtons";
import { fileSize } from "matrix-react-sdk/src/utils/FileUtils";
import { Document, Page } from "react-pdf";

import { _t } from "../../../languageHandler";
import { Icon as FileIcon } from "../../../../res/img/feather-customised/files.svg";
import { Checkbox } from "@/components/ui/checkbox";
import StyledCheckbox from "matrix-react-sdk/src/components/views/elements/StyledCheckbox";

interface IProps {
    file: File;
    currentIndex: number;
    totalFiles: number;
    onFinished: (uploadConfirmed: boolean, uploadAll?: boolean, toZebra?: boolean) => void;
}
interface IState {
    toZebra: boolean;
    numPages: number|null;
}

export default class UploadConfirmDialog extends React.Component<IProps,IState> {
    private readonly objectUrl: string;
    private readonly mimeType: string;

    public static defaultProps: Partial<IProps> = {
        totalFiles: 1,
        currentIndex: 0,
    };

    public constructor(props: IProps) {
        super(props);
        this.state = {
            toZebra: true,
            numPages: null,
        }

        // Create a fresh `Blob` for previewing (even though `File` already is
        // one) so we can adjust the MIME type if needed.
        this.mimeType = getBlobSafeMimeType(props.file.type);
        const blob = new Blob([props.file], { type: this.mimeType });
        // 5000000
        this.objectUrl = URL.createObjectURL(blob);
    }

    private onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {
        this.setState({ numPages });
    };
    

    public componentWillUnmount(): void {
        if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    }

    private onCancelClick = (): void => {
        this.props.onFinished(false);
    };

    private onUploadClick = (): void => {
        this.props.onFinished(true,undefined,this.state.toZebra);
    };

    private onUploadAllClick = (): void => {
        this.props.onFinished(true, true,this.state.toZebra);
    };

    public render(): React.ReactNode {
        let title: string;
        if (this.props.totalFiles > 1 && this.props.currentIndex !== undefined) {
            title = _t("upload_file|title_progress", {
                current: this.props.currentIndex + 1,
                total: this.props.totalFiles,
            });
        } else {
            title = _t("upload_file|title");
        }

        const fileId = `mx-uploadconfirmdialog-${this.props.file.name}`;
        let preview: JSX.Element | undefined;
        let placeholder: JSX.Element | undefined;
        if (this.mimeType.startsWith("image/")) {
            preview = (
                <img className="mx_UploadConfirmDialog_imagePreview" src={this.objectUrl} aria-labelledby={fileId} />
            );
        } else if (this.mimeType.startsWith("video/")) {
            preview = (
                <video
                    className="mx_UploadConfirmDialog_imagePreview"
                    src={this.objectUrl}
                    playsInline
                    controls={false}
                />
            );
        } else {
            placeholder = <FileIcon className="mx_UploadConfirmDialog_fileIcon" height={18} width={18} />;
        }

        let uploadAllButton: JSX.Element | undefined;
        if (this.props.currentIndex + 1 < this.props.totalFiles) {
            uploadAllButton = <button onClick={this.onUploadAllClick}>{_t("upload_file|upload_all_button")}</button>;
        }

        return (
            <BaseDialog
                className="mx_UploadConfirmDialog"
                fixedWidth={false}
                onFinished={this.onCancelClick}
                title={title}
                contentId="mx_Dialog_content"
            >
                <div id="mx_Dialog_content">
                    <div className="mx_UploadConfirmDialog_previewOuter">
                        <div className="mx_UploadConfirmDialog_previewInner">
                            {preview && <div>{preview}</div>}
                            <div id={fileId}>
                                {placeholder}
                                {this.props.file.name} ({fileSize(this.props.file.size)})
                            </div>
                        </div>
                    </div>
                </div>
                {/* {!preview&&this.props.file.name.endsWith(".pdf")&&<div className="flex items-center space-x-2">
                    <StyledCheckbox
                        checked={this.state.toZebra}
                        onChange={(e) => this.setState({toZebra:e.target.checked})}
                    >
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Upload for Zebra Insight?
                    </label>
                    </StyledCheckbox>
                </div>} */}
                {this.objectUrl&&!preview&&this.props.file.name.endsWith(".pdf")&&
                <div className="pdf-wrapper rounded-lg border overflow-hidden h-[450px]">
                <div className="pdf-container bg-background p-2 overflow-auto h-full overflow-y-auto">
                    <Document
                        file={this.objectUrl}
                        onLoadSuccess={this.onDocumentLoadSuccess}
                        className="relative"
                    >
                        {Array.from(new Array(this.state.numPages), (_, index) => (
                            <Page
                                className={`page_${index + 1} relative`}
                                renderAnnotationLayer={false}
                                pageNumber={index + 1}
                                key={index}
                            />
                        ))}
                    </Document>
                </div>
            </div>
            }
                <DialogButtons
                    primaryButton={_t("action|upload")}
                    hasCancel={false}
                    onPrimaryButtonClick={this.onUploadClick}
                    focus={true}
                >
                    {uploadAllButton}
                </DialogButtons>
            </BaseDialog>
        );
    }
}
