export default /*html*/ `<h3>Call contract on-chain</h3>
<p>Here you can call any NEAR contract</p>
<p>
    <mwc-textfield label="Contract name" id="contractnameinput"></mwc-textfield>
    <mwc-textfield label="Method name" id="methodnameinput"></mwc-textfield>
    <mwc-textfield label="arguments (JSON)" id="argsinput"></mwc-textfield>
    <mwc-textfield id="depositinput" label="attached deposit" type="number"></mwc-textfield>
    <mwc-textfield id="gasinput" label="gas" type="number"></mwc-textfield>
</p>
<p>
    <mwc-button raised id="callcontractbutton">Call (with transaction)</mwc-button>
    <mwc-button raised id="viewcontractmethodbutton">View (no transaction)</mwc-button>
</p>
<h3>Contract output</h3>
<p>

<div class="outputarea">
    <pre style="white-space: pre-wrap;"><code id="contractoutput">

    </code></pre>
</div>
</p>`;