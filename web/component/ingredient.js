const template = `
    <div style="display: contents">
        <template v-if="!food.isEdit">
        </template>
    </div>
`
export default {
    template,
    props: ['food'],
    emits: ['input'],
    data() {
        return {
        }
    },
    computed: {

    },
    methods: {
    },
    mounted() {
    }
}
