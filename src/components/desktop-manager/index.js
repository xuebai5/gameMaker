// @flow
import styles from './style.css'
import Desktop from '@/components/desktop'
import Window from '@/components/window'
import WindowLabelList from '@/components/window-label-list'

type WindowType = {
    title: string,
    content: any,
    size: number
}

type DesktopType = {
    windows: Window[]
}

export const MAX_SIZE = 4

export default {
    name: 'desktop-manager',
    data: () => ({
        desktops: [],
        currentWindow: null,
        currentDesktopIndex: 0
    }),
    methods: {
        gotoDesktop(index: number): void {
            this.$el.style.transform = `translateX(${-100 * index}%)`
        },
        addWindow(window: WindowType, size: number): void {
            if (!size) return

        },
        handleNewWindow({ name, content }): void {
            this.currentWindow = { title: name, content }
        },
        handleMovingWindow(deltaX): void {
            this.$refs.currentWindow.style.width = `${deltaX}px`
        },
        handleMovingWindowEnd(size): void {
            if (!size || !this.currentWindow) {
                this.currentWindow = null
                return
            }

            let currentDesktop = this.desktops[this.currentDesktopIndex]
            let { windows } = currentDesktop

            this.currentWindow.size = size
            if (windows.length + size > MAX_SIZE) {
                //create a new window
                this.desktops.push({ windows: [this.currentWindow] })
                this.gotoDesktop(++this.currentDesktopIndex)
            } else {
                //shrink the first window to fit the new window
                let totalSize = windows.reduce((sum, window) => sum += window.size, 0)
                windows[0].size -= totalSize + size - MAX_SIZE
                windows.push(this.currentWindow)
            }
            this.currentWindow = null
        }
    },
    created() {

    },
    computed: {
        windowLabels() {
            return [
                { icon: 'dashboard', name: 'dashboard' },
                { icon: 'face', name: 'face' },
                { icon: 'favorite', name: 'favorite' },
                { icon: 'delete', name: 'delete' },
                { icon: 'polymer', name: 'polymer' }
            ]
        },
    },
    render() {
        let {
            desktops,
            windowLabels,
            currentDesktopIndex,
            currentWindow,
            handleNewWindow,
            handleMovingWindow,
            handleMovingWindowEnd
        } = this

        return <div class={styles.desktopManager}
                    onNewWindow={handleNewWindow}
                    onMovingWindow={handleMovingWindow}
                    onMovingWindowEnd={handleMovingWindowEnd}>
            {desktops && desktops.map((desktop, index) => <Desktop>
                {desktop.windows && desktop.windows.map(window =>
                    <Window title={window.title}
                            color={window.color}
                            style={{ flex: window.size }}>{window.content}</Window>)}
                {index === currentDesktopIndex && currentWindow &&
                    <Window title={currentWindow.title}
                            color={currentWindow.color}
                            ref="currentWindow">{currentWindow.content}</Window>}
            </Desktop>)}
            <WindowLabelList labels={windowLabels}/>
        </div>
    }
}
