module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        corejs: 3,
        useBuiltIns: 'usage'
      }
    ],
    'react-app'
  ],
  plugins: [
    'react-hot-loader/babel',
    'transform-class-properties',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: process.env.BABEL_ENV === 'production' ? true : 'css'
      }
    ]
  ]
};
