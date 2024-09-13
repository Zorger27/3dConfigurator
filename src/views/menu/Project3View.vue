<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import {TextureLoader} from "three";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'Project3',
  mixins: [openGraphMixin],
  components: {ToggleFullScreen, CanvasFullScreen},
  mounted() {
    const mainTitle = '3D Configurators - Project № 3';
    const title = '3D Configurators - Project № 3';
    const metaDescription = '3D Configurators';
    const description = '3D Configurators - Project № 3';
    const imageUrl = 'https://3d-configurator-max.vercel.app/assets/ogimage/bmp/project3.jpg';
    const url = 'https://3d-configurator-max.vercel.app/project3';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, horseModel;
    let isRotatingClockwise = false;
    let isRotatingCounterClockwise = false;

    const init = () => {
      // Создаем сцену
      scene = new THREE.Scene();

      // Создаем камеру
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3;

      // Создаем рендерер
      // renderer = new THREE.WebGLRenderer();
      renderer = new THREE.WebGLRenderer({ alpha: true });
      // renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setSize(window.innerWidth, window.innerHeight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      scene.add(camera);

      // Используем GLTFLoader для загрузки модели
      const loader = new GLTFLoader();
      loader.load(
        '/assets/models/01_Horse_statue.glb', // Замените на реальный путь к вашей модели
        (gltf) => {
          // После загрузки модели добавляем её в сцену
          horseModel = gltf.scene;
          horseModel.scale.set(10, 10, 10); // Настраиваем масштаб модели

          // // Загружаем текстуру
          // const textureLoader = new TextureLoader();
          // const horseTexture = textureLoader.load('/assets/img/cube3/cube3-09.webp'); // Путь к текстуре
          //
          // horseModel.traverse((child) => {
          //   if (child instanceof THREE.Mesh) {
          //     if (Array.isArray(child.material)) {
          //       // Если у объекта несколько материалов
          //       child.material.forEach((material) => {
          //         if (material instanceof THREE.MeshStandardMaterial) {
          //           material.map = horseTexture; // Применяем текстуру к материалу
          //           material.needsUpdate = true; // Обновляем материал после изменений
          //         }
          //       });
          //     } else if (child.material instanceof THREE.MeshStandardMaterial) {
          //       // Если один материал
          //       child.material.map = horseTexture; // Применяем текстуру к материалу
          //       child.material.needsUpdate = true; // Обновляем материал после изменений
          //     }
          //   }
          // });

          // Красим цветом
          horseModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              // Проверяем, если это MeshStandardMaterial, и меняем цвет
              if (Array.isArray(child.material)) {
                // Если материалов несколько, проходим по каждому
                child.material.forEach((material) => {
                  if (material instanceof THREE.MeshStandardMaterial) {
                    material.color.set(0x87ceeb); // Светло-голубой
                    material.color.multiplyScalar(3); // Увеличиваем яркость на 50%
                    material.roughness = 0.1; // Снижает шероховатость, делая материал более глянцевым
                    material.metalness = 0.5; // Добавляет металлический эффект, увеличивая контраст
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                // Если один материал, просто меняем его цвет
                child.material.color.set(0x87ceeb); // Светло-голубой
                child.material.color.multiplyScalar(3); // Увеличиваем яркость на 50%
                child.material.roughness = 0.1; // Снижает шероховатость, делая материал более глянцевым
                child.material.metalness = 0.5; // Добавляет металлический эффект, увеличивая контраст
              }
            }
          });

          // Определяем границы модели (bounding box)
          const boundingBox = new THREE.Box3().setFromObject(horseModel);
          const height = boundingBox.max.y - boundingBox.min.y;

          // Сдвигаем модель вниз
          horseModel.position.y = -height / 2;

          scene.add(horseModel);
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the model', error);
        }
      );

      // Добавляем освещение

      // // Окружающий свет (освещает всю сцену равномерно)
      // const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Светлый белый свет с интенсивностью 0.6
      // scene.add(ambientLight);

      // Направленный свет (как солнечный свет)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Направленный свет с интенсивностью 1
      directionalLight.position.set(5, 10, 5); // Позиционируем его выше и сбоку
      scene.add(directionalLight);

      // // Добавляем тени, если необходимо
      // directionalLight.castShadow = true;
      // renderer.shadowMap.enabled = true;

      // Добавляем рендерер в контейнер
      canvasContainer.value.appendChild(renderer.domElement);

      // Обновляем сцену
      const animate = () => {
        requestAnimationFrame(animate);

        // Вращение модели по кнопкам
        if (horseModel) {
          if (isRotatingClockwise) {
            horseModel.rotation.y += 0.03; // Вращение по часовой стрелке
          } else if (isRotatingCounterClockwise) {
            horseModel.rotation.y -= 0.03; // Вращение против часовой стрелки
          }
        }

        // Обновление контроллеров для вращения сцены
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    // Вращение по часовой стрелке
    const rotateClockwise = () => {
      isRotatingClockwise = true;
      isRotatingCounterClockwise = false;
    };

    // Вращение против часовой стрелки
    const rotateCounterClockwise = () => {
      isRotatingClockwise = false;
      isRotatingCounterClockwise = true;
    };

    // Остановка вращения
    const stopRotation = () => {
      isRotatingClockwise = false;
      isRotatingCounterClockwise = false;
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      // renderer.render(scene, camera);
    };

    window.addEventListener('resize', onWindowResize);

    onMounted(() => {
      init();
      onWindowResize();
    });

    onUnmounted(() => {
      // Выполняем необходимые действия при удалении компонента
      // Например, очищаем ресурсы Three.js
      renderer.dispose();
    });

    return {
      canvasContainer,
      rotateClockwise,
      rotateCounterClockwise,
      stopRotation
    };
  },
}
</script>

<template>
  <div class="container">
    <h1>{{ $t('project3.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
    <line></line>
    <div class="scene-container" ref="canvasContainer"></div>
    <!-- Кнопки управления вращением -->
    <div class="rotation-controls">
      <button @click="rotateClockwise" :title="$t ('rotating.clockwise')">
        <i class="fas fa-arrow-rotate-right"></i>
      </button>
      <button @click="stopRotation" :title="$t ('rotating.stop')">
        <i class="fas fa-stop"></i>
      </button>
      <button @click="rotateCounterClockwise" :title="$t ('rotating.counterclockwise')">
        <i class="fas fa-arrow-rotate-left"></i>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  flex: 1 0 auto;
  background: linear-gradient(to bottom, rgb(229, 255, 229), rgb(250, 247, 234)) no-repeat center;
  h1 {font-size: 2.5rem;margin: 0.7rem auto;color: black;}
  .scene-container {
    max-height: 70vh;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rotation-controls {
    position: absolute;
    top: 50%;
    right: 40px; /* Размещение кнопок справа */
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;

    button {
      color: white;
      border: none;
      padding: 15px;
      margin-bottom: 14px;
      cursor: pointer;
      font-size: 24px;
      border-radius: 5px;
      background-color: #87ceeb;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      transition: ease-in-out, background-color .2s, box-shadow .2s;

      &:hover {
        background-color: #00bfff; /* Более яркий цвет при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      }
    }
  }
}

@media(max-width: 1020px) {
  .container {
    h1 {font-size: 2.3rem;margin: 0.6rem auto;}
    .rotation-controls {
      right: 22px; /* Размещение кнопок справа */
      button {
        padding: 13px;
        margin-bottom: 10px;
        font-size: 22px;
      }
    }
  }
}

@media (max-width: 768px) {
  .container {
    h1 {font-size: 2rem;margin: 0.5rem auto;}

    .rotation-controls {
      right: 20px; /* Размещение кнопок справа */
      button {
        padding: 10px;
        margin-bottom: 10px;
        font-size: 18px;
      }
    }
  }
}
</style>
