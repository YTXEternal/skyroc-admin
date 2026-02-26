
import UxForm, { formatFormToValue } from '@/components/CRUD/UxForm';
import type { UxFormType, UxFormProps, UxFormData } from '@/components/CRUD/UxForm/types'
import { commonEditForm, type FormFieldType } from './form';
import { fetchRolesList, fetchDelRoles, fetchAddRoles, fetchRoleDetails, fetchPutRole, fetchPutRoleStatus } from '@/service/api';
const Component = () => {
  const [data, setData] = useState<FormFieldType>(formatFormToValue(commonEditForm) as FormFieldType);
  const [list, setList] = useState<FormFieldType>();
  const onSubmit = (data: UxFormProps['data']) => {
    console.log('data', data);
    return Promise.resolve(1);
  }

  useEffect(()=>{
  });

  return <div>
    <UxForm<FormFieldType>
      name="basic"
      onSubmit={onSubmit}
      form={commonEditForm}
      data={data}
    ></UxForm>
  </div>;
};


export default Component;
