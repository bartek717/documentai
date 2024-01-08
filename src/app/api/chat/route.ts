import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = 'edge';

interface ChatMessage {
  text: string;
  sender: string; 
}

type ChatCompletionRequestMessageRole = 'user' | 'assistant' | 'system';


export async function POST(req: Request, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { extra, messages, apiKey } = await req.json() as { extra: string, messages: ChatMessage[], apiKey: string };
    try {
      const configuration = new Configuration({
        apiKey: apiKey
      });
      const openai = new OpenAIApi(configuration);
      if(extra){
        const initialMessage = {
          role: 'system' as ChatCompletionRequestMessageRole,
          content: "This is helpful context for the following conversation: \n" + extra
        };
        const formattedMessages = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant' as ChatCompletionRequestMessageRole,
          content: msg.text
        }));
        formattedMessages.unshift(initialMessage);
        const response = await openai.createChatCompletion({
          model: "gpt-4",
          stream: true,
          max_tokens: 4096,
          messages: formattedMessages
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
      }
      else{
        const initialMessage = {
          role: 'system' as ChatCompletionRequestMessageRole,
          content: ""
        };
        const formattedMessages = messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant' as ChatCompletionRequestMessageRole,
          content: msg.text
        }));
        formattedMessages.unshift(initialMessage);
        const response = await openai.createChatCompletion({
          model: "gpt-4",
          stream: true,
          max_tokens: 4096,
          messages: formattedMessages
        });
        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
      }
    }
    catch (error) {
      res.status(400).json({ error: 'Error processing your request' });
    }
  } else {
    res.status(400).json({ error: 'Method Not Allowed' });
  }
}

