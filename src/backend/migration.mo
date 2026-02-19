import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  type Task = {
    text : Text;
    checked : Bool;
  };

  type OldActor = {
    tasks : Map.Map<Text, Task>;
  };

  type NewActor = {
    tasks : List.List<Task>;
  };

  public func run(old : OldActor) : NewActor {
    let newTasks = List.empty<Task>();
    for (task in old.tasks.values()) {
      newTasks.add(task);
    };
    { tasks = newTasks };
  };
};
