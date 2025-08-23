import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'jquery.easing/jquery.easing.min.js'
import 'chart.js/auto'
import 'joi-browser/dist/joi-browser'

import '../css/theme.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import { Account, Analytics, Budget, Budgets, Dashboard, Generic, Profile, Record, Records } from './components'
import { FetchHtmlLib } from './lib'

const componentFns = {
    accounts: Account.init,
    analytics: Analytics.init,
    budget: Budget.init,
    budgets: Budgets.init,
    dashboard: Dashboard.init,
    profile: Profile.init,
    record: Record.init,
    records: Records.init
}

const mainContent = document.getElementById('mainContent')

/**
 * @returns {Promise<void>}
 * @description Render error page.
 */
async function renderErrorPage() {
    mainContent.innerHTML = await FetchHtmlLib.fetch('error')
}

/**
 * @param {string} componentName
 * @description Render page.
 */
async function renderPage(componentName) {
    try {
        mainContent.innerHTML = await FetchHtmlLib.fetch(componentName)
        await componentFns[componentName]()
    } catch (error) {
        console.log(error)
        await renderErrorPage()
    }
}

/**
 * @returns void
 * @description Set navigation listeners.
 */
function setNavigationListeners() {
    const navigationItems = Array.from(document.getElementsByClassName('spa-nav'))
    navigationItems.forEach(item =>
        item.addEventListener('click', async (event) => {
            const componentName = event.target.closest('a').dataset.ref
            await renderPage(componentName)
        })
    )
}

document.addEventListener('DOMContentLoaded', async () => {
    await Generic.init()

    await renderPage('dashboard')
    setNavigationListeners()

    mainContent.style.display = 'block'
})
