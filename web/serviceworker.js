addEventListener("install", (event) => {
    self.skipWaiting();
});

addEventListener("activate", (event) => {
});

self.addEventListener("fetch", (event) => {    
    event.respondWith((async () => {
        const request = event.request;
        const urlWithoutSearch = request.url.split('?')[0];
        if(urlWithoutSearch.indexOf(location.origin) == 0 && urlWithoutSearch.substring(location.origin.length).indexOf('.') == -1) {
            return await fetch('index.html');
        }
        const responseFromNetwork = await fetch(event.request);
        return responseFromNetwork;
    })());
});