import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";

actor {
  type Task = {
    text : Text;
    checked : Bool;
  };

  let tasks = Map.empty<Text, Task>();

  public shared ({ caller }) func addTask(text : Text) : async () {
    let task : Task = { text; checked = false };
    if (tasks.containsKey(text)) { Runtime.trap("This task already exists") };
    tasks.add(text, task);
  };

  public shared ({ caller }) func removeTask(text : Text) : async () {
    tasks.remove(text);
  };

  public shared ({ caller }) func toggleTask(text : Text) : async () {
    switch (tasks.get(text)) {
      case (null) { Runtime.trap("No such task found") };
      case (?task) {
        let newTask : Task = { task with checked = not task.checked };
        tasks.add(text, newTask);
      };
    };
  };

  public shared ({ caller }) func updateTaskText(oldText : Text, newText : Text) : async () {
    switch (tasks.get(oldText)) {
      case (null) { Runtime.trap("No such task found") };
      case (?task) {
        let updatedTask : Task = { task with text = newText };
        tasks.remove(oldText);
        tasks.add(newText, updatedTask);
      };
    };
  };

  public query ({ caller }) func getAllTasks() : async [Task] {
    tasks.values().toArray();
  };
};
