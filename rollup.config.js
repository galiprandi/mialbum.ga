import multiInput from 'rollup-plugin-multi-input'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'

const production = !process.env.ROLLUP_WATCH

const config = {
  input: ['src/**/*.ts'],
  output: {
    dir: production ? 'build' : 'public',
    format: 'es',
    sourcemap: true,
  },

  plugins: [
    multiInput(),
    typescript(),

    // Production mode
    production && terser(),
    production &&
      copy({
        targets: [
          {
            src: ['public/*', '!**/*.ts'],
            dest: 'build',
          },
        ],
      }),

    // Development mode

    !production &&
      serve({
        open: true,
        openPage: '/demo/index.html',
        contentBase: 'public',
        host: '0.0.0.0',
        port: 3000,
      }),

    !production && livereload(),
  ],
}

export default config
