import moment from "moment";

export const datetimestamp = moment(
    new Date(Date.now() + 1000 * 60 * -new Date().getTimezoneOffset())
        .toISOString()
        .replace("T", " ")
        .replace("Z", "")
).format("YYYY-MM-DD");
