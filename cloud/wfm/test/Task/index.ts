import * as assert from 'assert';
import {Task, TaskStatus} from '../../src/task/Task';

export function suite(taskFactory: () => Task) {
  describe('Task Interface', function() {
    let task: Task;
    beforeEach(function(){
      task = taskFactory();
    });

    describe('#status property', function() {
      it('should have a default status of PENDING', function() {
        assert.strictEqual(task.getStatus(), TaskStatus.PENDING);
      });
      it('should emit a statusChange event when set', function(done) {
        task.on('statusChange', e => {
          assert.strictEqual(e.task.getStatus(), TaskStatus.DONE);
          assert.strictEqual(e.currentStatus, TaskStatus.DONE);
          assert.strictEqual(e.previousStatus, TaskStatus.PENDING);
          done();
        });
        task.updateStatus(TaskStatus.DONE);
      });
      it('should not emit a statusChange event when set to the same value', function(done) {
        task.on('statusChange', () => done('expected event not to be emitted'));
        task.updateStatus(task.getStatus());
        done();
      });
    });
    describe('#getStatus', function() {
      it('should round a custom status number to a value on the TaskStatus enum', function() {
        const customStatus = TaskStatus.IN_PROGRESS + 1;
        task.updateStatus(customStatus);
        assert.strictEqual(task.getRoundedStatus(), TaskStatus.IN_PROGRESS);
      });
    });
    describe('#getOptionSchema', function() {
      it('should return the predefined JsonSchema object');
    });
    describe('#setOptions', function() {
      it('should allow a valid set of options on top of the schema');
      it('should not allow an invalid set of options on top of the schema');
    });
  });
}
