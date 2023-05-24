const template = `
    <div>
        <header class="subheader">
            <h1>Potraviny</h1>
        </header>
        <main>
                <a v-on:click="addFood()"><i class="fa-solid fa-plus"/> Přidat potravinu</a>
                <h2>Vyhledávání potravin</h2>
                <input type="text" placeholder="Hledat jídlo..." v-model="$store.searchTermFood"
                       title="Pro 4 znaky a méně hledáte v naposledy použitých jídlech. Při více znacích hledáte v celé databázi jídel.">
                <br/>
                <table class="food-table">
                    <colgroup>
                        <col class="colg-food-name"/>
                        <col class="colg-food-nutri"/>
                        <col class="colg-food-nutri" span="4"/>
                    </colgroup>
                    <thead>
                    <tr>
                        <th class="foodName">
                            <h3 v-if="$store.searchTermFood.length < $constant.SEARCH_T_MIN_LEN">
                                Naposledy použitá jídla
                            </h3>
                            <h3 v-else>
                                Nalezená jídla
                            </h3>
                        </th>
                        <th></th>
                        <th>Energie <br><small>(kcal)</small></th>
                        <th>Bilk. <br><small>(g)</small></th>
                        <th>Sach. <br><small>(g)</small></th>
                        <th>Tuky <br><small>(g)</small></th>
<!--                        <th><a class="fa-solid fa-plus"></a></th>-->
                    </tr>
                    </thead>
                    <tbody>
                    <template v-for="food in searchResults">
                        <food v-bind:food="food" :key="food.id + 'used'"></food>
                    </template>
                    </tbody>
                </table>
        </main>
    </div>
`
export default {
    template,
    data() {
        return {
            id: null,
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.$store.searchTermFood)
        },
        foodById() {
            return this.$getter.getFood(this.$route.params.id)
        }
    },
    methods: {
        async addFood() {
            const newFood = await this.$action.upsertFood({
                name: 'Nové',
                proteins: 0,
                carbs: 0,
                fats: 0,
                calories: 0,
                servings: [
                    {food_id: null, serving: {id: 0, name: '', grams: 1}},
                    {food_id: null, serving: {id: 1, name: '', grams: 100}},
                ],
            })
            this.$router.push("/foods/" + newFood[0].id)
        }
    },
    watch: {},
    async mounted() {
        this.$logger.log('mounted')
        this.id = this.$route.params.id
        if (!this.id) {
            await this.$action.fetchDaysToStore()
        } else {
            await this.$action.fetchFoodWhereId(this.id)
        }
    }
}
