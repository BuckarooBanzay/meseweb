import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [nodeResolve({ browser: true }), commonjs()]
};