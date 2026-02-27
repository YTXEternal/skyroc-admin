
import UxForm, { formatFormToValue, refactorFormField } from '@/components/CRUD/UxForm';
import UxCRUD from '@/components/CRUD/UxCRUD';
import type { UxCRUDColumns, UxCRUDProps } from '@/components/CRUD/UxCRUD/types';
import type { UxFormType, UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types'
import { commonEditForm, type FormFieldType } from './form';
import { fetchUserList, fetchDelUser, fetchMenuList, fetchAddUser, fetchUserDetails, fetchPutUser, fetchPutUserStatus } from '@/service/api';
import { useAuth } from '@/features/auth';
import { LIST_PERMISSIONS, EDIT_PERMISSIONS, DEL_PERMISSIONS, DETAIL_PERMISSIONS, ADD_PERMISSIONS } from './permissions';
type RowData = Api.User.ListItem;

const rowIdKey = 'user_id';
const Component = () => {
  const [treeData, setTreeData] = useState<Api.Menu.List>([]);
  const { hasAuth } = useAuth();
  const useFormField = () => {
    const form = refactorFormField({
      form: commonEditForm, refactorKeys: {
        'role_ids': (val) => {
          val.type === 'tree';
          val.nativeProps = {
            ...val.nativeProps,
            // @ts-ignore
            treeData,
          }
          return val;
        }
      }
    });
    useEffect(() => {
      if (!hasAuth(LIST_PERMISSIONS)) return;
      fetchMenuList({
        status: "0"
      }).then(data => {
        setTreeData(data || []);
      })
    }, []);
    return {
      form
    }
  }
  const { form } = useFormField();

  const useTable = () => {
    const columns: UxCRUDColumns<RowData> = [
      {
        title: '用户名',
        key: 'user_name',
        dataIndex: 'user_name',
        'searchConfig': {
          on: true,
          type: 'input',
          defaultVal: ''
        }
      },
      {
        title: '昵称',
        key: 'nick_name',
        dataIndex: 'nick_name',
      },
      {
        title: '邮箱',
        key: 'email',
        dataIndex: 'email',
      },
      {
        title: '手机号',
        key: 'phonenumber',
        dataIndex: 'phonenumber',
        'searchConfig': {
          on: true,
          type: 'input',
          defaultVal: ''
        }
      },
      {
        title: '性别',
        key: 'sex',
        dataIndex: 'sex',
        type: 'tag',
        formatter(record) {
          const collection: Record<string, string> = {
            '0': '男',
            '1': '女',
            '2': '未知'
          };
          return collection[record.sex];
        }
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        searchConfig: {
          on: true,
          type: 'select',
          defaultVal: "0",
          placeholder: '请选择状态',
          nativeConf: {
            style: {
              width: 'width:80px'
            },
            options: [
              {
                label: '所有',
                value: null
              },
              {
                label: '启用',
                value: '0'
              },
              {
                label: '停用',
                value: '1'
              }
            ]
          }
        },
        type: 'switch',
        async onChange(value, record) {
          const status = value ? "0" : "1";
          await fetchPutUserStatus({
            [rowIdKey]: record[rowIdKey],
            status
          });
          window.$message?.success('状态更新成功');
          return true;
        },
        formatter(value) {
          return value === '0';
        },
        nativeConf: {
          'disabled': !hasAuth(EDIT_PERMISSIONS)
        }
      },
      {
        title: '密码最后更新时间',
        key: 'pwd_update_date',
        dataIndex: 'pwd_update_date',
        type: 'time',
        'format': 'YYYY-MM-DD HH:mm:ss'
      },
      {
        title: '备注',
        key: 'remark',
        dataIndex: 'remark',
      },
      {
        title: '创建时间',
        key: 'create_time',
        type: 'time',
      },
      {
        title: '更新时间',
        key: 'update_time',
        type: 'time'
      },
    ];
    return {
      columns
    }
  };
  const {
    columns
  } = useTable();

  const actions: UxCRUDProps<RowData>['action'] = {
    buttons: [
      {
        'text': '编辑',
        'type': 'edit',
        'fetchGetDetail': async (record) => {
          const r = await fetchUserDetails(record[rowIdKey]);
          console.log('r', r);
          return r;
        },
        'title': '编辑用户',
        'key': 'edit',
        'onConfirm': (record) => {
          console.log('record', record);
          return fetchPutUser(record);
        },
        'whiteKeys': ['role_id'],
        permissions: EDIT_PERMISSIONS,
        detailPermissions: DETAIL_PERMISSIONS,
      },
      {
        'text': '删除',
        'type': 'del',
        'key': 'edit',
        'onConfirm': (record) => {
          return fetchDelUser({
            'user_ids': [record[rowIdKey]]
          });
        },
        'formatterConfirmText': (record) => `确定删除账号"${record.user_name}"吗？`,
        permissions: DEL_PERMISSIONS,
        successText: '删除成功',
        errorText: '删除失败',
      },
    ],
    title: '操作',
    'nativeConf': {
      'fixed': 'right'
    }
  }

  return <>
    <UxCRUD<Api.User.ListItem>
      columns={columns}
      fetchGetList={fetchUserList}
      action={actions}
      form={form}
      addButtons={{
        'text': '新增',
        'onConfirm': async (record) => {
          return await fetchAddUser(record);
        },
        permissions: ADD_PERMISSIONS
      }}
      permissions={
        LIST_PERMISSIONS
      }
    >
    </UxCRUD>
  </>;
};


export default Component;
