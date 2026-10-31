// webpack 模块 4660（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  function a() {
    const e = globalThis?.SillyTavern;
    return e && 'function' == typeof e.getRequestHeaders ? {
      ...e.getRequestHeaders(),
      'Content-Type': 'application/json'
    } : {
      'Content-Type': 'application/json'
    };
  }
  async function o(e, n) {
    const {
      mime: t,
      base64: o
    } = function (e) {
      const n = String(e ?? '').match(/^data:([^;]+);base64,(.*)$/);
      if (!n) throw new Error('图片数据格式错误（不是 data:*;base64,）');
      return {
        mime: n[1] || 'image/png',
        base64: n[2] || ''
      };
    }(e);
    if (!o) throw new Error('图片数据为空');
    const r = function (e) {
        const n = String(e ?? '').toLowerCase();
        return n.includes('image/jpeg') || n.includes('image/jpg') ? 'jpg' : n.includes('image/webp') ? 'webp' : (n.includes('image/png'), 'png');
      }(t),
      i = function (e) {
        const n = globalThis?.SillyTavern,
          t = 'string' == typeof n?.name2 ? n.name2.trim() : '';
        if (t) return t;
        return String(e ?? '').trim() || 'unknown';
      }(n?.characterName || ''),
      s = `${i}_${function () {
        const e = new Date(),
          n = (e, n = 2) => String(e).padStart(n, '0');
        return `${e.getFullYear()}-${n(e.getMonth() + 1)}-${n(e.getDate())}@${n(e.getHours())}h${n(e.getMinutes())}m${n(e.getSeconds())}s${n(e.getMilliseconds(), 3)}ms`;
      }()}.${r}`,
      l = await fetch('/api/images/upload', {
        method: 'POST',
        headers: a(),
        body: JSON.stringify({
          image: o,
          format: r,
          ch_name: i,
          filename: s
        })
      });
    if (!l.ok) {
      const e = await l.text().catch(() => '');
      throw new Error(e ? `上传图片失败: ${e}` : `上传图片失败: HTTP ${l.status}`);
    }
    const c = await l.json().catch(() => null),
      A = 'string' == typeof c?.path ? c.path : '';
    if (!A) throw new Error('上传图片失败：未返回图片路径');
    return A;
  }
  t.r(n), t.d(n, {
    uploadImageDataUrlToSillyTavern: () => o
  });
}
