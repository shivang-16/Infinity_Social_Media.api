import redisClient from "../utils/redisClient.js";

export const cacheTime = 60

const cacheMiddleware = async(req, res, next) => {
    const { path } = req;

    try {
        const cachedData = await redisClient.get(path);
        if (cachedData) {
            return res.send(JSON.parse(cachedData));
        }

        next();
    } catch (error) {
        console.error(`Cache error: ${error}`);
        next();
    }
}

export default cacheMiddleware