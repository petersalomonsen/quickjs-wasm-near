function CID2String(uint8Array) {
    // Initialize the Base32 alphabet and padding character
    const base32Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.toLowerCase();
    const paddingChar = ' ';
  
    // Convert the Uint8Array to a binary string
    let binaryString = uint8Array.reduce((acc, cur) => acc + cur.toString(2).padStart(8, '0'), '');
    while (binaryString.length % 5 > 0) {
        binaryString += '0';
    }
  
    // Initialize the result variable
    let result = '';
  
    // Iterate through the binary string, 5 bits at a time
    for (let i = 0; i < binaryString.length; i += 5) {
      // Get the current 5 bits
      const bits = parseInt(binaryString.slice(i, i + 5), 2);
  
      // Append the Base32 character for the 5 bits
      result += base32Alphabet[bits];
    }
  
    // Add padding characters if necessary
    while (result.length % 8 !== 0) {
      result += paddingChar;
    }
  
    return 'b'+result.trim();
  }
  

customElements.define('nearfs-page', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
            <input type="file" id="fileinput">
        `;
        const fileinput = this.shadowRoot.getElementById('fileinput');
        fileinput.addEventListener('change', (e) => {
            const file = fileinput.files[0];
            let reader = new FileReader();
            reader.onload = async (e) => {
                const fileData = new Uint8Array(e.target.result);
                const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', fileData));
                const cid = new Uint8Array(36);
                cid.set([0x01,0x55,0x12,0x20], 0);
                cid.set(hash, 4);
                console.log(CID2String(cid));
            };
            reader.readAsArrayBuffer(file);
        });
    }
});