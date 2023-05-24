const template = `
    <div>
        <header class="subheader">
            <h1>Detail potraviny</h1>
        </header>
        <main>
            <template v-if="$route.params.id && foodById">
                <div class="row">
                    <div class="col">
                        <h2>
                            {{foodById.name}}
                        </h2>
                    </div>
                    <div class="col" style="text-align: right">
                        <h2>
                            <small>
                                <template v-if="!foodById.isEdit">
                                    <a class="fa-regular fa-pen-to-square" v-on:click="foodById.isEdit = !foodById.isEdit"/>
                                </template>
                                <template v-else>
                                    <a class="fa-solid fa-arrow-rotate-left" v-on:click="$action.refreshFood(foodById); foodById.isEdit = !foodById.isEdit" title="Vrátit změny"></a>
                                    <a class="fa-regular fa-floppy-disk" v-on:click="saveChanges()" title="Uložit změny"></a>
                                </template>
                            </small>
                        </h2>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <h3>Nutriční hodnoty</h3>
                        <table>
                            <colgroup>
                                <col style="width: 100%"/>
                                <col style="width: 5em"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>Energie <small>(kcal)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.calories}}</td>
                                <td v-else><input type="number" v-model="foodById.calories"></td>
                            </tr>
                            <tr>
                                <td>Bílkoviny <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.proteins}}</td>
                                <td v-else><input type="number" v-model="foodById.proteins"></td>
                            </tr>
                            <tr>
                                <td>Sacharidy <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.carbs}}</td>
                                <td v-else><input type="number" v-model="foodById.carbs"></td>                                
                            </tr>
                            <tr>
                                <td>Tuky <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.fats}}</td>
                                <td v-else><input type="number" v-model="foodById.fats"></td>                                
                            </tr>
                            <tr>
                                <td>Vláknina <small>(g)</small></td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>Sůl <small>(g)</small></td>
                                <td>-</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="col">
                        <h3>Porce</h3>
                        <table>
                            <colgroup>
                                <col style="width: 100%"/>
                                <col style="width: 5em"/>
                                <col style="width: 1em" v-if="foodById.isEdit"/>
                            </colgroup>                        
                            <tbody>
                            <tr v-for="serving in foodById.servings.map(s => s.serving).filter(s => !s.inactive)">
                                <template v-if="!foodById.isEdit || serving.name == ''">
                                    <td>{{serving.name ? serving.name : 'Výchozí'}} <small>(g)</small></td>
                                    <td>{{serving.grams}}</td>
                                    <td v-if="foodById.isEdit"><a class="fa-solid fa-trash-can" style="color: darkgray"></a></td>
                                </template>
                                <template v-else>
                                    <td><input type="text" v-model="serving.name"></td>
                                    <td><input type="text" v-model="serving.grams">
                                    <td><a class="fa-solid fa-trash-can" v-on:click="removeServing(serving)"></a></td>
                                </template>
                            </tr>
                            <tr v-if="foodById.isEdit">
                                <td><input type="text" v-model="foodById.newServing.name"></td>
                                <td><input type="number" v-model="foodById.newServing.grams"></td>
                                <td><a class="fa-solid fa-plus" v-on:click="addServing"></a></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="row">
                    <div class="col">
                        <h3>Informace</h3>
                        <table>
                        
                            <tbody>
                            <tr>
                                <td>Zdroj</td>
                                <td>-</td>
                            </tr>
                            <tr>
                                <td>Smazáno</td>
                                <td>{{foodById.inactive ? 'Ano' : 'Ne'}}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </main>
    </div>
`
export default {
    template,
    data() {
        return {}
    },
    computed: {
        foodById() {
            return this.$getter.getFood(this.$route.params.id)
        }
    },
    methods: {
        addServing() {
            const name = this.foodById.newServing.name
            this.foodById.newServing.name = name ? name : 'Bez názvu'
            this.foodById.servings.push({
                food_id: this.foodById.id,
                serving: {...this.foodById.newServing}
            })
            this.foodById.newServing = {name: '', grams: 100}
        },
        removeServing(serving) {
            serving.inactive = true;
        },
        saveChanges() {
            this.$action.upsertFood(this.foodById);
            this.foodById.isEdit = false;
        },
    },
    watch: {},
    async mounted() {
    }
}
