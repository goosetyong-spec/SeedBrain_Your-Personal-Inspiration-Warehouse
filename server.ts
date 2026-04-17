import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to fetch content from URL (to avoid CORS)
  app.post("/api/fetch-content", async (req, res) => {
    const { input } = req.body;
    
    try {
      // Extract URL
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const extractedUrl = input.match(urlRegex)?.[0];
      
      if (!extractedUrl) {
        return res.json({ content: input, url: null });
      }

      console.log(`Fetching content from: ${extractedUrl}`);
      try {
        const response = await fetch(extractedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        const html = await response.text();
        const $ = cheerio.load(html);
        
        // Remove script and style tags
        $('script, style').remove();
        
        // Get text content
        const pageTitle = $('title').text();
        const metaDescription = $('meta[name="description"]').attr('content') || '';
        const bodyText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 3000);
        
        // Extract Open Graph Image (Cover Image)
        const ogImage = $('meta[property="og:image"]').attr('content') || 
                        $('meta[name="twitter:image"]').attr('content') || 
                        $('link[rel="image_src"]').attr('href') ||
                        null;
        
        const content = `
          URL: ${extractedUrl}
          Page Title: ${pageTitle}
          Description: ${metaDescription}
          Content: ${bodyText}
          Original Input: ${input}
        `;
        
        res.json({ content, url: extractedUrl, coverImage: ogImage });
      } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        res.json({ content: input, url: extractedUrl });
      }
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
