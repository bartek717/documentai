import { chromium } from 'playwright';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { html, margins, font, fontSize } = req.body;
    const dynamicCss = `
    .editor-content {
      padding-top: ${margins.top};
      padding-bottom: ${margins.bottom};
      padding-left: ${margins.left};
      padding-right: ${margins.right};
    }
    .editor-content p {
      font-family: ${font};
      font-size: ${fontSize};
    }
    `;
    const wrappedHtml = `<div class="editor-content">${html}</div>`;
    const fullHtml = `<style>${dynamicCss}</style>${wrappedHtml}`;

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
