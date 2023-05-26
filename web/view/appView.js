const template = `
    <div style="display: contents">
   
        <header>
            <nav class="noprint sticky">
                <ul>
                    <li><router-link to="/"><img style="height: 2em;" src="web/asset/favicon.png"></router-link></li>
                    <li><router-link class="nav-button" :class="{'nav-button-focus': $route.path == '/days'}" to="/days">Deník</router-link></li>
                    <li><router-link class="nav-button" :class="{'nav-button-focus': $route.path == '/foods'}" to="/foods">Potraviny</router-link></>
                    <li><router-link class="nav-button" :class="{'nav-button-focus': $route.path == '/tools'}" to="/tools">Nástroje</router-link></li>
                    <li><router-link class="nav-button" :class="{'nav-button-focus': $route.path == '/settings'}" to="/settings">Nastavení</router-link></li>
                    <li class="float-right sticky" style="padding-top: 1rem">
                        <template v-if="theme === 'light'">
                            <a class="nav-button fa-solid fa-moon fa-xs" v-on:click="toggleTheme"></a>
                        </template>
                        <template v-else>
                            <a class="nav-button fa-solid fa-sun fa-xs" v-on:click="toggleTheme"></a>
                        </template>
                    </li>
                    <li class="float-right sticky" style="padding-top: 1rem">
                        <a v-if="!token" class="nav-button" v-on:click="login()"><img src="web/asset/seznam-logo-esko-18-cervena.svg" />Přihlášení {{token}}</a>
                        <a v-else class="nav-button" v-on:click="logout()">Odhlásit <small>({{token.email}})</small></a>
                    </li>
                </ul>
            </nav>
        </header>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <footer>
            <p>Copyright (c) Jiří Kačírek 2023</p>
        </footer>
    </div>
`
export default {
    template,
    data() {
        return {
            defaultTheme: 'light',
            theme: null,
            activeButtonIdx: null,
            loginVisible: true,
            token: null,
        }
    },
    methods: {
        toggleTheme() {
            this.theme = this.theme === this.defaultTheme ? 'dark' : this.defaultTheme
        },
        trySetToken() {
            const jwt = sessionStorage.getItem('token')
            if(!jwt) {
                this.token = null
            } else {
                this.token = this.$util.parseJwt(jwt)
            }
        },
        login() {
            const handle = this.$util.openPopupWindowCenter(this.$constant.SEZNAM_URL, 'Přihlášení do KTabulky.cz', 550, 700)
        },
        logout() {
            sessionStorage.removeItem('token')
            location.reload();
        }
    },
    watch: {
        theme() {
            document.documentElement.setAttribute('data-theme', this.theme)
            sessionStorage.setItem("theme", this.theme)
        },

    },
    async mounted() {
        // Periodically check for token
        setInterval(this.trySetToken.bind(this), 300) // let it run, it doesn't cost anything

        // Set sessionId:
        const sessionId = this.$util.getSessionId()
        if(!sessionId) {
            sessionStorage.setItem("sessionId", 'guest_' + this.$util.getRandomStr())
        }
    },
    created() {
        const theme = sessionStorage.getItem("theme")
        this.theme = theme ? theme : this.defaultTheme
    }
}
