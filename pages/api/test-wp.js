import { checkWordPressEndpoints } from '@/utils/wordpress';

export default async function handler(req, res) {
  try {
    const routes = await checkWordPressEndpoints();
    res.status(200).json({ success: true, routes });
  } catch (error) {
    console.error('Error testing WordPress connection:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      response: error.response?.data
    });
  }
} 