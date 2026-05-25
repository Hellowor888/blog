const cloudbase = require('@cloudbase/node-sdk')

exports.main = async (event) => {
  const app = cloudbase.init({ env: 'guestbook-messages-d9cr3be1af85c' })
  const db = app.database()

  // CORS preflight
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

  const method = event.httpMethod
  const query = event.queryStringParameters || {}
  const body = (() => {
    if (!event.body) return {}
    if (typeof event.body === 'object') return event.body
    try { return JSON.parse(event.body) } catch { return {} }
  })()

  // Detect bookshelf requests by presence of "itemId" in query or body
  const isBookshelf = !!(query.itemId || body.itemId)

  try {
    // ====== Bookshelf Reviews ======
    if (isBookshelf) {
      const coll = db.collection('bookshelf_reviews')

      // GET — list reviews for an item
      if (method === 'GET') {
        const itemId = query.itemId || ''
        if (!itemId) {
          return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '缺少 itemId 参数' }) }
        }
        const res = await coll.where({ itemId }).orderBy('createdAt', 'desc').limit(200).get()
        return { statusCode: 200, headers, body: JSON.stringify({ code: 0, data: res.data }) }
      }

      // POST — add a review
      if (method === 'POST') {
        const { itemId, name, rating, text, time } = body
        if (!itemId || !name || !rating || !text) {
          return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '请填写完整的评价信息（昵称、评分、内容）' }) }
        }
        const r = Number(rating)
        if (r < 1 || r > 5 || !Number.isInteger(r)) {
          return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '评分需为 1-5 的整数' }) }
        }
        if (name.length > 30) {
          return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '昵称不能超过30字' }) }
        }
        if (text.length > 1000) {
          return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '评价内容不能超过1000字' }) }
        }
        const res = await coll.add({ itemId, name, rating: r, text, time, createdAt: new Date() })
        return { statusCode: 200, headers, body: JSON.stringify({ code: 0, data: { id: res.id } }) }
      }
    }

    // ====== Guestbook ======
    const coll = db.collection('guestbook_messages')

    // GET — list all messages
    if (method === 'GET') {
      const res = await coll.orderBy('createdAt', 'desc').limit(100).get()
      return { statusCode: 200, headers, body: JSON.stringify({ code: 0, data: res.data }) }
    }

    // POST — add a message
    if (method === 'POST') {
      const { name, text, time } = body
      if (!name || !text) {
        return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '姓名和内容不能为空' }) }
      }
      const res = await coll.add({ name, text, time, createdAt: new Date() })
      return { statusCode: 200, headers, body: JSON.stringify({ code: 0, data: { id: res.id } }) }
    }

    // DELETE — remove a message or review (try guestbook first, then bookshelf)
    if (method === 'DELETE') {
      const path = event.path || ''
      const id = path.split('/').pop()
      if (!id) {
        return { statusCode: 400, headers, body: JSON.stringify({ code: 1, message: '缺少ID' }) }
      }

      // Try guestbook_messages first
      try {
        await db.collection('guestbook_messages').doc(id).remove()
        return { statusCode: 200, headers, body: JSON.stringify({ code: 0 }) }
      } catch {}

      // Try bookshelf_reviews
      try {
        await db.collection('bookshelf_reviews').doc(id).remove()
        return { statusCode: 200, headers, body: JSON.stringify({ code: 0 }) }
      } catch {}

      return { statusCode: 404, headers, body: JSON.stringify({ code: 1, message: '未找到该记录' }) }
    }

    return { statusCode: 405, headers, body: JSON.stringify({ code: 1, message: 'Method not allowed' }) }
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ code: 1, message: err.message }) }
  }
}
