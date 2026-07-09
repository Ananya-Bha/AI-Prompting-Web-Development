/* =============================================
   EcoQuest Password Reset API
   Handles password reset token generation and validation
   ============================================= */

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// CORS headers for browser requests
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

exports.handler = async (event, context) => {
    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { action, email, token, newPassword } = JSON.parse(event.body);

        switch (action) {
            case 'request_reset':
                return await handleResetRequest(email);
            
            case 'verify_token':
                return await handleTokenVerification(token);
            
            case 'reset_password':
                return await handlePasswordReset(token, newPassword);
            
            default:
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Invalid action' })
                };
        }

    } catch (error) {
        console.error('Password reset error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};

/* =============================================
   PASSWORD RESET REQUEST
   ============================================= */
async function handleResetRequest(email) {
    if (!email) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Email is required' })
        };
    }

    try {
        // Check if user exists
        const userResult = await pool.query(
            'SELECT id, name FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            // For security, don't reveal if email exists or not
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ 
                    success: true, 
                    message: 'If an account with this email exists, you will receive reset instructions.' 
                })
            };
        }

        const user = userResult.rows[0];

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Invalidate any existing tokens for this user
        await pool.query(
            'UPDATE password_reset_tokens SET used = true WHERE user_id = $1 AND used = false',
            [user.id]
        );

        // Insert new reset token
        await pool.query(
            `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
             VALUES ($1, $2, $3)`,
            [user.id, resetToken, expiresAt]
        );

        // In a real application, you would send an email here
        // For demo purposes, we'll return the token (DON'T DO THIS IN PRODUCTION!)
        console.log(`Password reset token for ${email}: ${resetToken}`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Password reset instructions sent to your email.',
                // Remove this line in production and send actual email
                resetToken: resetToken 
            })
        };

    } catch (error) {
        console.error('Reset request error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to process reset request' })
        };
    }
}

/* =============================================
   TOKEN VERIFICATION
   ============================================= */
async function handleTokenVerification(token) {
    if (!token) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Token is required' })
        };
    }

    try {
        const tokenResult = await pool.query(
            `SELECT prt.*, u.email, u.name 
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Invalid or expired reset token' 
                })
            };
        }

        const tokenData = tokenResult.rows[0];

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                email: tokenData.email,
                message: 'Token is valid'
            })
        };

    } catch (error) {
        console.error('Token verification error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to verify token' })
        };
    }
}

/* =============================================
   PASSWORD RESET
   ============================================= */
async function handlePasswordReset(token, newPassword) {
    if (!token || !newPassword) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Token and new password are required' })
        };
    }

    if (newPassword.length < 6) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Password must be at least 6 characters long' })
        };
    }

    try {
        // Verify token is valid and not expired
        const tokenResult = await pool.query(
            `SELECT prt.*, u.id as user_id, u.email 
             FROM password_reset_tokens prt
             JOIN users u ON prt.user_id = u.id
             WHERE prt.token = $1 AND prt.used = false AND prt.expires_at > NOW()`,
            [token]
        );

        if (tokenResult.rows.length === 0) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    error: 'Invalid or expired reset token' 
                })
            };
        }

        const tokenData = tokenResult.rows[0];

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user's password
        await pool.query(
            'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [hashedPassword, tokenData.user_id]
        );

        // Mark token as used
        await pool.query(
            'UPDATE password_reset_tokens SET used = true WHERE id = $1',
            [tokenData.id]
        );

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                message: 'Password has been reset successfully. You can now sign in with your new password.'
            })
        };

    } catch (error) {
        console.error('Password reset error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to reset password' })
        };
    }
}