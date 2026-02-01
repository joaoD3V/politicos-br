import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://dadosabertos.camara.leg.br/api/v2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Extrai parâmetros da query
  const params = new URLSearchParams();
  searchParams.forEach((value, key) => {
    params.append(key, value);
  });

  try {
    const apiUrl = `${API_BASE_URL}/deputados?${params.toString()}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'PoliticosBR/1.0'
      },
      cache: 'force-cache',
      next: { revalidate: 300 } // 5 minutos
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Proxy API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Câmara API' },
      { status: 500 }
    );
  }
}