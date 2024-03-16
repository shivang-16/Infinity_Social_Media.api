import Redis from 'ioredis'

let redis;
const connectToRedis = () => {
    const redisUri = process.env.REDIS_URI
    redis = new Redis(redisUri);
    redis.on('connect', () => console.log('Connected to Redis!'));
    redis.on('error', (err) => {
        console.log('Redis Client Error', err);
        redis.disconnect(); // Disconnect from Redis
    });
}

connectToRedis();

export default redis;