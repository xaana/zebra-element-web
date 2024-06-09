import React, { useEffect, useState } from "react";
import SettingsStore from "matrix-react-sdk/src/settings/SettingsStore";
import { MatrixClientPeg } from "matrix-react-sdk/src/MatrixClientPeg";
import { toast } from "sonner";

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { Report } from "@/plugins/reports/types";

export const ShareReport = ({ report }: { report: Report }): JSX.Element => {
    const [open, setOpen] = useState(false);
    const [userIds, setUserIds] = useState<string[]>([]);
    const cli = MatrixClientPeg.safeGet();

    useEffect(() => {
        const url = `${SettingsStore.getValue("reportsApiUrl")}/api/get_users`;
        const request = new Request(url, {
            method: "GET",
        });
        fetch(request)
            .then((response) => response.json())
            .then((data) => {
                data.user && setUserIds(data.user.filter((item: string) => item !== "@zebra:securezebra.com"));
            });
    }, []);

    const handleShare = async (userId: string): Promise<void> => {
        console.log(`Sharing document with ${userId}`);
        setOpen(false);
        try {
            const response = await fetch(`${SettingsStore.getValue("reportsApiUrl")}/api/reports/share_document`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    current_user_id: cli.getSafeUserId(),
                    document_id: report.id,
                    target_user_id: userId,
                }),
            });
            // const data = await response.json();

            if (response.status === 200) {
                toast.success(`Document shared successfully.`);
            } else if (response.status === 403) {
                toast.error(`Unable to share. You do not have admin privileges for this document.`);
            }
        } catch (error) {
            toast.error("Error sharing the document. Please try again later.");
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <Button className="font-semibold text-sm" size="sm" onClick={() => setOpen(true)}>
                <Icon name="LockKeyhole" className="mr-2 h-4 w-4" />
                Share
            </Button>
            <CommandDialog className="w-[512px]" open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search for user..." />
                <CommandList>
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup heading="Users">
                        {userIds
                            .filter((item) => item !== cli.getSafeUserId())
                            .map((userId, index) => (
                                <CommandItem
                                    className="cursor-pointer"
                                    // onClick={async () => await handleShare(userId)}
                                    key={index}
                                    onSelect={async () => await handleShare(userId)}
                                >
                                    <Icon name="CircleUser" className="mr-2 h-4 w-4" />
                                    <span>{userId.split(":")[0].substring(1)}</span>
                                </CommandItem>
                            ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    );
};
