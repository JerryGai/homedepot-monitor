const apiBaseUrl = process.env.API_BASE_URL ?? "";

export default function storeUrl(storeId: string, lang: string = "en") : string {
    if (!storeId) {
        throw new Error("storeId is required");
    }

    if (!apiBaseUrl) {
        throw new Error("API_BASE_URL is required");
    }

    return `${apiBaseUrl}${storeId}&lang=${lang}`;
}