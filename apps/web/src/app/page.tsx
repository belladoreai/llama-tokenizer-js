"use client"
import { useState } from "react";
import { LlamaTokenizer } from "@repo/llama-tokenizer";
import Image from "next/image";

// Stylizing tokens is mostly copied from gpt-tokenizer demo.
const pastelColors=[
  "rgba(107,64,216,.3)",
  "rgba(104,222,122,.4)",
  "rgba(244,172,54,.4)",
  "rgba(239,65,70,.4)",
  "rgba(39,181,234,.4)",
];

const tokenizer=new LlamaTokenizer();

export default function Page() {
  const [inputText, setInputText]=useState(
    "Replace this text in the input field to see how 🦙 tokenization works."
  );

  const encodedTokens=tokenizer.encode(inputText);

  const decodedTokens=encodedTokens.map((token) => {
    const chars=tokenizer.decode([token], false, false);
    if (token===0) return "<unk>";
    if (token===1) return "<s>";
    if (token===2) return "</s>";
    if (token>=3&&token<=258) return tokenizer.vocabById[token];
    return chars;
  });

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Welcome to 🦙 {" "}
        <a
          href="https://github.com/belladoreai/llama-tokenizer-js"
          target="_blank"
          className="text-blue-500 underline"
        >
          llama-tokenizer-js
        </a>{" "}
        🦙  playground!
      </h1>
      <div className="bg-white rounded-lg border shadow-lg p-4">
        <div className="mb-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-48 border p-4"
          />
        </div>

        <div className="flex leading-6 content-start flex-wrap font-mono w-full h-48 overflow-y-scroll p-4 border bg-secondary">
          {decodedTokens.map((token, index) => (
            <span
              key={index}
              className={`py-0 mb-1 rounded-sm`}
              style={{ backgroundColor: pastelColors[index%pastelColors.length] }}
            >
              <pre>{String(token).replaceAll(" ", "\u00A0")}</pre>
            </span>
          ))}
        </div>

        <div className="flex mt-4 gap-4 w-full max-w-md justify-between">
          <div className="flex-col items-center justify-center rounded-md text-center border p-4 w-full">
            <p className="text-2xl font-bold">
              {Array.from(inputText).length}
            </p>
            <p className="text-primary">Characters</p>
          </div>
          <div className="flex-col items-center justify-center rounded-md text-center border p-4 w-full">
            <p className="text-2xl font-bold">
              {encodedTokens.length}
            </p>
            <p className="text-primary">Tokens</p>
          </div>
        </div>

        <div className="flex justify-end mt-8 gap-2 items-center">
          <a href="https://www.npmjs.com/package/llama-tokenizer-js" target="_blank">
            <Image src="/llama-tokenizer-js/npm.png" alt="npm logo" width={100} height={40} />
          </a>
          <a href="https://github.com/belladoreai/llama-tokenizer-js" target="_blank">
            <Image src="/llama-tokenizer-js/github.png" alt="GitHub logo" width={100} height={40} />
          </a>
        </div>
      </div>
    </div>
  );
};
