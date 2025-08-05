const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Ensure resolver can find TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

// Add support for additional file extensions
config.resolver.assetExts.push(
  // Video formats
  'mp4',
  'mov',
  'avi',
  'mkv',
  'webm',
  // Audio formats
  'mp3',
  'wav',
  'aac',
  'm4a',
  'ogg',
  'flac'
);

// Ensure proper handling of source maps in production
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

module.exports = config;
