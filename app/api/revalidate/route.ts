import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// =========在这里写你的密钥，不要泄露给别人=========
const REVALIDATE_SECRET = "123456"

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const pathRaw = req.nextUrl.searchParams.get('path')

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, msg: 'secret密钥错误' }, { status: 401 })
  }

  const paths = pathRaw ? pathRaw.split(',') : ['/']
  const resultList: Array<{path:string; ok:boolean; error?:string}> = []

  for(const p of paths){
    const trimPath = p.trim()
    if(!trimPath) continue
    try {
      revalidatePath(trimPath)
      resultList.push({ path: trimPath, ok:true })
    } catch (e) {
      resultList.push({ path: trimPath, ok:false, error: String(e) })
    }
  }

  return NextResponse.json({
    ok: true,
    timestamp: Date.now(),
    revalidateResult: resultList
  })
}
