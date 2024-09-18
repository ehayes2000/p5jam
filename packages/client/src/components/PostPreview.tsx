import { useEffect } from 'react'

export default function PostPreview({
  draft,
}: {
  draft: { description: string; script: string }
}) {
  const template = `
    <!DOCTYPE html>
    <html lang="en">
      <style>
        * {
          margin: 0;
          padding: 0
          box-sizing: border-box;
        }
      </style>
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js"></script>
        <meta charSet="utf-8" />
      </head>
      <body>
        <script>${draft.script}</script>
      </body>
    </html>
  `

  const blob = new Blob([template], { type: 'text/html' })
  const blobUrl = URL.createObjectURL(blob)
  useEffect(() => {
    return () => {
      URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])
  return <iframe src={blobUrl} width="360" height="360" scrolling="no"></iframe>
}
