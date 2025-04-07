import moment, { Moment } from "moment";

// Function to calculate days between two dates
function calculateDaysBetweenDates(
    date1: string | Moment,
    date2: string | Moment
) {
    return moment(date2).diff(moment(date1), "days");
}
export default calculateDaysBetweenDates;
