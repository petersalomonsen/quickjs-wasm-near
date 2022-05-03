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
        const mainContainer = appComponent.querySelector('#mainContainer');
        mainContainer.parentNode.insertBefore(progressElement, mainContainer);
    } else if (alreadyExists && !state) {
        appComponent.querySelector('mwc-linear-progress').remove();
    }
}