/* --- 로컬 스토리지 데이터 관리 함수 --- */
const getAccounts = () => JSON.parse(localStorage.getItem('accounts')) || [];
const saveAccounts = (accounts) => localStorage.setItem('accounts', JSON.stringify(accounts));

const getLoggedInUser = () => JSON.parse(localStorage.getItem('loggedInUser'));
const saveLoggedInUser = (user) => localStorage.setItem('loggedInUser', JSON.stringify(user));
const logout = () => {
  localStorage.removeItem('loggedInUser');
  updateUI();
};

/* --- UI 업데이트 기능 --- */
const updateUI = () => {
  const user = getLoggedInUser();
  const userStatus = document.getElementById('user-status');
  const loginBtn = document.getElementById('login-nav-btn');
  const signupBtn = document.getElementById('signup-nav-btn');
  const logoutBtn = document.getElementById('logout-btn');

  if (user) {
    userStatus.textContent = `${user.id}님 환영합니다!`;
    userStatus.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    loginBtn.classList.add('hidden');
    signupBtn.classList.add('hidden');
  } else {
    userStatus.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    loginBtn.classList.remove('hidden');
    signupBtn.classList.remove('hidden');
  }
};

/* --- 모달 제어 --- */
const openModal = (id) => document.getElementById(id).classList.add('active');
const closeModal = () => {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.error-msg').forEach(e => e.textContent = '');
  document.querySelectorAll('.modal-content input').forEach(i => i.value = '');
};

document.getElementById('signup-nav-btn').onclick = () => openModal('signup-modal');
document.getElementById('login-nav-btn').onclick = () => openModal('login-modal');
document.querySelectorAll('.close-btn').forEach(btn => btn.onclick = closeModal);
document.getElementById('logout-btn').onclick = logout;

/* --- 회원가입 로직 --- */
document.getElementById('signup-submit').onclick = () => {
  const id = document.getElementById('signup-id').value.trim();
  const pw = document.getElementById('signup-pw').value;
  const pwConfirm = document.getElementById('signup-pw-confirm').value;
  const errorEl = document.getElementById('signup-error');

  if (!id || !pw) {
    errorEl.textContent = '아이디와 비밀번호를 입력해주세요.';
    return;
  }
  if (pw !== pwConfirm) {
    errorEl.textContent = '비밀번호가 일치하지 않습니다.';
    return;
  }

  const accounts = getAccounts();
  if (accounts.find(acc => acc.id === id)) {
    errorEl.textContent = '이미 존재하는 아이디입니다.';
    return;
  }

  accounts.push({ id, pw });
  saveAccounts(accounts);
  alert('회원가입이 완료되었습니다! 로그인해주세요.');
  closeModal();
};

/* --- 로그인 로직 --- */
document.getElementById('login-submit').onclick = () => {
  const id = document.getElementById('login-id').value.trim();
  const pw = document.getElementById('login-pw').value;
  const errorEl = document.getElementById('login-error');

  const accounts = getAccounts();
  const user = accounts.find(acc => acc.id === id && acc.pw === pw);

  if (user) {
    saveLoggedInUser({ id: user.id });
    updateUI();
    closeModal();
  } else {
    errorEl.textContent = '아이디 또는 비밀번호가 잘못되었습니다.';
  }
};

// 초기 실행
window.onload = updateUI;