import { startServer } from './app';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';

// console.log(cpus().length);
const numCPUs = availableParallelism();

if (cluster.isPrimary) {
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  startServer();
}
