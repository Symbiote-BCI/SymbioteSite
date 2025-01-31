import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'; // Importă loaderul pentru GLB

@Component({
  selector: 'app-rotating-cube',
  templateUrl: './rotating-cube.component.html',
  styleUrls: ['./rotating-cube.component.scss'],
})
export class RotatingCubeComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Object3D; // Înlocuiește tipul cubului cu un tip general de obiect
  private animationFrameId: number = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.init3D();
    this.animate();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  private init3D() {
    if (typeof window !== 'undefined') {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.z = 50; // Move the camera much further away

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 2.2);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.shadowMap.enabled = true; // Enable shadow maps
      this.elementRef.nativeElement.appendChild(this.renderer.domElement);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Add a directional light source
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(10, 10, 10);
      directionalLight.castShadow = true; // Enable shadows for the light
      this.scene.add(directionalLight);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
      this.scene.add(ambientLight);

      const loader = new GLTFLoader();
      loader.load('../../../assets/models/Ultracortex.glb', (gltf) => {
        this.model = gltf.scene;
        this.model.traverse((node) => {
          if ((node as THREE.Mesh).isMesh) {
            node.castShadow = true; // Enable shadows for the model
            node.receiveShadow = true; // Enable shadows for the model
            (node as THREE.Mesh).material = new THREE.MeshStandardMaterial({
              color: 0x111111,
              roughness: 0.5,
              metalness: 0.5,
            }); // Set the material color to black with some roughness and metalness
          }
        });

        if (window.innerWidth < 850) {
          this.model.scale.set(0.13, 0.13, 0.13); // Scale up the model for smaller screens
        } else {
          this.model.scale.set(0.18, 0.18, 0.18); // Scale up the model a little
        }

        this.scene.add(this.model);
      });
    }
  }

  private animate() {
    if (
      typeof window !== 'undefined' &&
      typeof window.requestAnimationFrame === 'function'
    ) {
      this.animationFrameId = window.requestAnimationFrame(() =>
        this.animate()
      );

      if (this.model) {
        this.model.rotation.x += 0.001;
        this.model.rotation.y += 0.01;
      }

      this.renderer.render(this.scene, this.camera);
    }
  }
}
