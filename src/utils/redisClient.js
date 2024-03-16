import Redis from 'ioredis'
const connectToRedis = () => {
    const redisUri = process.env.REDIS_URI
    const redis = new Redis(redisUri);
    redis.on('connect', () => console.log('Connected to Redis!'));
    redis.on('error', (err) => {
        console.log('Redis Client Error', err);
        redis.disconnect(); // Disconnect from Redis
    });

    return redis
}

export default connectToRedis