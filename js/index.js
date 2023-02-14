// 机器人聊天
//1、验证是否有登录
(async function () {
  // 验证是否有登录，如果没有登录，跳转到登录页，如果有登录，获取到登录的用户信息
  const resp = await API.profile();
  const user = resp.data;
  if (!user) {
    alert("未登录或登录已过期,请重新登录");
    location.href = "./login.html";
  }
  const doms = {
    aside: {
      loginId: $("#loginId"),
      nickname: $("#nickname"),
    },
    chatContainer: $(".chat-container"),
    close: $(".close"),
    txtMsg: $("#txtMsg"),
    msgContainer: $(".msg-container"),
  };
  setUserInfo();
  // 2、登录后设置用户信息
  function setUserInfo() {
    doms.aside.loginId.innerText = user.loginId;
    doms.aside.nickname.innerText = user.nickname;
  }
  //3、 加载历史聊天记录
  await loadHistory();
  async function loadHistory() {
    const resp = await API.getHistory();
    for (const item of resp.data) {
      addChat(item);
    }
    scrollBottom();
  }
  //4、 添加聊天内容
  function addChat(chatInfo) {
    const div = $$$("div");
    div.classList.add("chat-item");
    if (chatInfo.from) {
      div.classList.add("me");
    }

    const img = $$$("img");
    img.classList.add("chat-avatar");
    img.src = chatInfo.from ? "./asset/avatar.png" : "./asset/robot-avatar.jpg";

    const content = $$$("div");
    content.className = "chat-content";
    content.innerText = chatInfo.content;

    const date = $$$("div");
    date.className = "chat-date";
    date.innerText = formatDate(chatInfo.createdAt);

    div.appendChild(img);
    div.appendChild(content);
    div.appendChild(date);
    doms.chatContainer.appendChild(div);
  }
  // 把时间戳格式化时间
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
  }
  // 聊天内容拉到底部
  function scrollBottom() {
    doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
  }
  // 5、发送消息
  async function sendChat() {
    const content = doms.txtMsg.value.trim();
    if (!content) {
      return;
    }
    // 我
    addChat({
      from: user.loginId,
      to: null,
      createdAt: Date.now(),
      content,
    });
    doms.txtMsg.value = "";
    scrollBottom();

    // 机器人
    const resp = await API.sendChat(content);
    addChat({
      from: null,
      to: user.loginId,
      ...resp.data,
    });
    scrollBottom();
  }
  //  window.sendChat = sendChat;

  // 6、 提交事件
  doms.msgContainer.onsubmit = (e) => {
    e.preventDefault();
    sendChat();
  };
  //7、  按钮退出事件
  doms.close.onclick = () => {
    API.loginOut();
    location.href = "./login.html";
  };
})();
