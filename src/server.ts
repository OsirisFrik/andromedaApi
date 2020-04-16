import dotenv from 'dotenv';
dotenv.config()

import express, {Application, Router} from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import connect from './db/connection';
import exphbs from 'express-handlebars'

// import './libs/firebase';

// import routes
import UserRoutes from './routes/userRoutes';
import ProductRoutes from './routes/productRoutes';
import OrderRoutes from './routes/orderRoutes';
import indexRoutes  from './routes/index';
import { pathToFileURL } from 'url';
import path from 'path';

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
        var hbs = exphbs({
            extname: '.hbs',
            partialsDir: [
                path.join(__dirname, 'views/partials')
            ],
            layoutsDir: path.join(__dirname, 'views/layouts') 
        });

        if (typeof MONGO_URI === 'undefined') throw new Error('NO MONGO_URI');

        //db connection
        connect(MONGO_URI);
        // Settings
        this.app.set('port', process.env.PORT || 3000);
        //adding template engine
        this.app.engine('.hbs', hbs);
        this.app.set('view engine', '.hbs');
        this.app.set('views',path.join(__dirname, 'views'));
        // middlewares
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(helmet());
        this.app.use(compression());
        this.app.use(cors());

        this.app.use(express.static(__dirname + 'public/'));
    }

    public routes(): void {
        // const router: Router = express.Router();

        this.app.get('/', new indexRoutes().router);
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