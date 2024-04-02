import { MonitoredStores } from "@/app/_db/stores";
import storeUrl from "@/app/_libs/store-url";
import { simpleToken } from "@/app/_db/configs";
import { Subscriber } from "@/app/_types/types";

export async function GET(req: Request): Promise<Response> {
    
    const headers = req.headers;
    const token = headers.get("Authorization");
    const BearerToken = token?.split(" ")[1];

    if (BearerToken !== simpleToken) {
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
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            if (data && data.length > 0) {
                subscribers.forEach(async (subscriber: Subscriber) => {
                    const { email } = subscriber;
                    const message = {
                        from: "Workshop Monitor",
                        to: email,
                        subject: `Workshop Monitor - ${store.storeName}`,
                        text: `Workshop Monitor - ${store.storeName} has new workshops available.`
                    };
                    console.log(message);
                    // await sendEmail(message);
                });
            }
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