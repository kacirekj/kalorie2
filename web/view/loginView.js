const template = `
    <div>
    </div>
`
// This View is opened during Redirect back to Vue from e.g. Seznam.cz pop-up window
export default {
    template,
    async mounted() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        const token = await this.$connector.login(params.code, this.$constant.REDIRECT_URI)
        window.opener.sessionStorage.setItem("token", token)
        console.log(token)
        window.close()
        window.opener.location.reload(); // this may forget state in browser, maybe it can be done in smarter way
    }
}
