import { request } from '../request';
import { USER_URLS } from '../urls';


/**
 * 用户管理列表
 *
 * @export
 * @param {Api.User.PaginatingQuery} params
 * @returns {*}
 */
export function fetchUserList(params: Api.User.PaginatingQuery) {
  return request<Api.User.List>({
    method: 'get',
    params,
    url: USER_URLS.SYSTEM_USER_LIST
  });
}


/**
 * 增加用户
 *
 * @export
 * @param {Api.User.AddRequest} data
 * @returns {*}
 */
export function fetchAddUser(data: Api.User.AddRequest) {
  return request<any>({
    method: 'post',
    data,
    url: USER_URLS.SYSTEM_USER_BASE
  });
}


/**
 * 用户详情
 *
 * @export
 * @param {Api.User.DelRequest} data
 * @returns {*}
 */
export function fetchDelUser(data: Api.User.DelRequest) {
  return request<any>({
    method: 'delete',
    data,
    url: USER_URLS.SYSTEM_USER_BASE
  });
}


/**
 * 用户详情
 *
 * @export
 * @param {number} userId
 * @returns {*}
 */
export function fetchUserDetails(userId: number) {
  return request<Api.User.ListItem>({
    url: `${USER_URLS.SYSTEM_USER_BASE}/${userId}`
  });
}


/**
 * 更新用户状态
 *
 * @export
 * @param {Api.User.ChangeStatusRequest} data
 * @returns {*}
 */
export function fetchPutUserStatus(data: Api.User.ChangeStatusRequest) {
  return request<any>({
    method: 'put',
    data,
    url: USER_URLS.SYSTEM_USER_CHANGESTATUS
  });
}



/**
 * 更新用户信息
 *
 * @export
 * @param {Api.User.UpdateRequest} data
 * @returns {*}
 */
export function fetchPutUser(data: Api.User.UpdateRequest) {
  return request<any>({
    method: 'put',
    data,
    url: USER_URLS.SYSTEM_USER_BASE
  });
}


/**
 * 重置密码
 *
 * @export
 * @param {Api.User.UpdateRequest} data
 * @returns {*}
 */
export function fetchResetPwdUser(data: Api.User.UpdateRequest) {
  return request<any>({
    method: 'put',
    data,
    url: USER_URLS.SYSTEM_USER_BASE
  });
}
