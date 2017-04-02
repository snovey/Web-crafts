window.onload = function () {
  let x = new Wlock({
    container: 'password'
  });
  x.init();
  let step = 0, rest, last;
  let info = document.getElementsByClassName('hint')[0].children[0];
  let color = {
    pointBorderColor: 'red',
    lineColor: 'yellow'
  };
  function set (evt) {
    evt.preventDefault();
    if (x.input.length < 5) {
      step = 0;
      info.innerHTML = 'Connect at least 5 dots. Try again';
      x.changeColor(color);
      setTimeout(function () {
        x.clear();
      }, 500);
    } else if (step === 0) {
      step++;
      rest = JSON.stringify(x.input);
      info.innerHTML = 'Draw pattern again to confirm';
      x.clear();
    } else if (step === 1) {
      last = JSON.stringify(x.input);
      if (last === rest) {
        window.localStorage.setItem('password', last);
        x.canvas.removeEventListener('touchend', set);
        document.getElementById('set').checked = false;
        document.getElementById('auth').checked = true;
        x.canvas.addEventListener('touchend', auth);
        info.innerHTML = 'Your new lock pattern';
        x.clear();
      } else {
        step = 0;
        x.changeColor(color);
        setTimeout(function () {
          x.clear();
        }, 500);
        info.innerHTML = 'Wrong pattern';
      }
    }
  }
  function auth(evt) {
    evt.preventDefault();
    let curpass = JSON.stringify(x.input);
    let rightpass = window.localStorage.getItem('password');
    if (x.input.length < 5) {
      info.innerHTML = 'Connect at least 5 dots. Try again';
      x.changeColor(color);
      setTimeout(function () {
        x.clear();
      }, 500);
    }else if (curpass === rightpass) {
      info.innerHTML = 'Right';
      x.clear();
    } else {
      info.innerHTML = 'Wrong pattern';
      x.changeColor(color);
      setTimeout(function () {
        x.clear();
      }, 1000);
    }
  }
  if (document.getElementById('set').checked) x.canvas.addEventListener('touchend', set);
  document.getElementById('set').onclick = function () {
    x.canvas.addEventListener('touchend', set);
  };

  document.getElementById('auth').onclick = function () {
    x.canvas.addEventListener('touchend', auth);
  };
};
