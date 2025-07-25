const Task = require("../model/Task");
const taskController = {};
const { MongoClient, ObjectId } = require("mongodb"); // ObjectId는 첫 시도 코드에서 필요해서 도입

taskController.createTask = async (req, res) => {
  try {
    const { task, isComplete } = req.body;
    const newTask = new Task({ task, isComplete });
    await newTask.save();
    res.status(200).json({ status: "ok", data: newTask });
  } catch (err) {
    res.status(400).json({ status: "fail", error: err });
  }
};

taskController.getTask = async (req, res) => {
  try {
    const taskList = await Task.find({}).select("-__v");
    res.status(200).json({ status: "ok", data: taskList });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      status: "fail",
      error: {
        message: err.message,
        name: err.name,
        stack: err.stack,
      },
    });
  }
};

taskController.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } //req.body에 스키마 검증을 적용
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ status: "success", data: updatedTask });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

// 첫 풀이 (findByIdAndUpdate를 몰라서 열심히 하드 코딩... 돌아가긴 함)

// taskController.updateTask = async (req, res) => {
//   try {
//     const { isComplete: thisIsComplete } = req.body;
//     const taskId = req.params.id;

//     console.log("Received ID:", taskId); // 디버깅
//     console.log("Body isComplete:", thisIsComplete); // 디버깅

//     const filter = { _id: new ObjectId(taskId) };
//     const updateStatus = {
//       $set: {
//         isComplete: thisIsComplete,
//       },
//     };

//     const updatedTask = await Task.updateOne(filter, updateStatus);
//     console.log("Update result:", updatedTask);

//     res.status(200).json({ status: "ok", data: updatedTask });
//   } catch (err) {
//     res.status(400).json({ status: "fail", error: err });
//   }
// };

taskController.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "ok", data: deletedTask });
  } catch (error) {
    res.status(400).json({ status: "fail", error });
  }
};

// 마찬가지로 함수가 있는지 몰라서 하드 코딩...ㅎ 삭제는 됨

// taskController.deleteTask = async (req, res) => {
//   try {
//     const taskId = req.params.id;
//     const filter = { _id: new ObjectId(taskId) };

//     const deletedTask = await tasks.deleteOne(filter);

//     if (deletedTask.deletedCount === 1) {
//       console.log("Successfully deleted one task.");
//     } else {
//       console.log("No tasks matched the query. Deleted 0 tasks.");
//     }

//     res.status(200).json({ status: "ok", data: deletedTask });
//   } catch (err) {
//     res.status(400).json({ status: "fail", error: err });
//   }
// };

module.exports = taskController;
