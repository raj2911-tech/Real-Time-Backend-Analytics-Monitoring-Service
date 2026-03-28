import axios from "axios";

function analyticsMiddleware(config = {}) {
  const { apiKey } = config;

  return function (req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
      // Do not affect main request lifecycle
      if (!apiKey) return;

      const payload = {
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        responseTime: Date.now() - start,
        timestamp: new Date().toISOString()
      };

      void axios
        .post("http://localhost:7000/api/analytics", payload, {
          headers: { "x-api-key": apiKey },
          timeout: 1500 // prevent long-hanging analytics calls
        })
        .catch(() => {
          console.log("Analytics send failed");
        });
    });

    next();
  };
}

export default analyticsMiddleware;