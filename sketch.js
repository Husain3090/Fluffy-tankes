var PLAY = 1;
var END = 0;
var gameState = PLAY;

var tank, tank_running, tank_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1;

var score=0;

var gameOver, restart;
var BG,bgI;

localStorage["HighestScore"] = 0;

function preload(){
  tank_running =   loadImage("tank.png");
  tank_collided = loadImage("blast.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  bgI = loadImage("desert.png");
}

function setup() {
  createCanvas(600, 350);
  
  BG = createSprite(300,100,600,200)
  tank = createSprite(50,100,20,50);
  BG.addImage(bgI);
  
  tank.addImage("tank.png", tank_running);
  tank.addImage  ("blast.png", tank_collided);
  tank.scale = 0.05;
  
  //ground = createSprite(200,300,400,20);
  //ground.addImage("ground",groundImage);
  BG.x = BG.width /2;
  BG.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,300,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
 //tank.debug = true;
  tank.setCollider("rectangle",0,0,tank.width,tank.height  )
  //obstacle1.debug = true;
  //obstacle1.setCollider("rectangle",0,0,obstacle1.width,obstacle1.height)
  background(255);
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    BG.velocityX = -(6 + 3*score/100);
  
    if(keyDown("space") && tank.y > 230) {
      tank.velocityY = -12;
   
    }
     console.log(tank.y)  
  
    tank.velocityY = tank.velocityY + 0.8
  
    if (BG.x < 150){
      BG.x = BG.width/2;
    }
  
    tank.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(tank)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    BG.velocityX = 0;
    tank.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    tank.changeAnimation("blast.png",tank_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
  fill("red")
  text("Score: "+ score, 500,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = tank.depth;
    tank.depth = tank.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,270,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
   obstacle.addImage(obstacle1)
    
        
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  tank.changeImage ("tank.png",tank_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}