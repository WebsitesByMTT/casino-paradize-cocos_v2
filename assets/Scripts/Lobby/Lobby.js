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
    profileRightNode:{
      default: null,
      type: cc.Node
    },
    profileLeftNode:{
      default: null,
      type: cc.Node
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
    settingNode:{
      default: null,
      type: cc.Node
    },
    logoutNode:{
      default: null,
      type: cc.Node
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
    mobileItemPrefab: cc.Prefab,
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
  mobilePageViewParent:{
    default: null,
    type:cc.Node
  },
  mobilePageView: cc.ScrollView,
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
  },
  // indicatorNode:{
  //   default: null,
  //   type:cc.Node
  // },
  indicatorSpriteFrame: {
    default: null,
    type: cc.SpriteFrame
  },
  fullScreenButton: cc.Button,
  normalScreen: cc.SpriteFrame,
  fullScreenSprite : cc.SpriteFrame,
  starAnimationBottom: {
    default: null,
    type: cc.Node,
  },
  starAnimationTop:{
    default: null,
    type: cc.Node,
  },
  starAnimationMobileBottom: {
    default: null,
    type: cc.Node,
  },
  starAnimationMobileTop:{
    default: null,
    type: cc.Node,
  },
  nextArrowNode:{
    default: null,
    type: cc.Node
  },
  previousArrowNode: {
    default: null,
    type: cc.Node
  },
  nextArrowPostion: null,
  preiousArrowPosition: null, 
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    if (!this.category) {
      this.category = "all";
    }
  //   if (cc.sys.isMobile) {
  //     this.scaleAllNodes(this.node, 1.1); // Pass the root node and scale factor
  // }

    this.nextArrowPostion = this.nextArrowNode.getPosition();
    this.preiousArrowPosition = this.previousArrowNode.getPosition();
    this.activeInputField = null; 
    this.setupLobbyInputFocusListeners();
    this.setupLobbyKeyboardButtonListeners();
    this.disableDefaultKeyboard();
    this.initialPosition = this.scrollView.node.position.clone();
    this.initialmobilePosition = this.mobilePageViewParent.position.clone();

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

    this.getUserDetails();
    this.fetchGames(this.category);
    this.currentPage = 0;
    this.currentNext = 0;
    this.schedule(this.autoScrollPageView, this.scrollInterval);
    // this.setUpPageviewEvent();
    this.rotationSpeed = 180;
    if(cc.sys.isMobile){
      this.starScalingAnimation(this.starAnimationMobileBottom);
      this.starScalingAnimation(this.starAnimationMobileTop);
    }else{
      this.starScalingAnimation(this.starAnimationBottom);
      this.starScalingAnimation(this.starAnimationTop);
    }
    
  },

  // setUpPageviewEvent: function(){
  //   this.pageView.node.off('touchstart', this.onTouchStart, this);
  //   this.pageView.node.off('touchend', this.onTouchEnd, this);
  //   this.pageView.node.off('touchcancel', this.onTouchCancel, this);
  //           // Add new listeners
  //   this.pageView.node.on('touchstart', this.onTouchStart, this);
  //   this.pageView.node.on('touchend', this.onTouchEnd, this);
  //   this.pageView.node.on('touchcancel', this.onTouchCancel, this);
  // },
  
  /**
   * @method Fetach Games by category
   * @description HTTP request - POST data
   * @param {String} address -address of Server
   * @param {Object} data -Data/PayLoad to be sent
   * @param {method} callback -Callback to be executed if response.succss is true!
   * @param {method} error -Callback to be executed if response.success is false!
   */
  fetchGames: function (gameCategory) {
    if(this.gameCategory == "all"){
      this.allTab.getChildByName("bg").active = true;
    }
    let content = this.scrollView.content;
    content.removeAllChildren();
   
    if(cc.sys.isMobile){
      let mobileContent = this.mobilePageView.content
      mobileContent.removeAllChildren();
    }else{
      let pageViewContent = this.pageView.content;
      pageViewContent.removeAllChildren();
    }
    this.pageViewParent.active = false;
    this.mobilePageViewParent.active = false
    this.scrollView.node.setPosition(this.initialPosition);
    this.mobilePageViewParent.setPosition(this.initialmobilePosition)
    this.scrollView.node.getChildByName("view").width = 1600;
    this.scrollView.node.width = 470;
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
          if(cc.sys.isMobile){
            this.mobilePageViewParent.active = true;
          }else{
            this.pageViewParent.active = true;
          }
          this.scollItemCount = featured.length;
          this.populatePageView(featured, gameCategory);
        }
        else{
          this.pageViewParent.active = false;
        }
        if(gameCategory == "fav"){
          this.populateScrollView(otherGames, gameCategory);
        }else{
          if (otherGames.length > 0) {
            this.populateScrollView(otherGames, gameCategory);
          }
        }
       
       // this is done for testing
        
        // else{
        //   this.populateScrollView(featured, gameCategory);
        // }
        
        this.setFullScreenWidth();
    }.bind(this));
},

populatePageView: function(featuredItems, gameCategory) {
  let pageViewContent
  if(cc.sys.isMobile){
    pageViewContent = this.mobilePageView.content;
  }else{
     pageViewContent = this.pageView.content;
  }
  for (let i = 0; i < featuredItems.length; i++) {
    // console.log("pageView");
    if(featuredItems[i].status == "active"){
      // this.drawIndicator(featuredItems.length)
      if(cc.sys.isMobile){
        this.populateItems(featuredItems[i], this.mobileItemPrefab, pageViewContent, gameCategory);
      }else{
        this.populateItems(featuredItems[i], this.smallItemPrefab, pageViewContent, gameCategory);
      }
    }
  }
  this.pageView.node.on('touchend', (event) => {
    let touchEndPos = event.getLocation();
    let distance = touchEndPos.sub(this.touchStartPos).mag();
    if (distance < 10) { // Adjust this threshold as needed
      
    }});
},

drawIndicator: function(count) {
  // Assuming you have a node named 'indicatorNode' to hold the indicator sprites
  // let indicatorNode = this.node.getChildByName('Indicator');
  // this.indicatorNode.removeAllChildren(); // Clear previous indicators

  // for (let i = 0; i < count; i++) {
  //     let indicatorSprite = new cc.Node();
  //     indicatorSprite.addComponent(cc.Sprite);
  //     // Set your indicator spriteFrame here
  //     indicatorSprite.getComponent(cc.Sprite).spriteFrame = this.indicatorSpriteFrame;
  //     indicatorSprite.x = i * (indicatorSprite.width + 10); // Adjust spacing as needed
  //     indicatorNode.addChild(indicatorSprite);
  // }
},
populateScrollView: function(otherGames, gameCategory) {
  
  let scrollViewContent = this.scrollView.content;
  for (let i = 0; i < otherGames.length; i++) {
    // console.log("populateScrollView");
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
        this.fishTab.getChildByName("FishingActive"),
        this.favTab.getChildByName("FavouriteActive"),
        this.slotTab.getChildByName("SlotsActive"),
        this.kenoTab.getChildByName("KenoActive"),
        this.otherTab.getChildByName("OtherActive")
      ];
      gameTabs.forEach((tab) => (tab.active = false));
      const gameInactiveText = [
        this.fishTab.getChildByName("FishingInactiveText"),
        this.favTab.getChildByName("FavouriteInactive"),
        this.slotTab.getChildByName("SlotsInactive"),
        this.kenoTab.getChildByName("KenoInactive"),
        this.otherTab.getChildByName("OtherInactive")
      ];
      gameInactiveText.forEach((newTab)=> (newTab.active) = true);
      this.allTab.getChildByName("bg").active = true;
      this.allTab.getChildByName("AllNormalTag").active = false;
      this.allTab.getChildByName("AllActive").active = true;
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
      this.allTab.getChildByName("AllActive"),
      this.favTab.getChildByName("FavouriteActive"),
      this.slotTab.getChildByName("SlotsActive"),
      this.kenoTab.getChildByName("KenoActive"),
      this.otherTab.getChildByName("OtherActive")
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    const gameInactiveText = [
      this.allTab.getChildByName("AllNormalTag"),
      this.favTab.getChildByName("FavouriteInactive"),
      this.slotTab.getChildByName("SlotsInactive"),
      this.kenoTab.getChildByName("KenoInactive"),
      this.otherTab.getChildByName("OtherInactive")
    ];
    gameInactiveText.forEach((newTab)=> (newTab.active) = true);
    this.fishTab.getChildByName("bg").active = true;
    this.fishTab.getChildByName("FishingInactiveText").active = false;
    this.fishTab.getChildByName("FishingActive").active = true;
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
      this.allTab.getChildByName("AllActive"),
      this.fishTab.getChildByName("FishingActive"),
      this.slotTab.getChildByName("SlotsActive"),
      this.kenoTab.getChildByName("KenoActive"),
      this.otherTab.getChildByName("OtherActive")
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    const gameInactiveText = [
      this.allTab.getChildByName("AllNormalTag"),
      this.fishTab.getChildByName("FishingInactiveText"),
      this.slotTab.getChildByName("SlotsInactive"),
      this.kenoTab.getChildByName("KenoInactive"),
      this.otherTab.getChildByName("OtherInactive")
    ];
    gameInactiveText.forEach((newTab)=> (newTab.active) = true);
    this.favTab.getChildByName("bg").active = true;
    this.favTab.getChildByName("FavouriteInactive").active = false;
    this.favTab.getChildByName("FavouriteActive").active = true;
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
      this.allTab.getChildByName("AllActive"),
      this.fishTab.getChildByName("FishingActive"),
      this.favTab.getChildByName("FavouriteActive"),
      this.kenoTab.getChildByName("KenoActive"),
      this.otherTab.getChildByName("OtherActive")
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    const gameInactiveText = [
      this.allTab.getChildByName("AllNormalTag"),
      this.fishTab.getChildByName("FishingInactiveText"),
      this.favTab.getChildByName("FavouriteInactive"),
      this.kenoTab.getChildByName("KenoInactive"),
      this.otherTab.getChildByName("OtherInactive")
    ];
    gameInactiveText.forEach((newTab)=> (newTab.active) = true);
    this.slotTab.getChildByName("bg").active = true;
    this.slotTab.getChildByName("SlotsActive").active = true;
    this.slotTab.getChildByName("SlotsInactive").active = false;
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
      this.allTab.getChildByName("AllActive"),
      this.fishTab.getChildByName("FishingActive"),
      this.favTab.getChildByName("FavouriteActive"),
      this.slotTab.getChildByName("SlotsActive"),
      this.otherTab.getChildByName("OtherActive")
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    const gameInactiveText = [
      this.allTab.getChildByName("AllNormalTag"),
      this.fishTab.getChildByName("FishingInactiveText"),
      this.favTab.getChildByName("FavouriteInactive"),
      this.slotTab.getChildByName("SlotsInactive"),
      this.otherTab.getChildByName("OtherInactive")
    ];
    gameInactiveText.forEach((newTab)=> (newTab.active) = true);
    this.kenoTab.getChildByName("bg").active = true;
    this.kenoTab.getChildByName("KenoActive").active = true;
    this.kenoTab.getChildByName("KenoInactive").active = false;
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
      this.allTab.getChildByName("AllActive"),
      this.fishTab.getChildByName("FishingActive"),
      this.favTab.getChildByName("FavouriteActive"),
      this.slotTab.getChildByName("SlotsActive"),
      this.kenoTab.getChildByName("KenoActive")
    ];
    gameTabs.forEach((tab) => (tab.active = false));
    const gameInactiveText = [
      this.allTab.getChildByName("AllNormalTag"),
      this.fishTab.getChildByName("FishingInactiveText"),
      this.favTab.getChildByName("FavouriteInactive"),
      this.slotTab.getChildByName("SlotsInactive"),
      this.kenoTab.getChildByName("KenoInactive")
    ];
    gameInactiveText.forEach((newTab)=> (newTab.active) = true);
    this.otherTab.getChildByName("bg").active = true;
    this.otherTab.getChildByName("OtherActive").active = true;
    this.otherTab.getChildByName("OtherInactive").active = false;
    this.fetchGames(this.category);
  },

  // for full Screen
  zoomFullScreenClick: function () {
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) { 
      this.fullScreenButton.getComponent(cc.Sprite).spriteFrame = this.normalScreen;
      // current working methods
      this.setFullScreenWidth();
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
      this.fullScreenButton.getComponent(cc.Sprite).spriteFrame = this.fullScreenSprite;
      this.setFullScreenWidth();
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
    this.logoutNode.active = false;
    this.popupNode.active = false;
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
    if (this.oldPassword.string == "" || this.newPassword.string == "" || this.confirmPassword.string == "") {
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

  settingTabClick: function(){
    this.popupNode.active = true;
    this.settingNode.active = true;
  },

  logoutButtonClicked: function(){
    this.popupNode.active = true;
    this.logoutNode.active = true;
  },
  // close all popup
  closePopupBtn: function () {
    let inst = this
    if (this.passwordNode.active || this.profileNode.active || this.settingNode.active || this.logoutNode.active) {
      inst.oldPassword.string == " ";
      inst.newPassword.string == " ";
      inst.confirmPassword.string == " ";
      this.passwordNode.active = false;
      this.profileNode.active = false;
      this.settingNode.active = false;
      this.logoutNode.active = false;
    }
    this.popupNode.active = false;
  },

  // Save profile button Clicked
  saveProfile: function () {
    this.profileNode.active = false;
    this.popupNode.active = false;
  },

  setFullScreenWidth() {
    const screenWidth = cc.winSize.width;
    var w = window.innerWidth;
    // console.log(screenWidth, w);
    // console.log(document.body.offsetWidth);
   
    if(!document.fullscreenElement){
      if(w >= 1920){
        this.profileRightNode.setPosition(cc.v2(711, -6));
        this.profileLeftNode.setPosition(cc.v2(-760, 0))
      }else{
          this.profileRightNode.setPosition(cc.v2(600, -6));
          this.profileLeftNode.setPosition(cc.v2(-630, 0))    
      }
      if(!this.pageViewParent.active && !this.mobilePageViewParent.active){
          // this.scrollView.node.width = screenWidth;
          this.scrollView.node.getChildByName("view").width = screenWidth;
          console.log(this.scrollView.node.getChildByName("view").getChildByName("content"));
          this.scrollView.node.setPosition(cc.v2(-1000, 100));
      }else{
        // this.scrollView.node.width = 1700
        this.scrollView.node.getChildByName("view").width = 1500;
        this.scrollView.node.setPosition(cc.v2(-570, 100));
        this.pageView.node.width = 344;
        this.mobilePageView.node.width = 409;
      }
      this.nextArrowNode.setPosition(1030, 95);
      this.previousArrowNode.setPosition(-1000, 95);
     
    } else{      
      if(w >= 1920){ 
        this.profileRightNode.setPosition(cc.v2(600, -6));
        this.profileLeftNode.setPosition(cc.v2(-630, 0))
      }else{
          this.profileRightNode.setPosition(cc.v2(600, -6));
          this.profileLeftNode.setPosition(cc.v2(-630, 0))
      }
        if(!this.pageViewParent.active && !this.mobilePageViewParent.active){
          if(cc.sys.isMobile){
            // this.scrollView.node.width = screenWidth;
            this.scrollView.node.getChildByName("view").width = screenWidth;
            this.scrollView.node.setPosition(cc.v2(-1100, 100));
          }else{
            // this.scrollView.node.width = screenWidth;
            this.scrollView.node.getChildByName("view").width = screenWidth - 100;
            this.scrollView.node.setPosition(cc.v2(-900, 100));
          }
        }else{
          if(this.mobilePageViewParent.active){
          }
          this.pageView.node.width = 344;
          this.mobilePageView.node.width = 409;
          const screenWidth = cc.winSize.width - 344;
          // this.scrollView.node.width = screenWidth;
          // this.scrollView.node.getChildByName("view").width = screenWidth;
          this.scrollView.node.setPosition(cc.v2(-570, 100));
        }
        this.nextArrowNode.setPosition(this.nextArrowPostion);
        this.previousArrowNode.setPosition(this.preiousArrowPosition)
    }
   },
   // Staranimation to scale and rotate contiously
   starScalingAnimation: function(targetNode){
      targetNode.setScale(0.5);
      targetNode.setRotation(0)
      cc.tween(targetNode)
      .parallel(
        cc.tween().to(1, { scale: 2 }).to(1, { scale: 0.5 }), // Scale up and down
        cc.tween().by(2, { angle: 360 }) // Rotate continuously
      )
      .union()
      .repeatForever()
      .start()
   },

//   setFullScreenWidth() {
//     const screenWidth = cc.winSize.width;
//     const windowWidth = window.innerWidth;
//     const isFullscreen = document.fullscreenElement;
//     const isWideScreen = windowWidth >= 1920;

//     // Set profile positions based on screen width
//     const profileRightPosition = isWideScreen ? cc.v2(711, -6) : cc.v2(600, -6);
//     const profileLeftPosition = isWideScreen ? cc.v2(-730, 0) : cc.v2(-630, 0);
    
//     this.profileRightNode.setPosition(profileRightPosition);
//     this.profileLeftNode.setPosition(profileLeftPosition);

//     // Determine scrollView and view widths and positions
//     if (!this.pageViewParent.active && !this.mobilePageViewParent.active) {
//         const adjustedWidth = isFullscreen && !cc.sys.isMobile ? screenWidth : screenWidth - 200;
//         const viewWidth = adjustedWidth + 344;
//         const positionX = isFullscreen && !cc.sys.isMobile ? -1100 : -570;
        
//         this.scrollView.node.width = adjustedWidth;
//         this.scrollView.node.getChildByName("view").width = viewWidth;
//         this.scrollView.node.setPosition(cc.v2(positionX, 100));
//     } else {
//         const pageWidth = 344;
//         const mobilePageWidth = 409;
//         const adjustedWidth = screenWidth - pageWidth;
        
//         this.pageView.node.width = pageWidth;
//         this.mobilePageView.node.width = mobilePageWidth;
//         this.scrollView.node.width = adjustedWidth;
//         this.scrollView.node.getChildByName("view").width = adjustedWidth;
//         this.scrollView.node.setPosition(cc.v2(-570, 100));
//     }
// },

   nextArrowClick: function(){
    let inst = this
    let content, targetPos
    content = this.scrollView.content;
    let totalPageCount = content.childrenCount;
    this.currentNext = (this.currentNext + 1) % totalPageCount;
    console.log(this.currentNext, "currentNext", this.scrollView.node.width);
    targetPos = cc.v2(this.currentNext * this.scrollView.node.width, 0);
    console.log(targetPos, "targetPostargetPostargetPos");
    if(targetPos >= 2000){
      return
    }
    inst.scrollView.scrollToOffset(targetPos, 0.7)
   },
   previousArrowClick: function(){
    let inst = this
    let content, targetPos
    content = this.scrollView.content;
    let totalPageCount = content.childrenCount;
    console.log('totalPageCount0', totalPageCount);
    this.currentNext = (this.currentNext - 1) % totalPageCount;
    console.log(this.currentNext, "currentNext", this.scrollView.node.width);
    targetPos = cc.v2(this.currentNext * this.scrollView.node.width, 0);
    inst.scrollView.scrollToOffset(targetPos, 0.7)
   },

   // Auto Scroll 
   autoScrollPageView() {
    let content, targetPos;
    if(cc.sys.isMobile){
      content = this.mobilePageView.content
    }else{
      content = this.pageView.content
    }
    let totalPageCount = content.childrenCount;
    this.currentPage = (this.currentPage + 1) % totalPageCount;
    if(cc.sys.isMobile){
      targetPos = cc.v2(this.currentPage * this.mobilePageView.node.width, 0);
      this.mobilePageView.scrollToOffset(targetPos, 0.7); // Scroll to the target position in 1 second
    }else{
       targetPos = cc.v2(this.currentPage * this.pageView.node.width, 0);
      this.pageView.scrollToOffset(targetPos, 0.7); // Scroll to the target position in 1 second
    }
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
        },
});
