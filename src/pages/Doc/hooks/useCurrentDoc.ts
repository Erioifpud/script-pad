import { useCommonStore } from '@/store/common'
import { useDocStore } from '@/store/doc'
import { useMemo } from 'react'

export const useCurrentDoc = () => {
  const selectedDocId = useCommonStore((state) => state.selectedDocId)
  const docs = useDocStore((state) => state.docs)
  return useMemo(() => {
    return docs.find((doc) => doc.id === selectedDocId)
  }, [selectedDocId, docs])
}