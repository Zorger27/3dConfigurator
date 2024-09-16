<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader } from "three";
import CanvasFullScreen from "@/components/util/CanvasFullScreen.vue";
import ToggleFullScreen from "@/components/util/ToggleFullScreen.vue";
import { openGraphMixin } from "@/assets/ogimage/openGraphMixin";

export default {
  name: 'Project1',
  mixins: [openGraphMixin],
  components: {CanvasFullScreen, ToggleFullScreen},
  mounted() {
    const mainTitle = '3D Configurators - Project № 1';
    const title = '3D Configurators - Project № 1';
    const metaDescription = '3D Configurators';
    const description = '3D Configurators - Project № 1';
    const imageUrl = 'https://3d-configurator-max.vercel.app/assets/ogimage/bmp/project1.jpg';
    const url = 'https://3d-configurator-max.vercel.app';

    this.setOpenGraphTags(metaDescription, title, description, imageUrl, url);
    this.setPageTitle(mainTitle);
  },
  setup() {
    const canvasContainer = ref(null);
    let scene, camera, renderer, model;
    let isRotatingClockwise = true;
    let isRotatingCounterClockwise = false;

    // Флаг для смешивания текстур и цветов
    const isMixingEnabled = ref(false);

// Определение текстур
    const textures = {
      texture1: '/assets/textures/texture3.webp',
      texture2: '/assets/textures/texture4.webp',
    };

    const textureLoader = new TextureLoader();

    // Начальные настройки для модели
    const initialSettings = {
      texture: '/assets/textures/texture0.webp', // Путь к начальной текстуре
      color: new THREE.Color(0xffffff), // Начальный цвет
      roughness: 0.1,
      metalness: 0.5
    };

    const applyMaterialSettings = (material, color, map = null) => {
      material.color.set(color); // Устанавливаем цвет
      if (map) {
        material.map = map; // Устанавливаем текстуру, если она передана
      } else {
        material.map = null; // Если текстура не передана, убираем её, оставляем только цвет
      }

      // Применяем яркость только если она еще не была применена
      if (!material.userData.isBrightnessApplied) {
        material.color.multiplyScalar(4.5); // Увеличиваем яркость только один раз
        material.userData.isBrightnessApplied = true; // Помечаем, что яркость уже применялась
      }
      material.roughness = initialSettings.roughness;
      material.metalness = initialSettings.metalness;
      material.needsUpdate = true;
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

      // Добавляем освещение
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 10, 5);
      scene.add(directionalLight);

      // Используем GLTFLoader для загрузки модели
      const loader = new GLTFLoader();
      loader.load(
        '/assets/models/03_Brass_goblets.glb', // Замените на реальный путь к вашей модели
        (gltf) => {
          // После загрузки модели добавляем её в сцену
          model = gltf.scene;
          model.scale.set(4, 4, 4); // Настраиваем масштаб модели

          // Применяем начальные настройки текстуры и цвета
          textureLoader.load(initialSettings.texture, (loadedTexture) => {
            model.traverse((child) => {
              if (child instanceof THREE.Mesh) {
                const materials = Array.isArray(child.material) ? child.material : [child.material];
                materials.forEach((material) => {
                  if (material instanceof THREE.MeshStandardMaterial) {
                    // Сбрасываем яркость при первой загрузке
                    material.userData.isBrightnessApplied = false;
                    applyMaterialSettings(material, initialSettings.color, loadedTexture);
                  }
                });
              }
            });
          });

          // Определяем границы модели (bounding box)
          const boundingBox = new THREE.Box3().setFromObject(model);
          const height = boundingBox.max.y - boundingBox.min.y;

          // Сдвигаем модель вниз
          model.position.y = -height / 2;

          scene.add(model);
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the model', error);
        }
      );

      // Добавляем рендерер в контейнер
      canvasContainer.value.appendChild(renderer.domElement);

      // Обновляем сцену
      const animate = () => {
        requestAnimationFrame(animate);

        // Вращение модели по кнопкам
        if (model) {
          if (isRotatingClockwise) {
            model.rotation.y += 0.03; // Вращение по часовой стрелке
          } else if (isRotatingCounterClockwise) {
            model.rotation.y -= 0.03; // Вращение против часовой стрелки
          }
        }

        // Обновление контроллеров для вращения сцены
        controls.update();
        renderer.render(scene, camera);
      };

      animate();
    };

    // Функция для изменения цвета без текстуры
    const changeColor = (colorHex) => {
      if (model) {
        const color = new THREE.Color(colorHex); // Создаем цвет
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.userData.isBrightnessApplied = false;
                applyMaterialSettings(material, color, isMixingEnabled.value ? material.map : null); // Применяем цвет, в зависимости от флага смешивания
              }
            });
          }
        });
      }
    };

    // Функция для изменения текстуры
    const changeTexture = (textureKey) => {
      if (model) {
        textureLoader.load(textures[textureKey], (loadedTexture) => {
          model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((material) => {
                if (material instanceof THREE.MeshStandardMaterial) {
                  if (!isMixingEnabled.value){
                    material.userData.isBrightnessApplied = false;
                  }
                  // Применяем текстуру и увеличиваем яркость, если это нужно
                  applyMaterialSettings(material, isMixingEnabled.value ? material.color : initialSettings.color, loadedTexture);
                }
              });
            }
          });
        });
      }
    };

    // Функция для изменения состояния смешивания
    const toggleMixing = () => {
      isMixingEnabled.value = !isMixingEnabled.value;
    };

    // Функция для загрузки текстуры с диска
    const uploadTexture = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        const newTexture = textureLoader.load(imageUrl);

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                // Убедимся, что яркость применяется правильно при загрузке текстуры с диска
                applyMaterialSettings(material, material.color, newTexture);
              }
            });
          }
        });
      };

      reader.readAsDataURL(file);
    };

    // Функция для изменения цвета через палитру
    const changeColorFromPicker = (event) => {
      const color = event.target.value;
      changeColor(new THREE.Color(color)); // Преобразуем цвет из hex
    };

    // Функция сброса настроек модели (текстура и цвет)
    const resetModelSettings = () => {
      textureLoader.load(initialSettings.texture, (loadedTexture) => {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.userData.isBrightnessApplied = false;
                applyMaterialSettings(material, initialSettings.color, loadedTexture); // Сброс текстуры и цвета
              }
            });
          }
        });
      });
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
      uploadTexture,
      changeColor,
      changeColorFromPicker,
      changeTexture,
      toggleMixing, // Возвращаем функцию для переключения смешивания
      isMixingEnabled, // Возвращаем состояние смешивания
      resetModelSettings,
      rotateClockwise,
      rotateCounterClockwise,
      stopRotation,
    };
  },
}
</script>

<template>
  <div class="container">
    <h1>{{ $t('project1.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
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

      <!-- Кнопка для включения/отключения смешивания -->
<!--      <button @click="toggleMixing" :title="isMixingEnabled ? $t('rotating.mixYes') : $t('rotating.mixNo')" style="margin-top: 10px;" :class="{'active': isMixingEnabled}">-->
      <button @click="toggleMixing" :title="isMixingEnabled ? $t('rotating.mixYes') : $t('rotating.mixNo')" style="margin-top: 10px; background-color: palevioletred;">
        <i :class="isMixingEnabled ? 'fas fa-sliders-h' : 'fas fa-gem'"></i>
      </button>

    </div>
    <div class="model-controls">
      <!-- Кнопки выбора цвета -->
      <div class="color-controls">
        <button @click="changeColor(0xff0000)" :title="$t ('changeColor.red')" class="color-button" style="background-color: #ff0000;"></button>
        <button @click="changeColor(0x0000ff)" :title="$t ('changeColor.blue')" class="color-button" style="background-color: #0000ff;"></button>
        <input type="color" @input="changeColorFromPicker" :title="$t ('changeColor.picker')" class="color-button color-picker"/>
      </div>
      <!-- Кнопки управления текстурами -->
      <div class="texture-controls">
        <img src="/assets/textures/texture3.webp" alt="texture3" @click="changeTexture('texture1')" class="button" :title="$t('texture.texture1')">
        <img src="/assets/textures/texture4.webp" alt="texture4" @click="changeTexture('texture2')" class="button" :title="$t('texture.texture2')">
        <!-- Кнопка для загрузки текстуры с диска -->
        <input type="file" @change="uploadTexture" id="file-input" class="file-input">
        <label for="file-input" class="button upload" :title="$t('texture.upload')">
          <i class="fa-solid fa-upload"></i>
        </label>
        <!-- Кнопка сброса -->
        <button @click="resetModelSettings" class="button reset" :title="$t('changeColor.reset')">
          <i class="fas fa-reply"></i>
        </button>
      </div>
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
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: ease-in-out, background-color .2s, box-shadow .2s;

      &:hover {
        background-color: #00bfff; /* Более яркий цвет при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
    //.active {
    //  background-color: darkgreen;
    //  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.9);
    //  transition: ease-in-out, background-color .2s, box-shadow .2s;
    //
    //  &:hover {
    //    background-color: mediumseagreen;
    //    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    //    i {color: lightgoldenrodyellow;}
    //  }
    //}
  }
  .model-controls {
    position: absolute;
    left: 40px; /* Размещение кнопок слева */
    top: 50%;
    transform: translateY(-50%);

    .color-controls {
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
        padding: 0;
        border-radius: 5px;
      }
      .reset-button {
        background-color: #f0f0f0;
        border: 1px solid #ccc;

        &:hover {background-color: #e0e0e0;}
        .fas {font-size: 24px;}
      }
    }

    .texture-controls {
      display: flex;
      flex-direction: column;
      .button {
        width: 50px;
        height: 50px;
        margin-bottom: 14px;
        cursor: pointer;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
        transition: background-color 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden; /* Скрываем части изображения, выходящие за границы контейнера */

        .fa-solid, .fa-brands, .fas { font-size: 24px; }

        &:hover { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }

        img {
          width: 100%; /* Ширина изображения соответствует ширине контейнера */
          height: 100%; /* Высота изображения соответствует высоте контейнера */
          object-fit: cover; /* Сохраняет пропорции изображения и заполняет контейнер */
          display: block; /* Убирает нижний отступ у изображений */
        }
      }

      .upload {
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 14px;
        background-color: pink;
        border: 1px solid #ccc;

        &:hover {background-color: deeppink;}
      }

      .reset {
        color: black;
        background-color: #f0f0f0;
        border: 1px solid #ccc;

        &:hover {background-color: #e0e0e0;}
      }

      /* Скрываем оригинальный input */
      .file-input {display: none;}
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
    .model-controls {
      left: 22px; /* Размещение кнопок слева */
      top: 60%;
      .color-controls {
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

      .texture-controls {
        .button {
          width: 45px;
          height: 45px;
          margin-bottom: 10px;
          .fa-solid,.fa-brands,.fas {font-size: 22px;}
        }
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

    .model-controls {
      left: 20px; /* Размещение кнопок слева */
      top: 60%;
      .color-controls {
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

      .texture-controls {
        .button {
          width: 40px;
          height: 40px;
          margin-bottom: 10px;
          .fa-solid,.fa-brands,.fas {font-size: 18px;}
        }
      }
    }
  }
}
</style>
