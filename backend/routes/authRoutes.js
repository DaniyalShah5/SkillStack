import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { authorizeRole } from '../middleware/authorizeRole.js';
import { promoteToMentor,promoteToAdmin } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/promote-to-mentor', promoteToMentor);
router.put('/promote-to-Admin', promoteToAdmin);


router.get('/protected', authorizeRole(['mentor', 'admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected route!' });
  });

export default router;
