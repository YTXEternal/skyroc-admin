import {UxFormType} from '@/components/CRUD/UxForm/types';
export const commonEditForm: UxFormType = {
  user_name: {
    type: 'input',
    'message': '请填写用户名',
    'required': true,
    'value': '',
    label: '用户名'
  },
  nick_name: {
    type: 'input',
    'message': '请填写昵称',
    'required': true,
    'value': '',
    label: '昵称',
  },
  password: {
    type: 'inputPassword',
    'message': '请填写密码',
    'required': true,
    'value': '',
    label: '密码',
  },
   phonenumber: {
    type: 'input',
    'value': '',
    label: '手机号',
  },
   email: {
    type: 'input',
    'value': '',
    label: '邮箱',
  },
   sex: {
    type: 'select',
    'value': '0',
    label: '性别',
    'nativeProps':{
      options: [
        {
          label: '男',
          value: '0'
        },
        {
          label: '女',
          value: '1'
        },
         {
          label: '未知',
          value: '2'
        }
      ]
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
  post_ids: {
    type: 'tree',
    'label': '岗位',
    'value': [],
    nativeProps: {
      'fieldNames': {
        'title': 'menu_name',
        'key': 'menu_id',
        children: 'children'
      },
      'treeData': [],
    }
  },
  role_ids: {
    type: 'tree',
    'label': '所属角色',
    'value': [],
    nativeProps: {
      'fieldNames': {
        'title': 'role_name',
        'key': 'role_id',
        children: 'children'
      },
      'treeData': [],
    }
  },
  remark: {
    type: 'textarea',
    'message': '请填写备注',
    'value': '',
    label: '备注'
  },
}

export type FormFieldType = Api.User.AddRequest;

