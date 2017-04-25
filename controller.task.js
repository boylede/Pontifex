const tasks = [];

function Task(bodyPart, action, target) {
  this.bodyPart = bodyPart;
  this.action = action;
  this.target = target;
  this.claimed = false;
}

const addTask = function addTask(bodyPart, action, target) {
  tasks.push(new Task(bodyPart, action, target));
};

const getTask = function getTask(bodyPart, pos) {
  let unClaimedTasks = _.filter(tasks, (task) => !task.claimed);
  unFinishedTasks.sort((a, b) => a.pos.getRangeTo(pos) - b.pos.getRangeTo(pos));
  // return unClaimedTasks.splice(0, 1);
  return unClaimedTasks[0];
};

const finishTask = function finishTask(task) {
  tasks.splice(task, 1);
};

const listTasks = function listTasks() {
  var out = [];
  var sep = ',';
  for (var i = tasks.length - 1; i >= 0; i--) {
    let t = tasks[i];
    out.push(t.bodyPart + sep + t.action + sep + t.target.id);
  }
  return out.join(';');
};

module.exports = {
  addTask: addTask,
  getTask: getTask,
  finishTask: finishTask,
  tasks: listTasks
};