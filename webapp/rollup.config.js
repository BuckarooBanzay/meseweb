import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/index.ts',
  output: {
    sourcemap: true,
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), typescript(), terser()],
  onwarn: function(warning) {
    if ( warning.code === 'THIS_IS_UNDEFINED' ) { return; }
    console.warn( warning.message );
}
};