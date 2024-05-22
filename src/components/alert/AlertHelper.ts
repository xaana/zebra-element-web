export const generateAlertBody = (content:{
    receiver: string,
    status: string,
    alerts: {status:string, startsAt:string, endsAt: string}[]
}) => {
    const result = []
    for (const alert of content.alerts) {
        const subUriPos = alert.generatorURL.indexOf('/',10);
        result.push({
            name: alert.labels.alertname,
            value: alert.values || alert.valueString || "No values available.",
            // alertURL: alert.generatorURL || subUriPos === -1 ? alert.generatorURL.substring(subUriPos+1) : null,
            panelURL: alert.panelURL ? alert.panelURL.substring(subUriPos+1) : null,
            dashboardURL: alert.panelURL ? alert.dashboardURL.substring(subUriPos+1) : null
        })
    }
    return result;
}

export const generateAlertFromCols = (data:{[key: string]: any}[], targetCols:string[]):{[key: string]: any}[] => {
    return data.map(item=>{
        const filtered:{[key: string]: any} = {};
        targetCols.forEach(col => {
            if (item.hasOwnProperty(col)) {
                filtered[col] = item[col]
            }
        });
        return filtered;
    })
}
