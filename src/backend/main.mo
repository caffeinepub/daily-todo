import Text "mo:core/Text";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Task = {
    text : Text;
    checked : Bool;
  };

  let tasks = List.empty<Task>();

  public shared ({ caller }) func addTask(text : Text) : async () {
    for (task in tasks.values()) {
      if (task.text == text) {
        Runtime.trap("This task already exists");
      };
    };
    let task : Task = { text; checked = false };
    tasks.add(task);
  };

  public shared ({ caller }) func removeTask(text : Text) : async () {
    let filteredTasks = tasks.filter(
      func(task) {
        task.text != text;
      }
    );
    tasks.clear();
    tasks.addAll(filteredTasks.values());
  };

  public shared ({ caller }) func toggleTask(text : Text) : async () {
    var found = false;
    let switchedTasks = tasks.map<Task, Task>(
      func(task) {
        if (task.text == text) {
          found := true;
          { task with checked = not task.checked };
        } else {
          task;
        };
      }
    );
    if (not found) {
      Runtime.trap("No such task found");
    };
    tasks.clear();
    tasks.addAll(switchedTasks.values());
  };

  public shared ({ caller }) func updateTaskText(oldText : Text, newText : Text) : async () {
    let updatedTasks = tasks.map<Task, Task>(
      func(task) {
        if (task.text == oldText) { { task with text = newText } } else { task };
      }
    );
    tasks.clear();
    tasks.addAll(updatedTasks.values());
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.toArray();
  };
};
