import { Configuration, OpenAIApi } from "openai-edge"
import { OpenAIStream, StreamingTextResponse } from "ai"

export const runtime = 'edge';

const configuration = new Configuration({
    apiKey: process.env.GPT_API_KEY
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
    if (req.method === 'POST') {
        const { text } = await req.json();

        const response = await openai.createChatCompletion({
            model: "gpt-4",
            stream: true,
            max_tokens: 4096, // No max tokens: super short / cut off response.
            messages: [ // GPT-4 with Vision is JUST GPT-4. So you can still talk with it like GPT-4
                // There is no "system" message (THIS MAY CHANGE)
                {
                    role: "user",
                    //@ts-ignore
                    content: text
                    
                }
            ]
        });
        const stream = OpenAIStream(response);

        return new StreamingTextResponse(stream);
    }

  }
  