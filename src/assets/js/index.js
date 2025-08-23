import $ from 'jquery';
window.$ = window.jQuery = $;
import 'jquery.easing/jquery.easing.min.js';

import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/custom.scss';

import 'chart.js/auto';
import 'joi-browser/dist/joi-browser';

import { Account, Analytics, Budget, Budgets, Dashboard, Generic, Profile, Record, Records } from './components';
import { FetchHtmlLib } from './lib';

const componentFns = {
    account: Account.init,
    analytics: Analytics.init,
    budget: Budget.init,
    budgets: Budgets.init,
    dashboard: Dashboard.init,
    profile: Profile.init,
    record: Record.init,
    records: Records.init,
};

const mainContent = document.getElementById('mainContent');

async function renderErrorPage() {
    mainContent.innerHTML = await FetchHtmlLib.fetch('error');
}

async function renderPage(componentName, refId) {
    try {
        mainContent.innerHTML = await FetchHtmlLib.fetch(componentName);
        await componentFns[componentName](refId);
    } catch (error) {
        console.log(error);
        await renderErrorPage();
    }
}

function setNavigationListeners() {
    const navigationItems = Array.from(document.getElementsByClassName('spa-nav'));
    navigationItems.forEach(item =>
        item.addEventListener('click', async (event) => {
            const componentName = event.target.closest('a').dataset.ref;
            const refId = event.target.closest('a').dataset.id
            await renderPage(componentName, refId);
        })
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    await Generic.init();
    await renderPage('dashboard');

    setNavigationListeners();

    mainContent.style.display = 'block';
});
