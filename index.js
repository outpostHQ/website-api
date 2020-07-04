import { Snippet } from './db/snippet.js';
import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 3030;

app.use('/api', bodyParser.json());

function ok(res, data) {
  res.json({
    ok: true,
    data,
  });
}

function fail(res, data) {
  res.json({
    ok: false,
    data,
  });
}

app.get('/', (req, res) => {
  res.send('API is ready');
});

app.get('/api/snippet/:id', (req, res) => {
  res.json({ hello: 'world!'});
});

app.post('/api/snippet', async (req, res) => {
  let code = req.body.code;

  if (!code || !code.trim()) {
    return fail('No code provided');
  }

  code = code.trim();

  const existSnippet = await Snippet.findOne({ code });

  if (existSnippet) {
    return ok(res, { id: existSnippet.id });
  }

  const snippet = new Snippet({ code });

  await snippet.save();

  ok(res, { id: snippet.id });
});

app.listen(port, () => console.log(`Numl.Design API listening at port ${port}`));
