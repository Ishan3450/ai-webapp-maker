import { Content, GoogleGenerativeAI } from "@google/generative-ai";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  BUILD_BACKEND_PROFESSIONALLY,
  MAKE_WEBSITE_BEAUTIFUL,
  getSystemPrompt,
} from "./prompts";
import { reactBasePrompt } from "./defaults/react";
import { nodeBasePrompt } from "./defaults/node";

dotenv.config();
const app: Express = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.use(cors());
app.use(express.json());

app.post("/template", async (req: Request, res: Response) => {
  const prompt: string = req.body.prompt;

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    systemInstruction:
      "Select the most suitable framework for this project: Node.js or React.js. Return only a single word: 'node' or 'react'. No additional output.",
  });

  const type: string = result.response.text();

  if (type.indexOf("react") !== -1) {
    res.status(200).json({
      // only here passing the MAKE_WEBSITE_BEAUTIFUL because this prompt is made for frontend only
      promptForLLM: [
        MAKE_WEBSITE_BEAUTIFUL,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompt: [reactBasePrompt],
    });
    return;
  }

  if (type.indexOf("node") !== -1) {
    res.status(200).json({
      promptForLLM: [
        BUILD_BACKEND_PROFESSIONALLY,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompt: [nodeBasePrompt],
    });
    return;
  }

  res.status(403).json({ message: "You cant access this" });
});

app.post("/chat", async (req: Request, res: Response) => {
  /* 
   * The message body will contain array 3 elements: first 2 is the messages returned from the template endpoint and the third one is the prompt by the user and the role will be user in all 3

   * Structure:
    {
      "messages": [
        {
          "role": "user",
          "parts": [msg1, msg2, msg3]
        }
      ]
    }
   */
  const messages: Content[] = req.body.messages;

  const result = await model.generateContent({
    contents: messages,
    systemInstruction: getSystemPrompt(),
  });

  const response = result.response.text();

  res.status(200).json({
    response,
  });
});

app.listen(3000, () => {
  console.log("Server started");
});
