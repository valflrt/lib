import { Readable, Stream, Transform, Writable } from "stream";

/**
 * Stream pipeline
 * @param input Input Stream (Readable)
 * @param streamChain Stream chain (Transform and a Writable at the end)
 * @author valflrt
 */
export let pipeline = (
  input: Readable,
  ...streamChain: [...Transform[], Writable]
) =>
  new Promise<void>((resolve, reject) => {
    let recurse = (toBePipedIn: Stream, index = 0) => {
      if (index === streamChain.length - 1)
        recurse(
          toBePipedIn.pipe(streamChain[index].once("error", reject)),
          index + 1
        );
    };
    recurse(input.once("end", () => resolve()));
  });
