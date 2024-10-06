import { Client, Account,ID, Avatars, Databases, Query } from 'react-native-appwrite';
export const config={
    endpoint:'https://cloud.appwrite.io/v1',
    platform:'com.blue.Aora',
    projectId:'67017eb6001d730fe3b3',
    databaseId:'6701810a00229d76e372',
    userCollectionId:'6701812f001b80c7d7e8',
    videoCollectionId:'6701815b0026226d5c07',
    storageId:'67018319001382c34943'
}

const{
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
}= config







// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint) // Your Appwrite Endpoint
    .setProject(config.projectId) // Your project ID
    .setPlatform(config.platform) // Your application ID or bundle ID.



const account = new Account(client);
const avatars= new Avatars(client);
const databases= new Databases(client)


export const createUser=async(email,password,username)=>{
    try{
        const newAccount= await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if (!newAccount)throw Error;

        const avatartUrl= avatars.getInitials(username)


        await signIn(email,password);

        const newUser= await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avatar:avatartUrl
            }
        )
        return newUser

    }catch(error){
        console.log(error)
        throw new Error(error)

    }
   
}

export const signIn=async(email,password)=> {
    try{
        await account.deleteSession("current");
        const session= await account.createEmailPasswordSession(email,password)
        return session
    }catch(error){
        console.log(error)
        throw new Error(error)
    }

    
}


export const getCurrentUser=async()=>{
    try{
        const currentAccount=await account.get()

        if(!currentAccount) throw Error

        const currentUser=await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )
        if(!currentUser)throw Error

        return currentUser.documents[0]

    }catch(error){
        console.log(error)
    }
}


export const getAllPosts=async()=>{
    try{
        const posts=await databases.listDocuments(
            databaseId,
            videoCollectionId
        )        
        return posts.documents;
    }catch(error){
        throw new Error
    }
}