module.exports = () => ({
  plugins: [
    require('postcss-normalize'),
    require('precss'),
    require('postcss-extend'),
    require('postcss-inline-comment'),
    require('postcss-font-awesome'),
    require('postcss-css-reset'),
    require('postcss-grid'),
    require('postcss-cssnext')({ browsers: [ 'last 5 versions' ] }),
    require('css-mqpacker')(),
    require('postcss-vertical-rhythm')(),
    require('postcss-aspect-ratio'),
    require('postcss-quantity-queries'),
    require('postcss-color-function'),
    require('postcss-svg')({ ei: true, debug: false, paths: [ 'static/svg' ] })
  ]
})
