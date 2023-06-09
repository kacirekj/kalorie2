const template = `
    <div style="display: contents">
            <tbody v-if="!day.isEdit">
                <template v-for="entry in entriesGroupByCourseOrderByRank">
                    <entry v-bind:entry="entry" v-bind:entryGroup="day" v-bind:isEdit="day.isEdit" :key="entry.id"></entry>
                </template>
            </tbody>
            <tbody v-else :key="day.date" is="draggable" tag="tbody" :group="'course' + day.id" :list="entriesGroupByCourseOrderByRank" @change="onDrag">
                <template v-for="entry in entriesGroupByCourseOrderByRank">
                    <entry v-bind:entry="entry" v-bind:day="day" v-bind:isEdit="day.isEdit" :key="entry.id" v-on:delete="$mutator.deleteEntry(day.entries, entry)"></entry>
                </template>
            </tbody>
            <tfoot>
            <tr>
                <td>
                    <foodsearch v-if="day.isEdit" :placeholder="'Přidat jídlo jako ' + $options.filters.czechCourse(selectedCourseId) + '...'" v-on:add="upsertEntry"></foodsearch>
                </td>
                <td>
                    <select v-if="day.isEdit" id="select" v-model="selectedCourseId">
                        <option v-for="[key, value] in Object.entries($store.courses)" :value="key">{{key | czechCourse}}</option>
                    </select>
                </td>
                <template v-if="Object.keys(entriesGroupByCourseOrderByRank).length > 1">
                    <td>{{$model.getEntriesNutrient(entriesGroupByCourseOrderByRank, 'calories') | roundNutri}}</td>
                    <td>{{$model.getEntriesNutrient(entriesGroupByCourseOrderByRank, 'proteins') | roundNutri}}</td>
                    <td>{{$model.getEntriesNutrient(entriesGroupByCourseOrderByRank, 'carbs') | roundNutri}}</td>
                    <td>{{$model.getEntriesNutrient(entriesGroupByCourseOrderByRank, 'fats') | roundNutri}}</td>
                </template>
                <template v-else>
                    <td>&nbsp</td>
                </template>
            </tr>
            </tfoot>
    </div>
`
// it supports Day and Dish
export default {
    template,
    props: ['course_id', 'day'],
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
            let result = this.day.entries.filter(e => e.course_id == this.course_id)
                .sort((a, b) => a.rank - b.rank)

            if(result.length === 0) {
                return []
            } else {
                return result;
            }

        },
    },
    methods: {
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
        },
        upsertEntry(searchFood) {
            this.$mutator.upsertEntry(
                this.day.entries,
                {
                    amount: 100,
                    serving_id: searchFood.servings[0].serving_id,
                    food_id: searchFood.id,
                    course_id: parseInt(this.selectedCourseId)
                }
            );
            this.searchTerm = ''
            this.selectedCourseId = this.course_id // Set it back to origin
        }
    },
}
