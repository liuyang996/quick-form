<template>
    <div class="wti-form wti-form-v2" :class="{ 'border-form': borderForm }">
        <div class="scan-type" v-if="showAllFoldBtn || showScanTypeBtn">
            <!-- 全部收起展开 + 浏览模式切换 -->
            <div class="all-fold-btn" v-if="showAllFoldBtn && scanType === 'normal'" @click="foldAllBlock">
                <svg
                    v-if="!textModel"
                    t="1626835987585"
                    class="all-fold-icon"
                    viewBox="0 0 1024 1024"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2264"
                    width="14"
                    height="14"
                >
                    <circle cx="514" cy="514" r="512" stroke="#fff" stroke-width="50" fill="#EE473A" />
                    <path
                        d="M541.184 731.940571V373.76l166.326857 168.374857a29.147429 29.147429 0 1 0 41.179429-41.289143l-237.129143-237.750857-236.068572 236.836572a28.818286 28.818286 0 1 0 39.606858 41.837714l168.740571-167.899429v358.107429a28.708571 28.708571 0 0 0 57.344 0z"
                        fill="#fff"
                    />
                </svg>
                全部收起/展开
            </div>

            <div class="block-btn-list" v-if="showScanTypeBtn && scanType === 'single'">
                <template v-for="block in fields">
                    <div
                        class="block-btn"
                        :class="{ focus: singleScanBlock === block.label }"
                        v-if="block.label"
                        @click="() => (singleScanBlock = block.label)"
                        :key="block.label"
                    >
                        {{ block.label }}
                    </div>
                </template>
            </div>

            <div class="scan-type-btn" v-if="showScanTypeBtn" @click="changeScanType">
                <svg
                    t="1626835987585"
                    class="scan-type-icon"
                    viewBox="0 0 28 28"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    p-id="2264"
                    width="14"
                    height="14"
                >
                    <path d="M2 6 L9 2 L9 10 Z L25 6" stroke="#12182A" fill="#12182A" />
                    <path d="M26 22 L19 18 L19 26 Z L2 22" stroke="#12182A" fill="#12182A" />
                </svg>
                浏览模式切换
            </div>
        </div>

        <el-form
            ref="form"
            :model="formData"
            :hide-required-asterisk="textModel"
            :label-width="labelWidth || '150px'"
            :label-position="labelPosition ? labelPosition : 'top'"
        >
            <!-- 区块级，每个 filed 是一个区块 -->
            <div v-for="field in currentFileds" :key="field.label">
                <div
                    v-if="scanType === 'normal' || (scanType === 'single' && singleScanBlock === field.label)"
                    :class="getBlockClass(field)"
                    :style="field.style"
                >
                    <!-- 区块名 -->
                    <div v-if="field.label" class="block-title">
                        <div class="block-line"></div>
                        <span class="block-text" :id="field.id || String(Math.random() * 10000)">{{
                            field.label
                        }}</span>

                        <span
                            class="block-fold-btn"
                            v-if="
                                foldBlockList.indexOf(field.label) === -1 &&
                                    showFoldBtn &&
                                    !textModel &&
                                    scanType === 'normal'
                            "
                            @click="foldBlock(field)"
                        >
                            收起 <i class="el-icon-arrow-up"></i
                        ></span>
                        <span
                            class="block-fold-btn"
                            v-if="
                                foldBlockList.indexOf(field.label) > -1 &&
                                    showFoldBtn &&
                                    !textModel &&
                                    scanType === 'normal'
                            "
                            @click="foldBlock(field)"
                        >
                            展开 <i class="el-icon-arrow-down"></i>
                        </span>
                    </div>

                    <template v-for="(row, rowIndex) in getFieldRow(field.children)">
                        <el-row
                            :gutter="20"
                            :key="rowIndex"
                            class="block-content"
                            :class="{ 'block-hidden': foldBlockList.indexOf(field.label) > -1 }"
                        >
                            <template v-for="{ rowItem } in row">
                                <div :key="rowItem.key">
                                    <el-col :span="getColSize(rowItem)" :key="rowItem.key" :style="rowItem.style || {}">
                                        <el-form-item
                                            v-if="rowItem.type !== 'child-form'"
                                            :style="rowItem.style"
                                            :class="rowItem.class"
                                            :rules="rowItem.rules"
                                            :label="getFormItemLabel(rowItem)"
                                            :prop="rowItem.key"
                                        >
                                            <FormInput
                                                v-if="rowItem.type === 'input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormDate
                                                v-if="rowItem.type === 'date-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormHourMinute
                                                v-if="rowItem.type === 'hour-minute-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormDateRange
                                                v-if="rowItem.type === 'date-range-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormDictSelect
                                                v-if="rowItem.type === 'dynamic-select'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormNormalSelect
                                                v-if="rowItem.type === 'normal-select'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormNumberInput
                                                v-if="rowItem.type === 'number-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <!-- 动态下拉框，入参是父 key，根据父 key 自动加载列表内容 -->
                                            <FormAutoComplete
                                                v-if="rowItem.type === 'auto-complete-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormRadio
                                                v-if="rowItem.type === 'radio'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormTextarea
                                                v-if="rowItem.type === 'textarea'"
                                                v-bind="getProps(rowItem)"
                                                v-model="formData[rowItem.key]"
                                            />
                                            <FormMoneyInput
                                                v-if="rowItem.type === 'money-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormRateInput
                                                v-if="rowItem.type === 'rate-input'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormAreaSelect
                                                v-if="rowItem.type === 'area-select'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormMulLinkage
                                                v-if="rowItem.type === 'mul-linkage'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                            <FormNormalNumberInput
                                                v-if="rowItem.type === 'normal-number'"
                                                v-bind="getProps(rowItem)"
                                                v-model.trim="formData[rowItem.key]"
                                            />
                                        </el-form-item>

                                        <ChildForm
                                            v-if="rowItem.type === 'child-form'"
                                            :text-model="textModel"
                                            :ref="rowItem.key"
                                            :all-disabled="allDisabled"
                                            :item="rowItem"
                                            v-model.trim="formData[rowItem.key]"
                                        />

                                        <TableReadonly
                                            v-if="rowItem.type === 'table-readonly'"
                                            :ref="rowItem.key"
                                            :item="rowItem"
                                            v-model="formData[rowItem.key]"
                                        />
                                    </el-col>
                                </div>
                            </template>
                        </el-row>
                    </template>
                    <el-divider v-if="field.divider" />
                </div>
            </div>
            <!-- 表头加粗文字开始 -->
        </el-form>
    </div>
</template>

<script>
import axios from "axios";
import FormInput from "./form_item/form_input";
import FormTextarea from "./form_item/form_textarea";
import FormDictSelect from "./form_item/form_dict_select";
import FormNormalSelect from "./form_item/form_normal_select";
import FormDate from "./form_item/form_date";
import FormHourMinute from "./form_item/form_hour_minute";
import FormDateRange from "./form_item/form_date_range";
import FormAutoComplete from "./form_item/form_auto_complete";
import FormNumberInput from "./form_item/form_number_input";
import FormRadio from "./form_item/form_radio";
import FormMoneyInput from "./form_item/form_money_input";
import FormRateInput from "./form_item/form_rate_input";
import FormAreaSelect from "./form_item/form_area_select";
import FormMulLinkage from "./form_item/form_mul_linkage";
import FormNormalNumberInput from "./form_item/form_normal_number_input";
import TableReadonly from "./form_item/table_readonly";

import ChildForm from "./child_form";
import FormMixin from "./mixin";

export default {
    name: "WtiForm",
    mixins: [FormMixin],
    props: {
        fields: {
            type: Array,
            default: () => {
                return [];
            }
        },
        data: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 是否显示收起、展开按钮
        showFoldBtn: {
            type: Boolean,
            default: false
        },
        // 是否显示 全部收起、展开按钮
        showAllFoldBtn: {
            type: Boolean,
            default: false
        },
        // 是否显示浏览模式切换按钮
        showScanTypeBtn: {
            type: Boolean,
            default: false
        }
        // 数据字典的配置
    },
    data() {
        return {
            formData: {},

            currentFileds: [], // 中间态数据，依赖于 fields。当 fields 改变时，这个会跟着一起变。

            // 动态下拉列表里，所有选项。本对象的属性 key 是字典的父 key，值是数组，数组元素是对应的父 key 下所有字典
            dynamicDict: {},

            changeData: {
                // 所有动态数据，更准确的说，是会重新赋值的，需要放到 data 里，才能实现响应式。这是因为 provide 本身的特性导致的
                // 被禁用的所有元素列表。这里的数组元素是该要素的 key。
                disableList: [],
                allDisabled: this.allDisabled,

                // 隐藏的要素列表。这里的数组元素是该要素的 key。
                // 隐藏的要素，不进行校验。提交的时候，也要过滤掉
                hiddenKeyList: [],
                textModel: this.textModel
            },

            foldBlockList: [], // 收起的区块（放在这个里面，该区块就只显示区块标题，不显示内容）

            scanType: "normal", // normal 默认（大表单），single（表单只显示单个区块，上方显示所有区块的按钮组）
            singleScanBlock: "", // 单个模式时，显示哪个表单

            version: "1.0.0"
        };
    },
    created() {
        this.currentFileds = this.fields;

        this.initFormData();
        // 加载初始情况下，默认禁用的要素
        this.getDefaultDisableList();
        // 默认隐藏
        this.getDefaultHiddenList();
        // 动态加载需要数据字典的选项
        this.loadDynamicSelectOptions();
        this.initStatus();

        // 理论上，不应该动态添加 fileds。尽量 fields 通过事件，内部控制自己是否显示
        this.$watch("fields", v => {
            this.currentFileds = [];
            this.$nextTick(() => {
                this.currentFileds = v;
                this.getDefaultDisableList();
                this.getDefaultHiddenList();
                this.loadDynamicSelectOptions();
                this.initFormData();
                this.initStatus();
            });
        });

        this.$watch("data", () => {
            this.initFormData();
            this.initStatus();
        });
    },
    provide() {
        return {
            dynamicSelectOption: this.dynamicSelectOption,
            dynamicDict: this.dynamicDict,
            // 状态切换函数
            statusChangeFn: {
                // 设置为禁用
                setElementDisable: this.setElementDisable,
                // 设置为隐藏
                setElementHidden: this.setElementHidden,
                // 设置为必填
                setElementRequired: this.setElementRequired,
                // 更新其他数据
                updateFormData: this.updateFormData,
                valueUpdateEvent: this.valueUpdateEvent
            },
            // 会动态变化的数据（注意，来自 props【更上级组件】的数据，不能放这个里面，只能显式的通过 props 往下面传）
            changeData: this.changeData,
            formItemType: "",
            childChangeData: {}
        };
    },
    watch: {
        textModel(n) {
            this.$set(this.changeData, "textModel", n);
        }
    },
    methods: {
        // 监听值更新
        valueUpdateEvent(params) {
            this.$emit("updateValue", params);
        },

        // 初始化 formData 的值
        initFormData() {
            this.$set(this, "formData", {});
            // console.log('initFormData');
            // 用 fileds 初始化 formData 的 key
            this.fields.forEach(fields => {
                if (fields.children && fields.children instanceof Array) {
                    fields.children.forEach(field => {
                        // 处理初始值的问题
                        // 1. 如果该值在 data 里，则直接取 data 里的值（面对场景：数值回显）
                        if (field.key in this.data) {
                            this.$set(this.formData, field.key, this.data[field.key]);
                            // 赋值默认值的时候，触发事件通知上级
                            this.valueUpdateEvent({
                                [field.key]: this.data[field.key]
                            });
                        } else {
                            // 2. 不需要回显的场景下
                            // 2.1 如果该要素有默认值，则使用默认值
                            if (field.defaultValue) {
                                this.$set(this.formData, field.key, field.defaultValue);
                                // 赋值默认值的时候，触发事件通知上级
                                this.valueUpdateEvent({
                                    [field.key]: field.defaultValue
                                });
                            } else {
                                // 2.2 该要素没有默认值，使用通用默认值
                                if (field.type === "child-form" || field.type === "table-readonly") {
                                    this.$set(this.formData, field.key, []);
                                } else if (field.type === "area-select") {
                                    this.$set(this.formData, field.key, ["", "", ""]);
                                } else {
                                    this.$set(this.formData, field.key, "");
                                }
                            }
                        }
                    });
                }
            });
        },

        // 获取初始情况下，所有默认禁用要素
        getDefaultDisableList() {
            const disableList = [];
            // 遍历传入的数据
            this.fields.forEach(fields => {
                if (fields.children && fields.children instanceof Array) {
                    fields.children.forEach(field => {
                        // 如果是true，则添加到禁用列表里
                        if (field.disableDefault) {
                            disableList.push(field.key);
                        }
                    });
                }
            });

            this.changeData.disableList = disableList;
        },

        // 默认隐藏
        getDefaultHiddenList() {
            const hiddenList = [];
            // 遍历传入的数据
            this.fields.forEach(fields => {
                if (fields.children && fields.children instanceof Array) {
                    fields.children.forEach(field => {
                        // 如果是true，则添加到禁用列表里
                        if (field.hiddenDefault) {
                            hiddenList.push(field.key);
                        }
                    });
                }
            });

            this.changeData.hiddenKeyList = hiddenList;
        },

        // 对一个 block 下的要素，进行 el-row 的分行
        getFieldRow(children) {
            // 一个二维数组，每个数组要素是 el-row 的一行
            const list = [];
            if (!children) {
                return list;
            }
            children.forEach(item => {
                // 如果当前要素不显示，则直接跳过
                if (!this.isShow(item)) {
                    return;
                }
                const currentSpan = this.getColSize(item);
                // 如果初始为空
                if (list.length === 0) {
                    const obj = {
                        // 获取到他有多少 span，满 24 为一行
                        span: currentSpan,
                        rowItem: item
                    };
                    list.push([obj]);
                    return;
                }
                // 如果初始不为空，
                // 1、判断有没有打开 （当前这个的）【默认在新行第一列】开关
                // 又或者是当前是不是子表单（item.type === 'child-form'表示是子表单）
                if (item.nextRowFirst || item.type === "child-form" || item.type === "table-readonly") {
                    // 如果是新行第一列，那么直接把这个添加到 list 里面
                    const obj = {
                        // 获取到他有多少 span，满 24 为一行
                        span: currentSpan,
                        rowItem: item
                    };
                    list.push([obj]);
                    return;
                }
                // 2、判断（上一个）【默认是本行最后一列】开关是否打开
                // 先拿到最后一行
                const listLastItem = list[list.length - 1];
                // 的最后一个是否打开了这个开关
                if (listLastItem[listLastItem.length - 1].rowItem.currentRowLast) {
                    // 如果打开这个开关，那么当前这个直接放到下一行的第一个
                    const obj = {
                        // 获取到他有多少 span，满 24 为一行
                        span: currentSpan,
                        rowItem: item
                    };
                    list.push([obj]);
                    return;
                }

                // 下拉正常计算 span 来决定是否换行
                // 那么计算 list 最后一个数组里面所有加起来的 span 的值
                const lastTotalSpan = list[list.length - 1]
                    .map(item => item.span)
                    .reduce((lastTotal, currentItem) => {
                        return lastTotal + currentItem;
                    });

                // 如果已经大于等于 24 了，说明满了一行，那么直接创建新行
                // 或者是当前这个加之前的大于 24，那么说明这个放在之前那行超过 24，所以也要放到新行去
                if (lastTotalSpan >= 24 || lastTotalSpan + currentSpan > 24) {
                    const obj = {
                        // 获取到他有多少 span，满 24 为一行
                        span: currentSpan,
                        rowItem: item
                    };
                    list.push([obj]);
                    return;
                } else {
                    // 此时说明当前这个可以放到之前哪一行
                    const obj = {
                        // 获取到他有多少 span，满 24 为一行
                        span: currentSpan,
                        rowItem: item
                    };
                    list[list.length - 1].push(obj);
                }
            });
            return list;
        },

        // 设置某个要素禁用
        // key：操作的 key
        // beDisable：必填，默认是 true，表示禁用。而 false，表示取消禁用
        setElementDisable(key, beDisable = true) {
            // 设置禁用
            if (beDisable) {
                // 已经禁用了，则跳过。否则则添加进去
                if (this.changeData.disableList.indexOf(key) === -1) {
                    this.changeData.disableList.push(key);
                }
            } else {
                // 取消禁用
                // 未禁用则跳过。已经禁用，则继续
                const index = this.changeData.disableList.indexOf(key);
                if (index > -1) {
                    this.changeData.disableList = [
                        ...this.changeData.disableList.slice(0, index),
                        ...this.changeData.disableList.slice(index + 1)
                    ];
                }
            }
        },

        // 设置某个要素隐藏
        // key：操作的 key
        // beHidden：必填，默认是 true，表示隐藏。而 false，表示取消隐藏
        setElementHidden(key, beHidden = true) {
            // 设置隐藏
            if (beHidden) {
                // 已经隐藏了，则跳过。否则则添加进去
                if (this.changeData.hiddenKeyList.indexOf(key) === -1) {
                    this.changeData.hiddenKeyList.push(key);
                }
            } else {
                // 取消隐藏
                // 未隐藏则跳过。已经隐藏，则继续
                const index = this.changeData.hiddenKeyList.indexOf(key);
                if (index > -1) {
                    this.changeData.hiddenKeyList = [
                        ...this.changeData.hiddenKeyList.slice(0, index),
                        ...this.changeData.hiddenKeyList.slice(index + 1)
                    ];
                }
            }
        },

        // 设置某个要素必填
        // key：操作的 key
        // beHidden：必填，默认是 true，表示必填。而 false，表示取消必填
        setElementRequired(key, beRequired = true) {
            // 设置必填
            if (beRequired) {
                // 先找到这个要素，如果其本身必填，则跳过。
                // 遍历传入的数据
                this.fields.forEach(fields => {
                    if (fields.children && fields.children instanceof Array) {
                        fields.children.forEach(field => {
                            // 如果 key 不匹配，则跳过
                            if (field.key !== key) {
                                return;
                            }
                            // 先判断有没有 rules 这个属性，没有则添加这个属性，并且添加必填项然后返回
                            if (!field.rules) {
                                this.$set(field, "rules", [
                                    {
                                        required: true,
                                        message: "请输入",
                                        trigger: ["blur", "change"]
                                    }
                                ]);
                                return;
                            }

                            // 遍历 其 rules，
                            const { rules } = field;
                            // 是否有 required 这条规则
                            let haveRequired = false;
                            // 是否已修改
                            let changed = false;
                            rules.forEach(rule => {
                                // 如果有 required 属性
                                if ("required" in rule) {
                                    haveRequired = true;
                                    // 如果值为 true，则跳过
                                    if (rule.required) {
                                        return;
                                    } else {
                                        // 否则修改其为 true
                                        rule.required = true;
                                        changed = true;
                                    }
                                }
                            });
                            // 如果已修改，那么说明没必要继续操作了，跳过
                            if (changed) {
                                return;
                            }
                            // 如果没修改，并且没有必填规则
                            // （注意，如果有规则，那么必然已修改。所以只存在有规则已修改、未修改有规则、未修改无规则三种情况）
                            if (!haveRequired) {
                                // 添加规则
                                rules.push({
                                    required: true,
                                    message: "请输入",
                                    trigger: ["blur", "change"]
                                });
                            }
                        });
                    }
                });
            } else {
                // 取消必填
                // 不含必填规则的话，则跳过。如果含必填规则，则删除
                this.fields.forEach(fields => {
                    if (fields.children && fields.children instanceof Array) {
                        fields.children.forEach(field => {
                            // 如果 key 不匹配，则跳过
                            if (field.key !== key) {
                                return;
                            }

                            // 先判断有没有 rules 这个属性，没有则添加这个属性，并且添加必填项然后返回
                            if (!field.rules) {
                                return;
                            }
                            // 如果有，则遍历并删除
                            let i = -1;
                            field.rules.forEach((rule, index) => {
                                if ("required" in rule) {
                                    i = index;
                                }
                            });
                            if (i !== -1) {
                                field.rules.splice(i, 1);
                            }
                        });
                    }
                });
            }
        },

        // 初始化要素的 隐藏/显示、禁用/非禁用 状态等
        // 在父组件 data 更新的时候，调用这个方法
        initStatus() {
            // 遍历传入的数据
            this.fields.forEach(fields => {
                if (fields.children && fields.children instanceof Array) {
                    fields.children.forEach(field => {
                        // 如果有联动项，那么则遍历每个联动项
                        if (field.valueLink && field.valueLink.length && field.valueLink.length > 0) {
                            const { key } = field;
                            const v = this.data[key];
                            // 遍历
                            field.valueLink.forEach(linkItem => {
                                // 如果联动项的触发值不匹配，则跳过这一条
                                if (v !== linkItem.value) {
                                    return;
                                }
                                // 此时匹配，判断 linkList 有没有
                                if (linkItem.linkList && linkItem.linkList.length && linkItem.linkList.length > 0) {
                                    // 再遍历
                                    linkItem.linkList.forEach(triggerItem => {
                                        const linkKey = triggerItem.linkKey;
                                        // 如果没有联动 key，则跳过（正常来说，不会没有）
                                        if (!linkKey) {
                                            return;
                                        }
                                        // 如果联动值，则更新值
                                        if (triggerItem.enableLinkValue) {
                                            this.updateFormData({ [linkKey]: triggerItem.linkValue });
                                        }
                                        // 如果联动禁用/取消禁用，则更新禁用
                                        if (triggerItem.enableLinkDisable) {
                                            this.setElementDisable(linkKey, triggerItem.linkDisable);
                                        }
                                        // 如果联动隐藏/显示，则更新
                                        if (triggerItem.enableLinkHidden) {
                                            this.setElementHidden(linkKey, triggerItem.linkHidden);
                                        }
                                        // 如果联动必填/非必填，则更新
                                        if (triggerItem.enableLinkRequired) {
                                            this.setElementRequired(linkKey, triggerItem.linkRequired);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        },

        // 找到 type="dynamic-select" 获取所有 parentCode，然后读取数据字典接口拉取对应的数据
        // todo 这里的数据字典请求接口，应该最后合并到一起，由一个专门的数据字典请求管理器去请求，减低接口重复请求的情况
        loadDynamicSelectOptions() {
            const parentCodeList = [],
                paramsAndUrlList = [];
            // 遍历传入的数据
            this.fields.forEach(fields => {
                if (fields.children && fields.children instanceof Array) {
                    fields.children.forEach(field => {
                        if (field.type === "dynamic-select" && field.parentKey) {
                            if (field.searchUrl) {
                                paramsAndUrlList.push({
                                    searchUrl: field.searchUrl,
                                    params: field.params,
                                    parentKey: field.parentKey
                                });
                            }
                            // 再做一次去重判断。如果该字典已经在里面了，再跳过这一个
                            if (parentCodeList.indexOf(field.parentKey) === -1) {
                                if (
                                    !(
                                        this.dynamicDict[field.parentKey] &&
                                        this.dynamicDict[field.parentKey].length !== 0
                                    )
                                ) {
                                    parentCodeList.push(field.parentKey);
                                    // 初始化一个数组
                                    this.$set(this.dynamicDict, field.parentKey, []);
                                }
                            }
                        }
                    });
                }
            });
            if (parentCodeList.length === 0) {
                return;
            }
            // 进行批量请求(多个接口-返回所有的字典请求数据)
            this.dynamicSelectBatch(paramsAndUrlList);
        },
        //多次请求-分批返回所有的字典请求数据
        dynamicSelectBatch(paramsAndUrlList) {
            console.log("paramsAndUrlList--", paramsAndUrlList);
            const result = [];
            paramsAndUrlList.forEach(item => {
                this.getSingleData(item);
            });
        },

        getSingleData(paramsItem) {
            axios
                .post(this.dynamicSelectOption.dictUrl + paramsItem.searchUrl, paramsItem.params)
                .then(res => {
                    // 兼容性处理
                    let data;
                    if (res.request && res.headers) {
                        data = res.data;
                    } else {
                        data = res;
                    }
                    if (data.code === 200) {
                        if (this.dynamicDict[paramsItem.parentKey].length > 0) {
                            this.$set(this.dynamicDict, paramsItem.parentKey, []);
                        }
                        // 加载到结果
                        this.$set(this.dynamicDict, paramsItem.parentKey, data.data);
                    } else {
                    }
                })
                .catch(e => {
                    console.log("e-", e);
                    this.$message.error("数据字典加载错误，请刷新页面重试");
                });
        },
        // 清空校验信息
        clearValidate() {
            this.$refs.form.clearValidate();
        },

        // 获取过滤后的数据
        getData() {
            const d = {};
            Object.keys(this.formData)
                .filter(key => {
                    // 走正常逻辑
                    if (this.changeData.hiddenKeyList.indexOf(key) > -1) {
                        return false;
                    } else {
                        return true;
                    }
                })
                .forEach(key => {
                    // 这里分为两种情况：
                    // 第一种是一级表单的元素，他在被隐藏时，key是可以直接从 hiddenKeyList 获取的
                    // 第二种是子表单的元素。因为他的 key 是三段拼接起来的 key，所以要去子表单里拿到 randomId 再做一个映射
                    // 某个属性是否是子表单的判断条件是：遍历 fields，判断他是否是 type === 'child-form'
                    let childFormKeysList = [];
                    this.fields
                        .map(field => {
                            const list = [];
                            field.children.forEach(item => {
                                if (item.type === "child-form") {
                                    list.push(item.key);
                                }
                            });
                            return list;
                        })
                        .filter(list => {
                            return list.length > 0;
                        })
                        .forEach(list => {
                            childFormKeysList = [...childFormKeysList, ...list];
                        });
                    if (childFormKeysList.indexOf(key) > -1) {
                        // 说明是在子表单
                        d[key] = this.$refs[key][0].childFormFileds.map((childField, index) => {
                            const childD = {};
                            const { randomId } = childField;
                            childField.forEach(childItem => {
                                const childKey = childItem.key;
                                const keyText = `${key}_${randomId}_${childKey}`;
                                if (this.changeData.hiddenKeyList.indexOf(keyText) > -1) {
                                    return;
                                } else {
                                    childD[childKey] = this.formData[key][index][childKey];
                                }
                            });
                            return childD;
                        });
                    } else {
                        // 走正常逻辑
                        d[key] = this.formData[key];
                    }
                });
            return d;
        },

        // 校验，并获取校验后数据
        validate(fn) {
            // 先校验父级表单的值
            this.$refs.form.validate(valid => {
                // 对数据进行过滤
                const data = this.getData();

                // 判断是否需要校验子表单
                const childFormKeyList = [];
                this.fields.forEach(filed => {
                    if (filed.children && filed.children.length > 0) {
                        filed.children.forEach(formItem => {
                            // 如果某一项是
                            if (formItem.type === "child-form") {
                                childFormKeyList.push(formItem.key);
                            }
                        });
                    }
                });

                if (childFormKeyList.length === 0) {
                    if (valid) {
                        fn(true, data);
                    } else {
                        fn(false, data);
                    }
                } else {
                    const validateList = childFormKeyList.map(key => {
                        return this.$refs[key][0].validateForm();
                    });
                    Promise.all(validateList)
                        .then(() => {
                            // 父表单校验也通过了，才算都通过
                            if (valid) {
                                fn(true, data);
                            } else {
                                // 否则即使子表单校验通过，父表单校验没通过，也是算不通过的
                                fn(false, data);
                            }
                        })
                        .catch(() => {
                            fn(false, data);
                        });
                }
            });
        },

        // 重置表单数据
        resetFields() {
            this.$refs.form.resetFields();
            this.fields.forEach(filed => {
                if (filed.children && filed.children.length > 0) {
                    filed.children.forEach(formItem => {
                        // 如果某一项是
                        if (formItem.type === "child-form") {
                            const a = this.$refs[formItem.key];
                            if (a instanceof Array) {
                                a[0].resetFields();
                            } else {
                                a.resetFields();
                            }
                        }
                    });
                }
            });
        },

        // 表单组件是否显示
        isShow(item) {
            // 如果该要素在隐藏列表里，则不显示
            if (this.changeData.hiddenKeyList.indexOf(item.key) > -1) {
                return false;
            }
            return true;
        },

        // 更新数据
        updateFormData(data) {
            Object.keys(data).forEach(key => {
                // 如果 key 在值里面
                if (key in this.formData) {
                    // 则回填这个值
                    this.$set(this.formData, key, data[key]);
                }
            });
        },

        // 收起/展开区块
        foldBlock(block) {
            const label = block.label;
            const index = this.foldBlockList.indexOf(label);
            if (index === -1) {
                this.foldBlockList.push(block.label);
            } else {
                this.foldBlockList.splice(index, 1);
            }
        },

        // 收起展开所有区块
        foldAllBlock() {
            const labelList = [];
            this.fields.forEach(block => {
                // 如果没有 label，则不支持收起
                if (block.label) {
                    labelList.push(block.label);
                }
            });
            // 如果长度相等，说明已经全部收起了，那么就是展开
            if (this.foldBlockList.length === labelList.length) {
                this.foldBlockList = [];
            } else {
                this.foldBlockList = labelList;
            }
        },

        // 浏览模式切换
        changeScanType() {
            if (this.scanType === "normal") {
                this.scanType = "single";
                // 如果切换为单体，那么将所有隐藏的显示出来
                this.foldBlockList = [];
                this.singleScanBlock = this.fields[0].label;
            } else {
                this.scanType = "normal";
                this.singleScanBlock = "";
            }
        },

        getProps(rowItem) {
            return {
                ref: rowItem.key,
                item: rowItem,
                allDisabled: this.allDisabled
            };
        }
    },
    components: {
        FormInput,
        FormDictSelect,
        FormDate,
        FormHourMinute,
        FormDateRange,
        FormNumberInput,
        FormAutoComplete,
        FormRadio,
        FormTextarea,
        FormNormalSelect,
        FormMoneyInput,
        FormRateInput,
        FormAreaSelect,
        FormMulLinkage,
        FormNormalNumberInput,

        TableReadonly,
        ChildForm
    }
};
</script>

<style scoped lang="less">
.wti-form {
    width: 100%;

    .el-input__inner {
        height: 36px !important;
        line-height: 36px !important;
        border: 1px solid #e2e3e6 !important;
    }

    .block-title {
        position: relative;
        height: 50px;
        padding-top: 10px;
        padding-bottom: 24px;
        font-size: 16px;

        // label 左边的红色竖线
        .block-line {
            float: left;
            width: 4px;
            height: 16px;
            background: #ee473a;
            border-radius: 2px;
            display: inline-block;
        }

        .block-text {
            margin-left: 10px;
            float: left;
            height: 16px;
            font-size: 16px;
            color: #21273a;
            font-weight: 600 !important;
            vertical-align: top;
            line-height: 16px;
        }

        .block-fold-btn {
            float: right;
            margin-right: 30px;
            height: 16px;
            line-height: 16px;
            font-size: 14px;
            cursor: pointer;
            user-select: none;
        }
    }
}

// 带边框的表单组件
.border-form {
    .block-item {
        border: 1px solid #dde0ea;
        border-radius: 8px;
        margin-bottom: 40px;
        background: #fff;
        padding-bottom: 15px;

        .block-title {
            height: 60px;
            line-height: 60px;
            background: #f8f9fb;
            padding: 20px 0 18px 24px;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .block-title + .block-content {
            padding-top: 14px;
        }

        .block-content {
            padding: 0 24px;
        }

        .block-hidden {
            display: none;
        }
    }
}

.el-divider {
    background-color: #f4f5f8;
}

.scan-type {
    position: relative;
    height: 36px;
    line-height: 36px;
    margin-bottom: 16px;

    .all-fold-btn {
        display: inline-block;
        padding: 0 20px;
        height: 36px;
        background: #ee473a;
        border: 1px solid #ee473a;
        border-radius: 4px;
        color: #fff;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        vertical-align: top;

        .all-fold-icon {
            width: 14px;
            height: 14px;
            vertical-align: top;
            margin-top: 11px;
        }
    }

    .block-btn-list {
        float: left;

        .block-btn {
            border: 1px solid #dde0ea;
            height: 36px;
            line-height: 36px;
            padding: 0 18px;
            color: #3a4566;
            display: inline-block;
            cursor: pointer;
            user-select: none;
        }

        .block-btn.focus {
            background: #ee473a;
            color: #fff;
        }

        .block-btn:first-child {
            border-radius: 4px 0 0 4px;
        }

        .block-btn:last-child {
            border-radius: 0 4px 4px 0;
        }
    }

    .scan-type-btn {
        display: inline-block;
        float: right;
        padding: 0 20px;
        height: 36px;
        border: 1px solid #aeb3bf;
        border-radius: 4px;
        color: #12182a;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
        vertical-align: top;
        user-select: none;

        .scan-type-icon {
            width: 14px;
            height: 14px;
            vertical-align: top;
            margin-top: 11px;
        }
    }
}

.wti-form-v2 /deep/ input::-webkit-outer-spin-button,
.wti-form-v2 /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
}

.wti-form-v2 /deep/ input[type="number"] {
    -webkit-appearance: none;
    appearance: none;
}

.wti-form-v2 /deep/ input[type="number"] {
    -moz-appearance: textfield;
}
</style>
