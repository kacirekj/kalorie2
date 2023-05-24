const template = `
    <div style="display: contents">
        <template v-if="!food.isEdit">
            <tr>
                <td v-bind:title="food.name">{{food.name | truncate($constant.FOOD_NAME_TRUNCATE)}} <router-link class="fa-solid fa-magnifying-glass fa-2xs" :to="'/foods/' + food.id"></router-link></td>
                <td>
                    <select v-model="selectedServing">
                        <option v-for="serving in servings" :value="serving">{{serving.name}} {{serving.grams}}g</option>
                    </select>
                </td>
                <td>{{(4 * (food.proteins + food.carbs) + 9 * food.fats) | round}}</td>
                <td>{{food.proteins * selectedServing.grams / 100 | round}}</td>
                <td>{{food.carbs * selectedServing.grams / 100 | round }}</td>
                <td>{{food.fats * selectedServing.grams / 100 | round}}</td>
<!--                <td><a class="fa-solid fa-pen-to-square" v-on:click="food.isEdit = true"></a></td>-->
            </tr>
        </template>
        <template v-else>
            <tr class="trnohover">
                <td class="noborderbottom" v-bind:title="food.name"><input v-model="food.name"></td>
                <td class="noborderbottom">100g</td>
                <td class="noborderbottom"><input type="number" v-model="food.calories"></td>
                <td class="noborderbottom"><input type="number" v-model="food.proteins"></td>
                <td class="noborderbottom"><input type="number" v-model="food.carbs"></td>
                <td class="noborderbottom"><input type="number" v-model="food.fats"></td>
                <td class="noborderbottom"><a class="fa-solid fa-rotate-left" v-on:click="food.isEdit = false"></a></td>
            </tr>
            <tr class="trnohover">
                <td>
                    <div class="card">
                        <table class="food-edit-serving">
                            <colgroup>
                                <col class="colg-food-name"/>
                                <col class="colg-food-nutri"/>
                                <col class="colg-food-button"/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th class="noborderbottom">Porce</th>
                                <th class="noborderbottom">Množství <small>(g)</small></th>
                                <th class="noborderbottom"></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="serving in servings">
                                <td class="noborderbottom"><input v-model="serving.name"></td>
                                <td class="noborderbottom"><input type="number" v-model="serving.grams"></td>
                                <td class="noborderbottom"><a class="fa-solid fa-trash-can" v-on:click="removeServing(serving)"></a></td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td class="noborderbottom"><input placeholder="Nová porce..." v-model="food.newServing.name"></td>
                                <td class="noborderbottom"><input type="number" value="0" v-model="food.newServing.grams"></td>
                                <td class="noborderbottom"><a class="fa-solid fa-plus" v-on:click="addServing"></a></td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td><a class="fa-solid fa-trash-can"></a></br><a class="fa-solid fa-floppy-disk" v-on:click="$action.upsertFood(food); food.isEdit = false"></a></td>
            </tr>
        </template>
    </div>
`
export default {
    template,
    props: ['food'],
    emits: ['input'],
    data() {
        return {
            selectedServing: this.food.servings.map(s => s.serving).find(s => s.name === '' && s.grams === 100)
        }
    },
    computed: {
        servings() {
            return this.food.servings.map(s => s.serving)
        },
    },
    methods: {
        removeServing(serving) {
            console.log(this.$store.usedServingIds)
            this.food.servings = this.food.servings.filter(s => s.serving !== serving)
        },
        addServing() {
            this.food.servings.push({
                food_id: this.food.id,
                serving: {...this.food.newServing}
            })
            this.food.newServing = {name: '', grams: 100}
        },
    },
    mounted() {
    }
}
