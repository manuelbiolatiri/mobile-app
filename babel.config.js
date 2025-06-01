module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Expo Router
      require.resolve('expo-router/babel'),
      // Reanimated plugin (if you're using reanimated)
      'react-native-reanimated/plugin',
    ],
  };
}; 