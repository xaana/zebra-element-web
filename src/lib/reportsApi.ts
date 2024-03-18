export class ReportsAPI {
    public static uploadImage = async (): Promise<string> => {
        await new Promise((r) => setTimeout(r, 500));
        return "/img/placeholder-image.jpg";
    };
}

export default ReportsAPI;
