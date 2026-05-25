import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'guestbook-messages-d9cr3be1af85c',
})

const auth = app.auth({ persistence: 'local' })

// 匿名登录，挂住到完成
export const authReady = auth.signInAnonymously().then(() => {
  console.log('CloudBase 匿名登录成功')
}).catch((err: any) => {
  console.error('CloudBase 匿名登录失败:', err)
  throw err
})

export const db = app.database()
export default app
