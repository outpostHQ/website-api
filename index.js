import { Snippet } from './db/snippet.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3030;
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.options('/api', cors({
    origin: 'https://numl.design',
  }));
}
app.use('/api', bodyParser.json());

function ok(res, payload) {
  res.json({
    ok: true,
    payload,
  });
}

function fail(res, payload = 'internal_error') {
  res.json({
    ok: false,
    payload,
  });
}

app.get('/', (req, res) => {
  res.send('API is ready');
});

app.get('/api/snippets/:id', async (req, res) => {
  const id = req.params.id;

  let snippet;

  try {
    snippet = await Snippet.findOne({ _id: id });
  } catch (e) {
    return fail(res);
  }

  if (snippet) {
    const { code } = snippet;

    ok(res, { code });
  } else {
    fail(res, 'Not found');
  }
});

app.post('/api/snippets', async (req, res) => {
  let code = req.body.code;

  if (!code || !code.trim()) {
    return fail('No code provided');
  }

  code = code.trim();

  const existSnippet = await Snippet.findOne({ code });

  if (existSnippet) {
    return ok(res, { id: existSnippet._id });
  }

  const snippet = new Snippet({ code });

  await snippet.save();

  ok(res, { id: snippet.id });
});

app.listen(port, () => console.log(`Numl.Design API listening at port ${port}`));
