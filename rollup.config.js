import path from 'path';
import { name } from './package.json';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';
import merge from 'webpack-merge';
import commonjs from 'rollup-plugin-commonjs';
import externalDeps from 'rollup-plugin-peer-deps-external';

const external = ['react'];

const globals = {
  react: 'React'
};

const config = {
  input: './hooks/index.js',
  output: {
    name: 'f4yeHooks',
    file: path.resolve(__dirname, `dist/${name}.js`),
    format: 'umd',
    globals
  },
  external,
  plugins: [
    commonjs({
      include: 'node_modules/**'
    }),
    resolve(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**'
    }),
    externalDeps()
  ]
};

const packages = [
  {},
  {
    output: {
      file: path.resolve(__dirname, `dist/${name}.min.js`),
      format: 'umd'
    },
    plugins: [
      terser({
        output: { comments: false },
        compress: {
          drop_console: true
        }
      })
    ]
  },
  {
    output: {
      file: path.resolve(__dirname, `dist/${name}.es.js`),
      format: 'es'
    }
  },
  {
    output: {
      file: path.resolve(__dirname, `dist/${name}.cjs.js`),
      format: 'cjs'
    }
  }
];

let result = [];
for (let item of packages) {
  result.push(merge(config, item));
}

export default result;
