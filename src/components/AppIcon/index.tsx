import classNames from 'classnames';
import { HTMLProps, memo, useMemo } from 'react';

const sizeMap = {
  1: {
    width: 72,
    height: 72,
    fontSize: 32
  },
}

const gradientPatterns = [
  'linear-gradient(to bottom, #00b4db, #0083b0)',
  'linear-gradient(to bottom, #f953c6, #b91d73)',
  'linear-gradient(to bottom, #fdc830, #f37335)',
  'linear-gradient(to bottom, #74ebd5, #acb6e5)',
  'linear-gradient(to bottom, #ff9966, #ff5e62)',
  'linear-gradient(to bottom, #396afc, #2948ff)',
  'linear-gradient(to bottom, #06beb6, #48b1bf)',
  'linear-gradient(to bottom, #ffb75e, #ed8f03)',
  'linear-gradient(to bottom, #e52d27, #b31217)',
  'linear-gradient(to bottom, #ffe259, #ffa751)',
]

interface Props {
  name: string;
  size?: keyof typeof sizeMap;
  className?: HTMLProps<HTMLElement>['className'];
  onClick?: () => void;
}

const AppIcon = memo((props: Props) => {
  const { size = 1, name } = props;

  const iconText = useMemo(() => {
    const text = name.slice(0, 2).split('').map((char) => {
      return char.toUpperCase();
    }).join('');
    return text;
  }, [name]);

  return (
    <div
      onClick={props.onClick}
      className={classNames(
        "inline-flex justify-center items-center overflow-hidden rounded-3xl text-white select-none cursor-pointer shadow-lg",
        props.className
      )}
      style={{
        width: sizeMap[size].width,
        height: sizeMap[size].height,
        background: gradientPatterns[Math.floor(Math.random() * gradientPatterns.length)],
        fontSize: sizeMap[size].fontSize,
      }}
    >
      {iconText}
    </div>
  )
})

export default AppIcon;