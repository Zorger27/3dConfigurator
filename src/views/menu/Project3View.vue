<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
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
    let isRotatingClockwise = true;
    let isRotatingCounterClockwise = false;
    // Первоначальный цвет модели
    const initialColor = 0x87ceeb;

    const applyMaterialSettings = (material, color) => {
      material.color.set(color); // Устанавливаем заданный цвет
      material.color.multiplyScalar(3); // Увеличиваем яркость на 50%
      material.roughness = 0.1; // Снижаем шероховатость
      material.metalness = 0.5; // Добавляем металлический эффект
      material.needsUpdate = true; // Обновляем материал после изменений
    };

    const init = () => {
      // Создаем сцену
      scene = new THREE.Scene();

      // Создаем камеру
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 3;

      // Создаем рендерер
      renderer = new THREE.WebGLRenderer({ alpha: true });
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

          const applyColorToModel = (model, color) => {
            model.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                if (Array.isArray(child.material)) {
                  // Если у объекта несколько материалов, применяем настройки ко всем
                  child.material.forEach((material) => {
                    if (material instanceof THREE.MeshStandardMaterial) {
                      applyMaterialSettings(material, color);
                    }
                  });
                } else if (child.material instanceof THREE.MeshStandardMaterial) {
                  // Если у объекта один материал
                  applyMaterialSettings(child.material, color);
                }
              }
            });
          };

          // Применяем начальный цвет
          applyColorToModel(horseModel, initialColor);


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

    // Функция для изменения цвета модели
    const changeColor = (color) => {
      if (horseModel) {
        horseModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                applyMaterialSettings(material, color); // Применяем настройки к каждому материалу
              }
            });
          }
        });
      }
    };

    // Функция для изменения цвета через палитру
    const changeColorFromPicker = (event) => {
      const color = event.target.value;
      changeColor(new THREE.Color(color)); // Преобразуем цвет из hex
    };

    // Функция для сброса к первоначальному цвету
    const resetColor = () => {
      changeColor(initialColor); // Возвращаемся к исходному светло-голубому цвету
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
      changeColor, // Возвращаем функцию для использования в шаблоне
      changeColorFromPicker, // Добавляем функцию для цветовой палитры
      resetColor // Добавляем функцию сброса цвета
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
    <!-- Кнопки выбора цвета -->
    <div class="color-controls">
      <button @click="changeColor(0xff0000)" :title="$t ('changeColor.red')" class="color-button" style="background-color: #ff0000;"></button>
      <button @click="changeColor(0x00ff00)" :title="$t ('changeColor.green')" class="color-button" style="background-color: #00ff00;"></button>
      <button @click="changeColor(0x0000ff)" :title="$t ('changeColor.blue')" class="color-button" style="background-color: #0000ff;"></button>
      <button @click="changeColor(0xffffff)" :title="$t ('changeColor.white')" class="color-button" style="background-color: #ffffff;"></button>
      <button @click="changeColor(0xffd700)" :title="$t ('changeColor.golden')" class="color-button" style="background-color: #ffd700;"></button>
      <!-- Цветовая палитра -->
      <input type="color" @input="changeColorFromPicker" :title="$t ('changeColor.picker')" class="color-picker"/>
      <!-- Кнопка сброса к первоначальным настройкам -->
      <button @click="resetColor" :title="$t ('changeColor.reset')" class="color-button reset-button">
        <i class="fas fa-reply"></i> <!-- Иконка для сброса -->
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
      //box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: ease-in-out, background-color .2s, box-shadow .2s;

      &:hover {
        background-color: #00bfff; /* Более яркий цвет при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .color-controls {
    position: absolute;
    left: 40px; /* Размещение кнопок слева */
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;

    .color-button {
      width: 50px;
      height: 50px;
      border: 1px solid #ccc;
      margin-bottom: 14px;
      cursor: pointer;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: background-color 0.2s, box-shadow 0.2s;

      &:hover {box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);}
    }
    .color-picker {
      width: 50px;
      height: 50px;
      padding: 0;
      margin-bottom: 14px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: box-shadow 0.2s;

      &:hover {box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);}
    }
    .reset-button {
      background-color: #f0f0f0;
      border: 1px solid #ccc;

      &:hover {background-color: #e0e0e0;}
      .fas {font-size: 24px;}
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
    .color-controls {
      left: 22px; /* Размещение кнопок слева */
      top: 60%;
      .color-button {
        width: 45px;
        height: 45px;
        margin-bottom: 10px;
      }
      .color-picker {
        width: 45px;
        height: 45px;
        margin-bottom: 10px;
      }
      .reset-button {
        .fas {font-size: 22px;}
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
    .color-controls {
      left: 20px; /* Размещение кнопок слева */
      top: 60%;
      .color-button {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
      .color-picker {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
      }
      .reset-button {
        .fas {font-size: 18px;}
      }
    }
  }
}
</style>
