/**
 * 前端 RSA 加密工具函数
 * 算法: RSA-OAEP
 * 哈希: SHA-256
 */

// TODO: 请在此处填入你的公钥，或者改为从环境变量/API获取
const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAzMtUAnU8Py62ODmTnLqC
QplUmqIS2s6NcdfYJknuIUvjJkPeWhjQbIDTE83t2lb3B/UaAGJCIvoojTRdAZca
1g37b4PMWE8ZaYV+APS0bTiRE7qoaj/fcqxl5Bh/iylfCL6o8YQmBvw2p3GrKJkr
HBMLR2YKsPNypHo45EpRPc75D7NLV+zTTawB4oY8elNnyfLXbj3WRa4MJUJq5rou
THGtm0eK9o++gOliyhLCQna1h8Vb3fxevj4qPxyXGD04I2QigH3TecW6mUq16+Hm
rTMgiA9z+l699b3X8/Gk60JCufyqHzgHcFWQ7soyqEbNJYnUOwTwl9P0TisZ57P9
WGPacW25ZkEiGnHULMJRDnhSJIuGm4kUOFKNg0VT6KjzGlYYDSlEGqD2mypoCY3H
p6fyOBENd/rVJpPRJzL3ZkRVmV+hAejAzYNUIRfVH8P4+/kCm4NG0QxTknhDKcyL
QfncmWqBjnVlwQ5wdoY3BZQJABBC6Npplqshci10zsiTAgMBAAE=
-----END PUBLIC KEY-----
`;

/**
 * 使用公钥加密字符串
 * @param plainText 需要加密的明文
 * @returns Promise<string> Base64 编码的密文
 */
export async function encrypt(plainText: string): Promise<string> {
  // 检查环境支持 (Web Crypto API 需要 HTTPS 或 localhost)
  if (!window.crypto || !window.crypto.subtle) {
    throw new Error('当前环境不支持 Web Crypto API，请确保在 HTTPS 或 localhost 下运行');
  }

  try {
    // 1. 准备数据和公钥
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const binaryDer = pemToArrayBuffer(PUBLIC_KEY_PEM);

    // 2. 导入公钥
    const key = await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256", // 必须与后端一致
      },
      false,
      ["encrypt"]
    );

    // 3. 执行加密
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
        // label 默认为空，与 Node.js 默认行为一致
      },
      key,
      data
    );

    // 4. 返回 Base64
    return arrayBufferToBase64(encryptedBuffer);
  } catch (error) {
    console.error('加密失败:', error);
    throw error;
  }
}

// --- 内部辅助函数 ---

/** PEM 格式转 ArrayBuffer */
function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64Lines = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\s+/g, '');

  const str = window.atob(b64Lines);
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);

  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/** ArrayBuffer 转 Base64 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
