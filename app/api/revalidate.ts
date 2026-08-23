import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const REVALIDATE_SECRET = '123456'  // 记得改成你自己的密码

  if (req.query.secret !== REVALIDATE_SECRET) {
    return res.status(401).json({ message: '密钥错误' })
  }

  try {
    const path = req.query.path as string | undefined

    if (path) {
      // 刷新单个指定页面
      await res.revalidate(path)
      return res.json({
        status: 'success',
        msg: `已刷新页面: ${path}`,
        path
      })
    } else {
      // 👉 这里是修复后的正确代码！！
      await res.revalidate('/')           // 刷新首页
      await res.revalidate('/[pageId]')   // 刷新所有文章页（适配你的项目）
      return res.json({
        status: 'success',
        msg: '已刷新首页 + 全部文章页面缓存'
      })
    }
  } catch (err) {
    return res.status(500).json({ message: '刷新失败' })
  }
}



