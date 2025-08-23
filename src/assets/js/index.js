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
const mainContent = document.getElementById('mainContent')

function urlFor(componentName, refId) {
    return refId ? `/${componentName}/${encodeURIComponent(refId)}` : `/${componentName}`
}

function parseLocation(pathname) {
    const parts = pathname.replace(/^\/+/, '').split('/')
    const componentName = parts[0] || 'dashboard'
    const refId = parts[1] ? decodeURIComponent(parts[1]) : undefined
    return { componentName, refId }
}

async function navigateTo(componentName, refId, replace) {
    const url = urlFor(componentName, refId)

    const state = { componentName, refId }
    replace ? history.replaceState(state, '', url) : history.pushState(state, '', url)

    await renderPage(componentName, refId)
}

function setNavigationListener() {
    document.addEventListener('click', async (event) => {
        const link = event.target.closest('[data-ref]');
        console.log('target: ', event.target)
        if (!link) return;

        event.preventDefault();
        const componentName = link.dataset.ref;
        const refId = link.dataset.id;
        try {
            await navigateTo(componentName, refId);
        } catch (err) {
            console.error(err);
            await renderErrorPage();
        }
    });
}

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

document.addEventListener('DOMContentLoaded', async () => {
    await Generic.init();

    const { componentName, refId } = parseLocation(location.pathname);
    await navigateTo(componentName, refId, true);

    setNavigationListener();
    mainContent.style.display = 'block';
});

window.addEventListener('popstate', async (event) => {
    const state = event.state;
    const { componentName, refId } = state ?? parseLocation(location.pathname);
    try {
        await renderPage(componentName, refId);
    } catch (err) {
        console.error(err);
        await renderErrorPage();
    }
});