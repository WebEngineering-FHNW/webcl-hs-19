export { client }

const client = (url, method = 'GET', data = null) => {
    const request = {
        method: method,                  // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin',             // no-cors, *cors, same-origin
        cache: 'no-cache',               // no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin',      // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json', // 'application/x-www-form-urlencoded'
        },
        redirect: 'follow',             // manual, *follow, error
        referrer: 'no-referrer',        // no-referrer, *client
    };
    if (null != data) {
        request.body = JSON.stringify(data)
    }
    return fetch(url, request)
        .then(resp => {                             // fetch API cares for the general error handling
            if (Number(resp.status) === 204) {
                console.log("got special", 204);    // special: Grails returns this on successful DELETE
                return Promise.resolve("ok");
            }
            if (resp.ok) {
                return resp.json()
            }
            if (Number(resp.status) < 400) {
                console.log("status", resp.status);
                return resp.text();
            }
            return Promise.reject(resp.status);
        })
};
