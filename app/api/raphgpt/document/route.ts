import { client } from "@/sanity/lib/client";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const headersList = await headers();

  const authorizationHeader = headersList.get("authorization");
  if (!authorizationHeader)
    return Response.json(
      {
        success: false,
        message:
          "No authorization header found! Make sure to use HTTP bearer authentication.",
      },
      {
        status: 401,
      },
    );

  const authorization = authorizationHeader.split(" ");
  if (authorization.length <= 0) {
    return Response.json(
      {
        success: false,
        message:
          "No authorization header found! Make sure to use HTTP bearer authentication.",
      },
      {
        status: 401,
      },
    );
  }

  const authMethod = authorization[0].toLowerCase();
  const authToken = authorization[1];

  if (authMethod !== "bearer") {
    return Response.json(
      {
        success: false,
        message:
          "Invalid authorization header! Make sure to use HTTP bearer authentication.",
      },
      {
        status: 401,
      },
    );
  }

  if (authToken !== process.env.RAPHGPT_SECRET) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  const { title, content } = await req.json();

  const doc = await client.create({
    _type: "raphgptPage",
    title,
    content,
    publishedAt: new Date(),
  });

  return Response.json({
    success: true,
    doc,
  });
}
