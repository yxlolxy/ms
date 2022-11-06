import * as crypto from 'crypto'
const rsaPubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDMIO/MUnhVmOXx6YG0jCV/VMtg
h+tdS5Tfh6/NK6wDlB7z/NSo2NF4+ZWzJQTA4ayER3KHvvF9zx5GRJag6/k5bx/F
Q0RP7+Cz5D/yBVIkrkWnG084POoTwnXOpZgBSkimF339otrTnZcNCn8KJcqefVDH
OWs8qPH/QJi8reSUywIDAQAB
-----END PUBLIC KEY-----`
const rsaPriKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDMIO/MUnhVmOXx6YG0jCV/VMtgh+tdS5Tfh6/NK6wDlB7z/NSo
2NF4+ZWzJQTA4ayER3KHvvF9zx5GRJag6/k5bx/FQ0RP7+Cz5D/yBVIkrkWnG084
POoTwnXOpZgBSkimF339otrTnZcNCn8KJcqefVDHOWs8qPH/QJi8reSUywIDAQAB
AoGAXS+UCPSFFp5sKplsqt1nqM8u4Oxrl/WPCtRIfyM2rZOK5ds/wazpQ468tkFq
ABuFxAVR1YJngAVzTqS1FtViufFkNTQ24aiuvGKe56U0/2LcKaUyMA1it9seb82X
ltiOnZczqKTWlLSAMVP1+H8LFCdmRcJR+qFTvMf9SbMoeeECQQD/2+eY4G/tTizK
KTN03dnqnLwRf0GFxr7t6navKt6gjlDHJl1a19WJ6k8jcxnlcJ0TjlkaLrQ7tKhO
5u+AejlJAkEAzD278tBBbGpnmgA0JlhtIRpkniLQ++BJki0GBe+wq0owBnPu3Kpq
znF2WZNnkyIIyPDZWYtQqPH8+yhdtrcRcwJADZAInM/43ulv8l9wvNctwAQC7CKE
xKSeZloxZGOvXW9t1MCx3ijmxuLGwyhMzR7FFM5M5thm8WtIKLaRJ4xTEQJBAKPi
KWzV1JlU7BqzbSUTsUVtsyz8zOo+92nWvM2Inh9j4RNcdV8VU6yheJC56dMy7Q+n
yw/B7RATVKaHpmLVlKcCQQCxhyNLQpC1cK0MDYC+G6Gv/RXdliYT9EaOGlEFnNNj
gakSDu8QGnZ53rbq9nymVP397K1Ch8Y1WtvN24AvcH1z
-----END RSA PRIVATE KEY-----`
const macKey = 'cvafkljklu234oghn132lkjio23'

// 用于单向加密如密码
export const hashMac = (str) => {
  const hmac = crypto.createHmac('sha256', macKey)
  hmac.update(str)
  return hmac.digest('hex')
}

// rsa加密
export const rsaEncrypt = (str) => {
  return crypto.publicEncrypt(rsaPubKey, Buffer.from(str))
}

// ras解密
export const rsaDecrypt = (str) => {
  return crypto.privateDecrypt(rsaPriKey, Buffer.from(str)).toString()
}

export const getRsaPubKey = () => {
  return rsaPubKey
}
