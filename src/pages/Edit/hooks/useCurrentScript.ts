import { useAppStore } from '@/store/app'
import { useCommonStore } from '@/store/common'
import { useMemo } from 'react'

export const useCurrentScript = () => {
  const selectedScriptId = useCommonStore((state) => state.selectedScriptId)
  const scripts = useAppStore((state) => state.scripts)
  return useMemo(() => {
    return scripts.find((script) => script.id === selectedScriptId)
  }, [selectedScriptId, scripts])
}