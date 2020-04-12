import dotenv from 'dotenv';
import express, {Application, Router} from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import connect from './db/connection';

// import routes
import UserRoutes from './routes/userRoutes';
import ProductRoutes from './routes/productRoutes';
import OrderRoutes from './routes/orderRoutes';

dotenv.config();

// Server Class
class Server {
    public app: Application;

    constructor() { 
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        const MONGO_URI:string | undefined = process.env.MONGO_URI;

        if (typeof MONGO_URI === 'undefined') throw new Error('NO MONGO_URI')

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
        // const router: Router = express.Router();

        this.app.get('/', (req, res) => res.send(true));
        this.app.use('/api/users', new UserRoutes().router);
        this.app.use('/api/products', new ProductRoutes().router);
        this.app.use('/api/orders', new OrderRoutes().router);
    }

    public start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('🚀Server is listenning on port:', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();