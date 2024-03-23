import { LlamaTokenizer } from ".";

const tokenizer=new LlamaTokenizer();

const isEqual=(arr1: number[], arr2: number[]) => {
    return arr1.length===arr2.length&&arr1.every((value, index) => {
        return value===arr2[index]
    });
}

const testCase=(inputString: string, expectedTokenIds: number[]) => {
    const actualTokens=tokenizer.encode(inputString, true, true, true)
    if (!isEqual(actualTokens, expectedTokenIds)) {
        throw `Test failed. LLaMA Tokenizer Encoder returned unexpected result: expected tokenize(${inputString}) === ${expectedTokenIds}, actual was: ${actualTokens}`
    }
    if (inputString!==tokenizer.decode(actualTokens)) {
        throw `Test failed. LLaMA Tokenizer Decoder returned unexpected result: expected decode(${actualTokens}) === ${inputString}, actual was: ${tokenizer.decode(actualTokens)}`
    }
}

const runTests=() => {

    // Simple test case
    testCase("grabbed", [1, 2646, 1327, 287])

    // Naive implementation produces inconsistent tokenization for " grabbed", making this a good test case
    testCase(" grabbed", [1, 29871, 2646, 1327, 287])

    // Naive implementation uses incorrect merge order for multiple consecutive space merges, making this a good test case
    testCase("           grabbed", [1, 9651, 2646, 1327, 287])

    // Linebreaks and tabs are handled as fallback to byte tokens
    testCase("\n", [1, 29871, 13])
    testCase(" \n", [1, 259, 13])
    testCase("	tabs				out here", [1, 29871, 12, 21175, 12, 12, 12, 12, 449, 1244])

    // Equal prio merges are performed left-to-right (fixed in 1.1.1)
    testCase("ax\n####\nboo", [1, 4853, 13, 4136, 13, 833, 29877])

    // UTF-8 multipoint character that should be found in vocabulary
    testCase('镇', [1, 29871, 30411])

    // UTF-8 multipoint character that should NOT be found in vocabulary, fallback to MULTIPLE byte tokens
    testCase('🦙', [1, 29871, 243, 162, 169, 156])

    // Consecutive UTF-8 multipoint characters that are NOT found in a vocabulary and use DIFFERENT number of bytes
    testCase('🦙Ꙋ', [1, 29871, 243, 162, 169, 156, 237, 156, 141])
    testCase('Ꙋ🦙', [1, 29871, 237, 156, 141, 243, 162, 169, 156])

    // Larger text input with various special characters sprinkled in
    testCase("The llama (/ˈlɑːmə/; 🦙Spanish pronunciation: [ˈʎama]) (Lama glama) is a domesticated South American camelid, widely used as a meat and pack animal by Andean cultures since the Pre-Columbian era. Llamas are social animals and live with others as a herd. Their wool is soft and contains only a small amount of lanolin.[2] Llamas can learn simple tasks after a few repetitions. When using a pack, they can carry about 25 to 30% of their body weight for 8 to 13 km (5–8 miles).[3] The name llama (in the past also spelled \"lama\" or \"glama\") was adopted by European settlers from native Peruvians.[4] The ancestors of llamas are thought to have originated from the Great Plains of North America about 40 million years ago, and subsequently migrated to South America about three million years ago during the Great American Interchange. By the end of the last ice age (10,000–12,000 years ago), camelids were extinct in North America.[3] As of 2007, there were over seven million llamas and alpacas in South America and over 158,000 llamas and 100,000Ꙋ🦙 alpacas, descended from progenitors imported late in the 20th century, in the United States and Canada.[5] In Aymara mythology, llamas are important beings. The Heavenly Llama is said to drink water from the ocean and urinates as it rains.[6] According to Aymara eschatology, llamas will return to the water springs and lagoons where they come from at the end of time.[6]",
        [1, 450, 11148, 3304, 20374, 30176, 29880, 30426, 30215, 29885,
            30184, 29914, 29936, 29871, 243, 162, 169, 156, 15495, 728,
            11504, 11173, 362, 29901, 518, 30176, 31743, 3304, 2314, 313,
            29931, 3304, 3144, 3304, 29897, 338, 263, 21849, 630, 4275,
            3082, 3949, 295, 333, 29892, 17644, 1304, 408, 263, 27654,
            322, 4870, 13019, 491, 1126, 29872, 273, 4185, 1973, 1951,
            278, 4721, 29899, 1625, 3774, 713, 3152, 29889, 365, 5288,
            294, 526, 5264, 15006, 322, 5735, 411, 4045, 408, 263,
            902, 29881, 29889, 11275, 281, 1507, 338, 4964, 322, 3743,
            871, 263, 2319, 5253, 310, 10906, 22878, 7226, 29906, 29962,
            365, 5288, 294, 508, 5110, 2560, 9595, 1156, 263, 2846,
            21159, 2187, 29889, 1932, 773, 263, 4870, 29892, 896, 508,
            8677, 1048, 29871, 29906, 29945, 304, 29871, 29941, 29900, 29995,
            310, 1009, 3573, 7688, 363, 29871, 29947, 304, 29871, 29896,
            29941, 2383, 313, 29945, 29994, 29947, 7800, 467, 29961, 29941,
            29962, 450, 1024, 11148, 3304, 313, 262, 278, 4940, 884,
            805, 14356, 376, 29880, 3304, 29908, 470, 376, 3820, 3304,
            1159, 471, 16356, 491, 7824, 3604, 9306, 515, 7531, 25493,
            1403, 550, 7226, 29946, 29962, 450, 19525, 943, 310, 11829,
            294, 526, 2714, 304, 505, 3978, 630, 515, 278, 7027,
            13494, 1144, 310, 4644, 6813, 1048, 29871, 29946, 29900, 7284,
            2440, 8020, 29892, 322, 17602, 9725, 630, 304, 4275, 6813,
            1048, 2211, 7284, 2440, 8020, 2645, 278, 7027, 3082, 4124,
            3167, 29889, 2648, 278, 1095, 310, 278, 1833, 14890, 5046,
            313, 29896, 29900, 29892, 29900, 29900, 29900, 29994, 29896, 29906,
            29892, 29900, 29900, 29900, 2440, 8020, 511, 3949, 295, 4841,
            892, 1294, 5562, 297, 4644, 6813, 7226, 29941, 29962, 1094,
            310, 29871, 29906, 29900, 29900, 29955, 29892, 727, 892, 975,
            9881, 7284, 11829, 294, 322, 394, 29886, 562, 294, 297,
            4275, 6813, 322, 975, 29871, 29896, 29945, 29947, 29892, 29900,
            29900, 29900, 11829, 294, 322, 29871, 29896, 29900, 29900, 29892,
            29900, 29900, 29900, 237, 156, 141, 243, 162, 169, 156,
            394, 29886, 562, 294, 29892, 5153, 2760, 515, 410, 1885,
            17259, 19673, 5683, 297, 278, 29871, 29906, 29900, 386, 6462,
            29892, 297, 278, 3303, 3900, 322, 7400, 7226, 29945, 29962,
            512, 319, 962, 2518, 22082, 3002, 29892, 11829, 294, 526,
            4100, 367, 886, 29889, 450, 22977, 368, 365, 29880, 3304,
            338, 1497, 304, 13748, 4094, 515, 278, 23474, 322, 5065,
            262, 1078, 408, 372, 1153, 1144, 7226, 29953, 29962, 7579,
            304, 319, 962, 2518, 831, 13496, 3002, 29892, 11829, 294,
            674, 736, 304, 278, 4094, 7689, 886, 322, 301, 4425,
            787, 988, 896, 2041, 515, 472, 278, 1095, 310, 931,
            7226, 29953, 29962]);

    console.log('LLaMA Tokenizer tests passed successfully.');
    return true;
}

runTests();