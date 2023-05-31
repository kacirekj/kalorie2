const template = `
    <div style="display: contents">
            <tbody>
            <template v-for="entry in entriesGroupByCourse[course_id]">
                <entry v-bind:entry="entry" v-bind:day="day" v-bind:isEdit="day.isEdit" :key="entry.id"></entry>
            </template>
            </tbody>
            <tfoot>
            <tr>
                <td>
                    <searchbox v-if="day.isEdit" v-model="searchTerm" :placeholder="'Přidat jídlo jako ' + $options.filters.czechCourse(selectedCourseId) + '...'">
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
                            <tr v-for="searchFood in searchResults" :key="searchFood.id" v-on:click="$mutator.upsertEntry(day, {amount: 100, serving_id: searchFood.servings[0].serving_id, food_id: searchFood.id, course_id: parseInt(selectedCourseId)}); searchTerm = ''">
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
                </td>
                <td>
                    <select v-if="day.isEdit" id="select" v-model="selectedCourseId">
                        <option v-for="[key, value] in Object.entries($store.courses)" :value="key">{{key | czechCourse}}</option>
                    </select>
                </td>
                <template v-if="Object.keys(entriesGroupByCourse).length > 1">
                    <td>{{$util.mapEntriesToCalories(entriesGroupByCourse[course_id]) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToProteins(entriesGroupByCourse[course_id]) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToCarbs(entriesGroupByCourse[course_id]) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToFats(entriesGroupByCourse[course_id]) | roundNutri}}</td>
                </template>
                <template v-else>
                    <td>&nbsp</td>
                </template>
            </tr>
            </tfoot>
    </div>
`
export default {
    template,
    props: ['index', 'course_id', 'day'],
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
        entriesGroupByCourse() {
            let courses = this.day.entries.map(e => e.course_id)

            if (courses.length === 0) {
                return {'0': []}
            }

            courses = [...new Set(courses)]
            const result = {}
            for (let course_id of courses) {
                result[course_id] = this.day.entries.filter(e => e.course_id === course_id)
            }
            return result
        },
    },
    methods: {
        saveChanges() {
            this.day.date = this.date // Prohibit wild chnages of position
            if (this.day.entries.length === 0) {
                this.$action.deleteDay(this.day)
            } else {
                this.$action.upsertDay(this.day)
            }
            this.day.isEdit = !this.day.isEdit
        }
    },
}
