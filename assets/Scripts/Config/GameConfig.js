/**
 * @namespace Configs
 */

/**
 * @class GameConfig
 * @memberof Configs
 */

/** 
 * @alias window
 * @name root
 * @memberof Configs.GameConfig#
 */
var root = window;

root.K = {};

root.K.internetAvailable = true;
/**
 * @enum {Number} Represents possible errors in the game
 * @name Error
 * @memberof Configs.GameConfig#
 */
root.K.Error = cc.Enum({
    CredentialsError: 401,
    SuccessFalseError: 404,
});


root.K.WS = false;

root.K.DeveloperMode = true;

root.K.ServerAddress = {
    ////// IP and URLS update as per requirements
    ipAddress: "https://dev.casinoparadize.com", // OTL
};

/**
 * @description Server APIs
 * @name ServerAPI
 * @memberof Configs.GameConfig#
 */
root.K.ServerAPI = {
    login: "/api/users/login",
    game: "/api/games?platform=casinoParadise&category",
    addtoFav: "/api/games/favourite",
    password: "/api/users",
    userDetails: "/api/users",
    getGameById: "/api/games"
};

/**
 * @description Represents sound effects played on user related events
 * @name Sounds
 * @memberof Configs.GameConfig#
 */
root.K.Sounds = {
};



// /**
//  * @description Data that maybe stored on a system
//  * @name SystemStorageKeys
//  * @memberof Configs.GameConfig#
//  */
// root.K.SystemStorageKeys = {
//     userId: "userId",
//     password: "password",
//     rememberMePreference: "rememberMePreference",
// };
module.exports = {
    K: K,
}