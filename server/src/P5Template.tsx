import { Html } from '@elysiajs/html'

export default function P5Template({ script }: { script: string }) {
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
        <script>{script}</script>
      </body>
    </html>
  )
}
