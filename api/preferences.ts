import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireApiSession } from "./_lib/auth";
import { getProfileForSession, updateProfileForSession } from "./_lib/repository";
import { appPreferenceInputSchema } from "./_lib/schemas";
import { assertMethod, readJsonBody, sendJson, withApiHandler } from "./_lib/http";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  await withApiHandler(response, async () => {
    const method = assertMethod(request, ["GET", "PATCH"]);
    const session = await requireApiSession(request);

    if (method === "GET") {
      sendJson(response, 200, await getProfileForSession(session));
      return;
    }

    const input = appPreferenceInputSchema.parse(readJsonBody(request));
    sendJson(response, 200, await updateProfileForSession(session, input));
  });
}
