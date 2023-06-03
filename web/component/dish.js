const template = `
    <div style="display: contents">
        <tr>
            <td v-bind:title="dish.name">{{dish.name | truncate($constant.FOOD_NAME_TRUNCATE)}}
                <router-link class="fa-solid fa-magnifying-glass fa-2xs"
                             :to="'/dishes/' + dish.id"></router-link>
            </td>
            <td>
                <select v-model="selectedServing">
                    <option v-for="serving in servings" :value="serving">
                        {{serving.name}} {{serving.grams}}g
                    </option>
                </select>
            </td>
<!--            <td>{{$util.mapEntriesToCalories(dish.ingredients) | formatPercent}}</td>-->
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </div>
`
export default {
    template,
    props: ['dish'],
    emits: ['input'],
    data() {
        return {
            selectedServing: this.dish.servings.map(s => s.serving).find(s => s.name === '' && s.grams === 100)
        }
    },
    computed: {
        servings() {
            return this.dish.servings.map(s => s.serving)
        },
    },
    methods: {
    },
    mounted() {
    }
}
