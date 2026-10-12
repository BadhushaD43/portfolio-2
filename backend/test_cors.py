import asyncio
from app.main import app

async def asgi_request(app, method: str, path: str, headers: dict):
    scope = {
        "type": "http",
        "asgi": {"version": "3.0"},
        "http_version": "1.1",
        "method": method,
        "path": path,
        "raw_path": path.encode("latin1"),
        "query_string": b"",
        "headers": [(k.lower().encode("latin1"), v.encode("latin1")) for k, v in headers.items()],
        "client": ("127.0.0.1", 12345),
        "server": ("127.0.0.1", 8000),
        "scheme": "http",
    }
    res_status = None
    res_headers = {}

    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}

    async def send(message):
        nonlocal res_status
        if message["type"] == "http.response.start":
            res_status = message["status"]
            for k, v in message.get("headers", []):
                res_headers[k.decode("latin1").lower()] = v.decode("latin1")

    await app(scope, receive, send)
    return res_status, res_headers


async def run_tests():
    # 1. Test GET request with Origin https://badhusha-portfolio.vercel.app
    status, headers = await asgi_request(app, "GET", "/api/health", {
        "Origin": "https://badhusha-portfolio.vercel.app"
    })
    assert status == 200, f"Expected 200, got {status}"
    assert headers.get("access-control-allow-origin") == "https://badhusha-portfolio.vercel.app", (
        f"Missing or mismatched CORS origin header: {headers.get('access-control-allow-origin')}"
    )
    assert headers.get("access-control-allow-credentials") == "true", (
        "Missing Access-Control-Allow-Credentials"
    )
    print("PASS: GET /api/health with production origin returned Access-Control-Allow-Origin: https://badhusha-portfolio.vercel.app")

    # 2. Test OPTIONS Preflight request with Origin https://badhusha-portfolio.vercel.app
    status, headers = await asgi_request(app, "OPTIONS", "/api/projects", {
        "Origin": "https://badhusha-portfolio.vercel.app",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "authorization,content-type",
    })
    assert status == 200, f"Expected 200, got {status}"
    assert headers.get("access-control-allow-origin") == "https://badhusha-portfolio.vercel.app", (
        f"Missing or mismatched preflight CORS origin header: {headers.get('access-control-allow-origin')}"
    )
    print("PASS: OPTIONS /api/projects preflight returned Access-Control-Allow-Origin: https://badhusha-portfolio.vercel.app")

    # 3. Test Localhost Development Origin
    status, headers = await asgi_request(app, "GET", "/api/health", {
        "Origin": "http://localhost:5173"
    })
    assert status == 200, f"Expected 200, got {status}"
    assert headers.get("access-control-allow-origin") == "http://localhost:5173", (
        f"Missing or mismatched localhost CORS origin header: {headers.get('access-control-allow-origin')}"
    )
    print("PASS: GET /api/health with local dev origin returned Access-Control-Allow-Origin: http://localhost:5173")


if __name__ == "__main__":
    asyncio.run(run_tests())
