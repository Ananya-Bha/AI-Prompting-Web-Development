// Netlify Function for user data management
import { getUserProfile, updateUserProgress, createGoal, getUserGoals, trackDailyAction, verifyToken } from '../../neon-database.js';

export async function handler(event, context) {
    // Enable CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Verify authentication token
        const authHeader = event.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Missing or invalid token' })
            };
        }

        const token = authHeader.substring(7);
        const auth = verifyToken(token);
        if (!auth.success) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid token' })
            };
        }

        const userId = auth.userId;

        // Handle different HTTP methods and actions
        if (event.httpMethod === 'GET') {
            const { action } = event.queryStringParameters || {};
            
            let result;
            switch (action) {
                case 'profile':
                    result = await getUserProfile(userId);
                    break;
                case 'goals':
                    result = await getUserGoals(userId);
                    break;
                default:
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Invalid action' })
                    };
            }

            return {
                statusCode: result.success ? 200 : 400,
                headers,
                body: JSON.stringify(result)
            };

        } else if (event.httpMethod === 'POST') {
            const { action, ...data } = JSON.parse(event.body);
            
            let result;
            switch (action) {
                case 'update_progress':
                    result = await updateUserProgress(userId, data);
                    break;
                case 'create_goal':
                    result = await createGoal(userId, data);
                    break;
                case 'track_action':
                    result = await trackDailyAction(userId, data);
                    break;
                default:
                    return {
                        statusCode: 400,
                        headers,
                        body: JSON.stringify({ error: 'Invalid action' })
                    };
            }

            return {
                statusCode: result.success ? 200 : 400,
                headers,
                body: JSON.stringify(result)
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };

    } catch (error) {
        console.error('User data function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
}