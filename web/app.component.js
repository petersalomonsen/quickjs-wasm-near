import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-drawer';
import '@material/mwc-list';
import '@material/mwc-textfield';
import '@material/mwc-select';
import '@material/mwc-snackbar';
import './code-editor/code-page.component.js';
import './callcontract/callcontract-page.component.js';
import './callcontract/callcontractstandalone-page.component.js';
import './nearfs/nearfs-page.component.js';
import './deletecontract/deletecontract-page.component.js';

import { setAppComponent, toggleIndeterminateProgress } from './common/progressindicator.js';
import { getNearConfig, createWalletConnection, checkSignedin, logout, clearWalletConnection } from './near/near.js';

HTMLElement.prototype.attachStyleSheet = function (url) {
    const linkElement = document.createElement('link');
    linkElement.rel = 'stylesheet';
    linkElement.href = url;
    this.shadowRoot.appendChild(linkElement);
};

class AppComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('app.component.html', import.meta.url)).then(r => r.text());
        this.attachStyleSheet(new URL('app.component.css', import.meta.url));
        setAppComponent(this);
        toggleIndeterminateProgress(true);
        const drawer = this.shadowRoot.querySelector('mwc-drawer');
        this.shadowRoot.querySelector('#toggleDrawerButton').addEventListener('click', () => {
            drawer.open = !drawer.open;
        });
        const widthmatcher = window.matchMedia("(max-width: 700px)");
        widthmatcher.addEventListener('change', e => {
            if (e.matches) {
                drawer.type = 'modal';
            } else {
                drawer.type = 'dismissible';
                drawer.open = true;
            }
        });
        if (!widthmatcher.matches) {
            drawer.type = 'dismissible';
            drawer.open = true;
        }
        
        const accountId = (await createWalletConnection()).account().accountId;
        const loggedInUserSpan = this.shadowRoot.getElementById('loggedinuserspan');
        const logoutMenuItemTemplate = this.shadowRoot.getElementById('logout-menuitem-template');
        const loginMenuItemTemplate = this.shadowRoot.getElementById('login-menuitem-template');
        const leftmenu = this.shadowRoot.getElementById('leftmenu');

        const showNotLoggedIn = () => {
            loggedInUserSpan.innerHTML = '';
            const loginMenuItem = leftmenu.appendChild(loginMenuItemTemplate.content.firstElementChild.cloneNode(true));
            loginMenuItem.addEventListener('click', () => checkSignedin());
        };
        if (accountId) {
            loggedInUserSpan.innerHTML =
                `${accountId ?? ''} @ ${getNearConfig().contractName}`;
            logoutMenuItemTemplate.content.cloneNode(true)
            const logoutMenuItem = leftmenu.appendChild(logoutMenuItemTemplate.content.firstElementChild.cloneNode(true));
            logoutMenuItem.addEventListener('click', async () => {
                logoutMenuItem.remove();
                showNotLoggedIn();
                await logout();
            });
        } else {
            showNotLoggedIn();
        }

        const mainContainer = this.shadowRoot.querySelector('#mainContainer')
        window.goToPage = (page) => {
            const pageElement = document.createElement(`${page}-page`);
            history.pushState({}, null, `/${page}`);
            mainContainer.replaceChildren(pageElement);
            if (widthmatcher.matches) {
                drawer.open = false;
            }
        }
        if (location.pathname.length > 1) {
            goToPage(location.pathname.substring(1));
        }
        if (location.search.indexOf('transactionHashes=') > 0) {
            goToPage('callcontract');
            this.shadowRoot.getElementById('callcontract-menuitem').selected = true;
        }

        toggleIndeterminateProgress(false);
    }
}

customElements.define('app-root', AppComponent);

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        const serviceworkerscope = import.meta.url.substring(0, import.meta.url.lastIndexOf('/') + 1);
        console.log('serviceworkerscope', serviceworkerscope);
        try {
            const registration = await navigator.serviceWorker.register("/serviceworker.js", {
                scope: serviceworkerscope,
            });
            registration.onupdatefound = () => {
                console.log('update available');
            };
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");                
            } else if (registration.active) {
                console.log("Service worker active");                
                await registration.update();
            }
            
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};
registerServiceWorker();