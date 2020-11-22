let ship = document.querySelector('#ship')
let gameDraw = document.querySelector('#gameDraw')
let startGame = document.querySelector('.startGame')
let gameInfo = document.querySelector('.gameInfo')
console.log(gameDraw)

// liste
let bullets = [];
let enemies = [];

let timer = 0;
let currentState = "wait"
let speed = 10  ;
let timeShitShoot = 0
let ratioSpeed = Math.floor(gameDraw.offsetWidth/1200)
window.onload = ()=>{
   ship.style.top =  gameDraw.offsetHeight - ship.offsetHeight*2 + 'px';
   ship.style.left = gameDraw.offsetWidth/2  - ship.offsetWidth/2 + 'px';
   
   console.log("chargé")
   document.addEventListener("keydown",function(e){ 
     
      if (currentState === 'gameover') return;
      if (currentState === 'wait'){
         if (e.keyCode === 32){
            console.log("initGame")
            currentState = 'game';
            startGame.classList.toggle("hidden");
            gameInfo.classList.toggle("hidden");
            initGame()
         }
         return
      }
      
      let regex = /[0-9]/g;
      let x = parseInt(ship.style.left.match(regex).join(''));
      let y = parseInt(ship.style.top.match(regex).join(''));
      if (e.keyCode === 39){
         x += speed*ratioSpeed;
         if (x<0) x = 0;
         if (x>(gameDraw.offsetWidth - ship.offsetWidth)) x = gameDraw.offsetWidth - ship.offsetWidth;
      }
      if (e.keyCode === 37){
         x -= speed*ratioSpeed;
         if (x<0) x = 0;
      }
      if (e.keyCode === 32){
         if (timeShitShoot<=timer){
            createbullet(x + ship.offsetWidth/2,y - ship.offsetHeight,"Ship");
            timeShitShoot = timer + 30;
         }  
         
      }
      ship.style.left = x+"px";
      
   })
   
   setInterval(update,16);
   
};


function newRandom(max){
   let v = Math.floor(Math.random()*max )
   return v
}
function createEnemy(x=0,y=0){
   let newEnemy = document.createElement("div");
   newEnemy.className ="enemy"
   newEnemy.style.top = y+"px"
   newEnemy.style.left = x+"px"
   newEnemy.timeShoot = 100+ newRandom(100); 
   
   // Calcul de la direction
   let direction = 1
   if(newRandom(100)%2 == 0 ) direction = -1;
   newEnemy.speed = (3+newRandom(4)) * direction;
   gameDraw.appendChild(newEnemy);
   enemies.push(newEnemy);
}
function createbullet(x=0,y=0,t){
   let newBullet = document.createElement("div");
   newBullet.className ="bullet"
   newBullet.classList.add('bullet'+t);
   newBullet.style.top = Math.floor(y)+"px"
   newBullet.style.left = Math.floor(x)+"px"

   newBullet.speed = -8 ;
   gameDraw.appendChild(newBullet);
   bullets.push(newBullet)
   return newBullet;
}
// Game loop


function update(){
   if (currentState === 'wait') return;
   if (enemies.length <= 0) victory();

   ratioSpeed = Math.floor(gameDraw.offsetWidth/1200);
   timer += 1;

   for (i=bullets.length-1 ; i>=0 ; i--){  // update bullet
      let bullet = bullets[i];
      let regex = /[0-9]/g; 
      let y = parseInt(bullet.style.top.match(regex).join(''));
      y = y+bullet.speed*ratioSpeed;
      bullet.style.top  = y + 'px';
      // regarde si collision avec le ship
      if (bullet.speed>0) {
         if (collide(bullet,ship)){
            bullet.remove();
            bullets.splice(i,1);
            gameover()
            return
         }
      }
      if (y<0 || y>gameDraw.offsetHeight-bullet.offsetHeight){
         bullet.remove();
         bullets.splice(i,1);
      }
   };

   updateEnemy();   
}

function collide(obj1,obj2){
   let regex = /[0-9]/g; 
   let x1 = parseInt(obj1.style.left.match(regex).join(''));
   let y1 = parseInt(obj1.style.top.match(regex).join(''));
   let w1 = obj1.offsetWidth;
   let h1 = obj1.offsetHeight;
   
   let x2 = parseInt(obj2.style.left.match(regex).join(''));
   let y2 = parseInt(obj2.style.top.match(regex).join(''));
   let w2 = obj2.offsetWidth;
   let h2 = obj2.offsetHeight;
   
   // test de collision
   if((x2 >= x1 + w1) || (x2 + w2 <= x1) || 
      (y2 >= y1 + h1) || (y2 + h2 <= y1)) return false;
   return true
}

function updateEnemy(){
   for (i=enemies.length-1 ; i>=0 ; i--){
      let enemy = enemies[i];
      let regex = /[0-9]/g; 
      let x = parseInt(enemy.style.left.match(regex).join(''));
      let y = parseInt(enemy.style.top.match(regex).join(''));
      x = x + enemy.speed*ratioSpeed;
      if (x<=0) {
         x= 0;
         enemy.speed = -enemy.speed
      }
      if (x>(gameDraw.offsetWidth - enemy.offsetWidth)){
         x= gameDraw.offsetWidth - enemy.offsetWidth;
         enemy.speed = -enemy.speed
      }
       enemy.style.left  = x + 'px';
      // collision bulletShip ?
      for (n=bullets.length-1 ; n>=0 ; n--){
         let bullet = bullets[n];
         // regarde si collision avec le ship
         if (bullet.speed<0) {
            if (collide(enemy,bullet)){
               bullet.remove();
               bullets.splice(n,1);
               enemy.remove()
               enemies.splice(i,1);
               return;
            }
         }
       };
      
      
       // shoot ?
      if (enemy.timeShoot<= timer){
         let b =createbullet(x,y,"Enemy");
         b.speed = 6;
         enemy.timeShoot = timer + 100 + newRandom(200);
      }
   }
}
function victory(){
   clearList()
   currentState = 'wait'
   startGame.classList.toggle("hidden");
   gameInfo.innerText = "YOU WIN"
   gameInfo.classList.toggle("hidden");
   ship.style.top =  gameDraw.offsetHeight - ship.offsetHeight*2 + 'px';
   ship.style.left = gameDraw.offsetWidth/2  - ship.offsetWidth/2 + 'px'

}
function gameover(){
   currentState = 'wait'
   //reset bullet
   clearList();
   ship.style.top =  gameDraw.offsetHeight - ship.offsetHeight*2 + 'px';
   ship.style.left = gameDraw.offsetWidth/2  - ship.offsetWidth/2 + 'px'
   startGame.classList.toggle("hidden");
   gameInfo.innerText = "GAME OVER"
   gameInfo.classList.toggle("hidden");
}
function clearList(){
   for (n=bullets.length-1 ; n>=0 ; n--){
      let b = bullets[n];
      b.remove();
      bullets.splice(n,1);
    };
   
    for (n=enemies.length-1 ; n>=0 ; n--){
      let e = enemies[n];
      e.remove();
      enemies.splice(n,1);
    };
}

function initGame(){
   timeShitShoot = 0
   ship.style.top =  Math.floor(gameDraw.offsetHeight - ship.offsetHeight*2) + 'px';
   ship.style.left = Math.floor(gameDraw.offsetWidth/2  - ship.offsetWidth/2) + 'px'
   for (i=0; i<(newRandom(2)+4) ; i++){
      createEnemy(newRandom(Math.floor(gameDraw.offsetWidth - ship.offsetWidth)),Math.floor(ship.offsetHeight*1.1*i))
    }
}