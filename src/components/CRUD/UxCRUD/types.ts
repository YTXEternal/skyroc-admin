
import type { TableProps, TableColumnProps, TableColumnType, InputProps, SelectProps } from 'antd';
import type { UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types';
export type CRUDCOmponentType = 'input';
export type Permissions = string[] | string;


export type SearchConfig = {
  // 是否开启搜索
  on: boolean;
  defaultVal?: any;
  placeholder?:string;
} & (SearchCompInput | SearchCompSelect);

export type SearchCompInput = {
  type: 'input';
  nativeConf?: InputProps;
};

export type SearchCompSelect = {
  type: 'select';
  nativeConf?: SelectProps;
};

export type UxCRUDColumns<T> = ({
  searchConfig?: SearchConfig
} & TableColumnType<T> & (UxCRUDTimeCol | UxCRUDTAGCol| UxCRUDSWITCHCol<T>))[];
export type UxCRUDTimeCol = {
  type?: 'time';
  /**
   * 默认 YYYY-MM-DD
   *
   * @type {?string}
   */
  format?: string;
}

export type UxCRUDTAGCol = {
  type?: 'tag';
}

export type UxCRUDSWITCHCol<T> = {
  type?: 'switch';
  onChange:(value:boolean,record:T) =>Promise<any>;
  formatter:(value:any)=>boolean;
}


/**
 * Description placeholder
 *
 * @export
 * @interface UxCRUDProps
 * @typedef {UxCRUDProps}
 * @template T 一行表格数据类型
 */
export interface UxCRUDProps<T extends UxFormData> extends Pick<UxFormProps<T>, 'form'> {
  //  columns:TableProps<T>['columns'];
  columns: UxCRUDColumns<T>;
  ref?: React.Ref<EXPORT_UxCRUDMethods>;
  /**
  * 获取列表接口
  */
  fetchGetList: FetchGetList<T>;
  action: UxCRUDActions<T>;
  addButtons: AddButtons<T>;
  permissions?: Permissions;
}

export type EXPORT_UxCRUDMethods = {
  refresh: () => void;
}

export type FetchGetList<T> = (params: Api.Common.PaginatingQuery) => Promise<Api.Common.ListResponse<T>>;
export type Actions<T> = ActionDel<T> | ActionEdit<T>

export type UxCRUDActions<T> = {
  nativeConf?: Omit<TableColumnProps<T>, 'title'>;
  buttons: Actions<T>[];
  title: string;
};

export interface ActionCommonType<T> {
  key: string;
  onConfirm: (record: T) => Promise<boolean>;
  // 权限
  permissions?: Permissions;
  // 按钮文本
  text: string;
  // 成功提示
  successText?: string;
  // 失败提示
  errorText?: string;
}
export interface ActionDel<T> extends ActionCommonType<T> {
  type: 'del';
  // 格式化弹出的确认文本
  formatterConfirmText: (record: T) => string;
}

export interface ActionEdit<T> extends ActionCommonType<T> {
  type: 'edit';
  // 获取行数据详情
  fetchGetDetail: (record: T) => Promise<T>;
  // 编辑弹窗标题
  title: string;
  whiteKeys?: string[];
  detailPermissions?: Permissions;
}

export interface SearchFieldProps {
  children: React.ReactNode;
  label: string;
}



/**
 * 增加数据按钮交互
 *
 * @export
 * @interface AddButtons
 * @typedef {AddButtons}
 */
export interface AddButtons<T extends UxFormData = UxFormData> {
  /**
   * 新增按钮文本
   */
  text?: string;
  /**
   * 新增按钮点击事件
   */
  onConfirm: (data: T) => Promise<boolean>;
  onCancel?: () => void;
  /**
   * 新增成功提示
   */
  successText?: string;
  /**
   * 新增失败提示
   */
  errorText?: string;
  permissions?: Permissions;
}
