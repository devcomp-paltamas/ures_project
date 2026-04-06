import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBootstrapPayload } from "./_lib/repository";
import { assertMethod, sendJson, withApiHandler } from "./_lib/http";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await withApiHandler(response, async () => {
    assertMethod(request, ["GET"]);
    sendJson(response, 200, await getBootstrapPayload());
  });
}
