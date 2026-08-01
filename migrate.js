import fs from "fs";
import { supabase } from "./config.js";
import userMap from "./user-map.json" with { type:"json" };


function load(file){
    return JSON.parse(
        fs.readFileSync(`firebase-export/${file}`)
    );
}


async function migrateProfiles(){

    const users = load("users.json");

    const profiles = users.map(user=>({

        id:userMap[user.uid],

        username:user.username || "collector",

        email:user.email,

        role:user.role || "user",

        xp:user.xp || 0,

        collector_level:user.level || 1,

        reputation_score:user.reputation || 0,

        avatar_url:user.avatar || null,

        bio:user.bio || null

    }));


    const {error}=await supabase
        .from("profiles")
        .upsert(profiles);


    if(error)
        console.error(error);

    else
        console.log(
            "Profiles migrated:",
            profiles.length
        );

}



async function migrateCards(){

    const cards=load("cards.json");


    const converted=cards.map(card=>({

        id:card.id,

        owner_id:
            userMap[card.ownerId] || null,

        name:card.name,

        description:card.description,

        rarity:card.rarity,

        image_url:card.image,

        serial:card.serial,

        quantity:card.quantity || 1,

        type:card.type || "STANDARD",

        price:card.price || 0,

        status:card.status || "AVAILABLE"

    }));


    const {error}=await supabase
        .from("cards")
        .upsert(converted);


    if(error)
        console.error(error);

    else
        console.log(
            "Cards migrated:",
            converted.length
        );

}



async function migrateTrades(){

    const trades=load("trades.json");


    const converted=trades.map(t=>({

        id:t.id,

        sender_id:
            userMap[t.senderId],

        receiver_id:
            userMap[t.receiverId],

        offered_card_id:
            t.offeredCard,

        requested_card_id:
            t.requestedCard,

        status:
            t.status || "PENDING",

        notes:t.notes

    }));


    const {error}=await supabase
        .from("trade_requests")
        .upsert(converted);


    if(error)
        console.error(error);

    else
        console.log(
            "Trades migrated:",
            converted.length
        );

}



async function run(){

    console.log(
        "Starting Eugene Card migration..."
    );


    await migrateProfiles();

    await migrateCards();

    await migrateTrades();


    console.log(
        "Migration completed"
    );

}


run();