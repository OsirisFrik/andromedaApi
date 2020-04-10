declare namespace Express {
    interface Request {
        token?: string;
        user?: import('../src/models/users').IUser;
    }
}