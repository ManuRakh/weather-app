FROM public.ecr.aws/docker/library/node:18-slim AS BUILD_IMAGE

ARG BUILD_BRANCH=stage
ENV BUILD_BRANCH=$BUILD_BRANCH
ARG NPM_READ_PACKAGE_TOKEN=token
ENV NPM_READ_PACKAGE_TOKEN=$NPM_READ_PACKAGE_TOKEN
ARG SERVICE_NAME=orders
ENV SERVICE_NAME=$SERVICE_NAME

WORKDIR /app

COPY src src/
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY nest-cli.json nest-cli.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
COPY .npmrc.template .npmrc.template

SHELL ["/bin/bash", "-c"]
RUN . .npmrc.template
RUN npm install
RUN npm run build
RUN npm prune --production
RUN rm .npmrc
RUN cp -p node_modules/newrelic/newrelic.js newrelic.js

FROM public.ecr.aws/docker/library/node:18-alpine
WORKDIR /app
COPY --from=BUILD_IMAGE /app ./

CMD ["npm", "run", "start:prod"]
