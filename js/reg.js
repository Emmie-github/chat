const loginIdValidator = new FieldValidator("txtLoginId", async (val) => {
  if (!val) {
    return "请填写帐号";
  }
  const resp = await API.exists(val);
  if (resp.data) {
    //该帐号已存在
    return "该帐号已被占用,请重新选择一个帐号名";
  }
});
const nicknameValidator = new FieldValidator("txtNickname", (val) => {
  if (!val) {
    return "请填写昵称";
  }
});
const loginPwdValidator = new FieldValidator("txtLoginPwd", (val) => {
  if (!val) {
    return "请填写密码";
  }
});
const loginPwdConfirmValidator = new FieldValidator(
  "txtLoginPwdConfirm",
  async (val) => {
    if (!val) {
      return "请填写确认密码";
    }
    if (val !== loginPwdValidator.input.value) {
      return "两次密码不一致";
    }
  }
);

const form = $(".user-form");
form.onsubmit = async (e) => {
  e.preventDefault();
  const result = await FieldValidator.validate(
    loginIdValidator,
    nicknameValidator,
    loginPwdValidator,
    loginPwdConfirmValidator
  );

  if (!result) {
    return; //验证未通过
  }
  const formData = new FormData(form);
  console.log(formData);
  const data = Object.fromEntries(formData.entries());
  const resp = await API.reg(data);
  if (resp.code === 0) {
    alert("注册成功,点击确定,跳转到登录页");
    location.href = "./login.html";
  }
};
