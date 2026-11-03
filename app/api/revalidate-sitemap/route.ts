import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  // 从环境变量读取密钥
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { success: false, message: '密钥错误' },
      { status: 401 }
    )
  }

  try {
    // 清除 /sitemap.xml 的 ISR 缓存
    await revalidatePath('/sitemap.xml')
    return NextResponse.json({
      success: true,
      message: '缓存已标记失效，下次访问 sitemap.xml 会拉取最新 Notion 页面'
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}
