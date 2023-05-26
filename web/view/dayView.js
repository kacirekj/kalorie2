const template = `
    <div style="display: contents">
        <header class="subheader">
            <h1>Deník</h1>
        </header>
        <main>
            <a v-on:click="addDay()"><i class="fa-solid fa-plus"/> Přidat nový den</a>
            <template v-for="day in daysOrdered">
                <day v-bind:value="day" :key="day.id"></day>
            </template>
        </main>
    </div>
`
export default {
    template,
    data() {
        return {
            selectedCourseId: 0,
            searchTerm: '',
            state: 0,
            displayModal: false,
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.searchTerm)
        },
        daysOrdered() {
            console.log('daysOrdered')
            return this.$store.days.sort((a, b) => (b.date + b.id).localeCompare((a.date + a.id)))
        },
    },
    methods: {
        async addDay() {
            const today = new Date();
            const date = new Date();
            for(let i = 0; i < 100; i++) {
                date.setDate(today.getDate() + i)
                let dateStr = this.$util.getDateAsString(date)
                if(!this.$store.days.find(d => d.date === dateStr)) {
                    break
                }
                this.$logger.log('Date already exists. Increment.')
            }

            const addedDay = await this.$action.upsertDay({
                date: this.$util.getDateAsString(date),
                entries: [],
                user_id: this.$util.getUserId()
            })
            addedDay.isEdit = false
        }
    },
    async mounted() {
        await this.$action.fetchDaysToStore()

    },
}
