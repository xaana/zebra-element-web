import { MatrixFile } from "../types";

export const mediaIdsFromFiles = (files: MatrixFile[]): string[] => {
    // const mediaIdRegexPattern = /\w+:\/\/\w+\.\w+\/(\w+)/;
    const mediaIds = files
        .map((file) => file.mediaId)
        // .map((mediaId) => {
        //     const match = mediaIdRegexPattern.exec(mediaId);
        //     return match ? match[1] : null;
        // })
        .filter(Boolean) as string[];
    return mediaIds;
};
