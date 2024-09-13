<script>
import {onMounted, onUnmounted, ref} from "vue";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export default {
  name: 'Header3DLogo2',
  methods: {},
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, controls;

    // const updateCameraPosition = () => {
    //   // Изменение значения в зависимости от ширины экрана
    //   if (window.innerWidth <= 768) {
    //     camera.position.set(0, 0, 28);
    //   } else {
    //     camera.position.set(0, 0, 36);
    //   }
    // };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 40);
      // updateCameraPosition();

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvasContainer.value.appendChild(renderer.domElement);

      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.enablePan = false;
      controls.enableZoom = true;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 5.0;

      // Создаем маленький кубик
      const smallCubeGeometry1 = new THREE.BoxGeometry(0.8, 0.8, 0.8);

      // Определение массива текстурных путей
      const texturePaths = [
        '/assets/img/cube3/cube3-01.webp', '/assets/img/cube3/cube3-02.webp', '/assets/img/cube3/cube3-03.webp',
        '/assets/img/cube3/cube3-04.webp', '/assets/img/cube3/cube3-05.webp', '/assets/img/cube3/cube3-06.webp',
        '/assets/img/cube3/cube3-07.webp', '/assets/img/cube3/cube3-08.webp', '/assets/img/cube3/cube3-09.webp',
        '/assets/img/cube3/cube3-10.webp', '/assets/img/cube3/cube3-11.webp', '/assets/img/cube3/cube3-12.webp',
        '/assets/img/cube3/cube3-13.webp', '/assets/img/cube3/cube3-14.webp', '/assets/img/cube3/cube3-15.webp',
        '/assets/img/cube3/cube3-16.webp', '/assets/img/cube3/cube3-17.webp', '/assets/img/cube3/cube3-18.webp',
        '/assets/img/cube3/cube3-19.webp', '/assets/img/cube3/cube3-20.webp', '/assets/img/cube3/cube3-21.webp',
        '/assets/img/cube3/cube3-22.webp', '/assets/img/cube3/cube3-23.webp', '/assets/img/cube3/cube3-24.webp',
        '/assets/img/cube3/cube3-25.webp', '/assets/img/cube3/cube3-26.webp', '/assets/img/cube3/cube3-27.webp'
      ];

      // Перемешиваем массив текстурных путей
      texturePaths.sort(() => Math.random() - 0.5);

      function createTexturedCube(x, y, z, texturePath) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(texturePath);

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const cubeClone = new THREE.Mesh(smallCubeGeometry1, material);
        cubeClone.position.set(x, y, z);

        return cubeClone;
      }

      // Создаем главный куб, состоящий из 27 маленьких кубиков
      const mainCube1 = new THREE.Group();

      let textureIndex = 0;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            let cube;

            // Проверка наличия текстур в массиве
            if (textureIndex < texturePaths.length) {
              cube = createTexturedCube(x, y, z, texturePaths[textureIndex]);
              textureIndex++;
            } else {
              // В случае отсутствия новых текстур, повторно используем те, которые уже использовали
              const repeatedTextureIndex = (textureIndex % texturePaths.length);
              cube = createTexturedCube(x, y, z, texturePaths[repeatedTextureIndex]);
              textureIndex++;
            }

            mainCube1.add(cube);
          }
        }
      }

      scene.add(mainCube1);

      // Устанавливаем углы Эйлера (в радианах) для наклона
      const euler = new THREE.Euler(Math.PI / 2, 0.25, 0);
      mainCube1.setRotationFromEuler(euler);

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate(); // Начинаем анимацию сразу после определения функции
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // // Добавляем обновление позиции камеры
      // updateCameraPosition();
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
