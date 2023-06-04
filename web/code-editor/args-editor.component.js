import { EditorView, basicSetup } from 'codemirror';
import { json } from '@codemirror/lang-json';
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view";
import { EditorState } from '@codemirror/state';
import html from './args-editor.component.html.js';

export class ArgsEditor extends HTMLElement {
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
                json(),                
            ];
            let state = EditorState.create({
                extensions: this.extensions
            });
            this.editorView = new EditorView({
                state,
                parent: editorDiv
            });
            resolve();
        });
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

customElements.define('args-editor', ArgsEditor)