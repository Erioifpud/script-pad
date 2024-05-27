import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Editor from './Editor';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface Props {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const RecordEdit = memo((props: Props) => {
  const { data, onChange } = props;
  const { toast } = useToast()

  const [tempCode, setTempCode] = useState<string>('');

  useEffect(() => {
    setTempCode(
      JSON.stringify(data, null, 2)
    );
  }, [data]);

  const handleApply = useCallback(() => {
    try {
      const tempData = JSON.parse(tempCode);
      onChange(tempData);
    } catch (error) {
      toast({
        title: 'JSON 解析错误',
        description: '请检查 JSON 格式是否正确',
        variant: 'destructive',
      })
    }
  }, [tempCode, onChange, toast]);

  return (
    <div className="col-span-3 w-full h-48">
      <Editor value={tempCode} onChange={setTempCode} language="json" />
      <Button size="sm" onClick={handleApply} className="my-1 w-full">应用</Button>
    </div>
  );
});

RecordEdit.displayName = 'RecordEdit';

export default RecordEdit;