const express=require('express');
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware');
const {
    createTask,
    getTasks,
    updateTask,
    deleteTask
}=require('../controllers/taskController');

router.use(authMiddleware);

router.post('/create',createTask);
router.get('/my-tasks',getTasks);
router.patch('/update/:id',updateTask);
router.delete('/delete/:id',deleteTask);

module.exports=router;
