class ActivityLogLib {
    /**
     * @param {string} page
     * @description Add action to activity log.
     */
    static addActionToActivityLog(page){
        const sessionActivityLog = sessionStorage.getItem('activityLog');
        const activityLog = JSON.parse(sessionActivityLog) || [];

        const message = { page, date: new Date()};
        activityLog.push(message);

        sessionStorage.setItem('activityLog', JSON.stringify(activityLog));
    }

    /**
     * @description Set user activity log details.
     */
    static setUserActivityLogDetails() {
        const sessionActivityLog = sessionStorage.getItem('activityLog');

        if (sessionActivityLog) {
            const activityLog = JSON.parse(sessionActivityLog);
            const activityLogTable = document.getElementById('activityLogTable');

            activityLogTable.innerHTML = '';
            activityLog.forEach((log) => {
                activityLogTable.innerHTML +=
                `<tr>
                    <td>${log.page}</td>
                    <td>${log.date}</td>
                </tr>`;
            });
        }
    }
}

module.exports = ActivityLogLib