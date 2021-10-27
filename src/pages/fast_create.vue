<template>
  <div class="formitem-box">
    <h2>快捷创建表单 表单快捷配置区</h2>
    <p>
      在这里，你可以通过选择和填写，快速生成一个表单的配置，并在下方可以预览到你要看的表单
      及JSON
    </p>
    <div class="code-box">
      <div class="block-lv1" v-for="(field, index) in fields" :key="index">
        <!-- 区块层 -->
        <div>
          区块名：
          <el-input
            v-model="field.label"
            size="mini"
            class="input"
            placeholder="请输入区块名（非必须）"
          />
          <div
            class="block-lv2"
            v-for="(formItem, i) in field.children"
            :key="i"
          >
            <div>
              <span class="ele-index">元素{{ i + 1 }}：</span>
              KEY
              <el-input
                v-model="formItem.key"
                size="mini"
                class="input-mini"
                placeholder="请输入元素的 key"
              />
              LABEL
              <el-input
                v-model="formItem.label"
                size="mini"
                class="input-mini"
                placeholder="请输入元素的 LABEL"
              />
              TYPE
              <el-select v-model="formItem.type" size="mini">
                <el-option
                  v-for="item in TypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-switch
                v-if="formItem.rules.length > 0"
                :value="true"
                @change="setRequired(formItem)"
                active-text="必填"
                inactive-text="非必填"
              />
              <el-switch
                v-if="formItem.rules.length === 0"
                :value="false"
                @change="setRequired(formItem)"
                active-text="必填"
                inactive-text="非必填"
              />

              <el-button
                :disabled="field.children.indexOf(formItem) === 0"
                size="mini"
                @click="upItem(formItem, field.children)"
              >
                ▲
              </el-button>
              <el-button
                :disabled="
                  field.children.indexOf(formItem) === field.children.length - 1
                "
                size="mini"
                @click="downItem(formItem, field.children)"
              >
                ▼
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="deletItem(formItem, field.children)"
              >
                删除
              </el-button>
            </div>
          </div>
          <div class="block lv2" v-if="field.children.length === 0">
            暂无元素
          </div>
          <el-button size="mini" type="primary" @click="addEle(field.children)">
            新增元素
          </el-button>
        </div>
      </div>

      <div v-if="fields.length === 0" class="block">
        尚未添加区块
      </div>

      <div>
        新增区块：
        <el-input
          v-model="addBlockLabel"
          size="mini"
          class="input"
          placeholder="请输入区块名（非必须）"
        />
        <el-button
          size="mini"
          type="primary"
          :loading="addBlockLoading"
          @click="addBlock"
        >
          新增
        </el-button>
      </div>
    </div>

    <el-divider />

    <h3>表单预览区</h3>
    <p style="margin-bottom:10px;">这里将预览到你通过配置生成的表单</p>
    <wti-form ref="form" :fields="fields" />

    <el-divider />

    <h3>表单配置 JSON 代码</h3>
    <p style="margin-bottom:10px;">
      复制这里的代码，你将生成同样的表单。（注意，这里不含引入的代码）
    </p>

    <el-button style="margin-bottom:10px;" @click="updateCode" type="primary"
      >一键生成 JSON 代码、Vue 文件代码</el-button
    >
    <el-collapse class="collapse">
      <el-collapse-item>
        <template slot="title">
          <b>点击查看代码</b>
        </template>
        HTML 代码：
        <pre v-highlightjs v-if="showCode">
                    <code class="javascript">{{ htmlCode }}</code>
                </pre>
        <el-divider />
        JSON 配置：
        <pre v-highlightjs v-if="showCode" style="margin-top:20px;">
                    <code class="javascript">{{ fields }}</code>
                </pre>
        <el-divider />
        Vue 文件代码
        <pre v-highlightjs v-if="showCode" style="margin-top:20px;">
                    <code class="javascript">{{ vueCode }}</code>
                </pre>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { TypeList } from "./package/enum.js";

export default {
  name: "FastCreate",
  data() {
    return {
      htmlCode: "",

      fields: [
        {
          label: "",
          children: [
            {
              label: "",
              type: "input",
              rules: []
            }
          ]
        }
      ],

      vueCode: "",

      addBlockLabel: "",

      addBlockLoading: false,
      addEleLoading: false,

      showCode: false,

      TypeList
    };
  },
  methods: {
    addBlock() {
      if (this.addBlockLoading) {
        return;
      }
      this.addBlockLoading = true;
      this.fields.push({
        label: this.addBlockLabel,
        children: [
          {
            label: "",
            type: "input",
            rules: []
          }
        ]
      });
      this.addBlockLabel = "";
      setTimeout(() => {
        this.addBlockLoading = false;
      }, 500);
    },

    addEle(children) {
      if (this.addEleLoading) {
        return;
      }
      this.addEleLoading = true;
      children.push({
        label: "",
        type: "input",
        rules: []
      });
      this.addBlockLabel = "";
      setTimeout(() => {
        this.addEleLoading = false;
      }, 200);
    },

    setRequired(formItem) {
      if (formItem.rules.length > 0) {
        formItem.rules.splice(0, 1);
      } else {
        formItem.rules.push({
          required: true,
          message: "请输入",
          trigger: ["blur", "change"]
        });
      }
    },

    deletItem(formItem, children) {
      const i = children.indexOf(formItem);
      children.splice(i, 1);
    },

    upItem(formItem, children) {
      const i = children.indexOf(formItem);
      // 先移除
      children.splice(i, 1);
      // 再插入到原索引-1 的地方
      children.splice(i - 1, 0, formItem);
    },
    downItem(formItem, children) {
      const i = children.indexOf(formItem);
      children.splice(i, 1);
      children.splice(i + 1, 0, formItem);
    },

    updateCode() {
      // 强制更新一遍组件的内容
      // this.$forceUpdate();
      this.showCode = false;
      this.getVueCode();
      this.$nextTick(() => {
        this.showCode = true;
      });
    },

    // 获取 Vue 的 code
    getVueCode() {
      const htmlCode = `<template>
    <div class="">
        <wti-form ref="form"
                  :fields="fields"/>
    </div>
</template>`;

      let fields = JSON.stringify(this.fields, null, 4).split("\n");
      console.log("getVueCode-fields-----", fields);
      fields = fields
        .map((rowText, index) => {
          if (index === 0) {
            return rowText;
          } else {
            // 除了第一行，每行前面加 24 个空格，用于提高代码可阅读性
            return "                " + rowText;
          }
        })
        .join("\n");

      const scriptCode = `%3Cscript%3E
    export default {
        name: 'Input',
        data () {
            return {
                fields: ${fields}
            }
        },
        methods: {
            submit () {
                this.$refs.form.validate((isPass, data) => {
                    if (isPass) {
                        console.log('这是你刚提交的数据', data);
                    } else {
                        this.$message.error('校验失败！');
                    }
                });
            }
        }
    }
%3C%2Fscript%3E
%3Cstyle%20scoped%3E

%3C%2Fstyle%3E`;

      this.htmlCode = htmlCode;

      // console.log(decodeURIComponent(htmlCode + '\n' + scriptCode));
      this.vueCode = decodeURIComponent(htmlCode + "\n" + scriptCode);
    }
  }
};
</script>

<style scoped lang="less">
// pre {
//   color: #abb2bf;
//   background: #282c34;
// }
.input {
  width: 200px;
}

.input-mini {
  width: 160px;
}

.formitem-box {
  position: relative;
  width: 1100px;
  margin: 0 auto;
  padding-top: 20px;

  .code-box {
    position: relative;
    width: 100%;

    .block-lv1 {
      width: 100%;
      border: 1px solid #333;
      padding: 20px;
      margin: 20px 0;
      border-radius: 10px;
    }

    .block-lv2 {
      padding: 5px 0px;
      border-radius: 10px;

      .ele-index {
        display: inline-block;
        width: 80px;
      }
    }
  }

  .submit-line {
    margin: 10px 0;

    .tips {
      margin-left: 24px;
      font-size: 10px;
    }
  }

  .collapse {
    position: relative;
    width: 100%;

    .code {
      white-space: pre;
      background: #fafafa;
      border: 1px solid #ddd;
      padding: 10px;
      border-radius: 10px;
    }
  }
}
</style>
