import { EditorView, basicSetup } from 'codemirror';
import { javascript, javascriptLanguage, completionPath } from '@codemirror/lang-javascript';
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view";
import { EditorState } from '@codemirror/state';
import html from './code-editor.component.html.js';
import '@material/mwc-fab';
import { getBuiltinJSProperties } from '../compiler/jsinrust/contract-wasms.js';



class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.completion_options = [];
        this.readyPromise = new Promise(async resolve => {
            this.shadowRoot.innerHTML = html;
            const editorDiv = this.shadowRoot.getElementById('editor');            
            
            this.extensions = [basicSetup,
                keymap.of([indentWithTab,{
                    key: 'Ctrl-s',
                    mac: 'Cmd-s',
                    run: () => {
                        this.dispatchEvent(new CustomEvent('save'));
                        return true;
                    }
                }]),
                javascript(),
                javascriptLanguage.data.of({
                    autocomplete: (context) => {
                        let path = completionPath(context);

                        if (!path) return null;

                        return {
                            from: context.pos - path.name.length,
                            options: this.completion_options
                        }
                    }
                })
            ];
            let state = EditorState.create({
                extensions: this.extensions
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

    async setCompletions(wasm_contract_type) {
        this.completion_options = (await getBuiltinJSProperties(wasm_contract_type))
            .map((prop) => ({
                type: 'function',
                label: prop
            }));
    }

    set value(val) {
        let state = EditorState.create({
            doc: this.editorView.state.toText(val),
            extensions: this.extensions
        });
        this.editorView.setState(state);
    }

    get value() {
        return this.editorView.state.doc.toString();
    }
}

customElements.define('code-editor', CodeEditor)