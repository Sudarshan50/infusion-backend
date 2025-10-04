import express from 'express';
import { getExample, getExampleWithError, createExample } from '../controllers/exampleController.js';

const router = express.Router();

// Example routes demonstrating the response utilities and error handling
router.get('/success', getExample);
router.get('/error', getExampleWithError);
router.post('/create', createExample);

export default router;