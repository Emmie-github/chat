const loginIdValidator = new FieldValidator("txtLoginId", (val) => {
  if (!val) {
    return "请填写帐号";
  }
});

const loginPwdValidator = new FieldValidator("txtLoginPwd", (val) => {
  if (!val) {
    return "请填写密码";
  }
});
const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    loginPwdValidator
  );

  if (!result) {
    return; //验证未通过
  }
  const formData = new FormData(form);
  console.log(formData);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.login(data);
  if (resp.code === 0) {
    alert("登录成功,点击确定,跳转到首页");
    location.href = "./index.html";
  } else {
    loginIdValidator.p.innerText = "帐号或密码错误 ";
    loginPwdValidator.input.value = "";
  }
};
