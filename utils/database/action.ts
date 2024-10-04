import { db } from "./dbConfig";
import {Notifications, Transactions, Users} from './schema'
import {eq, sql, and,desc} from 'drizzle-orm'

export async function createUser(email:string, name:string){
    try{
        const [user] = await db.insert(Users).values({email, name}).returning().execute();
        return user;
    }catch(error){
        console.error('Error creating user', error)
        return null;
    }
}

//function getUserByEmail
export async function getUserByEmail(email:string){
    try {
        const [user] = await db.select().from(Users).where(eq(Users.email , email)).execute();
        return user;
    } catch(error) {
        console.error('Error fetching user by email', error);
        return null;
    }
}

//function to get unread notifications
export async function getUnreadNotifications(userId: number){
    try {
        return await db.select().from(Notifications).where(and(eq(Notifications.userId, userId), eq(Notifications.isRead, false))).execute()
    } catch(error){
        console.error('Error fetching unread notifications', error);
        return null;
    }
}

//function to get user balance
export async function getUserBalance(userId: number):Promise<number>{
    //to check balance call getRewardTransaction function
    const transactions = await getRewardTransaction(userId) || [];
    if(!transactions) return 0;
    const balance = transactions.reduce((acc:number,transaction:any) => {
        return transaction.type.startWith('earned') ? acc + transaction.amount : acc - transaction.amount
    }, 0)
    return Math.max(balance,0)
}

//function to fetch rewards transaction
export async function getRewardTransaction(userId:number){
    try{
        const transactions = await db.select({
            id : Transactions.id,
            type : Transactions.type,
            amount : Transactions.amount,
            description : Transactions.description,
            date : Transactions.date
        }) . from(Transactions). where(eq(Transactions.userId, userId)).
        orderBy(desc(Transactions.date)).limit(10).execute();
        
        const formattedTransactions = transactions.map(t => ({
            ...t,
            date : t.date.toISOString().split('T')[0]  //format date
        }))

        return formattedTransactions

    }catch(error){
        console.error('Error fetching rewards transactions', error);
        return null;
    }

}

export async function markNotificationAsRead(notificationId:number){
       try{
        await db.update(Notifications).set({isRead : true}).where(eq(Notifications.id, notificationId)).execute();
       } catch(error){
        console.error('Error marking notification as read', error)
        return null
       } 
}

