const rateLimit = (options) => {
    const tokenCache = new Map();
    const { interval, uniqueTokenPerInterval = 500 } = options;
  
    return {
      check: (limit, token) =>
        new Promise((resolve, reject) => {
          const tokenCount = tokenCache.get(token) || [0];
          if (tokenCount[0] === 0) {
            tokenCache.set(token, [1, Date.now()]);
            return resolve();
          }
          if (tokenCount[0] < limit) {
            tokenCount[0] += 1;
            tokenCache.set(token, tokenCount);
            return resolve();
          }
          const currentTime = Date.now();
          const timeDiff = currentTime - tokenCount[1];
          if (timeDiff < interval) {
            return reject(new Error('Rate limit exceeded'));
          }
          tokenCount[0] = 1;
          tokenCount[1] = currentTime;
          tokenCache.set(token, tokenCount);
          return resolve();
        }),
    };
  };
  
  export { rateLimit };