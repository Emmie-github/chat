/**
 * 用户登录与注册表单项验证通用代码
 * 对某一个表单项进行验证的构造函数
 */
class FieldValidator {
  /**
   *
   * @param {String} txtId 文本框的id
   * @param {Function} validatorFun 验证规则函数,当需要对该文本进行验证时会调用该函数(函数的参数不当前文本框的值,函数的返回值为验证的错误消息.若没有返回表示无错误)
   */
  constructor(txtId, validatorFun) {
    this.input = $("#" + txtId);
    this.p = this.input.nextElementSibling;
    this.validatorFun = validatorFun;
    this.input.onBlur = () => {
      this.validate();
    };
  }
  /**
   * 验证成功返回true,失败返回false
   * @returns
   */
  async validate() {
    const err = await this.validatorFun(this.input.value);
    if (err) {
      this.p.innerText = err;
      return false;
    } else {
      this.p.innerText = "";
      return true;
    }
  }
  /**
   * 对传入的所有验证器进行统一的验证，如果所有的验证均通过，则返回true，否则返回false
   * @param  {FieldValidator[]} validators
   * @returns
   */
  static async validate(...validators) {
    const proms = validators.map((v) => v.validate());
    const result = await Promise.all(proms);
    return result.every((r) => r);
  }
}
