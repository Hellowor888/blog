const cloudbase = require('@cloudbase/node-sdk')

exports.main = async (event) => {
  const app = cloudbase.init({ env: 'guestbook-messages-d9cr3be1af85c' })
  const db = app.database()
  const coll = db.collection('guestbook_messages')

  // CORS 预检
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    // GET - 获取留言列表
    if (event.httpMethod === 'GET') {
      const res = await coll.orderBy('createdAt', 'desc').limit(100).get()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ code: 0, data: res.data }),
      }
    }

    // POST - 新增留言
    if (event.httpMethod === 'POST') {
      const { name, text, time } = JSON.parse(event.body || '{}')
      if (!name || !text) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ code: 1, message: '姓名和内容不能为空' }),
        }
      }
      const res = await coll.add({ name, text, time, createdAt: new Date() })
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ code: 0, data: { id: res.id } }),
      }
    }

    // DELETE - 删除留言
    if (event.httpMethod === 'DELETE') {
      const id = (event.path || '').split('/').pop()
      if (!id) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ code: 1, message: '缺少留言ID' }),
        }
      }
      await coll.doc(id).remove()
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ code: 0 }),
      }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ code: 1, message: 'Method not allowed' }) }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ code: 1, message: err.message }),
    }
  }
}
