import { MonitoredStores } from "@/app/_db/stores";
import storeUrl from "@/app/_libs/get-store-url";
import { Subscriber, Workshop } from "@/app/_types/types";
import { sendAdminEmail, sendNoticeEmail } from "@/app/_libs/send-email";
import { WorkshopInfoEmail } from "@/app/_components/email-template";
import { getFormattedDate } from "@/app/_libs/get-formatted-date";

export async function GET(req: Request): Promise<Response> {
    
    const simpleToken = process.env.SIMPLE_TOKEN ?? "";
    const registerUrl = process.env.REGISTRATION_URL ?? "";

    const headers = req.headers;
    const requestToken = headers.get("Authorization");
    const BearerToken = requestToken?.split(" ")[1];

    if (simpleToken==="" || BearerToken !== simpleToken) {
        return new Response(JSON.stringify({ 
            sucess: false,
            error: "Unauthorized",
         }), { 
            status: 401,
            statusText: "Unauthorized",
            headers: {
                "Content-Type": "application/json"
            },
        });
    }

    MonitoredStores.forEach(async (store) => {
        const url = storeUrl(store.storeID);
        const subscribers = store.subscribers;
        
        try {
            fetch(url)
            .then( async(response) => await response.json())
            .then(data => {
                const workshops = data.workshopEventWsDTO;
                if(!workshops){
                    //TODO: if(!workshops) Send email to admin
                    console.log('No workshop available, or the API structure has changed. Please check the API response.');
                    return;
                };

                const workshopAmount = workshops.length;
                const workshopList: Workshop[]= [];

                for(let i = 0; i < workshopAmount; i++){
                    const { startTime, endTime, attendeeLimit, workshopType, remainingSeats, eventType } = workshops[i];
                    // if (remainingSeats > 0) {
                        const startTimeFormatted = getFormattedDate(startTime);
                        const endTimeFormatted = getFormattedDate(endTime);
                        const { name, description, photo } = eventType;    
                        const photoUrl = photo.url;
                        const workshop: Workshop = {
                            startTime: startTimeFormatted,
                            endTime: endTimeFormatted,
                            attendeeLimit,
                            workshopType,
                            remainingSeats,
                            name,
                            description,
                            photoUrl
                        };
                        workshopList.push(workshop);
                    }
                // }

                if(workshopList.length === 0) {
                    console.log(`No available workshops at ${store.storeName}`);
                    return;
                }

                const emailHtmlContet: string = WorkshopInfoEmail(workshopList, registerUrl);

                subscribers.forEach(async (subscriber: Subscriber) => {
                    const { email } = subscriber;
                    const subject: string = `Home Depot ${store.storeName} has new workshops available - Workshop Monitor`;
                    try {
                        await sendNoticeEmail(subject, emailHtmlContet, email);
                        console.log(`Email sent to ${email}`);
                    }catch(error){
                        console.log(`Failed to send email to ${email}`);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    });

    return new Response(JSON.stringify({ 
        sucess: true,
        message: "All stores have been monitored",
     }),{
        status: 200,
        statusText: "OK",
        headers: {
            "Content-Type": "text/json"
        }
    });
}