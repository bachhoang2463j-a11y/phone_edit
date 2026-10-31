// webpack 模块 2178（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    DK: () => p,
    GO: () => m,
    Hg: () => s,
    Hx: () => l,
    J3: () => A,
    MW: () => C,
    Y3: () => i,
    dM: () => d,
    dp: () => a,
  });
  const a = () => ({
      version: 1,
      byName: {},
    }),
    o = (e) => ({
      traitsOverrideEnabled: !!e?.traitsOverrideEnabled,
      traitsTags: 'string' == typeof e?.traitsTags ? e.traitsTags : '',
      traitsNatural: 'string' == typeof e?.traitsNatural ? e.traitsNatural : '',
      referenceImageEnabled: !!e?.referenceImageEnabled,
      referenceImage: 'string' == typeof e?.referenceImage ? e.referenceImage : '',
      updatedAt: 'number' == typeof e?.updatedAt ? e.updatedAt : void 0,
    });
  function r(e) {
    const n = o(e);
    if (!(
      n.traitsOverrideEnabled ||
      n.referenceImageEnabled ||
      !!String(n.traitsTags || '').trim() ||
      !!String(n.traitsNatural || '').trim() ||
      !!String(n.referenceImage || '').trim()
    ))
      return null;
    const t = {
      traitsOverrideEnabled: n.traitsOverrideEnabled,
      traitsTags: n.traitsTags,
      traitsNatural: n.traitsNatural,
      referenceImageEnabled: n.referenceImageEnabled,
      referenceImage: n.referenceImage,
    };
    return ('number' == typeof n.updatedAt && (t.updatedAt = n.updatedAt), t);
  }
  const i = () => {
      try {
        const e = (function () {
          try {
            const e = getVariables({
                type: 'character',
              }),
              n = e?.phone_data?.characters;
            return Array.isArray(n) ? n : [];
          } catch {
            return [];
          }
        })();
        if (0 === e.length) return a();
        const n = {};
        return (
          e.forEach((e) => {
            const t = String(e?.name ?? '').trim();
            if (!t) return;
            const a = o(e?.imageGen);
            n[t] = a;
            const r = String(e?.nickname ?? '').trim();
            r && !(r in n) && (n[r] = a);
          }),
          {
            version: 1,
            byName: n,
          }
        );
      } catch {
        return a();
      }
    },
    s = (e) => {
      try {
        const n = getVariables({
            type: 'character',
          }),
          t =
            n?.phone_data && 'object' == typeof n.phone_data && !Array.isArray(n.phone_data)
              ? {
                  ...n.phone_data,
                }
              : {},
          a = Array.isArray(t.characters) ? t.characters : [];
        if (0 === a.length) return;
        const o = a.map((n) => {
          if (!n || 'object' != typeof n) return n;
          const t = String(n?.name ?? '').trim();
          if (!t) return n;
          const a = e?.byName?.[t];
          if (!a) return n;
          const o = r(a),
            i = {
              ...n,
            };
          return (o ? (i.imageGen = o) : delete i.imageGen, i);
        });
        ((t.characters = o),
          insertOrAssignVariables(
            {
              phone_data: t,
            },
            {
              type: 'character',
            },
          ));
      } catch (e) {
        console.warn('[CharacterPromptOverrides] 保存人物绘图信息失败(忽略):', e);
      }
    },
    l = '__user__';
  function c() {
    try {
      const e = getVariables({
          type: 'character',
        }),
        n = e?.phone_data?.user;
      if (n && 'object' == typeof n)
        return {
          name: String(n.name ?? '').trim() || '用户',
          nickname: n.nickname ? String(n.nickname).trim() : void 0,
          avatar: n.avatar ? String(n.avatar).trim() : void 0,
        };
    } catch {}
    try {
      const e = String(window.parent.SillyTavern?.name1 ?? '').trim();
      if (e)
        return {
          name: e,
        };
    } catch {}
    return {
      name: '用户',
    };
  }
  function A() {
    const e = c();
    return e.nickname || e.name || '用户';
  }
  function d() {
    return c().avatar || '';
  }
  function p() {
    try {
      const e = getVariables({
          type: 'character',
        }),
        n = e?.phone_data?.user?.imageGen;
      return o(n);
    } catch {
      return o(null);
    }
  }
  function C(e) {
    try {
      const n = getVariables({
          type: 'character',
        }),
        t =
          n?.phone_data && 'object' == typeof n.phone_data && !Array.isArray(n.phone_data)
            ? {
                ...n.phone_data,
              }
            : {},
        a =
          t.user && 'object' == typeof t.user
            ? {
                ...t.user,
              }
            : {},
        o = r(e);
      (o ? (a.imageGen = o) : delete a.imageGen,
        (t.user = a),
        insertOrAssignVariables(
          {
            phone_data: t,
          },
          {
            type: 'character',
          },
        ));
    } catch (e) {
      console.warn('[CharacterPromptOverrides] 保存用户绘图信息失败(忽略):', e);
    }
  }
  function m() {
    const e = i(),
      n = p();
    return (
      (function () {
        const e = c(),
          n = new Set();
        return (
          e.name && n.add(e.name),
          e.nickname && n.add(e.nickname),
          n.add('{{user}}'),
          n.add('用户'),
          Array.from(n)
        );
      })().forEach((t) => {
        e.byName[t] = n;
      }),
      e
    );
  }
}
