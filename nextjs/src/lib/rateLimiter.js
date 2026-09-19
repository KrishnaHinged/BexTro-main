// Lightweight in-memory rate limiter
const rateLimitMap = new Map();

// Periodic cleanup to prevent memory bloat (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 300000);
}

export function rateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count += 1;
  }

  rateLimitMap.set(key, record);

  if (record.count > limit) {
    return {
      success: false,
      retryAfter: Math.max(1, Math.ceil((record.resetTime - now) / 1000)),
      current: record.count,
      limit,
    };
  }

  return {
    success: true,
    remaining: Math.max(0, limit - record.count),
    current: record.count,
    limit,
  };
}
