//A frame 3d code

let world;
var ground;
let started = false;
let cameraHeight = 1;

let state = 0; //0 playing, 1 paused, 2 dead 

//HUD
let HUD;
let hudTextSize = 0.2;

//crosshair variables
let crosshair;
let crosshairHeight = 0.04;
let crosshairSpace = 0.02;
let crosshairWidth = 0.005;
let crosshairColor = [0,0,0];

//gun
let gun;
let magazine;
let magazineY = 0;
let magazineDown;
let reloaded;

//ammunition
let assault_rifle;
let AR_angleX = 0;
let AR_angleY = 0;
let AR_angleZ = 0;

//90 bullets in total
let ammo = 60;
let gunAmmo = 30;
let bulletList = [];

//camera
let cameraPos;
let mouseStartX;
let mouseStartY;

let front_attack;
let back_attack;
let left_attack;
let right_attack;
let health_collect;
let ammo_collect;

//firing
let notPressed = true;

//yuppies
let yupList = [];
let yupRate = 2000;

//spawn point
let spawnPointList = [
];

//health and ammo packet lists
let healthPacketList = [];
let ammoPacketList = [];
let collectDistance = 1.5;
let packetChance = 2000; //chance to one of spawning a packet of each type each frame

//player variables
let tacoBellHealth = 500;
let defensePointHealth; //the taco bell's display
let tacoBellHealthCanvas;
let damageList = [];
let playerX;
let playerY;
let playerZ;
let health = 100;


//controls the waves of yuppies
let yuppiesMade = 0;
let waveCount = 0;

//time
let timeDisplay;
let startTime;
let currentTime;
let timeElapsed;

let deathTextTop;
let deathTextMiddle;
let deathTextBottom;
let deathAdvice;
let deathTime;
function preload(){
    
}

function setup(){
    startTime = new Date().getTime();
    //gets rid of the canvas

    //world.add();
    //creates the world
    world = new World("VRScene");
    world.camera.cameraEl.setAttribute('look-controls', "pointerLockEnabled: true");

    world.setBackground(244, 113, 30);
    
    //creates and adds the plane
    ground = new Plane({
      x:0, 
      y:0, 
      z:0, 
      width: 1000, 
      height: 1000, 
      red:100, 
      green:100, 
      blue:100, 
      rotationX:-90
   });
   world.add(ground);
    
    //--------------------------------------------------------HUD---------------------------------
    HUD = new Container3D({x:0, y:0, z:-0.1});
    crosshair = new Container3D({x:0, y:0, z:0});
    
    /*
    //Crosshair's vertical lines
    crosshairYBottom = new Plane({
      x:0, 
      y:(crosshairHeight - (crosshairSpace / 2)), 
      z:0, 
      width: crosshairWidth, 
      height: crosshairHeight, 
      red:crosshairColor[0], 
      green:crosshairColor[1], 
      blue:crosshairColor[2], 
   });
    crosshair.addChild(crosshairYBottom);
    
    crosshairYTop = new Plane({
      x:0, 
      y: -(crosshairHeight - (crosshairSpace / 2)), 
      z:0, 
      width: crosshairWidth, 
      height: crosshairHeight, 
      red:crosshairColor[0], 
      green:crosshairColor[1], 
      blue:crosshairColor[2], 
   });
    crosshair.addChild(crosshairYTop);
    
    //Crosshair's horizontal lines
    crosshairXRight = new Plane({
      x:(crosshairHeight - (crosshairSpace / 2)), 
      y:0, 
      z:0, 
      width: crosshairHeight, 
      height: crosshairWidth, 
      red:crosshairColor[0], 
      green:crosshairColor[1], 
      blue:crosshairColor[2], 
   });
    crosshair.addChild(crosshairXRight); 
    
    crosshairXLeft = new Plane({
      x: - (crosshairHeight - (crosshairSpace / 2)), 
      y: 0, 
      z:0, 
      width: crosshairHeight, 
      height: crosshairWidth, 
      red:crosshairColor[0], 
      green:crosshairColor[1], 
      blue:crosshairColor[2], 
   });
    crosshair.addChild(crosshairXLeft);
    
    //creates the crosshair's dot
    crosshairDot = new Plane({
      x:0, 
      y:0, 
      z:0, 
      width: crosshairWidth, 
      height: crosshairWidth, 
        red:crosshairColor[0], 
      green:crosshairColor[1], 
      blue:crosshairColor[2], 
   });
    crosshair.addChild(crosshairDot);
    */
    
    //Ammunition text at the bottom right
    ammoDisplay = new Text({
        text: gunAmmo + '/' + ammo,
        red: 0,
        green: 0,
        blue: 0,
        x: 0.12,
        y: -0.075,
        z: 1,
        scaleX: 1 * hudTextSize,
        scaleY: 1 * hudTextSize, 
    });
    crosshair.addChild(ammoDisplay);
    
    //Health Text
    healthDisplay = new Text({
        text: health,
        red: 0,
        green: 0,
        blue: 0,
        x: -0.12,
        y: -0.075,
        z: 1,
        scaleX: 1 * hudTextSize,
        scaleY: 1 * hudTextSize, 
    });
    crosshair.addChild(healthDisplay);
    
    //time text
    timeDisplay = new Text({
        text: timeElapsed,
        red: 0, 
        green: 0, 
        blue: 0, 
        x: 0,
        y: 0.075,
        z: 1,
        scaleX: 1 * hudTextSize,
        scaleY: 1 * hudTextSize,
    });
    crosshair.addChild(timeDisplay);
    
    //creates the plane's that become visible depending on the angle player is attacked from
    front_attack = new Plane({
        x: 0, 
        y:0.5, 
        z:1.075,
        width:1, 
        height: 1, 
        red: 255, 
        green: 0, 
        blue: 0,
       opacity: 0.0, //changes when player is attacked from the front
    });
    crosshair.addChild(front_attack);
    
    back_attack = new Plane({
        x: 0, 
        y:-0.5, 
        z:1.075,
        width:1, 
        height: 1, 
        red: 255, 
        green: 0, 
        blue: 0,
       opacity: 0.0, //changes when player is attacked from the front
    });
    crosshair.addChild(back_attack);
    
    left_attack = new Plane({
        x: -0.5, 
        y:0, 
        z:1.075,
        width:1, 
        height: 1, 
        red: 255, 
        green: 0, 
        blue: 0,
       opacity: 0.0, //changes when player is attacked from the front
    });
    crosshair.addChild(left_attack);
    
    right_attack = new Plane({
        x: 0.5, 
        y:0, 
        z:1.075,
        width:1, 
        height: 1, 
        red: 255, 
        green: 0, 
        blue: 0,
       opacity: 0.0, //changes when player is attacked from the front
    });
    crosshair.addChild(right_attack);
    
    health_collect = new Plane ({
        x: 0,
        y: 0, 
        z: 1.075, 
        width: 1, 
        height: 1, 
        red: 52, 
        green: 124, 
        blue: 44, 
        opacity: 1.0, //changes when the player collects a health pack 
    });
    crosshair.addChild(health_collect);
    
    ammo_collect = new Plane ({
        x: 0,
        y: 0, 
        z: 1.075, 
        width: 1, 
        height: 1, 
        red: 0, 
        green:0, 
        blue: 0, 
        opacity: 0.0, //changes when the player collects a health pack 
    });
    crosshair.addChild(ammo_collect);
    
    //death text
    deathTextTop = new Text({
        text: "You survived for",
        red: 0,
        green: 0,
        blue: 0,
        x: 0,
        y: 0.01,
        z: 1.075,
        opacity: 0,
        scaleX: 1 * hudTextSize / 2,
        scaleY: 1 * hudTextSize / 2, 
    });
    crosshair.addChild(deathTextTop);
    
    deathTextMiddle = new Text ({
        text: int(timeElapsed / 1000),
        red: 0,
        green: 0,
        blue: 0,
        x: 0,
        y: 0.0,
        z: 1.075,
        opacity: 0,
        scaleX: 1 * hudTextSize / 2,
        scaleY: 1 * hudTextSize / 2, 
    });
    crosshair.addChild(deathTextMiddle);
    
    deathTextBottom = new Text ({
        text: "seconds",
        red: 0,
        green: 0,
        blue: 0,
        x: 0,
        y: -0.01,
        z: 1.075,
        opacity: 0,
        scaleX: 1 * hudTextSize / 2,
        scaleY: 1 * hudTextSize / 2, 
    });
    crosshair.addChild(deathTextBottom);
    
    deathAdvice = new Text ({
        text: "*click to restart*",
        red: 0,
        green: 0,
        blue: 0,
        x: 0,
        y: -0.015,
        z: 1.075,
        opacity: 0,
        scaleX: 1 * hudTextSize / 4,
        scaleY: 1 * hudTextSize / 4, 
    });
    crosshair.addChild(deathAdvice);
    
    //creates the assault rifle
    assault_rifle = new Container3D({x:0.025, y:-0.03, z:1.02});
    
    //rifle
    gun = new OBJ({
      asset: 'rifle_obj',
      mtl: 'rifle_mtl',
      x: 0,
      y: 0,
      z: 0,
      scaleX:0.015,
      scaleY:0.015,
      scaleZ:0.015,
        rotationY: 90,
        rotationZ: 0,
    });

    assault_rifle.addChild(gun);
    
    //magazine
    magazine = new OBJ({
      asset: 'magazine_obj',
      mtl: 'magazine_mtl',
      x: 0,
      y: 0,
      z: 0.02,
      scaleX:0.015,
      scaleY:0.015,
      scaleZ:0.015,
        rotationY: 90,
        rotationZ: 0,
    });
    assault_rifle.addChild(magazine);
    
    crosshair.addChild(assault_rifle);
    HUD.addChild(crosshair);
    //HUD.addChild(ammoDisplay);
    world.camera.cursor.addChild(HUD);
    world.camera.cursor.show();
    world.camera.cursor.setOpacity(0);
    
    //----------------------------------------SPAWN POINTS-----------------------
    
    let spawnPointDistance = 250;
    //creates 10 spawn points around the taco bell
    for (let i = 0; i < 10; i++){
        let angle = 36 * i;
        x = spawnPointDistance * cos(angle);
        z = spawnPointDistance * sin(angle);
        spawnPointList.push(new SpawnPoint(x, 0.5, z, i))
    }
    
    //taco bell
    
    taco_bell = new OBJ({
      asset: 'taco_bell_obj',
      mtl: 'taco_bell_mtl',
      x: 0,
      y: 0,
      z: 0.0,
      scaleX:0.5,
      scaleY:0.5,
      scaleZ:0.5,
        rotationY: 0,
        rotationZ: 0,
    });
    world.add(taco_bell);
    
    
    //displays the defense point's health above the defense point
    let tacoBellHealthCanvas = createCanvas(1000, 250).id();
    defensePointHealth = new Plane({
        x:0, 
        y:10, 
        z:0, 
        asset: tacoBellHealthCanvas,
        width: 8, 
      height: 2, 
        dynamicTexture: true,
		dynamicTextureWidth: 1000,
		dynamicTextureHeight: 250
    });
    world.add(defensePointHealth);
    
    /*
    let testYup = new Yuppy(0, 1, 0, yupList.length);
    testYup.attacks += 50;
    yupList.push(testYup);
    */
    
}

function draw(){
    //playing loop
    if (state == 0){
                            //for camera's x value AFrameP5Utils.camera_positionWorld.x;
                            //for camera's y value AFrameP5Utils.camera_positionWorld.y;
                            //for camera's z value AFrameP5Utils.camera_positionWorld.z;
                            //for camera's rotation AFrameP5Utils.camera_rotation.y

        currentTime = new Date().getTime();
        timeElapsed = currentTime - startTime;
        
        //updates the health, ammo, and time display
        ammoDisplay.setText(gunAmmo + "/" + ammo); 
        healthDisplay.setText(health);
        timeDisplay.setText(int(timeElapsed / 1000));
        
        //adds to the odds that a yuppy will spawn
        //yupRate = 2000 - int(timeElapsed / 1000);
        
       if ((int(timeElapsed / 1000) % 30) == 0 && int(timeElapsed / 1000) != 0 && int(timeElapsed / 1000) % 30 == waveCount){
           yupRate = yupRate / 2;
           waveCount++;
           console.log("New Wave");
       }
        
        //always reduces the opacity of the HUD indicators (damage, health, death screen etc)
        front_attack.setOpacity(front_attack.getOpacity() - 0.01);
        back_attack.setOpacity(back_attack.getOpacity() - 0.01);
        left_attack.setOpacity(left_attack.getOpacity() - 0.01);
        right_attack.setOpacity(right_attack.getOpacity() - 0.01);
        deathTextTop.setOpacity(deathTextTop.getOpacity() - 0.01);
        deathTextMiddle.setOpacity(deathTextMiddle.getOpacity() - 0.01);
        deathTextBottom.setOpacity(deathTextBottom.getOpacity() - 0.01);
        deathAdvice.setOpacity(deathAdvice.getOpacity() - 0.01);
        health_collect.setOpacity(health_collect.getOpacity() - 0.01);
        ammo_collect.setOpacity(ammo_collect.getOpacity() - 0.01);
        
        
        //makes sure the defense point's display is always facing the player
        defensePointHealth.rotateY(-findAngleToPlayer(0,0) - 90);
        
        //updates the defense point's health bar
        background(0, 255,0);
        fill(255, 0, 0);
        rect(0, 0, 500 - tacoBellHealth, 250); 
        
        //displays the damage values on a dynamic canvas above the defense point 
        for (let i = 0; i < damageList.length; i++){
            damageList[i].nudge(0, 0.5, 0);
            defensePointHealth.rotateY(-findAngleToPlayer(damageList[i].x, damageList[i].z) - 90);
        }
        
        
        //spawns the yuppies from the spawn points
        for (let i = 0; i < spawnPointList.length; i++){
            spawnPointList[i].spawn();
        }
        
        //bullets
        for (let i = 0; i < bulletList.length; i++){
            bulletList[i].move();
            
            bulletPosition = bulletList[i].myCube.getWorldPosition();
            
            /*
            let testSpotStill = new Sphere({
                       x:bulletPosition.x, 
                        y:bulletPosition.y, 
                        z:bulletPosition.z, 
                        red:0, 
                        green:255, 
                        blue:0,
                    scaleX: 0.1,
                    scaleY: 0.1,
                    scaleZ: 0.1
                });
                world.add(testSpotStill);
                */
            
            //checks if the bullet has hit any of the yuppies
            
            //checks all the points on the line between the previous position and the current position for a hit (accounts for the distance covered between frames)
            
            xDif = bulletPosition.x - bulletList[i].previousPosition.x;
            yDif = bulletPosition.y - bulletList[i].previousPosition.y;
            zDif = bulletPosition.z - bulletList[i].previousPosition.z;
            
            //console.log(xDif, yDif, zDif);
            //console.log(degrees(bulletList[i].userRotation.x));
            //console.log(degrees(bulletList[i].userRotation.y));
            //console.log(degrees(bulletList[i].userRotation.z));

            
            //console.log(horizontalAngle, verticalAngle);
            for(let k = 0; k < 8; k++){
                value = k * 0.25; //checks in intervals of 0.25 between the two points
                
                x = bulletList[i].previousPosition.x - (value * sin(degrees(bulletList[i].userRotation.y)));
                y = bulletList[i].previousPosition.y + (value * sin(degrees(bulletList[i].userRotation.x)));
                z = bulletList[i].previousPosition.z - (value * cos(degrees(bulletList[i].userRotation.y)));
                
                /*
                let testSpot = new Sphere({
                    x:x, 
                    y:y, 
                    z:z, 
                    red: 255 * value, 
                    green: 150, 
                    blue: 255 * value,
                    scaleX: 0.05,
                    scaleY: 0.05,
                    scaleZ: 0.05
                });
                world.add(testSpot);
                */
                
                
                //finds the angle between current and previous positions
                //finds the points at at value along the length of the line 
                for (let j = 0; j < yupList.length; j++){
                    let yupPosition = yupList[j].box.getWorldPosition();
                    //check x
                    
                    if (x < yupPosition.x + 0.25 && x > yupPosition.x - 0.25){
                        //check z
                        if (z < yupPosition.z + 0.25 && z > yupPosition.z - 0.25){
                            //check y
                            if(y < yupPosition.y + 0.5 && y > yupPosition.y - 0.25){
                                //kills the yuppy
                                yupList[j].kill();
                                yupList.splice(j, 1);
                                j++;
                            }
                        }
                    }
                }
            }
            
            bulletList[i].previousPosition = bulletPosition;
            if (bulletList[i].distance < -50){
                bulletList.splice(i, 1);
                i++;
            }
        }
        
        //health packets
        if (int(random(0, packetChance)) == 1){ 
            //spawns a new health packet
            if(healthPacketList.length < 3){
                healthPacketList.push(new HealthPacket(random(-25,50), random(-25,25)));
            }
            //healthPacketList.push(new HealthPacket(random(-25,50), random(-25,25)));
            console.log('health packet spawned');
        }

        //ammo packets
        if (int(random(0, packetChance)) == 1){ 
            //spawns a new ammo packet
            if(ammoPacketList.length < 3){
                ammoPacketList.push(new AmmoPacket(random(-25,25), random(-25,25)));
            }
            console.log('ammo packet spawned');
        }
        
        //yuppy list
        for (let i = 0; i < yupList.length; i++){
            yupList[i].draw(); //draws the yupList
        }

        //health packet List
        for (let i = 0; i < healthPacketList.length; i++){
            healthPacketList[i].draw();

            //checks each health packet to see whether or not it should be collected
            if (dist(healthPacketList[i].x, healthPacketList[i].z, AFrameP5Utils.camera_positionWorld.x, AFrameP5Utils.camera_positionWorld.z) < collectDistance){
                healthPacketList[i].collect();
                healthPacketList.splice(i, 1);
                i++;
            }
        }
        
        //ammo packet list
        for(let i = 0; i < ammoPacketList.length; i++){
            ammoPacketList[i].draw();

            //checks each ammo packet to see whether or not it should be collected
            if (dist(ammoPacketList[i].x, ammoPacketList[i].z, AFrameP5Utils.camera_positionWorld.x, AFrameP5Utils.camera_positionWorld.z) < collectDistance){
                ammoPacketList[i].collect();
                ammoPacketList.splice(i, 1);
                i++;
            }
        }
        
        //reload animation
        if (reloading){
            //changes all the angles
            if(AR_angleX <= 25 && !reloaded){
                AR_angleX += 1;
                AR_angleY +=2;
                AR_angleZ -= 1;
            }

            else {
                if(magazineDown){
                    magazineY = -0.01;
                    magazine.nudge(0, magazineY, 0);
                    if(magazine.y < -0.2){
                        magazineDown = false;
                    }
                }
                else if (!magazineDown && magazine.y < 0){
                    magazineY = 0.01;
                    magazine.nudge(0, magazineY, 0);
                }
                else {
                    reloaded = true;
                    if (ammo >= 30 - gunAmmo){
                        ammo -= (30 - gunAmmo);
                        gunAmmo = 30;
                    }
                    else if (ammo < (30 - gunAmmo)){
                        gunAmmo += ammo;
                        ammo = 0;
                    }
                }
            }

            if (reloaded && AR_angleX >= 0){
                AR_angleX -= 1;
                AR_angleY -=2;
                AR_angleZ += 1;
            }

            else if (reloaded && AR_angleX < 0){
                AR_angleX = 0;
                AR_angleY = 0;
                AR_angleZ = 0;
                reloading = false;
            }
            assault_rifle.rotateX(AR_angleX);
            assault_rifle.rotateY(AR_angleY);
            assault_rifle.rotateZ(AR_angleZ);
        }
        
        //if player's health hits zero OR taco bell health hits zero 
        if (health <= 0 || tacoBellHealth <= 0){
            //PLAY A SOUND TO INDICATE LOSS
            //change state to 2
            state = 2; //dead
            deathTextMiddle.setText(int(timeElapsed) / 1000);
            deathTime = new Date().getTime();
            deathAdvice.setOpacity(0);
        }
    }
    
    //paused
    else if (state == 1){
        
    }
    
    //dead
    else if (state == 2){  
        currentTime = new Date().getTime();
        front_attack.setOpacity(0.5);
        back_attack.setOpacity(0.5);
        left_attack.setOpacity(0.5);
        right_attack.setOpacity(0.5);
        
        deathTextTop.setOpacity(1);
        deathTextMiddle.setOpacity(1);
        deathTextBottom.setOpacity(1);
        deathAdvice.setOpacity(deathAdvice.getOpacity() + 0.01);
    }
}

//clicked
function mousePressed(event){
    //left click
    if (event.button === 0){ //shoots the gun
        //health -= 20;
        //console.log("position " + assault_rifle.x + assault_rifle.y + assault_rifle.z);
        if (notPressed && state == 0){ //can't do so when paused
            if (gunAmmo > 0 && !reloading){
                shoot();
            }
            notPressed = false;
        }
        if(notPressed && state == 2 && currentTime - deathTime > 1000){
            restart();
        }
    }
    
    //right click 
    if (event.button === 2){ //aims down the sites
        //nudge the AR to the center of the screen (to aim down the sites)
        assault_rifle.setX(0);
        assault_rifle.setY(-0.02);
    }
    
}

//release click
function mouseReleased(event){
    //left click
    if (event.button === 0){ //stops from repeating the gunfire
        notPressed = true;
    }
    
    //right click
    if(event.button === 2){ //releases the site
        assault_rifle.setX(0.025);
        assault_rifle.setY(-0.03);
    }
}

function keyPress (e) {
    
}

let reloading = false;
function keyPressed(){
    
    //R
    if (keyCode == 82 && !reloading){
        if(ammo > 0 && gunAmmo < 30){
            console.log("reload");
            reloading = true;
            reloaded = false;
            magazineDown = true;  
        }
    }

    //esc 
    if (keyCode == 27){
        if(state == 0){
            state = 1;
            console.log("Paused");
        }
        else if (state == 1){
            state = 0;
            console.log("Playing");
        }
    }
}

function shoot(){
    //creates a bullet, adds to bulletList[]
    bulletList.push(new Bullet()); 
    //reduces ammo by 1
    gunAmmo--;
}

function findAngleToPlayer(x, z){
    //takes that x and z and finds the angle between that and the player
    angleMode(DEGREES);
    return atan2(z - AFrameP5Utils.camera_positionWorld.z, x - AFrameP5Utils.camera_positionWorld.x);
}

function displayDamage(x, z){
    //displays where the player is taking damage from
    //finds if the player is looking at the thing attacking it
    let angleToAttacker = atan2(z - AFrameP5Utils.camera_positionWorld.z, x - AFrameP5Utils.camera_positionWorld.x); 
    let difference = Math.abs((AFrameP5Utils.camera_rotation.y * (180 / PI) + 90)) - Math.abs(angleToAttacker);
    //console.log(difference);
    
    //player is facing attacker
    if(difference > -45 && difference < 45){
        front_attack.setOpacity(0.5);
    }
    //attacker is to the player's left
    else if (difference < -45 && difference > -90){
        left_attack.setOpacity(0.5);
    }
    //attacker is to the player's right
    else if (difference > 45 && difference < 135){
        right_attack.setOpacity(0.5);
    }
    //attacker is behind the player
    else if(difference > 135 || difference < -90){
        back_attack.setOpacity(0.5);
    }
}

function restart(){
    console.log("restarted");
    state = 0; //sets the state back to 0 (playing);
    ammo = 60;
    gunAmmo = 30;
    
    //removes the bullets
    for(let i = 0; i < bulletList.length; i++){
        world.remove(bulletList[i].myContainer);
    }
    bulletList = [];
    
    //remove the yuppies
    for (let i = 0; i < yupList.length; i++){
        yupList[i].kill();
    }
    yupList = [];
    
    //remove the health packets
    for(let i = 0; i < healthPacketList.length; i++){
        world.remove(healthPacketList[i].packetBox);
    }
    healthPacketList = [];
    
    //remove the ammo packets
    healthPacketList = [];
    for(let i = 0; i < ammoPacketList.length; i++){
        world.remove(ammoPacketList[i].packetBox);
    }
    ammoPacketList = [];
    
    tacoBellHealth = 500;
    health = 100;
    startTime = new Date().getTime();
    //also need to reset the user's position
    
    
}