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
        result.push({
            name: alert.labels.alertname,
            value: alert.value || alert.valueString || "No values available.",
            alertURL: alert.generatorURL,
            panelURL: alert.panelURL,
            dashboardURL: alert.dashboardURL
        })
    }
    return result;
}