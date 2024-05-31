import { memo, useCallback, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { produce } from 'immer';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { inputEventBus } from '@/event';
import { Node } from './type';

interface Props {
  template: Node[]
  values: Record<string, string | number>
  onChange: (id: string, value: string | number) => void
}

const TemplateForm = memo(function TemplateForm(props: Props) {
  const { template, values, onChange } = props;

  return template.map((node) => {
    switch (node.type) {
      case 'text':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={node.id}>
            <Label htmlFor={node.id} className="text-right">
              {node.id}
            </Label>
            <Input
              id={node.id}
              className="col-span-3"
              value={values[node.id]}
              placeholder={node.placeholder}
              onChange={(e) => onChange(node.id, e.target.value)}
            />
          </div>
        )
      case 'area':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={node.id}>
            <Label htmlFor={node.id} className="text-right">
              {node.id}
            </Label>
            <Textarea
              id={node.id}
              className="col-span-3"
              value={values[node.id]}
              placeholder={node.placeholder}
              onChange={(e) => onChange(node.id, e.target.value)}
              rows={5}
            />
          </div>
        )
      case 'select':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={node.id}>
            <Label htmlFor={node.id} className="text-right">
              {node.id}
            </Label>
            <Select
              value={`${values[node.id]}`}
              onValueChange={(value) => onChange(node.id, value)}
            >
              <SelectTrigger className="w-[220px]" asChild>
                <SelectValue placeholder={node.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>选项</SelectLabel>
                  {node.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )
      case 'slider':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={node.id}>
            <Label htmlFor={node.id} className="text-right">
              {node.id}
            </Label>
            <Slider
              value={[
                (values[node.id] as number) || node.min
              ]}
              onValueChange={(value) => onChange(node.id, value[0])}
              max={node.max}
              min={node.min}
              step={node.step}
              className="w-[220px]"
            />
          </div>
        )
      case 'color':
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={node.id}>
            <Label htmlFor={node.id} className="text-right">
              {node.id}
            </Label>
            <input
              id={node.id}
              type="color"
              value={values[node.id] || '#ffffff'}
              onChange={(e) => onChange(node.id, e.target.value)}
            />
            <span className="text-xs text-gray-400">{node.placeholder}</span>
          </div>
        )
      default:
        return null
    }
  })
})

export const InputDialog = memo(() => {
  const [isShow, setIsShow] = useState(false);
  const [template, setTemplate] = useState<Node[]>([]);
  const [values, setValues] = useState<Record<string, string | number>>({});

  // 改变值
  const handleChangeValue = useCallback<(id: string, value: string | number) => void>((id, value) => {
    const newValues = produce(values, (draft) => {
      draft[id] = value;
    });
    setValues(newValues);
  }, [values])

  // 打开弹窗并设置模板
  const show = useCallback<(template: Node[]) => void>(template => {
    setTemplate(template)
    setIsShow(true);
  }, [])

  // 根据事件触发打开弹窗
  useEffect(() => {
    inputEventBus.on('show', show)
    return () => {
      inputEventBus.off('show', show);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 提交，带出 values
  const handleSubmit = useCallback(() => {
    inputEventBus.emit('submit', values)
    setIsShow(false)
  }, [values])

  // 开启时清空 values，关闭时清除 submit 监听器，避免不点提交直接关闭
  useEffect(() => {
    if (!isShow) {
      inputEventBus.clear('submit')
    } else {
      setValues({})
    }
  }, [isShow])

  return (
    <Dialog
      open={isShow}
      onOpenChange={setIsShow}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>填写参数</DialogTitle>
          <DialogDescription>
            没有 required 所以需要自己做验证
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-72 overflow-auto">
          <TemplateForm
            template={template}
            values={values}
            onChange={handleChangeValue}
          />
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>提交</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
})

InputDialog.displayName = 'InputDialog'
