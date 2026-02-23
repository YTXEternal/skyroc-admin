import {md5Hash} from '@/utils/md5'
import {encrypt} from '@/utils/encrypt'


/**
 * 密码加密
 *
 * @returns {{ encryptPassword: (password: string) => unknown; }}
 */
export const useEncrypt = () =>{
  const encryptPassword = async (password: string) => {
    const hash = md5Hash(password);
    return await encrypt(hash);
  }
  return {
    encryptPassword
  }
}
