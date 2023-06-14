const template = `
    <div v-if="$route.params.id && foodById">
        <header class="subheader">
            <h1 v-if="foodById.type === 'food'">Detail potraviny</h1>
            <h1 v-else>Detail jídla</h1>
        </header>
        <main>
            <div class="row" style="margin-top: -1em">
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
            </br>
            <div class="row">
                <div class="col">

                    <table>
                        <colgroup>
                            <col style="width: 100%"/>
                            <col style="width: 5em"/>
                        </colgroup>
                        <thead>
                        <th><h3>Nutriční hodnoty</h3></th>
                        <th><small>Na 100g</small></th>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Energie <small>(kcal)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'calories') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.calories"></td>
                        </tr>
                        <tr>
                            <td>Bílkoviny <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'proteins') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.proteins"></td>
                        </tr>
                        <tr>
                            <td>Sacharidy <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'carbs') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.carbs"></td>
                        </tr>
                        <tr>
                            <td>- z toho Cukry <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'sugars') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.sugars"></td>
                        </tr>
                        <tr>
                            <td>Tuky <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'fats') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.fats"></td>
                        </tr>
                        <tr>
                            <td>- z toho Nasycené mastné kyseliny <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'sat_fats') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.sat_fats"></td>
                        </tr>
                        <tr>
                            <td>Vláknina <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'fiber') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.fiber"></td>
                        </tr>
                        <tr>
                            <td>Sůl <small>(g)</small></td>
                            <td v-if="!isEditNutrients">{{$model.getFoodNutrient(foodById, 'salt') | roundNutri}}</td>
                            <td v-else><input type="number" v-model="foodById.salt"></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="col">
                    <table>
                        <colgroup>
                            <col style="width: 100%"/>
                            <col style="width: 5em"/>
                            <col style="width: 1em" v-if="foodById.isEdit"/>
                        </colgroup>
                        <thead>
                        <th><h3>Porce</h3></th>
                        <th><small>(g)</small></th>
                        </thead>
                        <tbody>
                        <tr v-for="serving in foodById.servings.map(s => s.serving).filter(s => !s.inactive)">
                            <template v-if="!foodById.isEdit || serving.name == ''">
                                <td>{{serving.name ? serving.name : 'Výchozí'}}</td>
                                <td>{{serving.grams}}</td>
                                <td v-if="foodById.isEdit"><a class="fa-solid fa-trash-can" style="color: darkgray"></a></td>
                            </template>
                            <template v-else>
                                <td><input type="text" v-model="serving.name"></td>
                                <td><input type="text" v-model="serving.grams">
                                <td><a class="fa-solid fa-trash-can" v-on:click="$mutator.removeServing(serving)"></a></td>
                            </template>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr v-if="foodById.isEdit">
                            <td><input type="text" v-model="foodById.newServing.name"></td>
                            <td><input type="number" v-model="foodById.newServing.grams"></td>
                            <td><a class="fa-solid fa-plus" v-on:click="$mutator.addServing(foodById)"></a></td>
                        </tr>
                        <tr v-else>
                            <td>&nbsp</td>
                        </tr>

                        </tfoot>
                    </table>

                    <template v-if="!foodById.isEdit && foodById.note !== null">
                        <h3>Poznámka</h3>
                        <div>
                            {{foodById.note}}
                        </div>
                    </template>
                    <template v-if="foodById.isEdit">
                        <h3>Poznámka</h3>
                        <div>
                            <textarea v-model="foodById.note"/>
                        </div>
                    </template>
                    <!--                    </br>-->
                </div>
            </div>

            <div v-if='foodById.type == "dish"' class="row">
                <div class="col">
                    <table class="day-table">
                        <colgroup>
                            <col class="colg-food-name"/>
                            <col class="colg-food-amount"/>
                            <col class="colg-food-nutri" span="4"/>
                            <col class="colg-food-button"/>
                        </colgroup>
                        <thead>
                        <th>
                            <h3>Ingredience</h3>
                        </th>
                        <th></th>
                        <th>Energie</br><small>(kcal)</small></th>
                        <th>Bílk.</br><small>(g)</small></th>
                        <th>Sach.</br><small>(g)</small></th>
                        <th>Tuky</br><small>(g)</small></th>
                        <th></th>
                        </thead>
                        <tbody>
                        <template v-for="ingredient in foodById.ingredients">
                            <entry v-bind:entry="ingredient" v-bind:isEdit="foodById.isEdit" v-on:delete="$mutator.deleteEntry(foodById.ingredients, ingredient)"></entry>
                        </template>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td>
                                <foodsearch v-if="foodById.isEdit" v-bind:placeholder="'Přidat jídlo jako...'" v-on:add="upsertEntry"></foodsearch>
                            </td>
                            <template v-if="foodById.ingredients.length > 1">
                            <td>
                                Celkem:
                            </td>
                                <td>{{$model.getEntriesNutrient(foodById.ingredients, 'calories') | roundNutri}}</td>
                                <td>{{$model.getEntriesNutrient(foodById.ingredients, 'proteins') | roundNutri}}</td>
                                <td>{{$model.getEntriesNutrient(foodById.ingredients, 'carbs') | roundNutri}}</td>
                                <td>{{$model.getEntriesNutrient(foodById.ingredients, 'fats') | roundNutri}}</td>
                            </template>
                            <template v-else>
                                <td>&nbsp</td>
                            </template>
                        </tr>
                        </tfoot>
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
                            <td>Deaktivováno <i class="fa-regular fa-circle-question"
                                                title="Deaktivovaná potravina se přestane zobrazovat ve výsledcích hledání a pokud nebyla nikdy použita v Deníku, bude zcela smazána."></i>
                            </td>
                            <td v-if="!foodById.isEdit">{{foodById.inactive ? 'Ano' : 'Ne'}} <input type="checkbox"
                                                                                                    v-model:value="foodById.inactive"
                                                                                                    disabled></td>
                            <td v-else>{{foodById.inactive ? 'Ano' : 'Ne'}} <input type="checkbox"
                                                                                   v-model:value="foodById.inactive"></td>
                        </tr>

                        <tr>
                            <td>Uživatel <i class="fa-regular fa-circle-question" title="Uživatel, který potravinu vytvořil."></i>
                            </td>
                            <td>{{foodById.user_id == 0 ? 'Administrátor KTabulky.cz' : foodById.user_id == $util.getUserId() ?
                                'Vaše potravina' : 'Vloženo jiným uživatelem.'}}
                            </td>
                        </tr>
                        <tr>
                            <td>Zveřejněno <i class="fa-regular fa-circle-question"
                                              title="Zveřejněné potraviny mohou vidět i ostatní uživatelé."></i></td>
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
        </main>
    </div>
`
export default {
    template,
    data() {
        return {
            searchTerm: ''
        }
    },
    computed: {
        searchResults() {
            return this.$getter.searchFoods(this.searchTerm)
        },
        isEditNutrients() {
            return this.foodById.isEdit && this.foodById.type === 'food'
        },
        foodById() {
            return this.$getter.getFood(this.$route.params.id)
        }
    },
    methods: {
        saveChanges() {
            this.$action.upsertFood(this.foodById);
            this.foodById.isEdit = false;
        },
        upsertEntry(searchFood) {
            if(searchFood.id === this.foodById.id) {
                return // avoid infinite loop
            }
            this.$mutator.upsertEntry(
                this.foodById.ingredients,
                {
                    amount: 100,
                    serving_id: searchFood.servings[0].serving_id,
                    food_id: searchFood.id,
                }
            );
            this.searchTerm = ''
            this.selectedCourseId = this.course_id // Set it back to origin

        }
    },
    watch: {},
    async mounted() {
    }

}
