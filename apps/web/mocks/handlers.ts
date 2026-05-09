import { http, HttpResponse } from "msw";
import { getPurchaseOrderFixture } from "./po-data";

export const handlers = [
  http.get("/api/orders/:poNo", ({ params }) => {
    const poNo = String(params.poNo);
    const detail = getPurchaseOrderFixture(poNo);
    if (!detail) {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }
    return HttpResponse.json(detail);
  }),
];
