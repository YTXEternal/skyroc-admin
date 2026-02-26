import {cloneDeep} from 'lodash-es'
export const objFor = <T extends Record<string, unknown>>(
  obj: T,
  cb: <K extends keyof T>(key: K, value: T[K]) => void
) => {
  const keys = Object.keys(obj) as Array<keyof T>;
  const newObj = cloneDeep(obj);
  for (const key of keys) {
    cb(key, cloneDeep(newObj[key]));
  }
};

