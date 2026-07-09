// Netlify Function for user authentication
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Simple mock database for testing (replace with real Neon later)
const mockUsers = [];
let userCounter = 1;

exports.handler = async (event, context) => {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { action, email, password, name } = JSON.parse(event.body);
        
        console.log('Auth function called:', { action, email, name });

        if (action === 'register') {
            // Check if user exists
            const existingUser = mockUsers.find(u => u.email === email);
            if (existingUser) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        message: 'Email already registered' 
                    })
                };
            }
            
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // Create user
            const newUser = {
                id: userCounter++,
                email,
                password_hash: hashedPassword,
                full_name: name,
                created_at: new Date().toISOString()
            };
            
            mockUsers.push(newUser);
            
            // Generate token
            const token = jwt.sign(
                { userId: newUser.id, email: newUser.email },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '24h' }
            );
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Registration successful',
                    token,
                    user: { id: newUser.id, email: newUser.email, name: newUser.full_name }
                })
            };

        } else if (action === 'login') {
            // Find user
            const user = mockUsers.find(u => u.email === email);
            
            if (!user) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        message: 'Invalid email or password' 
                    })
                };
            }
            
            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.password_hash);
            if (!isValidPassword) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        success: false, 
                        message: 'Invalid email or password' 
                    })
                };
            }
            
            // Generate token
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'fallback-secret',
                { expiresIn: '24h' }
            );
            
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Login successful',
                    token,
                    user: { id: user.id, email: user.email, name: user.full_name }
                })
            };

        } else {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    message: 'Invalid action. Use "register" or "login"' 
                })
            };
        }

    } catch (error) {
        console.error('Auth function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false, 
                message: 'Server error: ' + error.message 
            })
        };
    }
};