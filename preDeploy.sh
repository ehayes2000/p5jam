#!/bin/bash

set -eou pipefail

(cd packages/client && bun run build)
rm -rf packages/server/public
cp -r packages/client/dist packages/server/public
