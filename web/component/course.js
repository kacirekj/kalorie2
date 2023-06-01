const template = `
    <div style="display: contents">
            <tbody v-if="!day.isEdit">
                <template v-for="entry in entriesGroupByCourseOrderByRank">
                    <entry v-bind:entry="entry" v-bind:day="day" v-bind:isEdit="day.isEdit" :key="entry.id"></entry>
                </template>
            </tbody>
            <tbody v-else :key="day.date" is="draggable" tag="tbody" :group="'course' + day.id" :list="entriesGroupByCourseOrderByRank" @change="onDrag">
                <template v-for="entry in entriesGroupByCourseOrderByRank">
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
                <template v-if="Object.keys(entriesGroupByCourseOrderByRank).length > 1">
                    <td>{{$util.mapEntriesToCalories(entriesGroupByCourseOrderByRank) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToProteins(entriesGroupByCourseOrderByRank) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToCarbs(entriesGroupByCourseOrderByRank) | roundNutri}}</td>
                    <td>{{$util.mapEntriesToFats(entriesGroupByCourseOrderByRank) | roundNutri}}</td>
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
            list: [],
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.searchTerm)
        },
        entriesGroupByCourseOrderByRank() {
            console.log('called')
            return this.day.entries.filter(e => e.course_id == this.course_id)
                .sort((a, b) => a.rank - b.rank)
        },
    },
    methods: {
        saveChanges() {
            this.day.date = this.date  // Prohibit wild chnages of position
            if (this.day.entries.length === 0) {
                this.$action.deleteDay(this.day)
            } else {
                this.$action.upsertDay(this.day)
            }
            this.day.isEdit = !this.day.isEdit
        },
        onDrag(event) {
            this.$logger.log(event)
            if (event.added) {
                event.added.element.course_id = this.course_id
                this.putItemOnNewIndexAndResetRank([...this.entriesGroupByCourseOrderByRank], event.added.element, event.added.newIndex)
            } else if (event.removed) {
                // Do nothing
            } else if (event.moved) {
                this.putItemOnNewIndexAndResetRank([...this.entriesGroupByCourseOrderByRank], event.moved.element, event.moved.newIndex)
            }
        },
        putItemOnNewIndexAndResetRank(list, item, itemNewIndex) {
            list = list.filter(it => it.id !== item.id) // First remove item
            list.splice(itemNewIndex, 0, item) // Add item on specific index
            list.forEach((en, i) => en.rank = i) // Reset Rank so Vue will re-Compute
        }
    },
}
