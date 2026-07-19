/**
 * Format a timestamp into 1-12 am/pm format.
 * @param {Date} time
 * @returns {string} Formatted date string.
 */
export function formatTime(time){
    let hour = time.getHours();
    let min = time.getMinutes();
    let suffix = "am";

    if (hour > 12){
        hour -= 12;
        suffix = "pm"
    } 
    else if (hour == 12){
        suffix = "pm"
    }
    else if (hour == 0){
        hour = 12
    }

    min = min > 0 
        ? `:${min.toString().padStart(2, '0')}` : ""
    ;

    return `${hour}${min}${suffix}`;
}
