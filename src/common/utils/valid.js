export default {
  required: (message) => {
    if (!message) {
      message = '* 必填';
    }
    return { required: true, message: message, trigger: 'change' };
  },


  required_trigger: (message, trigger) => {
    return { required: true, message: message, trigger: trigger };
  },
  //输入类型规则
  required_type: (message, type) => {
    return { type: type, required: true, message: message, trigger: 'change' };
  },

}