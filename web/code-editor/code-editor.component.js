import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view";
import { EditorState } from '@codemirror/state';
import { autocompletion } from '@codemirror/autocomplete';

import '@material/mwc-fab';
import * as nearsdkjsapi from '../near-sdk-js/api.js';

function completions(context) {
    let word = context.matchBefore(/\w*/)
    if (word.from == word.to && !context.explicit)
        return null
    return {
        from: word.from,
        options: Object.keys(nearsdkjsapi).map(k => ({
            label: k,
            type: "function", 
            info: ((str) => str.substring(str.indexOf(k),str.length-1))(nearsdkjsapi[k].toString().split('\n')[0])
        }))
    }
}

const extensions = [basicSetup,
    keymap.of([indentWithTab]),
    autocompletion({ override: [completions] }),
    javascript()
];

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.readyPromise = new Promise(async resolve => {
            this.shadowRoot.innerHTML = await fetch(new URL('code-editor.component.html', import.meta.url)).then(r => r.text());;
            const editorDiv = this.shadowRoot.getElementById('editor');
            let state = EditorState.create({
                extensions: extensions
            });
            this.editorView = new EditorView({
                state,
                parent: editorDiv
            });
            const toggleFullScreenButton = this.shadowRoot.getElementById('toggleFullScreenButton');
            toggleFullScreenButton.addEventListener('click', () => {
                editorDiv.classList.toggle('editorfullscreen');
            });
            resolve();
        });
    }

    set value(val) {
        let state = EditorState.create({
            doc: this.editorView.state.toText(val),
            extensions: extensions
        });
        this.editorView.setState(state);
    }

    get value() {
        return this.editorView.state.doc.toString();
    }
}

customElements.define('code-editor', CodeEditor)