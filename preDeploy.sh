#!/bin/bash

set -euo pipefail

(cd packages/client && bun run build)
rm -rf packages/server/public
cp -r packages/client/dist packages/server/public
