import express, { Request, Response, Router } from 'express';
import { fetchBearData, fetchImageUrl } from '../services/wikipedia';

const router: Router = express.Router();

/**
 * GET /api/bears
 * Fetches bear data from Wikipedia API and returns it to frontend
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    console.log('Fetching bear data from Wikipedia...');
    
    const bearData = await fetchBearData();
    
    console.log(`Successfully fetched ${bearData.length} bears`);
    
    res.json({
      success: true,
      count: bearData.length,
      data: bearData,
    });
  } catch (error) {
    console.error('❌ Error fetching bear data:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bear data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /api/bears/image/:fileName
 * Fetches image URL for a specific bear image
 */
router.get('/image/:fileName', async (req: Request, res: Response) => {
  try {
    const { fileName } = req.params;
    
    console.log(`🖼️  Fetching image URL for: ${fileName}`);
    
    const imageUrl = await fetchImageUrl(fileName);
    
    res.json({
      success: true,
      imageUrl,
    });
  } catch (error) {
    console.error('❌ Error fetching image URL:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch image URL',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;
