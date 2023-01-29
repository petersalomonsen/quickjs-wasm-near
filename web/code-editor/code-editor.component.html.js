export default `<style>
    #editor {
        position: relative;
        height: 250px;
    }
    .cm-editor {
        height: 250px;
    }
    #toggleFullScreenButton {
        position: absolute;
        right: 3px;
        bottom: 3px;
        z-index: 1001;
    }
    .editorfullscreen {
        position: fixed !important;
        top: 0px;
        bottom: 0px;
        right: 0px;
        left: 0px;
        width: 100%;
        height: 100% !important;
        background: white;
        z-index: 1000;
    }
    .editorfullscreen .cm-editor { height: 100%; }
</style>
<div id="editor"><mwc-fab mini id="toggleFullScreenButton" icon="fullscreen"></mwc-fab></div>`;
