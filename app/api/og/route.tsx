import { ImageResponse } from "next/og";

async function loadGoogleFont(font: string) {
  const enc = encodeURIComponent(font);
  const url = `https://fonts.googleapis.com/css2?family=${font}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has("title");
    const title = hasTitle
      ? searchParams.get("title")?.slice(0, 100)
      : "My default title";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            backgroundImage: "url(http://localhost:3000/images/og.png)",
            fontFamily: "Instrument Serif",
          }}
          tw="px-10 py-12"
        >
          <h1 tw="text-8xl text-white mb-16">{title}</h1>
          <p tw="text-3xl text-slate-200">Building scalable web applications</p>
          <div tw="text-xl text-slate-400">raphtlw.com</div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Instrument Serif",
            data: await loadGoogleFont("Instrument Serif"),
            style: "normal",
          },
        ],
      },
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
