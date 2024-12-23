import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-rotating-cube',
  templateUrl: './rotating-cube.component.html',
  styleUrls: ['./rotating-cube.component.scss']
})
export class RotatingCubeComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private animationFrameId: number = 0;

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.init3D();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Ensure the renderer is defined before calling dispose
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private init3D() {
    if (typeof window !== 'undefined') {  // Check if we are in the browser
      // Create the scene
      this.scene = new THREE.Scene();

      // Set up the camera (field of view, aspect ratio, near and far clipping planes)
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.camera.position.z = 3;

      // Set up the WebGL renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
      this.renderer.setClearColor(0x000000, 0);
      this.elementRef.nativeElement.appendChild(this.renderer.domElement);

      // Create a cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.cube = new THREE.Mesh(geometry, material);
      this.scene.add(this.cube);
    }
  }


  private animate() {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      this.animationFrameId = window.requestAnimationFrame(() => this.animate());

      this.cube.rotation.x += 0.001;
      this.cube.rotation.y += 0.01;

      this.renderer.render(this.scene, this.camera);
    }
  }

}
