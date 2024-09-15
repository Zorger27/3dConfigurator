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
    let isRotatingClockwise = true;
    let isRotatingCounterClockwise = false;

    // Определение текстур
    const textures = {
      texture1: '/assets/textures/texture1.webp',
      texture2: '/assets/textures/texture2.webp',
      texture3: '/assets/textures/texture3.webp',
      texture4: '/assets/textures/texture4.webp',
      texture5: '/assets/textures/texture5.webp'
    };

    const textureLoader = new TextureLoader();

    // Начальные настройки для сброса модели
    const initialSettings = {
      texture: '/assets/textures/texture0.webp', // Путь к начальной текстуре
      color: new THREE.Color(0xffffff), // Используем THREE.Color для работы с цветом
      roughness: 0.1, // Начальная шероховатость
      metalness: 0.5, // Начальный металлический эффект
    };

    // Метод для загрузки текстуры с диска
    const uploadTexture = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        const newTexture = textureLoader.load(imageUrl);

        // Применение загруженной текстуры к модели
        vaseModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                material.map = newTexture; // Заменяем текстуру на загруженную
                material.needsUpdate = true; // Обновляем материал
              }
            });
          }
        });
      };

      reader.readAsDataURL(file); // Чтение файла как URL изображения
    };

    // Функция для сброса модели к первоначальным настройкам
    const resetModelSettings = () => {
      textureLoader.load(initialSettings.texture, (loadedTexture) => {
        vaseModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((material) => {
              if (material instanceof THREE.MeshStandardMaterial) {
                // Сбрасываем флаг применения яркости
                material.userData.isBrightnessApplied = false;

                // Применяем начальную текстуру
                material.map = loadedTexture;

                // Применяем начальный цвет с увеличением яркости
                const brightenedColor = initialSettings.color.clone();
                brightenedColor.multiplyScalar(3); // Увеличиваем яркость цвета в 4 раза

                // Устанавливаем начальный цвет, шероховатость и металлический эффект
                material.color = brightenedColor;
                material.roughness = initialSettings.roughness;
                material.metalness = initialSettings.metalness;

                material.needsUpdate = true; // Обновляем материал
              }
            });
          }
        });
      });
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

      // Создаем группу для наклона
      const sceneGroup = new THREE.Group();
      scene.add(sceneGroup);
      scene.add(camera);

      // Используем GLTFLoader для загрузки модели
      const loader = new GLTFLoader();
      loader.load(
        '/assets/models/02_Ceramic_vase.glb', // Замените на реальный путь к вашей модели
        (gltf) => {
          // После загрузки модели добавляем её в сцену
          vaseModel = gltf.scene;
          vaseModel.scale.set(6, 6, 6); // Настраиваем масштаб модели

          // Загружаем начальную текстуру и применяем её
          textureLoader.load(initialSettings.texture, (loadedTexture) => {
              vaseModel.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                  const materials = Array.isArray(child.material) ? child.material : [child.material];
                  materials.forEach((material) => {
                    if (material instanceof THREE.MeshStandardMaterial) {
                      // Увеличиваем яркость цвета
                      const brightenedColor = initialSettings.color.clone();
                      brightenedColor.multiplyScalar(3); // Увеличиваем яркость цвета в 4 раза

                      // Применяем начальные настройки
                      material.map = loadedTexture; // Устанавливаем текстуру
                      material.color = brightenedColor; // Устанавливаем яркий цвет
                      material.roughness = initialSettings.roughness; // Устанавливаем шероховатость
                      material.metalness = initialSettings.metalness; // Устанавливаем металлический эффект
                      material.needsUpdate = true; // Обновляем материал
                    }
                  });
                }
              })
          });

          // Определяем границы модели (bounding box)
          const boundingBox = new THREE.Box3().setFromObject(vaseModel);
          const height = boundingBox.max.y - boundingBox.min.y;

          // Сдвигаем модель вниз
          vaseModel.position.y = -height / 2;

          // Добавляем модель в сцену
          sceneGroup.add(vaseModel);
        },
        undefined,
        (error) => {
          console.error('An error happened while loading the model', error);
        }
      );

      // Добавляем освещение
      // Окружающий свет (освещает всю сцену равномерно)
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Светлый белый свет с интенсивностью 0.6
      scene.add(ambientLight);

      // Направленный свет (как солнечный свет)
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Направленный свет с интенсивностью 1
      directionalLight.position.set(5, 10, 5); // Позиционируем его выше и сбоку
      scene.add(directionalLight);

      // Добавляем рендерер в контейнер
      canvasContainer.value.appendChild(renderer.domElement);

      // Устанавливаем наклон сцены
      const sceneRotationAngle = 30; // Угол наклона в градусах
      sceneGroup.rotation.x = THREE.MathUtils.degToRad(sceneRotationAngle);

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

    const changeTexture = (textureKey) => {
      if (vaseModel) {
        textureLoader.load(textures[textureKey], (loadedTexture) => {
          vaseModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              const applyBrightness = (material) => {
                // Проверяем, если яркость уже была применена
                const isBrightnessApplied = material.userData.isBrightnessApplied || false;
                const newColor = material.color.clone(); // Клонируем цвет, чтобы не менять оригинал

                if (!isBrightnessApplied) {
                  // Применяем увеличение яркости только один раз
                  newColor.multiplyScalar(1.5); // Увеличиваем яркость
                }

                // Создаем новый материал с текстурой и цветом
                const newMaterial = new THREE.MeshStandardMaterial({
                  map: loadedTexture,
                  color: newColor,
                  roughness: 0.1,
                  metalness: 0.5,
                });

                // Устанавливаем флаг, чтобы не применять яркость повторно
                newMaterial.userData.isBrightnessApplied = true;

                return newMaterial;
              };

              // Если у меша несколько материалов
              if (Array.isArray(child.material)) {
                child.material = child.material.map((material) => {
                  if (material instanceof THREE.MeshStandardMaterial) {
                    return applyBrightness(material);
                  }
                  return material;
                });
              } else if (child.material instanceof THREE.MeshStandardMaterial) {
                // Если один материал
                child.material = applyBrightness(child.material);
              }

              child.material.needsUpdate = true; // Обновляем материал
            }
          });
        });
      }
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
      resetModelSettings, // Возвращаем функцию для сброса модели
      rotateClockwise,
      rotateCounterClockwise,
      stopRotation,
      changeTexture,
    };
  },
}
</script>

<template>
  <div class="container">
    <h1>{{ $t('project2.name') }} <CanvasFullScreen :canvasContainer="canvasContainer"></CanvasFullScreen> <ToggleFullScreen></ToggleFullScreen></h1>
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
    <!-- Кнопки управления текстурами -->
    <div class="texture-controls">
      <img src="/assets/textures/texture1.webp" alt="texture1" @click="changeTexture('texture1')" class="button" :title="$t('texture.texture1')">
      <img src="/assets/textures/texture2.webp" alt="texture2" @click="changeTexture('texture2')" class="button" :title="$t('texture.texture2')">
      <img src="/assets/textures/texture3.webp" alt="texture3" @click="changeTexture('texture3')" class="button" :title="$t('texture.texture3')">
      <img src="/assets/textures/texture4.webp" alt="texture4" @click="changeTexture('texture4')" class="button" :title="$t('texture.texture4')">
      <img src="/assets/textures/texture5.webp" alt="texture5" @click="changeTexture('texture5')" class="button" :title="$t('texture.texture5')">
      <!-- Кнопка для загрузки текстуры с диска -->
      <input type="file" @change="uploadTexture" id="file-input" class="file-input">
      <label for="file-input" class="button upload" :title="$t('texture.upload')">
        <i class="fa-solid fa-upload"></i>
      </label>
      <!-- Кнопка сброса к первоначальным настройкам -->
      <button @click="resetModelSettings" class="button reset" :title="$t('changeColor.reset')">
        <i class="fas fa-reply"></i>
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
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.7);
      transition: ease-in-out, background-color .2s, box-shadow .2s;

      &:hover {
        background-color: #00bfff; /* Более яркий цвет при наведении */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .texture-controls {
    position: absolute;
    left: 40px; /* Размещение кнопок слева */
    top: 50%;
    transform: translateY(-50%);
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
    .texture-controls {
      left: 22px; /* Размещение кнопок слева */
      top: 60%;

      .button {
        width: 45px;
        height: 45px;
        margin-bottom: 10px;
        .fa-solid,.fa-brands,.fas {font-size: 22px;}
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
    .texture-controls {
      left: 20px; /* Размещение кнопок слева */
      top: 60%;

      .button {
        width: 40px;
        height: 40px;
        margin-bottom: 10px;
        .fa-solid,.fa-brands,.fas {font-size: 18px;}
      }
    }
  }
}
</style>
