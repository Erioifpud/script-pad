'use client';
import ActionMenu from '@/components/ActionMenu';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { useCommonStore } from '@/store/common';
import { Doc, useDocStore } from '@/store/doc';
import { formatTime } from '@/utils/date';
import { PlusIcon } from '@radix-ui/react-icons';
import { dialog } from '@tauri-apps/api';
import classNames from 'classnames';
import { memo, useCallback } from 'react';

const DocList = memo(() => {
  const docs = useDocStore(state => state.docs);
  const createDoc = useDocStore(state => state.createDoc);
  const copyDoc = useDocStore(state => state.copyDoc);
  const setDocs = useDocStore(state => state.setDocs);
  const selectedDocId = useCommonStore(state => state.selectedDocId);
  const setSelectedDocId = useCommonStore(state => state.setSelectedDocId);

  const handleSelectDoc = useCallback((docId: string) => {
    setSelectedDocId(docId);
  }, [setSelectedDocId])

  // 删除记事本
  const handleDelete = useCallback((doc: Doc) => {
    dialog.confirm('确定删除该记事本？').then(flag => {
      if (!flag) {
        return
      }
      setDocs(docs.filter(item => item.id !== doc.id))
    })
  }, [docs, setDocs])

  const handleCopy = useCallback((doc: Doc) => {
    copyDoc(doc.id)
    toast({ title: '复制成功' })
  }, [copyDoc])

  return (
    <div className="relative h-full flex-shrink-0 overflow-hidden flex flex-col border-r border-solid border-gray-200 w-52 md:w-72 lg:w-96 xl:w-[420px]">
      <header className="border-b border-solid border-gray-200 h-[53px] flex-shrink-0 flex items-center px-2 gap-1">
        <div className="flex-grow"></div>
        <Button size="sm" className="w-full" onClick={() => createDoc()}>
          <PlusIcon></PlusIcon>
          <span>创建</span>
        </Button>

      </header>
      <div className="flex-grow h-full overflow-auto">
        {docs.map(doc => {
          return (
            <ActionMenu
              key={doc.id}
              items={[
                { id: 'copy', label: '复制', onClick: () => handleCopy(doc) },
                { id: 'delete', label: '删除', onClick: () => handleDelete(doc), className: 'text-red-500' },
              ]}
            >
              <div
                onClick={() => handleSelectDoc(doc.id)}
                className={
                  classNames(
                    "h-28 border-b border-solid border-gray-100",
                    "p-4 items-start gap-4 space-y-0 w-full overflow-hidden",
                    selectedDocId === doc.id ? "bg-gray-100" : ""
                  )
                }
              >
                <div className="w-full overflow-hidden">
                  <h3 className="font-semibold leading-none tracking-tight">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-9 line-clamp-2 w-full whitespace-normal break-all text-right italic pr-1">
                    {formatTime(doc.updatedAt, '修改于 yyyy-MM-dd HH:mm')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 w-full whitespace-normal break-all text-right pr-1">
                    {formatTime(doc.createdAt, '创建于 yyyy-MM-dd HH:mm')}
                  </p>
                </div>
                <div className="action">

                </div>
              </div>
            </ActionMenu>
          )
        })}
      </div>
    </div>
  )
})

export default DocList
