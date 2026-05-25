import cloudbase from '@cloudbase/js-sdk'

const app = cloudbase.init({
  env: 'guestbook-messages-d9cr3be1af85c',
})

export const db = app.database()
export default app
