module.exports = {
  entry: './src/app.js',
  output: {
    path: './public/scripts',
    filename: 'app.bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },
};
