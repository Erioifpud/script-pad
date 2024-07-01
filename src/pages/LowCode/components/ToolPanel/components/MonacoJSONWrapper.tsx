import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Editor from './Editor';
import { memo, useCallback, useEffect, useState } from 'react';

interface Props {
  data: Record<string, string>;
  onChange: (data: Record<string, string>) => void;
}

const MonacoJSONWrapper = memo((props: Props) => {
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
    <div className="flex flex-col col-span-3 w-full h-48">
      <Editor value={tempCode} onChange={setTempCode} language="json" />
      <Button size="sm" onClick={handleApply} className="my-1 w-full">应用</Button>
    </div>
  );
});

export default MonacoJSONWrapper;