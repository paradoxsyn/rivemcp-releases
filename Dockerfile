# Runs the Polymation MCP server over stdio, as published on npm.
#
# The npm package is a thin launcher: its install step downloads the standalone binary for this
# platform from this repository's release with the matching tag. No licence key is needed to start
# the server or to list and describe its tools; writing finished files uses the trial allowance or a
# key in POLYMATION_LICENSE_KEY.
FROM node:22-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/*
ARG POLYMATION_VERSION=1.14.2
RUN npm install -g rivemcp@${POLYMATION_VERSION}
ENTRYPOINT ["rivemcp"]
