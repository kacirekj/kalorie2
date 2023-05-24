const template = `
    <div class="modal" v-if="isVisible" v-on:click="onOuterModalClick()">
        <div class="modal-content" v-on:mouseenter="cursorIsInContent = true" v-on:mouseleave="cursorIsInContent = false">
            <slot>
            </slot>
        </div>
    </div>
`
export default {
    template,
    props: ['isVisible'],
    emits: ['close'],
    data() {
        return {
            cursorIsInContent: false,
        }
    },
    methods: {
        onOuterModalClick() {
            if(!this.cursorIsInContent)
                this.$emit('close', true)
        }
    }
}
