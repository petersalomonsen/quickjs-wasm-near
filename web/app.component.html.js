export default /*html*/`<mwc-drawer hasHeader type="modal">
    <span slot="title">JS in Rust</span>
    <span slot="subtitle" id="loggedinuserspan"></span>
    <div class="drawer-content">
      <mwc-list activatable id="leftmenu">
        <mwc-list-item id="code-menuitem" selected activated onclick="goToPage('code')">Code</mwc-list-item>
        <mwc-list-item id="callcontract-menuitem" onclick="goToPage('callcontract')">Call contract</mwc-list-item>
        <mwc-list-item id="deletecontract-menuitem" onclick="goToPage('deletecontract')">Delete contract</mwc-list-item>
        <mwc-list-item id="nearfs-menuitem" onclick="goToPage('nearfs')">NEARFS</mwc-list-item>        
        <template id="logout-menuitem-template">
            <mwc-list-item id="logout-menuitem" graphic="avatar" icon="logout">
                <span>Logout</span>
                <mwc-icon slot="graphic">logout</mwc-icon>
            </mwc-list-item>
        </template>
        <template id="login-menuitem-template">
            <mwc-list-item id="login-menuitem" graphic="avatar" icon="login">
                <span>Login</span>
                <mwc-icon slot="graphic">login</mwc-icon>
            </mwc-list-item>
        </template>
      </mwc-list>
    </div>
    <div slot="appContent">
        <mwc-top-app-bar>
            <mwc-icon-button icon="menu" slot="navigationIcon" id="toggleDrawerButton"></mwc-icon-button>
            <div slot="title"></div>
            
            <div class="container" id="mainContainer">
                <h1>Javascript in Rust smart contracts on NEAR protocol</h1>
                <p>
                    Use Javascript to configure and write custom logic for a standard reference implementation
                    Rust smart contract on NEAR protocol.
                </p>
                <p>
            </div>
        </mwc-top-app-bar>
    </div>
</mwc-drawer>`;