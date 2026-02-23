import { request } from '../request';
import { AUTH_URLS } from '../urls';
import {useEncrypt} from '@/hooks/common/useEncrypt';
/**
 * Login
 *
 * @param params Login parameters
 */
export async  function fetchLogin(params: Api.Auth.LoginParams) {
  const {encryptPassword} = useEncrypt();
  const data = {
    password:await encryptPassword(params.password),
    user_name:params.userName
  };
  return await request<Api.Auth.LoginResponse>({
    data,
    method: 'post',
    url: AUTH_URLS.LOGIN
  });
}

/** Get user info */
export function fetchGetUserInfo() {
  return request<Api.Auth.UserInfo>({ url: AUTH_URLS.GET_USER_INFO });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    data: {
      refreshToken
    },
    method: 'post',
    url: AUTH_URLS.REFRESH_TOKEN
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ params: { code, msg }, url: AUTH_URLS.ERROR });
}
