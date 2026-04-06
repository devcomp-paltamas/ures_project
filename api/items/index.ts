import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireApiSession } from "../_lib/auth";
import { createItemForSession, listItemsForSession } from "../_lib/repository";
import { itemInputSchema } from "../_lib/schemas";
import {
  assertMethod,
  readJsonBody,
  sendJson,
  withApiHandler
} from "../_lib/http";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  await withApiHandler(response, async () => {
    const method = assertMethod(request, ["GET", "POST"]);

    if (method === "GET") {
      const session = await requireApiSession(request);
      sendJson(response, 200, await listItemsForSession(session));
      return;
    }

    const session = await requireApiSession(request);
    const input = itemInputSchema.parse(readJsonBody(request));
    sendJson(response, 201, await createItemForSession(session, input));
  });
}
