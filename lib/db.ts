import { MongoClient } from 'mongodb';

declare var process: {
  env: {
    MONGODB_URI: string;
  };
};

export async function connectToDatabase(): Promise<MongoClient> {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  return client;
}
