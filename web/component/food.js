const template = `
    <div style="display: contents">
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
