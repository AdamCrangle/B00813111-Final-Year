// An angular model for the layout of user objects
export interface User {
    _id: string;
    email: string;
    username: string;
    password?: string;
    rentalHistory: string[];
    currentlyRented: Array<{ Title: string; rented_on: string }>;
  }
  