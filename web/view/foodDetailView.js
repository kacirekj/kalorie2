const template = `
    <div>
        <header class="subheader">
            <h1>Detail potraviny</h1>
        </header>
        <main>
            <template v-if="$route.params.id && foodById">
<!--                                    <h2>-->
<!--                            <template v-if="!foodById.isEdit">{{foodById.name}}</template>-->
<!--                            <template v-else><input type="text" v-model="foodById.name"></template>-->
<!--                        </h2>-->

                <div class="row">
                    <div class="col">
                        <h2>
                            <template v-if="!foodById.isEdit">{{foodById.name}}</template>
                            <template v-else><input type="text" v-model="foodById.name"></template>
                        </h2>
                    </div>
                    <div class="col-2" style="text-align: right">
                        <h2 v-if="$util.getUserId() == foodById.user_id">
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
                                <td>- z toho Cukry <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.sugars}}</td>
                                <td v-else><input type="number" v-model="foodById.sugars"></td>                                
                            </tr>
                            <tr>
                                <td>Tuky <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.fats}}</td>
                                <td v-else><input type="number" v-model="foodById.fats"></td>                                
                            </tr>
                            <tr>
                                <td>- z toho Nasycené mastné kyseliny <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.sat_fats}}</td>
                                <td v-else><input type="number" v-model="foodById.sat_fats"></td>                                
                            </tr>
                            <tr>
                                <td>Vláknina <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.fiber}}</td>
                                <td v-else><input type="number" v-model="foodById.fiber"></td>                                
                            </tr>
                            <tr>
                                <td>Sůl <small>(g)</small></td>
                                <td v-if="!foodById.isEdit">{{foodById.salt}}</td>
                                <td v-else><input type="number" v-model="foodById.salt"></td>                                
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
                            <colgroup>
                                <col style="width: 9em"/>
                                <col style="width: 100%"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <td>Deaktivováno <i class="fa-regular fa-circle-question" title="Deaktivovaná potravina se přestane zobrazovat ve výsledcích hledání a pokud nebyla nikdy použita v Deníku, bude zcela smazána."></i></td>
                                <td v-if="!foodById.isEdit">{{foodById.inactive ? 'Ano' : 'Ne'}} <input type="checkbox" v-model:value="foodById.inactive" disabled></td>
                                <td v-else>{{foodById.inactive ? 'Ano' : 'Ne'}} <input type="checkbox" v-model:value="foodById.inactive"></td>
                            </tr>
                            
                            <tr>
                                <td>Uživatel <i class="fa-regular fa-circle-question" title="Uživatel, který potravinu vytvořil."></i></td>
                                <td>{{foodById.user_id == 0 ? 'Administrátor KTabulky.cz' : foodById.user_id == $util.getUserId() ? 'Vaše potravina' : 'Vloženo jiným uživatelem.'}}</td>
                            </tr>
                            <tr>
                                <td>Zveřejněno <i class="fa-regular fa-circle-question" title="Zveřejněné potraviny mohou vidět i ostatní uživatelé."></i></td>
                                <td>{{foodById.visibility == 0 ? 'Ne' : 'Ano'}}</td>
                            </tr>
                            <tr>
                                <td>Zdroj <i class="fa-regular fa-circle-question" title="Zdroj informací o potravině."></i></td>
                                <td v-if="!foodById.isEdit">{{foodById.source}}</td>
                                <td v-else><input type="text" v-model="foodById.source"></td>                                
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
