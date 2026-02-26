/**
 * 命名空间 Api.Roles
 *
 * 后端 API 模块：角色管理
 */
declare namespace Api {
  namespace Roles {
    type List = Common.ListResponse<ListItem>
    type ListItem = {
      role_id: number;
      role_name: string;
      role_key: string;
      role_sort: number;
      data_scope: string;
      menu_check_strictly: boolean;
      dept_check_strictly: boolean;
      status: string;
      del_flag: string;
      create_by: string;
      update_by: string;
      remark: string;
    }



    /** 分页查询参数 */
    type PaginatingQuery = Common.PaginatingQuery<{
      role_name?: string;
      role_key?: string;
      status?: string;
    }>

    type AddRequest = {
      role_name: string;
      role_key: string;
      role_sort: number;
      data_scope: string;
      menu_check_strictly: boolean;
      dept_check_strictly: boolean;
      status: string;
      remark: string;
      menu_ids:number[];
    }
    /** 删除请求参数 */
    type DelRequest = {
      role_ids: number[];
    }
    /**
     * 更新角色状态请求参数
     */
    type ChangeStatusRequest = Pick<ListItem, 'role_id' | 'status'>

    /** 更新角色信息请求参数 */
    type UpdateRequest = Omit<AddRequest,'role_key'> & {
      role_id:number;
    }
  }
}
