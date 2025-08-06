export type Topic = {
    id: string;
    title: string;
    content: string;
    categoryId: string; // fixed from category_id
    createdAt: string | Date;
    // ...other properties...
};

export type Category = {
    id: string;
    name: string;
    // ...other properties...
};
