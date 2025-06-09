
import { openai } from '@ai-sdk/openai';
import { streamText, generateText, type UIMessage, type Message } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json() as { messages: Message[] }


  const result = streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}


// import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
// import { type NextRequest } from "next/server";

// import { env } from "~/env";
// import { appRouter } from "~/server/api/root";
// import { createTRPCContext } from "~/server/api/trpc";

// /**
//  * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
//  * handling a HTTP request (e.g. when you make requests from Client Components).
//  */
// const createContext = async (req: NextRequest) => {
//   return createTRPCContext({
//     headers: req.headers,
//   });
// };

// const handler = (req: NextRequest) =>
//   fetchRequestHandler({
//     endpoint: "/api/trpc",
//     req,
//     router: appRouter,
//     createContext: () => createContext(req),
//     onError:
//       env.NODE_ENV === "development"
//         ? ({ path, error }) => {
//             console.error(
//               `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
//             );
//           }
//         : undefined,
//   });

// export { handler as GET, handler as POST };
