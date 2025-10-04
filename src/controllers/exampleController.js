import { successResponse, errorResponse } from '../lib/responseUtils.js';
import { NotFoundError, ValidationError, BadRequestError } from '../lib/customErrors.js';
import { asyncErrorHandler } from '../middleware/errorHandler.js';

/**
 * Example controller demonstrating how to use response utilities and error handling
 */

// Example success response
const getExample = asyncErrorHandler(async (req, res) => {
  const data = {
    id: 1,
    name: "Example Item",
    description: "This is an example response"
  };
  
  successResponse(res, data, "Example data retrieved successfully");
});

// Example error handling
const getExampleWithError = asyncErrorHandler(async (req, res) => {
  const { type } = req.query;
  
  switch (type) {
    case 'not-found':
      throw new NotFoundError('Example item not found');
    
    case 'validation':
      throw new ValidationError('Validation failed', [
        { field: 'email', message: 'Email is required' },
        { field: 'password', message: 'Password must be at least 8 characters' }
      ]);
    
    case 'bad-request':
      throw new BadRequestError('Invalid request parameters');
    
    case 'server-error':
      // This will be caught by the global error handler
      throw new Error('Something went wrong on the server');
    
    default:
      successResponse(res, null, "No error type specified");
  }
});

// Example with try-catch (alternative approach)
const createExample = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    
    // Validation
    if (!name || !email) {
      return errorResponse(res, 'Name and email are required', 400);
    }
    
    // Simulate creating a resource
    const newItem = {
      id: Date.now(),
      name,
      email,
      createdAt: new Date().toISOString()
    };
    
    successResponse(res, newItem, 'Example item created successfully', 201);
  } catch (error) {
    next(error); // Pass error to global error handler
  }
};

export {
  getExample,
  getExampleWithError,
  createExample
};