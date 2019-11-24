module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3
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
