import {
  Scene,
  AmbientLight,
  DirectionalLight,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';

export default class MainScene {

  constructor() {
    this.scene = new Scene();

    this.camera();
    this.lights();
    this.renderer();
    this.listeners();
    this.appendChild();
  }

  camera() {
    this.camera = new PerspectiveCamera(
      30, window.innerWidth / window.innerHeight, 1, 10000
    );
    this.camera.position.x = 1000;
    this.camera.position.y = 50;
    this.camera.position.z = 1500;
    this.scene.add(this.camera);
  }

  lights() {
    this.scene.add(new AmbientLight(0x111111));

    this.light = new DirectionalLight(0x555555, 0.75);
    this.light.position.set(50, 200, 100);
    this.light.position.multiplyScalar(1.3);

    this.light.castShadow = true;

    this.light.shadow.mapSize.width = 1024;
    this.light.shadow.mapSize.height = 1024;

    const d = 300;

    this.light.shadow.camera.left = - d;
    this.light.shadow.camera.right = d;
    this.light.shadow.camera.top = d;
    this.light.shadow.camera.bottom = - d;

    this.light.shadow.camera.far = 1000;

    this.scene.add(this.light);
  }

  appendChild() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.container.appendChild(this.renderer.domElement);
  }

  renderer() {
    this.renderer = new WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000);

    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    this.renderer.shadowMap.enabled = true;
  }

  listeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, false);
  }

  render() {
    this.camera.lookAt(this.scene.position);
    this.renderer.render(this.scene, this.camera);
  }

}
