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
