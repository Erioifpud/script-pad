import { TreeNode } from '@/store/lowcode/type';
import { HTMLAttributes, ReactElement } from 'react';
import { cleanCSS, css2obj } from '../../utils';
import { getDefaultStyle } from '@/store/lowcode/rule';

function renderAttributes<T extends keyof HTMLElementTagNameMap>(attrs: Partial<HTMLAttributes<HTMLElementTagNameMap[T]>>) {
  const keys = Object.keys(attrs) as (keyof HTMLAttributes<HTMLElementTagNameMap[T]>)[]
  const acc: HTMLAttributes<HTMLElement> = {}
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (attrs[key] === undefined) {
      continue;
    }
    acc[key] = attrs[key];
  }
  return acc;
}

// 生成渲染节点的函数，传入数据就能渲染出节点
export function renderTreeNodeFn<T extends keyof HTMLElementTagNameMap>(
  node: TreeNode<T>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _index?: number
): (mockData: Record<string, string>) => (ReactElement | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mockData: Record<string, any>) => {
    if (!node) return null;

    const TagName = node.type as keyof JSX.IntrinsicElements;
    const attributes = renderAttributes(node.attrs);

    // CSS 字符串转换为对象
    const cssMap = css2obj(
      cleanCSS(node.css || '')
    )

    // 将styleOption合并到attrs的style中，如果有冲突，styleOption优先
    // 优先级：默认样式 < attrs.style < node.styleOption < node.css
    if (node.styleOption) {
      attributes.style = {
        ...getDefaultStyle(),
        ...(attributes.style || {}),
        ...node.styleOption,
        ...cssMap
      };
    }

    // 条件隐藏
    if (node.removeBy && (mockData[node.removeBy] !== undefined || mockData[node.removeBy] !== null)) {
      return null;
    }

    // 列表渲染
    const isListRender = node.listBy && Array.isArray(mockData[node.listBy])
    const list = isListRender ? mockData[node.listBy] : [mockData];

    // 单独处理一些没有 children 的元素
    if (node.type === 'img') {
      return (
        // <img key={node.id} {...attributes} />
        <>
          {list.map(() => {
            return (
              <img key={node.id} {...attributes} />
            )
          })}
        </>
      )
    }

    return (
      <>
        {list.map((item: Record<string, string>) => {
          // 把 item 和 mockData 合并
          // TODO: 这样有可能污染 mockData，但暂时想不到方法改进，或许能改成 dot prop
          const fullData = { ...mockData, ...item }
          return (
            // @ts-expect-error 这里不用那么严格，反正都能渲染出来
            <TagName key={node.id} {...attributes}>
              {/* 如果value非空且不是大括号包围的表达式，则直接显示 */}
              {node.value && !node.value.startsWith('{') && !node.value.endsWith('}') && node.value}

              {/* 如果value是大括号包围的表达式，则替换占位符 */}
              {node.value && node.value.startsWith('{') && node.value.endsWith('}') && (
                <>{fullData[node.value.slice(1, -1)] || ''}</>
              )}

              {/* 递归渲染子节点 */}
              {node.children?.map((child, idx) => renderTreeNodeFn(child, idx)(fullData))}
            </TagName>
          )
        })}
      </>
    )
  }
}
