import { Router } from 'express';
import { register_start } from '../head_com/user/register';

// post_routes.ts

const router = Router();

router.post('/register_post', register_start);

export default router;
