import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid'

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    id: uuid(),
    name: 'Alice',
    posts: {
      create: [
        {
          description: 'https://pris.ly/discord',
          published: true,
          id: uuid(),
          script: `const h = 510
      const w = 510
      const cellSize = 10
      const cy = h / cellSize
      const cx = w / cellSize

      let paused = false
      let step = false

      function setup() {
        createCanvas(w, h)
        colorMode(HSB)
        createButton('pause').mousePressed(() => {
          paused = !paused
        })
        createButton('step').mousePressed(() => {
          if (paused) step = true
        })
      }

      // returns: [weight, nodea, nodeb]
      const makeGrid = (n) =>
        Array(cy)
          .fill()
          .map(() => Array(cx).fill(n))

      const makeGridGraph = () => {
        const makeNodes = () => {
          const grid = makeGrid(0)
          const nodes = []
          let i = 0
          for (let r = 0; r < cy; r += 2) {
            for (let c = 0; c < cx; c += 2) {
              nodes.push([r, c])
              grid[r][c] = i
              i++
            }
          }
          return [nodes, grid]
        }
        const [nodes, grid] = makeNodes()

        const makeEdges = () => {
          // horizontal edges
          const edges = []
          for (let r = 0; r < cy; r += 2) {
            for (let c = 1; c < cx; c += 2) {
              edges.push([
                Math.random(),
                grid[r][c - 1],
                grid[r][c + 1],
                [r, c],
              ])
            }
          }
          for (let c = 0; c < cx; c += 2) {
            for (let r = 1; r < cy; r += 2) {
              edges.push([
                Math.random(),
                grid[r - 1][c],
                grid[r + 1][c],
                [r, c],
              ])
            }
          }
          return edges
        }
        const edges = makeEdges()
        return [nodes, edges]
      }

      const find = (parents, i) => {
        if (parents[i] !== i) {
          parents[i] = find(parents, parents[i])
        }
        return parents[i]
      }

      const union = (parents, a, b) => {
        const rootA = find(parents, a)
        const rootB = find(parents, b)
        parents[rootB] = rootA
      }

      function* kruskalPoints(pts, edges) {
        edges.sort((a, b) => a[0] - b[0])
        const parents = Array(pts.length)
          .fill(0)
          .map((_, i) => i)
        for (let [weight, a, b, e] of edges) {
          if (find(parents, a) !== find(parents, b)) {
            union(parents, a, b)
            yield [weight, a, b, e, parents]
          }
        }
      }

      const linspace = (start, stop, numElements) => {
        const step = (stop - start) / (numElements - 1)
        return Array(numElements)
          .fill()
          .map((_, index) => {
            if (index === 0) return start
            if (index === numElements - 1) return stop
            return start + step * index
          })
      }

      const colorSet = (grid, gc, r, c) => {
        const visited = makeGrid(false)
        const bigC = (g, gc, r, c) => {
          if (r >= grid.length || r < 0 || c >= grid[0].length || c < 0) return

          if (visited[r][c]) return

          visited[r][c] = true
          if (grid[r][c] === -1) return

          grid[r][c] = gc
          bigC(grid, gc, r + 1, c)
          bigC(grid, gc, r - 1, c)
          bigC(grid, gc, r, c + 1)
          bigC(grid, gc, r, c - 1)
        }
        bigC(grid, gc, r, c)
      }

      const [nodes, edges] = makeGridGraph()
      const grid = makeGrid(-1)
      const colorGroups = linspace(0, 255, nodes.length)
      const mazeGen = kruskalPoints(nodes, edges)
      let connectedEdges = 0

      function draw() {
        // step if step or not pause
        if (paused && !step) return
        background(0)
        noStroke()
        const result = mazeGen.next()
        if (result.value) {
          let [w, a, b, e, parents] = result.value
          const parent = find(parents, a)
          const [ar, ac] = nodes[a]
          const [br, bc] = nodes[b]
          const [er, ec] = e

          grid[er][ec] = colorGroups[parent]
          grid[ar][ac] = colorGroups[parent]
          grid[br][bc] = colorGroups[parent]
          colorSet(grid, colorGroups[parent], er, ec)
        }

        for (let r = 0; r < cy; ++r) {
          for (let c = 0; c < cx; ++c) {
            if (grid[r][c] !== -1) {
              fill(grid[r][c], 100, 75)
              square(r * cellSize, c * cellSize, cellSize)
            }
          }
        }
        step = false
      }`,
        },
      ],
    },
  },
]

async function main() {
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
