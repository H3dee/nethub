FROM alpine
WORKDIR /frontend
COPY . ./
RUN apk add nodejs npm 
RUN npm i --silent
RUN npm i -g --silent serve
RUN npm run build
ENTRYPOINT serve -s build

