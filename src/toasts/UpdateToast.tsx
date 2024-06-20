

import React from "react";

import { _t } from "../languageHandler";
import SdkConfig from "matrix-react-sdk/src/SdkConfig";
import GenericToast from "matrix-react-sdk/src/components/views/toasts/GenericToast";
import ToastStore from "matrix-react-sdk/src/stores/ToastStore";
import QuestionDialog from "matrix-react-sdk/src/components/views/dialogs/QuestionDialog";
import ChangelogDialog from "matrix-react-sdk/src/components/views/dialogs/ChangelogDialog";
import PlatformPeg from "matrix-react-sdk/src/PlatformPeg";
import Modal from "matrix-react-sdk/src/Modal";

const TOAST_KEY = "update";

/*
 * Check a version string is compatible with the Changelog
 * dialog ([element-version]-react-[react-sdk-version]-js-[js-sdk-version])
 */
function checkVersion(ver: string): boolean {
    const parts = ver.split("-");
    return parts.length === 5 && parts[1] === "react" && parts[3] === "js";
}

function installUpdate(): void {
    PlatformPeg.get()?.installUpdate();
}

export const showToast = (version: string, newVersion: string, releaseNotes?: string): void => {
    function onReject(): void {
        PlatformPeg.get()?.deferUpdate(newVersion);
    }

    const onAccept = installUpdate;
    const acceptLabel = _t("action|update");
    // if (releaseNotes) {
    //     onAccept = () => {
    //         Modal.createDialog(QuestionDialog, {
    //             title: _t("update|release_notes_toast_title"),
    //             description: <pre>{releaseNotes}</pre>,
    //             button: _t("action|update"),
    //             onFinished: (update) => {
    //                 if (update && PlatformPeg.get()) {
    //                     PlatformPeg.get()!.installUpdate();
    //                 }
    //             },
    //         });
    //     };
    // } else if (checkVersion(version) && checkVersion(newVersion)) {
    //     onAccept = () => {
    //         Modal.createDialog(ChangelogDialog, {
    //             version,
    //             newVersion,
    //             onFinished: (update) => {
    //                 if (update && PlatformPeg.get()) {
    //                     PlatformPeg.get()!.installUpdate();
    //                 }
    //             },
    //         });
    //     };
    // } else {
    // onAccept = installUpdate;
    // acceptLabel = _t("action|update");
    // }

    const brand = SdkConfig.get().brand;
    ToastStore.sharedInstance().addOrReplaceToast({
        key: TOAST_KEY,
        title: _t("update|toast_title", { brand }),
        props: {
            description: _t("update|toast_description", { brand }),
            acceptLabel,
            onAccept,
            rejectLabel: _t("action|dismiss"),
            onReject,
        },
        component: GenericToast,
        priority: 20,
    });
};

export const hideToast = (): void => {
    ToastStore.sharedInstance().dismissToast(TOAST_KEY);
};
