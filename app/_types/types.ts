import exp from "constants";

// Email types
type EmailTemplate = {
    subject: string;
    body: string;
    };
type EmailSender = {
    emailAddress: string;
    emailAPPKey: string;
    };
// Subscriber types
type Subscriber = {
    email: string;
    name: string;
    };

type Subscribers = Subscriber[];

// Store types
type Store = {
    storeName: string;
    storeID: string;
    subscribers: Subscribers;
    };

type Workshop = {
    startTime: string;
    endTime: string;
    attendeeLimit: number;
    workshopType: string;
    remainingSeats: number;
    name: string;
    description: string;
    photoUrl: string;
};

export type { EmailTemplate, EmailSender, Subscriber, Subscribers, Store, Workshop};
