export default function getStoreWorkshop(storeId: string, lang: string = "en") : string {
    if (!storeId) {
        throw new Error("storeId is required");
    }
    return `https://www.homedepot.ca/api/workshopsvc/v1/workshops/all?storeId=${storeId}&lang=${lang}`;
}