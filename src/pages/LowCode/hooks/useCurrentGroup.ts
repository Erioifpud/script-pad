import { useLowCodeStore } from '@/store/lowcode'
import { useCommonStore } from '@/store/common'
import { useMemo } from 'react'

export const useCurrentGroup = () => {
  const selectedGroupId = useCommonStore((state) => state.selectedGroupId)
  const groups = useLowCodeStore((state) => state.groups)
  return useMemo(() => {
    return groups.find((group) => group.id === selectedGroupId) || null
  }, [selectedGroupId, groups])
}