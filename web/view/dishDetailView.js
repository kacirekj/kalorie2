const template = `
    <div>
        <header class="subheader">
            <h1>Detail jídla</h1>
        </header>
        <main>
            <template v-if="$route.params.id && dishById">
                <div class="row">
                    <div class="col">
                        <h2>
                            <template v-if="!dishById.isEdit">{{dishById.name}}</template>
<!--                            <template v-else><input type="text" v-model="dishById.name"></template>-->
                        </h2>
                    </div>
                    <div class="col-2" style="text-align: right">
                        <h2 v-if="$util.getUserId() == dishById.user_id">
                            <small>
                                <template v-if="!dishById.isEdit">
                                    <a class="fa-regular fa-pen-to-square"
                                       v-on:click="dishById.isEdit = !dishById.isEdit"/>
                                </template>
                                <template v-else>
                                    <a class="fa-solid fa-arrow-rotate-left"
                                       v-on:click="$action.refreshDish(foodById); dishById.isEdit = !dishById.isEdit"
                                       title="Vrátit změny"></a>
                                    <a class="fa-regular fa-floppy-disk" v-on:click="saveChanges()"
                                       title="Uložit změny"></a>
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
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'calories') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>Bílkoviny <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'proteins') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>Sacharidy <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'carbs') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>- z toho Cukry <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'sugars') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>Tuky <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'fats') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>- z toho Nasycené mastné kyseliny <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'sat_fats') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>Vláknina <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'fiber') | roundNutri}}</td>
                            </tr>
                            <tr>
                                <td>Sůl <small>(g)</small></td>
                                <td>{{$model.getEntriesNutrient(dishById.ingredients, 'salt') | roundNutri}}</td>
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
                                <col style="width: 1em" v-if="dishById.isEdit"/>
                            </colgroup>
                            <tbody>
                            <tr v-for="serving in dishById.servings.map(s => s.serving).filter(s => !s.inactive)">
                                <template v-if="!dishById.isEdit || serving.name == ''">
                                    <td>{{serving.name ? serving.name : 'Výchozí'}} <small>(g)</small></td>
                                    <td>{{serving.grams}}</td>
                                    <td v-if="dishById.isEdit"><a class="fa-solid fa-trash-can"
                                                                  style="color: darkgray"></a></td>
                                </template>
                                <template v-else>
                                    <td><input type="text" v-model="serving.name"></td>
                                    <td><input type="text" v-model="serving.grams">
                                    <td><a class="fa-solid fa-trash-can" v-on:click="removeServing(serving)"></a></td>
                                </template>
                            </tr>
                            <tr v-if="dishById.isEdit">
                                <td><input type="text" v-model="dishById.newServing.name"></td>
                                <td><input type="number" v-model="dishById.newServing.grams"></td>
                                <td><a class="fa-solid fa-plus" v-on:click="addServing"></a></td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
                                <div class="row">
                    <div class="col">
                        <table class="day-table">
                            <colgroup>
                                <col class="colg-food-name"/>
                                <col class="colg-food-amount"/>
                                <col class="colg-food-nutri" span="4"/>
                                <col class="colg-food-button"/>
                            </colgroup>
                            <thead>
                            <th>                        <h3>Ingredience</h3>
</th>
                            <th></th>
                            <th>Energie</br><small>(kcal)</small></th>
                            <th>Bílk.</br><small>(g)</small></th>
                            <th>Sach.</br><small>(g)</small></th>
                            <th>Tuky</br><small>(g)</small></th>
                            <th></th>
                            </thead>
                            <tbody>
                            <template v-for="ingredient in dishById.ingredients">
                                <ingredient v-bind:entry="ingredient"></ingredient>
                            </template>
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
        return {
            selectedServing: 0,
        }
    },
    computed: {
        dishById() {
            return this.$getter.getDish(this.$route.params.id)
        },

    },
    async mounted() {
    },
}