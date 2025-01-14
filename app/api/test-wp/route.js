import { checkWordPressEndpoints } from '@/utils/wordpress';

export async function GET() {
  try {
    const routes = await checkWordPressEndpoints();
    return Response.json({ success: true, routes });
  } catch (error) {
    console.error('Error testing WordPress connection:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      response: error.response?.data
    }, { status: 500 });
  }
} 