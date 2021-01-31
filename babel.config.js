module.exports = function (api) {
  return api.env('test')
    ? {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current'
              }
            },
            "@babel/preset-react"
          ]
        ]
      }
    : {
        presets: [
          [
            '@babel/preset-env',
            {
              modules: false,
              useBuiltIns: 'usage',
              corejs: '2'
            },
            "@babel/preset-react"
          ]
        ],
        ignore: ['./node/*.js']
      };
};
