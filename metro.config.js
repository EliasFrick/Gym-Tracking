/* require("ts-node/register");
module.exports = require("./metro.config.ts"); */

const { getDefaultConfig } = require("expo/metro-config");
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
  "@tamagui/web": require.resolve("./emptyModule.js"),
};

module.exports = defaultConfig;
