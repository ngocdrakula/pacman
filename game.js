{//Khai bao id
    var body = document.getElementById("body");
    var info = document.getElementById("info");
    var gamescreen = document.getElementById("gamescreen");
    var action = document.getElementById("action");
    var img = document.getElementById("ghost");
    var canvas, c;
}
{// Khai bao bien nguoi dung
    var email = "";
    var username = "Ngoc";
}
{//Khai bao bien
    var mapLine = 16;
    var mapWeight = 30;
    var PACWeight = 24;
    var fps; 
    var fpsview = 10;
    var xPac, yPac, directionPac, statusPac, maxPlus, runLevel, paintGame;
    var presentPlus = 0;
    var colorPac ="#FFD700";
    var resetmap = 0;
    var dataMap = 0;
    var dataMaps = new Array(4);
    {//dataMaps
        dataMaps[0] = "0000000000000000022222222222222002002002000020200202202200202020020200222222222002020222002002000222020200202220020202022220020002020202222002000222020200202220020202220020020002020022222222200202202200202020020020020000202002222222222222200000000000000000";
        dataMaps[1] = "0000000000000000022222222222222002002002000020200202202202202220022200202222220000020222202002000222020222202220020202002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002222222202222200000000000000000";
        dataMaps[2] = "0000000000000000022222222222222002002001000010200202201102102120020200102022210000020211102001000222000112202120020202001020010002020201102001000222120200202120020000220220010001020112220111000101102201101020010010000010101001111111202011100000000000000000";
        dataMaps[3] = "0000000000000000022222222222222002002002000020100202202202202020022200202222220000020222202002000222020222202220020002002020020002020202222002000222020200202220020002220220020002020002220222000202202202202220020020200020202002022222202202200000000000000000";
                      // 0: tường màu đen; 1: khoảng trống màu trắng; 2: khoảng trống có điểm chấm đỏ
    }
    var map = new Array(mapLine);
    for(let i=0; i<mapLine;i++){
        map[i] = new Array(mapLine);
    }
    var Ghost= new Array(3);
    for(let i=0;i<3;i++){
        Ghost[i] = new Array(3);
    }
    var highPlus = new Array(5);
    var highPlusss = new Array(5);
    for(let i=0;i<5;i++){
        highPlus[i] = new Array(2);
        highPlus[i][0] = "Chưa có ai cả";
        highPlus[i][1] = Math.floor(Math.random()*i*10);
        highPlusss[i] = new Array(2);
        highPlusss[i][0] = highPlus[i][0];
        highPlusss[i][1] = highPlus[i][1];
    }
}
{//Canvasclick
                            // canvas.addEventListener("click",function(event){
                            //     let x = event.clientX;
                            //     let y = event.clientY;
                            //     let xInput = Math.floor(x / mapWeight);
                            //     let yInput = Math.floor(y / mapWeight);
                            //     console.log("map["+xInput+"]["+yInput+"] = "+ check(x,y));
                            // });
}
function softHighPlus(plus){
    var plustemp = plus;
    for(let i=0;i<5;i++){
        for(let j=0;j<4;j++){
            if(plustemp[j][1]<plustemp[j+1][1]){
                let nametemp = plustemp[j][0];
                let scoretemp = plustemp[j][1];
                plustemp[j][0] = plustemp[j+1][0];
                plustemp[j][1] = plustemp[j+1][1];
                plustemp[j+1][0] = nametemp;
                plustemp[j+1][1] = scoretemp;
            }
        }
    }
    return plustemp;
}
highPlus = softHighPlus(highPlus);
function resetData(statusGame){
    statusPac = 0;
    if(statusGame==0){
        presentPlus = 0;
        fps = 16;
        dataMap = 0;
    }
    resetmap = 0;
    xPac = mapWeight*1.5;
    yPac = mapWeight*1.5;
    directionPac = 1;
    {
        Ghost[0][0] = 14.5*mapWeight;Ghost[0][1] = 1.5*mapWeight;Ghost[0][2] = Math.floor(Math.random()*4);
        Ghost[1][0] = 14.5*mapWeight;Ghost[1][1] = 14.5*mapWeight;Ghost[1][2] = Math.floor(Math.random()*4);
        Ghost[2][0] = 1.5*mapWeight;Ghost[2][1] = 14.5*mapWeight;Ghost[2][2] = Math.floor(Math.random()*4);
    }
    loadMap(dataMaps[dataMap], presentPlus);
}
function run(email){
    let xy = runReturn(1, xPac, yPac, directionPac);
    xPac = xy[0];
    yPac = xy[1];
    for (let i=0;i<3;i++){
        let gxy = runReturn(0, Ghost[i][0], Ghost[i][1], Ghost[i][2]);
        Ghost[i][0] = gxy[0];   
        Ghost[i][1] = gxy[1]; 
        Ghost[i][2] = gxy[2]; 
    }
    if(statusPac<250/fps) statusPac +=1;
    else statusPac = 0;
    condition();
}
function endLevel(){
    clearInterval(runLevel);
    clearInterval(paintGame);
    gamerun(email);
}
function completeLevel(){
    clearInterval(runLevel);
    clearInterval(paintGame);
    nextLevel();
    for(let i = 0; i<4;i++){
        setTimeout(function(){
            info.innerHTML = `
                <div class="wait-start">
                <div id="myHighScore" class="myHighScore">
                </div>
                <div class="start-layout">
                <button id="start" class="startbutton">
                    Bắt đầu sau: `+(3-i)+` giây
                </button>
                <img id="logout" class="logoutimage" src="logout.png" width="36px" height="36px" title="Đăng xuất">
                </div>
                </div>`;
            if(i==1){
                resetData(presentPlus);
                paintAll();
            }
            if(i==3){
                startgame(1);
            }
        }, 1000*i);
    }
}
function nextLevel(){
    if(dataMap < 3) dataMap += 1;
    else{
        dataMap = 0;
        fps =fps/2;
    }
}
function paintAll(){
    for(let i = 0; i < mapLine; i++){
        for(let j = 0; j < mapLine; j++){
            let xPixelMap = i*mapWeight+ mapWeight/2;
            let yPixelMap = j*mapWeight + mapWeight/2;      
            let colorPixelMap = map[i][j];
            if((resetmap == 0 && colorPixelMap == 0)||colorPixelMap >0)
                paint(xPixelMap, yPixelMap, mapWeight, colorPixelMap);
        }
    }
    resetmap = 1;
    paintPac();
    paintGhost();
    // inf();

}
function paintPac(){
    if (statusPac < 125/fps){
        c.beginPath();
        c.arc(xPac,yPac,PACWeight/2,(directionPac/2+0.25)*Math.PI,(directionPac/2+1.25)*Math.PI);
        c.fillStyle = colorPac;
        c.fill();

        c.beginPath();
        c.arc(xPac,yPac,PACWeight/2,(directionPac/2-0.25)*Math.PI,(directionPac/2-1.25)*Math.PI);
        c.fillStyle = colorPac;
        c.fill();
    }
    else if(statusPac >= 125/fps){
        c.beginPath();
        c.arc(xPac, yPac, PACWeight/2, 0, 2*Math.PI);
        c.fillStyle = colorPac;
        c.fill();
    };
}
function paintGhost(){
    for(let i = 0; i < 3; i++){
        c.beginPath();
        c.drawImage(img, Ghost[i][0]-PACWeight/2, Ghost[i][1]-PACWeight/2,PACWeight,PACWeight); 
    }
}
function paint(xPixelMap, yPixelMap, pixelWeight, colorPixel){
    var color ="black";
    if(colorPixel >= 1) color = "white";
    c.beginPath();
    c.moveTo(xPixelMap, yPixelMap);
    c.lineTo(xPixelMap, yPixelMap+1);
    c.lineWidth = pixelWeight;
    c.strokeStyle = color;
    c.lineCap = "square";
    c.stroke();
    if(colorPixel == 2){
        c.beginPath();
        c.moveTo(xPixelMap, yPixelMap);
        c.lineTo(xPixelMap, yPixelMap+1);
        c.lineWidth = pixelWeight/3;
        c.strokeStyle = colorPac;
        c.lineCap = "round";
        c.stroke();
    }
}
function loadMap(dataMapInput,maxPlusInput){
    maxPlus = maxPlusInput;
    for(let i = 0; i < mapLine; i++){
        for(let j = 0; j < mapLine; j++){
            map[i][j] = dataMapInput.slice(i*mapLine + j, i*mapLine + j + 1)
            if(map[i][j] > 0) maxPlus += 1;
        }
    }
}
function runReturn(PAC_Ghost,xInput,yInput,direction){
    if(PAC_Ghost == 1 && xInput%mapWeight <= PACWeight&& yInput%mapWeight <= PACWeight){
        if(map[Math.floor(xInput/mapWeight)][Math.floor(yInput/mapWeight)] == 2){
            map[Math.floor(xInput/mapWeight)][Math.floor(yInput/mapWeight)] = 1;
            presentPlus += 1;
            if(presentPlus > highPlus[4][1]){
                highPlus[4][1] = presentPlus;
                highPlus[4][0] = username;
                inf();
                //saveHighscore("Ngoc Drakula", highPlus[4][1]);
            }
            if(presentPlus >= maxPlus){
                completeLevel();
                return([mapWeight * 1.5,mapWeight * 1.5, 1]);
            }
        }
    }
    let a=PAC_Ghost;
    PAC_Ghost = 0; 
    if(direction == 0||direction == 2){
        if(check(xInput - PACWeight/2+1, yInput + (direction - 1)*(PACWeight/2+1)) >=1 && check(xInput + PACWeight/2-1, yInput + (direction - 1)*(PACWeight/2+1)) >= 1){
                yInput += (direction-1); 
                PAC_Ghost += 1;
            }
        }
    if(direction == 1||direction == 3){
        if(check(xInput - (direction - 2)*(PACWeight/2+1), yInput - PACWeight/2+1) >= 1 && check(xInput - (direction - 2)*(PACWeight/2+1), yInput + PACWeight/2-1) >= 1){
                xInput += (2 - direction);
                PAC_Ghost += 1;
        }
    }
    if(PAC_Ghost == 0) PAC_Ghost = Math.floor(Math.random()*4); 
    else PAC_Ghost = direction;
    return([xInput, yInput, PAC_Ghost]) 
}
function condition(){
    for(let i=0;i<3;i++){
        if(Math.pow(xPac - Ghost[i][0], 2) + Math.pow(yPac - Ghost[i][1], 2) < Math.pow(PACWeight,2))
        endLevel();
    }
}
function check(xInput, yInput){  
    xInput = Math.floor(xInput / mapWeight);
    yInput = Math.floor(yInput / mapWeight);
    return map[xInput][yInput];
}
function inf(){
    console.log(highPlus[3][1]);
    highPlusss = softHighPlus(highPlus);
    console.log(highPlus[3][1]+"-");
    var str=`
        <div class="rank">
            <div class="titlerank">
                Bảng xếp hạng 
            </div>
        `;
        for(let i=1; i<6;i++){
            str=str+`
                <div class="rank`+i+`" id="rank`+i+`">
                    <div class="rankimage">
                        <img src="top`+i+`.png" height="`+(50-i*5)+`px" width="`+(50-i*5)+`px;">
                    </div>
                    <div class="rankname">
                        `+highPlusss[i-1][0]+`
                    </div>
                    <div class="rankscore">
                        `+highPlusss[i-1][1]+`
                    </div>
                </div>
            `;
        }
        str += `</div>`
        document.getElementById("action").innerHTML=str;
}
//firebase function
function saveHighscore(no, name, high_score){
    db.collection("high_scores")
    .doc().set({
        no: no,
        name: name,
        high_score: high_score
    })
    .then(function () { console.log("High score sent!"); })
    .catch(function(err) { console.error("Failed! ", err); });

}
function readHighscore(){
    
    // //db.collection("high_scores")
    // .doc().set({
    //     name: name,
    //     high_score: high_score
    // })
    // .then(function () { console.log("High score sent!"); })
    // .catch(function(err) { console.error("Failed! ", err); });
}
function gamerun(inputname, inputemail){
    email = inputemail;
    name = inputname;
    gamescreen.innerHTML = `
        <canvas id="screen" height="480px" width="480px">
        </canvas>`;
    canvas = document.getElementById("screen");
    c = canvas.getContext("2d");
    resetData(1);
    paintAll();
    if(presentPlus == 0){
        info.innerHTML = `
            <div class="wait-start">
            <div id="myHighScore" class="myHighScore">
            </div>
            <div class="start-layout">
            <button id="start" class="startbutton">
                Chơi ngay
            </button>
            <img id="logout" class="logoutimage" src="logout.png" width="36px" height="36px" title="Đăng xuất">
            </div>
            </div>`;
    }
    else{
        info.innerHTML = `
            <div class="wait-start">
            <div id="myHighScore" class="myHighScore">`+"Bạn đã thua với số điểm: "+presentPlus+"!<br>Điểm cao nhất: "+highPlus[4][1]+`!
            </div>
            <div class="start-layout">
            <button id="start" class="startbutton">
                Chơi lại
            </button>
            <img id="logout" class="logoutimage" src="logout.png" width="36px" height="36px" title="Đăng xuất">
            </div>
            </div>`;
    }   
    var start = document.getElementById("start");
    start.addEventListener('click', function(){
        resetData(0);
        startgame();});
    body.addEventListener("keydown", function(event){
        let k = event.keyCode;
        console.log(k);
        if(k == 32){
            resetData(0);
            startgame();
        }
    });
}
function startgame(){
    info.innerHTML = "";
    body.addEventListener("keydown", function(event){
        let k = event.keyCode;
        if(k == 38|| k == 87) directionPac = 0;
        if(k == 39|| k == 68) directionPac = 1;
        if(k == 40|| k == 83) directionPac = 2;
        if(k == 37|| k == 65) directionPac = 3;
    });
    runLevel = setInterval(run,fps);
    paintGame = setInterval(paintAll,fpsview);
}
export default gamerun;