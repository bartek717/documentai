import puppeteer from 'puppeteer';
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { html, documentName } = await req.json();

    // Adjust the path to the location of your CSS file
    const cssPath = path.resolve(process.cwd(), 'src/app/components/editor.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    console.log(css)
    console.log(html)
    const fullHtml = `<style>${css}</style>${html}`;
    // Continue with Puppeteer to generate PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Sanitize documentName to prevent security issues
    const safeDocumentName = sanitizeFilename(documentName);

    // Create a response with the PDF buffer
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    // response.headers.set('Content-Disposition', `attachment; filename="${safeDocumentName}.pdf"`);
    return response;
  } else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
}

function sanitizeFilename(name: String) {
    // Ensure that name is a string
    if (typeof name !== 'string') {
      // Handle non-string inputs here. You might return a default name or convert it to a string.
      console.log("not a string")
      return 'default_document_name';
    }
  
    // Now safely use the replace function
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
