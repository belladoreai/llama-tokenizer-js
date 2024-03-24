import { Button } from "@/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex mx-5 h-screen max-w-screen-xl items-center justify-between xl:mx-auto">
            <div className="mt-4">
                <h1 className={'text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-left mb-8 max-w-screen-md'}>
                    🦙
                    <a
                        href="https://github.com/belladoreai/llama-tokenizer-js"
                        target="_blank"
                        className="text-blue-500 underline"
                    >
                        llama-tokenizer-js
                    </a>{" "}
                    🦙
                </h1>
                <p className={'text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 text-left'}>
                    JavaScript tokenizer for LLaMA which works client-side in the browser (and also in Node). <br />
                    Intended use case is calculating token count accurately on the client-side.
                </p>

                <div className="flex gap-4">
                    <Button asChild>
                        <Link href={"/example-demo/build"}>Playground</Link>
                    </Button>
                    <Button variant={"link"} asChild>
                        <Link href={"https://github.com/belladoreai/llama-tokenizer-js"} target="_blank">Learn more</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
