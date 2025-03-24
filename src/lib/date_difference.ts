import moment from "moment";

// Function to calculate days between two dates
function calculateDaysBetweenDates(date1: string, date2: string) {
    return moment(date2).diff(moment(date1), "days");
}
export default calculateDaysBetweenDates;
