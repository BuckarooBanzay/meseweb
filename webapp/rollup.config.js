import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import esbuild from 'rollup-plugin-esbuild';


export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    esbuild({
      minify: true
    })
  ],
  onwarn: function(warning) {
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    console.warn( warning.message );
  }
};