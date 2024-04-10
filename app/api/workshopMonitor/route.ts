import { MonitoredStores } from "@/app/_db/stores";
import storeUrl from "@/app/_libs/get-store-url";
import { Workshop } from "@/app/_types/types";
import { sendAdminEmail, sendNoticeEmail } from "@/app/_libs/send-email";
import { WorkshopInfoEmail } from "@/app/_components/email-template";
import { getFormattedDate } from "@/app/_libs/get-formatted-date";

export async function GET(req: Request): Promise<Response> {
    const registerUrl = process.env.REGISTRATION_URL ?? "";

    const headers = req.headers;
    const requestToken = headers.get("Authorization");
    const BearerToken = requestToken?.split(" ")[1];

    if (process.env.SIMPLE_TOKEN === "" || BearerToken !== process.env.SIMPLE_TOKEN) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "Unauthorized",
            }),
            {
                status: 401,
                statusText: "Unauthorized",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }

    const emailPromises: Promise<void>[] = [];

    for (const store of MonitoredStores) {
        const url = storeUrl(store.storeID);
        const subscribers = store.subscribers;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const workshops = data.workshopEventWsDTO;

            if (!workshops) {
                console.log(
                    "No workshop available, or the API structure has changed. Please check the API response."
                );
                sendAdminEmail("Workshop API Error", "No workshop available, or the API structure has changed. Please check the API response.", process.env.ADMIN_EMAIL ?? "gaijianyi@gmail.com");
                return new Response(
                    JSON.stringify({
                        success: false,
                        message: "No workshop available, or the API structure has changed. Please check the API response.",
                        }),
                        {
                            status: 500,
                            statusText: "Internal Server Error",
                            headers: {
                                "Content-Type": "text/json",
                                },       
                            }
                        );
            }

            const workshopList: Workshop[] = [];

            for (const workshop of workshops) {
                const { startTime, endTime, attendeeLimit, workshopType, remainingSeats, eventType } =
                    workshop;
                const { name, description, photo } = eventType;

                // if (remainingSeats === 0) {
                //     continue;
                // }
                const startTimeFormatted = getFormattedDate(startTime);
                const endTimeFormatted = getFormattedDate(endTime);
                const photoUrl = photo.url;
                workshopList.push({
                    startTime: startTimeFormatted,
                    endTime: endTimeFormatted,
                    attendeeLimit,
                    workshopType,
                    remainingSeats,
                    name,
                    description,
                    photoUrl,
                });
            }

            if (workshopList.length === 0) {
                console.log(`No available workshops at ${store.storeName}`);
                continue;
            }
            
            const emailHtmlContent: string = WorkshopInfoEmail(workshopList, registerUrl);

            for (const subscriber of subscribers) {
                const { email } = subscriber;
                const subject: string = `Home Depot ${store.storeName} has new workshop available!`;
                emailPromises.push(sendNoticeEmail(subject, emailHtmlContent, email));
            }
        } catch (error) {
            console.log(error);
            return new Response(
                JSON.stringify({
                    success: false,
                    message: `Error occurred while processing store: ${store.storeName}. Error: ${error}`,
                }),
                {
                    status: 500,
                    statusText: "Internal Server Error",
                    headers: {
                        "Content-Type": "text/json",
                    },
                }
            );
        }
    }

    await Promise.all(emailPromises);

    return new Response(
        JSON.stringify({
            success: true,
            message: "All stores have been monitored",
        }),
        {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "text/json",
            },
        }
    );
}