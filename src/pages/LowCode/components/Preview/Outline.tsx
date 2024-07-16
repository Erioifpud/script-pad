import { memo, useContext, useMemo } from 'react';
import { LowCodeContext } from '../../context/LowCodeContext/context';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
}

const getPos = (el: Element) => {
  const rect = el.getBoundingClientRect();
  const pos = {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  }
  return pos
}

const Outline = memo((props: Props) => {
  const { containerRef } = props;
  const { currentNode } = useContext(LowCodeContext);

  const rects = useMemo(() => {
    const containerEl = containerRef?.current
    if (!currentNode || !containerEl) return
    const key = currentNode.id
    const posList: ReturnType<typeof getPos>[] = []
    const els = containerEl.querySelectorAll(`[data-lowcode-node="${key}"]`)
    for (let i = 0; i < els.length; i++) {
      const el = els[i]
      posList.push(getPos(el))
    }
    return posList
  }, [containerRef, currentNode])

  return (
    <svg className="fixed w-full h-full left-0 top-0 overflow-hidden pointer-events-none">
      {rects?.map((rect, index) => {
        return (
          <rect
            key={index}
            x={rect.left}
            y={rect.top}
            width={rect.width}
            height={rect.height}
            fill="none"
            stroke="#FAB005"
            strokeWidth="2"
          />
        )
      })}
    </svg>
  )
})

export default Outline;
