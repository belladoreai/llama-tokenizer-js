# 🦙 llama-tokenizer-js 🦙

JavaScript tokenizer for LLaMA which works client-side in the browser (and also in Node).

Intended use case is calculating token count accurately on the client-side.

<a href="https://belladoreai.github.io/llama-tokenizer-js/example-demo/build/">Click here for demo</a>

Developed by [belladore.ai](https://belladore.ai)

## Features

- Easy to use: 0 dependencies, code and data baked into a [single file](llama-tokenizer.js).
- Compatible with most LLaMA models (see [Compatibility](#compatibility))
- Optimized running time: tokenize a sentence in roughly 1ms, or 2000 tokens in roughly 20ms.
- Optimized bundle size: 670KiB before minification and gzipping (the heaviest part of the tokenizer, merge data, has been compressed into a simple and efficient binary format, and then base64-encoded to bake it into the .js file)

## Import

Recommended way: Install as an npm package and import as ES6 module

```
npm install llama-tokenizer-js
```

```
import llamaTokenizer from 'llama-tokenizer-js'

console.log(llamaTokenizer.encode("Hello world!").length)
```

Alternative: Load as ES6 module with `<script>` tags in your HTML

```
<script type="module" src="https://belladoreai.github.io/llama-tokenizer-js/llama-tokenizer.js"></script>
```

Alternative: for TypeScript projects, imports [should](https://github.com/belladoreai/llama-tokenizer-js/issues/12#issuecomment-1790073415) work now with the `types.d.ts` file, but please file an issue if I need to change something.

Alternative: for CommonJS projects, [should](https://github.com/belladoreai/llama-tokenizer-js/issues/10) work with `const llamaTokenizer = await import('llama-tokenizer-js');`

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

Note that special "beginning of sentence" token and preceding space are added by default when encoded (and correspondingly expected when decoding). These affect token count. There may be some use cases where you don't want to add these. You can pass additional boolean parameters in these use cases. For example, if you want to decode an individual token:

```
llamaTokenizer.decode([3186], false, false)
> 'Hello'
```

## Tests

You can run tests with:

```
llamaTokenizer.runTests()
```

The test suite is small, but it covers different edge cases very well.

Note that tests can be run both in browser and in Node (this is necessary because some parts of the code work differently in different environments).

## Comparison to alternatives

llama-tokenizer-js is the first JavaScript tokenizer for LLaMA which works client-side in the browser. You might be wondering, what other solutions are people using to count tokens in web applications?

- Many web applications currently use client-side JavaScript libraries for other, _incompatible_ tokenizers. In particular, OpenAI's tokenizers are popular (see [tiktoken](https://www.npmjs.com/package/@dqbd/tiktoken) and [gpt-tokenizer](https://www.npmjs.com/package/gpt-tokenizer)). It's not entirely clear to me why people using LLaMA would want to count tokens with an OpenAI tokenizer that is not compatible with LLaMA. I guess people are assuming that there's not much difference between tokenizers? However, in my own testing I discovered that the token counts will commonly differ by as much as 20% between these tokenizers. So you can get a _very rough_ approximation of LLaMA token count by using an OpenAI tokenizer.
- Some web applications make network calls to Python applications that run the Huggingface transformers tokenizer. For example, the oobabooga-text-webui exposes an API endpoint for token count. The drawback of this approach is latency: although the Python tokenizer itself is very fast, oobabooga adds a lot of overhead. In my testing, making a network call to locally running oobabooga to count tokens for short Strings of text took roughly 300ms (compared to ~1ms when counting tokens client-side with llama-tokenizer-js). The latency will be even higher when a real web client is making requests over the internet. The latency issue is even worse if an application needs to iteratively trim down a prompt to get it to fit within a context limit, requiring multiple network calls.
- Since releasing llama-tokenizer-js, alternative llama tokenizers have been released. One notable example is [transformers.js](https://github.com/xenova/transformers.js), which actually introduced a llama tokenizer by [integrating llama-tokenizer-js into transformers.js](https://github.com/belladoreai/llama-tokenizer-js/issues/9).

## Compatibility

The tokenizer used by LLaMA is a SentencePiece Byte-Pair Encoding tokenizer.

Note that this is a tokenizer for LLaMA models, and it's different than the tokenizers used by OpenAI models. If you need a tokenizer for OpenAI models, I recommend [gpt-tokenizer](https://www.npmjs.com/package/gpt-tokenizer).

What is this tokenizer compatible with? All LLaMA models which have been trained on top of checkpoints (model weights) released by Facebook in March 2023 ("LLaMA") and July of 2023 ("LLaMA2").

Examples of compatible models:
- llama2-13b-4bit-gptq
- wizard-vicuna-13b-uncensored-gptq
- manticore-7b-ggml

Incompatible LLaMA models are those which have been trained from scratch, not on top of the checkpoints released by Facebook. For example, [OpenLLaMA](https://github.com/openlm-research/open_llama) models are incompatible.

When you see a new LLaMA model released, this tokenizer is mostly likely compatible with it without any modifications. If you are unsure, try it and see if the token ids are the same (compared to running the model with, for example, oobabooga webui). You can find great test input/output samples by searching for `runTests` inside `llama-tokenizer.js`.

If you want to modify this library to support a new LLaMA tokenizer (new as in trained from scratch, not using the same tokenizer as most LLaMA models do), you should be able to do so by swapping the vocabulary and merge data (the 2 long variables near the end of `llama-tokenizer.js` file). This repo has [a Python script](data-conversion.py) for your convenience.

You can pass custom vocab and merge data to the tokenizer by instantiating it like this:

```
import { llamaTokenizer } from 'llama-tokenizer-js'
const tokenizer = new LlamaTokenizer(custom_vocab, custom_merge_data);
```