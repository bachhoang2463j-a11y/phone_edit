// webpack 模块 8846（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    B: () => s,
    v: () => i,
  });
  const a = '__tavern_helper_phone_simulated_generation_map__';
  function o() {
    const e = globalThis;
    let n = e[a];
    return (n || ((n = new Map()), (e[a] = n)), n);
  }
  function r(e) {
    const n = Date.now();
    for (const [t, a] of e) a <= n && e.delete(t);
  }
  function i(e, n) {
    if (!e) return !1;
    if ('number' != typeof n || n < 0) return !1;
    const t = o();
    r(t);
    const a = t.get(`${e}:${n}`);
    return 'number' == typeof a && a > Date.now();
  }
  async function s(e) {
    if (!('number' != typeof e || e < 0))
      try {
        (!(function (e) {
          try {
            const n = SillyTavern.getCurrentChatId?.();
            if (!n) return;
            const t = o();
            (r(t), t.set(`${n}:${e}`, Date.now() + 8e3));
          } catch (e) {
            console.warn('[SimulatedGeneration] 标记模拟生成事件失败(忽略):', e);
          }
        })(e),
          await eventEmit(tavern_events.GENERATION_STARTED, 'normal', {}, !1),
          console.info('[SimulatedGeneration] 已触发 GENERATION_STARTED 事件（模拟非quiet生成）'),
          await eventEmit(tavern_events.GENERATION_ENDED, e),
          console.info(`[SimulatedGeneration] 已触发 GENERATION_ENDED 事件，楼层 ${e}`));
      } catch (e) {
        console.warn('[SimulatedGeneration] 触发模拟生成事件失败(忽略):', e);
      }
  }
}
