import {UxFormType} from '@/components/CRUD/UxForm/types';
export const commonEditForm: UxFormType = {
  role_name: {
    type: 'input',
    'message': '请填写名称',
    'required': true,
    'value': '',
    label: '名称'
  },
  role_key: {
    type: 'input',
    'message': '请填写标识',
    'required': true,
    'value': '',
    label: '标识',
  },
  role_sort: {
    type: 'inputNumber',
    'value': 0,
    label: '排序',
    formatter: (value) => {
      console.log('sort', value);
      return Number(value);
    }
  },
  status: {
    type: 'switch',
    'value': "0",
    label: '状态',
    map: {
      "false": "1",
      "true": "0",
    },
  },
  menu_check_strictly: {
    type: 'switch',
    'value': true,
    label: '菜单树选择项是否关联显示',
    map: {
      false: false,
      true: true
    }
  },
  dept_check_strictly: {
    type: 'switch',
    'value': true,
    label: '部门树选择项是否关联显示',
    map: {
      false: false,
      true: true
    }
  },
  menu_ids: {
    type: 'tree',
    'label': '权限',
    'value': [],
    nativeProps: {
      'fieldNames': {
        'title': 'menu_name',
        'key': 'menu_id',
        children: 'children'
      },
      'treeData': [
      ],
    }
  },
  remark: {
    type: 'textarea',
    'message': '请填写备注',
    'value': '',
    label: '备注'
  },
}

export type FormFieldType = {
  role_name:string;
  role_key:string;
  role_sort:number;
  status:string;
  menu_check_strictly:boolean;
  dept_check_strictly:boolean;
  menu_ids:string[];
  remark:string;
  create_time:string;
  update_time:string;
}

