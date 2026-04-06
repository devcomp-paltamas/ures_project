import type { VercelRequest, VercelResponse } from "@vercel/node";
import { exchangeIdTokenForSession } from "../_lib/auth";
import { authSessionRequestSchema } from "../_lib/schemas";
import { assertMethod, readJsonBody, sendJson, withApiHandler } from "../_lib/http";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await withApiHandler(response, async () => {
    assertMethod(request, ["POST"]);

    const body = authSessionRequestSchema.parse(readJsonBody(request));
    const result = await exchangeIdTokenForSession(body.idToken);
    sendJson(response, 200, result);
  });
}
