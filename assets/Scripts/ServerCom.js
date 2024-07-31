// const axios = require('axios')
var root = window;
cc.Class({
    extends: cc.Component,
    properties: {
        loading: {
            default: null,
            type: cc.Node,
        },
        reconnecting: {
            default: null,
            type: cc.Node,
        },
        tracker: {
            default: {},
        },
        errorLable:{
            default: null,
            type:cc.Label
        },
        loginErrorNode:{
            default: null,
            type: cc.Node
        },
        errorHeading:{
            default: null,
            type: cc.Label
        },
        loaderAnimNode:{
            default: null,
            type: cc.Node
        },
        trackerCount: 0,
        timer : 0,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        // Created ServerCom Gloabaly so that we can access it anywhere we want
        root.ServerCom = this;
        this.checkOrientation();
        // Add event listener for canvas resize to handle orientation change
        cc.view.on('canvas-resize', this.checkOrientation, this);
    },
    // following function is to check the width and change the orientation(Landscape/Potrait) for mobile or dekstop
    checkOrientation() {
        try {
            let winSize = cc.winSize;
            // Check if the width is greater than the height to determine orientation
            if (winSize.width > winSize.height) {
               
                cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
            } else {
                cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
               
            }
        } catch (error) {
            // console.error("Error checking orientation:", error);
        }
    },
   
    clearTracker: function(){
        this.trackerCount = 0;
        this.tracker = {};
    },

    /**
     * @method httpPostRequest
     * @description HTTP request - POST data 
     * @param {String} address -address of Server 
     * @param {Object} data -Data/PayLoad to be sent
     * @param {method} callback -Callback to be executed if response.succss is true!
     * @param {method} error -Callback to be executed if response.success is false!
     * @param {Number} timeout -value in milli seconds, Specify request timeout time! 
     * @memberof Utilities.ServerCom#
     */

    httpRequest: function (method, address, data, callback, error, timeout) {
        var inst = this;
        var xhr = new XMLHttpRequest();
        xhr.timeout = timeout || 8000;
        if(!ServerCom.loading.active){
            ServerCom.loading.active = true;
            inst.startLoaderAnimation();
        }
        xhr.onreadystatechange = function () {
            K.internetAvailable = true;
            if (xhr.readyState == 4) {
                ServerCom.loading.active = false;
                inst.stopLoaderAnimation();
                var response = xhr.responseText;
                if (xhr.status >= 200 && xhr.status < 400) {
                    if (callback !== null && callback !== undefined) {
                        var data = JSON.parse(response);
                            callback(data);
                    }
                } else {
                    var errorMsg = "Unknown error";
                    try {
                        var errorData = JSON.parse(response);
                        if (errorData.error) {
                            errorMsg = errorData.error;
                        }
                        // console.log("errorDataerrorData", errorData, xhr);
                        inst.errorLable.string = errorData.error ? errorData.error : errorData.message;
                        inst.loginErrorNode.active = true;
                        setTimeout(() => {
                            inst.loginErrorNode.active = false;
                        }, 2000);
                        // callback(errorData);
                    } catch (e) {
                        // console.log("Error parsing error response:", e);
                    }
                }
            }
        };
    
        xhr.onerror = function (err) {
            ServerCom.loading.active = false;
            inst.stopLoaderAnimation();
            K.internetAvailable = false;
            var errorMsg = "Unknown error";
            try {
                // console.log("xhr on error", xhr);
                var errorData = JSON.parse(xhr.responseText);
                if (errorData.error) {
                    errorMsg = errorData.error;
                }
            } catch (e) {
                // console.error("Error parsing error response:", e);
            }
        };
    
        xhr.ontimeout = function () {
            ServerCom.loading.active = false;
            inst.stopLoaderAnimation();
            K.disconnectRequestedByPlayer = false;
            K.internetAvailable = false;
            // 
            inst.errorLable.string = "Something went wrong",
            inst.loginErrorNode.active = true;
            setTimeout(() => {
                inst.loginErrorNode.active = false;
            }, 2000);
        };
        // 
        // xhr.withCredentials = true;
        xhr.open(method, address, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        let token = null;
        if (!token && cc.sys.isBrowser) {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith('userToken=')) {
                    token = cookie.substring('userToken='.length, cookie.length);
                    break;
                }
            }
        }else{
            if (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os == cc.sys.Os_IOS) {
                // This is an Android device
                console.error("Running on Android and IOS");
                token = cc.sys.localStorage.getItem('userToken');
            }
        }
        // If token exists, add it to a custom header
        if (token) {
            // console.log(token, "token");
            xhr.setRequestHeader("Authorization", "Bearer " + token);
        }
        if (method === "POST" || method === "PUT") {
            xhr.send(JSON.stringify(data));
        } else if (method === "GET") {
            xhr.send();
        }
    },

    startLoaderAnimation() {
        if (this.loaderAnimNode._tween) {
            this.loaderAnimNode._tween.stop();
        }
        this.loaderAnimNode._tween = cc.tween(this.loaderAnimNode)
            .repeatForever(cc.tween().to(1, { angle: -360 }))
            .start();
    },

    stopLoaderAnimation() {
        if (this.loaderAnimNode._tween) {
            this.loaderAnimNode._tween.stop();
            this.loaderAnimNode.angle = 0;
        }
    }



    
    // WILL use the following code later to check if the same api is request untill we gets its response
    // /**
    // updateTracker: function (val, key, showLoading) {
    //     var incr = val ? +1 : -1;
    //     this.trackerCount = this.trackerCount + incr;
    //     var isActive = val && showLoading;
    //     if(!this.loading.active && showLoading){
    //         this.loading.active = true; 
    //     }else if(this.loading.active && !showLoading) {
    //         this.loading.active = false;
    //     }
    //     //this.loading.active = val && showLoading;
    //     this.tracker[key] = val;
    // },

});