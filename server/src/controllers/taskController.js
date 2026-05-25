const Task=require('../models/tasks');

const createTask=async(req,res)=>{
    try{
        const{name,description}=req.body;
        if(!name){
            return res.status(400).json({message:'Task name is required'});
        }
        const newTask=new Task({
            name,
            description,
            owner:req.user.id
        });
        await newTask.save();
        return res.status(201).json(newTask);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

const getTasks=async(req,res)=>{
    try{
        const Tasks=await Task.find({owner:req.user.id});
        return res.status(200).json(Tasks);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

const updateTask=async(req,res)=>{
    try{
        const {id}=req.params;
        const updatedTask=await Task.findOneAndUpdate(
            {_id:id,owner:req.user.id},
            {$set:req.body},
            {new: true, runValidators: true}
        );
        if(!updatedTask){
            return res.status(404).json({message:'task not found'});
        }
        return res.status(200).json(updatedTask);
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

const deleteTask=async(req,res)=>{
    try{
        const {id}=req.params;
        const deletedTask=await Task.findOneAndDelete({_id:id,owner:req.user.id});
        if(!deletedTask){
            return res.status(404).json({message:'Task not found'});
        }
        return res.status(200).json({message:'Task deleted successfully'});
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
};

module.exports={
    createTask,
    getTasks,
    updateTask,
    deleteTask
};