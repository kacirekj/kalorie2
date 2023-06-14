const methods = {
    getCurrentBrowserUrl() {
        let url = window.location.origin
        return url;
    },
    openPopupWindowCenter(url, title, w, h) {
        // Fixes dual-screen position                            Most browsers       Firefox
        const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
        const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

        const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        const systemZoom = width / window.screen.availWidth;
        const left = (width - w) / 2 / systemZoom + dualScreenLeft
        const top = (height - h) / 2 / systemZoom + dualScreenTop
        const newWindow = window.open(url, title, `
            scrollbars=yes,
            width=${w / systemZoom}, 
            height=${h / systemZoom}, 
            top=${top}, 
            left=${left}
            `
        )

        if (window.focus) newWindow.focus();

        return newWindow;
    },
    parseJwt(token) {
        if (!token) {
            return
        }
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    },
    getUserId() {
        const token = this.parseJwt(this.getToken())
        if (token) {
            return token.id
        } else {
            return this.getSessionId()
        }
    },
    getToken() {
        return window.sessionStorage.getItem("token")
    },
    getSessionId() {
        return window.sessionStorage.getItem("sessionId")
    },
    getRandomStr() {
        return Math.random().toString(36).substr(2, 10)
    },
    arrayRemoveIf(array, predicate) {
        for (let i = 0; i < array.length; i++) {
            if (predicate(array[i])) {
                return array.splice(i, 1);
            }
        }
    }

}
export default new Vue({methods})
