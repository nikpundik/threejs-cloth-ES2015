import MainScene from './scenes/main.js';
import Cloth from './models/cloth';
import ClothView from './views/cloth.js';

const mainScene = new MainScene();

const cloth = new Cloth();
const clothView = new ClothView(cloth);

mainScene.scene.add(clothView.mesh);

function animate() {
  window.requestAnimationFrame(animate);
  const time = Date.now();

  cloth.simulate(time, clothView.geometry);
  clothView.update();
  mainScene.render();
}

animate();
