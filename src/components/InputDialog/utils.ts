import { eventBus } from '@/event';
import { Node } from './type';
import { InputShowEvent } from '@/event/impl';

// 调用时先发送 show 让 dialog 显示出来，同时设置模板
// 如果用户点了提交，那么 dialog 会触发 submit 事件，把 values 带出
// 调用侧要主动监听 submit 事件，once 会返回一个 promise
// （如果不点提交直接关闭，会清空 submit 下所有监听器）
export function showInputDialog(template: Node[]) {
  eventBus.publish('input-show', new InputShowEvent(template))
}