# zombie_hunt
A zombie first-person shooter where you defend yourself and a building. Made using A-Frame and p5, and a library that combines the two of them, created by Craig Kapp that can be found at https://cs.nyu.edu/~kapp/aframep5/

Goal:
  You are trying to defend the building and yourself from zombies. You start with 100 health and the building starts with 500. If either are reduced to zero you lose.

  Controls:
    -WASD to move.
    -Left-click to shoot.
    -Right-Click to the aim down the sites. 
    -R to reload.   

Zombies:
  The zombies spawn at several points in a large circle, the center of which is the building you are trying to defend. 
  When they spawn they pick their target either you, or the building. 
  From that point forward they move towards their target and when they are close enough they attack it. Reducing either the target's health or yours by 20. 
  They can attack their target once every 50 frames.

The building:
  This is what you are trying to defend. It's health is displayed by a giant bar that will always face the player so you can see how much health is left from a distance. 

The weapon:
  You are armed with a rifle that starts with 60 bullets. Each magazine has 30. If a magazine runs out, you can press R to reload and draw from you stash of ammo. You can also aim down the sites by right-clicking for more accuracy.
  To kill a zombie you only have to hit it once, it will disappear, and then is dead. 

Health:
  You have 100 health, if this is reduced to zero by a zombie's attacks then you lose the game. 

Packets:
  Packets are floating and rotating boxes that will spawn randomly in the area around the building you are trying to defend. 
  There are two kinds:
    1) Health
    2) Ammo

  Health packets will give you 20 health, you cannot exceed 100. Ammo packets will give you 30 more bullets. You cannot exceed 90 bullets (30 in your current magazine and 60 in your stash. 

Time:
  Score is based on how long you survive, there is a counter at the top of your screen telling you how long you've been alive this round. 

Restarting:
  If you die, your screen will turn red and you will be shown how long you lasted. All you have to do is click to restart a new round.


I am particularly proud of two things with this project: the reloading animation, and the bullet tracking system. 

The reloading animation was just so easy. The process of creating it was a TON smoother than an anticipated and I am very satisfied with how it looks and feels. 

The bullet tracking system was not so easy at all. First of all, this was my first time doing trigonemetry in three dimensions, which was a nightmare to figure out, and to just get the computer to accurately read where each bullet should be at a given time was a nightmare. 
And THEN I had to get the game to register whether or not the bullet passed through on of the zombies so it could register it as a hit... More 3D trig. My main problem was that the bullets were moving too fast to be tracked with each frame-- they would just pass through the zombies because they cover too much ground between frames. 
My solution here was to backtrack after every frame and calculute where the bullet would have been on equal intervals between frames. This actually worked really well, and I haven't run into any moments where shooting the zombies doesn't feel right. 
This bullet tracking breaks down when the player is aiming too far off of horizontal (again, first time doing trig in 3D space) but because it's a flat map, I didn't find this too much of a hiccup.

Obviously this is an unfinished project that would have worked way better with other frameworks, but I really wanted to see what I could do with just A-Frame and p5. 

Anyway, I hope you enjoy!

-Ryan

