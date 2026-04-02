import { type ExtendedRecordMap } from 'notion-types'
import { parsePageId } from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  const override = inversePageUrlOverrides[cleanPageId]
  if (override) {
    return override
  } else {
    // 只改了这里！直接返回纯ID，不拼标题
    return parsePageId(pageId, { uuid: false }) ?? undefined
  }
}
