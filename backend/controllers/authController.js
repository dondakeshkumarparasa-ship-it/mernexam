const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'exampulse_secure_jwt_token_2026';

// Register a new live student account
exports.register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are strictly required.' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or Email is already registered.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      email,
      passwordHash,
      role: 'student'
    });

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Sign in profile
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    if (user.suspended) {
      return res.status(403).json({ error: 'Account Suspended: Please contact administration.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        bookmarks: user.bookmarks,
        history: user.history,
        revisions: user.revisions
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin reset password (security questions verification)
exports.adminResetPassword = async (req, res) => {
  try {
    const { email, rollNumber, password } = req.body;
    
    // Strict mandated recovery constraints
    if (email !== 'dondakeshkumarparasa@gmail.com' || rollNumber !== '198w1a03d6') {
      return res.status(400).json({ error: 'Security Verification Failed: Incorrect answers. Password cannot be changed.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
    }

    // Try finding the administrator profile or seed it on recovery!
    let admin = await User.findOne({ email });
    const passwordHash = await bcrypt.hash(password, 10);

    if (admin) {
      admin.passwordHash = passwordHash;
      await admin.save();
    } else {
      // Seed the admin account on reset if not already created!
      admin = new User({
        name: 'Dakeshkumar Parasa',
        username: 'admin',
        email,
        passwordHash,
        role: 'admin'
      });
      await admin.save();
    }

    res.status(200).json({ success: true, message: 'Administrative master password updated successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
