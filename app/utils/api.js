export async function getRecommendations() {
    const res = await fetch('/api/recommendations', { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  }