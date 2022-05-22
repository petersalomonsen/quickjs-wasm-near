class NearComponents extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.readyPromise = this.loadHTML();
    }

    async loadHTML() {
        this.shadowRoot.innerHTML = await fetch(new URL('near.component.html', import.meta.url)).then(r => r.text());
    }

    async showLoginDialog(targetContractNames) {
        await this.readyPromise;
        const contractselect = this.shadowRoot.getElementById('contractselect');
        targetContractNames.forEach(contractname => {
            const option = document.createElement('mwc-list-item');
            option.innerHTML = contractname;
            option.value = contractname;
            contractselect.appendChild(option);
        });
        const loginDialog = this.shadowRoot.getElementById('login-dialog');
        loginDialog.setAttribute('open', 'true');

        if (await new Promise(resolve => {
            loginDialog.querySelectorAll('mwc-button').forEach(b => b.addEventListener('click', (e) => {
                resolve(e.target.getAttribute('dialogaction'));
            }))
        }) == 'login') {
            return loginDialog.querySelector('#contractinput').value || loginDialog.querySelector('#contractselect').value;
        } else {
            return null;
        }
    }
}
customElements.define('near-dialogs', NearComponents);

export async function showLoginDialog(targetContractNames) {
    const dialogElement = document.createElement('near-dialogs');
    document.querySelector('app-root').shadowRoot.appendChild(dialogElement);
    const ret = await dialogElement.showLoginDialog(targetContractNames);    
    dialogElement.remove();
    return ret;
}