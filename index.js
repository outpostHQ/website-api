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

app.get('/api/snippet/:id', async (req, res) => {
  const id = req.params.id;

  const snippet = await Snippet.findOne({ _id: id });

  if (snippet) {
    const { code } = snippet;

    ok(res, { code });
  } else {
    fail(res, 'Not found');
  }
});

app.post('/api/snippet', async (req, res) => {
  let code = req.body.code;

  if (!code || !code.trim()) {
    return fail('No code provided');
  }

  code = code.trim();

  const existSnippet = await Snippet.findOne({ code });

  if (existSnippet) {
    return ok(res, { _id: existSnippet._id });
  }

  const snippet = new Snippet({ code });

  await snippet.save();

  ok(res, { id: snippet.id });
});

app.listen(port, () => console.log(`Numl.Design API listening at port ${port}`));
