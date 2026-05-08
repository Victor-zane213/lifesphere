# 阶段1：构建前端
FROM node:23-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm config set registry https://registry.npmmirror.com && npm install
COPY frontend/ ./
RUN npm run build

# 阶段2：构建后端
FROM golang:1.26-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/go.mod backend/go.sum ./
RUN go env -w GOPROXY=https://goproxy.cn,direct && go mod download
COPY backend/ ./
RUN CGO_ENABLED=0 go build -o lifesphere-server .

# 阶段3：运行
FROM alpine:3.19
RUN apk --no-cache add ca-certificates tzdata
WORKDIR /app
COPY --from=backend-builder /app/backend/lifesphere-server .
COPY --from=frontend-builder /app/frontend/dist ./public
EXPOSE 8080
ENV GIN_MODE=release
ENV PORT=8080
ENV DB_PATH=/data/lifesphere.db
CMD ["./lifesphere-server"]
