import {basicSetup, EditorView} from '@codemirror/basic-setup';
import {EditorState, Compartment} from '@codemirror/state';
import {javascript} from '@codemirror/lang-javascript';

const language = new Compartment();

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});

        let state = EditorState.create({
            extensions: [
              basicSetup,
              language.of(javascript())
            ]
        });
        this.editorView = new EditorView({
            state,
            parent: this.shadowRoot
        });
    }

    set value(val) {
        let state = EditorState.create({
            doc: this.editorView.state.toText(val),
            extensions: [
              basicSetup,
              language.of(javascript())
            ]
        });
        this.editorView.setState(state);
    }

    get value() {
        return this.editorView.state.doc.toString();
    }
}

customElements.define('code-editor', CodeEditor)