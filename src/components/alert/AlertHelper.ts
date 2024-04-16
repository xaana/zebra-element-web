export const generateAlertBody = (content:{
    receiver: string,
    status: string,
    alerts: {status:string, startsAt:string, endsAt: string}[]
}) => {
    const result = [
        // {
        //     name: "Summary",
        //     value: content.commonAnnotations.summary
        // },
        // {
        //     name: "Alert name",
        //     value: content.commonLabels.alertname
        // } 
    ]
    for (const alert of content.alerts) {
        const subUriPos = alert.generatorURL.indexOf('/',10);
        result.push({
            name: alert.labels.alertname,
            value: alert.values || alert.valueString || "No values available.",
            alertURL: alert.generatorURL || subUriPos === -1 ? alert.generatorURL.substring(subUriPos+1) : null,
            panelURL: alert.panelURL ? alert.panelURL.substring(subUriPos+1) : null,
            dashboardURL: alert.panelURL ? alert.dashboardURL.substring(subUriPos+1) : null
        })
    }
    return result;
}