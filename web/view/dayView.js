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
            const date = this.$util.getDateAsString(new Date());
            const addedDay = await this.$action.upsertDay({
                date: date,
                entries: [],
                user_id: this.$util.getUserId()
            })
            addedDay.isEdit = true
        }
    },
    async mounted() {
        await this.$action.fetchDaysToStore()

    },
}
