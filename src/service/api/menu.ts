import { request } from '../request';
import { MENU_URLS } from '../urls';


/**
 * 菜单管理列表
 *
 * @export
 * @param {Api.Menus.PaginatingQuery} params
 * @returns {*}
 */
export function fetchMenuList(params: Api.Menu.QueryParmas) {
  return request<Api.Menu.List>({
    method: 'get',
    params,
    url: MENU_URLS.SYSTEM_MENU_LIST
  });
}

