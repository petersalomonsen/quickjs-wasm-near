const version = '12';
addEventListener("install", (event) => {
    console.log('install from '+version);
    self.skipWaiting();
});

addEventListener("activate", (event) => {
    console.log('activate from '+version);
});

self.addEventListener("fetch", (event) => {    
    event.respondWith((async () => {
        const request = event.request;
        console.log(location.origin, request.url);
        if(request.url.indexOf(location.origin) == 0 && request.url.substring(location.origin.length).indexOf('.') == -1) {
            return await fetch('index.html');
        }
        const responseFromNetwork = await fetch(event.request);
        return responseFromNetwork;
    })());
});