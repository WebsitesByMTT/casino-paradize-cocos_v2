const login = require("Login");
const jwt = require('jsonwebtoken'); 
const webview = require("WebviewHandler");
// var setUserDetails = require('ResponseTypes');
cc.Class({
  extends: cc.Component,

  properties: {
    userId: {
      default: null,
      type: cc.Label,
    },
    coinsLabel: {
      default: null,
      type: cc.Label,
    },
    cloudAnimNode: {
      default: null,
      type: cc.Node,
    },
    sprite: {
      default: null,
      type: cc.SpriteFrame,
    },
    smallItemNode: {
      default: null,
      type: cc.Node,
    },
    rightTiltNode: {
      default: null,
      type: cc.Node,
    },
    leftTiltNode: {
      default: null,
      type: cc.Node,
    },
    spinWheelNode: {
      default: null,
      type: cc.Node,
    },
    OuterAnimation: {
      default: null,
      type: cc.Node,
    },
    passwordNode: {
      default: null,
      type: cc.Node,
    },
    passwordChangeButton: {
      default: null,
      type: cc.Node,
    },
    popupNode: {
      default: null,
      type: cc.Node,
    },
    oldPassword: {
      default: null,
      type: cc.EditBox,
    },
    newPassword: {
      default: null,
      type: cc.EditBox,
    },
    confirmPassword: {
      default: null,
      type: cc.EditBox,
    },
    profileNode: {
      default: null,
      type: cc.Node,
    },
    saveProfileBtn: {
      default: null,
      type: cc.Node,
    },
    allTab: {
      default: null,
      type: cc.Node,
    },
    fishTab: {
      default: null,
      type: cc.Node,
    },
    favTab: {
      default: null,
      type: cc.Node,
    },
    slotTab: {
      default: null,
      type: cc.Node,
    },
    kenoTab: {
      default: null,
      type: cc.Node,
    },
    otherTab: {
      default: null,
      type: cc.Node,
    },
    loginNode: {
      default: null,
      type: login,
    },
    webviewNode:{
      default: null,
      type: webview
    },
    moneySprite:{
      default: null,
      type:cc.Node
    },
    id: null,
    scrollView: cc.ScrollView,
    itemPrefab: cc.Prefab,
    smallItemPrefab: cc.Prefab,
    category: null,
    lefttiltAngle: -7, // Angle to tilt the node (in degrees)
    tiltDuration: 0.2, // Duration of the tilt animation
    originalRotation: 0,
    righttiltAngle: 7,
    targetX: 0,
    moveDuration: 2.0,
    scaleUp: 0.9, // Scale factor when mouse enters
    scaleNormal: 0.9,
    itemsPerLoad: 10,
    itemHeight: 635,
    myWebViewParent:{
      default: null,
      type: cc.Node
    },
    myWebView: cc.WebView,
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
  pageViewParent:{
    default: null,
    type:cc.Node
  },
  pageView: cc.ScrollView,
  itemsPerPage: 1,
  scrollInterval: 3,
  scrollButton:{
    default: null,
    type: cc.Button, 
  }, 
  smallSpin:{
    default: null,
    type: cc.Node
  }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (!this.category) {
      this.category = "all";
    }

    this.activeInputField = null; 
    this.setupLobbyInputFocusListeners();
    this.setupLobbyKeyboardButtonListeners();
    this.disableDefaultKeyboard();
    this.initialPosition = this.scrollView.node.position.clone();

    this.itemsToLoad = []; // Array to store all items to be loaded
    this.currentIndex = 0; // Current index in the items array
    this.setFullScreenWidth();
    cc.view.setResizeCallback(this.setFullScreenWidth.bind(this)); // Update width on screen resize
    // this.scrollView.node.on("scroll-to-right", this.loadMoreItems, this); // Event listener for horizontal scrolling
    let startX = cc.v2(415, 0)
    let endY = cc.v2(-415, 0);
    let resetPos = cc.v2(415, 0)
    this.cloudAnimNode.setPosition(startX);
    let moveItem = cc.tween().to(4, {position: endY}).call(()=>{
      this.cloudAnimNode.setPosition(resetPos);
    });
    cc.tween(this.cloudAnimNode).repeatForever(moveItem).start();
    // cc.tween(this.cloudAnimNode).repeatForever(moveItem).start();
    // this.moneySprite._tween = cc.tween(this.moneySprite)
    //         .repeatForever(cc.tween().to(1, { angle: -360 }))
    //         .start();
    this.getUserDetails();
    this.fetchGames(this.category);
    this.currentPage = 0;
    this.schedule(this.autoScrollPageView, this.scrollInterval);
    this.setUpPageviewEvent();
    this.rotationSpeed = 180;
  },

  setUpPageviewEvent: function(){
    this.pageView.node.off('touchstart', this.onTouchStart, this);
    this.pageView.node.off('touchend', this.onTouchEnd, this);
    this.pageView.node.off('touchcancel', this.onTouchCancel, this);
            // Add new listeners
    this.pageView.node.on('touchstart', this.onTouchStart, this);
    this.pageView.node.on('touchend', this.onTouchEnd, this);
    this.pageView.node.on('touchcancel', this.onTouchCancel, this);
  },
  
  /**
   * @method Fetach Games by category
   * @description HTTP request - POST data
   * @param {String} address -address of Server
   * @param {Object} data -Data/PayLoad to be sent
   * @param {method} callback -Callback to be executed if response.succss is true!
   * @param {method} error -Callback to be executed if response.success is false!
   */
  fetchGames: function (gameCategory) {
    let content = this.scrollView.content;
    let pageViewContent = this.pageView.content;
    pageViewContent.removeAllChildren();
    content.removeAllChildren();
    this.pageViewParent.active = false;
    this.scrollView.node.setPosition(this.initialPosition);
    this.scrollView.node.getChildByName("view").width = 1600;
    this.scrollView.node.width = 1500;
    var address = K.ServerAddress.ipAddress + K.ServerAPI.game + "=" + gameCategory;
    ServerCom.httpRequest("GET", address, " ", function (response) {
      if(!response.featured && !response.others){
        return
      }
        if (response.featured.length === 0 && response.others.length === 0) {
            ServerCom.errorLable.string = "No Games Found For This Category";
            ServerCom.loginErrorNode.active = true;
            setTimeout(() => {
                ServerCom.loginErrorNode.active = false;
            }, 2000);
            return;
        }
        let otherGames = response.others || [];
        let featured = response.featured || [];

        this.itemsToLoad = [];
         this.currentIndex = 0;
        if (featured.length > 0) {
          this.pageViewParent.active = true;
          this.scollItemCount = featured.length;
          this.populatePageView(featured, gameCategory);
        }
        else{
          this.pageViewParent.active = false;
        }
       // this is done for testing
        if(gameCategory == "fav"){
          this.populateScrollView(otherGames, gameCategory);
        }else{
          this.populateScrollView(featured, gameCategory);
        }
        // if (otherGames.length > 0) {
        //   this.populateScrollView(otherGames, gameCategory);
        // }
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && cc.sys.isMobile){
          this.zoomFullScreenClick();
        }
        this.setFullScreenWidth();
    }.bind(this));
},

populatePageView: function(featuredItems, gameCategory) {
  let pageViewContent = this.pageView.content;
  for (let i = 0; i < featuredItems.length; i++) {
    if(featuredItems[i].status == "active"){
      this.populateItems(featuredItems[i], this.smallItemPrefab, pageViewContent, gameCategory);
    }
  }
  this.pageView.node.on('touchend', (event) => {
    let touchEndPos = event.getLocation();
    let distance = touchEndPos.sub(this.touchStartPos).mag();
    if (distance < 10) { // Adjust this threshold as needed
      
    }});
},
onTouchStart(event) {
  this.touchStartPos = event.getLocation();
},

onTouchEnd(event) {
  let touchEndPos = event.getLocation();
  let distance = touchEndPos.sub(this.touchStartPos).mag();
  if (distance < 10) { // Adjust this threshold as needed
  }
  else{
     this.onScrolling()
  }
},
onTouchCancel() {
  this.touchStartPos = null;
},

populateScrollView: function(otherGames, gameCategory) {
  let scrollViewContent = this.scrollView.content;
  for (let i = 0; i < otherGames.length; i++) {
    if(otherGames[i].status == "active"){
      this.populateItems(otherGames[i], this.itemPrefab, scrollViewContent, gameCategory);
    }
  }
},

populateItems: function(itemData, prefab, parent, gameCategory) {
  let item = cc.instantiate(prefab);
  let itemScript = item.getComponent('GamesPrefab');
  itemScript.updateItem(itemData, gameCategory);
  parent.addChild(item);
},

getGamesByCategoryAll: function () {
    this.category = "all";
    const gameTabs = [
      this.fishTab.getChildByName("bg"),
      this.favTab.getChildByName("bg"),
      this.slotTab.getChildByName("bg"),
      this.kenoTab.getChildByName("bg"),
      this.otherTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.allTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
},

  getGamesByCategoryfish: function () {
    this.category = "fish";
    const gameTabs = [
      this.allTab.getChildByName("bg"),
      this.favTab.getChildByName("bg"),
      this.slotTab.getChildByName("bg"),
      this.kenoTab.getChildByName("bg"),
      this.otherTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.fishTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
  },
  getGamesByCategoryfav: function () {
    this.category = "fav";
    const gameTabs = [
      this.fishTab.getChildByName("bg"),
      this.allTab.getChildByName("bg"),
      this.slotTab.getChildByName("bg"),
      this.kenoTab.getChildByName("bg"),
      this.otherTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.favTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
  },
  getGamesByCategorySlot: function (event) {
    this.category = "slot";
    const gameTabs = [
      this.fishTab.getChildByName("bg"),
      this.allTab.getChildByName("bg"),
      this.favTab.getChildByName("bg"),
      this.kenoTab.getChildByName("bg"),
      this.otherTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.slotTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
  },
  getGamesByCategoryKeno: function (event) {
    this.category = "keno";
    const gameTabs = [
      this.fishTab.getChildByName("bg"),
      this.allTab.getChildByName("bg"),
      this.favTab.getChildByName("bg"),
      this.slotTab.getChildByName("bg"),
      this.otherTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.kenoTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
  },
  getGamesByCategoryOther: function (event) {
    this.category = "others";
    const gameTabs = [
      this.fishTab.getChildByName("bg"),
      this.allTab.getChildByName("bg"),
      this.favTab.getChildByName("bg"),
      this.slotTab.getChildByName("bg"),
      this.kenoTab.getChildByName("bg"),
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    this.otherTab.getChildByName("bg").active = true;
    this.fetchGames(this.category);
  },

  // for full Screen
  zoomFullScreenClick: function () {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
        // console.log("fullout1");
      } else if (document.mozCancelFullScreen) {
        // console.log("fullou2");
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        // console.log("fullout3");
        document.webkitCancelFullScreen();
      }

    }
    this.setFullScreenWidth();
  },
  // Close Spin Popup Node
  closeSpinNode: function () {
    if (this.spinWheelNode.active) {
      this.spinWheelNode.active = false;
    }
  },

  // Open Spin the Wheel popup and run outer animation
  openSpinWheelNode: function () {
    var rotateAction = cc.rotateBy(5, 360);
    var continueRotate = cc.repeatForever(rotateAction);
    this.OuterAnimation.runAction(continueRotate);
    if (!this.spinWheelNode.active) {
      this.spinWheelNode.active = true;
    }
  },

  onScrolling() {
    let offset = this.pageView.getScrollOffset().x;
    let newIndex = Math.round(offset / this.itemHeight);

    if (newIndex !== this.currentItemIndex) {
        this.currentItemIndex = newIndex;
        let newPos = new cc.Vec2(0, this.currentItemIndex * this.itemHeight);
        this.pageView.scrollToOffset(newPos, 0.3);
    }
  },

  openWebView: function(url) {
    let inst = this
    let token = null;
    if (cc.sys.isBrowser) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('userToken=')) {
                token = cookie.substring('userToken='.length, cookie.length);
                break;
            }
        }
    } else {
      if (cc.sys.os === cc.sys.OS_ANDROID || cc.sys.os === cc.sys.OS_IOS) {
        // This is an Android device
        token = cc.sys.localStorage.getItem('userToken');
      }
    }
    // Set the WebView URL
    if(cc.sys.isMobile && cc.sys.isBrowser){
      url += (url.indexOf('?') === -1 ? '?' : '&') + "platform=mobile";
    }
    this.myWebViewParent.active = true;
    this.webviewNode.onOpenWebview(token, url);
},

// fetch username and coins
 getUserDetails: function(){  
  let inst= this
  let address = K.ServerAddress.ipAddress + K.ServerAPI.userDetails
    ServerCom.httpRequest("GET", address, "", function(response){
      // let username = response.username; // Assuming response.username is 'ins'
      // let capitalizedUsername = inst.capitalizeFirstLetter(username);
      inst.id = response._id;
      inst.userId.string = response.username
      let formattedCredits = parseFloat(response.credits).toFixed(2);
      inst.coinsLabel.string = formattedCredits;
    })
 },

 capitalizeFirstLetter: function(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
 },
  // open Profile popup
  openProflePopup: function () {
    this.popupNode.active = true;
    this.profileNode.active = true;
  },
  // Logout Button Clicked
  logOutClick: function () {
    this.node.active = false;
    this.loginNode.logutClick();
  },

  /**
   * @method PasswordChange Popup request
   * @description HTTP request - POST data
   * @param {String} address -address of Server
   * @param {Object} data -Data/PayLoad to be sent
   * @param {method} callback -Callback to be executed if response.succss is true!
   * @param {method} error -Callback to be executed if response.success is false!
   */
  passwordChangeBtn: function () {
    if (
      this.oldPassword.string == "" ||
      this.newPassword.string == "" ||
      this.confirmPassword.string == ""
    ) {
      ServerCom.errorLable.string = "All fields are mandatory";
      ServerCom.loginErrorNode.active = true;
      setTimeout(() => {
        ServerCom.loginErrorNode.active = false;
      }, 2000);
    } else {
      if (this.newPassword.string != this.confirmPassword.string) {
        ServerCom.errorLable.string =
          "New Password and confirm password did not match";
        ServerCom.loginErrorNode.active = true;
        setTimeout(() => {
          ServerCom.loginErrorNode.active = false;
        }, 2000);
        return
      }
      let token = null
      if (!token && cc.sys.isBrowser) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('token=')) {
                token = cookie.substring('token='.length, cookie.length);
                break;
            }
        }
      }
      const user = jwt.decode(token);
      let address = K.ServerAddress.ipAddress + K.ServerAPI.password + `/` + this.id;
      let changeData = {
        existingPassword: this.oldPassword.string,
        password : this.newPassword.string
      }
      ServerCom.httpRequest("PUT", address, changeData, function(response){
        if(response.message){
          ServerCom.errorHeading.string = "Password Changed Successfully"
          ServerCom.errorLable.string = response.message;
          ServerCom.loginErrorNode.active = true;
          setTimeout(() => {
            ServerCom.loginErrorNode.active = false;
          }, 2000);
        }
      }.bind(this))
      this.passwordNode.active = false;
      this.popupNode.active = false;
    }
  },
  // to open the password popup
  changePassword: function () {
    this.passwordNode.active = true;
    this.popupNode.active = true;
  },
  // close all popup
  closePopupBtn: function () {
    if (this.passwordNode.active || this.profileNode.active) {
      this.passwordNode.active = false;
      this.profileNode.active = false;
    }
    this.popupNode.active = false;
  },

  // Save profile button Clicked
  saveProfile: function () {
    this.profileNode.active = false;
    this.popupNode.active = false;
  },

  setFullScreenWidth() {
    if(!document.fullscreenElement){
      if(!this.pageViewParent.active){
          this.scrollView.node.setPosition(cc.v2(-950, 0));
          this.scrollView.node.width = 2100;
          this.scrollView.node.getChildByName("view").width = 2200;
      }else{
        this.scrollView.node.width = 1500;
        this.scrollView.node.getChildByName("view").width = 1600;
        
      }
      this.pageView.node.width = 320;
      // this.pageView.node.getChildByName("view").width = 325;
    } else{      
        if(!this.pageViewParent.active){
          if(cc.sys.isMobile){
            this.scrollView.node.setPosition(cc.v2(-1100, 0));
            this.scrollView.node.width = 2000;
            this.scrollView.node.getChildByName("view").width = 2200;
          }else{
            this.scrollView.node.setPosition(cc.v2(-900, 0));
            this.scrollView.node.width = 2000;
            this.scrollView.node.getChildByName("view").width = 2200;
          }
          
        }else{
          const screenWidth = cc.winSize.width - 350;
          this.scrollView.node.width = screenWidth;
          this.scrollView.node.getChildByName("view").width = screenWidth;
          this.scrollView.node.setPosition(cc.v2(-850, 0));
        }
          this.pageView.node.width = 320;
          // this.pageView.node.getChildByName("view").width = 325;
          // this.myWebView.node.width = 2150
      // }
    }
   },
   // Auto Scroll 
   autoScrollPageView() {
    let content = this.pageView.content;
    let totalPageCount = content.childrenCount;
    this.currentPage = (this.currentPage + 1) % totalPageCount;
    let targetPos = cc.v2(this.currentPage * this.pageView.node.width, 0);
    this.pageView.scrollToOffset(targetPos, 0.7); // Scroll to the target position in 1 second
  },

   setupLobbyInputFocusListeners() {
    if (cc.sys.isMobile && cc.sys.isBrowser) {
            // Attach focus event listeners to username and password input fields
            if (this.oldPassword) {
                this.oldPassword.node.on(cc.Node.EventType.TOUCH_END, this.onInputFieldClicked, this);
            }
            if (this.newPassword) {
                this.newPassword.node.on(cc.Node.EventType.TOUCH_END, this.onInputFieldClicked, this);
            }
            if(this.confirmPassword){
              this.confirmPassword.node.on(cc.Node.EventType.TOUCH_END, this.onInputFieldClicked, this);

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

  setupLobbyKeyboardButtonListeners: function() {
    const allKeyboardButtons = this.getAllKeyboardButtons();
        allKeyboardButtons.forEach(button => {
            button.on(cc.Node.EventType.TOUCH_END, this.onKeyboardButtonClicked, this);
        });
        if (this.deleteButton) { // Add listener for the delete button
            this.deleteButton.on(cc.Node.EventType.TOUCH_END, this.onDeleteButtonClicked, this);
        }
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

      removeFromActiveInput() {
            if (this.activeInputField && this.activeInputField.string.length > 0) {
                this.activeInputField.string = this.activeInputField.string.slice(0, -1); // Remove last character
            }
        },
      
        disableDefaultKeyboard:function() {
            if (cc.sys.isMobile && cc.sys.isBrowser) {
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.style.pointerEvents = 'none'; // Disable interactions
                });
            }
        },

        update(dt){
          if(this.moneySprite){
            this.moneySprite.angle -= this.rotationSpeed * dt
          }
          if(this.smallSpin){
            this.smallSpin.angle -= this.rotationSpeed * dt
          }
        }
       
});


