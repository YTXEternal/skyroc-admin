/**
 * 命名空间 Api.Menu
 *
 * 后端 API 模块：菜单管理
 */
declare namespace Api {
  namespace Menu {
    type List = (ListItem & {
      children: ListItem[]
    })[]
    type ListItem = {
      menu_id: number;
      menu_name: string;
      parent_id: number;
      order_num: number;
      path: string;
      component: string;
      query: string;
      route_name: string;
      is_frame: number;
      is_cache: number;
      menu_type: string;
      visible: string;
      status: string;
      perms: string;
      icon: string;
      create_by: string;
      update_by: string;
      remark: string;
      constant: boolean;
    }


    type QueryParmas = Partial<{
      menu_name: string;
      route_name: string;
      is_frame: number;
      is_cache: number;
      menu_type: string;
      visible: string;
      status: string;
      // perms: string;
      // icon: string;
      // create_by: string;
      // update_by: string;
      // remark: string;
      // constant: boolean;
    }>;



    type AddRequest = {
      role_name: string;
      role_key: string;
      role_sort: number;
      data_scope: string;
      menu_check_strictly: boolean;
      dept_check_strictly: boolean;
      status: string;
      remark: string;
      menu_ids: number[];
    }
    /** 删除请求参数 */
    type DelRequest = {
      role_ids: number[];
    }
    /**
     * 更新角色状态请求参数
     */
    type ChangeStatusRequest = Pick<ListItem, 'menu_id' | 'status'>

    /** 更新角色信息请求参数 */
    type UpdateRequest = Omit<AddRequest, 'role_key'> & {
      role_id: number;
    }
  }
}
