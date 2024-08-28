bun add -D daisyui@latest
rm tailwind.config.js
touch tailwind.config.js
cat << EOF > tailwind.config.js
/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}
EOF