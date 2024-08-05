const myLobby = require("Lobby");

cc.Class({
    extends: cc.Component,

    properties: {
       newWebView: cc.WebView,
       lobbyNode:{
        default: null,
        type: cc.Node
       },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onLoad(){
        // console.log("New Script onload");
        this.lobbyComponent = this.lobbyNode.getComponent('Lobby');
    },

    onOpenWebview(token, url) {
        
        if (cc.sys.isNative) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                console.log("window check", window || Window);
                const message = JSON.stringify({ key: "value" });
                     this.newWebView.node.on('loaded', () => {
                       
                        const type = 'authToken';

                            jsb.reflection.callStaticMethod(
                                "org/cocos2dx/lib/WebAppInterface", 
                                "postMessage", 
                                "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", 
                                type, 
                                token, 
                                url
                            );  
                      
                        
                        this.newWebView.evaluateJS(`
                            try {
                                var meta = document.createElement('meta');
                                meta.httpEquiv = "Permissions-Policy";
                                meta.content = "accelerometer=self";
                                document.head.appendChild(meta);
                            } catch (e) {
                                console.error('Failed to set Permissions-Policy:', e);
                            }
                            try {
                                
                             } catch (e) {
                                console.error('Failed to post message:', e);
                            }
                        `);
                    });
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                console.log("Running on iOS");
                this.newWebView.node.on('loaded', () => {
                    this.newWebView.evaluateJS(`
                        try {
                            window.postMessage({ type: 'authToken', token: '${token}' }, '${url}');
                        } catch (e) {
                            console.error('Failed to post message:', e);
                        }
                    `);
                });
            }
        } else if (cc.sys.isBrowser) {
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                console.log("Running on Android Browser");
                this.newWebView.node.on('loaded', () => {
                    this.newWebView.evaluateJS(`
                        try {
                            var meta = document.createElement('meta');
                            meta.httpEquiv = "Permissions-Policy";
                            meta.content = "accelerometer=self";
                            document.head.appendChild(meta);
                        } catch (e) {
                            console.error('Failed to set Permissions-Policy:', e);
                        }
                        try {
                            window.postMessage({ type: 'authToken', token: '${token}' }, '${url}');
                        } catch (e) {
                            console.error('Failed to post message:', e);
                        }
                    `);
                });
            } else if (cc.sys.os === cc.sys.OS_IOS) {
                console.log("Running on iOS Browser");
                this.newWebView.node.on('loaded', () => {
                        this.newWebView.evaluateJS(`
                             try {
                                var meta = document.createElement('meta');
                                meta.httpEquiv = "Permissions-Policy";
                                meta.content = "accelerometer=self";
                                document.head.appendChild(meta);
                            } catch (e) {
                                console.error('Failed to set Permissions-Policy:', e);
                            }
                            try {
                                window.postMessage({ type: 'authToken', token: '${token}' }, '${url}');
                            } catch (e) {
                                console.error('Failed to post message:', e);
                            }
                        `);
                });
            } else {
                console.log("Running on Desktop Browser");
                setTimeout(() => {
                    this.newWebView.node.on('loaded', () => {
                        this.newWebView.evaluateJS(`
                            try {
                                var meta = document.createElement('meta');
                                meta.httpEquiv = "Permissions-Policy";
                                meta.content = "accelerometer=self";
                                document.head.appendChild(meta);
                            } catch (e) {
                                console.error('Failed to set Permissions-Policy:', e);
                            }
                            try {
                                window.postMessage({ type: 'authToken', token: '${token}' }, '${url}');
                            } catch (e) {
                                console.error('Failed to post message:', e);
                            }
                        `);
                    });
                }, 1000);
            }
        }
        this.newWebView.url = url;
        window.addEventListener('message', (event) => {
            console.log("Event received:", event);
            const message = event.data;
    
            if (message === 'authToken') {
                if (typeof Android !== 'undefined') {
                    // Send both token and URL to Android
                    // Android.receiveTokenAndUrl(message.token, message.url);
                    this.newWebView.node._components[0]._impl._iframe.contentWindow.postMessage({ type: 'authToken', cookie: token }, url);
                }
                console.log("Received authToken message for Cocos game");
                if (cc.sys.isBrowser) {
                    this.newWebView.node._components[0]._impl._iframe.contentWindow.postMessage({ type: 'authToken', cookie: token }, url);
                    this.addFullscreenToIframe();
                } else {
                    this.newWebView.evaluateJS(`
                        try {
                            window.postMessage({ type: 'authToken', cookie: '${token}' }, '${url}');
                        } catch (e) {
                            console.error('Failed to post message:', e);
                        }
                    `);
                }
            }
    
            if (message === "onExit") {
                this.newWebView.url = "";
                console.log("Exiting WebView:", this.newWebView, "and", this.lobbyNode);
                this.newWebView.node._parent.active = false;
                this.lobbyComponent.getUserDetails();
            }
        });
    },
    addFullscreenToIframe(){
      const script = `
            (function() {
                var iframes = document.getElementsByTagName('iframe');
                if (iframes.length > 0) {
                    var iframe = iframes[0];
                    iframe.setAttribute('allow', 'fullscreen');
                    console.log('Fullscreen attribute added to iframe');
                } else {
                    console.log('No iframe found');
                }
            })();
        `;
        this.newWebView.evaluateJS(script);
    },

    // update (dt) {},
});
