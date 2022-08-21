/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import * as data from "./data.json";

console.log('Script started successfully');

let currentPopup: any = undefined;
let botName:string = 'LibraryBot';

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags);

    var pondSound = WA.sound.loadSound("./audio/relaxing-river-sound.mp3");
    var pondConfig = {
        volume : 0.5,
        loop : true,
        rate : 1,
        detune : 1,
        delay : 0,
        seek : 0,
        mute : false
    };

    welcome();
    
    // Listening to player's request for help in the chat
    WA.chat.onChatMessage((message => {
        if (message == 'help') {
            WA.chat.sendChatMessage(data.helpInfo, botName);
        }
    }));

    // Sending a welcome message when player steps on start layer
    WA.room.onEnterLayer('start').subscribe(() => {
        welcome();
    })

    WA.room.onEnterLayer('zones/clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup","It's " + time,[]);
    })
    WA.room.onLeaveLayer('zones/clock').subscribe(closePopUp)

    // Play pound sound on approach
    WA.room.onEnterLayer('zones/pond').subscribe(() => {pondSound.play(pondConfig);});
    WA.room.onLeaveLayer('zones/pond').subscribe(() => {pondSound.stop();});
    

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopUp(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function welcome() {
    WA.chat.sendChatMessage('Welcome to the Responsible Tech Library, ' + WA.player.name + '! Type help here in the chat box at any time if you need more info.', botName);
}

export {};
