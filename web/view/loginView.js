const template = `
    <div>
    </div>
`
export default {
    template,
    async mounted() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        const token = await this.$connector.login(params.code, this.$constant.REDIRECT_URI)
        window.opener.sessionStorage.setItem("token", token)
        console.log(token)
        window.close()
    }
}
