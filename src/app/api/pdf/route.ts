import puppeteer from 'puppeteer';
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

export async function POST(req: Request) {
  if (req.method === 'POST') {
    const { html, margins, font, fontSize } = await req.json();
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
    const fullHtml = `<style>${dynamicCss}</style>${wrappedHtml}`
    const browser = await chromium.launch({headless: true});
    const page = await browser.newPage();
    await page.setContent(fullHtml, { waitUntil: 'networkidle' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();
    const response = new NextResponse(pdfBuffer);
    response.headers.set('Content-Type', 'application/pdf');
    return response;
  } else {
    return new NextResponse('Method Not Allowed', { status: 405 });
  }
}