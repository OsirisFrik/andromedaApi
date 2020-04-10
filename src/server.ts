import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import connect from './db/connection';
// import routes
// import indexRoutes from './routes/indexRoutes';
// import UserRoutes from './routes/UserRoutes';

dotenv.config()

// Server Class
class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        const MONGO_URI:string | undefined = process.env.MONGO_URI;

        if (typeof MONGO_URI === 'undefined') throw new Error('NO MONGO URI')

        connect(MONGO_URI);
        // Settings
        this.app.set('port', process.env.PORT || 3000);
        // middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());
    }

    public routes(): void {
        const router: express.Router = express.Router();

        // this.app.use('/', indexRoutes);
        // this.app.use('/api/users', UserRoutes);
    }

    public start(): void {
        const PORT = process.env.PORT || 3000
        this.app.listen(PORT, () => {
            console.log(`Server is listenning on port: ${process.env.PORT}`);
        });
    }
}

const server = new Server();
server.start();