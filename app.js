//canvas 는 두개의 사이즈를 줘야함(css사이즈(화면에 보이는 사이즈),픽셀을 조작 하는(pixel manipulating)사이즈)
const canvas = document.getElementById("jsCanvas"); //id명이 jsCanvas를 찾음
const ctx = canvas.getContext("2d"); //canvas의 context는 이안의 픽셀들을 컨트롤 함, 이경우엔 context를 2d로 설정하여 작업함
const colors = document.getElementsByClassName("jsColor");//class명이 jsColor를 찾음
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");

//canvas의 기본값 색상 설정
const INITIAL_COLOR = "#2c2c2c";

//canvas의 기본값 사이즈 설정
const CANVAS_SIZE = document.getElementsByClassName("canvas")[0];

//픽셀을 조작 하는(pixel manipulating)사이즈 설정 -- 캔버스 크기를 가져옴
canvas.width = CANVAS_SIZE.offsetWidth;
canvas.height = CANVAS_SIZE.offsetHeight;

//canvas의 선 색상, 선 굵기, 채우기 색 Context 기본값 설정
ctx.fillStyle = "white"; //기본값(처음) 배경색 화이트로 설정
ctx.fillRect(0, 0, canvas.width, canvas.height); //기본값(처음) 배경색 화이트를 캔버스 크기만큼 설정
ctx.strokeStyle = INITIAL_COLOR; //(기본값) 사용자가 그리는 선 들의 색 
ctx.lineWidth = 2.5; //(기본값) range(선의 굵기==너비)의 너비가 2.5px로 설정
ctx.fillStyle = INITIAL_COLOR; //채우기(fill)색의 Context 기본값 설정 

//처음(기본값) 마우스 값은 painting = false;
let painting = false;

//처음(기본값) 채우기 값은 filling = false;
let filling = false;

//painting = false 로 만들어줌
function stopPainting() {
    painting = false;
}
//painting = true 로 만들어줌
function startPainting() {
    painting = true;
}

//캔버스안에서 마우스가 움직일때 좌표(x,y) 찾기
//const x와 const y는 마우스가 움직일 때마다 다시 생성됨
//onMouseMove 기능은 업데이트되지 않고 계속 호출됨
function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    //painting == false면,클릭하지 않고 떠다니는 path(라인,선 == 클릭을 기다리는 선의 시작점)을 만듬
    //선의 시작점은 마우스가 있는 곳
    //마우스를 움직이는 내내 path를 새로 생성 == beginPath()
    if(!painting) {
        ctx.beginPath(); //선 경로 생성, 클릭하지않고 마우스를 움직일때 path(선) 시작
        ctx.moveTo(x, y); //선 시작 좌표, path(선)을 만들면 마우스의 x y 좌표로 path(선)을 옮김
    } 

    //마우스를 움직이는 내내 선(line) == path 를 새로 만듬
    //클릭하면 시작점부터 클릭한 곳까지 선을 만듬(마우스를 클릭(시작 선 만듬)하고 떼지않고 쭉 이동하다가 마우스를 뗀(끝,멈춤 선)곳까지 선을 만듬)
    else {
        ctx.lineTo(x, y); //선 끝 좌표, moveTo 좌표 위치에 path를 만들고 ~ lineTo 좌표 위치에 path를 만들고 클릭하면  moveTo~lineTo까지 선이 만들어짐
        ctx.stroke(); //선 그리기, 확에 색을 넣어줌
    }
    
}

//색을 클릭했을때 백그라운드컬러 발생 이벤트
function handleColorClick(event) {
    const color = event.target.style.backgroundColor; //클릭했을때 백그라운드컬러를 찾음
    ctx.strokeStyle = color; //strokeStyle이 target에 있는 백그라운드 컬러가 됨
    ctx.fillStyle = color; //fillStyle(채우기 색)이 target에 있는 백그라운드 컬러가 됨
}

//Range(선 굵기)를 바꿀때 발생하는 이벤트
function handleRangeChange(event) {
    const size = (event.target.value); // input(선 사이즈) 값 찾기
    ctx.lineWidth = size; // lineWidth이 target에 있는 값이 됨
}

//채우기 버튼 클릭시 백그라운드컬러로 채우기(filling) 호출
//filling의 기본값은 "채우기" 상태 => index.html(<button id="jsMode">채우기</button>)
function handleModeClick() {
    //filling(채우기)가 활성화(true)되있으면,즉 채우기(off)상태에서 클릭 시 발생
    if(filling == true) {
        filling = false;
        mode.innerText = "채우기";
        canvas.style.cursor = "default"; // canvas 커서 모양 기본값으로 바꿈
    }
    //filling(채우기)가 활성화 안되(false)있고(버튼이 "채우기" 일때) 클릭 시 발생
    else {
        filling = true;
        mode.innerText = "채우기(off)"; //mode(버튼)에 텍스트 넣기
        ctx.fillStyle = ctx.strokeStyle; //canvas의 채우기(fill)색의 Context 설정, strokeStyle(선 색상)
        canvas.style.cursor = "pointer"; // canvas 커서 모양 포인터로 바꿈
    }
}

//fill(채우기)가 활성화(true)==채우기(off)되있으면, canvas를 클릭하면 fillRect(채우기 하는 부분) 호출
function handleCanvasClick() {
    if(filling) {
        ctx.fillRect(0, 0, canvas.width, canvas.height); //fillRect(x좌표,y좌표,width,height)
    }
}

//contextmenu를 했을때(마우스 우클릭) 발생하는 이벤트
function handleCM(event) {
    event.preventDefault(); //preventDefault() => 이벤트 취소(우클릭 사용불가)
} 

//세이브 버튼(저장)을 클릭했을때 발생
function handleSaveClick() {
    const image = canvas.toDataURL(); //toDataURL(기본값은 png임, "image/png"),image/png 형식으로 저장될수 있게 데이터를 url로 바꿔줌
    const link = document.createElement("a"); //<a>태그를 만듬
    link.href = image; // href(링크)에 image데이터(url)를 넣어줌 <a href="~~~"></a>
    link.download = "PaintJs[🎨]"; //이미지 이름 설정,<a href="url" download="이미지 이름"></a>
    link.click(); //만든 a 태그를 클릭함
}


// canvas가 존재하는지 않하는지 확인
if(canvas) {
    canvas.addEventListener("mousemove", onMouseMove); //마우스 움직임 감지(캔버스안에서 마우스가 움직일때)할때 발생하는 이벤트
    canvas.addEventListener("mousedown", startPainting); //마우스로 클릭했을때 발생하는 이벤트(캔버스안에서 그림그릴때) --startPainting 실행
    canvas.addEventListener("mouseup", stopPainting); //마우스를 떼면 발생하는 이벤트(캔버스안에서 그림그리다가 멈출때) --stopPainting 실행
    canvas.addEventListener("mouseleave", stopPainting); //캔버스 밖으로 나가면 발생하는 이벤트 --stopPainting 실행
    canvas.addEventListener("click", handleCanvasClick); //캔버스를 클릭 했을때 발생하는 이벤트
    canvas.addEventListener("contextmenu", handleCM) //캔버스 마우스 우클릭했을때 나타나는 메뉴(contextmenu)을 실행 했을때 발생하는 이벤트
}

/* Array.from 메소드는 object로 부터 array를 만듬
Array(배열)이 있으면 forEach를 쓸수있음, forEach는 주어진 함수를 배열 요소 각각에 대해 실행함
forEach로 color를 돌려서 addEventListener("click", handleColorClick) 호출
color는 array(배열)의 단순 변수명 */
Array.from(colors).forEach(color => 
    color.addEventListener("click", handleColorClick) //컬러 클릭시 이벤트
);

//range(선 굵기==너비) 가 존재하면 addEventListener("input", handleRangeChange) 호출
if(range) {
    range.addEventListener("input", handleRangeChange); //input을 작동하면 발생하는 이벤트
}
//mode(채우기 버튼)가 존재하면 addEventListener("click", handleModeClick) 호출
if(mode) {
    mode.addEventListener("click", handleModeClick);
}
//saveBtn(저장 버튼)이 존재하면 saveBtn.addEventListener("click", handleSaveClick); 호출
if(saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}