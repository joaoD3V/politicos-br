import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: deputyId } = await params;
  const searchParams = request.nextUrl.searchParams;
  const itens = searchParams.get('itens') || '100';

  try {
    const apiUrl = `${API_BASE_URL}/deputados/${deputyId}/eventos?itens=${itens}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PoliticosBR/1.0'
      },
      cache: 'force-cache',
      next: { revalidate: 600 }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Proxy API error for eventos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch eventos data from Câmara API' },
      { status: 500 }
    );
  }
}
