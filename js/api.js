const API = (function () {
  const BASE_URL = "https://study.duyiedu.com";
  const TOKEN_KEY = "token";

  /**
   * get请求封装
   * @param {url地址} path
   * @returns
   */
  function get(path) {
    const headers = {};
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, { headers });
  }
  /**
   * post请求封装
   * @param {url地址} path
   * @param {请求体} bodyObj
   * @returns
   */
  function post(path, bodyObj) {
    const headers = {
      "Content-Type": "application/json",
    };
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      headers.authorization = `Bearer ${token}`;
    }
    return fetch(BASE_URL + path, {
      headers,
      method: "POST",
      body: JSON.stringify(bodyObj),
    });
  }
  /**
   * 注册
   * @param {用户信息} userInfo [登录id、登录密码、用户昵称]
   * @returns
   */
  async function reg(userInfo) {
    return await post("/api/user/reg", userInfo).then((resp) => resp.json());
  }
  /**
   * 登录
   * @param {登录信息} loginInfo [登录id、登录密码]
   * @returns
   */
  async function login(loginInfo) {
    const resp = await post("/api/user/login", loginInfo);
    const result = await resp.json();
    if (result.code === 0) {
      const token = resp.headers.get("authorization");
      localStorage.setItem(TOKEN_KEY, token);
    }
    return result;
  }
  /**
   * 是否存在
   * @param {用户id} loginId
   * @returns
   */
  async function exists(loginId) {
    return await get("/api/user/exists?loginId=" + loginId).then((resp) =>
      resp.json()
    );
  }
  /**
   * 用户
   * @returns
   */
  async function profile() {
    const resp = await get("/api/user/profile");
    return await resp.json();
  }
  /**
   * 发送聊天
   * @param {聊天内容} content
   * @returns
   */
  async function sendChat(content) {
    return await post("/api/chat", { content }).then((resp) => resp.json());
  }
  /**
   * 获得聊天记录
   * @returns
   */
  async function getHistory() {
    return await get("/api/chat/history").then((resp) => resp.json());
  }
  function loginOut() {
    localStorage.removeItem(TOKEN_KEY);
  }
  return {
    reg,
    login,
    exists,
    profile,
    sendChat,
    getHistory,
    loginOut,
  };
})();
