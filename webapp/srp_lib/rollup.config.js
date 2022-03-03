import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'index.js',
  output: {
    sourcemap: true,
    file: 'srp.bundle.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve({ browser: true }),
    commonjs()
  ]
};

