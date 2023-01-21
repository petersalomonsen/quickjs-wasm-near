customElements.define('nearfs-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = 'NEARFS';
    }
});