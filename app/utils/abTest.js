export function getABTestVersion(userId) {
    // Use the user ID to consistently assign a version
    return userId.charCodeAt(0) % 2 === 0 ? 'A' : 'B';
  }