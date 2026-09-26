const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const isZajeci = fs.existsSync(path.join(root, 'modules/file-module'));

function context(overrides = {}) {
  return {
    useRuntimeConfig: () => ({ internalApiKey: 'test-private-key', phpApiBaseUrl: 'https://backend.invalid/api', frontendHost: 'https://tenant.example', public: {} }),
    createError: (data) => Object.assign(new Error(data.statusMessage), data),
    defineEventHandler: (handler) => handler,
    getUserSession: async () => ({ token: 'user-token', user: { role: 'admin' } }),
    URL, FormData, Blob, Uint8Array, Buffer, Response, process,
    ...overrides,
  };
}
function load(relative, globals, imports = {}) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
  const module = { exports: {} };
  vm.runInNewContext(result.outputText, { ...globals, module, exports: module.exports, require: (name) => {
    if (imports[name]) return imports[name];
    throw new Error('Unexpected import: ' + name);
  } }, { filename: relative });
  return module.exports;
}
function event(route = '/api/admin/product') {
  return { path: route, method: 'GET', headers: new Headers({ host: 'attacker.example' }), context: { params: { path: 'tenant/image.png', id: '1' } } };
}
function helpers(globals) {
  const headers = load('server/utils/phpApiHeaders.ts', globals);
  return { '@/server/utils/phpApiHeaders': headers };
}
function checkHeaders(headers) {
  assert.equal(headers['X-Internal-Key'], 'test-private-key');
  assert.equal(headers['X-Forwarded-Host'], 'tenant.example');
}

test('server headers use configured host and preserve the user token', () => {
  const g = context(); const h = helpers(g)['@/server/utils/phpApiHeaders'].phpApiHeaders(event(), 'user-token');
  checkHeaders(h); assert.equal(h.Authorization, 'Bearer user-token');
  assert.equal(h['Content-Type'], undefined, 'multipart boundary must remain automatic');
});
test('missing key fails closed; public configuration is never used as a key', () => {
  for (const key of ['', '   ', undefined]) {
    const g = context({ useRuntimeConfig: () => ({ internalApiKey: key, public: { internalApiKey: 'must-not-use' } }) });
    assert.throws(() => helpers(g)['@/server/utils/phpApiHeaders'].phpApiHeaders(event()), (error) => error.statusCode === 500);
  }
});
test('JSON proxy always includes the key with or without a user session', async () => {
  for (const session of [null, { token: 'user-token' }]) {
    let call;
    const g = context({ getUserSession: async () => session, $fetch: async (url, options) => { call = { url, options }; return { success: true }; } });
    const { phpApiFetch } = load('server/utils/phpApi.ts', g, helpers(g));
    await phpApiFetch(event(), '/products', { query: { skip: 20, limit: 10 } });
    checkHeaders(call.options.headers);
    assert.equal(call.options.headers.Authorization, session ? 'Bearer user-token' : undefined);
    assert.equal(call.options.query.page, 3);
    assert.equal(call.url, 'https://backend.invalid/api/products');
  }
});
test('session hydration includes internal and user keys', async () => {
  let call;
  const g = context({ $fetch: async (url, options) => { call = options; return { data: { id: 1 } }; }, setUserSession: async () => {} });
  const { setUserSessionFromPhp } = load('server/utils/session.ts', g, helpers(g));
  await setUserSessionFromPhp(event(), 'https://backend.invalid/api', 'login-token', 1);
  checkHeaders(call.headers); assert.equal(call.headers.Authorization, 'Bearer login-token');
});
test('login includes the application key before a user session exists', async () => {
  let call;
  const g = context({ getUserSession: async () => null, readBody: async () => ({ email: 'user@example.com', password: 'test' }), $fetch: async (url, options) => { call = options; return { success: true, data: { token: 'issued-token', id: 1 } }; } });
  const imports = { ...helpers(g), '@/server/utils/session': { setUserSessionFromPhp: async () => {} } };
  imports['@/server/utils/phpApi'] = load('server/utils/phpApi.ts', g, imports);
  await load('server/api/login/index.post.ts', g, imports).default(event('/api/login'));
  checkHeaders(call.headers);
});
test('file upload includes the key without overriding multipart content type', async () => {
  let call;
  const g = context({ readMultipartFormData: async () => [{ name: 'file', data: Buffer.from('test'), type: 'text/plain', filename: 'test.txt' }], $fetch: async (url, options) => { call = options; return { success: true }; } });
  const file = isZajeci ? 'modules/file-module/runtime/server/api/files/upload.post.ts' : 'server/api/files/upload.post.ts';
  await load(file, g, helpers(g)).default(event('/api/files/upload'));
  checkHeaders(call.headers); assert.equal(call.headers['Content-Type'], undefined); assert.equal(call.body.get('file').name, 'test.txt');
});
test('file download includes key and preserves private response cache policy', async () => {
  let call; const responseHeaders = {};
  const g = context({ fetch: async (url, options) => { call = options; return new Response('test', { headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'private, no-store' } }); }, setResponseHeader: (_event, name, value) => { responseHeaders[name] = value; } });
  const file = isZajeci ? 'modules/file-module/runtime/server/api/files/[...path].get.ts' : 'server/api/files/[...path].get.ts';
  await load(file, g, helpers(g)).default(event('/api/files/tenant/image.png'));
  checkHeaders(call.headers); assert.equal(responseHeaders['Cache-Control'], 'private, no-store');
});
test('private admin reads cannot expose data through the server key anonymously', async () => {
  const g = context({ getUserSession: async () => null });
  const middleware = load('server/middleware/admin-api.ts', g).default;
  for (const route of ['/api/admin/client', '/api/admin/client/1', '/api/admin/role', '/api/admin/profile']) {
    await assert.rejects(middleware(event(route)), (error) => error.statusCode === 401);
  }
});
test('admin writes and private reads still require an admin role', async () => {
  const g = context({ getUserSession: async () => ({ token: 'token', user: { role: 'user' } }) });
  const middleware = load('server/middleware/admin-api.ts', g).default;
  for (const request of [event('/api/admin/client'), { ...event('/api/admin/product'), method: 'POST' }]) {
    await assert.rejects(middleware(request), (error) => error.statusCode === 403);
  }
});
if (!isZajeci) test('published catalog and individual profile requests remain available to glasses', async () => {
  const g = context({ getUserSession: async () => null });
  const middleware = load('server/middleware/admin-api.ts', g).default;
  for (const route of ['/api/admin/product', '/api/admin/category/1', '/api/admin/enumeration', '/api/admin/profile/1']) await middleware(event(route));
});
