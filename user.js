import gamerun from "./game.js";

var userid = 0;
var email = 0;
var name, password, repassword;
var selectLogin, selectRegister, activeForm, submitForm;
var action = document.getElementById("action");
action.classList ="action hidden";
var setting = document.getElementById("setting");
setting.classList ="setting hidden";

function usercheck(){
    if (userid == 0){
        document.getElementById("gamescreen").innerHTML = "";
        document.getElementById("info").innerHTML = `
            <div class="wait-screen">
                <div id="selectForm" class="selectForm">
                    <button id="selectLogin" class="activeButton">
                        Đăng nhập
                    </button>
                    <button id="selectRegister" class="selectButton">
                        Đăng kí
                    </button>
                </div>
                <form id="user-info" class="user-info">
                    <div id="title-info" class="title-info">
                    <div id="response" class="hidden">aa</div>
                        <div class="input-info">
                            <span>Email:</span>
                            <input id="email" type="text" placeholder="Nhập tên của bạn" size="10">
                        </div>
                        <div class="input-info">
                            <span>Password:</span>
                            <input id="password" type="password" placeholder="Nhập tên của bạn" size="10">
                        </div>
                        <div class="forget-password">
                            <a href="#">Bạn quên mật khẩu đăng nhập?</a>
                        </div>
                    </div>
                    <div id="submit-info" class="input-submit">
                        <input id="submit" type="submit" value="Đăng nhập">
                    </div>
                </form>
            </div>`;
        selectLogin = document.getElementById('selectLogin');
        selectRegister = document.getElementById('selectRegister');
        activeForm = 'login';
        submitForm = document.getElementById("user-info");
        selectLogin.addEventListener('click', function () {
            if (activeForm == 'register') {
            logForm();
            }
        });
        selectRegister.addEventListener('click', function () {
            if (activeForm == 'login') {
            regForm();
            }
        });
        submitForm.addEventListener("submit",function(event){
            event.preventDefault();
            formSubmited();
        });
    }
}
function logForm() {
  activeForm = 'login';
  selectLogin.classList = "activeButton";
  selectRegister.classList = "selectButton";
  document.getElementById("title-info").innerHTML = `
    <div id="response" class="hidden">aa</div>
    <div class="input-info">
      <span>Email:</span>
      <input id="email" type="text" placeholder="Nhập email của bạn" size="10">
    </div>
    <div class="input-info">
      <span>Mật khẩu:</span>
      <input id="password" type="password" placeholder="Nhập mật khẩu của bạn" size="10">
    </div>
    <div class="forget-password">
      <a href="#">Bạn quên mật khẩu đăng nhập?</a>
    </div>`;
  document.getElementById("submit-info").innerHTML=`
    <input id="submit" type="submit" value="Đăng nhập">
  `;
}
function regForm() {
  activeForm = 'register';
  selectLogin.classList = "selectButton";
  selectRegister.classList = "activeButton";
  document.getElementById("title-info").innerHTML = `
    <div class="input-info">
      <span>Tên bạn:</span>
      <input id="username" type="text" placeholder="Nhập tên của bạn" size="10">
    </div>
    <div class="input-info">
      <span>Email:</span>
      <input id="email" type="text" placeholder="Nhập email của bạn" size="10">
    </div>
    <div class="input-info">
      <span>Mật khẩu:</span>
      <input id="password" type="password" placeholder="Nhập mật khẩu của bạn" size="10">
    </div>
    <div class="input-info">
      <span>Nhập lại:</span>
      <input id="repassword" type="password" placeholder="Nhập lại mật khẩu của bạn" size="10">
    </div>`;
  document.getElementById("submit-info").innerHTML=`
    <input id="submit" type="submit" value="Đăng kí">
  `;

}
function formSubmited(){
  if(activeForm == 'login'){
    email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log("email:"+email+", password: "+password);
    if(email&&password){
        var login = async function(){
            const loginResult = await firebase.auth().signInWithEmailAndPassword(email, password);
            if(!loginResult.user.emailVerified){
                var response = document.getElementById("response");
                response.classList ="response";
                response.innerHTML ="Email của bạn chưa được kích hoạt";
            }
            else{
                email = loginResult.user.email;
                name = loginResult.user.displayName
                action.classList ="action";
                setting.classList ="setting";
                gamerun(name, email);
                };
            // sẽ đăng nhập ở đây
        };
        login();
      }
    }
  else if(activeForm == 'register'){
    name = document.getElementById("username").value;
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    repassword = document.getElementById("repassword").value;
    if(name&&email&&password&&repassword){
    var register = async function(){
        const  register = await firebase.auth().createUserWithEmailAndPassword(email,password);
        firebase.auth().currentUser.updateProfile({
            displayName:name
        });
        console.log(register);
        firebase.auth().currentUser.sendEmailVerification();
        document.getElementById("selectLogin").click();
        document.getElementById("email").value = email;
        document.getElementById("password").value = password;
        var response = document.getElementById("response");
        response.classList ="response";
        response.innerHTML ="Đăng kí thành công<br>Hãy xác nhận email rồi đăng nhập";

    // sẽ đăng ký ở đây
    };
    register();
  }
  }
}
export default usercheck;