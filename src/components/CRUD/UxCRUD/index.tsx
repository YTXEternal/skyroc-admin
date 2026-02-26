
import { AnyObject } from 'antd/es/_util/type';
import type { UxCRUDProps, UxCRUDColumns, ActionDel, ActionEdit, SearchFieldProps, Permissions } from './types';
import type { TableProps, PaginationProps, TableColumnType } from 'antd';
import { PlusOutlined } from '@ant-design/icons'
import { cloneDeep } from 'lodash-es';
import { JSX } from 'react';
import UxForm from '@/components/CRUD/UxForm';
import type { UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types';
import { nanoid } from '@sa/utils';
import dayjs from 'dayjs';
import { formatFormToValue } from '@/components/CRUD/UxForm';
import { useAuth } from '@/features/auth';
import ExceptionBase from '@/components/ExceptionBase';

function SearchField({ children, label }: SearchFieldProps) {
  return (
    <ASpace direction='horizontal' size={10}>
      <span className='font-700'>{label}</span>
      {children}
    </ASpace>
  )
}

/**
 * 快速增删改查组件
 *
 * @export
 * @template T
 * @param {UxCRUDProps<T>} param0
 * @param {TableProps} param0.columns
 * @param {*} param0.ref
 * @param {*} param0.fetchGetList
 * @returns {*}
 */
export function UxCRUD<T extends UxFormData>({ columns, ref, fetchGetList, action, form, addButtons, permissions }: UxCRUDProps<T>) {
  const { hasAuth } = useAuth();
  /**
    * 判断当前是否拥有权限
    * 如果是undefined那就是没有传这个参数所以默认是通过的
    * @return {boolean} true是通过,false 为不通过
    */
  const isPermission = (permissions?: Permissions) => {
    if (typeof permissions === 'undefined') return true;
    return hasAuth(permissions);
  }
  /** 处理一些通用的cols格式，比如时间格式化 */
  const useFormatCols = () => {
    return columns.map(v => {
      let isFormat = false;

      const condition: Array<[boolean,() => void]> = [
        [
          v.type === 'time',
          () => {
            isFormat = true;
            v['render'] = (_, record) => {
              // @ts-ignore
              return dayjs(record[v.key!]).format(v.format || 'YYYY-MM-DD');
            }
          }
        ],
        [
          v.type === 'tag',
          () =>{
            isFormat = true;
             v['render'] = (_, record) => {
              // @ts-ignore
              return<ATag color="processing">{record[v.key!]}</ATag>
            }
          }
        ]
      ]

      const item = condition.find(v=>v[0]);
      if(item) {
        item[1]();
      }
      if (isFormat) {
        delete v.dataIndex;
      }
      return v;
    });
  }
  const [cols, setCols] = useState<UxCRUDColumns<T>>(useFormatCols());
  /**
   * 创建搜索/列表获取
   *
   * @returns {{ dataSource: any; setDataSource: any; pagination: any; setPagination: any; searchParams: any; renderSearchControl: () => any; loading: any; reset: () => void; }}
   */
  const useQuery = () => {
    const [dataSource, setDataSource] = useState<T[]>([]);
    const [pagination, setPagination] = useState<PaginationProps>({
      current: 1,
      pageSize: 20,
      total: 0,
      onChange(page: number, pageSize: number) {
        setPagination({
          ...pagination,
          current: page,
          pageSize,
        })
      }
    });
    const [searchParams, setSearchparams] = useState<AnyObject>({});
    const [loading, setLoading] = useState<boolean>(false);
    const fetchList = async () => {
      if (!isPermission(permissions)) {
        return window.$message?.error('您没有相关权限');
      };
      const params = {
        ...searchParams,
        pageNum: pagination.current!,
        pageSize: pagination.pageSize!,
      }
      setLoading(true);
      try {
        const { list, total, page, pageSize } = await fetchGetList(params);
        setDataSource(list);
        setPagination({
          ...pagination,
          current: page,
          pageSize,
          total,
        })
      } finally {
        setLoading(false);
      }
    }

    /** 初始化搜索参数 */
    const initSearchParams = () => {
      if (!columns.length) return;
      const result: AnyObject = {};
      for (const val of columns) {
        if (!val.searchConfig?.on) continue;
        const key = val.key as string;
        result[key] = val?.searchConfig?.defaultVal;
      }
      setSearchparams(result);
    }



    /** 重置搜索条件 */
    const reset = () => {
      setPagination({
        ...pagination,
        current: 1
      })
      initSearchParams();
    };
    /** 渲染搜索控件 */
    const renderSearchControl = () => {
      if (!columns.length) return;
      // const result: AnyObject = {};
      return columns.filter(v => v.searchConfig?.on).map((val) => {
        const config = val.searchConfig!;
        const key = val.key! as string;
        switch (config.component) {
          case 'input':
            return <SearchField label={val.title! as string}>
              <AInput key={key} value={searchParams[key]} onChange={({ target }) => {
                const { value } = target;
                setPagination({
                  ...pagination,
                  current: 1,
                })
                setSearchparams({
                  ...searchParams,
                  [key]: value
                })
              }}></AInput>
            </SearchField>

        }
      })
    }

    useEffect(() => {
      initSearchParams();
    }, []);

    /** 监听搜索参数变化 */
    useEffect(() => {
      fetchList();
    }, [pagination!.current, pagination!.pageSize, searchParams])


    return {
      dataSource,
      setDataSource,
      pagination,
      setPagination,
      searchParams,
      renderSearchControl,
      loading,
      reset,
      fetchList
    }
  };
  // 刷新
  const refresh = () => {
    fetchList();
  }


  const [isAdd, setIsAdd] = useState<boolean>(false);

  /** 处理操作列 */
  const useActions = () => {
    const nowCols = cloneDeep(cols);
    const [modalText, setModalText] = useState<string>('');
    const [drawerTitle, setDrawerTitle] = useState<string>('');
    const [formData, setFormData] = useState<T>(formatFormToValue(form) as T);
    const [nowAction, setNowAction] = useState<Actions<T>>();
    const [nowRecord, setNowRecord] = useState<T>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleModalOk = () => {
      setIsModalOpen(false);
    };
    const handleModalCancel = () => {
      setIsModalOpen(false);
    };
    const [drawerOpen, setDrawerOpen] = useState(false);
    const showDrawer = () => {
      setDrawerOpen(true);
    };
    const onDrawerClose = () => {
      setDrawerOpen(false);
    };
    const commonClick = (action: Actions<T>) => {
      setNowAction(action);
    };




    const renderDelControl = (action: ActionDel<T>, record: T) => {
      return isPermission(action.permissions) ? <AButton key={nanoid()} variant='link' danger type='link' onClick={() => {
        setModalText(action.formatterConfirmText(record));
        commonClick(action);
        setFormData(record);
        showModal();
      }}>{action.text}</AButton> : undefined;
    }
    const renderEditControl = (action: ActionEdit<T>, record: T) => {
      return isPermission(action.permissions) ? <AButton key={nanoid()} variant='link' color='primary' type='link' onClick={async () => {
        /*
          判断当前是否拥有详情权限
        */
        if (!isPermission(action.detailPermissions)) return;
        setDrawerTitle(action.title);
        setIsAdd(false);
        commonClick(action);
        const row = await action.fetchGetDetail(record);
        setFormData(row);
        showDrawer();
      }}>{action.text}</AButton> : undefined;
    }
    /**
     * 当编辑或新增状态时表单最后确认会执行这里的逻辑
     *
     * @async
     * @param {T} data
     * @returns {*}
     */
    const onConfirm = async (data: T) => {
      let isPass = false;
      /**
       * 处理额外按钮逻辑
       *
       * @async
       * @returns {*}
       */
      const handleAddButton = async () => {
        if (!isAdd || !addButtons) return;
        const { onConfirm } = addButtons;
        isPass = await onConfirm(data);
        /**
         * 当未通过提交校验会阻止退出弹窗
         */
        if (!isPass) {
          // 失败提示
          window.$message?.error(addButtons.errorText || '新增失败');
          return;
        };
        window.$message?.success(addButtons.successText || '新增成功');
        refresh();
        onCancel();
      };

      /**
       * 处理操作列按钮逻辑
       *
       * @async
       * @returns {*}
       */
      const handleActions = async () => {
        if (!nowAction) return;
        isPass = await nowAction.onConfirm(data);
        /**
         * 当未通过提交校验会阻止退出弹窗
         */
        if (!isPass) {
          // 失败提示
          window.$message?.error(nowAction.errorText || '提交失败');
          return;
        };
        onCancel();
        // 刷新列表
        refresh();
        // 成功提示
        window.$message?.success(nowAction.successText || '提交成功');
      }
      if (isAdd) {
        await handleAddButton();
      } else if (nowAction) {
        await handleActions();
      }
    }
    const onCancel = () => {
      /** 处理操作列按钮取消逻辑 */
      const handleActions = () => {
        switch (nowAction!.type) {
          case 'del':
            handleModalCancel();
            break;
          case 'edit':
            onDrawerClose();
            break;
        }
      }
      /** 处理新增按钮取消逻辑 */
      const handleAddButton = () => {
        addButtons?.onCancel?.();
        setIsAdd(false);
        onDrawerClose();
      }
      if (nowAction) return handleActions();
      else if (isAdd) {
        handleAddButton();
      }
    }

    useEffect(() => {
      const actionCol: TableColumnType<T> = {
        ...(action.nativeConf || {}),
        'title': action.title,
        render(_, record) {
          return action.buttons.map(val => {
            switch (val.type) {
              case 'del':
                return renderDelControl(val, record);
              case 'edit':
                return renderEditControl(val, record);
            }
          });
        }
      }
      setCols([
        ...nowCols,
        actionCol
      ])
    }, []);
    return {
      isModalOpen,
      handleModalOk,
      handleModalCancel,
      modalText,
      drawerTitle,
      drawerOpen,
      onDrawerClose,
      formData,
      onConfirm,
      onCancel,
      nowAction,
      setDrawerTitle,
      showDrawer,
      setFormData,
    }
  };


  /** 处理 额外的button */
  const useButtons = () => {
    const useAdd = () => {
      const onAddClick = () => {
        setDrawerTitle('新增角色');
        setIsAdd(true);
        setFormData(formatFormToValue(form) as T);
        showDrawer();
      };
      return {
        onAddClick
      }
    };

    return {
      ...useAdd()
    }
  };

  const Buttons = useButtons();



  const Query = useQuery();
  const Actions = useActions();

  const {
    dataSource, setDataSource, pagination, renderSearchControl, loading, reset,
    fetchList,
    setPagination,
  } = Query;
  const { onAddClick } = Buttons;
  const {
    isModalOpen,
    handleModalOk,
    handleModalCancel,
    modalText,
    drawerTitle,
    drawerOpen,
    onDrawerClose,
    formData,
    onConfirm,
    onCancel,
    nowAction,
    setDrawerTitle,
    showDrawer,
    setFormData
  } = Actions;

  useImperativeHandle(ref, () => ({
    refresh
  }));

  return (
    <>
      {
        isPermission(permissions) ? (
          <>
            <ASpace direction='vertical' size={20} className='w-full'>
              <ACard>
                <ASpace direction='horizontal'>
                  {
                    renderSearchControl()
                  }
                  <AButton type='primary' onClick={() => {
                    setPagination({
                      ...pagination,
                      current: 1
                    })
                    fetchList()
                  }}>搜索</AButton>
                  <AButton onClick={reset}>重置</AButton>
                </ASpace>
              </ACard>
              <ACard>
                {
                  isPermission(addButtons.permissions) ? (
                    <AButton type='primary' icon={<PlusOutlined />} onClick={onAddClick} >{addButtons.text ?? '新增'}</AButton>
                  ) : null
                }
              </ACard>
              <ACard>
                <ATable
                  loading={loading}
                  dataSource={dataSource}
                  columns={cols}
                  scroll={{ x: 'max-content' }}
                  pagination={pagination}
                  locale={{ emptyText: <AEmpty description="暂无任何数据"></AEmpty> }}
                >
                </ATable>
              </ACard>
            </ASpace>
            {/* 编辑 */}
            <ADrawer
              width="600px"
              title={drawerTitle}
              open={drawerOpen}
              onClose={onDrawerClose}
              placement='left'
              closable={false}
            >
              <UxForm<T>
                name="ljlag"
                form={form}
                data={formData}
                onSubmit={onConfirm}
                onCancel={onCancel}
                whiteKeys={nowAction?.type === 'edit' ? nowAction.whiteKeys : undefined}
              >
              </UxForm>
            </ADrawer>
            {/* 删除确认弹窗 */}
            <AModal
              title="系统提示"
              open={isModalOpen}
              onOk={() => onConfirm(formData)}
              onCancel={onCancel}
              centered={true}
            >
              {modalText}
            </AModal>
          </>
        ) : <ExceptionBase type="403" />
      }
    </>
  )
};



export default UxCRUD;
