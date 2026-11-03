import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(req: NextRequest) {
  // 密钥直接写在这里，改成你自己的一串密码
  const MY_SECRET = "123456"

  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== MY_SECRET) {
    return NextResponse.json(
      { success: false, message: '密钥错误' },
      { status: 401 }
    )
  }

  try {
    revalidateTag('sitemap')
    return NextResponse.json({
      success: true,
      message: 'sitemap缓存标记失效，带上?t=随机数访问sitemap.xml获取最新'
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    )
  }
}
