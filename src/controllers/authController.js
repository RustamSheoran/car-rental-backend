const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { validateAuthInput } = require('../utils/validators');

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validation = validateAuthInput(username, password);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: username.trim() }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword
      }
    });

    return res.status(201).json({
      success: true,
      data: {
        message: 'User created successfully',
        userId: user.id
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const validation = validateAuthInput(username, password);
    if (!validation.valid) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const user = await prisma.user.findUnique({
      where: { username: username.trim() }
    });

    if (!user) {
      return res.status(401).json({ success: false, error: 'User does not exist' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      data: {
        message: 'Login successful',
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

module.exports = {
  signup,
  login
};
