import { TreeNode } from '@/store/lowcode/type';
import { HTMLAttributes, ReactElement } from 'react';
import { cleanCSS, css2obj } from '../../utils';
import { getDefaultStyle } from '@/store/lowcode/rule';

function renderAttributesFn<T extends keyof HTMLElementTagNameMap>(attrs: Partial<HTMLAttributes<HTMLElementTagNameMap[T]>>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (mockData: Record<string, any>) => {
    const keys = Object.keys(attrs) as (keyof HTMLAttributes<HTMLElementTagNameMap[T]>)[]
    const acc: HTMLAttributes<HTMLElement> = {}
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (attrs[key] === undefined) {
        continue;
      }
      const val = attrs[key];
      const valStr = `${val}`;
      // 加入模板变量
      if (valStr.startsWith('{') && valStr.endsWith('}')) {
        const varName = valStr.slice(1, -1);
        acc[key] = mockData[varName] || '';
      } else {
        acc[key] = attrs[key];
      }
    }
    return acc;
  }
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
    const getAttributes = renderAttributesFn(node.attrs);

    // CSS 字符串转换为对象
    const cssMap = css2obj(
      cleanCSS(node.css || '')
    )

    // 条件隐藏
    if (node.removeBy && (mockData[node.removeBy] !== undefined || mockData[node.removeBy] !== null)) {
      return null;
    }

    // 列表渲染
    const isListRender = node.listBy && Array.isArray(mockData[node.listBy])
    const list = isListRender ? mockData[node.listBy] : [mockData];

    // 这里合并有很大的数据污染隐患，所以用的时候尽量避免覆写 style，列表项目的字段不要和 data 的一样

    return (
      <>
        {list.map((item: Record<string, string>, idx: number) => {
          // 把 item 和 mockData 合并
          // TODO: 这样有可能污染 mockData，但暂时想不到方法改进，或许能改成 dot prop
          const fullData = { ...mockData, ...item }
          // TODO: 估计后续会将 fullData 作为 $data 字段的值存入 fullAttributes，拿 attr 用 xxx，拿 data 中的用 data.xxx
          // 这里 attributes 要使用 fullData 计算，因为此时的 fullData 是结合了遍历后的 item 数据的
          // 通过 getAttributes 将 fullData 的数据注入 attr 模板中得到最终的 attributes
          const attributes = getAttributes(fullData);

          // 将styleOption合并到attrs的style中，如果有冲突，styleOption优先
          // 优先级：默认样式 < node.styleOption < node.css
          if (node.styleOption) {
            attributes.style = {
              ...getDefaultStyle(),
              ...(attributes.style || {}),
              ...node.styleOption,
              ...cssMap
            };
          }

          // 单独处理一些没有 children 的元素
          if (node.type === 'img') {
            return <img key={`${node.id}|${idx}`} {...attributes} />
          }

          return (
            // @ts-expect-error 这里不用那么严格，反正都能渲染出来
            <TagName key={`${node.id}|${idx}`} {...attributes}>
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
