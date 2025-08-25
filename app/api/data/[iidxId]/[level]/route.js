export async function GET(request, { params }) {
  try {
    const { iidxId, level } = await params;
    
    const response = await fetch(`https://scoredp.duckdns.org/api/${iidxId}/${level}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    
    const data = await response.json();
    
    return Response.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}