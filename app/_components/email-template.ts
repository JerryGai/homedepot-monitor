import { Workshop } from "../_types/types";

export function WorkshopInfoEmail(workshops: Workshop[], registerUrl: string) {

    const workshopTableList = workshops.map(workshop => {
        return workshopTable(workshop);
    });

   return `<html>
                <body style="padding:10px 20px;">
                <h1>The Homedepot Workshop at your Location is available!</h1>
                ${workshopTableList.join('')}
                <a href=${registerUrl} target="_blank" style="display: block; border: 1px solid red; width: 200px; text-align: center; padding: 10px 20px; margin: 30px 0; background-color: red; color: white;">Go to Home Deport Register!</a>
                </body>
            </html>`;
}

const workshopTable = (workshop: Workshop) => `
<table width="600" style="border: 1px solid black; margin-top: 30px; margin-bottom: 30px; padding: 12px;">
    <tr><td width="200">Name: </td><td width="400">${workshop.name}</td></tr>
    <tr><td>Workshop Type: </td><td>${workshop.workshopType}</td></tr>
    <tr><td>Start Time: </td><td>${workshop.startTime}</td></tr>
    <tr><td>End Time: </td><td>${workshop.endTime}</td></tr>
    <tr><td>AttendeeLimit </td><td><b>${workshop.attendeeLimit}</b></td></tr>
    <tr><td>Remaining Seats: </td><td><b>${workshop.remainingSeats}</b></td></tr>
    <tr><td>Description: </td><td>${workshop.description}</td></tr>
    <tr><td colspan="2" style="height: 30px;"></td></tr>
    <tr><td colspan="2"><img src="${workshop.photoUrl}" style="width: 100%; height: auto;" /></td></tr>
    <tr><td colspan="2" style="height: 30px;"></td></tr>
</table>
`;