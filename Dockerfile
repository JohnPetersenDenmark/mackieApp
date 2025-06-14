# Stage 1: Build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

# Accept build arg
#ARG REACT_APP_API_BASE_URL

# Inject it during build
# RUN REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL npm run build
RUN npm run build

# Stage 2: Serve app with Nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
