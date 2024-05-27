import { memo, useCallback, useMemo } from 'react';
import Editor from './Editor';

interface Props {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RecordEdit = memo((props: Props) => {
  const { data, onChange } = props;

  const value = useMemo(() => {
    return JSON.stringify(data, null, 2);
  }, [data]);

  const handleChange = useCallback(
    (value: string) => {
      try {
        const data = JSON.parse(value);
        onChange(data);
      } catch (e) {}
    },
    [onChange]
  );

  return (
    <div className="col-span-3 w-full h-48">
      <Editor value={value} onChange={handleChange} language="json" />
    </div>
  );
});

RecordEdit.displayName = 'RecordEdit';

export default RecordEdit;