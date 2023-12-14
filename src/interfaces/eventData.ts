import { Myattendees } from "./attendees";
export interface eventData{
    summary: string;
    description: string;
    startDateTime: Date;
    endDateTime: Date;
    location: string;
    attendees: Myattendees;
}

  