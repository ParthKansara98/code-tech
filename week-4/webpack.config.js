const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production', // Use production mode to avoid eval wrapping
  entry: {
    popup: './src/popup/popup.js',
    dashboard: './src/dashboard/dashboard.js',
    options: './src/options/options.js',
    background: './src/background/background.js',
    content: './src/content/content.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/[name].js',
    clean: true,
    // Ensure clean output for service workers
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  devtool: false, // Disable source maps for cleaner service worker output
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/icons', to: 'icons' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup/popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: './src/dashboard/dashboard.html',
      filename: 'dashboard/dashboard.html',
      chunks: ['dashboard']
    }),
    new HtmlWebpackPlugin({
      template: './src/options/options.html',
      filename: 'options/options.html',
      chunks: ['options']    })
  ],  optimization: {
    // Disable code splitting for cleaner service worker output
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: false
      }
    },
    // Minimize for production
    minimize: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
