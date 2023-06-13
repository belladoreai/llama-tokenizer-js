# 🦙 llama-tokenizer-js 🦙

The first JavaScript tokenizer for LLaMA which works client-side in the browser (and also in Node).

Intended use case is calculating token count accurately on the client-side.

<a href="https://belladoreai.github.io/llama-tokenizer-js/example-demo/build/">Click here for example-demo</a>

Features:
- Easy to use: 0 dependencies, code and data baked into a single file.
- Compatible with most LLaMA-based models (see [Compatibility](#compatibility))
- Optimized running time: tokenize a sentence in roughly 1ms, or 2000 tokens in roughly 20ms.
- Optimized bundle size: 670KiB before minification and gzipping (the heaviest part of the tokenizer, merge data, has been compressed into a simple and efficient binary format, and then base64-encoded to bake it into the .js file)

## Import

Option 1: Install as an npm package and import as ES6 module

```
npm install llama-tokenizer-js
```

```
import llamaTokenizer from 'llama-tokenizer-js'

console.log(llamaTokenizer.encode("Hello world!").length)
```

Option 2: Load as ES6 module with `<script>` tags in your HTML

```
<script type="module" src="https://belladoreai.github.io/llama-tokenizer-js/llama-tokenizer.js"></script>
```

## Usage

Once you have the module imported, you can encode or decode with it. Training is not supported.

When used in browser, llama-tokenizer-js pollutes global namespace with `llamaTokenizer`.

Encode:

```
llamaTokenizer.encode("Hello world!")
> [1, 15043, 3186, 29991]
```

Decode:

```
llamaTokenizer.decode([1, 15043, 3186, 29991])
> 'Hello world!'
```

## Tests

You can run tests with:

```
llamaTokenizer.runTests()
```

The test suite is small, but it covers different edge cases very well.

Note that tests can be run both in browser and in Node (this is necessary because some parts of the code work differently in different environments).

## Comparison to alternatives

As mentioned, llama-tokenizer-js is the first JavaScript tokenizer for LLaMA which works client-side in the browser. You might be wondering, what are people currently using to count tokens in web applications?

- Many web applications currently use client-side JavaScript libraries for other, _incompatible_ tokenizers. In particular, OpenAI's tokenizers are popular (see [tiktoken](https://www.npmjs.com/package/@dqbd/tiktoken) and [gpt-tokenizer](https://www.npmjs.com/package/gpt-tokenizer)). It's not entirely clear to me why people using LLaMA would want to count tokens with an OpenAI tokenizer that is not compatible with LLaMA. I guess people are assuming that there's not much difference between tokenizers? However, in my own testing I discovered that the token counts will commonly differ by as much as 20% between these tokenizers. So you can get a _very rough_ approximation of LLaMA token count by using an OpenAI tokenizer.
- Some web applications make network calls to Python applications that run the Huggingface transformers tokenizer. For example, the oobabooga-text-webui exposes an API endpoint for token count. The drawback of this approach is latency: although the Python tokenizer itself is very fast, oobabooga adds a lot of overhead. In my testing, making a network call to locally running oobabooga to count tokens for short Strings of text took roughly 300ms (compared to ~1ms when counting tokens client-side with llama-tokenizer-js). The latency will be even higher when a real web client is making requests over the internet. The latency issue is even worse if an application needs to iteratively trim down a prompt to get it to fit within a context limit, requiring multiple network calls.

## Compatibility

The tokenizer is the same for all LLaMA models which have been trained on top of the checkpoints (model weights) leaked by Facebook in early 2023.

Examples of compatible models:
- wizard-vicuna-13b-uncensored-gptq
- manticore-7b-ggml

Incompatible models are those which have been trained from scratch, not on top of the checkpoints leaked by Facebook. For example, [OpenLLaMA](https://github.com/openlm-research/open_llama) models are incompatible. I'd be happy to adapt this to any LLaMA models that people need, just open an issue for it.

## Credit

You are free to use llama-tokenizer-js for basically whatever you want (MIT license).

You are not required to give anything in exchange, but I kindly ask that you give back by linking to [https://belladore.ai/tools](https://belladore.ai/tools) in an appropriate place in your website. For example, you might link with the text "Using llama-tokenizer-js by belladore.ai" or something similar.