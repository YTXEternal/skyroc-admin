
import UxForm, { formatFormToValue, refactorFormField } from '@/components/CRUD/UxForm';
import UxCRUD from '@/components/CRUD/UxCRUD';
import type { UxCRUDColumns, UxCRUDProps } from '@/components/CRUD/UxCRUD/types';
import type { UxFormType, UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types'
import { commonEditForm, type FormFieldType } from './form';
import { fetchRolesList, fetchDelRoles, fetchMenuList, fetchAddRoles, fetchRoleDetails, fetchPutRole, fetchPutRoleStatus } from '@/service/api';
type RowData = Api.Roles.ListItem;
const Component = () => {
  const [treeData, setTreeData] = useState<Api.Menu.List>([]);

  const useFormField = () => {
    const form = refactorFormField({
      form: commonEditForm, refactorKeys: {
        'menu_ids': (val) => {
          val.type === 'tree';
          val.nativeProps = {
            ...val.nativeProps,
            // @ts-ignore
            treeData,
            'fieldNames': {
              'title': 'menu_name',
              'key': 'menu_id',
              'children': 'children'
            }
          }
          return val;
        }
      }
    });
    useEffect(() => {
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
        title: '角色名称',
        key: 'role_name',
        dataIndex: 'role_name',
        'searchConfig': {
          on: true,
          type:'input',
          defaultVal:''
        }
      },
      {
        title: '标识',
        key: 'role_key',
        dataIndex: 'role_key',
        type: 'tag',
      },
      {
        title: '排序',
        key: 'role_sort',
        dataIndex: 'role_sort',
      },
      {
        title: '数据范围',
        key: 'data_scope',
        dataIndex: 'data_scope',
      },
      {
        title: '菜单关联',
        key: 'menu_check_strictly',
        dataIndex: 'menu_check_strictly',
      },
      {
        title: '部门关联',
        key: 'dept_check_strictly',
        dataIndex: 'dept_check_strictly',
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        searchConfig: {
          on: true,
          type:'select',
          defaultVal:"0",
          placeholder:'请选择状态',
          nativeConf:{
            style:{
              width:'width:80px'
            },
            options:[
               {
                label:'所有',
                value:null
              },
              {
                label:'启用',
                value:'0'
              },
              {
                label:'停用',
                value:'1'
              }
            ]
          }
        },
        type:'switch',
        onChange(value) {
          console.log('value');
        },
        formatter(value) {
          return value === '0';
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

  const actions: UxCRUDProps<RowData>['action'] = {
    buttons: [
      {
        'text': '编辑',
        'type': 'edit',
        'fetchGetDetail': (record) => fetchRoleDetails(record.role_id),
        'title': '编辑角色',
        'key': 'edit',
        'onConfirm': (record) => {
          console.log('record', record);
          return fetchPutRole(record);
        },
        'whiteKeys': ['role_id'],
        permissions: ['system:role:edit'],
        detailPermissions: ['system:role:query'],
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
  }

  return <div>
    <UxCRUD<Api.Roles.ListItem>
      columns={columns}
      fetchGetList={fetchRolesList}
      action={actions}
      form={form}
      addButtons={{
        'text': '新增',
        'onConfirm': async (record) => {
          console.log('fetchAddRoles', record);
          return await fetchAddRoles(record);
        },
        permissions: ['system:role:add']
      }}
      permissions={
        ['system:role:list']
      }
    >
    </UxCRUD>
  </div>;
};


export default Component;
