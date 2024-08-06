// var responseTypes = require('ResponseTypes');
cc.Class({
    extends: cc.Component,

    properties: {

        userName: {
            default: null,
            type: cc.EditBox,
        },
        password: {
            default: null,
            type: cc.EditBox,
        },
        rememberMe: {
            default: null,
            type: cc.Toggle
        },
        lobbyNode:{
            default: null,
            type: cc.Node,
        },
        errorLable:{
            default: null,
            type:cc.Label
        },
        loginErrorNode:{
            default: null,
            type: cc.Node
        },
        customKeyboard:{
            default: null,
            type: cc.Node,
        },
        smallAlphabet:{
            default: null,
            type: cc.Node
        },
        capitalAlphabet:{
            default: null,
            type: cc.Node
        },
        symbolsAlphabet: {
            default: null,
            type:cc.Node
        },
        capsButton:{
            default: null,
            type: cc.Node
        },
        smallButton:{
            default: null,
            type: cc.Node
        },
        deleteButton: {
            default:null,
            type: cc.Node
        },
        spaceButton:{
            default: null,
            type: cc.Node
        },
        commaButton:{
            default: null,
            type: cc.Node
        },
        dotButton:{
            default: null,
            type: cc.Node
        },
        // backgroundMusic:{
        //     default: null,
        //     type: cc.AudioClip
        // },
        randomImageNode: cc.Node, // Reference to the node containing the sprite
        spriteFrames: [cc.SpriteFrame],
       
    
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad () {   
        this.activeInputField = null; 
        this.setupInputFocusListeners();
        this.setupKeyboardButtonListeners();
        this.disableDefaultKeyboard();
        this.loadSavedLoginInfo();
        if(!cc.sys.isNative){
            this.checkPageReload();
        }
        this.changeRandomImage();
         //KeyBoard enter event register
        this.node.on(cc.Node.EventType.KEY_DOWN, this.mouseEnter, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.mouseEnter, this);
        // this.audioClipID = cc.audioEngine.play(this.backgroundMusic, true, 0.5)
        // cc.game.loadAudioID = this.audioClipID
    },

   
    mouseEnter: function(event){
        if (event.keyCode === cc.macro.KEY.enter) {
           this.onLoginClick();
        }
    },
    onDestroy () {
        // Unregister the keyboard event listener when the node is destroyed
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },
    //Check for page reload
    checkPageReload() {
        if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
            this.handlePageReload();
        }
    },
    // on page reload check username and password save or not if yes the hit auto login
    handlePageReload() {
        let username, password;
        if (cc.sys.isBrowser) {
            username = localStorage.getItem('rememberedUsername');
            password = localStorage.getItem('rememberedPassword');
        } else {
            username = cc.sys.localStorage.getItem('rememberedUsername');
            password = cc.sys.localStorage.getItem('rememberedPassword');
        }
        if (username && password) {
            this.autoLogin(username, password);
        }
    },

    autoLogin(username, password) {
        const address = K.ServerAddress.ipAddress + K.ServerAPI.login;
        const data = { username: username, password: password };
        ServerCom.httpRequest("POST", address, data, function (response) {
            // console.error("reponse on login", response.token);
            if (response.token) {
                const randomNumber = Math.floor(Math.random() * 10) + 1;
                if (cc.sys.isBrowser) {
                    document.cookie = `userToken=${response.token}; path=/;`;
                    document.cookie = `index = ${randomNumber}`
                } else {
                    cc.sys.localStorage.setItem('userToken', response.token);
                    cc.sys.localStorage.setItem("index", randomNumber); 
                }
                // Cookies.set("index", randomNumber);
                setTimeout(function () {
                    this.lobbyNode.active = true;
                }.bind(this), 1000);
            }
            else{
               
            }
            
        }.bind(this));
    },

    changeRandomImage() {
        // Get a random index between 0 and the length of the spriteFrames array
        const randomIndex = Math.floor(Math.random() * this.spriteFrames.length);

        // Get the sprite component from the loginNode
        const spriteComponent = this.randomImageNode.getComponent(cc.Sprite);

        // Set the spriteFrame to one of the random images
        spriteComponent.spriteFrame = this.spriteFrames[randomIndex];
    },

    disableDefaultKeyboard() {
        if (cc.sys.isMobile && cc.sys.isBrowser) {
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.style.pointerEvents = 'none'; // Disable interactions
            });
        }
    },

    setupInputFocusListeners() {
        if (cc.sys.isMobile && cc.sys.isBrowser) {
            // Attach focus event listeners to username and password input fields
            if (this.userName) {
                this.userName.node.on(cc.Node.EventType.TOUCH_END, this.onInputFieldClicked, this);
            }
            if (this.password) {
                this.password.node.on(cc.Node.EventType.TOUCH_END, this.onInputFieldClicked, this);
            }
        }
    },
 
    onInputFieldClicked(event) {
        // Focus the corresponding input field to trigger the keyboard
        const inputNode = event.currentTarget.getComponent(cc.EditBox);
        if (inputNode) {
            // inputNode.focus()
            this.activeInputField = inputNode;
            if (this.customKeyboard) {
                this.customKeyboard.active = true; // Show the custom keyboard if needed
                event.preventDefault();
                this.scheduleOnce(() => {
                    this.activeInputField.blur(); // Blur the input field after showing the custom keyboard
                }, 0.1);
            }
        }
    },

    setupKeyboardButtonListeners() {
        const allKeyboardButtons = this.getAllKeyboardButtons();
        allKeyboardButtons.forEach(button => {
            button.on(cc.Node.EventType.TOUCH_END, this.onKeyboardButtonClicked, this);
        });
        // if (this.deleteButton) { // Add listener for the delete button
        //     this.deleteButton.on(cc.Node.EventType.TOUCH_END, this.onDeleteButtonClicked, this);
        // }
    },

    getAllKeyboardButtons() {
        let buttons = [];
        buttons = buttons.concat(this.smallAlphabet.children);
        buttons = buttons.concat(this.capitalAlphabet.children);
        buttons = buttons.concat(this.symbolsAlphabet.children);
        buttons = buttons.concat(this.spaceButton);
        buttons = buttons.concat(this.commaButton);
        buttons = buttons.concat(this.dotButton);
        return buttons;
    },

    onKeyboardButtonClicked(event) {
        const button = event.target;
        const customEventValue = button._components[1].clickEvents[0].customEventData;
        this.appendToActiveInput(customEventValue);
    },

    appendToActiveInput(value) {
        if (this.activeInputField) {
            this.activeInputField.string += value; // Append value to the active input field
        }
    },
    onDeleteButtonClicked() {
        this.removeFromActiveInput();
    },
    
    //logoutButton Clicked
    logutClick(){
        if(this.lobbyNode.active){
            this.lobbyNode.active = false;
        }
        let rememberMeChecked;
        if (cc.sys.isBrowser) {
            rememberMeChecked = localStorage.getItem('rememberMeChecked');
        } else {
            rememberMeChecked = cc.sys.localStorage.getItem('rememberMeChecked');
        }
        if(!rememberMeChecked){
            this.clearSavedLoginInfo();
        }
    },

    removeFromActiveInput() {
        if (this.activeInputField && this.activeInputField.string.length > 0) {
            this.activeInputField.string = this.activeInputField.string.slice(0, -1); // Remove last character
        }
    },

    onLoginClick (){
        var address = K.ServerAddress.ipAddress + K.ServerAPI.login;
        var data = {
            username: this.userName.string,
            password: this.password.string
        };
        if(this.userName.string == "" || this.password.string == ""){
            this.errorLable.string = "Username or Password fields are empty"
            this.loginErrorNode.active = true;
            setTimeout(() => {
                this.loginErrorNode.active = false;
            }, 2000);
            
            return
        }
        if (this.rememberMe.isChecked) {
            this.saveLoginInfo(this.userName.string, this.password.string);
        } else {
            this.clearSavedLoginInfo();
        }
        ServerCom.httpRequest("POST", address, data, function (response) {
            // console.error("reponse on login", response.token);
            if (response.token) {
                const randomNumber = Math.floor(Math.random() * 10) + 1;
                if (cc.sys.isBrowser) {
                    document.cookie = `userToken=${response.token}; path=/;`;
                    document.cookie = `index = ${randomNumber}`
                } else {
                    cc.sys.localStorage.setItem('userToken', response.token);
                    cc.sys.localStorage.setItem("index", randomNumber); 
                }
                
                // Cookies.set("index", randomNumber);
                setTimeout(function () {
                    this.lobbyNode.active = true;
                }.bind(this), 1000);
            }
            else{
               
            }
            
        }.bind(this));

    },

    smallAlphabetBUttonClicked: function(){
        if(this.capitalAlphabet.active ){
            this.capitalAlphabet.active = false;
            this.smallAlphabet.active = true;
            if(this.symbolsAlphabet.active){
                this.symbolsAlphabet.active = false;
            }
            this.smallButton.active = false;
            this.capsButton.active = true;
        }else{
            if(this.symbolsAlphabet.active){
                this.symbolsAlphabet.active = false;
            }
            this.capitalAlphabet.active = true;
            this.smallAlphabet.active = false;
            this.smallButton.active = true;
            this.capsButton.active = false;
        }
    },
    
    specialSymbolClicked: function(){
        if(this.capitalAlphabet.active || this.smallAlphabet.active){
            this.smallAlphabet.active = false;
            this.capitalAlphabet.active = false;
            this.symbolsAlphabet.active = true;
        }
        else{
            this.symbolsAlphabet.active = false;
            if(!this.smallAlphabet.active){
                this.smallAlphabet.active = true;
                this.capitalAlphabet.active = false;
            }
        }
    },

    closeKeyBoard: function(){
        this.customKeyboard.active = false;
    },
    saveLoginInfo (username, password) {
        if (cc.sys.isBrowser) {
            localStorage.setItem('rememberedUsername', username);
            localStorage.setItem('rememberedPassword', password);
            localStorage.setItem('rememberMeChecked', 'true');
        } else {
            cc.sys.localStorage.setItem('rememberedUsername', username);
            cc.sys.localStorage.setItem('rememberedPassword', password);
            cc.sys.localStorage.setItem('rememberMeChecked', 'true');
        }
    },

    clearSavedLoginInfo () {
        if (cc.sys.isBrowser) {
            localStorage.removeItem('rememberedUsername');
            localStorage.removeItem('rememberedPassword');
            localStorage.removeItem('rememberMeChecked');
        } else {
            cc.sys.localStorage.removeItem('rememberedUsername');
            cc.sys.localStorage.removeItem('rememberedPassword');
            cc.sys.localStorage.removeItem('rememberMeChecked');
        }
    },

    loadSavedLoginInfo () {
        let username, password, rememberMeChecked;
        
        if (cc.sys.isBrowser) {
            username = localStorage.getItem('rememberedUsername');
            password = localStorage.getItem('rememberedPassword');
            rememberMeChecked = localStorage.getItem('rememberMeChecked');
        } else {
            username = cc.sys.localStorage.getItem('rememberedUsername');
            password = cc.sys.localStorage.getItem('rememberedPassword');
            rememberMeChecked = cc.sys.localStorage.getItem('rememberMeChecked');
        }

        if (username && password) {
            this.userName.string = username;
            this.password.string = password;
        }

        if (rememberMeChecked === 'true') {
            this.rememberMe.isChecked = true;
            // this.rememberMe.getChildByName("checkmark").active = true
        }
    }
   
});