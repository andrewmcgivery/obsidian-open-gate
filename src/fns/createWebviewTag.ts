import WebviewTag = Electron.WebviewTag

// Constants for repeated strings
const DEFAULT_URL = 'about:blank'
const GOOGLE_URL = 'https://google.com'
const OPEN_GATE_WEBVIEW_CLASS = 'open-gate-webview'

export const createWebviewTag = (params: Partial<GateFrameOption>): WebviewTag => {
    // Create a new webview tag
    const webviewTag = document.createElement('webview') as unknown as WebviewTag

    // Set attributes for the webview tag
    webviewTag.setAttribute('partition', 'persist:' + params.profileKey)
    webviewTag.setAttribute('src', params.url ?? DEFAULT_URL)
    webviewTag.setAttribute('httpreferrer', params.url ?? GOOGLE_URL)
    webviewTag.setAttribute('crossorigin', 'anonymous')
    webviewTag.setAttribute('allowpopups', 'true')
    webviewTag.setAttribute('disablewebsecurity', 'true')
    webviewTag.addClass(OPEN_GATE_WEBVIEW_CLASS)

    // Set user agent if provided
    if (params.userAgent && params.userAgent !== '') {
        webviewTag.setAttribute('useragent', params.userAgent)
    }

    // Add event listener for 'dom-ready' event
    webviewTag.addEventListener('dom-ready', async () => {
        // Set zoom factor if provided
        if (params.zoomFactor) {
            webviewTag.setZoomFactor(params.zoomFactor)
        }
    })

    return webviewTag
}
