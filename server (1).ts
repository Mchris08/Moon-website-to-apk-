// M🌓🌓N — static site server for Deno Deploy (free tier)
// Serves index.html at /, admin.html at /admin.html, moon-config.js, etc.
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

Deno.serve((req) =>
  serveDir(req, {
    fsRoot: ".",
    urlRoot: "",
    index: "index.html",          // / shows your converter
    quiet: true,
  })
);
