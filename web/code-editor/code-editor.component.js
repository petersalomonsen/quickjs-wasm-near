import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { javascript } from '@codemirror/lang-javascript';
import { indentWithTab } from "@codemirror/commands"
import { keymap } from "@codemirror/view";

const extensions = [basicSetup,
    keymap.of([indentWithTab]),
    javascript()];

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
            .cm-editor { height: 250px }
        </style>
        <div id="editor"></div>`;
        let state = EditorState.create({
            extensions: extensions
        });
        this.editorView = new EditorView({
            state,
            parent: this.shadowRoot.getElementById('editor')
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