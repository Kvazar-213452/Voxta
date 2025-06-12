import express from 'express';
import { loginHandler } from '../services/login';
import { getInfoToJwtHandler } from '../services/getInfoToJwt';

const router = express.Router();

router.post('/login', loginHandler);
router.post('/get_info_to_jwt', getInfoToJwtHandler);

export default router;
