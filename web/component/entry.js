const template = `
    <tr class="">
        <template v-if="!isEdit">
            <td class="">{{food.name}} <router-link class="fa-solid fa-magnifying-glass fa-2xs" :to="'/foods/' + food.id"></router-link></td>
            <td class="">
                <template v-if="!serving.name">
                    {{serving.grams * entry.amount}}g
                </template>
                <template v-else>
                    {{serving.name}} {{serving.grams}}g, {{entry.amount | czechAmount}}
                </template>
            </td>
            <td class="">{{calories | roundNutri}}</td>
            <td class="">{{proteins | roundNutri}}</td>
            <td class="">{{carbs | roundNutri}}</td>
            <td class="">{{fats | roundNutri}}</td>
            <td class=""></td>
        </template>
        <template v-if="isEdit">
            <td class="">{{ food.name }} <router-link class="fa-solid fa-magnifying-glass fa-2xs" :to="'/foods/' + food.id"></router-link></td>
            <td class="">
                <span style="display: flex;">
                    <span style="width: 100%">
                        <select v-model="entry.serving_id">
                            <option v-for="serving in foodServings" :value="serving.id">{{serving.name}} {{serving.grams}}g</option>
                        </select>
                    </span>
                    &nbsp
                    <span>
                        <input type="number" v-model.number="entry.amount" style="width: 3em"/>
                    </span>
                </span>
            </td>
            <td class="">{{calories | roundNutri}}</td>
            <td class="">{{proteins | roundNutri}}</td>
            <td class="">{{carbs | roundNutri}}</td>
            <td class="">{{fats | roundNutri}}</td>
            <td class=""><a class="fa-solid fa-xmark" v-on:click="$mutator.deleteEntry(day, entry)" title="Smazat záznam"></a></td>
        </template>
    </tr>
`
export default {
    template,
    props: ['entry', 'day', 'isEdit'],
    emits: ['input'],
    data() {
        return {}
    },
    computed: {
        food() {
            return this.$store.foods.find(f => f.id === this.entry.food_id)
        },
        foodServings() {
            return this.food.servings
                .filter(s => s.serving_id != null)
                .map(s => s.serving)
        },
        serving() {
            return this.food.servings.find(s => s.serving_id === this.entry.serving_id).serving
        },
        calories() {
            return this.$model.getEntryNutrient(this.entry, 'calories')
        },
        proteins() {
            return this.$model.getEntryNutrient(this.entry, 'proteins')
        },
        carbs() {
            return this.$model.getEntryNutrient(this.entry, 'carbs')
        },
        fats() {
            return this.$model.getEntryNutrient(this.entry, 'fats')
        },
    },
    methods: {},
    mounted() {
    }
}
