import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
    try {
        // 1. Fetch HTML from SPS website
        const { data } = await axios.get('https://www.sps.ce.gov.br/category/noticias/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        // 2. Load into Cheerio
        const $ = cheerio.load(data);
        const newsItems = [];

        // 3. Select news items (adjust selector based on site structure analysis)
        // Based on typical WordPress themes and visual inspection
        $('article').each((i, el) => {
            if (i >= 4) return; // Limit to 4 items

            const $el = $(el);

            // Extract data
            const title = $el.find('h2, h3').first().text().trim();
            const link = $el.find('a').first().attr('href');
            const image = $el.find('img').first().attr('src') || $el.find('.post-thumbnail img').attr('src');
            const date = $el.find('.date, .time, time').first().text().trim() || 'RECENTE';
            const desc = $el.find('.entry-content, .excerpt, p').first().text().trim().substring(0, 100) + '...';

            // Attempt to guess tag/category
            const tag = $el.find('.cat-links, .category').first().text().trim() || 'SPS Ceará';

            if (title && link) {
                newsItems.push({
                    tag,
                    title,
                    desc,
                    date,
                    // Map colors randomly or based on tag logic if possible, default to existing palette
                    color: ['emerald', 'blue', 'orange', 'purple'][i % 4],
                    image: image || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
                    link
                });
            }
        });

        // 4. Return JSON
        res.status(200).json(newsItems);

    } catch (error) {
        console.error('Error scraping SPS:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}
