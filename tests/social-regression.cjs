#!/usr/bin/env node
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { parse } = require('@babel/parser');
const traverseModule = require('@babel/traverse');
const generatorModule = require('@babel/generator');
const traverse = traverseModule.traverse || traverseModule.default?.traverse || traverseModule.default;
const generate = generatorModule.generate || generatorModule.default?.generate || generatorModule.default;
const Vue = require('@vue/runtime-core');
const { extractModuleFromSrc } = require('./extract.cjs');

const source = fs.readFileSync(path.join(__dirname, '..', 'src', 'index.js'), 'utf8');
const ast = parse(source, { sourceType: 'module' });
const functions = new Map();
const components = new Map();
const invalidTextFlags = [];
let dynamicJump;
let generatePersona;

traverse(ast, {
  FunctionDeclaration(p) {
    if (p.parent.type === 'Program') functions.set(p.node.id.name, p.node);
    if (p.node.id.name === 'generatePersona') generatePersona = p.node;
  },
  VariableDeclarator(p) {
    if (p.node.id.name === 'se' && p.node.init?.type === 'ArrowFunctionExpression' && p.node.init.params[0]?.name === 'post') {
      dynamicJump = p.node.init;
    }
    if (!['Yb', 'rf'].includes(p.node.id.name)) return;
    const declarations = p.parent.declarations;
    const index = declarations.indexOf(p.node);
    components.set(p.node.id.name, {
      component: p.node.init.arguments[0],
      hoists: declarations.slice(0, index).filter((d) => d.init.type !== 'CallExpression'),
    });
  },
  CallExpression(p) {
    const n = p.node;
    const callee = n.callee.type === 'SequenceExpression' ? n.callee.expressions.at(-1) : n.callee;
    if (callee.type !== 'MemberExpression' || !['createElementVNode', 'createElementBlock'].includes(callee.property.name)) return;
    const args = n.arguments;
    if (args[2]?.type === 'ArrayExpression' && args[3]?.type === 'NumericLiteral' && args[3].value > 0 && (args[3].value & 1)) {
      invalidTextFlags.push(n.loc.start.line);
    }
  },
});

function extractFunction(name) {
  assert.ok(functions.has(name), `missing function: ${name}`);
  return generate(functions.get(name)).code;
}

function hostNode(type, text = '') {
  return { type, text: String(text), props: {}, children: [], parent: null };
}

const renderer = Vue.createRenderer({
  createElement: (tag) => hostNode(tag),
  createText: (text) => hostNode('#text', text),
  createComment: (text) => hostNode('#comment', text),
  insert(child, parent, anchor = null) {
    if (child.parent) this.remove(child);
    child.parent = parent;
    const at = anchor ? parent.children.indexOf(anchor) : -1;
    if (at < 0) parent.children.push(child);
    else parent.children.splice(at, 0, child);
  },
  remove(child) {
    if (!child.parent) return;
    const at = child.parent.children.indexOf(child);
    if (at >= 0) child.parent.children.splice(at, 1);
    child.parent = null;
  },
  setText: (node, text) => { node.text = String(text); },
  setElementText(node, text) {
    node.children.forEach((child) => { child.parent = null; });
    node.children = [];
    node.text = String(text);
  },
  parentNode: (node) => node.parent,
  nextSibling(node) {
    if (!node.parent) return null;
    return node.parent.children[node.parent.children.indexOf(node) + 1] || null;
  },
  patchProp: (node, key, _old, value) => { node.props[key] = value; },
});

function find(root, predicate) {
  if (predicate(root)) return root;
  for (const child of root.children) {
    const match = find(child, predicate);
    if (match) return match;
  }
  return null;
}

function textContent(node) {
  return node.text + node.children.filter((child) => child.type !== '#comment').map(textContent).join('');
}

async function testForumUpdates() {
  assert.deepEqual(invalidTextFlags, [], 'array children cannot use the TEXT patch flag');
  const definition = components.get('Yb');
  assert.ok(definition, 'ForumPost component found');
  const jumps = [];
  const context = vm.createContext({
    i: { ...Vue, Transition: { inheritAttrs: false, setup(_props, { slots }) { return () => slots.default?.(); } } },
    console: { info() {}, warn() {}, error() {} },
    E() {},
    forumJumpWithPost: (post, comment) => jumps.push({ post, comment }),
    Date, String, Number, Array, Map, Set, Boolean,
  });
  const hoists = definition.hoists.map((d) => `const ${d.id.name} = ${generate(d.init).code};`).join('\n');
  const component = vm.runInContext(`${hoists}\n(${generate(definition.component).code})`, context);
  const post = Vue.reactive({
    title: '路灯维修讨论', author: '雨夜赶路人', content: '雨夜路灯坏了。', views: 1245,
    comments: [{ name: '社区观察员', time: '22:05', c: '已经报修。' }],
  });
  const root = hostNode('root');
  const app = renderer.createApp({ render: () => Vue.h(component, { initialData: post }) });
  try {
    app.mount(root);
    await Vue.nextTick();
    let author = find(root, (n) => n.props.class === 'post-author');
    assert.equal(textContent(author).trim(), '雨夜赶路人');
    assert.ok(find(author, (n) => n.type === 'i'), 'author icon survives async data load');
    let comment = find(root, (n) => n.props.class === 'comment-author');
    assert.equal(textContent(comment).trim(), '社区观察员');
    assert.ok(find(comment, (n) => n.type === 'i'));
    author.props.onClick();
    comment.props.onClick();
    assert.equal(jumps[0].post.author, '雨夜赶路人');
    assert.equal(jumps[1].comment.name, '社区观察员');
    post.author = '路灯报修人';
    await Vue.nextTick();
    author = find(root, (n) => n.props.class === 'post-author');
    comment = find(root, (n) => n.props.class === 'comment-author');
    assert.equal(textContent(author).trim(), '雨夜赶路人');
    assert.equal(textContent(comment).trim(), '社区观察员');
    assert.ok(find(author, (n) => n.type === 'i'));
    assert.ok(find(comment, (n) => n.type === 'i'));
    assert.ok(!textContent(root).includes('[object Object]'));
  } finally {
    app.unmount();
  }
}

async function testChatRegistration() {
  const vars = { phone_data: { characters: [], randomAvatars: [], backgrounds: [] } };
  let writes = 0;
  let id = 0;
  const store = { chat: { chatList: [], activeConversationId: null }, pendingShareMessage: null, activeApp: 'dynamic' };
  const getCharacter = (name) => vars.phone_data.characters.find((c) => c.name === name || c.nickname === name);
  const api = {
    KI: (name) => getCharacter(name)?.name || name,
    nC: getCharacter,
    ev: (name) => `avatar:${name}`,
    wH: (name) => getCharacter(name)?.avatar || `avatar:${name}`,
    f6: () => vars.phone_data.characters.map((c) => ({ id: c.id, name: c.name, type: 'single', avatar: c.avatar })),
    FI: (name) => name,
  };
  const context = vm.createContext({
    T: store, A: api, r: () => ({ get: (o, key) => o[key] }),
    getVariables: () => vars,
    insertOrAssignVariables(value) { Object.assign(vars, value); writes++; },
    uuidV4: () => `${String(++id).padStart(8, '0')}-test`,
    console: { info() {}, warn() {}, error() {} },
    Date, String, Array,
  });
  vm.runInContext(['tL', 'iL', 'openPrivateChatWith', 'forumJumpWithPost'].map(extractFunction).join('\n'), context);
  const share = { title: '动态上下文', description: '正文和评论', type: 'browser-share' };
  assert.equal(context.openPrivateChatWith('苏夏', share), true);
  assert.equal(vars.phone_data.characters.length, 1);
  assert.equal(writes, 1);
  assert.equal(store.activeApp, 'chat');
  assert.equal(store.chat.chatList[0].name, '苏夏');
  assert.equal(store.chat.activeConversationId, vars.phone_data.characters[0].id);
  assert.equal(store.pendingShareMessage, share);
  context.openPrivateChatWith('苏夏', share);
  assert.equal(writes, 1, 'repeated entry does not duplicate contacts or storage writes');
  const rebuilt = api.f6();
  assert.equal(rebuilt.length, 1);
  assert.equal(rebuilt[0].id, store.chat.activeConversationId, 'conversation survives list reconstruction');
  assert.ok(generatePersona, 'persona saving handler found');
  let profileWrites = 0;
  const generatedProfile = { identity: '记者', personality: { keywords: ['好奇'] } };
  const personaContext = vm.createContext({
    personaLoading: { value: false }, persona: { value: null }, t: { userName: '苏夏' },
    __webpackRequire__: () => ({ fetchCharacterProfileFromAi: async () => ({ success: true, data: generatedProfile }) }),
    getVariables: () => vars,
    replaceVariables: async () => { profileWrites++; },
    X() {}, console: { warn() {} }, Date,
  });
  const savePersona = vm.runInContext(`(${generate(generatePersona).code})`, personaContext);
  await savePersona();
  assert.equal(profileWrites, 1);
  assert.equal(vars.phone_data.characters[0].profile.identity, '记者');
  assert.ok(vars.phone_data.characters[0].profile.generatedAt);
  const persisted = JSON.parse(JSON.stringify(vars));
  assert.equal(persisted.phone_data.characters[0].profile.identity, '记者', 'new contact persona survives persistence');
  const post = { title: '论坛帖子', author: '帖主', content: '原帖正文', comments: [{ name: '评论者', c: '评论内容' }] };
  context.forumJumpWithPost(post, post.comments[0]);
  assert.equal(store.chat.chatList.find((c) => c.id === store.chat.activeConversationId).name, '评论者');
  assert.ok(store.pendingShareMessage.description.includes('原帖正文'));
  assert.ok(store.pendingShareMessage.description.includes('评论内容'));
  assert.equal(context.openPrivateChatWith('', share), false);

  assert.ok(dynamicJump, 'dynamic click handler found');
  const targets = [];
  const dynamicContext = vm.createContext({
    A: api, Date, String, Array,
    j: (c) => c.name, ae: (name) => name,
    openPrivateChatWith: (name, payload) => targets.push({ name, payload }),
  });
  const jump = vm.runInContext(`(${generate(dynamicJump).code})`, dynamicContext);
  jump({ name: '帖主', content: '动态正文', comments: [{ name: '评论者', c: '动态评论' }] }, '评论者');
  assert.equal(targets[0].name, '评论者');
  assert.ok(targets[0].payload.description.includes('动态正文'));
  jump({ name: '我', isMyPost: true, content: '我的动态' }, '评论者');
  assert.equal(targets.length, 2, 'comments on own posts remain clickable');
  jump({ name: '我', isMyPost: true });
  assert.equal(targets.length, 2, 'own post avatar does not create a private chat');
}

async function testRealAvatars() {
  const { createAvatar } = await import('@dicebear/core');
  const imports = [...fs.readFileSync(path.join(__dirname, '..', 'src', 'modules', '2213.js'), 'utf8')
    .matchAll(/import \* as (\w+) from '([^']+)';/g)];
  const styles = {};
  for (const [, name, packageName] of imports) styles[name] = await import(packageName);
  const variables = { phone_data: { characters: [], randomAvatars: [], user: {} } };
  const lodash = { get: (object, key) => key.split('.').reduce((value, part) => value?.[part], object) };
  const dependencies = { 7856: {}, 2224: lodash, 8366: {}, 5849: { hg: [], I1: [] }, 9852: {} };
  const requireModule = (id) => dependencies[id];
  requireModule.n = (value) => () => value;
  requireModule.d = (exports, getters) => Object.keys(getters).forEach((key) => Object.defineProperty(exports, key, { get: getters[key] }));
  const context = vm.createContext({ ...styles, createAvatar, getVariables: () => variables, btoa, unescape, encodeURIComponent, console });
  const factoryText = extractModuleFromSrc(2213).replace(/^2213\(/, 'function(');
  const factory = vm.runInContext(`(${factoryText})`, context);
  const exported = {};
  factory({ exports: exported }, exported, requireModule);
  const avatar = exported.wH('苏夏');
  assert.ok(avatar.startsWith('data:image/svg+xml;base64,'));
  assert.ok(!/[()'"\s]/.test(avatar), 'generated URI is safe in unquoted CSS url()');
  assert.ok(Buffer.from(avatar.split(',')[1], 'base64').toString('utf8').startsWith('<svg'));
  assert.equal(exported.wH('苏夏'), avatar, 'same name remains stable');
  variables.phone_data.characters.push({ name: '手动头像', avatar: 'https://example.invalid/avatar.png' });
  assert.equal(exported.wH('手动头像'), 'https://example.invalid/avatar.png');
}

(async () => {
  await testForumUpdates();
  console.log('✓ 真实 ForumPost + Vue：异步加载与后续重绘保留姓名、图标和点击');
  await testChatRegistration();
  console.log('✓ 真实跳转及联系人代码：陌生作者可进入、无重复写入、列表重建保留、评论目标正确');
  await testRealAvatars();
  console.log('✓ 真实 DiceBear 包：base64、CSS 安全、姓名稳定、手动头像优先');
})().catch((error) => { console.error(error); process.exitCode = 1; });
