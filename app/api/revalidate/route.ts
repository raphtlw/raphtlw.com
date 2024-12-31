import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  console.log(`Request body: ${JSON.stringify(body, undefined, 4)}`);

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const isValid = isValidSignature(
    body,
    signature,
    process.env.SANITY_WEBHOOK_SECRET,
  );

  console.log(`Webhook request valid? ${isValid}`);

  if (!isValid) {
    return Response.json(
      {
        success: false,
        message: "Invalid signature",
      },
      { status: 401 },
    );
  }

  try {
    // const pathToRevalidate = `/posts/${body.slug.current}`;

    // console.log(`Revalidating path: ${pathToRevalidate}`);

    revalidatePath("/posts");
  } catch (e) {
    return Response.json(
      {
        success: false,
        message: "Error while revalidating",
        error: JSON.stringify(e, undefined, 4),
      },
      { status: 500 },
    );
  }
}
