export default {
  name: 'home',
  path: '/',
  init: home
}

function home() {
  document.querySelectorAll('h2').forEach(h2 => {
    h2.onclick = () => {
      document.querySelector('[main] > div').innerHTML = 'hi'
    }
  })
  
}