/**
 * Created by 刘阳 on 2021/6/11.

 * 功能说明：
 * 枚举字典
 */

const FormItemTypeText = {
    Input: "文本输入框",
    NormalSelect: "普通下拉框",
    Radio: "单选框",
    MoneyInput: "金额输入框",
    AutoCompleteOption: "输入搜索下拉框",
    DateInput: "日期输入框",
    DateRangeInput: "日期范围输入框",
    HourMinuteInput: "时分输入框",
    NormalNumber: "数字输入框",
    NumberInput: "千分位数字输入框",
    DynamicSelect: "字典下拉框",
    RateInput: "利率输入框",
    MulLinkage: "三级联动输入框",
    TextArea: "文本域输入框"
};

const TypeList = [
    {
        // 文本输入框
        label: FormItemTypeText.Input,
        value: "input"
    },
    {
        // 普通下拉框
        label: FormItemTypeText.NormalSelect,
        value: "normal-select"
    },
    {
        // 普通单选框
        label: FormItemTypeText.Radio,
        value: "radio"
    },
    {
        // 金额输入框
        label: FormItemTypeText.MoneyInput,
        value: "money-input"
    },
    {
        // 输入搜索下拉框
        label: FormItemTypeText.AutoCompleteOption,
        value: "auto-complete-input"
    },
    {
        // 日期输入框（年月日）
        label: FormItemTypeText.DateInput,
        value: "date-input"
    },
    {
        // 日期范围输入框（从 某年某月某日 ~ 某年某月某日）
        label: FormItemTypeText.DateRangeInput,
        value: "date-range-input"
    },
    {
        // 时间输入框（时分）（注：只能选时分，但实际值是时分秒）
        label: FormItemTypeText.HourMinuteInput,
        value: "hour-minute-input"
    },
    {
        // 数字输入框
        label: FormItemTypeText.NormalNumber,
        value: "normal-number"
    },
    {
        // 千分位数字输入框
        label: FormItemTypeText.NumberInput,
        value: "number-input"
    },
    {
        // 字典下拉框
        label: FormItemTypeText.DynamicSelect,
        value: "dynamic-select"
    },
    {
        // 利率输入框
        label: FormItemTypeText.RateInput,
        value: "rate-input"
    },
    {
        // 多级联动输入框
        label: FormItemTypeText.MulLinkage,
        value: "mul-linkage"
    },
    {
        // 文本域输入框
        label: FormItemTypeText.TextArea,
        value: "textarea"
    }
];

const GetTypeText = type => {
    let text = "";
    TypeList.forEach(item => {
        if (item.value === type) {
            text = item.label;
        }
    });
    return text;
};

export { FormItemTypeText, TypeList, GetTypeText };
