import { randomUUID } from '@/store/utils';
import { Events, IBaseEvent, IIndicatorLoading, IInputShow, IInputSubmit, IPlaygroundShowComponent, IPlaygroundShowRawComponent, IPlaygroundShowText } from './type';
import { CSSProperties, ReactNode } from 'react';
import { Node } from '@/components/InputDialog/type';

class BaseEvent implements IBaseEvent {
  public id: string;
  public timestamp: Date;

  constructor(public type: keyof Events) {
    this.id = randomUUID();
    this.timestamp = new Date();
  }
}

export class IndicatorLoadingEvent extends BaseEvent implements IIndicatorLoading {
  constructor(public loading: boolean) {
    super('indicator-loading');
  }
}

export class InputShowEvent extends BaseEvent implements IInputShow {
  constructor(public template: Node[]) {
    super('input-show');
  }
}

export class InputSubmitEvent extends BaseEvent implements IInputSubmit {
  constructor(public values: Record<string, number | string | boolean>) {
    super('input-submit');
  }
}

export class PlaygroundShowText extends BaseEvent implements IPlaygroundShowText {
  constructor(public text: string) {
    super('playground-show-text');
  }
}

export class PlaygroundShowComponent extends BaseEvent implements IPlaygroundShowComponent {
  constructor(public node: ReactNode, public style: string, public wrapperStyle: CSSProperties) {
    super('playground-show-component');
  }
}

export class PlaygroundShowRawComponent extends BaseEvent implements IPlaygroundShowRawComponent {
  constructor(public node: ReactNode) {
    super('playground-show-raw-component');
  }
}