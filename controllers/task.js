const Task = require('../models/Task')

const createTaskCtrl = async (req, res, next) => {
  
    try {
        const newTask = new Task({
            title: req.body.title,
            user: req.user.id,
            completed: req.body.completed
        })

        const savedTask = await newTask.save()

        return res.status(200).send({msg: "TASK_CREATED", data: savedTask})
    } catch (error) {
        return next(error)
    }
}

const getAllTasksCtrl = async (req, res, next) => {
  
    try {
        const tasks = await Task.find({})

        if(!tasks){
            res.status(200)
            res.send({msg: "THERE_IS_NO_TASKS"})
            return
        }

        return res.status(200).send({data: tasks})


    } catch (error) {
        next(error)
    }
}

const getCurrentTaskCtrl = async (req, res, next) => {
  
    try {
        
        const tasks = await Task.find({ user: req.user.id})

        if(!tasks){
            res.status(200)
            res.send({msg: "THERE_IS_NO_TASK"})
            return
        }

        return res.status(200).send({data: tasks})

    } catch (error) {
        return next(error)
    }
}

const updateTaskCtrl = async (req, res, next) => {
  
    try {
        
        const task = await Task.findById(req.params.taskId)

        if(!task){
            res.status(500)
            res.send({msg: "THERE_IS_NO_TASK_TO_EDIT"})
            return
        }

        if(task.user.toString() !== req.user.id){
            res.status(500)
            res.send({status: 401, msg: "THERE_IS_NO_YOUR_TASK"})
            return
        }

        const updateTask = await Task.findByIdAndUpdate(req.params.taskId, {
            title: req.body.title,
            completed: req.body.completed
        }, {new: true})

        return res.status(200).send({data: updateTask})

    } catch (error) {
        return next(error)
    }
}

const deleteTaskCtrl = async (req, res, next) => {
  
    try {
        
        const task = await Task.findById(req.params.taskId)

        if(!task){
            res.status(500)
            res.send({msg: "THERE_IS_NO_TASK_TO_DELETE"})
            return
        }

        if(task.user === req.user.id){
            res.status(500)
            res.send({msg: "THERE_IS_NO_YOUR_TASK"})
            return
        }

        await Task.findByIdAndDelete(req.params.taskId)

        return res.status(200).send({data: "TASK_DELETED_SUCCESSFULLY"})

    } catch (error) {
        return next(error)
    }
}

module.exports = { createTaskCtrl, getAllTasksCtrl, getCurrentTaskCtrl, updateTaskCtrl, deleteTaskCtrl }