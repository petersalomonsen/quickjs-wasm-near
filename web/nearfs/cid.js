export function CID2String(uint8Array) {
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
  

  export async function getCIDForFileData(fileData) {
    const hash = new Uint8Array(await crypto.subtle.digest('SHA-256', fileData));
    const cid = new Uint8Array(36);
    cid.set([0x01,0x55,0x12,0x20], 0);
    cid.set(hash, 4);
    return CID2String(cid);
}