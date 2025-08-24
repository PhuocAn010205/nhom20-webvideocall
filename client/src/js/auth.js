document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 auth.js loaded');

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
      console.log('📝 Submit đăng ký');

      let username = inpUserName.value.trim();
      let email = inpEmail.value.trim();
      let password = inpPwd.value.trim();
      let confirmPassword = inpConfirmPwd.value.trim();

      if (!username || !email || !password || !confirmPassword) {
        regMessage.innerText = "Điền vào các ô còn trống.";
        regMessage.style.color = "red";
        console.log('❌ Thiếu dữ liệu');
        return;
      }
      if (password !== confirmPassword) {
        regMessage.innerText = "Mật khẩu không khớp.";
        regMessage.style.color = "red";
        return;
      }

      try {
        console.log('📤 Gửi fetch /register');
        const res = await fetch("https://4bd04ed128f6.ngrok-free.app/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await res.json();
        regMessage.innerText = data.message;
        regMessage.style.color = res.ok ? "green" : "red";
        console.log('📥 Response /register:', res.status, data);

        if (res.ok) {
          setTimeout(() => {
            window.location.href = "dangnhap.html";
          }, 500);
        }
      } catch (error) {
        console.error("❌ Lỗi đăng ký:", error);
        regMessage.innerText = `Có lỗi xảy ra: ${error.message || 'Vui lòng thử lại.'}`;
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
      console.log('🔑 Submit đăng nhập');

      let email = inpEmail.value.trim();
      let password = inpPwd.value.trim();

      if (!email || !password) {
        loginMessage.innerText = "Vui lòng điền đầy đủ thông tin.";
        loginMessage.style.color = "red";
        console.log('❌ Thiếu dữ liệu');
        return;
      }

      try {
        console.log('📤 Gửi fetch /login');
        const res = await fetch("https://4bd04ed128f6.ngrok-free.app/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        loginMessage.innerText = data.message;
        loginMessage.style.color = res.ok ? "green" : "red";
        console.log('📥 Response /login:', res.status, data);

        if (res.ok) {
          localStorage.setItem("username", data.user.username);
          localStorage.setItem("user_id", data.user.id);
          localStorage.setItem("email", data.user.email);
          setTimeout(() => {
            window.location.href = "trangchu.html";
          }, 500);
        }
      } catch (error) {
        console.error("❌ Lỗi đăng nhập:", error);
        loginMessage.innerText = `Có lỗi xảy ra: ${error.message || 'Vui lòng thử lại.'}`;
        loginMessage.style.color = "red";
      }
    });
  }

  // Nút đăng xuất
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      console.log('👋 Đăng xuất');
      localStorage.removeItem("username");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      window.location.href = "dangnhap.html";
    });
  }
});