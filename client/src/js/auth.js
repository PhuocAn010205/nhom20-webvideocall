document.addEventListener('DOMContentLoaded', () => {
    // Form đăng ký
    const registerForm = document.querySelector("#register-form");
    if (registerForm) {
        const inpUserName = document.querySelector("#username");
        const inpEmail = document.querySelector("#email");
        const inpPwd = document.querySelector("#password");
        const inpConfirmPwd = document.querySelector("#confirm-password");
        const regMessage = document.querySelector("#regMessage");

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let username = inpUserName.value.trim();
            let email = inpEmail.value.trim();
            let password = inpPwd.value.trim();
            let configPassword = inpConfirmPwd.value.trim();

            if (!username || !email || !password || !configPassword) {
                regMessage.innerText = "Điền vào các ô còn trống.";
                regMessage.style.color = "red";
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, email }),
                });
                const data = await res.json();
                regMessage.innerText = data.message;
                regMessage.style.color = res.ok ? "green" : "red";

                if (res.ok) {
                    setTimeout(() => {
                        window.location.href = "dangnhap.html";
                    }, 1500);
                }
            } catch (err) {
                regMessage.innerText = "Lỗi kết nối server!";
                regMessage.style.color = "red";
            }
        });
    }

    // Form đăng nhập
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        const inpEmail = document.querySelector("#email");
        const inpPwd = document.querySelector("#password");
        const loginMessage = document.querySelector("#loginMessage");

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            let email = inpEmail.value.trim();
            let password = inpPwd.value.trim();

            if (!email || !password) {
                loginMessage.innerText = "Vui lòng điền đầy đủ thông tin.";
                loginMessage.style.color = "red";
                return;
            }

            try {
                const res = await fetch("http://localhost:3000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                loginMessage.innerText = data.message;
                loginMessage.style.color = res.ok ? "green" : "red";

                if (res.ok) {
                    localStorage.setItem("username", data.user.username);
                    localStorage.setItem("user_id", data.user.id);
                    localStorage.setItem("email", data.user.email);
                    setTimeout(() => {
                        window.location.href = "trangchu.html";
                    }, 1500);
                }
            } catch (err) {
                loginMessage.innerText = "Lỗi kết nối server!";
                loginMessage.style.color = "red";
            }
        });
    }
});
