import type {InputProps,SwitchProps,TreeProps,SelectProps,InputNumberProps} from 'antd';
// export interface UxFormProps {
//   /** 表单提交回调 */
//   onSubmit?: (data: Record<string, any>) => Promise<unknown>;
//   form:UxFormType;

//   data:UxFormData;
// }
type AnyObj = Record<string, any>;

/**
 * Description placeholder
 *
 * @export
 * @interface UxFormProps
 * @typedef {UxFormProps}
 * @template {UxFormData} [T=UxFormData]
 */
export interface UxFormProps<T extends UxFormData = UxFormData> {
  /** 表单提交回调 */
  onSubmit: (data: T) => Promise<unknown>;
  /**
   * 表单取消回调
   *
   * @type {()=>void}
   */
  onCancel:()=>void;
  form: UxFormType;
  data: T;
  name:string;
  whiteKeys?:string[];
}


/**
 * 表单初始数据类型
 *
 * @export
 * @typedef {UxFormData}
 */
export type UxFormData = Record<string,any>;
export type UxFormType = Record<string,UxFormItem>;
// const commonEditForm = {
//      role_name: {
//         type: 'input',
//         'message': '请填写名称',
//         'required': true,
//         'value': '',
//         label: '名称'
//       },
//       role_key: {
//         type: 'input',
//         'message': '请填写标识',
//         'required': true,
//         'value': '',
//         label: '标识',
//       },
//       role_sort: {
//         type: 'input',
//         'value': 0,
//         label: '排序',
//         formatter: (value) => Number(value)
//       },
//       status: {
//         type: 'switch',
//         'value': "1",
//         label: '状态',
//         map: {
//           false: "1",
//           true: "0"
//         }
//       },
//       menu_check_strictly: {
//         type: 'switch',
//         'value': 0,
//         label: '菜单树选择项是否关联显示',
//         map: {
//           false: 0,
//           true: 1
//         }
//       },
//       dept_check_strictly: {
//         type: 'switch',
//         'value': 0,
//         label: '部门树选择项是否关联显示',
//         map: {
//           false: 0,
//           true: 1
//         }
//       },
//       menu_ids: {
//         type: 'tree',
//         'label': '权限',
//         'treeData': menuTree,
//         'value': [],
//         'fieldNames': {
//           'title': 'menu_name',
//           'key': 'menu_id',
//           children: 'children'
//         }
//       },
//       remark: {
//         type: 'textarea',
//         'message': '请填写备注',
//         'value': '',
//         label: '备注'
//       },
//   }
export type CommonFormItem = {
   message?:string;
   required?:boolean;
   label:string;
   value:any;
   formatter?:(value:any)=>any;
}
export type UxFormItem = UxFormInput | UxFormSwitch | UxFormTree | UxFormSelect | UxFormInputNumber|UxFormTextarea


/**
 * 文本输入
 *
 * @export
 * @interface UxFormInput
 * @typedef {UxFormInput}
 * @extends {CommonFormItem}
 */
export interface UxFormInput extends CommonFormItem {
  type:'input'
  nativeProps?:InputProps
}

/**
 * 开关控件
 *
 * @export
 * @interface UxFormSwitch
 * @typedef {UxFormSwitch}
 * @extends {CommonFormItem}
 */
export interface UxFormSwitch extends Omit<CommonFormItem,'formatter'> {
  type:'switch'
  nativeProps?:SwitchProps;
  map:{
    false:any;
    true:any;
  }
}

/**
 * 树形复选
 *
 * @export
 * @interface UxFormSelect
 * @typedef {UxFormSelect}
 * @extends {CommonFormItem}
 */
export interface UxFormTree extends CommonFormItem {
  type:'tree'
  nativeProps?:TreeProps;
}


/**
 * 下拉选择
 *
 * @export
 * @interface UxFormSelect
 * @typedef {UxFormSelect}
 * @extends {CommonFormItem}
 */
export interface UxFormSelect extends CommonFormItem {
  type:'select'
  nativeProps?:SelectProps
}


/**
 * 数字输入
 *
 * @export
 * @interface UxFormInputNumber
 * @typedef {UxFormInputNumber}
 * @extends {CommonFormItem}
 */
export interface UxFormInputNumber extends CommonFormItem {
  type:'inputNumber'
  nativeProps?:InputNumberProps
}
/**
 * 数字输入
 *
 * @export
 * @interface UxFormTextarea
 * @typedef {UxFormTextarea}
 * @extends {CommonFormItem}
 */
export interface UxFormTextarea extends CommonFormItem {
  type:'textarea'
  nativeProps?:InputProps & {
    autoSize?:{
      minRows:number;
      maxRows:number;
    }
    classNames?:any;
    styles?:any;
  }
}
