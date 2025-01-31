import { ItemView, WorkspaceLeaf, Menu } from 'obsidian'
import { createWebviewTag } from './fns/createWebviewTag'
import { Platform } from 'obsidian'
import { createIframe } from './fns/createIframe'
import { clipboard } from 'electron'
import WebviewTag = Electron.WebviewTag

export class GateView extends ItemView {
    private readonly options: GateFrameOption
    private frame: WebviewTag | HTMLIFrameElement
    private readonly useIframe: boolean = false

    constructor(leaf: WorkspaceLeaf, options: GateFrameOption) {
        super(leaf)
        this.navigation = false
        this.options = options
        this.useIframe = Platform.isMobileApp
    }

    addActions(): void {
        this.addAction('refresh-ccw', 'Reload', () => {
            if (this.frame instanceof HTMLIFrameElement) {
                this.frame.contentWindow?.location.reload()
            } else {
                this.frame.reload()
            }
        })

        this.addAction('home', 'Home page', () => {
            if (this.frame instanceof HTMLIFrameElement) {
                this.frame.src = this.options?.url ?? 'about:blank'
            } else {
                this.frame.loadURL(this.options?.url ?? 'about:blank')
            }
        })
    }

    isWebviewFrame(): boolean {
        return this.frame! instanceof HTMLIFrameElement
    }

    onload(): void {
        super.onload()
        this.addActions()

        this.contentEl.empty()
        this.contentEl.addClass('open-gate-view')

        if (this.useIframe) {
            this.frame = createIframe(this.options)
        } else {
            this.frame = createWebviewTag(this.options)
        }

        this.contentEl.appendChild(this.frame as unknown as HTMLElement)
    }

    onunload(): void {
        this.frame.remove()

        super.onunload()
    }

    onPaneMenu(menu: Menu, source: string): void {
        super.onPaneMenu(menu, source)
        menu.addItem((item) => {
            item.setTitle('Reload')
            item.setIcon('refresh-ccw')
            item.onClick(() => {
                if (this.frame instanceof HTMLIFrameElement) {
                    this.frame.contentWindow?.location.reload()
                } else {
                    this.frame.reload()
                }
            })
        })
        menu.addItem((item) => {
            item.setTitle('Home page')
            item.setIcon('home')
            item.onClick(() => {
                if (this.frame instanceof HTMLIFrameElement) {
                    this.frame.src = this.options?.url ?? 'about:blank'
                } else {
                    this.frame.loadURL(this.options?.url ?? 'about:blank')
                }
            })
        })
        menu.addItem((item) => {
            item.setTitle('Toggle DevTools')
            item.setIcon('file-cog')
            item.onClick(() => {
                if (this.frame instanceof HTMLIFrameElement) {
                    return
                }

                if (this.frame.isDevToolsOpened()) {
                    this.frame.closeDevTools()
                } else {
                    this.frame.openDevTools()
                }
            })
        })
        menu.addItem((item) => {
            item.setTitle('Copy Page URL')
            item.setIcon('clipboard-copy')
            item.onClick(() => {
                if (this.frame instanceof HTMLIFrameElement) {
                    return
                }

                clipboard.writeText(this.frame.getURL())
            })
        })
    }

    getViewType(): string {
        return this.options?.id ?? 'gate'
    }

    getDisplayText(): string {
        return this.options?.title ?? 'Gate'
    }

    getIcon(): string {
        if (this.options?.icon.startsWith('<svg')) {
            return this.options.id
        }

        return this.options?.icon ?? 'globe'
    }
}
