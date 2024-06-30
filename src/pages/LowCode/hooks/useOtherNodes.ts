import { Group } from '@/store/lowcode/type'
import { useMemo } from 'react'

// 获取除某个节点外的其他节点
const useOtherNodes = (group: Group | null, nodeId: string) => {
  return useMemo(() => {
    if (!group || !nodeId) return []
    // return group.nodes
    return group.nodes.filter((node) => node.id !== nodeId)
  }, [group, nodeId])
}

export default useOtherNodes
