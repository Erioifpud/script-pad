import { TreeNode } from '@/store/lowcode/type';
import { HTMLAttributes, ReactElement } from 'react';
import { cleanCSS, css2obj } from '../../utils';
import { getDefaultStyle } from '@/store/lowcode/rule';
import { get, template, templateSettings } from 'lodash-es';

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
      // 处理样式变量
      if (key === 'style' && Object.prototype.toString.call(val) === '[object Object]') {
        acc.style = renderAttributesFn<T>(val)(mockData)
        return acc;
      }
      const valStr = `${val}`;
      // 加入模板变量（attribute 不需要使用 template）
      if (valStr.startsWith('{') && valStr.endsWith('}')) {
        const varName = valStr.slice(1, -1);
        acc[key] = get(mockData, varName, '')
        // acc[key] = mockData[varName] || '';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): (mockData: Record<string, any>) => (ReactElement | null) {
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
    if (node.removeBy) {
      const hide = node.removeBy.startsWith('!')
        ? !get(mockData, node.removeBy.slice(1))
        : get(mockData, node.removeBy)
      if (hide) {
        return null
      }
    }

    // 列表渲染
    const listData = get(mockData, node.listBy)
    const isListRender = node.listBy && Array.isArray(listData)
    const list = isListRender ? listData : [mockData];

    // 这里合并有很大的数据污染隐患，所以用的时候尽量避免覆写 style，列表项目的字段不要和 data 的一样

    return (
      <>
        {list.map((item: Record<string, string>, idx: number) => {
          // 把 item 和 mockData 合并
          const fullData = { ...mockData, $for: item }
          // 这里 attributes 要使用 fullData 计算，因为此时的 fullData 是结合了遍历后的 item 数据的
          // 通过 getAttributes 将 fullData 的数据注入 attr 模板中得到最终的 attributes: {xxx} + {xxx: 123} = 123
          const attributes = getAttributes(fullData);

          // 将styleOption合并到attrs的style中，如果有冲突，styleOption优先
          // 优先级：默认样式 < attributes.style < node.styleOption < node.css
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
            return <img key={`${node.id}|${idx}`} {...attributes} data-lowcode-node={node.id} />
          }

          // lodash 的模版函数
          templateSettings.interpolate = /{([\s\S]+?)}/g

          // 避免 mockData 缺少字段时报错
          let content
          try {
            const compiled = template(node.value)
            content = compiled(fullData)
          } catch (e) {
            console.warn(e)
            content = node.value
          }

          return (
            // @ts-expect-error 这里不用那么严格，反正都能渲染出来
            <TagName key={`${node.id}|${idx}`} {...attributes} data-lowcode-node={node.id}>

              {node.value && content}

              {/* 递归渲染子节点 */}
              {node.children?.map((child) => renderTreeNodeFn(child)(fullData))}
            </TagName>
          )
        })}
      </>
    )
  }
}
