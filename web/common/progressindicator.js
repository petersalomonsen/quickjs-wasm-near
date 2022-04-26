import '@material/mwc-linear-progress';

let appComponent;

export function setAppComponent(c) {
    appComponent = c.shadowRoot;
}

export function toggleIndeterminateProgress(state) {
    const alreadyExists = appComponent.querySelector('mwc-linear-progress');
    if (!alreadyExists && state) {
        const progressElement = document.createElement('mwc-linear-progress');
        progressElement.setAttribute('indeterminate','true');
        const topbar = appComponent.querySelector('mwc-top-app-bar');
        topbar.parentNode.insertBefore(progressElement, topbar.nextSibling);
    } else if (alreadyExists && !state) {
        appComponent.querySelector('mwc-linear-progress').remove();
    }
}