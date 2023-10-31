let account, password;
let firstLogin = true;

window.addEventListener("load", () => {
   let loginBtn = document.getElementById("login-btn");
    let loginBox = document.getElementsByClassName("login-box")[0];

   let accountInput = document.getElementById("username-input");
   let passwordInput = document.getElementById("pwd-input");
   let rememberMeBox = document.getElementById("remember-me-box");

   account = Storage.get("account");
   password = Storage.get("password");

   if (account != null && password != null) {
       login(loginBox);
   }

   loginBtn.addEventListener("click", () => {
       if (accountInput.value.length === 0) {
           new Modal({
               type: "error",
               text: "校网学号不能为空！"
           }).show();

           return;
       }
       if (passwordInput.value.length === 0) {
           new Modal({
               type: "error",
               text: "密码不能为空！"
           }).show();

           return;
       }

       account = accountInput.value;
       password = passwordInput.value;

       if (rememberMeBox.checked) {
           Storage.set("account", account);
           Storage.set("password", password);
       }

       login(loginBox);
   });
});

function login(fadeOutEle) {
    let waitingBox = document.getElementsByClassName("waiting-container")[0];

    fadeOut(fadeOutEle, 400);
    setTimeout(() => {
        fadeIn(waitingBox, 200, "flex");
        axios
            .get("http://10.7.250.8/drcom/login?callback=analyzerResult&DDDDD=" + account + "%40cau&upass=" + password + "&0MKKey=123456&R1=0&R3=0&R6=0&para=00&v6ip=&v=1786")
            .then(
                (response) => {eval(response.data)},
                (reason) => {
                    new Modal({
                        type: "error",
                        text: "网关通讯失败，原因：" + reason
                    }).show();

                    let loginBox = document.getElementsByClassName("login-box")[0];

                    fadeOut(waitingBox, 400);
                    setTimeout(() => {
                        fadeIn(loginBox, 200, "flex");
                    });
                });
    }, 450);
}

function analyzerResult(data) {
    let waitingBox = document.getElementsByClassName("waiting-container")[0];
    let timerBox = document.getElementsByClassName("timer-container")[0];
    if (data.result === 1) {
        if (firstLogin) {
            new Modal({
                type: "success",
                text: "校网登录成功！enjoy it！"
            }).show();

            firstLogin = false;
        }

        fadeOut(waitingBox, 400);
        setTimeout(() => {
            fadeIn(timerBox, 200, "flex");

            let totalTime = 600;
            let min = Math.floor(totalTime / 60);
            let sec = totalTime - 60 * min;

            document.getElementById("timer").innerText = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);

            let rid = setInterval(() => {
                totalTime--;
                min = Math.floor(totalTime / 60);
                sec = totalTime - 60 * min;

                document.getElementById("timer").innerText = (min < 10 ? "0" + min : min) + ":" + (sec < 10 ? "0" + sec : sec);

                if (totalTime <= 0) {
                    clearInterval(rid);
                    login(timerBox);
                }
            }, 1000);
        }, 450);
    }
    else {
        new Modal({
            type: "error",
            text: "校网登录失败，请检查用户名和密码是否正确！"
        }).show();

        let loginBox = document.getElementsByClassName("login-box")[0];

        fadeOut(waitingBox, 400);
        setTimeout(() => {
            fadeIn(loginBox, 200, "flex");
        });

        Storage.remove(account);
        Storage.remove(password);
    }
}