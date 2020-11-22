let ship = document.querySelector('#ship')
let gameDraw = document.querySelector('#gameDraw')

// liste
let bullets = [];
let enemies = [];

let timer = 0;
//console.log(gameDraw);
ship.style.top = '500px';
ship.style.left = '100px'
let speed = 5  ;

document.addEventListener("keydown",function(e){ 
  // console.log(e)
   let regex = /[0-9]/g;
   let x = parseInt(ship.style.left.match(regex).join(''));
   let y = parseInt(ship.style.top.match(regex).join(''));
   if (e.keyCode === 39){
      x += speed;
      if (x<0) x = 0;
      if (x>(gameDraw.offsetWidth - ship.offsetWidth)) x = gameDraw.offsetWidth - ship.offsetWidth;
   }
   if (e.keyCode === 37){
      x -= speed;
      if (x<0) x = 0;
   }
   if (e.keyCode === 32){
         createbullet(x + ship.offsetWidth/2,y - ship.offsetHeight,"Ship");

   }
   ship.style.left = x+"px";
   
})

for (i=0; i<5 ; i++){
  createEnemy(newRandom((gameDraw.offsetWidth - ship.offsetWidth)),50*i)
}
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
   newEnemy.speed = 2 * direction;
   gameDraw.appendChild(newEnemy);
  
   console.log(newEnemy)
   enemies.push(newEnemy);
}
function createbullet(x=0,y=0,t){
   let newBullet = document.createElement("div");
   newBullet.className ="bullet"
   newBullet.classList.add('bullet'+t);
   newBullet.style.top = y+"px"
   newBullet.style.left = x+"px"

   newBullet.speed = -8 ;
   gameDraw.appendChild(newBullet);
   bullets.push(newBullet)
   return newBullet;
}

setInterval(update,16);
function update(){
  // bullets = document.querySelectorAll('.bullet');
   timer += 1;
   for (i=bullets.length-1 ; i>=0 ; i--){
      // console.log(element)
      let element = bullets[i];
      let regex = /[0-9]/g; 
      let y = parseInt(element.style.top.match(regex).join(''));
      y = y+element.speed;
      element.style.top  = y + 'px';
      // regarde si collision avec le ship
      if (element.speed>0) {
         if (collide(element,ship)){
            element.remove();
            bullets.splice(i,1);
         }
      }
      if (y<0 || y>gameDraw.offsetHeight-element.offsetHeight){
         element.remove();
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
      let element = enemies[i];
      let regex = /[0-9]/g; 
      let x = parseInt(element.style.left.match(regex).join(''));
      let y = parseInt(element.style.top.match(regex).join(''));
      x = x + element.speed;
      if (x<=0) {
         x= 0;
         element.speed = -element.speed
      }
      if (x>(gameDraw.offsetWidth - element.offsetWidth)){
         x= gameDraw.offsetWidth - element.offsetWidth;
         element.speed = -element.speed
      }
       element.style.left  = x + 'px';
      // collision bulletShip ?
      for (n=bullets.length-1 ; n>=0 ; n--){
         let b = bullets[n];
         // regarde si collision avec le ship
         if (b.speed<0) {
            if (collide(element,b)){
               b.remove();
               bullets.splice(n,1);
               element.remove()
               enemies.splice(i,1);
            }
         }
       };
      
      
       // shoot ?
      if (element.timeShoot<= timer){
         let b =createbullet(x,y,"Enemy");
         b.speed = 2;
         element.timeShoot = timer + 100 + newRandom(200);
      }
   }
}
