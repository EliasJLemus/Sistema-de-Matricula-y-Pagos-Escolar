import {Router} from 'express';
import {createUserController} from '@/controller/users/userController';

const routerUsers = Router();

routerUsers.post('/crear-usuario', createUserController);

export default routerUsers;