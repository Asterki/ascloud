interface User {
    userID: string;
    created: number;

    username: string;
    email: {
        value: string;
        verified: boolean;
    };

    locale: string;

    password: string;
    storageLimit: string;

    tfa: {
        secret: string;
    };
}

export type { User };
