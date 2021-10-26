<template>
  <div>
    <div class="form-wrapper">
      <wti-form
        label-width="100px"
        label-position="right"
        :fields="fields1"
        :showScanTypeBtn="true"
        :showAllFoldBtn="true"
        :showFoldBtn="true"
        :formItemCol="12"
        ref="form1"
      />
      <el-button type="primary" @click="submit('form1')">提交按钮</el-button>
      <el-button type="primary" @click="clearValidate('form1')">取消</el-button>
      <div>
        分割线-----------------------------------------------------------------------
      </div>
    </div>

    <div class="form-wrapper">
      <wti-form
        label-width="100px"
        label-position="right"
        :fields="fields2"
        :data="originData1"
        ref="form2"
      />
      <el-button type="primary" @click="submit2('form2')">提交按钮</el-button>
      <div>
        分割线-----------------------------------------------------------------------
      </div>
    </div>
    <div class="form-wrapper">
      <wti-form
        label-width="100px"
        label-position="right"
        :fields="fields3"
        :data="originData2"
        :text-model="true"
        ref="form3"
      />
      <el-button type="primary" @click="submit('form3')">提交按钮</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const that = this;
    return {
      ads: 20,
      originData1: {},
      originData2: {},
      fields3: [],
      fields2: [],
      fields1: [
        {
          label: "用户信息登记",
          class: {
            woshishui: true
          },
          children: [
            {
              key: "name",
              type: "input",
              label: "用户名称",
              // disableDefault: true,
              // span: 24,
              size: 24,
              class: {
                erjiclass: true
              },
              rules: [
                {
                  required: true,
                  message: "请输入",
                  trigger: ["blur", "change"]
                }
              ]
            },
            {
              options: [
                {
                  value: "male",
                  label: "男"
                },
                {
                  value: "female",
                  label: "女"
                }
              ],
              key: "gender",
              label: "性别",
              type: "radio",
              rules: [
                {
                  required: true,
                  message: "请选择",
                  trigger: ["blur", "change"]
                }
              ],
              valueLink: []
            },
            // {
            //   options: [
            //     {
            //       value: "自由职业者",
            //       label: "自由职业者"
            //     },
            //     {
            //       value: "体制内",
            //       label: "体制内"
            //     },
            //     {
            //       value: "打工人",
            //       label: "打工人"
            //     },
            //     {
            //       value: "其他",
            //       label: "其他"
            //     }
            //   ],
            //   key: "job",
            //   label: "职业",
            //   placeholder: "请选择",
            //   type: "normal-select"
            // },
            // {
            //   key: "money",
            //   type: "money-input",
            //   label: "定金",
            //   append: "元",
            //   rules: [
            //     {
            //       required: true,
            //       validator(rule, value, callback) {
            //         if (value > 22) {
            //           return callback(new Error("大于22了"));
            //         } else {
            //           console.log("this.ads====", that.ads);
            //           callback();
            //         }
            //       },
            //       trigger: ["blur", "change"]
            //     }
            //   ]
            // },
            // {
            //   key: "money2",
            //   type: "money-input",
            //   label: "定金2",
            //   append: "元"
            // },
            // {
            //   autoCompleteKeys: [],
            //   otherSearchKeys: [{ key: "id", value: "1231313213" }],
            //   searchUrl:
            //     "https://mock.mengxuegu.com/mock/6163a9208cf3bb7ca95955f4/ceshi/autocomplete",
            //   searchKey: "search",
            //   mainShowKey: "value",
            //   key: "code",
            //   label: "code码",
            //   placeholder: "请输入",
            //   type: "auto-complete-input",
            //   onSelect(row) {
            //     console.log("onSelect", row);
            //   },
            //   fetchSuggestions(data) {
            //     console.log("fetchSuggestions", data);
            //   }
            // },
            // {
            //   key: "reg_date",
            //   label: "注册时间",
            //   placeholder: "请输入",
            //   type: "date-input"
            // },
            // {
            //   key: "timearea",
            //   label: "有效范围",
            //   placeholder: "请输入",
            //   type: "date-range-input"
            // },
            // {
            //   key: "notice_time",
            //   label: "每日短信通知时刻",
            //   type: "hour-minute-input"
            // },
            // {
            //   key: "number_limit",
            //   type: "number-input",
            //   label: "数量限制",
            //   append: "个"
            // },
            {
              key: "dict_code",
              type: "dynamic-select",
              label: "这是一个字典下拉框",
              parentKey: "100",
              searchUrl: "/api/dict2",
              params: {
                parentKey: 100
              }
            },
            {
              key: "dict_code2",
              type: "dynamic-select",
              label: "这是一个字典下拉框2222",
              parentKey: "101",
              searchUrl: "/api/dict2",
              params: {
                parentKey: 101
              }
            },
            {
              key: "dict_code3",
              type: "mul-linkage",
              linkLevel: 3,
              span: 24,
              label: "这是一个联动下拉框",
              firstParentKey: "102"
            }
            // {
            //   key: "diqu",
            //   type: "mul-linkage",
            //   linkLevel: 3,
            //   label: "地区",
            //   firstParentKey: "diqu"
            // },
            // {
            //   key: "rate",
            //   type: "rate-input",
            //   label: "存款利率"
            // },
            // {
            //   key: "area",
            //   type: "mul-linkage",
            //   label: "三级联动下拉框，",
            //   linkLevel: 3,
            //   firstParentKey: "100"
            // },
            // {
            //   key: "address",
            //   type: "textarea",
            //   label: "详细地址",
            //   span: 24
            // }
            // {
            //   // key
            //   key: "testInput",
            //   // 小型表单
            //   type: "child-form",
            //   // 是否允许删除单个子表单，默认 true（允许）（未完成）
            //   deleteEnable: true,
            //   // 是否允许新增单个子表单，默认 true（允许）（未完成）
            //   addEnable: true,
            //   // 每个小表单头的文字部分，以及新增按钮的部分
            //   headerLabel: "面签人员信息",
            //   // 里面是表单的每一项，写法和外面的没区别
            //   childrenForm: [
            //     {
            //       key: "dict_code",
            //       type: "dynamic-select",
            //       label: "这是一个字典下拉框（想不出来用处了）",
            //       parentKey: "101"
            //     }
            //   ]
            // }
          ]
        }
        // {
        //   label: "用户测试表2",
        //   children: [
        //     {
        //       key: "mdm",
        //       type: "input",
        //       label: "马冬梅"
        //     }
        //   ]
        // }
      ]
    };
  },
  monted() {
    const that = this;
  },
  methods: {
    clearValidate(formName) {
      this.$refs[formName].clearValidate();
    },
    submit(formName) {
      this.$refs[formName].validate((isPass, data) => {
        if (isPass) {
          console.log("这是你刚提交的数据", data);
          setTimeout(() => {
            this.fields2 = JSON.parse(JSON.stringify(this.fields1));
            this.originData1 = Object.assign({}, data);
          }, 1000);
        } else {
          this.$message.error("校验失败！");
        }
      });
    },
    submit2(formName) {
      this.$refs[formName].validate((isPass, data) => {
        if (isPass) {
          console.log("这是你刚提交的数据", data);
          setTimeout(() => {
            this.fields3 = JSON.parse(JSON.stringify(this.fields2));
            this.originData2 = Object.assign({}, data);
          }, 1000);
        } else {
          this.$message.error("校验失败！");
        }
      });
    }
  }
};
</script>

<style>
.form-wrapper {
  width: 800px;
  margin: 0 auto;
  background: xxx repeat-y;
}
</style>
