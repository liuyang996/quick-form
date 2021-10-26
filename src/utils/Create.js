import Vue from "vue";

// 创建函数接收要创建组件定义
function create(Component, props) {
  //1. Vue.extend
  // 创建构造函数
  const Ctor = Vue.extend(Component)
  // 创建组件实例
  const comp = new Ctor({ propsData: props })
  comp.$mount();
  document.body.appendChild(comp.$el);
  comp.remove = () => {
    document.body.removeChild(comp.$el);
    comp.$destroy();
  }
  //2. render
  // const vm = new Vue({
  //   render(h) {
  //     //render函数将传入组件配置对象转换为真实DOM
  //     console.log(h(Component, { props }));
  //     return h(Component, { props });
  //   }
  // }).$mount(); //执行挂载函数，但为指定挂载目标，只执行初始化。 如果直接挂载到body会替换页面内容

  // 将生成dom元素追加至body
  // document.body.appendChild(vm.$el);

  // //给组件实例添加销毁方法
  // const comp = vm.$children[0];
  // comp.remove = () => {
  //   document.body.removeChild(vm.$el);
  //   vm.$destroy();
  // }

  return comp
}

// 暴露调用接口
export default create