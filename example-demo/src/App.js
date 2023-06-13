import { useState } from "react";
import llamaTokenizer from 'llama-tokenizer-js'
import './App.css';

// Stylizing tokens is mostly copied from gpt-tokenizer demo.
const pastelColors = [
  "rgba(107,64,216,.3)",
  "rgba(104,222,122,.4)",
  "rgba(244,172,54,.4)",
  "rgba(239,65,70,.4)",
  "rgba(39,181,234,.4)",
];

const monospace = `"Roboto Mono",sfmono-regular,consolas,liberation mono,menlo,courier,monospace`;

const TokenizedText = ({ tokens }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      fontFamily: monospace,
      width: "100%",
      height: "200px",
      overflowY: "auto",
      padding: "8px",
      border: "1px solid #ccc",
      backgroundColor: "#f8f8f8",
      lineHeight: "1.5",
      alignContent: "flex-start",
    }}
  >
    {tokens.map((token, index) => (
      <span
        key={index}
        style={{
          backgroundColor: pastelColors[index % pastelColors.length],
          padding: "0 0px",
          borderRadius: "3px",
          marginRight: "0px",
          marginBottom: "4px",
          display: "inline-block",
          height: "1.5em",
        }}
      >
        {
          <pre>
            {String(token)
              .replaceAll(" ", "\u00A0")
              .replaceAll("\n", "<newline>")}
          </pre>
        }
      </span>
    ))}
  </div>
);

const App = () => {
  const [inputText, setInputText] = useState(
    "Replace this text in the input field to see how 🦙 tokenization works.",
  )

  const encodedTokens = llamaTokenizer.encode(inputText);

  const decodedTokens = encodedTokens.map(token => llamaTokenizer.decode([token], false, false));

  return (
    <>
      <h1>
        Welcome to 🦙{" "}
        <a href="https://github.com/belladoreai/llama-tokenizer-js" target="_blank">
        llama-tokenizer-js 
        </a>{" "}🦙
        playground!
      </h1>
      <div className="container">
        <div className="tokenizer">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ fontFamily: monospace, width: "100%", height: "200px" }}
          />
        </div>

        <TokenizedText tokens={decodedTokens} />

        <div className="statistics">
          <div className="stat">
            <div className="stat-value">{Array.from(inputText).length}</div>
            <div className="stat-label">Characters</div>
          </div>
          <div className="stat">
            <div className="stat-value">{encodedTokens.length}</div>
            <div className="stat-label">Tokens</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "right",
          }}
        >
          <a href="https://www.npmjs.com/package/llama-tokenizer-js" target="_blank" style={{margin: "10px"}}>
            <img src="npm.png" alt="GitHub logo" width="100" />
          </a>
          <a href="https://github.com/belladoreai/llama-tokenizer-js" target="_blank">
            <img src="github.png" alt="GitHub logo" width="100" />
          </a>
        </div>
      </div>
    </>
  );
};

export default App;
