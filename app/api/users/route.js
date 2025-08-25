export async function GET() {
  try {
    const response = await fetch('https://scoredp.duckdns.org/api/users');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}