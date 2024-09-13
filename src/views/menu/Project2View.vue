<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {TextureLoader} from "three";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import {openGraphMixin} from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'Project2',
  mixins: [openGraphMixin],
  components: {CanvasFullScreen, ToggleFullScreen},
  mounted() {
    const mainTitle = '3D Configurators - Project № 2';
    const title = '3D Configurators - Project № 2';
    const metaDescription = '3D Configurators';
    const description = '3D Configurators - Project № 2';
    const imageUrl = 'https://3d-configurator-max.vercel.app/assets/ogimage/bmp/project2.jpg';
    const url = 'https://3d-configurator-max.vercel.app/project2';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },

  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, vaseModel;
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
      renderer.setSize(window.innerWidth, window.innerHeight);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      scene.add(camera);

      // Используем GLTFLoader для загрузки модели
      const loader = new GLTFLoader();
      loader.load(
        '/assets/models/02_Ceramic_vase.glb', // Замените на реальный путь к вашей модели
        (gltf) => {
          // После загрузки модели добавляем её в сцену
          vaseModel = gltf.scene;
          vaseModel.scale.set(6, 6, 6); // Настраиваем масштаб модели

          // Загружаем текстуру
          const textureLoader = new TextureLoader();
          const vaseTexture = textureLoader.load('/assets/img/cube3/cube3-11.webp'); // Путь к текстуре

          vaseModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              if (Array.isArray(child.material)) {
                // Если у объекта несколько материалов
                child.material.forEach((material) => {
                  if (material instanceof THREE.MeshStandardMaterial) {
                    material.map = vaseTexture; // Применяем текстуру к материалу
                    material.needsUpdate = true; // Обновляем материал после изменений
                    material.color.multiplyScalar(5); // Увеличиваем яркость на 50%
                    material.roughness = 0.1; // Снижаем шероховатость
                    material.metalness = 0.5; // Добавляем металлический эффект
                  }
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                // Если один материал
                child.material.map = vaseTexture; // Применяем текстуру к материалу
                child.material.needsUpdate = true; // Обновляем материал после изменений
                child.material.color.multiplyScalar(5); // Увеличиваем яркость на 50%
                child.material.roughness = 0.1; // Снижаем шероховатость
                child.material.metalness = 0.5; // Добавляем металлический эффект
              }
            }
          });

          // Определяем границы модели (bounding box)
          const boundingBox = new THREE.Box3().setFromObject(vaseModel);
          const height = boundingBox.max.y - boundingBox.min.y;

          // Сдвигаем модель вниз
          vaseModel.position.y = -height / 2;

          scene.add(vaseModel);
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the model', error);
        }
      );

      // Добавляем освещение
      // Направленный свет (как солнечный свет)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Направленный свет с интенсивностью 1
      directionalLight.position.set(5, 10, 5); // Позиционируем его выше и сбоку
      scene.add(directionalLight);

      // Добавляем рендерер в контейнер
      canvasContainer.value.appendChild(renderer.domElement);

      // Обновляем сцену
      const animate = () => {
        requestAnimationFrame(animate);

        // Вращение модели по кнопкам
        if (vaseModel) {
          if (isRotatingClockwise) {
            vaseModel.rotation.y += 0.03; // Вращение по часовой стрелке
          } else if (isRotatingCounterClockwise) {
            vaseModel.rotation.y -= 0.03; // Вращение против часовой стрелки
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
      stopRotation,
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
      top: 60%;
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
      top: 60%;
      button {
        padding: 10px;
        margin-bottom: 10px;
        font-size: 18px;
      }
    }
  }
}
</style>
