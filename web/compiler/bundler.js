export async function bundle(contractsource, bundletype) {
    switch(bundletype) {
        case 'nearapi':
            let nearapi = (await (await fetch(new URL('../near-sdk-js/api.js', import.meta.url))).text());
            nearapi = nearapi.replace(/export /g, '');
            contractsource = `${nearapi}\n${contractsource}`;
            return contractsource;
        default:
            return contractsource;
    }
}
