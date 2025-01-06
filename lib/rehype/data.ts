import type { ShikiTransformer } from "shiki";

/**
 * A transformer that adds the code data to the HTML.
 * @returns A Shiki transformer.
 *
 * @example
 * ```ts
 * import { codeToHtml } from 'shiki'
 * import { addSourceCode } from 'add-source-code'
 *
 * const html = await codeToHtml(`console.log('hello, world')`, {
 *   lang: 'ts',
 *   theme: 'houston',
 *   transformers: [
 *     addSourceCode()
 *   ],
 * })
 * ```
 *
 * Results in HTML produced:
 * ```html
 * <pre
 *   tabindex="0"
 *   data-language="ts"
 *   data-theme="vesper"
 *   style="background-color: rgb(16, 16, 16); color: rgb(255, 255, 255)"
 * ><code data-line-numbers="" data-language="ts" data-theme="vesper" data-line-numbers-max-digits="1" style="display: grid;"><span data-line=""><span style="color: rgb(160, 160, 160);">export</span><span style="color: rgb(160, 160, 160);"> const</span><span style="color: rgb(255, 255, 255);"> solanaConnection </span><span style="color: rgb(160, 160, 160);">=</span><span style="color: rgb(160, 160, 160);"> new</span><span style="color: rgb(255, 199, 153);"> Connection</span><span style="color: rgb(255, 255, 255);">(</span><span style="color: rgb(255, 199, 153);">getEnv</span><span style="color: rgb(255, 255, 255);">(</span><span style="color: rgb(153, 255, 228);">"SOLANA_RPC_URL"</span><span style="color: rgb(255, 255, 255);">), {</span></span>
 * <span data-line=""><span style="color: rgb(255, 255, 255);">  wsEndpoint: </span><span style="color: rgb(255, 199, 153);">getEnv</span><span style="color: rgb(255, 255, 255);">(</span><span style="color: rgb(153, 255, 228);">"SOLANA_WEBSOCKET_URL"</span><span style="color: rgb(255, 255, 255);">),</span></span>
 * <span data-line=""><span style="color: rgb(255, 255, 255);">});</span></span>
 * <span data-line=""> </span>
 * <span data-line=""><span style="color: rgb(160, 160, 160);">export</span><span style="color: rgb(160, 160, 160);"> const</span><span style="color: rgb(255, 255, 255);"> raydium </span><span style="color: rgb(160, 160, 160);">=</span><span style="color: rgb(160, 160, 160);"> await</span><span style="color: rgb(255, 255, 255);"> Raydium.</span><span style="color: rgb(255, 199, 153);">load</span><span style="color: rgb(255, 255, 255);">({</span></span>
 * <span data-line=""><span style="color: rgb(255, 255, 255);">  connection: solanaConnection,</span></span>
 * <span data-line=""><span style="color: rgb(255, 255, 255);">});</span></span><div title="Full code" data-shiki="" data="export const solanaConnection = new Connection(getEnv(&quot;SOLANA_RPC_URL&quot;), {
 *   wsEndpoint: getEnv(&quot;SOLANA_WEBSOCKET_URL&quot;),
 * });
 *
 * export const raydium = await Raydium.load({
 *   connection: solanaConnection,
 * });"></div></code></pre>
 * ```
 */
export function addSourceCode(): ShikiTransformer {
  return {
    name: "add-source-code",
    code(node) {
      node.children.push({
        type: "element",
        tagName: "div",
        properties: {
          title: "Full code",
          "data-shiki": "",
          data: this.source,
        },
        children: [],
      });
    },
  };
}
