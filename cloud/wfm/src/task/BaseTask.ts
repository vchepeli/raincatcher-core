import { EventEmitter } from 'eventemitter3';
import {Result} from '../result/Result';
import {Task, TaskEventData, TaskStatus} from './Task';

/**
 * Base implementation for {@link Task}s
 * Derived classes are expected to implement their run {@link #run} methods
 */
export class BaseTask extends EventEmitter implements Task {
  public result: Result;
  /**
   * Storage field for the `status` property
   */
  protected _status: TaskStatus | number = TaskStatus.PENDING;
  protected options: any;

  /**
   * Setter for the status property
   * Emits a statusChange event when set
   */
  public set status(to: TaskStatus | number) {
    if (to === this._status) {
      // TODO: replace with logger object
      // tslint:disable-next-line:max-line-length
      console.warn('BaseTask#status setter: attempted status change to same status as current, no event will be emitted');
      return;
    }
    const previousStatus = this.getStatus();
    this._status = to;
    const currentStatus = this.getStatus();

    const e: TaskEventData<this> = {
      date: new Date(),
      previousStatus,
      currentStatus,
      task: this
    };
    this.emit('statusChange', e);
  }

  public get status() {
    return this._status;
  }

  /**
   * Start the execution.
   * This method is expected to be overridden in specific implementations
   *
   * This implementation simply sets the status to {@link TaskStatus#done}
   */
  public run() {
    this.status = TaskStatus.DONE;
  }

  public getOptionsSchema() {
    return {};
  }

  public setOptions(options: any) {
    // TODO: JsonSchema validation with http://epoberezkin.github.io/ajv/
    this.options = options;
  }

  public getStatus() {
    const roundedDownStatus = this.status - (this.status % 100);
    return roundedDownStatus || TaskStatus.PENDING;
  }
}
