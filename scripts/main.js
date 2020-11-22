let ship = document.querySelector('#ship')
let gameDraw = document.querySelector('#gameDraw')

// liste
let bullets = [];

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
  // createEnemy(newRandom_x((gameDraw.offsetWidth - ship.offsetWidth)),0)
}
function newRandom_x(max){
   let v = Math.random()*max 
   return v
}
function createEnemy(x=0,y=0){
   let newEnemy = document.createElement("div");
   newEnemy.className ="enemy"
   newEnemy.style.top = y+"px"
   newEnemy.style.left = x+"px"
   gameDraw.appendChild(newEnemy);
   console.log(newEnemy)
}
function createbullet(x=0,y=0,t){
   let newBullet = document.createElement("div");
   newBullet.className ="bullet"
   newBullet.classList.add('bullet'+t);
   newBullet.style.top = y+"px"
   newBullet.style.left = x+"px"
   newBullet.speed = -5;
   gameDraw.appendChild(newBullet);
   bullets.push(newBullet)
}

setInterval(update,16);
function update(){
  // bullets = document.querySelectorAll('.bullet');
   
   for (i=bullets.length-1 ; i>=0 ; i--){
      // console.log(element)
      element = bullets[i];
      let regex = /[0-9]/g; 
      let y = parseInt(element.style.top.match(regex).join(''));
      y = y+element.speed;
      element.style.top  = y + 'px';
      if (y<0 ){
         element.remove();
         bullets.splice(i,1);
      }
   };
}
