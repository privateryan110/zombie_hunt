//classes file for the different classes
class SpawnPoint{
    constructor(x, y, z, indexValue){
        this.x = x;
        this.y = y;
        this.z = z;
        this.indexValue = indexValue;
        this.spawnChance;
        
        /*
        //draws the box
        box = new Box({
             x:this.x, 
             y:this.y, 
             z:this.z, 
             width: 1, 
             depth: 1, 
             height: 1, 
             red:255, 
             green:0, 
             blue:0
        });
        world.add(box);
        */
        
        //displays the text of the box's spawnpoint index above the box
        let numberOfBox;
        numberOfBox = new Text({
            text: this.indexValue,
            x: this.x, 
            y: this.y + 3,
            z: this.z,
            red: 0, 
            green: 0, 
            blue: 0,
            scaleX: 20, scaleY: 20, scaleZ: 20
        });
        world.add(numberOfBox);
    }
    
    spawn = function(){
        this.spawnChance = int(random(0,yupRate));
        if (this.spawnChance == 1){
            yupList.push(new Yuppy(this.x, 1, this.z, yupList.length));
            yuppiesMade++;
            //console.log(yuppiesMade);
            //play a sound to indicate a yuppy has been created 
        }
    }
}

class Yuppy{
    constructor(x, y, z, index){
        this.x = x;
        this.y = y;
        this.z = z;
        this.health = 60;
        this.type = random(0, 1); //0 is girl, 1 is guy
        this.attacks = random(0,100); //0 attacks the building, 1 attacks the player
        this.distanceToTarget;
        this.speed = 0.18;
        this.targetX = 0;
        this.targetZ = 0;
        this.timeOfLastAttack = new Date().getTime(); //stores the time of the last attack
        this.currentTime = new Date().getTime(); //time stored in int miliseconds
        this.attackTime = 1000; //the time it has to take between attacks
        this.attacking = false;
        this.spin = 0;
        
        //box for testing the yuppy class
        this.box = new Box({
             x:this.x, 
             y:this.y, 
             z:this.z, 
            red: 0, 
            green: 255, 
            blue: 0,
             width: 0.5, 
             depth: 0.5, 
             height: 1, 
        });
        world.add(this.box);
    }
    
    draw = function(){  
        this.currentTime = new Date().getTime(); //sets the current time
        
        //updates the target x and z (in case target is changing)
        if(this.attacks < 50){ //target is the defense point
            this.targetX = 0;
            this.targetZ = 0;
        }
        else if (this.attacks > 50){ //target is the player
            this.targetX = AFrameP5Utils.camera_positionWorld.x;
            this.targetZ = AFrameP5Utils.camera_positionWorld.z;
        }
        
        //runs towards the target (on the x and z axis)
        let angleToTarget = atan2(this.z - this.targetZ, this.x - this.targetX);
        
        //modifies the x and z position based on the speed created by their hypotenuse
        let xMove = 0;
        let zMove = 0;
        
        //moves towards target
        if(dist(this.x, this.z, this.targetX, this.targetZ) > 2){
            xMove = -(this.speed * cos(angleToTarget));
            zMove = -(this.speed * sin(angleToTarget));
            
            if(this.attacking = true){
                this.attacking = false;
                this.spin = 0;
            }
        }
        
        //attacks target
        else{
            //if enough time has passed since last attack
            if(this.currentTime - this.timeOfLastAttack >= this.attackTime){
                this.attacking = true;
            }
        }
        
        this.box.nudge(xMove, 0, zMove);  
        this.x += xMove;
        this.z += zMove;
        
        if (this.attacking){
            this.box.spinY(50);
            this.spin += 50;
            if (this.spin >= 360){ //the animation has been completed
                this.attacking = false;
                this.timeOfLastAttack = new Date().getTime();
                this.spin = 0;

                //if target is Taco Bell
                if (this.attacks < 50){
                    tacoBellHealth -= 20; //deals 20 damage to the Taco Bell
                    console.log("Taco Bell Health: " + tacoBellHealth);
                    
                    //play a noise to indicate the Taco Bell is being attacked
                }
                //if target is player
                else if (this.attacks >= 50){
                    health -= 20; //deals 20 damage to the player
                    console.log("Player health: " + health);
                    //play a noise to show the player is being attacked
                    //show something on the player's screen to show they are being attacked.
                    displayDamage(this.x, this.z);
                        //if yuppy is to the left or right, in front or behind, tint that part of the screen that color to indicate it
                }
            }
        }
    }
    
    kill = function(){
        world.remove(this.box);
    }
}

//Ammo and Health Packets
class Packet{
    constructor(x, z){ 
        this.x = x;
        this.z = z;
        this.y = 0.5;
        this.direction = 1;
        this.red;
        this.green;
        this.blue;
        this.packetBox;
    }
    
    draw = function(){
        //console.log('drawing');
        //bobs up and down and spins
        if (this.y >= 1){
            this.direction = -1;
        }
        else if (this.y <= 0.5){
            this.direction = 1;
        }
        
        this.packetBox.nudge(0, this.direction * 0.005, 0);
        this.y += (this.direction * 0.005);
        this.packetBox.spinY(1);
    }
    
    collect = function(){
        //to be overridden
    }
}

class HealthPacket extends Packet{
    constructor(x, z){
        super(x, z);
        this.red = 255;
        this.green = 0;
        this.blue = 0;
        this.packetBox = new Box({
            x: this.x,
            y: this.y,
            z: this.z,
            height: 0.5,
            width: 0.5,
            depth: 0.5,
            red: this.red,
            green: this.green,
            blue: this.blue
        });
        world.add(this.packetBox);
    }
    
    collect = function(){
        //adds 50 to the user's health (not exceeding 100)
        
        health += 50;
        if (health > 100){
            health = 100;
        }
        
        world.remove(this.packetBox);
        
        health_collect.setOpacity(0.5);
        //console.log("collected");
    }
}

class AmmoPacket extends Packet{
    constructor(x, z){
        super(x, z);
        this.red = 0;
        this.green = 0;
        this.blue = 0;
        this.packetBox = new Box({
            x: this.x,
            y: this.y,
            z: this.z,
            height: 0.5,
            width: 0.5,
            depth: 0.5,
            red: this.red,
            green: this.green,
            blue: this.blue
        });
        world.add(this.packetBox);
    }
    
    collect = function(){
        //adds 30 to the user's ammo (with a max of 60)
        ammo += 30;
        if (ammo > 60){
            ammo = 60;
        }
        
        world.remove(this.packetBox);
        //console.log("collected");
        ammo_collect.setOpacity(0.5);
        
    }
}

class Bullet{
    constructor(){
        this.bulletSpeed = -2;
        this.distance = 0;
        this.previousPosition = world.getUserPosition();    
        //User position
        this.userPosition = world.getUserPosition();
        //User rotation
        this.userRotation = world.getUserRotation(); 
        
        //creates a container with the position and rotation of the user
        this.myContainer = new Container3D({
            rotationX: degrees(this.userRotation.x),
			rotationY: degrees(this.userRotation.y),
			rotationZ: degrees(this.userRotation.z),
			x: this.userPosition.x + crosshair.x + assault_rifle.x    ,
			y: this.userPosition.y + crosshair.y + assault_rifle.y,
			z: this.userPosition.z + crosshair.z
		});
		world.add(this.myContainer);
        
        //this is the actual bullet
        this.myCube = new Box({
			x:0,
			y:0,
			z:0,
			width:0.01,
			height:0.01,
			width:0.01,
			red:0,
			blue:0,
			green:0
		});

		// add the assset to the container (not the world!)
		this.myContainer.addChild(this.myCube);
    }
    
    move = function(){
        //change this value to change the bullet's speed
        this.myCube.nudge(0,0,this.bulletSpeed);
        this.distance += this.bulletSpeed;
        
        if (this.distance < -50){
            world.remove(this.myContainer);
        }
    }
}