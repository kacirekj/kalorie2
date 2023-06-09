const template = `
    <div class="day">
        <div class="row">
            <div class="col-3">
                <template v-if="!day.isEdit">
                    <h2>{{day.date | czechDate}}</h2>
                </template>
                <template  v-else>
                    <h2><input type="date" v-model="date"></h2>
                </template>
            </div>
            <div class="col" style="text-align: right; vertical-align: bottom">
                 <span>
                    <h2>
                        <small>
                        <template v-if="!day.isEdit">
                            <a class="fa-regular fa-pen-to-square" v-on:click="day.isEdit = !day.isEdit"/>
                        </template>
                        <template v-else>
                            <a class="fa-solid fa-arrow-rotate-left" v-on:click="$action.refreshDay(day); day.isEdit = !day.isEdit" title="Vrátit změny"></a>
                            <template v-if="day.entries.length > 0">
                                <a class="fa-regular fa-floppy-disk" v-on:click="saveChanges()" title="Uložit změny"></a>
                            </template>
                            <template v-else>
                                <a class="fa-solid fa-trash-can" v-on:click="saveChanges()" title="Vymazat celý den"></a>
                            </template>
                        </template>
                        </small>
                    </h2>
                </span>            
            </div>
        </div>
        
        <template v-for="(course_id, index) in courseIds">
            <table class="day-table">
                <colgroup>
                    <col class="colg-food-name"/>
                    <col class="colg-food-amount"/>
                    <col class="colg-food-nutri" span="4"/>
                    <col class="colg-food-button"/>
                </colgroup>
                <thead>
                <th><h3>{{course_id | czechCourse}}</h3></th>
                <template v-if="index === 0">
                    <th></th>
                    <th>Energie</br><small>(kcal)</small></th>
                    <th>Bílk.</br><small>(g)</small></th>
                    <th>Sach.</br><small>(g)</small></th>
                    <th>Tuky</br><small>(g)</small></th>
                    <th></th>
                </template>
                <template v-else>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </template>
                </thead>
                <course v-bind:index="index" v-bind:course_id="course_id" v-bind:day="day"></course>
            </table>
        </template>
<!--        <br>-->
        <table style="padding-top: 1rem">
                <colgroup>
                    <col class="colg-food-name"/>
                    <col class="colg-food-amount"/>
                    <col class="colg-food-nutri" span="4"/>
                    <col class="colg-food-button"/>
                </colgroup>
            <tfoot>
            <tr>
                <td></td>
                <td>Celkem:</td>
                <td>{{$model.getEntriesNutrient(day.entries, 'calories') | roundNutri}}</td>
                <td>{{$model.getEntriesNutrient(day.entries, 'proteins') | roundNutri}}<small>g</small></td>
                <td>{{$model.getEntriesNutrient(day.entries, 'carbs') | roundNutri}}<small>g</small></td>
                <td>{{$model.getEntriesNutrient(day.entries, 'fats') | roundNutri}}<small>g</small></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td>Poměr makroživin:</td>
                <td></td>
                <td>{{macronutrientPercentage.proteins | formatPercent}}<small>%</small></td>
                <td>{{macronutrientPercentage.carbs | formatPercent}}<small>%</small></td>
                <td>{{macronutrientPercentage.fats | formatPercent}}<small>%</small></td>
                <td></td>
            </tr>
            </tfoot>
        </table>
    </div>
`
export default {
    template,
    props: ['value'],
    emits: ['input'],
    data() {
        return {
            day: this.value,
            date: this.value.date,
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.day.searchTerm)
        },
        courseIds() {
            let courses = this.day.entries.map(e => e.course_id)
            let result;
            if (courses.length === 0) {
                return [0] // to render at least one course item
            }
            result = [...new Set(courses)]
            return result
        },
        macronutrientPercentage() {
            return this.$model.getEntriesMacronutrientPercent(this.day.entries)
        }
    },
    methods: {
        saveChanges() {
            this.day.date = this.date // Prohibit wild changes of position
            if (this.day.entries.length === 0) {
                this.$action.deleteDay(this.day)
            } else {
                this.$action.upsertDay(this.day)
            }
            this.day.isEdit = !this.day.isEdit
        },
    },
    mounted() {
        console.log(this.$constant.SEZNAM_URL)
    }
}
