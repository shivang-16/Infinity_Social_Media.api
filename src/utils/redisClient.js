import Redis from 'ioredis'

const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS
});

redis.on('connect', () => console.log('Connected to Redis!'));
redis.on('error', (err) => console.log('Redis Client Error', err));

export default redis