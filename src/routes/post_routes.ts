import { Router } from 'express';
import { register_start, register_end } from '../head_com/user/register';

// post_routes.ts

const router = Router();

router.post('/register_post', register_start);
router.post('/register_end_post', register_end);

export default router;
