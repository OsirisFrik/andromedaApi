import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import mongoose from 'mongoose';

// import routes
// import indexRoutes from './routes/indexRoutes';
// import UserRoutes from './routes/UserRoutes';

// Server Class
class Server {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    public config(): void {
        const MONGO_URI = `mongodb+srv://dbuserTaxApi:TaxApi2k2@cluster0-u7dip.mongodb.net/test?retryWrites=true&w=majority`;
        mongoose.set('useFindAndModify', false);
        mongoose.connect(MONGO_URI || process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useCreateIndex: true
        });
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
        this.app.listen(this.app.get('port'), () => {
            console.log('🚀Server is listenning on port:', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();