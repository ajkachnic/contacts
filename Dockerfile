# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM docker.io/oven/bun:1 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# run build
ENV NODE_ENV=production
RUN bun run build

# copy static files to nginx
FROM base AS release
FROM docker.io/nginx:1.27-alpine


COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=prerelease /usr/src/app/dist /var/www/html/

EXPOSE 3000

ENTRYPOINT ["nginx","-g","daemon off;"]