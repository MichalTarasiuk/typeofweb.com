const withTM = require('next-transpile-modules')([
  'unified',
  'unist-util-visit',
  'unist-util-map',
  'bail',
  'is-plain-obj',
  'trough',
]);
const { withPlaiceholder } = require('@plaiceholder/next');

const withBundleAnalyzer = (
  ({ enabled = true } = {}) =>
  (nextConfig = {}) => {
    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        if (enabled && !options.isServer) {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          config.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              reportFilename: './analyze/client.html',
              excludeAssets: /polyfills-.*\.js/,
              defaultSizes: 'gzip',
            }),
          );
        }

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options);
        }
        return config;
      },
    });
  }
)({
  enabled: process.env.ANALYZE === 'true',
});

/**
 * @type import('next/dist/server/config-shared').NextConfig
 */
const config = withBundleAnalyzer(
  withPlaiceholder(
    withTM({
      webpack(config, { isServer }) {
        config.module.rules.push({
          test: /\.svg$/,
          issuer: /\.(js|ts)x?$/,
          use: ['@svgr/webpack'],
        });

        return config;
      },
    }),
  ),
);

config.images = {
  domains: ['typeofweb.com', 'secure.gravatar.com'],
  deviceSizes: [320, 375, 640, 750, 768, 1024, 1280, 1920],
  imageSizes: [320, 640, 768, 1200, 1536],
};

config.excludeDefaultMomentLocales = true;
config.experimental = config.experimental || {};
config.optimizeFonts = true;
// config.experimental.optimizeCss = true;
config.experimental.optimizeImages = true;
config.experimental.workerThreads = true;
config.experimental.scrollRestoration = true;
config.reactStrictMode = true;
config.compress = true;

config.rewrites = () => {
  return Promise.resolve([
    { source: '/feed', destination: '/feed.xml' },
    { source: '/config.yml', destination: '/api/admin-config.yml' },
  ]);
};

module.exports = config;
