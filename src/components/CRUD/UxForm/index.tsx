import type { UxFormProps, UxFormData, UxFormType } from './types';
import { objFor } from '@/utils/objFor';
import { Form, FormProps } from 'antd';
import { cloneDeep } from 'lodash-es';
import { Input } from 'antd';
import { SyncOutlined } from '@ant-design/icons';

const { TextArea } = Input;
/**
 * 将传递进来的form 初始化成键值对
 *
 * @param {UxFormType} form
 * @returns {UxFormType}
 */
export const formatFormToValue = <T extends UxFormType = UxFormType>(form: T) => {
  const values = {} as UxFormData;
  objFor(form, (key, val) => {
    const k = key as string;
    values[k] = val.value;
  });
  return values;
}



export type RefactorKeys<T> = Record<string, (value: UxFormItem) => UxFormItem>;



/**
 * 重构form
 *
 * @param {{form:UxFormType,refactorKeys:RefactorKeys<any>}} param0
 * @param {UxFormType} param0.form
 * @param {Record<string, (value: UxFormItem) => UxFormItem>} param0.refactorKeys
 * @returns {UxFormItem>; }) => any}
 */
export const refactorFormField = ({ form, refactorKeys }: { form: UxFormType, refactorKeys: RefactorKeys<any> }) => {
  const keys = Object.keys(refactorKeys || {});
  if (!keys.length) return form;
  const newForm = cloneDeep(form);
  const newRefactorKeys = cloneDeep(refactorKeys);
  keys.forEach(key => {
    newForm[key] = newRefactorKeys[key](newForm[key]);
  });
  return newForm;
}



const UxForm = <T extends UxFormData = UxFormData>({ name, onSubmit, form, data, onCancel, whiteKeys }: UxFormProps<T>) => {
  // 控制表单提交的loading状态
  const [loading, setLoading] = useState<boolean>(false);
  const [formInstance] = Form.useForm();
  const [formData, setFormData] = useState<UxFormData>(cloneDeep(data || {}));

  const handleSubmitError = (err: any, msg = '提交失败') => {
    setLoading(false);
    window.$message?.error(msg);
    console.log('error', err);
  }
  const onFinish: FormProps<T>['onFinish'] = async (values) => {
    try {
      setLoading(true);
      // 提交的时候做一遍格式化
      const formater = () => {
        const data: UxFormData = {};
        objFor(form, (key, val) => {
          const currentVal = cloneDeep(values[key]);
          let result: any = null;
          if (val.type === 'switch' && typeof currentVal === 'boolean') {
            result = val.map[currentVal];
          } else if ('formatter' in val) {
            result = val.formatter!(currentVal);
          } else {
            result = currentVal;
          }
          data[key] = result;
        });
        return data;
      }
      const result = formater();
      // 把白名单之内的数据提出来
      const handleWhiteKeys = () => {
        if (!whiteKeys || !whiteKeys.length) return;
        whiteKeys.forEach(key => {
          if (!(key in data)) return;
          result[key] = data[key];
        })
      }
      handleWhiteKeys();
      // @ts-ignore
      await onSubmit(result);
      setLoading(false);
    } catch (err) {
      handleSubmitError(err);
    }
  };
  const onFinishFailed: FormProps<T>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  /**
   * 初始化表单数据
  */
  useEffect(() => {
    const values = formatFormToValue(form);
    syncFormData(values)
  }, []);

  // 受控
  useEffect(() => {
    if (!data) return;
    syncFormData(data)
  }, [data]);
  /**
   * 动态渲染表单控件
   *
   * @template {UxFormType} O
   * @template {keyof O} KEY
   * @param {KEY} key
   * @param {O[KEY]} item
   * @returns {*}
   */
  const renderUxFormControl = <O extends UxFormType, KEY extends keyof O>(key: KEY, item: O[KEY]) => {
    const renderControl = () => {
      function formatter<VAL>(value: VAL) {
        return 'formatter' in item ? item.formatter!(value) : value;
      }
      switch (item.type) {
        case 'input':
          // @ts-ignore
          return <AInput className="w-full" key={key as React.Key} value={formData[key]} onChange={({ target }) => {
            const { value } = target;
            syncFormData({
              ...formData,
              [key]: (value)
            })
            // formInstance.setFieldValue(key, formatter(value));
          }} {...(item.nativeProps || {})} />;
        case 'textarea':
          // @ts-ignore
          return <TextArea className="w-full" key={key as React.Key} value={formData[key]} onChange={({ target }) => {
            const { value } = target;
            syncFormData({
              ...formData,
              [key]: (value)
            })
            // formInstance.setFieldValue(key, formatter(value));
          }} {...(item.nativeProps || {})} />;
        case 'inputNumber':
          // @ts-ignore
          return <AInputNumber className="w-full" key={key as React.Key} value={formData[key]} onChange={(value) => {
            syncFormData({
              ...formData,
              [key]: value
            })
            // formInstance.setFieldValue(key, formatter(value));
          }} {...(item.nativeProps || {})} />;
        case 'select':
          // @ts-ignore
          return <ASelect className="w-full" key={key as React.Key} value={formData[key]} {...(item.nativeProps || {})} />;
        case 'switch':
          const formatSwitchVal = (checked: any) => {
            if (item.map['false'] === checked) {
              return false;
            } else if (item.map['true'] === checked) {
              return true;
            }
          }
          // @ts-ignore
          return <ASwitch key={key as React.Key} checked={formatSwitchVal(formData[key])} onChange={(checked) => {
            syncFormData({
              ...formData,
              [key]: checked
            }, false)
          }} {...(item.nativeProps || {})} />;
        case 'tree':
          return <ATree
            checkStrictly={true}
            checkable={true} key={key as React.Key}
            checkedKeys={
              // @ts-ignore
              formatter(formData[key])
            }
            // @ts-ignore
            onCheck={({ checked }: {
              checked: string | number | bigint[];
              halfChecked: string | number | bigint[];
            }) => {
              formInstance.setFieldValue(key, checked);
              console.log('checked',checked);
              syncFormData({
              ...formData,
              [key]: checked
            })
            }}
            {...(item.nativeProps || {})} />;
      }
    }
    return (
      <AForm.Item<T>
        label={item.label}
        // @ts-ignore
        name={key}
        rules={[{ required: item.required!, message: item.message! }]}
      >
        {
          renderControl()
        }
      </AForm.Item>
    )
  }


  const syncFormData = <DATA extends UxFormData>(values: DATA, skip: boolean = false) => {
    const result = cloneDeep(values);
    const formKeys = Object.keys(form || {});
    if (!formKeys) return;
    formKeys.forEach(key => {
      const val = 'formatter' in form[key] ? form[key].formatter!(result[key]) : result[key];
      // @ts-ignore
      result[key] = val;
    })
    if (!skip) {
      formInstance.setFieldsValue(cloneDeep(result));
    }
    setFormData(result);
  }
  const reset = () => {
    const values = formatFormToValue(form);
    syncFormData(values);
  }

  const buttonSize = {
    width: '130px',
    height: '35px'
  }

  return (
    <>
      <ASpin  size="large" tip="Loading" spinning={loading}>
        <AForm
          name={name}
          form={formInstance}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          className='w-full'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {
            Object.keys(form || {}).map(key => {
              const item = form[key];
              return renderUxFormControl(key, item);
            })
          }
          <ASpace size={20} direction='horizontal' align='end'>
            <AForm.Item label={null}>
              <AButton style={buttonSize} onClick={() => {
                reset();
                onCancel && onCancel();
              }}
                loading={loading ? { icon: <SyncOutlined spin /> } : undefined}
              >
                取消
              </AButton>
            </AForm.Item>
            <AForm.Item label={null}>
              <AButton style={buttonSize} type="primary" htmlType="submit" loading={loading ? { icon: <SyncOutlined spin /> } : undefined}>
                确定
              </AButton>
            </AForm.Item>
          </ASpace>
        </AForm>
      </ASpin>
    </>
  )
};
export default UxForm;
