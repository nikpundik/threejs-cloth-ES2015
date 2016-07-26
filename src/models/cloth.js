import {
  Vector3,
} from 'three';
import * as config from '../config';
import utils from '../utils';
import Particle from './particle';

export default class Cloth {

  constructor(w, h) {
    this.w = w || 10;
    this.h = h || 10;
    this.lastTime = null;
    this.pins = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.tmpForce = new Vector3();
    this.diff = new Vector3();
    this.clothFunction = utils.plane(
      config.restDistance * this.w, config.restDistance * this.h
    );
    this.windForce = new Vector3(0, 0, 0);

    const GRAVITY = 981 * 1.4;
    this.mass = 0.1;
    this.gravity = new Vector3(0, -GRAVITY, 0)
      .multiplyScalar(this.mass);

    this.createParticles();
    this.createConstraints();
  }

  index(u, v) {
    return u + (v * (this.w + 1));
  }

  createParticles() {
    this.particles = [];

    let u;
    let v;

    for (v = 0; v <= this.h; v++) {
      for (u = 0; u <= this.w; u++) {
        this.particles.push(
          new Particle(
            u / this.w,
            v / this.h,
            0,
            this.mass,
            config.DRAG,
            this.clothFunction
          )
        );
      }
    }
  }

  createConstraints() {
    this.constrains = [];

    let u;
    let v;

    for (v = 0; v < this.h; v++) {
      for (u = 0; u < this.w; u++) {
        this.constrains.push([
          this.particles[this.index(u, v)],
          this.particles[this.index(u, v + 1)],
          config.restDistance,
        ]);

        this.constrains.push([
          this.particles[this.index(u, v)],
          this.particles[this.index(u + 1, v)],
          config.restDistance,
        ]);
      }
    }

    for (u = this.w, v = 0; v < this.h; v ++) {
      this.constrains.push([
        this.particles[this.index(u, v)],
        this.particles[this.index(u, v + 1)],
        config.restDistance,
      ]);
    }

    for (v = this.h, u = 0; u < this.w; u++) {
      this.constrains.push([
        this.particles[this.index(u, v)],
        this.particles[this.index(u + 1, v)],
        config.restDistance,
      ]);
    }
  }

  simulate(time, clothGeometry) {
    if (!this.lastTime) {
      this.lastTime = time;
      return;
    }

    const windStrength = (Math.cos(time / 7000) * 20) + 40;
    this.windForce
      .set(Math.sin(time / 2000), Math.cos(time / 3000), Math.sin(time / 1000))
      .normalize()
      .multiplyScalar(windStrength);

    this.simulateAerodynamics(clothGeometry);
    this.satisfyConstrains();
    this.pinConstrains();
  }

  simulateAerodynamics(clothGeometry) {
    if (config.wind) {
      let face;
      let normal;
      const faces = clothGeometry.faces;

      for (let i = 0; i < faces.length; i++) {
        face = faces[i];
        normal = face.normal;

        this.tmpForce
          .copy(normal)
          .normalize()
          .multiplyScalar(normal.dot(this.windForce));

        this.particles[face.a].addForce(this.tmpForce);
        this.particles[face.b].addForce(this.tmpForce);
        this.particles[face.c].addForce(this.tmpForce);
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i];
      particle.addForce(this.gravity);
      particle.integrate(config.TIMESTEP_SQ);
    }
  }

  satisfyConstrains() {
    for (let i = 0; i < this.constrains.length; i++) {
      const constrain = this.constrains[i];
      const p1 = constrain[0];
      const p2 = constrain[1];
      const distance = constrain[2];

      this.diff.subVectors(p2.position, p1.position);

      const currentDist = this.diff.length();
      if (currentDist === 0) return;

      const correction = this.diff.multiplyScalar(1 - (distance / currentDist));
      const correctionHalf = correction.multiplyScalar(0.5);

      p1.position.add(correctionHalf);
      p2.position.sub(correctionHalf);
    }
  }

  pinConstrains() {
    for (let i = 0; i < this.pins.length; i++) {
      const xy = this.pins[i];
      const p = this.particles[xy];
      p.position.copy(p.original);
      p.previous.copy(p.original);
    }
  }

}
