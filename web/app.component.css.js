export default /*css*/ `div.container {
    max-width: 1024px;
    padding: 20px;
    margin: auto;
}

mwc-drawer[open] top-app-bar {
    /* Default width of drawer is 256px. See CSS Custom Properties below */
    --mdc-top-app-bar-width: calc(100% - var(--mdc-drawer-width, 256px));
}`;