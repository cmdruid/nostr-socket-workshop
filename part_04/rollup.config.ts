// rollup.config.ts
import typescript  from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs    from '@rollup/plugin-commonjs'
import terser      from '@rollup/plugin-terser'

const libraryName = 'nostr_socket'

const treeshake = {
	moduleSideEffects: false,
	propertyReadSideEffects: false,
	tryCatchDeoptimization: false
}

const onwarn = (warning) => {
	console.error ('Rollup produced warnings that need to be resolved!')
	throw new Error(warning)
}

const ts_config = { 
  compilerOptions: {
    declaration    : false,
    declarationDir : null,
    declarationMap : false
  }
}

export default {
  input: './src/index.ts',
  onwarn,
  output: [
    {
      file: './dist/main.cjs',
      format: 'cjs',
      sourcemap: true
    },
    {
      file: './dist/module.mjs',
      format: 'es',
      sourcemap: true,
      minifyInternalExports: false
    },
    {
      file: './dist/bundle.min.js',
      format: 'iife',
      name: libraryName,
      plugins: [terser()],
      sourcemap: true,
      globals: {
        crypto  : 'crypto'
      }
    }
  ],
  external: [ 'websocket-polyfill' ],
  plugins: [ typescript(ts_config), nodeResolve(), commonjs() ],
  strictDeprecations: true,
  treeshake
}
