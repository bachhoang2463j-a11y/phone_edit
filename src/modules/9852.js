// webpack 模块 9852（提取自 phone_index_fixed.js）
export default function (e, n, t) {
  t.d(n, {
    Q: () => c,
    X: () => l
  });
  var a = t(4061);
  const o = 'phone_display_settings',
    r = {
      showOnInit: !0,
      showFloatingButton: !1,
      appendToLastMessage: !1,
      chatAppendToLastMessage: !1,
      historyReadCount: 100,
      emitGenerationEnded: !1,
      controlsInNotchArea: !1,
      useDateTimeVariables: !1,
      dateVariableBinding: null,
      timeVariableBinding: null,
      useChatVariables: !0
    },
    i = (0, a.ref)({
      ...r
    });
  let s = !1;
  function l() {
    const e = () => {
      try {
        localStorage.setItem(o, JSON.stringify(i.value)), console.info('[DisplaySettings] 设置已保存');
      } catch (e) {
        console.error('[DisplaySettings] 保存设置失败:', e);
      }
    };
    return {
      displaySettings: i,
      loadSettings: () => {
        if (s) return i.value;
        s = !0;
        try {
          const e = localStorage.getItem(o);
          if (e) {
            const n = JSON.parse(e);
            i.value = {
              showOnInit: n.showOnInit ?? r.showOnInit,
              showFloatingButton: n.showFloatingButton ?? r.showFloatingButton,
              appendToLastMessage: n.appendToLastMessage ?? r.appendToLastMessage,
              chatAppendToLastMessage: n.chatAppendToLastMessage ?? r.chatAppendToLastMessage,
              historyReadCount: n.historyReadCount ?? r.historyReadCount,
              emitGenerationEnded: n.emitGenerationEnded ?? r.emitGenerationEnded,
              controlsInNotchArea: n.controlsInNotchArea ?? r.controlsInNotchArea,
              useDateTimeVariables: n.useDateTimeVariables ?? r.useDateTimeVariables,
              dateVariableBinding: n.dateVariableBinding ?? r.dateVariableBinding,
              timeVariableBinding: n.timeVariableBinding ?? r.timeVariableBinding,
              useChatVariables: n.useChatVariables ?? r.useChatVariables
            };
          }
        } catch (e) {
          console.error('[DisplaySettings] 加载设置失败:', e);
        }
        return i.value;
      },
      saveSettings: e,
      updateSetting: (n, t) => {
        i.value[n] = t, e();
      }
    };
  }
  function c() {
    try {
      const e = localStorage.getItem(o);
      if (e) {
        const n = JSON.parse(e);
        return {
          showOnInit: n.showOnInit ?? r.showOnInit,
          showFloatingButton: n.showFloatingButton ?? r.showFloatingButton,
          appendToLastMessage: n.appendToLastMessage ?? r.appendToLastMessage,
          chatAppendToLastMessage: n.chatAppendToLastMessage ?? r.chatAppendToLastMessage,
          historyReadCount: n.historyReadCount ?? r.historyReadCount,
          emitGenerationEnded: n.emitGenerationEnded ?? r.emitGenerationEnded,
          controlsInNotchArea: n.controlsInNotchArea ?? r.controlsInNotchArea,
          useDateTimeVariables: n.useDateTimeVariables ?? r.useDateTimeVariables,
          dateVariableBinding: n.dateVariableBinding ?? r.dateVariableBinding,
          timeVariableBinding: n.timeVariableBinding ?? r.timeVariableBinding,
          useChatVariables: n.useChatVariables ?? r.useChatVariables
        };
      }
    } catch (e) {
      console.error('[DisplaySettings] 读取设置失败:', e);
    }
    return {
      ...r
    };
  }
}
