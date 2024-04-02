import { baseUrl } from "../_db/configs";

export default function storeUrl(storeId: string, lang: string = "en") : string {
    if (!storeId) {
        throw new Error("storeId is required");
    }
    return `${baseUrl}${storeId}&lang=${lang}`;
}