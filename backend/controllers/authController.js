import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

   
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role:'user'
    });

    await user.save();

    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    user.token = token;
    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        chatPassActive: user.chatPassActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });
    user.token = token;
    await user.save();

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        chatPassActive: user.chatPassActive,
        role:user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const promoteToMentor = async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    
    user.role = 'mentor';
    await user.save();

    res.status(200).json({ message: 'User promoted to mentor successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({ message: 'User promoted to admin successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
