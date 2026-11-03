import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  // 在这里写死你的密钥，改成你自己的
  const MY_SECRET = "123456"

  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== MY_SECRET) {
    return NextResponse.json(
      { ok: false, msg: "密钥不对" },
      { status: 401 }
    )
  }

  try {
    await revalidatePath('/sitemap.xml')
    return NextResponse.json({
      ok: true,
      msg: "已清除缓存标记，请访问 /sitemap.xml?t=111 查看最新"
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { ok: false, error: String(e) },
      { status: 500 }
    )
  }
}
