import '@material/mwc-top-app-bar';
import '@material/mwc-icon-button';
import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-drawer';
import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-textfield';
import '@material/mwc-select';
import './code-editor/code-page.component.js';
import './callcontract/callcontract-page.component.js';

import { setAppComponent, toggleIndeterminateProgress } from './common/progressindicator.js';
import { walletConnection } from './near.js';

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
        const mainContainer = this.shadowRoot.querySelector('#mainContainer')
        window.goToPage = (page) => {
            const pageElement = document.createElement(`${page}-page`);
            mainContainer.replaceChildren(pageElement);
            if (widthmatcher.matches) {
                drawer.open = false;
            }
        }

        this.shadowRoot.getElementById('loggedinuserspan').innerHTML = (await walletConnection).account().accountId;
        goToPage('code');
        toggleIndeterminateProgress(false);
    }
}

customElements.define('app-root', AppComponent);