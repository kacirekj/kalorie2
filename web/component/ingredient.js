const template = `
    <tr v-if="food">
        <template>
            <td>{{food.name}} <router-link class="fa-solid fa-magnifying-glass fa-2xs" :to="'/foods/' + food.id"></router-link></td>
            <td>
                <template v-if="!serving.name">
                    {{serving.grams * entry.amount}}g
                </template>
                <template v-else>
                    {{serving.name}} {{serving.grams}}g, {{entry.amount | czechAmount}}
                </template>
            </td>
            <td>{{calories | roundNutri}}</td>
            <td>{{proteins | roundNutri}}</td>
            <td>{{carbs | roundNutri}}</td>
            <td>{{fats | roundNutri}}</td>
            <td></td>
        </template>
    </tr>
`
export default {
    template,
    props: ['entry'],
    emits: ['input'],
    data() {
        return {}
    },
    computed: {
        food() {
            return this.$getter.getFood(this.entry.food_id)
        },
        foodServings() {
            return this.food.servings
                .filter(s => s.serving_id != null)
                .map(s => s.serving)
        },
        serving() {
            return this.food.servings.find(s => s.serving_id === this.entry.serving_id).serving
        },
        proteins() {
            return this.$util.mapEntryToProteins(this.entry, this.food, this.serving)
        },
        carbs() {
            return this.$util.mapEntryToCarbs(this.entry, this.food, this.serving)
        },
        fats() {
            return this.$util.mapEntryToFats(this.entry, this.food, this.serving)
        },
        calories() {
            return this.$util.mapEntryToCalories(this.entry, this.food, this.serving)
        },
    },
    methods: {},
    mounted() {
    }

}
