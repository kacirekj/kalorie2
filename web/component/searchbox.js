const template = `
    <div>
        <input class="searchbox" type="text"
               v-bind:placeholder="placeholder"
               v-bind:value="value"
               v-on:input="$emit('input', $event.target.value)"
               v-bind:readonly="isReadonly"
               v-bind:style="{cursor: isReadonly ? 'pointer' : 'auto'}"

               v-on:focus="isFocusOnInput = true"
               v-on:blur="isFocusOnInput = false"
        />
        <div id="food-searchbox-items" class="card box-luminescent searchbox-items"
             v-if="isShow"
             v-on:mouseenter="isFocusOnDiv = true"
             v-on:mouseleave="isFocusOnDiv = false"
             v-on:mousedown="isFocusOnDiv = true"
             v-on:click="!isNonClickable ? isFocusOnDiv = false : isFocusOnDiv = true"
             v-bind:style="{cursor: 'pointer'}"
        >
            <slot>
            </slot>
        </div>
    </div>
`
export default {
    template,
    props: ['value', 'placeholder', 'isReadonly', 'isNonClickable'],
    emits: ['input'],
    data() {
        return {
            isDebug: true,
            isFocusOnInput: false,
            isFocusOnDiv: false,
        }
    },
    computed: {
        isShow() {
            return this.isFocusOnInput || this.isFocusOnDiv
        }
    },
    methods: {},
    mounted() {
    }
}
