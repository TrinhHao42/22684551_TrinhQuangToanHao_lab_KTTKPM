FROM golang:1.22

WORKDIR /app

COPY . .

RUN go mod init myapp

RUN go build -o app

EXPOSE 8080

CMD ["./app"]