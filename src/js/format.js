const charBlacklist = [ "&", "<", ">", "\"", "\'" ]
const schemeWhitelist = ["https:", "http:"]

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

/**
 * Escape a html string, stripping or replacing
 * "dangerous" characters.
 * @param {string} str
 * @returns {string} Escaped string.
 */
export function escapeHTML(str){
    const replace = char => {
        switch (char){
            case "&": return "&amp;"
            case "<": return "&lt;"
            case ">": return "&gt;"
            case "\"": return "&quot;"
            case "\'": return "&#39;"
            default: return char
        }
    }

    return str.replace(
        new RegExp(`(${charBlacklist.join("|")})`, "g"),
        char => replace(char)
    )
}

/**
 * Sanitize a URL. Blocks urls that have invalid schemes.
 * @param {URL | string | null} url URL to sanitize.
 *  If a string, or null is given, will attempt to covert to URL type.
 * @returns {URL | null} Same as `url` if valid, `about:blank` if invalid.
 */
export function escapeURL(url){
    if(!url){
        return null;
    }

    if(!(url instanceof URL)){
        // Convert to URL type if string.
        url = new URL(url)
    }

    for(let s of schemeWhitelist){
        if (url.protocol == s) return url;
    }
    
    return new URL("about:blank#blocked")
}