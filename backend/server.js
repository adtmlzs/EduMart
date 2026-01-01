const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'edumart_secret_key';

const School = require('./models/School');
const User = require('./models/User');
const Item = require('./models/Item');
const Club = require('./models/Club');
const Note = require('./models/Note');
const Poll = require('./models/Poll');
const Confession = require('./models/Confession');
const Message = require('./models/Message');
const Conversation = require('./models/Conversation');
const Notification = require('./models/Notification');
const auth = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.options('*', cors()); // Handle preflight for all routes

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://edu:edu@cluster0.l5xjdsf.mongodb.net/?appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Route Files
const notesRoutes = require('./routes/notes');
const pollsRoutes = require('./routes/polls');
const confessionsRoutes = require('./routes/confessions');
const statsRoutes = require('./routes/stats');
const clubsRoutes = require('./routes/clubs');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', async (data) => {
        const { conversationId, sender, content } = data;

        try {
            const newMessage = new Message({ conversationId, sender, content });
            await newMessage.save();

            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: content,
                updatedAt: Date.now()
            });

            const populatedMessage = await Message.findById(newMessage._id).populate('sender', 'name');
            io.to(conversationId).emit('receive_message', populatedMessage);
        } catch (error) {
            console.error('Socket send_message error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// ========================================
// AUTH ROUTES
// ========================================

const generateSchoolCode = () => {
    const prefix = 'SCH';
    const randomNum = Math.floor(Math.random() * 90) + 10;
    return `${prefix}-${randomNum}`;
};

app.post('/api/auth/register-school', async (req, res) => {
    try {
        const { name, email, password, uniqueCode } = req.body;
        const existingSchool = await School.findOne({ email });
        if (existingSchool) return res.status(400).json({ message: 'Email already registered' });

        if (!uniqueCode) return res.status(400).json({ message: 'School Code is required' });

        const existingCode = await School.findOne({ uniqueCode: uniqueCode.toUpperCase() });
        if (existingCode) return res.status(400).json({ message: 'School Code already taken' });

        const school = new School({ name, email, password, uniqueCode: uniqueCode.toUpperCase() });
        await school.save();

        const token = jwt.sign(
            { id: school._id, role: 'school', uniqueCode: school.uniqueCode },
            JWT_SECRET
        );

        res.status(201).json({
            token,
            user: { id: school._id, name: school.name, email: school.email, role: 'school', uniqueCode: school.uniqueCode }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/register-student', async (req, res) => {
    try {
        const { name, email, password, schoolCode, house } = req.body;
        const school = await School.findOne({ uniqueCode: schoolCode.toUpperCase() });
        if (!school) return res.status(400).json({ message: 'Invalid school code' });

        const user = new User({ name, email, password, role: 'student', schoolId: school._id, house });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: 'student', schoolId: school._id, house: user.house },
            JWT_SECRET
        );

        res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email, role: 'student', schoolId: user.schoolId, points: 0, house: user.house, schoolCode: school.uniqueCode }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (role === 'school') {
            const school = await School.findOne({ email, password });
            if (!school) return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: school._id, role: 'school', uniqueCode: school.uniqueCode },
                JWT_SECRET
            );

            res.json({ token, user: { id: school._id, name: school.name, email: school.email, role: 'school', uniqueCode: school.uniqueCode } });
        } else {
            const user = await User.findOne({ email, password, role: 'student' });
            if (!user) return res.status(401).json({ message: 'Invalid credentials' });

            // Check if user is banned
            if (user.isActive === false) {
                return res.status(403).json({ message: 'Your account has been suspended by the school administrator.' });
            }

            const school = await School.findById(user.schoolId);

            const token = jwt.sign(
                { id: user._id, role: 'student', schoolId: user.schoolId, house: user.house },
                JWT_SECRET
            );

            res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: 'student', schoolId: user.schoolId, points: user.points, house: user.house, clubsJoined: user.clubsJoined, schoolCode: school.uniqueCode } });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ========================================
// API ROUTES
// ========================================

app.use('/api/notes', notesRoutes);
app.use('/api/polls', pollsRoutes);
app.use('/api/confessions', confessionsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/clubs', clubsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Items API
app.get('/api/items', auth, async (req, res) => {
    try {
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const items = await Item.find({ schoolId }).populate('seller', 'name').sort({ createdAt: -1 });
        res.json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items' });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('seller', 'name email _id');
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching item details' });
    }
});

app.post('/api/items', auth, async (req, res) => {
    try {
        const { title, description, price, category, condition, imageUrl, imageAlignment } = req.body;
        const seller = req.user.id;
        const schoolId = req.user.role === 'school' ? req.user.id : req.user.schoolId;

        const item = new Item({
            title,
            description,
            price,
            category,
            condition,
            seller,
            schoolId,
            imageUrl,
            imageAlignment
        });
        await item.save();
        await User.findByIdAndUpdate(seller, { $inc: { points: 10 } });
        res.status(201).json({ item });
    } catch (error) {
        console.error('Create Item Error:', error);
        res.status(500).json({ message: 'Error creating item' });
    }
});

app.put('/api/items/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, price, category, condition, imageUrl, imageAlignment } = req.body;
        const sellerId = req.user.id;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Security check: Only seller can edit
        if (item.seller.toString() !== sellerId) {
            return res.status(403).json({ message: 'Unauthorized to edit this listing' });
        }

        const updatedItem = await Item.findByIdAndUpdate(
            id,
            { title, description, price, category, condition, imageUrl, imageAlignment },
            { new: true }
        ).populate('seller', 'name');

        res.json({ message: 'Listing updated successfully!', item: updatedItem });
    } catch (error) {
        console.error('Update Item Error:', error);
        res.status(500).json({ message: 'Error updating item' });
    }
});

app.delete('/api/items/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.id;

        const item = await Item.findById(id);
        if (!item) return res.status(404).json({ message: 'Item not found' });

        // Security check: Only seller can delete
        if (item.seller.toString() !== sellerId) {
            return res.status(403).json({ message: 'Unauthorized to delete this listing' });
        }

        await Item.findByIdAndDelete(id);
        res.json({ message: 'Listing removed from Mart.' });
    } catch (error) {
        console.error('Delete Item Error:', error);
        res.status(500).json({ message: 'Error deleting item' });
    }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
