import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUser } from '../middleware/validation';

const router = Router();
const userController = new UserController();

// Get all users
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Create new user
router.post('/', validateUser, userController.createUser);

// Update user
router.put('/:id', validateUser, userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

export const userRoutes = router; 