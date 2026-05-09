import express, { Request, Response } from "express";

const app = express();

app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 3001);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`[api] listening on http://localhost:${port}`);
  });
}

export default app;
