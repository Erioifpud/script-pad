import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { AnyNode, Group } from './type';
import { lowCodeStorage } from '../utils/storage';
import { emptyUUID, randomUUID } from '@/store/utils';
import { produce } from 'immer';
import { cloneDeep, merge as deepMerge } from 'lodash-es';
import { createNode } from './utils';


export interface LowCodeState {
  groups: Group[]
  setGroups: (groups: Group[]) => void
  createGroup: () => void
  copyGroup: (id: string) => void
  setGroup: (id: string, group: Partial<Group>) => void
  setGroupNodes: (id: string, nodes: AnyNode[]) => void
}

export const VERSION = 0;

export const useLowCodeStore = create<LowCodeState>()(
  persist(
    (set) => ({
      groups: [],
      setGroups: (groups) => set({ groups }),
      createGroup: () => {
        const rootNode: AnyNode = createNode(emptyUUID(), '');
        const group: Group = {
          id: randomUUID(),
          name: '新分组',
          description: '',
          nodes: [rootNode],
          mockData: {},
        }
        set(state => {
          return {
            groups: [group, ...state.groups]
          }
        })
      },
      copyGroup: (id) => {
        set((state) => produce(
          state,
          (draft) => {
            const group = draft.groups.find((group) => group.id === id)
            if (group) {
              const newGroup = {
                // 要深拷贝，因为 group 一些属性是引用类型
                ...cloneDeep(group),
                id: randomUUID(),
                name: `${group.name} - 副本`,
              }
              draft.groups.unshift(newGroup)
            }
          }
        ))
      },
      setGroup: (id, group) => {
        set(state => {
          return {
            groups: state.groups.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  ...group
                }
              }
              return item
            })
          }
        })
      },
      setGroupNodes: (id, nodes) => {
        set(state => {
          return {
            groups: state.groups.map(item => {
              if (item.id === id) {
                return {
                  ...item,
                  nodes
                }
              }
              return item
            })
          }
        })
      },
    }),
    {
      name: 'script-pad-lowcode',
      // storage: createDebouncedJSONStorage(appStorage, {
      //   debounceTime: 2000,
      // }),
      storage: createJSONStorage(() => lowCodeStorage),
      // 只持久化数据字段
      partialize: (state) => ({ groups: state.groups }),
      // 当前版本
      version: VERSION,
      // eslint-disable-next-line
      migrate: (persistedState: any, version: number) => {
        // 读取到的版本如果低于当前版本，则需要做的迁移处理
        if (version === 0) {
          // persistedState.readOnly = false
          return persistedState
        }
        return persistedState
      },
      merge: (persistedState, currentState) => {
        // 读取的状态和 store 默认状态的深度合并，优先采用持久化了的状态
        return deepMerge(currentState, persistedState)
      },
    }
  )
)
