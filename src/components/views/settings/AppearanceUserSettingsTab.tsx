import React, { ChangeEvent, ReactNode } from "react";

import { _t } from "matrix-react-sdk/src/languageHandler";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
// import SettingsFlag from "matrix-react-sdk/src/components/views/elements/SettingsFlag";
// import Field from "matrix-react-sdk/src/components/views/elements/Field";
// import AccessibleButton from "matrix-react-sdk/src/components/views/elements/AccessibleButton";
// import { SettingLevel } from "matrix-react-sdk/src/settings/SettingLevel";
// import { UIFeature } from "matrix-react-sdk/src/settings/UIFeature";
import { Layout } from "matrix-react-sdk/src/settings/enums/Layout";
import LayoutSwitcher from "matrix-react-sdk/src/components/views/settings/LayoutSwitcher";
import FontScalingPanel from "matrix-react-sdk/src/components/views/settings/FontScalingPanel";
import ThemeChoicePanel from "matrix-react-sdk/src/components/views/settings/ThemeChoicePanel";
import ImageSizePanel from "matrix-react-sdk/src/components/views/settings/ImageSizePanel";
import SettingsTab from "matrix-react-sdk/src/components/views/settings/tabs/SettingsTab";
import { SettingsSection } from "matrix-react-sdk/src/components/views/settings/shared/SettingsSection";
import SettingsSubsection, {
    SettingsSubsectionText,
} from "matrix-react-sdk/src/components/views/settings/shared/SettingsSubsection";
import MatrixClientContext from "matrix-react-sdk/src/contexts/MatrixClientContext";

interface IProps {}

interface IState {
    useBundledEmojiFont: boolean;
    useSystemFont: boolean;
    systemFont: string;
    showAdvanced: boolean;
    layout: Layout;
    // User profile data for the message preview
    userId?: string;
    displayName?: string;
    avatarUrl?: string;
}

export default class AppearanceUserSettingsTab extends React.Component<IProps, IState> {
    public static contextType = MatrixClientContext;
    public context!: React.ContextType<typeof MatrixClientContext>;

    private readonly MESSAGE_PREVIEW_TEXT = _t("common|preview_message");

    private unmounted = false;

    public constructor(props: IProps) {
        super(props);

        this.state = {
            useBundledEmojiFont: SettingsStore.getValue("useBundledEmojiFont"),
            useSystemFont: SettingsStore.getValue("useSystemFont"),
            systemFont: SettingsStore.getValue("systemFont"),
            showAdvanced: false,
            layout: SettingsStore.getValue("layout"),
        };
    }

    public async componentDidMount(): Promise<void> {
        // Fetch the current user profile for the message preview
        const client = this.context;
        const userId = client.getUserId()!;
        const profileInfo = await client.getProfileInfo(userId);
        if (this.unmounted) return;

        this.setState({
            userId,
            displayName: profileInfo.displayname,
            avatarUrl: profileInfo.avatar_url,
        });
    }

    public componentWillUnmount(): void {
        this.unmounted = true;
    }

    private onLayoutChanged = (layout: Layout): void => {
        this.setState({ layout: layout });
    };

    // private renderAdvancedSection(): ReactNode {
    //     if (!SettingsStore.getValue(UIFeature.AdvancedSettings)) return null;

    //     const brand = SdkConfig.get().brand;
    //     const toggle = (
    //         <AccessibleButton
    //             kind="link"
    //             onClick={() => this.setState({ showAdvanced: !this.state.showAdvanced })}
    //             aria-expanded={this.state.showAdvanced}
    //         >
    //             {this.state.showAdvanced ? _t("action|hide_advanced") : _t("action|show_advanced")}
    //         </AccessibleButton>
    //     );

    //     let advanced: React.ReactNode;

    //     if (this.state.showAdvanced) {
    //         const tooltipContent = _t("settings|appearance|custom_font_description", { brand });
    //         advanced = (
    //             <>
    //                 <SettingsFlag name="useCompactLayout" level={SettingLevel.DEVICE} useCheckbox={true} />

    //                 <SettingsFlag
    //                     name="useBundledEmojiFont"
    //                     level={SettingLevel.DEVICE}
    //                     useCheckbox={true}
    //                     onChange={(checked) => this.setState({ useBundledEmojiFont: checked, useSystemFont: !checked })}
    //                 />
    //                 <SettingsFlag
    //                     name="useSystemFont"
    //                     level={SettingLevel.DEVICE}
    //                     useCheckbox={true}
    //                     onChange={(checked) => this.setState({ useSystemFont: checked, useBundledEmojiFont: !checked })}
    //                 />
    //                 <Field
    //                     className="mx_AppearanceUserSettingsTab_checkboxControlledField"
    //                     label={SettingsStore.getDisplayName("systemFont")!}
    //                     onChange={(value: ChangeEvent<HTMLInputElement>) => {
    //                         this.setState({
    //                             systemFont: value.target.value,
    //                         });

    //                         SettingsStore.setValue("systemFont", null, SettingLevel.DEVICE, value.target.value);
    //                     }}
    //                     tooltipContent={tooltipContent}
    //                     forceTooltipVisible={true}
    //                     disabled={!this.state.useSystemFont}
    //                     value={this.state.systemFont}
    //                 />
    //             </>
    //         );
    //     }
    //     return (
    //         <SettingsSubsection>
    //             {toggle}
    //             {advanced}
    //         </SettingsSubsection>
    //     );
    // }

    public render(): React.ReactNode {
        const brand = SdkConfig.get().brand;

        return (
            <SettingsTab data-testid="mx_AppearanceUserSettingsTab">
                <SettingsSection heading={_t("settings|appearance|heading")}>
                    <SettingsSubsectionText>{_t("settings|appearance|subheading", { brand })}</SettingsSubsectionText>
                    <ThemeChoicePanel />
                    <LayoutSwitcher
                        userId={this.state.userId}
                        displayName={this.state.displayName}
                        avatarUrl={this.state.avatarUrl}
                        messagePreviewText={this.MESSAGE_PREVIEW_TEXT}
                        onLayoutChanged={this.onLayoutChanged}
                    />
                    <FontScalingPanel />
                    {/* {this.renderAdvancedSection()} */}
                    <ImageSizePanel />
                </SettingsSection>
            </SettingsTab>
        );
    }
}
