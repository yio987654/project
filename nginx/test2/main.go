package main

import (
    "fmt"
    "net/http"
)

func handler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintln(w, "Hello, world! This is my 1 web server.")
}

func main() {
    http.HandleFunc("/", handler)         // 设置路由 "/"
    fmt.Println("Server running at http://localhost:8881")
    http.ListenAndServe(":8881", nil)    // 启动 HTTP 服务
}
