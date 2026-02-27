/**
 * 命名空间 Api.User
 *
 * 后端 API 模块：用户管理
 */
declare namespace Api {
  namespace User {
    type List = Common.ListResponse<ListItem>
    type ListItem = {
      user_id: number;
      dept_id: number;
      user_name: string;
      nick_name: string;
      user_type: string;
      email: string;
      phonenumber: string;
      sex: string;
      avatar: string;
      password: string;
      status: string;
      del_flag: string;
      login_ip: string;
      login_date: Date;
      pwd_update_date: Date;
      create_by: string;
      update_by: string;
      remark: string;
    }

    /** 分页查询参数 */
    type PaginatingQuery = Common.PaginatingQuery<Partial<
      {
        user_name: string;
        phonenumber: string;
        status: string;
      }>>

    type AddRequest = {
      user_name: string;
      nick_name: string;
      password?: string;
      dept_id?: number;
      phonenumber?: string;
      email?: string;
      sex?: string;
      status?: string;
      remark?: string;
      post_ids?: number[];
      role_ids?: number[];
    }
    /** 删除请求参数 */
    type DelRequest = {
      user_ids: number[];
    }

    /**
     * 更新角色状态请求参数
     */
    type ChangeStatusRequest = Pick<ListItem, 'user_id' | 'status'>

    /** 更新角色信息请求参数 */
    type UpdateRequest = AddRequest & {
      user_id: number;
    }

    type ResetPwd = {
      user_id: number;
      password: string;
    }
  }
}
