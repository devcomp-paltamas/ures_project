import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireApiSession } from "../_lib/auth";
import { deleteItemForSession, updateItemForSession } from "../_lib/repository";
import { itemInputSchema } from "../_lib/schemas";
import {
  assertMethod,
  readJsonBody,
  readRouteParam,
  sendJson,
  withApiHandler
} from "../_lib/http";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await withApiHandler(response, async () => {
    const method = assertMethod(request, ["PATCH", "DELETE"]);
    const session = await requireApiSession(request);
    const itemId = readRouteParam(request.query.id, "id");

    if (method === "DELETE") {
      sendJson(response, 200, await deleteItemForSession(session, itemId));
      return;
    }

    const input = itemInputSchema.parse(readJsonBody(request));
    sendJson(response, 200, await updateItemForSession(session, itemId, input));
  });
}
