# 🦙 llama-tokenizer-js 🦙

The first JavaScript tokenizer for LLaMA which works client-side in the browser (and also in Node).

Intended use case is calculating token count accurately on the client-side.

<a href="https://belladoreai.github.io/llama-tokenizer-js/example-demo/build/">Click here for demo</a>

## Features

- Easy to use: 0 dependencies, code and data baked into a single file.
- Compatible with most LLaMA models (see [Compatibility](#compatibility))
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

As mentioned, llama-tokenizer-js is the first JavaScript tokenizer for LLaMA which works client-side in the browser. You might be wondering, what are people currently using to count tokens in web applications?

- Many web applications currently use client-side JavaScript libraries for other, _incompatible_ tokenizers. In particular, OpenAI's tokenizers are popular (see [tiktoken](https://www.npmjs.com/package/@dqbd/tiktoken) and [gpt-tokenizer](https://www.npmjs.com/package/gpt-tokenizer)). It's not entirely clear to me why people using LLaMA would want to count tokens with an OpenAI tokenizer that is not compatible with LLaMA. I guess people are assuming that there's not much difference between tokenizers? However, in my own testing I discovered that the token counts will commonly differ by as much as 20% between these tokenizers. So you can get a _very rough_ approximation of LLaMA token count by using an OpenAI tokenizer.
- Some web applications make network calls to Python applications that run the Huggingface transformers tokenizer. For example, the oobabooga-text-webui exposes an API endpoint for token count. The drawback of this approach is latency: although the Python tokenizer itself is very fast, oobabooga adds a lot of overhead. In my testing, making a network call to locally running oobabooga to count tokens for short Strings of text took roughly 300ms (compared to ~1ms when counting tokens client-side with llama-tokenizer-js). The latency will be even higher when a real web client is making requests over the internet. The latency issue is even worse if an application needs to iteratively trim down a prompt to get it to fit within a context limit, requiring multiple network calls.

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

## Adding support for incompatible LLaMA models

If you want to modify this library to support a new LLaMA tokenizer (new as in trained from scratch, not using the same tokenizer as most LLaMA models do), you should be able to do so by swapping the vocabulary and merge data (the 2 long variables near the end of `llama-tokenizer.js` file). Below is Python code that you can use for this.

```
# Load the tokenizer.json file that was distributed with the LLaMA model
d = None
with open(r"tokenizer.json", 'r', encoding='utf-8') as f:
    d = json.load(f)
 
# Extract the vocabulary as a list of token strings
vocab = []
for token in d['model']['vocab']:
    vocab.append(token)
 
# Transform the vocabulary into a UTF-8 String delimited by line breaks, base64 encode it, and save to a file
with open('vocab_base64.txt', 'wb') as f:
    f.write(base64.b64encode(('\n').join(vocab).encode("utf-8")))
 
# Extract the merge data as a list of strings, where location in list indicates priority of merge.
# Example: one merge might be "gr a" (indicating that "gr" and "a" merge into "gra")
merges = []
for merge in d['model']['merges']:
    merges.append(merge)
 
# Create helper map where keys are token Strings, values are their positions in the vocab.
# Note that positions of the vocabulary do not have any special meaning in the tokenizer,
# we are merely using them to aid with compressing the data.
vocab_map = {}
for i,v in enumerate(vocab):
    vocab_map[v] = i
 
# Each merge can be represented with 2 integers, e.g. "merge the 5th and the 11th token in vocab".
# Since the vocabulary has fewer than 2^16 entries, each integer can be represented with 16 bits (2 bytes).
# We are going to compress the merge data into a binary format, where
# the first 4 bytes define the first merge, the next 4 bytes define the second merge, and so on.
integers = []
for merge in merges:
    f, t = merge.split(" ")
    integers.append(vocab_map[f])
    integers.append(vocab_map[t])
 
# Pack the integers into bytes using the 'H' format (2 bytes per integer)
byte_array = struct.pack(f'{len(integers)}H', *integers)
 
# Save the byte array as base64 encoded file
with open('merges_binary.bin', 'wb') as file:
    file.write(base64.b64encode(byte_array))
```

## Credit

You are free to use llama-tokenizer-js for basically whatever you want (MIT license).

You are not required to give anything in exchange, but I kindly ask that you give back by linking to [https://belladore.ai/tools](https://belladore.ai/tools) in an appropriate place in your website. For example, you might link with the text "Using llama-tokenizer-js by belladore.ai" or something similar.