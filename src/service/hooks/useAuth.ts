import { useMutation, useQuery } from '@tanstack/react-query';

import { localStg } from '@/utils/storage';

import { fetchGetUserInfo, fetchLogin, fetchRefreshToken } from '../api';
import { MUTATION_KEYS, QUERY_KEYS } from '../keys';

/**
 * Login hook
 *
 * @example
 *   const { mutate: login, isPending } = useLogin();
 *   login({ userName: 'admin', password: '123456' });
 */
export function useLogin() {
  return useMutation({
    mutationFn: (params: Api.Auth.LoginParams) => fetchLogin(params),
    retry: false
  });
}

const hasToken = Boolean(localStg.get('token'));

/**
 * Get user info hook
 *
 * @example
 *   const { data: userInfo, isLoading } = useUserInfo();
 *
 * @param enabled - Whether to enable the query (default: true)
 */
export function useUserInfo() {
  return useQuery({
    enabled: hasToken,
    gcTime: 30 * 60 * 1000,
    placeholderData: () => ({
      buttons: [],
      roles: [],
      userId: '',
      userName: ''
    }),
    queryFn: fetchGetUserInfo,
    queryKey: QUERY_KEYS.AUTH.USER_INFO,
    refetchOnWindowFocus: true,
    retry: false,
    staleTime: 2 * 60 * 1000
  });
}

/**
 * Refresh token hook
 *
 * @example
 *   const { mutate: refreshToken } = useRefreshToken();
 *   refreshToken('your-refresh-token');
 */
export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => fetchRefreshToken(refreshToken),
    mutationKey: MUTATION_KEYS.AUTH.REFRESH_TOKEN
  });
}
