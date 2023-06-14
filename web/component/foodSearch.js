const template = `
    <div style="display: contents">
        <searchbox v-model="searchTerm" :placeholder='placeholder'>
            <table>
                <colgroup>
                    <col class="colg-food-search-name"/>
                    <col class="colg-food-search-nutri" span="4"/>
                    <col class="colg-food-button"/>
                </colgroup>
                <thead>
                <tr>
                    <th class="foodName">
                        <template v-if="searchTerm.length < $constant.SEARCH_T_MIN_LEN">Naposledy použitá jídla</sup></template>
                        <template v-else>Všechny výsledky</template>
                    </th>
                    <th>Energie</br><small>(kcal)</small></th>
                    <th>Bílk.</br><small>(g)</small></th>
                    <th>Sach.</br><small>(g)</small></th>
                    <th>Tuky</br><small>(g)</small></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="searchFood in searchResults" :key="searchFood.id" v-on:click="$emit('add', searchFood)">
                    <td class="foodName">{{searchFood.name}}</td>
                    <td class="foodEnergy">{{searchFood.calories}}</td>
                    <td class="foodNutrient">{{searchFood.proteins}}</td>
                    <td class="foodNutrient">{{searchFood.carbs}}</td>
                    <td class="foodNutrient">{{searchFood.fats}}</td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </searchbox>
    </div>
`
// it supports Day and Dish
export default {
    template,
    props: ['placeholder'],
    emits: ['add'],
    data() {
        return {
            searchTerm: '',
            selectedCourseId: this.course_id,
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.searchTerm)
        },
    },
    methods: {
    },
}
