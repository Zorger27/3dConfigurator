<script>
import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default {
  name: 'Header3DLogo3',
  methods: {},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, cube, controls;
    let rotationPaused = false;

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 13);

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;

      controls.autoRotate = true;
      controls.autoRotateSpeed = 5.0;

      const textureLoader = new THREE.TextureLoader();
      // Загрузка текстур
      const textureRight = textureLoader.load('/assets/img/cube2/right.webp');
      const textureLeft = textureLoader.load('/assets/img/cube2/left.webp');
      const textureFront = textureLoader.load('/assets/img/cube2/front.webp');
      const textureBack = textureLoader.load('/assets/img/cube2/back.webp');
      const textureBottom = textureLoader.load('/assets/img/cube2/bottom.webp');
      const textureTop = textureLoader.load('/assets/img/cube2/top.webp');

      // Поворот UV-координат для текстуры
      textureBack.center = new THREE.Vector2(0.5, 0.5);
      textureBack.rotation = Math.PI;
      textureBack.needsUpdate = true;

      textureLeft.center = new THREE.Vector2(0.5, 0.5);
      textureLeft.rotation = Math.PI / 2; // Поворот на 90 градусов
      textureLeft.needsUpdate = true;

      textureRight.center = new THREE.Vector2(0.5, 0.5);
      textureRight.rotation = -Math.PI / 2; // Поворот на -90 градусов
      textureRight.needsUpdate = true;

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const materials = [
        new THREE.MeshBasicMaterial({ map: textureRight }),
        new THREE.MeshBasicMaterial({ map: textureLeft }),
        new THREE.MeshBasicMaterial({ map: textureFront }),
        new THREE.MeshBasicMaterial({ map: textureBack }),
        new THREE.MeshBasicMaterial({ map: textureBottom }),
        new THREE.MeshBasicMaterial({ map: textureTop }),
      ];

      cube = new THREE.Mesh(geometry, materials);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      cube.setRotationFromEuler(euler);

      scene.add(cube);

      canvasContainer.value.appendChild(renderer.domElement);

      const animate = () => {
        if (rotationPaused) {
          // Если вращение на паузе, не вызываем анимацию
          return;
        }
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      // Добавляем обработчик событий для двойного щелчка мыши
      canvasContainer.value.addEventListener('dblclick', () => {
        rotationPaused = !rotationPaused; // Инвертируем состояние флага
        if (!rotationPaused) {
          // Если вращение возобновляется, снова вызываем анимацию
          animate();
        }
      });


      animate();
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onWindowResize);

    onMounted(() => {
      init();
      onWindowResize();
    });

    onUnmounted(() => {
      renderer.dispose();
    });

    return {
      canvasContainer
    };
  },
}
</script>

<template>
  <div class="scene-container" ref="canvasContainer"></div>
</template>

<style lang="scss" scoped>
.scene-container {
  max-height: 100vh;
  max-width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
