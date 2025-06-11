package main

import (
    "net/http"
    "net/http/httputil"
    "net/url"
)

func main() {
    target, _ := url.Parse("http://example.com")
    proxy := httputil.NewSingleHostReverseProxy(target)

    http.ListenAndServe(":8000", proxy)
}
