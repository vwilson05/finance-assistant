import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateUser } from '../middleware/validation';
import { authenticate, authorizeUser } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', validateUser, userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Protected routes
router.use(authenticate);

router.get('/profile/:id', authorizeUser(':id'), userController.getProfile.bind(userController));
router.put('/profile/:id', [validateUser, authorizeUser(':id')], userController.updateProfile.bind(userController));
router.put('/password/:id', authorizeUser(':id'), userController.changePassword.bind(userController));
router.delete('/account/:id', authorizeUser(':id'), userController.deleteAccount.bind(userController));

// Admin routes
router.get('/', userController.getAllUsers.bind(userController));
router.get('/:id', userController.getUserById.bind(userController));
router.post('/', validateUser, userController.createUser.bind(userController));
router.put('/:id', [validateUser, authorizeUser(':id')], userController.updateUser.bind(userController));
router.delete('/:id', authorizeUser(':id'), userController.deleteUser.bind(userController));

export const userRoutes = router; 