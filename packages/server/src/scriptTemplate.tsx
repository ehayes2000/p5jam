import { Html } from '@elysiajs/html'

export default function ScriptTemplate({
  script,
}: {
  script: string
}): JSX.Element {
  const sizington = `
    var WINDOW_WIDTH = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var WINDOW_HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  `

  return (
    <html lang="en">
      <style>
        {`
        * { 
          margin: 0;
          padding: 0
          box-sizing: border-box;
        }
          `}
      </style>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js"></script>
        {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/addons/p5.sound.min.js"></script> */}
        <meta charset="utf-8" />
      </head>
      <body>
        <script> {sizington}</script>
        <script>{script}</script>
      </body>
    </html>
  )
}
