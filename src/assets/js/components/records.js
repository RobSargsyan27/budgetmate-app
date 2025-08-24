const { ActivityLogLib } = require('../lib')
const { RecordsApi } = require('../api')

class Records {
    /**
     * @returns {Object}
     * @description Get record filters.
     */
    static getRecordFilters() {
        const recordTypeSelect = document.getElementById('recordTypeSelect').value
        const timestampStartFilter = document.getElementById('timestampStartFilter').value
        const timestampEndFilter = document.getElementById('timestampEndFilter').value
        const amountStartFilter = document.getElementById('amountStartFilter').value
        const amountEndFilter = document.getElementById('amountEndFilter').value

        return {
            recordType: recordTypeSelect === 'all' ? null : recordTypeSelect,
            amountGreaterThan: amountStartFilter || null,
            amountLessThan: amountEndFilter || null,
            paymentTimeGreaterThan: timestampStartFilter === null ? null : new Date(timestampStartFilter),
            paymentTimeLessThan: timestampEndFilter === null ? null : new Date(timestampEndFilter)
        }
    }

    /**
     * @param {number} currentPage
     * @returns {Promise<void>}
     * @description Render records table.
     */
    static async renderRecordTable( currentPage) {
        const limit = document.getElementById('recordsPerPageSelect').value
        const offset = (currentPage - 1) * parseInt(limit)
        const recordsTableBody = document.getElementById('recordsHistoryTableBody')

        const payload = { ...Records.getRecordFilters(), limit, offset }
        const records = await RecordsApi.searchUserRecords( payload)

        recordsTableBody.innerHTML = ''
        records.forEach((record) => {
            const paymentTime = new Date(record.paymentTime)
            recordsTableBody.innerHTML += `<tr class="spa-nav" data-ref="record" data-id="${record.id}">
          <td>${record.amount}</td>
          <td>${record.type}</td>
          <td>${record.category?.name || ''}</td>
          <td>${record.currency}</td>
          <td>${paymentTime.getMonth() + 1}/${paymentTime.getDate()}/${paymentTime.getFullYear()}</td>
          <td>${record.receivingAccountName || ''}</td>
          <td>${record.withdrawalAccountName || ''}</td>
       </tr>`
        })
    }

    /**
     * @param {number} recordsCount
     * @param {number} recordsPerPage
     * @param {number} currentPage
     * @returns void
     * @description Render pagination.
     */
    static renderPagination(recordsCount, recordsPerPage, currentPage) {
        const paginationControls = document.getElementById('paginationControls')
        const totalPages = Math.ceil(recordsCount / recordsPerPage)
        paginationControls.innerHTML = ''

        function createPageItem(page, label = null, isActive = false, isDisabled = false) {
            const li = document.createElement('li')
            li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`
            li.innerHTML = `<a class="page-link" href="#">${label || page}</a>`
            if (!isDisabled && !isActive) {
                li.addEventListener('click', async (e) => {
                    e.preventDefault()
                    currentPage = page
                    await Records.renderRecordTable( currentPage)
                    Records.renderPagination(recordsCount, recordsPerPage, currentPage)
                })
            }
            paginationControls.appendChild(li)
        }

        createPageItem(currentPage - 1, '&laquo;', false, currentPage === 1)

        currentPage > 3 && createPageItem(1)

        if (currentPage > 4) {
            const li = document.createElement('li')
            li.className = 'page-item disabled'
            li.innerHTML = '<span class="page-link">...</span>'
            paginationControls.appendChild(li)
        }

        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            createPageItem(i, null, i === currentPage)
        }

        if (currentPage < totalPages - 3) {
            const li = document.createElement('li')
            li.className = 'page-item disabled'
            li.innerHTML = '<span class="page-link">...</span>'
            paginationControls.appendChild(li)
        }

        currentPage < totalPages - 2 && createPageItem(totalPages)
        createPageItem(currentPage + 1, '&raquo;', false, currentPage === totalPages)
    }

    /**
     * @returns void
     * @description Set generate report listener.
     */
    static setGenerateReportListener() {
        document.getElementById('recordReportButton').addEventListener('click', async () => {
            const blob = await RecordsApi.getUserRecordsReport( Records.getRecordFilters())

            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = 'records-report.json'
            link.click()
        })
    }

    /**
     * @returns {Promise<void>}
     * @description Init page.
     */
    static async init() {

        let currentPage = 1
        const recordsCount = await RecordsApi.countUserRecords( Records.getRecordFilters())
        const recordsPerPage = document.getElementById('recordsPerPageSelect').value
        await Records.renderPagination(recordsCount, recordsPerPage, currentPage)
        await Records.renderRecordTable( currentPage)

        if(!Records.listenersBound){
            const recordsPerPageSelect = document.getElementById('recordsPerPageSelect')
            recordsPerPageSelect.addEventListener('change', async () => {
                const recordsPerPage = parseInt(this.value)
                currentPage = 1
                const recordsCount = await RecordsApi.countUserRecords( Records.getRecordFilters())
                Records.renderPagination(recordsCount, recordsPerPage, currentPage)
                await Records.renderRecordTable( currentPage)
            })

            document.getElementById('recordsApplyFilters').addEventListener('click', async (event) => {
                const recordsPerPage = parseInt(document.getElementById('recordsPerPageSelect').value)
                currentPage = 1
                const recordsCount = await RecordsApi.countUserRecords( Records.getRecordFilters())
                Records.renderPagination(recordsCount, recordsPerPage, currentPage)
                await Records.renderRecordTable( currentPage)

                event.target.blur()
            })

            Records.setGenerateReportListener()
            Records.listenersBound = true
        }

        ActivityLogLib.addActionToActivityLog('Records History')
        ActivityLogLib.setUserActivityLogDetails()
    }
}

Records.listenersBound = false

module.exports = Records
