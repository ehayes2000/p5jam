import { Html } from '@elysiajs/html'
export function Template({ script }: { script: string }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/addons/p5.sound.min.js"></script>
        <meta charset="utf-8" />
      </head>
      <body>
        <script>${script}</script>
      </body>
    </html>
  )
}
