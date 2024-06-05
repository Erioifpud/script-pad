import { Node } from '@/components/InputDialog/type';
import { CSSProperties, ReactNode } from 'react';

/* 基础事件 */
export interface IBaseEvent {
  id: string;
  type: string;
  timestamp: Date;
}

export interface IIndicatorLoading extends IBaseEvent {
  loading: boolean;
}

export interface IInputShow extends IBaseEvent {
  template: Node[];
}

export interface IInputSubmit extends IBaseEvent {
  values: Record<string, number | string | boolean>;
}

export interface IPlaygroundShowText extends IBaseEvent {
  text: string;
}

export interface IPlaygroundShowComponent extends IBaseEvent {
  node: ReactNode;
  style: string;
  wrapperStyle: CSSProperties;
}

export interface IPlaygroundShowRawComponent extends IBaseEvent {
  node: ReactNode;
}

export interface Events {
  "indicator-loading": IIndicatorLoading;
  "input-show": IInputShow;
  "input-submit": IInputSubmit;
  "playground-show-text": IPlaygroundShowText;
  "playground-show-component": IPlaygroundShowComponent;
  "playground-show-raw-component": IPlaygroundShowRawComponent;
}