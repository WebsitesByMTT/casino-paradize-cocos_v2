cc.Class({
    extends: cc.Component,

    properties: {
        webView: cc.WebView, 
    },

    onload(){
       
    },

    updateView(data) {
    //    console.log("URL", data, "this", this);
       this.webView.url = data.url
       this.webView.active = true;
    },

});
