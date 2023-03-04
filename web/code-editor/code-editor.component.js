import { EditorView, basicSetup } from 'codemirror';
import { javascript, javascriptLanguage, completionPath } from '@codemirror/lang-javascript';
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view";
import { EditorState } from '@codemirror/state';
import html from './code-editor.component.html.js';
import '@material/mwc-fab';
import { getBuiltinJSProperties } from '../compiler/jsinrust/contract-wasms.js';

let completion_options = [];
export async function setCompletions(wasm_contract_type) {
    completion_options = (await getBuiltinJSProperties(wasm_contract_type))
        .map((prop) => ({
            type: 'function',
            label: prop
        }));
}

const extensions = [basicSetup,
    keymap.of([indentWithTab]),
    javascript(),
    javascriptLanguage.data.of({
        autocomplete: (context) => {
            let path = completionPath(context);

            if (!path) return null;

            return {
                from: context.pos - path.name.length,
                options: completion_options
            }
        }
    })
];

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.readyPromise = new Promise(async resolve => {
            this.shadowRoot.innerHTML = html;
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