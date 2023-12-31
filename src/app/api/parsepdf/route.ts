import { NextRequest } from 'next/server';
import PDFParser from 'pdf2json';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const uploadedFiles = formData.getAll("pdf");
  let parsedText = '';

  if (uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[0];


    
  }

  // Return the parsed text
  console.log('end')
  console.log(parsedText)   
  console.log(typeof(parsedText))
  console.log(parsedText.length)
  return new Response(parsedText);
}

