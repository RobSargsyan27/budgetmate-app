class FetchHtmlLib {
    /**
     * @param {string} fileName
     * @returns {Promise<string>}
     * @description Fetch.
     */
    static async fetch(fileName) {
        return fetch(`${FetchHtmlLib.BASE_URL}/${fileName}.html`)
            .then(response => response.text())
    }
}

FetchHtmlLib.BASE_URL = '/src/assets/components'

module.exports = FetchHtmlLib
