const template = `
    <div>
        <header class="subheader">
            <h1>Jídla</h1> 
        </header>
        <main>
            <a v-on:click="addFood()"><i class="fa-solid fa-plus"/> Přidat jídlo</a>
            <h2>Vaše jídla (Probíhá vývoj)</h2>
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
                <template v-for="dish in dishes">
                    <dish v-bind:dish="dish"></dish>
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
            selectedServing: 0,
            dishes: [],
        }
    },
    async mounted() {
        this.dishes = await this.$connector.getDishes()
        this.$action.fe
    },
}