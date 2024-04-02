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

export type { EmailTemplate, EmailSender, Subscriber, Subscribers, Store };
