import jwt from 'jsonwebtoken';
import Agent from '../models/agent.js';

 const authMiddleware = async(req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;


    // console.log(req.user);
//     const agent = await Agent.findOne({ where: { userId: req.user.id } });
// console.log(agent);

//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found for this user.' });
//     }
//     req.agentId = agent.id;

    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};



// const authMiddleware = async (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
    
//     console.log('Decoded user info:', req.user); 

//     // Find the agent based on the userId from the decoded token
//     const agent = await Agent.findOne({ where: { userId: req.user.userId } });

//     if (!agent) {
//       return res.status(404).json({ message: 'Agent not found for this user.' });
//     }
//     // Attach the agent info to the request object for further use in 
//     req.agent = agent; // Attach full agent details to req.agent
//     req.agentId = agent.id; // Optionally, store the agentId separately
//     console.log(req.agentId);
    
//     next(); // Proceed to the next middleware or route handler
//   } catch (error) {
//     console.error('Error in auth middleware:', error);
//     res.status(400).json({ message: 'Invalid token.' });
//   }
// };

// export default authMiddleware;


const authorizeAgent = (req, res, next) => {
  try {
    // Assuming the user's role is available in `req.user` (e.g., from authentication middleware)
    const role = req.user.role;
    // console.log(role);
    

    if (role !== 'agent') {
      return res.status(403).json({
        message: 'Access denied. Only agents are allowed to create packages.',
      });
    }

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.error('Error in authorization middleware:', error);
    res.status(500).json({ message: 'Server error in authorization middleware.' });
  }
};


export { authMiddleware, authorizeAgent };


