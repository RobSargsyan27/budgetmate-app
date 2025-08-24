class CookieLib {
    /**
     * @param {string} cookieName
     * @returns {string|null}
     * @description Get cookie.
     */
    static getCookie(cookieName){
        const match = document.cookie.match(new RegExp('(?:^|; )' + cookieName + '=([^;]*)'));

        return match ? decodeURIComponent(match[1]) : null;
    }
}

module.exports = CookieLib