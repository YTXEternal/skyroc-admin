
import UxForm, { formatFormToValue, refactorFormField } from '@/components/CRUD/UxForm';
import UxCRUD from '@/components/CRUD/UxCRUD';
import type { UxCRUDColumns, UxCRUDProps } from '@/components/CRUD/UxCRUD/types';
import type { UxFormType, UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types'
import { commonEditForm, type FormFieldType } from './form';
import { fetchRolesList, fetchDelRoles, fetchMenuList, fetchAddRoles, fetchRoleDetails, fetchPutRole, fetchPutRoleStatus } from '@/service/api';
import { useAuth } from '@/features/auth';
import { cloneDeep } from 'lodash-es';
type RowData = Api.Roles.ListItem;

const Component = () => {
  const [treeData, setTreeData] = useState<Api.Menu.List>([]);
  const menuListRef = useRef<Api.Menu.List>([]);
  const [formType, setFormType] = useState<UxFormType>({
    ...commonEditForm,
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
        // @ts-ignore
        treeData,
      }
      ,
    }
  });
  const { hasAuth } = useAuth();
  /** 一些通用数据的获取 */
  const commonFetch = () => {
    const fetchMenuData = async () => {
      if (!hasAuth('system:menu:list')) return true;
      const data = await fetchMenuList({
        status: "0"
      });
      const form = refactorFormField({
        form: commonEditForm, refactorKeys: {
          'menu_ids': (val) => {
            val.nativeProps = {
              ...val.nativeProps,
              // @ts-ignore
              treeData: data,
              'fieldNames': {
                'title': 'menu_name',
                'key': 'menu_id',
                'children': 'children'
              }
            }
            return val;
          }
        }
      }) as UxFormType;
      setFormType(form);
      menuListRef.current = data || [];
      setTreeData(data || []);
      return true;
    }
    return Promise.all([fetchMenuData()]);
  }
  useEffect(() => {
    commonFetch();
  }, []);
  useEffect(() => {
    updateEditFormTreeData();
  }, [treeData]);

  const updateEditFormTreeData = () => {
    const form: UxFormType = {
      ...commonEditForm,
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
          // @ts-ignore
          treeData: menuListRef.current,
        }

      }
    };
    const cloneAction = cloneDeep(action);
    // @ts-ignore
    cloneAction.buttons[0].form = form;
    setAction({
      ...cloneAction,
    })
  }

  const useTable = () => {
    const columns: UxCRUDColumns<RowData> = [
      {
        title: '角色名称',
        key: 'role_name',
        dataIndex: 'role_name',
        'searchConfig': {
          on: true,
          type: 'input',
          defaultVal: ''
        }
      },
      {
        title: '标识',
        key: 'role_key',
        dataIndex: 'role_key',
        type: 'tag',
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
          const { role_id } = record;
          await fetchPutRoleStatus({
            role_id,
            status
          });
          window.$message?.success('状态更新成功');
          return true;
        },
        formatter(value) {
          return value === '0';
        },
        nativeConf: {
          'disabled': !hasAuth('system:role:edit')
        }
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

  const [action, setAction] = useState<UxCRUDProps<RowData>['action']>({
    buttons: [
      {
        'text': '编辑',
        'type': 'edit',
        'fetchGetDetail': async (record) => {
          await commonFetch();
          return fetchRoleDetails(record.role_id)
        },
        'title': '编辑角色',
        'key': 'edit',
        'onConfirm': (record) => {
          return fetchPutRole(record);
        },
        'whiteKeys': ['role_id'],
        permissions: ['system:role:edit'],
        detailPermissions: ['system:role:query'],
        'form': formType
      },
      {
        'text': '删除',
        'type': 'del',
        'key': 'edit',
        'onConfirm': (record) => {
          return fetchDelRoles({
            role_ids: [record.role_id]
          });
        },
        'formatterConfirmText': (record) => `确定删除角色:${record.role_name}吗？`,
        permissions: ['system:role:remove'],
        successText: '删除成功',
        errorText: '删除失败',
      },
    ],
    title: '操作',
    'nativeConf': {
      'fixed': 'right'
    }
  })


  const addButtons: AddButtons<Api.Roles.ListItem> = {
    'text': '新增',
    'onConfirm': async (record) => {
      return await fetchAddRoles(record);
    },
    permissions: ['system:role:add'],
    form: formType
  }

  return <>
    <UxCRUD<Api.Roles.ListItem>
      columns={columns}
      rowKey='role_id'
      fetchGetList={fetchRolesList}
      action={action}
      addButtons={addButtons}
      permissions={
        ['system:role:list']
      }
    >
    </UxCRUD>
  </>;
};


export default Component;
