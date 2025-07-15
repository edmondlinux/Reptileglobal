
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis = null;

try {
	if (process.env.UPSTASH_REDIS_URL) {
		redis = new Redis(process.env.UPSTASH_REDIS_URL);
		
		redis.on('connect', () => {
			console.log('Connected to Redis');
		});

		redis.on('error', (err) => {
			console.log('Redis connection error:', err);
			redis = null;
		});
	} else {
		console.log('Redis URL not provided, running without Redis cache');
	}
} catch (error) {
	console.log('Redis initialization failed:', error.message);
	redis = null;
}

export { redis };
