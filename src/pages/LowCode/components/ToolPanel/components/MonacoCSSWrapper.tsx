import Editor from './Editor';
import { memo, useCallback, useEffect, useState } from 'react';
import { useDebounceEffect } from 'ahooks';

interface Props {
  data: string;
  onChange: (data: string) => void;
}

const MonacoCSSWrapper = memo((props: Props) => {
  const { data, onChange } = props;

  const [tempCode, setTempCode] = useState<string>('');

  useEffect(() => {
    setTempCode(
      data
    );
  }, [data]);

  useDebounceEffect(() => {
    handleApply();
  }, [tempCode], { wait: 500 });

  const handleApply = useCallback(() => {
    onChange(tempCode);
  }, [onChange, tempCode]);

  return (
    <div className="flex flex-col col-span-3 w-full h-48">
      <Editor value={tempCode} onChange={setTempCode} language="css" />
      {/* <Button size="sm" onClick={handleApply} className="my-1 w-full">应用</Button> */}
    </div>
  );
});

export default MonacoCSSWrapper;