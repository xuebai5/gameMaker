import styles from './style.css'
import Icon from '@/ui/icon'

export default {
    name: 'tree-view',
    props: {
        data: {
            type: Array,
            default: []
        },
        getIdFunction: Function,
        haveChildrenFunction: {
            type: Function,
            default: () => Promise.resolve(true)
        },
        renderItemFunction: {
            type: Function,
            required: true
        },
        getChildrenFunction: {
            type: Function,
            default: () => Promise.resolve([])
        },
        selected: Object
    },
    data() {
        return {
            treeData: this.getItemDataFromPropData(this.data) || [],
            chosenObj: null
        }
    },
    watch: {
        data(value) {
            this.treeData = this.getItemDataFromPropData(value)
        },
        selected: {
            handler(value) {
                this.chosenObj = this.treeData.find(d => d.raw === value)
            },
            immediate: true
        }
    },
    methods: {
        getItemDataFromPropData(data) {
            return data.map(obj => {
                const d = {
                    children: [],
                    isFolded: true,
                    haveChildren: false,
                    raw: obj
                }

                this.haveChildrenFunction(obj).then(value => d.haveChildren = value)

                return d
            })
        },
        toggleItem(obj) {
            this.chosenObj = obj
            if (obj.haveChildren) { // if have children
                obj.isFolded = !obj.isFolded
                this.getChildrenFunction(obj.raw).then(data => obj.children = this.getItemDataFromPropData(data))
            }
            this.$emit('input', obj.raw)
        },
        renderItem(obj) {
            const INDENT_LENGTH = 16
            return <div key={this.getIdFunction(obj.raw)}>
                <div class={[styles.treeItem, { [styles.chosen]: this.chosenObj === obj }]}
                     onClick={() => this.toggleItem(obj)}>
                    {this.renderItemFunction(obj.raw)}
                    {obj.haveChildren &&
                    <Icon className={[styles.arrowIcon, { [styles.unFold]: !obj.isFolded }]}
                          icon={'arrow_drop_down'}
                          size={32}/>}
                </div>
                {obj.children.length > 0 && !obj.isFolded &&
                <div class={styles.children} style={{ marginLeft: `${INDENT_LENGTH}px` }}>
                    {this.renderItemList(obj.children)}
                </div>}
            </div>
        },
        renderItemList(array) {
            return array.map(obj => this.renderItem(obj))
        }
    },
    render() {
        const {
            treeData,
            renderItemList
        } = this

        return <div class={styles.treeView}>
            {renderItemList(treeData)}
        </div>
    }
}
